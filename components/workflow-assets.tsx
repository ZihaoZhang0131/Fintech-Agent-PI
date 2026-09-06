"use client";
import { useState } from "react";
import type { WorkflowTemplate } from "@/lib/workflow-types";
export function WorkflowAssets({
  templates,
  onSelect,
  onCopy,
  onArchive,
  onLinked,
  busy,
}: {
  templates: WorkflowTemplate[];
  onSelect: (
    t: WorkflowTemplate,
    v?: WorkflowTemplate["versions"][number],
  ) => void;
  onCopy: (t: WorkflowTemplate) => void;
  onArchive: (t: WorkflowTemplate) => void;
  onLinked: (t: WorkflowTemplate) => void;
  busy: boolean;
}) {
  const [search, setSearch] = useState(""),
    [archived, setArchived] = useState(false);
  return (
    <aside className="wf-library">
      <input
        aria-label="搜索工作流"
        placeholder="搜索资产"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="wf-list">
        <label className="wf-check">
          <input
            type="checkbox"
            checked={archived}
            onChange={(e) => setArchived(e.target.checked)}
          />
          显示已归档
        </label>
        {templates
          .filter(
            (t) =>
              (archived || !t.archived) &&
              `${t.name} ${t.description}`.includes(search),
          )
          .map((t) => (
            <article key={t.id}>
              <strong>{t.name}</strong>
              <p>{t.description}</p>
              <small>
                {t.versions.length} 个版本{t.archived ? " · 已归档" : ""}
              </small>
              <select
                aria-label={`${t.name}版本`}
                defaultValue={t.versions.at(-1)?.version}
                onChange={(e) =>
                  onSelect(
                    t,
                    t.versions.find(
                      (v) => v.version === Number(e.target.value),
                    ),
                  )
                }
              >
                {t.versions.map((v) => (
                  <option key={v.version} value={v.version}>
                    版本 {v.version}
                  </option>
                ))}
              </select>
              <div className="wf-row">
                <button disabled={busy} onClick={() => onSelect(t)}>
                  复用
                </button>
                <button disabled={busy} onClick={() => onCopy(t)}>
                  复制
                </button>
                <button disabled={busy} onClick={() => onArchive(t)}>
                  {t.archived ? "恢复" : "归档"}
                </button>
                <button onClick={() => onLinked(t)}>关联运行</button>
              </div>
            </article>
          ))}
        {!templates.length && <p>还没有保存的工作流。</p>}
      </div>
    </aside>
  );
}
