import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";

const MAX_QUERY_ROWS = 500;
const MAX_PREVIEW_ROWS = 100;
const MAX_SQL_BYTES = 100_000;

function quoteIdentifier(name) {
  return `"${name.replaceAll('"', '""')}"`;
}

function normalizeSingleStatement(value) {
  if (typeof value !== "string") throw Object.assign(new Error("SQL 必须是文本。"), { status: 400 });
  const sql = value.trim();
  if (!sql || Buffer.byteLength(sql, "utf8") > MAX_SQL_BYTES) {
    throw Object.assign(new Error("SQL 为空或过长。"), { status: 400 });
  }
  const withoutFinalSemicolon = sql.endsWith(";") ? sql.slice(0, -1).trimEnd() : sql;
  if (!withoutFinalSemicolon || withoutFinalSemicolon.includes(";")) {
    throw Object.assign(new Error("每次只能执行一条 SQL 语句。"), { status: 400 });
  }
  return withoutFinalSemicolon;
}

function requireReadOnlySql(value) {
  const sql = normalizeSingleStatement(value);
  if (!/^(SELECT|WITH|EXPLAIN)\b/i.test(sql)) {
    throw Object.assign(new Error("SQL 编辑器仅支持 SELECT、WITH 或 EXPLAIN 查询。"), { status: 400 });
  }
  return sql;
}

function requireMutationSql(value) {
  const sql = normalizeSingleStatement(value);
  if (!/^(CREATE|ALTER|DROP|INSERT|UPDATE|DELETE|REPLACE)\b/i.test(sql)) {
    throw Object.assign(new Error("仅支持建表、改表和新增、更新、删除数据的单条 SQL。"), { status: 400 });
  }
  return sql;
}

function jsonValue(value) {
  if (typeof value === "bigint") return value.toString();
  if (Buffer.isBuffer(value)) return `[BLOB ${value.length} bytes]`;
  return value;
}

function formatRows(iterator, limit) {
  const rows = [];
  let truncated = false;
  for (const item of iterator) {
    if (rows.length >= limit) {
      truncated = true;
      break;
    }
    rows.push(Object.fromEntries(Object.entries(item).map(([key, value]) => [key, jsonValue(value)])));
  }
  return {
    columns: rows.length ? Object.keys(rows[0]) : [],
    rows,
    truncated,
  };
}

export function createLocalDatabase(dataDirectory) {
  mkdirSync(dataDirectory, { recursive: true, mode: 0o700 });
  const databasePath = path.join(dataDirectory, "database.sqlite");
  const database = new DatabaseSync(databasePath);
  database.exec("PRAGMA foreign_keys = ON");

  function listTables() {
    return database.prepare(
      "SELECT name, sql FROM sqlite_schema WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name COLLATE NOCASE",
    ).all().map((item) => ({ name: item.name, sql: item.sql ?? "" }));
  }

  function requireKnownTable(name) {
    if (typeof name !== "string" || !name.trim()) {
      throw Object.assign(new Error("数据表名称无效。"), { status: 400 });
    }
    const table = listTables().find((item) => item.name === name);
    if (!table) throw Object.assign(new Error("数据表不存在。"), { status: 404 });
    return table;
  }

  function describeTable(name) {
    const table = requireKnownTable(name);
    const columns = database.prepare(`PRAGMA table_info(${quoteIdentifier(table.name)})`).all().map((item) => ({
      cid: item.cid,
      name: item.name,
      type: item.type,
      notNull: item.notnull === 1,
      defaultValue: item.dflt_value,
      primaryKey: item.pk > 0,
    }));
    const preview = formatRows(database.prepare(`SELECT * FROM ${quoteIdentifier(table.name)} LIMIT ${MAX_PREVIEW_ROWS + 1}`).iterate(), MAX_PREVIEW_ROWS);
    return { table: table.name, sql: table.sql, columns, preview };
  }

  function query(sql) {
    const statement = requireReadOnlySql(sql);
    // A second read-only connection is the enforcement boundary behind the SQL prefix check.
    const readOnlyDatabase = new DatabaseSync(databasePath, { readOnly: true });
    try {
      return { sql: statement, ...formatRows(readOnlyDatabase.prepare(statement).iterate(), MAX_QUERY_ROWS) };
    } finally {
      readOnlyDatabase.close();
    }
  }

  function mutate(sql, operationId) {
    const statement = requireMutationSql(sql);
    if (!operationId) {
      database.exec(statement);
      return {sql: statement, changes: Number(database.prepare("SELECT changes() AS changes").get()?.changes ?? 0)};
    }
    if (/\bworkflow_ledger\b/i.test(statement)) throw new Error("不能修改内部操作记录。");
    // Attached ledger commits atomically with the business mutation in rollback journal mode.
    database.exec("ATTACH DATABASE '" + path.join(dataDirectory, "workflow-sql-ledger.sqlite").replaceAll("'", "''") + "' AS workflow_ledger");
    try {
      database.exec("CREATE TABLE IF NOT EXISTS workflow_ledger.operations(id TEXT PRIMARY KEY, sql TEXT NOT NULL, result TEXT NOT NULL)");
      database.exec("BEGIN IMMEDIATE");
      try {
        const old = database.prepare("SELECT sql, result FROM workflow_ledger.operations WHERE id=?").get(operationId);
        if (old) {
          if (old.sql !== statement) throw new Error("操作 ID 已用于其他 SQL。");
          database.exec("COMMIT"); return JSON.parse(old.result);
        }
        database.exec(statement);
        const result = {sql: statement, changes: Number(database.prepare("SELECT changes() AS changes").get()?.changes ?? 0)};
        database.prepare("INSERT INTO workflow_ledger.operations VALUES(?,?,?)").run(operationId,statement,JSON.stringify(result));
        database.exec("COMMIT");return result;
      } catch(error) { database.exec("ROLLBACK");throw error; }
    } finally {database.exec("DETACH DATABASE workflow_ledger");}
  }

  return { databasePath, listTables, describeTable, query, mutate, close: () => database.close() };
}
