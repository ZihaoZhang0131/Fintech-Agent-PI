import assert from "node:assert/strict";
import test from "node:test";

import {
  AGENT_TOOL_NAMES,
  BUNDLED_SKILL_NAMES,
  resolveCapabilitySelection,
} from "../server/agent/capability-policy.ts";

test("capability selection enables the complete bundled set by default", () => {
  const selection = resolveCapabilitySelection({});
  assert.deepEqual(selection.enabledSkills, [...BUNDLED_SKILL_NAMES]);
  assert.deepEqual(selection.enabledTools, [...AGENT_TOOL_NAMES]);
  assert.deepEqual(selection.enabledMcps, ["akshare-one"]);
});

test("capability selection keeps only explicitly enabled known names", () => {
  const selection = resolveCapabilitySelection({
    enabledSkills: ["equity-research", "unknown-skill"],
    enabledTools: ["web_search", "write_project_file", "bash", "run_arbitrary_shell"],
    enabledMcps: ["akshare-one", "unknown-mcp"],
  });
  assert.deepEqual(selection.enabledSkills, ["equity-research"]);
  assert.deepEqual(selection.enabledTools, ["web_search", "write_project_file", "bash"]);
  assert.deepEqual(selection.enabledMcps, ["akshare-one"]);
});

test("empty capability selections disable all Agent skills, tools, and MCP servers", () => {
  const selection = resolveCapabilitySelection({ enabledSkills: [], enabledTools: [], enabledMcps: [] });
  assert.deepEqual(selection.enabledSkills, []);
  assert.deepEqual(selection.enabledTools, []);
  assert.deepEqual(selection.enabledMcps, []);
});
