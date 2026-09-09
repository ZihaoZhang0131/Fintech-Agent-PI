import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  createWorkflowStore,
  newRun,
  validatePlan,
  invalidatedNodes,
} from "../server/workflow/store.mjs";
import { createWorkflowEngine } from "../server/workflow/engine.mjs";
import { createLocalDatabase } from "../server/local-database.mjs";
const agentId = "custom-test-12345678";
const n = (id, dependencies = []) => ({
  id,
  title: id,
  agentId,
  task: `完成 ${id}`,
  acceptance: "核验结果",
  dependencies,
  requires: { tools: [], skills: [], mcps: [] },
  outputs: [{ id: "result", kind: "text", required: true }],
});
const result = {
  status: "completed",
  summary: "ok",
  text: "完整结果",
  sources: [],
  artifacts: [],
  issues: [],
  nextAction: "continue",
};
function run() {
  return newRun({
    workspaceId: "test-workspace",
    workspaceName: "test",
    input: "test",
    config: { customSubAgents: [{ id: agentId, enabled: true }] },
    limits: {
      maxNodes: 12,
      maxRevisions: 5,
      maxAttempts: 3,
      timeoutMs: 300000,
      concurrency: 2,
    },
    parameters: {},
    mode: "adaptive",
  });
}
async function fixture(t) {
  const dir = await mkdtemp(path.join(tmpdir(), "workflow-test-"));
  const store = createWorkflowStore(dir);
  t.after(() => {
    store.close();
    return rm(dir, { recursive: true, force: true });
  });
  return { dir, store };
}
async function waitFor(fn) {
  const deadline = Date.now() + 3000;
  while (!fn()) {
    if (Date.now() > deadline) throw new Error("condition timed out");
    await new Promise((r) => setTimeout(r, 5));
  }
}
const finishOrContinue = async ({ run }) =>
  run.plan.nodes.every((n) => run.accepted[n.id])
    ? { type: "finish", summary: "已完成" }
    : { type: "continue" };
test("workflow validates DAG and invalidates only changed downstream", () => {
  const before = { title: "test", nodes: [n("a"), n("b"), n("c", ["a"])] };
  assert.deepEqual(validatePlan(before, [agentId]), before);
  assert.throws(
    () => validatePlan({ nodes: [n("a", ["b"]), n("b", ["a"])] }, [agentId]),
    /循环/,
  );
  assert.throws(
    () => validatePlan({ nodes: [n("a", ["missing"])] }, [agentId]),
    /不存在/,
  );
  assert.throws(() => validatePlan(before, []), /Subagent/);
  const next = structuredClone(before);
  next.nodes[0].task = "新任务";
  assert.deepEqual([...invalidatedNodes(before, next)].sort(), ["a", "c"]);
  assert.throws(
    () =>
      validatePlan(
        {
          title: "invalid capability",
          nodes: [
            {
              ...n("file"),
              requires: {
                tools: ["write_project_file"],
                skills: [],
                mcps: [],
              },
              outputs: [
                {
                  id: "report",
                  kind: "file",
                  path: "outputs/report.md",
                  required: true,
                },
              ],
            },
          ],
        },
        [
          {
            id: agentId,
            enabledTools: [],
            enabledSkills: [],
            enabledMcps: [],
          },
        ],
        12,
        { strictContracts: true },
      ),
    /缺少tools能力/,
  );
});
test("two independent nodes run in parallel and join waits for both", async (t) => {
  const { store } = await fixture(t);
  let parallel = 0,
    max = 0;
  const started = [];
  const engine = createWorkflowEngine({
    store,
    plan: async (ctx) =>
      ctx.run.plan
        ? finishOrContinue(ctx)
        : {
            type: "plan",
            plan: {
              title: "DAG",
              nodes: [n("a"), n("b"), n("join", ["a", "b"])],
            },
            reason: "并行研究后汇总",
          },
    executeNode: async ({ node, run }) => {
      started.push(node.id);
      parallel++;
      max = Math.max(max, parallel);
      if (node.id === "join")
        assert.deepEqual(Object.keys(run.accepted).sort(), ["a", "b"]);
      await new Promise((r) => setTimeout(r, 10));
      parallel--;
      return result;
    },
  });
  const r = run();
  store.save(r);
  engine.kick();
  await waitFor(() => store.get(r.id).status === "completed");
  assert.equal(max, 2);
  assert.deepEqual(started, ["a", "b", "join"]);
  assert.equal(store.get(r.id).attempts.length, 3);
  assert.equal(store.events(r.id, 0).at(-1).seq, store.get(r.id).seq);
  await engine.close();
});
test("failed attempt is observed and recovery gets its operation record", async (t) => {
  const { store } = await fixture(t);
  let observed = false;
  const engine = createWorkflowEngine({
    store,
    plan: async (ctx) => {
      if (!ctx.run.plan)
        return {
          type: "plan",
          plan: { title: "恢复", nodes: [n("a")] },
          reason: "执行",
        };
      if (ctx.run.attempts.some((a) => a.status === "failed")) observed = true;
      return finishOrContinue(ctx);
    },
    executeNode: async ({ run, attempt, update }) => {
      if (run.attempts.length === 1) {
        update((r) =>
          r.operations.push({
            id: "op",
            attemptId: attempt.id,
            status: "unknown",
            tool: "mutate_local_database",
          }),
        );
        throw Error("响应丢失");
      }
      assert.equal(run.operations[0].status, "unknown");
      assert.equal(run.attempts[0].error, "响应丢失");
      return result;
    },
  });
  const r = run();
  store.save(r);
  engine.kick();
  await waitFor(() => store.get(r.id).status === "completed");
  assert.equal(observed, true);
  assert.equal(store.get(r.id).attempts.length, 2);
  await engine.close();
});
test("pause drains current node; stop rejects late success and future nodes", async (t) => {
  const { store } = await fixture(t);
  let release;
  const gate = new Promise((r) => (release = r));
  let started = 0;
  const engine = createWorkflowEngine({
    store,
    plan: async (ctx) =>
      ctx.run.plan
        ? finishOrContinue(ctx)
        : {
            type: "plan",
            plan: { title: "stop", nodes: [n("a"), n("b", ["a"])] },
            reason: "顺序",
          },
    executeNode: async () => {
      started++;
      await gate;
      return result;
    },
  });
  const r = run();
  store.save(r);
  engine.kick();
  await waitFor(() => started === 1);
  engine.action(r.id, { type: "pause", expectedVersion: 1 });
  assert.equal(store.get(r.id).status, "pausing");
  engine.action(r.id, { type: "stop", expectedVersion: 1 });
  release();
  await waitFor(() => engine.active.size === 0);
  assert.equal(store.get(r.id).status, "cancelled");
  assert.equal(started, 1);
  assert.deepEqual(store.get(r.id).accepted, {});
  await engine.close();
});
test("fixed plans reject structural edits; version conflicts reject stale commands", async (t) => {
  const { store } = await fixture(t);
  const engine = createWorkflowEngine({
    store,
    plan: finishOrContinue,
    executeNode: async () => result,
  });
  const r = run();
  r.mode = "fixed";
  engine.applyPlan(r, { title: "fixed", nodes: [n("a")] }, "template", false);
  r.status = "paused";
  store.save(r);
  assert.throws(
    () =>
      engine.action(r.id, {
        type: "edit",
        expectedVersion: 1,
        plan: { title: "fixed", nodes: [n("b")] },
      }),
    /固定模式/,
  );
  assert.throws(
    () => engine.action(r.id, { type: "resume", expectedVersion: 0 }),
    /版本/,
  );
  await engine.close();
});
test("restart preserves completed results and marks in-flight operations uncertain", async (t) => {
  const dir = await mkdtemp(path.join(tmpdir(), "workflow-restart-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  let store = createWorkflowStore(dir);
  const r = run();
  r.status = "running";
  r.attempts = [
    { id: "a", nodeId: "a", status: "completed", result },
    { id: "b", nodeId: "b", status: "running" },
  ];
  r.accepted = { a: "a" };
  r.operations = [{ id: "op", status: "running" }];
  store.save(r);
  store.close();
  store = createWorkflowStore(dir);
  assert.equal(store.get(r.id).status, "interrupted");
  assert.equal(store.get(r.id).operations[0].status, "unknown");
  assert.equal(store.get(r.id).attempts[1].status, "interrupted");
  assert.deepEqual(store.get(r.id).accepted, { a: "a" });
  store.close();
});
test("database operation ID deduplicates committed writes including after reopening", async (t) => {
  const { dir } = await fixture(t);
  let db = createLocalDatabase(dir);
  db.mutate("CREATE TABLE records (id INTEGER PRIMARY KEY, value TEXT)");
  const first = db.mutate("INSERT INTO records VALUES(1,'ok')", "operation-1");
  db.close();
  db = createLocalDatabase(dir);
  assert.deepEqual(
    db.mutate("INSERT INTO records VALUES(1,'ok')", "operation-1"),
    first,
  );
  assert.equal(db.query("SELECT * FROM records").rows.length, 1);
  assert.throws(
    () => db.mutate("INSERT INTO records VALUES(2,'different')", "operation-1"),
    /其他 SQL/,
  );
  assert.equal(db.listTables().length, 1);
  db.close();
});
test("project queue never overlaps runs in the same project", async (t) => {
  const { store } = await fixture(t);
  let inFlight = 0,
    max = 0;
  const engine = createWorkflowEngine({
    store,
    plan: async (ctx) =>
      ctx.run.plan
        ? finishOrContinue(ctx)
        : {
            type: "plan",
            plan: { title: "queued", nodes: [n("a")] },
            reason: "test",
          },
    executeNode: async () => {
      max = Math.max(max, ++inFlight);
      await new Promise((r) => setTimeout(r, 15));
      inFlight--;
      return result;
    },
  });
  const a = run(),
    b = run();
  store.save(a);
  store.save(b);
  engine.kick();
  await waitFor(
    () =>
      store.get(a.id).status === "completed" &&
      store.get(b.id).status === "completed",
  );
  assert.equal(max, 1);
  await engine.close();
});

test("manual edits invalidate downstream but retain independent completed output", async (t) => {
  const { store } = await fixture(t);
  let release;
  const gate = new Promise((r) => (release = r));
  let third = false;
  const counts = {};
  const engine = createWorkflowEngine({
    store,
    plan: async (ctx) =>
      ctx.run.plan
        ? finishOrContinue(ctx)
        : {
            type: "plan",
            plan: { title: "edit", nodes: [n("a"), n("b"), n("join", ["a"])] },
            reason: "test",
          },
    executeNode: async ({ node }) => {
      counts[node.id] = (counts[node.id] ?? 0) + 1;
      if (node.id === "join" && counts.join === 1) {
        third = true;
        await gate;
      }
      return result;
    },
  });
  const r = run();
  store.save(r);
  engine.kick();
  await waitFor(() => third);
  const current = store.get(r.id),
    next = structuredClone(current.plan);
  next.nodes[0].task = "新的资料范围";
  engine.action(r.id, {
    type: "edit",
    expectedVersion: 1,
    plan: next,
    invalidateNodeIds: ["a"],
  });
  release();
  await waitFor(() => store.get(r.id).status === "completed");
  assert.deepEqual(counts, { a: 2, b: 1, join: 2 });
  assert.equal(store.get(r.id).version, 2);
  assert.deepEqual(
    Object.keys(store.get(r.id).revisions[0].accepted).sort(),
    ["a", "b", "join"],
  );
  await engine.close();
});
test("attempt limit stops recovery loops and can be increased before continuing", async (t) => {
  const { store } = await fixture(t);
  const engine = createWorkflowEngine({
    store,
    plan: async (ctx) =>
      ctx.run.plan
        ? { type: "continue" }
        : {
            type: "plan",
            plan: { title: "retry", nodes: [n("a")] },
            reason: "test",
          },
    executeNode: async () => {
      throw Error("always fail");
    },
  });
  const r = run();
  r.limits.maxAttempts = 2;
  store.save(r);
  engine.kick();
  await waitFor(() => store.get(r.id).status === "waiting_input");
  assert.equal(store.get(r.id).attempts.length, 2);
  await waitFor(() => engine.active.size === 0);
  engine.action(r.id, {
    type: "limits",
    expectedVersion: 1,
    limits: { maxAttempts: 3 },
  });
  engine.action(r.id, { type: "resume", expectedVersion: 1 });
  await waitFor(
    () =>
      store.get(r.id).attempts.length === 3 &&
      store.get(r.id).status === "waiting_input",
  );
  await engine.close();
});
test("database failure rolls back both write and idempotency receipt", async (t) => {
  const { dir } = await fixture(t);
  const db = createLocalDatabase(dir);
  db.mutate("CREATE TABLE records (id INTEGER PRIMARY KEY)");
  assert.throws(() => db.mutate("INSERT INTO missing VALUES(1)", "retry-op"));
  db.mutate("INSERT INTO records VALUES(1)", "retry-op");
  assert.equal(db.query("SELECT COUNT(*) AS n FROM records").rows[0].n, 1);
  db.close();
});
test("state, event and request receipt share a transaction", async (t) => {
  const { store } = await fixture(t);
  const r = run();
  assert.throws(() =>
    store.transaction(() => {
      store.save(r);
      store.remember("request-1", "fingerprint", { id: r.id });
      throw Error("rollback");
    }),
  );
  assert.throws(() => store.get(r.id), /不存在/);
  assert.equal(store.lookup("request-1", "fingerprint"), undefined);
});

test("planner can deliberately re-evaluate a completed node and descendants without changing structure", async (t) => {
  const { store } = await fixture(t);
  let retried = false;
  const counts = {};
  const engine = createWorkflowEngine({
    store,
    plan: async (ctx) => {
      if (!ctx.run.plan)
        return {
          type: "plan",
          plan: { title: "review", nodes: [n("a"), n("b"), n("join", ["a"])] },
          reason: "test",
        };
      if (ctx.run.accepted.join && !retried) {
        retried = true;
        return {
          type: "retry",
          nodeIds: ["a"],
          reason: "核验上游证据",
          directive: "重新核验 a 的上游证据，不重复未知写入",
        };
      }
      return finishOrContinue(ctx);
    },
    executeNode: async ({ node }) => {
      counts[node.id] = (counts[node.id] ?? 0) + 1;
      return result;
    },
  });
  const r = run();
  store.save(r);
  engine.kick();
  await waitFor(() => store.get(r.id).status === "completed");
  assert.deepEqual(counts, { a: 2, b: 1, join: 2 });
  assert.equal(store.get(r.id).version, 1);
  await engine.close();
});

test("user feedback remains a durable instruction for later planner and node rounds", async (t) => {
  const { store } = await fixture(t);
  const seen = [];
  const engine = createWorkflowEngine({
    store,
    plan: async (ctx) => {
      seen.push(ctx.run.instructions);
      const r = store.get(ctx.run.id);
      r.feedback = [];
      store.save(r);
      return finishOrContinue(ctx);
    },
    executeNode: async ({ run }) => {
      assert.deepEqual(run.instructions, ["使用英文输出"]);
      return result;
    },
  });
  const r = run();
  engine.applyPlan(r, { title: "feedback", nodes: [n("a")] }, "test", false);
  r.status = "paused";
  store.save(r);
  engine.action(r.id, {
    type: "feedback",
    expectedVersion: 1,
    text: "使用英文输出",
  });
  await waitFor(() => store.get(r.id).status === "completed");
  assert.deepEqual(seen, [["使用英文输出"], ["使用英文输出"]]);
  await engine.close();
});

test("conversation projection is stable on restart and completed legacy runs keep their IDs", async () => {
  const directory = await mkdtemp(
    path.join(tmpdir(), "workflow-conversation-restart-"),
  );
  let store = createWorkflowStore(directory);
  try {
    const run = newRun({
      workspaceId: "test-project",
      input: "已有单轮任务",
      config: { customSubAgents: [] },
    });
    run.status = "completed";
    run.summary = "已有答案";
    store.save(run);
    const before = store.messages(run.id);
    assert.equal(store.conversation(run.id).runIds[0], run.id);
    store.close();
    store = createWorkflowStore(directory);
    assert.deepEqual(store.messages(run.id), before);
    assert.equal(store.conversations("test-project").length, 1);
  } finally {
    store.close();
    await rm(directory, { recursive: true, force: true });
  }
});

test("successful batches advance without replanning and create immutable checkpoints", async (t) => {
  const { store } = await fixture(t);
  let plannerCalls = 0;
  const engine = createWorkflowEngine({
    store,
    plan: async (ctx) => {
      plannerCalls++;
      return ctx.run.plan
        ? { type: "finish", summary: "done" }
        : {
            type: "plan",
            plan: {
              title: "event driven",
              nodes: [n("a"), n("b", ["a"]), n("c", ["b"])],
            },
            reason: "test",
          };
    },
    executeNode: async () => result,
  });
  const r = run();
  store.save(r);
  engine.kick();
  await waitFor(() => store.get(r.id).status === "completed");
  const saved = store.get(r.id);
  assert.equal(plannerCalls, 2);
  assert.equal(saved.checkpoints.length, 3);
  assert.deepEqual(Object.keys(saved.checkpoints[0].accepted), ["a"]);
  assert.deepEqual(Object.keys(saved.checkpoints[2].accepted).sort(), [
    "a",
    "b",
    "c",
  ]);
  assert.equal(
    store.events(r.id, 0).filter((event) => event.type === "checkpoint").length,
    3,
  );
  await engine.close();
});

test("patching an unfinished finalize node preserves six accepted upstream nodes and checkpoint", async (t) => {
  const { store } = await fixture(t);
  const writerId = "custom-writer-12345678";
  const r = run();
  r.config.customSubAgents.push({
    id: writerId,
    enabled: true,
    enabledTools: [],
    enabledSkills: [],
    enabledMcps: [],
  });
  const upstream = ["one", "two", "three", "four", "five", "six"];
  const workflow = {
    title: "trace regression",
    nodes: [
      ...upstream.map((id) => n(id)),
      n("finalize", upstream),
      n("deliver", ["finalize"]),
    ],
  };
  {
    const engine = createWorkflowEngine({
      store,
      plan: finishOrContinue,
      executeNode: async () => result,
    });
    engine.applyPlan(r, workflow, "fixture", false);
    r.status = "paused";
    r.attempts = upstream.map((id) => ({
      id: `accepted-${id}`,
      nodeId: id,
      version: 1,
      nodeRevision: 1,
      status: "completed",
      result,
    }));
    r.accepted = Object.fromEntries(
      upstream.map((id) => [id, `accepted-${id}`]),
    );
    r.checkpoints.push({
      id: "checkpoint-six",
      planVersion: 1,
      nodeRevisions: { ...r.nodeRevisions },
      accepted: { ...r.accepted },
      createdAt: Date.now(),
    });
    const beforeCheckpoint = structuredClone(r.checkpoints[0]);
    const applied = engine.applyRevision(
      r,
      {
        patches: [
          {
            op: "update",
            nodeId: "finalize",
            changes: { agentId: writerId },
          },
        ],
        invalidateNodeIds: [],
      },
      "改用写作 Agent",
    );
    assert.equal(applied.changed, true);
    assert.deepEqual(Object.keys(r.accepted).sort(), upstream.sort());
    assert.deepEqual(r.checkpoints[0], beforeCheckpoint);
    assert.equal(r.nodeRevisions.finalize, 2);
    assert.equal(r.nodeRevisions.one, 1);
    await engine.close();
  }
});

test("no-op patch does not consume plan version or automatic revision budget", async (t) => {
  const { store } = await fixture(t);
  const engine = createWorkflowEngine({
    store,
    plan: finishOrContinue,
    executeNode: async () => result,
  });
  const r = run();
  engine.applyPlan(r, { title: "noop", nodes: [n("a")] }, "fixture", false);
  const value = engine.applyRevision(
    r,
    {
      patches: [{ op: "update", nodeId: "a", changes: { title: "a" } }],
      invalidateNodeIds: [],
    },
    "same",
  );
  assert.equal(value.changed, false);
  assert.equal(r.version, 1);
  assert.equal(r.autoRevisions, 0);
  await engine.close();
});

test("completed replan signal wakes planner before the next node", async (t) => {
  const { store } = await fixture(t);
  let plannerCalls = 0,
    replanObserved = false;
  const engine = createWorkflowEngine({
    store,
    plan: async (ctx) => {
      plannerCalls++;
      if (!ctx.run.plan)
        return {
          type: "plan",
          plan: { title: "signal", nodes: [n("a"), n("b", ["a"])] },
          reason: "test",
        };
      if (
        ctx.run.attempts.at(-1)?.result?.nextAction === "replan" &&
        !replanObserved
      ) {
        replanObserved = true;
        return { type: "continue", reason: "继续" };
      }
      return { type: "finish", summary: "done" };
    },
    executeNode: async ({ node }) =>
      node.id === "a" ? { ...result, nextAction: "replan" } : result,
  });
  const r = run();
  store.save(r);
  engine.kick();
  await waitFor(() => store.get(r.id).status === "completed");
  assert.equal(replanObserved, true);
  assert.equal(plannerCalls, 3);
  await engine.close();
});

test("retry directive is consumed by the next attempt and blocked attempts alone use budget", async (t) => {
  const { store } = await fixture(t);
  let executions = 0;
  const engine = createWorkflowEngine({
    store,
    plan: async (ctx) => {
      if (!ctx.run.plan)
        return {
          type: "plan",
          plan: { title: "retry directive", nodes: [n("a")] },
          reason: "test",
        };
      if (!ctx.run.accepted.a)
        return {
          type: "retry",
          nodeIds: ["a"],
          reason: "补齐结果",
          directive: "只补齐缺失证据，不重复已完成操作",
        };
      return { type: "finish", summary: "done" };
    },
    executeNode: async ({ attempt }) => {
      executions++;
      if (executions === 1)
        return { ...result, status: "blocked", nextAction: "replan" };
      assert.equal(
        attempt.retryDirective,
        "只补齐缺失证据，不重复已完成操作",
      );
      return result;
    },
  });
  const r = run();
  r.limits.maxAttempts = 2;
  store.save(r);
  engine.kick();
  await waitFor(() => store.get(r.id).status === "completed");
  const saved = store.get(r.id);
  assert.equal(saved.attempts.length, 2);
  assert.equal(saved.retryDirectives.a, undefined);
  await engine.close();
});

test("interrupt preserves checkpoint and resume restarts only unfinished work", async (t) => {
  const { store } = await fixture(t);
  let bStarts = 0;
  const engine = createWorkflowEngine({
    store,
    plan: async (ctx) =>
      ctx.run.plan
        ? finishOrContinue(ctx)
        : {
            type: "plan",
            plan: { title: "interrupt", nodes: [n("a"), n("b", ["a"])] },
            reason: "test",
          },
    executeNode: async ({ node, signal }) => {
      if (node.id === "a") return result;
      bStarts++;
      if (bStarts === 1)
        await new Promise((resolve, reject) => {
          const timer = setTimeout(resolve, 1000);
          signal.addEventListener(
            "abort",
            () => {
              clearTimeout(timer);
              reject(new Error("aborted"));
            },
            { once: true },
          );
        });
      return result;
    },
  });
  const r = run();
  store.save(r);
  engine.kick();
  await waitFor(
    () => store.get(r.id).accepted.a && store.get(r.id).attempts.some((a) => a.nodeId === "b"),
  );
  engine.action(r.id, { type: "interrupt", expectedVersion: 1 });
  await waitFor(() => engine.active.size === 0);
  const interrupted = store.get(r.id);
  assert.equal(interrupted.status, "interrupted");
  assert.ok(interrupted.accepted.a);
  assert.equal(interrupted.checkpoints.length, 1);
  engine.action(r.id, { type: "resume", expectedVersion: 1 });
  await waitFor(() => store.get(r.id).status === "completed");
  const completed = store.get(r.id);
  assert.equal(
    completed.attempts.filter((attempt) => attempt.nodeId === "a").length,
    1,
  );
  assert.equal(
    completed.attempts.filter((attempt) => attempt.nodeId === "b").length,
    2,
  );
  assert.equal(
    completed.attempts.filter((attempt) => attempt.status === "interrupted")
      .length,
    1,
  );
  await engine.close();
});
