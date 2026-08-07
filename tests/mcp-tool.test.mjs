import assert from "node:assert/strict";
import test from "node:test";

import {
  adaptMcpInputSchema,
  clampMcpArguments,
  createMcpAgentTools,
  mcpAgentToolName,
} from "../server/agent/tools/mcp.ts";

test("MCP tools use collision-safe names and bounded input schemas", () => {
  assert.equal(
    mcpAgentToolName("akshare-one", "get_hist_data"),
    "mcp__akshare_one__get_hist_data",
  );
  const history = adaptMcpInputSchema("get_hist_data", {
    type: "object",
    properties: { recent_n: { type: "integer" } },
  });
  assert.equal(history.properties.recent_n.maximum, 200);

  const realtime = adaptMcpInputSchema("get_realtime_data", {
    type: "object",
    properties: { symbol: { type: "string" } },
  });
  assert.deepEqual(realtime.required, ["symbol"]);
  assert.throws(() => clampMcpArguments("get_realtime_data", { symbol: "" }), /必须提供/);
  const ranked = adaptMcpInputSchema("get_market_realtime_top", {
    type: "object",
    properties: { top_n: { type: "integer" } },
  });
  assert.equal(ranked.properties.top_n.maximum, 100);
  assert.equal(clampMcpArguments("get_market_realtime_top", { top_n: 999 }).top_n, 100);
  assert.equal(clampMcpArguments("get_financial_metrics", { recent_n: 100 }).recent_n, 20);
});

test("enabled MCP definitions become namespaced PI tools and call the local runtime", async (t) => {
  const previousUrl = process.env.LOCAL_RUNTIME_URL;
  const previousToken = process.env.LOCAL_RUNTIME_TOKEN;
  const previousFetch = globalThis.fetch;
  process.env.LOCAL_RUNTIME_URL = "http://127.0.0.1:4318";
  process.env.LOCAL_RUNTIME_TOKEN = "runtime-token";
  globalThis.fetch = async (url, init) => {
    assert.match(String(url), /\/mcp\/servers\/akshare-one\/tools\/get_hist_data\/call$/);
    assert.equal(init.headers.Authorization, "Bearer runtime-token");
    return Response.json({
      result: { content: [{ type: "text", text: "[{\"close\":1308.55}]" }], isError: false },
      truncated: false,
    });
  };
  t.after(() => {
    globalThis.fetch = previousFetch;
    if (previousUrl === undefined) delete process.env.LOCAL_RUNTIME_URL;
    else process.env.LOCAL_RUNTIME_URL = previousUrl;
    if (previousToken === undefined) delete process.env.LOCAL_RUNTIME_TOKEN;
    else process.env.LOCAL_RUNTIME_TOKEN = previousToken;
  });

  const [tool] = createMcpAgentTools([
    {
      id: "akshare-one",
      label: "AKShare One",
      status: "connected",
      tools: [
        {
          name: "get_hist_data",
          description: "history",
          inputSchema: {
            type: "object",
            properties: { symbol: { type: "string" }, recent_n: { type: "integer" } },
            required: ["symbol"],
          },
        },
      ],
    },
  ]);
  assert.equal(tool.name, "mcp__akshare_one__get_hist_data");
  const result = await tool.execute("call-1", { symbol: "600519", recent_n: 5 });
  assert.equal(result.details.serverId, "akshare-one");
  assert.equal(result.details.externalToolName, "get_hist_data");
  assert.match(result.content[0].text, /外部公开数据源/);
  assert.match(result.content[0].text, /AKShare One/);
  assert.match(result.content[1].text, /1308\.55/);
});
