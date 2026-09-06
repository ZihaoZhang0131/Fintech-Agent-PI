"use client";

import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-go";
import "prismjs/components/prism-java";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-python";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-scss";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markdown";

const LANGUAGE_BY_EXTENSION: Record<string, string> = {
  ".json": "json",
  ".md": "markdown",
  ".mdx": "markdown",
  ".c": "c",
  ".cc": "cpp",
  ".cpp": "cpp",
  ".css": "css",
  ".go": "go",
  ".h": "c",
  ".html": "markup",
  ".java": "java",
  ".js": "javascript",
  ".jsx": "jsx",
  ".mjs": "javascript",
  ".mts": "typescript",
  ".py": "python",
  ".rb": "ruby",
  ".rs": "rust",
  ".scss": "scss",
  ".sh": "bash",
  ".sql": "sql",
  ".ts": "typescript",
  ".tsx": "tsx",
};

type CodePreviewProps = {
  content: string;
  extension: string;
  name: string;
  targetLine?: number;
  navigationRequestId?: number;
};

export function CodePreview({ content, extension, name, targetLine, navigationRequestId }: CodePreviewProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const language = LANGUAGE_BY_EXTENSION[extension] ?? "none";
  const normalizedContent = content.replace(/\r\n/g, "\n");
  const { highlightedHtml, lineCount } = useMemo(() => {
    const grammar = Prism.languages[language];
    return {
      highlightedHtml: grammar
        ? Prism.highlight(normalizedContent, grammar, language)
        : Prism.util.encode(normalizedContent),
      lineCount: Math.max(1, normalizedContent.split("\n").length),
    };
  }, [language, normalizedContent]);
  const validTarget = targetLine !== undefined && Number.isSafeInteger(targetLine) && targetLine > 0 && targetLine <= lineCount;
  useEffect(() => {
    const root = rootRef.current;
    const scroller = root?.closest<HTMLElement>(".workspace-preview-content");
    if (!root || !scroller) return;
    if (!validTarget) { scroller.scrollTop = 0; return; }
    const row = root.querySelector<HTMLElement>(`[data-line="${targetLine}"]`);
    if (!row) return;
    const bounds = row.getBoundingClientRect();
    scroller.scrollTop += bounds.top - scroller.getBoundingClientRect().top - scroller.clientHeight / 2 + bounds.height / 2;
  }, [targetLine, navigationRequestId, validTarget, normalizedContent]);

  return (
    <div ref={rootRef} className="ide-code-preview" aria-label={`${name} 代码预览`}
      style={validTarget ? { "--target-line-offset": `${(targetLine - 1) * 1.7}em` } as CSSProperties : undefined}>
      {targetLine !== undefined && !validTarget && <div className="code-line-warning" role="status">目标行超出文件范围</div>}
      <ol className="code-line-numbers" aria-hidden="true">
        {Array.from({ length: lineCount }, (_, index) => (
          <li key={index} data-line={index + 1} className={validTarget && targetLine === index + 1 ? "target-line-number" : undefined}>{index + 1}</li>
        ))}
      </ol>
      <pre className={validTarget ? "has-target-line" : undefined}>
        <code
          className={`language-${language}`}
          // Prism escapes the source before wrapping tokens in spans.
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      </pre>
    </div>
  );
}
