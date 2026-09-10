// Persist references and product settings, never provider credentials or
// arbitrary nested request objects. Authorization is still enforced by each
// existing tool and the server-side Agent/capability registry.
export function chatConfig(value = {}) {
  const object = v => v && typeof v === "object" && !Array.isArray(v) ? v : {};
  const strings = v => Array.isArray(v) ? v.filter(x => typeof x === "string").slice(0, 200) : undefined;
  const model = v => typeof v?.providerId === "string" && typeof v?.modelId === "string" ? { providerId: v.providerId, modelId: v.modelId } : undefined;
  const profile = v => { v = object(v); return { enabled: typeof v.enabled === "boolean" ? v.enabled : undefined, model: model(v.model), enabledSkills: strings(v.enabledSkills), enabledTools: strings(v.enabledTools), enabledMcps: strings(v.enabledMcps) }; };
  const c = object(value), a = object(c.agentConfig), p = object(c.agentPrompts);
  const agentConfig = c.agentConfig === undefined ? undefined : {
    mainModel: model(a.mainModel), profiles: { main: profile(a.profiles?.main) },
    customSubAgents: Array.isArray(a.customSubAgents) ? a.customSubAgents.slice(0, 12).map(v => ({ ...profile(v), id: v.id, label: v.label, description: v.description })).filter(v => [v.id, v.label, v.description].every(s => typeof s === "string")) : [],
  };
  return JSON.parse(JSON.stringify({ model: model(c.model), agentConfig,
    agentPrompts: c.agentPrompts === undefined ? undefined : { main: typeof p.main === "string" ? p.main : undefined, customSubAgents: Object.fromEntries(Object.entries(object(p.customSubAgents)).filter(([k, v]) => k.startsWith("custom-") && typeof v === "string")) },
    enabledSkills: strings(c.enabledSkills), enabledTools: strings(c.enabledTools), enabledMcps: strings(c.enabledMcps),
    bashApprovalMode: c.bashApprovalMode === "ask" ? "ask" : "auto", bashPermissionMode: c.bashPermissionMode === "full" ? "full" : "sandbox",
  }));
}
