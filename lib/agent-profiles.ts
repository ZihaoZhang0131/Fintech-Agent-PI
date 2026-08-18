/** The only built-in role is the main Agent. Sub Agents are user-created. */
export const AGENT_ROLE_IDS = ["main"] as const;

export type AgentRoleId = (typeof AGENT_ROLE_IDS)[number];

export type CustomSubAgentId = `custom-${string}`;
export type SubAgentId = CustomSubAgentId;

export type AgentModelOverride = {
  providerId: string;
  modelId: string;
};

export type AgentProfile = {
  enabled: boolean;
  /** Undefined means that this role follows the project's primary model. */
  model?: AgentModelOverride;
  enabledSkills: string[];
  enabledTools: string[];
  enabledMcps: string[];
};

export type CustomSubAgent = AgentProfile & {
  id: CustomSubAgentId;
  label: string;
  description: string;
};

export type ProjectAgentConfig = {
  mainModel?: AgentModelOverride;
  profiles: Record<AgentRoleId, AgentProfile>;
  customSubAgents: CustomSubAgent[];
};

const LEGACY_DEFAULT_MAIN_SKILL_NAMES = [
  "equity-research",
  "earnings-review",
  "policy-tracking",
] as const;

const AKSHARE_DEFAULT_MAIN_SKILL_NAMES = [
  ...LEGACY_DEFAULT_MAIN_SKILL_NAMES,
  "akshare-http-data",
] as const;

const VALUE_INVESTING_DEFAULT_MAIN_SKILL_NAMES = [
  ...AKSHARE_DEFAULT_MAIN_SKILL_NAMES,
  "a-share-value-investing",
] as const;

export const DEFAULT_MAIN_SKILL_NAMES = [
  ...VALUE_INVESTING_DEFAULT_MAIN_SKILL_NAMES,
  "akshare-china-macro",
  "akshare-us-macro",
  "akshare-euro-macro",
  "akshare-institutions-macro",
] as const;

const LEGACY_DEFAULT_MAIN_TOOL_NAMES = [
  "load_skill",
  "web_search",
  "list_project_files",
  "read_project_file",
  "write_project_file",
  "bash",
] as const;

const DATABASE_DEFAULT_MAIN_TOOL_NAMES = [
  "load_skill",
  "web_search",
  "list_project_files",
  "read_project_file",
  "write_project_file",
  "list_local_database_tables",
  "describe_local_database_table",
  "query_local_database",
  "mutate_local_database",
  "bash",
] as const;

export const DEFAULT_MAIN_TOOL_NAMES = [
  ...DATABASE_DEFAULT_MAIN_TOOL_NAMES,
  "generate_document",
] as const;

/** Add bundled tools only for projects that retained the prior complete default. */
export function upgradeLegacyDefaultToolSelection(names: readonly string[]) {
  const previousDefaults: readonly (readonly string[])[] = [
    LEGACY_DEFAULT_MAIN_TOOL_NAMES,
    DATABASE_DEFAULT_MAIN_TOOL_NAMES,
  ];
  const isPreviousCompleteDefault = previousDefaults.some(
    (defaults) => names.length === defaults.length && defaults.every((name) => names.includes(name)),
  );
  return isPreviousCompleteDefault ? [...DEFAULT_MAIN_TOOL_NAMES] : [...names];
}

/**
 * Existing projects saved the former complete built-in default. Add newly bundled
 * defaults only for that exact legacy selection, while preserving intentional
 * partial selections made by the user.
 */
export function upgradeLegacyDefaultSkillSelection(names: readonly string[]) {
  const previousDefaults: readonly (readonly string[])[] = [
    LEGACY_DEFAULT_MAIN_SKILL_NAMES,
    AKSHARE_DEFAULT_MAIN_SKILL_NAMES,
    VALUE_INVESTING_DEFAULT_MAIN_SKILL_NAMES,
  ];
  const isPreviousCompleteDefault = previousDefaults.some(
    (defaults) => names.length === defaults.length && defaults.every((name) => names.includes(name)),
  );
  return isPreviousCompleteDefault ? [...DEFAULT_MAIN_SKILL_NAMES] : [...names];
}

const DEFAULT_PROFILES: Record<AgentRoleId, AgentProfile> = {
  main: {
    enabled: true,
    enabledSkills: [...DEFAULT_MAIN_SKILL_NAMES],
    enabledTools: [...DEFAULT_MAIN_TOOL_NAMES],
    // New projects delegate structured market data instead of loading MCP tools into the parent.
    enabledMcps: [],
  },
};

function copyProfile(profile: AgentProfile): AgentProfile {
  return {
    enabled: profile.enabled,
    ...(profile.model ? { model: { ...profile.model } } : {}),
    enabledSkills: [...profile.enabledSkills],
    enabledTools: [...profile.enabledTools],
    enabledMcps: [...profile.enabledMcps],
  };
}

export function createDefaultProjectAgentConfig(): ProjectAgentConfig {
  return {
    profiles: Object.fromEntries(
      AGENT_ROLE_IDS.map((id) => [id, copyProfile(DEFAULT_PROFILES[id])]),
    ) as ProjectAgentConfig["profiles"],
    customSubAgents: [],
  };
}

/** Converts the former global main-agent preferences into a first project profile. */
export function createProjectAgentConfigFromLegacy(input: {
  model?: AgentModelOverride;
  enabledSkills?: string[];
  enabledTools?: string[];
  enabledMcps?: string[];
}): ProjectAgentConfig {
  const config = createDefaultProjectAgentConfig();
  const main = config.profiles.main;
  if (input.model) config.mainModel = { ...input.model };
  if (input.enabledSkills) main.enabledSkills = upgradeLegacyDefaultSkillSelection(input.enabledSkills);
  if (input.enabledTools) main.enabledTools = upgradeLegacyDefaultToolSelection(input.enabledTools);
  if (input.enabledMcps) main.enabledMcps = [...input.enabledMcps];
  return config;
}

export function cloneProjectAgentConfig(config: ProjectAgentConfig): ProjectAgentConfig {
  return {
    ...(config.mainModel ? { mainModel: { ...config.mainModel } } : {}),
    profiles: Object.fromEntries(
      AGENT_ROLE_IDS.map((id) => [id, copyProfile(config.profiles[id])]),
    ) as ProjectAgentConfig["profiles"],
    customSubAgents: (config.customSubAgents ?? []).map((agent) => ({
      ...copyProfile(agent),
      id: agent.id,
      label: agent.label,
      description: agent.description,
    })),
  };
}

export function createCustomSubAgent(input: {
  id: CustomSubAgentId;
  label: string;
  description: string;
}): CustomSubAgent {
  return {
    id: input.id,
    label: input.label,
    description: input.description,
    enabled: true,
    enabledSkills: [],
    enabledTools: [],
    enabledMcps: [],
  };
}
