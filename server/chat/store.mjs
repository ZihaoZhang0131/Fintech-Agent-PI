import { DatabaseSync } from "node:sqlite";
import { mkdirSync, chmodSync, existsSync } from "node:fs";
import { randomUUID, createHash } from "node:crypto";
import path from "node:path";
import { InMemorySessionStorage, Session } from "@earendil-works/pi-agent-core";
import { applyToolStart, applyToolEnd, applyToolApproval, applyToolDecision, finishToolRuns } from "../../lib/tool-runs.ts";

export const fail = (message, status = 400) => Object.assign(new Error(message), { status });
export const activeStatus = status => status === "queued" || status === "running";
const parse = row => row ? JSON.parse(row.body) : undefined;
const hash = value => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const emptyUsage = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, totalTokens: 0, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } };

export function createChatRuntimeStore(directory) {
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const file = path.join(directory, "chat.sqlite");
  const db = new DatabaseSync(file);
  const sessionCache = new Map();
  const cacheCleanup = setInterval(() => {
    for (const [id, cached] of sessionCache) if (Date.now() - cached.lastUsed > 30 * 60_000 && !activeStatus(turn(cached.turnId)?.status)) sessionCache.delete(id);
  }, 60_000);
  cacheCleanup.unref();
  chmodSync(file, 0o600);
  db.exec("PRAGMA journal_mode=WAL; PRAGMA busy_timeout=3000;");
  const exists = db.prepare("SELECT name FROM sqlite_master WHERE name='chat_threads'").get();
  if (!exists && !existsSync(`${file}.pre-harness`)) db.exec(`VACUUM INTO '${file.replaceAll("'", "''")}.pre-harness'`);
  if (existsSync(`${file}.pre-harness`)) chmodSync(`${file}.pre-harness`, 0o600);
  db.exec(`
    CREATE TABLE IF NOT EXISTS chat_conversations(id TEXT PRIMARY KEY, workspace_id TEXT NOT NULL, updated_at INTEGER NOT NULL, body TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS chat_threads(id TEXT PRIMARY KEY, body TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS chat_turns(id TEXT PRIMARY KEY, thread_id TEXT NOT NULL, request_id TEXT NOT NULL, hash TEXT NOT NULL, body TEXT NOT NULL, UNIQUE(thread_id,request_id));
    CREATE TABLE IF NOT EXISTS chat_session_entries(seq INTEGER PRIMARY KEY AUTOINCREMENT, id TEXT UNIQUE NOT NULL, thread_id TEXT NOT NULL, turn_id TEXT, body TEXT NOT NULL);
    CREATE INDEX IF NOT EXISTS chat_entry_thread ON chat_session_entries(thread_id,seq);
    CREATE TABLE IF NOT EXISTS chat_items(id TEXT PRIMARY KEY, thread_id TEXT NOT NULL, turn_id TEXT, body TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS chat_events(thread_id TEXT NOT NULL, seq INTEGER NOT NULL, body TEXT NOT NULL, PRIMARY KEY(thread_id,seq));
    CREATE TABLE IF NOT EXISTS chat_inputs(id TEXT PRIMARY KEY, thread_id TEXT NOT NULL, turn_id TEXT NOT NULL, request_id TEXT NOT NULL, body TEXT NOT NULL, UNIQUE(thread_id,request_id));
    CREATE TABLE IF NOT EXISTS chat_results(id TEXT PRIMARY KEY, thread_id TEXT NOT NULL, body TEXT NOT NULL);
  `);
  function transaction(fn) {
    db.exec("BEGIN IMMEDIATE");
    try { const result = fn(); db.exec("COMMIT"); return result; }
    catch (error) { db.exec("ROLLBACK"); throw error; }
  }
  const thread = id => parse(db.prepare("SELECT body FROM chat_threads WHERE id=?").get(id));
  const turn = id => parse(db.prepare("SELECT body FROM chat_turns WHERE id=?").get(id));
  const conversation = id => parse(db.prepare("SELECT body FROM chat_conversations WHERE id=?").get(id));
  function saveThread(value) { db.prepare("INSERT OR REPLACE INTO chat_threads VALUES(?,?)").run(value.id, JSON.stringify(value)); }
  function saveTurn(value) { db.prepare("UPDATE chat_turns SET body=? WHERE id=?").run(JSON.stringify(value), value.id); }
  function saveConversation(value) {
    db.prepare("INSERT OR REPLACE INTO chat_conversations VALUES(?,?,?,?)").run(value.id, value.projectId, value.updatedAt, JSON.stringify(value));
  }
  function migrate(id) {
    if (thread(id)) return thread(id);
    const old = conversation(id);
    if (!old) throw fail("聊天会话不存在。", 404);
    return transaction(() => {
      const value = { id, projectId: old.projectId, title: old.title, schemaVersion: 2, createdAt: old.messages[0]?.createdAt ?? Date.now(), seq: 0 };
      saveThread(value);
      let parentId = null;
      for (const msg of old.messages) {
        const message = msg.role === "user" ? { role: "user", content: msg.content, timestamp: msg.createdAt }
          : { role: "assistant", content: [{ type: "text", text: msg.content }], timestamp: msg.createdAt, api: "openai-completions", provider: "legacy", model: "legacy", usage: emptyUsage, stopReason: "stop" };
        const entry = { id: randomUUID(), parentId, timestamp: new Date(msg.createdAt).toISOString(), type: "message", message };
        db.prepare("INSERT INTO chat_session_entries(id,thread_id,body) VALUES(?,?,?)").run(entry.id, id, JSON.stringify(entry));
        parentId = entry.id;
        db.prepare("INSERT OR REPLACE INTO chat_items VALUES(?,?,?,?)").run(msg.id, id, null, JSON.stringify({ ...msg, legacy: true }));
        const delegations = (msg.toolRuns ?? []).filter(r => r.subAgentId).map(r => ({ agentId: r.subAgentId, label: r.subAgentLabel, task: r.query, status: r.status }));
        if (delegations.length) {
          const facts = { id: randomUUID(), parentId, timestamp: entry.timestamp, type: "custom_message", customType: "legacy_delegations", display: false, content: `应用保存的历史委派记录（非完整工具结果）：${JSON.stringify(delegations)}` };
          db.prepare("INSERT INTO chat_session_entries(id,thread_id,body) VALUES(?,?,?)").run(facts.id, id, JSON.stringify(facts)); parentId = facts.id;
        }
      }
      value.leafId = parentId; saveThread(value);
      saveConversation({ ...old, schemaVersion: 2 });
      return value;
    });
  }
  function event(threadId, turnId, payload) {
    const t = thread(threadId);
    if (!t) throw fail("会话不存在。", 404);
    const e = { threadId, turnId, ...payload, seq: ++t.seq };
    saveThread(t);
    db.prepare("INSERT INTO chat_events VALUES(?,?,?)").run(threadId, e.seq, JSON.stringify(e));
    return e;
  }
  function project(threadId, turnId, payload) {
    const c = conversation(threadId);
    if (!c) return;
    const last = [...c.messages].reverse().find(m => m.turnId === turnId && m.role === "assistant");
    if (payload.type === "message_start") c.messages.push({ id: payload.itemId, turnId, role: "assistant", content: "", toolRuns: [], createdAt: Date.now(), traceId: turnId, traceStatus: "recording" });
    if (payload.type === "delta" && last) last.content += payload.text;
    if (payload.type === "tool_start" && last) last.toolRuns = applyToolStart(last.toolRuns, payload);
    if (payload.type === "tool_end" && last) last.toolRuns = applyToolEnd(last.toolRuns, payload);
    if (payload.type === "tool_approval_required" && last) last.toolRuns = applyToolApproval(last.toolRuns, payload);
    if (payload.type === "tool_approval_decision") for (const m of c.messages.filter(m => m.turnId === turnId)) m.toolRuns = applyToolDecision(m.toolRuns, payload.commandId, payload.decision);
    if (payload.type === "context_compaction") c.contextCompaction = payload.status;
    if (payload.type === "input_status") { const m = c.messages.find(m => m.id === payload.inputId); if (m) m.inputStatus = payload.status; }
    if (payload.type === "trace_status") for (const m of c.messages.filter(m => m.turnId === turnId && m.role === "assistant")) m.traceStatus = payload.traceStatus;
    if (payload.type === "turn_status") {
      c.activeTurn = turn(turnId);
      if (!activeStatus(payload.status)) {
        c.contextCompaction = undefined;
        for (const m of c.messages.filter(m => m.turnId === turnId && m.role === "assistant")) m.toolRuns = finishToolRuns(m.toolRuns, payload.status === "interrupted" ? "已停止" : "执行结束");
        if (last) { last.durationMs = payload.durationMs; last.tokenUsage = payload.totalTokens; }
      }
    }
    c.updatedAt = Date.now();
    saveConversation(c);
    for (const m of c.messages.filter(m => m.turnId === turnId)) db.prepare("INSERT OR REPLACE INTO chat_items VALUES(?,?,?,?)").run(m.id, threadId, turnId, JSON.stringify(m));
  }
  function emit(threadId, turnId, payload) { return transaction(() => { project(threadId, turnId, payload); return event(threadId, turnId, payload); }); }
  function reserve(threadId, requestId, input, config, previousTurnId, operation = "prompt") {
    migrate(threadId);
    const requestHash = hash({ input, config, previousTurnId, operation });
    const duplicate = db.prepare("SELECT * FROM chat_turns WHERE thread_id=? AND request_id=?").get(threadId, requestId);
    if (duplicate) { if (duplicate.hash !== requestHash) throw fail("同一请求 ID 的内容不一致。", 409); return { turn: parse(duplicate), duplicate: true }; }
    const t = thread(threadId);
    if (t.activeTurnId && activeStatus(turn(t.activeTurnId)?.status)) throw fail("会话正在运行，请发送补充要求。", 409);
    return transaction(() => {
      const value = { id: randomUUID(), threadId, input, config, previousTurnId, operation, status: "queued", startedAt: Date.now() };
      db.prepare("INSERT INTO chat_turns VALUES(?,?,?,?,?)").run(value.id, threadId, requestId, requestHash, JSON.stringify(value));
      t.activeTurnId = value.id; t.config = config; saveThread(t);
      const c = conversation(threadId);
      if (!c.messages.length) { c.title = input.replace(/\s+/g, " ").slice(0, 18); t.title = c.title; saveThread(t); }
      const m = { id: randomUUID(), role: "user", content: input, createdAt: Date.now(), turnId: value.id };
      c.messages.push(m); c.activeTurn = value; c.updatedAt = Date.now(); saveConversation(c);
      db.prepare("INSERT INTO chat_items VALUES(?,?,?,?)").run(m.id, threadId, value.id, JSON.stringify(m));
      return { turn: value, event: event(threadId, value.id, { type: "turn_status", status: "queued" }) };
    });
  }
  function status(id, status, extra = {}) {
    return transaction(() => {
      const value = turn(id); Object.assign(value, extra, { status }); saveTurn(value);
      const payload = { type: "turn_status", status, ...extra }; project(value.threadId, id, payload); return event(value.threadId, id, payload);
    });
  }
  function addInput(threadId, turnId, requestId, text) {
    const old = db.prepare("SELECT * FROM chat_inputs WHERE thread_id=? AND request_id=?").get(threadId, requestId);
    if (old) { const i = parse(old); if (i.text !== text || i.turnId !== turnId) throw fail("补充请求 ID 冲突。", 409); return { input: i, duplicate: true }; }
    return transaction(() => {
      const i = { id: randomUUID(), threadId, turnId, requestId, text, status: "pending", createdAt: Date.now() };
      db.prepare("INSERT INTO chat_inputs VALUES(?,?,?,?,?)").run(i.id, threadId, turnId, requestId, JSON.stringify(i));
      const c = conversation(threadId); const m = { id: i.id, role: "user", content: text, createdAt: i.createdAt, turnId, inputStatus: "pending" };
      c.messages.push(m); saveConversation(c);
      db.prepare("INSERT INTO chat_items VALUES(?,?,?,?)").run(m.id, threadId, turnId, JSON.stringify(m));
      return { input: i, event: event(threadId, turnId, { type: "input_status", inputId: i.id, status: "pending" }) };
    });
  }
  const inputs = turnId => db.prepare("SELECT body FROM chat_inputs WHERE turn_id=? ORDER BY rowid").all(turnId).map(parse);
  function inputStatus(i, status) {
    return transaction(() => {
      i.status = status; db.prepare("UPDATE chat_inputs SET body=? WHERE id=?").run(JSON.stringify(i), i.id);
      const payload = { type: "input_status", inputId: i.id, status }; project(i.threadId, i.turnId, payload); return event(i.threadId, i.turnId, payload);
    });
  }
  function session(threadId, turnId, selectInput = () => {}, onConsumed = () => {}) {
    migrate(threadId);
    const cached = sessionCache.get(threadId);
    if (cached) {
      cached.lastUsed = Date.now();
      if (turnId !== undefined) Object.assign(cached, { turnId, selectInput, onConsumed });
      return cached.session;
    }
    const binding = { turnId, selectInput, onConsumed, lastUsed: Date.now() };
    const entries = db.prepare("SELECT body FROM chat_session_entries WHERE thread_id=? ORDER BY seq").all(threadId).map(parse);
    const base = new InMemorySessionStorage({ metadata: { id: threadId, createdAt: new Date(thread(threadId).createdAt).toISOString() }, entries });
    const append = base.appendEntry.bind(base);
    base.appendEntry = async entry => {
      const input = binding.selectInput(entry);
      let consumed;
      transaction(() => {
        if (input) entry.chatInputId = input.id;
        db.prepare("INSERT INTO chat_session_entries(id,thread_id,turn_id,body) VALUES(?,?,?,?)").run(entry.id, threadId, binding.turnId ?? null, JSON.stringify(entry));
        const t = thread(threadId); t.leafId = entry.type === "leaf" ? entry.targetId : entry.id; saveThread(t);
        if (input) {
          input.status = "consumed";
          db.prepare("UPDATE chat_inputs SET body=? WHERE id=?").run(JSON.stringify(input), input.id);
          const payload = { type: "input_status", inputId: input.id, status: "consumed" };
          project(input.threadId, input.turnId, payload);
          consumed = event(input.threadId, input.turnId, payload);
        }
      });
      binding.lastUsed = Date.now();
      await append(entry); if (consumed) binding.onConsumed(consumed);
    };
    base.setLeafId = async targetId => { if (targetId && !await base.getEntry(targetId)) throw fail("会话节点不存在。", 404); await base.appendEntry({ id: randomUUID(), type: "leaf", parentId: await base.getLeafId(), targetId, timestamp: new Date().toISOString() }); };
    binding.session = new Session(base); sessionCache.set(threadId, binding);
    return binding.session;
  }
  function snapshot(id, { beforeMessageId, limit } = {}) {
    migrate(id);
    return transaction(() => {
      const c = conversation(id), all = c.messages;
      const end = beforeMessageId ? all.findIndex(m => m.id === beforeMessageId) : all.length;
      if (end < 0 || (limit !== undefined && (!Number.isInteger(limit) || limit < 1 || limit > 500))) throw fail("消息分页参数无效。");
      const start = limit === undefined ? 0 : Math.max(0, end - limit);
      c.messages = all.slice(start, end);
      // Read-only display metadata: retain accurate timing for earlier turns too.
      c.turns = db.prepare("SELECT body FROM chat_turns WHERE thread_id=?").all(id).map(parse).map(({ id, status, startedAt, endedAt, durationMs }) => ({ id, status, startedAt, endedAt, durationMs }));
      return { thread: thread(id), conversation: c, turn: turn(thread(id).activeTurnId ?? ""), seq: thread(id).seq, nextBeforeMessageId: start > 0 ? c.messages[0]?.id : null };
    });
  }
  const events = (id, seq = 0, limit = 500) => db.prepare("SELECT body FROM chat_events WHERE thread_id=? AND seq>? ORDER BY seq LIMIT ?").all(id, seq, limit).map(parse);
  function recover() {
    for (const row of db.prepare("SELECT body FROM chat_turns").all()) {
      const t = parse(row); if (activeStatus(t.status)) status(t.id, "interrupted", { reason: "本机进程已重启，点击继续恢复。", endedAt: Date.now() });
    }
  }
  function remove(id) {
    sessionCache.delete(id);
    transaction(() => { for (const table of ["chat_events", "chat_items", "chat_inputs", "chat_results", "chat_session_entries", "chat_turns"]) db.prepare(`DELETE FROM ${table} WHERE thread_id=?`).run(id); db.prepare("DELETE FROM chat_threads WHERE id=?").run(id); db.prepare("DELETE FROM chat_conversations WHERE id=?").run(id); });
  }
  function result(threadId, id, value) {
    if (value !== undefined) db.prepare("INSERT OR REPLACE INTO chat_results VALUES(?,?,?)").run(id, threadId, JSON.stringify(value));
    return parse(db.prepare("SELECT body FROM chat_results WHERE id=? AND thread_id=?").get(id, threadId));
  }
  return { db, transaction, thread, turn, conversation, migrate, reserve, status, emit, event, saveTurn, snapshot, events, session, inputs, addInput, inputStatus, recover, remove, result, close() { clearInterval(cacheCleanup); sessionCache.clear(); db.close(); } };
}
