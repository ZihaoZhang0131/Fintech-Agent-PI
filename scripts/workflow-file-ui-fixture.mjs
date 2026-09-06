// Isolated file/navigation QA: synthetic Workflow results and real project file APIs.
// stdin: update, complete, offline, online, stats, quit. No models or credentials copied.
import { createServer } from "node:http";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { createLocalRuntimeHandler, registerWorkspace } from "../server/local-runtime.mjs";
import { createWorkflowStore, newRun } from "../server/workflow/store.mjs";

const root = await mkdtemp(path.join(tmpdir(), "workflow-files-ui-"));
const data = path.join(root, "data");
const workspaces = [];
for (const name of ["文件验收 A", "文件验收 B"]) {
  const project = path.join(root, name);
  await mkdir(path.join(project, "reports"), { recursive: true });
  await mkdir(path.join(project, "src"));
  await writeFile(path.join(project, "reports", "中文 报告.md"), `# ${name}\n\n版本 1\n\n[附录](appendix.md)\n\n|项目|值|\n|---|---|\n|版本|1|\n`);
  await writeFile(path.join(project, "reports", "appendix.md"), `# ${name} 附录\n\n相对链接正确。\n`);
  await writeFile(path.join(project, "src", "sample.ts"), Array.from({ length: 80 }, (_, i) => `export const value${i + 1} = ${i + 1};`).join("\n"));
  workspaces.push({ ...await registerWorkspace(data, project), project });
}
const token = randomUUID();
const handler = createLocalRuntimeHandler({
  dataDirectory: data, token,
  mcpManager: { async listServers() { return []; }, async close() {} },
});
let offline = false;
let fileRequests = 0;
const server = createServer((req, res) => {
  if (offline) { res.writeHead(503, { "Content-Type": "application/json" }); res.end('{"message":"Fixture offline"}'); return; }
  if (req.url.includes("/files")) fileRequests++;
  return handler(req, res);
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const url = `http://127.0.0.1:${server.address().port}`;
const store = createWorkflowStore(data);
const config = { customSubAgents: [{ id: "custom-files-fixture-12345678", label: "文件验收 Agent", description: "模拟输出", enabled: true, enabledTools: [], enabledSkills: [], enabledMcps: [] }] };
const links = "[中文报告](reports/中文%20报告.md) · [代码第60行](src/sample.ts#L60) · [网页来源](https://example.com/?workflow=files#source) · [缺失文件](missing.md)";
const runs = workspaces.map((workspace, i) => {
  const run = newRun({ workspaceId: workspace.id, workspaceName: workspace.name, input: "仅验收文件导航，不调用模型。", config, model: { providerId: "fixture", modelId: "fixture" }, plannerModel: { providerId: "fixture", modelId: "fixture" }, mode: "adaptive", parameters: {}, limits: { maxNodes: 12, maxRevisions: 5, maxAttempts: 3, timeoutMs: 300000, concurrency: 2 } });
  run.title = `文件与链接验收 ${i === 0 ? "A" : "B"}`;
  run.status = "running";
  run.version = 1;
  run.plan = { title: run.title, nodes: [{ id: "report", title: "生成报告", agentId: config.customSubAgents[0].id, task: "模拟文件输出", acceptance: "可在项目文件栏打开", dependencies: [] }] };
  run.revisions = [{ version: 1, plan: run.plan, reason: `规划说明：[规划报告](reports/中文%20报告.md)`, createdAt: Date.now() }];
  const attemptId = randomUUID();
  run.attempts = [{ id: attemptId, nodeId: "report", version: 1, status: "completed", startedAt: Date.now(), result: { status: "completed", summary: "模拟输出完成", text: `节点结果\n\n${links}`, sources: [], artifacts: ["reports/中文 报告.md"], issues: [] } }];
  run.accepted.report = attemptId;
  run.summary = `文件链接验收（模拟内容）\n\n${links}`;
  store.save(run);
  return run;
});
let version = 1;
const input = createInterface({ input: process.stdin });
input.on("line", async command => {
  if (command === "quit") return close();
  if (command === "stats") return console.log(JSON.stringify({ fileRequests }));
  if (command === "offline") { offline = true; server.closeAllConnections(); console.log("Fixture offline"); return; }
  if (command === "online") { offline = false; console.log("Fixture online"); return; }
  if (!["update", "complete"].includes(command)) return;
  version++;
  const project = workspaces[0].project;
  await writeFile(path.join(project, "reports", "中文 报告.md"), `# 文件验收 A\n\n版本 ${version}\n\n[附录](appendix.md)\n`);
  await writeFile(path.join(project, `新增产物-${version}.txt`), `产物版本 ${version}\n`);
  const run = store.get(runs[0].id);
  if (command === "complete") run.status = "completed";
  store.save(run, command === "complete" ? "completed" : "tool_finished");
  console.log(`Fixture wrote version ${version}, ${run.status}`);
});
const port = process.env.WORKFLOW_UI_PORT ?? "3017";
const child = spawn(path.resolve("node_modules/.bin/vinext"), ["dev", "--port", port], {
  stdio: ["ignore", "inherit", "inherit"],
  env: { ...process.env, PI_LOCAL_DATA_DIR: data, LOCAL_RUNTIME_URL: url, LOCAL_RUNTIME_TOKEN: token, WRANGLER_LOG_PATH: ".wrangler/wrangler.log" },
});
let closing = false;
async function close() {
  if (closing) return;
  closing = true;
  input.close();
  child.kill("SIGTERM");
  await handler.close();
  server.closeAllConnections();
  server.close();
  store.close();
  await rm(root, { recursive: true, force: true });
  process.exit();
}
child.on("exit", close);
process.on("SIGINT", close);
process.on("SIGTERM", close);
console.log(`Isolated Workflow file fixture: http://localhost:${port}/`);
