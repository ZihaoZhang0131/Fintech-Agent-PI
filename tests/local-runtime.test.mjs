import assert from "node:assert/strict";
import { access, chmod, mkdtemp, mkdir, readFile, realpath, rm, stat, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { createServer } from "node:http";
import path from "node:path";
import test from "node:test";
import { unzipSync, zipSync } from "fflate";

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
import { createSkillStore, resolvePythonInterpreter } from "../server/skill-store.mjs";

function encoded(value) {
  return Buffer.from(value, "utf8").toString("base64");
}

test("file references cannot read outside the canonical workspace", async (t) => {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), "pi-link-boundary-"));
  t.after(() => rm(temporaryRoot, { recursive: true, force: true }));
  const root = path.join(await realpath(temporaryRoot), "workspace");
  await mkdir(root);
  await writeFile(path.join(temporaryRoot, "outside.txt"), "private");
  await symlink(path.join(temporaryRoot, "outside.txt"), path.join(root, "escape.txt"));
  await assert.rejects(readWorkspaceFile(root, "../outside.txt"), /超出了/);
  await assert.rejects(readWorkspaceFile(root, "escape.txt"), /目录之外/);
  await assert.rejects(readWorkspaceFile(root, "missing.txt"), /ENOENT/);
  await assert.rejects(readWorkspaceFile(root, "."), /不是文件/);
  await writeFile(path.join(root, "%2e%2e.txt"), "literal encoded filename");
  assert.equal((await readWorkspaceFile(root, "%2e%2e.txt")).content, "literal encoded filename");
});

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
  const akshareResources = state.resourceFilesByName["akshare-http-data"];
  assert.ok(akshareResources.some((file) => file.path === "scripts/aktools_status.py"));
  assert.ok(akshareResources.some((file) => file.path === "references/macro/index.md"));
  const valueResources = state.resourceFilesByName["a-share-value-investing"];
  assert.ok(valueResources.some((file) => file.path === "scripts/screen_candidates.py"));
  assert.ok(valueResources.some((file) => file.path === "scripts/deep_metrics.py"));
  assert.ok(valueResources.some((file) => file.path === "references/methodology.md"));
  await store.remove("bundled:earnings-review");
  assert.ok((await store.list()).deletedBundledNames.includes("earnings-review"));
});

test("local skill store keeps a complete ZIP folder, exposes resources, and exports it again", async (t) => {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), "pi-skill-zip-"));
  t.after(() => rm(temporaryRoot, { recursive: true, force: true }));
  const store = createSkillStore(temporaryRoot, {
    resolvePython: async () => ({ executable: "/opt/test-python/bin/python3", readableRoot: "/opt/test-python" }),
  });
  const archive = Buffer.from(zipSync({
    "complete-skill/SKILL.md": Buffer.from("---\nname: complete-skill\ndescription: 完整目录技能。\n---\n\n按需读取资料。\n"),
    "complete-skill/references/rules.md": Buffer.from("# 规则\n"),
    "complete-skill/scripts/report.py": Buffer.from("print('report')\n"),
    "complete-skill/assets/logo.bin": Buffer.from([0, 1, 2]),
  }));
  const imported = await store.importFolder({ kind: "zip", data: archive.toString("base64") });
  const listed = await store.list();
  const resources = listed.resourceFilesByName[imported.name];
  assert.deepEqual(resources.map((file) => file.path), ["SKILL.md", "assets/logo.bin", "references/rules.md", "scripts/report.py"]);
  assert.equal(resources.find((file) => file.path === "scripts/report.py").category, "script");
  assert.equal((await store.readResource(imported.id, "references/rules.md")).content, "# 规则\n");
  const script = await store.resolveScript(imported.id, "scripts/report.py");
  assert.equal(script.interpreter, "/opt/test-python/bin/python3");
  assert.equal(script.interpreterReadableRoot, "/opt/test-python");
  assert.equal(script.path, "scripts/report.py");
  assert.equal(path.basename(script.scriptPath), "report.py");
  assert.ok(script.scriptPath.startsWith(`${await realpath(script.readableRoot)}${path.sep}`));

  await store.writeResource(imported.id, { path: "references/extra.txt", data: encoded("补充资料") });
  await store.removeResource(imported.id, "assets/logo.bin");
  const exported = unzipSync(await store.exportZip(imported.id));
  assert.ok(exported["SKILL.md"]);
  assert.equal(Buffer.from(exported["references/extra.txt"]).toString("utf8"), "补充资料");
  assert.equal(exported["assets/logo.bin"], undefined);

  await assert.rejects(
    store.importFolder({ kind: "zip", data: Buffer.alloc(5 * 1024 * 1024 + 1).toString("base64") }),
    /5 MB/,
  );
});

test("Python interpreter resolution skips the macOS developer-tool shim", async (t) => {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), "pi-python-resolver-"));
  t.after(() => rm(temporaryRoot, { recursive: true, force: true }));
  const pythonRoot = path.join(temporaryRoot, "python");
  const python = path.join(pythonRoot, "bin", "python3");
  await mkdir(path.dirname(python), { recursive: true });
  await writeFile(python, "#!/bin/sh\nexit 0\n", "utf8");
  await chmod(python, 0o755);

  assert.deepEqual(await resolvePythonInterpreter({
    environment: { PATH: `/usr/bin${path.delimiter}${path.dirname(python)}` },
    platform: "darwin",
    fallbackCandidates: [],
  }), {
    executable: python,
    readableRoot: pythonRoot,
  });
  const virtualEnvironment = path.join(temporaryRoot, "documents-venv");
  const virtualPython = path.join(virtualEnvironment, "bin", "python");
  await mkdir(path.dirname(virtualPython), { recursive: true });
  await symlink(python, virtualPython);
  assert.deepEqual(await resolvePythonInterpreter({
    environment: { SKILL_PYTHON_PATH: virtualPython, PATH: "" },
    platform: "darwin",
    fallbackCandidates: [],
  }), {
    executable: virtualPython,
    readableRoot: virtualEnvironment,
  });
  await assert.rejects(
    resolvePythonInterpreter({ environment: { PATH: "/usr/bin" }, platform: "darwin", fallbackCandidates: [] }),
    /不会调用 macOS 的 \/usr\/bin\/python3/,
  );
});

test("local runtime runs shell and Python Skill scripts in the current Bash sandbox", async (t) => {
  const requests = [];
  const dataServer = createServer((request, response) => {
    requests.push(request.url);
    response.setHeader("Content-Type", "application/json");
    if (request.url === "/version") response.end(JSON.stringify({ ak_current_version: "1.18.83", at_current_version: "0.0.91" }));
    else { response.writeHead(404); response.end(JSON.stringify({ error: "fixture endpoint missing" })); }
  });
  await new Promise((resolve) => dataServer.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => dataServer.close(resolve)));
  const selectedUrl = `http://127.0.0.1:${dataServer.address().port}`;
  const previous = { AKTOOLS_BASE_URL: process.env.AKTOOLS_BASE_URL, DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY };
  process.env.AKTOOLS_BASE_URL = selectedUrl;
  process.env.DEEPSEEK_API_KEY = "must-not-leak";
  t.after(() => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  });
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), "pi-skill-script-"));
  t.after(() => rm(temporaryRoot, { recursive: true, force: true }));
  const dataDirectory = path.join(temporaryRoot, "data");
  const workspaceDirectory = path.join(temporaryRoot, "workspace");
  await mkdir(workspaceDirectory);
  const workspace = await registerWorkspace(dataDirectory, workspaceDirectory);
  const store = createSkillStore(dataDirectory);
  const imported = await store.importFolder({
    files: [
      { path: "SKILL.md", data: encoded("---\nname: script-skill\ndescription: 可运行的本机脚本。\n---\n\n运行 scripts/hello.sh 或 scripts/hello.py。") },
      { path: "scripts/hello.sh", data: encoded("printf 'skill script works\\n'\n") },
      { path: "scripts/hello.py", data: encoded("import os\nprint('python skill works')\nprint(os.environ.get('AKTOOLS_BASE_URL'))\nprint('secret=' + os.environ.get('DEEPSEEK_API_KEY', ''))\n") },
    ],
  });
  const server = createServer(createLocalRuntimeHandler({ dataDirectory, token: "script-token", mcpManager: { listServers() {} } }));
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;
  const headers = { Authorization: "Bearer script-token", "Content-Type": "application/json" };
  async function runScript(scriptPath, skillId = imported.id, args = []) {
    const started = await fetch(`${baseUrl}/skills/${encodeURIComponent(skillId)}/scripts/run`, {
      method: "POST",
      headers,
      body: JSON.stringify({ workspaceId: workspace.id, path: scriptPath, args, approvalMode: "auto", permissionMode: "sandbox" }),
    });
    assert.equal(started.status, 201);
    const job = await started.json();
    let finished = job;
    for (let attempt = 0; attempt < 30 && ["created", "approved", "running"].includes(finished.status); attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 20));
      finished = await fetch(`${baseUrl}/workspaces/${workspace.id}/commands/${job.id}`, { headers: { Authorization: "Bearer script-token" } }).then((response) => response.json());
    }
    return finished;
  }
  const shellFinished = await runScript("scripts/hello.sh");
  assert.equal(shellFinished.status, "completed");
  assert.equal(shellFinished.result.exitCode, 0, shellFinished.result.stderr);
  assert.match(shellFinished.result.stdout, /skill script works/);

  const pythonFinished = await runScript("scripts/hello.py");
  assert.equal(pythonFinished.status, "completed");
  assert.equal(pythonFinished.result.exitCode, 0, pythonFinished.result.stderr);
  assert.match(pythonFinished.result.stdout, /python skill works/);
  assert.doesNotMatch(pythonFinished.command, /\/usr\/bin\/python3/);
  assert.ok(pythonFinished.result.stdout.includes(selectedUrl));
  assert.match(pythonFinished.result.stdout, /secret=\n/);
  assert.doesNotMatch(pythonFinished.result.stdout, /must-not-leak/);
  const status = await runScript("scripts/aktools_status.py", "bundled:akshare-http-data");
  assert.equal(status.result.exitCode, 0, status.result.stderr);
  assert.equal(JSON.parse(status.result.stdout).base_url, selectedUrl);
  const failed = await runScript("scripts/aktools_get.py", "bundled:akshare-http-data", ["error_case"]);
  assert.equal(failed.status, "completed");
  assert.equal(failed.result.exitCode, 1);
  assert.match(failed.result.stderr, /HTTP 404/);
  assert.match(failed.result.stderr, /fixture endpoint missing/);
  assert.deepEqual(requests, ["/version", "/api/public/error_case"]);

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
