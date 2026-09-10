import { readFile } from "node:fs/promises";
import { createSkillStore } from "../skill-store.mjs";
import { BUNDLED_SKILL_NAMES } from "../agent/capability-policy.ts";
import { parseSkill } from "../agent/skills/parser.ts";
import { registryFromSkills, type LocalSkillState } from "../agent/skills/registry.ts";
import path from "node:path";

export async function loadChatSkills() {
  const state = await createSkillStore(process.env.PI_LOCAL_DATA_DIR ?? path.join(process.cwd(), ".local-data")).list() as LocalSkillState;
  const sources = await Promise.all(BUNDLED_SKILL_NAMES.map(name => readFile(new URL(`../../.agents/skills/${name}/SKILL.md`, import.meta.url), "utf8")));
  const overrides = new Map(state.entries.map(s => [s.id, s]));
  return registryFromSkills(sources.map(parseSkill).filter(s => !state.deletedBundledNames.includes(s.name))
    .map(s => ({ ...s, ...overrides.get(s.id) })).concat(state.entries.filter(s => s.origin === "custom"))
    .map(s => ({ ...s, resources: state.resourceFilesByName[s.name] ?? [] })));
}
