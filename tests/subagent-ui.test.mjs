import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const component = await readFile(new URL("../components/agent-library.tsx", import.meta.url), "utf8");
const route = await readFile(new URL("../app/api/chat/stream/route.ts", import.meta.url), "utf8");

test("project UI exposes the Agent configuration library and persists it per project", () => {
  assert.match(page, /AGENT_PROFILES_KEY/);
  assert.match(page, /<AgentLibrary/);
  assert.match(page, />Agent</);
  assert.match(component, /跟随主 Agent/);
  assert.match(component, /Skills/);
  assert.match(component, /MCP/);
  assert.match(component, /filter\(\(agent\) => !agent\.isMain\)/);
  assert.doesNotMatch(component, /onMainModelChange/);
  assert.match(component, /能力默认关闭，按需启用/);
});

test("chat route lazy-loads MCP only inside a delegated specialized Agent", () => {
  assert.match(route, /createDelegateAgentTool/);
  assert.match(route, /async function runSubAgent/);
  assert.match(route, /MCP discovery is deliberately delayed/);
  assert.match(route, /不能再次委派 Agent/);
});
