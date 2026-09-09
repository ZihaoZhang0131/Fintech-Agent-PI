import type { ProjectAgentConfig, AgentModelOverride } from "./agent-profiles";
export type WorkflowRequirement = {
  tools: string[];
  skills: string[];
  mcps: string[];
};
export type WorkflowOutputSpec = {
  id: string;
  kind: "text" | "file";
  path?: string;
  required: boolean;
};
export type WorkflowNode = {
  id: string;
  title: string;
  agentId: string;
  task: string;
  dependencies: string[];
  acceptance: string;
  requires: WorkflowRequirement;
  outputs: WorkflowOutputSpec[];
};
export type WorkflowPlan = { title: string; nodes: WorkflowNode[] };
export type WorkflowResult = {
  status: "completed" | "blocked";
  summary: string;
  text: string;
  sources: string[];
  artifacts: string[];
  issues: string[];
  nextAction?: "continue" | "replan" | "input";
  dataAsOf?: string;
};
export type WorkflowAttempt = {
  id: string;
  nodeId: string;
  version: number;
  status: string;
  startedAt: number;
  endedAt?: number;
  error?: string;
  result?: WorkflowResult;
  traceId?: string;
  input?: string;
  nodeRevision?: number;
  retryDirective?: string;
};
export type WorkflowOperation = {
  id: string;
  attemptId: string;
  tool: string;
  arguments: unknown;
  status: string;
  result?: unknown;
  error?: string;
  commandId?: string;
  command?: string;
  permissionMode?: "sandbox" | "full";
  fingerprint?: string;
  outcome?: "success" | "command_failed" | "rejected" | "cancelled";
  exitCode?: number | null;
  reusedFrom?: string;
};
export type WorkflowRun = {
  schemaVersion?: number;
  conversationId?: string;
  id: string;
  workspaceId: string;
  workspaceName: string;
  input: string;
  title: string;
  status: string;
  version: number;
  seq: number;
  createdAt: number;
  updatedAt: number;
  plan: WorkflowPlan | null;
  revisions: {
    version: number;
    plan: WorkflowPlan;
    reason: string;
    createdAt: number;
    accepted?: Record<string, string>;
  }[];
  attempts: WorkflowAttempt[];
  accepted: Record<string, string>;
  operations: WorkflowOperation[];
  feedback: string[];
  summary?: string;
  error?: string;
  config: ProjectAgentConfig;
  model: AgentModelOverride;
  plannerModel: AgentModelOverride;
  plannerPrompt: string;
  mode: "adaptive" | "fixed";
  templateId?: string;
  parameters: Record<string, string>;
  limits: {
    maxNodes: number;
    maxRevisions: number;
    maxAttempts: number;
    timeoutMs: number;
    concurrency: number;
  };
  traces: string[];
  nodeRevisions?: Record<string, number>;
  retryDirectives?: Record<string, { reason: string; directive: string; createdAt: number }>;
  plannerHandledAttempts?: Record<string, number>;
  checkpoints?: Array<{
    id: string;
    planVersion: number;
    nodeRevisions: Record<string, number>;
    accepted: Record<string, string>;
    createdAt: number;
  }>;
  pendingApprovals?: Array<{ commandId: string; nodeId: string }>;
  pendingPatch?: {
    patches: Array<
      | { op: "add"; node: WorkflowNode }
      | { op: "update"; nodeId: string; changes: Partial<WorkflowNode> }
      | { op: "remove"; nodeId: string }
    >;
    invalidateNodeIds: string[];
  };
};
export type WorkflowTemplate = {
  id: string;
  schemaVersion?: number;
  name: string;
  description: string;
  archived: boolean;
  sourceWorkspaceId: string;
  versions: {
    version: number;
    schemaVersion?: number;
    plan: WorkflowPlan;
    task: string;
    parameters: Record<string, string>;
    roles: {
      id: string;
      label: string;
      description: string;
      enabledTools: string[];
      enabledSkills: string[];
      enabledMcps: string[];
    }[];
  }[];
  updatedAt: number;
};
