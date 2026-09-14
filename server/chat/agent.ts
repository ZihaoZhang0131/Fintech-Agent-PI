import { DOCUMENT_CHART_GUIDANCE } from "../../server/document-charts.mjs";
import { createConfiguredAgent } from "../../server/agent/create-agent.ts";
import { createProfileTools } from "../../server/agent/profile-tools.ts";
import { AgentHarness, type Session, type AgentEvent, type AgentTool } from "@earendil-works/pi-agent-core";
import { type AssistantMessage, type Models } from "@earendil-works/pi-ai";
import { createConfiguredModels } from "../../server/model-registry.ts";
import { parseModelReference, resolveRuntimeModel } from "../../server/model-runtime.ts";
import { getConfiguredSubAgent, getConfiguredSubAgents, resolveGlobalAgentPrompts, resolveProjectAgentConfig } from "../../server/agent/agent-registry.ts";
import type { SubAgentId } from "../../lib/agent-profiles.ts";
import { formatSkillCatalog } from "../../server/agent/skills/catalog.ts";
import { selectSkillRegistry } from "../agent/skills/registry.ts";
import { loadChatSkills } from "./skills.ts";
import { createLoadSkillTool, createLoadedSkillTracker, type LoadSkillDetails } from "../../server/agent/tools/load-skill.ts";
import { createSkillResourceTools, type SkillResourceDetails } from "../../server/agent/tools/skill-resources.ts";
import {
  createBashTool,
  type BashApprovalMode,
  type BashPermissionMode,
  type BashToolDetails,
} from "../../server/agent/tools/bash.ts";
import { createWebSearchTool, type WebSearchDetails } from "../../server/agent/tools/web-search.ts";
import {
  createMcpAgentTools,
  discoverMcpServers,
  type McpToolDetails,
} from "../../server/agent/tools/mcp.ts";
import { createDelegateAgentTool, type SubAgentDetails } from "../../server/agent/tools/delegate-agent.ts";
import {
  createWorkspaceTools,
  type WorkspaceToolDetails,
} from "../../server/agent/tools/workspace-files.ts";
import { createLocalDatabaseTools, type LocalDatabaseToolDetails } from "../../server/agent/tools/local-database.ts";
import { createDocumentTool, type DocumentToolDetails } from "../../server/agent/tools/generate-document.ts";
import { createKamiArtifactTool } from "../../server/agent/tools/render-kami-artifact.ts";
import { TraceRecorder } from "../../server/agent/trace/trace-recorder.ts";
import { traceSha256 } from "../../server/trace-redaction.mjs";

const SUB_AGENT_TIMEOUT_MS = 300_000;

export type ChatRequest = {
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
  input?: string;
};


function safeErrorMessage(error: unknown) {
  const raw = error instanceof Error ? error.message : "unknown error";
  if (/上下文/.test(raw)) return "上下文整理失败，原始记录已保留。请缩小输入或切换更大窗口模型后重试。";
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


import type { TraceSink } from "../agent/trace/trace-sink.ts";

export async function prepareChatAgent(payload: ChatRequest, options: { session: Session; models?: Models; traceSink: TraceSink; send: (value: Record<string, unknown>) => void; extraTools?: AgentTool[]; signal?: AbortSignal }) {
  const input = payload.input?.trim() ?? "";
  const history = (await options.session.buildContext()).messages;
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
    !/^[a-f0-9-]{20,64}$/i.test(workspaceId) ||
    (payload.traceId !== undefined && !/^[a-f0-9-]{20,64}$/i.test(requestedTraceId))
  ) {
    throw new Error("问题为空、过长或历史消息格式不正确。");
  }

  const allSkills = await loadChatSkills();
  const allSkillNames = allSkills.list().map((skill) => skill.name);
  const agentConfig = resolveProjectAgentConfig(payload.agentConfig, {
    enabledSkills: payload.enabledSkills,
    enabledTools: payload.enabledTools,
    enabledMcps: payload.enabledMcps,
  }, allSkillNames);
  const agentPrompts = resolveGlobalAgentPrompts(payload.agentPrompts);
  const requestedModelReference = parseModelReference(payload.model);
  if (!agentConfig.mainModel && !requestedModelReference) {
    throw new Error("请选择一个可用模型。");
  }
  const modelReference = agentConfig.mainModel ?? requestedModelReference!;
  let resolvedModel;
  try {
    resolvedModel = await resolveRuntimeModel(modelReference, { signal: options.signal });
  } catch (error) {
    throw error;
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
  const kamiTools = enabledToolNames.has("render_kami_artifact") ? [createKamiArtifactTool(workspaceId)] : [];
  const connectedMcpServers = await discoverMcpServers(mainProfile.enabledMcps, options.signal);
  options.signal?.throwIfAborted();
  const mcpTools = createMcpAgentTools(connectedMcpServers);
  const models = options.models ?? createConfiguredModels();
  const model = models.getModel(resolvedModel.piProviderId, resolvedModel.modelId);
  if (!model) {
    throw new Error("PI 中没有找到所选模型。");
  }

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
        childResolved = await resolveRuntimeModel(reference, { signal: parentSignal });
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
      const timeout = setTimeout(() => { childTimedOut = true; child.abort(); }, SUB_AGENT_TIMEOUT_MS);
      const abort = () => child.abort();
      parentSignal?.addEventListener("abort", abort, { once: true });
      try {
        parentSignal?.throwIfAborted();
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
  for (const message of (await options.session.buildContext()).messages) {
    if (message.role !== "toolResult" || message.toolName !== "load_skill" || message.isError) continue;
    const details = getLoadSkillDetails(message.details);
    const current = details && skillRegistry.get(details.name);
    if (current && message.content.some(c => c.type === "text" && c.text.includes(current.instructions))) skillTracker.add(current.name);
  }
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
    ...kamiTools,
    ...(enabledToolNames.has("bash")
      ? [createBashTool(workspaceId, { approvalMode: bashApprovalMode, permissionMode: bashPermissionMode })]
      : []),
    ...mcpTools,
    ...(delegateAgentTool ? [delegateAgentTool] : []),
  ];
  agentTools.push(...(options.extraTools ?? []));
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
    enabledToolNames.has("render_kami_artifact")
      ? "只有用户要求完整报告、正式文件、演示文稿或落地页的视觉版时，先加载 kami Skill，再调用 render_kami_artifact。普通问答不调用。Kami 不得改写已确认的数据、来源、数字、观点或风险；不得通过 Bash、Python、Skill 脚本或原始 MCP 绕过该工具。"
      : "本轮没有启用 Kami 视觉产物能力，不要声称已生成 Kami HTML/PDF。",
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
    "输出约束：不要在调用工具前后用普通正文播报工作计划或常规进度，不要输出‘我先’、‘接下来’、‘现在开始’类过程旁白；需要工具时直接调用。只有任务完成后的最终答复，或确实需要用户补充、确认或授权且本轮无法继续时，才输出面向用户的正文；不要输出内部推理过程。",
    "历史委派优先依据已保存的 delegate_agent 原始调用和工具结果；旧会话导入的历史委派记录只代表当时界面保存的名称、agentId、任务和状态，不等于完整执行证据。",
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


  const agent = new AgentHarness({ session: options.session, models, model, thinkingLevel: "off", systemPrompt: finalSystemPrompt, tools: agentTools });
  const startedAt = Date.now();
  const traceId = requestedTraceId || crypto.randomUUID();
  let finalMessage: AssistantMessage | undefined;
  const send = options.send;
      const traceRecorder = new TraceRecorder({
        id: traceId,
        sink: options.traceSink,
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
      await traceRecorder.start();
      const mainTraceHandle = traceRecorder.attachAgent({
        scopeKey: "main",
        agentId: "main",
        agentLabel: "主 Agent",
        modelProvider: resolvedModel.piProviderId,
        modelId: resolvedModel.modelId,
        isRoot: true,
      });
      const createToolEventForwarder = (parentToolCallId?: string, labels = toolLabels) => {
        const toolStartedAt = new Map<string, number>();
        const delegatedAgentIds = new Map<string, string>();
        const sendTool = (value: object) => send({ ...value, parentToolCallId });
        return (event: AgentEvent) => {
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
      let activeAssistantItemId: string | undefined;
      agent.subscribe((event) => {
        if (event.type === "message_start" && event.message.role === "assistant") {
          activeAssistantItemId = crypto.randomUUID();
          send({ type: "message_start", itemId: activeAssistantItemId });
        }
        if (["agent_start", "agent_end", "turn_start", "turn_end", "message_start", "message_update", "message_end", "tool_execution_start", "tool_execution_update", "tool_execution_end"].includes(event.type)) {
          mainTraceHandle.onEvent(event as AgentEvent);
          forwardMainTools(event as AgentEvent);
        }
        if (
          event.type === "message_update" &&
          event.assistantMessageEvent.type === "text_delta"
        ) {
          send({ type: "delta", itemId: activeAssistantItemId, text: event.assistantMessageEvent.delta });
        }

        if (event.type === "message_end" && event.message.role === "assistant") {
          send({ type: "message_end", itemId: activeAssistantItemId, stopReason: event.message.stopReason });
          finalMessage = event.message;
          activeAssistantItemId = undefined;
        }
      });

  return { agent, model, models, systemPrompt: finalSystemPrompt, tools: agentTools,
    async finish(error?: unknown) {
      const recorded = await traceRecorder!.finish(error);
      send({ type: "trace_status", traceId, traceStatus: recorded ? "recorded" : "unavailable" });
    },
    async run(text: string, signal: AbortSignal) {
    const abort = () => { traceRecorder?.markAborted(); void agent.abort(); };
    signal.addEventListener("abort", abort, { once: true });
    try {
      if (signal.aborted) throw new Error("聊天已停止");
      const result = await agent.prompt(text);
      if (result.stopReason === "error") throw new Error(result.errorMessage || "模型调用失败");
      return finalMessage ?? result;
    } catch (error) {
      throw new Error(signal.aborted ? "聊天已停止" : safeErrorMessage(error));
    } finally { signal.removeEventListener("abort", abort); }
  } };
}
