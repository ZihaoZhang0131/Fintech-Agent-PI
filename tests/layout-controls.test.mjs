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

test("project files panel exposes a persistent horizontal split and section toggles", () => {
  assert.match(pageSource, /FILE_BROWSER_RATIO_KEY/);
  assert.match(pageSource, /aria-label="调整文件目录和预览区域高度"/);
  assert.match(pageSource, /aria-label="隐藏文件目录"/);
  assert.match(pageSource, /展开文件目录/);
  assert.match(pageSource, /aria-label="隐藏文件预览"/);
  assert.match(pageSource, /展开文件预览/);
  assert.match(stylesheet, /cursor: row-resize/);
  assert.match(stylesheet, /--file-browser-ratio/);
});
