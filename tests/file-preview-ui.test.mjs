import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const stylesheet = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
const localRoute = await readFile(new URL("../app/api/local/[...segments]/route.ts", import.meta.url), "utf8");
const codePreview = await readFile(new URL("../components/code-preview.tsx", import.meta.url), "utf8");
const fileSystemTree = await readFile(new URL("../components/file-system-tree.tsx", import.meta.url), "utf8");

test("file preview UI uses protected asset URLs instead of Base64 data URLs", () => {
  assert.match(pageSource, /files\/asset\?path=\$\{encodeURIComponent\(activeFilePath\)\}/);
  assert.match(pageSource, /download=1/);
  assert.doesNotMatch(pageSource, /data:\$\{filePreview\.mimeType\};base64/);
  assert.match(pageSource, /<img src=\{previewAssetUrl\}/);
  assert.match(pageSource, /<iframe src=\{previewAssetUrl\}/);
});

test("file preview UI exposes code, download, and recoverable unsupported states", () => {
  assert.match(pageSource, /<CodePreview/);
  assert.match(pageSource, /aria-label=\{copiedPreviewPath === activeFilePath \? "已复制文件" : "复制文件"\}/);
  assert.match(pageSource, /aria-label="下载文件"/);
  assert.doesNotMatch(pageSource, /previewKindLabel|下载原件|>复制</);
  assert.match(pageSource, /重新加载/);
  assert.match(pageSource, /文件超过预览限制/);
  assert.match(pageSource, /该文件可下载后使用对应应用打开/);
  assert.match(stylesheet, /\.ide-code-preview\s*\{[^}]*min-width: max-content;/s);
  assert.match(stylesheet, /\.workspace-preview-actions\s*\{[^}]*gap: 5px;/s);
  assert.match(pageSource, /filePreview\.kind === "kami-html"/);
  assert.match(pageSource, /sandbox="allow-scripts"/);
  assert.match(pageSource, /srcDoc=\{filePreview\.content\}/);
  assert.match(pageSource, /查看 Kami 源码/);
  assert.doesNotMatch(pageSource, /sandbox="[^"]*allow-same-origin/);
});

test("Markdown workspace files reuse the GFM renderer", () => {
  assert.match(pageSource, /\["\.md", "\.mdx"\]\.includes\(filePreview\.extension\)/);
  assert.match(pageSource, /<MarkdownMessage content=\{filePreview\.content\} projectNavigation=/);
  assert.doesNotMatch(pageSource, /<ReactMarkdown>\{filePreview\.content\}<\/ReactMarkdown>/);
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

test("file browser exposes lazy, accessible directory expansion with local retry", () => {
  assert.match(pageSource, /\?path=\$\{encodeURIComponent\(directoryPath\)\}/);
  assert.match(pageSource, /<FileSystemTree/);
  assert.match(pageSource, /onDirectoryToggle=\{toggleProjectDirectory\}/);
  assert.match(pageSource, /loadProjectDirectory\(activeProject\.id, file\.path\)/);
  assert.match(fileSystemTree, /aria-expanded=\{expanded\}/);
  assert.match(fileSystemTree, /event\.key === "ArrowRight"/);
  assert.match(fileSystemTree, />重试</);
  assert.match(fileSystemTree, /空文件夹/);
  assert.match(stylesheet, /\.workspace-directory-status\s*\{/);
  assert.match(stylesheet, /\.workspace-directory-chevron\s*\{/);
});
