import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { AgentHarness } from "@earendil-works/pi-agent-core";
import { createAssistantMessageEventStream } from "@earendil-works/pi-ai";
import { Type } from "typebox";
import { createChatStore } from "../server/chat-store.mjs";
import { createChatRuntimeStore } from "../server/chat/store.mjs";
import { createChatSessionManager } from "../server/chat/manager.mjs";
import { createContextManager, boundToolResult, resultReader, textTokens } from "../server/chat/context.mjs";
import { chatConfig } from "../server/chat/config.mjs";
import { createChatHttp } from "../server/chat/http.mjs";
import { createLocalRuntimeHandler } from "../server/local-runtime.mjs";
import { prepareChatAgent } from "../server/chat/agent.ts";
import { createTraceStore } from "../server/trace-store.mjs";
import { prepareChatSubmission } from "../lib/chat-submission.ts";

const threadId = "thread-12345678";
const usage = { input: 10, output: 2, cacheRead: 0, cacheWrite: 0, totalTokens: 12, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } };
const model = { id: "fake", name: "fake", provider: "fake", api: "openai-completions", contextWindow: 32000, maxTokens: 4096, reasoning: false, input: ["text"], cost: usage.cost };
const assistant = (content = [{ type: "text", text: "完成" }]) => ({ role: "assistant", api: model.api, model: model.id, provider: model.provider, content, stopReason: content.some(c => c.type === "toolCall") ? "toolUse" : "stop", usage, timestamp: Date.now() });
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };
const textOf = m => typeof m.content === "string" ? m.content : (m.content ?? []).filter(c => c.type === "text").map(c => c.text).join("");

async function fixture(t, messages = []) {
  const dir = await mkdtemp(path.join(tmpdir(), "pi-chat-harness-"));
  t.after(() => rm(dir, { force: true, recursive: true }));
  const legacy = createChatStore(dir);
  legacy.put({ id: threadId, projectId: "project-12345678", title: "新对话", messages, updatedAt: Date.now(), bashApprovalMode: "ask", bashPermissionMode: "sandbox" });
  legacy.close(); return dir;
}

function fakePrepare(handler, tools = [], subscribe) {
  return async (_payload, options) => {
    const models = { streamSimple(_model, context, opts) {
      const stream = createAssistantMessageEventStream();
      void (async () => {
        try {
          const message = await handler(context, opts);
          stream.push({ type: "start", partial: { ...message, content: [] } });
          for (const [contentIndex, c] of message.content.entries()) if (c.type === "text") stream.push({ type: "text_delta", delta: c.text, contentIndex, partial: message });
          stream.push({ type: "done", reason: message.stopReason, message });
        } catch (error) { stream.push({ type: "error", reason: "aborted", error: { ...assistant(), stopReason: "aborted", errorMessage: error.message } }); }
      })();
      return stream;
    } };
    const agent = new AgentHarness({ session: options.session, models, model, tools, systemPrompt: "谨慎研究" });
    let activeAssistantItemId;
    agent.subscribe(e => {
      if (e.type === "message_start" && e.message.role === "assistant") {
        activeAssistantItemId = crypto.randomUUID();
        options.send({ type: "message_start", itemId: activeAssistantItemId });
      }
      if (e.type === "message_update" && e.assistantMessageEvent.type === "text_delta") options.send({ type: "delta", itemId: activeAssistantItemId, text: e.assistantMessageEvent.delta });
      if (e.type === "message_end" && e.message.role === "assistant") {
        options.send({ type: "message_end", itemId: activeAssistantItemId, stopReason: e.message.stopReason });
        activeAssistantItemId = undefined;
      }
      return subscribe?.(e);
    });
    return { agent, models, model, tools, systemPrompt: "谨慎研究", async run(text, signal) {
      const abort = () => void agent.abort(); signal.addEventListener("abort", abort, { once: true });
      try { return await agent.prompt(text); } finally { signal.removeEventListener("abort", abort); }
    } };
  };
}
function manager(dir, prepare, extra = {}) { return createChatSessionManager({ dataDirectory: dir, findWorkspace: async () => ({ id: "project-12345678", name: "test", path: dir }), prepare, ...extra }); }
const start = (m, clientRequestId = "request-12345678") => m.start(threadId, { clientRequestId, input: "分析企业", config: {} });

test("ambiguous browser POST retries freeze endpoint and body even after busy state changes", () => {
  const pending = new Map(), options = { id: threadId, content: "问题", config: { model: "first" }, requestId: "request-original" };
  const original = prepareChatSubmission(pending, options);
  const retry = prepareChatSubmission(pending, { ...options, activeTurnId: "turn-running", config: { model: "changed" }, requestId: "new-id" });
  assert.deepEqual(retry, original); assert.equal(retry.path, threadId + "/turns");
  pending.delete(original.key);
  assert.match(prepareChatSubmission(pending, { ...options, activeTurnId: "turn-running" }).path, /steer$/);
});

test("SQLite Session preserves structured calls/results across cold Harness instances and migrates legacy only once", async t => {
  const dir = await fixture(t, [{ id: "legacy-12345678", role: "user", content: "旧约束", createdAt: Date.now() }]);
  let store = createChatRuntimeStore(dir);
  let session = store.session(threadId);
  const call = assistant([{ type: "toolCall", id: "call-1", name: "query", arguments: { year: 2025 } }]);
  await session.appendMessage(call);
  await session.appendMessage({ role: "toolResult", toolCallId: "call-1", toolName: "query", content: [{ type: "text", text: "现金流 100 亿元" }], isError: false, timestamp: Date.now() });
  store.close(); store = createChatRuntimeStore(dir); t.after(() => store.close());
  session = store.session(threadId);
  const messages = (await session.buildContext()).messages;
  assert.equal(messages.length, 3); assert.deepEqual(messages[1], call);
  assert.match(textOf(messages[2]), /100 亿元/);
  assert.equal(store.snapshot(threadId).conversation.schemaVersion, 2);
  store.reserve(threadId, "request-pagination", "新问题", {});
  const last = store.snapshot(threadId, { limit: 1 });
  assert.equal(last.conversation.messages.length, 1);
  assert.ok(last.nextBeforeMessageId);
  assert.equal(store.snapshot(threadId, { limit: 1, beforeMessageId: last.nextBeforeMessageId }).conversation.messages[0].content, "旧约束");
});

test("real Pi Harness consumes steer once, preserves tools, and keeps running without subscribers", async t => {
  const dir = await fixture(t), started = deferred(), release = deferred(); let calls = 0, effects = 0; const contexts = [];
  const tool = { name: "query", label: "query", description: "query", parameters: Type.Object({}), execute: async () => { effects++; return { content: [{ type: "text", text: "已取得数据" }] }; } };
  const m = manager(dir, fakePrepare(async context => {
    contexts.push(context);
    if (++calls === 1) { started.resolve(); await release.promise; return assistant([{ type: "toolCall", id: "call-1", name: "query", arguments: {} }]); }
    return assistant();
  }, [tool])); t.after(() => m.close());
  const turn = start(m); await started.promise;
  assert.equal(start(m).id, turn.id);
  assert.throws(() => start(m, "request-conflict"), /正在运行/);
  const req = { clientInputId: "input-12345678", expectedTurnId: turn.id, text: "只看现金流" };
  const input = m.steer(threadId, turn.id, req);
  assert.equal(m.steer(threadId, turn.id, req).id, input.id);
  assert.throws(() => m.steer(threadId, turn.id, { ...req, text: "冲突" }), /冲突/);
  const unsub = m.subscribe(threadId, () => {}); unsub();
  release.resolve(); await m.wait(threadId);
  assert.equal(m.store.turn(turn.id).status, "completed");
  assert.equal(m.store.inputs(turn.id)[0].status, "consumed");
  const projected = m.store.snapshot(threadId).conversation.messages.filter(message => message.role === "assistant");
  assert.deepEqual(projected.map(message => message.stopReason), ["toolUse", "stop"]);
  const displayEvents = m.store.events(threadId).filter(event => event.type === "delta" || event.type === "message_end");
  assert.ok(displayEvents.length > 0);
  assert.ok(displayEvents.every(event => event.itemId));
  assert.deepEqual(displayEvents.filter(event => event.type === "message_end").map(event => event.stopReason), ["toolUse", "stop"]);
  const messages = (await m.store.session(threadId).buildContext()).messages;
  assert.equal(messages.filter(m => m.role === "user" && textOf(m) === req.text).length, 1);
  assert.ok(contexts.at(-1).messages.some(m => textOf(m) === req.text));
  assert.ok(effects <= 1); // Pi may skip a not-yet-started call to apply steering.
  assert.ok(m.events(threadId).every((e, i) => e.seq === i + 1));
  assert.equal(m.steer(threadId, turn.id, req).id, input.id); // Lost HTTP acknowledgement is retryable after completion.
});

test("steer at settled boundary is not lost or duplicated", async t => {
  const dir = await fixture(t); let m, turn, injected = false, calls = 0;
  m = manager(dir, fakePrepare(async () => { calls++; return assistant(); }, [], e => {
    if (e.type === "settled" && !injected) { injected = true; m.steer(threadId, turn.id, { clientInputId: "input-at-settled", expectedTurnId: turn.id, text: "再解释口径" }); }
  })); t.after(() => m.close()); turn = start(m); await m.wait(threadId);
  assert.equal(m.store.turn(turn.id).status, "completed"); assert.equal(calls, 2);
  assert.equal(m.store.inputs(turn.id)[0].status, "consumed");
  const messages = (await m.store.session(threadId).buildContext()).messages;
  assert.equal(messages.filter(m => m.role === "user" && textOf(m) === "再解释口径").length, 1);
});

test("explicit stop propagates abort; restart is interrupted until Continue; unknown effects are not replayed", async t => {
  const dir = await fixture(t), started = deferred();
  const m = manager(dir, fakePrepare(async (_c, opts) => { started.resolve(); await new Promise((resolve, reject) => { opts.signal.addEventListener("abort", () => reject(new Error("aborted")), { once: true }); }); return assistant(); }));
  const turn = start(m); await started.promise; await m.interrupt(threadId, turn.id);
  assert.equal(m.store.turn(turn.id).status, "interrupted"); await m.close();
  const store = createChatRuntimeStore(dir);
  const orphan = store.reserve(threadId, "request-orphaned", "原始任务不可丢失", {});
  await store.session(threadId, orphan.turn.id).appendMessage(assistant([{ type: "toolCall", id: "unknown-effect", name: "write", arguments: {} }]));
  store.close(); let contexts = [];
  const resumed = manager(dir, fakePrepare(async c => { contexts.push(c); return assistant(); })); t.after(() => resumed.close());
  assert.equal(resumed.store.turn(orphan.turn.id).status, "interrupted"); assert.equal(contexts.length, 0);
  resumed.resume(threadId, orphan.turn.id, "request-continue"); await resumed.wait(threadId);
  assert.ok(contexts[0].messages.some(m => m.role === "toolResult" && m.toolCallId === "unknown-effect" && textOf(m).includes("结果未知")));
  assert.ok(contexts[0].messages.some(m => textOf(m).includes("原始任务不可丢失")));
});

test("compaction checkpoints retain recent corrections and tool pairs, survive reload, and failure leaves history intact", async t => {
  const dir = await fixture(t), store = createChatRuntimeStore(dir); t.after(() => store.close());
  const session = store.session(threadId);
  for (let i = 0; i < 8; i++) { await session.appendMessage({ role: "user", content: `第${i}轮` + "旧数据".repeat(1000), timestamp: Date.now() }); await session.appendMessage(assistant()); }
  await session.appendMessage({ role: "user", content: "纠正：金额单位亿元，来源 https://example.com/filing", timestamp: Date.now() });
  const events = [];
  const context = createContextManager({ session, model, models: {}, systemPrompt: "约束", tools: [], signal: new AbortController().signal, emit: e => events.push(e), generate: async p => ({ ok: true, value: { summary: "目标与已确认事实；旧来源保留。", retainedTail: p.retainedTail, firstKeptEntryId: p.firstKeptEntryId } }) });
  const result = await context.transform((await session.buildContext()).messages, true);
  assert.ok(result.messages.some(m => textOf(m).includes("金额单位亿元")));
  assert.equal(events.at(-1).status, "completed");
  const cold = createChatRuntimeStore(dir);
  assert.deepEqual((await cold.session(threadId).buildContext()).messages, result.messages); cold.close();
  await session.appendMessage({ role: "user", content: "第二次压缩仍需保留原始口径", timestamp: Date.now() });
  const again = await context.transform((await session.buildContext()).messages, true);
  assert.ok(again.messages.some(m => textOf(m).includes("金额单位亿元")));
  const count = (await session.getEntries()).length;
  const broken = createContextManager({ session, model, models: {}, systemPrompt: "约束", tools: [], signal: new AbortController().signal, emit() {}, generate: async () => ({ ok: false, error: new Error("summary failed") }) });
  await assert.rejects(broken.transform(result.messages, true));
  assert.equal((await session.getEntries()).length, count);
});

test("large CJK results have bounded previews and scoped paged originals; configs exclude credentials", async t => {
  const dir = await fixture(t), store = createChatRuntimeStore(dir); t.after(() => store.close());
  const event = { toolName: "query", toolCallId: "big-result", content: [{ type: "text", text: "财务".repeat(10000) }], details: { kind: "database" }, isError: false };
  const bounded = boundToolResult(store, threadId, event);
  const resultId = bounded.content[0].text.match(/resultId=([\w-]+)/)[1];
  assert.ok(textTokens(JSON.stringify(bounded.content)) < 8000);
  assert.deepEqual(bounded.details, event.details);
  assert.deepEqual(store.result(threadId, resultId).content, event.content);
  const second = boundToolResult(store, "other-thread", event);
  assert.notEqual(second.content[0].text.match(/resultId=([\w-]+)/)[1], resultId);
  const reader = resultReader(store, threadId);
  assert.match((await reader.execute("r", { resultId, offset: 100, length: 200 })).content[0].text, /offset=100/);
  await assert.rejects(resultReader(store, "other-thread").execute("r", { resultId }), /不属于/);
  const safe = chatConfig({ model: { providerId: "fake", modelId: "fake", apiKey: "secret" }, apiKey: "secret", agentConfig: { profiles: { main: { apiKey: "secret" } } } });
  assert.doesNotMatch(JSON.stringify(safe), /secret|apiKey/);
});

test("HTTP SSE disconnect/replay is independent of execution and protected Runtime rejects unauthenticated access", async t => {
  const dir = await fixture(t), gate = deferred(), entered = deferred();
  const chat = createChatHttp({ dataDirectory: dir, findWorkspace: async () => ({ id: "project-12345678", path: dir }),
    prepare: fakePrepare(async () => { entered.resolve(); await gate.promise; return assistant(); }),
    readJsonBody: async req => { let body = ""; for await (const c of req) body += c; return JSON.parse(body); },
    sendJson: (res, status, body) => { res.writeHead(status, { "content-type": "application/json" }); res.end(JSON.stringify(body)); },
  });
  const server = createServer(async (req, res) => { try { const url = new URL(req.url, "http://localhost"); await chat.handle(req, res, url, url.pathname.split("/").filter(Boolean)); } catch (e) { res.writeHead(e.status ?? 500); res.end(e.message); } });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  t.after(async () => { gate.resolve(); await chat.close(); server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); });
  const root = `http://127.0.0.1:${server.address().port}/chat/threads/${threadId}`;
  const started = await fetch(root + "/turns", { method: "POST", body: JSON.stringify({ clientRequestId: "request-http-test", input: "可靠性测试" }) }).then(r => r.json());
  await entered.promise;
  const controller = new AbortController();
  const response = await fetch(root + "/events?afterSeq=0", { signal: controller.signal });
  const reader = response.body.getReader(); const first = await reader.read(); assert.match(new TextDecoder().decode(first.value), /turn_status/);
  controller.abort();
  gate.resolve(); await chat.manager.wait(threadId);
  const snap = await fetch(root).then(r => r.json()); assert.equal(snap.turn.status, "completed");
  const replayController = new AbortController(); const replay = await fetch(root + "/events?afterSeq=1", { signal: replayController.signal });
  const data = await replay.body.getReader().read(); assert.match(new TextDecoder().decode(data.value), /completed/); replayController.abort();
  assert.equal(chat.manager.store.turn(started.turn.id).status, "completed");
  const separate = await fixture(t);
  const handler = createLocalRuntimeHandler({ dataDirectory: separate, token: "unit-test-token", mcpManager: { listServers() { return []; } } });
  const protectedServer = createServer(handler); await new Promise(resolve => protectedServer.listen(0, "127.0.0.1", resolve));
  t.after(async () => { await handler.close(); protectedServer.closeAllConnections(); await new Promise(resolve => protectedServer.close(resolve)); });
  const protectedRoot = `http://127.0.0.1:${protectedServer.address().port}/chat/threads/${threadId}`;
  assert.equal((await fetch(protectedRoot)).status, 401);
  assert.equal((await fetch(protectedRoot, { headers: { Authorization: "Bearer unit-test-token" } })).status, 200);
  const oldWrite = await fetch(protectedRoot.replace("/threads/", "/conversations/"), { method: "PUT", headers: { Authorization: "Bearer unit-test-token", "content-type": "application/json" }, body: "{}" });
  assert.equal(oldWrite.status, 409);
});

test("completed side effects are reused on later turns, not replayed during cold context restoration", async t => {
  const dir = await fixture(t); let effects = 0, calls = 0, observed;
  const tool = { name: "write", label: "write", description: "write", parameters: Type.Object({}), execute: async () => { effects++; return { content: [{ type: "text", text: "文件已写入 outputs/report.md" }] }; } };
  let m = manager(dir, fakePrepare(async () => ++calls === 1 ? assistant([{ type: "toolCall", id: "write-once", name: "write", arguments: {} }]) : assistant(), [tool]));
  start(m); await m.wait(threadId); assert.equal(effects, 1); await m.close();
  m = manager(dir, fakePrepare(async context => { observed = context; return assistant(); }, [tool])); t.after(() => m.close());
  start(m, "request-later-turn"); await m.wait(threadId);
  assert.equal(effects, 1);
  assert.ok(observed.messages.some(m => m.role === "toolResult" && textOf(m).includes("outputs/report.md")));
});

test("compaction uses Pi's actual summarizer and cancellation cannot publish a partial checkpoint", async t => {
  const dir = await fixture(t), store = createChatRuntimeStore(dir); t.after(() => store.close());
  const session = store.session(threadId);
  for (let i = 0; i < 10; i++) { await session.appendMessage({ role: "user", content: "原文".repeat(1400), timestamp: Date.now() }); await session.appendMessage(assistant()); }
  let summaries = 0;
  const models = { completeSimple: async (_model, context) => { summaries++; assert.match(JSON.stringify(context), /当前目标和用户约束/); return assistant([{ type: "text", text: "保留目标、真实数据及口径。" }]); } };
  const context = createContextManager({ session, model, models, systemPrompt: "test", tools: [], signal: new AbortController().signal, emit() {} });
  await context.transform((await session.buildContext()).messages);
  assert.ok(summaries > 0); assert.equal((await session.getBranch())[0].type, "compaction");
  await session.appendMessage({ role: "user", content: "后续输入", timestamp: Date.now() });
  const before = await session.getLeafId(), controller = new AbortController();
  const aborting = createContextManager({ session, model, models: {}, systemPrompt: "test", tools: [], signal: controller.signal, emit() {}, generate: async () => { controller.abort(); return { ok: true, value: { summary: "不得发布", retainedTail: [] } }; } });
  await assert.rejects(aborting.transform((await session.buildContext()).messages, true)); assert.equal(await session.getLeafId(), before);
});

test("production chat factory loads under Node and records real Harness events without any external provider", async t => {
  const dir = await fixture(t), store = createChatRuntimeStore(dir), traces = createTraceStore(dir);
  t.after(() => { store.close(); traces.close(); });
  const env = { LOCAL_RUNTIME_URL: process.env.LOCAL_RUNTIME_URL, LOCAL_RUNTIME_TOKEN: process.env.LOCAL_RUNTIME_TOKEN, PI_LOCAL_DATA_DIR: process.env.PI_LOCAL_DATA_DIR };
  Object.assign(process.env, { LOCAL_RUNTIME_URL: "http://127.0.0.1:1", LOCAL_RUNTIME_TOKEN: "test-only", PI_LOCAL_DATA_DIR: dir });
  t.after(() => { for (const [k, v] of Object.entries(env)) { if (v === undefined) delete process.env[k]; else process.env[k] = v; } });
  t.mock.method(globalThis, "fetch", async url => {
    assert.match(String(url), /\/models\/fake\/resolve\?modelId=fake/);
    return Response.json({ providerId: "fake", piProviderId: "fake", modelId: "fake", apiKey: "never-sent" });
  });
  const session = store.session(threadId), events = [], traceId = crypto.randomUUID();
  const fake = await fakePrepare(async () => assistant())({}, { session, send() {} });
  const bundle = await prepareChatAgent({ input: "本机工厂测试", conversationId: threadId, workspaceId: crypto.randomUUID(), workspacePath: dir, traceId, model: { providerId: "fake", modelId: "fake" }, enabledSkills: [], enabledTools: [], enabledMcps: [] }, {
    session, models: { ...fake.models, getModel: () => model }, send: e => events.push(e),
    traceSink: { async start(v) { traces.createRun(v); }, async append(id, v) { traces.appendBatch(id, v); }, async finish(id, v) { traces.finishRun(id, v); } },
  });
  await bundle.run("本机工厂测试", new AbortController().signal); await bundle.finish();
  assert.ok(events.some(e => e.type === "message_start")); assert.ok(events.some(e => e.type === "delta"));
  assert.ok(events.some(e => e.type === "message_end" && e.stopReason === "stop" && e.itemId));
  assert.ok(events.filter(e => e.type === "delta").every(e => e.itemId));
  assert.equal(events.at(-1).traceStatus, "recorded");
  assert.equal(traces.listTraces({}).traces.length, 1);
  assert.doesNotMatch(JSON.stringify(events), /never-sent/);
});

test("SIGKILL of an isolated writer recovers WAL transcript and pending inputs without automatic execution", { timeout: 5000 }, async t => {
  const dir = await fixture(t);
  const script = `
    import { createChatRuntimeStore } from './server/chat/store.mjs';
    const store = createChatRuntimeStore(process.argv[1]);
    const turn = store.reserve('${threadId}', 'request-crash-test', '原始待办', {}).turn;
    await store.session('${threadId}', turn.id).appendMessage({role:'user', content:'原始待办', timestamp:Date.now()});
    store.addInput('${threadId}', turn.id, 'pending-before-kill', '只使用已核验的数据');
    process.stdout.write(turn.id + '\\n');
    setInterval(() => {}, 1000);
  `;
  const child = spawn(process.execPath, ["--input-type=module", "-e", script, dir], { cwd: process.cwd(), stdio: ["ignore", "pipe", "pipe"] });
  t.after(() => { if (child.exitCode === null && child.signalCode === null) child.kill("SIGKILL"); });
  const [data] = await once(child.stdout, "data"), turnId = data.toString().trim();
  const exited = once(child, "exit"); child.kill("SIGKILL"); await exited;
  let requests = 0;
  const m = manager(dir, fakePrepare(async () => { requests++; return assistant(); })); t.after(() => m.close());
  assert.equal(m.store.turn(turnId).status, "interrupted"); assert.equal(requests, 0);
  assert.equal(m.store.inputs(turnId)[0].status, "pending");
  m.resume(threadId, turnId, "request-after-kill"); await m.wait(threadId);
  assert.equal(m.store.inputs(turnId)[0].status, "consumed");
  assert.equal((await m.store.session(threadId).buildContext()).messages.filter(m => m.role === "user" && textOf(m) === "只使用已核验的数据").length, 1);
});
