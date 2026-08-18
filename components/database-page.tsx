"use client";

import { ArrowLeft, Play, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type DatabaseTable = { name: string; sql: string };
type QueryResult = { sql?: string; columns: string[]; rows: Array<Record<string, unknown>>; truncated: boolean };
type TableDetails = {
  table: string;
  sql: string;
  columns: Array<{ name: string; type: string; notNull: boolean; defaultValue: unknown; primaryKey: boolean }>;
  preview: QueryResult;
};

async function responseJson<T>(response: Response) {
  const payload = await response.json().catch(() => null) as { message?: string } | T | null;
  if (!response.ok) throw new Error(payload && typeof payload === "object" && "message" in payload ? payload.message ?? "数据库请求失败。" : "数据库请求失败。");
  return payload as T;
}

function ResultTable({ result }: { result: QueryResult }) {
  if (!result.columns.length) return <div className="database-empty">查询没有返回记录。</div>;
  return (
    <div className="database-result-wrap">
      <table className="database-result-table">
        <thead><tr>{result.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
        <tbody>
          {result.rows.map((row, index) => (
            <tr key={index}>{result.columns.map((column) => <td key={column}>{row[column] === null ? <em>NULL</em> : String(row[column] ?? "")}</td>)}</tr>
          ))}
        </tbody>
      </table>
      {result.truncated && <p className="database-result-note">结果已截断，仅显示前 500 行。</p>}
    </div>
  );
}

export function DatabasePage({ onClose }: { onClose: () => void }) {
  const [tables, setTables] = useState<DatabaseTable[]>([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [tableDetails, setTableDetails] = useState<TableDetails | null>(null);
  const [sql, setSql] = useState("SELECT name, sql\nFROM sqlite_schema\nWHERE type = 'table'\nORDER BY name;");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  const loadTables = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const payload = await responseJson<{ tables: DatabaseTable[] }>(await fetch("/api/local/database/tables", { cache: "no-store" }));
      setTables(payload.tables);
      if (selectedTable && !payload.tables.some((table) => table.name === selectedTable)) {
        setSelectedTable("");
        setTableDetails(null);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "无法读取本地数据库。");
    } finally {
      setLoading(false);
    }
  }, [selectedTable]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadTables(), 0);
    return () => window.clearTimeout(timer);
  }, [loadTables]);

  async function selectTable(name: string) {
    setSelectedTable(name);
    setTableDetails(null);
    setError("");
    try {
      const payload = await responseJson<TableDetails>(await fetch(`/api/local/database/tables/${encodeURIComponent(name)}`, { cache: "no-store" }));
      setTableDetails(payload);
      setResult(payload.preview);
      setSql(`SELECT *\nFROM "${name.replaceAll('"', '""')}"\nLIMIT 100;`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "无法读取数据表。");
    }
  }

  async function runQuery() {
    setRunning(true);
    setError("");
    try {
      const payload = await responseJson<QueryResult>(await fetch("/api/local/database/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql }),
      }));
      setResult(payload);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "SQL 查询失败。");
    } finally {
      setRunning(false);
    }
  }

  return (
    <section className="database-page">
      <header className="database-page-header">
        <button className="capability-back" type="button" onClick={onClose} aria-label="返回项目" title="返回项目"><ArrowLeft size={16} /></button>
        <h1>数据库</h1>
        <button className="capability-refresh" type="button" onClick={() => void loadTables()} disabled={loading} aria-label="刷新数据表" title="刷新数据表"><RefreshCw size={15} /></button>
      </header>
      {error && <div className="database-error">{error}</div>}
      <div className="database-workspace">
        <aside className="database-table-list" aria-label="数据表">
          <div className="database-section-title"><span>数据表</span><small>{tables.length}</small></div>
          <div className="database-table-items">
            {loading ? <div className="database-empty">正在读取…</div> : tables.length ? tables.map((table) => (
              <button key={table.name} className={selectedTable === table.name ? "active" : ""} type="button" title={table.name} onClick={() => void selectTable(table.name)}>{table.name}</button>
            )) : <div className="database-empty">暂无数据表</div>}
          </div>
        </aside>
        <main className={`database-main${tableDetails ? " has-schema" : ""}`}>
          {tableDetails && <section className="database-schema" aria-label={`${tableDetails.table} 字段`}><strong title={tableDetails.table}>{tableDetails.table}</strong><div className="database-columns">{tableDetails.columns.map((column) => <span key={column.name}><b>{column.name}</b><em>{column.type || "ANY"}{column.primaryKey ? " · PK" : ""}</em></span>)}</div></section>}
          <section className="database-editor"><div className="database-editor-toolbar"><div><span>SQL 查询</span><small>只读</small></div><button type="button" onClick={() => void runQuery()} disabled={running || !sql.trim()}><Play size={13} />{running ? "查询中" : "执行"}</button></div><textarea value={sql} onChange={(event) => setSql(event.target.value)} spellCheck={false} aria-label="SQL 查询语句" /></section>
          <section className="database-results"><div className="database-section-title"><span>查询结果</span>{result && <small>{result.rows.length} 行</small>}</div>{result ? <ResultTable result={result} /> : <div className="database-empty">执行 SQL 后在这里查看结果。</div>}</section>
        </main>
      </div>
    </section>
  );
}
