import { Agent, type AgentMessage, type AgentTool } from "@earendil-works/pi-agent-core";
import { type AssistantMessage, type Usage } from "@earendil-works/pi-ai";
import { createConfiguredModels } from "@/server/model-registry";
import { parseModelReference, resolveRuntimeModel } from "@/server/model-runtime";
import { AGENT_ROLE_REGISTRY, isSubAgentRoleId, resolveGlobalAgentPrompts, resolveProjectAgentConfig } from "@/server/agent/agent-registry";
import type { AgentRoleId } from "@/lib/agent-profiles";
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

type InputMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequest = {
  conversationId?: string;
  workspaceId?: string;
  workspaceName?: string;
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

  return {
    role: "assistant",
    content: [{ type: "text", text: message.content }],
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
  return typeof agentId === "string" && isSubAgentRoleId(agentId) ? agentId : undefined;
}

function getToolLabel(
  toolName: string,
  labels?: Map<string, string>,
  delegatedAgentId?: Exclude<AgentRoleId, "main">,
) {
  if (toolName === "delegate_agent") {
    return delegatedAgentId
      ? `委派${AGENT_ROLE_REGISTRY[delegatedAgentId].label} Agent`
      : "委派 Agent";
  }
  if (labels?.has(toolName)) return labels.get(toolName)!;
  if (toolName === "web_search") return "Tavily 网络搜索";
  if (toolName === "load_skill") return "加载 Skill";
  if (toolName === "list_project_files") return "查看项目文件";
  if (toolName === "read_project_file") return "读取项目文件";
  if (toolName === "write_project_file") return "保存项目产出";
  if (toolName === "bash") return "执行 Bash";
  return toolName;
}

function getToolInput(args: unknown) {
  if (!args || typeof args !== "object") return undefined;
  if ("query" in args) return String(args.query);
  if ("name" in args) return String(args.name);
  if ("path" in args) return String(args.path);
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
  const bashApprovalMode: BashApprovalMode =
    payload.bashApprovalMode === "ask" ? "ask" : "auto";
  const bashPermissionMode: BashPermissionMode =
    payload.bashPermissionMode === "full" ? "full" : "sandbox";
  if (
    !input ||
    input.length > 20_000 ||
    !history.every(isInputMessage) ||
    !/^[a-f0-9-]{20,64}$/i.test(workspaceId)
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
  const connectedMcpServers = await discoverMcpServers(mainProfile.enabledMcps);
  const mcpTools = createMcpAgentTools(connectedMcpServers);
  const models = createConfiguredModels();
  const model = models.getModel(resolvedModel.piProviderId, resolvedModel.modelId);
  if (!model) {
    return Response.json({ message: "PI 中没有找到所选模型。" }, { status: 500 });
  }
  let emitChildBashApproval: ((value: {
    parentToolCallId: string;
    commandId: string;
    command: string;
    permissionMode: BashPermissionMode;
  }) => void) | undefined;

  async function runSubAgent(
    agentId: Exclude<AgentRoleId, "main">,
    task: string,
    parentSignal?: AbortSignal,
    parentToolCallId?: string,
  ) {
    const profile = agentConfig.profiles[agentId];
    if (!profile.enabled || !isSubAgentRoleId(agentId)) throw new Error("该专业 Agent 本轮未启用。");
    const reference = profile.model ?? modelReference;
    let childResolved;
    try {
      childResolved = await resolveRuntimeModel(reference);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "专业 Agent 模型不可用。");
    }
    const childModel = models.getModel(childResolved.piProviderId, childResolved.modelId);
    if (!childModel) throw new Error("PI 中没有找到专业 Agent 所选模型。");
    const childToolNames = new Set(profile.enabledTools);
    const childSkills = selectSkillRegistry(
      allSkills,
      childToolNames.has("load_skill") ? profile.enabledSkills : [],
    );
    const childWorkspaceTools = createWorkspaceTools(workspaceId).filter((tool) =>
      childToolNames.has(tool.name),
    );
    // MCP discovery is deliberately delayed until this specialized worker is actually invoked.
    const childMcps = await discoverMcpServers(profile.enabledMcps);
    const childSkillTracker = createLoadedSkillTracker();
    const childTools: AgentTool[] = [
      ...(childToolNames.has("load_skill") && childSkills.list().length > 0
        ? [
            createLoadSkillTool(childSkills, childSkillTracker),
            ...createSkillResourceTools(childSkills, childSkillTracker, workspaceId, {
              approvalMode: bashApprovalMode,
              permissionMode: bashPermissionMode,
            }).filter((tool) => tool.name !== "run_skill_script" || childToolNames.has("bash")),
          ]
        : []),
      ...(childToolNames.has("web_search")
        ? [createWebSearchTool({ apiKey: process.env.TAVILY_API_KEY })]
        : []),
      ...childWorkspaceTools,
      ...(childToolNames.has("bash")
        ? [createBashTool(workspaceId, { approvalMode: bashApprovalMode, permissionMode: bashPermissionMode })]
        : []),
      ...createMcpAgentTools(childMcps),
    ];
    const childPrompt = [
      agentPrompts[agentId],
      `当前项目名称：${JSON.stringify(workspaceName)}。`,
      "你是被主 Agent 委派的专业研究员，只能使用本角色已配置的能力，不能再次委派 Agent，也不能假设自己看过主 Agent 的聊天记录。",
      "用简洁 Markdown 返回：1. 摘要；2. 事实和来源/数据日期；3. 风险、限制或待验证项。",
      childMcps.length
        ? `本次可使用的 MCP：${childMcps.map((server) => server.label).join("、")}。`
        : "本次没有可用 MCP；不要声称调用过 MCP。",
      formatSkillCatalog(childSkills),
    ].join("\n\n");
    const child = new Agent({
      initialState: {
        systemPrompt: childPrompt,
        model: childModel,
        thinkingLevel: "off",
        tools: childTools,
        messages: [],
      },
      streamFn: models.streamSimple.bind(models),
      getApiKey: () => childResolved.apiKey,
      sessionId: `${payload.conversationId ?? "conversation"}:${agentId}:${crypto.randomUUID()}`,
    });
    let finalText = "";
    child.subscribe((event) => {
      if (event.type === "tool_execution_update" && parentToolCallId) {
        const bashDetails = getBashDetails(event.partialResult?.details);
        if (bashDetails?.status === "pending_approval") {
          emitChildBashApproval?.({
            parentToolCallId,
            commandId: bashDetails.commandId,
            command: bashDetails.command,
            permissionMode: bashDetails.permissionMode,
          });
        }
      }
      if (event.type === "message_end" && event.message.role === "assistant") {
        finalText = event.message.content
          .filter((item) => item.type === "text")
          .map((item) => item.text)
          .join("\n");
      }
    });
    const timeout = setTimeout(() => child.abort(), 60_000);
    const abort = () => child.abort();
    parentSignal?.addEventListener("abort", abort, { once: true });
    try {
      await child.prompt(task);
    } finally {
      clearTimeout(timeout);
      parentSignal?.removeEventListener("abort", abort);
    }
    if (!finalText) throw new Error("专业 Agent 未返回可用研究结果。");
    const limit = 12_000;
    return {
      text: finalText.length > limit ? `${finalText.slice(0, limit)}\n\n（子 Agent 回传已截断）` : finalText,
      model: { providerId: reference.providerId, modelId: reference.modelId },
      truncated: finalText.length > limit,
    };
  }

  const enabledSubAgents = (Object.keys(agentConfig.profiles) as AgentRoleId[])
    .filter((id): id is Exclude<AgentRoleId, "main"> => id !== "main" && agentConfig.profiles[id].enabled)
    .map((id) => ({ id, label: AGENT_ROLE_REGISTRY[id].label }));
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
    enabledToolNames.has("bash")
      ? `Bash 已启用，执行模式为 ${bashApprovalMode === "ask" ? "每条确认" : "自动执行"}，权限模式为 ${bashPermissionMode === "full" ? "完整本机权限" : "项目沙箱"}。只有任务确实需要运行脚本、测试、构建或命令行操作时才调用 bash。`
      : "本轮没有启用 Bash，不要声称执行过脚本、测试、构建或命令。",
    enabledSubAgents.length
      ? `已启用专业 Agent：${enabledSubAgents.map((agent) => agent.label).join("、")}。当需要其专门的结构化数据、网页证据或财务分析时，可调用 delegate_agent；收到回传后由你整合最终回答。`
      : "本轮没有启用专业 Agent，不要声称委派过子 Agent。",
    "只处理当前项目和用户任务相关的内容，不覆盖不相关文件。",
  ].join("\n");

  const agent = new Agent({
    initialState: {
      systemPrompt: `${agentPrompts.main}\n\n${projectCapabilityPrompt}\n\n${formatSkillCatalog(skillRegistry)}`,
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
  const toolStartedAt = new Map<string, number>();
  const delegatedAgentIds = new Map<string, Exclude<AgentRoleId, "main">>();
  let finalMessage: AssistantMessage | undefined;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (value: object) => controller.enqueue(encoder.encode(formatSse(value)));
      emitChildBashApproval = ({ parentToolCallId, commandId, command, permissionMode }) => {
        send({
          type: "tool_approval_required",
          toolCallId: parentToolCallId,
          toolName: "delegate_agent",
          label: getToolLabel("delegate_agent", toolLabels, delegatedAgentIds.get(parentToolCallId)),
          query: command,
          commandId,
          permissionMode,
        });
      };

      agent.subscribe((event) => {
        if (event.type === "tool_execution_start") {
          const toolStartTime = Date.now();
          const delegatedAgentId = getDelegatedAgentId(event.args);
          toolStartedAt.set(event.toolCallId, toolStartTime);
          if (event.toolName === "delegate_agent" && delegatedAgentId) {
            delegatedAgentIds.set(event.toolCallId, delegatedAgentId);
          }
          send({
            type: "tool_start",
            toolCallId: event.toolCallId,
            toolName: event.toolName,
            label: getToolLabel(event.toolName, toolLabels, delegatedAgentId),
            query: getToolInput(event.args),
            startedAt: toolStartTime,
          });
        }

        if (event.type === "tool_execution_end") {
          const completedAt = Date.now();
          const searchDetails = getWebSearchDetails(event.result?.details);
          const skillDetails = getLoadSkillDetails(event.result?.details);
          const skillResourceDetails = getSkillResourceDetails(event.result?.details);
          const workspaceDetails = getWorkspaceDetails(event.result?.details);
          const bashDetails = getBashDetails(event.result?.details);
          const mcpDetails = getMcpDetails(event.result?.details);
          const subAgentDetails = getSubAgentDetails(event.result?.details);
          const delegatedAgentId = subAgentDetails?.agentId ?? delegatedAgentIds.get(event.toolCallId);
          send({
            type: "tool_end",
            toolCallId: event.toolCallId,
            toolName: event.toolName,
            label: getToolLabel(event.toolName, toolLabels, delegatedAgentId),
            isError: event.isError,
            query:
              searchDetails?.query ??
              skillDetails?.name ??
              skillResourceDetails?.path ??
              workspaceDetails?.path ??
              bashDetails?.command ??
              mcpDetails?.summary ??
              subAgentDetails?.task,
            summary: skillDetails
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
              searchDetails?.sources.length ?? workspaceDetails?.resultCount ?? mcpDetails?.resultCount,
            mcpServerId: mcpDetails?.serverId,
            mcpServerLabel: mcpDetails?.serverLabel,
            externalToolName: mcpDetails?.externalToolName,
            subAgentId: subAgentDetails?.agentId,
            subAgentLabel: subAgentDetails?.agentLabel,
            subAgentModel: subAgentDetails
              ? `${subAgentDetails.model.providerId}:${subAgentDetails.model.modelId}`
              : undefined,
            commandId: bashDetails?.commandId ?? skillResourceDetails?.commandId,
            permissionMode: bashDetails?.permissionMode ?? skillResourceDetails?.permissionMode,
            commandStatus: bashDetails?.status ?? skillResourceDetails?.status,
            exitCode: bashDetails?.exitCode ?? skillResourceDetails?.exitCode,
            stdout: bashDetails?.stdout ?? skillResourceDetails?.stdout,
            stderr: bashDetails?.stderr ?? skillResourceDetails?.stderr,
            truncated: bashDetails?.truncated ?? skillResourceDetails?.truncated ?? mcpDetails?.truncated ?? subAgentDetails?.truncated,
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
            send({
              type: "tool_approval_required",
              toolCallId: event.toolCallId,
              toolName: event.toolName,
              label: getToolLabel(event.toolName, toolLabels),
              query: approval.command,
              commandId: approval.commandId,
              permissionMode: approval.permissionMode,
            });
          }
        }

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

      send({ type: "start", requestId: crypto.randomUUID() });

      try {
        await agent.prompt(input);
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
        console.error("PI Agent request failed", error);
        send({ type: "error", message: safeErrorMessage(error) });
      } finally {
        emitChildBashApproval = undefined;
        controller.close();
      }
    },
    cancel() {
      agent.abort();
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
