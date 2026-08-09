"use client";

import {
  ChevronDown,
  ChevronRight,
  File,
  FileChartColumn,
  FileCode2,
  FileImage,
  FileText,
  Folder,
  FolderOpen,
  RefreshCw,
} from "lucide-react";
import { Fragment } from "react";
import type { FileTreeEntry, ProjectFileTree } from "@/lib/file-tree";

export const CODE_EXTENSIONS = new Set([
  ".c", ".cc", ".cpp", ".css", ".go", ".h", ".html", ".java", ".js", ".jsx",
  ".mjs", ".mts", ".py", ".rb", ".rs", ".scss", ".sh", ".sql", ".ts", ".tsx",
]);

export function fileTreeIcon(file: FileTreeEntry) {
  if (file.kind === "directory") return Folder;
  if (file.extension === ".pdf") return FileChartColumn;
  if ([".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif"].includes(file.extension)) {
    return FileImage;
  }
  if (CODE_EXTENSIONS.has(file.extension)) return FileCode2;
  if ([".md", ".mdx", ".txt", ".csv"].includes(file.extension)) return FileText;
  return File;
}

function formatBytes(size: number) {
  if (size < 1_024) return `${size} B`;
  if (size < 1_048_576) return `${(size / 1_024).toFixed(1)} KB`;
  return `${(size / 1_048_576).toFixed(1)} MB`;
}

type FileSystemTreeProps = {
  ariaLabel: string;
  entries: FileTreeEntry[];
  tree: ProjectFileTree;
  activePath?: string | null;
  onDirectoryToggle: (entry: FileTreeEntry) => void;
  onDirectoryRetry?: (entry: FileTreeEntry) => void;
  onFileSelect: (entry: FileTreeEntry) => void;
};

/** Shared file-system rows for workspace and Skill directories. */
export function FileSystemTree({
  ariaLabel,
  entries,
  tree,
  activePath,
  onDirectoryToggle,
  onDirectoryRetry,
  onFileSelect,
}: FileSystemTreeProps) {
  return (
    <nav className="workspace-file-list" aria-label={ariaLabel}>
      {entries.map((entry) => {
        const depth = Math.max(0, entry.path.split("/").length - 1);
        if (entry.kind === "directory") {
          const expanded = tree.expandedPaths.includes(entry.path);
          const loading = tree.loadingPaths.includes(entry.path);
          const error = tree.errorsByPath[entry.path];
          const loaded = Object.hasOwn(tree.childrenByDirectory, entry.path);
          const childCount = tree.childrenByDirectory[entry.path]?.length ?? 0;
          const DirectoryIcon = expanded ? FolderOpen : Folder;
          return (
            <Fragment key={entry.path}>
              <button
                className="workspace-file-row directory"
                style={{ paddingLeft: `${10 + depth * 14}px` }}
                type="button"
                aria-expanded={expanded}
                aria-label={`${expanded ? "收起" : "展开"}目录 ${entry.path}`}
                onClick={() => onDirectoryToggle(entry)}
                onKeyDown={(event) => {
                  if ((event.key === "ArrowRight" && !expanded) || (event.key === "ArrowLeft" && expanded)) {
                    event.preventDefault();
                    onDirectoryToggle(entry);
                  }
                }}
                title={entry.path}
              >
                {expanded ? <ChevronDown className="workspace-directory-chevron" size={12} /> : <ChevronRight className="workspace-directory-chevron" size={12} />}
                <DirectoryIcon size={14} />
                <span>{entry.name}</span>
              </button>
              {expanded && loading && (
                <div className="workspace-directory-status" style={{ paddingLeft: `${31 + depth * 14}px` }}>
                  <RefreshCw size={11} className="spinning" />
                  <span>正在读取…</span>
                </div>
              )}
              {expanded && error && !loading && (
                <div className="workspace-directory-status error" style={{ paddingLeft: `${31 + depth * 14}px` }}>
                  <span>{error}</span>
                  {onDirectoryRetry && <button type="button" onClick={() => onDirectoryRetry(entry)}>重试</button>}
                </div>
              )}
              {expanded && loaded && !loading && !error && childCount === 0 && (
                <div className="workspace-directory-status" style={{ paddingLeft: `${31 + depth * 14}px` }}>
                  <span>空文件夹</span>
                </div>
              )}
            </Fragment>
          );
        }

        const Icon = fileTreeIcon(entry);
        return (
          <button
            key={entry.path}
            className={`workspace-file-row ${activePath === entry.path ? "active" : ""}`}
            style={{ paddingLeft: `${10 + depth * 14}px` }}
            type="button"
            onClick={() => onFileSelect(entry)}
            title={entry.path}
          >
            <Icon size={14} />
            <span>{entry.name}</span>
            <small>{formatBytes(entry.size)}</small>
          </button>
        );
      })}
    </nav>
  );
}
