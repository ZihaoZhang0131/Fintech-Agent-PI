import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const component = await readFile(new URL("../components/model-library.tsx", import.meta.url), "utf8");
const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("model management has a compact sidebar entry and keeps credentials out of browser storage", () => {
  assert.match(page, />模型</);
  assert.match(page, /<ModelLibrary/);
  assert.match(page, /<optgroup label=\{provider\.label\}/);
  assert.match(page, /model:\s*\{\s*providerId: selectedModel\.providerId,/s);
  assert.doesNotMatch(component, /localStorage/);
  assert.match(component, /type="password"/);
  assert.match(component, /保存并测试/);
  assert.match(component, /重新测试/);
  assert.match(css, /\.model-provider-grid/);
  assert.match(css, /\.model-dialog/);
});
