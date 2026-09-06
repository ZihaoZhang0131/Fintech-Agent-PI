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
  context?: TraceContext;
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
  messages?: TraceMessage[];
};

export type TraceListResponse = {
  traces: TraceRunSummary[];
  nextCursor?: string;
};

export type TraceContext = {
  mode: "chat" | "workflow";
  workflowRunId?: string;
  role?: "main" | "planner" | "node";
  nodeId?: string;
  nodeTitle?: string;
  agentId?: string;
  agentLabel?: string;
  attemptId?: string;
  attemptNumber?: number;
  planVersion?: number;
  legacy?: boolean;
};
export type TraceMessage = {
  id: string;
  traceId: string;
  spanId?: string;
  taskId?: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: number;
  model?: string;
  label?: string;
  kind?: string;
  partial?: boolean;
  legacy?: boolean;
};
export type TraceTask = {
  id: string;
  sessionKey: string;
  question: string;
  status: string;
  startedAt: number;
  updatedAt: number;
  endedAt?: number;
  traceIds: string[];
  tools: number;
  tokens?: number;
  warnings: number;
  incomplete?: boolean;
  number: number;
};
export type TraceSession = {
  id: string;
  conversationId?: string;
  mode: "chat" | "workflow";
  title: string;
  updatedAt: number;
  status: string;
  turns: number;
  tools: number;
  tokens?: number;
  warnings: number;
  incomplete?: boolean;
};
export type TraceInvocation = {
  id: string;
  sessionKey: string;
  conversationId?: string;
  sessionTitle: string;
  mode: "chat" | "workflow";
  taskId: string;
  traceId?: string;
  spanId?: string;
  label: string;
  question: string;
  status: string;
  startedAt: number;
  updatedAt: number;
  endedAt?: number;
  tools: number;
  attemptNumber?: number;
  planVersion?: number;
};
export type TraceTaskDetail = {
  observedAt?: number;
  task: TraceTask;
  traces: TraceDetail[];
  attempts: Array<{
    id: string;
    nodeId: string;
    title: string;
    agentLabel: string;
    version: number;
    number: number;
    accepted: boolean;
    status: string;
    startedAt: number;
    endedAt?: number;
    traceId?: string;
    dependencies: string[];
    input?: unknown;
    output?: unknown;
    error?: unknown;
  }>;
};
export type TracePageResult<T> = { items: T[]; nextCursor?: string };
