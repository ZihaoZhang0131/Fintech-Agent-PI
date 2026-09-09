import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createTraceStore } from "../server/trace-store.mjs";
import { createWorkflowStore, newRun } from "../server/workflow/store.mjs";
import { createTraceQuery } from "../server/trace-query.mjs";
import { TraceRecorder } from "../server/agent/trace/trace-recorder.ts";
import {
  filterTraceTree,
  traceTree,
  traceAncestors,
} from "../lib/trace-view.ts";
const workspaceId = "trace-project-1234",
  now = Date.now();
async function fixture(t) {
  const directory = await mkdtemp(path.join(tmpdir(), "trace-query-"));
  const store = createTraceStore(directory),
    workflows = createWorkflowStore(directory);
  const query = createTraceQuery(store, workflows, () => "/private/project");
  t.after(async () => {
    store.close();
    workflows.close();
    await rm(directory, { recursive: true, force: true });
  });
  return { store, workflows, query, directory };
}
function addTrace(f, id, conversationId, start, context) {
  f.store.createRun({
    id,
    workspaceId,
    conversationId,
    startedAt: start,
    question: `问题 ${id}`,
    context,
  });
  const spans = [
    {
      id: `${id}-agent`,
      traceId: id,
      kind: "agent",
      agentLabel: "研究员",
      agentId: "researcher",
      name: "agent",
      startedAt: start,
      endedAt: start + 1000,
      status: "success",
    },
    {
      id: `${id}-llm`,
      traceId: id,
      parentSpanId: `${id}-agent`,
      kind: "generation",
      name: "model",
      startedAt: start,
      endedAt: start + 200,
      status: "success",
      output: { text: "结果", usage: { totalTokens: 12 } },
    },
    {
      id: `${id}-tool`,
      traceId: id,
      parentSpanId: `${id}-agent`,
      kind: "tool",
      name: "query",
      startedAt: start + 200,
      endedAt: start + 1000,
      status: "success",
    },
  ];
  f.store.appendBatch(id, { spans, events: [] });
  f.store.finishRun(id, {
    status: "success",
    endedAt: start + 1000,
    stats: {},
    usage: { totalTokens: 1000 },
    output: "回答",
  });
  return spans;
}
test("groups before pagination, uses distinct generation usage and scopes context by workspace", async (t) => {
  const f = await fixture(t);
  for (let i = 0; i < 55; i++)
    addTrace(f, `trace-test-${i}`, `conversation-${i}`, now + i * 2000, {
      mode: "chat",
    });
  addTrace(f, "trace-followup", "conversation-0", now + 200000, {
    mode: "chat",
  });
  const first = f.query.query(["sessions"], { workspaceId });
  assert.equal(first.items.length, 50);
  assert.ok(first.nextCursor);
  assert.equal(first.items[0].id, "chat:conversation-0");
  assert.equal(first.items[0].turns, 2);
  assert.equal(first.items[0].tokens, 24);
  assert.equal(first.items[0].tools, 2);
  assert.ok(!JSON.stringify(first).includes('"spans"'));
  assert.ok(!JSON.stringify(first).includes('"events"'));
  const second = f.query.query(["sessions"], {
    workspaceId,
    cursor: first.nextCursor,
  });
  assert.equal(second.items.length, 5);
  assert.equal(
    new Set([...first.items, ...second.items].map((r) => r.id)).size,
    55,
  );
  assert.equal(
    f.query.query(["sessions"], { workspaceId, query: "trace-followup" }).items
      .length,
    1,
  );
  assert.equal(
    f.query.query(["sessions"], { workspaceId, from: String(now + 199999) })
      .items.length,
    1,
  );
  assert.throws(
    () =>
      f.query.query(["context", "trace-followup"], {
        workspaceId: "other-project",
      }),
    /不存在/,
  );
  assert.throws(
    () =>
      f.query.query(["sessions", "chat:conversation-0"], {
        workspaceId: "other-project",
      }),
    /不存在/,
  );
  assert.throws(
    () => f.query.query(["sessions"], { workspaceId, cursor: "garbage" }),
    /游标/,
  );
  assert.throws(
    () => f.query.query(["sessions"], { workspaceId, from: "10", to: "1" }),
    /日期/,
  );
});
test("workflow migration links planner and attempts, shows retries, preserves wall duration and cleared traces", async (t) => {
  const f = await fixture(t);
  const run = newRun({
    workspaceId,
    conversationId: "workflow-conversation",
    input: "并行研究",
    config: { customSubAgents: [{ id: "reader", label: "数据 Agent" }] },
  });
  run.createdAt = now;
  run.status = "completed";
  run.version = 2;
  run.plan = {
    nodes: [
      {
        id: "a",
        title: "读取数据",
        task: "读取 /private/project 中的文件",
        agentId: "reader",
        dependencies: [],
      },
    ],
  };
  run.revisions = [
    { version: 1, plan: run.plan },
    { version: 2, plan: run.plan },
  ];
  run.traces = [
    "workflow-plan-trace",
    "workflow-node-first",
    "workflow-node-retry",
  ];
  run.attempts = [
    {
      id: "attempt-first",
      nodeId: "a",
      version: 1,
      traceId: run.traces[1],
      status: "blocked",
      startedAt: now,
      endedAt: now + 1000,
    },
    {
      id: "attempt-retry",
      nodeId: "a",
      version: 2,
      traceId: run.traces[2],
      status: "completed",
      startedAt: now + 500,
      endedAt: now + 1500,
      input: "secret=abcdefghij /private/project",
      result: { text: "成功" },
    },
  ];
  run.accepted = { a: "attempt-retry" };
  run.summary = "研究完成";
  f.workflows.save(run);
  for (const id of run.traces) addTrace(f, id, undefined, now);
  let result = f.query.query(["sessions"], { workspaceId });
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0].mode, "workflow");
  assert.equal(result.items[0].warnings, 1);
  assert.equal(f.query.query(["sessions"], { workspaceId, status: "success" }).items.length, 1);
  assert.equal(result.items[0].tokens, 36);
  const invocation = f.query.query(["invocations"], { workspaceId });
  assert.equal(invocation.items.length, 2);
  assert.deepEqual(invocation.items.map((i) => i.attemptNumber).sort(), [1, 2]);
  assert.equal(
    invocation.items.find((i) => i.attemptNumber === 1).status,
    "blocked",
  );
  assert.equal(
    invocation.items.find((i) => i.attemptNumber === 1).workflowOutcome,
    "blocked",
  );
  assert.equal(
    f.store.getTrace(run.traces[1]).run.context.attemptId,
    "attempt-first",
  );
  const context = f.query.query(["context", run.traces[2]], { workspaceId });
  assert.equal(context.taskId, run.id);
  const detail = f.query.query(
    ["sessions", context.sessionKey, "tasks", run.id],
    { workspaceId },
  );
  assert.equal(detail.task.endedAt, f.workflows.get(run.id).updatedAt);
  assert.equal(detail.attempts[1].accepted, true);
  assert.equal(detail.attempts[0].accepted, false);
  assert.equal(detail.attempts[0].executionStatus, "success");
  assert.equal(detail.attempts[0].workflowOutcome, "blocked");
  assert.ok(!JSON.stringify(detail.attempts).includes("abcdefghij"));
  assert.ok(!JSON.stringify(detail.attempts).includes("/private/project"));
  const tree = traceTree(detail),
    node = tree.find((n) => n.kind === "node");
  assert.equal(node.children.length, 2);
  assert.match(node.children[0].note, /执行成功 \/ 节点受阻/);
  assert.equal(node.startedAt, now);
  assert.equal(node.endedAt, now + 1500);
  f.store.deleteTrace(run.traces[0]);
  result = f.query.query(["sessions"], { workspaceId });
  assert.equal(result.items[0].tokens, 24);
  assert.equal(result.items[0].incomplete, true);
  f.store.clearTraces(workspaceId);
  assert.equal(f.query.query(["sessions"], { workspaceId }).items.length, 0);
  assert.equal(f.workflows.get(run.id).status, "completed");
});
test("recorder persists partial replies, isolates repeated child calls and closes failed starts", async (t) => {
  const f = await fixture(t),
    traceId = "trace-recorder-new";
  const recorder = new TraceRecorder({
    id: traceId,
    workspaceId,
    conversationId: "conversation-recorder",
    startedAt: now,
    question: "研究",
    workspacePath: "/private/project",
    context: { mode: "chat" },
    sink: {
      async start(v) {
        f.store.createRun(v);
      },
      async append(id, v) {
        f.store.appendBatch(id, v);
      },
      async finish(id, v) {
        f.store.finishRun(id, v);
      },
    },
  });
  await recorder.start();
  const main = recorder.attachAgent({
    agentId: "main",
    scopeKey: "main",
    agentLabel: "主 Agent",
    modelProvider: "test",
    modelId: "model",
    isRoot: true,
  });
  main.onEvent({ type: "turn_start" });
  main.onEvent({
    type: "tool_execution_start",
    toolCallId: "delegate",
    toolName: "delegate_agent",
    args: {},
  });
  const parentSpanId = recorder.getToolSpanId("main", "delegate");
  const child = recorder.attachAgent({
    agentId: "same-agent",
    agentLabel: "研究员",
    modelProvider: "test",
    modelId: "model",
    parentSpanId,
    input: "任务一 secret=abcdefghij",
  });
  child.finish(new Error("模型配置错误"));
  const child2 = recorder.attachAgent({
    agentId: "same-agent",
    agentLabel: "研究员",
    modelProvider: "test",
    modelId: "model",
    parentSpanId,
    input: "任务二",
  });
  const msg = { role: "assistant", content: [], timestamp: now };
  child2.onEvent({ type: "message_start", message: msg });
  child2.onEvent({
    type: "message_update",
    assistantMessageEvent: {
      type: "text_delta",
      delta: "部分回复 /private/project",
    },
  });
  await recorder.flush();
  let detail = f.store.getTrace(traceId);
  assert.equal(detail.messages.filter((m) => m.role === "assistant").length, 1);
  assert.equal(
    detail.messages.find((m) => m.role === "assistant").partial,
    true,
  );
  child2.finish(undefined, true);
  recorder.markAborted();
  await recorder.finish();
  detail = f.store.getTrace(traceId);
  assert.equal(detail.run.status, "aborted");
  const children = detail.spans.filter(
    (s) => s.kind === "agent" && s.parentSpanId,
  );
  assert.deepEqual(children.map((s) => s.status).sort(), [
    "cancelled",
    "error",
  ]);
  assert.ok(!JSON.stringify(detail).includes("abcdefghij"));
  assert.ok(!JSON.stringify(detail).includes("/private/project"));
  const calls = f.query.query(["invocations"], { workspaceId }).items;
  assert.equal(calls.length, 2);
  const second = calls.find((c) => c.question === "任务二");
  const messages = f.query.query(["sessions", second.sessionKey, "messages"], {
    workspaceId,
    invocationId: second.id,
  });
  assert.equal(messages.items.length, 2);
  assert.ok(!JSON.stringify(messages).includes("任务一"));
  const publicMessages = f.query.query(
    ["sessions", second.sessionKey, "messages"],
    { workspaceId },
  );
  assert.equal(publicMessages.items.length, 1);
  assert.equal(publicMessages.items[0].content, "研究");
  f.store.appendBatch(traceId, {
    messages: [{ ...detail.messages[0], content: "late" }],
  });
  assert.ok(
    !f.store.getTrace(traceId).messages.some((m) => m.content === "late"),
  );
});
test("tree filters keep matching ancestry, preserve parallel times and tolerate missing parents", () => {
  const root = {
    id: "root",
    kind: "agent",
    name: "main",
    status: "success",
    startedAt: 0,
    children: [
      {
        id: "tool",
        kind: "tool",
        name: "search",
        status: "error",
        startedAt: 10,
        children: [],
      },
      {
        id: "llm",
        kind: "generation",
        name: "model",
        status: "success",
        startedAt: 10,
        children: [],
      },
    ],
  };
  const filtered = filterTraceTree([root], "search", "tool", "error");
  assert.equal(filtered[0].id, "root");
  assert.deepEqual(
    filtered[0].children.map((n) => n.id),
    ["tool"],
  );
  assert.deepEqual(traceAncestors(filtered, "tool"), ["root", "tool"]);
  const tree = traceTree({
    task: {},
    attempts: [],
    traces: [
      {
        run: {},
        spans: [
          {
            id: "orphan",
            kind: "tool",
            name: "orphan",
            parentSpanId: "absent",
            startedAt: 3,
          },
        ],
      },
    ],
  });
  assert.equal(tree[0].id, "orphan");
});
test("large model replies retain usage and stable message snapshots across store reopen", async (t) => {
  const f = await fixture(t),
    id = "trace-large-reply";
  const recorder = new TraceRecorder({
    id,
    workspaceId,
    conversationId: "large-conversation",
    startedAt: now,
    question: "长回答",
    context: { mode: "chat" },
    sink: {
      async start(v) {
        f.store.createRun(v);
      },
      async append(id, v) {
        f.store.appendBatch(id, v);
      },
      async finish(id, v) {
        f.store.finishRun(id, v);
      },
    },
  });
  await recorder.start();
  const main = recorder.attachAgent({
    agentId: "main",
    agentLabel: "主 Agent",
    modelProvider: "test",
    modelId: "model",
    isRoot: true,
  });
  main.onEvent({ type: "turn_start" });
  const message = {
    role: "assistant",
    content: [{ type: "text", text: "正文".repeat(10000) }],
    stopReason: "stop",
    timestamp: now,
    usage: { input: 100, output: 20000, totalTokens: 20100, cost: {} },
  };
  main.onEvent({ type: "message_start", message });
  main.onEvent({ type: "message_end", message });
  main.onEvent({ type: "agent_end", messages: [message] });
  await recorder.finish();
  assert.equal(
    f.query.query(["sessions"], { workspaceId }).items[0].tokens,
    20100,
  );
  const messages = f.query.query(
    ["sessions", "chat:large-conversation", "messages"],
    { workspaceId },
  );
  assert.equal(
    messages.items.find((m) => m.role === "assistant").content,
    message.content[0].text,
  );
  const reopened = createTraceStore(f.directory);
  t.after(() => reopened.close());
  assert.equal(reopened.getTrace(id).messages.length, 2);
  assert.equal(reopened.getTrace(id).run.context.mode, "chat");
});
