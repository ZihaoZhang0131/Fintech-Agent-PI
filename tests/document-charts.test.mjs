import assert from "node:assert/strict";
import test from "node:test";
import { chmod, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { validateDocumentCharts } from "../server/document-charts.mjs";
import { documentOfficeEnvironment, resolveDocumentOffice } from "../server/document-office.mjs";
import { createDocumentTool } from "../server/agent/tools/generate-document.ts";

const { charts } = JSON.parse(await readFile(new URL("./fixtures/document-charts.json", import.meta.url), "utf8"));
const markdown = charts.map(c => `{{chart:${c.id}}}`).join("\n\n");
test("all six native chart types retain the portable data contract", () => {
  assert.deepEqual(validateDocumentCharts(charts, markdown), charts);
});
test("chart validation rejects misleading and malformed data before rendering", () => {
  const bad = (index, patch, message) => {
    const data = structuredClone(charts);
    Object.assign(data[index], patch);
    assert.throws(() => validateDocumentCharts(data, markdown), message);
  };
  bad(0, { truncated: true }, /截断/);
  bad(0, { series: [{ name: "missing", values: [1, null, 3, 4] }] }, /有限数字/);
  bad(0, { series: [{ name: "infinite", values: [1, Infinity, 3, 4] }] }, /有限数字/);
  bad(0, { series: [{ name: "short", values: [1] }] }, /一致/);
  bad(0, { labels: Array(49).fill("x") }, /48/);
  bad(3, { series: [{ name: "x", points: [{ x: "2", y: 3 }] }] }, /点对/);
  bad(4, { series: [{ name: "x", values: [1, -1, 2] }] }, /占比图/);
  bad(4, { series: [{ name: "x", values: [0, 0, 0] }] }, /占比图/);
  bad(4, { series: [{ name: "x", values: [1, 2, 3] }, { name: "y", values: [1, 2, 3] }] }, /占比图/);
  assert.throws(() => validateDocumentCharts(charts, markdown + "{{chart:trend}}"), /恰好/);
  assert.throws(() => validateDocumentCharts(charts, markdown + "{{chart:missing}}"), /未定义/);
  assert.throws(() => validateDocumentCharts([...charts, charts[0]], markdown), /重复/);
});
test("Office discovery respects explicit configuration and finds PATH executables", async t => {
  const root = await mkdtemp(path.join(os.tmpdir(), "office-test-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const executable = path.join(root, "soffice");
  await writeFile(executable, "#!/bin/sh\nexit 0\n");
  await chmod(executable, 0o755);
  assert.equal(await resolveDocumentOffice({ PATH: root }, "linux"), executable);
  await assert.rejects(resolveDocumentOffice({ PATH: root, DOCUMENT_SOFFICE_PATH: path.join(root, "missing") }), /LibreOffice/);
  await assert.rejects(resolveDocumentOffice({ PATH: "" }, "linux"), /仍可选择生成 DOCX/);
});
test("Office font configuration is job-local and preserves an explicit user configuration", async t => {
  const root = await mkdtemp(path.join(os.tmpdir(), "office-fonts-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const existing = { FONTCONFIG_FILE: "/existing/fonts.conf" };
  assert.equal(await documentOfficeEnvironment(root, existing, "darwin"), existing);
  const environment = await documentOfficeEnvironment(root, { DOCUMENT_CJK_FONT_PATH: path.join(root, "font.ttf") }, "linux");
  assert.equal(environment.FONTCONFIG_FILE, path.join(root, "fonts.conf"));
  const config = await readFile(environment.FONTCONFIG_FILE, "utf8");
  assert.ok(config.includes(`<dir>${root}</dir>`));
  assert.ok(config.includes(`<cachedir>${root}/font-cache</cachedir>`));
});
test("document tool returns data references to the caller without image interpretation", async t => {
  const previous = { LOCAL_RUNTIME_URL: process.env.LOCAL_RUNTIME_URL, LOCAL_RUNTIME_TOKEN: process.env.LOCAL_RUNTIME_TOKEN };
  Object.assign(process.env, { LOCAL_RUNTIME_URL: "http://localhost:9999", LOCAL_RUNTIME_TOKEN: "fixture" });
  t.after(() => { for (const [key, value] of Object.entries(previous)) { if (value === undefined) delete process.env[key]; else process.env[key] = value; } });
  const tool = createDocumentTool("test", { fetchImpl: async () => Response.json({ path: "outputs/report.docx", chartsPath: "outputs/report.charts.json", format: "docx", size: 100, pageCount: 0, renderedPages: 0, verification: "structural" }) });
  const output = await tool.execute("chart-test", { format: "docx", filename: "report", markdown, charts });
  assert.equal(output.details.chartsPath, "outputs/report.charts.json");
  assert.match(output.content[0].text, /report\.charts\.json/);
});
