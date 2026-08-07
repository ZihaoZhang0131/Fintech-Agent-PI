"use client";

import { ArrowLeft, ExternalLink, RefreshCw, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { CapabilityItem, CapabilityKind, McpCapabilityTool } from "@/lib/capability-types";

type CapabilityLibraryProps = {
  kind: CapabilityKind;
  items: CapabilityItem[];
  enabledNames: string[];
  onToggle: (name: string) => void;
  onRefresh?: () => void;
  onClose: () => void;
};

export function CapabilityLibrary({
  kind,
  items,
  enabledNames,
  onToggle,
  onRefresh,
  onClose,
}: CapabilityLibraryProps) {
  const [query, setQuery] = useState("");
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const enabled = useMemo(() => new Set(enabledNames), [enabledNames]);
  const filtered = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase("zh-CN");
    if (!keyword) return items;
    return items.filter((item) =>
      `${item.label} ${item.name} ${item.description}`.toLocaleLowerCase("zh-CN").includes(keyword),
    );
  }, [items, query]);
  const isSkill = kind === "skill";
  const isMcp = kind === "mcp";
  const kindLabel = isSkill ? "技能" : isMcp ? "MCP" : "工具";
  const selected = useMemo(
    () => items.find((item) => item.name === selectedName) ?? null,
    [items, selectedName],
  );

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedName(null);
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
              placeholder={`搜索${kindLabel}名称或简介`}
              aria-label={`搜索${kindLabel}`}
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="清空搜索">
                <X size={14} />
              </button>
            )}
          </label>
          {isMcp && (
            <button
              className="capability-refresh"
              type="button"
              onClick={onRefresh}
              aria-label="刷新 MCP 连接状态"
              title="刷新 MCP 连接状态"
            >
              <RefreshCw size={15} />
            </button>
          )}
        </div>

        {filtered.length > 0 ? (
          <div className="capability-grid">
            {filtered.map((item) => {
              const itemEnabled = enabled.has(item.name);
              const toggleAvailable = !isMcp || item.status === "connected";
              return (
                <article className={`capability-card ${itemEnabled ? "enabled" : "disabled"}`} key={item.name}>
                  <div className="capability-card-copy">
                    <h2>{item.label}</h2>
                    {!isMcp && item.label !== item.name && <code>{item.name}</code>}
                    <p>{item.description}</p>
                  </div>
                  {isSkill && Boolean(item.allowedTools?.length) && (
                    <div className="capability-dependencies">
                      依赖工具：{item.allowedTools?.join("、")}
                    </div>
                  )}
                  {isMcp && (
                    <div className={`mcp-card-summary ${item.status ?? "stopped"}`}>
                      <span>{mcpStatusLabel(item.status)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.mcpTools?.length ?? 0} 个工具</span>
                    </div>
                  )}
                  <footer className="capability-card-actions">
                    <button className="capability-view-button" type="button" onClick={() => setSelectedName(item.name)}>
                      查看详情
                    </button>
                    <label className="capability-toggle">
                      <span>{itemEnabled ? "已启用" : "已停用"}</span>
                      <input
                        type="checkbox"
                        checked={itemEnabled}
                        onChange={() => onToggle(item.name)}
                        disabled={!toggleAvailable}
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
            <strong>没有匹配的{kindLabel}</strong>
            <span>换一个关键词试试</span>
          </div>
        )}
      </div>

      {selected && (
        <div className="capability-modal-backdrop" role="presentation" onMouseDown={() => setSelectedName(null)}>
          <section
            className="capability-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="capability-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="capability-modal-header">
              <div>
                <span>
                  {selected.kind === "skill"
                    ? "SKILL DETAIL"
                    : selected.kind === "mcp"
                      ? "MCP"
                      : "TOOL SOURCE"}
                </span>
                <h2 id="capability-modal-title">{selected.label}</h2>
              </div>
              <button type="button" onClick={() => setSelectedName(null)} aria-label="关闭详情">
                <X size={18} />
              </button>
            </header>
            <div className={`capability-modal-content ${selected.kind}`}>
              {selected.kind === "skill" ? (
                <ReactMarkdown>{selected.detail}</ReactMarkdown>
              ) : selected.kind === "mcp" ? (
                <div className="mcp-detail">
                  <p>{selected.description}</p>
                  <div className={`mcp-detail-summary ${selected.status ?? "stopped"}`}>
                    <span>{mcpStatusLabel(selected.status)}</span>
                    <span>{selected.mcpTools?.length ?? 0} 个工具</span>
                  </div>
                  {selected.error && <div className="mcp-detail-error">{selected.error}</div>}
                  {selected.status === "not_installed" && (
                    <div className="mcp-setup-command">
                      <span>安装命令</span>
                      <code>npm run mcp:setup</code>
                    </div>
                  )}
                  <div className="mcp-tool-list">
                    <h3>工具</h3>
                    {selected.mcpTools?.length ? selected.mcpTools.map((tool) => (
                      <article key={tool.name}>
                        <code>{tool.name}</code>
                        <p>{mcpToolDescription(tool)}</p>
                      </article>
                    )) : <p>连接成功后会自动发现并展示工具。</p>}
                  </div>
                  {selected.homepage && (
                    <a href={selected.homepage} target="_blank" rel="noreferrer">
                      查看项目主页 <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              ) : (
                <pre>
                  <code>{selected.detail}</code>
                </pre>
              )}
            </div>
            <footer className={`capability-modal-footer ${selected.kind === "mcp" ? "mcp" : ""}`}>
              <button
                type="button"
                onClick={() => onToggle(selected.name)}
                disabled={selected.kind === "mcp" && selected.status !== "connected"}
              >
                {enabled.has(selected.name) ? "停用" : "启用"}
              </button>
            </footer>
          </section>
        </div>
      )}
    </section>
  );
}

function mcpStatusLabel(status: CapabilityItem["status"]) {
  if (status === "connected") return "已连接";
  if (status === "connecting") return "连接中";
  if (status === "not_installed") return "未安装";
  if (status === "error") return "连接错误";
  return "未连接";
}

function mcpToolDescription(tool: McpCapabilityTool) {
  const discoveredDescription = tool.description
    ?.replace(/\s*\n\s*/g, " ")
    .replace(/\bArgs:\s*/i, "参数：")
    .trim();
  if (discoveredDescription) return discoveredDescription;

  const descriptions: Record<string, string> = {
    get_hist_data: "查询 A 股历史行情，支持 A、B、H 股。",
    get_realtime_data: "查询 A 股实时行情，支持 A、B、H 股。",
    get_news_data: "查询与个股相关的新闻。",
    get_balance_sheet: "查询公司的资产负债表。",
    get_income_statement: "查询公司的利润表。",
    get_cash_flow: "查询公司的现金流量表。",
    get_inner_trade_data: "查询公司的内部交易数据。",
    get_financial_metrics: "查询公司的财务指标。",
    get_time_info: "查询交易日与市场时间信息。",
  };

  return descriptions[tool.name] ?? "查询相关的市场与公司数据。";
}
