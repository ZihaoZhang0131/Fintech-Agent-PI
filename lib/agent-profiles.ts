export const AGENT_ROLE_IDS = ["main", "market-data", "web-evidence", "financial-analysis"] as const;

export type AgentRoleId = (typeof AGENT_ROLE_IDS)[number];

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

export type ProjectAgentConfig = {
  mainModel?: AgentModelOverride;
  profiles: Record<AgentRoleId, AgentProfile>;
};

const LEGACY_DEFAULT_MAIN_SKILL_NAMES = [
  "equity-research",
  "earnings-review",
  "policy-tracking",
] as const;

export const DEFAULT_MAIN_SKILL_NAMES = [
  ...LEGACY_DEFAULT_MAIN_SKILL_NAMES,
  "akshare-http-data",
] as const;

/**
 * Existing projects saved the former complete built-in default. Add newly bundled
 * defaults only for that exact legacy selection, while preserving intentional
 * partial selections made by the user.
 */
export function upgradeLegacyDefaultSkillSelection(names: readonly string[]) {
  const isLegacyDefault =
    names.length === LEGACY_DEFAULT_MAIN_SKILL_NAMES.length &&
    LEGACY_DEFAULT_MAIN_SKILL_NAMES.every((name) => names.includes(name));
  return isLegacyDefault ? [...DEFAULT_MAIN_SKILL_NAMES] : [...names];
}

const DEFAULT_PROFILES: Record<AgentRoleId, AgentProfile> = {
  main: {
    enabled: true,
    enabledSkills: [...DEFAULT_MAIN_SKILL_NAMES],
    enabledTools: [
      "load_skill",
      "web_search",
      "list_project_files",
      "read_project_file",
      "write_project_file",
      "bash",
    ],
    // New projects delegate structured market data instead of loading MCP tools into the parent.
    enabledMcps: [],
  },
  "market-data": {
    enabled: true,
    enabledSkills: [],
    enabledTools: [],
    enabledMcps: [],
  },
  "web-evidence": {
    enabled: true,
    enabledSkills: [],
    enabledTools: [],
    enabledMcps: [],
  },
  "financial-analysis": {
    enabled: true,
    enabledSkills: [],
    enabledTools: [],
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
  if (input.enabledTools) main.enabledTools = [...input.enabledTools];
  if (input.enabledMcps) main.enabledMcps = [...input.enabledMcps];
  return config;
}

export function cloneProjectAgentConfig(config: ProjectAgentConfig): ProjectAgentConfig {
  return {
    ...(config.mainModel ? { mainModel: { ...config.mainModel } } : {}),
    profiles: Object.fromEntries(
      AGENT_ROLE_IDS.map((id) => [id, copyProfile(config.profiles[id])]),
    ) as ProjectAgentConfig["profiles"],
  };
}
