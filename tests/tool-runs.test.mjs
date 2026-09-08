import assert from "node:assert/strict";
import test from "node:test";

import { applyToolApproval, applyToolEnd, applyToolStart } from "../lib/tool-runs.ts";

test("tool run reducer preserves parallel calls and completes the matching call", () => {
  const firstStart = {
    type: "tool_start",
    toolCallId: "call-1",
    toolName: "web_search",
    label: "Tavily 网络搜索",
    query: "第一条搜索",
    startedAt: 1_000,
  };
  const secondStart = {
    ...firstStart,
    toolCallId: "call-2",
    query: "第二条搜索",
    startedAt: 1_100,
  };

  let runs = applyToolStart(undefined, firstStart);
  runs = applyToolStart(runs, secondStart);
  runs = applyToolEnd(runs, {
    type: "tool_end",
    toolCallId: "call-1",
    toolName: "web_search",
    label: "Tavily 网络搜索",
    isError: false,
    query: "第一条搜索",
    completedAt: 1_450,
    durationMs: 450,
    resultCount: 2,
    sources: [
      { title: "官方来源", url: "https://example.com/official", publishedDate: "2026-08-02" },
    ],
  });

  assert.equal(runs.length, 2);
  assert.equal(runs[0].status, "success");
  assert.equal(runs[0].durationMs, 450);
  assert.equal(runs[0].sources[0].title, "官方来源");
  assert.equal(runs[1].status, "running");
  assert.equal(runs[1].query, "第二条搜索");
});

test("tool run reducer represents Bash approval, rejection, and command output", () => {
  let runs = applyToolStart(undefined, {
    type: "tool_start",
    toolCallId: "bash-1",
    toolName: "bash",
    label: "执行 Bash",
    query: "npm test",
    startedAt: 3_000,
  });
  runs = applyToolApproval(runs, {
    type: "tool_approval_required",
    toolCallId: "bash-1",
    toolName: "bash",
    label: "执行 Bash",
    query: "npm test",
    commandId: "command-1",
    permissionMode: "sandbox",
  });
  assert.equal(runs[0].status, "awaiting_approval");
  assert.equal(runs[0].commandId, "command-1");

  runs = applyToolEnd(runs, {
    type: "tool_end",
    toolCallId: "bash-1",
    toolName: "bash",
    label: "执行 Bash",
    isError: false,
    completedAt: 3_050,
    durationMs: 50,
    commandId: "command-1",
    permissionMode: "sandbox",
    commandStatus: "rejected",
    stdout: "",
    stderr: "",
  });
  assert.equal(runs[0].status, "rejected");
});

test("tool run reducer records an end event even if its start event was missed", () => {
  const runs = applyToolEnd(undefined, {
    type: "tool_end",
    toolCallId: "call-late",
    toolName: "web_search",
    label: "Tavily 网络搜索",
    isError: true,
    completedAt: 2_000,
    durationMs: 300,
  });

  assert.equal(runs.length, 1);
  assert.equal(runs[0].status, "error");
  assert.equal(runs[0].startedAt, 1_700);
});

test("tool run reducer retains delegated Agent metadata for its history row", () => {
  const runs = applyToolEnd(undefined, {
    type: "tool_end",
    toolCallId: "delegate-1",
    toolName: "delegate_agent",
    label: "委派数据研究员 Agent",
    isError: false,
    completedAt: 5_000,
    durationMs: 800,
    subAgentId: "market-data",
    subAgentLabel: "数据研究员",
    subAgentModel: "deepseek:deepseek-v4-flash",
    summary: "已收到数据研究员的研究回传",
  });
  assert.equal(runs[0].subAgentLabel, "数据研究员");
  assert.equal(runs[0].subAgentModel, "deepseek:deepseek-v4-flash");
  assert.equal(runs[0].label, "委派数据研究员 Agent");
});

test("delegated Agent identity survives a failed end event without result details", () => {
  let runs = applyToolStart(undefined, {
    type: "tool_start",
    toolCallId: "delegate-failed",
    toolName: "delegate_agent",
    label: "委派研报Agent Agent",
    query: "研究公司",
    startedAt: 6_000,
    subAgentId: "custom-research-12345678",
    subAgentLabel: "研报Agent",
  });
  runs = applyToolEnd(runs, {
    type: "tool_end",
    toolCallId: "delegate-failed",
    toolName: "delegate_agent",
    label: "委派研报Agent Agent",
    isError: true,
    completedAt: 6_100,
  });

  assert.equal(runs[0].status, "error");
  assert.equal(runs[0].subAgentId, "custom-research-12345678");
  assert.equal(runs[0].subAgentLabel, "研报Agent");
});

test("child tools are isolated by delegation call, survive parent completion and persistence", () => {
  const parent = (id) => ({ type: "tool_start", toolCallId: id, toolName: "delegate_agent", label: "数据Agent", subAgentId: "custom-data", children: [], startedAt: 100 });
  const child = (id) => ({ type: "tool_start", parentToolCallId: id, toolCallId: "same-child-id", toolName: "read_project_file", label: "读取文件", startedAt: 110 });
  let runs = applyToolStart(applyToolStart([], parent("a")), parent("b"));
  runs = applyToolStart(applyToolStart(runs, child("a")), child("b"));
  runs = applyToolStart(runs, child("a"));
  assert.equal(runs[0].children.length, 1);
  runs = applyToolEnd(runs, { ...child("a"), type: "tool_end", isError: false, completedAt: 150 });
  assert.equal(runs[0].children[0].status, "success");
  assert.equal(runs[1].children[0].status, "running");
  runs = applyToolEnd(runs, { ...parent("a"), type: "tool_end", isError: false, completedAt: 200 });
  assert.equal(runs[0].children[0].status, "success");
  assert.deepEqual(JSON.parse(JSON.stringify(runs))[0].children[0].toolCallId, "same-child-id");
});

test("child end without start is retained and child approval targets only its command", async () => {
  const { applyToolDecision, finishToolRuns } = await import("../lib/tool-runs.ts");
  let runs = applyToolStart([], { type: "tool_start", toolCallId: "parent", toolName: "delegate_agent", label: "数据Agent", startedAt: 100 });
  const event = { parentToolCallId: "parent", toolCallId: "child", toolName: "bash", label: "Bash", query: "pwd", commandId: "command-child", permissionMode: "sandbox" };
  runs = applyToolApproval(runs, { ...event, type: "tool_approval_required" });
  assert.equal(runs[0].status, "running");
  assert.equal(runs[0].children[0].status, "awaiting_approval");
  runs = applyToolDecision(runs, "command-child", "approve");
  assert.equal(runs[0].children[0].status, "running");
  runs = applyToolDecision(runs, "command-child", "reject");
  assert.equal(runs[0].children[0].status, "rejected");
  runs = applyToolEnd(runs, { ...event, toolCallId: "missed-start", type: "tool_end", isError: false, completedAt: 200 });
  assert.equal(runs[0].children[1].status, "success");
  runs = applyToolStart(runs, { ...event, toolCallId: "unfinished", type: "tool_start", startedAt: 200 });
  const finished = finishToolRuns(runs, "已停止", 300);
  assert.equal(finished[0].children[2].status, "error");
  assert.equal(finished[0].children[2].summary, "已停止");
  assert.equal(finished[0].children[1].status, "success");
});

test("parent failure finalizes unfinished children with its reason", () => {
  let runs = applyToolStart([], { type: "tool_start", toolCallId: "parent", toolName: "delegate_agent", label: "Agent", startedAt: 100 });
  runs = applyToolStart(runs, { type: "tool_start", parentToolCallId: "parent", toolCallId: "child", toolName: "web_search", label: "搜索", startedAt: 120 });
  runs = applyToolEnd(runs, { type: "tool_end", toolCallId: "parent", toolName: "delegate_agent", label: "Agent", isError: true, summary: "Subagent 执行超时", completedAt: 600 });
  assert.equal(runs[0].children[0].status, "error");
  assert.equal(runs[0].children[0].summary, "Subagent 执行超时");
});
