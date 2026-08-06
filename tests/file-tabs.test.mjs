import assert from "node:assert/strict";
import test from "node:test";

import {
  MAX_OPEN_FILE_TABS,
  activateFileTab,
  closeFileTab,
  getProjectFileTabs,
  openFileTab,
  parseProjectFileTabs,
  reconcileFileTabs,
  removeProjectFileTabs,
} from "../lib/file-tabs.ts";

test("file tabs open in order and repeated clicks only activate the existing tab", () => {
  let state = {};
  state = openFileTab(state, "project-a", "src/a.ts");
  state = openFileTab(state, "project-a", "src/b.ts");
  state = openFileTab(state, "project-a", "src/a.ts");

  assert.deepEqual(getProjectFileTabs(state, "project-a"), {
    openPaths: ["src/a.ts", "src/b.ts"],
    activePath: "src/a.ts",
  });
});

test("the fifth new file replaces the rightmost file tab", () => {
  let state = {};
  for (const path of ["a.md", "b.md", "c.md", "d.md"]) {
    state = openFileTab(state, "project-a", path);
  }
  state = openFileTab(state, "project-a", "e.md");

  assert.equal(MAX_OPEN_FILE_TABS, 4);
  assert.deepEqual(getProjectFileTabs(state, "project-a"), {
    openPaths: ["a.md", "b.md", "c.md", "e.md"],
    activePath: "e.md",
  });

  state = openFileTab(state, "project-a", "b.md");
  assert.deepEqual(getProjectFileTabs(state, "project-a"), {
    openPaths: ["a.md", "b.md", "c.md", "e.md"],
    activePath: "b.md",
  });
});

test("closing the active file selects the right neighbor, then left, then directory", () => {
  let state = {};
  for (const path of ["a.md", "b.md", "c.md"]) {
    state = openFileTab(state, "project-a", path);
  }
  state = activateFileTab(state, "project-a", "b.md");
  state = closeFileTab(state, "project-a", "b.md");
  assert.equal(getProjectFileTabs(state, "project-a").activePath, "c.md");

  state = closeFileTab(state, "project-a", "c.md");
  assert.equal(getProjectFileTabs(state, "project-a").activePath, "a.md");

  state = closeFileTab(state, "project-a", "a.md");
  assert.deepEqual(getProjectFileTabs(state, "project-a"), {
    openPaths: [],
    activePath: null,
  });
});

test("file tabs stay isolated by project and can remove one project", () => {
  let state = openFileTab({}, "project-a", "a.md");
  state = openFileTab(state, "project-b", "b.md");
  state = removeProjectFileTabs(state, "project-a");

  assert.deepEqual(getProjectFileTabs(state, "project-a"), {
    openPaths: [],
    activePath: null,
  });
  assert.equal(getProjectFileTabs(state, "project-b").activePath, "b.md");
});

test("stored tabs restore valid unique paths and reject malformed data", () => {
  const restored = parseProjectFileTabs(
    JSON.stringify({
      "project-a": {
        openPaths: ["a.md", "a.md", 42, "b.md", "c.md", "d.md", "e.md"],
        activePath: "b.md",
      },
      broken: { openPaths: "not-an-array", activePath: "x.md" },
    }),
  );

  assert.deepEqual(restored, {
    "project-a": { openPaths: ["a.md", "b.md", "c.md", "d.md"], activePath: "b.md" },
  });
  assert.deepEqual(parseProjectFileTabs("not-json"), {});
  assert.deepEqual(parseProjectFileTabs("[]"), {});
});

test("reconciling removes deleted files and falls back to the first remaining tab", () => {
  let state = openFileTab({}, "project-a", "a.md");
  state = openFileTab(state, "project-a", "deleted.md");
  state = openFileTab(state, "project-a", "c.md");
  state = activateFileTab(state, "project-a", "deleted.md");
  state = reconcileFileTabs(state, "project-a", ["a.md", "c.md"]);

  assert.deepEqual(getProjectFileTabs(state, "project-a"), {
    openPaths: ["a.md", "c.md"],
    activePath: "a.md",
  });
});
