import assert from "node:assert/strict";
import test from "node:test";

import { createWebSearchTool } from "../server/agent/tools/web-search.ts";

test("web_search calls Tavily with bounded search options and returns source details", async () => {
  let receivedQuery;
  let receivedOptions;
  const client = {
    async search(query, options) {
      receivedQuery = query;
      receivedOptions = options;
      return {
        query,
        requestId: "request-123",
        responseTime: 0.42,
        images: [],
        usage: { credits: 1 },
        results: Array.from({ length: 6 }, (_, index) => ({
          title: `来源 ${index + 1}`,
          url: `https://example.com/${index + 1}`,
          content: `  搜索摘要 ${index + 1}  `,
          score: 1 - index / 10,
          publishedDate: index === 0 ? "2026-08-01" : "",
        })),
      };
    },
  };

  const tool = createWebSearchTool({ client });
  const updates = [];
  const result = await tool.execute(
    "tool-call-1",
    { query: "贵州茅台 最新公告", topic: "finance", timeRange: "month" },
    undefined,
    (update) => updates.push(update),
  );

  assert.equal(tool.name, "web_search");
  assert.equal(receivedQuery, "贵州茅台 最新公告");
  assert.deepEqual(receivedOptions, {
    topic: "finance",
    timeRange: "month",
    searchDepth: "basic",
    maxResults: 5,
    includeAnswer: false,
    includeRawContent: false,
    includeUsage: true,
    timeout: 20,
  });
  assert.equal(updates.length, 1);
  assert.equal(result.details.provider, "tavily");
  assert.equal(result.details.sources.length, 5);
  assert.equal(result.details.sources[0].publishedDate, "2026-08-01");
  assert.match(result.content[0].text, /不可信外部资料/);
  assert.match(result.content[0].text, /https:\/\/example\.com\/1/);
  assert.doesNotMatch(result.content[0].text, /example\.com\/6/);
});

test("web_search stops before calling Tavily when the Agent run is aborted", async () => {
  let called = false;
  const tool = createWebSearchTool({
    client: {
      async search() {
        called = true;
        throw new Error("should not be called");
      },
    },
  });
  const controller = new AbortController();
  controller.abort();

  await assert.rejects(
    tool.execute("tool-call-2", { query: "测试搜索" }, controller.signal),
    (error) => error instanceof DOMException && error.name === "AbortError",
  );
  assert.equal(called, false);
});

