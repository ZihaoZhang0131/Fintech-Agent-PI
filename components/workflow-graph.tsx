import { useId } from "react";
import type {
  WorkflowNode,
  WorkflowRun,
  WorkflowPlan,
} from "@/lib/workflow-types";
export const WORKFLOW_STATUS: Record<string, string> = {
  queued: "排队",
  waiting_approval: "等待审批",
  planning: "规划中",
  running: "执行中",
  pausing: "暂停中",
  paused: "已暂停",
  waiting_input: "等待处理",
  interrupted: "已中断",
  completed: "已完成",
  cancelled: "已停止",
  failed: "失败",
  blocked: "待恢复",
  pending: "等待依赖",
  recovering: "恢复中",
};
export function layoutWorkflow(plan: WorkflowPlan) {
  const depths = new Map<string, number>();
  function depth(n: WorkflowNode, seen = new Set<string>()): number {
    if (depths.has(n.id)) return depths.get(n.id)!;
    if (seen.has(n.id)) return 0;
    seen.add(n.id);
    const d = n.dependencies.length
      ? 1 +
        Math.max(
          ...n.dependencies.map((id) => {
            const upstream = plan.nodes.find((n) => n.id === id);
            return upstream ? depth(upstream, new Set(seen)) : 0;
          }),
        )
      : 0;
    depths.set(n.id, d);
    return d;
  }
  const rows = new Map<number, number>();
  return plan.nodes.map((node) => {
    const column = depth(node),
      row = rows.get(column) ?? 0;
    rows.set(column, row + 1);
    return { node, x: 24 + column * 272, y: 32 + row * 142 };
  });
}
export function WorkflowGraph({
  run,
  plan,
  selected,
  onSelect,
  zoom,
}: {
  run: WorkflowRun;
  plan: WorkflowPlan;
  selected: string;
  onSelect: (id: string) => void;
  zoom: number;
}) {
  const arrowId = useId();
  const layout = layoutWorkflow(plan),
    width = Math.max(...layout.map((n) => n.x)) + 250,
    height = Math.max(...layout.map((n) => n.y)) + 150;
  return (
    <div className="wf-graph-scroll">
      <div style={{ width: width * zoom, height: height * zoom }}>
        <div
          className="wf-graph"
          style={{
            width,
            height,
            transform: `scale(${zoom})`,
            transformOrigin: "top left",
          }}
        >
          <svg width={width} height={height} aria-hidden="true">
            <defs>
              <marker
                id={arrowId}
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="4"
                orient="auto"
              >
                <path d="M0,0 L8,4 L0,8" fill="currentColor" />
              </marker>
            </defs>
            {layout.flatMap((target) =>
              target.node.dependencies.map((id) => {
                const source = layout.find((n) => n.node.id === id);
                if (!source) return null;
                const x = source.x + 220,
                  y = source.y + 48;
                return (
                  <path
                    key={`${id}-${target.node.id}`}
                    d={`M${x},${y} C${x + 28},${y} ${target.x - 28},${target.y + 48} ${target.x},${target.y + 48}`}
                    stroke="currentColor"
                    fill="none"
                    markerEnd={`url(#${arrowId})`}
                  />
                );
              }),
            )}
          </svg>
          {layout.map(({ node, x, y }) => {
            const attempts = run.attempts.filter((a) => a.nodeId === node.id),
              latest = attempts.at(-1);
            const status = run.pendingApprovals?.some(
              (a) => a.nodeId === node.id,
            )
              ? "waiting_approval"
              : run.accepted[node.id]
                ? "completed"
                : latest?.status === "running" && attempts.length > 1
                  ? "recovering"
                  : latest?.status === "completed"
                    ? "pending"
                    : (latest?.status ?? "pending");
            return (
              <button
                type="button"
                key={node.id}
                className={`wf-node ${status} ${selected === node.id ? "selected" : ""}`}
                style={{ left: x, top: y }}
                onClick={() => onSelect(node.id)}
              >
                <span className="wf-node-status">
                  {WORKFLOW_STATUS[status] ?? status}
                </span>
                <strong>{node.title}</strong>
                <span>
                  {run.config.customSubAgents.find((a) => a.id === node.agentId)
                    ?.label ?? node.agentId}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
