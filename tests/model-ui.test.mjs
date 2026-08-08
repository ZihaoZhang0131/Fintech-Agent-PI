import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
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

test("model provider cards have local brand assets and theme tokens for every supported provider", async () => {
  assert.match(component, /const PROVIDER_BRANDS/);
  assert.match(component, /model-provider-logo/);
  assert.match(component, /--provider-accent/);
  for (const providerId of ["deepseek", "openai", "anthropic", "gemini", "qwen", "kimi", "zhipu"]) {
    assert.match(component, new RegExp(`${providerId}:\\s*\\{`));
    assert.match(component, new RegExp(`/provider-logos/${providerId}\\.svg`));
    await access(new URL(`../public/provider-logos/${providerId}.svg`, import.meta.url));
  }
  assert.match(css, /\.model-provider-card::before/);
  assert.match(css, /\.model-provider-logo/);
});
