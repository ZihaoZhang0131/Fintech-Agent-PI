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
  id?: string;
  origin?: "bundled" | "custom";
  name: string;
  label: string;
  description: string;
  detail: string;
  resources?: Array<{
    path: string;
    name: string;
    size: number;
    extension: string;
    category: "script" | "reference" | "asset" | "file";
    isText: boolean;
  }>;
  sourcePath: string;
  defaultEnabled: boolean;
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
