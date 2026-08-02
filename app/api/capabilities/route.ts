import loadSkillSource from "../../../server/agent/tools/load-skill.ts?raw";
import webSearchSource from "../../../server/agent/tools/web-search.ts?raw";
import workspaceFilesSource from "../../../server/agent/tools/workspace-files.ts?raw";
import { AGENT_TOOL_NAMES } from "@/server/agent/capability-policy";
import { loadSkillRegistry } from "@/server/agent/skills/loader";

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
} as const;

export async function GET() {
  const registry = loadSkillRegistry();
  const skills = registry.list().map((metadata) => ({
    kind: "skill" as const,
    name: metadata.name,
    label: metadata.name,
    description: metadata.description,
    allowedTools: metadata.allowedTools,
    detail: registry.get(metadata.name)?.instructions ?? "",
    sourcePath: `.agents/skills/${metadata.name}/SKILL.md`,
    defaultEnabled: true,
  }));
  const tools = AGENT_TOOL_NAMES.map((name) => ({
    kind: "tool" as const,
    name,
    ...toolMetadata[name],
    detail: toolMetadata[name].code,
    defaultEnabled: true,
  }));

  return Response.json(
    { skills, tools },
    { headers: { "Cache-Control": "no-store" } },
  );
}
