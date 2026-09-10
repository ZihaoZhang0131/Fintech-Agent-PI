import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const tracePage = await readFile(new URL("../components/trace-page.tsx", import.meta.url), "utf8");
const route = await readFile(new URL("../server/chat/agent.ts", import.meta.url), "utf8");
const localProxy = await readFile(new URL("../app/api/local/[...segments]/route.ts", import.meta.url), "utf8");
const abortRoute = await readFile(new URL("../app/api/chat/abort/route.ts", import.meta.url), "utf8");
const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
const manager = await readFile(new URL("../server/chat/manager.mjs", import.meta.url), "utf8");
const store = await readFile(new URL("../server/chat/store.mjs", import.meta.url), "utf8");

test("chat messages persist trace ids and expose a dedicated Trace page", () => {
  assert.match(page, /traceId\?: string/);
  assert.match(page, /traceStatus\?: "recording" \| "recorded" \| "unavailable"/);
  assert.match(page, /<TracePage/);
  assert.match(page, />Trace</);
  assert.match(page, /查看 Trace/);
  assert.match(manager, /workspacePath: workspace\.path/);
  assert.match(store, /payload\.type === "trace_status"/);
  assert.match(page, /\/interrupt/);
  assert.doesNotMatch(page, /activeTraceIdRef/);
});

test("Trace entry keeps conversation navigation and runtime proxy compatibility", () => {
  assert.match(tracePage, /onOpenConversation/);
  assert.match(tracePage, /清空当前项目的全部 Trace/);
  assert.match(tracePage, /TraceDrawer/);
  assert.match(styles, /trace.css/);
  assert.match(styles, /\.message-trace-link/);
});

test("chat route records the same trace id and browser proxy blocks ingestion", () => {
  assert.match(route, /new TraceRecorder/);
  assert.match(route, /mainTraceHandle\.onEvent\(event as AgentEvent\)/);
  assert.match(route, /childTraceHandle\?\.onEvent\(event\)/);
  assert.match(route, /getToolSpanId\("main", parentToolCallId\)/);
  assert.match(manager, /traceId: t\.id/);
  assert.match(store, /traceStatus: "recording"/);
  assert.match(route, /signal\.addEventListener\("abort", abort/);
  assert.match(route, /traceRecorder\?\.markAborted\(\)/);
  assert.match(manager, /state\.controller\.abort\(\)/);
  assert.match(abortRoute, /status: 410/);
  assert.match(localProxy, /segments\[0\] === "trace-ingest"/);
  assert.match(localProxy, /status: 403/);
});
