import assert from "node:assert/strict";
import test from "node:test";
import { projectChatDisplay } from "../lib/chat-display.ts";

const message = (id, content = id, extra = {}) => ({ id, content, role: "assistant", createdAt: 200, turnId: "turn", traceId: "turn", traceStatus: "recorded", ...extra });
const tool = (id, extra = {}) => ({ toolCallId: id, toolName: "web_search", label: id, startedAt: 200, status: "success", ...extra });
const user = message("user", "分析腾讯", { role: "user", createdAt: 100 });

test("three generations render one header, all tools and separate Markdown parts without changing history", () => {
  const messages = [user, message("a", "先查询", { toolRuns: [tool("search1")] }), message("b", "补充查询", { toolRuns: [tool("search2")] }), message("c", "最终结论", { durationMs: 900 })];
  const before = JSON.stringify(messages);
  const rows = projectChatDisplay(messages, { id: "turn", status: "completed", startedAt: 90, durationMs: 1000 });
  assert.equal(rows.length, 2);
  assert.equal(rows.filter(r => r.message.role === "assistant" && r.header).length, 1);
  assert.deepEqual(rows[1].parts.map(p => p.content), ["先查询", "补充查询", "最终结论"]);
  assert.equal(rows[1].toolRuns.length, 2);
  assert.equal(rows[1].startedAt, 90);
  assert.equal(rows[1].durationMs, 1000);
  assert.equal(rows.some(r => r.indicator), false);
  assert.equal(JSON.stringify(messages), before);
  assert.deepEqual(projectChatDisplay(structuredClone(messages)), projectChatDisplay(messages));
});

test("steering keeps chronology, one header and one indicator; nested approvals retain owner", () => {
  const messages = [user, message("a", "", { toolRuns: [tool("parent", { children: [tool("child", { status: "running" })] })] }), message("steer", "只看现金流", { role: "user" }), message("b", "收到", { toolRuns: [tool("parent", { children: [tool("child", { commandId: "cmd", status: "awaiting_approval" })] })] })];
  const rows = projectChatDisplay(messages, { id: "turn", status: "running", startedAt: 100 });
  assert.deepEqual(rows.flatMap(r => r.parts.map(m => m.id)), ["user", "a", "steer", "b"]);
  const assistants = rows.filter(r => r.message.role === "assistant");
  assert.equal(assistants.filter(r => r.header).length, 1);
  assert.equal(assistants.filter(r => r.indicator).length, 1);
  assert.equal(assistants[1].indicator, true);
  assert.equal(assistants[0].toolRuns.length, 1);
  assert.equal(assistants[0].toolRuns[0].children.length, 1);
  assert.equal(assistants[0].toolRuns[0].children[0].commandId, "cmd");
  assert.equal(assistants[0].owners.get("child"), "b");
  for (const status of ["completed", "failed", "interrupted"]) assert.equal(projectChatDisplay(messages, { id: "turn", status, startedAt: 100, endedAt: 600 }).some(r => r.indicator), false);
});

test("legacy messages remain separate and successive turns never merge", () => {
  const rows = projectChatDisplay([message("legacy1", "one", { turnId: undefined }), message("legacy2", "two", { turnId: undefined }), message("new"), message("other", "other", { turnId: "other" })]);
  assert.equal(rows.length, 4);
  assert.ok(rows.every(r => r.header));
});

test("historical failed turn uses persisted turn timestamps after another turn starts", () => {
  const rows = projectChatDisplay([user, message("a")], { id: "next", status: "running" }, [{ id: "turn", status: "failed", startedAt: 80, endedAt: 780 }]);
  assert.equal(rows[1].startedAt, 80);
  assert.equal(rows[1].durationMs, 700);
  assert.equal(rows[1].running, false);
});
