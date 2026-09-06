/** The only built-in role is the main Agent. Sub Agents are editable project configuration. */
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
  starterAgentsVersion?: number;
  starterAgentsSkipped?: string[];
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

/** Parsing and server fallback must never seed specialist permissions. */
export function createEmptyProjectAgentConfig(): ProjectAgentConfig {
  return {
    profiles: Object.fromEntries(
      AGENT_ROLE_IDS.map((id) => [id, copyProfile(DEFAULT_PROFILES[id])]),
    ) as ProjectAgentConfig["profiles"],
    customSubAgents: [],
  };
}

export const MAX_CUSTOM_SUB_AGENTS = 12;
const STARTER_VERSION = 1;
const readFiles = ["list_project_files", "read_project_file"];
const readDatabase = ["list_local_database_tables", "describe_local_database_table", "query_local_database"];
const starterRoles = [
  {
    label: "研报Agent",
    description: "负责公司、财报、政策与价值投资研究，分析商业模式、竞争格局、估值和风险。以可核验证据支撑结论，标注来源、日期与口径；缺少资料时明确报告缺口，不编造事实。",
    enabledSkills: ["equity-research", "earnings-review", "policy-tracking", "a-share-value-investing"],
    enabledTools: ["load_skill", "web_search", ...readFiles, ...readDatabase],
  },
  {
    label: "数据Agent",
    description: "负责获取、清洗、核验和保存真实数据。使用 AKShare Skills 查询数据，核对来源、时间、单位与统计口径，按任务保存到项目文件或数据库；写入前核验已有状态，缺少数据或服务不可用时报告缺口，不编造数据。",
    enabledSkills: ["akshare-http-data", "akshare-china-macro", "akshare-us-macro", "akshare-euro-macro", "akshare-institutions-macro"],
    enabledTools: ["load_skill", "bash", ...readFiles, "write_project_file", ...readDatabase, "mutate_local_database"],
  },
  {
    label: "写作Agent",
    description: "负责根据已有研究和数据组织、润色与交付报告。读取项目资料及数据库，保留来源、指标口径、事实与判断的区别及不确定性；按用户要求写入文件或生成 Word/PDF，缺少依据时指出缺口，不补造事实。",
    enabledSkills: [],
    enabledTools: [...readFiles, "write_project_file", ...readDatabase, "generate_document"],
  },
];

/** Runs once on browser onboarding; manual invocation only adds missing names. */
export function supplementDefaultAgents(config: ProjectAgentConfig, manual = false): ProjectAgentConfig {
  if (!manual && (config.starterAgentsVersion ?? 0) >= STARTER_VERSION) return config;
  const next = cloneProjectAgentConfig(config);
  const normalize = (name: string) => name.replace(/\s/g, "");
  const names = new Set(next.customSubAgents.map(agent => normalize(agent.label)));
  const skipped: string[] = [];
  for (const role of starterRoles) {
    if (names.has(normalize(role.label))) continue;
    if (next.customSubAgents.length >= MAX_CUSTOM_SUB_AGENTS) {
      skipped.push(role.label);
      continue;
    }
    next.customSubAgents.push({
      ...role, id: `custom-${globalThis.crypto.randomUUID()}`, enabled: true,
      enabledSkills: [...role.enabledSkills], enabledTools: [...role.enabledTools], enabledMcps: [],
    });
    names.add(normalize(role.label));
  }
  next.starterAgentsVersion = Math.max(STARTER_VERSION, next.starterAgentsVersion ?? 0);
  next.starterAgentsSkipped = skipped;
  return next;
}

export function createDefaultProjectAgentConfig(): ProjectAgentConfig {
  return supplementDefaultAgents(createEmptyProjectAgentConfig());
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
    ...(config.starterAgentsVersion !== undefined ? { starterAgentsVersion: config.starterAgentsVersion } : {}),
    ...(config.starterAgentsSkipped ? { starterAgentsSkipped: [...config.starterAgentsSkipped] } : {}),
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
