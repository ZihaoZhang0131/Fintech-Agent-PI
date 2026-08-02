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
});

test("capability selection keeps only explicitly enabled known names", () => {
  const selection = resolveCapabilitySelection({
    enabledSkills: ["equity-research", "unknown-skill"],
    enabledTools: ["web_search", "write_project_file", "run_arbitrary_shell"],
  });
  assert.deepEqual(selection.enabledSkills, ["equity-research"]);
  assert.deepEqual(selection.enabledTools, ["web_search", "write_project_file"]);
});

test("empty capability selections disable all Agent skills and tools", () => {
  const selection = resolveCapabilitySelection({ enabledSkills: [], enabledTools: [] });
  assert.deepEqual(selection.enabledSkills, []);
  assert.deepEqual(selection.enabledTools, []);
});
