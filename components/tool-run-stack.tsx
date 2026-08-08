import {
  BookOpenCheck,
  ChevronDown,
  CircleCheck,
  CircleX,
  Cpu,
  ExternalLink,
  LoaderCircle,
  Plug,
  Save,
  Search,
  Terminal,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { ToolRun } from "@/lib/tool-runs";

const LONG_RUNNING_THRESHOLD_MS = 3_000;

type ToolRunDetailProps = {
  messageId: string;
  run: ToolRun;
  projectPath?: string;
  approvalSubmittingIds: string[];
  onDecision: (messageId: string, run: ToolRun, decision: "approve" | "reject") => void;
};

type ToolRunStackProps = Omit<ToolRunDetailProps, "run"> & {
  runs: ToolRun[];
  durationMs?: number;
  expanded: boolean;
  onToggle: () => void;
};

function formatRunDuration(durationMs: number) {
  const totalSeconds = Math.max(1, Math.round(durationMs / 1_000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}秒`;
  return seconds === 0 ? `${minutes}分` : `${minutes}分${seconds}秒`;
}

function ToolRunGlyph({ run, now }: { run: ToolRun; now: number }) {
  if (run.status === "running" && now - run.startedAt >= LONG_RUNNING_THRESHOLD_MS) {
    return <LoaderCircle className="tool-run-running-glyph" size={14} aria-label="正在执行" />;
  }
  if (run.toolName === "delegate_agent") return <Cpu size={14} />;
  if (run.toolName === "bash") return <Terminal size={14} />;
  if (run.toolName.startsWith("mcp__")) return <Plug size={14} />;
  if (run.toolName === "load_skill") return <BookOpenCheck size={14} />;
  if (run.toolName === "write_project_file") return <Save size={14} />;
  if (run.status === "running") return <Search size={14} />;
  if (run.status === "success") return <CircleCheck size={14} />;
  return <CircleX size={14} />;
}

function ToolRunDetail({
  messageId,
  run,
  projectPath,
  approvalSubmittingIds,
  onDecision,
}: ToolRunDetailProps) {
  return (
    <div className="tool-run-detail">
      {run.toolName === "bash" && run.query && (
        <code className="tool-run-command">{run.query}</code>
      )}
      {run.status === "awaiting_approval" && run.commandId && (
        <div className="tool-run-approval-wrap">
          <code>{projectPath}</code>
          <div className="tool-run-approval">
            <button
              type="button"
              className="secondary"
              disabled={approvalSubmittingIds.includes(run.commandId)}
              onClick={() => onDecision(messageId, run, "reject")}
            >
              拒绝
            </button>
            <button
              type="button"
              disabled={approvalSubmittingIds.includes(run.commandId)}
              onClick={() => onDecision(messageId, run, "approve")}
            >
              允许
            </button>
          </div>
        </div>
      )}
      {run.toolName === "bash" && (run.stdout || run.stderr || run.truncated) && (
        <details className="tool-run-output">
          <summary>查看命令输出</summary>
          {run.stdout && <pre>{run.stdout}</pre>}
          {run.stderr && (
            <pre>
              <strong>STDERR</strong>{"\n"}
              {run.stderr}
            </pre>
          )}
          {run.truncated && <p>输出超过 200KB，后续内容已截断。</p>}
        </details>
      )}
      {Boolean(run.sources?.length) && (
        <div className="tool-run-sources">
          {run.sources?.map((source) => (
            <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>
              <span>{source.title}</span>
              <ExternalLink size={11} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export function ToolRunStack({
  runs,
  durationMs,
  expanded,
  onToggle,
  ...detailProps
}: ToolRunStackProps) {
  const [now, setNow] = useState(() => Date.now());
  const latestRun = runs.reduce((latest, run) =>
    run.startedAt >= latest.startedAt ? run : latest,
  );
  const hasRunningRun = runs.some((run) => run.status === "running");
  const hasLatestDetail =
    (latestRun.toolName === "bash" && Boolean(latestRun.query)) ||
    (latestRun.status === "awaiting_approval" && Boolean(latestRun.commandId)) ||
    (latestRun.toolName === "bash" && Boolean(latestRun.stdout || latestRun.stderr || latestRun.truncated)) ||
    Boolean(latestRun.sources?.length);

  useEffect(() => {
    if (!hasRunningRun) return undefined;
    const interval = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(interval);
  }, [hasRunningRun]);

  return (
    <div className="tool-run-disclosure">
      <button
        className="tool-run-summary"
        type="button"
        aria-expanded={expanded}
        onClick={onToggle}
      >
        <span>{durationMs === undefined ? "正在运行…" : `本次运行 ${formatRunDuration(durationMs)}`}</span>
        <ChevronDown className="tool-run-chevron" size={14} />
      </button>
      {expanded && (
        <div className="tool-run-expanded">
          <div
            className={`tool-run-history-list${hasLatestDetail ? " has-detail" : ""}`}
            aria-label="工具调用记录"
          >
            {runs.map((run) => (
              <div className="tool-run-history-row" key={run.toolCallId}>
                <span className="tool-run-history-glyph">
                  <ToolRunGlyph run={run} now={now} />
                </span>
                <strong>{run.label}</strong>
                {run.query && <span>{run.query}</span>}
              </div>
            ))}
          </div>
          {hasLatestDetail && <ToolRunDetail run={latestRun} {...detailProps} />}
        </div>
      )}
    </div>
  );
}
