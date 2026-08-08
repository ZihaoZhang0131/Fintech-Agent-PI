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

test("tool run reducer retains the concise delegated Agent card metadata", () => {
  const runs = applyToolEnd(undefined, {
    type: "tool_end",
    toolCallId: "delegate-1",
    toolName: "delegate_agent",
    label: "委派专业 Agent",
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
});
