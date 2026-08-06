import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport, getDefaultEnvironment } from "@modelcontextprotocol/client/stdio";

export const MCP_CALL_TIMEOUT_MS = 30_000;
export const MCP_MAX_RESULT_BYTES = 200 * 1024;
const MCP_MAX_STDERR_BYTES = 16 * 1024;

const moduleRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registryPath = path.join(moduleRoot, "server/agent/mcp/servers.json");

export async function loadMcpServerRegistry() {
  const parsed = JSON.parse(await readFile(registryPath, "utf8"));
  if (!Array.isArray(parsed)) throw new Error("MCP 注册表格式无效。");
  return parsed;
}

function publicServer(server, state) {
  return {
    id: server.id,
    label: server.label,
    description: server.description,
    version: server.version,
    homepage: server.homepage,
    transport: server.transport,
    free: server.free,
    requiresApiKey: server.requiresApiKey,
    defaultEnabled: server.defaultEnabled,
    status: state.status,
    error: state.error,
    tools: state.tools,
  };
}

function safeChildEnvironment() {
  const env = getDefaultEnvironment();
  for (const name of ["DEEPSEEK_API_KEY", "TAVILY_API_KEY", "LOCAL_RUNTIME_TOKEN"]) {
    delete env[name];
  }
  env.PYTHONUNBUFFERED = "1";
  return env;
}

function withTimeout(promise, timeoutMs, message) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(Object.assign(new Error(message), { status: 504 })), timeoutMs);
    timer.unref?.();
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function truncateJson(value) {
  const serialized = JSON.stringify(value);
  if (Buffer.byteLength(serialized) <= MCP_MAX_RESULT_BYTES) {
    return { value, truncated: false };
  }

  const suffix = "\n[MCP 返回内容超过 200KB，已截断。]";
  const accepted = Buffer.from(serialized).subarray(0, MCP_MAX_RESULT_BYTES - Buffer.byteLength(suffix));
  return { value: `${accepted.toString("utf8")}${suffix}`, truncated: true };
}

export function createMcpManager({
  root = moduleRoot,
  servers,
  createTransport = (options) => new StdioClientTransport(options),
  createClient = () => new Client({ name: "pi-research-agent", version: "0.1.0" }),
} = {}) {
  let registryPromise = servers ? Promise.resolve(servers) : loadMcpServerRegistry();
  const states = new Map();

  function stateFor(server) {
    if (!states.has(server.id)) {
      states.set(server.id, {
        status: "stopped",
        error: undefined,
        tools: [],
        client: undefined,
        transport: undefined,
        connecting: undefined,
        stderr: "",
      });
    }
    return states.get(server.id);
  }

  async function getServer(serverId) {
    const registry = await registryPromise;
    const server = registry.find((item) => item.id === serverId);
    if (!server) throw Object.assign(new Error("MCP 服务不存在。"), { status: 404 });
    return server;
  }

  function executable(server) {
    return path.isAbsolute(server.command) ? server.command : path.join(root, server.command);
  }

  async function installed(server) {
    try {
      await access(executable(server));
      return true;
    } catch {
      return false;
    }
  }

  async function disconnectState(state, status = "stopped") {
    const client = state.client;
    state.client = undefined;
    state.transport = undefined;
    state.connecting = undefined;
    state.status = status;
    if (client) await client.close().catch(() => undefined);
  }

  async function connect(serverId) {
    const server = await getServer(serverId);
    const state = stateFor(server);
    if (state.status === "connected" && state.client) return publicServer(server, state);
    if (state.connecting) return state.connecting;
    if (!(await installed(server))) {
      state.status = "not_installed";
      state.error = "尚未安装，请执行 npm run mcp:setup。";
      state.tools = [];
      return publicServer(server, state);
    }

    state.status = "connecting";
    state.error = undefined;
    state.stderr = "";
    state.connecting = (async () => {
      const transport = createTransport({
        command: executable(server),
        args: server.args ?? [],
        cwd: root,
        env: safeChildEnvironment(),
        stderr: "pipe",
        maxBufferSize: MCP_MAX_RESULT_BYTES * 2,
      });
      const stderr = transport.stderr;
      stderr?.on("data", (chunk) => {
        if (Buffer.byteLength(state.stderr) >= MCP_MAX_STDERR_BYTES) return;
        state.stderr += Buffer.from(chunk)
          .subarray(0, MCP_MAX_STDERR_BYTES - Buffer.byteLength(state.stderr))
          .toString("utf8");
      });
      const client = createClient();
      state.client = client;
      state.transport = transport;
      client.onclose = () => {
        if (state.status === "connected") {
          state.status = "stopped";
          state.error = "MCP 进程已停止，刷新状态后会尝试重连。";
          state.client = undefined;
          state.transport = undefined;
        }
      };
      try {
        await withTimeout(client.connect(transport), MCP_CALL_TIMEOUT_MS, "MCP 连接超时。");
        const listed = await withTimeout(client.listTools(), MCP_CALL_TIMEOUT_MS, "MCP 工具发现超时。");
        state.tools = listed.tools.map((tool) => ({
          name: tool.name,
          title: tool.title,
          description: tool.description,
          inputSchema: tool.inputSchema ?? { type: "object", properties: {} },
        }));
        state.status = "connected";
        state.error = undefined;
      } catch (error) {
        const detail = state.stderr.trim();
        state.status = "error";
        state.error = `${error instanceof Error ? error.message : String(error)}${detail ? `：${detail.slice(-500)}` : ""}`;
        state.tools = [];
        await disconnectState(state, "error");
      } finally {
        state.connecting = undefined;
      }
      return publicServer(server, state);
    })();
    return state.connecting;
  }

  async function listServers({ connect: shouldConnect = false } = {}) {
    const registry = await registryPromise;
    if (shouldConnect) await Promise.all(registry.map((server) => connect(server.id)));
    const snapshots = await Promise.all(
      registry.map(async (server) => {
        const state = stateFor(server);
        if (state.status === "stopped" && !(await installed(server))) {
          state.status = "not_installed";
          state.error = "尚未安装，请执行 npm run mcp:setup。";
        }
        return publicServer(server, state);
      }),
    );
    return snapshots;
  }

  async function callTool(serverId, toolName, args = {}) {
    const server = await getServer(serverId);
    const snapshot = await connect(serverId);
    const state = stateFor(server);
    if (snapshot.status !== "connected" || !state.client) {
      throw Object.assign(new Error(snapshot.error || "MCP 服务未连接。"), { status: 503 });
    }
    if (!state.tools.some((tool) => tool.name === toolName)) {
      throw Object.assign(new Error("MCP 工具不存在或未被服务公开。"), { status: 404 });
    }
    if (!args || typeof args !== "object" || Array.isArray(args)) {
      throw Object.assign(new Error("MCP 工具参数必须是对象。"), { status: 400 });
    }

    const result = await withTimeout(
      state.client.callTool({ name: toolName, arguments: args }),
      MCP_CALL_TIMEOUT_MS,
      "MCP 工具调用超过 30 秒，已终止等待。",
    );
    const bounded = truncateJson(result);
    return { result: bounded.value, truncated: bounded.truncated };
  }

  async function close() {
    const registry = await registryPromise;
    await Promise.all(registry.map((server) => disconnectState(stateFor(server))));
  }

  return { connect, listServers, callTool, close };
}
