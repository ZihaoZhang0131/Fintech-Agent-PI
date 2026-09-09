import { randomUUID } from "node:crypto";
import { fail, terminal, validatePlan } from "./store.mjs";

const equal = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const enabledAgents = (run) =>
  run.config.customSubAgents.filter((agent) => agent.enabled);
const nodeById = (plan, id) => plan?.nodes.find((node) => node.id === id);
const executionFields = [
  "agentId",
  "task",
  "dependencies",
  "acceptance",
  "requires",
  "outputs",
];

function descendants(plan, roots) {
  const affected = new Set(roots);
  let previous;
  do {
    previous = affected.size;
    for (const node of plan?.nodes ?? [])
      if (node.dependencies.some((id) => affected.has(id))) affected.add(node.id);
  } while (previous !== affected.size);
  return affected;
}

function failedAttempts(run, nodeId) {
  const revision = run.nodeRevisions?.[nodeId] ?? 1;
  return run.attempts.filter(
    (attempt) =>
      attempt.nodeId === nodeId &&
      (attempt.nodeRevision ?? 1) === revision &&
      ["failed", "blocked"].includes(attempt.status),
  ).length;
}

function plannerSignalIds(run) {
  const handled = run.plannerHandledAttempts ?? {};
  return (run.plan?.nodes ?? []).flatMap((node) => {
    const latest = run.attempts
      .filter((attempt) => attempt.nodeId === node.id)
      .at(-1);
    if (!latest || handled[latest.id]) return [];
    if (
      (!run.accepted[node.id] &&
        ["failed", "blocked"].includes(latest.status)) ||
      ["replan", "input"].includes(latest.result?.nextAction)
    )
      return [latest.id];
    return [];
  });
}

function needsPlanner(run) {
  if (!run.plan) return true;
  if (run.feedback.length) return true;
  if (run.plan.nodes.every((node) => run.accepted[node.id])) return true;
  return plannerSignalIds(run).length > 0;
}

export function createWorkflowEngine({
  store,
  executeNode,
  plan,
  validateWorkspace = async () => {},
}) {
  const active = new Map(),
    controllers = new Map();
  let closed = false;

  function update(id, fn, type = "state", payload = {}) {
    const run = store.get(id);
    if (run.status === "cancelled") return run;
    fn(run);
    return store.save(run, type, payload);
  }

  function recordRevision(
    run,
    next,
    reason,
    automatic,
    previousAccepted = run.accepted,
  ) {
    if (run.revisions.length)
      run.revisions.at(-1).accepted = { ...previousAccepted };
    if (run.plan && automatic) run.autoRevisions++;
    run.plan = next;
    run.title = next.title;
    run.version++;
    run.schemaVersion = 2;
    run.revisions.push({
      version: run.version,
      plan: next,
      reason,
      createdAt: Date.now(),
    });
  }

  function applyRevision(
    run,
    { patches, invalidateNodeIds = [] },
    reason,
    automatic = true,
  ) {
    if (!run.plan) throw fail("尚未提交初始计划。");
    if (run.mode === "fixed") throw fail("固定模式不能改变节点或依赖。");
    if (!Array.isArray(patches) || !patches.length)
      return { changed: false, invalidated: [] };
    if (!Array.isArray(invalidateNodeIds)) throw fail("失效节点格式无效。");

    const source = run.plan,
      draft = structuredClone(source),
      touched = new Set(),
      semantic = new Set();
    for (const patch of patches) {
      if (!patch || !["add", "update", "remove"].includes(patch.op))
        throw fail("计划 patch 无效。");
      if (patch.op === "add") {
        if (!patch.node || nodeById(draft, patch.node.id))
          throw fail("新增节点无效或已存在。");
        draft.nodes.push(patch.node);
        touched.add(patch.node.id);
        semantic.add(patch.node.id);
        continue;
      }
      const index = draft.nodes.findIndex((node) => node.id === patch.nodeId);
      if (index < 0) throw fail("修改的节点不存在。");
      touched.add(patch.nodeId);
      if (patch.op === "remove") {
        draft.nodes.splice(index, 1);
        semantic.add(patch.nodeId);
        continue;
      }
      if (
        !patch.changes ||
        typeof patch.changes !== "object" ||
        Array.isArray(patch.changes) ||
        "id" in patch.changes
      )
        throw fail("节点修改内容无效。");
      const before = draft.nodes[index];
      draft.nodes[index] = { ...before, ...patch.changes };
      if (
        executionFields.some(
          (key) =>
            key in patch.changes &&
            !equal(before[key], draft.nodes[index][key]),
        )
      )
        semantic.add(patch.nodeId);
    }

    const next = validatePlan(
      draft,
      enabledAgents(run),
      run.limits.maxNodes,
      { strictContracts: true },
    );
    if (equal(next, source)) return { changed: false, invalidated: [] };
    if (automatic && run.autoRevisions >= run.limits.maxRevisions)
      throw fail("已达到自动调整次数限制。请修改限制或手动调整。");

    const invalidation = new Set(invalidateNodeIds);
    for (const id of invalidation)
      if (!nodeById(source, id)) throw fail(`失效节点不存在：${id}`);
    for (const id of touched)
      if (run.accepted[id] && !invalidation.has(id))
        throw fail(`已完成节点“${id}”必须显式确认失效后才能修改。`, 409);

    const acceptedBeforeRevision = { ...run.accepted },
      invalid = new Set([
      ...descendants(source, invalidation),
      ...descendants(next, invalidation),
    ]);
    run.accepted = Object.fromEntries(
      Object.entries(run.accepted).filter(
        ([id]) => !invalid.has(id) && Boolean(nodeById(next, id)),
      ),
    );
    run.nodeRevisions ??= {};
    for (const id of semantic)
      if (nodeById(next, id))
        run.nodeRevisions[id] = (run.nodeRevisions[id] ?? 0) + 1;
    for (const id of Object.keys(run.nodeRevisions))
      if (!nodeById(next, id)) delete run.nodeRevisions[id];
    recordRevision(run, next, reason, automatic, acceptedBeforeRevision);
    return { changed: true, invalidated: [...invalid] };
  }

  function applyPlan(run, value, reason) {
    if (run.plan) throw fail("submit_plan 只能用于初始规划。");
    const next = validatePlan(
      value,
      enabledAgents(run),
      run.limits.maxNodes,
      { strictContracts: run.schemaVersion === 2 },
    );
    run.nodeRevisions = Object.fromEntries(
      next.nodes.map((node) => [node.id, 1]),
    );
    recordRevision(run, next, reason, false);
    return { changed: true, invalidated: [] };
  }

  function checkpoint(id) {
    const run = store.get(id),
      previous = run.checkpoints.at(-1);
    if (previous && equal(previous.accepted, run.accepted)) return;
    const value = {
      id: randomUUID(),
      planVersion: run.version,
      nodeRevisions: { ...run.nodeRevisions },
      accepted: { ...run.accepted },
      createdAt: Date.now(),
    };
    run.checkpoints.push(value);
    store.save(run, "checkpoint", { checkpoint: value });
  }

  async function node(id, workflowNode) {
    let run = store.get(id);
    if (failedAttempts(run, workflowNode.id) >= run.limits.maxAttempts)
      throw fail(`节点“${workflowNode.title}”已达到尝试次数限制。`);
    const retry = run.retryDirectives?.[workflowNode.id],
      attempt = {
        id: randomUUID(),
        nodeId: workflowNode.id,
        version: run.version,
        nodeRevision: run.nodeRevisions?.[workflowNode.id] ?? 1,
        retryDirective: retry?.directive,
        status: "running",
        startedAt: Date.now(),
      };
    update(
      id,
      (current) => {
        current.attempts.push(attempt);
        delete current.retryDirectives?.[workflowNode.id];
      },
      "node_started",
      { nodeId: workflowNode.id, attemptId: attempt.id },
    );
    const controller = new AbortController();
    controllers.set(attempt.id, { id, controller });
    try {
      run = store.get(id);
      const result = await executeNode({
        run,
        node: workflowNode,
        attempt,
        signal: controller.signal,
        store,
        update: (fn, type, payload) => update(id, fn, type, payload),
      });
      update(
        id,
        (current) => {
          const saved = current.attempts.find((item) => item.id === attempt.id);
          if (saved.status !== "running") return;
          saved.result = { nextAction: "continue", ...result };
          saved.status = result.status === "completed" ? "completed" : "blocked";
          saved.endedAt = Date.now();
          if (
            saved.status === "completed" &&
            current.version === attempt.version &&
            (current.nodeRevisions?.[workflowNode.id] ?? 1) ===
              attempt.nodeRevision
          )
            current.accepted[workflowNode.id] = saved.id;
        },
        "node_finished",
        { nodeId: workflowNode.id, attemptId: attempt.id },
      );
    } catch (error) {
      update(
        id,
        (current) => {
          const saved = current.attempts.find((item) => item.id === attempt.id);
          if (saved.status !== "running") return;
          saved.status = controller.signal.aborted ? "interrupted" : "failed";
          saved.error = error.message;
          saved.endedAt = Date.now();
        },
        "node_failed",
        { nodeId: workflowNode.id, attemptId: attempt.id },
      );
    } finally {
      controllers.delete(attempt.id);
    }
  }

  function applyRetry(run, decision) {
    if (
      !run.plan ||
      !Array.isArray(decision.nodeIds) ||
      !decision.nodeIds.length ||
      decision.nodeIds.some((id) => !nodeById(run.plan, id))
    )
      throw fail("重跑节点不存在。");
    if (
      typeof decision.directive !== "string" ||
      !decision.directive.trim()
    )
      throw fail("重跑节点必须提供恢复指令。");
    const acceptedRoots = decision.nodeIds.filter(
      (nodeId) => run.accepted[nodeId],
    );
    const affected = descendants(run.plan, acceptedRoots);
    for (const nodeId of affected) delete run.accepted[nodeId];
    run.retryDirectives ??= {};
    for (const nodeId of decision.nodeIds)
      run.retryDirectives[nodeId] = {
        reason: decision.reason,
        directive: decision.directive.trim(),
        createdAt: Date.now(),
      };
  }

  async function drive(id) {
    try {
      await validateWorkspace(store.get(id).workspaceId);
      while (!closed) {
        let run = store.get(id);
        if (terminal.has(run.status)) return;
        if (run.status === "pausing") {
          update(id, (current) => {
            current.status = "paused";
          });
          return;
        }
        if (["paused", "waiting_input", "interrupted"].includes(run.status))
          return;

        if (run.pendingPatch) {
          update(id, (current) => {
            applyRevision(current, run.pendingPatch, "用户编辑节点", false);
            delete current.pendingPatch;
          });
          run = store.get(id);
        }

        let decision = { type: "continue" };
        if (needsPlanner(run)) {
          const signalIds = plannerSignalIds(run);
          update(id, (current) => {
            current.status = "planning";
          });
          const controller = new AbortController();
          controllers.set(`plan:${id}`, { id, controller });
          try {
            decision = await plan({
              run: store.get(id),
              signal: controller.signal,
              store,
              update: (fn, type, payload) => update(id, fn, type, payload),
            });
          } finally {
            controllers.delete(`plan:${id}`);
          }
          run = store.get(id);
          if (terminal.has(run.status) || run.status === "interrupted") return;
          if (signalIds.length && decision.type !== "input")
            update(id, (current) => {
              current.plannerHandledAttempts ??= {};
              for (const attemptId of signalIds)
                current.plannerHandledAttempts[attemptId] = Date.now();
            });
          if (run.status === "pausing") {
            update(id, (current) => {
              current.status = "paused";
            });
            return;
          }
          if (run.feedback.length || run.pendingPatch) {
            update(id, (current) => {
              current.status = "running";
            });
            continue;
          }
        }

        if (decision.type === "input") {
          update(id, (current) => {
            current.status = "waiting_input";
            current.error = decision.question;
          });
          return;
        }
        if (decision.type === "finish") {
          if (
            !run.plan ||
            run.plan.nodes.some((item) => !run.accepted[item.id])
          )
            throw fail("尚有节点未完成，不能将工作流标记为成功。");
          update(
            id,
            (current) => {
              current.status = "completed";
              current.summary = decision.summary;
            },
            "completed",
          );
          return;
        }
        if (decision.type === "plan") {
          update(id, (current) => {
            if (current.plan)
              throw fail("submit_plan 只能用于初始规划。");
            applyPlan(current, decision.plan, decision.reason);
          });
        } else if (decision.type === "revise") {
          update(id, (current) =>
            applyRevision(current, decision, decision.reason, true),
          );
        } else if (decision.type === "retry") {
          update(
            id,
            (current) => applyRetry(current, decision),
            "nodes_invalidated",
            { reason: decision.reason, nodeIds: decision.nodeIds },
          );
        }

        run = store.get(id);
        if (!run.plan) throw fail("Plan Agent 没有提交有效计划。");
        const ready = run.plan.nodes.filter(
          (item) =>
            !run.accepted[item.id] &&
            item.dependencies.every((dependency) => run.accepted[dependency]),
        );
        const exhausted = ready.find(
          (item) => failedAttempts(run, item.id) >= run.limits.maxAttempts,
        );
        if (exhausted)
          throw fail(`节点“${exhausted.title}”已达到尝试次数限制。`);
        if (!ready.length) {
          if (run.plan.nodes.every((item) => run.accepted[item.id])) continue;
          throw fail("当前没有可执行节点，请检查依赖或恢复失败节点。");
        }
        update(id, (current) => {
          current.status = "running";
          delete current.error;
        });
        await Promise.all(
          ready.slice(0, run.limits.concurrency).map((item) => node(id, item)),
        );
        const after = store.get(id);
        if (after.status === "interrupted") return;
        if (
          Object.keys(after.accepted).length > Object.keys(run.accepted).length
        )
          checkpoint(id);
      }
    } catch (error) {
      if (!closed)
        update(
          id,
          (run) => {
            if (run.status === "interrupted") return;
            run.status =
              run.status === "pausing" ? "paused" : "waiting_input";
            run.error = error.message;
          },
          "needs_attention",
        );
    }
  }

  function kick() {
    if (closed) return;
    const occupied = new Set(
      [...active.values()].map((value) => value.workspaceId),
    );
    for (const run of store.list().reverse())
      if (
        run.status === "queued" &&
        !active.has(run.id) &&
        !occupied.has(run.workspaceId)
      ) {
        occupied.add(run.workspaceId);
        const promise = Promise.resolve()
          .then(() => drive(run.id))
          .finally(() => {
            active.delete(run.id);
            kick();
          });
        active.set(run.id, { workspaceId: run.workspaceId, promise });
      }
  }

  function abortRun(id) {
    for (const { id: runId, controller } of controllers.values())
      if (runId === id) controller.abort();
  }

  function action(id, payload) {
    const run = store.get(id);
    if (payload.expectedVersion !== run.version)
      throw fail("计划版本已变化，请刷新后重试。", 409);
    if (["stop", "interrupt"].includes(payload.type)) {
      if (terminal.has(run.status)) return run;
      if (payload.type === "interrupt" && run.status === "interrupted")
        return run;
      run.status = payload.type === "stop" ? "cancelled" : "interrupted";
      for (const attempt of run.attempts)
        if (attempt.status === "running") {
          attempt.status = "interrupted";
          attempt.endedAt = Date.now();
        }
      for (const operation of run.operations)
        if (["running", "pending_approval"].includes(operation.status)) {
          operation.status = "unknown";
          operation.outcome = "cancelled";
        }
      store.save(
        run,
        payload.type === "stop" ? "cancelled" : "interrupted",
      );
      abortRun(id);
      return run;
    }
    if (terminal.has(run.status))
      throw fail("运行已结束，请新建运行。", 409);
    if (payload.type === "pause")
      run.status = active.has(id) ? "pausing" : "paused";
    else if (payload.type === "resume") {
      if (active.has(id)) throw fail("请等待当前节点中断完成。", 409);
      run.status = "queued";
      delete run.error;
    } else if (["feedback", "edit"].includes(payload.type)) {
      if (payload.type === "edit") {
        if (run.mode === "fixed")
          throw fail("固定模式不能编辑结构。");
        const next = validatePlan(
          payload.plan,
          enabledAgents(run),
          run.limits.maxNodes,
          { strictContracts: true },
        );
        if (!run.plan) throw fail("当前没有可编辑计划。");
        const changed = next.nodes.filter(
          (node) => !equal(node, nodeById(run.plan, node.id)),
        );
        const removed = run.plan.nodes.filter(
          (node) => !nodeById(next, node.id),
        );
        if (changed.length + removed.length !== 1)
          throw fail("节点编辑每次只能修改一个节点。", 409);
        const target = changed[0] ?? removed[0];
        const nodeChanges = Object.fromEntries(
          Object.entries(target).filter(([key]) => key !== "id"),
        );
        run.pendingPatch = {
          patches: changed.length
            ? nodeById(run.plan, target.id)
              ? [{ op: "update", nodeId: target.id, changes: nodeChanges }]
              : [{ op: "add", node: target }]
            : [{ op: "remove", nodeId: target.id }],
          invalidateNodeIds: payload.invalidateNodeIds ?? [],
        };
        if (
          run.accepted[target.id] &&
          !run.pendingPatch.invalidateNodeIds.includes(target.id)
        )
          throw fail(
            "编辑已完成节点需要确认失效该节点及其下游。",
            409,
          );
      } else {
        if (
          typeof payload.text !== "string" ||
          !payload.text.trim() ||
          payload.text.length > 20000
        )
          throw fail("修改要求为空或过长。");
        run.feedback.push(payload.text.trim());
        (run.instructions ??= []).push(payload.text.trim());
      }
      if (!active.has(id)) run.status = "queued";
    } else if (payload.type === "limits") {
      if (active.has(id)) throw fail("请暂停后修改限制。", 409);
      const bounds = {
        maxNodes: [1, 50],
        maxRevisions: [0, 20],
        maxAttempts: [1, 10],
        timeoutMs: [1000, 1800000],
        concurrency: [1, 4],
      };
      for (const [key, [min, max]] of Object.entries(bounds))
        if (payload.limits?.[key] !== undefined) {
          const value = payload.limits[key];
          if (!Number.isInteger(value) || value < min || value > max)
            throw fail("运行限制无效。");
          run.limits[key] = value;
        }
    } else throw fail("未知操作。");
    store.save(run, "action", { action: payload.type });
    kick();
    return run;
  }

  return {
    kick,
    action,
    applyPlan,
    applyRevision,
    active,
    async close() {
      closed = true;
      for (const { controller } of controllers.values()) controller.abort();
      await Promise.all([...active.values()].map((value) => value.promise));
    },
  };
}
