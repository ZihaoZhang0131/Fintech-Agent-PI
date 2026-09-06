"use client";
import {
  ArrowDown,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  MoreHorizontal,
  RotateCw,
  Search,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type {
  TraceMessage,
  TraceSession,
  TraceTask,
  TraceTaskDetail,
} from "@/lib/trace-types";
import {
  isTraceActive,
  traceDuration,
  traceStatusLabels,
  traceTime,
} from "@/lib/trace-view";
import { MarkdownMessage } from "./chat-markdown";
import { traceJson, useTraceData, useTracePages } from "./trace-data";
import { TraceStatus, TraceTimeline } from "./trace-timeline";

export type TraceSelection = {
  sessionKey: string;
  taskId?: string;
  traceId?: string;
  spanId?: string;
  invocationId?: string;
  label?: string;
  tab?: "messages" | "trace";
};
function MessageCard({
  message,
  onTrace,
}: {
  message: TraceMessage;
  onTrace: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const long = message.content.length > 1600 || message.content.split("\n").length > 18;
  return (
    <article className={`trace-message role-${message.role}`}>
      <header>
        <span className="trace-message-role">
          {message.label ?? (message.role === "user" ? "用户" : "Agent")}
        </span>
        <time>{traceTime(message.createdAt)}</time>
        {message.partial && <small>部分回复</small>}
        {message.legacy && <small>历史记录</small>}
        <button className="trace-link" onClick={onTrace}>
          定位 Trace
        </button>
        <span className="trace-message-model">{message.model}</span>
      </header>
      <div className={long && !expanded ? "trace-message-clipped" : ""}>
        <MarkdownMessage content={message.content} />
      </div>
      {long && (
        <button
          className="trace-link trace-message-expand"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "收起正文" : "展开全文"}
        </button>
      )}
    </article>
  );
}
function TaskSection({
  task,
  workspaceId,
  tick,
  focus,
  open,
  onToggle,
  query,
  kind,
  status,
  onDeleted,
}: {
  task: TraceTask;
  workspaceId: string;
  tick: number;
  focus: TraceSelection;
  open: boolean;
  onToggle: () => void;
  query: string;
  kind: string;
  status: string;
  onDeleted: () => void;
}) {
  const url = `/api/local/traces/sessions/${encodeURIComponent(task.sessionKey)}/tasks/${encodeURIComponent(task.id)}?workspaceId=${encodeURIComponent(workspaceId)}`;
  const detail = useTraceData<TraceTaskDetail>(open ? url : "", tick);
  const [deleteError, setDeleteError] = useState("");
  async function remove(id: string) {
    if (!window.confirm("删除这条 Trace？此操作无法撤销。")) return;
    try {
      await traceJson(
        `/api/local/traces/${encodeURIComponent(id)}`,
        undefined,
        "DELETE",
      );
      onDeleted();
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "删除失败");
    }
  }
  return (
    <section className="trace-task-section">
      <header>
        <button
          className="trace-task-toggle"
          onClick={onToggle}
          aria-expanded={open}
        >
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <span className="trace-round">第 {task.number} 轮</span>
          <strong title={task.question}>{task.question}</strong>
        </button>
        <span className="trace-task-metrics">
          {task.tools} 工具 · {task.tokens?.toLocaleString() ?? "—"} Token ·{" "}
          {traceDuration((task.endedAt ?? task.updatedAt) - task.startedAt)}
        </span>
        <TraceStatus status={task.status} />
        <details className="trace-menu">
          <summary aria-label="任务更多操作">
            <MoreHorizontal size={15} />
          </summary>
          <div>
            {task.traceIds.map((id) => (
              <button key={id} onClick={() => void remove(id)}>
                删除 Trace · {id.slice(0, 8)}
              </button>
            ))}
          </div>
        </details>
      </header>
      {(detail.error || deleteError) && (
        <p className="trace-error">{detail.error || deleteError}</p>
      )}
      {open &&
        (detail.data ? (
          <TraceTimeline
            key={`${task.id}:${focus.spanId ?? ""}`}
            detail={detail.data}
            scopeId={
              focus.invocationId
                ? (focus.spanId ?? focus.invocationId)
                : undefined
            }
            focusSpanId={focus.taskId === task.id ? focus.spanId : undefined}
            query={query}
            kind={kind}
            status={status}
          />
        ) : (
          <p className="trace-empty">正在读取执行记录…</p>
        ))}
    </section>
  );
}
export function TraceDrawer({
  workspaceId,
  selection,
  onSelect,
  onClose,
  onOpenConversation,
  onChanged,
}: {
  workspaceId: string;
  selection: TraceSelection;
  onSelect: (value: TraceSelection) => void;
  onClose: () => void;
  onOpenConversation: (id: string) => void;
  onChanged: () => void;
}) {
  const [tick, setTick] = useState(0),
    [tab, setTab] = useState(selection.tab ?? "messages");
  const [taskPages, setTaskPages] = useState(1),
    [messagePages, setMessagePages] = useState(1);
  const [messageQuery, setMessageQuery] = useState(""),
    [traceQuery, setTraceQuery] = useState("");
  const [kind, setKind] = useState(""),
    [status, setStatus] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const dialog = useRef<HTMLDivElement>(null),
    closeButton = useRef<HTMLButtonElement>(null),
    bottom = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);
  const base = `/api/local/traces/sessions/${encodeURIComponent(selection.sessionKey)}`;
  const params = `workspaceId=${encodeURIComponent(workspaceId)}`;
  const tasks = useTracePages<TraceTask, { session: TraceSession }>(
    `${base}?${params}`,
    tick,
    taskPages,
  );
  const messages = useTracePages<TraceMessage>(
    tab === "messages"
      ? `${base}/messages?${params}&query=${encodeURIComponent(messageQuery)}${selection.invocationId ? `&invocationId=${encodeURIComponent(selection.invocationId)}` : ""}`
      : "",
    tick,
    messagePages,
  );
  const target = useTraceData<TraceTaskDetail>(
    selection.taskId &&
      !tasks.data?.items.some((t) => t.id === selection.taskId)
      ? `${base}/tasks/${encodeURIComponent(selection.taskId)}?${params}`
      : "",
    tick,
  );
  const summary = tasks.data?.session;
  const delay =
    !summary || isTraceActive(summary.status)
      ? 1_000
      : ["paused", "waiting_input", "blocked"].includes(summary.status)
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
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    function key(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
      }
      if (event.key !== "Tab") return;
      const focusable = [
        ...(dialog.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled),input,select,summary,a[href],[tabindex="0"]',
        ) ?? []),
      ].filter((e) => e.getClientRects().length);
      const first = focusable[0],
        last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      document.body.style.overflow = overflow;
      previous?.focus({ preventScroll: true });
    };
  }, []);
  const list = [...(tasks.data?.items ?? [])];
  if (target.data && !list.some((t) => t.id === target.data?.task.id))
    list.push(target.data.task);
  list.sort((a, b) => a.number - b.number);
  const currentId = selection.taskId ?? tasks.data?.items[0]?.id;
  function locate(message: TraceMessage) {
    onSelect({
      ...selection,
      taskId: message.taskId,
      traceId: message.traceId,
      spanId: selection.invocationId ? message.spanId : undefined,
      tab: "trace",
    });
    setTab("trace");
    if (message.taskId) setExpanded((v) => ({ ...v, [message.taskId!]: true }));
  }
  function refresh() {
    setTick((v) => v + 1);
    onChanged();
  }
  return createPortal(
    <div
      className="trace-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialog}
        className="trace-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Trace 明细"
      >
        <header className="trace-drawer-header">
          <div>
            <strong>
              {selection.invocationId
                ? (selection.label ?? "Subagent 明细")
                : "会话详情"}
            </strong>
            <span title={selection.sessionKey}>
              {selection.sessionKey.split(":").slice(1).join(":")}
            </span>
          </div>
          <button ref={closeButton} className="trace-link" onClick={onClose}>
            <X size={16} />
            关闭
          </button>
        </header>
        <div className="trace-drawer-tabs" role="tablist" aria-label="详情页签">
          <button
            role="tab"
            aria-selected={tab === "messages"}
            onClick={() => setTab("messages")}
          >
            消息列表
          </button>
          <button
            role="tab"
            aria-selected={tab === "trace"}
            onClick={() => setTab("trace")}
          >
            Trace 信息
          </button>
          <div className="trace-drawer-context">
            {selection.invocationId && (
              <button
                className="trace-link"
                onClick={() => {
                  onSelect({
                    sessionKey: selection.sessionKey,
                    taskId: selection.taskId,
                    tab: "trace",
                  });
                  setTab("trace");
                }}
              >
                <ArrowLeft size={13} />
                所属主会话
              </button>
            )}
            {summary?.conversationId && (
              <button
                className="trace-link"
                onClick={() => onOpenConversation(summary.conversationId!)}
              >
                <ExternalLink size={13} />
                打开对话
              </button>
            )}
          </div>
        </div>
        <div className="trace-drawer-toolbar">
          {tab === "messages" ? (
            <>
              <label className="trace-search-field">
                <Search size={14} />
                <input
                  aria-label="搜索消息"
                  placeholder="搜索消息内容…"
                  value={messageQuery}
                  onChange={(e) => {
                    setMessageQuery(e.target.value);
                    setMessagePages(1);
                  }}
                />
              </label>
              <button
                onClick={() =>
                  bottom.current?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <ArrowDown size={14} />
                跳到尾部
              </button>
            </>
          ) : (
            <>
              <select
                aria-label="执行项类型"
                value={kind}
                onChange={(e) => setKind(e.target.value)}
              >
                <option value="">全部类型</option>
                <option value="agent">Agent</option>
                <option value="node">节点</option>
                <option value="generation">LLM</option>
                <option value="tool">工具</option>
              </select>
              <select
                aria-label="执行项状态"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">全部状态</option>
                {[
                  "running",
                  "success",
                  "error",
                  "cancelled",
                  "interrupted",
                  "blocked",
                ].map((s) => (
                  <option key={s} value={s}>
                    {traceStatusLabels[s]}
                  </option>
                ))}
              </select>
              <label className="trace-search-field">
                <Search size={14} />
                <input
                  placeholder="搜索模型、工具或节点…"
                  aria-label="搜索执行项"
                  value={traceQuery}
                  onChange={(e) => setTraceQuery(e.target.value)}
                />
              </label>
            </>
          )}
          <button aria-label="刷新明细" onClick={refresh}>
            <RotateCw size={14} />
            刷新
          </button>
        </div>
        <div className="trace-drawer-scroll" role="tabpanel">
          {(tasks.error || messages.error || target.error) && (
            <p className="trace-error">
              {tasks.error || messages.error || target.error}
            </p>
          )}
          {summary?.incomplete && (
            <p className="trace-history-note">
              历史记录不完整，部分内容未记录或已清理。
            </p>
          )}
          {tab === "messages" ? (
            <div className="trace-messages">
              {messages.data?.nextCursor && (
                <button
                  className="trace-more"
                  onClick={() => setMessagePages((p) => p + 1)}
                >
                  加载更早消息
                </button>
              )}
              {!messages.data ? (
                <p className="trace-empty">正在读取消息…</p>
              ) : !messages.data.items.length ? (
                <p className="trace-empty">没有可显示的消息记录</p>
              ) : (
                [...messages.data.items]
                  .reverse()
                  .map((m) => (
                    <MessageCard
                      key={m.id}
                      message={m}
                      onTrace={() => locate(m)}
                    />
                  ))
              )}
              <div ref={bottom} />
            </div>
          ) : (
            <div className="trace-tasks">
              {tasks.data?.nextCursor && (
                <button
                  className="trace-more"
                  onClick={() => setTaskPages((p) => p + 1)}
                >
                  加载更早轮次
                </button>
              )}
              {!tasks.data && <p className="trace-empty">正在读取任务…</p>}
              {list
                .filter(
                  (t) => !selection.invocationId || t.id === selection.taskId,
                )
                .map((task) => (
                  <TaskSection
                    key={task.id}
                    task={task}
                    workspaceId={workspaceId}
                    tick={tick}
                    focus={selection}
                    open={expanded[task.id] ?? task.id === currentId}
                    onToggle={() =>
                      setExpanded((v) => ({
                        ...v,
                        [task.id]: !(v[task.id] ?? task.id === currentId),
                      }))
                    }
                    query={traceQuery}
                    kind={kind}
                    status={status}
                    onDeleted={refresh}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
