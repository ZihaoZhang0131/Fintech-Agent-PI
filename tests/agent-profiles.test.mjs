import assert from "node:assert/strict";
import test from "node:test";

import {
  cloneProjectAgentConfig,
  createDefaultProjectAgentConfig,
  createProjectAgentConfigFromLegacy,
} from "../lib/agent-profiles.ts";

test("new project Agent profiles keep every delegated capability disabled by default", () => {
  const config = createDefaultProjectAgentConfig();
  assert.deepEqual(config.profiles.main.enabledMcps, []);
  assert.deepEqual(config.profiles["market-data"].enabledMcps, []);
  assert.deepEqual(config.profiles["market-data"].enabledSkills, []);
  assert.deepEqual(config.profiles["market-data"].enabledTools, []);
  assert.equal(config.profiles.main.enabled, true);
  assert.equal(config.profiles["web-evidence"].enabled, true);
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
});
