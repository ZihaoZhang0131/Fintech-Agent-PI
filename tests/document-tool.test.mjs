import assert from "node:assert/strict";
import { chmod, mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { createDocumentTool } from "../server/agent/tools/generate-document.ts";
import { createLocalRuntimeHandler, registerWorkspace } from "../server/local-runtime.mjs";

test("document tool calls only the dedicated authenticated Runtime endpoint", async () => {
  let request;
  const tool = createDocumentTool("workspace-1", {
    fetchImpl: async (url, init) => {
      request = { url: String(url), init };
      return new Response(JSON.stringify({
        path: "outputs/brief.docx", format: "docx", size: 1234, pageCount: 2, renderedPages: 2,
      }), { status: 201, headers: { "Content-Type": "application/json" } });
    },
  });
  const previousUrl = process.env.LOCAL_RUNTIME_URL;
  const previousToken = process.env.LOCAL_RUNTIME_TOKEN;
  process.env.LOCAL_RUNTIME_URL = "http://127.0.0.1:4318";
  process.env.LOCAL_RUNTIME_TOKEN = "test-token";
  try {
    const result = await tool.execute("call-1", {
      format: "docx",
      filename: "brief",
      markdown: "# Brief\n",
      charts: [],
    });
    assert.match(request.url, /\/workspaces\/workspace-1\/documents\/generate$/);
    assert.equal(request.init.headers.Authorization, "Bearer test-token");
    assert.equal(result.details.kind, "document");
    assert.equal(result.details.path, "outputs/brief.docx");
  } finally {
    if (previousUrl === undefined) delete process.env.LOCAL_RUNTIME_URL;
    else process.env.LOCAL_RUNTIME_URL = previousUrl;
    if (previousToken === undefined) delete process.env.LOCAL_RUNTIME_TOKEN;
    else process.env.LOCAL_RUNTIME_TOKEN = previousToken;
  }
});

test("document Runtime rejects unsafe input before invoking external renderers", async (t) => {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), "pi-document-runtime-"));
  t.after(() => rm(temporaryRoot, { recursive: true, force: true }));
  const dataDirectory = path.join(temporaryRoot, "data");
  const workspaceDirectory = path.join(temporaryRoot, "workspace");
  await mkdir(workspaceDirectory);
  const workspace = await registerWorkspace(dataDirectory, workspaceDirectory);
  const server = createServer(createLocalRuntimeHandler({ dataDirectory, token: "document-token", mcpManager: { listServers() {} } }));
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const address = server.address();
  const endpoint = `http://127.0.0.1:${address.port}/workspaces/${workspace.id}/documents/generate`;
  const headers = { Authorization: "Bearer document-token", "Content-Type": "application/json" };

  const unsafeName = await fetch(endpoint, {
    method: "POST", headers,
    body: JSON.stringify({ format: "pdf", filename: "../escape", markdown: "# test" }),
  });
  assert.equal(unsafeName.status, 400);
  assert.match((await unsafeName.json()).message, /文件名/);

  const invalidChart = await fetch(endpoint, {
    method: "POST", headers,
    body: JSON.stringify({
      format: "pdf", filename: "safe", markdown: "# test",
      charts: [{ id: "chart", type: "line", labels: ["A"], series: [{ name: "x", values: [1, 2] }] }],
    }),
  });
  assert.equal(invalidChart.status, 400);
  assert.match((await invalidChart.json()).message, /图表序列/);

  const escapingTemplate = await fetch(endpoint, {
    method: "POST", headers,
    body: JSON.stringify({ format: "docx", filename: "safe", markdown: "# test", referenceDocxPath: "../outside.docx" }),
  });
  assert.equal(escapingTemplate.status, 400);
  assert.match((await escapingTemplate.json()).message, /模板/);
});

test("document Runtime generates plain DOCX and PDF without LibreOffice", async (t) => {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), "pi-document-no-soffice-"));
  t.after(() => rm(temporaryRoot, { recursive: true, force: true }));
  const dataDirectory = path.join(temporaryRoot, "data");
  const workspaceDirectory = path.join(temporaryRoot, "workspace");
  const fakePython = path.join(temporaryRoot, "python");
  const fakePandoc = path.join(temporaryRoot, "pandoc");
  await mkdir(workspaceDirectory);
  await mkdir(dataDirectory);
  await writeFile(fakePandoc, "fixture\n");
  await writeFile(path.join(dataDirectory, "documents-ready-v3"), "fixture\n");
  await writeFile(fakePython, `#!/bin/sh
docx="$3"
printf 'PKstub' > "$docx"
if [ "\${4:-}" = "--pdf" ]; then
  pdf="$5"
  render_dir="$7"
  printf '%%PDF-1.4\\n%%%%EOF\\n' > "$pdf"
  mkdir -p "$render_dir"
  printf '\\211PNG\\r\\n\\032\\nfixture' > "$render_dir/page-1.png"
  printf '%s\\n' 'DOCUMENT_RESULT {"pageCount":1,"renderedPages":1}'
fi
`);
  await chmod(fakePython, 0o755);
  const previousEnvironment = {
    PANDOC_PATH: process.env.PANDOC_PATH,
    DOCUMENT_PYTHON_PATH: process.env.DOCUMENT_PYTHON_PATH,
    DOCUMENT_SOFFICE_PATH: process.env.DOCUMENT_SOFFICE_PATH,
  };
  process.env.PANDOC_PATH = fakePandoc;
  process.env.DOCUMENT_PYTHON_PATH = fakePython;
  process.env.DOCUMENT_SOFFICE_PATH = path.join(temporaryRoot, "missing-soffice");
  t.after(() => {
    for (const [name, value] of Object.entries(previousEnvironment)) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  });
  const workspace = await registerWorkspace(dataDirectory, workspaceDirectory);
  const server = createServer(createLocalRuntimeHandler({ dataDirectory, token: "document-token", mcpManager: { listServers() {} } }));
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const address = server.address();
  const endpoint = `http://127.0.0.1:${address.port}/workspaces/${workspace.id}/documents/generate`;
  const headers = { Authorization: "Bearer document-token", "Content-Type": "application/json" };

  const docxResponse = await fetch(endpoint, {
    method: "POST", headers,
    body: JSON.stringify({ format: "docx", filename: "plain-word", markdown: "# Word" }),
  });
  assert.equal(docxResponse.status, 201);
  assert.equal((await docxResponse.json()).verification, "structural");
  assert.match((await readFile(path.join(workspaceDirectory, "outputs", "plain-word.docx"))).subarray(0, 2).toString(), /PK/);

  const pdfResponse = await fetch(endpoint, {
    method: "POST", headers,
    body: JSON.stringify({ format: "pdf", filename: "plain-pdf", markdown: "# PDF" }),
  });
  assert.equal(pdfResponse.status, 201);
  const pdfResult = await pdfResponse.json();
  assert.deepEqual({ pageCount: pdfResult.pageCount, renderedPages: pdfResult.renderedPages, verification: pdfResult.verification }, {
    pageCount: 1,
    renderedPages: 1,
    verification: "rendered",
  });
  assert.equal((await readFile(path.join(workspaceDirectory, "outputs", "plain-pdf.pdf"))).subarray(0, 5).toString(), "%PDF-");
});

test("document implementation keeps Pandoc provisioning and non-executable Markdown boundaries explicit", async () => {
  const runtime = await import("node:fs/promises").then(({ readFile }) => readFile(new URL("../server/local-runtime.mjs", import.meta.url), "utf8"));
  const renderer = await import("node:fs/promises").then(({ readFile }) => readFile(new URL("../server/document-renderer.py", import.meta.url), "utf8"));
  const setup = await import("node:fs/promises").then(({ readFile }) => readFile(new URL("../scripts/setup-pandoc.mjs", import.meta.url), "utf8"));
  const startup = await import("node:fs/promises").then(({ readFile }) => readFile(new URL("../scripts/run-local.mjs", import.meta.url), "utf8"));
  const chatRoute = await import("node:fs/promises").then(({ readFile }) => readFile(new URL("../app/api/chat/stream/route.ts", import.meta.url), "utf8"));
  assert.match(setup, /createHash\("sha256"\)/);
  assert.match(setup, /const version = "3\.9\.0\.2"/);
  assert.match(setup, /pandoc-\$\{version\}-arm64\/bin\/pandoc/);
  assert.match(setup, /pandoc-\$\{version\}-x86_64\/bin\/pandoc/);
  assert.match(setup, /\/usr\/bin\/curl/);
  assert.match(setup, /--max-time/);
  assert.match(setup, /python-docx==1\.2\.0/);
  assert.match(setup, /reportlab==4\.4\.9/);
  assert.match(setup, /pypdfium2==5\.12\.1/);
  assert.match(startup, /startPandocProvisioning/);
  assert.match(startup, /documents-ready-v3/);
  assert.match(runtime, /文档组件尚未初始化完成/);
  assert.match(runtime, /verification: "structural"/);
  assert.match(chatRoute, /严禁为了文档生成调用 Bash、npm、Pandoc、Python/);
  assert.match(renderer, /Markdown 图片只能引用本次 charts 参数生成的图表/);
  assert.match(renderer, /--reference-doc/);
});
