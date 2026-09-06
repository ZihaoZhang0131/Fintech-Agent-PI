"use client";

import { Play } from "lucide-react";
import Prism from "prismjs";
import "prismjs/components/prism-sql";
import { useEffect, useMemo, useRef } from "react";

export function SqlEditor({ value, onChange, onRun, running }: {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  running: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const preview = useRef<HTMLPreElement>(null);
  const composing = useRef(false);
  const highlighted = useMemo(() => Prism.highlight(value + "\n", Prism.languages.sql, "sql"), [value]);
  function syncScroll() {
    if (!input.current || !preview.current) return;
    preview.current.scrollTop = input.current.scrollTop;
    preview.current.scrollLeft = input.current.scrollLeft;
  }
  useEffect(() => { syncScroll(); }, [value]);
  useEffect(() => {
    const element = root.current;
    const main = element?.parentElement;
    if (!element || !main) return;
    const observer = new ResizeObserver(() => {
      element.style.setProperty("--editor-max-height", `${main.clientHeight / 2}px`);
      syncScroll();
    });
    observer.observe(main);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div className="database-editor" ref={root}>
      <div className="database-editor-toolbar">
        <button type="button" onClick={onRun} disabled={running || !value.trim()} title="执行查询（⌘ / Ctrl + Enter）"><Play size={13} />{running ? "查询中" : "执行"}</button>
      </div>
      <div className="database-code-surface">
        <pre ref={preview} aria-hidden="true"><code dangerouslySetInnerHTML={{ __html: highlighted }} /></pre>
        <textarea ref={input} value={value} onChange={(event) => onChange(event.target.value)} onScroll={syncScroll}
          spellCheck={false} autoCapitalize="off" autoCorrect="off" wrap="off" aria-label="SQL 查询语句（仅支持只读查询）"
          onCompositionStart={() => { composing.current = true; }} onCompositionEnd={() => { composing.current = false; }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.metaKey || event.ctrlKey) && !composing.current && !event.nativeEvent.isComposing && event.keyCode !== 229) {
              event.preventDefault();
              if (!running && value.trim()) onRun();
            }
          }} />
      </div>
    </div>
  );
}
