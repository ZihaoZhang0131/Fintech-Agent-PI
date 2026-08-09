import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

const skillRoot = fileURLToPath(new URL("../.agents/skills/a-share-value-investing/", import.meta.url));
const scriptsDirectory = path.join(skillRoot, "scripts");

function runScript(name, args, environment) {
  return new Promise((resolve, reject) => {
    const child = spawn("python3", [path.join(scriptsDirectory, name), ...args], {
      env: { ...process.env, ...environment },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code) => resolve({ code, stdout, stderr }));
  });
}

function annualYear(url) {
  return Number(url.searchParams.get("date")?.slice(0, 4));
}

function screeningRows(pathname, url) {
  if (pathname === "/api/public/stock_zh_a_spot_em") {
    return [
      { 代码: "600001", 名称: "质量股份", 最新价: 12, "市盈率-动态": 10, 市净率: 1.5, 总市值: 300 },
      { 代码: "600002", 名称: "*ST样本", 最新价: 2, "市盈率-动态": 5, 市净率: 0.5, 总市值: 20 },
      { 代码: "600003", 名称: "样本银行", 最新价: 8, "市盈率-动态": 6, 市净率: 0.7, 总市值: 500 },
      { 代码: "600004", 名称: "次新样本", 最新价: 20, "市盈率-动态": 25, 市净率: 3, 总市值: 100 },
    ];
  }
  const year = annualYear(url);
  if (pathname === "/api/public/stock_yjbb_em") {
    const rows = [
      { 股票代码: "600001", 股票简称: "质量股份", "营业总收入-营业总收入": 100 + (year - 2021) * 12, "净利润-净利润": 10 + (year - 2021) * 1.2, 净资产收益率: 18, 销售毛利率: 40, 所处行业: "食品饮料" },
      { 股票代码: "600002", 股票简称: "*ST样本", "营业总收入-营业总收入": 20, "净利润-净利润": 1, 净资产收益率: 5, 销售毛利率: 10, 所处行业: "制造业" },
      { 股票代码: "600003", 股票简称: "样本银行", "营业总收入-营业总收入": 200, "净利润-净利润": 30, 净资产收益率: 11, 销售毛利率: 0, 所处行业: "银行" },
    ];
    if (year >= 2022) rows.push({ 股票代码: "600004", 股票简称: "次新样本", "营业总收入-营业总收入": 30, "净利润-净利润": 3, 净资产收益率: 10, 销售毛利率: 20, 所处行业: "软件服务" });
    return rows;
  }
  if (pathname === "/api/public/stock_zcfz_em") {
    return ["600001", "600002", "600003", "600004"].map((code) => ({ 股票代码: code, "资产-货币资金": 50, "负债-总负债": 100, 资产负债率: 30 }));
  }
  if (pathname === "/api/public/stock_xjll_em") {
    return ["600001", "600002", "600003", "600004"].map((code) => ({ 股票代码: code, "经营性现金流-现金流量净额": code === "600001" ? 12 + (year - 2021) * 1.5 : 5 }));
  }
  if (pathname === "/api/public/stock_fhps_em") {
    return [{ 代码: "600001", "现金分红-现金分红比例": 3 }];
  }
  return null;
}

function deepRows(pathname, url) {
  const symbol = url.searchParams.get("symbol");
  if (symbol && !symbol.endsWith("600001")) return [];
  if (pathname === "/api/public/stock_financial_analysis_indicator") {
    return [2021, 2022, 2023, 2024, 2025].map((year) => ({ 日期: `${year}-12-31`, "净资产收益率(%)": 18 }));
  }
  if (pathname === "/api/public/stock_cash_flow_sheet_by_yearly_em") {
    return [2021, 2022, 2023, 2024, 2025].map((year) => ({ REPORT_DATE: `${year}-12-31`, NETCASH_OPERATE: 20, CONSTRUCT_LONG_ASSET: 5 }));
  }
  if (pathname === "/api/public/stock_value_em") {
    return [
      { 数据日期: "2021-12-31", "PE(TTM)": 20, 市净率: 3, 市现率: 18, 总市值: 250 },
      { 数据日期: "2022-12-31", "PE(TTM)": 18, 市净率: 2.8, 市现率: 16, 总市值: 260 },
      { 数据日期: "2023-12-31", "PE(TTM)": 16, 市净率: 2.5, 市现率: 14, 总市值: 270 },
      { 数据日期: "2024-12-31", "PE(TTM)": 14, 市净率: 2.2, 市现率: 12, 总市值: 280 },
      { 数据日期: "2025-12-31", "PE(TTM)": 12, 市净率: 2, 市现率: 10, 总市值: 290 },
      { 数据日期: "2026-06-01", "PE(TTM)": 8, 市净率: 1, 市现率: 7, 总市值: 300 },
    ];
  }
  if (pathname === "/api/public/stock_fhps_detail_em") {
    return [2021, 2022, 2023, 2024, 2025].map((year) => ({ 报告期: `${year}-12-31`, "现金分红-现金分红比例": 3 }));
  }
  if (pathname === "/api/public/stock_zh_valuation_comparison_em") {
    return [
      { 代码: "600001", "市盈率-TTM": 8, "市净率-MRQ": 1 },
      { 代码: "600011", "市盈率-TTM": 15, "市净率-MRQ": 2 },
      { 代码: "600012", "市盈率-TTM": 20, "市净率-MRQ": 3 },
    ];
  }
  if (pathname === "/api/public/stock_zh_dupont_comparison_em") {
    return [
      { 代码: "600001", "ROE-3年平均": 18 },
      { 代码: "600011", "ROE-3年平均": 15 },
      { 代码: "600012", "ROE-3年平均": 16 },
    ];
  }
  if (pathname === "/api/public/stock_sy_em") return [{ 股票代码: "600001", 商誉占净资产比例: 10 }];
  if (pathname === "/api/public/stock_gpzy_pledge_ratio_em") return [{ 股票代码: "600001", 质押比例: 20 }];
  return null;
}

async function withFakeAktools(t, handler) {
  const server = createServer(handler);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  return `http://127.0.0.1:${server.address().port}`;
}

test("the Skill requires AKShare data, official evidence, and a bounded stocks-plus-reasons output", async () => {
  const instructions = await readFile(path.join(skillRoot, "SKILL.md"), "utf8");
  const methodology = await readFile(path.join(skillRoot, "references", "methodology.md"), "utf8");
  const contract = await readFile(path.join(skillRoot, "references", "data-contract.md"), "utf8");
  assert.match(instructions, /load_skill.*akshare-http-data/s);
  assert.match(instructions, /最多 10 只股票/);
  assert.match(instructions, /两份可点击的一手资料/);
  assert.match(methodology, /总分低于 70/);
  assert.match(methodology, /三角交叉估值/);
  assert.match(contract, /75 秒全局时限/);
  assert.doesNotMatch(instructions, /allowed_tools/);
});

test("full-market screen merges five years and excludes ST, financial, and short-history stocks", async (t) => {
  const baseUrl = await withFakeAktools(t, (request, response) => {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    const rows = screeningRows(url.pathname, url);
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.end(JSON.stringify(rows ?? []));
  });
  const result = await runScript("screen_candidates.py", ["--as-of", "2026-06-01", "--deep-count", "30"], { AKTOOLS_BASE_URL: baseUrl });
  assert.equal(result.code, 0, result.stderr);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.usable_for_research, true);
  assert.deepEqual(payload.annual_periods, ["20211231", "20221231", "20231231", "20241231", "20251231"]);
  assert.equal(payload.candidates[0].code, "600001");
  assert.equal(payload.candidates[0].scores.quality, 28);
  assert.equal(payload.candidates[0].scores.cash_realization, 20);
  assert.equal(payload.candidates[0].scores.financial_safety, 15);
  assert.ok(payload.candidates[0].total_score >= 70);
  assert.equal(payload.exclusion_summary.st_or_delisting, 1);
  assert.equal(payload.exclusion_summary.financial_industry, 1);
  assert.equal(payload.exclusion_summary.insufficient_five_year_history, 1);
});

test("deep metrics retry transient failures, enforce 30 symbols, and produce three valuation supports", async (t) => {
  let valueAttempts = 0;
  const baseUrl = await withFakeAktools(t, (request, response) => {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    if (url.pathname === "/api/public/stock_value_em" && ++valueAttempts === 1) {
      response.statusCode = 503;
      response.end("temporary");
      return;
    }
    const rows = deepRows(url.pathname, url);
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.end(JSON.stringify(rows ?? []));
  });
  const result = await runScript("deep_metrics.py", ["--as-of", "2026-06-01", "--symbols", "600001,600005"], { AKTOOLS_BASE_URL: baseUrl });
  assert.equal(result.code, 0, result.stderr);
  const payload = JSON.parse(result.stdout);
  const complete = payload.results.find((item) => item.code === "600001");
  const incomplete = payload.results.find((item) => item.code === "600005");
  assert.equal(complete.core_complete, true);
  assert.equal(complete.valuation_support_count, 3);
  assert.equal(complete.valuation_score, 20);
  assert.equal(complete.valuation_signals.free_cash_flow_yield.evidence.fcf_yield_pct, 5);
  assert.ok(incomplete.missing_fields.includes("five_year_financial_indicators"));
  assert.ok(incomplete.missing_fields.includes("goodwill"));
  assert.ok(incomplete.missing_fields.includes("pledge"));
  assert.equal(payload.interfaces.find((item) => item.key === "value:600001").attempts, 2);

  const tooMany = Array.from({ length: 31 }, (_, index) => String(600100 + index)).join(",");
  const rejected = await runScript("deep_metrics.py", ["--as-of", "2026-06-01", "--symbols", tooMany], { AKTOOLS_BASE_URL: baseUrl });
  assert.notEqual(rejected.code, 0);
  assert.match(rejected.stderr, /1 到 30/);
});

test("an empty core dataset stops the screen instead of being interpreted as no risk", async (t) => {
  const baseUrl = await withFakeAktools(t, (request, response) => {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    const rows = url.pathname === "/api/public/stock_xjll_em" ? [] : screeningRows(url.pathname, url);
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.end(JSON.stringify(rows ?? []));
  });
  const result = await runScript("screen_candidates.py", ["--as-of", "2026-06-01"], { AKTOOLS_BASE_URL: baseUrl });
  assert.equal(result.code, 2);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.usable_for_research, false);
  assert.ok(payload.interfaces.some((item) => item.interface === "stock_xjll_em" && item.empty));
});
