import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const styleSource = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("middle column removes secondary welcome and status copy", () => {
  assert.doesNotMatch(pageSource, /className="header-subtitle"/);
  assert.doesNotMatch(pageSource, /className="welcome-eyebrow"/);
  assert.doesNotMatch(pageSource, /当前会话已绑定本地项目/);
  assert.doesNotMatch(pageSource, /STATUS_COPY/);
});

test("composer stays accessible without visible placeholder copy", () => {
  const composerStart = pageSource.indexOf("<ComposerSurface");
  const composerEnd = pageSource.indexOf("</ComposerSurface>", composerStart);
  const composerSource = pageSource.slice(composerStart, composerEnd);

  assert.ok(composerStart > 0);
  assert.doesNotMatch(composerSource, /placeholder=/);
  assert.match(composerSource, /aria-label="投研任务"/);
});

test("welcome heading flows directly into suggestions with compact spacing", () => {
  assert.match(styleSource, /\.welcome-state h2\s*\{[^}]*margin:\s*0 0 28px;/s);
  assert.match(styleSource, /\.suggestion-grid\s*\{[^}]*margin-top:\s*0;/s);
  assert.doesNotMatch(styleSource, /\.header-subtitle|\.status-dot|\.welcome-eyebrow/);
});

test("messages omit identity metadata and present user input as a right-aligned bubble", () => {
  assert.doesNotMatch(pageSource, /className="message-avatar"/);
  assert.doesNotMatch(pageSource, /className="message-meta"/);
  assert.doesNotMatch(pageSource, /function formatTime\(/);
  assert.match(styleSource, /\.message\.user\s*\{[^}]*display:\s*flex;[^}]*justify-content:\s*flex-end;/s);
  assert.match(styleSource, /\.message\.user \.message-body\s*\{[^}]*width:\s*fit-content;[^}]*max-width:\s*min\(80%, 620px\);/s);
  assert.match(styleSource, /\.message\.user \.message-content\s*\{[^}]*padding:\s*7px 14px;[^}]*border-radius:\s*18px;[^}]*background:\s*var\(--muted\);/s);
});
