import type { ToolRun } from "./tool-runs";

export type ChatStopReason = "pending" | "stop" | "length" | "toolUse" | "error" | "aborted";

type Message = {
  id: string; role: "user" | "assistant"; content: string; createdAt: number;
  turnId?: string; toolRuns?: ToolRun[]; durationMs?: number;
  stopReason?: ChatStopReason;
  traceId?: string; traceStatus?: "recording" | "recorded" | "unavailable";
};
export type DisplayTurn = { id: string; status: string; startedAt?: number; endedAt?: number; durationMs?: number };

/** Display only: never rewrite the model transcript or persisted messages. */
export function projectChatDisplay<T extends Message>(messages: T[], activeTurn?: DisplayTurn, turns: DisplayTurn[] = []) {
  const turnById = new Map(turns.map(turn => [turn.id, turn]));
  if (activeTurn) turnById.set(activeTurn.id, activeTurn);
  const groups = new Map<string, T[]>();
  for (const message of messages) if (message.role === "assistant") {
    const key = message.turnId ?? message.id;
    groups.set(key, [...(groups.get(key) ?? []), message]);
  }
  const visibleAssistantIds = new Set<string>();
  const emptyFinalIds = new Set<string>();
  for (const group of groups.values()) {
    const first = group[0];
    if (!first.turnId) {
      visibleAssistantIds.add(first.id);
      continue;
    }
    const turn = turnById.get(first.turnId);
    if (turn?.status === "running" || turn?.status === "queued") continue;
    if (turn?.status === "failed" || turn?.status === "interrupted") continue;
    const explicitFinal = [...group].reverse().find(part =>
      (part.stopReason === "stop" || part.stopReason === "length") && Boolean(part.content),
    );
    if (explicitFinal) {
      visibleAssistantIds.add(explicitFinal.id);
      continue;
    }
    const hasStopMetadata = group.some(part => part.stopReason !== undefined);
    if (!hasStopMetadata) {
      const historicalFinal = [...group].reverse().find(part => Boolean(part.content));
      if (historicalFinal) visibleAssistantIds.add(historicalFinal.id);
      continue;
    }
    if (turn?.status === "completed") emptyFinalIds.add(group.at(-1)!.id);
  }
  const rows: Array<{ message: T; parts: T[]; header: boolean; running: boolean; indicator: boolean; truncated: boolean; emptyFinal: boolean; startedAt: number; durationMs?: number; toolRuns: ToolRun[]; owners: Map<string, string> }> = [];
  for (const message of messages) {
    const group = message.role === "assistant" ? groups.get(message.turnId ?? message.id)! : [message];
    const first = group[0];
    const turn = message.turnId ? turnById.get(message.turnId) : undefined;
    const running = message.role === "assistant" && (turn?.status === "running" || turn?.status === "queued");
    const visible = message.role !== "assistant" || visibleAssistantIds.has(message.id);
    const previous = rows.at(-1);
    if (message.role === "assistant" && message.turnId && previous?.message.role === "assistant" && previous.message.turnId === message.turnId) {
      if (visible) previous.parts.push(message);
      previous.indicator = running && message.id === group.at(-1)?.id;
      previous.truncated ||= visible && message.stopReason === "length";
      previous.emptyFinal ||= emptyFinalIds.has(message.id);
      continue;
    }
    const owners = new Map<string, string>();
    function merge(runs: ToolRun[], incoming: ToolRun[], owner: string): ToolRun[] {
      const result = new Map(runs.map(run => [run.toolCallId, run]));
      for (const run of incoming) {
        owners.set(run.toolCallId, owner);
        const old = result.get(run.toolCallId);
        result.set(run.toolCallId, { ...old, ...run, ...(old?.children || run.children ? { children: merge(old?.children ?? [], run.children ?? [], owner) } : {}) });
      }
      return [...result.values()];
    }
    let toolRuns: ToolRun[] = [];
    for (const part of group) toolRuns = merge(toolRuns, part.toolRuns ?? [], part.id);
    const startedAt = turn?.startedAt ?? messages.find(m => m.role === "user" && m.turnId && m.turnId === message.turnId)?.createdAt ?? first.createdAt;
    const durationMs = turn?.durationMs ?? (turn?.endedAt !== undefined ? turn.endedAt - startedAt : [...group].reverse().find(m => m.durationMs !== undefined)?.durationMs);
    rows.push({
      message,
      parts: visible ? [message] : [],
      header: message.id === first.id,
      running,
      indicator: running && message.id === group.at(-1)?.id,
      truncated: visible && message.stopReason === "length",
      emptyFinal: emptyFinalIds.has(message.id),
      startedAt,
      durationMs,
      toolRuns,
      owners,
    });
  }
  return rows.filter(row =>
    row.message.role === "user" || row.header || row.parts.length > 0 || row.indicator || row.emptyFinal,
  );
}
