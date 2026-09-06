import assert from "node:assert/strict";
import test from "node:test";

import {
  cloneProjectAgentConfig,
  createCustomSubAgent,
  createDefaultProjectAgentConfig,
  createEmptyProjectAgentConfig,
  supplementDefaultAgents,
  createProjectAgentConfigFromLegacy,
  upgradeLegacyDefaultSkillSelection,
  upgradeLegacyDefaultToolSelection,
} from "../lib/agent-profiles.ts";
import { DEFAULT_AGENT_SYSTEM_PROMPTS, createDefaultAgentPromptConfig } from "../lib/agent-prompts.ts";

test("new project has three editable enabled specialists", () => {
  const config = createDefaultProjectAgentConfig();
  assert.deepEqual(config.profiles.main.enabledSkills, [
    "equity-research",
    "earnings-review",
    "policy-tracking",
    "akshare-http-data",
    "a-share-value-investing",
    "akshare-china-macro",
    "akshare-us-macro",
    "akshare-euro-macro",
    "akshare-institutions-macro",
  ]);
  assert.deepEqual(config.profiles.main.enabledMcps, []);
  assert.equal(config.profiles.main.enabled, true);
  assert.deepEqual(Object.keys(config.profiles), ["main"]);
  assert.deepEqual(config.customSubAgents.map(a => a.label), ["研报Agent", "数据Agent", "写作Agent"]);
  assert.ok(config.customSubAgents.every(a => a.enabled && !a.model && !a.enabledMcps.length));
  const prompts = createDefaultAgentPromptConfig();
  assert.equal(prompts.main, DEFAULT_AGENT_SYSTEM_PROMPTS.main);
  assert.deepEqual(Object.keys(prompts), ["main"]);
});

test("custom sub-Agents start empty and clone independently with their project configuration", () => {
  const config = createEmptyProjectAgentConfig();
  const custom = createCustomSubAgent({
    id: "custom-7d5d078c-166f-40b8-a6ce-c3bb4df310be",
    label: "行业研究员",
    description: "梳理产业链和竞争格局。",
  });
  config.customSubAgents.push(custom);
  const copied = cloneProjectAgentConfig(config);
  copied.customSubAgents[0].enabledTools.push("web_search");
  assert.equal(config.customSubAgents[0].label, "行业研究员");
  assert.deepEqual(config.customSubAgents[0].enabledTools, []);
  assert.equal(copied.customSubAgents[0].enabled, true);
});

test("the global main Agent prompt is independent from project profiles", () => {
  const prompts = createDefaultAgentPromptConfig();
  prompts.main = "全局自定义主 Agent 提示词";
  const project = createDefaultProjectAgentConfig();
  assert.equal(prompts.main, "全局自定义主 Agent 提示词");
  assert.ok(!Object.hasOwn(project.profiles.main, "systemPrompt"));
});

test("legacy main capabilities migrate without sharing mutable profile arrays", () => {
  const migrated = createProjectAgentConfigFromLegacy({
    enabledSkills: ["equity-research"],
    enabledTools: ["web_search"],
    enabledMcps: ["akshare-one"],
    model: { providerId: "deepseek", modelId: "deepseek-v4-flash" },
  });
  const copied = cloneProjectAgentConfig(migrated);
  copied.profiles.main.enabledTools.push("bash");
  assert.deepEqual(migrated.profiles.main.enabledTools, ["web_search"]);
  assert.equal(migrated.mainModel.modelId, "deepseek-v4-flash");
  assert.equal(createDefaultAgentPromptConfig().main, DEFAULT_AGENT_SYSTEM_PROMPTS.main);
});

test("former complete default Skill selections gain every newly bundled default", () => {
  assert.deepEqual(
    upgradeLegacyDefaultSkillSelection(["equity-research", "earnings-review", "policy-tracking"]),
    ["equity-research", "earnings-review", "policy-tracking", "akshare-http-data", "a-share-value-investing", "akshare-china-macro", "akshare-us-macro", "akshare-euro-macro", "akshare-institutions-macro"],
  );
  assert.deepEqual(
    upgradeLegacyDefaultSkillSelection(["equity-research", "earnings-review", "policy-tracking", "akshare-http-data"]),
    ["equity-research", "earnings-review", "policy-tracking", "akshare-http-data", "a-share-value-investing", "akshare-china-macro", "akshare-us-macro", "akshare-euro-macro", "akshare-institutions-macro"],
  );
  assert.deepEqual(upgradeLegacyDefaultSkillSelection(["equity-research"]), ["equity-research"]);
});

test("former complete default tool selections gain bundled tools without changing partial selections", () => {
  const upgraded = upgradeLegacyDefaultToolSelection([
    "load_skill", "web_search", "list_project_files", "read_project_file", "write_project_file", "bash",
  ]);
  assert.ok(upgraded.includes("query_local_database"));
  assert.ok(upgraded.includes("mutate_local_database"));
  assert.ok(upgraded.includes("generate_document"));
  assert.ok(
    upgradeLegacyDefaultToolSelection([
      "load_skill", "web_search", "list_project_files", "read_project_file", "write_project_file",
      "list_local_database_tables", "describe_local_database_table", "query_local_database",
      "mutate_local_database", "bash",
    ]).includes("generate_document"),
  );
  assert.deepEqual(upgradeLegacyDefaultToolSelection(["web_search"]), ["web_search"]);
});


test("starter migration preserves names, overrides, disabled roles, and deletion", () => {
  const old = createEmptyProjectAgentConfig();
  old.customSubAgents.push({ ...createCustomSubAgent({ id: "custom-existing-12345678", label: "研报 Agent", description: "我的职责" }), enabled: false });
  old.profiles.main.enabledTools = [];
  const migrated = supplementDefaultAgents(old);
  assert.deepEqual(migrated.customSubAgents[0], old.customSubAgents[0]);
  assert.deepEqual(migrated.profiles.main.enabledTools, []);
  assert.equal(old.customSubAgents.length, 1);
  assert.equal(migrated.customSubAgents.length, 3);
  const deleted = JSON.parse(JSON.stringify(migrated));
  deleted.customSubAgents = [];
  assert.deepEqual(supplementDefaultAgents(cloneProjectAgentConfig(deleted)).customSubAgents, []);
  const restored = supplementDefaultAgents(deleted, true);
  assert.equal(restored.customSubAgents.length, 3);
  assert.deepEqual(supplementDefaultAgents(restored, true), restored);
});

test("starter capacity limit preserves all existing roles and reports skipped names", () => {
  const old = createEmptyProjectAgentConfig();
  old.customSubAgents = Array.from({ length: 11 }, (_, i) => createCustomSubAgent({ id: `custom-existing-${i}12345678`, label: `自定义${i}`, description: "保留" }));
  const next = supplementDefaultAgents(old);
  assert.equal(next.customSubAgents.length, 12);
  assert.equal(next.customSubAgents[11].label, "研报Agent");
  assert.deepEqual(next.starterAgentsSkipped, ["数据Agent", "写作Agent"]);
  next.customSubAgents.pop();
  assert.equal(supplementDefaultAgents(next).customSubAgents.length, 11);
});

test("starter permissions are separate, independently cloned, and parsing never seeds roles", () => {
  const config = createDefaultProjectAgentConfig();
  const [research, data, writing] = config.customSubAgents;
  assert.equal(research.enabledSkills.length, 4);
  assert.equal(data.enabledSkills.length, 5);
  assert.deepEqual(writing.enabledSkills, []);
  assert.ok(data.enabledTools.includes("bash"));
  assert.ok(data.enabledTools.includes("mutate_local_database"));
  assert.ok(writing.enabledTools.includes("generate_document"));
  for (const role of [research, writing]) {
    assert.ok(!role.enabledTools.includes("bash"));
    assert.ok(!role.enabledTools.includes("mutate_local_database"));
  }
  const clone = cloneProjectAgentConfig(config);
  clone.customSubAgents[0].enabledTools.length = 0;
  assert.ok(research.enabledTools.length > 0);
  assert.notEqual(createDefaultProjectAgentConfig().customSubAgents[0].id, research.id);
  assert.deepEqual(createEmptyProjectAgentConfig().customSubAgents, []);
});
