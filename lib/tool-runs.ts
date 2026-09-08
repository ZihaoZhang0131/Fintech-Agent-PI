export type ToolSource = {
  title: string;
  url: string;
  publishedDate?: string;
};

export type ToolRunStatus = "running" | "awaiting_approval" | "success" | "rejected" | "error";

export type ToolRun = {
  toolCallId: string;
  toolName: string;
  label: string;
  query?: string;
  status: ToolRunStatus;
  startedAt: number;
  completedAt?: number;
  durationMs?: number;
  resultCount?: number;
  summary?: string;
  sources?: ToolSource[];
  commandId?: string;
  permissionMode?: "sandbox" | "full";
  exitCode?: number | null;
  stdout?: string;
  stderr?: string;
  truncated?: boolean;
  timedOut?: boolean;
  mcpServerId?: string;
  mcpServerLabel?: string;
  externalToolName?: string;
  subAgentId?: string;
  subAgentLabel?: string;
  subAgentModel?: string;
};

export type ToolStartEvent = {
  type: "tool_start";
  toolCallId: string;
  toolName: string;
  label: string;
  query?: string;
  startedAt: number;
  subAgentId?: string;
  subAgentLabel?: string;
};

export type ToolEndEvent = {
  type: "tool_end";
  toolCallId: string;
  toolName: string;
  label: string;
  isError: boolean;
  query?: string;
  completedAt: number;
  durationMs?: number;
  resultCount?: number;
  summary?: string;
  sources?: ToolSource[];
  commandId?: string;
  permissionMode?: "sandbox" | "full";
  commandStatus?: string;
  exitCode?: number | null;
  stdout?: string;
  stderr?: string;
  truncated?: boolean;
  timedOut?: boolean;
  mcpServerId?: string;
  mcpServerLabel?: string;
  externalToolName?: string;
  subAgentId?: string;
  subAgentLabel?: string;
  subAgentModel?: string;
};

export type ToolApprovalEvent = {
  type: "tool_approval_required";
  toolCallId: string;
  toolName: string;
  label: string;
  query: string;
  commandId: string;
  permissionMode: "sandbox" | "full";
};

export function applyToolStart(runs: ToolRun[] | undefined, event: ToolStartEvent): ToolRun[] {
  const current = runs ?? [];
  if (current.some((run) => run.toolCallId === event.toolCallId)) return current;
  return [
    ...current,
    {
      toolCallId: event.toolCallId,
      toolName: event.toolName,
      label: event.label,
      query: event.query,
      status: "running",
      startedAt: event.startedAt,
      subAgentId: event.subAgentId,
      subAgentLabel: event.subAgentLabel,
    },
  ];
}

export function applyToolEnd(runs: ToolRun[] | undefined, event: ToolEndEvent): ToolRun[] {
  const current = runs ?? [];
  const existing = current.find((run) => run.toolCallId === event.toolCallId);
  const completed: ToolRun = {
    toolCallId: event.toolCallId,
    toolName: event.toolName,
    label: event.label,
    query: event.query ?? existing?.query,
    status: event.isError
      ? "error"
      : event.commandStatus === "rejected"
        ? "rejected"
        : "success",
    startedAt: existing?.startedAt ?? event.completedAt - (event.durationMs ?? 0),
    completedAt: event.completedAt,
    durationMs: event.durationMs,
    resultCount: event.resultCount,
    summary: event.summary,
    sources: event.sources,
    commandId: event.commandId ?? existing?.commandId,
    permissionMode: event.permissionMode ?? existing?.permissionMode,
    exitCode: event.exitCode,
    stdout: event.stdout,
    stderr: event.stderr,
    truncated: event.truncated,
    timedOut: event.timedOut,
    mcpServerId: event.mcpServerId,
    mcpServerLabel: event.mcpServerLabel,
    externalToolName: event.externalToolName,
    subAgentId: event.subAgentId ?? existing?.subAgentId,
    subAgentLabel: event.subAgentLabel ?? existing?.subAgentLabel,
    subAgentModel: event.subAgentModel,
  };

  if (!existing) return [...current, completed];
  return current.map((run) => (run.toolCallId === event.toolCallId ? completed : run));
}

export function applyToolApproval(
  runs: ToolRun[] | undefined,
  event: ToolApprovalEvent,
): ToolRun[] {
  const current = runs ?? [];
  const existing = current.find((run) => run.toolCallId === event.toolCallId);
  const awaiting: ToolRun = {
    toolCallId: event.toolCallId,
    toolName: event.toolName,
    label: event.label,
    query: event.query,
    status: "awaiting_approval",
    startedAt: existing?.startedAt ?? Date.now(),
    commandId: event.commandId,
    permissionMode: event.permissionMode,
  };
  if (!existing) return [...current, awaiting];
  return current.map((run) => (run.toolCallId === event.toolCallId ? { ...existing, ...awaiting } : run));
}
