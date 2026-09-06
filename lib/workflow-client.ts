import type { WorkflowRun } from "./workflow-types";
export const workflowBase = "/api/local/workflows";
export const terminalWorkflow = new Set(["completed", "cancelled", "failed"]);
export type WorkflowConversation = {
  id: string;
  workspaceId: string;
  title: string;
  runIds: string[];
  updatedAt: number;
};
export type WorkflowMessage = {
  id: string;
  runId: string;
  role: "user" | "assistant";
  kind: "text" | "plan" | "question" | "status";
  content: string;
  version?: number;
  createdAt?: number;
};
export type WorkflowSnapshot = {
  conversation: WorkflowConversation;
  messages: WorkflowMessage[];
  runs: WorkflowRun[];
};
export async function workflowApi<T>(path: string, body?: unknown): Promise<T> {
  const r = await fetch(`${workflowBase}${path}`, {
    cache: "no-store",
    ...(body
      ? {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      : {}),
  });
  const v = (await r.json()) as T & { message?: string };
  if (!r.ok) throw new Error(v.message ?? "Workflow 请求失败");
  return v;
}
export function workflowSettings() {
  try {
    return JSON.parse(localStorage.getItem("workflow:settings:v1") ?? "{}");
  } catch {
    return {};
  }
}
export function workflowChanged() {
  window.dispatchEvent(new Event("workflow-conversations-changed"));
}
