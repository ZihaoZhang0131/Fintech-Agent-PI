import assert from "node:assert/strict";
import { access, mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { createServer } from "node:http";
import path from "node:path";
import test from "node:test";

import {
  listWorkspaceFiles,
  createCommandManager,
  createLocalRuntimeHandler,
  executeWorkspaceCommand,
  readWorkspaceFile,
  readWorkspaceRegistry,
  registerWorkspace,
  resolveWorkspacePath,
  writeWorkspaceFile,
} from "../server/local-runtime.mjs";

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
