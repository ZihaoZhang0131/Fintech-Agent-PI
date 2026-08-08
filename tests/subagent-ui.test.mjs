import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const component = await readFile(new URL("../components/agent-library.tsx", import.meta.url), "utf8");
const route = await readFile(new URL("../app/api/chat/stream/route.ts", import.meta.url), "utf8");

test("project UI exposes the Agent configuration library and persists it per project", () => {
  assert.match(page, /AGENT_PROFILES_KEY/);
  assert.match(page, /AGENT_PROMPTS_KEY/);
  assert.match(page, /agentPrompts,/);
  assert.match(page, /migrateLegacyProjectAgentPrompts/);
  assert.match(page, /<AgentLibrary/);
  assert.match(page, />Agent</);
  assert.match(component, /跟随主 Agent/);
  assert.match(component, /主 Agent 系统提示词/);
  assert.match(component, /系统提示词/);
  assert.match(component, /系统提示词全局生效/);
  assert.match(component, /全局保存，并会在下一轮对话中对所有项目生效/);
  assert.match(component, /maxLength=\{12_000\}/);
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
  assert.match(route, /agentPrompts\[agentId\]/);
  assert.match(route, /agentPrompts\.main/);
  assert.match(route, /resolveGlobalAgentPrompts/);
  assert.doesNotMatch(route, /const SYSTEM_PROMPT/);
});

test("delegated Agent events use the selected Agent name in their display label", () => {
  assert.match(route, /委派\$\{AGENT_ROLE_REGISTRY\[delegatedAgentId\]\.label\} Agent/);
  assert.match(route, /getDelegatedAgentId\(event\.args\)/);
  assert.match(route, /delegatedAgentIds\.set\(event\.toolCallId, delegatedAgentId\)/);
  assert.doesNotMatch(route, /委派专业 Agent/);
});
