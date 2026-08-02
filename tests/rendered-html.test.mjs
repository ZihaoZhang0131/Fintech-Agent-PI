import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: pathname.startsWith("/api/") ? "application/json" : "text/html" },
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the Pi research agent workspace", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>知衡 · 本地投研 Agent<\/title>/i);
  assert.match(html, /今天想研究/);
  assert.match(html, /新建研究对话/);
  assert.match(html, /产出物/);
  assert.match(html, /等待 Agent 产出/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/);
});

test("exposes a local health endpoint without exposing the key", async () => {
  const response = await render("/api/health");
  assert.equal(response.status, 200);
  const body = await response.text();
  assert.match(body, /"provider":"DeepSeek"/);
  assert.match(body, /"keyConfigured":(true|false)/);
  assert.doesNotMatch(body, /sk-/);
});

test("removes the disposable starter preview", async () => {
  await assert.rejects(access(new URL("app/_sites-preview", projectRoot)));
});
