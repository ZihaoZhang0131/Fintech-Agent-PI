import type { ProjectAgentConfig, AgentModelOverride } from "./agent-profiles";
export type WorkflowNode = {
  id: string;
  title: string;
  agentId: string;
  task: string;
  dependencies: string[];
  acceptance: string;
};
export type WorkflowPlan = { title: string; nodes: WorkflowNode[] };
export type WorkflowResult = {
  status: "completed" | "blocked";
  summary: string;
  text: string;
  sources: string[];
  artifacts: string[];
  issues: string[];
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
};
export type WorkflowRun = {
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
  pendingApprovals?: Array<{ commandId: string; nodeId: string }>;
};
export type WorkflowTemplate = {
  id: string;
  name: string;
  description: string;
  archived: boolean;
  sourceWorkspaceId: string;
  versions: {
    version: number;
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
