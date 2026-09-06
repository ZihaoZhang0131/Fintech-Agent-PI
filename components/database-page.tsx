"use client";

import { ArrowLeft, ChevronRight, KeyRound, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SqlEditor } from "@/components/sql-editor";

type DatabaseTable = { name: string; sql: string };
type QueryResult = { sql?: string; columns: string[]; rows: Array<Record<string, unknown>>; truncated: boolean };
type TableDetails = {
  table: string;
  sql: string;
  columns: Array<{ name: string; type: string; notNull: boolean; defaultValue: unknown; primaryKey: boolean }>;
  preview: QueryResult;
};
type FieldsState = { name: string; columns?: TableDetails["columns"]; error?: string };

async function responseJson<T>(response: Response) {
  const payload = await response.json().catch(() => null) as { message?: string } | T | null;
  if (!response.ok) throw new Error(payload && typeof payload === "object" && "message" in payload ? payload.message ?? "数据库请求失败。" : "数据库请求失败。");
  return payload as T;
}

function ResultTable({ result }: { result: QueryResult }) {
  if (!result.columns.length) return <div className="database-empty">暂无记录</div>;
  return (
    <div className="database-result-wrap">
      <table className="database-result-table" aria-label="查询结果">
        <thead><tr>{result.columns.map((column, index) => <th key={index} scope="col">{column}</th>)}</tr></thead>
        <tbody>
          {result.rows.map((row, index) => (
            <tr key={index}>{result.columns.map((column, columnIndex) => <td key={columnIndex} title={row[column] === null ? "NULL" : String(row[column] ?? "")}>{row[column] === null ? <em>NULL</em> : String(row[column] ?? "")}</td>)}</tr>
          ))}
          {!result.rows.length && <tr><td colSpan={result.columns.length} className="database-empty">暂无记录</td></tr>}
        </tbody>
      </table>
      {result.truncated && <p className="database-result-note">结果已截断，仅显示前 {result.rows.length} 行。</p>}
    </div>
  );
}

function Fields({ state }: { state: FieldsState }) {
  return (
    <div className="database-fields" aria-label={state.name + " 字段"}>
      {state.error ? <div className="database-field-error" role="alert">{state.error}</div>
        : !state.columns ? <div className="database-empty" role="status">正在读取字段…</div>
        : state.columns.length ? state.columns.map((column) => (
          <div className="database-field" key={column.name}>
            <span className="database-field-name">{column.name}{column.primaryKey && <span title="主键"><KeyRound size={12} aria-label="主键" role="img" /></span>}</span>
            <span className="database-field-type">{column.type || "ANY"}</span>
          </div>
        )) : <div className="database-empty">暂无字段</div>}
    </div>
  );
}

export function DatabasePage({ onClose }: { onClose: () => void }) {
  const [tables, setTables] = useState<DatabaseTable[]>([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [fields, setFields] = useState<FieldsState | null>(null);
  const [sql, setSql] = useState("SELECT name, sql\nFROM sqlite_schema\nWHERE type = 'table'\nORDER BY name;");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [listError, setListError] = useState("");
  const columnsCache = useRef(new Map<string, TableDetails["columns"]>());
  const cacheVersion = useRef(0);
  const listRequest = useRef(0);
  const resultRequest = useRef(0);
  const fieldsRequest = useRef(0);
  const queryRunning = useRef(false);

  const loadTables = useCallback(async () => {
    const request = ++listRequest.current;
    ++cacheVersion.current;
    ++fieldsRequest.current;
    columnsCache.current.clear();
    setFields(null);
    setLoading(true);
    setListError("");
    try {
      const payload = await responseJson<{ tables: DatabaseTable[] }>(await fetch("/api/local/database/tables", { cache: "no-store" }));
      if (request !== listRequest.current) return;
      setTables(payload.tables);
      setSelectedTable((current) => payload.tables.some((table) => table.name === current) ? current : "");
    } catch (caught) {
      if (request === listRequest.current) setListError(caught instanceof Error ? caught.message : "无法读取本地数据库。");
    } finally {
      if (request === listRequest.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const requests = [listRequest, resultRequest, fieldsRequest, cacheVersion];
    const timer = window.setTimeout(() => void loadTables(), 0);
    return () => {
      window.clearTimeout(timer);
      requests.forEach((request) => { ++request.current; });
    };
  }, [loadTables]);

  async function fetchTable(name: string) {
    const version = cacheVersion.current;
    const payload = await responseJson<TableDetails>(await fetch("/api/local/database/tables/" + encodeURIComponent(name), { cache: "no-store" }));
    if (version === cacheVersion.current) columnsCache.current.set(name, payload.columns);
    return payload;
  }

  async function toggleFields(name: string) {
    const request = ++fieldsRequest.current;
    if (fields?.name === name) { setFields(null); return; }
    const cached = columnsCache.current.get(name);
    setFields({ name, columns: cached });
    if (cached) return;
    try {
      const payload = await fetchTable(name);
      if (request === fieldsRequest.current) setFields({ name, columns: payload.columns });
    } catch (caught) {
      if (request === fieldsRequest.current) setFields({ name, error: caught instanceof Error ? caught.message : "无法读取字段，请收起后重试。" });
    }
  }

  async function selectTable(name: string) {
    const request = ++resultRequest.current;
    setSelectedTable(name);
    setError("");
    setResult(null);
    setPreviewLoading(true);
    // Set the template first so a late preview cannot overwrite user typing.
    setSql('SELECT *\nFROM "' + name.replaceAll('"', '""') + '"\nLIMIT 100;');
    try {
      const payload = await fetchTable(name);
      if (request === resultRequest.current) setResult(payload.preview);
    } catch (caught) {
      if (request === resultRequest.current) setError(caught instanceof Error ? caught.message : "无法读取数据表。");
    } finally {
      if (request === resultRequest.current) setPreviewLoading(false);
    }
  }

  async function runQuery() {
    if (queryRunning.current || !sql.trim()) return;
    queryRunning.current = true;
    const request = ++resultRequest.current;
    setRunning(true);
    setPreviewLoading(false);
    setError("");
    try {
      const payload = await responseJson<QueryResult>(await fetch("/api/local/database/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql }),
      }));
      if (request === resultRequest.current) setResult(payload);
    } catch (caught) {
      if (request === resultRequest.current) setError(caught instanceof Error ? caught.message : "SQL 查询失败。");
    } finally {
      queryRunning.current = false;
      setRunning(false);
    }
  }

  return (
    <section className="database-page" aria-label="数据库">
      <header className="database-page-header">
        <button className="capability-back" type="button" onClick={onClose} aria-label="返回项目" title="返回项目"><ArrowLeft size={16} /></button>
        <button className="capability-refresh" type="button" onClick={() => void loadTables()} disabled={loading} aria-label="刷新数据表" title="刷新数据表"><RefreshCw size={15} /></button>
      </header>
      <div className="database-workspace">
        <aside className="database-table-list" aria-label="数据表">
          {listError && <div className="database-field-error" role="alert">{listError}</div>}
          <div className="database-table-items" aria-busy={loading}>
            {loading ? <div className="database-empty" role="status">正在读取…</div> : tables.length ? tables.map((table) => (
              <div className="database-table-item" key={table.name}>
                <div className={"database-table-row" + (selectedTable === table.name ? " active" : "")}>
                  <button className="database-table-toggle" type="button" aria-label={(fields?.name === table.name ? "收起 " : "展开 ") + table.name + " 字段"} aria-expanded={fields?.name === table.name} onClick={() => void toggleFields(table.name)}><ChevronRight size={14} /></button>
                  <button className="database-table-select" type="button" title={table.name} aria-current={selectedTable === table.name ? "true" : undefined} onClick={() => void selectTable(table.name)}>{table.name}</button>
                </div>
                {fields?.name === table.name && <div className="database-desktop-fields"><Fields state={fields} /></div>}
              </div>
            )) : <div className="database-empty">暂无数据表</div>}
          </div>
          {fields && <div className="database-mobile-fields"><Fields state={fields} /></div>}
        </aside>
        <main className="database-main">
          <SqlEditor value={sql} onChange={setSql} onRun={() => void runQuery()} running={running} />
          <section className="database-results" aria-label="查询结果" aria-busy={previewLoading || running}>
            {error && <div className="database-error" role="alert">{error}</div>}
            {previewLoading ? <div className="database-empty" role="status">正在读取数据…</div> : result ? <ResultTable result={result} /> : !error && <div className="database-empty">选择数据表或执行 SQL 查看结果。</div>}
          </section>
        </main>
      </div>
    </section>
  );
}
