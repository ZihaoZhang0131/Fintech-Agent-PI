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
  const composerStart = pageSource.indexOf('className="composer"');
  const composerEnd = pageSource.indexOf("</form>", composerStart);
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
