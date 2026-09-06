import { randomUUID } from "node:crypto";
import { fail, terminal, validatePlan, invalidatedNodes } from "./store.mjs";
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
    const r = store.get(id);
    if (r.status === "cancelled") return r;
    fn(r);
    return store.save(r, type, payload);
  }
  function applyPlan(r, value, reason, automatic = true) {
    const next = validatePlan(
      value,
      r.config.customSubAgents.filter((a) => a.enabled).map((a) => a.id),
      r.limits.maxNodes,
    );
    if (
      r.plan &&
      r.mode === "fixed" &&
      JSON.stringify(next.nodes) !== JSON.stringify(r.plan.nodes)
    )
      throw fail("固定模式不能改变节点或依赖。");
    if (r.plan && automatic && r.autoRevisions >= r.limits.maxRevisions)
      throw fail("已达到自动调整次数限制。请修改限制或手动调整。");
    if (r.revisions.length) r.revisions.at(-1).accepted = { ...r.accepted };
    const invalid = invalidatedNodes(r.plan, next);
    r.accepted = Object.fromEntries(
      Object.entries(r.accepted).filter(
        ([id]) => !invalid.has(id) && next.nodes.some((n) => n.id === id),
      ),
    );
    if (r.plan && automatic) r.autoRevisions++;
    r.plan = next;
    r.title = next.title;
    r.version++;
    r.revisions.push({
      version: r.version,
      plan: next,
      reason,
      createdAt: Date.now(),
    });
  }
  async function node(id, node) {
    let run = store.get(id);
    const previous = run.attempts.filter((a) => a.nodeId === node.id);
    if (previous.length >= run.limits.maxAttempts)
      throw fail(`节点“${node.title}”已达到尝试次数限制。`);
    const attempt = {
      id: randomUUID(),
      nodeId: node.id,
      version: run.version,
      status: "running",
      startedAt: Date.now(),
    };
    update(id, (r) => r.attempts.push(attempt), "node_started", {
      nodeId: node.id,
      attemptId: attempt.id,
    });
    const controller = new AbortController();
    controllers.set(attempt.id, { id, controller });
    try {
      run = store.get(id);
      const result = await executeNode({
        run,
        node,
        attempt,
        signal: controller.signal,
        store,
        update: (fn, type, payload) => update(id, fn, type, payload),
      });
      update(
        id,
        (r) => {
          const a = r.attempts.find((a) => a.id === attempt.id);
          if (a.status !== "running") return;
          a.result = result;
          a.status = result.status === "completed" ? "completed" : "blocked";
          a.endedAt = Date.now();
          if (a.status === "completed" && r.version === attempt.version)
            r.accepted[node.id] = a.id;
        },
        "node_finished",
        { nodeId: node.id, attemptId: attempt.id },
      );
    } catch (e) {
      update(
        id,
        (r) => {
          const a = r.attempts.find((a) => a.id === attempt.id);
          a.status = controller.signal.aborted ? "interrupted" : "failed";
          a.error = e.message;
          a.endedAt = Date.now();
        },
        "node_failed",
        { nodeId: node.id, attemptId: attempt.id },
      );
    } finally {
      controllers.delete(attempt.id);
    }
  }
  async function drive(id) {
    try {
      await validateWorkspace(store.get(id).workspaceId);
      while (!closed) {
        let run = store.get(id);
        if (terminal.has(run.status)) return;
        if (run.status === "pausing") {
          update(id, (r) => {
            r.status = "paused";
          });
          return;
        }
        if (["paused", "waiting_input", "interrupted"].includes(run.status))
          return;
        if (run.pendingPlan) {
          update(id, (r) => {
            applyPlan(r, r.pendingPlan, "用户编辑节点", false);
            delete r.pendingPlan;
          });
          run = store.get(id);
        }
        update(id, (r) => {
          r.status = "planning";
        });
        const controller = new AbortController();
        controllers.set(`plan:${id}`, { id, controller });
        let decision;
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
        if (terminal.has(run.status)) return;
        if (run.status === "pausing") {
          update(id, (r) => {
            r.status = "paused";
          });
          return;
        }
        if (run.feedback.length || run.pendingPlan) {
          update(id, (r) => {
            r.status = "running";
          });
          continue;
        }
        if (decision.type === "input") {
          update(id, (r) => {
            r.status = "waiting_input";
            r.error = decision.question;
          });
          return;
        }
        if (decision.type === "finish") {
          if (!run.plan || run.plan.nodes.some((n) => !run.accepted[n.id]))
            throw fail("尚有节点未完成，不能将工作流标记为成功。");
          update(
            id,
            (r) => {
              r.status = "completed";
              r.summary = decision.summary;
            },
            "completed",
          );
          return;
        }
        if (decision.type === "plan")
          update(id, (r) => applyPlan(r, decision.plan, decision.reason));
        if (decision.type === "retry")
          update(
            id,
            (r) => {
              if (
                !r.plan ||
                !Array.isArray(decision.nodeIds) ||
                !decision.nodeIds.length ||
                decision.nodeIds.some(
                  (id) => !r.plan.nodes.some((n) => n.id === id),
                )
              )
                throw fail("重跑节点不存在。");
              const affected = new Set(decision.nodeIds);
              let count;
              do {
                count = affected.size;
                for (const n of r.plan.nodes)
                  if (n.dependencies.some((d) => affected.has(d)))
                    affected.add(n.id);
              } while (count !== affected.size);
              for (const nodeId of affected) delete r.accepted[nodeId];
            },
            "nodes_invalidated",
            { reason: decision.reason, nodeIds: decision.nodeIds },
          );
        run = store.get(id);
        if (!run.plan) throw fail("Plan Agent 没有提交有效计划。");
        const ready = run.plan.nodes.filter(
          (n) =>
            !run.accepted[n.id] && n.dependencies.every((d) => run.accepted[d]),
        );
        if (!ready.length)
          throw fail("所有节点已完成，请 Plan Agent 汇总结果。");
        const exhausted = ready.find(
          (n) =>
            run.attempts.filter((a) => a.nodeId === n.id).length >=
            run.limits.maxAttempts,
        );
        if (exhausted)
          throw fail(`节点“${exhausted.title}”已达到尝试次数限制。`);
        update(id, (r) => {
          r.status = "running";
          delete r.error;
        });
        await Promise.all(
          ready.slice(0, run.limits.concurrency).map((n) => node(id, n)),
        );
      }
    } catch (e) {
      if (!closed)
        update(
          id,
          (r) => {
            r.status = r.status === "pausing" ? "paused" : "waiting_input";
            r.error = e.message;
          },
          "needs_attention",
        );
    }
  }
  function kick() {
    if (closed) return;
    const occupied = new Set([...active.values()].map((v) => v.workspaceId));
    for (const r of store.list().reverse())
      if (
        r.status === "queued" &&
        !active.has(r.id) &&
        !occupied.has(r.workspaceId)
      ) {
        occupied.add(r.workspaceId);
        const promise = Promise.resolve()
          .then(() => drive(r.id))
          .finally(() => {
            active.delete(r.id);
            kick();
          });
        active.set(r.id, { workspaceId: r.workspaceId, promise });
      }
  }
  function action(id, payload) {
    const r = store.get(id);
    if (payload.expectedVersion !== r.version)
      throw fail("计划版本已变化，请刷新后重试。", 409);
    if (payload.type === "stop") {
      if (terminal.has(r.status)) return r;
      r.status = "cancelled";
      for (const a of r.attempts)
        if (a.status === "running") {
          a.status = "interrupted";
          a.endedAt = Date.now();
        }
      for (const o of r.operations)
        if (["running", "pending_approval"].includes(o.status))
          o.status = "unknown";
      store.save(r, "cancelled");
      for (const { id: runId, controller } of controllers.values())
        if (runId === id) controller.abort();
      return r;
    }
    if (terminal.has(r.status)) throw fail("运行已结束，请新建运行。", 409);
    if (payload.type === "pause")
      r.status = active.has(id) ? "pausing" : "paused";
    else if (payload.type === "resume") {
      if (active.has(id)) throw fail("请等待当前节点暂停。", 409);
      r.status = "queued";
      delete r.error;
    } else if (["feedback", "edit"].includes(payload.type)) {
      if (payload.type === "edit") {
        validatePlan(
          payload.plan,
          r.config.customSubAgents.filter((a) => a.enabled).map((a) => a.id),
          r.limits.maxNodes,
        );
        if (
          r.mode === "fixed" &&
          JSON.stringify(payload.plan.nodes) !== JSON.stringify(r.plan?.nodes)
        )
          throw fail("固定模式不能编辑结构。");
        r.pendingPlan = payload.plan;
      } else {
        if (
          typeof payload.text !== "string" ||
          !payload.text.trim() ||
          payload.text.length > 20000
        )
          throw fail("修改要求为空或过长。");
        r.feedback.push(payload.text.trim());
        (r.instructions ??= []).push(payload.text.trim());
      }
      if (!active.has(id)) r.status = "queued";
    } else if (payload.type === "limits") {
      if (active.has(id)) throw fail("请暂停后修改限制。", 409);
      const bounds = {
        maxNodes: [1, 50],
        maxRevisions: [0, 20],
        maxAttempts: [1, 10],
        timeoutMs: [1000, 1800000],
        concurrency: [1, 4],
      };
      for (const [k, [min, max]] of Object.entries(bounds))
        if (payload.limits?.[k] !== undefined) {
          const v = payload.limits[k];
          if (!Number.isInteger(v) || v < min || v > max)
            throw fail("运行限制无效。");
          r.limits[k] = v;
        }
    } else throw fail("未知操作。");
    store.save(r, "action", { action: payload.type });
    kick();
    return r;
  }
  return {
    kick,
    action,
    applyPlan,
    active,
    async close() {
      closed = true;
      for (const { controller } of controllers.values()) controller.abort();
      await Promise.all([...active.values()].map((v) => v.promise));
    },
  };
}
