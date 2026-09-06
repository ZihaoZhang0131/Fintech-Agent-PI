import type {
  SkillDefinition,
  SkillMetadata,
  SkillResource,
} from "./parser.ts";
export type SkillRegistry = {
  list(): SkillMetadata[];
  get(name: string): SkillDefinition | undefined;
};

export type LocalSkillState = {
  entries: Array<SkillDefinition & { baseName?: string }>;
  deletedBundledNames: string[];
  resourceFilesByName: Record<string, SkillResource[]>;
};

export function selectSkillRegistry(
  registry: SkillRegistry,
  enabledNames?: Iterable<string>,
): SkillRegistry {
  const enabled = enabledNames ? new Set(enabledNames) : null;
  const skills = registry
    .list()
    .filter((skill) => !enabled || enabled.has(skill.name))
    .flatMap((metadata) => {
      const definition = registry.get(metadata.name);
      return definition ? [definition] : [];
    });
  const byName = new Map(skills.map((skill) => [skill.name, skill]));
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

export function registryFromSkills(skills: SkillDefinition[]): SkillRegistry {
  const byName = new Map(skills.map((skill) => [skill.name, skill]));
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
