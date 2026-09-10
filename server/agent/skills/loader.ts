import earningsReviewSource from "../../../.agents/skills/earnings-review/SKILL.md?raw";
import equityResearchSource from "../../../.agents/skills/equity-research/SKILL.md?raw";
import policyTrackingSource from "../../../.agents/skills/policy-tracking/SKILL.md?raw";
import akshareHttpDataSource from "../../../.agents/skills/akshare-http-data/SKILL.md?raw";
import aShareValueInvestingSource from "../../../.agents/skills/a-share-value-investing/SKILL.md?raw";
import akshareChinaMacroSource from "../../../.agents/skills/akshare-china-macro/SKILL.md?raw";
import akshareUsMacroSource from "../../../.agents/skills/akshare-us-macro/SKILL.md?raw";
import akshareEuroMacroSource from "../../../.agents/skills/akshare-euro-macro/SKILL.md?raw";
import akshareInstitutionsMacroSource from "../../../.agents/skills/akshare-institutions-macro/SKILL.md?raw";
import kamiSource from "../../../.agents/skills/kami/SKILL.md?raw";
import { parseSkill } from "./parser";
import { loadLocalSkillState } from "./local";

const BUNDLED_SKILL_SOURCES = [
  equityResearchSource,
  earningsReviewSource,
  policyTrackingSource,
  akshareHttpDataSource,
  aShareValueInvestingSource,
  akshareChinaMacroSource,
  akshareUsMacroSource,
  akshareEuroMacroSource,
  akshareInstitutionsMacroSource,
  kamiSource,
] as const;

export type { SkillRegistry, LocalSkillState } from "./registry.ts";
export { selectSkillRegistry } from "./registry.ts";
import type { SkillRegistry, LocalSkillState } from "./registry.ts";

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
    .filter((skill) => !enabled || enabled.has(skill.name))
    .map((skill) => ({ ...skill, resources: localState?.resourceFilesByName?.[skill.name] ?? skill.resources }));
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
