import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const stylesheet = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
const localRoute = await readFile(new URL("../app/api/local/[...segments]/route.ts", import.meta.url), "utf8");
const codePreview = await readFile(new URL("../components/code-preview.tsx", import.meta.url), "utf8");

test("file preview UI uses protected asset URLs instead of Base64 data URLs", () => {
  assert.match(pageSource, /files\/asset\?path=\$\{encodeURIComponent\(activeFilePath\)\}/);
  assert.match(pageSource, /download=1/);
  assert.doesNotMatch(pageSource, /data:\$\{filePreview\.mimeType\};base64/);
  assert.match(pageSource, /<img src=\{previewAssetUrl\}/);
  assert.match(pageSource, /<iframe src=\{previewAssetUrl\}/);
});

test("file preview UI exposes code, download, and recoverable unsupported states", () => {
  assert.match(pageSource, /<CodePreview/);
  assert.match(pageSource, /下载原件/);
  assert.match(pageSource, /previewKindLabel/);
  assert.match(pageSource, /重新加载/);
  assert.match(pageSource, /文件超过预览限制/);
  assert.match(pageSource, /该文件可下载后使用对应应用打开/);
  assert.match(stylesheet, /\.ide-code-preview\s*\{[^}]*min-width: max-content;/s);
  assert.match(stylesheet, /\.workspace-preview-actions\s*\{[^}]*gap: 5px;/s);
});

test("code preview provides Prism highlighting and an IDE-style fixed line-number gutter", () => {
  assert.match(codePreview, /import Prism from "prismjs"/);
  assert.match(codePreview, /prism-python/);
  assert.match(codePreview, /prism-typescript/);
  assert.match(codePreview, /prism-tsx/);
  assert.match(codePreview, /prism-scss/);
  assert.match(codePreview, /Prism\.highlight\(normalizedContent, grammar, language\)/);
  assert.match(codePreview, /className="code-line-numbers"/);
  assert.match(codePreview, /dangerouslySetInnerHTML/);
  assert.match(stylesheet, /\.code-line-numbers\s*\{[^}]*position: sticky;[^}]*left: 0;/s);
  assert.match(stylesheet, /\.ide-code-preview \.token\.keyword/);
  assert.match(stylesheet, /\.ide-code-preview pre\s*\{[^}]*white-space: pre;/s);
});

test("local API proxy preserves binary preview safety headers", () => {
  assert.match(localRoute, /"content-disposition"/);
  assert.match(localRoute, /"x-content-type-options"/);
  assert.match(localRoute, /"content-length"/);
  assert.match(localRoute, /new Headers\(\{ "Cache-Control": "no-store" \}\)/);
});
