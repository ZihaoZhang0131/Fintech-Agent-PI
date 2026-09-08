import { DOCUMENT_CHART_GUIDANCE } from "@/server/document-charts.mjs";
import { createConfiguredAgent } from "@/server/agent/create-agent";
import { createProfileTools } from "@/server/agent/profile-tools";
import { Agent, type AgentEvent, type AgentMessage, type AgentTool } from "@earendil-works/pi-agent-core";
import { type AssistantMessage, type Usage } from "@earendil-works/pi-ai";
import { createConfiguredModels } from "@/server/model-registry";
import { parseModelReference, resolveRuntimeModel } from "@/server/model-runtime";
import { getConfiguredSubAgent, getConfiguredSubAgents, resolveGlobalAgentPrompts, resolveProjectAgentConfig } from "@/server/agent/agent-registry";
import type { SubAgentId } from "@/lib/agent-profiles";
import { formatAssistantHistoryContent } from "@/lib/delegation-history";
import { formatSkillCatalog } from "@/server/agent/skills/catalog";
import { loadEffectiveSkillRegistry, selectSkillRegistry } from "@/server/agent/skills/loader";
import { createLoadSkillTool, createLoadedSkillTracker, type LoadSkillDetails } from "@/server/agent/tools/load-skill";
import { createSkillResourceTools, type SkillResourceDetails } from "@/server/agent/tools/skill-resources";
import {
  createBashTool,
  type BashApprovalMode,
  type BashPermissionMode,
  type BashToolDetails,
} from "@/server/agent/tools/bash";
import { createWebSearchTool, type WebSearchDetails } from "@/server/agent/tools/web-search";
import {
  createMcpAgentTools,
  discoverMcpServers,
  type McpToolDetails,
} from "@/server/agent/tools/mcp";
import { createDelegateAgentTool, type SubAgentDetails } from "@/server/agent/tools/delegate-agent";
import {
  createWorkspaceTools,
  type WorkspaceToolDetails,
} from "@/server/agent/tools/workspace-files";
import { createLocalDatabaseTools, type LocalDatabaseToolDetails } from "@/server/agent/tools/local-database";
import { createDocumentTool, type DocumentToolDetails } from "@/server/agent/tools/generate-document";
import { TraceRecorder } from "@/server/agent/trace/trace-recorder";
import { LocalRuntimeTraceSink } from "@/server/agent/trace/trace-sink";
import { traceSha256 } from "@/server/trace-redaction.mjs";

type InputMessage = {
  role: "user" | "assistant";
  content: string;
  delegations?: unknown;
};

type ChatRequest = {
  traceId?: unknown;
  conversationId?: string;
  workspaceId?: string;
  workspaceName?: string;
  workspacePath?: string;
  model?: unknown;
  enabledSkills?: unknown;
  enabledTools?: unknown;
  enabledMcps?: unknown;
  agentConfig?: unknown;
  agentPrompts?: unknown;
  bashApprovalMode?: unknown;
  bashPermissionMode?: unknown;
  messages?: InputMessage[];
  input?: string;
};

const EMPTY_USAGE: Usage = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
  totalTokens: 0,
  cost: {
    input: 0,
    output: 0,
    cacheRead: 0,
    cacheWrite: 0,
    total: 0,
  },
};

function isInputMessage(value: unknown): value is InputMessage {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    (candidate.role === "user" || candidate.role === "assistant") &&
    typeof candidate.content === "string" &&
    candidate.content.length <= 50_000
  );
}

function toAgentMessage(
  message: InputMessage,
  piProviderId: string,
  modelId: string,
  index: number,
): AgentMessage {
  const timestamp = Date.now() - Math.max(0, 1_000 - index);
  if (message.role === "user") {
    return { role: "user", content: message.content, timestamp };
  }

  const content = formatAssistantHistoryContent(message.content, message.delegations);

  return {
    role: "assistant",
    content: [{ type: "text", text: content }],
    api: "openai-completions",
    provider: piProviderId,
    model: modelId,
    usage: EMPTY_USAGE,
    stopReason: "stop",
    timestamp,
  } satisfies AssistantMessage;
}

function formatSse(payload: object) {
  return `data: ${JSON.stringify(payload)}\n\n`;
}

function safeErrorMessage(error: unknown) {
  const raw = error instanceof Error ? error.message : "unknown error";
  if (/401|unauthorized|api.?key/i.test(raw)) {
    return "模型鉴权失败，请检查该服务商的 API Key。";
  }
  if (/402|balance|insufficient/i.test(raw)) {
    return "模型账户余额不足或没有使用权限。";
  }
  if (/429|rate.?limit/i.test(raw)) {
    return "模型请求过于频繁，请稍后再试。";
  }
  return "模型调用失败，请检查网络或稍后重试。";
}

function getWebSearchDetails(value: unknown): WebSearchDetails | undefined {
  if (!value || typeof value !== "object") return undefined;
  const details = value as Partial<WebSearchDetails>;
  if (details.provider !== "tavily" || typeof details.query !== "string") return undefined;
  return details as WebSearchDetails;
}

function getLoadSkillDetails(value: unknown): LoadSkillDetails | undefined {
  if (!value || typeof value !== "object") return undefined;
  const details = value as Partial<LoadSkillDetails>;
  if (details.kind !== "skill" || typeof details.name !== "string") return undefined;
  return details as LoadSkillDetails;
}

function getWorkspaceDetails(value: unknown): WorkspaceToolDetails | undefined {
  if (!value || typeof value !== "object") return undefined;
  const details = value as Partial<WorkspaceToolDetails>;
  if (details.kind !== "workspace" || typeof details.action !== "string") return undefined;
  return details as WorkspaceToolDetails;
}

function getLocalDatabaseDetails(value: unknown): LocalDatabaseToolDetails | undefined {
  if (!value || typeof value !== "object") return undefined;
  const details = value as Partial<LocalDatabaseToolDetails>;
  if (details.kind !== "local_database" || typeof details.action !== "string") return undefined;
  return details as LocalDatabaseToolDetails;
}

function getDocumentDetails(value: unknown): DocumentToolDetails | undefined {
  if (!value || typeof value !== "object") return undefined;
  const details = value as Partial<DocumentToolDetails>;
  if (details.kind !== "document" || typeof details.path !== "string") return undefined;
  if (details.format !== "docx" && details.format !== "pdf") return undefined;
  return details as DocumentToolDetails;
}

function getSkillResourceDetails(value: unknown): SkillResourceDetails | undefined {
  if (!value || typeof value !== "object") return undefined;
  const details = value as Partial<SkillResourceDetails>;
  if (details.kind !== "skill_resource" || typeof details.skillName !== "string" || typeof details.path !== "string") return undefined;
  return details as SkillResourceDetails;
}

function getBashDetails(value: unknown): BashToolDetails | undefined {
  if (!value || typeof value !== "object") return undefined;
  const details = value as Partial<BashToolDetails>;
  if (
    details.kind !== "bash" ||
    typeof details.commandId !== "string" ||
    typeof details.command !== "string"
  ) {
    return undefined;
  }
  return details as BashToolDetails;
}

function getMcpDetails(value: unknown): McpToolDetails | undefined {
  if (!value || typeof value !== "object") return undefined;
  const details = value as Partial<McpToolDetails>;
  if (
    details.kind !== "mcp" ||
    typeof details.serverId !== "string" ||
    typeof details.externalToolName !== "string"
  ) {
    return undefined;
  }
  return details as McpToolDetails;
}

function getSubAgentDetails(value: unknown): SubAgentDetails | undefined {
  if (!value || typeof value !== "object") return undefined;
  const details = value as Partial<SubAgentDetails>;
  if (details.kind !== "subagent" || typeof details.agentId !== "string" || typeof details.agentLabel !== "string") {
    return undefined;
  }
  return details as SubAgentDetails;
}

function getDelegatedAgentId(args: unknown) {
  if (!args || typeof args !== "object" || !("agentId" in args)) return undefined;
  const agentId = args.agentId;
  return typeof agentId === "string" ? agentId : undefined;
}

function getToolLabel(
  toolName: string,
  labels?: Map<string, string>,
  delegatedAgentLabel?: string,
) {
  if (toolName === "delegate_agent") {
    return delegatedAgentLabel
      ? `委派${delegatedAgentLabel} Agent`
      : "委派 Agent";
  }
  if (labels?.has(toolName)) return labels.get(toolName)!;
  if (toolName === "web_search") return "Tavily 网络搜索";
  if (toolName === "load_skill") return "加载 Skill";
  if (toolName === "list_project_files") return "查看项目文件";
  if (toolName === "read_project_file") return "读取项目文件";
  if (toolName === "write_project_file") return "保存项目产出";
  if (toolName === "list_local_database_tables") return "查看本地数据库表";
  if (toolName === "describe_local_database_table") return "查看本地数据表结构";
  if (toolName === "query_local_database") return "查询本地数据库";
  if (toolName === "mutate_local_database") return "修改本地数据库";
  if (toolName === "bash") return "执行 Bash";
  return toolName;
}

function getToolInput(args: unknown) {
  if (!args || typeof args !== "object") return undefined;
  if ("query" in args) return String(args.query);
  if ("name" in args) return String(args.name);
  if ("path" in args) return String(args.path);
  if ("sql" in args) return String(args.sql);
  if ("command" in args) return String(args.command);
  if ("task" in args) return String(args.task);
  const summary = Object.entries(args)
    .slice(0, 4)
    .map(([key, value]) => `${key}=${String(value)}`)
    .join(", ");
  return summary || undefined;
}

export async function POST(request: Request) {
  let payload: ChatRequest;
  try {
    payload = (await request.json()) as ChatRequest;
  } catch {
    return Response.json({ message: "请求内容不是有效的 JSON。" }, { status: 400 });
  }
  const input = payload.input?.trim() ?? "";
  const history = Array.isArray(payload.messages) ? payload.messages : [];
  const workspaceId = payload.workspaceId?.trim() ?? "";
  const workspaceName = payload.workspaceName?.trim().slice(0, 200) || "本地项目";
  const workspacePath = typeof payload.workspacePath === "string" && payload.workspacePath.length <= 4_096
    ? payload.workspacePath
    : undefined;
  const requestedTraceId = typeof payload.traceId === "string" ? payload.traceId.trim() : "";
  const bashApprovalMode: BashApprovalMode =
    payload.bashApprovalMode === "ask" ? "ask" : "auto";
  const bashPermissionMode: BashPermissionMode =
    payload.bashPermissionMode === "full" ? "full" : "sandbox";
  if (
    !input ||
    input.length > 20_000 ||
    !history.every(isInputMessage) ||
    !/^[a-f0-9-]{20,64}$/i.test(workspaceId) ||
    (payload.traceId !== undefined && !/^[a-f0-9-]{20,64}$/i.test(requestedTraceId))
  ) {
    return Response.json({ message: "问题为空、过长或历史消息格式不正确。" }, { status: 400 });
  }

  const allSkills = await loadEffectiveSkillRegistry();
  const allSkillNames = allSkills.list().map((skill) => skill.name);
  const agentConfig = resolveProjectAgentConfig(payload.agentConfig, {
    enabledSkills: payload.enabledSkills,
    enabledTools: payload.enabledTools,
    enabledMcps: payload.enabledMcps,
  }, allSkillNames);
  const agentPrompts = resolveGlobalAgentPrompts(payload.agentPrompts);
  const requestedModelReference = parseModelReference(payload.model);
  if (!agentConfig.mainModel && !requestedModelReference) {
    return Response.json({ message: "请选择一个可用模型。" }, { status: 400 });
  }
  const modelReference = agentConfig.mainModel ?? requestedModelReference!;
  let resolvedModel;
  try {
    resolvedModel = await resolveRuntimeModel(modelReference);
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "模型尚未完成配置。" },
      { status: 409 },
    );
  }

  const mainProfile = agentConfig.profiles.main;
  const enabledToolNames = new Set<string>(mainProfile.enabledTools);
  const skillRegistry = selectSkillRegistry(
    allSkills,
    enabledToolNames.has("load_skill") ? mainProfile.enabledSkills : [],
  );
  const workspaceTools = createWorkspaceTools(workspaceId).filter((tool) =>
    enabledToolNames.has(tool.name),
  );
  const databaseTools = createLocalDatabaseTools().filter((tool) => enabledToolNames.has(tool.name));
  const documentTools = enabledToolNames.has("generate_document") ? [createDocumentTool(workspaceId)] : [];
  const connectedMcpServers = await discoverMcpServers(mainProfile.enabledMcps);
  const mcpTools = createMcpAgentTools(connectedMcpServers);
  const models = createConfiguredModels();
  const model = models.getModel(resolvedModel.piProviderId, resolvedModel.modelId);
  if (!model) {
    return Response.json({ message: "PI 中没有找到所选模型。" }, { status: 500 });
  }
  let createToolEventForwarder: ((parentToolCallId?: string, labels?: Map<string, string>) => (event: AgentEvent) => void) | undefined;
  let traceRecorder: TraceRecorder | undefined;

  async function runSubAgent(
    agentId: SubAgentId,
    task: string,
    parentSignal?: AbortSignal,
    parentToolCallId?: string,
  ) {
    const configuredAgent = getConfiguredSubAgent(agentConfig, agentId);
    if (!configuredAgent?.profile.enabled) throw new Error("该专业 Agent 本轮未启用。");
    const profile = configuredAgent.profile;
    const reference = profile.model ?? modelReference;
    const childTraceHandle = traceRecorder?.attachAgent({
      agentId,
      input: task,
      agentLabel: configuredAgent.label,
      modelProvider: reference.providerId,
      modelId: reference.modelId,
      parentSpanId: parentToolCallId
        ? traceRecorder.getToolSpanId("main", parentToolCallId)
        : undefined,
    });
    let childTimedOut = false;
    try {
      let childResolved;
      try {
        childResolved = await resolveRuntimeModel(reference);
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "专业 Agent 模型不可用。");
      }
      const childToolNames = new Set(profile.enabledTools);
      const { tools: childTools, skills: childSkills, mcps: childMcps } = await createProfileTools({
        profile, registry: allSkills, workspaceId, approvalMode: bashApprovalMode, permissionMode: bashPermissionMode,
      });
      const childPrompt = [
        `你是${configuredAgent.label}。${configuredAgent.description} 严格区分事实、推断和待验证事项；缺少证据时明确说明，不能编造数据或来源。`,
        `当前项目名称：${JSON.stringify(workspaceName)}。`,
        "你是被主 Agent 委派的专业研究员，只能使用本角色已配置的能力，不能再次委派 Agent，也不能假设自己看过主 Agent 的聊天记录。",
        "用简洁 Markdown 返回：1. 摘要；2. 事实和来源/数据日期；3. 风险、限制或待验证项。",
        childMcps.length
          ? `本次可使用的 MCP：${childMcps.map((server) => server.label).join("、")}。`
          : "本次没有可用 MCP；不要声称调用过 MCP。",
        childToolNames.has("generate_document")
          ? "如任务要求 Word 或 PDF，直接调用 generate_document。不要为此调用 Bash、npm、Pandoc 或 Python，也不要把工具失败伪称为已保存的文档。"
          : "本角色没有启用 Word/PDF 文档生成能力，不要声称已生成文档。",
        childToolNames.has("generate_document") ? DOCUMENT_CHART_GUIDANCE : "",
        formatSkillCatalog(childSkills),
      ].join("\n\n");
      const child = createConfiguredAgent({
        resolved: childResolved,
        systemPrompt: childPrompt,
        tools: childTools,
        sessionId: `${payload.conversationId ?? "conversation"}:${agentId}:${crypto.randomUUID()}`,
      });
      let finalText = "";
      const forwardChildTools = createToolEventForwarder?.(parentToolCallId, new Map(childTools.map((tool) => [tool.name, tool.label])));
      child.subscribe((event) => {
        childTraceHandle?.onEvent(event);
        forwardChildTools?.(event);
        if (event.type === "message_end" && event.message.role === "assistant") {
          finalText = event.message.content
            .filter((item) => item.type === "text")
            .map((item) => item.text)
            .join("\n");
        }
      });
      const timeout = setTimeout(() => { childTimedOut = true; child.abort(); }, 60_000);
      const abort = () => child.abort();
      parentSignal?.addEventListener("abort", abort, { once: true });
      try {
        await child.prompt(task);
      } finally {
        clearTimeout(timeout);
        parentSignal?.removeEventListener("abort", abort);
      }
      if (childTimedOut) throw new Error("Subagent 执行超时");
      if (parentSignal?.aborted) throw new Error("Subagent 已停止");
      if (!finalText) throw new Error("专业 Agent 未返回可用研究结果。");
      childTraceHandle?.finish(childTimedOut ? new Error("Subagent 执行超时") : undefined, parentSignal?.aborted);
      const limit = 12_000;
      return {
        text: finalText.length > limit ? `${finalText.slice(0, limit)}\n\n（子 Agent 回传已截断）` : finalText,
        model: { providerId: reference.providerId, modelId: reference.modelId },
        truncated: finalText.length > limit,
      };
    } catch (error) {
      childTraceHandle?.finish(error, parentSignal?.aborted);
      throw error;
    }
  }

  const enabledSubAgents = getConfiguredSubAgents(agentConfig)
    .filter((agent) => agent.profile.enabled)
    .map(({ id, label, description }) => ({ id, label, description }));
  const delegateAgentTool = createDelegateAgentTool({ agents: enabledSubAgents, run: runSubAgent });
  const skillTracker = createLoadedSkillTracker();
  const agentTools: AgentTool[] = [
    ...(enabledToolNames.has("load_skill") && skillRegistry.list().length > 0
      ? [
          createLoadSkillTool(skillRegistry, skillTracker),
          ...createSkillResourceTools(skillRegistry, skillTracker, workspaceId, {
            approvalMode: bashApprovalMode,
            permissionMode: bashPermissionMode,
          }).filter((tool) => tool.name !== "run_skill_script" || enabledToolNames.has("bash")),
        ]
      : []),
    ...(enabledToolNames.has("web_search")
      ? [createWebSearchTool({ apiKey: process.env.TAVILY_API_KEY })]
      : []),
    ...workspaceTools,
    ...databaseTools,
    ...documentTools,
    ...(enabledToolNames.has("bash")
      ? [createBashTool(workspaceId, { approvalMode: bashApprovalMode, permissionMode: bashPermissionMode })]
      : []),
    ...mcpTools,
    ...(delegateAgentTool ? [delegateAgentTool] : []),
  ];
  const toolLabels = new Map(agentTools.map((tool) => [tool.name, tool.label]));
  const projectCapabilityPrompt = [
    `当前项目名称：${JSON.stringify(workspaceName)}。`,
    `本轮已启用工具：${mainProfile.enabledTools.join(", ") || "无"}。只能使用这个列表中的工具。`,
    `本轮已启用 MCP：${mainProfile.enabledMcps.join(", ") || "无"}。实际已连接：${connectedMcpServers.map((server) => server.label).join(", ") || "无"}。`,
    connectedMcpServers.length > 0
      ? "查询 A 股结构化行情或财务数据时优先使用已连接 MCP；需要新闻、公告原文和可点击引用时使用 web_search。"
      : mainProfile.enabledMcps.length > 0
        ? "用户启用了 MCP，但本机服务当前不可用。本轮继续使用其他工具，不要声称已经调用 MCP。"
        : "本轮没有启用 MCP，不要声称已经查询结构化 MCP 数据。",
    enabledToolNames.has("list_project_files") || enabledToolNames.has("read_project_file")
      ? "需要项目资料时，使用已启用的项目文件工具获取，不要猜测文件内容。"
      : "本轮没有启用项目文件读取能力，不要声称已经查看过项目文件。",
    enabledToolNames.has("write_project_file")
      ? "形成完整研究报告、研究框架、表格数据或代码时，在最终回答前使用 write_project_file 保存到 outputs/ 目录，并说明保存路径。"
      : "本轮没有启用文件写入能力，不要声称已经把产出保存到本地。",
    enabledToolNames.has("generate_document")
      ? "用户明确要求 Word 或 PDF 文件时，完成内容后直接调用 generate_document。文档内容与写法必须由用户要求或已加载 Skill 决定；不要把该工具当作写作 Skill。严禁为了文档生成调用 Bash、npm、Pandoc、Python、conda、wkhtmltopdf 或在当前项目里安装/探测依赖；这些均由 Local Runtime 管理。若工具返回初始化中或失败，只如实说明该工具错误，不要伪称已保存 Markdown、PDF 或 DOCX。"
      : "本轮没有启用 Word/PDF 文档生成能力，不要声称已经生成文档。",
    enabledToolNames.has("generate_document") ? DOCUMENT_CHART_GUIDANCE : "",
    enabledToolNames.has("query_local_database") || enabledToolNames.has("list_local_database_tables")
      ? "本地数据库为全应用共享。查询前先查看数据表和结构；只读查询使用本地数据库工具，不要猜测表或数据。"
      : "本轮没有启用本地数据库查询能力，不要声称已经查询数据库。",
    enabledToolNames.has("mutate_local_database")
      ? "修改本地数据库时只能调用修改本地数据库工具，并清楚说明将执行的 SQL；完成后报告受影响行数。"
      : "本轮没有启用本地数据库写入能力，不要声称已经创建、更新或删除数据库数据。",
    enabledToolNames.has("bash")
      ? `Bash 已启用，执行模式为 ${bashApprovalMode === "ask" ? "每条确认" : "自动执行"}，权限模式为 ${bashPermissionMode === "full" ? "完整本机权限" : "项目沙箱"}。只有任务确实需要运行脚本、测试、构建或命令行操作时才调用 bash。`
      : "本轮没有启用 Bash，不要声称执行过脚本、测试、构建或命令。",
    enabledSubAgents.length
      ? [
          "已启用专业 Agent（调用 delegate_agent 时必须按下列映射使用对应 agentId）：",
          ...enabledSubAgents.map((item) =>
            `- 名称=${JSON.stringify(item.label)}；agentId=${JSON.stringify(item.id)}；职责=${JSON.stringify(item.description)}`
          ),
          "按职责选择 Agent，收到回传后由你整合最终回答。",
        ].join("\n")
      : "本轮没有启用专业 Agent，不要声称委派过子 Agent。",
    "历史 assistant 消息中的 <application_delegation_history> 由应用根据当时的工具事件生成，是追溯过往委派名称、agentId、任务和状态的事实记录；当记录存在时直接依据它回答，不要声称无法确定映射或当时的委派对象。",
    "只处理当前项目和用户任务相关的内容，不覆盖不相关文件。",
  ].join("\n");

  const linkFormatPrompt = [
    "引用格式：网页引用使用工具返回或用户提供的真实 http/https 网址，以 [来源](完整网址) 标注。",
    "引用项目文件或成功保存的产出时，使用工具实际返回的项目相对路径，例如 [研究报告](outputs/report.md)。不要编造路径或声称不存在的文件已保存。",
    "只有确认源文件行号时才使用 [查看实现](src/example.ts#L337)，不能确认时只链接文件。行号从 1 开始。",
    "路径各段中的空格、#、? 等特殊字符需进行 URL 编码，保留目录分隔符 /；不使用操作系统绝对路径、file:// 或 :行号 后缀。",
    "链接文字简短且说明用途。生成 Markdown 文档时，相对文件链接以文档所在目录为基准；/outputs/report.md 表示项目根目录下的文件。",
  ].join("\n");
  const finalSystemPrompt = `${agentPrompts.main}\n\n${projectCapabilityPrompt}\n\n${formatSkillCatalog(skillRegistry)}\n\n${linkFormatPrompt}`;

  const agent = new Agent({
    initialState: {
      systemPrompt: finalSystemPrompt,
      model,
      thinkingLevel: "off",
      tools: agentTools,
      messages: history.map((message, index) =>
        toAgentMessage(message, resolvedModel.piProviderId, resolvedModel.modelId, index),
      ),
    },
    streamFn: models.streamSimple.bind(models),
    getApiKey: () => resolvedModel.apiKey,
    sessionId: payload.conversationId,
  });

  const encoder = new TextEncoder();
  const startedAt = Date.now();
  const traceId = requestedTraceId || crypto.randomUUID();
  let finalMessage: AssistantMessage | undefined;
  let streamCancelled = false;
  let abortRequested = false;
  let abortPoll: ReturnType<typeof setInterval> | undefined;
  let abortCheckPending = false;
  const abortRun = () => {
    abortRequested = true;
    streamCancelled = true;
    if (abortPoll) clearInterval(abortPoll);
    abortPoll = undefined;
    traceRecorder?.markAborted();
    agent.abort();
  };

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (value: object) => {
        if (streamCancelled) return;
        try {
          controller.enqueue(encoder.encode(formatSse(value)));
        } catch {
          streamCancelled = true;
        }
      };
      const traceSink = new LocalRuntimeTraceSink();
      traceRecorder = new TraceRecorder({
        id: traceId,
        sink: traceSink,
        workspaceId,
        conversationId: payload.conversationId,
        context: { mode: "chat", role: "main" },
        startedAt,
        modelProvider: resolvedModel.piProviderId,
        modelId: resolvedModel.modelId,
        question: input,
        workspacePath,
        capabilities: {
          workspaceName,
          history: {
            count: history.length,
            bytes: Buffer.byteLength(JSON.stringify(history), "utf8"),
            sha256: traceSha256(JSON.stringify(history)),
            contentRecorded: false,
          },
          main: {
            model: { providerId: modelReference.providerId, modelId: modelReference.modelId },
            enabledSkills: mainProfile.enabledSkills,
            enabledTools: mainProfile.enabledTools,
            enabledMcps: mainProfile.enabledMcps,
          },
          subAgents: getConfiguredSubAgents(agentConfig)
            .filter((item) => item.profile.enabled)
            .map((item) => ({
              id: item.id,
              label: item.label,
              model: item.profile.model,
              enabledSkills: item.profile.enabledSkills,
              enabledTools: item.profile.enabledTools,
              enabledMcps: item.profile.enabledMcps,
            })),
          bashApprovalMode,
          bashPermissionMode,
          systemPrompt: {
            bytes: Buffer.byteLength(finalSystemPrompt, "utf8"),
            sha256: traceSha256(finalSystemPrompt),
            contentRecorded: false,
          },
        },
      });
      const traceAvailable = await traceRecorder.start();
      const mainTraceHandle = traceRecorder.attachAgent({
        scopeKey: "main",
        agentId: "main",
        agentLabel: "主 Agent",
        modelProvider: resolvedModel.piProviderId,
        modelId: resolvedModel.modelId,
        isRoot: true,
      });
      createToolEventForwarder = (parentToolCallId, labels = toolLabels) => {
        const toolStartedAt = new Map<string, number>();
        const delegatedAgentIds = new Map<string, string>();
        const sendTool = (value: object) => send({ ...value, parentToolCallId });
        return (event) => {
          if (event.type === "tool_execution_start") {
            const toolStartTime = Date.now();
            const delegatedAgentId = getDelegatedAgentId(event.args);
            const delegatedAgent = getConfiguredSubAgent(agentConfig, delegatedAgentId ?? "");
            toolStartedAt.set(event.toolCallId, toolStartTime);
            if (event.toolName === "delegate_agent" && delegatedAgentId) {
              delegatedAgentIds.set(event.toolCallId, delegatedAgentId);
            }
            sendTool({
              type: "tool_start",
              toolCallId: event.toolCallId,
              toolName: event.toolName,
              label: getToolLabel(event.toolName, labels, getConfiguredSubAgent(agentConfig, delegatedAgentId ?? "")?.label),
              query: getToolInput(event.args),
              startedAt: toolStartTime,
              children: event.toolName === "delegate_agent" ? [] : undefined,
              subAgentId: event.toolName === "delegate_agent" ? delegatedAgentId : undefined,
              subAgentLabel: event.toolName === "delegate_agent" ? delegatedAgent?.label : undefined,
            });
          }

          if (event.type === "tool_execution_end") {
            const completedAt = Date.now();
            const searchDetails = getWebSearchDetails(event.result?.details);
            const skillDetails = getLoadSkillDetails(event.result?.details);
            const skillResourceDetails = getSkillResourceDetails(event.result?.details);
            const workspaceDetails = getWorkspaceDetails(event.result?.details);
            const databaseDetails = getLocalDatabaseDetails(event.result?.details);
            const documentDetails = getDocumentDetails(event.result?.details);
            const bashDetails = getBashDetails(event.result?.details);
            const mcpDetails = getMcpDetails(event.result?.details);
            const subAgentDetails = getSubAgentDetails(event.result?.details);
            const delegatedAgentId = subAgentDetails?.agentId ?? delegatedAgentIds.get(event.toolCallId);
            const delegatedAgentLabel = subAgentDetails?.agentLabel ??
              getConfiguredSubAgent(agentConfig, delegatedAgentId ?? "")?.label;
            sendTool({
              type: "tool_end",
              toolCallId: event.toolCallId,
              toolName: event.toolName,
              label: getToolLabel(event.toolName, labels, delegatedAgentLabel),
              isError: event.isError,
              query:
                searchDetails?.query ??
                skillDetails?.name ??
                skillResourceDetails?.path ??
                workspaceDetails?.path ??
                databaseDetails?.sql ??
                databaseDetails?.table ??
                documentDetails?.path ??
                bashDetails?.command ??
                mcpDetails?.summary ??
                subAgentDetails?.task,
              summary: event.isError
                ? event.result?.content?.filter((item: { type: string }) => item.type === "text").map((item: { text: string }) => item.text).join("\n").slice(0, 1000) || "工具执行失败"
                : skillDetails
                ? `已加载 ${skillDetails.name}`
                : skillResourceDetails?.action === "read"
                  ? `已读取 ${skillResourceDetails.path}`
                  : skillResourceDetails?.status === "rejected"
                    ? "用户已拒绝，脚本未执行"
                    : skillResourceDetails?.action === "run"
                      ? `退出码 ${skillResourceDetails.exitCode ?? "无"}`
                : workspaceDetails?.action === "write"
                  ? `已保存 ${workspaceDetails.path}`
                : workspaceDetails?.action === "read"
                    ? `已读取 ${workspaceDetails.path}`
                    : databaseDetails?.action === "list"
                      ? `发现 ${databaseDetails.resultCount ?? 0} 张表`
                      : databaseDetails?.action === "describe"
                        ? `已查看 ${databaseDetails.table}`
                        : databaseDetails?.action === "query"
                          ? `返回 ${databaseDetails.resultCount ?? 0} 行${databaseDetails.truncated ? "（已截断）" : ""}`
                          : databaseDetails?.action === "mutate"
                            ? `已修改数据库，影响 ${databaseDetails.resultCount ?? 0} 行`
                    : documentDetails
                      ? `已生成 ${documentDetails.format.toUpperCase()}：${documentDetails.path}`
                    : bashDetails?.status === "rejected"
                      ? "用户已拒绝，命令未执行"
                      : bashDetails
                        ? `退出码 ${bashDetails.exitCode ?? "无"}`
                        : mcpDetails
                          ? `${mcpDetails.serverLabel} · ${mcpDetails.externalToolName}`
                          : subAgentDetails
                            ? `已收到${subAgentDetails.agentLabel}的研究回传`
                          : undefined,
              completedAt,
              durationMs:
                bashDetails?.durationMs ??
                skillResourceDetails?.durationMs ??
                (toolStartedAt.has(event.toolCallId)
                  ? completedAt - toolStartedAt.get(event.toolCallId)!
                  : undefined),
              resultCount:
                searchDetails?.sources.length ?? workspaceDetails?.resultCount ?? databaseDetails?.resultCount ?? mcpDetails?.resultCount,
              mcpServerId: mcpDetails?.serverId,
              mcpServerLabel: mcpDetails?.serverLabel,
              externalToolName: mcpDetails?.externalToolName,
              subAgentId: event.toolName === "delegate_agent" ? delegatedAgentId : undefined,
              subAgentLabel: event.toolName === "delegate_agent" ? delegatedAgentLabel : undefined,
              subAgentModel: subAgentDetails
                ? `${subAgentDetails.model.providerId}:${subAgentDetails.model.modelId}`
                : undefined,
              commandId: bashDetails?.commandId ?? skillResourceDetails?.commandId,
              permissionMode: bashDetails?.permissionMode ?? skillResourceDetails?.permissionMode,
              commandStatus: bashDetails?.status ?? skillResourceDetails?.status,
              exitCode: bashDetails?.exitCode ?? skillResourceDetails?.exitCode,
              stdout: bashDetails?.stdout ?? skillResourceDetails?.stdout,
              stderr: bashDetails?.stderr ?? skillResourceDetails?.stderr,
              truncated: bashDetails?.truncated ?? skillResourceDetails?.truncated ?? databaseDetails?.truncated ?? mcpDetails?.truncated ?? subAgentDetails?.truncated,
              timedOut: bashDetails?.timedOut ?? skillResourceDetails?.timedOut,
              sources: searchDetails?.sources.map((source) => ({
                title: source.title,
                url: source.url,
                publishedDate: source.publishedDate,
              })),
            });
            toolStartedAt.delete(event.toolCallId);
            delegatedAgentIds.delete(event.toolCallId);
          }

          if (event.type === "tool_execution_update") {
            const bashDetails = getBashDetails(event.partialResult?.details);
            const skillResourceDetails = getSkillResourceDetails(event.partialResult?.details);
            const approval = bashDetails?.status === "pending_approval"
              ? { command: bashDetails.command, commandId: bashDetails.commandId, permissionMode: bashDetails.permissionMode }
              : skillResourceDetails?.status === "pending_approval" && skillResourceDetails.command && skillResourceDetails.commandId && skillResourceDetails.permissionMode
                ? { command: skillResourceDetails.command, commandId: skillResourceDetails.commandId, permissionMode: skillResourceDetails.permissionMode }
                : undefined;
            if (approval) {
              sendTool({
                type: "tool_approval_required",
                toolCallId: event.toolCallId,
                toolName: event.toolName,
                label: getToolLabel(event.toolName, labels),
                query: approval.command,
                commandId: approval.commandId,
                permissionMode: approval.permissionMode,
              });
            }
          }

        };
      };
      const forwardMainTools = createToolEventForwarder();
      agent.subscribe((event) => {
        mainTraceHandle.onEvent(event);
        forwardMainTools(event);
        if (
          event.type === "message_update" &&
          event.assistantMessageEvent.type === "text_delta"
        ) {
          send({ type: "delta", text: event.assistantMessageEvent.delta });
        }

        if (event.type === "message_end" && event.message.role === "assistant") {
          finalMessage = event.message;
        }
      });

      send({
        type: "start",
        requestId: traceId,
        traceId,
        traceStatus: traceAvailable ? "recording" : "unavailable",
      });

      request.signal.addEventListener("abort", abortRun, { once: true });
      if (request.signal.aborted) abortRun();
      if (traceAvailable && !abortRequested) {
        if (await traceSink.isAborted(traceId).catch(() => false)) abortRun();
        abortPoll = setInterval(() => {
          if (abortCheckPending || abortRequested) return;
          abortCheckPending = true;
          void traceSink.isAborted(traceId)
            .then((aborted) => {
              if (aborted) abortRun();
            })
            .catch(() => undefined)
            .finally(() => {
              abortCheckPending = false;
            });
        }, 250);
      }
      try {
        if (!abortRequested) await agent.prompt(input);
        const traceFinished = await traceRecorder.finish();
        send({ type: "trace_status", traceId, traceStatus: traceFinished ? "recorded" : "unavailable" });
        send({
          type: "done",
          durationMs: Date.now() - startedAt,
          usage: finalMessage
            ? {
                input: finalMessage.usage.input,
                output: finalMessage.usage.output,
                totalTokens: finalMessage.usage.totalTokens,
              }
            : undefined,
        });
      } catch (error) {
        const traceFinished = await traceRecorder.finish(error);
        send({ type: "trace_status", traceId, traceStatus: traceFinished ? "recorded" : "unavailable" });
        console.error("PI Agent request failed", error);
        send({ type: "error", message: safeErrorMessage(error) });
      } finally {
        request.signal.removeEventListener("abort", abortRun);
        if (abortPoll) clearInterval(abortPoll);
        abortPoll = undefined;
        createToolEventForwarder = undefined;
        if (!streamCancelled) {
          try {
            controller.close();
          } catch {
            streamCancelled = true;
          }
        }
      }
    },
    cancel() {
      abortRun();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
