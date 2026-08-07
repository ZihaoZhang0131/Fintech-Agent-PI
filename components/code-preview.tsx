"use client";

import { useMemo } from "react";
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

const LANGUAGE_BY_EXTENSION: Record<string, string> = {
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
};

export function CodePreview({ content, extension, name }: CodePreviewProps) {
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

  return (
    <div className="ide-code-preview" aria-label={`${name} 代码预览`}>
      <ol className="code-line-numbers" aria-hidden="true">
        {Array.from({ length: lineCount }, (_, index) => (
          <li key={index}>{index + 1}</li>
        ))}
      </ol>
      <pre>
        <code
          className={`language-${language}`}
          // Prism escapes the source before wrapping tokens in spans.
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      </pre>
    </div>
  );
}
