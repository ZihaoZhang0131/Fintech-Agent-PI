export const BUNDLED_SKILL_NAMES = [
  "equity-research",
  "earnings-review",
  "policy-tracking",
] as const;

export const AGENT_TOOL_NAMES = [
  "load_skill",
  "web_search",
  "list_project_files",
  "read_project_file",
  "write_project_file",
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
}) {
  return {
    enabledSkills: selectKnownNames(input.enabledSkills, BUNDLED_SKILL_NAMES),
    enabledTools: selectKnownNames(input.enabledTools, AGENT_TOOL_NAMES),
  };
}
