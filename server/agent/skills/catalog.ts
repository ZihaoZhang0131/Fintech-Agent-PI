import type { SkillRegistry } from "./loader";

export function formatSkillCatalog(registry: SkillRegistry) {
  const skills = registry.list();
  if (skills.length === 0) {
    return "本轮没有启用任何 Skill。不要调用 load_skill，也不要声称使用了 Skill。";
  }

  const entries = skills
    .map((skill) => `- ${skill.name}: ${skill.description}`)
    .join("\n");

  return `可用 Skills（这里只是索引，不包含完整执行说明）：\n${entries}\n\n当用户任务明显匹配某个 Skill 时，必须先调用 load_skill 加载完整说明，然后按照说明执行。每个 Skill 在单次任务中只加载一次；不要声称使用了尚未加载的 Skill。`;
}
