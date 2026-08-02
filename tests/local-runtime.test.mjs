import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  listWorkspaceFiles,
  readWorkspaceFile,
  readWorkspaceRegistry,
  registerWorkspace,
  resolveWorkspacePath,
  writeWorkspaceFile,
} from "../server/local-runtime.mjs";

test("local runtime binds a folder and keeps file access inside it", async (t) => {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), "pi-local-runtime-"));
  t.after(() => rm(temporaryRoot, { recursive: true, force: true }));
  const dataDirectory = path.join(temporaryRoot, "data");
  const workspaceDirectory = path.join(temporaryRoot, "workspace");
  await mkdir(workspaceDirectory);
  await writeFile(path.join(workspaceDirectory, "source.md"), "# 已有资料\n", "utf8");

  const workspace = await registerWorkspace(dataDirectory, workspaceDirectory);
  assert.equal(workspace.name, "workspace");
  assert.equal((await readWorkspaceRegistry(dataDirectory)).length, 1);

  const written = await writeWorkspaceFile(
    workspace.path,
    "outputs/report.md",
    "# Agent 研究产出\n",
  );
  assert.equal(written.path, "outputs/report.md");

  const listing = await listWorkspaceFiles(workspace.path, 4);
  assert.ok(listing.entries.some((entry) => entry.path === "outputs/report.md"));
  const preview = await readWorkspaceFile(workspace.path, "outputs/report.md");
  assert.equal(preview.kind, "text");
  assert.match(preview.content, /Agent 研究产出/);

  assert.throws(
    () => resolveWorkspacePath(workspace.path, "../../outside.txt"),
    /超出了已绑定的项目目录/,
  );
});
