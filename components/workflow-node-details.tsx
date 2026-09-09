"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type {
  WorkflowRun,
  WorkflowNode,
  WorkflowAttempt,
  WorkflowOperation,
} from "@/lib/workflow-types";
import {
  workflowApi as api,
  terminalWorkflow as inactive,
} from "@/lib/workflow-client";
import { WORKFLOW_STATUS } from "./workflow-graph";
import { workflowArtifactPaths, allowWorkflowSourceLink, workflowSourceIsPlainText } from "@/lib/workflow-links";
import { MarkdownMessage, type ProjectNavigation } from "./chat-markdown";
export function WorkflowNodeDetails({
  run,
  node,
  revision,
  setEdit,
  onClose,
  onTrace,
  projectNavigation,
  onError,
}: {
  run: WorkflowRun;
  node: WorkflowNode;
  revision: number;
  setEdit: (node: WorkflowNode) => void;
  onClose: () => void;
  onTrace: (id: string) => void;
  projectNavigation: ProjectNavigation;
  onError: (message: string) => void;
}) {
  const [attemptId, setAttemptId] = useState(""),
    [attemptData, setAttemptData] = useState<{
      attempt: WorkflowAttempt;
      operations: WorkflowOperation[];
    } | null>(null),
    [busy, setBusy] = useState(false);
  const attempts = run.attempts.filter((a) => a.nodeId === node.id),
    focusedAttempt = attemptId || attempts.at(-1)?.id || "";
  const knownProjectFiles = workflowArtifactPaths(run,
    attemptData?.attempt.id === focusedAttempt ? attemptData.attempt : undefined);
  useEffect(() => {
    if (!focusedAttempt) return;
    let disposed = false;
    void api<{ attempt: WorkflowAttempt; operations: WorkflowOperation[] }>(
      `/runs/${run.id}/attempts/${focusedAttempt}`,
    )
      .then((d) => {
        if (!disposed) setAttemptData(d);
      })
      .catch((e) => {
        if (!disposed) onError(e.message);
      });
    return () => {
      disposed = true;
    };
  }, [run.id, run.seq, focusedAttempt, onError]);
  async function perform(fn: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      onError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <aside className="wf-inspector">
      <header>
        <strong>{node.title}</strong>
        <button aria-label="关闭节点详情" onClick={onClose}>
          <X size={16} />
        </button>
      </header>
      <p>{node.task}</p>
      <small>完成标准：{node.acceptance}</small>
      <small>
        所需能力：
        {[
          ...(node.requires?.tools ?? []),
          ...(node.requires?.skills ?? []),
          ...(node.requires?.mcps ?? []),
        ].join("、") || "无"}
      </small>
      <small>
        预期产物：
        {(node.outputs ?? [])
          .map((output) => output.path ?? output.id)
          .join("、") || "文本结果"}
      </small>
      {!inactive.has(run.status) &&
        run.mode !== "fixed" &&
        (!revision || revision === run.version) && (
          <button
            onClick={() =>
              setEdit({ ...node, dependencies: [...node.dependencies] })
            }
          >
            编辑节点
          </button>
        )}
      <select
        aria-label="节点执行尝试"
        value={focusedAttempt}
        onChange={(e) => setAttemptId(e.target.value)}
      >
        {attempts.map((a, i) => (
          <option key={a.id} value={a.id}>
            尝试 {i + 1} · {WORKFLOW_STATUS[a.status] ?? a.status}
          </option>
        ))}
      </select>
      {attemptData?.attempt.id === focusedAttempt && (
        <>
          {attemptData.attempt.traceId && (
            <button onClick={() => onTrace(attemptData.attempt.traceId!)}>
              查看本次 Trace
            </button>
          )}
          <details>
            <summary>本次输入</summary>
            <pre>{attemptData.attempt.input}</pre>
          </details>
          {attemptData.attempt.error && (
            <p className="wf-error">{attemptData.attempt.error}</p>
          )}
          {attemptData.attempt.retryDirective && (
            <small>恢复指令：{attemptData.attempt.retryDirective}</small>
          )}
          {attemptData.attempt.result && (
            <>
              <MarkdownMessage content={attemptData.attempt.result.text} projectNavigation={projectNavigation} knownProjectFiles={knownProjectFiles} />
              {attemptData.attempt.result.sources.map((s) => (
                workflowSourceIsPlainText(s) ? <p key={s}>{s}</p> : (
                  <MarkdownMessage key={s} content={s} projectNavigation={projectNavigation}
                    knownProjectFiles={knownProjectFiles} allowLink={allowWorkflowSourceLink} />
                )
              ))}
              {attemptData.attempt.result.issues.map((s, i) => (
                <p key={i}>{s}</p>
              ))}
              {attemptData.attempt.result.artifacts.map((p) => (
                <button key={p} onClick={() => projectNavigation.onOpenFile({ path: p })}>
                  {p}
                </button>
              ))}
            </>
          )}
          {attemptData.operations.map((op) => (
            <details key={op.id} open={op.status === "pending_approval"}>
              <summary>
                {op.tool} ·{" "}
                {op.status === "pending_approval"
                  ? "等待审批"
                  : op.outcome === "command_failed"
                    ? `命令退出 ${op.exitCode ?? "非零"}`
                    : op.reusedFrom
                      ? "已复用"
                      : op.status}
              </summary>
              {op.reusedFrom && <small>复用操作：{op.reusedFrom}</small>}
              <pre>{JSON.stringify(op.arguments, null, 2)}</pre>
              {op.error && <p>{op.error}</p>}
              {op.status === "unknown" && (
                <p>操作可能已产生副作用，恢复时先核验目标状态。</p>
              )}
              {op.status === "pending_approval" && op.commandId && (
                <>
                  <pre>{op.command}</pre>
                  <div className="wf-row">
                    {["approve", "reject"].map((decision) => (
                      <button
                        key={decision}
                        onClick={() =>
                          void perform(async () => {
                            const response = await fetch(
                              `/api/local/workspaces/${run.workspaceId}/commands/${op.commandId}/decision`,
                              {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ decision }),
                              },
                            );
                            if (!response.ok)
                              throw new Error("审批提交失败，请刷新后重试。");
                          })
                        }
                      >
                        {decision === "approve" ? "批准" : "拒绝"}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <pre>{JSON.stringify(op.result, null, 2)}</pre>
            </details>
          ))}
        </>
      )}
    </aside>
  );
}
