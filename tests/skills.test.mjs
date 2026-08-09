import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { formatSkillCatalog } from "../server/agent/skills/catalog.ts";
import { parseSkill } from "../server/agent/skills/parser.ts";
import { createLoadSkillTool, createLoadedSkillTracker } from "../server/agent/tools/load-skill.ts";
import { createSkillResourceTools } from "../server/agent/tools/skill-resources.ts";

const skillCases = [
  ["equity-research", "公司研究"],
  ["earnings-review", "财报解读"],
  ["policy-tracking", "政策"],
];

test("the system prompt catalog exposes metadata but not full Skill instructions", () => {
  const registry = {
    list: () => [
      {
        id: "bundled:equity-research",
        origin: "bundled",
        name: "equity-research",
        description: "上市公司研究",
      },
    ],
    get: () => ({
      id: "bundled:equity-research",
      origin: "bundled",
      name: "equity-research",
      description: "上市公司研究",
      instructions: "这是只应在 load_skill 之后出现的秘密执行正文。",
    }),
  };

  const catalog = formatSkillCatalog(registry);
  assert.match(catalog, /equity-research: 上市公司研究/);
  assert.match(catalog, /必须先调用 load_skill/);
  assert.doesNotMatch(catalog, /秘密执行正文/);
});

test("the system prompt clearly reports when every Skill is disabled", () => {
  const catalog = formatSkillCatalog({ list: () => [], get: () => undefined });
  assert.match(catalog, /没有启用任何 Skill/);
  assert.match(catalog, /不要调用 load_skill/);
});

test("the three bundled Skill files have valid metadata and instructions", async () => {
  for (const [name, instructionFragment] of skillCases) {
    const source = await readFile(
      new URL(`../.agents/skills/${name}/SKILL.md`, import.meta.url),
      "utf8",
    );
    const skill = parseSkill(source);
    assert.equal(skill.name, name);
    assert.ok(skill.description.length > 10);
    assert.equal(skill.origin, "bundled");
    assert.match(skill.instructions, new RegExp(instructionFragment));
    assert.doesNotMatch(skill.instructions, /^---/);
  }
});

test("load_skill returns full instructions only for a registry-whitelisted Skill", async () => {
  const skill = {
    id: "bundled:equity-research",
    origin: "bundled",
    name: "equity-research",
    description: "上市公司研究",
    instructions: "先确认公司和时间范围，再输出研究报告。",
  };
  const registry = {
    list: () => [skill],
    get: (name) => (name === skill.name ? skill : undefined),
  };
  const tool = createLoadSkillTool(registry);

  const result = await tool.execute("skill-call-1", { name: "equity-research" });
  assert.equal(result.details.kind, "skill");
  assert.equal(result.details.name, "equity-research");
  assert.match(result.content[0].text, /先确认公司和时间范围/);
  assert.doesNotMatch(result.content[0].text, /允许使用的业务工具/);

  await assert.rejects(
    tool.execute("skill-call-2", { name: "../../private-file" }),
    /Unknown Skill/,
  );
});

test("load_skill avoids returning the full instructions twice in one Agent run", async () => {
  const skill = {
    id: "bundled:policy-tracking",
    origin: "bundled",
    name: "policy-tracking",
    description: "政策追踪",
    instructions: "必须查找最新官方政策来源。",
  };
  const registry = {
    list: () => [skill],
    get: () => skill,
  };
  const tool = createLoadSkillTool(registry);

  await tool.execute("skill-call-1", { name: skill.name });
  const repeated = await tool.execute("skill-call-2", { name: skill.name });
  assert.match(repeated.content[0].text, /已在本轮任务中加载/);
  assert.doesNotMatch(repeated.content[0].text, /必须查找最新官方政策来源/);
});

test("Skill resources are listed only after load and cannot be read before their Skill is loaded", async () => {
  const skill = {
    id: "custom:skill",
    origin: "custom",
    name: "resource-skill",
    description: "包含按需资料。",
    instructions: "读取 references/rules.md。",
    resources: [{ path: "references/rules.md", name: "rules.md", size: 12, extension: ".md", category: "reference", isText: true }],
  };
  const registry = { list: () => [skill], get: (name) => name === skill.name ? skill : undefined };
  const tracker = createLoadedSkillTracker();
  const [read] = createSkillResourceTools(registry, tracker, "workspace-123", { approvalMode: "auto", permissionMode: "sandbox" });
  await assert.rejects(read.execute("resource-call", { name: skill.name, path: "references/rules.md" }), /先调用 load_skill/);
  const loaded = createLoadSkillTool(registry, tracker);
  const result = await loaded.execute("load-resource", { name: skill.name });
  assert.match(result.content[0].text, /references\/rules\.md/);
});

test("legacy allowed_tools is ignored when parsing uploaded Skill content", () => {
  const legacy = parseSkill(`---\nname: legacy-skill\ndescription: 兼容旧格式的技能。\nallowed_tools:\n  - web_search\n---\n\n执行旧流程。`);
  assert.equal(legacy.name, "legacy-skill");
  assert.equal("allowedTools" in legacy, false);
});
