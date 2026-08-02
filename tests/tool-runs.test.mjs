import assert from "node:assert/strict";
import test from "node:test";

import { applyToolEnd, applyToolStart } from "../lib/tool-runs.ts";

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

