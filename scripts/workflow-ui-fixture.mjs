// Isolated browser fixture: synthetic messages plus a real, harmless Bash approval.
// No model calls, production data, credentials, or HTTP test hooks.
import { createServer } from "node:http";
import { mkdtemp, mkdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import {
  createLocalRuntimeHandler,
  registerWorkspace,
} from "../server/local-runtime.mjs";
import { createWorkflowStore, newRun } from "../server/workflow/store.mjs";
const root = await mkdtemp(path.join(tmpdir(), "workflow-ui-"));
const data = path.join(root, "data"),
  project = path.join(root, "project");
await mkdir(project);
const workspace = await registerWorkspace(data, project),
  token = randomUUID();
const handler = createLocalRuntimeHandler({
  dataDirectory: data,
  token,
  mcpManager: {
    async listServers() {
      return [];
    },
    async close() {},
  },
});
const server = createServer(handler);
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const url = `http://127.0.0.1:${server.address().port}`;
const request = async (route, body) => {
  const r = await fetch(url + route, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    ...(body ? { method: "POST", body: JSON.stringify(body) } : {}),
  });
  return r.json();
};
const store = createWorkflowStore(data),
  agentId = "custom-ui-fixture-12345678";
const config = {
  customSubAgents: [
    {
      id: agentId,
      label: "验收 Agent",
      description: "仅用于界面测试",
      enabled: true,
      enabledTools: ["bash"],
      enabledSkills: [],
      enabledMcps: [],
    },
  ],
};
const limits = {
  maxNodes: 12,
  maxRevisions: 5,
  maxAttempts: 3,
  timeoutMs: 300000,
  concurrency: 2,
};
const run = newRun({
  workspaceId: workspace.id,
  workspaceName: "浏览器验收项目",
  input:
    "这是隔离的浏览器验收数据。批准命令后应在对话内显示结果；不会调用模型。",
  config,
  model: { providerId: "fixture", modelId: "fixture" },
  plannerModel: { providerId: "fixture", modelId: "fixture" },
  mode: "adaptive",
  parameters: {},
  limits,
});
run.title = "审批与长消息验收";
run.status = "running";
run.version = 1;
run.plan = {
  title: run.title,
  nodes: [
    {
      id: "approval",
      title: "确认无害命令",
      agentId,
      task: "运行 printf 输出验收标记，不写入文件。",
      acceptance: "得到 workflow approval fixture",
      dependencies: [],
    },
  ],
};
run.revisions = [
  {
    version: 1,
    plan: run.plan,
    reason: "界面验收：在执行消息中直接审批。",
    createdAt: Date.now(),
  },
];
const command = await request(`/workspaces/${workspace.id}/commands`, {
  command: "printf 'workflow approval fixture\\n'",
  approvalMode: "ask",
  permissionMode: "sandbox",
});
if (!command.id) throw Error("Unable to create approval fixture");
const attemptId = randomUUID();
run.attempts = [
  {
    id: attemptId,
    nodeId: "approval",
    version: 1,
    status: "running",
    startedAt: Date.now(),
  },
];
run.operations = [
  {
    id: randomUUID(),
    attemptId,
    tool: "bash",
    arguments: { command: command.command },
    command: command.command,
    commandId: command.id,
    status: "pending_approval",
  },
];
store.save(run);
const timer = setInterval(async () => {
  const c = await request(`/workspaces/${workspace.id}/commands/${command.id}`);
  if (["completed", "failed", "rejected", "cancelled"].includes(c.status)) {
    clearInterval(timer);
    const r = store.get(run.id);
    r.operations[0].status = c.status;
    r.operations[0].result = c.result;
    r.attempts[0].status = c.status === "completed" ? "completed" : "blocked";
    r.attempts[0].result = {
      status: "completed",
      text: "workflow approval fixture",
      summary: "验收命令完成",
      sources: [],
      artifacts: [],
      issues: [],
    };
    if(c.status !== "completed") {r.attempts[0].result.status="blocked";r.status="failed";r.error="验收命令未完成";store.save(r);return;}
    r.accepted.approval = attemptId;
    r.status = "completed";
    r.summary =
      "命令审批已完成。以下是用于验证滚动的长回答（模拟内容）。\n\n" +
      Array.from(
        { length: 40 },
        (_, i) =>
          `### 验收段落 ${i + 1}\n\n这是一段固定的中文测试内容，用于检查长回答的 Markdown 排版、滚动与输入框固定位置。它不是研究结论。`,
      ).join("\n\n");
    store.save(r);
  }
}, 400);
const child = spawn(
  path.resolve("node_modules/.bin/vinext"),
  ["dev", "--port", "3001"],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      PI_LOCAL_DATA_DIR: data,
      LOCAL_RUNTIME_URL: url,
      LOCAL_RUNTIME_TOKEN: token,
      WRANGLER_LOG_PATH: ".wrangler/wrangler.log",
    },
  },
);
let closing = false;
async function close() {
  if (closing) return;
  closing = true;
  clearInterval(timer);
  child.kill("SIGTERM");
  await handler.close();
  server.closeAllConnections();
  server.close();
  store.close();
  await rm(root, { recursive: true, force: true });
  process.exit();
}
child.on("exit",close);
process.on("SIGINT", close);
process.on("SIGTERM", close);
console.log("Isolated Workflow UI fixture: http://localhost:3001/");
