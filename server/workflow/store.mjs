import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
export const fail = (message, status = 400) =>
  Object.assign(new Error(message), { status });
export const terminal = new Set(["completed", "cancelled", "failed"]);
export function validatePlan(value, agents, maxNodes = 12) {
  if (
    !value ||
    !Array.isArray(value.nodes) ||
    !value.nodes.length ||
    value.nodes.length > maxNodes
  )
    throw fail(`工作流需要 1–${maxNodes} 个节点。`);
  const ids = new Set();
  const nodes = value.nodes.map((n) => {
    if (
      !n ||
      typeof n.id !== "string" ||
      !/^[a-zA-Z0-9_-]{1,80}$/.test(n.id) ||
      ids.has(n.id)
    )
      throw fail("节点 ID 无效或重复。");
    ids.add(n.id);
    if (!agents.includes(n.agentId))
      throw fail("节点只能使用本次选中的 Subagent。");
    for (const key of ["title", "task", "acceptance"])
      if (
        typeof n[key] !== "string" ||
        !n[key].trim() ||
        n[key].length > (key === "title" ? 120 : 8000)
      )
        throw fail(`节点 ${key} 为空或过长。`);
    if (
      !Array.isArray(n.dependencies) ||
      n.dependencies.some((d) => typeof d !== "string")
    )
      throw fail("依赖格式无效。");
    return {
      id: n.id,
      title: n.title.trim(),
      task: n.task.trim(),
      acceptance: n.acceptance.trim(),
      agentId: n.agentId,
      dependencies: [...new Set(n.dependencies)],
    };
  });
  const visited = new Set(),
    visiting = new Set();
  function visit(id) {
    if (visiting.has(id)) throw fail("工作流不能包含循环依赖。");
    if (visited.has(id)) return;
    const n = nodes.find((n) => n.id === id);
    if (!n) throw fail("依赖节点不存在。");
    visiting.add(id);
    n.dependencies.forEach(visit);
    visiting.delete(id);
    visited.add(id);
  }
  nodes.forEach((n) => visit(n.id));
  return {
    title:
      typeof value.title === "string"
        ? value.title.slice(0, 120)
        : "Agent Workflow",
    nodes,
  };
}
export function invalidatedNodes(oldPlan, nextPlan) {
  const changed = new Set(
    nextPlan.nodes
      .filter(
        (n) =>
          JSON.stringify(n) !==
          JSON.stringify(oldPlan?.nodes.find((o) => o.id === n.id)),
      )
      .map((n) => n.id),
  );
  let previous;
  do {
    previous = changed.size;
    for (const n of nextPlan.nodes)
      if (n.dependencies.some((d) => changed.has(d))) changed.add(n.id);
  } while (previous !== changed.size);
  return changed;
}
export function createWorkflowStore(directory) {
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(path.join(directory, "workflows.sqlite"));
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS runs(id TEXT PRIMARY KEY, workspace TEXT NOT NULL, status TEXT NOT NULL, updated INTEGER NOT NULL, body TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS events(run_id TEXT NOT NULL, seq INTEGER NOT NULL, body TEXT NOT NULL, PRIMARY KEY(run_id,seq));
    CREATE TABLE IF NOT EXISTS requests(id TEXT PRIMARY KEY, fingerprint TEXT NOT NULL, result TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS templates(id TEXT PRIMARY KEY, body TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS attempts(id TEXT PRIMARY KEY, run_id TEXT NOT NULL, body TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS operations(id TEXT PRIMARY KEY, run_id TEXT NOT NULL, body TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS conversations(id TEXT PRIMARY KEY, workspace TEXT NOT NULL, updated INTEGER NOT NULL, body TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS conversation_runs(run_id TEXT PRIMARY KEY, conversation_id TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS conversation_messages(id TEXT PRIMARY KEY, conversation_id TEXT NOT NULL, body TEXT NOT NULL);
    CREATE INDEX IF NOT EXISTS runs_workspace ON runs(workspace,updated);`);
  let transactionDepth = 0;
  function transaction(fn) {
    if (transactionDepth) return fn();
    db.exec("BEGIN IMMEDIATE");
    transactionDepth++;
    try {
      const result = fn();
      db.exec("COMMIT");
      return result;
    } catch (e) {
      db.exec("ROLLBACK");
      throw e;
    } finally {
      transactionDepth--;
    }
  }
  function get(id) {
    const row = db.prepare("SELECT body FROM runs WHERE id=?").get(id);
    if (!row) throw fail("运行不存在。", 404);
    const run = JSON.parse(row.body);
    const attempts = db
      .prepare("SELECT body FROM attempts WHERE run_id=? ORDER BY rowid")
      .all(id);
    const operations = db
      .prepare("SELECT body FROM operations WHERE run_id=? ORDER BY rowid")
      .all(id);
    if (attempts.length) run.attempts = attempts.map((a) => JSON.parse(a.body));
    if (operations.length)
      run.operations = operations.map((o) => JSON.parse(o.body));
    return run;
  }
  function createConversation(
    workspaceId,
    id = randomUUID(),
    title = "新对话",
    createdAt = Date.now(),
  ) {
    const value = { id, workspaceId, title, createdAt, updatedAt: createdAt };
    db.prepare("INSERT OR IGNORE INTO conversations VALUES(?,?,?,?)").run(
      id,
      workspaceId,
      createdAt,
      JSON.stringify(value),
    );
    return conversation(id);
  }
  function conversation(id) {
    const row = db.prepare("SELECT body FROM conversations WHERE id=?").get(id);
    if (!row) throw fail("Workflow 对话不存在。", 404);
    const value = JSON.parse(row.body);
    value.runIds = db
      .prepare(
        "SELECT run_id FROM conversation_runs WHERE conversation_id=? ORDER BY rowid",
      )
      .all(id)
      .map((r) => r.run_id);
    return value;
  }
  function conversations(workspaceId) {
    return db
      .prepare("SELECT id FROM conversations ORDER BY updated DESC")
      .all()
      .map((r) => conversation(r.id))
      .filter((c) => !workspaceId || c.workspaceId === workspaceId);
  }
  function messages(id) {
    conversation(id);
    return db
      .prepare(
        "SELECT body FROM conversation_messages WHERE conversation_id=? ORDER BY rowid",
      )
      .all(id)
      .map((r) => JSON.parse(r.body));
  }
  function appendMessage(id, message) {
    conversation(id);
    db.prepare("INSERT OR IGNORE INTO conversation_messages VALUES(?,?,?)").run(
      message.id,
      id,
      JSON.stringify(message),
    );
  }
  function projectConversation(run, previous, legacy = false) {
    const id = run.conversationId ?? run.id;
    createConversation(run.workspaceId, id, run.title, run.createdAt);
    db.prepare("INSERT OR IGNORE INTO conversation_runs VALUES(?,?)").run(
      run.id,
      id,
    );
    const c = conversation(id);
    if (c.runIds[0] === run.id) c.title = run.title;
    c.updatedAt = run.updatedAt;
    delete c.runIds;
    db.prepare("UPDATE conversations SET updated=?,body=? WHERE id=?").run(
      run.updatedAt,
      JSON.stringify(c),
      id,
    );
    appendMessage(id, {
      id: `${run.id}:input`,
      runId: run.id,
      role: "user",
      kind: "text",
      content: run.input,
      createdAt: run.createdAt,
    });
    for (const revision of run.revisions)
      appendMessage(id, {
        id: `${run.id}:plan:${revision.version}`,
        runId: run.id,
        role: "assistant",
        kind: "plan",
        content: revision.reason,
        version: revision.version,
        createdAt: revision.createdAt,
      });
    if (legacy)
      for (const [index, content] of (run.instructions ?? []).entries())
        appendMessage(id, {
          id: `${run.id}:legacy:${index}`,
          runId: run.id,
          role: "user",
          kind: "text",
          content,
          recovered: true,
        });
    if (
      run.status === "waiting_input" &&
      run.error &&
      (previous?.status !== run.status || previous?.error !== run.error)
    )
      appendMessage(id, {
        id: `${run.id}:attention:${run.seq}`,
        runId: run.id,
        role: "assistant",
        kind: "question",
        content: run.error,
        createdAt: legacy ? undefined : run.updatedAt,
      });
    if (run.summary)
      appendMessage(id, {
        id: `${run.id}:answer`,
        runId: run.id,
        role: "assistant",
        kind: "text",
        content: run.summary,
      });
    if (
      ["cancelled", "interrupted", "failed"].includes(run.status) &&
      previous?.status !== run.status
    )
      appendMessage(id, {
        id: `${run.id}:status:${run.seq}`,
        runId: run.id,
        role: "assistant",
        kind: "status",
        content:
          run.status === "cancelled"
            ? "已停止。你可以继续提出问题。"
            : run.status === "interrupted"
              ? "执行已中断，可以继续。"
              : "执行未完成，可以补充要求后重试。",
      });
  }
  function save(run, type = "state", payload = {}) {
    const previousRow = db
      .prepare("SELECT body FROM runs WHERE id=?")
      .get(run.id);
    const previous = previousRow ? JSON.parse(previousRow.body) : undefined;
    run.seq = (run.seq ?? 0) + 1;
    run.updatedAt = Date.now();
    const event = { seq: run.seq, type, timestamp: run.updatedAt, ...payload };
    transaction(() => {
      projectConversation(run, previous);
      const snapshot = {
        ...run,
        attempts: run.attempts.map((a) => ({
          id: a.id,
          nodeId: a.nodeId,
          version: a.version,
          status: a.status,
          startedAt: a.startedAt,
          endedAt: a.endedAt,
          traceId: a.traceId,
          error: a.error,
        })),
        operations: [],
      };
      db.prepare(
        "INSERT INTO runs VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET status=excluded.status,updated=excluded.updated,body=excluded.body",
      ).run(
        run.id,
        run.workspaceId,
        run.status,
        run.updatedAt,
        JSON.stringify(snapshot),
      );
      for (const a of run.attempts)
        db.prepare(
          "INSERT INTO attempts VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET body=excluded.body",
        ).run(a.id, run.id, JSON.stringify(a));
      for (const o of run.operations)
        db.prepare(
          "INSERT INTO operations VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET body=excluded.body",
        ).run(o.id, run.id, JSON.stringify(o));
      db.prepare("INSERT INTO events VALUES(?,?,?)").run(
        run.id,
        run.seq,
        JSON.stringify(event),
      );
    });
    return run;
  }
  function list(workspace) {
    return db
      .prepare("SELECT id FROM runs ORDER BY updated DESC")
      .all()
      .map((r) => get(r.id))
      .filter((r) => !workspace || r.workspaceId === workspace);
  }
  function events(id, after = 0) {
    get(id);
    return db
      .prepare(
        "SELECT body FROM events WHERE run_id=? AND seq>? ORDER BY seq LIMIT 200",
      )
      .all(id, after)
      .map((r) => JSON.parse(r.body));
  }
  function lookup(key, fingerprint) {
    const row = db.prepare("SELECT * FROM requests WHERE id=?").get(key);
    if (!row) return;
    if (row.fingerprint !== fingerprint)
      throw fail("请求 ID 已用于不同操作。", 409);
    return JSON.parse(row.result);
  }
  function remember(key, fingerprint, result) {
    db.prepare("INSERT INTO requests VALUES(?,?,?)").run(
      key,
      fingerprint,
      JSON.stringify(result),
    );
    return result;
  }
  function templates() {
    return db
      .prepare("SELECT body FROM templates")
      .all()
      .map((r) => JSON.parse(r.body))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }
  function template(id) {
    const t = templates().find((t) => t.id === id);
    if (!t) throw fail("模板不存在。", 404);
    return t;
  }
  function putTemplate(t) {
    t.updatedAt = Date.now();
    db.prepare(
      "INSERT INTO templates VALUES(?,?) ON CONFLICT(id) DO UPDATE SET body=excluded.body",
    ).run(t.id, JSON.stringify(t));
    return t;
  }
  for (const run of list())
    if (
      !db
        .prepare("SELECT run_id FROM conversation_runs WHERE run_id=?")
        .get(run.id)
    )
      transaction(() => projectConversation(run, undefined, true));
  for (const run of list())
    if (!terminal.has(run.status)) {
      run.status = "interrupted";
      for (const a of run.attempts)
        if (a.status === "running") {
          a.status = "interrupted";
          a.endedAt = Date.now();
        }
      for (const op of run.operations)
        if (["running", "pending_approval"].includes(op.status))
          op.status = "unknown";
      save(run, "interrupted");
    }
  return {
    transaction,
    createConversation,
    conversation,
    conversations,
    messages,
    appendMessage,
    get,
    save,
    list,
    events,
    lookup,
    remember,
    templates,
    template,
    putTemplate,
    close: () => db.close(),
  };
}
export function newRun(input) {
  return {
    ...input,
    id: randomUUID(),
    title: input.input.slice(0, 80),
    status: "queued",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    seq: 0,
    version: 0,
    plan: null,
    revisions: [],
    attempts: [],
    accepted: {},
    operations: [],
    feedback: [],
    instructions: [],
    traces: [],
    autoRevisions: 0,
  };
}
