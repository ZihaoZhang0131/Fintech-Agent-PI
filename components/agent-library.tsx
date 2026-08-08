"use client";

import { ArrowLeft, Bot, ChevronDown, Cpu, Settings2, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { AgentProfile, AgentRoleId, ProjectAgentConfig } from "@/lib/agent-profiles";
import type { CapabilityCatalog } from "@/lib/capability-types";

type ModelOption = { providerId: string; providerLabel: string; modelId: string; label: string };

type AgentLibraryProps = {
  catalog: CapabilityCatalog;
  config: ProjectAgentConfig;
  models: ModelOption[];
  onUpdate: (id: AgentRoleId, profile: AgentProfile) => void;
  onClose: () => void;
};

function modelKey(model: { providerId: string; modelId: string }) {
  return `${model.providerId}:${model.modelId}`;
}

function count(profile: AgentProfile) {
  return profile.enabledSkills.length + profile.enabledTools.length + profile.enabledMcps.length;
}

export function AgentLibrary({ catalog, config, models, onUpdate, onClose }: AgentLibraryProps) {
  const [selectedId, setSelectedId] = useState<AgentRoleId | null>(null);
  const childAgents = useMemo(() => catalog.agents.filter((agent) => !agent.isMain), [catalog.agents]);
  const selected = useMemo(
    () => childAgents.find((agent) => agent.id === selectedId) ?? null,
    [childAgents, selectedId],
  );
  const selectedProfile = selected ? config.profiles[selected.id] : null;

  function updateList(profile: AgentProfile, field: "enabledSkills" | "enabledTools" | "enabledMcps", name: string) {
    const current = profile[field];
    return { ...profile, [field]: current.includes(name) ? current.filter((item) => item !== name) : [...current, name] };
  }

  return (
    <section className="agent-page">
      <div className="agent-page-body">
        <div className="agent-page-toolbar">
          <button type="button" onClick={onClose} aria-label="返回项目" title="返回项目"><ArrowLeft size={16} /></button>
          <div><Bot size={17} /><span>Agent 配置</span></div>
        </div>
        <p className="agent-page-intro">配置当前项目中主 Agent 可委派的专业角色。主 Agent 的模型、技能、工具与 MCP 继续在现有界面统一管理；每个子 Agent 的能力默认关闭，按需启用。</p>
        <div className="agent-card-grid">
          {childAgents.map((agent) => {
            const profile = config.profiles[agent.id];
            const override = profile.model;
            const effective = override ?? config.mainModel;
            return (
              <article className={`agent-card ${profile.enabled ? "enabled" : "disabled"}`} key={agent.id}>
                <div className="agent-card-heading"><Bot size={17} /><div><h2>{agent.label}</h2><p>{agent.description}</p></div></div>
                <div className="agent-card-meta"><span><Cpu size={12} />{effective ? models.find((model) => modelKey(model) === modelKey(effective))?.label ?? effective.modelId : "未选择模型"}</span><span>{count(profile)} 项能力</span></div>
                <footer>
                  <button type="button" onClick={() => setSelectedId(agent.id)}><Settings2 size={14} />配置</button>
                  <label className="capability-toggle"><span>{profile.enabled ? "已启用" : "已停用"}</span><input type="checkbox" checked={profile.enabled} onChange={() => onUpdate(agent.id, { ...profile, enabled: !profile.enabled })} aria-label={`${profile.enabled ? "停用" : "启用"}${agent.label}`} /><i aria-hidden="true" /></label>
                </footer>
              </article>
            );
          })}
        </div>
      </div>
      {selected && selectedProfile && (
        <div className="agent-dialog-backdrop" role="presentation" onMouseDown={() => setSelectedId(null)}>
          <section className="agent-dialog" role="dialog" aria-modal="true" aria-labelledby="agent-dialog-title" onMouseDown={(event) => event.stopPropagation()}>
            <header><div><span>AGENT PROFILE</span><h2 id="agent-dialog-title">{selected.label}</h2></div><button type="button" onClick={() => setSelectedId(null)} aria-label="关闭配置"><X size={18} /></button></header>
            <div className="agent-dialog-content">
              <p>{selected.description}</p>
              <label className="agent-model-select"><span>模型</span><select value={selectedProfile.model ? modelKey(selectedProfile.model) : "inherit"} onChange={(event) => {
                const value = event.target.value;
                const model = models.find((item) => modelKey(item) === value);
                onUpdate(selected.id, { ...selectedProfile, ...(model ? { model: { providerId: model.providerId, modelId: model.modelId } } : { model: undefined }) });
              }}>
                <option value="inherit">跟随主 Agent</option>
                {models.map((model) => <option value={modelKey(model)} key={modelKey(model)}>{model.providerLabel} · {model.label}</option>)}
              </select><ChevronDown size={13} /></label>
              <CapabilityGroup title="Skills" names={selected.maxSkills} enabled={selectedProfile.enabledSkills} onToggle={(name) => onUpdate(selected.id, updateList(selectedProfile, "enabledSkills", name))} />
              <CapabilityGroup title="工具" names={selected.maxTools} enabled={selectedProfile.enabledTools} onToggle={(name) => onUpdate(selected.id, updateList(selectedProfile, "enabledTools", name))} />
              <CapabilityGroup title="MCP" names={selected.maxMcps} enabled={selectedProfile.enabledMcps} onToggle={(name) => onUpdate(selected.id, updateList(selectedProfile, "enabledMcps", name))} />
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

function CapabilityGroup({ title, names, enabled, onToggle }: { title: string; names: string[]; enabled: string[]; onToggle: (name: string) => void }) {
  return <fieldset className="agent-capability-group"><legend>{title}</legend>{names.length ? names.map((name) => <label key={name}><input type="checkbox" checked={enabled.includes(name)} onChange={() => onToggle(name)} /><span>{name}</span></label>) : <p>此角色不允许使用{title}。</p>}</fieldset>;
}
