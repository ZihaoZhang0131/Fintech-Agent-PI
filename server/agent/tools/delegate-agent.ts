import type { AgentTool } from "@earendil-works/pi-agent-core";
import { Type, type TSchema, type TUnsafe } from "typebox";
import type { AgentModelOverride, SubAgentId } from "@/lib/agent-profiles";

const MAX_DELEGATIONS_PER_TURN = 2;

export type SubAgentRunResult = {
  text: string;
  model: AgentModelOverride;
  truncated: boolean;
};

export type SubAgentDetails = {
  kind: "subagent";
  agentId: SubAgentId;
  agentLabel: string;
  model: AgentModelOverride;
  task: string;
  truncated: boolean;
};

export function createDelegateAgentTool(options: {
  agents: Array<{ id: SubAgentId; label: string; description: string }>;
  run: (
    agentId: SubAgentId,
    task: string,
    signal?: AbortSignal,
    parentToolCallId?: string,
  ) => Promise<SubAgentRunResult>;
}): AgentTool<TUnsafe<Record<string, unknown>>, SubAgentDetails> | undefined {
  if (!options.agents.length) return undefined;
  const allowedIds = new Set(options.agents.map((agent) => agent.id));
  const labelById = new Map(options.agents.map((agent) => [agent.id, agent.label]));
  const agentDirectory = options.agents
    .map((agent) => `${agent.id} = ${JSON.stringify(agent.label)}（${agent.description}）`)
    .join("；");
  let invocationCount = 0;
  const parameters = Type.Unsafe<Record<string, unknown>>({
    type: "object",
    additionalProperties: false,
    required: ["agentId", "task"],
    properties: {
      agentId: {
        type: "string",
        enum: options.agents.map((agent) => agent.id),
        description: `要委派的已启用专业 Agent ID。名称与 ID 映射：${agentDirectory}`,
      },
      task: {
        type: "string",
        minLength: 1,
        maxLength: 8_000,
        description: "独立、具体的研究任务，说明期望事实、范围或输出。",
      },
    },
  } satisfies TSchema);

  return {
    name: "delegate_agent",
    label: "委派专业 Agent",
    description:
      `将明确的子任务委派给职责匹配的已启用专业 Agent。最多委派两次，并在收到结果后自行整合。可用 Agent：${agentDirectory}`,
    parameters,
    executionMode: "parallel",
    execute: async (toolCallId, raw, signal) => {
      const agentId = typeof raw.agentId === "string" ? raw.agentId : "";
      const task = typeof raw.task === "string" ? raw.task.trim() : "";
      const selectedAgentId = agentId as SubAgentId;
      if (!allowedIds.has(selectedAgentId) || !task) {
        throw new Error("只能委派给本轮已启用的专业 Agent，并提供具体任务。");
      }
      invocationCount += 1;
      if (invocationCount > MAX_DELEGATIONS_PER_TURN) {
        throw new Error(`本轮最多委派 ${MAX_DELEGATIONS_PER_TURN} 次专业 Agent。`);
      }
      const result = await options.run(selectedAgentId, task, signal, toolCallId);
      const agentLabel = labelById.get(selectedAgentId) ?? selectedAgentId;
      return {
        content: [{
          type: "text",
          text: [
            `以下是${agentLabel}的研究回传，请自行核验、整合并保留来源与不确定性：`,
            result.text,
          ].join("\n\n"),
        }],
        details: {
          kind: "subagent" as const,
          agentId: agentId as SubAgentId,
          agentLabel,
          model: result.model,
          task,
          truncated: result.truncated,
        },
      };
    },
  };
}
