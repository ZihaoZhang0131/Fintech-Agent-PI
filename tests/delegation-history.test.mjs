import assert from "node:assert/strict";
import test from "node:test";

import {
  delegationHistoryFromToolRuns,
  formatAssistantHistoryContent,
  parseHistoricalDelegations,
} from "../lib/delegation-history.ts";
import { createDelegateAgentTool } from "../server/agent/tools/delegate-agent.ts";

const researchId = "custom-f6fa8017-1234-5678-9012-123456789012";
const dataId = "custom-2e1f6b8c-1234-5678-9012-123456789012";

test("delegate tool exposes the exact Agent name, responsibility, and ID mapping to the model", () => {
  const tool = createDelegateAgentTool({
    agents: [
      { id: researchId, label: "研报Agent", description: "负责研究与证据核验" },
      { id: dataId, label: "数据Agent", description: "负责数据查询与清洗" },
    ],
    run: async () => ({
      text: "完成",
      model: { providerId: "test", modelId: "test-model" },
      truncated: false,
    }),
  });

  assert.ok(tool);
  assert.deepEqual(tool.parameters.properties.agentId.enum, [researchId, dataId]);
  assert.match(tool.parameters.properties.agentId.description, new RegExp(`${researchId}.*研报Agent`));
  assert.match(tool.parameters.properties.agentId.description, new RegExp(`${dataId}.*数据Agent`));
  assert.match(tool.description, /研报Agent/);
  assert.match(tool.description, /数据查询与清洗/);
});

test("delegation history retains the actual selected Agent for the next turn", () => {
  const records = delegationHistoryFromToolRuns([
    {
      toolCallId: "delegate-1",
      toolName: "delegate_agent",
      label: "委派研报Agent",
      query: "核验这份研报",
      status: "success",
      startedAt: 1,
      completedAt: 2,
      subAgentId: researchId,
      subAgentLabel: "研报Agent",
    },
    {
      toolCallId: "web-1",
      toolName: "web_search",
      label: "搜索",
      status: "success",
      startedAt: 1,
    },
  ]);

  assert.deepEqual(records, [{
    agentId: researchId,
    agentLabel: "研报Agent",
    task: "核验这份研报",
    status: "success",
  }]);
  const content = formatAssistantHistoryContent("上一轮回答", records);
  assert.match(content, /<application_delegation_history>/);
  assert.match(content, new RegExp(researchId));
  assert.match(content, /研报Agent/);
  assert.doesNotMatch(formatAssistantHistoryContent("普通回答", []), /delegation_history/);
});

test("invalid or oversized client delegation metadata is discarded", () => {
  assert.deepEqual(parseHistoricalDelegations([
    { agentId: dataId, agentLabel: "数据Agent", status: "error", task: "查数据" },
    { agentId: dataId, agentLabel: "数据Agent", status: "invented" },
    { agentId: "x".repeat(101), agentLabel: "数据Agent", status: "success" },
  ]), [{ agentId: dataId, agentLabel: "数据Agent", task: "查数据", status: "error" }]);
});
