"use client";
import { useEffect, useRef, useState } from "react";
import { Maximize2, MoreHorizontal } from "lucide-react";
import { MarkdownMessage, type ProjectNavigation } from "./chat-markdown";
import {
  WorkflowGraph,
  WORKFLOW_STATUS,
  layoutWorkflow,
} from "./workflow-graph";
import type { WorkflowRun, WorkflowPlan } from "@/lib/workflow-types";
import type { WorkflowSnapshot } from "@/lib/workflow-client";
import { workflowApi, terminalWorkflow } from "@/lib/workflow-client";
export type WorkflowOpen = (
  page: "graph" | "save" | "node",
  run: WorkflowRun,
  nodeId?: string,
  version?: number,
) => void;
function CompactGraph({
  run,
  plan,
  onSelect,
}: {
  run: WorkflowRun;
  plan: WorkflowPlan;
  onSelect: (id: string) => void;
}) {
  const el = useRef<HTMLDivElement>(null),
    [zoom, setZoom] = useState(0.7);
  useEffect(() => {
    if (!el.current) return;
    const width = Math.max(...layoutWorkflow(plan).map((n) => n.x)) + 250;
    const observer = new ResizeObserver(([entry]) =>
      setZoom(Math.max(0.5, Math.min(0.85, entry.contentRect.width / width))),
    );
    observer.observe(el.current);
    return () => observer.disconnect();
  }, [plan]);
  return (
    <div className="wf-inline-graph" ref={el}>
      <WorkflowGraph
        run={run}
        plan={plan}
        selected=""
        onSelect={onSelect}
        zoom={zoom}
      />
    </div>
  );
}
function Approvals({
  run,
  onError,
}: {
  run: WorkflowRun;
  onError: (s: string) => void;
}) {
  const [commands, setCommands] = useState<
      Array<{ id: string; command: string }>
    >([]),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    let disposed = false;
    const pending = run.pendingApprovals ?? [];
    if (!pending.length) return;
    void Promise.all(
      pending.map(async (p) => {
        const a = run.attempts.filter((a) => a.nodeId === p.nodeId).at(-1);
        if (!a) return null;
        const d = await workflowApi<{
          operations: Array<{ commandId?: string; command?: string }>;
        }>(`/runs/${run.id}/attempts/${a.id}`);
        return {
          id: p.commandId,
          command:
            d.operations.find((o) => o.commandId === p.commandId)?.command ??
            "等待命令信息",
        };
      }),
    )
      .then((values) => {
        if (!disposed)
          setCommands(
            values.filter((v): v is { id: string; command: string } => !!v),
          );
      })
      .catch((e) => onError(e.message));
    return () => {
      disposed = true;
    };
  }, [run, onError]);
  if (!run.pendingApprovals?.length) return null;
  return (
    <div className="wf-approvals">
      {commands
        .filter((c) => run.pendingApprovals?.some((p) => p.commandId === c.id))
        .map((c) => (
          <div key={c.id}>
            <p>此命令需要你批准</p>
            <pre>{c.command}</pre>
            <div className="wf-row">
              {["approve", "reject"].map((decision) => (
                <button
                  key={decision}
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    try {
                      const r = await fetch(
                        `/api/local/workspaces/${run.workspaceId}/commands/${c.id}/decision`,
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ decision }),
                        },
                      );
                      if (!r.ok) throw new Error("审批失败，请重试。");
                    } catch (e) {
                      onError((e as Error).message);
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  {decision === "approve" ? "批准" : "拒绝"}
                </button>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
export function WorkflowMessages({
  snapshot,
  projectNavigation,
  onOpen,
  onError,
}: {
  snapshot: WorkflowSnapshot | null;
  projectNavigation: ProjectNavigation;
  onOpen: WorkflowOpen;
  onError: (s: string) => void;
}) {
  const scroll = useRef<HTMLDivElement>(null),
    follow = useRef(true),
    last = snapshot?.runs.at(-1);
  useEffect(() => {
    if (follow.current && scroll.current)
      scroll.current.scrollTop = scroll.current.scrollHeight;
  }, [snapshot]);
  return (
    <div
      className="chat-scroll-area wf-message-scroll"
      ref={scroll}
      onScroll={() => {
        const el = scroll.current!;
        follow.current = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
      }}
    >
      <div className="wf-message-list">
        {!snapshot?.messages.length ? (
          <div className="wf-welcome">
            <h2>有什么任务需要一起完成？</h2>
            <p>描述目标，Agent 会规划并协作执行。</p>
          </div>
        ) : (
          snapshot.messages.map((message) => {
            const run = snapshot.runs.find((r) => r.id === message.runId);
            if (!run) return null;
            if (message.kind !== "plan")
              return (
                <article
                  key={message.id}
                  className={`wf-message ${message.role}`}
                >
                  <MarkdownMessage content={message.content} projectNavigation={projectNavigation} />
                </article>
              );
            const revision = run.revisions.find(
              (r) => r.version === message.version,
            );
            if (!revision) return null;
            const historical =
              last?.id !== run.id || message.version !== run.version;
            const graphRun =
              message.version === run.version
                ? run
                : {
                    ...run,
                    accepted: revision.accepted ?? {},
                    attempts: run.attempts.filter(
                      (a) => a.version <= revision.version,
                    ),
                    pendingApprovals: [],
                  };
            return (
              <article
                key={message.id}
                className="wf-message assistant wf-plan-message"
              >
                <details open={historical ? undefined : true}>
                  <summary>
                    规划与执行{" "}
                    <span>
                      {WORKFLOW_STATUS[run.status]} ·{" "}
                      {Object.keys(graphRun.accepted).length}/
                      {revision.plan.nodes.length}
                    </span>
                  </summary>
                  <MarkdownMessage content={message.content} projectNavigation={projectNavigation} />
                  <div className="wf-plan-actions">
                    <button
                      aria-label="展开 DAG"
                      title="展开 DAG"
                      onClick={() =>
                        onOpen("graph", run, undefined, message.version)
                      }
                    >
                      <Maximize2 size={14} />
                    </button>
                    <details className="wf-popover">
                      <summary aria-label="规划更多操作">
                        <MoreHorizontal size={16} />
                      </summary>
                      <div>
                        <button
                          onClick={() =>
                            onOpen("save", run, undefined, message.version)
                          }
                        >
                          保存工作流
                        </button>
                      </div>
                    </details>
                  </div>
                  <CompactGraph
                    run={graphRun}
                    plan={revision.plan}
                    onSelect={(id) => onOpen("node", run, id, message.version)}
                  />
                </details>
              </article>
            );
          })
        )}
        {last &&
          !terminalWorkflow.has(last.status) &&
          (!last.plan || !!last.pendingApprovals?.length) && (
            <div className="wf-execution">
              {!last.plan && (
                <span aria-live="polite">{WORKFLOW_STATUS[last.status]}</span>
              )}
              <Approvals run={last} onError={onError} />
            </div>
          )}
      </div>
    </div>
  );
}
