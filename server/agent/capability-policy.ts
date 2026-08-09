import { MCP_SERVER_IDS } from "./mcp/registry.ts";

export const BUNDLED_SKILL_NAMES = [
  "equity-research",
  "earnings-review",
  "policy-tracking",
  "akshare-http-data",
] as const;

export const AGENT_TOOL_NAMES = [
  "load_skill",
  "web_search",
  "list_project_files",
  "read_project_file",
  "write_project_file",
  "bash",
] as const;

export type BundledSkillName = (typeof BUNDLED_SKILL_NAMES)[number];
export type AgentToolName = (typeof AGENT_TOOL_NAMES)[number];

function selectKnownNames<T extends string>(requested: unknown, known: readonly T[]) {
  if (requested === undefined) return [...known];
  if (!Array.isArray(requested)) return [];
  const requestedNames = new Set(requested.filter((name): name is string => typeof name === "string"));
  return known.filter((name) => requestedNames.has(name));
}

export function resolveCapabilitySelection(input: {
  enabledSkills?: unknown;
  enabledTools?: unknown;
  enabledMcps?: unknown;
}) {
  return {
    enabledSkills: selectKnownNames(input.enabledSkills, BUNDLED_SKILL_NAMES),
    enabledTools: selectKnownNames(input.enabledTools, AGENT_TOOL_NAMES),
    enabledMcps: selectKnownNames(input.enabledMcps, MCP_SERVER_IDS),
  };
}
