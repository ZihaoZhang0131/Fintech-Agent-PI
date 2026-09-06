import type { AgentTool } from "@earendil-works/pi-agent-core";
import type { AgentProfile } from "../../lib/agent-profiles.ts";
import { selectSkillRegistry, type SkillRegistry } from "./skills/registry.ts";
import {
  createLoadSkillTool,
  createLoadedSkillTracker,
} from "./tools/load-skill.ts";
import { createSkillResourceTools } from "./tools/skill-resources.ts";
import { createWebSearchTool } from "./tools/web-search.ts";
import { createWorkspaceTools } from "./tools/workspace-files.ts";
import { createLocalDatabaseTools } from "./tools/local-database.ts";
import { createDocumentTool } from "./tools/generate-document.ts";
import {
  createBashTool,
  type BashApprovalMode,
  type BashPermissionMode,
} from "./tools/bash.ts";
import { createMcpAgentTools, discoverMcpServers } from "./tools/mcp.ts";

export async function createProfileTools(options: {
  profile: AgentProfile;
  registry: SkillRegistry;
  workspaceId: string;
  approvalMode: BashApprovalMode;
  permissionMode: BashPermissionMode;
}) {
  const { profile, workspaceId, approvalMode, permissionMode } = options;
  const names = new Set(profile.enabledTools);
  const skills = selectSkillRegistry(
    options.registry,
    names.has("load_skill") ? profile.enabledSkills : [],
  );
  const mcps = await discoverMcpServers(profile.enabledMcps);
  const tracker = createLoadedSkillTracker();
  const tools: AgentTool[] = [
    ...(names.has("load_skill") && skills.list().length
      ? [
          createLoadSkillTool(skills, tracker),
          ...createSkillResourceTools(skills, tracker, workspaceId, {
            approvalMode,
            permissionMode,
          }).filter(
            (tool) => tool.name !== "run_skill_script" || names.has("bash"),
          ),
        ]
      : []),
    ...(names.has("web_search")
      ? [createWebSearchTool({ apiKey: process.env.TAVILY_API_KEY })]
      : []),
    ...createWorkspaceTools(workspaceId).filter((tool) => names.has(tool.name)),
    ...createLocalDatabaseTools().filter((tool) => names.has(tool.name)),
    ...(names.has("generate_document")
      ? [createDocumentTool(workspaceId)]
      : []),
    ...(names.has("bash")
      ? [createBashTool(workspaceId, { approvalMode, permissionMode })]
      : []),
    ...createMcpAgentTools(mcps),
  ];
  return { tools, skills, mcps };
}
