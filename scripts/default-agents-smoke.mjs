// Opt-in live integration check. Uses isolated project/database state and existing model credentials.
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { mkdtemp, mkdir, writeFile, copyFile, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  createLocalRuntimeHandler,
  registerWorkspace,
} from "../server/local-runtime.mjs";
import { listPublicModelProviders } from "../server/model-providers.mjs";
import { createDefaultProjectAgentConfig } from "../lib/agent-profiles.ts";
if (!process.argv.includes("--live"))
  throw Error("Use --live to authorize calls to the configured model.");
const root = await mkdtemp(path.join(tmpdir(), "workflow-live-"));
const data = path.join(root, "data"),
  project = path.join(root, "project");
await mkdir(data);
await mkdir(project);
await mkdir(path.join(project, "inputs"));
await writeFile(
  path.join(project, "inputs", "a.txt"),
  "产品 A：收入 120，成本 80。单位：万元。\n",
);
await writeFile(
  path.join(project, "inputs", "b.txt"),
  "产品 B：收入 90，成本 60。单位：万元。\n",
);
await copyFile(
  ".local-data/model-providers.json",
  path.join(data, "model-providers.json"),
);
const providers = await listPublicModelProviders(data),
  provider = providers.find((p) => p.verified && p.enabledModelIds.length);
if (!provider) throw Error("No verified model.");
const model = { providerId: provider.id, modelId: provider.enabledModelIds[0] };
const token = randomUUID();
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
process.env.LOCAL_RUNTIME_URL = url;
process.env.LOCAL_RUNTIME_TOKEN = token;
async function request(route, body) {
  const response = await fetch(url + route, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    ...(body ? { method: "POST", body: JSON.stringify(body) } : {}),
  });
  const data = await response.json();
  if (!response.ok) throw Error(data.message);
  return data;
}
try {
  for (const name of ["pandoc", "documents-venv", "documents-ready-v2"]) await symlink(path.resolve(".local-data", name), path.join(data, name));
  const workspace = await registerWorkspace(data, project);
  const payload = {
    requestId: randomUUID(),
    workspaceId: workspace.id,
    model,
    agentConfig: createDefaultProjectAgentConfig(),
    input: "恰好三个串行节点：data 用数据Agent调用 read_project_file 读取 inputs/a.txt 和 inputs/b.txt，计算总利润；research 用研报Agent依赖 data，实际读取 inputs/a.txt，核验利润口径并指出这是测试样本而非真实公司财报；writing 用写作Agent依赖 research 和 data，必须调用 generate_document 生成 Word 报告（含总利润70万元、来源与样本限制），返回产物路径。不要联网或修改数据库。",
    plannerPrompt: "这是默认角色集成验收，严格用 data、research、writing 三节点 DAG。全部完成后 finish_workflow。",
    limits: { timeoutMs: 180000 },
  };
  const first = await request("/workflows/runs", payload),
    duplicate = await request("/workflows/runs", payload);
  if (first.id !== duplicate.id)
    throw Error("Duplicate request started a second run");
  const deadline = Date.now() + 540000;
  let run;
  while (Date.now() < deadline) {
    run = await request(`/workflows/runs/${first.id}`);
    console.log(
      JSON.stringify({
        status: run.status,
        version: run.version,
        attempts: run.attempts.map((a) => ({
          node: a.nodeId,
          status: a.status,
        })),
        ...(run.error ? { error: run.error } : {}),
      }),
    );
    if (
      ["completed", "waiting_input", "cancelled", "failed"].includes(run.status)
    )
      break;
    await new Promise((r) => setTimeout(r, 8000));
  }
  if (run.status !== "completed")
    throw Error(`Live workflow did not complete: ${run.error ?? run.status}`);
  const details = await Promise.all(
    run.attempts.map((a) =>
      request(`/workflows/runs/${run.id}/attempts/${a.id}`),
    ),
  );
  const reads = details
    .flatMap((d) => d.operations)
    .filter((o) => o.tool === "read_project_file" && o.status === "completed");
  const documentOps = details.flatMap(d => d.operations).filter(o => o.tool === "generate_document" && o.status === "completed");
  if (!documentOps.length) throw Error("Missing actual document generation");
  if (reads.length < 2) throw Error("Missing real Subagent file reads");
  if (!run.plan.nodes.some((n) => n.dependencies.length === 2))
    throw Error("Missing join dependency");
  const trace = await request(`/traces/${run.traces[0]}`);
  if (!trace.spans?.length) throw Error("Trace missing");
  const template = await request("/workflows/templates", {
    requestId: randomUUID(),
    runId: run.id,
    version: run.version,
    name: "Workflow smoke",
    description: "isolated test",
  });
  if (template.versions.length !== 1) throw Error("Template save failed");
  await mkdir(".local-data", { recursive: true });
  await writeFile(
    ".local-data/default-agents-smoke-latest.json",
    JSON.stringify(
      {
        at: new Date().toISOString(),
        model,
        status: run.status,
        nodeCount: run.plan.nodes.length,
        attemptCount: run.attempts.length,
        readCalls: reads.length,
        documentCalls: documentOps.length,
        traceCount: run.traces.length,
        summary: run.summary,
        idempotentCreate: true,
        templateSaved: true,
      },
      null,
      2,
    ),
  );
  console.log("LIVE WORKFLOW VERIFIED");
} finally {
  await handler.close();
  server.closeAllConnections();
  await new Promise((r) => server.close(r));
  await rm(root, { recursive: true, force: true });
}
