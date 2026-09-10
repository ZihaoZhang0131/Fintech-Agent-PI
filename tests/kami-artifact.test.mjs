import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { BUNDLED_SKILL_NAMES, AGENT_TOOL_NAMES } from "../server/agent/capability-policy.ts";
import { createKamiArtifactTool } from "../server/agent/tools/render-kami-artifact.ts";
import { createLoadedSkillTracker } from "../server/agent/tools/load-skill.ts";
import { createSkillResourceTools } from "../server/agent/tools/skill-resources.ts";
import { parseSkill } from "../server/agent/skills/parser.ts";
import { registryFromSkills } from "../server/agent/skills/registry.ts";
import { renderKamiArtifact, validateKamiPayload, verifyKamiHtmlManifest } from "../server/kami-artifact.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const minimalContent = { type: "one-pager", lang: "zh-CN", content: {} };

test("Kami is a compact bundled Skill with a pinned, progressively loaded resource tree", async () => {
  const source = await readFile(path.join(root, ".agents/skills/kami/SKILL.md"), "utf8");
  const parsed = parseSkill(source);
  assert.equal(parsed.name, "kami");
  assert.ok(source.length < 20_000);
  assert.match(source, /render_kami_artifact/);
  assert.match(await readFile(path.join(root, ".agents/skills/kami/references/local-integration.md"), "utf8"), /4dab24cc4c527dbb35aa8fae09e02822992dfbe2/);
  assert.ok(BUNDLED_SKILL_NAMES.includes("kami"));
  assert.ok(AGENT_TOOL_NAMES.includes("render_kami_artifact"));
});

test("Kami tool calls only the authenticated dedicated Runtime endpoint", async () => {
  let request;
  const tool = createKamiArtifactTool("workspace-1", { fetchImpl: async (url, init) => {
    request = { url: String(url), init };
    return Response.json({ paths: { content: "outputs/x.content.json", html: "outputs/x.html", pdf: "outputs/x.pdf", manifest: "outputs/x.kami.json" }, previewPaths: ["outputs/x.preview/page-01.png"], pageCount: 1, renderedPages: 1, checks: [], fontFallback: { used: true, requested: "Songti SC", resolved: "Songti SC" }, visualReviewPending: true }, { status: 201 });
  }});
  const previous = [process.env.LOCAL_RUNTIME_URL, process.env.LOCAL_RUNTIME_TOKEN];
  process.env.LOCAL_RUNTIME_URL = "http://127.0.0.1:4318";
  process.env.LOCAL_RUNTIME_TOKEN = "token";
  try {
    const result = await tool.execute("call", { template: "one-pager", language: "zh-CN", filename: "x", formats: ["html", "pdf"], html: "<html></html>", contentIr: minimalContent, assets: [], overwrite: false });
    assert.match(request.url, /\/workspaces\/workspace-1\/artifacts\/kami\/render$/);
    assert.equal(request.init.headers.Authorization, "Bearer token");
    assert.equal(result.details.kind, "kami_artifact");
    assert.equal(result.details.visualReviewPending, true);
  } finally {
    if (previous[0] === undefined) delete process.env.LOCAL_RUNTIME_URL; else process.env.LOCAL_RUNTIME_URL = previous[0];
    if (previous[1] === undefined) delete process.env.LOCAL_RUNTIME_TOKEN; else process.env.LOCAL_RUNTIME_TOKEN = previous[1];
  }
});

test("Kami request matrix and filenames are fixed", () => {
  assert.throws(() => validateKamiPayload({ template: "landing-page", language: "zh-CN", filename: "site", formats: ["html", "pdf"], html: "x", contentIr: { type: "landing-page", lang: "zh-CN", content: {} } }), /落地页/);
  assert.throws(() => validateKamiPayload({ template: "one-pager", language: "zh-CN", filename: "..\/escape", formats: ["html", "pdf"], html: "x", contentIr: minimalContent }), /文件名/);
  assert.throws(() => validateKamiPayload({ template: "one-pager", language: "zh-CN", filename: "x", formats: ["html"], html: "x", contentIr: minimalContent }), /HTML.*PDF|formats/);
  assert.throws(() => validateKamiPayload({ template: "one-pager", language: "zh-CN", filename: "x", formats: ["html", "pdf"], html: "x".repeat(1_500_001), contentIr: minimalContent }), /1\.5MB/);
});

test("Kami honors overwrite protection and a pre-cancelled render publishes nothing", async (t) => {
  const temporary = await mkdtemp(path.join(tmpdir(), "kami-publish-"));
  t.after(() => rm(temporary, { recursive: true, force: true }));
  const dataDirectory = path.join(temporary, "data");
  const workspacePath = path.join(temporary, "workspace");
  const outputs = path.join(workspacePath, "outputs");
  await mkdir(dataDirectory, { recursive: true });
  await mkdir(outputs, { recursive: true });
  await writeFile(path.join(dataDirectory, "kami-ready-v1"), "test");
  await writeFile(path.join(outputs, "protected.html"), "user-owned");
  const base = { workspace: { path: workspacePath }, dataDirectory, pythonPath: "/usr/bin/python3", runtimeRoot: root };
  const payload = { template: "one-pager", language: "zh-CN", filename: "protected", formats: ["html", "pdf"], html: "<html></html>", contentIr: minimalContent };
  await assert.rejects(() => renderKamiArtifact({ ...base, payload }), (error) => error?.status === 409 && /overwrite/.test(error.message));
  assert.equal(await readFile(path.join(outputs, "protected.html"), "utf8"), "user-owned");

  const controller = new AbortController();
  controller.abort();
  await assert.rejects(() => renderKamiArtifact({ ...base, payload: { ...payload, filename: "cancelled" }, signal: controller.signal }), (error) => error?.status === 499);
  await assert.rejects(() => readFile(path.join(outputs, "cancelled.html")), /ENOENT/);
});

test("Kami rejects path escape and external resources before publishing", async (t) => {
  const temporary = await mkdtemp(path.join(tmpdir(), "kami-safety-"));
  t.after(() => rm(temporary, { recursive: true, force: true }));
  const dataDirectory = path.join(temporary, "data");
  const workspacePath = path.join(temporary, "workspace");
  await mkdir(path.join(dataDirectory), { recursive: true });
  await mkdir(workspacePath);
  await writeFile(path.join(dataDirectory, "kami-ready-v1"), "test");
  const base = { workspace: { path: workspacePath }, dataDirectory, pythonPath: "/usr/bin/python3", runtimeRoot: root };
  await assert.rejects(() => renderKamiArtifact({ ...base, payload: { template: "one-pager", language: "zh-CN", filename: "escape", formats: ["html", "pdf"], html: '<html><img src="kami-asset://hero"></html>', contentIr: minimalContent, assets: [{ id: "hero", projectPath: "../outside.png" }] } }), /项目内|外部/);
  await assert.rejects(() => renderKamiArtifact({ ...base, payload: { template: "one-pager", language: "zh-CN", filename: "remote", formats: ["html", "pdf"], html: '<html><img src="https:\/\/example.com\/x.png"></html>', contentIr: minimalContent } }), /外部或本机资源/);
  await assert.rejects(() => readFile(path.join(workspacePath, "outputs", "remote.html")), /ENOENT/);
});

test("Kami HTML preview requires a matching manifest digest", async (t) => {
  const temporary = await mkdtemp(path.join(tmpdir(), "kami-preview-"));
  t.after(() => rm(temporary, { recursive: true, force: true }));
  const outputs = path.join(temporary, "outputs");
  await mkdir(outputs);
  const html = Buffer.from("<!doctype html><title>Kami</title>");
  const { createHash } = await import("node:crypto");
  const digest = createHash("sha256").update(html).digest("hex");
  await writeFile(path.join(outputs, "report.html"), html);
  await writeFile(path.join(outputs, "report.kami.json"), JSON.stringify({ kind: "kami-artifact", files: { html: { path: "outputs/report.html", sha256: digest } }, visualReviewPending: true }));
  assert.equal((await verifyKamiHtmlManifest(temporary, "outputs/report.html", html)).sha256, digest);
  assert.equal(await verifyKamiHtmlManifest(temporary, "outputs/report.html", Buffer.from("changed")), null);
});

test("Kami upstream scripts cannot run through the generic Skill script tool", async () => {
  const tracker = createLoadedSkillTracker();
  tracker.add("kami");
  const registry = registryFromSkills([{ name: "kami", description: "test", content: "test", origin: "bundled", id: "bundled:kami", resources: [{ path: "scripts/build.py", size: 10, category: "script", isText: true }] }]);
  const run = createSkillResourceTools(registry, tracker, "workspace", { approvalMode: "auto", permissionMode: "sandbox" }).find((tool) => tool.name === "run_skill_script");
  await assert.rejects(() => run.execute("call", { name: "kami", path: "scripts/build.py" }), /render_kami_artifact/);
});
