import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { TraceRecorder } from "../server/agent/trace/trace-recorder.ts";
import { createLocalRuntimeHandler } from "../server/local-runtime.mjs";
import { redactTraceText, redactTraceValue } from "../server/trace-redaction.mjs";
import { createTraceStore } from "../server/trace-store.mjs";

test("trace redaction removes secrets, workspace paths, and oversized values", () => {
  const text = redactTraceText(
    "Authorization: Bearer abcdefghijklmnop /Users/test/workspace/report.md api_key=supersecret123",
    { workspacePath: "/Users/test/workspace" },
  );
  assert.doesNotMatch(text, /abcdefghijklmnop|supersecret123|\/Users\/test\/workspace/);
  assert.match(text, /\[REDACTED\]|<workspace>/);

  const usage = redactTraceValue({
    inputTokens: 120,
    outputTokens: 30,
    totalTokens: 150,
    reasoningTokens: 12,
  }, { maxBytes: 1_000 });
  assert.deepEqual(usage, { inputTokens: 120, outputTokens: 30, totalTokens: 150, reasoningTokens: 12 });

  const value = redactTraceValue({ token: "secret", nested: { output: "x".repeat(40_000) } }, { maxBytes: 1_000 });
  const serialized = JSON.stringify(value);
  assert.doesNotMatch(serialized, /secret/);
  assert.match(serialized, /size_limit/);
});

test("trace store writes a separate database, queries details, deletes cascades, and applies retention", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "pi-trace-store-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  let clock = Date.now();
  const store = createTraceStore(root, { now: () => clock, maxRuns: 2, maxAgeMs: 1_000, staleAfterMs: 100 });
  t.after(() => store.close());

  for (let index = 0; index < 3; index += 1) {
    const id = `trace_test_${index}_12345678`;
    store.createRun({
      id,
      workspaceId: "workspace_test_12345678",
      conversationId: "conversation_test_12345678",
      startedAt: clock,
      question: `问题 ${index}`,
      capabilities: { authorization: "Bearer abcdefghijklmnop" },
    });
    store.appendBatch(id, {
      spans: [{ id: `span_test_${index}_12345678`, kind: "agent", name: "main", status: "success", startedAt: clock, endedAt: clock + 5 }],
      events: [{ seq: 1, type: "agent_start", timestamp: clock, payload: { apiKey: "secret-value" } }],
    });
    store.finishRun(id, { status: "success", endedAt: clock + 10, output: "完成", usage: { totalTokens: index }, stats: { turns: 1 } });
    clock += 10;
  }

  const listed = store.listTraces({ workspaceId: "workspace_test_12345678", limit: 10 });
  assert.equal(listed.traces.length, 2);
  assert.equal(listed.traces[0].question, "问题 2");
  const detail = store.getTrace("trace_test_2_12345678");
  assert.equal(detail.spans.length, 1);
  assert.equal(detail.events.length, 1);
  assert.doesNotMatch(JSON.stringify(detail), /secret-value|abcdefghijklmnop/);
  assert.notEqual(path.basename(store.databasePath), "database.sqlite");
  assert.ok((await readFile(store.databasePath)).length > 0);

  store.deleteTrace("trace_test_2_12345678");
  assert.throws(() => store.getTrace("trace_test_2_12345678"), /不存在/);
  assert.equal(store.clearTraces("workspace_test_12345678").removed, 1);
});

test("trace store marks stale running traces interrupted", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "pi-trace-stale-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  let clock = Date.now();
  const store = createTraceStore(root, { now: () => clock, staleAfterMs: 100 });
  t.after(() => store.close());
  store.createRun({ id: "trace_stale_12345678", workspaceId: "workspace_stale_12345678", startedAt: clock, question: "未完成" });
  clock += 101;
  store.cleanup();
  assert.equal(store.getTrace("trace_stale_12345678").run.status, "interrupted");
});

test("trace store makes user abort terminal and honors an early pending abort", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "pi-trace-abort-store-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const store = createTraceStore(root);
  t.after(() => store.close());

  store.createRun({ id: "trace_abort_store_12345678", workspaceId: "workspace_abort_store_12345678", startedAt: Date.now(), question: "停止" });
  store.appendBatch("trace_abort_store_12345678", {
    spans: [{ id: "span_abort_store_12345678", traceId: "trace_abort_store_12345678", kind: "agent", name: "invoke_agent", status: "running", startedAt: Date.now() }],
    events: [{ seq: 1, type: "agent_start", timestamp: Date.now() }],
  });
  assert.equal(store.requestAbort("trace_abort_store_12345678").active, true);
  assert.equal(store.getTrace("trace_abort_store_12345678").run.status, "aborted");
  assert.equal(store.getTrace("trace_abort_store_12345678").spans[0].status, "cancelled");
  assert.equal(store.appendBatch("trace_abort_store_12345678", { spans: [], events: [{ seq: 99, type: "late", timestamp: Date.now() }] }).ignored, true);
  store.finishRun("trace_abort_store_12345678", { status: "success", endedAt: Date.now(), stats: {}, usage: {} });
  assert.equal(store.getTrace("trace_abort_store_12345678").run.status, "aborted");

  assert.equal(store.requestAbort("trace_early_abort_12345678").active, false);
  store.createRun({ id: "trace_early_abort_12345678", workspaceId: "workspace_abort_store_12345678", startedAt: Date.now(), question: "提前停止" });
  assert.equal(store.isAbortRequested("trace_early_abort_12345678"), true);
  assert.equal(store.getTrace("trace_early_abort_12345678").run.status, "aborted");
});

test("local Runtime protects Trace ingestion and exposes query and deletion routes", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "pi-trace-runtime-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const server = createServer(createLocalRuntimeHandler({
    dataDirectory: root,
    token: "trace-test-token",
    mcpManager: { listServers: async () => [], close: async () => {} },
  }));
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;
  const headers = { Authorization: "Bearer trace-test-token", "Content-Type": "application/json" };

  assert.equal((await fetch(`${baseUrl}/traces`)).status, 401);
  const created = await fetch(`${baseUrl}/trace-ingest/runs`, {
    method: "POST",
    headers,
    body: JSON.stringify({ id: "trace_runtime_12345678", workspaceId: "workspace_runtime_12345678", startedAt: Date.now(), question: "Runtime Trace" }),
  });
  assert.equal(created.status, 201);
  assert.equal((await fetch(`${baseUrl}/trace-ingest/runs/trace_runtime_12345678/abort`, { headers })).status, 200);
  assert.equal((await fetch(`${baseUrl}/trace-ingest/runs/trace_runtime_12345678/events`, {
    method: "POST",
    headers,
    body: JSON.stringify({ spans: [], events: [{ seq: 1, type: "agent_start", timestamp: Date.now() }] }),
  })).status, 202);
  assert.equal((await fetch(`${baseUrl}/trace-ingest/runs/trace_runtime_12345678`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ status: "success", endedAt: Date.now(), stats: { tools: 0 }, usage: { totalTokens: 2 } }),
  })).status, 200);
  const detail = await fetch(`${baseUrl}/traces/trace_runtime_12345678`, { headers }).then((response) => response.json());
  assert.equal(detail.run.status, "success");
  assert.equal(detail.events[0].type, "agent_start");
  const listing = await fetch(`${baseUrl}/traces?workspaceId=workspace_runtime_12345678`, { headers }).then((response) => response.json());
  assert.equal(listing.traces.length, 1);
  assert.equal((await fetch(`${baseUrl}/traces/trace_runtime_12345678`, { method: "DELETE", headers })).status, 200);
});

test("trace recorder builds nested main, tool, and sub-agent spans with aggregate usage", async () => {
  const batches = [];
  let finished;
  const sink = {
    async start() {},
    async append(_traceId, batch) { batches.push(structuredClone(batch)); },
    async finish(_traceId, payload) { finished = structuredClone(payload); },
  };
  const recorder = new TraceRecorder({
    id: "trace_recorder_12345678",
    sink,
    workspaceId: "workspace_recorder_12345678",
    conversationId: "conversation_recorder_12345678",
    startedAt: Date.now(),
    modelProvider: "test",
    modelId: "test-model",
    question: "研究问题",
  });
  assert.equal(await recorder.start(), true);
  const main = recorder.attachAgent({ scopeKey: "main", agentId: "main", agentLabel: "主 Agent", modelProvider: "test", modelId: "test-model", isRoot: true });
  main.onEvent({ type: "agent_start" });
  main.onEvent({ type: "turn_start" });
  const message = {
    role: "assistant",
    content: [{ type: "text", text: "调用研究员" }],
    api: "openai-completions",
    provider: "test",
    model: "test-model",
    usage: { input: 10, output: 5, cacheRead: 0, cacheWrite: 0, totalTokens: 15, cost: { input: 1, output: 2, cacheRead: 0, cacheWrite: 0, total: 3 } },
    stopReason: "toolUse",
    timestamp: Date.now(),
  };
  main.onEvent({ type: "message_start", message });
  main.onEvent({ type: "message_end", message });
  main.onEvent({ type: "tool_execution_start", toolCallId: "delegate-call", toolName: "delegate_agent", args: { task: "查数据" } });
  const parentSpanId = recorder.getToolSpanId("main", "delegate-call");
  assert.ok(parentSpanId);
  const child = recorder.attachAgent({ agentId: "custom-data", agentLabel: "数据 Agent", modelProvider: "test", modelId: "child-model", parentSpanId });
  child.onEvent({ type: "agent_start" });
  child.onEvent({ type: "turn_start" });
  const childMessage = { ...message, model: "child-model", content: [{ type: "text", text: "子 Agent 结果" }], usage: { ...message.usage, totalTokens: 7, input: 4, output: 3 }, stopReason: "stop" };
  child.onEvent({ type: "message_start", message: childMessage });
  child.onEvent({ type: "message_end", message: childMessage });
  child.onEvent({ type: "turn_end", message: childMessage, toolResults: [] });
  child.onEvent({ type: "agent_end", messages: [childMessage] });
  main.onEvent({ type: "tool_execution_end", toolCallId: "delegate-call", toolName: "delegate_agent", result: { content: [{ type: "text", text: "子 Agent 结果" }], details: { status: "completed" } }, isError: false });
  const finalMessage = { ...message, content: [{ type: "text", text: "最终答案" }], stopReason: "stop", usage: { ...message.usage, totalTokens: 8, input: 5, output: 3 } };
  main.onEvent({ type: "turn_end", message, toolResults: [] });
  main.onEvent({ type: "turn_start" });
  main.onEvent({ type: "message_start", message: finalMessage });
  main.onEvent({ type: "message_end", message: finalMessage });
  main.onEvent({ type: "turn_end", message: finalMessage, toolResults: [] });
  main.onEvent({ type: "agent_end", messages: [finalMessage] });
  await recorder.finish();

  const spans = batches.flatMap((batch) => batch.spans);
  const childAgent = spans.find((span) => span.kind === "agent" && span.agentId === "custom-data");
  assert.equal(childAgent.parentSpanId, parentSpanId);
  assert.equal(finished.status, "success");
  assert.equal(finished.output, "最终答案");
  assert.equal(finished.usage.totalTokens, 30);
  assert.equal(finished.stats.subAgents, 1);
  assert.equal(finished.stats.tools, 1);
});

test("trace recorder preserves parallel tools and finalizes an aborted run", async () => {
  const batches = [];
  let finished;
  const recorder = new TraceRecorder({
    id: "trace_abort_12345678",
    sink: {
      async start() {},
      async append(_traceId, batch) { batches.push(structuredClone(batch)); },
      async finish(_traceId, payload) { finished = structuredClone(payload); },
    },
    workspaceId: "workspace_abort_12345678",
    startedAt: Date.now(),
    modelProvider: "test",
    modelId: "model",
    question: "停止任务",
  });
  await recorder.start();
  const main = recorder.attachAgent({ scopeKey: "main", agentId: "main", agentLabel: "主 Agent", modelProvider: "test", modelId: "model", isRoot: true });
  main.onEvent({ type: "agent_start" });
  main.onEvent({ type: "turn_start" });
  main.onEvent({ type: "tool_execution_start", toolCallId: "tool-a", toolName: "web_search", args: { query: "A" } });
  main.onEvent({ type: "tool_execution_start", toolCallId: "tool-b", toolName: "bash", args: { command: "sleep 10" } });
  main.onEvent({ type: "tool_execution_update", toolCallId: "tool-b", toolName: "bash", args: {}, partialResult: { details: { status: "pending_approval" }, content: [] } });
  main.onEvent({ type: "tool_execution_end", toolCallId: "tool-a", toolName: "web_search", result: { content: [], details: { timedOut: true } }, isError: true });
  recorder.markAborted();
  main.onEvent({ type: "agent_end", messages: [] });
  await recorder.finish();

  const latestSpans = new Map();
  for (const span of batches.flatMap((batch) => batch.spans)) latestSpans.set(span.id, span);
  const tools = [...latestSpans.values()].filter((span) => span.kind === "tool");
  assert.equal(tools.length, 2);
  assert.ok(tools.some((span) => span.status === "error"));
  assert.ok(tools.some((span) => span.status === "cancelled"));
  assert.equal(finished.status, "aborted");
  assert.equal(finished.stats.warnings, 1);
  assert.ok(batches.flatMap((batch) => batch.events).some((event) => event.type === "tool_execution_update"));
});
