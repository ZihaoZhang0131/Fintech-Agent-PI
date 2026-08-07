import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const component = await readFile(
  new URL("../components/capability-library.tsx", import.meta.url),
  "utf8",
);
const stylesheet = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("capability cards remove redundant corner markers", () => {
  assert.doesNotMatch(component, /capability-card-topline|capability-card-icon/);
  assert.doesNotMatch(component, /BookOpenCheck|Code2|ShieldCheck|<Check|<Eye/);
  assert.match(component, /className="capability-toggle"/);
  assert.match(component, /\{itemEnabled \? "已启用" : "已停用"\}/);
});

test("capability pages keep only a centered compact search toolbar above cards", () => {
  assert.match(component, /className="capability-toolbar"/);
  assert.match(component, /className="capability-search"/);
  assert.doesNotMatch(component, /capability-page-header|capability-heading|capability-enabled-count/);
  assert.doesNotMatch(component, /capability-result-meta/);
  assert.doesNotMatch(component, /开关会决定下一轮对话中 Agent 可以调用的范围/);
  assert.doesNotMatch(component, /共 \$\{items\.length\} 项|找到 \$\{filtered\.length\} 项/);
  assert.match(
    stylesheet,
    /\.capability-toolbar\s*\{[^}]*grid-template-columns:\s*36px minmax\(240px, 620px\) 36px;/s,
  );
  assert.match(stylesheet, /\.capability-grid\s*\{[^}]*margin-top:\s*24px;/s);
});

test("capability cards use a compact responsive information layout", () => {
  assert.match(
    stylesheet,
    /\.capability-grid\s*\{[^}]*grid-template-columns:\s*repeat\(auto-fit, minmax\(min\(100%, 270px\), 1fr\)\);/s,
  );
  assert.match(stylesheet, /\.capability-card\s*\{[^}]*min-height:\s*196px;/s);
  assert.match(
    stylesheet,
    /\.capability-card-copy h2\s*\{[^}]*font-family:\s*var\(--font-interface\);/s,
  );
  assert.doesNotMatch(stylesheet, /\.capability-card\.disabled\s*\{[^}]*opacity:/s);
});

test("MCP capabilities expose concise status, setup guidance, refresh, and discovered tools", () => {
  assert.match(component, /刷新 MCP 连接状态/);
  assert.match(component, /npm run mcp:setup/);
  assert.match(component, /selected\.mcpTools/);
  assert.match(component, /selected\.status !== "connected"/);
  assert.match(stylesheet, /\.mcp-card-summary/);
  assert.match(stylesheet, /\.mcp-tool-list/);
  assert.match(component, /mcpToolDescription\(tool\)/);
  assert.match(component, /查询 A 股历史行情/);
  assert.match(stylesheet, /\.mcp-tool-list article/);
  assert.doesNotMatch(component, /<dt>连接状态|<dt>传输方式|<dt>认证/);
  assert.match(component, /tool\.description/);
});
