import assert from "node:assert/strict";
import test from "node:test";

import { createPythonAnalysisTool } from "../server/agent/tools/python-analysis.ts";

function commandResponse(status, overrides = {}) {
  return {
    id: "python-command-123",
    workspaceId: "workspace-123",
    command: "python -I -u -",
    approvalMode: "ask",
    permissionMode: "sandbox",
    timeoutMs: 60_000,
    status,
    ...overrides,
  };
}

function runtimeEnvironment(t) {
  const previousUrl = process.env.LOCAL_RUNTIME_URL;
  const previousToken = process.env.LOCAL_RUNTIME_TOKEN;
  process.env.LOCAL_RUNTIME_URL = "http://runtime.test";
  process.env.LOCAL_RUNTIME_TOKEN = "runtime-secret";
  t.after(() => {
    if (previousUrl === undefined) delete process.env.LOCAL_RUNTIME_URL;
    else process.env.LOCAL_RUNTIME_URL = previousUrl;
    if (previousToken === undefined) delete process.env.LOCAL_RUNTIME_TOKEN;
    else process.env.LOCAL_RUNTIME_TOKEN = previousToken;
  });
}

test("Python analysis tool emits approval details and returns output with artifacts", async (t) => {
  runtimeEnvironment(t);
  const requests = [];
  const fetchImpl = async (url, init) => {
    requests.push({ url: String(url), init });
    const job = requests.length === 1
      ? commandResponse("pending_approval")
      : commandResponse("completed", {
          result: {
            stdout: "rows=3\n",
            stderr: "",
            exitCode: 0,
            signal: null,
            timedOut: false,
            cancelled: false,
            truncated: false,
            durationMs: 42,
            artifacts: ["outputs/python/result.csv"],
            artifactsTruncated: false,
          },
        });
    return Response.json(job, { status: requests.length === 1 ? 202 : 200 });
  };
  const updates = [];
  const tool = createPythonAnalysisTool("workspace-123", {
    approvalMode: "ask",
    fetchImpl,
    pollIntervalMs: 1,
  });
  const code = "print('rows=3')";
  const result = await tool.execute("call-1", { code }, undefined, (update) => updates.push(update));

  assert.equal(updates[0].details.kind, "python_analysis");
  assert.equal(updates[0].details.code, code);
  assert.equal(updates[0].details.permissionMode, "sandbox");
  assert.equal(updates[0].details.networkMode, "deny");
  assert.equal(result.details.exitCode, 0);
  assert.deepEqual(result.details.artifacts, ["outputs/python/result.csv"]);
  assert.match(result.content[0].text, /rows=3/);
  assert.match(result.content[0].text, /outputs\/python\/result\.csv/);
  assert.equal(requests[0].url, "http://runtime.test/workspaces/workspace-123/python/commands");
  assert.deepEqual(JSON.parse(requests[0].init.body), {
    code,
    timeoutMs: 60_000,
    approvalMode: "ask",
  });
});

test("Python analysis marks nonzero exits failed without discarding stderr", async (t) => {
  runtimeEnvironment(t);
  const tool = createPythonAnalysisTool("workspace-123", {
    approvalMode: "auto",
    pollIntervalMs: 1,
    fetchImpl: async () => Response.json(commandResponse("completed", {
      approvalMode: "auto",
      result: {
        stdout: "",
        stderr: "ValueError: invalid data",
        exitCode: 1,
        signal: null,
        timedOut: false,
        cancelled: false,
        truncated: false,
        durationMs: 8,
      },
    })),
  });
  const result = await tool.execute("call-2", { code: "raise ValueError('invalid data')" });
  assert.equal(result.details.status, "failed");
  assert.equal(result.details.exitCode, 1);
  assert.match(result.content[0].text, /ValueError: invalid data/);
});

test("Python analysis rejection and abort preserve command lifecycle", async (t) => {
  runtimeEnvironment(t);
  let requestCount = 0;
  const rejected = createPythonAnalysisTool("workspace-123", {
    approvalMode: "ask",
    pollIntervalMs: 1,
    fetchImpl: async () => {
      requestCount += 1;
      return Response.json(commandResponse(requestCount === 1 ? "pending_approval" : "rejected"));
    },
  });
  const rejectedResult = await rejected.execute("call-3", { code: "print('no')" });
  assert.equal(rejectedResult.details.status, "rejected");
  assert.match(rejectedResult.content[0].text, /代码没有执行/);

  const controller = new AbortController();
  const methods = [];
  const aborted = createPythonAnalysisTool("workspace-123", {
    approvalMode: "auto",
    pollIntervalMs: 5,
    fetchImpl: async (_url, init = {}) => {
      methods.push(init.method ?? "GET");
      if (init.method === "DELETE") return Response.json(commandResponse("cancelled"));
      return Response.json(commandResponse("running", { approvalMode: "auto" }));
    },
  });
  const promise = aborted.execute("call-4", { code: "while True: pass" }, controller.signal);
  setTimeout(() => controller.abort(), 1);
  await assert.rejects(promise, { name: "AbortError" });
  assert.deepEqual(methods, ["POST", "DELETE"]);
});
