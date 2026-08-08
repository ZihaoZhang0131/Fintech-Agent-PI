import assert from "node:assert/strict";
import { access, mkdtemp, mkdir, readFile, rm, stat, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { createServer } from "node:http";
import path from "node:path";
import test from "node:test";

import {
  listWorkspaceFiles,
  listWorkspaceDirectory,
  createCommandManager,
  createLocalRuntimeHandler,
  executeWorkspaceCommand,
  readWorkspaceFile,
  readWorkspaceRegistry,
  registerWorkspace,
  resolveWorkspacePath,
  writeWorkspaceFile,
} from "../server/local-runtime.mjs";
import { createSkillStore } from "../server/skill-store.mjs";

function encoded(value) {
  return Buffer.from(value, "utf8").toString("base64");
}

test("local skill store imports folders, preserves references, overlays bundled skills, and validates paths", async (t) => {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), "pi-skill-store-"));
  t.after(() => rm(temporaryRoot, { recursive: true, force: true }));
  const store = createSkillStore(temporaryRoot);
  const imported = await store.importFolder({
    files: [
      { path: "SKILL.md", data: encoded("---\nname: custom-skill\ndescription: 用户导入的技能。\nallowed_tools:\n  - web_search\n---\n\n执行自定义流程。") },
      { path: "references/example.md", data: encoded("保留的参考资料") },
    ],
  });
  assert.equal(imported.name, "custom-skill");
  await assert.rejects(
    store.importFolder({ files: [{ path: "../SKILL.md", data: encoded("x") }] }),
    /路径/,
  );
  await assert.rejects(
    store.importFolder({ files: [{ path: "SKILL.md", data: encoded("---\nname: custom-skill\ndescription: 重名。\n---\n\n内容") }] }),
    /已存在/,
  );

  const updated = await store.update("bundled:equity-research", {
    name: "company-research",
    description: "本机修改后的内置技能。",
    instructions: "使用本机流程。",
  });
  assert.equal(updated.name, "company-research");
  const state = await store.list();
  assert.equal(state.entries.length, 2);
  assert.ok(state.entries.some((entry) => entry.name === "company-research"));
  await store.remove("bundled:earnings-review");
  assert.ok((await store.list()).deletedBundledNames.includes("earnings-review"));
});

test("local runtime protects MCP discovery and tool-call routes", async (t) => {
  const mcpManager = {
    async listServers() {
      return [{ id: "akshare-one", status: "connected", tools: [{ name: "get_hist_data" }] }];
    },
    async callTool(serverId, toolName, args) {
      return { result: { serverId, toolName, args }, truncated: false };
    },
  };
  const server = createServer(
    createLocalRuntimeHandler({ dataDirectory: tmpdir(), token: "test-token", mcpManager }),
  );
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  const unauthorized = await fetch(`${baseUrl}/mcp/servers`);
  assert.equal(unauthorized.status, 401);

  const listing = await fetch(`${baseUrl}/mcp/servers`, {
    headers: { Authorization: "Bearer test-token" },
  });
  assert.equal(listing.status, 200);
  assert.equal((await listing.json()).servers[0].status, "connected");

  const called = await fetch(`${baseUrl}/mcp/servers/akshare-one/tools/get_hist_data/call`, {
    method: "POST",
    headers: { Authorization: "Bearer test-token", "Content-Type": "application/json" },
    body: JSON.stringify({ arguments: { symbol: "600519" } }),
  });
  assert.equal(called.status, 200);
  assert.equal((await called.json()).result.args.symbol, "600519");
});

test("local runtime binds a folder and keeps file access inside it", async (t) => {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), "pi-local-runtime-"));
  t.after(() => rm(temporaryRoot, { recursive: true, force: true }));
  const dataDirectory = path.join(temporaryRoot, "data");
  const workspaceDirectory = path.join(temporaryRoot, "workspace");
  await mkdir(workspaceDirectory);
  await writeFile(path.join(workspaceDirectory, "source.md"), "# 已有资料\n", "utf8");

  const workspace = await registerWorkspace(dataDirectory, workspaceDirectory);
  assert.equal(workspace.name, "workspace");
  assert.equal((await readWorkspaceRegistry(dataDirectory)).length, 1);

  const written = await writeWorkspaceFile(
    workspace.path,
    "outputs/report.md",
    "# Agent 研究产出\n",
  );
  assert.equal(written.path, "outputs/report.md");

  const listing = await listWorkspaceFiles(workspace.path, 4);
  assert.ok(listing.entries.some((entry) => entry.path === "outputs/report.md"));
  const preview = await readWorkspaceFile(workspace.path, "outputs/report.md");
  assert.equal(preview.kind, "text");
  assert.match(preview.content, /Agent 研究产出/);

  assert.throws(
    () => resolveWorkspacePath(workspace.path, "../../outside.txt"),
    /超出了已绑定的项目目录/,
  );
});

test("workspace file listing only shows first-level entries by default", async (t) => {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), "pi-file-listing-"));
  t.after(() => rm(temporaryRoot, { recursive: true, force: true }));
  await mkdir(path.join(temporaryRoot, "reports", "archive"), { recursive: true });
  await writeFile(path.join(temporaryRoot, "readme.md"), "# Project\n", "utf8");
  await writeFile(path.join(temporaryRoot, "reports", "summary.md"), "# Summary\n", "utf8");
  await writeFile(path.join(temporaryRoot, "reports", "archive", "old.md"), "# Old\n", "utf8");

  const listing = await listWorkspaceFiles(temporaryRoot);
  assert.deepEqual(
    listing.entries.map((entry) => entry.path),
    ["reports", "readme.md"],
  );
});

test("workspace directory listing loads one safe branch at a time", async (t) => {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), "pi-directory-listing-"));
  t.after(() => rm(temporaryRoot, { recursive: true, force: true }));
  const workspaceDirectory = path.join(temporaryRoot, "workspace");
  const outsideDirectory = path.join(temporaryRoot, "outside");
  await mkdir(path.join(workspaceDirectory, "reports", "archive"), { recursive: true });
  await mkdir(path.join(workspaceDirectory, "node_modules"));
  await mkdir(outsideDirectory);
  await writeFile(path.join(workspaceDirectory, "reports", "summary.md"), "# Summary\n", "utf8");
  await writeFile(path.join(workspaceDirectory, "reports", "alpha.md"), "# Alpha\n", "utf8");
  await symlink(outsideDirectory, path.join(workspaceDirectory, "escape"));

  const rootListing = await listWorkspaceDirectory(workspaceDirectory);
  assert.deepEqual(rootListing.entries.map((entry) => entry.path), ["reports"]);

  const reportsListing = await listWorkspaceDirectory(workspaceDirectory, "reports");
  assert.equal(reportsListing.directory, "reports");
  assert.deepEqual(
    reportsListing.entries.map((entry) => entry.path),
    ["reports/archive", "reports/alpha.md", "reports/summary.md"],
  );
  assert.deepEqual(await listWorkspaceDirectory(workspaceDirectory, "reports/archive"), {
    directory: "reports/archive",
    entries: [],
    truncated: false,
  });

  await assert.rejects(
    listWorkspaceDirectory(workspaceDirectory, "../outside"),
    /超出了已绑定的项目目录/,
  );
  await assert.rejects(
    listWorkspaceDirectory(workspaceDirectory, "escape"),
    /目录链接指向项目目录之外/,
  );
  await assert.rejects(
    listWorkspaceDirectory(workspaceDirectory, "reports/summary.md"),
    /所选路径不是目录/,
  );
});

test("workspace files endpoint accepts a directory path without changing recursive depth calls", async (t) => {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), "pi-directory-endpoint-"));
  t.after(() => rm(temporaryRoot, { recursive: true, force: true }));
  const dataDirectory = path.join(temporaryRoot, "data");
  const workspaceDirectory = path.join(temporaryRoot, "workspace");
  await mkdir(path.join(workspaceDirectory, "reports", "archive"), { recursive: true });
  await writeFile(path.join(workspaceDirectory, "reports", "summary.md"), "# Summary\n", "utf8");
  const workspace = await registerWorkspace(dataDirectory, workspaceDirectory);
  const server = createServer(
    createLocalRuntimeHandler({ dataDirectory, token: "directory-token", mcpManager: { listServers() {} } }),
  );
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;
  const request = (suffix) =>
    fetch(`${baseUrl}/workspaces/${workspace.id}/files${suffix}`, {
      headers: { Authorization: "Bearer directory-token" },
    }).then((response) => response.json());

  const branch = await request("?path=reports");
  assert.equal(branch.directory, "reports");
  assert.deepEqual(
    branch.entries.map((entry) => entry.path),
    ["reports/archive", "reports/summary.md"],
  );

  const recursive = await request("?depth=4");
  assert.ok(recursive.entries.some((entry) => entry.path === "reports/summary.md"));
});

test("workspace previews keep text in JSON and stream images, PDFs, and downloads as assets", async (t) => {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), "pi-preview-assets-"));
  t.after(() => rm(temporaryRoot, { recursive: true, force: true }));
  const dataDirectory = path.join(temporaryRoot, "data");
  const workspaceDirectory = path.join(temporaryRoot, "workspace");
  await mkdir(workspaceDirectory);
  const image = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const pdf = Buffer.from("%PDF-1.4\npreview fixture\n", "utf8");
  const binary = Buffer.from([0, 1, 2, 3]);
  await Promise.all([
    writeFile(path.join(workspaceDirectory, "chart.png"), image),
    writeFile(path.join(workspaceDirectory, "report.pdf"), pdf),
    writeFile(path.join(workspaceDirectory, "script.py"), "print('preview')\n", "utf8"),
    writeFile(path.join(workspaceDirectory, "app.js"), "export const preview = true;\n", "utf8"),
    writeFile(path.join(workspaceDirectory, "theme.css"), "body { color: black; }\n", "utf8"),
    writeFile(path.join(workspaceDirectory, "unknown.bin"), binary),
    writeFile(path.join(workspaceDirectory, "large.txt"), "x".repeat(1_048_577), "utf8"),
  ]);
  const workspace = await registerWorkspace(dataDirectory, workspaceDirectory);
  const server = createServer(
    createLocalRuntimeHandler({ dataDirectory, token: "preview-token", mcpManager: { listServers() {} } }),
  );
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}/workspaces/${workspace.id}/files`;
  const request = (pathSuffix) =>
    fetch(`${baseUrl}${pathSuffix}`, { headers: { Authorization: "Bearer preview-token" } });

  const pythonPreview = await request("/content?path=script.py");
  assert.equal(pythonPreview.status, 200);
  assert.deepEqual(await pythonPreview.json(), {
    path: "script.py",
    name: "script.py",
    size: 17,
    modifiedAt: (await stat(path.join(workspaceDirectory, "script.py"))).mtimeMs,
    extension: ".py",
    kind: "text",
    mimeType: "text/plain; charset=utf-8",
    content: "print('preview')\n",
  });
  for (const file of ["app.js", "theme.css"]) {
    const response = await request(`/content?path=${file}`);
    assert.equal((await response.json()).kind, "text");
  }

  const imagePreview = await request("/content?path=chart.png");
  assert.equal((await imagePreview.json()).kind, "image");
  const imageAsset = await request("/asset?path=chart.png");
  assert.equal(imageAsset.headers.get("content-type"), "image/png");
  assert.match(imageAsset.headers.get("content-disposition") ?? "", /^inline;/);
  assert.equal(imageAsset.headers.get("x-content-type-options"), "nosniff");
  assert.deepEqual(Buffer.from(await imageAsset.arrayBuffer()), image);

  const pdfAsset = await request("/asset?path=report.pdf");
  assert.equal(pdfAsset.headers.get("content-type"), "application/pdf");
  assert.deepEqual(Buffer.from(await pdfAsset.arrayBuffer()), pdf);

  const unknownPreview = await request("/content?path=unknown.bin");
  assert.equal((await unknownPreview.json()).kind, "unsupported");
  assert.equal((await request("/asset?path=unknown.bin")).status, 415);
  const binaryDownload = await request("/asset?path=unknown.bin&download=1");
  assert.equal(binaryDownload.headers.get("content-type"), "application/octet-stream");
  assert.match(binaryDownload.headers.get("content-disposition") ?? "", /^attachment;/);
  assert.deepEqual(Buffer.from(await binaryDownload.arrayBuffer()), binary);

  const largePreview = await request("/content?path=large.txt");
  const largePayload = await largePreview.json();
  assert.equal(largePayload.kind, "too-large");
  assert.equal(largePayload.previewLimitBytes, 1_048_576);
});

async function waitForCommand(manager, workspaceId, commandId) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const job = manager.get(workspaceId, commandId);
    if (["completed", "failed", "cancelled", "rejected"].includes(job.status)) return job;
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  throw new Error("command did not finish");
}

test("Bash command manager waits for approval and rejection creates no side effect", async (t) => {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), "pi-command-manager-"));
  t.after(() => rm(temporaryRoot, { recursive: true, force: true }));
  const workspaceDirectory = path.join(temporaryRoot, "workspace");
  await mkdir(workspaceDirectory);
  const workspace = { id: "workspace-12345678901234567890", path: workspaceDirectory };
  const manager = createCommandManager({ dataDirectory: path.join(temporaryRoot, "data") });

  const pending = manager.create(workspace, {
    command: "printf approved > approved.txt",
    approvalMode: "ask",
    permissionMode: "full",
  });
  assert.equal(pending.status, "pending_approval");
  await assert.rejects(access(path.join(workspaceDirectory, "approved.txt")));
  manager.decide(workspace.id, pending.id, "approve");
  const completed = await waitForCommand(manager, workspace.id, pending.id);
  assert.equal(completed.status, "completed");
  assert.equal(await readFile(path.join(workspaceDirectory, "approved.txt"), "utf8"), "approved");

  const rejected = manager.create(workspace, {
    command: "printf rejected > rejected.txt",
    approvalMode: "ask",
    permissionMode: "full",
  });
  const decision = manager.decide(workspace.id, rejected.id, "reject");
  assert.equal(decision.status, "rejected");
  await assert.rejects(access(path.join(workspaceDirectory, "rejected.txt")));

  const automatic = manager.create(workspace, {
    command: "printf automatic > automatic.txt",
    approvalMode: "auto",
    permissionMode: "full",
  });
  const automaticResult = await waitForCommand(manager, workspace.id, automatic.id);
  assert.equal(automaticResult.status, "completed");
  assert.equal(await readFile(path.join(workspaceDirectory, "automatic.txt"), "utf8"), "automatic");

  assert.throws(
    () => manager.create(workspace, { command: "pwd", permissionMode: "invalid" }),
    /权限模式无效/,
  );
  assert.throws(() => manager.get("another-workspace", automatic.id), /任务不存在/);
});

test("Bash project sandbox writes inside the workspace and denies writes outside it", {
  skip: process.platform !== "darwin",
}, async (t) => {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), "pi-command-sandbox-"));
  t.after(() => rm(temporaryRoot, { recursive: true, force: true }));
  const workspaceDirectory = path.join(temporaryRoot, "workspace");
  await mkdir(workspaceDirectory);
  const dataDirectory = path.join(temporaryRoot, "data");

  const inside = await executeWorkspaceCommand({
    root: workspaceDirectory,
    dataDirectory,
    command: "printf inside > result.txt; pwd",
    permissionMode: "sandbox",
  });
  assert.equal(inside.exitCode, 0);
  assert.match(inside.stdout, /workspace/);
  assert.equal(await readFile(path.join(workspaceDirectory, "result.txt"), "utf8"), "inside");

  const outsidePath = path.join(temporaryRoot, "outside.txt");
  const outside = await executeWorkspaceCommand({
    root: workspaceDirectory,
    dataDirectory,
    command: `printf outside > ${JSON.stringify(outsidePath)}`,
    permissionMode: "sandbox",
  });
  assert.notEqual(outside.exitCode, 0);
  assert.match(outside.stderr, /Operation not permitted/);
  await assert.rejects(access(outsidePath));
});

test("Bash command sanitizes app secrets, times out, and truncates oversized output", async (t) => {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), "pi-command-limits-"));
  t.after(() => rm(temporaryRoot, { recursive: true, force: true }));
  const workspaceDirectory = path.join(temporaryRoot, "workspace");
  await mkdir(workspaceDirectory);
  const dataDirectory = path.join(temporaryRoot, "data");
  const previousSecret = process.env.DEEPSEEK_API_KEY;
  process.env.DEEPSEEK_API_KEY = "must-not-leak";
  t.after(() => {
    if (previousSecret === undefined) delete process.env.DEEPSEEK_API_KEY;
    else process.env.DEEPSEEK_API_KEY = previousSecret;
  });

  const environment = await executeWorkspaceCommand({
    root: workspaceDirectory,
    dataDirectory,
    command: "printf %s \"$DEEPSEEK_API_KEY\"",
    permissionMode: "full",
  });
  assert.equal(environment.stdout, "");

  const timedOut = await executeWorkspaceCommand({
    root: workspaceDirectory,
    dataDirectory,
    command: "sleep 5",
    permissionMode: "full",
    timeoutMs: 1_000,
  });
  assert.equal(timedOut.timedOut, true);
  assert.ok(timedOut.durationMs < 3_000);

  const oversized = await executeWorkspaceCommand({
    root: workspaceDirectory,
    dataDirectory,
    command: "/usr/bin/yes x | /usr/bin/head -c 210000",
    permissionMode: "full",
  });
  assert.equal(oversized.truncated, true);
  assert.ok(Buffer.byteLength(oversized.stdout) <= 200 * 1024);
});

test("cancelling Bash terminates the command process group", async (t) => {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), "pi-command-cancel-"));
  t.after(() => rm(temporaryRoot, { recursive: true, force: true }));
  const workspaceDirectory = path.join(temporaryRoot, "workspace");
  await mkdir(workspaceDirectory);
  const lateFile = path.join(workspaceDirectory, "late.txt");
  const controller = new AbortController();
  const execution = executeWorkspaceCommand({
    root: workspaceDirectory,
    dataDirectory: path.join(temporaryRoot, "data"),
    command: "(sleep 1; printf late > late.txt) & wait",
    permissionMode: "full",
    signal: controller.signal,
  });
  setTimeout(() => controller.abort(), 50);
  const result = await execution;
  assert.equal(result.cancelled, true);
  await new Promise((resolve) => setTimeout(resolve, 1_100));
  await assert.rejects(access(lateFile));
});
