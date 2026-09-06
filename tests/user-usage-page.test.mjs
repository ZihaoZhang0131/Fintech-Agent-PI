import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { getUsageActivity, legacyUsageContributions, usageActivityFromDays, usageDayKey } from "../lib/usage-activity.ts";

const pageSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const component = await readFile(new URL("../components/user-usage-page.tsx", import.meta.url), "utf8");
const stylesheet = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("usage activity groups tokens, tool calls, and loaded Skills by day", () => {
  const timestamp = new Date(2026, 7, 9, 9).getTime();
  const nextTimestamp = new Date(2026, 7, 9, 12).getTime();
  const activity = getUsageActivity([{ messages: [{
    createdAt: timestamp,
    tokenUsage: 120,
    toolRuns: [
      { toolName: "web_search", startedAt: timestamp },
      { toolName: "load_skill", startedAt: nextTimestamp },
    ],
  }] }]);
  const day = usageDayKey(timestamp);

  assert.equal(activity.token.get(day), 120);
  assert.equal(activity.tool.get(day), 2);
  assert.equal(activity.skill.get(day), 1);
});

test("user page is a compact three-section heatmap and has a bottom sidebar entry", () => {
  assert.match(pageSource, /<UserUsagePage activity=\{usageActivity\}/);
  assert.match(pageSource, />用户</);
  assert.match(pageSource, /setActiveView\("user"\)/);
  assert.match(pageSource, /\/api\/local\/usage\/activity/);
  assert.match(pageSource, /\/api\/local\/usage\/import/);
  assert.doesNotMatch(pageSource, /getUsageActivity\(conversations\)/);
  assert.match(component, /Token 用量统计/);
  assert.match(component, /工具调用用量统计/);
  assert.match(component, /Skill 调用用量统计/);
  assert.match(component, /WEEK_COUNT = 52/);
  assert.match(component, /data-tooltip=\{formatDetail\(day\.timestamp, day\.value, unit\)\}/);
  assert.match(stylesheet, /\.user-usage-page/);
  assert.match(stylesheet, /\.usage-heatmap-grid/);
  assert.match(stylesheet, /\.usage-heatmap-months\s*\{[^}]*grid-template-columns: repeat\(13, minmax\(0, 1fr\)\);/s);
  assert.match(stylesheet, /\.user-usage-section\s*\{[^}]*width: min\(50%, 640px\);[^}]*margin-inline: auto;/s);
  assert.match(stylesheet, /\.usage-heatmap-cell:hover::after/);
  assert.doesNotMatch(component, /<button|<article|<p/);
});

test("legacy usage migration produces stable, idempotent per-record contributions", () => {
  const timestamp = new Date(2026, 8, 6, 9).getTime();
  const contributions = legacyUsageContributions([{ messages: [{
    id: "message-1",
    createdAt: timestamp,
    tokenUsage: 20,
    toolRuns: [{ toolCallId: "tool-1", toolName: "load_skill", startedAt: timestamp }],
  }] }]);
  assert.deepEqual(contributions, [
    { sourceId: "legacy/message/message-1/token", day: "2026-09-06", token: 20 },
    { sourceId: "legacy/message/message-1/tool/tool-1", day: "2026-09-06", tool: 1, skill: 1 },
  ]);
  const activity = usageActivityFromDays([{ day: "2026-09-06", token: 20, tool: 1, skill: 1 }]);
  assert.equal(activity.skill.get("2026-09-06"), 1);
});
