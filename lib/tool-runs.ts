export type ToolSource = {
  title: string;
  url: string;
  publishedDate?: string;
};

export type ToolRunStatus = "running" | "success" | "error";

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
};

export type ToolStartEvent = {
  type: "tool_start";
  toolCallId: string;
  toolName: string;
  label: string;
  query?: string;
  startedAt: number;
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
    status: event.isError ? "error" : "success",
    startedAt: existing?.startedAt ?? event.completedAt - (event.durationMs ?? 0),
    completedAt: event.completedAt,
    durationMs: event.durationMs,
    resultCount: event.resultCount,
    summary: event.summary,
    sources: event.sources,
  };

  if (!existing) return [...current, completed];
  return current.map((run) => (run.toolCallId === event.toolCallId ? completed : run));
}
