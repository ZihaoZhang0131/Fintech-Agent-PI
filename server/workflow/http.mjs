import { createHash, randomUUID } from "node:crypto";
import {
  createWorkflowStore,
  newRun,
  fail,
  validatePlan,
  terminal,
} from "./store.mjs";
import { createWorkflowEngine } from "./engine.mjs";
import {
  createWorkflowRunners,
  runtimeSkills,
  DEFAULT_PLANNER_PROMPT,
} from "./runner.mjs";
import { resolveProjectAgentConfig } from "../agent/agent-registry.ts";
import { parseModelReference } from "../model-runtime.ts";
import { resolveConfiguredModel } from "../model-providers.mjs";
import { redactTraceText } from "../trace-redaction.mjs";
function safeAsset(value) {
  if (typeof value === "string")
    return redactTraceText(value, { maxBytes: 1_000_000 }).replace(
      /(?:\/Users\/|\/home\/|\/tmp\/|\/Volumes\/)[^"\s]+/g,
      "<local-path>",
    );
  if (Array.isArray(value)) return value.map(safeAsset);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value)
        .filter(
          ([key]) => !/^(api.?key|access.?token|secret|password)$/i.test(key),
        )
        .map(([key, item]) => [key, safeAsset(item)]),
    );
  return value;
}
function publicRun(r, full = false) {
  return {
    ...r,
    operations: full ? r.operations : [],
    pendingApprovals: r.operations
      .filter((o) => o.status === "pending_approval")
      .map((o) => ({
        commandId: o.commandId,
        nodeId: r.attempts.find((a) => a.id === o.attemptId)?.nodeId,
      })),
    attempts: r.attempts.map((a) =>
      full
        ? a
        : {
            ...a,
            input: undefined,
            result: a.result ? { ...a.result, text: "" } : undefined,
          },
    ),
  };
}
export function createWorkflowHttp({
  dataDirectory,
  skillStore,
  traceStore,
  localDatabase,
  commandManager,
  findWorkspace,
  readJsonBody,
  sendJson,
  runners,
  verifyModel = (ref) =>
    resolveConfiguredModel(dataDirectory, ref.providerId, ref.modelId),
}) {
  const store = createWorkflowStore(dataDirectory);
  const engine = createWorkflowEngine({
    store,
    ...(runners ??
      createWorkflowRunners({
        skillStore,
        traceStore,
        getWorkspacePath: (id) => findWorkspace(id)?.path,
        localDatabase,
        commandManager,
      })),
    validateWorkspace: findWorkspace,
  });
  const inFlight = new Map();
  async function idempotent(payload, scope, fn) {
    if (
      typeof payload.requestId !== "string" ||
      !/^[a-zA-Z0-9_-]{8,100}$/.test(payload.requestId)
    )
      throw fail("缺少有效 requestId。");
    const key = `${scope}:${payload.requestId}`,
      fingerprint = createHash("sha256")
        .update(JSON.stringify(payload))
        .digest("hex");
    const cached = store.lookup(key, fingerprint);
    if (cached) return cached;
    if (inFlight.has(key)) {
      const current = inFlight.get(key);
      if (current.fingerprint !== fingerprint)
        throw fail("请求 ID 已用于不同操作。", 409);
      return current.promise;
    }
    const promise = Promise.resolve()
      .then(fn)
      .then((commit) =>
        store.transaction(() => {
          const result = commit();
          return store.remember(key, fingerprint, result);
        }),
      )
      .finally(() => inFlight.delete(key));
    inFlight.set(key, { fingerprint, promise });
    return promise;
  }
  async function create(payload) {
    const workspace = await findWorkspace(payload.workspaceId);
    if (
      typeof payload.input !== "string" ||
      !payload.input.trim() ||
      payload.input.length > 20000
    )
      throw fail("请输入不超过 20000 字符的任务。");
    const registry = await runtimeSkills(skillStore);
    const config = resolveProjectAgentConfig(
      payload.agentConfig,
      undefined,
      registry.list().map((s) => s.name),
    );
    for (const requested of payload.agentConfig?.customSubAgents ?? [])
      if (requested.enabled)
        for (const skill of requested.enabledSkills ?? [])
          if (!registry.get(skill)) throw fail(`Skill 已不可用：${skill}`);
    const agents = config.customSubAgents.filter((a) => a.enabled);
    if (!agents.length)
      throw fail("请先在 Subagent 页面创建并启用至少一个 Agent。");
    const model = parseModelReference(payload.model) ?? config.mainModel;
    if (!model) throw fail("请选择可用模型。");
    const plannerModel = parseModelReference(payload.plannerModel) ?? model;
    for (const ref of [
      model,
      plannerModel,
      ...agents.map((a) => a.model).filter(Boolean),
    ])
      await verifyModel(ref);
    const limits = {
      maxNodes: 12,
      maxRevisions: 5,
      maxAttempts: 3,
      timeoutMs: 300000,
      concurrency: 2,
    };
    const bounds = {
      maxNodes: [1, 50],
      maxRevisions: [0, 20],
      maxAttempts: [1, 10],
      timeoutMs: [1000, 1800000],
      concurrency: [1, 4],
    };
    for (const [key, [min, max]] of Object.entries(bounds))
      if (payload.limits?.[key] !== undefined) {
        const n = payload.limits[key];
        if (!Number.isInteger(n) || n < min || n > max)
          throw fail("运行限制无效。");
        limits[key] = n;
      }
    const parameters = payload.parameters ?? {};
    if (
      typeof parameters !== "object" ||
      Array.isArray(parameters) ||
      Object.keys(parameters).length > 30 ||
      Object.values(parameters).some(
        (v) => typeof v !== "string" || v.length > 8000,
      )
    )
      throw fail("参数格式无效。");
    const run = newRun({
      workspaceId: workspace.id,
      workspaceName: workspace.name,
      input: payload.input.trim(),
      config,
      model,
      plannerModel,
      plannerPrompt:
        typeof payload.plannerPrompt === "string"
          ? payload.plannerPrompt.slice(0, 12000)
          : DEFAULT_PLANNER_PROMPT,
      mode: payload.mode === "fixed" ? "fixed" : "adaptive",
      parameters,
      limits,
      bashApprovalMode: payload.bashApprovalMode === "ask" ? "ask" : "auto",
      bashPermissionMode:
        payload.bashPermissionMode === "full" ? "full" : "sandbox",
      requestId: payload.requestId,
      conversationId: payload.conversationId,
    });
    if (payload.templateId) {
      const template = store.template(payload.templateId);
      const version =
        template.versions.find((v) => v.version === payload.templateVersion) ??
        template.versions.at(-1);
      const mapping = payload.mapping ?? {};
      if (
        !version ||
        (payload.templateVersion !== undefined &&
          version.version !== payload.templateVersion)
      )
        throw fail("模板版本不存在。");
      for (const role of version.roles) {
        const id =
          mapping[role.id] ??
          (template.sourceWorkspaceId === workspace.id ? role.id : undefined);
        if (!agents.some((a) => a.id === id))
          throw fail(`请为“${role.label}”明确映射目标项目 Subagent。`);
        const target = agents.find((a) => a.id === id);
        for (const key of ["enabledTools", "enabledSkills", "enabledMcps"]) {
          const missing = role[key].filter(
            (name) => !target[key].includes(name),
          );
          if (missing.length)
            throw fail(
              `“${target.label}”缺少模板能力：${missing.join("、")}。请配置能力或重新映射。`,
            );
        }
        mapping[role.id] = id;
      }
      const substitute = (text) =>
        text.replace(/\{\{([a-zA-Z0-9_\u4e00-\u9fff-]+)\}\}/g, (_m, key) => {
          if (!(key in parameters)) throw fail(`缺少参数：${key}`);
          return parameters[key];
        });
      const plan = {
        ...version.plan,
        nodes: version.plan.nodes.map((n) => ({
          ...n,
          agentId: mapping[n.agentId],
          task: substitute(n.task),
          acceptance: substitute(n.acceptance),
        })),
      };
      engine.applyPlan(run, plan, "从模板创建", false);
      run.templateId = template.id;
      run.templateVersion = version.version;
    }
    if (run.conversationId) {
      const c = store.conversation(run.conversationId);
      if (c.workspaceId !== workspace.id) throw fail("对话与项目不匹配。", 409);
      const historyRuns = c.runIds.map((id) => store.get(id));
      run.historyRunIds = historyRuns.map((r) => r.id);
      run.history = store
        .messages(c.id)
        .filter((m) => m.kind !== "plan" && m.kind !== "status")
        .slice(-12)
        .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));
    }
    return () => {
      if (run.conversationId) {
        const c = store.conversation(run.conversationId);
        if (c.runIds.some((id) => !terminal.has(store.get(id).status)))
          throw fail("当前对话已有运行，请刷新后发送补充要求。", 409);
      }
      store.save(run, "created");
      engine.kick();
      return { id: run.id };
    };
  }
  async function handle(request, response, url, segments) {
    if (segments[0] !== "workflows") return false;
    const method = request.method;
    if (segments[1] === "conversations") {
      const id = segments[2];
      if (!id && method === "GET") {
        sendJson(response, 200, {
          conversations: store.conversations(
            url.searchParams.get("workspaceId"),
          ),
        });
        return true;
      }
      if (!id && method === "POST") {
        const p = await readJsonBody(request);
        sendJson(
          response,
          201,
          await idempotent(p, "conversation", async () => {
            await findWorkspace(p.workspaceId);
            return () => store.createConversation(p.workspaceId);
          }),
        );
        return true;
      }
      if (id && segments.length === 3 && method === "GET") {
        const c = store.conversation(id);
        sendJson(response, 200, {
          conversation: c,
          messages: store.messages(id),
          runs: c.runIds.map((id) => publicRun(store.get(id))),
        });
        return true;
      }
      if (id && segments[3] === "messages" && method === "POST") {
        const p = await readJsonBody(request);
        sendJson(
          response,
          200,
          await idempotent(p, `conversation-message:${id}`, async () => {
            if (
              typeof p.input !== "string" ||
              !p.input.trim() ||
              p.input.length > 20000
            )
              throw fail("消息为空或过长。");
            const c = store.conversation(id);
            await findWorkspace(c.workspaceId);
            const active = c.runIds
              .map((id) => store.get(id))
              .find((r) => !terminal.has(r.status));
            if (active)
              return () => {
                const latest = store.get(active.id);
                if (terminal.has(latest.status))
                  throw fail("运行刚刚结束，请重新发送。", 409);
                store.appendMessage(id, {
                  id: `message:${p.requestId}`,
                  runId: active.id,
                  role: "user",
                  kind: "text",
                  content: p.input.trim(),
                  createdAt: Date.now(),
                });
                engine.action(active.id, {
                  type: "feedback",
                  expectedVersion: latest.version,
                  text: p.input,
                });
                return { id: active.id, conversationId: id };
              };
            const commit = await create({
              ...p,
              workspaceId: c.workspaceId,
              conversationId: id,
            });
            return () => ({ ...commit(), conversationId: id });
          }),
        );
        return true;
      }
    }
    if (segments[1] === "runs") {
      const id = segments[2];
      if (!id && method === "GET") {
        sendJson(response, 200, {
          runs: store.list(url.searchParams.get("workspaceId")).map((r) => ({
            id: r.id,
            conversationId: r.conversationId ?? r.id,
            title: r.title,
            status: r.status,
            workspaceId: r.workspaceId,
            updatedAt: r.updatedAt,
            templateId: r.templateId,
          })),
        });
        return true;
      }
      if (!id && method === "POST") {
        const p = await readJsonBody(request);
        sendJson(response, 201, await idempotent(p, "create", () => create(p)));
        return true;
      }
      if (id && segments.length === 3 && method === "GET") {
        sendJson(response, 200, publicRun(store.get(id)));
        return true;
      }
      if (id && segments[3] === "attempts" && segments[4] && method === "GET") {
        const r = store.get(id),
          attempt = r.attempts.find((a) => a.id === segments[4]);
        if (!attempt) throw fail("尝试不存在。", 404);
        sendJson(response, 200, {
          attempt,
          operations: r.operations.filter((o) => o.attemptId === attempt.id),
        });
        return true;
      }
      if (id && segments[3] === "actions" && method === "POST") {
        const p = await readJsonBody(request);
        sendJson(
          response,
          200,
          await idempotent(p, `action:${id}`, () => () => ({
            run: publicRun(engine.action(id, p)),
          })),
        );
        return true;
      }
      if (id && segments[3] === "events" && method === "GET") {
        store.get(id);
        let cursor = Number(
          request.headers["last-event-id"] ??
            url.searchParams.get("after") ??
            0,
        );
        if (!Number.isSafeInteger(cursor) || cursor < 0)
          throw fail("事件游标无效。");
        response.writeHead(200, {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "X-Accel-Buffering": "no",
        });
        const emit = () => {
          try {
            for (const event of store.events(id, cursor)) {
              response.write(
                `id: ${event.seq}\ndata: ${JSON.stringify(event)}\n\n`,
              );
              cursor = event.seq;
            }
            response.write(": heartbeat\n\n");
          } catch {
            response.end();
          }
        };
        emit();
        const timer = setInterval(emit, 1000);
        response.on("close", () => clearInterval(timer));
        return true;
      }
    }
    if (segments[1] === "templates") {
      if (method === "GET") {
        sendJson(response, 200, { templates: store.templates() });
        return true;
      }
      if (method === "POST") {
        const p = await readJsonBody(request);
        const result = await idempotent(p, "template", () => () => {
          if (p.copyId) {
            const source = store.template(p.copyId);
            return store.putTemplate({
              ...source,
              id: randomUUID(),
              name: `${source.name} 副本`,
              archived: false,
            });
          }
          if (p.id && p.archived !== undefined) {
            const t = store.template(p.id);
            t.archived = p.archived === true;
            return store.putTemplate(t);
          }
          const run = store.get(p.runId),
            revision = run.revisions.find((v) => v.version === p.version);
          if (!revision) throw fail("请选择有效的计划版本。");
          if (
            typeof p.name !== "string" ||
            !p.name.trim() ||
            p.name.length > 120
          )
            throw fail("模板名称为空或过长。");
          const t = p.id
            ? store.template(p.id)
            : {
                id: randomUUID(),
                sourceWorkspaceId: run.workspaceId,
                versions: [],
                archived: false,
              };
          const plan = validatePlan(
            p.plan ?? revision.plan,
            run.config.customSubAgents.map((a) => a.id),
            run.limits.maxNodes,
          );
          const roles = run.config.customSubAgents
            .filter((a) => plan.nodes.some((n) => n.agentId === a.id))
            .map(
              ({
                id,
                label,
                description,
                enabledTools,
                enabledSkills,
                enabledMcps,
              }) => ({
                id,
                label,
                description,
                enabledTools,
                enabledSkills,
                enabledMcps,
              }),
            );
          if (
            !p.parameters ||
            typeof p.parameters !== "object" ||
            Array.isArray(p.parameters) ||
            Object.keys(p.parameters).length > 30 ||
            Object.entries(p.parameters).some(
              ([k, v]) =>
                !/^[a-zA-Z0-9_\u4e00-\u9fff-]{1,60}$/.test(k) ||
                typeof v !== "string" ||
                v.length > 8000,
            )
          ) {
            if (p.parameters !== undefined) throw fail("模板参数无效。");
          }
          const version = safeAsset({
            version: t.versions.length + 1,
            plan,
            task:
              typeof p.task === "string" ? p.task.slice(0, 20000) : run.input,
            parameters: p.parameters ?? {},
            roles,
          });
          t.name = redactTraceText(p.name.trim());
          t.description = redactTraceText(
            String(p.description ?? "").slice(0, 2000),
          );
          t.versions.push(version);
          return store.putTemplate(t);
        });
        sendJson(response, 200, result);
        return true;
      }
    }
    throw fail("Workflow 接口不存在。", 404);
  }
  return {
    handle,
    store,
    engine,
    async close() {
      await engine.close();
      store.close();
    },
  };
}
