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
import { MarkdownMessage } from "./chat-markdown";
import { CodePreview } from "./code-preview";
export function WorkflowNodeDetails({
  run,
  node,
  revision,
  setEdit,
  onClose,
  onTrace,
  onError,
}: {
  run: WorkflowRun;
  node: WorkflowNode;
  revision: number;
  setEdit: (node: WorkflowNode) => void;
  onClose: () => void;
  onTrace: (id: string) => void;
  onError: (message: string) => void;
}) {
  const [attemptId, setAttemptId] = useState(""),
    [attemptData, setAttemptData] = useState<{
      attempt: WorkflowAttempt;
      operations: WorkflowOperation[];
    } | null>(null),
    [artifact, setArtifact] = useState(""),
    [busy, setBusy] = useState(false);
  const attempts = run.attempts.filter((a) => a.nodeId === node.id),
    focusedAttempt = attemptId || attempts.at(-1)?.id || "";
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
          {attemptData.attempt.result && (
            <>
              <MarkdownMessage content={attemptData.attempt.result.text} />
              {attemptData.attempt.result.sources.map((s) => (
                <p key={s}>
                  {/^https?:\/\//.test(s) ? (
                    <a href={s} target="_blank" rel="noreferrer">
                      {s}
                    </a>
                  ) : (
                    s
                  )}
                </p>
              ))}
              {attemptData.attempt.result.issues.map((s, i) => (
                <p key={i}>{s}</p>
              ))}
              {attemptData.attempt.result.artifacts.map((p) => (
                <button key={p} onClick={() => setArtifact(p)}>
                  {p}
                </button>
              ))}
            </>
          )}
          {attemptData.operations.map((op) => (
            <details key={op.id} open={op.status === "pending_approval"}>
              <summary>
                {op.tool} ·{" "}
                {op.status === "pending_approval" ? "等待审批" : op.status}
              </summary>
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
      {artifact && (
        <WorkflowArtifact
          key={artifact}
          workspaceId={run.workspaceId}
          path={artifact}
        />
      )}
    </aside>
  );
}
function WorkflowArtifact({
  workspaceId,
  path,
}: {
  workspaceId: string;
  path: string;
}) {
  const [data, setData] = useState<{
      kind: string;
      content?: string;
      extension: string;
      name: string;
    } | null>(null),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    void fetch(
      `/api/local/workspaces/${workspaceId}/files/content?path=${encodeURIComponent(path)}`,
    )
      .then(async (r) => {
        const v = (await r.json()) as {
          kind: string;
          content?: string;
          extension: string;
          name: string;
          message?: string;
        };
        if (!r.ok) throw new Error(v.message);
        if (active) setData(v);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [workspaceId, path]);
  const url = `/api/local/workspaces/${workspaceId}/files/asset?path=${encodeURIComponent(path)}`;
  return (
    <section className="wf-artifact">
      <strong>{path}</strong>
      <a href={`${url}&download=1`}>下载</a>
      {error && <p>{error}</p>}
      {data?.kind === "text" &&
        (data.extension === ".md" ? (
          <MarkdownMessage content={data.content ?? ""} />
        ) : (
          <CodePreview
            content={data.content ?? ""}
            extension={data.extension}
            name={data.name}
          />
        ))}
      {data?.kind === "pdf" && <iframe title={path} src={url} />}
      <a href={url} target="_blank" rel="noreferrer">
        打开产物
      </a>
    </section>
  );
}
