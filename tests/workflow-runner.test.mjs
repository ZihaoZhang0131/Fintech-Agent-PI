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
  requires: { tools: [], skills: [], mcps: [] },
  outputs: [{ id: "result", kind: "text", required: true }],
};
const result = {
  status: "completed",
  summary: "ok",
  text: "ok",
  sources: [],
  artifacts: [],
  issues: [],
  nextAction: "continue",
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
test("planner rejects submit_plan after an initial plan exists", async (t) => {
  const f = await fixture(t);
  f.run.plan = { title: "existing", nodes: [node] };
  const runners = createWorkflowRunners({
    ...f,
    localDatabase: f.db,
    invokeAgent: async ({ tools }) => {
      await tools.find((tool) => tool.name === "submit_plan").execute(
        "second-submit",
        { plan: f.run.plan, reason: "replace everything" },
      );
    },
  });
  await assert.rejects(
    runners.plan({
      run: f.run,
      store: f.store,
      update: f.update,
      signal: new AbortController().signal,
    }),
    /只能用于初始规划/,
  );
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
      assert.equal(context.recovery.operations, undefined);
      assert.equal(context.recovery.latestAttempt.status, "failed");
      const reused = await tools
        .find((t) => t.name === "mutate_local_database")
        .execute("write-2", { sql: "INSERT INTO records VALUES(1)" });
      assert.equal(JSON.parse(reused.content[0].text).changes, 1);
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
    2,
  );
  assert.ok(
    f.store
      .get(f.run.id)
      .operations.find((operation) => operation.reusedFrom),
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

test("required file output is converted to blocked when the declared artifact is missing", async (t) => {
  const f = await fixture(t);
  const fileNode = {
    ...node,
    requires: { tools: ["generate_document"], skills: [], mcps: [] },
    outputs: [
      {
        id: "report",
        kind: "file",
        path: "outputs/report.docx",
        required: true,
      },
    ],
  };
  const attempt = {
    id: "missing-artifact-attempt",
    nodeId: fileNode.id,
    nodeRevision: 1,
    version: 1,
    status: "running",
  };
  f.update((run) => run.attempts.push(attempt));
  const runners = createWorkflowRunners({
    ...f,
    localDatabase: f.db,
    profileTools: async () => ({
      skills: { list: () => [] },
      mcps: [],
      tools: [{ name: "generate_document", execute: async () => result }],
    }),
    invokeAgent: async ({ tools }) => {
      await tools.find((tool) => tool.name === "complete_node").execute(
        "complete",
        { ...result, artifacts: [] },
      );
    },
  });
  const output = await runners.executeNode({
    run: f.store.get(f.run.id),
    node: fileNode,
    attempt,
    store: f.store,
    update: f.update,
    signal: new AbortController().signal,
  });
  assert.equal(output.status, "blocked");
  assert.equal(output.nextAction, "replan");
  assert.match(output.issues.join(" "), /outputs\/report\.docx/);
});

test("node handoff includes direct summaries and every accepted ancestor artifact without full history text", async (t) => {
  const f = await fixture(t);
  const a = { ...node, id: "a", title: "a" },
    b = { ...node, id: "b", title: "b", dependencies: ["a"] },
    c = { ...node, id: "c", title: "c", dependencies: ["b"] };
  const huge = "x".repeat(100000);
  f.update((run) => {
    run.plan = { title: "ancestors", nodes: [a, b, c] };
    run.nodeRevisions = { a: 1, b: 1, c: 1 };
    run.attempts.push(
      {
        id: "attempt-a",
        nodeId: "a",
        nodeRevision: 1,
        version: 1,
        status: "completed",
        result: {
          ...result,
          text: huge,
          artifacts: ["outputs/a.txt"],
        },
      },
      {
        id: "attempt-b",
        nodeId: "b",
        nodeRevision: 1,
        version: 1,
        status: "completed",
        result: {
          ...result,
          text: huge,
          artifacts: ["outputs/b.txt"],
        },
      },
      {
        id: "attempt-c",
        nodeId: "c",
        nodeRevision: 1,
        version: 1,
        status: "running",
      },
    );
    run.accepted = { a: "attempt-a", b: "attempt-b" };
  });
  const attempt = f.store.get(f.run.id).attempts.at(-1);
  const runners = createWorkflowRunners({
    ...f,
    localDatabase: f.db,
    profileTools: async () => ({
      skills: { list: () => [] },
      mcps: [],
      tools: [],
    }),
    invokeAgent: async ({ tools, input }) => {
      const context = JSON.parse(input);
      assert.equal(context.upstream.length, 1);
      assert.equal(context.upstream[0].result.textPreview.length, 2000);
      assert.deepEqual(
        context.ancestorArtifacts.map((item) => item.nodeId).sort(),
        ["a", "b"],
      );
      assert.ok(input.length < 10000);
      const read = await tools
        .find((tool) => tool.name === "read_node_result")
        .execute("read-a", { attemptId: "attempt-a", offset: 0 });
      assert.equal(JSON.parse(read.content[0].text).total > 100000, true);
      await tools
        .find((tool) => tool.name === "complete_node")
        .execute("complete", result);
    },
  });
  await runners.executeNode({
    run: f.store.get(f.run.id),
    node: c,
    attempt,
    store: f.store,
    update: f.update,
    signal: new AbortController().signal,
  });
});

test("large tool output is stored once and exposed through a compact preview plus paged operation read", async (t) => {
  const f = await fixture(t);
  const large = "z".repeat(30000);
  const attempt = {
    id: "large-output-attempt",
    nodeId: node.id,
    nodeRevision: 1,
    version: 1,
    status: "running",
  };
  f.update((run) => run.attempts.push(attempt));
  const runners = createWorkflowRunners({
    ...f,
    localDatabase: f.db,
    profileTools: async () => ({
      skills: { list: () => [] },
      mcps: [],
      tools: [
        {
          name: "web_search",
          execute: async () => ({
            content: [{ type: "text", text: large }],
            details: {},
          }),
        },
      ],
    }),
    invokeAgent: async ({ tools }) => {
      const compact = await tools
        .find((tool) => tool.name === "web_search")
        .execute("large-call", { query: "test" });
      const descriptor = JSON.parse(compact.content[0].text);
      assert.equal(descriptor.truncated, true);
      assert.equal(descriptor.preview.length, 8000);
      const page = await tools
        .find((tool) => tool.name === "read_operation_result")
        .execute("read-operation", {
          operationId: descriptor.operationId,
          offset: 0,
        });
      assert.equal(JSON.parse(page.content[0].text).text.length, 20000);
      await tools
        .find((tool) => tool.name === "complete_node")
        .execute("complete", result);
    },
  });
  await runners.executeNode({
    run: f.store.get(f.run.id),
    node,
    attempt,
    store: f.store,
    update: f.update,
    signal: new AbortController().signal,
  });
  assert.ok(
    JSON.stringify(f.store.get(f.run.id).operations[0].result).length > 30000,
  );
});

test("non-zero bash exit stays model-visible and records command_failed outcome", async (t) => {
  const f = await fixture(t);
  const attempt = {
    id: "bash-failure-attempt",
    nodeId: node.id,
    nodeRevision: 1,
    version: 1,
    status: "running",
  };
  f.update((run) => run.attempts.push(attempt));
  const runners = createWorkflowRunners({
    ...f,
    localDatabase: f.db,
    profileTools: async () => ({
      skills: { list: () => [] },
      mcps: [],
      tools: [
        {
          name: "bash",
          execute: async () => ({
            content: [{ type: "text", text: "stderr" }],
            details: { exitCode: 126, timedOut: false },
          }),
        },
      ],
    }),
    invokeAgent: async ({ tools }) => {
      const value = await tools
        .find((tool) => tool.name === "bash")
        .execute("bash-call", { command: "fixture" });
      assert.equal(value.details.exitCode, 126);
      await tools
        .find((tool) => tool.name === "complete_node")
        .execute("complete", result);
    },
  });
  await runners.executeNode({
    run: f.store.get(f.run.id),
    node,
    attempt,
    store: f.store,
    update: f.update,
    signal: new AbortController().signal,
  });
  const operation = f.store.get(f.run.id).operations[0];
  assert.equal(operation.outcome, "command_failed");
  assert.equal(operation.exitCode, 126);
});

test("Python analysis is fingerprinted as a write and an unknown execution is not repeated", async (t) => {
  const f = await fixture(t);
  let pass = 0;
  let executions = 0;
  const profileTools = async () => ({
    skills: { list: () => [] },
    mcps: [],
    tools: [
      {
        name: "python_analysis",
        execute: async () => {
          executions += 1;
          throw new Error("response lost after possible artifact write");
        },
      },
    ],
  });
  const runners = createWorkflowRunners({
    ...f,
    localDatabase: f.db,
    profileTools,
    invokeAgent: async ({ tools, prompt }) => {
      pass += 1;
      assert.match(prompt, /固定禁网且只能写 outputs\/python/);
      await tools
        .find((tool) => tool.name === "python_analysis")
        .execute(`python-${pass}`, { code: "print(6)" });
    },
  });
  for (const id of ["python-attempt-1", "python-attempt-2"]) {
    const attempt = {
      id,
      nodeId: node.id,
      nodeRevision: 1,
      version: 1,
      status: "running",
    };
    f.update((run) => run.attempts.push(attempt));
    await assert.rejects(
      runners.executeNode({
        run: f.store.get(f.run.id),
        node,
        attempt,
        store: f.store,
        update: f.update,
        signal: new AbortController().signal,
      }),
      id.endsWith("1") ? /possible artifact write/ : /写操作结果不确定/,
    );
  }
  assert.equal(executions, 1);
  const operation = f.store.get(f.run.id).operations[0];
  assert.equal(operation.tool, "python_analysis");
  assert.equal(operation.status, "unknown");
  assert.equal(typeof operation.fingerprint, "string");
});

test("an unknown write is not mechanically repeated on the next attempt", async (t) => {
  const f = await fixture(t);
  let pass = 0,
    writes = 0;
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
            writes++;
            throw new Error("lost after possible side effect");
          },
        },
      ],
    }),
    invokeAgent: async ({ tools }) => {
      pass++;
      const bash = tools.find((tool) => tool.name === "bash");
      if (pass === 1) {
        await bash.execute("write-one", { command: "fixture" });
        return;
      }
      await assert.rejects(
        bash.execute("write-two", { command: "fixture" }),
        /结果不确定/,
      );
      await tools.find((tool) => tool.name === "complete_node").execute(
        "complete",
        {
          ...result,
          status: "blocked",
          nextAction: "input",
          issues: ["需要核验副作用"],
        },
      );
    },
  });
  const first = {
    id: "unknown-write-one",
    nodeId: node.id,
    nodeRevision: 1,
    version: 1,
    status: "running",
  };
  f.update((run) => run.attempts.push(first));
  await assert.rejects(
    runners.executeNode({
      run: f.store.get(f.run.id),
      node,
      attempt: first,
      store: f.store,
      update: f.update,
      signal: new AbortController().signal,
    }),
    /possible side effect/,
  );
  f.update((run) => {
    run.attempts[0].status = "failed";
    run.attempts.push({
      id: "unknown-write-two",
      nodeId: node.id,
      nodeRevision: 1,
      version: 1,
      status: "running",
    });
  });
  const second = f.store.get(f.run.id).attempts.at(-1);
  const output = await runners.executeNode({
    run: f.store.get(f.run.id),
    node,
    attempt: second,
    store: f.store,
    update: f.update,
    signal: new AbortController().signal,
  });
  assert.equal(output.status, "blocked");
  assert.equal(writes, 1);
  assert.equal(f.store.get(f.run.id).operations.length, 1);
  assert.equal(f.store.get(f.run.id).operations[0].status, "unknown");
});
