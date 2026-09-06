import assert from "node:assert/strict";
import test from "node:test";
import { parseMarkdownLink, nextFileNavigation, activeFileNavigation } from "../lib/markdown-links.ts";
import { openFileTab, closeFileTab, getProjectFileTabs } from "../lib/file-tabs.ts";

const parse = (href, baseDirectory = "") => parseMarkdownLink(href, { baseDirectory });
const file = (path, line) => ({ kind: "file", target: { path, ...(line ? { line } : {}) } });

test("web links preserve query and fragments", () => {
  const href = "https://example.com/a?q=%23#section";
  assert.deepEqual(parse(href), { kind: "external", href });
  assert.equal(parse("https://").kind, "inactive");
});

test("project links resolve root and document relative references with one decoding pass", () => {
  assert.deepEqual(parse("src/a.ts#L337"), file("src/a.ts", 337));
  assert.deepEqual(parse("appendix.md", "reports"), file("reports/appendix.md"));
  assert.deepEqual(parse("../data/result.csv", "reports"), file("data/result.csv"));
  assert.deepEqual(parse("/outputs/report.md", "reports"), file("outputs/report.md"));
  assert.deepEqual(parse("./中文%20报告%23%3F.md"), file("中文 报告#?.md"));
  assert.deepEqual(parse("%252e%252e/a.md"), file("%2e%2e/a.md"));
  assert.deepEqual(parse("data%2520set.csv"), file("data%20set.csv"));
});

test("invalid line fragments do not prevent opening a valid file", () => {
  for (const hash of ["L0", "L-1", "L1.5", "L01", "L9007199254740992", "L1#L2", "intro", ""]) {
    assert.deepEqual(parse(`a.md#${hash}`), file("a.md"));
  }
});

test("unsafe or ambiguous navigation targets are inactive", () => {
  for (const href of [undefined, "", "#intro", "//host/a", "\\file", "a%5Cb", "../outside", "%2e%2e/outside", "/../outside", "a%00.md", "a\nb", "bad%ZZ", "javascript:alert(1)", "data:text/html,x", "file:///etc/passwd", "vscode://file/a", "C:/a", "src/a.ts:337", "a?download=1", "%2F%2Fhost/a"]) {
    assert.equal(parse(href).kind, "inactive", String(href));
  }
  assert.equal(parse("../../a", "reports").kind, "inactive");
});

test("navigation requests repeat, change lines, clear line targets and stay project scoped", () => {
  const first = nextFileNavigation(null, "a", { path: "file.ts", line: 3 });
  const repeat = nextFileNavigation(first, "a", { path: "file.ts", line: 3 });
  assert.ok(repeat.requestId > first.requestId);
  const next = nextFileNavigation(repeat, "a", { path: "other.ts", line: 5 });
  assert.equal(activeFileNavigation(next, "a", "file.ts"), null);
  assert.equal(activeFileNavigation(next, "b", "other.ts"), null);
  assert.equal(activeFileNavigation(next, "a", "other.ts")?.line, 5);
  const plain = nextFileNavigation(next, "a", { path: "other.ts" });
  assert.equal(plain.line, undefined);
  assert.equal(activeFileNavigation(null, "a", "other.ts"), null);
});

test("link navigation uses existing four-tab replacement and close behavior", () => {
  let tabs = {};
  for (const path of ["1.ts", "2.ts", "3.ts", "4.ts", "5.ts"]) tabs = openFileTab(tabs, "a", path);
  assert.deepEqual(getProjectFileTabs(tabs, "a").openPaths, ["1.ts", "2.ts", "3.ts", "5.ts"]);
  tabs = openFileTab(tabs, "a", "2.ts");
  assert.equal(getProjectFileTabs(tabs, "a").openPaths.length, 4);
  tabs = closeFileTab(tabs, "a", "2.ts");
  assert.equal(getProjectFileTabs(tabs, "a").activePath, "3.ts");
});
