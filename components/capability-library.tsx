"use client";

import { ArrowLeft, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { CapabilityItem, CapabilityKind } from "@/lib/capability-types";

type CapabilityLibraryProps = {
  kind: CapabilityKind;
  items: CapabilityItem[];
  enabledNames: string[];
  onToggle: (name: string) => void;
  onClose: () => void;
};

export function CapabilityLibrary({
  kind,
  items,
  enabledNames,
  onToggle,
  onClose,
}: CapabilityLibraryProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<CapabilityItem | null>(null);
  const enabled = useMemo(() => new Set(enabledNames), [enabledNames]);
  const filtered = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase("zh-CN");
    if (!keyword) return items;
    return items.filter((item) =>
      `${item.label} ${item.name} ${item.description}`.toLocaleLowerCase("zh-CN").includes(keyword),
    );
  }, [items, query]);
  const isSkill = kind === "skill";

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSelected(null);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <section className="capability-page">
      <div className="capability-page-body">
        <div className="capability-toolbar">
          <button
            className="capability-back"
            type="button"
            onClick={onClose}
            aria-label="返回项目"
            title="返回项目"
          >
            <ArrowLeft size={16} />
          </button>
          <label className="capability-search">
            <Search size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`搜索${isSkill ? "技能" : "工具"}名称或简介`}
              aria-label={`搜索${isSkill ? "技能" : "工具"}`}
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="清空搜索">
                <X size={14} />
              </button>
            )}
          </label>
        </div>

        {filtered.length > 0 ? (
          <div className="capability-grid">
            {filtered.map((item) => {
              const itemEnabled = enabled.has(item.name);
              return (
                <article className={`capability-card ${itemEnabled ? "enabled" : "disabled"}`} key={item.name}>
                  <div className="capability-card-copy">
                    <h2>{item.label}</h2>
                    {item.label !== item.name && <code>{item.name}</code>}
                    <p>{item.description}</p>
                  </div>
                  {isSkill && Boolean(item.allowedTools?.length) && (
                    <div className="capability-dependencies">
                      依赖工具：{item.allowedTools?.join("、")}
                    </div>
                  )}
                  <footer className="capability-card-actions">
                    <button className="capability-view-button" type="button" onClick={() => setSelected(item)}>
                      查看详情
                    </button>
                    <label className="capability-toggle">
                      <span>{itemEnabled ? "已启用" : "已停用"}</span>
                      <input
                        type="checkbox"
                        checked={itemEnabled}
                        onChange={() => onToggle(item.name)}
                        aria-label={`${itemEnabled ? "停用" : "启用"}${item.label}`}
                      />
                      <i aria-hidden="true" />
                    </label>
                  </footer>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="capability-no-results">
            <Search size={24} />
            <strong>没有匹配的{isSkill ? "技能" : "工具"}</strong>
            <span>换一个关键词试试</span>
          </div>
        )}
      </div>

      {selected && (
        <div className="capability-modal-backdrop" role="presentation" onMouseDown={() => setSelected(null)}>
          <section
            className="capability-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="capability-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="capability-modal-header">
              <div>
                <span>{selected.kind === "skill" ? "SKILL DETAIL" : "TOOL SOURCE"}</span>
                <h2 id="capability-modal-title">{selected.label}</h2>
                <code>{selected.sourcePath}</code>
              </div>
              <button type="button" onClick={() => setSelected(null)} aria-label="关闭详情">
                <X size={18} />
              </button>
            </header>
            <div className={`capability-modal-content ${selected.kind}`}>
              {selected.kind === "skill" ? (
                <ReactMarkdown>{selected.detail}</ReactMarkdown>
              ) : (
                <pre>
                  <code>{selected.detail}</code>
                </pre>
              )}
            </div>
            <footer className="capability-modal-footer">
              <span className={`capability-state ${enabled.has(selected.name) ? "enabled" : "disabled"}`}>
                {enabled.has(selected.name) ? "当前已启用" : "当前已停用"}
              </span>
              <button type="button" onClick={() => onToggle(selected.name)}>
                {enabled.has(selected.name) ? "停用" : "启用"}
              </button>
            </footer>
          </section>
        </div>
      )}
    </section>
  );
}
