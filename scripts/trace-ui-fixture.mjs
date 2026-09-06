// Isolated Trace browser fixture. Synthetic data only; no configured models or production databases.
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
import { createTraceStore } from "../server/trace-store.mjs";
import { createWorkflowStore, newRun } from "../server/workflow/store.mjs";
const root = await mkdtemp(path.join(tmpdir(), "trace-ui-"));
const data = path.join(root, "data"),
  project = path.join(root, "Trace 布局验收");
await mkdir(project);
const workspace = await registerWorkspace(data, project);
const traces = createTraceStore(data),
  workflows = createWorkflowStore(data);
const now = Date.now() - 600000;
function createTrace(question, conversationId, start, context, child = false) {
  const id = randomUUID(),
    agent = randomUUID(),
    turn = randomUUID(),
    generation = randomUUID(),
    tool = randomUUID();
  traces.createRun({
    id,
    workspaceId: workspace.id,
    conversationId,
    startedAt: start,
    question,
    context,
    modelId: "research-model",
    modelProvider: "fixture",
  });
  const spans = [
    {
      id: agent,
      kind: "agent",
      name: context.agentLabel ?? "主 Agent",
      agentId: context.agentId ?? "main",
      agentLabel: context.agentLabel ?? "主 Agent",
      input: { task: question },
      status: "success",
      startedAt: start,
      endedAt: start + 12500,
    },
    {
      id: turn,
      parentSpanId: agent,
      kind: "turn",
      name: "turn 1",
      attributes: { turnIndex: 1 },
      status: "success",
      startedAt: start,
      endedAt: start + 12500,
    },
    {
      id: generation,
      parentSpanId: turn,
      kind: "generation",
      name: "research-model",
      output: { text: "开始查找相关资料。", usage: { totalTokens: 2460 } },
      status: "success",
      startedAt: start + 200,
      endedAt: start + 2000,
    },
    {
      id: tool,
      parentSpanId: turn,
      kind: "tool",
      name: child ? "delegate_agent" : "query_financial_data",
      input: { symbol: "示例公司", period: "2025" },
      output: { records: 12, preview: "模拟数据" },
      status: "success",
      startedAt: start + 2100,
      endedAt: start + 11000,
    },
  ];
  const reply =
    "## 研究结果\n\n这是一份用于 **Trace 界面验收** 的模拟回答，不包含投资建议。\n\n| 指标 | 观察 |\n| --- | --- |\n| 经营现金流 | 与利润趋势一致 |\n| 资产负债率 | 保持稳定 |\n\n";
  const messages = [
    {
      id: `${agent}:user`,
      spanId: agent,
      role: "user",
      content: question,
      createdAt: start,
      label: "用户",
    },
    {
      id: `${agent}:assistant`,
      spanId: agent,
      role: "assistant",
      content: reply.repeat(12),
      createdAt: start + 12000,
      model: "research-model",
      label: context.agentLabel ?? "主 Agent",
    },
  ];
  if (child) {
    const sub = randomUUID(),
      st = randomUUID(),
      sg = randomUUID(),
      childTool = randomUUID();
    spans.push(
      {
        id: sub,
        parentSpanId: tool,
        kind: "agent",
        name: "财务研究员",
        agentId: "financial-reader",
        agentLabel: "财务研究员",
        input: { task: "检查经营现金流与净利润的关系" },
        status: "success",
        startedAt: start + 2300,
        endedAt: start + 10600,
      },
      {
        id: st,
        parentSpanId: sub,
        kind: "turn",
        name: "turn 1",
        status: "success",
        startedAt: start + 2300,
        endedAt: start + 10600,
      },
      {
        id: sg,
        parentSpanId: st,
        kind: "generation",
        name: "research-model",
        output: { text: "现金流核验完成", usage: { totalTokens: 960 } },
        status: "success",
        startedAt: start + 2500,
        endedAt: start + 4000,
      },
      {
        id: childTool,
        parentSpanId: st,
        kind: "tool",
        name: "read_financial_report",
        input: { year: 2025 },
        output: { checked: true },
        status: "success",
        startedAt: start + 4200,
        endedAt: start + 10200,
      },
    );
    messages.push(
      {
        id: `${sub}:user`,
        spanId: sub,
        role: "user",
        content: "检查经营现金流与净利润的关系",
        createdAt: start + 2300,
        label: "任务",
      },
      {
        id: `${sub}:assistant`,
        spanId: sub,
        role: "assistant",
        content: "核验完成：模拟数据中经营现金流与净利润趋势一致。",
        createdAt: start + 10000,
        label: "财务研究员",
        model: "research-model",
      },
    );
  }
  traces.appendBatch(id, {
    spans,
    messages,
    events: [
      {
        seq: 1,
        spanId: tool,
        type: "tool_execution_end",
        timestamp: start + 11000,
        payload: { status: "success" },
      },
    ],
  });
  traces.finishRun(id, {
    status: "success",
    endedAt: start + 12500,
    output: reply,
    usage: { totalTokens: child ? 3420 : 2460 },
    stats: {
      turns: 1,
      generations: 1,
      tools: child ? 2 : 1,
      subAgents: child ? 1 : 0,
      warnings: 0,
    },
  });
  return id;
}
const conversation = randomUUID();
createTrace(
  "分析示例公司的现金流质量与长期竞争力",
  conversation,
  now,
  { mode: "chat" },
  true,
);
createTrace(
  "进一步比较近三年的经营现金流与净利润",
  conversation,
  now + 60000,
  { mode: "chat" },
  true,
);
for (let i = 0; i < 5; i++)
  createTrace(
    [
      "比较两家公司的研发投入",
      "检查财报中的风险提示",
      "梳理行业需求变化",
      "汇总季度业绩表现",
      "核验公告与数据来源",
    ][i],
    randomUUID(),
    now + (i + 2) * 40000,
    { mode: "chat" },
  );
const run = newRun({
  workspaceId: workspace.id,
  workspaceName: workspace.name,
  conversationId: randomUUID(),
  input: "并行分析公司财务质量与行业竞争格局，并汇总研究结论",
  config: {
    customSubAgents: [
      { id: "financial-reader", label: "财务研究员" },
      { id: "industry-reader", label: "行业研究员" },
    ],
  },
});
run.status = "completed";
run.createdAt = now + 300000;
run.version = 2;
run.plan = {
  title: "公司研究",
  nodes: [
    {
      id: "finance",
      title: "核验财务数据",
      task: "读取并核验财务报表",
      agentId: "financial-reader",
      dependencies: [],
    },
    {
      id: "industry",
      title: "研究行业竞争",
      task: "比较行业竞争格局",
      agentId: "industry-reader",
      dependencies: [],
    },
  ],
};
run.revisions = [
  {
    version: 1,
    plan: run.plan,
    reason: "并行开展财务和行业研究。",
    createdAt: run.createdAt,
  },
  {
    version: 2,
    plan: run.plan,
    reason: "重试财务数据核验，保留行业研究结果。",
    createdAt: run.createdAt + 30000,
  },
];
run.traces = [
  createTrace(run.input, run.conversationId, run.createdAt, {
    mode: "workflow",
    workflowRunId: run.id,
    role: "planner",
    agentLabel: "Plan Agent",
  }),
];
for (const [index, node] of [
  run.plan.nodes[0],
  run.plan.nodes[1],
  run.plan.nodes[0],
].entries()) {
  const id = randomUUID(),
    start = run.createdAt + (index === 2 ? 32000 : 13000);
  const traceId = createTrace(node.task, run.conversationId, start, {
    mode: "workflow",
    workflowRunId: run.id,
    role: "node",
    nodeId: node.id,
    nodeTitle: node.title,
    agentId: node.agentId,
    agentLabel: node.id === "finance" ? "财务研究员" : "行业研究员",
    attemptId: id,
    attemptNumber: index === 2 ? 2 : 1,
    planVersion: index === 2 ? 2 : 1,
  });
  run.traces.push(traceId);
  run.attempts.push({
    id,
    nodeId: node.id,
    version: index === 2 ? 2 : 1,
    traceId,
    startedAt: start,
    endedAt: start + 12500,
    status: index === 0 ? "failed" : "completed",
    input: node.task,
    ...(index === 0
      ? { error: "模拟：数据源暂时不可用" }
      : {
          result: {
            status: "completed",
            text: "模拟研究结果",
            summary: "核验完成",
          },
        }),
  });
  if (index !== 0) run.accepted[node.id] = id;
}
run.summary =
  "## 汇总\n\n财务与行业两个方向的核验已完成。财务节点第一次尝试失败，第二次尝试成功；行业结果复用。";
workflows.save(run);
traces.close();
workflows.close();
const token = randomUUID(),
  handler = createLocalRuntimeHandler({
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
const child = spawn(
  path.resolve("node_modules/.bin/vinext"),
  ["dev", "--port", "4317"],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      PI_LOCAL_DATA_DIR: data,
      LOCAL_RUNTIME_URL: `http://127.0.0.1:${server.address().port}`,
      LOCAL_RUNTIME_TOKEN: token,
      WRANGLER_LOG_PATH: ".wrangler/wrangler.log",
    },
  },
);
let closing = false;
async function close() {
  if (closing) return;
  closing = true;
  child.kill("SIGTERM");
  await handler.close();
  server.closeAllConnections();
  server.close();
  await rm(root, { recursive: true, force: true });
  process.exit();
}
child.on("exit", close);
process.on("SIGINT", close);
process.on("SIGTERM", close);
console.log("Isolated Trace UI fixture: http://localhost:4317/", {
  workspaceId: workspace.id,
});
