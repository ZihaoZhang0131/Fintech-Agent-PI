import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { remarkProjectFiles } from "../lib/remark-project-files.ts";
import { workflowArtifactPaths, allowWorkflowSourceLink, workflowSourceIsPlainText } from "../lib/workflow-links.ts";

const artifacts = ["wuxi_research.md", "wuxi_financial_analysis.md", "outputs/药明康德财务核心数据_AKShare.md", "reports/中文 报告.md"];
function render(content, paths = artifacts, source = false) {
  if (source && workflowSourceIsPlainText(content)) return renderToStaticMarkup(createElement("p", null, content));
  return renderToStaticMarkup(createElement(ReactMarkdown, {
    remarkPlugins: [remarkGfm, [remarkProjectFiles, { paths }]],
    components: source ? { a: ({href, children}) => createElement(allowWorkflowSourceLink(href) ? "a" : "span", allowWorkflowSourceLink(href) ? {href} : {}, children) } : undefined,
  }, content));
}
const links = html => [...html.matchAll(/<a href="([^"]+)"/g)].map(match => match[1]);

test("real Workflow summary and plan filenames become links, including Chinese punctuation", () => {
  const content = "产出文件：outputs/药明康德财务核心数据_AKShare.md、wuxi_research.md、wuxi_financial_analysis.md。\n\n- wuxi_research.md（研究报告全文落盘）\n\n规划：将研究全文写入 wuxi_research.md，再生成最终报告。";
  const hrefs = links(render(content));
  assert.equal(hrefs.length, 5);
  assert.equal(decodeURIComponent(hrefs[0]), "/outputs/药明康德财务核心数据_AKShare.md");
  assert.equal(hrefs[4], "/wuxi_research.md");
  assert.equal(links(render(content, [])).length, 0);
});

test("only whole known paths match, never basename guesses or longer filenames", () => {
  for (const content of ["xwuxi_research.md", "wuxi_research.md.bak", "old/wuxi_research.md", "药明康德财务核心数据_AKShare.md", "wuxi_research.mdx", "旧wuxi_research.md", "wuxi_research.md旧", "../wuxi_research.md", "file:wuxi_research.md", "https://example.com/wuxi_research.md"]) {
    assert.ok(!links(render(content)).some(href => href.startsWith("/")), content);
  }
  assert.equal(links(render("中文 报告.md" )).length, 0);
  assert.equal(decodeURIComponent(links(render("（reports/中文 报告.md）"))[0]), "/reports/中文 报告.md");
});

test("only exact inline code references transform; code blocks and existing links remain intact", () => {
  assert.match(render("`wuxi_research.md`"), /<a href="\/wuxi_research.md"><code>wuxi_research.md<\/code><\/a>/);
  const input = "`cat wuxi_research.md`\n\n```sh\ncat wuxi_research.md\n```\n\n[现有](wuxi_research.md)\n\n[引用][ref]\n\n![图片](wuxi_research.md)\n\n[ref]: wuxi_research.md";
  const html = render(input);
  assert.deepEqual(links(html), ["wuxi_research.md", "wuxi_research.md"]);
  assert.match(html, /<pre><code class="language-sh">cat wuxi_research.md/);
  assert.match(html, /<code>cat wuxi_research.md<\/code>/);
  assert.doesNotMatch(html, /<a[^>]*><a/);
});

test("artifact URLs encode percent, hash, question mark and spaces exactly once", () => {
  const path = "reports/a%20 #?.md";
  const href = links(render(`\`${path}\``, [path]))[0];
  assert.equal(href, "/reports/a%2520%20%23%3F.md");
  assert.equal(decodeURIComponent(href.slice(1)), path);
  assert.equal(links(render("../outside.md", ["../outside.md"])).length, 0);
});

test("artifact allowlists use accepted results and the selected attempt, isolated by run", () => {
  const attempt = (id, paths) => ({ id, result: { artifacts: paths } });
  const run = { accepted: { a: "accepted" }, attempts: [attempt("accepted", ["a.md", "a.md"]), attempt("old", ["old.md"])] };
  assert.deepEqual(workflowArtifactPaths(run), ["a.md"]);
  assert.deepEqual(workflowArtifactPaths(run, run.attempts[1]), ["a.md", "old.md"]);
  assert.deepEqual(workflowArtifactPaths({ accepted: {}, attempts: run.attempts }), []);
  assert.deepEqual(workflowArtifactPaths({ accepted: { b: "b" }, attempts: [attempt("b", ["b.md", "../outside", "/absolute", "x\\y"])] }), ["b.md"]);
});

test("source annotations stay outside the URL and known file sources navigate", () => {
  const source = "https://www.cls.cn/detail/2394600 (财联社, 2026-06-09, 1260H名单)";
  assert.deepEqual(links(render(source, artifacts, true)), ["https://www.cls.cn/detail/2394600"]);
  assert.match(render(source, artifacts, true), /<\/a> \(财联社/);
  assert.deepEqual(links(render("wuxi_research.md", artifacts, true)), ["/wuxi_research.md"]);
  assert.deepEqual(links(render("AKShare stock_profit_sheet_by_yearly_em (603259.SH)", artifacts, true)), []);
  assert.deepEqual(links(render("[财联社](https://www.cls.cn/detail/2394600)（2026-06-09）", artifacts, true)), ["https://www.cls.cn/detail/2394600"]);
});

test("incomplete or unsafe source URLs remain text without inventing a suffix", () => {
  for (const source of ["https://example.com/report... (新闻稿)", "https://example.com/report… (新闻稿)", "https://example.com/report%2E%2E%2E", "javascript:alert(1)", "file:///etc/passwd", "https://"]) {
    assert.equal(links(render(source, artifacts, true)).length, 0, source);
  }
  assert.equal(links(render("[新闻稿](https://example.com/report...)", artifacts, true)).length, 0);
  assert.equal(allowWorkflowSourceLink("https://example.com/report (说明)"), false);
  assert.equal(allowWorkflowSourceLink("https://example.com/report_(2026)?q=a#section"), true);
});
