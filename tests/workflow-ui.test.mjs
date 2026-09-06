import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const stylesheet = await readFile(
  new URL("../app/globals.css", import.meta.url),
  "utf8",
);

test("Workflow shares project files and connects all Markdown output to project navigation", async () => {
  const [page, workspace, messages, details] = await Promise.all(
    ["app/page.tsx", "components/workflow-workspace.tsx", "components/workflow-messages.tsx", "components/workflow-node-details.tsx"]
      .map((path) => readFile(new URL(`../${path}`, import.meta.url), "utf8")),
  );
  assert.match(page, /activeView === "workspace" \|\| activeView === "workflow"/);
  assert.match(page, /activeView !== "workspace" && activeView !== "workflow" \? "library-mode"/);
  assert.equal((page.match(/artifact-panel workspace-panel/g) ?? []).length, 1);
  assert.match(workspace, /aria-label="打开项目文件面板"/);
  assert.match(workspace, /snapshot\.conversation\.workspaceId === tools\.workspaceId/);
  assert.match(workspace, /stream\.readyState === EventSource\.CLOSED/);
  for (const source of [messages, details]) {
    const renderers = source.match(/<MarkdownMessage\b[^>]*\/>/g) ?? [];
    assert.ok(renderers.length);
    for (const renderer of renderers) assert.match(renderer, /projectNavigation=/);
  }
  assert.match(details, /projectNavigation\.onOpenFile\(\{ path: p \}\)/);
  assert.doesNotMatch(details, /WorkflowArtifact|files\/content/);
});

test("active workflow nodes show restrained progress feedback", () => {
  assert.match(
    stylesheet,
    /\.wf-node\.running \.wf-node-status::before,\.wf-node\.recovering \.wf-node-status::before\s*\{[^}]*animation:wf-active-pulse 1\.6s ease-in-out infinite/,
  );
  assert.match(
    stylesheet,
    /@keyframes wf-active-pulse\s*\{[^}]*opacity:\.45[^}]*transform:scale\(\.78\)[\s\S]*opacity:1[^}]*transform:scale\(1\)/,
  );
  assert.match(stylesheet, /@media \(prefers-reduced-motion: reduce\)/);
});
