"use client";

import {
  ArrowLeft,
  BookOpenCheck,
  Check,
  Code2,
  Eye,
  Search,
  ShieldCheck,
  Wrench,
  X,
} from "lucide-react";
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
  const PageIcon = isSkill ? BookOpenCheck : Wrench;

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSelected(null);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <section className="capability-page">
      <header className="capability-page-header">
        <button className="capability-back" type="button" onClick={onClose}>
          <ArrowLeft size={16} />
          返回项目
        </button>
        <div className="capability-heading">
          <div className="capability-heading-icon">
            <PageIcon size={21} />
          </div>
          <div>
            <span>AGENT CAPABILITIES</span>
            <h1>{isSkill ? "技能" : "工具"}</h1>
            <p>
              {isSkill
                ? "管理 Agent 可加载的投研方法和执行流程。"
                : "管理 Agent 在对话中可以实际调用的操作能力。"}
            </p>
          </div>
        </div>
        <div className="capability-enabled-count">
          <ShieldCheck size={15} />
          <span>
            已启用 <b>{enabledNames.length}</b> / {items.length}
          </span>
        </div>
      </header>

      <div className="capability-page-body">
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

        <div className="capability-result-meta">
          <span>{query ? `找到 ${filtered.length} 项` : `共 ${items.length} 项`}</span>
          <p>开关会决定下一轮对话中 Agent 可以调用的范围</p>
        </div>

        {filtered.length > 0 ? (
          <div className="capability-grid">
            {filtered.map((item) => {
              const itemEnabled = enabled.has(item.name);
              return (
                <article className={`capability-card ${itemEnabled ? "enabled" : "disabled"}`} key={item.name}>
                  <div className="capability-card-topline">
                    <span className="capability-card-icon">
                      {isSkill ? <BookOpenCheck size={17} /> : <Code2 size={17} />}
                    </span>
                    <span className={`capability-state ${itemEnabled ? "enabled" : "disabled"}`}>
                      {itemEnabled && <Check size={11} />}
                      {itemEnabled ? "已启用" : "已停用"}
                    </span>
                  </div>
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
                      <Eye size={14} />
                      查看详情
                    </button>
                    <label className="capability-switch">
                      <input
                        type="checkbox"
                        checked={itemEnabled}
                        onChange={() => onToggle(item.name)}
                        aria-label={`${itemEnabled ? "停用" : "启用"}${item.label}`}
                      />
                      <span aria-hidden="true" />
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
