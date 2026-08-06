import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { createMcpManager } from "../server/mcp-manager.mjs";

const fixture = fileURLToPath(new URL("fixtures/fake-mcp-server.mjs", import.meta.url));
const fakeServer = {
  id: "fake-akshare",
  label: "Fake AKShare",
  description: "Test MCP",
  version: "1.0.0",
  homepage: "https://example.test",
  transport: "stdio",
  free: true,
  requiresApiKey: false,
  defaultEnabled: true,
  command: process.execPath,
  args: [fixture],
};

test("MCP manager discovers allowlisted stdio tools, calls them, and strips app secrets", async (t) => {
  const previousSecret = process.env.DEEPSEEK_API_KEY;
  process.env.DEEPSEEK_API_KEY = "must-not-leak";
  const manager = createMcpManager({ root: path.dirname(fixture), servers: [fakeServer] });
  t.after(async () => {
    await manager.close();
    if (previousSecret === undefined) delete process.env.DEEPSEEK_API_KEY;
    else process.env.DEEPSEEK_API_KEY = previousSecret;
  });

  const [server] = await manager.listServers({ connect: true });
  assert.equal(server.status, "connected");
  assert.deepEqual(server.tools.map((tool) => tool.name), ["get_hist_data"]);

  const response = await manager.callTool("fake-akshare", "get_hist_data", {
    symbol: "600519",
    recent_n: 5,
  });
  assert.equal(response.truncated, false);
  assert.match(response.result.content[0].text, /600519/);
  assert.doesNotMatch(response.result.content[0].text, /must-not-leak/);

  const oversized = await manager.callTool("fake-akshare", "get_hist_data", { recent_n: 999 });
  assert.equal(oversized.truncated, true);
  assert.equal(typeof oversized.result, "string");
  assert.ok(Buffer.byteLength(oversized.result) <= 200 * 1024);

  await assert.rejects(
    manager.callTool("fake-akshare", "unknown_tool", {}),
    /不存在或未被服务公开/,
  );
});
