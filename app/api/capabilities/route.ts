import loadSkillSource from "../../../server/agent/tools/load-skill.ts?raw";
import webSearchSource from "../../../server/agent/tools/web-search.ts?raw";
import workspaceFilesSource from "../../../server/agent/tools/workspace-files.ts?raw";
import bashSource from "../../../server/agent/tools/bash.ts?raw";
import { AGENT_TOOL_NAMES } from "@/server/agent/capability-policy";
import { publicAgentRoles } from "@/server/agent/agent-registry";
import { loadEffectiveSkillRegistry } from "@/server/agent/skills/loader";
import { MCP_SERVERS, type McpServerStatus, type McpToolDefinition } from "@/server/agent/mcp/registry";

type RuntimeMcpServer = {
  id: string;
  status: McpServerStatus;
  error?: string;
  tools: McpToolDefinition[];
};

async function loadRuntimeMcps() {
  const runtimeUrl = process.env.LOCAL_RUNTIME_URL;
  const runtimeToken = process.env.LOCAL_RUNTIME_TOKEN;
  if (!runtimeUrl || !runtimeToken) return new Map<string, RuntimeMcpServer>();
  try {
    const response = await fetch(`${runtimeUrl}/mcp/servers?connect=1`, {
      headers: { Authorization: `Bearer ${runtimeToken}` },
      cache: "no-store",
    });
    if (!response.ok) return new Map<string, RuntimeMcpServer>();
    const payload = (await response.json()) as { servers?: RuntimeMcpServer[] };
    return new Map((payload.servers ?? []).map((server) => [server.id, server]));
  } catch {
    return new Map<string, RuntimeMcpServer>();
  }
}

const toolMetadata = {
  load_skill: {
    label: "加载 Skill",
    description: "按需加载已启用 Skill 的完整执行流程，让 Agent 遵循专门的投研方法。",
    sourcePath: "server/agent/tools/load-skill.ts",
    code: loadSkillSource,
  },
  web_search: {
    label: "Tavily 网络搜索",
    description: "搜索最新网页、公告、新闻和金融资料，并把可核验来源返回给 Agent。",
    sourcePath: "server/agent/tools/web-search.ts",
    code: webSearchSource,
  },
  list_project_files: {
    label: "查看项目文件",
    description: "列出当前会话绑定项目中的目录和文件，帮助 Agent 定位已有资料。",
    sourcePath: "server/agent/tools/workspace-files.ts",
    code: workspaceFilesSource,
  },
  read_project_file: {
    label: "读取项目文件",
    description: "读取当前项目中的文本、Markdown 或代码文件，作为本轮任务上下文。",
    sourcePath: "server/agent/tools/workspace-files.ts",
    code: workspaceFilesSource,
  },
  write_project_file: {
    label: "保存项目产出",
    description: "把报告、研究框架和代码写入当前项目，默认建议保存到 outputs 目录。",
    sourcePath: "server/agent/tools/workspace-files.ts",
    code: workspaceFilesSource,
  },
  bash: {
    label: "执行 Bash",
    description: "在当前项目根目录运行脚本、测试、构建和 Git 命令，并显示结构化执行结果。",
    sourcePath: "server/agent/tools/bash.ts",
    code: bashSource,
  },
} as const;

export async function GET() {
  const runtimeMcps = await loadRuntimeMcps();
  const registry = await loadEffectiveSkillRegistry();
  const skills = registry.list().map((metadata) => ({
    kind: "skill" as const,
    id: metadata.id,
    origin: metadata.origin,
    name: metadata.name,
    label: metadata.name,
    description: metadata.description,
    detail: registry.get(metadata.name)?.instructions ?? "",
    resources: registry.get(metadata.name)?.resources ?? [],
    sourcePath: metadata.origin === "bundled" ? `.agents/skills/${metadata.name}/SKILL.md` : ".local-data/skills",
    defaultEnabled: true,
  }));
  const tools = AGENT_TOOL_NAMES.map((name) => ({
    kind: "tool" as const,
    name,
    ...toolMetadata[name],
    detail: toolMetadata[name].code,
    defaultEnabled: true,
  }));
  const mcps = MCP_SERVERS.map((server) => {
    const runtime = runtimeMcps.get(server.id);
    return {
      kind: "mcp" as const,
      name: server.id,
      label: server.label,
      description: server.description,
      detail: server.description,
      sourcePath: server.homepage,
      version: server.version,
      homepage: server.homepage,
      transport: server.transport,
      free: server.free,
      requiresApiKey: server.requiresApiKey,
      status: runtime?.status ?? "stopped",
      error: runtime ? runtime.error : "本机 Runtime 未启动，请使用 npm run dev 启动完整应用。",
      mcpTools: runtime?.tools ?? [],
      defaultEnabled: server.defaultEnabled,
    };
  });

  return Response.json(
    { skills, tools, mcps, agents: publicAgentRoles(skills.map((skill) => skill.name)) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
