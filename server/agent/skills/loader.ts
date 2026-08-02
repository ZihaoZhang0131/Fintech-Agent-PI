import earningsReviewSource from "../../../.agents/skills/earnings-review/SKILL.md?raw";
import equityResearchSource from "../../../.agents/skills/equity-research/SKILL.md?raw";
import policyTrackingSource from "../../../.agents/skills/policy-tracking/SKILL.md?raw";
import { parseSkill, type SkillDefinition, type SkillMetadata } from "./parser";

const BUNDLED_SKILL_SOURCES = [
  equityResearchSource,
  earningsReviewSource,
  policyTrackingSource,
] as const;

export type SkillRegistry = {
  list(): SkillMetadata[];
  get(name: string): SkillDefinition | undefined;
};

export function loadSkillRegistry(enabledNames?: Iterable<string>): SkillRegistry {
  const enabled = enabledNames ? new Set(enabledNames) : null;
  const skills = BUNDLED_SKILL_SOURCES.map(parseSkill).filter(
    (skill) => !enabled || enabled.has(skill.name),
  );
  const byName = new Map(skills.map((skill) => [skill.name, skill]));
  if (byName.size !== skills.length) throw new Error("Duplicate Skill names are not allowed");

  return {
    list: () =>
      skills.map(({ name, description, allowedTools }) => ({
        name,
        description,
        allowedTools: [...allowedTools],
      })),
    get: (name) => byName.get(name),
  };
}
