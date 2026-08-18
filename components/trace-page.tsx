"use client";

import {
  Activity,
  Bot,
  ChevronRight,
  CircleCheck,
  CircleEllipsis,
  CircleX,
  Clock3,
  RotateCw,
  Search,
  Terminal,
  Trash2,
  Wrench,
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type {
  TraceDetail,
  TraceListResponse,
  TraceRunStatus,
  TraceRunSummary,
  TraceSpan,
} from "@/lib/trace-types";

type TracePageProps = {
  workspaceId: string;
  focusTraceId?: string;
  onOpenConversation: (conversationId: string) => void;
};

const STATUS_LABELS: Record<TraceRunStatus, string> = {
  running: "运行中",
  success: "完成",
  success_with_warnings: "完成，有异常",
  error: "失败",
  aborted: "已停止",
  interrupted: "意外中断",
};

async function responseJson<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => null) as (T & { message?: string }) | null;
  if (!response.ok) throw new Error(payload?.message ?? "Trace 服务暂时不可用。");
  return payload as T;
}

function formatDuration(value?: number) {
  if (value === undefined) return "—";
  if (value < 1_000) return `${value}ms`;
  if (value < 60_000) return `${(value / 1_000).toFixed(value < 10_000 ? 1 : 0)}s`;
  const minutes = Math.floor(value / 60_000);
  const seconds = Math.round((value % 60_000) / 1_000);
  return `${minutes}m ${seconds}s`;
}

function formatTimestamp(value: number) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(value);
}

function statusGlyph(status: TraceRunStatus | TraceSpan["status"]) {
  if (status === "running") return <CircleEllipsis size={13} />;
  if (status === "success") return <CircleCheck size={13} />;
  return <CircleX size={13} />;
}

function spanGlyph(span: TraceSpan) {
  if (span.kind === "agent") return <Bot size={13} />;
  if (span.kind === "tool") return span.name.includes("bash") ? <Terminal size={13} /> : <Wrench size={13} />;
  if (span.kind === "generation") return <Activity size={13} />;
  return <Clock3 size={13} />;
}

function JsonBlock({ value }: { value: unknown }) {
  if (value === undefined) return null;
  return <pre>{JSON.stringify(value, null, 2)}</pre>;
}

function TraceTree({
  spans,
  selectedId,
  onSelect,
}: {
  spans: TraceSpan[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const children = useMemo(() => {
    const result = new Map<string, TraceSpan[]>();
    for (const span of spans) {
      const key = span.parentSpanId ?? "root";
      result.set(key, [...(result.get(key) ?? []), span]);
    }
    return result;
  }, [spans]);

  function renderBranch(parentId: string, depth: number): React.ReactNode {
    return (children.get(parentId) ?? []).map((span) => (
      <div key={span.id}>
        <button
          type="button"
          className={`trace-tree-row ${selectedId === span.id ? "active" : ""} status-${span.status}`}
          style={{ paddingLeft: `${10 + depth * 17}px` }}
          onClick={() => onSelect(span.id)}
        >
          <span className="trace-tree-kind">{spanGlyph(span)}</span>
          <span className="trace-tree-name">
            <strong>{span.name}</strong>
            <small>{span.agentLabel ?? span.kind}</small>
          </span>
          <span className="trace-tree-duration">{span.status === "running" ? "运行中" : formatDuration(span.durationMs)}</span>
          <span className="trace-tree-status">{statusGlyph(span.status)}</span>
        </button>
        {renderBranch(span.id, depth + 1)}
      </div>
    ));
  }

  return <div className="trace-tree">{renderBranch("root", 0)}</div>;
}

export function TracePage({ workspaceId, focusTraceId, onOpenConversation }: TracePageProps) {
  const [traces, setTraces] = useState<TraceRunSummary[]>([]);
  const [nextCursor, setNextCursor] = useState("");
  const [selectedId, setSelectedId] = useState(focusTraceId ?? "");
  const [detail, setDetail] = useState<TraceDetail | null>(null);
  const [selectedSpanId, setSelectedSpanId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");

  const loadList = useCallback(async (options: { append?: boolean; quiet?: boolean; cursor?: string } = {}) => {
    if (!workspaceId) {
      setTraces([]);
      setLoading(false);
      return;
    }
    if (!options.quiet) setLoading(true);
    try {
      const params = new URLSearchParams({ workspaceId, limit: "50" });
      if (statusFilter) params.set("status", statusFilter);
      if (query) params.set("query", query);
      if (fromDate) params.set("from", String(new Date(`${fromDate}T00:00:00`).getTime()));
      if (toDate) params.set("to", String(new Date(`${toDate}T23:59:59.999`).getTime()));
      if (options.append && options.cursor) params.set("cursor", options.cursor);
      const payload = await responseJson<TraceListResponse>(
        await fetch(`/api/local/traces?${params.toString()}`, { cache: "no-store" }),
      );
      setTraces((current) => options.append ? [...current, ...payload.traces] : payload.traces);
      setNextCursor(payload.nextCursor ?? "");
      setError("");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "无法读取 Trace。");
    } finally {
      if (!options.quiet) setLoading(false);
    }
  }, [fromDate, query, statusFilter, toDate, workspaceId]);

  const loadDetail = useCallback(async (traceId: string, quiet = false) => {
    if (!traceId) return;
    if (!quiet) setDetailLoading(true);
    try {
      const payload = await responseJson<TraceDetail>(
        await fetch(`/api/local/traces/${encodeURIComponent(traceId)}`, { cache: "no-store" }),
      );
      setDetail(payload);
      setSelectedId(traceId);
      setSelectedSpanId((current) => payload.spans.some((span) => span.id === current)
        ? current
        : payload.spans[0]?.id ?? "");
      setError("");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "无法读取 Trace 详情。");
    } finally {
      if (!quiet) setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadList(), 0);
    return () => window.clearTimeout(timer);
  }, [loadList]);

  useEffect(() => {
    if (!selectedId) return undefined;
    const timer = window.setTimeout(() => void loadDetail(selectedId), 0);
    return () => window.clearTimeout(timer);
  }, [loadDetail, selectedId]);

  useEffect(() => {
    const hasRunning = traces.some((trace) => trace.status === "running") || detail?.run.status === "running";
    if (!hasRunning) return undefined;
    const timer = window.setInterval(() => {
      void loadList({ quiet: true });
      if (selectedId) void loadDetail(selectedId, true);
    }, 1_000);
    return () => window.clearInterval(timer);
  }, [detail?.run.status, loadDetail, loadList, selectedId, traces]);

  const selectedSpan = detail?.spans.find((span) => span.id === selectedSpanId);
  const selectedEvents = detail?.events.filter((event) => !selectedSpanId || event.spanId === selectedSpanId) ?? [];

  function submitFilters(event: FormEvent) {
    event.preventDefault();
    setQuery(queryInput.trim());
  }

  async function deleteTrace(trace: TraceRunSummary) {
    if (!window.confirm(`删除这条 Trace？\n\n${trace.question.slice(0, 80)}`)) return;
    try {
      await responseJson(await fetch(`/api/local/traces/${encodeURIComponent(trace.id)}`, { method: "DELETE" }));
      if (selectedId === trace.id) {
        setSelectedId("");
        setDetail(null);
      }
      await loadList();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "删除 Trace 失败。");
    }
  }

  async function clearProject() {
    if (!window.confirm("清空当前项目的全部 Trace？此操作无法撤销。")) return;
    try {
      await responseJson(await fetch(`/api/local/traces?workspaceId=${encodeURIComponent(workspaceId)}`, { method: "DELETE" }));
      setSelectedId("");
      setDetail(null);
      await loadList();
    } catch (clearError) {
      setError(clearError instanceof Error ? clearError.message : "清空 Trace 失败。");
    }
  }

  return (
    <section className="trace-page" aria-label="Agent Trace">
      <header className="trace-page-header">
        <div>
          <span>AGENT OBSERVABILITY</span>
          <h1>Trace</h1>
          <p>完整记录模型生成、工具调用、审批和 SubAgent 执行树。默认保留30天或1000条。</p>
        </div>
        <div className="trace-header-actions">
          <button type="button" onClick={() => void loadList()} title="刷新 Trace"><RotateCw size={14} />刷新</button>
          <button type="button" className="danger" onClick={() => void clearProject()} disabled={!traces.length}><Trash2 size={14} />清空项目</button>
        </div>
      </header>

      <form className="trace-filters" onSubmit={submitFilters}>
        <label className="trace-search"><Search size={13} /><input value={queryInput} onChange={(event) => setQueryInput(event.target.value)} placeholder="搜索问题或 Trace ID" /></label>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Trace 状态">
          <option value="">全部状态</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
        </select>
        <input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} aria-label="开始日期" />
        <input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} aria-label="结束日期" />
        <button type="submit">筛选</button>
      </form>

      {error && <div className="trace-error">{error}</div>}
      <div className="trace-workspace">
        <aside className="trace-list" aria-label="Trace 列表">
          {loading ? (
            <div className="trace-empty"><RotateCw className="trace-spin" size={16} />正在读取 Trace…</div>
          ) : traces.length === 0 ? (
            <div className="trace-empty"><Activity size={18} /><strong>暂无 Trace</strong><span>下一次发送消息后，完整执行轨迹会出现在这里。</span></div>
          ) : traces.map((trace) => (
            <div className={`trace-list-row ${selectedId === trace.id ? "active" : ""}`} key={trace.id}>
              <button type="button" className="trace-list-select" onClick={() => setSelectedId(trace.id)}>
                <span className={`trace-status status-${trace.status}`}>{statusGlyph(trace.status)}{STATUS_LABELS[trace.status]}</span>
                <strong>{trace.question || "无问题摘要"}</strong>
                <small>{formatTimestamp(trace.startedAt)} · {formatDuration(trace.durationMs)} · {trace.usage?.totalTokens ?? 0} Token</small>
                <small>{trace.stats.tools} 工具 · {trace.stats.subAgents} SubAgent</small>
              </button>
              <button type="button" className="trace-row-delete" title="删除 Trace" onClick={() => void deleteTrace(trace)}><Trash2 size={12} /></button>
            </div>
          ))}
          {nextCursor && <button className="trace-load-more" type="button" onClick={() => void loadList({ append: true, cursor: nextCursor })}>加载更多</button>}
        </aside>

        <main className="trace-detail">
          {detailLoading && !detail ? (
            <div className="trace-empty"><RotateCw className="trace-spin" size={16} />正在读取详情…</div>
          ) : !detail ? (
            <div className="trace-empty"><ChevronRight size={18} /><strong>选择一条 Trace</strong><span>查看 Agent、模型、工具与 SubAgent 的父子执行关系。</span></div>
          ) : (
            <>
              <header className="trace-detail-header">
                <div>
                  <span className={`trace-status status-${detail.run.status}`}>{statusGlyph(detail.run.status)}{STATUS_LABELS[detail.run.status]}</span>
                  <h2>{detail.run.question}</h2>
                  <p>{detail.run.modelProvider}:{detail.run.modelId} · {formatDuration(detail.run.durationMs)} · {detail.run.usage?.totalTokens ?? 0} Token</p>
                </div>
                {detail.run.conversationId && <button type="button" onClick={() => onOpenConversation(detail.run.conversationId!)}>打开对话</button>}
              </header>

              <div className="trace-detail-grid">
                <section className="trace-tree-panel">
                  <h3>执行树 <small>{detail.spans.length} SPANS</small></h3>
                  <TraceTree spans={detail.spans} selectedId={selectedSpanId} onSelect={setSelectedSpanId} />
                </section>
                <section className="trace-inspector">
                  {selectedSpan ? (
                    <>
                      <header>
                        <span>{selectedSpan.kind.toUpperCase()}</span>
                        <h3>{selectedSpan.name}</h3>
                        <p>{selectedSpan.status} · {formatDuration(selectedSpan.durationMs)} · {selectedSpan.id}</p>
                      </header>
                      {selectedSpan.input !== undefined && <details open><summary>输入</summary><JsonBlock value={selectedSpan.input} /></details>}
                      {selectedSpan.output !== undefined && <details open><summary>输出</summary><JsonBlock value={selectedSpan.output} /></details>}
                      {selectedSpan.error !== undefined && <details open><summary>错误</summary><JsonBlock value={selectedSpan.error} /></details>}
                      {selectedSpan.attributes !== undefined && <details><summary>属性</summary><JsonBlock value={selectedSpan.attributes} /></details>}
                      <details>
                        <summary>原始事件 · {selectedEvents.length}</summary>
                        <JsonBlock value={selectedEvents} />
                      </details>
                    </>
                  ) : <div className="trace-empty">该 Trace 暂无 Span。</div>}
                </section>
              </div>
            </>
          )}
        </main>
      </div>
    </section>
  );
}
