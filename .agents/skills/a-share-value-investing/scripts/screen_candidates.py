#!/usr/bin/env python3
"""Screen the full A-share universe for quality-value candidates."""

from __future__ import annotations

import argparse
from collections import Counter, defaultdict
from datetime import datetime, timezone
from math import pow
from typing import Any

from aktools_common import (
    AktoolsClient,
    completed_annual_years,
    first_number,
    first_value,
    normalize_code,
    parse_as_of,
    percentile_rank,
    print_json,
    rounded,
    run_calls,
    safe_median,
)


FINANCIAL_KEYWORDS = ("银行", "证券", "保险", "多元金融", "期货", "信托")
PROFIT_ALIASES = ("净利润-净利润", "净利润", "归属于母公司股东的净利润")
REVENUE_ALIASES = ("营业总收入-营业总收入", "营业总收入", "营业收入")
OCF_ALIASES = ("经营性现金流-现金流量净额", "经营活动产生的现金流量净额")
DIVIDEND_ALIASES = ("现金分红-现金分红比例", "现金分红比例", "现金分红")


def code_map(rows: list[dict[str, Any]], aliases: tuple[str, ...]) -> dict[str, dict[str, Any]]:
    result: dict[str, dict[str, Any]] = {}
    for row in rows:
        code = normalize_code(first_value(row, aliases))
        if code:
            result[code] = row
    return result


def cagr(values: list[float | None]) -> float | None:
    if len(values) < 2 or values[0] is None or values[-1] is None or values[0] <= 0 or values[-1] <= 0:
        return None
    return (pow(values[-1] / values[0], 1 / (len(values) - 1)) - 1) * 100


def score_growth(value: float | None) -> int:
    if value is None:
        return 0
    if value >= 10:
        return 5
    if value >= 5:
        return 4
    if value >= 0:
        return 3
    if value >= -5:
        return 1
    return 0


def score_candidate(record: dict[str, Any]) -> dict[str, int]:
    roes = record["series"]["roe"]
    profits = record["series"]["net_profit"]
    margins = [value for value in record["series"]["gross_margin"] if value is not None]
    ocfs = record["series"]["operating_cash_flow"]
    roe_median = record["metrics"]["roe_median_5y"]

    quality = 14 if roe_median is not None and roe_median >= 20 else 12 if roe_median is not None and roe_median >= 15 else 10 if roe_median is not None and roe_median >= 12 else 6 if roe_median is not None and roe_median >= 8 else 2 if roe_median is not None and roe_median > 0 else 0
    positive_profit_years = sum(value is not None and value > 0 for value in profits)
    quality += 6 if positive_profit_years == 5 else 4 if positive_profit_years == 4 else 2 if positive_profit_years == 3 else 0
    positive_roe_years = sum(value is not None and value > 0 for value in roes)
    quality += 5 if positive_roe_years == 5 else 3 if positive_roe_years == 4 else 1 if positive_roe_years == 3 else 0
    if len(margins) >= 3:
        spread = max(margins) - min(margins)
        quality += 5 if spread <= 5 else 3 if spread <= 10 else 1

    cash_ratio = record["metrics"]["cumulative_ocf_to_profit"]
    cash = 12 if cash_ratio is not None and cash_ratio >= 1.2 else 10 if cash_ratio is not None and cash_ratio >= 1 else 8 if cash_ratio is not None and cash_ratio >= 0.8 else 4 if cash_ratio is not None and cash_ratio >= 0.5 else 2 if cash_ratio is not None and cash_ratio > 0 else 0
    positive_ocf_years = sum(value is not None and value > 0 for value in ocfs)
    cash += 8 if positive_ocf_years == 5 else 6 if positive_ocf_years == 4 else 3 if positive_ocf_years == 3 else 0

    debt_ratio = record["metrics"]["debt_ratio_latest"]
    safety = 10 if debt_ratio is not None and debt_ratio <= 30 else 8 if debt_ratio is not None and debt_ratio <= 45 else 5 if debt_ratio is not None and debt_ratio <= 60 else 2 if debt_ratio is not None and debt_ratio <= 70 else 0
    cash_to_debt = record["metrics"]["cash_to_liabilities"]
    safety += 5 if cash_to_debt is not None and cash_to_debt >= 0.5 else 4 if cash_to_debt is not None and cash_to_debt >= 0.3 else 2 if cash_to_debt is not None and cash_to_debt >= 0.15 else 0

    growth = score_growth(record["metrics"]["revenue_cagr_5y"]) + score_growth(record["metrics"]["profit_cagr_5y"])
    dividend_years = record["metrics"]["cash_dividend_years"]
    shareholder = min(5, dividend_years)
    return {
        "quality": min(30, quality),
        "cash_realization": min(20, cash),
        "financial_safety": min(15, safety),
        "growth_stability": min(10, growth),
        "shareholder_returns": shareholder,
        "valuation": 0,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--as-of")
    parser.add_argument("--deep-count", type=int, default=30, choices=range(1, 31))
    parser.add_argument("--request-timeout", type=float, default=12, choices=range(1, 13))
    args = parser.parse_args()
    try:
        as_of = parse_as_of(args.as_of)
    except ValueError as error:
        parser.error(str(error))
    years = completed_annual_years(as_of)
    periods = [f"{year}1231" for year in years]

    calls: list[tuple[str, str, dict[str, str]]] = [("spot", "stock_zh_a_spot_em", {})]
    for period in periods:
        calls.extend(
            [
                (f"performance:{period}", "stock_yjbb_em", {"date": period}),
                (f"balance:{period}", "stock_zcfz_em", {"date": period}),
                (f"cashflow:{period}", "stock_xjll_em", {"date": period}),
                (f"dividend:{period}", "stock_fhps_em", {"date": period}),
            ]
        )
    data, statuses = run_calls(AktoolsClient(timeout=args.request_timeout), calls)
    status_by_key = {status["key"]: status for status in statuses}
    latest_period = periods[-1]
    core_keys = ["spot", *(f"performance:{period}" for period in periods), *(f"cashflow:{period}" for period in periods), f"balance:{latest_period}"]
    core_ok = all(status_by_key[key]["ok"] and not status_by_key[key]["empty"] for key in core_keys)

    spot = code_map(data.get("spot", []), ("代码", "股票代码"))
    performance = {period: code_map(data.get(f"performance:{period}", []), ("股票代码", "代码")) for period in periods}
    balances = {period: code_map(data.get(f"balance:{period}", []), ("股票代码", "代码")) for period in periods}
    cashflows = {period: code_map(data.get(f"cashflow:{period}", []), ("股票代码", "代码")) for period in periods}
    dividends = {period: code_map(data.get(f"dividend:{period}", []), ("代码", "股票代码")) for period in periods}

    exclusions: Counter[str] = Counter()
    exclusion_examples: defaultdict[str, list[str]] = defaultdict(list)
    records: list[dict[str, Any]] = []
    for code, quote in spot.items():
        name = str(first_value(quote, ("名称", "股票简称")) or "").strip()
        latest_performance = performance[latest_period].get(code)
        industry = str(first_value(latest_performance, ("所处行业", "行业")) or "未知").strip()
        reasons: list[str] = []
        if "ST" in name.upper() or "退" in name:
            reasons.append("st_or_delisting")
        if any(keyword in industry or keyword in name for keyword in FINANCIAL_KEYWORDS):
            reasons.append("financial_industry")
        history_count = sum(code in performance[period] for period in periods)
        if history_count < 5:
            reasons.append("insufficient_five_year_history")

        revenues = [first_number(performance[period].get(code), REVENUE_ALIASES) for period in periods]
        profits = [first_number(performance[period].get(code), PROFIT_ALIASES) for period in periods]
        roes = [first_number(performance[period].get(code), ("净资产收益率", "加权净资产收益率(%)")) for period in periods]
        margins = [first_number(performance[period].get(code), ("销售毛利率", "销售毛利率(%)")) for period in periods]
        ocfs = [first_number(cashflows[period].get(code), OCF_ALIASES) for period in periods]
        if profits[-1] is None or profits[-1] <= 0:
            reasons.append("latest_annual_profit_not_positive")
        valid_ocfs = [value for value in ocfs if value is not None]
        if len(valid_ocfs) < 5:
            reasons.append("insufficient_cashflow_history")
        elif sum(valid_ocfs) <= 0:
            reasons.append("cumulative_ocf_not_positive")
        if reasons:
            for reason in sorted(set(reasons)):
                exclusions[reason] += 1
                if len(exclusion_examples[reason]) < 8:
                    exclusion_examples[reason].append(f"{code} {name}".strip())
            continue

        latest_balance = balances[latest_period].get(code)
        debt_ratio = first_number(latest_balance, ("资产负债率", "资产负债率(%)"))
        cash = first_number(latest_balance, ("资产-货币资金", "货币资金"))
        liabilities = first_number(latest_balance, ("负债-总负债", "总负债"))
        sum_profit = sum(value for value in profits if value is not None)
        sum_ocf = sum(value for value in ocfs if value is not None)
        dividend_years = sum(
            (value := first_number(dividends[period].get(code), DIVIDEND_ALIASES)) is not None and value > 0
            for period in periods
        )
        metrics = {
            "roe_median_5y": rounded(safe_median(roes)),
            "revenue_cagr_5y": rounded(cagr(revenues)),
            "profit_cagr_5y": rounded(cagr(profits)),
            "cumulative_ocf_to_profit": rounded(sum_ocf / sum_profit) if sum_profit > 0 else None,
            "debt_ratio_latest": rounded(debt_ratio),
            "cash_to_liabilities": rounded(cash / liabilities) if cash is not None and liabilities and liabilities > 0 else None,
            "cash_dividend_years": dividend_years,
            "pe_dynamic": rounded(first_number(quote, ("市盈率-动态", "市盈率"))),
            "pb": rounded(first_number(quote, ("市净率",))),
        }
        missing = [key for key, value in metrics.items() if value is None and key not in {"revenue_cagr_5y", "profit_cagr_5y"}]
        record = {
            "code": code,
            "name": name,
            "industry": industry,
            "price": rounded(first_number(quote, ("最新价", "收盘"))),
            "market_cap": rounded(first_number(quote, ("总市值",))),
            "metrics": metrics,
            "series": {
                "roe": roes,
                "gross_margin": margins,
                "net_profit": profits,
                "operating_cash_flow": ocfs,
            },
            "missing_fields": missing,
        }
        record["scores"] = score_candidate(record)
        records.append(record)

    by_industry: defaultdict[str, list[dict[str, Any]]] = defaultdict(list)
    for record in records:
        by_industry[record["industry"]].append(record)
    all_pes = [record["metrics"]["pe_dynamic"] for record in records]
    all_pbs = [record["metrics"]["pb"] for record in records]
    for record in records:
        peers = by_industry[record["industry"]]
        pe_values = [peer["metrics"]["pe_dynamic"] for peer in peers] if len(peers) >= 5 else all_pes
        pb_values = [peer["metrics"]["pb"] for peer in peers] if len(peers) >= 5 else all_pbs
        pe_rank = percentile_rank(record["metrics"]["pe_dynamic"], pe_values)
        pb_rank = percentile_rank(record["metrics"]["pb"], pb_values)
        valuation = 10 if pe_rank is not None and pe_rank <= 0.25 else 7 if pe_rank is not None and pe_rank <= 0.5 else 3 if pe_rank is not None and pe_rank <= 0.75 else 0
        valuation += 10 if pb_rank is not None and pb_rank <= 0.25 else 7 if pb_rank is not None and pb_rank <= 0.5 else 3 if pb_rank is not None and pb_rank <= 0.75 else 0
        record["scores"]["valuation"] = valuation
        record["metrics"]["industry_pe_percentile"] = rounded(pe_rank, 3)
        record["metrics"]["industry_pb_percentile"] = rounded(pb_rank, 3)
        record["total_score"] = sum(record["scores"].values())
        record["component_thresholds_met"] = {
            "quality": record["scores"]["quality"] >= 18,
            "cash_realization": record["scores"]["cash_realization"] >= 10,
            "financial_safety": record["scores"]["financial_safety"] >= 8,
            "preliminary_total": record["total_score"] >= 70,
        }
        record["reasons"] = [
            f"五年 ROE 中位数 {record['metrics']['roe_median_5y']}%" if record["metrics"]["roe_median_5y"] is not None else "ROE 数据不足",
            f"五年经营现金流/净利润 {record['metrics']['cumulative_ocf_to_profit']}" if record["metrics"]["cumulative_ocf_to_profit"] is not None else "现金转化数据不足",
            f"最新资产负债率 {record['metrics']['debt_ratio_latest']}%" if record["metrics"]["debt_ratio_latest"] is not None else "负债数据不足",
        ]
        record["risk_flags"] = [
            flag
            for condition, flag in (
                (record["metrics"]["debt_ratio_latest"] is not None and record["metrics"]["debt_ratio_latest"] > 60, "high_debt_ratio"),
                (bool(record["missing_fields"]), "missing_screen_fields"),
            )
            if condition
        ]
        del record["series"]

    records.sort(key=lambda item: (-item["total_score"], item["code"]))
    selected = records[: args.deep_count]
    payload = {
        "as_of": as_of.isoformat(),
        "annual_periods": periods,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "usable_for_research": bool(core_ok and spot and selected),
        "interfaces": statuses,
        "coverage": {
            "spot_count": len(spot),
            "passed_hard_data_gates": len(records),
            "candidate_count": len(selected),
        },
        "exclusion_summary": dict(sorted(exclusions.items())),
        "exclusion_examples": dict(exclusion_examples),
        "candidates": selected,
    }
    print_json(payload)
    return 0 if payload["usable_for_research"] else 2


if __name__ == "__main__":
    raise SystemExit(main())
