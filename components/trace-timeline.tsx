"use client";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { TraceTaskDetail } from "@/lib/trace-types";
import {
  filterTraceTree,
  traceAncestors,
  traceDuration,
  traceStatusLabels,
  traceTree,
  type TraceViewNode,
} from "@/lib/trace-view";
import { MarkdownMessage } from "./chat-markdown";

export function TraceStatus({ status }: { status: string }) {
  return (
    <span className={`trace-badge status-${status}`}>
      <i />
      {traceStatusLabels[status] ?? status}
    </span>
  );
}
function Value({ value }: { value: unknown }) {
  if (typeof value === "string") return <MarkdownMessage content={value} />;
  return <pre>{JSON.stringify(value, null, 2)}</pre>;
}
const kinds: Record<string, string> = {
  agent: "AGENT",
  turn: "调用",
  generation: "LLM",
  tool: "TOOL",
  node: "节点",
  attempt: "尝试",
};
export function TraceTimeline({
  detail,
  focusSpanId,
  scopeId,
  query,
  kind,
  status,
}: {
  detail: TraceTaskDetail;
  focusSpanId?: string;
  scopeId?: string;
  query: string;
  kind: string;
  status: string;
}) {
  const nodes = useMemo(() => {
    const tree = traceTree(detail);
    if (!scopeId) return tree;
    const find = (nodes: TraceViewNode[]): TraceViewNode | undefined => {
      for (const node of nodes) {
        if (node.id === scopeId) return node;
        const match = find(node.children);
        if (match) return match;
      }
    };
    const scoped = find(tree);
    return scoped ? [scoped] : [];
  }, [detail, scopeId]);
  const focusPath = useMemo(
    () => traceAncestors(nodes, focusSpanId ?? ""),
    [nodes, focusSpanId],
  );
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState(focusSpanId ?? "");
  const tree = filterTraceTree(nodes, query, kind, status);
  const focusRef = useRef<HTMLDivElement>(null);
  const didScroll = useRef("");
  useEffect(() => {
    if (focusSpanId && didScroll.current !== focusSpanId && focusRef.current) {
      focusRef.current.scrollIntoView({ block: "center" });
      didScroll.current = focusSpanId;
    }
  }, [focusSpanId, focusPath]);
  const start = detail.task.startedAt,
    end = detail.task.endedAt ?? detail.observedAt ?? detail.task.updatedAt,
    duration = Math.max(1, end - start);
  const filtering = !!(query || kind || status);
  const render = (items: TraceViewNode[], depth = 0): React.ReactNode =>
    items.map((node) => {
      const open =
        expanded[node.id] ??
        (filtering || focusPath.includes(node.id) || !node.folded);
      const left = Math.max(
        0,
        Math.min(100, ((node.startedAt - start) / duration) * 100),
      );
      const width = Math.max(
        0.3,
        Math.min(
          100 - left,
          (((node.endedAt ?? end) - node.startedAt) / duration) * 100,
        ),
      );
      const events =
        detail.traces
          .find((t) => t.run.id === node.traceId)
          ?.events.filter((e) => e.spanId === node.id) ?? [];
      return (
        <div
          key={node.id}
          className="trace-branch"
          ref={node.id === focusSpanId ? focusRef : undefined}
        >
          <div
            className={`trace-waterfall-row ${selected === node.id ? "is-selected" : ""}`}
          >
            <div
              className="trace-span-name"
              style={{ paddingLeft: 12 + depth * 16 }}
            >
              {node.children.length ? (
                <button
                  className="trace-chevron"
                  aria-label={`${open ? "折叠" : "展开"}${node.name}`}
                  aria-expanded={open}
                  onClick={() =>
                    setExpanded((v) => ({ ...v, [node.id]: !open }))
                  }
                >
                  {open ? (
                    <ChevronDown size={13} />
                  ) : (
                    <ChevronRight size={13} />
                  )}
                </button>
              ) : (
                <span className="trace-chevron" />
              )}
              <span className={`trace-kind kind-${node.kind}`}>
                {kinds[node.kind]}
              </span>
              <button
                className="trace-node-label"
                title={node.name}
                aria-expanded={selected === node.id}
                onClick={() =>
                  setSelected((v) => (v === node.id ? "" : node.id))
                }
              >
                {node.name}
              </button>
              {node.note && <small>{node.note}</small>}
            </div>
            <button
              className="trace-bar-cell"
              aria-label={`查看${node.name}详情`}
              onClick={() => setSelected((v) => (v === node.id ? "" : node.id))}
            >
              <span className="trace-bar-track">
                <span
                  className={`trace-bar kind-${node.kind}`}
                  style={{ left: `${left}%`, width: `${width}%` }}
                />
              </span>
            </button>
            <span className="trace-elapsed">
              {traceDuration((node.endedAt ?? end) - node.startedAt)}
            </span>
            <TraceStatus status={node.status} />
          </div>
          {selected === node.id && (
            <div className="trace-inline-detail">
              <div className="trace-inline-meta">
                {node.traceId && <span>Trace {node.traceId}</span>}
                <span>{node.id}</span>
              </div>
              {(
                [
                  ["输入", node.input],
                  ["输出", node.output],
                  ["错误", node.error],
                ] as const
              )
                .filter(([, v]) => v != null)
                .map(([label, value]) => (
                  <section key={label}>
                    <strong>{label}</strong>
                    <Value value={value} />
                  </section>
                ))}
              {node.input == null &&
                node.output == null &&
                node.error == null && (
                  <p className="trace-muted">
                    此执行项没有单独记录正文，展开下级可查看模型与工具明细。
                  </p>
                )}
              {node.attributes != null && (
                <details>
                  <summary>属性</summary>
                  <Value value={node.attributes} />
                </details>
              )}
              {events.length > 0 && (
                <details>
                  <summary>原始事件 · {events.length}</summary>
                  <Value value={events} />
                </details>
              )}
            </div>
          )}
          {open && render(node.children, depth + 1)}
        </div>
      );
    });
  return (
    <div className="trace-waterfall">
      <div className="trace-waterfall-head">
        <span>执行项</span>
        <span className="trace-axis">
          <span>0s</span>
          <span>{traceDuration(duration)}</span>
        </span>
        <span>耗时</span>
        <span>状态</span>
      </div>
      {tree.length ? (
        render(tree)
      ) : (
        <p className="trace-empty">没有匹配的执行项</p>
      )}
    </div>
  );
}
