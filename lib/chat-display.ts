import type { ToolRun } from "./tool-runs";

type Message = {
  id: string; role: "user" | "assistant"; content: string; createdAt: number;
  turnId?: string; toolRuns?: ToolRun[]; durationMs?: number;
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
  const rows: Array<{ message: T; parts: T[]; header: boolean; running: boolean; indicator: boolean; startedAt: number; durationMs?: number; toolRuns: ToolRun[]; owners: Map<string, string> }> = [];
  for (const message of messages) {
    const group = message.role === "assistant" ? groups.get(message.turnId ?? message.id)! : [message];
    const first = group[0];
    const turn = message.turnId ? turnById.get(message.turnId) : undefined;
    const running = message.role === "assistant" && (turn?.status === "running" || turn?.status === "queued");
    const previous = rows.at(-1);
    if (message.role === "assistant" && message.turnId && previous?.message.role === "assistant" && previous.message.turnId === message.turnId) {
      previous.parts.push(message);
      previous.indicator = running && message.id === group.at(-1)?.id;
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
    rows.push({ message, parts: [message], header: message.id === first.id, running, indicator: running && message.id === group.at(-1)?.id, startedAt, durationMs, toolRuns, owners });
  }
  return rows;
}
