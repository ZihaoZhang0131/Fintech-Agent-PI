"use client";

import { ArrowLeft, CheckCircle2, CircleAlert, Cpu, LoaderCircle, X } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

export type ModelProviderItem = {
  id: string;
  label: string;
  models: Array<{ id: string; label: string }>;
  enabledModelIds: string[];
  configured: boolean;
  verified: boolean;
  source?: "local" | "environment";
  verification?: {
    modelId?: string;
    status: "untested" | "verified" | "failed";
    testedAt?: number;
    error?: string;
  };
};

type ModelLibraryProps = {
  providers: ModelProviderItem[];
  loading: boolean;
  error: string;
  onSaveAndTest: (providerId: string, payload: { apiKey?: string; enabledModelIds: string[]; modelId: string }) => Promise<void>;
  onDelete: (providerId: string) => Promise<void>;
  onClose: () => void;
};

export function ModelLibrary({
  providers,
  loading,
  error,
  onSaveAndTest,
  onDelete,
  onClose,
}: ModelLibraryProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [enabledModelIds, setEnabledModelIds] = useState<string[]>([]);
  const [testModelId, setTestModelId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selected = useMemo(
    () => providers.find((provider) => provider.id === selectedId) ?? null,
    [providers, selectedId],
  );

  function beginConfig(provider: ModelProviderItem) {
    const enabled = provider.enabledModelIds.length
      ? provider.enabledModelIds
      : [provider.models[0]?.id].filter(Boolean);
    setEnabledModelIds(enabled);
    setTestModelId(
      enabled.includes(provider.verification?.modelId ?? "")
        ? provider.verification?.modelId ?? enabled[0]
        : enabled[0] ?? "",
    );
    setApiKey("");
    setSelectedId(provider.id);
  }

  function toggleModel(modelId: string) {
    setEnabledModelIds((current) => {
      const next = current.includes(modelId)
        ? current.filter((id) => id !== modelId)
        : [...current, modelId];
      if (!next.length) return current;
      if (!next.includes(testModelId)) setTestModelId(next[0]);
      return next;
    });
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!selected || !testModelId || !enabledModelIds.length) return;
    setSubmitting(true);
    try {
      await onSaveAndTest(selected.id, {
        ...(apiKey ? { apiKey } : {}),
        enabledModelIds,
        modelId: testModelId,
      });
      setApiKey("");
    } finally {
      setSubmitting(false);
    }
  }

  async function remove() {
    if (!selected || !window.confirm(`移除 ${selected.label} 的本机配置？`)) return;
    setSubmitting(true);
    try {
      await onDelete(selected.id);
      setSelectedId(null);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="model-page">
      <div className="model-page-body">
        <div className="model-page-toolbar">
          <button type="button" onClick={onClose} aria-label="返回项目" title="返回项目">
            <ArrowLeft size={16} />
          </button>
        </div>

        {error && <p className="model-page-error">{error}</p>}
        <div className="model-provider-grid" aria-label="模型服务商">
          {providers.map((provider) => (
            <article className="model-provider-card" key={provider.id}>
              <div>
                <h2>{provider.label}</h2>
                <p className={provider.verified ? "verified" : provider.configured ? "configured" : ""}>
                  {provider.verified ? "已验证" : provider.configured ? "待验证" : "未配置"}
                </p>
              </div>
              <footer>
                <span>{provider.enabledModelIds.length} 个模型</span>
                <button type="button" onClick={() => beginConfig(provider)}>
                  配置
                </button>
              </footer>
            </article>
          ))}
        </div>
        {loading && (
          <div className="model-page-loading">
            <LoaderCircle size={18} />
          </div>
        )}
      </div>

      {selected && (
        <div className="model-dialog-backdrop" role="presentation" onMouseDown={() => !submitting && setSelectedId(null)}>
          <section
            className="model-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="model-dialog-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header>
              <div>
                <Cpu size={15} />
                <h2 id="model-dialog-title">{selected.label}</h2>
              </div>
              <button type="button" onClick={() => setSelectedId(null)} disabled={submitting} aria-label="关闭配置">
                <X size={17} />
              </button>
            </header>
            <form onSubmit={(event) => void submit(event)}>
              <label className="model-key-field">
                <span>API Key</span>
                <input
                  type="password"
                  autoComplete="off"
                  value={apiKey}
                  onChange={(event) => setApiKey(event.target.value)}
                  placeholder={selected.configured ? "留空则保留当前密钥" : "粘贴 API Key"}
                  required={!selected.configured}
                />
              </label>
              <fieldset className="model-enable-list">
                <legend>可用模型</legend>
                {selected.models.map((model) => (
                  <label key={model.id}>
                    <input
                      type="checkbox"
                      checked={enabledModelIds.includes(model.id)}
                      onChange={() => toggleModel(model.id)}
                    />
                    <span>{model.label}</span>
                  </label>
                ))}
              </fieldset>
              <label className="model-test-select">
                <span>验证模型</span>
                <select value={testModelId} onChange={(event) => setTestModelId(event.target.value)}>
                  {selected.models
                    .filter((model) => enabledModelIds.includes(model.id))
                    .map((model) => (
                      <option value={model.id} key={model.id}>
                        {model.label}
                      </option>
                    ))}
                </select>
              </label>
              {selected.verification?.status === "failed" && (
                <p className="model-test-error">
                  <CircleAlert size={14} />
                  {selected.verification.error}
                </p>
              )}
              {selected.verified && (
                <p className="model-test-success">
                  <CheckCircle2 size={14} />
                  已验证 {selected.models.find((model) => model.id === selected.verification?.modelId)?.label ?? "模型"}
                </p>
              )}
              <footer>
                {selected.source === "local" && (
                  <button className="model-remove-button" type="button" onClick={() => void remove()} disabled={submitting}>
                    移除配置
                  </button>
                )}
                <button className="model-save-button" type="submit" disabled={submitting || !enabledModelIds.length}>
                  {submitting ? "正在测试…" : selected.configured ? "重新测试" : "保存并测试"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}
