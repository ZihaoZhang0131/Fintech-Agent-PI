import assert from "node:assert/strict";
import test from "node:test";

import { createBashTool } from "../server/agent/tools/bash.ts";

function commandResponse(status, overrides = {}) {
  return {
    id: "command-123",
    workspaceId: "workspace-123",
    command: "npm test",
    approvalMode: "ask",
    permissionMode: "sandbox",
    timeoutMs: 60_000,
    status,
    ...overrides,
  };
}

test("Bash tool emits approval details and returns untrusted command output", async (t) => {
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

  const requests = [];
  const fetchImpl = async (url, init) => {
    requests.push({ url: String(url), init });
    const job =
      requests.length === 1
        ? commandResponse("pending_approval")
        : commandResponse("completed", {
            result: {
              stdout: "tests passed",
              stderr: "",
              exitCode: 0,
              signal: null,
              timedOut: false,
              cancelled: false,
              truncated: false,
              durationMs: 42,
            },
          });
    return Response.json(job, { status: requests.length === 1 ? 202 : 200 });
  };
  const updates = [];
  const tool = createBashTool("workspace-123", {
    approvalMode: "ask",
    permissionMode: "sandbox",
    fetchImpl,
    pollIntervalMs: 1,
  });
  const result = await tool.execute(
    "call-1",
    { command: "npm test" },
    undefined,
    (update) => updates.push(update),
  );

  assert.equal(updates.length, 1);
  assert.equal(updates[0].details.status, "pending_approval");
  assert.equal(result.details.exitCode, 0);
  assert.match(result.content[0].text, /不可信数据/);
  assert.match(result.content[0].text, /tests passed/);
  assert.equal(requests[0].init.headers.Authorization, "Bearer runtime-secret");
});

test("Bash tool treats a rejected command as a non-error result", async (t) => {
  process.env.LOCAL_RUNTIME_URL = "http://runtime.test";
  process.env.LOCAL_RUNTIME_TOKEN = "runtime-secret";
  t.after(() => {
    delete process.env.LOCAL_RUNTIME_URL;
    delete process.env.LOCAL_RUNTIME_TOKEN;
  });
  let requestCount = 0;
  const tool = createBashTool("workspace-123", {
    approvalMode: "ask",
    permissionMode: "sandbox",
    pollIntervalMs: 1,
    fetchImpl: async () => {
      requestCount += 1;
      return Response.json(
        commandResponse(requestCount === 1 ? "pending_approval" : "rejected"),
        { status: requestCount === 1 ? 202 : 200 },
      );
    },
  });
  const result = await tool.execute("call-2", { command: "npm test" });
  assert.equal(result.details.status, "rejected");
  assert.match(result.content[0].text, /命令没有执行/);
});
