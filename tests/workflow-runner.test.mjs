import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createWorkflowRunners } from "../server/workflow/runner.mjs";
import { createWorkflowStore, newRun } from "../server/workflow/store.mjs";
import { createSkillStore } from "../server/skill-store.mjs";
import { createTraceStore } from "../server/trace-store.mjs";
import { createLocalDatabase } from "../server/local-database.mjs";
const agentId = "custom-reader-12345678";
const node = {
  id: "node",
  title: "写入记录",
  agentId,
  task: "写入唯一记录",
  dependencies: [],
  acceptance: "存在一行记录",
};
const result = {
  status: "completed",
  summary: "ok",
  text: "ok",
  sources: [],
  artifacts: [],
  issues: [],
};

test("writing node records both document and chart snapshot even when the model omits artifacts", async t => {
  const f = await fixture(t);
  const attempt = { id: "writing-attempt", nodeId: "node", version: 0, status: "running" };
  f.update(r => r.attempts.push(attempt));
  const previousFetch = globalThis.fetch;
  const reads = [];
  globalThis.fetch = async url => { reads.push(String(url)); return new Response("fixture"); };
  t.after(() => { globalThis.fetch = previousFetch; });
  const runners = createWorkflowRunners({
    ...f, localDatabase: f.db,
    profileTools: async () => ({ skills: { list: () => [] }, mcps: [], tools: [{
      name: "generate_document",
      execute: async () => ({ content: [{ type: "text", text: "generated" }], details: { kind: "document", path: "outputs/report.docx", chartsPath: "outputs/report.charts.json" } }),
    }] }),
    invokeAgent: async ({ tools, prompt }) => {
      assert.match(prompt, /Word 图表内嵌可编辑工作簿/);
      await tools.find(t => t.name === "generate_document").execute("create-doc", { filename: "report" });
      await tools.find(t => t.name === "complete_node").execute("complete", { ...result, artifacts: [] });
    },
  });
  const output = await runners.executeNode({ run: f.store.get(f.run.id), node, attempt, store: f.store, update: f.update, signal: new AbortController().signal });
  assert.deepEqual(output.artifacts, ["outputs/report.docx", "outputs/report.charts.json"]);
  assert.equal(reads.length, 2);
});
async function fixture(t) {
  const directory = await mkdtemp(path.join(tmpdir(), "workflow-runner-"));
  const store = createWorkflowStore(directory),
    db = createLocalDatabase(directory);
  const run = newRun({
    workspaceId: "test-workspace",
    input: "test",
    parameters: {},
    limits: { maxNodes: 12, timeoutMs: 1000 },
    config: {
      customSubAgents: [
        {
          id: agentId,
          label: "test",
          description: "test",
          enabled: true,
          enabledTools: ["mutate_local_database", "query_local_database"],
          enabledSkills: [],
          enabledMcps: [],
        },
      ],
    },
  });
  store.save(run);
  t.after(() => {
    store.close();
    db.close();
    return rm(directory, { recursive: true, force: true });
  });
  const update = (fn, type, payload) => {
    const r = store.get(run.id);
    fn(r);
    store.save(r, type, payload);
  };
  return { store, db, run, update, skillStore: createSkillStore(directory) };
}
test("planner decision terminates the current PI tool round instead of waiting on not-yet-started nodes", async (t) => {
  const f = await fixture(t);
  const runners = createWorkflowRunners({
    ...f,
    localDatabase: f.db,
    invokeAgent: async ({ tools, prompt }) => {
      assert.match(prompt, /Markdown 链接 \[名称\]\(项目相对路径\)/);
      assert.match(tools.find(t => t.name === "finish_workflow").description, /来源、日期等说明放在链接目标之外/);
      const submit = tools.find((t) => t.name === "submit_plan");
      const accepted = await submit.execute("call-1", {
        plan: { title: "test", nodes: [node] },
        reason: "test",
      });
      assert.equal(accepted.terminate, true);
      const late = await tools
        .find((t) => t.name === "request_input")
        .execute("call-2", { question: "should not override first decision" });
      assert.equal(late.terminate, true);
    },
  });
  const decision = await runners.plan({
    run: f.run,
    store: f.store,
    update: f.update,
    signal: new AbortController().signal,
  });
  assert.equal(decision.type, "plan");
});
test("node recovery queries committed state after lost response rather than repeating insert", async (t) => {
  const f = await fixture(t);
  f.db.mutate("CREATE TABLE records (id INTEGER PRIMARY KEY)");
  let pass = 0;
  const profileTools = async () => ({
    skills: { list: () => [] },
    mcps: [],
    tools: [
      {
        name: "mutate_local_database",
        execute: async () => {
          throw Error("runner must wrap SQL");
        },
      },
      {
        name: "query_local_database",
        execute: async (_id, args) => ({
          content: [
            { type: "text", text: JSON.stringify(f.db.query(args.sql)) },
          ],
          details: {},
        }),
      },
    ],
  });
  const runners = createWorkflowRunners({
    ...f,
    localDatabase: f.db,
    profileTools,
    invokeAgent: async ({ tools, input, prompt }) => {
      assert.match(prompt, /artifacts 字段仍填写原始项目相对路径字符串/);
      assert.match(tools.find(t => t.name === "complete_node").description, /不得用省略号截断 URL/);
      pass++;
      if (pass === 1) {
        await tools
          .find((t) => t.name === "mutate_local_database")
          .execute("write-1", { sql: "INSERT INTO records VALUES(1)" });
        throw Error("response lost after commit");
      }
      const context = JSON.parse(input);
      assert.equal(context.recovery.operations.length, 1);
      assert.equal(context.recovery.operations[0].status, "completed");
      const read = await tools
        .find((t) => t.name === "query_local_database")
        .execute("read-1", { sql: "SELECT COUNT(*) AS n FROM records" });
      assert.equal(JSON.parse(read.content[0].text).rows[0].n, 1);
      const completed = await tools
        .find((t) => t.name === "complete_node")
        .execute("complete", result);
      assert.equal(completed.terminate, true);
    },
  });
  const a = {
    id: "attempt-one",
    nodeId: "node",
    version: 0,
    status: "running",
  };
  f.update((r) => r.attempts.push(a));
  await assert.rejects(
    runners.executeNode({
      run: f.store.get(f.run.id),
      node,
      attempt: a,
      store: f.store,
      update: f.update,
      signal: new AbortController().signal,
    }),
    /response lost/,
  );
  f.update((r) => {
    r.attempts[0].status = "failed";
    r.attempts[0].error = "response lost";
    r.attempts.push({
      id: "attempt-two",
      nodeId: "node",
      version: 0,
      status: "running",
    });
  });
  const r = f.store.get(f.run.id);
  await runners.executeNode({
    run: r,
    node,
    attempt: r.attempts[1],
    store: f.store,
    update: f.update,
    signal: new AbortController().signal,
  });
  assert.equal(f.db.query("SELECT COUNT(*) AS n FROM records").rows[0].n, 1);
  assert.equal(
    f.store
      .get(f.run.id)
      .operations.filter((o) => o.tool === "mutate_local_database").length,
    1,
  );
});
test("write lock serializes mutating tools across separate node attempts", async (t) => {
  const f = await fixture(t);
  let active = 0,
    max = 0;
  const runners = createWorkflowRunners({
    ...f,
    localDatabase: f.db,
    profileTools: async () => ({
      skills: { list: () => [] },
      mcps: [],
      tools: [
        {
          name: "bash",
          execute: async () => {
            max = Math.max(max, ++active);
            await new Promise((r) => setTimeout(r, 15));
            active--;
            return { content: [], details: {} };
          },
        },
      ],
    }),
    invokeAgent: async ({ tools }) => {
      await tools.find((t) => t.name === "bash").execute("call-1", {});
      await tools
        .find((t) => t.name === "complete_node")
        .execute("complete", result);
    },
  });
  const a = { id: "a", nodeId: "node", version: 0, status: "running" },
    b = { ...a, id: "b" };
  f.update((r) => r.attempts.push(a, b));
  await Promise.all(
    [a, b].map((attempt) =>
      runners.executeNode({
        run: f.store.get(f.run.id),
        node,
        attempt,
        store: f.store,
        update: f.update,
        signal: new AbortController().signal,
      }),
    ),
  );
  assert.equal(max, 1);
});

test("node preparation failures create a correlated failed trace without changing recovery state", async (t) => {
  const f = await fixture(t);
  const directory = await mkdtemp(path.join(tmpdir(), "workflow-trace-"));
  const traceStore = createTraceStore(directory);
  t.after(async () => { traceStore.close(); await rm(directory, { recursive: true, force: true }); });
  const attempt = { id: "failed-setup-attempt", nodeId: node.id, version: 1, status: "running", startedAt: Date.now() };
  f.update((r) => { r.plan = { nodes: [node] }; r.attempts.push(attempt); });
  const runners = createWorkflowRunners({ ...f, traceStore, localDatabase: f.db, profileTools: async () => { throw new Error("能力初始化失败"); } });
  await assert.rejects(runners.executeNode({ run: f.store.get(f.run.id), node, attempt, signal: new AbortController().signal, store: f.store, update: f.update }), /能力初始化失败/);
  const run = f.store.get(f.run.id), trace = traceStore.getTrace(run.attempts[0].traceId);
  assert.equal(run.attempts[0].status, "running"); // The engine still owns attempt transitions.
  assert.equal(trace.run.status, "error");
  assert.equal(trace.run.context.attemptId, attempt.id);
  assert.equal(trace.run.context.workflowRunId, run.id);
  assert.equal(trace.run.context.agentLabel, "test");
  assert.equal(trace.spans[0].status, "error");
  assert.equal(trace.messages[0].content, node.task);
});
