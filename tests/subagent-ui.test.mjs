import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const component = await readFile(new URL("../components/agent-library.tsx", import.meta.url), "utf8");
const route = await readFile(new URL("../app/api/chat/stream/route.ts", import.meta.url), "utf8");

test("project UI separates the main Agent prompt from SubAgent management", () => {
  assert.match(page, /AGENT_PROFILES_KEY/);
  assert.match(page, /AGENT_PROMPTS_KEY/);
  assert.match(page, /agentPrompts,/);
  assert.match(page, /migrateLegacyProjectAgentPrompts/);
  assert.match(page, /<AgentPromptPage/);
  assert.match(page, /<SubAgentLibrary/);
  assert.match(page, />Agent</);
  assert.match(page, />SubAgent</);
  assert.match(component, /跟随主 Agent/);
  assert.match(component, /系统提示词/);
  assert.match(component, /maxLength=\{12_000\}/);
  assert.match(component, /Skills/);
  assert.match(component, /MCP/);
  assert.match(component, /暂无 SubAgent/);
  assert.match(component, /新增/);
  assert.match(component, /onCreateCustom/);
  assert.match(component, /onDeleteCustom/);
  assert.doesNotMatch(component, /market-data|web-evidence|financial-analysis/);
  assert.match(page, /createCustomSubAgentForProject/);
  assert.match(page, /deleteCustomSubAgent/);
});

test("chat route lazy-loads MCP only inside a delegated specialized Agent", () => {
  assert.match(route, /createDelegateAgentTool/);
  assert.match(route, /async function runSubAgent/);
  assert.match(route, /await createProfileTools/);
  assert.match(route, /不能再次委派 Agent/);
  assert.match(route, /agentPrompts\.main/);
  assert.match(route, /resolveGlobalAgentPrompts/);
  assert.doesNotMatch(route, /const SYSTEM_PROMPT/);
});

test("delegated Agent events use the selected Agent name in their display label", () => {
  assert.match(route, /委派\$\{delegatedAgentLabel\} Agent/);
  assert.match(route, /getDelegatedAgentId\(event\.args\)/);
  assert.match(route, /delegatedAgentIds\.set\(event\.toolCallId, delegatedAgentId\)/);
  assert.match(route, /getConfiguredSubAgent\(agentConfig/);
  assert.doesNotMatch(route, /委派专业 Agent/);
});

test("chat history returns persisted delegation facts to the main Agent", () => {
  assert.match(page, /delegationHistoryFromToolRuns\(toolRuns\)/);
  assert.match(route, /formatAssistantHistoryContent\(message\.content, message\.delegations\)/);
  assert.match(route, /application_delegation_history/);
  assert.match(route, /agentId=\$\{JSON\.stringify\(item\.id\)\}/);
});
