import type { ToolRun, ToolRunStatus } from "./tool-runs";

export type HistoricalDelegation = {
  agentId: string;
  agentLabel: string;
  task?: string;
  status: ToolRunStatus;
};

const DELEGATION_STATUSES = new Set<ToolRunStatus>([
  "running",
  "awaiting_approval",
  "success",
  "rejected",
  "error",
]);

export function delegationHistoryFromToolRuns(toolRuns: ToolRun[] | undefined): HistoricalDelegation[] {
  return (toolRuns ?? []).slice(0, 12).flatMap((run) =>
    run.toolName === "delegate_agent" && run.subAgentId && run.subAgentLabel
      ? [{
          agentId: run.subAgentId,
          agentLabel: run.subAgentLabel,
          ...(run.query ? { task: run.query } : {}),
          status: run.status,
        }]
      : []
  );
}

export function parseHistoricalDelegations(value: unknown): HistoricalDelegation[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 12).flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const candidate = item as Partial<HistoricalDelegation>;
    if (
      typeof candidate.agentId !== "string" || candidate.agentId.length > 100 ||
      typeof candidate.agentLabel !== "string" || candidate.agentLabel.length > 60 ||
      typeof candidate.status !== "string" || !DELEGATION_STATUSES.has(candidate.status as ToolRunStatus) ||
      (candidate.task !== undefined && (typeof candidate.task !== "string" || candidate.task.length > 8_000))
    ) return [];
    return [{
      agentId: candidate.agentId,
      agentLabel: candidate.agentLabel,
      ...(candidate.task ? { task: candidate.task } : {}),
      status: candidate.status as ToolRunStatus,
    }];
  });
}

export function formatAssistantHistoryContent(content: string, value: unknown) {
  const delegations = parseHistoricalDelegations(value);
  if (!delegations.length) return content;
  return [
    content,
    "<application_delegation_history>",
    JSON.stringify(delegations),
    "</application_delegation_history>",
  ].join("\n");
}
