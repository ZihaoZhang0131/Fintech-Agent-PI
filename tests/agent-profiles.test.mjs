import assert from "node:assert/strict";
import test from "node:test";

import {
  cloneProjectAgentConfig,
  createDefaultProjectAgentConfig,
  createProjectAgentConfigFromLegacy,
  upgradeLegacyDefaultSkillSelection,
} from "../lib/agent-profiles.ts";
import { DEFAULT_AGENT_SYSTEM_PROMPTS, createDefaultAgentPromptConfig } from "../lib/agent-prompts.ts";

test("new project Agent profiles keep every delegated capability disabled by default", () => {
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
  assert.deepEqual(config.profiles["market-data"].enabledMcps, []);
  assert.deepEqual(config.profiles["market-data"].enabledSkills, []);
  assert.deepEqual(config.profiles["market-data"].enabledTools, []);
  assert.equal(config.profiles.main.enabled, true);
  assert.equal(config.profiles["web-evidence"].enabled, true);
  const prompts = createDefaultAgentPromptConfig();
  assert.equal(prompts.main, DEFAULT_AGENT_SYSTEM_PROMPTS.main);
  assert.equal(prompts["market-data"], DEFAULT_AGENT_SYSTEM_PROMPTS["market-data"]);
});

test("global Agent prompts are independent from project profiles", () => {
  const prompts = createDefaultAgentPromptConfig();
  prompts["web-evidence"] = "全局自定义网页核验提示词";
  const project = createDefaultProjectAgentConfig();
  assert.equal(prompts["web-evidence"], "全局自定义网页核验提示词");
  assert.ok(!Object.hasOwn(project.profiles["web-evidence"], "systemPrompt"));
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
  assert.equal(createDefaultAgentPromptConfig()["web-evidence"], DEFAULT_AGENT_SYSTEM_PROMPTS["web-evidence"]);
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
