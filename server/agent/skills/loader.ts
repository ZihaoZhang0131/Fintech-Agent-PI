import earningsReviewSource from "../../../.agents/skills/earnings-review/SKILL.md?raw";
import equityResearchSource from "../../../.agents/skills/equity-research/SKILL.md?raw";
import policyTrackingSource from "../../../.agents/skills/policy-tracking/SKILL.md?raw";
import { parseSkill, type SkillDefinition, type SkillMetadata } from "./parser";
import { loadLocalSkillState } from "./local";

const BUNDLED_SKILL_SOURCES = [
  equityResearchSource,
  earningsReviewSource,
  policyTrackingSource,
] as const;

export type SkillRegistry = {
  list(): SkillMetadata[];
  get(name: string): SkillDefinition | undefined;
};

export type LocalSkillState = {
  entries: Array<SkillDefinition & { baseName?: string }>;
  deletedBundledNames: string[];
};

export function loadSkillRegistry(
  enabledNames?: Iterable<string>,
  localState?: LocalSkillState,
): SkillRegistry {
  const enabled = enabledNames ? new Set(enabledNames) : null;
  const bundled = BUNDLED_SKILL_SOURCES.map(parseSkill);
  const deleted = new Set(localState?.deletedBundledNames ?? []);
  const overrides = new Map((localState?.entries ?? []).map((skill) => [skill.id, skill]));
  const skills = bundled
    .filter((skill) => !deleted.has(skill.name))
    .map((skill) => overrides.get(skill.id) ?? skill)
    .concat((localState?.entries ?? []).filter((skill) => skill.origin === "custom"))
    .filter(
    (skill) => !enabled || enabled.has(skill.name),
  );
  const byName = new Map(skills.map((skill) => [skill.name, skill]));
  if (byName.size !== skills.length) throw new Error("Duplicate Skill names are not allowed");

  return {
    list: () =>
      skills.map(({ id, origin, name, description }) => ({
        id,
        origin,
        name,
        description,
      })),
    get: (name) => byName.get(name),
  };
}

export async function loadEffectiveSkillRegistry(enabledNames?: Iterable<string>): Promise<SkillRegistry> {
  return loadSkillRegistry(enabledNames, await loadLocalSkillState());
}

export function selectSkillRegistry(registry: SkillRegistry, enabledNames?: Iterable<string>): SkillRegistry {
  const enabled = enabledNames ? new Set(enabledNames) : null;
  const skills = registry.list()
    .filter((skill) => !enabled || enabled.has(skill.name))
    .flatMap((metadata) => {
      const definition = registry.get(metadata.name);
      return definition ? [definition] : [];
    });
  const byName = new Map(skills.map((skill) => [skill.name, skill]));
  return {
    list: () => skills.map(({ id, origin, name, description }) => ({ id, origin, name, description })),
    get: (name) => byName.get(name),
  };
}
