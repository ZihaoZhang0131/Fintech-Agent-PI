import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const styleSource = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("chat messages render GitHub-flavored Markdown", () => {
  assert.match(pageSource, /import remarkGfm from "remark-gfm"/);
  assert.match(pageSource, /<ReactMarkdown remarkPlugins=\{\[remarkGfm\]\}>\{normalizedContent\}<\/ReactMarkdown>/);
  assert.match(pageSource, /\(\[。！？\.!\?：:\]\)\\s\*/);
  assert.match(pageSource, /<MarkdownMessage content=\{message\.content\} \/>/);
  assert.match(styleSource, /\.markdown-body table\s*\{/);
  assert.match(styleSource, /\.markdown-body th,\s*\.markdown-body td\s*\{/);
  assert.match(styleSource, /\.markdown-body a\s*\{/);
});

test("collapsed tool activity shows only total run time beside its disclosure", () => {
  assert.match(pageSource, /function ToolRunStack\(/);
  assert.match(pageSource, /run\.startedAt >= latest\.startedAt/);
  assert.match(pageSource, /className="tool-run-summary"/);
  assert.match(pageSource, /aria-expanded=\{expanded\}/);
  assert.match(pageSource, /`本次运行 \$\{formatRunDuration\(durationMs\)\}`/);
  assert.match(pageSource, /message\.id === assistantId \? \{ \.\.\.message, durationMs: event\.durationMs \}/);
  assert.match(pageSource, /\{expanded && \(/);
  assert.match(pageSource, /isBusy && activeMessageId === messageId/);
  assert.doesNotMatch(pageSource, /Agent 执行|className="tool-run-stack"/);
  assert.match(styleSource, /\.tool-run-summary\s*\{[^}]*display:\s*inline-flex;[^}]*gap:\s*3px;[^}]*border:\s*0;/s);
  assert.match(styleSource, /\.tool-run-summary\[aria-expanded="true"\] \.tool-run-chevron/);
});

test("latest tool card preserves Bash approval controls and execution details", () => {
  assert.match(pageSource, /run\.status === "awaiting_approval" && run\.commandId/);
  assert.match(pageSource, /onDecision\(messageId, run, "reject"\)/);
  assert.match(pageSource, /onDecision\(messageId, run, "approve"\)/);
  assert.match(pageSource, /run\.toolName === "bash" && run\.query/);
  assert.doesNotMatch(pageSource, /className="tool-run-query|className="tool-run-meta/);
  assert.match(pageSource, /className="tool-run-output"/);
  assert.match(pageSource, /className="tool-run-sources"/);
});
