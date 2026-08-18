import assert from "node:assert/strict";
import test from "node:test";

import {
  cloneProjectAgentConfig,
  createCustomSubAgent,
  createDefaultProjectAgentConfig,
  createProjectAgentConfigFromLegacy,
  upgradeLegacyDefaultSkillSelection,
  upgradeLegacyDefaultToolSelection,
} from "../lib/agent-profiles.ts";
import { DEFAULT_AGENT_SYSTEM_PROMPTS, createDefaultAgentPromptConfig } from "../lib/agent-prompts.ts";

test("new project has only the main Agent and no preconfigured SubAgents", () => {
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
  assert.deepEqual(config.customSubAgents, []);
  const prompts = createDefaultAgentPromptConfig();
  assert.equal(prompts.main, DEFAULT_AGENT_SYSTEM_PROMPTS.main);
  assert.deepEqual(Object.keys(prompts), ["main"]);
});

test("custom sub-Agents start empty and clone independently with their project configuration", () => {
  const config = createDefaultProjectAgentConfig();
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
