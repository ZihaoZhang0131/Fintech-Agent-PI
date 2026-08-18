import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const tracePage = await readFile(new URL("../components/trace-page.tsx", import.meta.url), "utf8");
const route = await readFile(new URL("../app/api/chat/stream/route.ts", import.meta.url), "utf8");
const localProxy = await readFile(new URL("../app/api/local/[...segments]/route.ts", import.meta.url), "utf8");
const abortRoute = await readFile(new URL("../app/api/chat/abort/route.ts", import.meta.url), "utf8");
const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("chat messages persist trace ids and expose a dedicated Trace page", () => {
  assert.match(page, /traceId\?: string/);
  assert.match(page, /traceStatus\?: "recording" \| "recorded" \| "unavailable"/);
  assert.match(page, /<TracePage/);
  assert.match(page, />Trace</);
  assert.match(page, /查看 Trace/);
  assert.match(page, /workspacePath: activeProject\.path/);
  assert.match(page, /event\.type === "trace_status"/);
  assert.match(page, /fetch\("\/api\/chat\/abort"/);
  assert.match(page, /activeTraceIdRef/);
});

test("Trace page filters, polls running traces, renders a span tree, and manages local records", () => {
  assert.match(tracePage, /function TraceTree/);
  assert.match(tracePage, /window\.setInterval/);
  assert.match(tracePage, /1_000/);
  assert.match(tracePage, /statusFilter/);
  assert.match(tracePage, /fromDate/);
  assert.match(tracePage, /toDate/);
  assert.match(tracePage, /打开对话/);
  assert.match(tracePage, /清空当前项目的全部 Trace/);
  assert.match(tracePage, /原始事件/);
  assert.match(styles, /\.trace-workspace/);
  assert.match(styles, /\.trace-tree-row/);
  assert.match(styles, /\.message-trace-link/);
});

test("chat route records the same trace id and browser proxy blocks ingestion", () => {
  assert.match(route, /new TraceRecorder/);
  assert.match(route, /mainTraceHandle\.onEvent\(event\)/);
  assert.match(route, /childTraceHandle\?\.onEvent\(event\)/);
  assert.match(route, /getToolSpanId\("main", parentToolCallId\)/);
  assert.match(route, /requestId: traceId/);
  assert.match(route, /traceStatus: traceAvailable \? "recording" : "unavailable"/);
  assert.match(route, /request\.signal\.addEventListener\("abort", abortRun/);
  assert.match(route, /traceRecorder\?\.markAborted\(\)/);
  assert.match(route, /traceSink\.isAborted\(traceId\)/);
  assert.match(abortRoute, /LocalRuntimeTraceSink\(\)\.abort\(traceId\)/);
  assert.match(localProxy, /segments\[0\] === "trace-ingest"/);
  assert.match(localProxy, /status: 403/);
});
