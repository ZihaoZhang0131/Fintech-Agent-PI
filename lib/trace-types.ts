export type TraceRunStatus =
  | "running"
  | "success"
  | "success_with_warnings"
  | "error"
  | "aborted"
  | "interrupted";

export type TraceSpanKind = "agent" | "turn" | "generation" | "tool";
export type TraceSpanStatus = "running" | "success" | "error" | "cancelled";

export type TraceUsage = {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
  reasoning?: number;
  totalTokens: number;
  cost: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
    total: number;
  };
};

export type TraceStats = {
  turns: number;
  generations: number;
  tools: number;
  subAgents: number;
  warnings: number;
};

export type TraceRunSummary = {
  id: string;
  schemaVersion: number;
  workspaceId: string;
  conversationId?: string;
  status: TraceRunStatus;
  startedAt: number;
  endedAt?: number;
  durationMs?: number;
  lastEventAt: number;
  modelProvider?: string;
  modelId?: string;
  question: string;
  output?: string;
  capabilities?: unknown;
  usage?: TraceUsage;
  error?: unknown;
  stats: TraceStats;
};

export type TraceSpan = {
  id: string;
  traceId: string;
  parentSpanId?: string;
  kind: TraceSpanKind;
  name: string;
  agentId?: string;
  agentLabel?: string;
  toolCallId?: string;
  status: TraceSpanStatus;
  startedAt: number;
  endedAt?: number;
  durationMs?: number;
  input?: unknown;
  output?: unknown;
  error?: unknown;
  attributes?: unknown;
};

export type TraceEvent = {
  traceId: string;
  seq: number;
  spanId?: string;
  type: string;
  timestamp: number;
  payload?: unknown;
};

export type TraceDetail = {
  run: TraceRunSummary;
  spans: TraceSpan[];
  events: TraceEvent[];
};

export type TraceListResponse = {
  traces: TraceRunSummary[];
  nextCursor?: string;
};
