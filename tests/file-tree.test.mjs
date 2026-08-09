import assert from "node:assert/strict";
import test from "node:test";

import {
  createFileTreeFromFlatEntries,
  getProjectFileTree,
  getVisibleFileTreeEntries,
  removeProjectFileTree,
  resetProjectFileTree,
  setDirectoryEntries,
  setDirectoryError,
  setDirectoryLoading,
  toggleDirectoryExpansion,
} from "../lib/file-tree.ts";

function entry(path, kind = "file") {
  return {
    path,
    name: path.split("/").at(-1),
    kind,
    size: kind === "file" ? 10 : 0,
    modifiedAt: 1,
    extension: kind === "file" ? ".md" : "",
  };
}

test("file tree expands loaded children, collapses them, and keeps the branch cache", () => {
  let state = {};
  state = setDirectoryEntries(state, "project-a", "", [
    entry("reports", "directory"),
    entry("readme.md"),
  ]);
  state = setDirectoryEntries(state, "project-a", "reports", [entry("reports/summary.md")]);

  assert.deepEqual(
    getVisibleFileTreeEntries(getProjectFileTree(state, "project-a")).map((item) => item.path),
    ["reports", "readme.md"],
  );

  state = toggleDirectoryExpansion(state, "project-a", "reports");
  assert.deepEqual(
    getVisibleFileTreeEntries(getProjectFileTree(state, "project-a")).map((item) => item.path),
    ["reports", "reports/summary.md", "readme.md"],
  );

  state = toggleDirectoryExpansion(state, "project-a", "reports");
  const collapsed = getProjectFileTree(state, "project-a");
  assert.deepEqual(getVisibleFileTreeEntries(collapsed).map((item) => item.path), [
    "reports",
    "readme.md",
  ]);
  assert.deepEqual(collapsed.childrenByDirectory.reports.map((item) => item.path), [
    "reports/summary.md",
  ]);
});

test("flat Skill resources become a complete directory tree with stable folder-first ordering", () => {
  const tree = createFileTreeFromFlatEntries([
    entry("references/filings/annual.md"),
    entry("SKILL.md"),
    entry("scripts/fetch.py"),
    entry("references/index.md"),
    entry("assets/logo.png"),
  ]);

  assert.deepEqual(tree.childrenByDirectory[""].map((item) => item.path), [
    "assets",
    "references",
    "scripts",
    "SKILL.md",
  ]);
  assert.deepEqual(tree.childrenByDirectory.references.map((item) => item.path), [
    "references/filings",
    "references/index.md",
  ]);
  assert.deepEqual(tree.childrenByDirectory["references/filings"].map((item) => item.path), [
    "references/filings/annual.md",
  ]);

  tree.expandedPaths = ["references", "references/filings"];
  assert.deepEqual(getVisibleFileTreeEntries(tree).map((item) => item.path), [
    "assets",
    "references",
    "references/filings",
    "references/filings/annual.md",
    "references/index.md",
    "scripts",
    "SKILL.md",
  ]);
});

test("file tree keeps loading and error state isolated per project and supports retry", () => {
  let state = {};
  state = setDirectoryLoading(state, "project-a", "reports");
  state = setDirectoryError(state, "project-a", "reports", "读取失败");
  assert.equal(getProjectFileTree(state, "project-a").errorsByPath.reports, "读取失败");
  assert.deepEqual(getProjectFileTree(state, "project-a").loadingPaths, []);
  assert.deepEqual(getProjectFileTree(state, "project-b").errorsByPath, {});

  state = setDirectoryLoading(state, "project-a", "reports");
  assert.equal(getProjectFileTree(state, "project-a").errorsByPath.reports, undefined);
  state = setDirectoryEntries(state, "project-a", "reports", []);
  assert.deepEqual(getProjectFileTree(state, "project-a").childrenByDirectory.reports, []);
});

test("refresh clears cached branches but preserves expanded paths, and removal is project scoped", () => {
  let state = {};
  state = setDirectoryEntries(state, "project-a", "", [entry("reports", "directory")]);
  state = setDirectoryEntries(state, "project-a", "reports", [entry("reports/summary.md")]);
  state = toggleDirectoryExpansion(state, "project-a", "reports");
  state = setDirectoryEntries(state, "project-b", "", [entry("notes.md")]);

  state = resetProjectFileTree(state, "project-a");
  assert.deepEqual(getProjectFileTree(state, "project-a").expandedPaths, ["reports"]);
  assert.deepEqual(getProjectFileTree(state, "project-a").childrenByDirectory, {});
  assert.deepEqual(
    getProjectFileTree(state, "project-b").childrenByDirectory[""].map((item) => item.path),
    ["notes.md"],
  );

  state = removeProjectFileTree(state, "project-a");
  assert.equal("project-a" in state, false);
  assert.equal("project-b" in state, true);
});
