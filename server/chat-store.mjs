import { chmodSync, mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const MAX_CONVERSATION_BYTES = 16 * 1024 * 1024;
const ID_PATTERN = /^[A-Za-z0-9_-]{8,200}$/;
const LEGACY_MIGRATION_KEY = "legacy-local-storage-v1";

function fail(message, status = 400) {
  throw Object.assign(new Error(message), { status });
}

function requireId(value, label = "会话 ID") {
  if (typeof value !== "string" || !ID_PATTERN.test(value)) fail(`${label} 无效。`);
  return value;
}

function requireTimestamp(value, label) {
  if (!Number.isSafeInteger(value) || value < 0) fail(`${label}无效。`);
  return value;
}

function validateToolRuns(value, depth = 0) {
  if (value === undefined) return;
  if (!Array.isArray(value) || depth > 8) fail("工具记录无效。");
  for (const run of value) {
    if (!run || typeof run !== "object" || Array.isArray(run)) fail("工具记录无效。");
    if (typeof run.toolCallId !== "string" || typeof run.toolName !== "string" || typeof run.label !== "string") {
      fail("工具记录缺少必要字段。");
    }
    if (run.children !== undefined) validateToolRuns(run.children, depth + 1);
  }
}

export function validateChatConversation(value, expectedId) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail("会话数据无效。");
  const id = requireId(value.id);
  if (expectedId !== undefined && id !== expectedId) fail("会话 ID 与路径不一致。", 409);
  const projectId = requireId(value.projectId, "项目 ID");
  if (typeof value.title !== "string" || !value.title.trim() || value.title.length > 500) {
    fail("会话标题无效。");
  }
  if (!Array.isArray(value.messages) || value.messages.length > 20_000) fail("会话消息无效。");
  for (const message of value.messages) {
    if (!message || typeof message !== "object" || Array.isArray(message)) fail("会话消息无效。");
    requireId(message.id, "消息 ID");
    if (message.role !== "user" && message.role !== "assistant") fail("消息角色无效。");
    if (typeof message.content !== "string") fail("消息内容无效。");
    requireTimestamp(message.createdAt, "消息时间");
    validateToolRuns(message.toolRuns);
  }
  const updatedAt = requireTimestamp(value.updatedAt, "会话更新时间");
  if (!['ask', 'auto'].includes(value.bashApprovalMode)) fail("Bash 审批模式无效。");
  if (!['sandbox', 'full'].includes(value.bashPermissionMode)) fail("Bash 权限模式无效。");

  const body = JSON.stringify({
    ...value,
    id,
    projectId,
    title: value.title.trim(),
    updatedAt,
  });
  if (Buffer.byteLength(body, "utf8") > MAX_CONVERSATION_BYTES) {
    fail("单个会话超过 16 MiB 限制。", 413);
  }
  return { id, projectId, updatedAt, body, value: JSON.parse(body) };
}

export function createChatStore(dataDirectory) {
  mkdirSync(dataDirectory, { recursive: true, mode: 0o700 });
  const databasePath = path.join(dataDirectory, "chat.sqlite");
  const database = new DatabaseSync(databasePath);
  try {
    chmodSync(databasePath, 0o600);
  } catch {
    // Best effort on platforms without POSIX permissions.
  }
  database.exec("PRAGMA journal_mode = WAL");
  database.exec("PRAGMA busy_timeout = 3000");
  database.exec(`
    CREATE TABLE IF NOT EXISTS chat_conversations (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      updated_at INTEGER NOT NULL,
      body TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_chat_conversations_updated
      ON chat_conversations(updated_at DESC, id DESC);
    CREATE INDEX IF NOT EXISTS idx_chat_conversations_workspace
      ON chat_conversations(workspace_id, updated_at DESC);
    CREATE TABLE IF NOT EXISTS chat_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  const upsert = database.prepare(`
    INSERT INTO chat_conversations(id, workspace_id, updated_at, body)
    VALUES(?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      workspace_id=excluded.workspace_id,
      updated_at=excluded.updated_at,
      body=excluded.body
  `);

  function list() {
    return database
      .prepare("SELECT body FROM chat_conversations ORDER BY updated_at DESC, id DESC")
      .all()
      .map((row) => JSON.parse(row.body));
  }

  function put(value, expectedId) {
    const conversation = validateChatConversation(value, expectedId);
    upsert.run(conversation.id, conversation.projectId, conversation.updatedAt, conversation.body);
    return conversation.value;
  }

  function remove(id) {
    const conversationId = requireId(id);
    database.prepare("DELETE FROM chat_conversations WHERE id=?").run(conversationId);
    return { deleted: conversationId };
  }

  function removeWorkspace(workspaceId) {
    const id = requireId(workspaceId, "项目 ID");
    const result = database.prepare("DELETE FROM chat_conversations WHERE workspace_id=?").run(id);
    return Number(result.changes);
  }

  function migrationRequired() {
    return !database.prepare("SELECT value FROM chat_meta WHERE key=?").get(LEGACY_MIGRATION_KEY);
  }

  function importLegacy(values) {
    if (!Array.isArray(values)) fail("待迁移的会话必须是数组。");
    const conversations = values.map((value) => validateChatConversation(value));
    database.exec("BEGIN IMMEDIATE");
    try {
      let imported = 0;
      for (const conversation of conversations) {
        const current = database
          .prepare("SELECT updated_at FROM chat_conversations WHERE id=?")
          .get(conversation.id);
        if (!current || conversation.updatedAt > current.updated_at) {
          upsert.run(conversation.id, conversation.projectId, conversation.updatedAt, conversation.body);
          imported += 1;
        }
      }
      database.prepare(`
        INSERT INTO chat_meta(key, value) VALUES(?, ?)
        ON CONFLICT(key) DO UPDATE SET value=excluded.value
      `).run(LEGACY_MIGRATION_KEY, String(Date.now()));
      database.exec("COMMIT");
      return { imported, conversations: list() };
    } catch (error) {
      database.exec("ROLLBACK");
      throw error;
    }
  }

  return {
    databasePath,
    list,
    put,
    remove,
    removeWorkspace,
    migrationRequired,
    importLegacy,
    close: () => database.close(),
  };
}

export { MAX_CONVERSATION_BYTES };
