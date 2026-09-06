"use client";
import {
  Activity,
  MoreHorizontal,
  RotateCw,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { TraceInvocation, TraceSession } from "@/lib/trace-types";
import { traceDuration, traceStatusLabels, traceTime } from "@/lib/trace-view";
import { TraceDrawer, type TraceSelection } from "./trace-drawer";
import { traceJson, useTracePages } from "./trace-data";
import { TraceStatus } from "./trace-timeline";

type TracePageProps = {
  workspaceId: string;
  focusTraceId?: string;
  onOpenConversation: (id: string) => void;
};
const emptyFilters = {
  query: "",
  mode: "",
  status: "",
  fromDate: "",
  toDate: "",
};
export function TracePage({
  workspaceId,
  focusTraceId,
  onOpenConversation,
}: TracePageProps) {
  const [tab, setTab] = useState<"sessions" | "invocations">("sessions");
  const [input, setInput] = useState(emptyFilters),
    [filters, setFilters] = useState(emptyFilters);
  const [pages, setPages] = useState(1),
    [tick, setTick] = useState(0);
  const [selection, setSelection] = useState<TraceSelection | null>(null),
    [error, setError] = useState("");
  const params = new URLSearchParams({
    workspaceId,
    query: filters.query,
    mode: filters.mode,
    status: filters.status,
  });
  if (filters.fromDate)
    params.set(
      "from",
      String(new Date(`${filters.fromDate}T00:00:00`).getTime()),
    );
  if (filters.toDate)
    params.set(
      "to",
      String(new Date(`${filters.toDate}T23:59:59.999`).getTime()),
    );
  const list = useTracePages<TraceSession | TraceInvocation>(
    workspaceId ? `/api/local/traces/${tab}?${params}` : "",
    tick,
    pages,
  );
  const statuses = list.data?.items.map((r) => r.status) ?? [];
  const delay = statuses.some((s) =>
    ["running", "queued", "planning", "executing", "pausing"].includes(s),
  )
    ? 1_000
    : statuses.some((s) => ["paused", "waiting_input"].includes(s))
      ? 5_000
      : 0;
  useEffect(() => {
    if (!delay) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setTick((v) => v + 1);
    }, delay);
    return () => window.clearInterval(timer);
  }, [delay]);
  useEffect(() => {
    if (!focusTraceId || !workspaceId) return;
    const controller = new AbortController();
    traceJson<TraceSelection>(
      `/api/local/traces/context/${encodeURIComponent(focusTraceId)}?workspaceId=${encodeURIComponent(workspaceId)}`,
      controller.signal,
    )
      .then((v) => {
        if (!controller.signal.aborted) setSelection({ ...v, tab: "trace" });
      })
      .catch((e) => {
        if (!controller.signal.aborted) setError(e.message);
      });
    return () => controller.abort();
  }, [focusTraceId, workspaceId]);
  async function clearProject() {
    if (!window.confirm("清空当前项目的全部 Trace？此操作无法撤销。")) return;
    try {
      await traceJson(
        `/api/local/traces?workspaceId=${encodeURIComponent(workspaceId)}`,
        undefined,
        "DELETE",
      );
      setSelection(null);
      setTick((v) => v + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "清空失败");
    }
  }
  function changeTab(value: typeof tab) {
    setTab(value);
    setPages(1);
  }
  return (
    <section className="trace-page trace-v2" aria-label="Agent Trace">
      <header className="trace-heading">
        <div>
          <Activity size={20} />
          <h1>Trace</h1>
        </div>
        <details className="trace-menu">
          <summary aria-label="Trace 更多操作">
            <MoreHorizontal size={18} />
          </summary>
          <div>
            <button onClick={() => void clearProject()}>
              <Trash2 size={14} />
              清空项目 Trace
            </button>
          </div>
        </details>
      </header>
      <div
        className="trace-list-tabs"
        role="tablist"
        aria-label="Trace 列表类型"
      >
        <button
          role="tab"
          aria-selected={tab === "sessions"}
          onClick={() => changeTab("sessions")}
        >
          主会话
        </button>
        <button
          role="tab"
          aria-selected={tab === "invocations"}
          onClick={() => changeTab("invocations")}
        >
          Subagent
        </button>
      </div>
      <form
        className="trace-filter-bar"
        onSubmit={(e) => {
          e.preventDefault();
          setFilters(input);
          setPages(1);
          setTick((v) => v + 1);
        }}
      >
        <div className="trace-date-range">
          <input
            type="date"
            aria-label="开始日期"
            value={input.fromDate}
            onChange={(e) => setInput({ ...input, fromDate: e.target.value })}
          />
          <span>—</span>
          <input
            type="date"
            aria-label="结束日期"
            value={input.toDate}
            onChange={(e) => setInput({ ...input, toDate: e.target.value })}
          />
        </div>
        <label className="trace-search-field">
          <Search size={14} />
          <input
            placeholder="搜索会话、Trace ID 或任务…"
            aria-label="搜索 Trace"
            value={input.query}
            onChange={(e) => setInput({ ...input, query: e.target.value })}
          />
        </label>
        <select
          aria-label="模式"
          value={input.mode}
          onChange={(e) => setInput({ ...input, mode: e.target.value })}
        >
          <option value="">全部模式</option>
          <option value="chat">普通会话</option>
          <option value="workflow">Workflow</option>
        </select>
        <select
          aria-label="Trace 状态"
          value={input.status}
          onChange={(e) => setInput({ ...input, status: e.target.value })}
        >
          <option value="">全部状态</option>
          {Object.entries(traceStatusLabels)
            .filter(
              ([s]) =>
                ![
                  "planning",
                  "executing",
                  "pausing",
                  "queued",
                  "completed",
                  "failed",
                  "cancelled",
                ].includes(s),
            )
            .map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
        </select>
        <button className="trace-primary" type="submit">
          搜索
        </button>
        <button
          type="button"
          onClick={() => {
            setInput(emptyFilters);
            setFilters(emptyFilters);
            setPages(1);
          }}
        >
          重置
        </button>
        <button
          type="button"
          aria-label="刷新 Trace"
          title="刷新"
          onClick={() => setTick((v) => v + 1)}
        >
          <RotateCw size={14} />
        </button>
      </form>
      {(list.error || error) && (
        <p className="trace-error">{list.error || error}</p>
      )}
      <div className="trace-table-scroll">
        <table className="trace-session-table">
          <thead>
            <tr>
              {(tab === "sessions"
                ? [
                    "会话",
                    "最近活动",
                    "模式",
                    "用户轮次",
                    "工具调用",
                    "Token",
                    "状态",
                    "Trace 明细",
                  ]
                : [
                    "Agent / 任务",
                    "所属会话",
                    "模式",
                    "开始时间",
                    "耗时",
                    "工具调用",
                    "状态",
                    "Trace 明细",
                  ]
              ).map((label) => (
                <th key={label}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.data?.items.map((row) =>
              tab === "sessions"
                ? (() => {
                    const r = row as TraceSession;
                    return (
                      <tr key={r.id}>
                        <td className="trace-table-title">
                          <strong title={r.title}>
                            {r.title || "无问题摘要"}
                          </strong>
                          <span title={r.id}>
                            {r.id.split(":").slice(1).join(":").slice(0, 20)}
                            {r.incomplete && <small> · 历史记录</small>}
                          </span>
                        </td>
                        <td>{traceTime(r.updatedAt)}</td>
                        <td>
                          <span className="trace-mode">
                            {r.mode === "workflow" ? "Workflow" : "普通会话"}
                          </span>
                        </td>
                        <td>{r.turns}</td>
                        <td>{r.tools}</td>
                        <td>{r.tokens?.toLocaleString() ?? "—"}</td>
                        <td>
                          <TraceStatus status={r.status} />
                          {r.warnings > 0 && (
                            <small
                              className="trace-warning-count"
                              title="包含历史异常"
                            >
                              {r.warnings} 异常
                            </small>
                          )}
                        </td>
                        <td>
                          <button
                            className="trace-link"
                            onClick={() => setSelection({ sessionKey: r.id })}
                          >
                            查看明细
                          </button>
                        </td>
                      </tr>
                    );
                  })()
                : (() => {
                    const r = row as TraceInvocation;
                    return (
                      <tr key={r.id}>
                        <td className="trace-table-title">
                          <strong>
                            {r.label}
                            {r.attemptNumber && (
                              <small> · 尝试 {r.attemptNumber}</small>
                            )}
                          </strong>
                          <span title={r.question}>{r.question}</span>
                        </td>
                        <td
                          className="trace-parent-title"
                          title={r.sessionTitle}
                        >
                          {r.sessionTitle}
                        </td>
                        <td>
                          <span className="trace-mode">
                            {r.mode === "workflow" ? "Workflow" : "普通会话"}
                          </span>
                        </td>
                        <td>{traceTime(r.startedAt)}</td>
                        <td>
                          {traceDuration(
                            r.endedAt === undefined
                              ? undefined
                              : r.endedAt - r.startedAt,
                          )}
                        </td>
                        <td>{r.tools}</td>
                        <td>
                          <TraceStatus status={r.status} />
                        </td>
                        <td>
                          <button
                            className="trace-link"
                            onClick={() =>
                              setSelection({
                                sessionKey: r.sessionKey,
                                taskId: r.taskId,
                                traceId: r.traceId,
                                spanId: r.spanId,
                                invocationId: r.id,
                                label: r.label,
                              })
                            }
                          >
                            查看明细
                          </button>
                        </td>
                      </tr>
                    );
                  })(),
            )}
          </tbody>
        </table>
        {!list.data ? (
          <div className="trace-empty">
            <RotateCw size={18} />
            正在读取 Trace…
          </div>
        ) : (
          !list.data.items.length && (
            <div className="trace-empty">
              <Activity size={20} />
              <strong>暂无匹配的 Trace</strong>
              <span>执行会话后，可在这里查看消息与完整调用记录。</span>
            </div>
          )
        )}
      </div>
      {list.data?.nextCursor && (
        <button
          className="trace-more"
          disabled={list.pages !== pages}
          onClick={() => setPages((v) => v + 1)}
        >
          加载更多
        </button>
      )}
      {selection && (
        <TraceDrawer
          key={`${workspaceId}:${selection.sessionKey}:${selection.invocationId ?? "main"}`}
          workspaceId={workspaceId}
          selection={selection}
          onSelect={setSelection}
          onClose={() => setSelection(null)}
          onOpenConversation={onOpenConversation}
          onChanged={() => setTick((v) => v + 1)}
        />
      )}
    </section>
  );
}
