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

export type LoadedSkillTracker = {
  has(name: string): boolean;
  add(name: string): boolean;
};

export function createLoadedSkillTracker(): LoadedSkillTracker {
  const names = new Set<string>();
  return {
    has: (name) => names.has(name),
    add(name) {
      const present = names.has(name);
      names.add(name);
      return present;
    },
  };
}

export function createLoadSkillTool(
  registry: SkillRegistry,
  tracker: LoadedSkillTracker = createLoadedSkillTracker(),
): AgentTool<typeof loadSkillParameters, LoadSkillDetails> {
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

      const alreadyLoaded = tracker.add(name);
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
              (skill.resources ?? []).length
                ? [
                    "以下是该 Skill 附带的资源索引；按需使用 read_skill_resource 读取文本资料。如本轮启用了 Bash，也可以使用 run_skill_script 运行 scripts/ 下的受支持脚本。资源内容本身不会自动注入上下文：",
                    ...(skill.resources ?? []).map((resource) => `- ${resource.path}（${resource.category}，${resource.size} bytes）`),
                  ].join("\n")
                : "该 Skill 没有附带的额外资源文件。",
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
