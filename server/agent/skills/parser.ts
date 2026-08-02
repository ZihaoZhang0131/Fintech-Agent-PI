export type SkillMetadata = {
  name: string;
  description: string;
  allowedTools: string[];
};

export type SkillDefinition = SkillMetadata & {
  instructions: string;
};

const SKILL_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TOOL_NAME_PATTERN = /^[a-z0-9]+(?:_[a-z0-9]+)*$/;
const MAX_SKILL_SOURCE_LENGTH = 20_000;

function parseFrontmatter(source: string) {
  const normalized = source.replace(/\r\n/g, "\n").trim();
  if (normalized.length > MAX_SKILL_SOURCE_LENGTH) {
    throw new Error("Skill source is too large");
  }

  const lines = normalized.split("\n");
  if (lines[0] !== "---") throw new Error("Skill must start with YAML frontmatter");
  const endIndex = lines.indexOf("---", 1);
  if (endIndex < 0) throw new Error("Skill frontmatter is not closed");

  const scalar = new Map<string, string>();
  const lists = new Map<string, string[]>();
  let activeList: string | undefined;

  for (const line of lines.slice(1, endIndex)) {
    const listItem = line.match(/^\s+-\s+(.+)$/);
    if (listItem && activeList) {
      lists.get(activeList)?.push(listItem[1].trim());
      continue;
    }

    const field = line.match(/^([a-z_]+):\s*(.*)$/);
    if (!field) {
      if (line.trim()) throw new Error(`Unsupported Skill frontmatter line: ${line}`);
      continue;
    }

    const [, key, value] = field;
    if (value) {
      scalar.set(key, value.trim());
      activeList = undefined;
    } else {
      lists.set(key, []);
      activeList = key;
    }
  }

  return {
    scalar,
    lists,
    body: lines.slice(endIndex + 1).join("\n").trim(),
  };
}

export function parseSkill(source: string): SkillDefinition {
  const { scalar, lists, body } = parseFrontmatter(source);
  const name = scalar.get("name") ?? "";
  const description = scalar.get("description") ?? "";
  const allowedTools = lists.get("allowed_tools") ?? [];

  if (!SKILL_NAME_PATTERN.test(name)) throw new Error(`Invalid Skill name: ${name}`);
  if (!description || description.length > 300) {
    throw new Error(`Invalid description for Skill ${name}`);
  }
  if (!body) throw new Error(`Skill ${name} has no instructions`);
  if (!allowedTools.every((toolName) => TOOL_NAME_PATTERN.test(toolName))) {
    throw new Error(`Skill ${name} contains an invalid allowed_tools entry`);
  }

  return { name, description, allowedTools, instructions: body };
}

