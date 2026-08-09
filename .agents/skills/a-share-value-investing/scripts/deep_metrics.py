#!/usr/bin/env python3
"""Collect compact deep metrics and triangulated valuation for up to 30 stocks."""

from __future__ import annotations

import argparse
from datetime import date, datetime, timedelta, timezone
from typing import Any

from aktools_common import (
    AktoolsClient,
    completed_annual_years,
    exchange_symbol,
    first_number,
    first_value,
    normalize_code,
    parse_as_of,
    print_json,
    quantile,
    rounded,
    row_date,
    run_calls,
    safe_median,
)


def parse_symbols(raw: str) -> list[str]:
    symbols: list[str] = []
    for part in raw.split(","):
        code = normalize_code(part.strip())
        if not code:
            raise ValueError(f"无效股票代码：{part}")
        if code not in symbols:
            symbols.append(code)
    if not symbols or len(symbols) > 30:
        raise ValueError("--symbols 必须包含 1 到 30 个六位股票代码。")
    return symbols


def start_date_five_years(as_of: date) -> date:
    try:
        return as_of.replace(year=as_of.year - 5)
    except ValueError:
        return as_of.replace(year=as_of.year - 5, day=28)


def latest_friday(as_of: date) -> date:
    return as_of - timedelta(days=(as_of.weekday() - 4) % 7)


def latest_row(rows: list[dict[str, Any]], as_of: date) -> dict[str, Any] | None:
    dated = [(parsed, row) for row in rows if (parsed := row_date(row)) is not None and parsed <= as_of]
    return max(dated, key=lambda item: item[0])[1] if dated else (rows[0] if rows else None)


def rows_in_window(rows: list[dict[str, Any]], start: date, end: date) -> list[dict[str, Any]]:
    return [row for row in rows if (parsed := row_date(row)) is not None and start <= parsed <= end]


def annual_rows(rows: list[dict[str, Any]], as_of: date, count: int = 5) -> list[dict[str, Any]]:
    expected = set(completed_annual_years(as_of, count))
    per_year: dict[int, tuple[date, dict[str, Any]]] = {}
    for row in rows:
        parsed = row_date(row)
        if not parsed or parsed.year not in expected or parsed.month != 12:
            continue
        if parsed.year not in per_year or parsed > per_year[parsed.year][0]:
            per_year[parsed.year] = (parsed, row)
    return [per_year[year][1] for year in sorted(per_year)]


def code_map(rows: list[dict[str, Any]], aliases: tuple[str, ...]) -> dict[str, dict[str, Any]]:
    mapped: dict[str, dict[str, Any]] = {}
    for row in rows:
        code = normalize_code(first_value(row, aliases))
        if code:
            mapped[code] = row
    return mapped


def positive_values(rows: list[dict[str, Any]], aliases: tuple[str, ...]) -> list[float]:
    values = [first_number(row, aliases) for row in rows]
    return [value for value in values if value is not None and value > 0]


def signal(value: bool | None, evidence: dict[str, Any]) -> dict[str, Any]:
    return {
        "status": "support" if value is True else "not_support" if value is False else "insufficient_data",
        "evidence": evidence,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--as-of")
    parser.add_argument("--symbols", required=True)
    parser.add_argument("--request-timeout", type=float, default=12, choices=range(1, 13))
    args = parser.parse_args()
    try:
        as_of = parse_as_of(args.as_of)
        symbols = parse_symbols(args.symbols)
    except ValueError as error:
        parser.error(str(error))

    annual_years = completed_annual_years(as_of)
    start_year = str(annual_years[0] - 4)
    calls: list[tuple[str, str, dict[str, str]]] = []
    for code in symbols:
        prefixed = exchange_symbol(code)
        calls.extend(
            [
                (f"indicator:{code}", "stock_financial_analysis_indicator", {"symbol": code, "start_year": start_year}),
                (f"cashflow:{code}", "stock_cash_flow_sheet_by_yearly_em", {"symbol": prefixed}),
                (f"value:{code}", "stock_value_em", {"symbol": code}),
                (f"dividend:{code}", "stock_fhps_detail_em", {"symbol": code}),
                (f"peer_value:{code}", "stock_zh_valuation_comparison_em", {"symbol": prefixed}),
                (f"peer_roe:{code}", "stock_zh_dupont_comparison_em", {"symbol": prefixed}),
            ]
        )
    annual_period = f"{annual_years[-1]}1231"
    pledge_date = latest_friday(as_of).strftime("%Y%m%d")
    calls.extend(
        [
            ("goodwill", "stock_sy_em", {"date": annual_period}),
            ("pledge", "stock_gpzy_pledge_ratio_em", {"date": pledge_date}),
        ]
    )
    data, statuses = run_calls(AktoolsClient(timeout=args.request_timeout), calls)
    status_by_key = {status["key"]: status for status in statuses}
    goodwill = code_map(data.get("goodwill", []), ("股票代码", "代码"))
    pledges = code_map(data.get("pledge", []), ("股票代码", "代码"))
    window_start = start_date_five_years(as_of)
    results: list[dict[str, Any]] = []

    for code in symbols:
        indicators = annual_rows(data.get(f"indicator:{code}", []), as_of)
        cashflows = annual_rows(data.get(f"cashflow:{code}", []), as_of)
        value_rows = rows_in_window(data.get(f"value:{code}", []), window_start, as_of)
        current_value = latest_row(value_rows, as_of)
        dividends = rows_in_window(data.get(f"dividend:{code}", []), window_start, as_of)
        peer_values = data.get(f"peer_value:{code}", [])
        peer_roes = data.get(f"peer_roe:{code}", [])

        current_pe = first_number(current_value, ("PE(TTM)", "市盈率-TTM", "市盈率"))
        current_pb = first_number(current_value, ("市净率", "市净率-MRQ"))
        current_pcf = first_number(current_value, ("市现率", "市现率1-TTM", "市现率2-TTM"))
        market_cap = first_number(current_value, ("总市值",))
        history_thresholds = {
            "pe_40pct": quantile(positive_values(value_rows, ("PE(TTM)", "市盈率-TTM", "市盈率")), 0.4),
            "pb_40pct": quantile(positive_values(value_rows, ("市净率", "市净率-MRQ")), 0.4),
            "pcf_40pct": quantile(positive_values(value_rows, ("市现率", "市现率1-TTM", "市现率2-TTM")), 0.4),
        }
        own_comparisons = [
            current <= threshold
            for current, threshold in (
                (current_pe, history_thresholds["pe_40pct"]),
                (current_pb, history_thresholds["pb_40pct"]),
                (current_pcf, history_thresholds["pcf_40pct"]),
            )
            if current is not None and current > 0 and threshold is not None
        ]
        own_support = any(own_comparisons) if own_comparisons else None

        peer_pe_median = safe_median(positive_values(peer_values, ("市盈率-TTM", "PE(TTM)")))
        peer_pb_median = safe_median(positive_values(peer_values, ("市净率-MRQ", "市净率-24A", "市净率")))
        target_roe_row = next((row for row in peer_roes if normalize_code(first_value(row, ("代码",))) == code), None)
        current_roe = first_number(target_roe_row, ("ROE-3年平均", "净资产收益率(%)"))
        if current_roe is None and indicators:
            current_roe = first_number(indicators[-1], ("净资产收益率(%)", "加权净资产收益率(%)", "净资产报酬率(%)"))
        peer_roe_median = safe_median(positive_values(peer_roes, ("ROE-3年平均",)))
        valuation_checks = [
            current_pe <= peer_pe_median if current_pe is not None and current_pe > 0 and peer_pe_median is not None else None,
            current_pb <= peer_pb_median if current_pb is not None and current_pb > 0 and peer_pb_median is not None else None,
        ]
        comparable_checks = [item for item in valuation_checks if item is not None]
        roe_check = current_roe >= peer_roe_median if current_roe is not None and peer_roe_median is not None else None
        peer_support = all(comparable_checks) and roe_check is True if comparable_checks and roe_check is not None else None

        fcf_rows: list[dict[str, Any]] = []
        for row in cashflows[-3:]:
            parsed = row_date(row)
            cfo = first_number(
                row,
                (
                    "经营活动产生的现金流量净额",
                    "经营性现金流-现金流量净额",
                    "NETCASH_OPERATE",
                ),
            )
            capex = first_number(
                row,
                (
                    "购建固定资产、无形资产和其他长期资产支付的现金",
                    "购建固定资产无形资产和其他长期资产支付的现金",
                    "CONSTRUCT_LONG_ASSET",
                ),
            )
            fcf = cfo - abs(capex) if cfo is not None and capex is not None else None
            fcf_rows.append({"year": parsed.year if parsed else None, "cfo": rounded(cfo), "capex": rounded(capex), "fcf": rounded(fcf)})
        fcf_values = [row["fcf"] for row in fcf_rows if row["fcf"] is not None]
        fcf_average = sum(fcf_values) / len(fcf_values) if len(fcf_values) == 3 else None
        fcf_yield = fcf_average / market_cap * 100 if fcf_average is not None and market_cap and market_cap > 0 else None
        positive_fcf_years = sum(value > 0 for value in fcf_values)
        fcf_support = fcf_yield >= 4 and positive_fcf_years >= 2 if fcf_yield is not None and len(fcf_values) == 3 else None

        signals = {
            "own_history": signal(
                own_support,
                {
                    "current_pe": rounded(current_pe),
                    "current_pb": rounded(current_pb),
                    "current_pcf": rounded(current_pcf),
                    **{key: rounded(value) for key, value in history_thresholds.items()},
                },
            ),
            "peer_comparison": signal(
                peer_support,
                {
                    "peer_pe_median": rounded(peer_pe_median),
                    "peer_pb_median": rounded(peer_pb_median),
                    "current_roe": rounded(current_roe),
                    "peer_roe_median": rounded(peer_roe_median),
                },
            ),
            "free_cash_flow_yield": signal(
                fcf_support,
                {
                    "three_year_average_fcf": rounded(fcf_average),
                    "fcf_yield_pct": rounded(fcf_yield),
                    "positive_fcf_years": positive_fcf_years,
                },
            ),
        }
        support_count = sum(item["status"] == "support" for item in signals.values())
        missing: list[str] = []
        for key in (f"indicator:{code}", f"cashflow:{code}", f"value:{code}", f"peer_value:{code}", f"peer_roe:{code}"):
            if not status_by_key[key]["ok"] or status_by_key[key]["empty"]:
                missing.append(key.split(":", 1)[0])
        if len(indicators) < 5:
            missing.append("five_year_financial_indicators")
        if len(cashflows) < 5:
            missing.append("five_year_cashflow_statements")
        if not value_rows:
            missing.append("five_year_valuation_history")
        goodwill_ratio = first_number(goodwill.get(code), ("商誉占净资产比例",))
        pledge_ratio = first_number(pledges.get(code), ("质押比例",))
        if not status_by_key["goodwill"]["ok"] or status_by_key["goodwill"]["empty"] or code not in goodwill:
            missing.append("goodwill")
        if not status_by_key["pledge"]["ok"] or status_by_key["pledge"]["empty"] or code not in pledges:
            missing.append("pledge")
        risk_flags = [
            flag
            for condition, flag in (
                (pledge_ratio is not None and pledge_ratio > 50, "pledge_ratio_above_50pct"),
                (goodwill_ratio is not None and goodwill_ratio > 50, "goodwill_to_equity_above_50pct"),
                (fcf_support is False, "fcf_valuation_not_supported"),
                (bool(missing), "deep_data_incomplete"),
            )
            if condition
        ]
        dividend_years = len(
            {
                parsed.year
                for row in dividends
                if (parsed := row_date(row)) is not None
                and (cash_dividend := first_number(row, ("现金分红-现金分红比例", "现金分红-股息率"))) is not None
                and cash_dividend > 0
            }
        )
        results.append(
            {
                "code": code,
                "core_complete": len(indicators) >= 5 and len(cashflows) >= 5 and bool(value_rows),
                "current_valuation": {
                    "date": row_date(current_value).isoformat() if current_value and row_date(current_value) else None,
                    "pe_ttm": rounded(current_pe),
                    "pb": rounded(current_pb),
                    "pcf": rounded(current_pcf),
                    "market_cap": rounded(market_cap),
                },
                "roe": {"current_or_three_year": rounded(current_roe), "five_year_median": rounded(safe_median(first_number(row, ("净资产收益率(%)", "加权净资产收益率(%)", "净资产报酬率(%)")) for row in indicators))},
                "free_cash_flow": fcf_rows,
                "cash_dividend_years_5y": dividend_years,
                "goodwill_to_equity_pct": rounded(goodwill_ratio),
                "pledge_ratio_pct": rounded(pledge_ratio),
                "valuation_signals": signals,
                "valuation_support_count": support_count,
                "valuation_score": (0, 8, 16, 20)[support_count],
                "risk_flags": risk_flags,
                "missing_fields": sorted(set(missing)),
            }
        )

    core_complete_count = sum(result["core_complete"] for result in results)
    payload = {
        "as_of": as_of.isoformat(),
        "symbols": symbols,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "goodwill_period": annual_period,
        "pledge_date": pledge_date,
        "usable_for_research": core_complete_count > 0,
        "interfaces": statuses,
        "coverage": {
            "requested_symbols": len(symbols),
            "core_complete_symbols": core_complete_count,
            "two_or_more_valuation_supports": sum(result["valuation_support_count"] >= 2 for result in results),
        },
        "results": results,
    }
    print_json(payload)
    return 0 if payload["usable_for_research"] else 2


if __name__ == "__main__":
    raise SystemExit(main())
