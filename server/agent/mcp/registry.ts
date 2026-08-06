import servers from "./servers.json" with { type: "json" };

export type McpServerStatus =
  | "not_installed"
  | "connecting"
  | "connected"
  | "error"
  | "stopped";

export type McpToolDefinition = {
  name: string;
  title?: string;
  description?: string;
  inputSchema: Record<string, unknown>;
};

export type McpServerDefinition = (typeof servers)[number];

export const MCP_SERVERS = servers satisfies McpServerDefinition[];
export const MCP_SERVER_IDS = MCP_SERVERS.map((server) => server.id);

export function findMcpServer(serverId: string) {
  return MCP_SERVERS.find((server) => server.id === serverId);
}
