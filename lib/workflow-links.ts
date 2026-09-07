import type { WorkflowRun, WorkflowAttempt } from "./workflow-types";
import { parseMarkdownLink } from "./markdown-links.ts";
import { validProjectArtifact } from "./remark-project-files.ts";

export function workflowArtifactPaths(
  run: Pick<WorkflowRun, "accepted" | "attempts">,
  selectedAttempt?: WorkflowAttempt,
): string[] {
  const accepted = new Set(Object.values(run.accepted));
  return [...new Set([
    ...run.attempts.filter(attempt => accepted.has(attempt.id))
      .flatMap(attempt => attempt.result?.artifacts ?? []),
    ...(selectedAttempt?.result?.artifacts ?? []),
  ].filter(validProjectArtifact))];
}

export function allowWorkflowSourceLink(href: string): boolean {
  const link = parseMarkdownLink(href, { baseDirectory: "" });
  if (link.kind === "inactive") return false;
  if (link.kind === "file") return true;
  // Never guess a missing URL suffix or turn source annotations into URL characters.
  if (/\s/.test(href)) return false;
  try {
    const url = new URL(href);
    return !/(?:\.{3}|…)$/u.test(decodeURIComponent(url.pathname)) &&
      !/(?:\.{3}|…)$/u.test(decodeURIComponent(href));
  } catch { return false; }
}

export function workflowSourceIsPlainText(source: string): boolean {
  const first = source.trim().match(/^([\w+.-]+:\S*)/)?.[1];
  return !!first && !allowWorkflowSourceLink(first);
}
