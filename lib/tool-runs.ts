export type ToolSource = {
  title: string;
  url: string;
  publishedDate?: string;
};

export type ToolRunStatus = "running" | "awaiting_approval" | "success" | "rejected" | "error";

export type ToolRun = {
  children?: ToolRun[];
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
  artifacts?: string[];
  artifactsTruncated?: boolean;
  mcpServerId?: string;
  mcpServerLabel?: string;
  externalToolName?: string;
  subAgentId?: string;
  subAgentLabel?: string;
  subAgentModel?: string;
};

export type ToolStartEvent = {
  children?: ToolRun[];
  parentToolCallId?: string;
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
  parentToolCallId?: string;
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
  artifacts?: string[];
  artifactsTruncated?: boolean;
  mcpServerId?: string;
  mcpServerLabel?: string;
  externalToolName?: string;
  subAgentId?: string;
  subAgentLabel?: string;
  subAgentModel?: string;
};

export type ToolApprovalEvent = {
  parentToolCallId?: string;
  type: "tool_approval_required";
  toolCallId: string;
  toolName: string;
  label: string;
  query: string;
  commandId: string;
  permissionMode: "sandbox" | "full";
};

export function applyToolStart(runs: ToolRun[] | undefined, event: ToolStartEvent): ToolRun[] {
  if (event.parentToolCallId) {
    const { parentToolCallId, ...childEvent } = event;
    return (runs ?? []).map((run) => run.toolCallId === parentToolCallId
      ? { ...run, children: applyToolStart(run.children, childEvent) } : run);
  }
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
      children: event.children,
      subAgentId: event.subAgentId,
      subAgentLabel: event.subAgentLabel,
    },
  ];
}

export function applyToolEnd(runs: ToolRun[] | undefined, event: ToolEndEvent): ToolRun[] {
  if (event.parentToolCallId) {
    const { parentToolCallId, ...childEvent } = event;
    return (runs ?? []).map((run) => run.toolCallId === parentToolCallId
      ? { ...run, children: applyToolEnd(run.children, childEvent) } : run);
  }
  const current = runs ?? [];
  const existing = current.find((run) => run.toolCallId === event.toolCallId);
  const completed: ToolRun = {
    toolCallId: event.toolCallId,
    children: existing?.children && finishToolRuns(existing.children, event.isError ? event.summary || "子任务失败或已中断" : "子任务已结束", event.completedAt),
    toolName: event.toolName,
    label: event.label,
    query: event.query ?? existing?.query,
    status: event.isError
      ? "error"
      : event.commandStatus === "failed"
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
    artifacts: event.artifacts,
    artifactsTruncated: event.artifactsTruncated,
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
  if (event.parentToolCallId) {
    const { parentToolCallId, ...childEvent } = event;
    return (runs ?? []).map((run) => run.toolCallId === parentToolCallId
      ? { ...run, children: applyToolApproval(run.children, childEvent) } : run);
  }
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

export function finishToolRuns(runs: ToolRun[] | undefined, reason: string, now = Date.now()): ToolRun[] {
  return (runs ?? []).map((run) => ({
    ...run,
    ...(run.status === "running" || run.status === "awaiting_approval" ? {
      status: "error" as const, summary: reason, completedAt: now, durationMs: now - run.startedAt,
    } : {}),
    ...(run.children ? { children: finishToolRuns(run.children, reason, now) } : {}),
  }));
}

export function applyToolDecision(runs: ToolRun[] | undefined, commandId: string, decision: "approve" | "reject"): ToolRun[] {
  return (runs ?? []).map((run) => ({
    ...run,
    ...(run.commandId === commandId ? { status: decision === "approve" ? "running" as const : "rejected" as const } : {}),
    ...(run.children ? { children: applyToolDecision(run.children, commandId, decision) } : {}),
  }));
}
