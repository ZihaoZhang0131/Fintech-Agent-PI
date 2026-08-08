import type { AgentProfile, AgentRoleId } from "@/lib/agent-profiles";

export type CapabilityKind = "skill" | "tool" | "mcp";

export type McpConnectionStatus =
  | "not_installed"
  | "connecting"
  | "connected"
  | "error"
  | "stopped";

export type McpCapabilityTool = {
  name: string;
  title?: string;
  description?: string;
  inputSchema: Record<string, unknown>;
};

export type CapabilityItem = {
  kind: CapabilityKind;
  name: string;
  label: string;
  description: string;
  detail: string;
  sourcePath: string;
  defaultEnabled: boolean;
  allowedTools?: string[];
  version?: string;
  homepage?: string;
  transport?: "stdio";
  free?: boolean;
  requiresApiKey?: boolean;
  status?: McpConnectionStatus;
  error?: string;
  mcpTools?: McpCapabilityTool[];
};

export type CapabilityCatalog = {
  skills: CapabilityItem[];
  tools: CapabilityItem[];
  mcps: CapabilityItem[];
  agents: AgentRoleCapability[];
};

export type AgentRoleCapability = {
  id: AgentRoleId;
  label: string;
  description: string;
  maxSkills: string[];
  maxTools: string[];
  maxMcps: string[];
  defaultProfile: AgentProfile;
  isMain: boolean;
};
