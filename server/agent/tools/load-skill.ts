import type { AgentTool } from "@earendil-works/pi-agent-core";
import { Type } from "typebox";
import type { SkillRegistry } from "../skills/loader";

const loadSkillParameters = Type.Object({
  name: Type.String({
    description: "要加载的 Skill 名称，必须来自系统提示词给出的可用 Skills 列表。",
    minLength: 1,
    maxLength: 64,
  }),
});

export type LoadSkillDetails = {
  kind: "skill";
  name: string;
  description: string;
};

export function createLoadSkillTool(
  registry: SkillRegistry,
): AgentTool<typeof loadSkillParameters, LoadSkillDetails> {
  const loaded = new Set<string>();

  return {
    name: "load_skill",
    label: "加载 Skill",
    description:
      "加载某个投研 Skill 的完整执行流程。任务明显匹配可用 Skill 时，应在分析或调用其他工具前先调用本工具。只能加载系统列出的白名单 Skill。",
    parameters: loadSkillParameters,
    executionMode: "sequential",
    execute: async (_toolCallId, { name }) => {
      const skill = registry.get(name);
      if (!skill) {
        const available = registry
          .list()
          .map((item) => item.name)
          .join(", ");
        throw new Error(`Unknown Skill "${name}". Available Skills: ${available}`);
      }

      const alreadyLoaded = loaded.has(name);
      loaded.add(name);
      const details: LoadSkillDetails = {
        kind: "skill",
        name: skill.name,
        description: skill.description,
      };

      if (alreadyLoaded) {
        return {
          content: [{ type: "text", text: `Skill ${name} 已在本轮任务中加载，请直接继续执行。` }],
          details,
        };
      }

      return {
        content: [
          {
            type: "text",
            text: [
              `Skill "${skill.name}" 已加载。以下是本轮任务必须遵循的完整流程：`,
              `<skill name="${skill.name}">`,
              skill.instructions,
              "</skill>",
              "不要再次加载同一个 Skill；请按照以上流程继续完成用户任务。",
            ].join("\n\n"),
          },
        ],
        details,
      };
    },
  };
}
