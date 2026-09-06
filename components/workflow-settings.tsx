"use client";
import { useEffect, useState } from "react";
import type {
  ProjectAgentConfig,
  AgentModelOverride,
} from "@/lib/agent-profiles";
import type { WorkflowRun } from "@/lib/workflow-types";
import { workflowSettings } from "@/lib/workflow-client";
export const defaultWorkflowLimits = {
  maxNodes: 12,
  maxRevisions: 5,
  maxAttempts: 3,
  timeoutMs: 300000,
  concurrency: 2,
};
export function WorkflowLimits({
  value,
  onChange,
}: {
  value: WorkflowRun["limits"];
  onChange: (value: WorkflowRun["limits"]) => void;
}) {
  return (
    <div className="wf-settings-grid">
      {(
        [
          ["maxNodes", "最多节点", 1, 50],
          ["maxRevisions", "自动调整次数", 0, 20],
          ["maxAttempts", "每节点尝试次数", 1, 10],
          ["concurrency", "并行节点", 1, 4],
        ] as const
      ).map(([key, label, min, max]) => (
        <label key={key}>
          {label}
          <input
            type="number"
            min={min}
            max={max}
            required
            value={value[key]}
            onChange={(e) =>
              onChange({ ...value, [key]: Number(e.target.value) })
            }
          />
        </label>
      ))}
      <label>
        节点超时（分钟）
        <input
          type="number"
          min={1}
          max={30}
          required
          value={value.timeoutMs / 60000}
          onChange={(e) =>
            onChange({ ...value, timeoutMs: Number(e.target.value) * 60000 })
          }
        />
      </label>
    </div>
  );
}
export function WorkflowSettings({
  config,
  models,
  onBack,
  onConfigure,
}: {
  config: ProjectAgentConfig;
  models: Array<AgentModelOverride & { label: string }>;
  onBack: () => void;
  onConfigure: () => void;
}) {
  const [value, setValue] = useState({
    plannerModel: "",
    plannerPrompt: "",
    mode: "adaptive",
    limits: defaultWorkflowLimits,
    approval: "auto",
    permission: "sandbox",
    selectedAgents: null as string[] | null,
  });
  useEffect(() => {
    const t = setTimeout(
      () => setValue((v) => ({ ...v, ...workflowSettings() })),
      0,
    );
    return () => clearTimeout(t);
  }, []);
  return (
    <section className="workflow-workspace wf-tools wf-tools-settings">
      <div className="wf-main">
        <header className="wf-toolbar">
          <span>新一轮执行将使用这些设置</span>
          <button onClick={onBack}>返回对话</button>
        </header>
        <form
          className="wf-settings"
          onSubmit={(e) => {
            e.preventDefault();
            localStorage.setItem("workflow:settings:v1", JSON.stringify(value));
            onBack();
          }}
        >
          <label>
            Plan Agent 模型
            <select
              value={value.plannerModel}
              onChange={(e) =>
                setValue({ ...value, plannerModel: e.target.value })
              }
            >
              <option value="">跟随项目主模型</option>
              {models.map((m) => (
                <option
                  key={`${m.providerId}:${m.modelId}`}
                  value={`${m.providerId}:${m.modelId}`}
                >
                  {m.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            补充规划指令
            <textarea
              value={value.plannerPrompt}
              onChange={(e) =>
                setValue({ ...value, plannerPrompt: e.target.value })
              }
            />
          </label>
          <label>
            执行方式
            <select
              value={value.mode}
              onChange={(e) => setValue({ ...value, mode: e.target.value })}
            >
              <option value="adaptive">自适应工作流</option>
              <option value="fixed">固定结构</option>
            </select>
          </label>
          <fieldset>
            <legend>Subagent 范围</legend>
            <label className="wf-check">
              <input
                type="checkbox"
                checked={value.selectedAgents === null}
                onChange={(e) =>
                  setValue({
                    ...value,
                    selectedAgents: e.target.checked
                      ? null
                      : config.customSubAgents
                          .filter((a) => a.enabled)
                          .map((a) => a.id),
                  })
                }
              />
              使用全部已启用 Subagent
            </label>
            {value.selectedAgents !== null &&
              config.customSubAgents
                .filter((a) => a.enabled)
                .map((a) => (
                  <label className="wf-check" key={a.id}>
                    <input
                      type="checkbox"
                      checked={value.selectedAgents!.includes(a.id)}
                      onChange={(e) =>
                        setValue({
                          ...value,
                          selectedAgents: e.target.checked
                            ? [...value.selectedAgents!, a.id]
                            : value.selectedAgents!.filter((id) => id !== a.id),
                        })
                      }
                    />
                    {a.label}
                  </label>
                ))}
            <button type="button" onClick={onConfigure}>
              管理 Subagent
            </button>
          </fieldset>
          <WorkflowLimits
            value={value.limits}
            onChange={(limits) => setValue({ ...value, limits })}
          />
          <div className="wf-row">
            <label>
              Bash 审批
              <select
                value={value.approval}
                onChange={(e) =>
                  setValue({ ...value, approval: e.target.value })
                }
              >
                <option value="auto">自动执行</option>
                <option value="ask">每条确认</option>
              </select>
            </label>
            <label>
              Bash 权限
              <select
                value={value.permission}
                onChange={(e) =>
                  setValue({ ...value, permission: e.target.value })
                }
              >
                <option value="sandbox">项目沙箱</option>
                <option value="full">完全权限</option>
              </select>
            </label>
          </div>
          <button className="wf-primary">保存设置</button>
        </form>
      </div>
    </section>
  );
}
