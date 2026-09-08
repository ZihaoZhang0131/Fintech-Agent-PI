import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdtemp, mkdir, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { createChatStore, MAX_CONVERSATION_BYTES, validateChatConversation } from "../server/chat-store.mjs";
import { createLocalRuntimeHandler, registerWorkspace } from "../server/local-runtime.mjs";

function conversation(overrides = {}) {
  const now = overrides.updatedAt ?? 1_000;
  return {
    id: overrides.id ?? "conversation-12345678",
    projectId: overrides.projectId ?? "workspace-12345678",
    title: overrides.title ?? "持久化测试",
    messages: overrides.messages ?? [
      { id: "message-user-12345678", role: "user", content: "问题", createdAt: now - 20 },
      {
        id: "message-assistant-12345678",
        role: "assistant",
        content: "答案",
        createdAt: now - 10,
        tokenUsage: 42,
        traceId: "trace-12345678",
        toolRuns: [{
          toolCallId: "parent-tool",
          toolName: "delegate_agent",
          label: "数据 Agent",
          status: "success",
          startedAt: now - 9,
          children: [{
            toolCallId: "child-tool",
            toolName: "web_search",
            label: "搜索",
            status: "success",
            startedAt: now - 8,
          }],
        }],
      },
    ],
    updatedAt: now,
    bashApprovalMode: "auto",
    bashPermissionMode: "sandbox",
    ...overrides,
  };
}

test("chat store persists complete conversations across reopen", async (t) => {
  const directory = await mkdtemp(path.join(tmpdir(), "pi-chat-store-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  let store = createChatStore(directory);
  const value = conversation();
  assert.deepEqual(store.put(value), value);
  assert.deepEqual(store.list(), [value]);
  assert.equal((await stat(store.databasePath)).mode & 0o777, 0o600);
  store.close();

  store = createChatStore(directory);
  assert.deepEqual(store.list(), [value]);
  store.close();
});

test("legacy import is atomic, idempotent, ordered and only replaces older snapshots", async (t) => {
  const directory = await mkdtemp(path.join(tmpdir(), "pi-chat-import-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const store = createChatStore(directory);
  t.after(() => store.close());
  assert.equal(store.migrationRequired(), true);
  const first = conversation();
  const second = conversation({ id: "conversation-87654321", updatedAt: 2_000, title: "更新的会话" });
  assert.equal(store.importLegacy([first, second]).imported, 2);
  assert.equal(store.migrationRequired(), false);
  assert.deepEqual(store.list().map((item) => item.id), [second.id, first.id]);
  assert.equal(store.importLegacy([{ ...first, updatedAt: 999, title: "过期标题" }]).imported, 0);
  assert.equal(store.list().find((item) => item.id === first.id).title, first.title);
  assert.equal(store.importLegacy([{ ...first, updatedAt: 3_000, title: "最新标题" }]).imported, 1);
  assert.equal(store.list()[0].title, "最新标题");

  assert.throws(
    () => store.importLegacy([conversation({ id: "bad" })]),
    /会话 ID 无效/,
  );
  assert.equal(store.list().length, 2);
});

test("chat store deletion and validation preserve the previous valid snapshot", async (t) => {
  const directory = await mkdtemp(path.join(tmpdir(), "pi-chat-delete-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const store = createChatStore(directory);
  t.after(() => store.close());
  const first = conversation();
  const second = conversation({ id: "conversation-87654321", projectId: first.projectId });
  store.put(first);
  store.put(second);
  assert.throws(() => store.put({ ...first, messages: [{ role: "user" }] }), /消息 ID 无效/);
  assert.deepEqual(store.list().find((item) => item.id === first.id), first);
  assert.throws(
    () => store.put(conversation({
      id: first.id,
      updatedAt: 4_000,
      messages: [{
        id: "message-large-12345678",
        role: "user",
        content: "x".repeat(MAX_CONVERSATION_BYTES),
        createdAt: 4_000,
      }],
    })),
    (error) => error?.status === 413,
  );
  assert.deepEqual(store.list().find((item) => item.id === first.id), first);
  assert.equal(store.removeWorkspace(first.projectId), 2);
  assert.deepEqual(store.list(), []);
  assert.deepEqual(store.remove(first.id), { deleted: first.id });
  assert.throws(() => validateChatConversation({ ...first, title: "" }), /标题无效/);
});

test("local runtime exposes authenticated chat CRUD and cleans conversations with a workspace", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "pi-chat-http-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const dataDirectory = path.join(root, "data");
  const workspaceDirectory = path.join(root, "workspace");
  await mkdir(workspaceDirectory);
  const workspace = await registerWorkspace(dataDirectory, workspaceDirectory);
  const handler = createLocalRuntimeHandler({
    dataDirectory,
    token: "chat-token",
    mcpManager: { async listServers() { return []; }, async close() {} },
  });
  const server = createServer(handler);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(async () => {
    await handler.close();
    await new Promise((resolve) => server.close(resolve));
  });
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  const headers = { Authorization: "Bearer chat-token", "Content-Type": "application/json" };
  const value = conversation({ projectId: workspace.id });

  const unauthorized = await fetch(`${baseUrl}/chat/conversations`);
  assert.equal(unauthorized.status, 401);
  const initial = await fetch(`${baseUrl}/chat/conversations`, { headers }).then((response) => response.json());
  assert.equal(initial.migrationRequired, true);
  const imported = await fetch(`${baseUrl}/chat/conversations/import`, {
    method: "POST", headers, body: JSON.stringify({ conversations: [value] }),
  });
  assert.equal(imported.status, 200);
  assert.equal((await imported.json()).imported, 1);

  const updated = { ...value, title: "更新后", updatedAt: 3_000 };
  const put = await fetch(`${baseUrl}/chat/conversations/${value.id}`, {
    method: "PUT", headers, body: JSON.stringify(updated),
  });
  assert.equal(put.status, 200);
  const listed = await fetch(`${baseUrl}/chat/conversations`, { headers }).then((response) => response.json());
  assert.deepEqual(listed.conversations, [updated]);

  const mismatch = await fetch(`${baseUrl}/chat/conversations/conversation-other-1234`, {
    method: "PUT", headers, body: JSON.stringify(updated),
  });
  assert.equal(mismatch.status, 409);
  const removedWorkspace = await fetch(`${baseUrl}/workspaces/${workspace.id}`, { method: "DELETE", headers });
  assert.equal(removedWorkspace.status, 200);
  const afterRemoval = await fetch(`${baseUrl}/chat/conversations`, { headers }).then((response) => response.json());
  assert.deepEqual(afterRemoval.conversations, []);
});
