"use client";

import { Bot, ChevronDown, MoreHorizontal, Plus, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { MAX_CUSTOM_SUB_AGENTS, type AgentProfile, type CustomSubAgent, type ProjectAgentConfig, type SubAgentId } from "@/lib/agent-profiles";
import type { CapabilityCatalog } from "@/lib/capability-types";

type ModelOption = { providerId: string; providerLabel: string; modelId: string; label: string };

type SubAgentLibraryProps = {
  catalog: CapabilityCatalog;
  config: ProjectAgentConfig;
  models: ModelOption[];
  onCustomUpdate: (agent: CustomSubAgent) => void;
  onCreateCustom: () => CustomSubAgent;
  onSupplementDefaults: () => void;
  onDeleteCustom: (id: CustomSubAgent["id"]) => void;
};

function modelKey(model: { providerId: string; modelId: string }) {
  return `${model.providerId}:${model.modelId}`;
}

function count(profile: AgentProfile) {
  return profile.enabledSkills.length + profile.enabledTools.length + profile.enabledMcps.length;
}

export function AgentPromptPage({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <section className="agent-page">
      <div className="agent-page-body agent-prompt-page">
        <header className="agent-page-heading"><Bot size={18} /><h1>Agent</h1></header>
        <label className="agent-prompt-field">
          <span>系统提示词</span>
          <textarea value={value} maxLength={12_000} rows={16} onChange={(event) => onChange(event.target.value)} />
        </label>
      </div>
    </section>
  );
}

export function SubAgentLibrary({ catalog, config, models, onCustomUpdate, onCreateCustom, onDeleteCustom, onSupplementDefaults }: SubAgentLibraryProps) {
  const [selectedId, setSelectedId] = useState<SubAgentId | null>(null);
  const selected = useMemo(
    () => config.customSubAgents.find((agent) => agent.id === selectedId) ?? null,
    [config.customSubAgents, selectedId],
  );

  function createAgent() {
    setSelectedId(onCreateCustom().id);
  }

  function updateList(profile: AgentProfile, field: "enabledSkills" | "enabledTools" | "enabledMcps", name: string) {
    const current = profile[field];
    return { ...profile, [field]: current.includes(name) ? current.filter((item) => item !== name) : [...current, name] };
  }

  return (
    <section className="agent-page">
      <div className="agent-page-body subagent-page">
        <header className="agent-page-heading subagent-page-heading">
          <span><Bot size={18} /><h1>SubAgent</h1></span>
          <div className="subagent-heading-actions">
            <button type="button" className="subagent-add" disabled={config.customSubAgents.length >= MAX_CUSTOM_SUB_AGENTS} onClick={createAgent}><Plus size={16} />新增</button>
            <details className="subagent-more"><summary aria-label="更多 Agent 操作"><MoreHorizontal size={18} /></summary><button type="button" onClick={(event) => { onSupplementDefaults(); event.currentTarget.closest("details")?.removeAttribute("open"); }}>补充默认 Agent</button></details>
          </div>
        </header>
        {!!config.starterAgentsSkipped?.length && <p className="subagent-empty" role="status">已达到 {MAX_CUSTOM_SUB_AGENTS} 个 Agent 上限，未添加：{config.starterAgentsSkipped.join("、")}。腾出位置后可在更多菜单中补充。</p>}
        {config.customSubAgents.length ? (
          <div className="subagent-list">
            {config.customSubAgents.map((agent) => {
              const effectiveModel = agent.model ?? config.mainModel;
              const model = effectiveModel ? models.find((item) => modelKey(item) === modelKey(effectiveModel)) : undefined;
              return (
                <article className="subagent-row" key={agent.id}>
                  <button type="button" className="subagent-select" onClick={() => setSelectedId(agent.id)}>
                    <strong>{agent.label}</strong>
                    <span>{agent.description || "未填写职责"}</span>
                    <small>{model?.label ?? "跟随主 Agent"} · {count(agent)} 项能力</small>
                  </button>
                  <label className="subagent-enabled">
                    <input type="checkbox" checked={agent.enabled} onChange={() => onCustomUpdate({ ...agent, enabled: !agent.enabled })} aria-label={`${agent.enabled ? "停用" : "启用"}${agent.label}`} />
                    <i aria-hidden="true" />
                  </label>
                  <button type="button" className="subagent-delete" onClick={() => onDeleteCustom(agent.id)} aria-label={`删除${agent.label}`} title="删除"><Trash2 size={15} /></button>
                </article>
              );
            })}
          </div>
        ) : <p className="subagent-empty">暂无 SubAgent</p>}
      </div>
      {selected && (
        <div className="agent-dialog-backdrop" role="presentation" onMouseDown={() => setSelectedId(null)}>
          <section className="agent-dialog" role="dialog" aria-modal="true" aria-labelledby="agent-dialog-title" onMouseDown={(event) => event.stopPropagation()}>
            <header><h2 id="agent-dialog-title">配置 SubAgent</h2><button type="button" onClick={() => setSelectedId(null)} aria-label="关闭配置"><X size={18} /></button></header>
            <div className="agent-dialog-content">
              <label className="agent-text-field"><span>名称</span><input value={selected.label} maxLength={60} onChange={(event) => onCustomUpdate({ ...selected, label: event.target.value })} /></label>
              <label className="agent-text-field"><span>职责</span><textarea value={selected.description} maxLength={280} rows={3} onChange={(event) => onCustomUpdate({ ...selected, description: event.target.value })} /></label>
              <label className="agent-model-select"><span>模型</span><select value={selected.model ? modelKey(selected.model) : "inherit"} onChange={(event) => {
                const model = models.find((item) => modelKey(item) === event.target.value);
                onCustomUpdate({ ...selected, ...(model ? { model: { providerId: model.providerId, modelId: model.modelId } } : { model: undefined }) });
              }}>
                <option value="inherit">跟随主 Agent</option>
                {models.map((model) => <option value={modelKey(model)} key={modelKey(model)}>{model.providerLabel} · {model.label}</option>)}
              </select><ChevronDown size={13} /></label>
              <CapabilityGroup title="Skills" names={catalog.skills.map((item) => item.name)} enabled={selected.enabledSkills} onToggle={(name) => onCustomUpdate({ ...selected, ...updateList(selected, "enabledSkills", name) })} />
              <CapabilityGroup title="工具" names={catalog.tools.map((item) => item.name)} enabled={selected.enabledTools} onToggle={(name) => onCustomUpdate({ ...selected, ...updateList(selected, "enabledTools", name) })} />
              <CapabilityGroup title="MCP" names={catalog.mcps.map((item) => item.name)} enabled={selected.enabledMcps} onToggle={(name) => onCustomUpdate({ ...selected, ...updateList(selected, "enabledMcps", name) })} />
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

function CapabilityGroup({ title, names, enabled, onToggle }: { title: string; names: string[]; enabled: string[]; onToggle: (name: string) => void }) {
  return <fieldset className="agent-capability-group"><legend>{title}</legend>{names.length ? names.map((name) => <label key={name}><input type="checkbox" checked={enabled.includes(name)} onChange={() => onToggle(name)} /><span>{name}</span></label>) : <p>暂无可用{title}</p>}</fieldset>;
}
