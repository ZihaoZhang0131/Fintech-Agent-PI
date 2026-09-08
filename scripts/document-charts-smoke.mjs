// Actual Runtime integration; no model call. Configure DOCUMENT_SOFFICE_PATH for PDF.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, symlink } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { createLocalRuntimeHandler, registerWorkspace } from "../server/local-runtime.mjs";

const root = path.resolve(".local-data/chart-smoke", randomUUID());
const data = path.join(root, "runtime"), project = path.join(root, "project");
await mkdir(data, { recursive: true });
await mkdir(project);
for (const name of ["pandoc", "documents-venv", "documents-ready-v3"]) await symlink(path.resolve(".local-data", name), path.join(data, name));
const workspace = await registerWorkspace(data, project);
const token = randomUUID();
const handler = createLocalRuntimeHandler({ dataDirectory: data, token, mcpManager: { async listServers() { return []; }, async close() {} } });
const server = createServer(handler);
await new Promise(r => server.listen(0, "127.0.0.1", r));
const endpoint = `http://127.0.0.1:${server.address().port}/workspaces/${workspace.id}/documents/generate`;
const { charts } = JSON.parse(await readFile("tests/fixtures/document-charts.json", "utf8"));
const markdown = "# 原生图表报告验证\n\n本报告使用固定测试数据，检查趋势、对比、构成与关系图的生成与交付。数据仅用于软件验收。\n\n" + charts.map(c => `{{chart:${c.id}}}`).join("\n\n");
try {
  for (const format of ["docx", "pdf"]) {
    const response = await fetch(endpoint, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ format, filename: "native-charts", markdown, charts }) });
    const result = await response.json();
    assert.equal(response.status, 201, JSON.stringify(result));
    assert.ok(result.chartsPath);
    const snapshot = JSON.parse(await readFile(path.join(project, result.chartsPath), "utf8"));
    assert.deepEqual(snapshot.charts, charts);
    if (format === "docx") {
      execFileSync(process.env.DOCUMENT_PYTHON_PATH || path.resolve(".local-data/documents-venv/bin/python"), ["tests/verify_native_charts.py", path.join(project, result.path), path.join(project, result.chartsPath)], { stdio: "inherit" });
    } else assert.ok(result.pageCount > 0 && result.renderedPages === result.pageCount);
    console.log(JSON.stringify({ format, ...result, absolutePath: path.join(project, result.path) }));
  }
} finally {
  await handler.close();
  server.closeAllConnections();
  await new Promise(r => server.close(r));
}
