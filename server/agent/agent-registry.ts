import {
  AGENT_ROLE_IDS,
  createDefaultProjectAgentConfig,
  upgradeLegacyDefaultSkillSelection,
  upgradeLegacyDefaultToolSelection,
  type AgentModelOverride,
  type AgentProfile,
  type AgentRoleId,
  type CustomSubAgent,
  type ProjectAgentConfig,
  type SubAgentId,
} from "@/lib/agent-profiles";
import { createDefaultAgentPromptConfig, type AgentPromptConfig } from "@/lib/agent-prompts";
import { AGENT_TOOL_NAMES, BUNDLED_SKILL_NAMES } from "./capability-policy";
import { MCP_SERVER_IDS } from "./mcp/registry";

export type AgentRoleDefinition = {
  id: string;
  label: string;
  description: string;
  maxSkills: readonly string[];
  maxTools: readonly string[];
  maxMcps: readonly string[];
};

export type ConfiguredSubAgent = {
  id: SubAgentId;
  label: string;
  description: string;
  profile: AgentProfile;
};

const MAX_CUSTOM_SUB_AGENTS = 12;
const CUSTOM_SUB_AGENT_ID = /^custom-[a-z0-9-]{8,80}$/;

export const AGENT_ROLE_REGISTRY: Record<AgentRoleId, AgentRoleDefinition> = {
  main: {
    id: "main",
    label: "主 Agent",
    description: "负责理解任务、选择专业研究员并整合最终回答。",
    maxSkills: BUNDLED_SKILL_NAMES,
    maxTools: AGENT_TOOL_NAMES,
    maxMcps: MCP_SERVER_IDS,
  },
};

function selectKnownNames(requested: unknown, allowed: readonly string[], fallback: string[]) {
  if (requested === undefined) return fallback.filter((name) => allowed.includes(name));
  if (!Array.isArray(requested)) return [];
  const requestedNames = new Set(requested.filter((value): value is string => typeof value === "string"));
  return allowed.filter((name) => requestedNames.has(name));
}

function parseModelOverride(value: unknown): AgentModelOverride | undefined {
  if (!value || typeof value !== "object") return undefined;
  const candidate = value as Partial<AgentModelOverride>;
  if (
    typeof candidate.providerId !== "string" ||
    !/^[a-z0-9-]{2,40}$/.test(candidate.providerId) ||
    typeof candidate.modelId !== "string" ||
    !/^[a-zA-Z0-9._-]{2,100}$/.test(candidate.modelId)
  ) {
    return undefined;
  }
  return { providerId: candidate.providerId, modelId: candidate.modelId };
}

function resolveSystemPrompt(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;
  const prompt = value.trim();
  return prompt.length > 0 && prompt.length <= 12_000 ? prompt : fallback;
}

function resolveProfile(
  role: AgentRoleDefinition,
  requested: unknown,
  fallback: AgentProfile,
  skillNames: readonly string[],
): AgentProfile {
  const candidate = requested && typeof requested === "object"
    ? (requested as Partial<AgentProfile>)
    : {};
  return {
    enabled: role.id === "main" ? true : candidate.enabled === undefined ? fallback.enabled : candidate.enabled === true,
    ...(parseModelOverride(candidate.model) ? { model: parseModelOverride(candidate.model) } : {}),
    enabledSkills: selectKnownNames(
      role.id === "main" && Array.isArray(candidate.enabledSkills)
        ? upgradeLegacyDefaultSkillSelection(candidate.enabledSkills.filter((value): value is string => typeof value === "string"))
        : candidate.enabledSkills,
      skillNames,
      fallback.enabledSkills,
    ),
    enabledTools: selectKnownNames(
      role.id === "main" && Array.isArray(candidate.enabledTools)
        ? upgradeLegacyDefaultToolSelection(candidate.enabledTools.filter((value): value is string => typeof value === "string"))
        : candidate.enabledTools,
      role.maxTools,
      fallback.enabledTools,
    ),
    enabledMcps: selectKnownNames(candidate.enabledMcps, role.maxMcps, fallback.enabledMcps),
  };
}

function resolveCustomSubAgents(input: unknown, skillNames: readonly string[]): CustomSubAgent[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  return input.flatMap((value) => {
    if (seen.size >= MAX_CUSTOM_SUB_AGENTS || !value || typeof value !== "object") return [];
    const candidate = value as Partial<CustomSubAgent>;
    const id = typeof candidate.id === "string" ? candidate.id : "";
    const label = typeof candidate.label === "string" ? candidate.label.trim() : "";
    const description = typeof candidate.description === "string" ? candidate.description.trim() : "";
    if (!CUSTOM_SUB_AGENT_ID.test(id) || seen.has(id) || !label || label.length > 60 || description.length > 280) return [];
    seen.add(id);
    const profile = resolveProfile(
      { id: "custom", label, description, maxSkills: skillNames, maxTools: AGENT_TOOL_NAMES, maxMcps: MCP_SERVER_IDS },
      candidate,
      { enabled: true, enabledSkills: [], enabledTools: [], enabledMcps: [] },
      skillNames,
    );
    return [{ id: id as CustomSubAgent["id"], label, description, ...profile }];
  });
}

export function resolveGlobalAgentPrompts(input: unknown): AgentPromptConfig {
  const defaults = createDefaultAgentPromptConfig();
  const candidate = input && typeof input === "object"
    ? input as Partial<Record<AgentRoleId, unknown>>
    : {};
  return Object.fromEntries(
    AGENT_ROLE_IDS.map((id) => [id, resolveSystemPrompt(candidate[id], defaults[id])]),
  ) as AgentPromptConfig;
}

export function resolveProjectAgentConfig(input: unknown, legacy?: {
  enabledSkills?: unknown;
  enabledTools?: unknown;
  enabledMcps?: unknown;
}, skillNames: readonly string[] = BUNDLED_SKILL_NAMES): ProjectAgentConfig {
  const defaults = createDefaultProjectAgentConfig();
  const candidate = input && typeof input === "object" ? input as Partial<ProjectAgentConfig> : {};
  const requestedProfiles = candidate.profiles && typeof candidate.profiles === "object"
    ? candidate.profiles as Partial<Record<AgentRoleId, unknown>>
    : {};
  const fallbackMain: AgentProfile = {
    ...defaults.profiles.main,
    enabledSkills: legacy?.enabledSkills === undefined
      ? defaults.profiles.main.enabledSkills
      : selectKnownNames(
          Array.isArray(legacy.enabledSkills)
            ? upgradeLegacyDefaultSkillSelection(legacy.enabledSkills.filter((value): value is string => typeof value === "string"))
            : legacy.enabledSkills,
          skillNames,
          [],
        ),
    enabledTools: legacy?.enabledTools === undefined
      ? defaults.profiles.main.enabledTools
      : selectKnownNames(
          Array.isArray(legacy.enabledTools)
            ? upgradeLegacyDefaultToolSelection(legacy.enabledTools.filter((value): value is string => typeof value === "string"))
            : legacy.enabledTools,
          AGENT_ROLE_REGISTRY.main.maxTools,
          [],
        ),
    enabledMcps: legacy?.enabledMcps === undefined
      ? defaults.profiles.main.enabledMcps
      : selectKnownNames(legacy.enabledMcps, AGENT_ROLE_REGISTRY.main.maxMcps, []),
  };
  const profiles = Object.fromEntries(
    AGENT_ROLE_IDS.map((id) => [
      id,
      resolveProfile(
        AGENT_ROLE_REGISTRY[id],
        requestedProfiles[id],
        id === "main" ? fallbackMain : defaults.profiles[id],
        skillNames,
      ),
    ]),
  ) as ProjectAgentConfig["profiles"];
  const mainModel = parseModelOverride(candidate.mainModel);
  return {
    ...(mainModel ? { mainModel } : {}),
    profiles,
    customSubAgents: resolveCustomSubAgents(candidate.customSubAgents, skillNames),
  };
}

export function getConfiguredSubAgents(config: ProjectAgentConfig): ConfiguredSubAgent[] {
  return config.customSubAgents.map((agent) => ({
    id: agent.id,
    label: agent.label,
    description: agent.description,
    profile: agent,
  }));
}

export function getConfiguredSubAgent(config: ProjectAgentConfig, id: string) {
  return getConfiguredSubAgents(config).find((agent) => agent.id === id);
}

export function publicAgentRoles(skillNames: readonly string[] = BUNDLED_SKILL_NAMES) {
  const defaults = createDefaultProjectAgentConfig();
  return AGENT_ROLE_IDS.map((id) => {
    const role = AGENT_ROLE_REGISTRY[id];
    return {
      id,
      label: role.label,
      description: role.description,
      maxSkills: [...skillNames],
      maxTools: [...role.maxTools],
      maxMcps: [...role.maxMcps],
      defaultProfile: defaults.profiles[id],
      isMain: id === "main",
    };
  });
}
