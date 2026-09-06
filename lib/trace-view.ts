import type { TraceSpan, TraceTaskDetail } from "./trace-types";

export const traceStatusLabels: Record<string, string> = {
  running: "运行中",
  queued: "排队中",
  planning: "规划中",
  executing: "执行中",
  pausing: "正在暂停",
  success: "完成",
  completed: "完成",
  success_with_warnings: "完成，有异常",
  error: "失败",
  failed: "失败",
  aborted: "已停止",
  cancelled: "已停止",
  interrupted: "已中断",
  paused: "已暂停",
  waiting_input: "等待输入",
  blocked: "受阻",
};
export const isTraceActive = (s: string) =>
  ["running", "queued", "planning", "executing", "pausing"].includes(s);
export function traceDuration(value?: number) {
  if (value === undefined) return "—";
  if (value < 1000) return `${Math.round(value)}ms`;
  if (value < 60000) return `${(value / 1000).toFixed(1)}s`;
  return `${Math.floor(value / 60000)}m ${Math.floor((value % 60000) / 1000)}s`;
}
export function traceTime(value?: number) {
  return value === undefined
    ? "时间未记录"
    : new Intl.DateTimeFormat("zh-CN", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(value);
}
export type TraceViewNode = {
  id: string;
  name: string;
  kind: string;
  status: string;
  startedAt: number;
  endedAt?: number;
  traceId?: string;
  input?: unknown;
  output?: unknown;
  error?: unknown;
  attributes?: unknown;
  children: TraceViewNode[];
  folded?: boolean;
  note?: string;
};
export function traceTree(detail: TraceTaskDetail): TraceViewNode[] {
  const roots: TraceViewNode[] = [];
  const mapped = new Map<string, TraceViewNode>();
  for (const trace of detail.traces) {
    for (const span of trace.spans) {
      const attributes = span.attributes as
        | { turnIndex?: number; model?: string; toolName?: string }
        | undefined;
      mapped.set(span.id, {
        ...span,
        name:
          span.kind === "turn"
            ? `模型调用 ${attributes?.turnIndex ?? span.name.replace("turn ", "")}`
            : span.kind === "agent"
              ? (span.agentLabel ?? span.name)
              : (attributes?.toolName ??
                attributes?.model ??
                span.name.replace(/^(chat|execute_tool) /, "")),
        children: [],
        folded:
          span.kind === "agent" &&
          (!!span.parentSpanId || trace.run.context?.mode === "workflow"),
      });
    }
    const localRoots: TraceViewNode[] = [];
    for (const span of trace.spans) {
      const node = mapped.get(span.id)!;
      const parent = span.parentSpanId
        ? mapped.get(span.parentSpanId)
        : undefined;
      if (parent && parent !== node) parent.children.push(node);
      else localRoots.push(node);
    }
    const attempt = detail.attempts.find((a) => a.traceId === trace.run.id);
    if (!attempt) roots.push(...localRoots);
  }
  const groups = new Map<string, TraceViewNode>();
  for (const a of detail.attempts) {
    let node = groups.get(a.nodeId);
    if (!node) {
      node = {
        id: `node:${a.nodeId}`,
        name: `${a.title} · ${a.agentLabel}`,
        kind: "node",
        status: a.status,
        startedAt: a.startedAt,
        endedAt: a.endedAt,
        children: [],
        folded: true,
        attributes: { dependencies: a.dependencies },
      };
      groups.set(a.nodeId, node);
      roots.push(node);
    }
    node.startedAt = Math.min(node.startedAt, a.startedAt);
    node.endedAt =
      node.endedAt !== undefined && a.endedAt !== undefined
        ? Math.max(node.endedAt, a.endedAt)
        : undefined;
    node.status = a.status;
    const trace = detail.traces.find((t) => t.run.id === a.traceId);
    const children =
      trace?.spans
        .filter((s) => !s.parentSpanId)
        .map((s) => mapped.get(s.id)!)
        .filter(Boolean) ?? [];
    // The node already names its Agent; remove the redundant root row inside each attempt.
    node.children.push({
      id: a.id,
      name: `尝试 ${a.number}`,
      kind: "attempt",
      status: a.status,
      startedAt: a.startedAt,
      endedAt: a.endedAt,
      traceId: a.traceId,
      input: a.input,
      output: a.output,
      error: a.error,
      note: `v${a.version} · ${a.accepted ? "已采用" : "未采用"}`,
      attributes: { dependencies: a.dependencies, planVersion: a.version },
      children,
    });
    children.forEach((c) => {
      c.folded = false;
    });
  }
  const sort = (nodes: TraceViewNode[], seen = new Set<string>()) => {
    nodes.sort((a, b) => a.startedAt - b.startedAt || a.id.localeCompare(b.id));
    for (const n of nodes) {
      if (seen.has(n.id)) {
        n.children = [];
        continue;
      }
      seen.add(n.id);
      sort(n.children, seen);
    }
  };
  sort(roots);
  return roots;
}
export function filterTraceTree(
  nodes: TraceViewNode[],
  query: string,
  kind: string,
  status: string,
): TraceViewNode[] {
  const q = query.trim().toLowerCase();
  if (!q && !kind && !status) return nodes;
  return nodes.flatMap((n) => {
    const children = filterTraceTree(n.children, query, kind, status);
    const match =
      (!kind || n.kind === kind) &&
      (!status ||
        ((
          {
            completed: "success",
            failed: "error",
            cancelled: "aborted",
          } as Record<string, string>
        )[n.status] ?? n.status) ===
          (({ cancelled: "aborted" } as Record<string, string>)[status] ??
            status)) &&
      (!q || `${n.name} ${n.note ?? ""}`.toLowerCase().includes(q));
    return match || children.length ? [{ ...n, children, folded: false }] : [];
  });
}
export function traceAncestors(nodes: TraceViewNode[], id: string): string[] {
  for (const n of nodes) {
    if (n.id === id) return [n.id];
    const path = traceAncestors(n.children, id);
    if (path.length) return [n.id, ...path];
  }
  return [];
}
export function spanDescendants(spans: TraceSpan[], id: string) {
  const ids = new Set([id]);
  let size;
  do {
    size = ids.size;
    spans.forEach((s) => {
      if (s.parentSpanId && ids.has(s.parentSpanId)) ids.add(s.id);
    });
  } while (size !== ids.size);
  return ids;
}
