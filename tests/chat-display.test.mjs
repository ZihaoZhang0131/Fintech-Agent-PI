import assert from "node:assert/strict";
import test from "node:test";
import { projectChatDisplay } from "../lib/chat-display.ts";

const message = (id, content = id, extra = {}) => ({ id, content, role: "assistant", createdAt: 200, turnId: "turn", traceId: "turn", traceStatus: "recorded", ...extra });
const tool = (id, extra = {}) => ({ toolCallId: id, toolName: "web_search", label: id, startedAt: 200, status: "success", ...extra });
const user = message("user", "分析腾讯", { role: "user", createdAt: 100 });

test("three generations render only the final answer while retaining all tools and history", () => {
  const messages = [
    user,
    message("a", "先查询", { stopReason: "toolUse", toolRuns: [tool("search1")] }),
    message("b", "补充查询", { stopReason: "toolUse", toolRuns: [tool("search2")] }),
    message("c", "最终结论", { stopReason: "stop", durationMs: 900 }),
  ];
  const before = JSON.stringify(messages);
  const rows = projectChatDisplay(messages, { id: "turn", status: "completed", startedAt: 90, durationMs: 1000 });
  assert.equal(rows.length, 2);
  assert.equal(rows.filter(r => r.message.role === "assistant" && r.header).length, 1);
  assert.deepEqual(rows[1].parts.map(p => p.content), ["最终结论"]);
  assert.equal(rows[1].toolRuns.length, 2);
  assert.equal(rows[1].startedAt, 90);
  assert.equal(rows[1].durationMs, 1000);
  assert.equal(rows.some(r => r.indicator), false);
  assert.equal(JSON.stringify(messages), before);
  assert.deepEqual(projectChatDisplay(structuredClone(messages)), projectChatDisplay(messages));
});

test("steering keeps chronology, one header and one indicator; nested approvals retain owner", () => {
  const messages = [user, message("a", "", { stopReason: "toolUse", toolRuns: [tool("parent", { children: [tool("child", { status: "running" })] })] }), message("steer", "只看现金流", { role: "user" }), message("b", "收到", { stopReason: "pending", toolRuns: [tool("parent", { children: [tool("child", { commandId: "cmd", status: "awaiting_approval" })] })] })];
  const rows = projectChatDisplay(messages, { id: "turn", status: "running", startedAt: 100 });
  assert.deepEqual(rows.map(r => r.message.id), ["user", "a", "steer", "b"]);
  assert.deepEqual(rows.flatMap(r => r.parts.map(m => m.id)), ["user", "steer"]);
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
  assert.deepEqual(rows[1].parts, []);
});

test("length is visible with a truncation warning while failed generations stay hidden", () => {
  const completed = projectChatDisplay([
    user,
    message("work", "过程", { stopReason: "toolUse" }),
    message("answer", "未完整答案", { stopReason: "length" }),
  ], { id: "turn", status: "completed" });
  assert.deepEqual(completed[1].parts.map(part => part.id), ["answer"]);
  assert.equal(completed[1].truncated, true);

  for (const stopReason of ["error", "aborted"]) {
    const failed = projectChatDisplay([user, message("partial", "未完成内容", { stopReason })], { id: "turn", status: "failed" });
    assert.deepEqual(failed[1].parts, []);
    assert.equal(failed[1].emptyFinal, false);
  }
});

test("completed empty final uses a deterministic fallback and historical turns show only their last text", () => {
  const empty = projectChatDisplay([
    user,
    message("work", "", { stopReason: "toolUse", toolRuns: [tool("search")] }),
    message("answer", "", { stopReason: "stop" }),
  ], { id: "turn", status: "completed" });
  assert.equal(empty[1].emptyFinal, true);
  assert.deepEqual(empty[1].parts, []);

  const historical = projectChatDisplay([user, message("old-work", "旧过程"), message("old-answer", "旧结论")], { id: "turn", status: "completed" });
  assert.deepEqual(historical[1].parts.map(part => part.id), ["old-answer"]);
});
