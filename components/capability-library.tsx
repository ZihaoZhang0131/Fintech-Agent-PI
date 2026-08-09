"use client";

import { ArrowLeft, Download, ExternalLink, FileCode, FileText, FolderUp, Image as ImageIcon, Pencil, RefreshCw, Save, Search, Trash2, Upload, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { CapabilityItem, CapabilityKind, McpCapabilityTool } from "@/lib/capability-types";

type CapabilityLibraryProps = {
  kind: CapabilityKind;
  items: CapabilityItem[];
  enabledNames: string[];
  onToggle: (name: string) => void;
  onRefresh?: () => void;
  onSkillImport?: (source: { kind: "folder"; files: File[] } | { kind: "zip"; file: File }) => Promise<void>;
  onSkillUpdate?: (item: CapabilityItem, value: SkillDraft) => Promise<void>;
  onSkillDelete?: (item: CapabilityItem) => Promise<void>;
  onSkillReadResource?: (item: CapabilityItem, path: string) => Promise<SkillResourcePreview>;
  onSkillWriteResource?: (item: CapabilityItem, path: string, file: File) => Promise<void>;
  onSkillDeleteResource?: (item: CapabilityItem, path: string) => Promise<void>;
  onSkillExport?: (item: CapabilityItem) => Promise<void>;
  onClose: () => void;
};

type SkillDraft = { name: string; description: string; instructions: string };
export type SkillResourcePreview = {
  path: string;
  size: number;
  kind: "text" | "image" | "pdf" | "binary";
  mimeType: string;
  content?: string;
  data?: string;
};

export function CapabilityLibrary({
  kind,
  items,
  enabledNames,
  onToggle,
  onRefresh,
  onSkillImport,
  onSkillUpdate,
  onSkillDelete,
  onSkillReadResource,
  onSkillWriteResource,
  onSkillDeleteResource,
  onSkillExport,
  onClose,
}: CapabilityLibraryProps) {
  const [query, setQuery] = useState("");
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<SkillDraft | null>(null);
  const [operationError, setOperationError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [skillTab, setSkillTab] = useState<"instructions" | "files">("instructions");
  const [showImportMenu, setShowImportMenu] = useState(false);
  const [selectedResourcePath, setSelectedResourcePath] = useState("");
  const [resourcePreview, setResourcePreview] = useState<SkillResourcePreview | null>(null);
  const [resourceDraft, setResourceDraft] = useState("");
  const [resourceEditing, setResourceEditing] = useState(false);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);
  const resourceInputRef = useRef<HTMLInputElement>(null);
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

  function selectItem(item: CapabilityItem) {
    setSelectedName(item.name);
    setEditing(false);
    setSkillTab("instructions");
    setSelectedResourcePath("");
    setResourcePreview(null);
    setResourceEditing(false);
    setOperationError("");
    setDraft(item.kind === "skill"
      ? { name: item.name, description: item.description, instructions: item.detail }
      : null);
  }

  async function importSkillFolder(files: FileList | null) {
    if (!files?.length || !onSkillImport) return;
    setSubmitting(true);
    setOperationError("");
    try {
      await onSkillImport({ kind: "folder", files: Array.from(files) });
    } catch (error) {
      setOperationError(error instanceof Error ? error.message : "导入技能失败。");
    } finally {
      setSubmitting(false);
      if (folderInputRef.current) folderInputRef.current.value = "";
    }
  }

  async function importSkillZip(file: File | null) {
    if (!file || !onSkillImport) return;
    setSubmitting(true);
    setOperationError("");
    try {
      await onSkillImport({ kind: "zip", file });
      setShowImportMenu(false);
    } catch (error) {
      setOperationError(error instanceof Error ? error.message : "导入技能失败。");
    } finally {
      setSubmitting(false);
      if (zipInputRef.current) zipInputRef.current.value = "";
    }
  }

  async function selectResource(resource: NonNullable<CapabilityItem["resources"]>[number]) {
    if (!selected || !onSkillReadResource) return;
    setSelectedResourcePath(resource.path);
    setResourcePreview(null);
    setResourceEditing(false);
    setOperationError("");
    try {
      const preview = await onSkillReadResource(selected, resource.path);
      setResourcePreview(preview);
      setResourceDraft(preview.content ?? "");
    } catch (error) {
      setOperationError(error instanceof Error ? error.message : "读取技能文件失败。");
    }
  }

  async function saveResource() {
    if (!selected || !resourcePreview || !onSkillWriteResource) return;
    setSubmitting(true);
    setOperationError("");
    try {
      await onSkillWriteResource(selected, resourcePreview.path, new File([resourceDraft], resourcePreview.path.split("/").at(-1) || "resource.txt", { type: "text/plain" }));
      setResourcePreview({ ...resourcePreview, content: resourceDraft, size: new Blob([resourceDraft]).size });
      setResourceEditing(false);
    } catch (error) {
      setOperationError(error instanceof Error ? error.message : "保存技能文件失败。");
    } finally {
      setSubmitting(false);
    }
  }

  async function uploadResource(file: File | null) {
    if (!selected || !file || !onSkillWriteResource) return;
    const targetPath = window.prompt("输入文件在 Skill 内的路径：", selectedResourcePath || file.name);
    if (!targetPath) return;
    setSubmitting(true);
    setOperationError("");
    try {
      await onSkillWriteResource(selected, targetPath, file);
      await selectResource({ path: targetPath, name: targetPath.split("/").at(-1) || targetPath, size: file.size, extension: `.${file.name.split(".").at(-1) ?? ""}`, category: targetPath.startsWith("scripts/") ? "script" : "file", isText: file.type.startsWith("text/") || /\.(md|txt|json|js|mjs|py|sh)$/i.test(file.name) });
    } catch (error) {
      setOperationError(error instanceof Error ? error.message : "上传技能文件失败。");
    } finally {
      setSubmitting(false);
      if (resourceInputRef.current) resourceInputRef.current.value = "";
    }
  }

  async function deleteResource() {
    if (!selected || !selectedResourcePath || selectedResourcePath === "SKILL.md" || !onSkillDeleteResource) return;
    if (!window.confirm(`确定删除文件“${selectedResourcePath}”？`)) return;
    setSubmitting(true);
    setOperationError("");
    try {
      await onSkillDeleteResource(selected, selectedResourcePath);
      setSelectedResourcePath("");
      setResourcePreview(null);
    } catch (error) {
      setOperationError(error instanceof Error ? error.message : "删除技能文件失败。");
    } finally {
      setSubmitting(false);
    }
  }

  async function saveSkill() {
    if (!selected || selected.kind !== "skill" || !draft || !onSkillUpdate) return;
    setSubmitting(true);
    setOperationError("");
    try {
      await onSkillUpdate(selected, draft);
      setEditing(false);
      setSelectedName(null);
    } catch (error) {
      setOperationError(error instanceof Error ? error.message : "保存技能失败。");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteSkill() {
    if (!selected || selected.kind !== "skill" || !onSkillDelete) return;
    if (!window.confirm(`确定删除技能“${selected.name}”？此操作仅影响本机技能目录。`)) return;
    setSubmitting(true);
    setOperationError("");
    try {
      await onSkillDelete(selected);
      setSelectedName(null);
    } catch (error) {
      setOperationError(error instanceof Error ? error.message : "删除技能失败。");
    } finally {
      setSubmitting(false);
    }
  }

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
          {isSkill && onSkillImport && (
            <>
              <input
                ref={folderInputRef}
                className="capability-folder-input"
                type="file"
                multiple
                {...({ webkitdirectory: "", directory: "" } as Record<string, string>)}
                onChange={(event) => void importSkillFolder(event.target.files)}
              />
              <input ref={zipInputRef} className="capability-folder-input" type="file" accept=".zip,application/zip" onChange={(event) => void importSkillZip(event.target.files?.[0] ?? null)} />
              <button
                className="capability-import"
                type="button"
                onClick={() => setShowImportMenu((current) => !current)}
                disabled={submitting}
              >
                <FolderUp size={15} /> 导入技能
              </button>
              {showImportMenu && (
                <div className="capability-import-menu">
                  <button type="button" onClick={() => folderInputRef.current?.click()}>选择文件夹</button>
                  <button type="button" onClick={() => zipInputRef.current?.click()}>选择 ZIP 包</button>
                </div>
              )}
            </>
          )}
        </div>

        {isSkill && operationError && !selected && <div className="capability-operation-error">{operationError}</div>}

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
                    {isSkill && <SkillResourceSummary resources={item.resources ?? []} />}
                  </div>
                  {isMcp && (
                    <div className={`mcp-card-summary ${item.status ?? "stopped"}`}>
                      <span>{mcpStatusLabel(item.status)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.mcpTools?.length ?? 0} 个工具</span>
                    </div>
                  )}
                  <footer className="capability-card-actions">
                    <button className="capability-view-button" type="button" onClick={() => selectItem(item)}>
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
              {selected.kind === "skill" ? editing && draft ? (
                <div className="skill-editor">
                  <label>名称<input value={draft.name} maxLength={80} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
                  <label>Skill 描述（Agent 看到的）<textarea value={draft.description} maxLength={300} rows={3} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></label>
                  <label>Skill 内容<textarea value={draft.instructions} maxLength={20_000} rows={16} onChange={(event) => setDraft({ ...draft, instructions: event.target.value })} /></label>
                  {operationError && <div className="capability-operation-error">{operationError}</div>}
                </div>
              ) : (
                <div className="skill-detail">
                  <div className="skill-detail-tabs" role="tablist" aria-label="Skill 详情页签">
                    <button type="button" className={skillTab === "instructions" ? "active" : ""} onClick={() => setSkillTab("instructions")}>说明</button>
                    <button type="button" className={skillTab === "files" ? "active" : ""} onClick={() => setSkillTab("files")}>文件 <span>{selected.resources?.length ?? 0}</span></button>
                  </div>
                  {skillTab === "instructions" ? <ReactMarkdown>{selected.detail}</ReactMarkdown> : (
                    <div className="skill-file-manager">
                      <aside className="skill-file-tree">
                        <div className="skill-file-tree-heading"><span>完整目录</span><SkillResourceSummary resources={selected.resources ?? []} /></div>
                        {(selected.resources ?? []).map((resource) => (
                          <button key={resource.path} type="button" className={selectedResourcePath === resource.path ? "active" : ""} style={{ paddingInlineStart: `${10 + Math.max(0, resource.path.split("/").length - 1) * 12}px` }} onClick={() => void selectResource(resource)}>
                            {resource.category === "script" ? <FileCode size={13} /> : resource.category === "asset" ? <ImageIcon size={13} /> : <FileText size={13} />}
                            <span>{resource.name}</span>
                          </button>
                        ))}
                      </aside>
                      <section className="skill-file-preview">
                        {!resourcePreview && <p>从左侧选择文件以预览或编辑。</p>}
                        {resourcePreview?.kind === "text" && (resourceEditing ? <textarea value={resourceDraft} rows={18} onChange={(event) => setResourceDraft(event.target.value)} /> : <pre><code>{resourcePreview.content}</code></pre>)}
                        {resourcePreview?.kind === "image" && resourcePreview.data && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={`data:${resourcePreview.mimeType};base64,${resourcePreview.data}`} alt={resourcePreview.path} />
                        )}
                        {resourcePreview?.kind === "pdf" && resourcePreview.data && <iframe title={resourcePreview.path} src={`data:${resourcePreview.mimeType};base64,${resourcePreview.data}`} />}
                        {resourcePreview?.kind === "binary" && resourcePreview.data && <a download={resourcePreview.path.split("/").at(-1)} href={`data:${resourcePreview.mimeType};base64,${resourcePreview.data}`}>下载二进制文件</a>}
                        {resourcePreview && <div className="skill-file-preview-actions">
                          <span>{resourcePreview.path} · {resourcePreview.size} bytes</span>
                          {resourcePreview.kind === "text" && resourcePreview.path !== "SKILL.md" && (resourceEditing ? <button type="button" onClick={() => void saveResource()} disabled={submitting}><Save size={13} /> 保存</button> : <button type="button" onClick={() => setResourceEditing(true)}><Pencil size={13} /> 编辑</button>)}
                          {resourcePreview.data && <a download={resourcePreview.path.split("/").at(-1)} href={`data:${resourcePreview.mimeType};base64,${resourcePreview.data}`}><Download size={13} /> 下载</a>}
                          {resourcePreview.path !== "SKILL.md" && <button type="button" className="skill-file-delete" onClick={() => void deleteResource()} disabled={submitting}><Trash2 size={13} /> 删除</button>}
                        </div>}
                      </section>
                    </div>
                  )}
                  {operationError && <div className="capability-operation-error">{operationError}</div>}
                </div>
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
              {selected.kind === "skill" && editing ? (
                <>
                  <button type="button" className="capability-secondary-button" disabled={submitting} onClick={() => setEditing(false)}>取消</button>
                  <button type="button" disabled={submitting} onClick={() => void saveSkill()}><Save size={13} /> 保存</button>
                </>
              ) : selected.kind === "skill" ? (
                <>
                  <button type="button" className="capability-danger-button" disabled={submitting} onClick={() => void deleteSkill()}><Trash2 size={13} /> 删除</button>
                  <input ref={resourceInputRef} className="capability-folder-input" type="file" onChange={(event) => void uploadResource(event.target.files?.[0] ?? null)} />
                  <button type="button" className="capability-secondary-button" disabled={submitting} onClick={() => resourceInputRef.current?.click()}><Upload size={13} /> 添加文件</button>
                  {onSkillExport && <button type="button" className="capability-secondary-button" disabled={submitting} onClick={() => void onSkillExport(selected)}><Download size={13} /> 导出 ZIP</button>}
                  <button type="button" className="capability-secondary-button" disabled={submitting} onClick={() => setEditing(true)}><Pencil size={13} /> 编辑</button>
                  <button type="button" onClick={() => onToggle(selected.name)}>{enabled.has(selected.name) ? "停用" : "启用"}</button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => onToggle(selected.name)}
                  disabled={selected.kind === "mcp" && selected.status !== "connected"}
                >
                  {enabled.has(selected.name) ? "停用" : "启用"}
                </button>
              )}
            </footer>
          </section>
        </div>
      )}
    </section>
  );
}

function SkillResourceSummary({ resources }: { resources: NonNullable<CapabilityItem["resources"]> }) {
  const scripts = resources.filter((resource) => resource.category === "script").length;
  const references = resources.filter((resource) => resource.category === "reference").length;
  return <span className="skill-resource-summary">{resources.length} 文件 · {scripts} 脚本 · {references} 资料</span>;
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
