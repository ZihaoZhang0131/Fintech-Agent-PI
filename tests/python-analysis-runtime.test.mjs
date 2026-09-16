import assert from "node:assert/strict";
import { access, mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  createLocalRuntimeHandler,
  registerWorkspace,
} from "../server/local-runtime.mjs";

const projectRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const managedPython = path.join(projectRoot, ".local-data", "python-analysis-venv", "bin", "python");

async function waitForJob(baseUrl, workspaceId, id, headers) {
  let job;
  for (let attempt = 0; attempt < 1_000; attempt += 1) {
    job = await fetch(`${baseUrl}/workspaces/${workspaceId}/commands/${id}`, { headers }).then((response) => response.json());
    if (!["created", "approved", "running"].includes(job.status)) return job;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  throw new Error(`Python job did not finish: ${JSON.stringify(job)}`);
}

test("Python runtime is offline, reads the project, writes only outputs/python, and reports artifacts", {
  skip: process.platform !== "darwin" ? "macOS sandbox-exec is required" : false,
}, async (t) => {
  await access(managedPython);
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), "pi-python-analysis-"));
  t.after(() => rm(temporaryRoot, { recursive: true, force: true }));
  const dataDirectory = path.join(temporaryRoot, "data");
  const workspaceDirectory = path.join(temporaryRoot, "workspace");
  await mkdir(dataDirectory, { recursive: true });
  await mkdir(workspaceDirectory, { recursive: true });
  await writeFile(path.join(dataDirectory, "python-analysis-ready-v1"), "test-ready\n");
  await writeFile(path.join(workspaceDirectory, "input.csv"), "value\n1\n2\n3\n");

  const networkRequests = [];
  const dataServer = createServer((request, response) => {
    networkRequests.push(request.url);
    response.end("reachable");
  });
  await new Promise((resolve) => dataServer.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => dataServer.close(resolve)));

  const previous = {
    PYTHON_ANALYSIS_PATH: process.env.PYTHON_ANALYSIS_PATH,
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
  };
  process.env.PYTHON_ANALYSIS_PATH = managedPython;
  process.env.DEEPSEEK_API_KEY = "must-not-leak";
  t.after(() => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  const workspace = await registerWorkspace(dataDirectory, workspaceDirectory);
  const server = createServer(createLocalRuntimeHandler({
    dataDirectory,
    token: "python-token",
    mcpManager: { async listServers() { return []; }, async callTool() {} },
  }));
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  const headers = { Authorization: "Bearer python-token", "Content-Type": "application/json" };
  const networkPort = dataServer.address().port;
  const code = `
import os
import socket
from pathlib import Path
import numpy
import pandas
import matplotlib
import openpyxl

print("input=" + Path("input.csv").read_text().strip().replace("\\n", ","))
print("secret=" + os.environ.get("DEEPSEEK_API_KEY", ""))
output = Path(os.environ["PYTHON_ANALYSIS_OUTPUT_DIR"])
(output / "result.csv").write_text("sum\\n6\\n")
try:
    Path("blocked.txt").write_text("blocked")
except OSError:
    print("source_write=denied")
try:
    Path(${JSON.stringify(path.join(temporaryRoot, "outside.txt"))}).write_text("blocked")
except OSError:
    print("outside_write=denied")
try:
    socket.create_connection(("127.0.0.1", ${networkPort}), timeout=0.5)
    print("network=allowed")
except OSError:
    print("network=denied")
try:
    socket.create_connection(("1.1.1.1", 53), timeout=0.5)
    print("internet=allowed")
except OSError:
    print("internet=denied")
print("'; touch outputs/python/injected; '")
`;
  const started = await fetch(`${baseUrl}/workspaces/${workspace.id}/python/commands`, {
    method: "POST",
    headers,
    body: JSON.stringify({ code, approvalMode: "auto", timeoutMs: 10_000, permissionMode: "full", networkMode: "allow" }),
  });
  const initial = await started.json();
  assert.equal(started.status, 201, JSON.stringify(initial));
  assert.equal(initial.permissionMode, "sandbox");
  assert.equal(initial.networkMode, "deny");
  assert.match(initial.command, /python3\.12' '-I' '-u' '-'$/);
  assert.doesNotMatch(initial.command, /touch outputs/);
  const finished = await waitForJob(baseUrl, workspace.id, initial.id, { Authorization: "Bearer python-token" });

  assert.equal(finished.status, "completed", finished.error);
  assert.equal(finished.result.exitCode, 0, `${initial.command}\n${finished.result.stderr}`);
  assert.match(finished.result.stdout, /input=value,1,2,3/);
  assert.match(finished.result.stdout, /secret=\n/);
  assert.match(finished.result.stdout, /source_write=denied/);
  assert.match(finished.result.stdout, /outside_write=denied/);
  assert.match(finished.result.stdout, /network=denied/);
  assert.match(finished.result.stdout, /internet=denied/);
  assert.doesNotMatch(finished.result.stdout, /must-not-leak/);
  assert.deepEqual(finished.result.artifacts, ["outputs/python/result.csv"]);
  assert.equal(await readFile(path.join(workspaceDirectory, "outputs/python/result.csv"), "utf8"), "sum\n6\n");
  await assert.rejects(access(path.join(workspaceDirectory, "blocked.txt")));
  await assert.rejects(access(path.join(temporaryRoot, "outside.txt")));
  await assert.rejects(access(path.join(workspaceDirectory, "outputs/python/injected")));
  assert.deepEqual(networkRequests, []);

  const timed = await fetch(`${baseUrl}/workspaces/${workspace.id}/python/commands`, {
    method: "POST",
    headers,
    body: JSON.stringify({ code: "import time; time.sleep(10)", approvalMode: "auto", timeoutMs: 1_000 }),
  }).then((response) => response.json());
  const timedOut = await waitForJob(baseUrl, workspace.id, timed.id, { Authorization: "Bearer python-token" });
  assert.equal(timedOut.status, "completed");
  assert.equal(timedOut.result.timedOut, true);
  assert.notEqual(timedOut.result.exitCode, 0);

  const oversizedCode = await fetch(`${baseUrl}/workspaces/${workspace.id}/python/commands`, {
    method: "POST",
    headers,
    body: JSON.stringify({ code: "x".repeat(20_001), approvalMode: "auto" }),
  });
  assert.equal(oversizedCode.status, 400);

  const oversizedOutput = await fetch(`${baseUrl}/workspaces/${workspace.id}/python/commands`, {
    method: "POST",
    headers,
    body: JSON.stringify({ code: "print('x' * 210000)", approvalMode: "auto" }),
  }).then((response) => response.json());
  const truncated = await waitForJob(baseUrl, workspace.id, oversizedOutput.id, {
    Authorization: "Bearer python-token",
  });
  assert.equal(truncated.result.truncated, true);
  assert.ok(Buffer.byteLength(truncated.result.stdout) <= 200 * 1024);

  const childPidPath = path.join(workspaceDirectory, "outputs/python/child.pid");
  const cancellable = await fetch(`${baseUrl}/workspaces/${workspace.id}/python/commands`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      code: `
import os, subprocess, sys, time
from pathlib import Path
child = subprocess.Popen([sys.executable, "-c", "import time; time.sleep(60)"])
Path(os.environ["PYTHON_ANALYSIS_OUTPUT_DIR"], "child.pid").write_text(str(child.pid))
time.sleep(60)
`,
      approvalMode: "auto",
    }),
  }).then((response) => response.json());
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (await access(childPidPath).then(() => true, () => false)) break;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  const childPid = Number(await readFile(childPidPath, "utf8"));
  t.after(() => {
    try {
      process.kill(childPid, "SIGKILL");
    } catch {
      // The process group was already terminated as expected.
    }
  });
  await fetch(`${baseUrl}/workspaces/${workspace.id}/commands/${cancellable.id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer python-token" },
  });
  const cancelled = await waitForJob(baseUrl, workspace.id, cancellable.id, {
    Authorization: "Bearer python-token",
  });
  assert.equal(cancelled.status, "cancelled");
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const alive = (() => {
      try {
        process.kill(childPid, 0);
        return true;
      } catch {
        return false;
      }
    })();
    if (!alive) break;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  assert.throws(() => process.kill(childPid, 0));
});
