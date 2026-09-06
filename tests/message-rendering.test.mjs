import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const markdownSource = await readFile(new URL("../components/chat-markdown.tsx", import.meta.url), "utf8");
const toolRunSource = await readFile(new URL("../components/tool-run-stack.tsx", import.meta.url), "utf8");
const styleSource = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("chat messages render GitHub-flavored Markdown", () => {
  assert.match(markdownSource, /import remarkGfm from "remark-gfm"/);
  assert.match(markdownSource, /<ReactMarkdown remarkPlugins=\{\[remarkGfm\]\} components=/);
  assert.match(markdownSource, /\(\[。！？\.!\?：:\]\)\\s\*/);
  assert.match(pageSource, /<MarkdownMessage content=\{message\.content\} projectNavigation=/);
  assert.match(styleSource, /\.markdown-body table\s*\{/);
  assert.match(styleSource, /\.markdown-body th,\s*\.markdown-body td\s*\{/);
  assert.match(styleSource, /\.markdown-body a\s*\{/);
});

test("collapsed tool activity shows only total run time beside its disclosure", () => {
  assert.match(toolRunSource, /function ToolRunStack\(/);
  assert.match(toolRunSource, /run\.startedAt >= latest\.startedAt/);
  assert.match(toolRunSource, /startedAt: number;/);
  assert.match(toolRunSource, /isRunning: boolean;/);
  assert.match(toolRunSource, /isRunning \? now - startedAt : durationMs/);
  assert.match(toolRunSource, /if \(!isRunning && !hasRunningRun\) return undefined;/);
  assert.match(toolRunSource, /\[hasRunningRun, isRunning\]/);
  assert.match(toolRunSource, /className="tool-run-summary"/);
  assert.match(toolRunSource, /aria-expanded=\{expanded\}/);
  assert.match(toolRunSource, /`本次运行 \$\{formatRunDuration\(displayedDurationMs\)\}`/);
  assert.match(pageSource, /message\.id === assistantId \? \{ \.\.\.message, durationMs: event\.durationMs \}/);
  assert.match(toolRunSource, /\{expanded && \(/);
  assert.match(pageSource, /isBusy && activeMessageId === messageId/);
  assert.doesNotMatch(toolRunSource, /Agent 执行|className="tool-run-stack"/);
  assert.match(styleSource, /\.tool-run-summary\s*\{[^}]*display:\s*inline-flex;[^}]*gap:\s*3px;[^}]*border:\s*0;/s);
  assert.match(styleSource, /\.tool-run-summary\[aria-expanded="true"\] \.tool-run-chevron/);
});

test("unfinished assistant replies keep the thinking indicator on their final line", () => {
  assert.match(pageSource, /const activeAssistantMessageId = isBusy \? activeConversation\?\.messages\.at\(-1\)\?\.id : undefined;/);
  assert.match(pageSource, /message\.role === "assistant" && message\.id === activeAssistantMessageId/);
  assert.match(pageSource, /startedAt=\{message\.createdAt\}/);
  assert.match(pageSource, /isRunning=\{isUnfinishedAssistantMessage\}/);
  assert.match(pageSource, /\{message\.content \? <MarkdownMessage content=\{message\.content\} projectNavigation=/);
  assert.match(pageSource, /\{isUnfinishedAssistantMessage && \([\s\S]*className="thinking-indicator"[\s\S]*aria-label="Agent 正在回复"/);
  assert.match(styleSource, /\.thinking-indicator i:nth-child\(2\)\s*\{[^}]*animation-delay:\s*140ms/s);
  assert.match(styleSource, /\.thinking-indicator i:nth-child\(3\)\s*\{[^}]*animation-delay:\s*280ms/s);
  assert.match(styleSource, /@keyframes think\s*\{[\s\S]*translateY\(-3px\)/);
});

test("latest tool card preserves tool approval controls and Bash execution details", () => {
  assert.match(toolRunSource, /run\.status === "awaiting_approval" && run\.commandId/);
  assert.match(toolRunSource, /onDecision\(messageId, run, "reject"\)/);
  assert.match(toolRunSource, /onDecision\(messageId, run, "approve"\)/);
  assert.match(toolRunSource, /run\.toolName === "bash" && run\.query/);
  assert.doesNotMatch(toolRunSource, /className="tool-run-query|className="tool-run-meta/);
  assert.match(toolRunSource, /className="tool-run-output"/);
  assert.match(toolRunSource, /className="tool-run-sources"/);
});

test("delegated Agent runs stay in the history list and long-running tools show a spinner", () => {
  assert.doesNotMatch(toolRunSource, /tool-run-subagent/);
  assert.match(toolRunSource, /LONG_RUNNING_THRESHOLD_MS = 3_000/);
  assert.match(toolRunSource, /now - run\.startedAt >= LONG_RUNNING_THRESHOLD_MS/);
  assert.match(toolRunSource, /<LoaderCircle className="tool-run-running-glyph"/);
  assert.match(styleSource, /\.tool-run-running-glyph\s*\{[^}]*animation:\s*spin/s);
});
