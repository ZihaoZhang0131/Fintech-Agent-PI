import { chmodSync, mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { redactTraceText, redactTraceValue } from "./trace-redaction.mjs";

const TRACE_SCHEMA_VERSION = 2;
const DEFAULT_MAX_RUNS = 1_000;
const DEFAULT_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1_000;
const DEFAULT_STALE_AFTER_MS = 30 * 60 * 1_000;
const VALID_RUN_STATUSES = new Set(["running", "success", "success_with_warnings", "error", "aborted", "interrupted"]);
const VALID_SPAN_KINDS = new Set(["agent", "turn", "generation", "tool"]);
const VALID_SPAN_STATUSES = new Set(["running", "success", "error", "cancelled"]);
const DAY_KEY = /^\d{4}-\d{2}-\d{2}$/;

function fail(message, status = 400) {
  throw Object.assign(new Error(message), { status });
}

function requireId(value, label = "ID") {
  if (typeof value !== "string" || !/^[A-Za-z0-9_-]{8,160}$/.test(value)) fail(`${label} 无效。`);
  return value;
}

function optionalId(value, label) {
  return value === undefined || value === null || value === "" ? undefined : requireId(value, label);
}

function integer(value, fallback) {
  return Number.isSafeInteger(value) ? value : fallback;
}

function nonNegativeInteger(value, fallback = 0) {
  return Number.isSafeInteger(value) && value >= 0 ? value : fallback;
}

function usageDayKey(timestamp) {
  const date = new Date(timestamp);
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

function json(value, maxBytes = 32 * 1024) {
  if (value === undefined) return null;
  return JSON.stringify(redactTraceValue(value, { maxBytes }));
}

function parseJson(value) {
  if (typeof value !== "string" || !value) return undefined;
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

function mapRun(row) {
  return {
    id: row.id,
    schemaVersion: row.schema_version,
    ...(row.context_json ? { context: parseJson(row.context_json) } : {}),
    workspaceId: row.workspace_id,
    ...(row.conversation_id ? { conversationId: row.conversation_id } : {}),
    status: row.status,
    startedAt: row.started_at,
    ...(row.ended_at === null ? {} : { endedAt: row.ended_at }),
    ...(row.duration_ms === null ? {} : { durationMs: row.duration_ms }),
    lastEventAt: row.last_event_at,
    ...(row.model_provider ? { modelProvider: row.model_provider } : {}),
    ...(row.model_id ? { modelId: row.model_id } : {}),
    question: row.question,
    ...(row.output === null ? {} : { output: row.output }),
    ...(row.capabilities_json === null ? {} : { capabilities: parseJson(row.capabilities_json) }),
    ...(row.usage_json === null ? {} : { usage: parseJson(row.usage_json) }),
    ...(row.error_json === null ? {} : { error: parseJson(row.error_json) }),
    stats: parseJson(row.stats_json) ?? { turns: 0, generations: 0, tools: 0, subAgents: 0, warnings: 0 },
  };
}

function mapSpan(row) {
  return {
    id: row.id,
    traceId: row.trace_id,
    ...(row.parent_span_id ? { parentSpanId: row.parent_span_id } : {}),
    kind: row.kind,
    name: row.name,
    ...(row.agent_id ? { agentId: row.agent_id } : {}),
    ...(row.agent_label ? { agentLabel: row.agent_label } : {}),
    ...(row.tool_call_id ? { toolCallId: row.tool_call_id } : {}),
    status: row.status,
    startedAt: row.started_at,
    ...(row.ended_at === null ? {} : { endedAt: row.ended_at }),
    ...(row.duration_ms === null ? {} : { durationMs: row.duration_ms }),
    ...(row.input_json === null ? {} : { input: parseJson(row.input_json) }),
    ...(row.output_json === null ? {} : { output: parseJson(row.output_json) }),
    ...(row.error_json === null ? {} : { error: parseJson(row.error_json) }),
    ...(row.attributes_json === null ? {} : { attributes: parseJson(row.attributes_json) }),
  };
}

function mapEvent(row) {
  return {
    traceId: row.trace_id,
    seq: row.seq,
    ...(row.span_id ? { spanId: row.span_id } : {}),
    type: row.type,
    timestamp: row.timestamp,
    ...(row.payload_json === null ? {} : { payload: parseJson(row.payload_json) }),
  };
}

function decodeCursor(value) {
  if (!value) return undefined;
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
    if (!Number.isSafeInteger(parsed.startedAt) || typeof parsed.id !== "string") return undefined;
    return parsed;
  } catch {
    return undefined;
  }
}

function encodeCursor(run) {
  return Buffer.from(JSON.stringify({ startedAt: run.startedAt, id: run.id }), "utf8").toString("base64url");
}

export function createTraceStore(dataDirectory, options = {}) {
  mkdirSync(dataDirectory, { recursive: true, mode: 0o700 });
  const databasePath = path.join(dataDirectory, "traces.sqlite");
  const database = new DatabaseSync(databasePath);
  try {
    chmodSync(databasePath, 0o600);
  } catch {
    // Best effort on platforms without POSIX permissions.
  }
  database.exec("PRAGMA foreign_keys = ON");
  database.exec("PRAGMA journal_mode = WAL");
  database.exec("PRAGMA busy_timeout = 3000");
  database.exec(`
    CREATE TABLE IF NOT EXISTS trace_runs (
      id TEXT PRIMARY KEY,
      schema_version INTEGER NOT NULL,
      workspace_id TEXT NOT NULL,
      conversation_id TEXT,
      status TEXT NOT NULL,
      started_at INTEGER NOT NULL,
      ended_at INTEGER,
      duration_ms INTEGER,
      last_event_at INTEGER NOT NULL,
      model_provider TEXT,
      model_id TEXT,
      question TEXT NOT NULL,
      output TEXT,
      capabilities_json TEXT,
      usage_json TEXT,
      error_json TEXT,
      stats_json TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS trace_spans (
      id TEXT PRIMARY KEY,
      trace_id TEXT NOT NULL REFERENCES trace_runs(id) ON DELETE CASCADE,
      parent_span_id TEXT,
      kind TEXT NOT NULL,
      name TEXT NOT NULL,
      agent_id TEXT,
      agent_label TEXT,
      tool_call_id TEXT,
      status TEXT NOT NULL,
      started_at INTEGER NOT NULL,
      ended_at INTEGER,
      duration_ms INTEGER,
      input_json TEXT,
      output_json TEXT,
      error_json TEXT,
      attributes_json TEXT
    );
    CREATE TABLE IF NOT EXISTS trace_events (
      trace_id TEXT NOT NULL REFERENCES trace_runs(id) ON DELETE CASCADE,
      seq INTEGER NOT NULL,
      span_id TEXT,
      type TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      payload_json TEXT,
      PRIMARY KEY (trace_id, seq)
    );
    CREATE INDEX IF NOT EXISTS idx_trace_runs_workspace_started ON trace_runs(workspace_id, started_at DESC);
    CREATE INDEX IF NOT EXISTS idx_trace_runs_conversation ON trace_runs(conversation_id, started_at DESC);
    CREATE INDEX IF NOT EXISTS idx_trace_runs_status ON trace_runs(status, started_at DESC);
    CREATE INDEX IF NOT EXISTS idx_trace_spans_trace_parent ON trace_spans(trace_id, parent_span_id, started_at);
    CREATE INDEX IF NOT EXISTS idx_trace_spans_agent ON trace_spans(agent_id, started_at DESC);
    CREATE INDEX IF NOT EXISTS idx_trace_events_trace_time ON trace_events(trace_id, timestamp, seq);
    CREATE TABLE IF NOT EXISTS usage_daily (
      day TEXT PRIMARY KEY,
      token_count INTEGER NOT NULL DEFAULT 0,
      tool_count INTEGER NOT NULL DEFAULT 0,
      skill_count INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS usage_contributions (
      source_id TEXT PRIMARY KEY,
      day TEXT NOT NULL,
      token_count INTEGER NOT NULL DEFAULT 0,
      tool_count INTEGER NOT NULL DEFAULT 0,
      skill_count INTEGER NOT NULL DEFAULT 0
    );
    CREATE INDEX IF NOT EXISTS idx_usage_contributions_day ON usage_contributions(day);
  `);

  // Additive, repeatable migration; old records retain their original schema version.
  if (!database.prepare("PRAGMA table_info(trace_runs)").all().some((c) => c.name === "context_json")) {
    database.exec("ALTER TABLE trace_runs ADD COLUMN context_json TEXT");
  }
  database.exec(`CREATE TABLE IF NOT EXISTS trace_messages (
    id TEXT PRIMARY KEY, trace_id TEXT NOT NULL REFERENCES trace_runs(id) ON DELETE CASCADE,
    span_id TEXT, created_at INTEGER, body TEXT NOT NULL
  ); CREATE INDEX IF NOT EXISTS idx_trace_messages_trace ON trace_messages(trace_id, created_at);`);

  const now = typeof options.now === "function" ? options.now : () => Date.now();
  const maxRuns = Number(options.maxRuns) || DEFAULT_MAX_RUNS;
  const maxAgeMs = Number(options.maxAgeMs) || DEFAULT_MAX_AGE_MS;
  const staleAfterMs = Number(options.staleAfterMs) || DEFAULT_STALE_AFTER_MS;
  const pendingAborts = new Map();

  const insertRun = database.prepare(`
    INSERT INTO trace_runs (
      id, schema_version, workspace_id, conversation_id, status, started_at, last_event_at,
      model_provider, model_id, question, capabilities_json, stats_json
    ) VALUES (?, ?, ?, ?, 'running', ?, ?, ?, ?, ?, ?, ?)
  `);
  const upsertSpan = database.prepare(`
    INSERT INTO trace_spans (
      id, trace_id, parent_span_id, kind, name, agent_id, agent_label, tool_call_id,
      status, started_at, ended_at, duration_ms, input_json, output_json, error_json, attributes_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      parent_span_id=excluded.parent_span_id, kind=excluded.kind, name=excluded.name,
      agent_id=excluded.agent_id, agent_label=excluded.agent_label, tool_call_id=excluded.tool_call_id,
      status=excluded.status, started_at=excluded.started_at, ended_at=excluded.ended_at,
      duration_ms=excluded.duration_ms, input_json=excluded.input_json, output_json=excluded.output_json,
      error_json=excluded.error_json, attributes_json=excluded.attributes_json
  `);
  const upsertEvent = database.prepare(`
    INSERT INTO trace_events (trace_id, seq, span_id, type, timestamp, payload_json)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(trace_id, seq) DO UPDATE SET
      span_id=excluded.span_id, type=excluded.type, timestamp=excluded.timestamp, payload_json=excluded.payload_json
  `);
  const insertUsageContribution = database.prepare(`
    INSERT OR IGNORE INTO usage_contributions (source_id, day, token_count, tool_count, skill_count)
    VALUES (?, ?, ?, ?, ?)
  `);
  const upsertUsageDaily = database.prepare(`
    INSERT INTO usage_daily (day, token_count, tool_count, skill_count) VALUES (?, ?, ?, ?)
    ON CONFLICT(day) DO UPDATE SET
      token_count=token_count + excluded.token_count,
      tool_count=tool_count + excluded.tool_count,
      skill_count=skill_count + excluded.skill_count
  `);

  function addUsageContribution(sourceId, day, token = 0, tool = 0, skill = 0) {
    if (typeof sourceId !== "string" || !sourceId || sourceId.length > 600 || !DAY_KEY.test(day)) fail("用量统计参数无效。");
    const result = insertUsageContribution.run(sourceId, day, token, tool, skill);
    if (result.changes) upsertUsageDaily.run(day, token, tool, skill);
    return Number(result.changes);
  }

  function recordTraceUsage(traceId, startedAt, usage) {
    let imported = 0;
    const totalTokens = nonNegativeInteger(usage?.totalTokens);
    if (totalTokens > 0) imported += addUsageContribution(`trace/${traceId}/token`, usageDayKey(startedAt), totalTokens);
    const spans = database.prepare("SELECT id, started_at, attributes_json FROM trace_spans WHERE trace_id=? AND kind='tool'").all(traceId);
    for (const span of spans) {
      const attributes = parseJson(span.attributes_json);
      const skill = attributes?.toolName === "load_skill" ? 1 : 0;
      imported += addUsageContribution(`trace/${traceId}/tool/${span.id}`, usageDayKey(span.started_at), 0, 1, skill);
    }
    return imported;
  }

  function cleanup() {
    const timestamp = now();
    database.prepare(`
      UPDATE trace_runs
      SET status='interrupted', ended_at=last_event_at, duration_ms=MAX(0, last_event_at-started_at)
      WHERE status='running' AND last_event_at < ?
    `).run(timestamp - staleAfterMs);
    database.prepare(`UPDATE trace_spans SET status='cancelled',
      ended_at=(SELECT ended_at FROM trace_runs WHERE id=trace_spans.trace_id),
      duration_ms=MAX(0,(SELECT ended_at FROM trace_runs WHERE id=trace_spans.trace_id)-started_at)
      WHERE status='running' AND trace_id IN (SELECT id FROM trace_runs WHERE status='interrupted')`).run();
    database.prepare("DELETE FROM trace_runs WHERE started_at < ?").run(timestamp - maxAgeMs);
    database.prepare(`
      DELETE FROM trace_runs WHERE id IN (
        SELECT id FROM trace_runs ORDER BY started_at DESC, id DESC LIMIT -1 OFFSET ?
      )
    `).run(maxRuns);
  }

  function createRun(payload) {
    if (!payload || typeof payload !== "object") fail("Trace 运行参数无效。");
    const id = requireId(payload.id, "Trace ID");
    const workspaceId = requireId(payload.workspaceId, "项目 ID");
    const conversationId = optionalId(payload.conversationId, "Conversation ID");
    const startedAt = integer(payload.startedAt, now());
    insertRun.run(
      id,
      TRACE_SCHEMA_VERSION,
      workspaceId,
      conversationId ?? null,
      startedAt,
      startedAt,
      typeof payload.modelProvider === "string" ? redactTraceText(payload.modelProvider, { maxBytes: 500 }) : null,
      typeof payload.modelId === "string" ? redactTraceText(payload.modelId, { maxBytes: 500 }) : null,
      redactTraceText(payload.question, { workspacePath: payload.workspacePath, maxBytes: 100_000 }),
      json(payload.capabilities, 64 * 1024),
      json({ turns: 0, generations: 0, tools: 0, subAgents: 0, warnings: 0 }),
    );
    if (payload.context) database.prepare("UPDATE trace_runs SET context_json=? WHERE id=?").run(json(payload.context), id);
    if (pendingAborts.delete(id)) abortRun(id);
    return getTrace(id).run;
  }

  function appendBatch(traceId, payload) {
    const id = requireId(traceId, "Trace ID");
    if (!payload || typeof payload !== "object") fail("Trace 事件批次无效。");
    const spans = Array.isArray(payload.spans) ? payload.spans : [];
    const events = Array.isArray(payload.events) ? payload.events : [];
    const messages = Array.isArray(payload.messages) ? payload.messages : [];
    if (spans.length > 200 || events.length > 200 || messages.length > 200) fail("Trace 事件批次过大。", 413);
    const runState = database.prepare("SELECT status FROM trace_runs WHERE id=?").get(id);
    if (!runState) fail("Trace 不存在。", 404);
    if (runState.status !== "running") return { acceptedSpans: 0, acceptedEvents: 0, lastEventAt: 0, ignored: true };
    let lastEventAt = 0;
    database.exec("BEGIN IMMEDIATE");
    try {
      for (const span of spans) {
        const spanId = requireId(span.id, "Span ID");
        const parentSpanId = optionalId(span.parentSpanId, "父 Span ID");
        if (!VALID_SPAN_KINDS.has(span.kind) || !VALID_SPAN_STATUSES.has(span.status)) fail("Span 类型或状态无效。");
        const startedAt = integer(span.startedAt, now());
        const endedAt = Number.isSafeInteger(span.endedAt) ? span.endedAt : null;
        upsertSpan.run(
          spanId,
          id,
          parentSpanId ?? null,
          span.kind,
          redactTraceText(span.name, { maxBytes: 1_000 }),
          typeof span.agentId === "string" ? redactTraceText(span.agentId, { maxBytes: 500 }) : null,
          typeof span.agentLabel === "string" ? redactTraceText(span.agentLabel, { maxBytes: 500 }) : null,
          typeof span.toolCallId === "string" ? redactTraceText(span.toolCallId, { maxBytes: 500 }) : null,
          span.status,
          startedAt,
          endedAt,
          endedAt === null ? null : Math.max(0, endedAt - startedAt),
          json(span.input),
          json(span.output),
          json(span.error),
          json(span.attributes),
        );
      }
      for (const event of events) {
        if (!Number.isSafeInteger(event.seq) || event.seq < 1 || typeof event.type !== "string" || !event.type) fail("Trace 事件无效。");
        const timestamp = integer(event.timestamp, now());
        lastEventAt = Math.max(lastEventAt, timestamp);
        upsertEvent.run(
          id,
          event.seq,
          optionalId(event.spanId, "事件 Span ID") ?? null,
          redactTraceText(event.type, { maxBytes: 500 }),
          timestamp,
          json(event.payload),
        );
      }
      for (const message of messages) {
        if (typeof message.id !== "string" || message.id.length > 200 || !["user", "assistant"].includes(message.role)) fail("Trace 消息无效。");
        const value = { ...message, traceId: id, content: redactTraceText(message.content, { maxBytes: 100_000 }) };
        database.prepare(`INSERT INTO trace_messages VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET body=excluded.body
          WHERE trace_messages.trace_id=excluded.trace_id`).run(
          value.id, id, optionalId(value.spanId) ?? null, Number.isSafeInteger(value.createdAt) ? value.createdAt : null,
          JSON.stringify(redactTraceValue(value, { maxBytes: 128 * 1024 })),
        );
        lastEventAt = Math.max(lastEventAt, now());
      }
      if (lastEventAt) database.prepare("UPDATE trace_runs SET last_event_at=? WHERE id=?").run(lastEventAt, id);
      database.exec("COMMIT");
    } catch (error) {
      database.exec("ROLLBACK");
      throw error;
    }
    return { acceptedSpans: spans.length, acceptedEvents: events.length, lastEventAt };
  }

  function finishRun(traceId, payload) {
    const id = requireId(traceId, "Trace ID");
    if (!payload || typeof payload !== "object" || !VALID_RUN_STATUSES.has(payload.status) || payload.status === "running") {
      fail("Trace 完成状态无效。");
    }
    const row = database.prepare("SELECT started_at, status FROM trace_runs WHERE id=?").get(id);
    if (!row) fail("Trace 不存在。", 404);
    if (row.status !== "running") return getTrace(id).run;
    const endedAt = integer(payload.endedAt, now());
    database.exec("BEGIN IMMEDIATE");
    try {
      database.prepare(`
      UPDATE trace_runs SET
        status=?, ended_at=?, duration_ms=?, last_event_at=?, output=?, usage_json=?, error_json=?, stats_json=?
      WHERE id=? AND status='running'
      `).run(
      payload.status,
      endedAt,
      Math.max(0, endedAt - row.started_at),
      endedAt,
      payload.output === undefined ? null : redactTraceText(payload.output, { workspacePath: payload.workspacePath, maxBytes: 100_000 }),
      json(payload.usage, 16 * 1024),
      json(payload.error),
      json(payload.stats, 16 * 1024),
        id,
      );
      recordTraceUsage(id, row.started_at, payload.usage);
      database.exec("COMMIT");
    } catch (error) {
      database.exec("ROLLBACK");
      throw error;
    }
    cleanup();
    return getTrace(id).run;
  }

  function abortRun(traceId) {
    const id = requireId(traceId, "Trace ID");
    const row = database.prepare("SELECT status, started_at FROM trace_runs WHERE id=?").get(id);
    if (!row) return false;
    if (row.status !== "running") return row.status === "aborted";
    const endedAt = now();
    database.exec("BEGIN IMMEDIATE");
    try {
      database.prepare(`
        UPDATE trace_spans SET
          status='cancelled', ended_at=?, duration_ms=MAX(0, ?-started_at)
        WHERE trace_id=? AND status='running'
      `).run(endedAt, endedAt, id);
      const lastSequence = database.prepare("SELECT COALESCE(MAX(seq), 0) AS seq FROM trace_events WHERE trace_id=?").get(id).seq;
      upsertEvent.run(id, lastSequence + 1, null, "trace_end", endedAt, json({ aborted: true, source: "user_stop" }));
      database.prepare(`
        UPDATE trace_runs SET
          status='aborted', ended_at=?, duration_ms=MAX(0, ?-started_at), last_event_at=?
        WHERE id=? AND status='running'
      `).run(endedAt, endedAt, endedAt, id);
      recordTraceUsage(id, row.started_at, undefined);
      database.exec("COMMIT");
    } catch (error) {
      database.exec("ROLLBACK");
      throw error;
    }
    return true;
  }

  function requestAbort(traceId) {
    const id = requireId(traceId, "Trace ID");
    if (abortRun(id)) return { accepted: true, active: true };
    const timestamp = now();
    for (const [pendingId, requestedAt] of pendingAborts) {
      if (timestamp - requestedAt > 60_000) pendingAborts.delete(pendingId);
    }
    pendingAborts.set(id, timestamp);
    return { accepted: true, active: false };
  }

  function isAbortRequested(traceId) {
    const id = requireId(traceId, "Trace ID");
    const row = database.prepare("SELECT status FROM trace_runs WHERE id=?").get(id);
    return row?.status === "aborted" || pendingAborts.has(id);
  }

  function listTraces(filters = {}) {
    const where = [];
    const params = [];
    if (filters.workspaceId) {
      where.push("workspace_id=?");
      params.push(requireId(filters.workspaceId, "项目 ID"));
    }
    if (filters.conversationId) {
      where.push("conversation_id=?");
      params.push(requireId(filters.conversationId, "Conversation ID"));
    }
    if (filters.status) {
      if (!VALID_RUN_STATUSES.has(filters.status)) fail("Trace 状态筛选无效。");
      where.push("status=?");
      params.push(filters.status);
    }
    if (Number.isSafeInteger(filters.from)) {
      where.push("started_at>=?");
      params.push(filters.from);
    }
    if (Number.isSafeInteger(filters.to)) {
      where.push("started_at<=?");
      params.push(filters.to);
    }
    if (filters.query) {
      const query = redactTraceText(filters.query, { maxBytes: 1_000 }).replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_");
      where.push("(id LIKE ? ESCAPE '\\' OR question LIKE ? ESCAPE '\\')");
      params.push(`%${query}%`, `%${query}%`);
    }
    const cursor = decodeCursor(filters.cursor);
    if (filters.cursor && !cursor) fail("Trace 游标无效。");
    if (cursor) {
      where.push("(started_at < ? OR (started_at = ? AND id < ?))");
      params.push(cursor.startedAt, cursor.startedAt, cursor.id);
    }
    const limit = Math.min(100, Math.max(1, Number(filters.limit) || 50));
    const rows = database.prepare(`
      SELECT * FROM trace_runs ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
      ORDER BY started_at DESC, id DESC LIMIT ?
    `).all(...params, limit + 1);
    const hasMore = rows.length > limit;
    const traces = rows.slice(0, limit).map(mapRun);
    return {
      traces,
      ...(hasMore && traces.length ? { nextCursor: encodeCursor(traces.at(-1)) } : {}),
    };
  }

  function getTrace(traceId) {
    const id = requireId(traceId, "Trace ID");
    const row = database.prepare("SELECT * FROM trace_runs WHERE id=?").get(id);
    if (!row) fail("Trace 不存在。", 404);
    return {
      run: mapRun(row),
      spans: database.prepare("SELECT * FROM trace_spans WHERE trace_id=? ORDER BY started_at, id").all(id).map(mapSpan),
      events: database.prepare("SELECT * FROM trace_events WHERE trace_id=? ORDER BY seq").all(id).map(mapEvent),
      messages: database.prepare("SELECT body FROM trace_messages WHERE trace_id=? ORDER BY created_at, rowid").all(id).map((r) => JSON.parse(r.body)),
    };
  }

  // Compact read models never load event payloads or complete message/tool bodies.
  function summaries(workspaceId) {
    requireId(workspaceId, "项目 ID");
    return database.prepare(`SELECT id, schema_version, workspace_id, conversation_id, context_json,
      status, started_at, ended_at, duration_ms, last_event_at, model_provider, model_id,
      substr(question,1,1000) question, stats_json FROM trace_runs WHERE workspace_id=?`).all(workspaceId).map(mapRun);
  }
  function spanSummaries(workspaceId) {
    requireId(workspaceId, "项目 ID");
    return database.prepare(`SELECT s.id, s.trace_id, s.parent_span_id, s.kind, s.name, s.agent_id,
      s.agent_label, s.status, s.started_at, s.ended_at, s.duration_ms,
      coalesce(json_extract(s.attributes_json,'$.usage.totalTokens'),json_extract(s.output_json,'$.usage.totalTokens')) total_tokens,
      substr(json_extract(s.input_json,'$.task'),1,1000) task
      FROM trace_spans s JOIN trace_runs r ON s.trace_id=r.id WHERE r.workspace_id=?`).all(workspaceId)
      .map((r) => ({ ...mapSpan(r), totalTokens: r.total_tokens, task: r.task }));
  }
  function linkContext(id, conversationId, context) {
    database.prepare("UPDATE trace_runs SET conversation_id=?,context_json=? WHERE id=? AND context_json IS NULL")
      .run(conversationId, json(context), id);
  }
  function messageSnapshots(traceId) {
    return database.prepare("SELECT body FROM trace_messages WHERE trace_id=? ORDER BY created_at,rowid")
      .all(requireId(traceId)).map((r) => JSON.parse(r.body));
  }
  function legacyReply(traceId) {
    return database.prepare("SELECT output FROM trace_runs WHERE id=?").get(requireId(traceId))?.output;
  }

  function getUsageActivity(filters = {}) {
    const from = Number.isSafeInteger(filters.from) ? filters.from : Date.now() - 364 * 24 * 60 * 60 * 1_000;
    const to = Number.isSafeInteger(filters.to) ? filters.to : Date.now();
    if (from > to) fail("用量统计日期范围无效。");
    const days = database.prepare(`
      SELECT day, token_count AS token, tool_count AS tool, skill_count AS skill
      FROM usage_daily WHERE day >= ? AND day <= ? ORDER BY day ASC
    `).all(usageDayKey(from), usageDayKey(to));
    return { days };
  }

  function importUsageContributions(payload) {
    const contributions = Array.isArray(payload?.contributions) ? payload.contributions : null;
    if (!contributions || contributions.length > 10_000) fail("历史用量导入参数无效。", 413);
    let imported = 0;
    database.exec("BEGIN IMMEDIATE");
    try {
      for (const item of contributions) {
        if (!item || typeof item !== "object") fail("历史用量记录无效。");
        const token = nonNegativeInteger(item.token);
        const tool = nonNegativeInteger(item.tool);
        const skill = nonNegativeInteger(item.skill);
        if (skill > tool || (token === 0 && tool === 0 && skill === 0)) fail("历史用量记录无效。");
        imported += addUsageContribution(item.sourceId, item.day, token, tool, skill);
      }
      database.exec("COMMIT");
    } catch (error) {
      database.exec("ROLLBACK");
      throw error;
    }
    return { imported };
  }

  function deleteTrace(traceId) {
    const id = requireId(traceId, "Trace ID");
    const result = database.prepare("DELETE FROM trace_runs WHERE id=?").run(id);
    if (!result.changes) fail("Trace 不存在。", 404);
    return { removed: id };
  }

  function clearTraces(workspaceId) {
    const id = requireId(workspaceId, "项目 ID");
    const result = database.prepare("DELETE FROM trace_runs WHERE workspace_id=?").run(id);
    return { workspaceId: id, removed: Number(result.changes) };
  }

  cleanup();
  return { databasePath, summaries, spanSummaries, linkContext, messageSnapshots, legacyReply, createRun, appendBatch, finishRun, requestAbort, isAbortRequested, listTraces, getTrace, getUsageActivity, importUsageContributions, deleteTrace, clearTraces, cleanup, close: () => database.close() };
}
