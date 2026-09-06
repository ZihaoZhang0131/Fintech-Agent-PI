import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const stylesheet = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("workspace exposes persistent resizers for both outer columns", () => {
  assert.match(pageSource, /SIDEBAR_WIDTH_KEY/);
  assert.match(pageSource, /FILE_PANEL_WIDTH_KEY/);
  assert.match(pageSource, /aria-label="调整左侧栏宽度"/);
  assert.match(pageSource, /aria-label="调整右侧栏宽度"/);
  assert.match(pageSource, /aria-label="隐藏左侧栏"/);
  assert.match(pageSource, /aria-label="展开左侧栏"/);
  assert.match(pageSource, /aria-label="隐藏右侧栏"/);
  assert.match(pageSource, /aria-label="展开右侧栏"/);
  assert.match(stylesheet, /cursor: col-resize/);
});

test("project files panel exposes persistent browser-style file tabs", () => {
  assert.match(pageSource, /FILE_TABS_KEY/);
  assert.match(pageSource, /role="tablist"/);
  assert.match(pageSource, /workspace-directory-tab/);
  assert.match(pageSource, /role="tab"/);
  assert.match(pageSource, /aria-selected=/);
  assert.match(pageSource, /className="workspace-file-tab-close"/);
  assert.match(pageSource, /role="tabpanel"/);
  assert.match(stylesheet, /\.workspace-file-tabs-scroll\s*\{[^}]*display: contents;/s);
  assert.match(
    stylesheet,
    /\.workspace-directory-tab,\s*\.workspace-tabs-placeholder,\s*\.workspace-file-tab\s*\{[^}]*width: 100%;[^}]*min-width: 0;[^}]*height: 28px;/s,
  );
  assert.match(
    stylesheet,
    /\.workspace-tabs-list\s*\{[^}]*max-width: calc\(var\(--workspace-tab-count, 1\) \* 96px\);[^}]*grid-template-columns: repeat\(var\(--workspace-tab-count, 1\), minmax\(0, 1fr\)\);/s,
  );
  assert.match(
    stylesheet,
    /\.workspace-tabs-bar\s*\{[^}]*min-height: 32px;[^}]*margin: 4px 6px 0;[^}]*border: 0;[^}]*background: transparent;/s,
  );
  assert.match(
    stylesheet,
    /\.workspace-directory-tab,\s*\.workspace-tabs-placeholder,\s*\.workspace-file-tab\s*\{[^}]*border-radius: 8px 8px 0 0;/s,
  );
  assert.match(
    stylesheet,
    /\.workspace-file-tab\.active::before\s*\{[^}]*background: radial-gradient\(circle at 0 0, transparent 7\.5px, var\(--popover\) 8px\);/s,
  );
  assert.match(
    stylesheet,
    /\.workspace-file-tab\.active::after\s*\{[^}]*background: radial-gradient\(circle at 100% 0, transparent 7\.5px, var\(--popover\) 8px\);/s,
  );
  assert.match(
    stylesheet,
    /\.workspace-file-tab-close\s*\{[^}]*opacity: 0;[^}]*visibility: hidden;[^}]*pointer-events: none;/s,
  );
  assert.match(
    stylesheet,
    /\.workspace-file-tab\.active \.workspace-file-tab-close\s*\{[^}]*opacity: 1;[^}]*visibility: visible;[^}]*pointer-events: auto;/s,
  );
  assert.match(
    stylesheet,
    /\.workspace-directory-tab\s*\{[^}]*overflow: visible;/s,
  );
  assert.match(
    stylesheet,
    /\.workspace-tabs-bar \.artifact-header-actions\s*\{[^}]*margin-left: auto;/s,
  );
  assert.match(
    stylesheet,
    /\.workspace-preview-toolbar\s*\{[^}]*border-bottom: 1px solid var\(--line\);/s,
  );
  assert.doesNotMatch(pageSource, /FILE_BROWSER_RATIO_KEY|FILE_BROWSER_VISIBLE_KEY|FILE_PREVIEW_VISIBLE_KEY/);
  assert.doesNotMatch(pageSource, /调整文件目录和预览区域高度|隐藏文件预览|展开文件预览/);
  assert.doesNotMatch(stylesheet, /workspace-section-resizer|--file-browser-ratio/);
});
