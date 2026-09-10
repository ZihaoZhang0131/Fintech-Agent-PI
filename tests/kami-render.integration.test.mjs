import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { renderKamiArtifact } from "../server/kami-artifact.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDirectory = path.join(root, ".local-data");
const pythonPath = path.join(dataDirectory, "documents-venv", "bin", "python");
const runtimeReady = existsSync(path.join(dataDirectory, "kami-ready-v1")) && existsSync(pythonPath);

function htmlEscape(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function atomicValues(node) {
  if (Array.isArray(node)) return node.flatMap(atomicValues);
  if (node && typeof node === "object") return Object.values(node).flatMap(atomicValues);
  if (node === null || typeof node === "boolean") return [];
  const value = String(node).trim();
  return value && (typeof node !== "string" || value.length <= 80) ? [value] : [];
}

function artifactHtml(title, content, pageCount, { formula = false, asset = false } = {}) {
  const facts = atomicValues(content);
  const chunks = Array.from({ length: pageCount }, (_, index) => facts.filter((_, factIndex) => factIndex % pageCount === index));
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>${htmlEscape(title)}</title><style>
    @page{size:A4;margin:0;background:#f5f4ed}*{box-sizing:border-box}html,body{margin:0;background:#f5f4ed;color:#141413}
    .page{height:297mm;padding:18mm;page-break-after:always;position:relative;background:#f5f4ed}.page:last-child{page-break-after:auto}
    h1{font-size:25pt;color:#1B365D;margin:0 0 8mm}h2{font-size:16pt;color:#1B365D;margin:0 0 5mm}.lead{font-size:12pt;line-height:1.5}
    ul{columns:2;column-gap:10mm;line-height:1.55;padding-left:5mm}.evidence{border-top:1px solid #e8e6dc;border-bottom:1px solid #e8e6dc;padding:5mm 0;margin:5mm 0}
    table{width:100%;border-collapse:collapse;margin-top:6mm}th,td{padding:3mm;border-bottom:1px solid #e8e6dc;text-align:left}
    .footer{position:absolute;left:18mm;right:18mm;bottom:18mm;padding-top:4mm;border-top:1px solid #e8e6dc;color:#6b6a64}.chart{width:100%;height:34mm;margin-top:5mm}
    img{max-width:42mm;max-height:24mm}
  </style></head><body>${chunks.map((chunk, index) => `<section class="page"><h1>${htmlEscape(title)}</h1><h2>第 ${index + 1} 页核心结论</h2><p class="lead">本页使用暖纸色、墨蓝与中文衬线字体，将事实、估值、催化剂和风险分层呈现。</p><div class="evidence"><ul>${chunk.map((value) => `<li>${htmlEscape(value)}</li>`).join("")}</ul></div>${index === 0 ? `<table><thead><tr><th>指标</th><th>基准</th><th>情景</th></tr></thead><tbody><tr><td>收入增速</td><td>12%</td><td>15%</td></tr><tr><td>利润率</td><td>18%</td><td>20%</td></tr></tbody></table><svg class="chart" viewBox="0 0 600 120" xmlns="http://www.w3.org/2000/svg"><path d="M20 100 L180 72 L340 64 L560 24" fill="none" stroke="#1B365D" stroke-width="5"/><line x1="20" y1="105" x2="580" y2="105" stroke="#e8e6dc"/></svg>${formula ? '<p>敏感性关系为 \\(P=EPS\\times PE\\)，公式已在发布前转换为 SVG。</p>' : ""}${asset ? '<img src="kami-asset://projectChart" alt="项目图片样例">' : ""}` : ""}<p class="footer">Kami 1.15.0 · 机械检查不代表主观视觉验收</p></section>`).join("")}</body></html>`;
}

const equityContent = {
  company: "样例股份", ticker: "600000", rating: "谨慎增持", price_target: "18.50 元",
  thesis: ["我们估计核心业务收入增速回升且现金流同步改善，但仍需逐季验证订单质量和回款节奏。", "产品结构升级可能推动毛利率温和修复，管理层指引与审计披露是后续核验依据。", "当前估值已反映部分复苏预期，安全边际取决于盈利预测与资本成本假设。"],
  valuation: [{ method: "PE 估值", result: "16.20 至 19.10 元", sensitivity: "2027 年 EPS 每变动 5%，估值中枢约同向变动 5%，其他条件保持不变。" }, { method: "DCF 估值", result: "15.80 至 20.30 元", sensitivity: "WACC 在 8.0% 至 9.0% 之间变化，永续增长率在 1.5% 至 2.5% 之间变化。" }],
  catalysts: [{ event: "年度财报披露", date: "2027-03", magnitude: "利润率指引确认" }],
  risks: [{ risk: "终端需求低于预期", impact: "收入增速下调 3 个百分点" }, { risk: "原材料成本上行超预期", impact: "毛利率下降 2 个百分点" }],
};

const longContent = {
  title: "投研 Agent 产物治理手册", subtitle: "从证据到正式交付", author: "本地投研团队", date: "2026-09-10",
  summary: { claim: "可用的投研产物需要将数据获取、来源核验、数字复核、内容定稿与视觉排版分成可观测的责任边界，并在每个边界上设置可验收的产物门。", takeaways: ["事实与来源先于视觉版式", "所有关键数字必须独立复核", "主观视觉验收必须单独记录"] },
  chapters: Array.from({ length: 3 }, (_, index) => ({ title: `第 ${index + 1} 章责任边界`, claim: "每个节点必须拥有明确输入、可检查输出和失败恢复语义，避免通过提示词代替真实的执行边界与验收门。", paragraphs: ["数据节点保存来源、时间、单位和口径，研究节点将事实与推断分开，写作节点只根据已验证材料组织结构，不得填补缺失数据或省略不确定性说明。", "最终排版节点使用同一份结构化内容生成 HTML 与 PDF，并在发布前执行覆盖、字体、页数、密度和逐页渲染检查，主观验收状态与机械检查分开。"] })),
  references: ["内部产物验收规范", "Kami v1.15.0"],
};

const slidesContent = {
  title: "Kami 正式产物链路", subtitle: "内容与版式分层", audience: "投研团队内部评审", minutes: 8,
  slides: ["cover", "content", "metrics", "content", "close"].map((layout, index) => ({ layout, eyebrow: "产物治理", title: `第 ${index + 1} 页用可核验产物推进交付`, items: ["保留事实与来源", "分离内容与版式", "发布前逐页检查"], cap: "机械检查通过后仍需要主观视觉验收。" })),
};

test("managed Kami runtime renders an equity report, long document, and PDF slides", { skip: !runtimeReady, timeout: 120_000 }, async (t) => {
  const requestedWorkspace = process.env.KAMI_QA_WORKSPACE;
  const workspacePath = requestedWorkspace ? path.resolve(requestedWorkspace) : await mkdtemp(path.join(tmpdir(), "kami-integration-"));
  if (!requestedWorkspace) t.after(() => rm(workspacePath, { recursive: true, force: true }));
  const projectChartPath = requestedWorkspace ? "outputs/.kami-qa-project-chart.svg" : "project-chart.svg";
  await mkdir(path.dirname(path.join(workspacePath, projectChartPath)), { recursive: true });
  await writeFile(path.join(workspacePath, projectChartPath), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 40"><rect width="80" height="40" fill="#E4ECF5"/><path d="M4 34 L30 24 L50 26 L76 7" fill="none" stroke="#1B365D" stroke-width="3"/></svg>');
  const cases = [
    { template: "equity-report", filename: "equity", content: equityContent, pages: 3, options: { formula: true, asset: true }, assets: [{ id: "projectChart", projectPath: projectChartPath }] },
    { template: "long-doc", filename: "long", content: longContent, pages: 6, options: {}, assets: [] },
    { template: "slides", filename: "slides", content: slidesContent, pages: 5, options: {}, assets: [] },
  ];
  for (const item of cases) {
    const result = await renderKamiArtifact({ workspace: { path: workspacePath }, dataDirectory, pythonPath, runtimeRoot: root, payload: { template: item.template, language: "zh-CN", filename: item.filename, formats: ["html", "pdf"], html: artifactHtml(item.filename, item.content, item.pages, item.options), contentIr: { type: item.template, lang: "zh-CN", content: item.content }, assets: item.assets, overwrite: Boolean(requestedWorkspace) } });
    assert.equal(result.pageCount, item.pages);
    assert.equal(result.previewPaths.length, result.pageCount);
    assert.ok(result.checks.every((check) => check.status === "passed" || check.status === "not-applicable"));
    assert.equal(result.visualReviewPending, true);
    const html = await readFile(path.join(workspacePath, result.paths.html), "utf8");
    assert.doesNotMatch(html, /\{\{[^}]+\}\}/);
    assert.doesNotMatch(html, /kami-asset:\/\//);
    assert.match(html, /Content-Security-Policy/);
    if (item.template === "equity-report") {
      assert.match(html, /<mjx-container/);
      assert.doesNotMatch(html, /\\\(P=EPS/);
      assert.match(html, /data:image\/svg\+xml;base64/);
      assert.match(html, /<table>/);
      assert.match(html, /<svg/);
    }
  }
});
