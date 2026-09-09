"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Play, X, RefreshCw, GitBranch } from "lucide-react";
import type {
  ProjectAgentConfig,
  AgentModelOverride,
} from "@/lib/agent-profiles";
import type {
  WorkflowRun,
  WorkflowTemplate,
  WorkflowNode,
} from "@/lib/workflow-types";
import { WorkflowGraph, layoutWorkflow } from "./workflow-graph";
import { WorkflowAssets } from "./workflow-assets";
import { WorkflowSettings, WorkflowLimits } from "./workflow-settings";
import type { ProjectNavigation } from "./chat-markdown";
import { WorkflowNodeDetails } from "./workflow-node-details";

export type WorkflowToolsProps = {
  page: "assets" | "settings" | "graph" | "save" | "node";
  runId?: string;
  nodeId?: string;
  planVersion?: number;
  onBack: () => void;
  onStarted: (id: string) => void;
  workspaceId: string;
  projectNavigation: ProjectNavigation;
  config: ProjectAgentConfig;
  model?: AgentModelOverride;
  models: Array<AgentModelOverride & { label: string }>;
  onConfigure: () => void;
  onTrace: (id: string) => void;
};
type RunSummary = Pick<
  WorkflowRun,
  "id" | "conversationId" | "title" | "status" | "updatedAt" | "templateId"
>;
const base = "/api/local/workflows";
async function api<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${base}${path}`, {
    ...(body
      ? {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      : {}),
    cache: "no-store",
  });
  const value = (await response.json()) as T & { message?: string };
  if (!response.ok) throw new Error(value.message ?? "Workflow 请求失败");
  return value;
}
const requestId = () => crypto.randomUUID();
const inactive = new Set(["completed", "cancelled", "failed"]);
function modelKey(m?: AgentModelOverride) {
  return m ? `${m.providerId}:${m.modelId}` : "";
}
const defaults = {
  maxNodes: 12,
  maxRevisions: 5,
  maxAttempts: 3,
  timeoutMs: 300000,
  concurrency: 2,
};

export function WorkflowTools({
  page,
  runId,
  nodeId,
  planVersion,
  onBack,
  onStarted,
  workspaceId,
  projectNavigation,
  config,
  model,
  models,
  onConfigure,
  onTrace,
}: WorkflowToolsProps) {
  const [runs, setRuns] = useState<RunSummary[]>([]),
    [templates, setTemplates] = useState<WorkflowTemplate[]>([]);

  const [activeId, setActiveId] = useState(""),
    [run, setRun] = useState<WorkflowRun | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const [task, setTask] = useState(""),
    [selected, setSelected] = useState(""),
    [zoom, setZoom] = useState(1);
  const [plannerModel, setPlannerModel] = useState(""),
    [plannerPrompt, setPlannerPrompt] = useState("");
  const [mode, setMode] = useState<"adaptive" | "fixed">("adaptive"),
    [limits, setLimits] = useState(defaults),
    [approval, setApproval] = useState("auto"),
    [permission, setPermission] = useState("sandbox");
  const [selectedAgents, setSelectedAgents] = useState<string[] | null>(null);
  const [template, setTemplate] = useState<WorkflowTemplate | null>(null),
    [templateVersion, setTemplateVersion] = useState(1),
    [parameters, setParameters] = useState<Record<string, string>>({}),
    [mapping, setMapping] = useState<Record<string, string>>({});
  const [revision, setRevision] = useState(0),
    [saveOpen, setSaveOpen] = useState(false),
    [saveName, setSaveName] = useState(""),
    [saveDescription, setSaveDescription] = useState(""),
    [saveTarget, setSaveTarget] = useState(""),
    [parameterText, setParameterText] = useState("{}");
  const [edit, setEdit] = useState<WorkflowNode | null>(null);
  const busyRef = useRef(false);
  const [linkedRuns, setLinkedRuns] = useState<RunSummary[] | null>(null);
  const activeRef = useRef("");
  const graphRef = useRef<HTMLDivElement>(null);
  const choose = useCallback((id: string) => {
    activeRef.current = id;
    setActiveId(id);
    setRun(null);
    setSelected("");
    setRevision(0);
  }, []);
  const refresh = useCallback(async () => {
    const [r, t] = await Promise.all([
      api<{ runs: RunSummary[] }>(
        `/runs?workspaceId=${encodeURIComponent(workspaceId)}`,
      ),
      api<{ templates: WorkflowTemplate[] }>("/templates"),
    ]);
    setRuns(r.runs);
    setTemplates(t.templates);
  }, [workspaceId]);
  useEffect(() => {
    let disposed = false;
    void Promise.resolve()
      .then(refresh)
      .catch((e) => {
        if (!disposed) setError(e.message);
      });
    const timer = setInterval(() => void refresh().catch(() => {}), 4000);
    return () => {
      disposed = true;
      clearInterval(timer);
    };
  }, [refresh]);
  useEffect(() => {
    const timer = setTimeout(() => {
      choose(runId ?? "");
      setSelected(nodeId ?? "");
      setRevision(planVersion ?? 0);
      setSaveOpen(page === "save");
      setSelectedAgents(null);
    }, 0);
    return () => clearTimeout(timer);
  }, [workspaceId, choose, runId, nodeId, planVersion, page]);
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const value = JSON.parse(
          localStorage.getItem("workflow:settings:v1") ?? "{}",
        );
        setPlannerModel(value.plannerModel ?? "");
        setPlannerPrompt(value.plannerPrompt ?? "");
        setSelectedAgents(value.selectedAgents ?? null);
        setMode(value.mode ?? "adaptive");
        setLimits(value.limits ?? defaults);
        setApproval(value.approval ?? "auto");
        setPermission(value.permission ?? "sandbox");
      } catch {
        /* use defaults */
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (!activeId) return;
    let disposed = false;
    let stream: EventSource | undefined;
    let fetching = false;
    let again = false;
    async function load() {
      if (fetching) {
        again = true;
        return;
      }
      fetching = true;
      try {
        const next = await api<WorkflowRun>(`/runs/${activeId}`);
        if (disposed || activeRef.current !== activeId) return;
        setRun((previous) =>
          !previous || next.seq >= previous.seq ? next : previous,
        );
        if (!stream) {
          if (page === "save") setSaveName(next.title);
          stream = new EventSource(
            `${base}/runs/${activeId}/events?after=${next.seq}`,
          );
          stream.onmessage = () => void load();
          stream.onerror = () => {
            if (!disposed) setError("事件连接正在重连，后台任务继续执行。");
          };
          stream.onopen = () => setError("");
        }
      } catch (e) {
        if (!disposed) setError((e as Error).message);
      } finally {
        fetching = false;
        if (again && !disposed) {
          again = false;
          void load();
        }
      }
    }
    void load();
    return () => {
      disposed = true;
      stream?.close();
    };
  }, [activeId, page]);
  const displayedPlan =
    run?.revisions.find((r) => r.version === (revision || run.version))?.plan ??
    run?.plan;
  const historical = run?.revisions.find((r) => r.version === revision);
  const graphRun =
    run && revision && revision !== run.version
      ? {
          ...run,
          accepted: historical?.accepted ?? {},
          attempts: run.attempts.filter((a) => a.version <= revision),
          pendingApprovals: [],
        }
      : run;
  const node = displayedPlan?.nodes.find((n) => n.id === selected);
  async function perform(fn: () => Promise<void>) {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }
  async function action(type: string, extra: Record<string, unknown> = {}) {
    if (!run) return;
    const value = await api<{ run: WorkflowRun }>(`/runs/${run.id}/actions`, {
      requestId: requestId(),
      expectedVersion: run.version,
      type,
      ...extra,
    });
    setRun(value.run);
    await refresh();
  }
  function selectTemplate(t: WorkflowTemplate, v = t.versions.at(-1)!) {
    choose("");
    setLinkedRuns(null);
    setTemplate(t);
    setTemplateVersion(v.version);
    setTask(v.task);
    setParameters(v.parameters);
    setMapping(
      t.sourceWorkspaceId === workspaceId
        ? Object.fromEntries(
            v.roles
              .filter((role) =>
                config.customSubAgents.some(
                  (a) => a.id === role.id && a.enabled,
                ),
              )
              .map((role) => [role.id, role.id]),
          )
        : {},
    );
  }
  async function start() {
    if (!workspaceId) throw new Error("请先绑定本地项目。");
    const reference = model ?? config.mainModel;
    if (!reference) throw new Error("请先配置模型。");
    const agents = config.customSubAgents.filter(
      (a) =>
        a.enabled && (selectedAgents === null || selectedAgents.includes(a.id)),
    );
    const planner = models.find((m) => modelKey(m) === plannerModel);
    let input = task;
    for (const [k, v] of Object.entries(parameters))
      input = input.replaceAll(`{{${k}}}`, v);
    const conversation = await api<{ id: string }>("/conversations", {
      requestId: requestId(),
      workspaceId,
    });
    const result = await api<{ id: string }>(
      `/conversations/${conversation.id}/messages`,
      {
        requestId: requestId(),
        workspaceId,
        input,
        model: reference,
        plannerModel: planner ?? reference,
        plannerPrompt,
        mode,
        limits,
        agentConfig: { ...config, customSubAgents: agents },
        bashApprovalMode: approval,
        bashPermissionMode: permission,
        ...(template
          ? { templateId: template.id, templateVersion, parameters, mapping }
          : {}),
      },
    );
    localStorage.setItem(
      "workflow:settings:v1",
      JSON.stringify({
        plannerModel,
        plannerPrompt,
        selectedAgents,
        mode,
        limits,
        approval,
        permission,
      }),
    );
    void result;
    onStarted(conversation.id);
    setTemplate(null);
    await refresh();
  }
  async function save() {
    if (!run) return;
    const params = JSON.parse(parameterText);
    if (
      !params ||
      typeof params !== "object" ||
      Array.isArray(params) ||
      Object.values(params).some((v) => typeof v !== "string" || !v)
    )
      throw new Error(
        '参数需为名称与当前值的 JSON 对象，例如 {"公司":"贵州茅台"}。',
      );
    const rev = run.revisions.find(
      (r) => r.version === (revision || run.version),
    )!;
    const substitute = (text: string) =>
      Object.entries(params).reduce(
        (value, [k, v]) => value.replaceAll(v as string, `{{${k}}}`),
        text,
      );
    await api("/templates", {
      requestId: requestId(),
      ...(saveTarget ? { id: saveTarget } : {}),
      runId: run.id,
      version: rev.version,
      name: saveName || run.title,
      description: saveDescription,
      task: substitute(run.input),
      parameters: params,
      plan: {
        ...rev.plan,
        nodes: rev.plan.nodes.map((n) => ({
          ...n,
          task: substitute(n.task),
          acceptance: substitute(n.acceptance),
        })),
      },
    });
    setSaveOpen(false);
    await refresh();
    onBack();
  }
  const templateData = template?.versions.find(
    (v) => v.version === templateVersion,
  );
  if (page === "settings")
    return (
      <WorkflowSettings
        config={config}
        models={models}
        onBack={onBack}
        onConfigure={onConfigure}
      />
    );
  return (
    <section
      className={`workflow-workspace wf-tools wf-tools-${page}`}
      aria-label="Workflow 详情"
    >
      {error && page !== "assets" && (
        <div className="wf-floating-error" role="alert">
          {error}
          <button onClick={() => setError("")} aria-label="关闭提示">
            <X size={14} />
          </button>
        </div>
      )}
      {page === "assets" && (
        <WorkflowAssets
          templates={templates}
          busy={busy}
          onSelect={selectTemplate}
          onCopy={(t) =>
            void perform(async () => {
              await api("/templates", { requestId: requestId(), copyId: t.id });
              await refresh();
            })
          }
          onArchive={(t) =>
            void perform(async () => {
              await api("/templates", {
                requestId: requestId(),
                id: t.id,
                archived: !t.archived,
              });
              await refresh();
            })
          }
          onLinked={(t) => {
            setTemplate(null);
            setLinkedRuns(runs.filter((r) => r.templateId === t.id));
          }}
        />
      )}
      <div className="wf-main">
        <header className="wf-toolbar">
          <strong>{page === "assets" ? "复用工作流" : run?.title}</strong>
          <button onClick={onBack} aria-label="返回对话">
            <X size={18} />
          </button>
        </header>
        {error && page === "assets" && (
          <div className="wf-error" role="alert">
            {error}
            <button onClick={() => setError("")} aria-label="关闭错误">
              <X size={14} />
            </button>
          </div>
        )}
        {page === "assets" && linkedRuns && (
          <section className="wf-create">
            <h3>关联运行</h3>
            {linkedRuns.length ? (
              linkedRuns.map((r) => (
                <button
                  key={r.id}
                  onClick={() => onStarted(r.conversationId ?? r.id)}
                >
                  {r.title}
                </button>
              ))
            ) : (
              <p>当前项目尚未运行此模板。</p>
            )}
          </section>
        )}
        {page === "assets" && template && !run ? (
          <div className="wf-create">
            {page === "assets" && (
              <textarea
                aria-label="工作流任务"
                placeholder="描述目标、研究范围和期望产出…"
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
            )}
            {template && templateData && (
              <section className="wf-template-inputs">
                <strong>复用：{template.name}</strong>
                <label>
                  模板版本
                  <select
                    value={templateVersion}
                    onChange={(e) =>
                      selectTemplate(
                        template,
                        template.versions.find(
                          (v) => v.version === Number(e.target.value),
                        ),
                      )
                    }
                  >
                    {template.versions.map((v) => (
                      <option key={v.version} value={v.version}>
                        版本 {v.version}
                      </option>
                    ))}
                  </select>
                </label>
                {Object.keys(templateData.parameters).map((k) => (
                  <label key={k}>
                    {k}
                    <input
                      value={parameters[k] ?? ""}
                      onChange={(e) =>
                        setParameters({ ...parameters, [k]: e.target.value })
                      }
                    />
                  </label>
                ))}
                {templateData.roles.map((role) => (
                  <label key={role.id}>
                    {role.label} →
                    <select
                      value={mapping[role.id] ?? ""}
                      onChange={(e) =>
                        setMapping({ ...mapping, [role.id]: e.target.value })
                      }
                    >
                      <option value="">选择本项目 Subagent</option>
                      {config.customSubAgents
                        .filter((a) => a.enabled)
                        .map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.label}
                            {a.label === role.label ? "（匹配名称）" : ""}
                          </option>
                        ))}
                    </select>
                    <small>
                      所需能力：
                      {[
                        ...role.enabledTools,
                        ...role.enabledSkills,
                        ...role.enabledMcps,
                      ].join("、") || "无工具要求"}
                    </small>
                  </label>
                ))}
              </section>
            )}
            <button
              className="wf-primary"
              disabled={busy || !task.trim() || !workspaceId}
              onClick={() => void perform(start)}
            >
              <Play size={16} />
              开始对话
            </button>
          </div>
        ) : page === "assets" ? null : !run ? (
          <div className="wf-empty">
            <RefreshCw size={22} />
            加载运行…
          </div>
        ) : (
          <>
            {displayedPlan ? (
              <>
                <div className="wf-graph-toolbar">
                  <select
                    aria-label="计划版本"
                    value={revision || run.version}
                    onChange={(e) => setRevision(Number(e.target.value))}
                  >
                    {run.revisions.map((r) => (
                      <option key={r.version} value={r.version}>
                        计划 v{r.version} · {r.reason}
                      </option>
                    ))}
                  </select>
                  <div className="wf-row">
                    <button
                      onClick={() => setZoom((z) => Math.max(0.4, z - 0.1))}
                    >
                      −
                    </button>
                    <span>{Math.round(zoom * 100)}%</span>
                    <button
                      onClick={() => setZoom((z) => Math.min(1.6, z + 0.1))}
                    >
                      ＋
                    </button>
                    <button
                      onClick={() => {
                        const layout = layoutWorkflow(displayedPlan);
                        const width = Math.max(...layout.map((n) => n.x)) + 250;
                        const height =
                          Math.max(...layout.map((n) => n.y)) + 150;
                        setZoom(
                          Math.min(
                            1,
                            Math.max(
                              100,
                              (graphRef.current?.clientWidth ?? 800) - 24,
                            ) / width,
                            Math.max(
                              100,
                              (graphRef.current?.clientHeight ?? 500) - 24,
                            ) / height,
                          ),
                        );
                      }}
                    >
                      适应视图
                    </button>
                  </div>
                </div>
                <div ref={graphRef} className="wf-graph-container">
                  <WorkflowGraph
                    run={graphRun!}
                    plan={displayedPlan}
                    selected={selected}
                    onSelect={(id) => {
                      setSelected(id);
                    }}
                    zoom={zoom}
                  />
                </div>
              </>
            ) : (
              <div className="wf-empty">
                <GitBranch size={30} />
                <p>Plan Agent 正在设计工作流</p>
              </div>
            )}
            {page === "graph" && !inactive.has(run.status) && (
              <details className="wf-traces">
                <summary onClick={() => setLimits(run.limits)}>
                  运行限制
                </summary>
                <WorkflowLimits value={limits} onChange={setLimits} />
                <button
                  disabled={
                    busy ||
                    !["paused", "waiting_input", "interrupted"].includes(
                      run.status,
                    )
                  }
                  onClick={() =>
                    void perform(() => action("limits", { limits }))
                  }
                >
                  保存运行限制（需暂停）
                </button>
              </details>
            )}
            {!!run.traces.length && (
              <details className="wf-traces">
                <summary>运行 Trace</summary>
                {run.traces.map((id, i) => (
                  <button key={id} onClick={() => onTrace(id)}>
                    Trace {i + 1}
                  </button>
                ))}
              </details>
            )}
          </>
        )}
      </div>
      {run && node && (
        <WorkflowNodeDetails
          key={`${node.id}:${revision}`}
          run={graphRun!}
          node={node}
          revision={revision}
          setEdit={setEdit}
          onClose={() => (page === "node" ? onBack() : setSelected(""))}
          onTrace={onTrace}
          projectNavigation={projectNavigation}
          onError={setError}
        />
      )}
      {edit && run && (
        <div className="wf-modal-backdrop">
          <form
            className="wf-modal"
            onSubmit={(e) => {
              e.preventDefault();
              void perform(async () => {
                const invalidateNodeIds = run.accepted[edit.id]
                  ? window.confirm(
                      "该节点已完成。保存会使此节点及其下游失效并重新执行，是否继续？",
                    )
                    ? [edit.id]
                    : null
                  : [];
                if (invalidateNodeIds === null) return;
                await action("edit", {
                  plan: {
                    ...run.plan,
                    nodes: run.plan!.nodes.map((n) =>
                      n.id === edit.id ? edit : n,
                    ),
                  },
                  invalidateNodeIds,
                });
                setEdit(null);
              });
            }}
          >
            <h3>编辑节点</h3>
            <label>
              名称
              <input
                autoFocus
                value={edit.title}
                onChange={(e) => setEdit({ ...edit, title: e.target.value })}
              />
            </label>
            <label>
              Subagent
              <select
                value={edit.agentId}
                onChange={(e) => setEdit({ ...edit, agentId: e.target.value })}
              >
                {run.config.customSubAgents
                  .filter((a) => a.enabled)
                  .map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              任务
              <textarea
                value={edit.task}
                onChange={(e) => setEdit({ ...edit, task: e.target.value })}
              />
            </label>
            <label>
              完成标准
              <textarea
                value={edit.acceptance}
                onChange={(e) =>
                  setEdit({ ...edit, acceptance: e.target.value })
                }
              />
            </label>
            <fieldset>
              <legend>依赖</legend>
              {run.plan?.nodes
                .filter((n) => n.id !== edit.id)
                .map((n) => (
                  <label className="wf-check" key={n.id}>
                    <input
                      type="checkbox"
                      checked={edit.dependencies.includes(n.id)}
                      onChange={(e) =>
                        setEdit({
                          ...edit,
                          dependencies: e.target.checked
                            ? [...edit.dependencies, n.id]
                            : edit.dependencies.filter((id) => id !== n.id),
                        })
                      }
                    />
                    {n.title}
                  </label>
                ))}
            </fieldset>
            <p>当前节点结束后生效，受影响的下游结果将重新生成。</p>
            <div className="wf-row">
              <button type="button" onClick={() => setEdit(null)}>
                取消
              </button>
              <button disabled={busy}>应用修改</button>
            </div>
          </form>
        </div>
      )}
      {saveOpen && run && (
        <div className="wf-modal-backdrop">
          <form
            className="wf-modal"
            onSubmit={(e) => {
              e.preventDefault();
              void perform(save);
            }}
          >
            <h3>保存工作流模板</h3>
            <label>
              保存到
              <select
                value={saveTarget}
                onChange={(e) => setSaveTarget(e.target.value)}
              >
                <option value="">新建资产</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} · 新版本
                  </option>
                ))}
              </select>
            </label>
            <label>
              名称
              <input
                autoFocus
                required
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
              />
            </label>
            <label>
              描述
              <textarea
                value={saveDescription}
                onChange={(e) => setSaveDescription(e.target.value)}
              />
            </label>
            <label>
              计划版本
              <select
                value={revision || run.version}
                onChange={(e) => setRevision(Number(e.target.value))}
              >
                {run.revisions.map((r) => (
                  <option key={r.version} value={r.version}>
                    v{r.version}
                  </option>
                ))}
              </select>
            </label>
            <label>
              参数与当前值（JSON）
              <textarea
                value={parameterText}
                onChange={(e) => setParameterText(e.target.value)}
              />
            </label>
            <p>
              例如 {`{"公司":"贵州茅台"}`}
              ：把任务中的当前值替换为参数，复用时填写新值。
            </p>
            <div className="wf-row">
              <button type="button" onClick={onBack}>
                取消
              </button>
              <button disabled={busy}>保存</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
