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

  function mutate(sql) {
    const statement = requireMutationSql(sql);
    database.exec(statement);
    const result = database.prepare("SELECT changes() AS changes").get();
    return { sql: statement, changes: Number(result?.changes ?? 0) };
  }

  return { databasePath, listTables, describeTable, query, mutate, close: () => database.close() };
}
