"use client";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ArrowUp, Cpu, MoreHorizontal, Play, Square, Menu } from "lucide-react";
import {
  workflowApi as api,
  workflowBase,
  workflowChanged,
  workflowSettings,
  terminalWorkflow,
  type WorkflowSnapshot,
} from "@/lib/workflow-client";
import { WorkflowTools, type WorkflowToolsProps } from "./workflow-tools";
import { WorkflowMessages, type WorkflowOpen } from "./workflow-messages";
import { WorkflowDialog } from "./workflow-dialog";
import { ChatComposer } from "./chat-composer";
type Props = Omit<
  WorkflowToolsProps,
  "page" | "runId" | "nodeId" | "planVersion" | "onBack" | "onStarted"
> & {
  conversationId: string;
  onConversationChange: (id: string) => void;
  modeSwitch: ReactNode;
  onSidebar: () => void;
};
export function WorkflowWorkspace({
  conversationId,
  onConversationChange,
  modeSwitch,
  onSidebar,
  ...tools
}: Props) {
  const [snapshot, setSnapshot] = useState<WorkflowSnapshot | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [draft, setDraft] = useState("");
  const [page, setPage] = useState<WorkflowToolsProps["page"] | null>(null),
    [focus, setFocus] = useState<{
      runId?: string;
      nodeId?: string;
      planVersion?: number;
    }>({});
  const [modelKey, setModelKey] = useState("");
  const draftKey = `workflow:draft:${conversationId || `new:${tools.workspaceId}`}`;
  const current = useRef(conversationId),
    busyRef = useRef(false),
    retry = useRef<{ input: string; id: string } | null>(null);
  useEffect(() => {
    current.current = conversationId;
  }, [conversationId]);
  const load = useCallback(async () => {
    if (!conversationId) return;
    const data = await api<WorkflowSnapshot>(
      `/conversations/${conversationId}`,
    );
    if (current.current === conversationId) setSnapshot(data);
  }, [conversationId]);
  useEffect(() => {
    let disposed = false;
    const timer = setTimeout(() => {
      setSnapshot(null);
      setDraft(localStorage.getItem(draftKey) ?? "");
      setError("");
      setPage(null);
    }, 0);
    let stream: EventSource | undefined;
    let fetching = false;
    async function refresh() {
      if (disposed || fetching || !conversationId) return;
      fetching = true;
      try {
        const d = await api<WorkflowSnapshot>(
          `/conversations/${conversationId}`,
        );
        if (disposed) return;
        setSnapshot(d);
        const run = d.runs.at(-1);
        if (run && (!stream || !stream.url.includes(`/runs/${run.id}/`))) {
          stream?.close();
          stream = new EventSource(
            `${workflowBase}/runs/${run.id}/events?after=${run.seq}`,
          );
          stream.onmessage = () => void refresh();
          stream.onerror = () => {
            if (!disposed) setError("连接正在恢复，任务仍在后台执行。");
          };
          stream.onopen = () => {
            if (!disposed) setError("");
          };
        }
      } catch (e) {
        if (!disposed) setError((e as Error).message);
      } finally {
        fetching = false;
      }
    }
    void refresh();
    const interval = setInterval(() => void refresh(), 2000);
    return () => {
      disposed = true;
      clearTimeout(timer);
      clearInterval(interval);
      stream?.close();
    };
  }, [conversationId, draftKey]);
  function changeDraft(text: string) {
    setDraft(text);
    localStorage.setItem(draftKey, text);
  }
  async function perform(fn: () => Promise<void>) {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError("");
    try {
      await fn();
      await load();
      workflowChanged();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }
  const run = snapshot?.runs.at(-1),
    active = run && !terminalWorkflow.has(run.status),
    waiting =
      active && ["paused", "waiting_input", "interrupted"].includes(run.status),
    transition = run?.status === "pausing";
  async function action(type: string) {
    if (!run) return;
    await api(`/runs/${run.id}/actions`, {
      requestId: crypto.randomUUID(),
      expectedVersion: run.version,
      type,
    });
  }
  async function send() {
    if (!draft.trim()) {
      if (active) await action(waiting ? "resume" : "stop");
      return;
    }
    if (!tools.workspaceId) throw new Error("请先绑定本地项目。");
    let id = conversationId;
    if (!id) {
      const c = await api<{ id: string }>("/conversations", {
        requestId: crypto.randomUUID(),
        workspaceId: tools.workspaceId,
      });
      id = c.id;
      localStorage.setItem(`workflow:draft:${id}`, draft);
      onConversationChange(id);
    }
    const settings = workflowSettings(),
      reference =
        tools.models.find((m) => `${m.providerId}:${m.modelId}` === modelKey) ??
        tools.model ??
        tools.config.mainModel;
    const planner =
      tools.models.find(
        (m) => `${m.providerId}:${m.modelId}` === settings.plannerModel,
      ) ?? reference;
    if (!retry.current || retry.current.input !== draft)
      retry.current = { input: draft, id: crypto.randomUUID() };
    await api(`/conversations/${id}/messages`, {
      requestId: retry.current.id,
      input: draft,
      workspaceId: tools.workspaceId,
      model: reference,
      plannerModel: planner,
      plannerPrompt: settings.plannerPrompt ?? "",
      mode: settings.mode ?? "adaptive",
      limits: settings.limits,
      agentConfig: {
        ...tools.config,
        customSubAgents: tools.config.customSubAgents.filter(
          (a) =>
            a.enabled &&
            (!settings.selectedAgents ||
              settings.selectedAgents.includes(a.id)),
        ),
      },
      bashApprovalMode: settings.approval ?? "auto",
      bashPermissionMode: settings.permission ?? "sandbox",
    });
    retry.current = null;
    localStorage.removeItem(draftKey);
    localStorage.removeItem(`workflow:draft:${id}`);
    setDraft("");
  }
  const open: WorkflowOpen = (page, run, nodeId, planVersion) => {
    setFocus({ runId: run.id, nodeId, planVersion });
    setPage(page);
  };
  function manage(page: "settings" | "assets") {
    setFocus({});
    setPage(page);
  }
  const toolPage = page && (
    <WorkflowTools
      key={`${page}:${focus.runId ?? ""}`}
      {...tools}
      {...focus}
      page={page}
      onBack={() => setPage(null)}
      onStarted={(id) => {
        onConversationChange(id);
        setPage(null);
        workflowChanged();
      }}
    />
  );
  return (
    <section
      className="chat-column wf-conversation"
      aria-label="Workflow 对话"
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest(".wf-popover button"))
          target.closest("details")?.removeAttribute("open");
      }}
    >
      <header className="chat-header">
        <div className="header-title-group">
          <button
            className="mobile-icon-button sidebar-trigger"
            aria-label="打开项目列表"
            onClick={onSidebar}
          >
            <Menu size={19} />
          </button>
          <h1>
            {page === "assets"
              ? "工作流资产"
              : page === "settings"
                ? "Workflow 设置"
                : (snapshot?.conversation.title ?? "新对话")}
          </h1>
        </div>
        {modeSwitch}
        <details className="wf-popover">
          <summary aria-label="对话更多操作">
            <MoreHorizontal size={20} />
          </summary>
          <div>
            {page && <button onClick={() => setPage(null)}>返回对话</button>}
            <button onClick={() => manage("assets")}>工作流资产</button>
            <button onClick={() => manage("settings")}>Workflow 设置</button>
            {run && (
              <button onClick={() => open("graph", run)}>运行详情</button>
            )}
          </div>
        </details>
      </header>
      {page === "assets" || page === "settings" ? (
        toolPage
      ) : (
        <>
          <WorkflowMessages
            snapshot={snapshot}
            onOpen={open}
            onError={setError}
          />
          <div className="composer-wrap">
            {error && (
              <p className="wf-connection-error" role="alert">
                {error}
              </p>
            )}
            <ChatComposer
              value={draft}
              onChange={changeDraft}
              disabled={busy || transition || !tools.workspaceId}
              placeholder={
                active ? "补充要求或回答问题…" : "发送任务，或继续追问…"
              }
              onSubmit={() => void perform(send)}
            >
              <div className="composer-options">
                <label className="composer-control model-control">
                  <Cpu size={12} />
                  <select
                    aria-label="Workflow 模型"
                    value={
                      modelKey ||
                      `${tools.model?.providerId ?? ""}:${tools.model?.modelId ?? ""}`
                    }
                    onChange={(e) => setModelKey(e.target.value)}
                    disabled={!!active}
                  >
                    <option value="">项目主模型</option>
                    {tools.models.map((m) => (
                      <option
                        key={`${m.providerId}:${m.modelId}`}
                        value={`${m.providerId}:${m.modelId}`}
                      >
                        {m.label}
                      </option>
                    ))}
                  </select>
                </label>
                <details className="wf-popover wf-composer-menu">
                  <summary aria-label="输入框更多操作">
                    <MoreHorizontal size={18} />
                  </summary>
                  <div>
                    {active && !waiting && (
                      <button
                        type="button"
                        disabled={busy || transition}
                        onClick={() => void perform(() => action("pause"))}
                      >
                        暂停执行
                      </button>
                    )}
                    <button type="button" onClick={() => manage("settings")}>
                      Workflow 设置
                    </button>
                  </div>
                </details>
              </div>
              <div className="wf-row">
                {(busy || transition) && (
                  <small>{transition ? "等待当前节点结束…" : "提交中…"}</small>
                )}
                {active && draft.trim() && (
                  <button
                    type="button"
                    className="wf-stop-small"
                    aria-label="停止"
                    disabled={busy || transition}
                    onClick={() => void perform(() => action("stop"))}
                  >
                    <Square size={14} />
                  </button>
                )}
                <button
                  className="send-button"
                  type="submit"
                  aria-label={
                    draft.trim()
                      ? "发送"
                      : waiting
                        ? "继续"
                        : active
                          ? "停止"
                          : "发送"
                  }
                  disabled={
                    busy ||
                    transition ||
                    (!draft.trim() && !active) ||
                    !tools.workspaceId
                  }
                >
                  {draft.trim() ? (
                    <ArrowUp size={18} />
                  ) : waiting ? (
                    <Play size={17} />
                  ) : active ? (
                    <Square size={16} />
                  ) : (
                    <ArrowUp size={18} />
                  )}
                </button>
              </div>
            </ChatComposer>
          </div>
          {page && (
            <WorkflowDialog onClose={() => setPage(null)}>
              {toolPage}
            </WorkflowDialog>
          )}
        </>
      )}
    </section>
  );
}
