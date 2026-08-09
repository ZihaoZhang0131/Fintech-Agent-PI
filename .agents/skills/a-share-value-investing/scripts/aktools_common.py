#!/usr/bin/env python3
"""Shared, bounded AKTools HTTP helpers for the value-investing scripts."""

from __future__ import annotations

import json
import math
import os
import re
import time
from concurrent.futures import FIRST_COMPLETED, ThreadPoolExecutor, wait
from datetime import date, datetime
from statistics import median
from typing import Any, Iterable
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


BASE_URL = os.environ.get("AKTOOLS_BASE_URL", "http://127.0.0.1:8080").rstrip("/")
CODE_PATTERN = re.compile(r"(?<!\d)(\d{6})(?!\d)")
ALLOWED_INTERFACES = {
    "stock_zh_a_spot_em",
    "stock_yjbb_em",
    "stock_zcfz_em",
    "stock_xjll_em",
    "stock_fhps_em",
    "stock_financial_analysis_indicator",
    "stock_cash_flow_sheet_by_yearly_em",
    "stock_value_em",
    "stock_fhps_detail_em",
    "stock_zh_valuation_comparison_em",
    "stock_zh_dupont_comparison_em",
    "stock_sy_em",
    "stock_gpzy_pledge_ratio_em",
}


def parse_as_of(raw: str | None) -> date:
    if not raw:
        return date.today()
    try:
        parsed = datetime.strptime(raw, "%Y-%m-%d").date()
    except ValueError as error:
        raise ValueError("--as-of 必须使用 YYYY-MM-DD。") from error
    if parsed > date.today():
        raise ValueError("--as-of 不能晚于今天。")
    return parsed


def completed_annual_years(as_of: date, count: int = 5) -> list[int]:
    latest = as_of.year - (1 if (as_of.month, as_of.day) >= (5, 1) else 2)
    return list(range(latest - count + 1, latest + 1))


def normalize_code(value: Any) -> str | None:
    if value is None:
        return None
    if isinstance(value, int):
        text = f"{value:06d}"
    elif isinstance(value, float) and value.is_integer():
        text = f"{int(value):06d}"
    else:
        text = str(value).strip()
    match = CODE_PATTERN.search(text)
    return match.group(1) if match else None


def exchange_symbol(code: str) -> str:
    if code.startswith(("60", "68")):
        return f"SH{code}"
    if code.startswith(("8", "4")):
        return f"BJ{code}"
    return f"SZ{code}"


def number(value: Any) -> float | None:
    if value is None or isinstance(value, bool):
        return None
    if isinstance(value, (int, float)):
        result = float(value)
        return result if math.isfinite(result) else None
    text = str(value).strip().replace(",", "").replace("%", "")
    if text in {"", "-", "--", "None", "null", "nan", "NaN"}:
        return None
    try:
        result = float(text)
    except ValueError:
        return None
    return result if math.isfinite(result) else None


def first_value(row: dict[str, Any] | None, aliases: Iterable[str]) -> Any:
    if not row:
        return None
    for alias in aliases:
        if alias in row:
            return row[alias]
    return None


def first_number(row: dict[str, Any] | None, aliases: Iterable[str]) -> float | None:
    return number(first_value(row, aliases))


def row_date(row: dict[str, Any]) -> date | None:
    value = first_value(
        row,
        (
            "日期",
            "数据日期",
            "报告期",
            "报告日期",
            "REPORT_DATE",
            "REPORTDATE",
            "公告日期",
        ),
    )
    if value is None:
        return None
    text = str(value).strip()[:10].replace("/", "-")
    for fmt in ("%Y-%m-%d", "%Y%m%d", "%Y-%m"):
        try:
            parsed = datetime.strptime(text, fmt).date()
            return parsed
        except ValueError:
            continue
    return None


def safe_median(values: Iterable[float | None]) -> float | None:
    valid = [value for value in values if value is not None and math.isfinite(value)]
    return median(valid) if valid else None


def quantile(values: Iterable[float | None], fraction: float) -> float | None:
    valid = sorted(value for value in values if value is not None and value > 0 and math.isfinite(value))
    if not valid:
        return None
    if len(valid) == 1:
        return valid[0]
    position = (len(valid) - 1) * fraction
    lower = math.floor(position)
    upper = math.ceil(position)
    if lower == upper:
        return valid[lower]
    return valid[lower] + (valid[upper] - valid[lower]) * (position - lower)


def percentile_rank(value: float | None, values: Iterable[float | None]) -> float | None:
    if value is None or value <= 0:
        return None
    valid = sorted(item for item in values if item is not None and item > 0 and math.isfinite(item))
    if not valid:
        return None
    return sum(item <= value for item in valid) / len(valid)


def rounded(value: float | None, digits: int = 2) -> float | None:
    return round(value, digits) if value is not None and math.isfinite(value) else None


class AktoolsClient:
    def __init__(self, timeout: float = 12.0, retries: int = 2):
        self.timeout = timeout
        self.retries = retries

    def get(self, interface: str, params: dict[str, str] | None = None) -> tuple[list[dict[str, Any]], dict[str, Any]]:
        if interface not in ALLOWED_INTERFACES:
            raise ValueError(f"接口不在白名单中：{interface}")
        parameters = params or {}
        query = urlencode(parameters)
        url = f"{BASE_URL}/api/public/{interface}{'?' + query if query else ''}"
        last_error = ""
        attempts = 0
        for attempt in range(self.retries + 1):
            attempts = attempt + 1
            request = Request(url, headers={"Accept": "application/json"})
            try:
                with urlopen(request, timeout=self.timeout) as response:
                    payload = json.loads(response.read().decode("utf-8", "replace"))
                if not isinstance(payload, list):
                    raise ValueError("AKTools 返回值不是数组")
                rows = [row for row in payload if isinstance(row, dict)]
                return rows, {
                    "interface": interface,
                    "parameters": parameters,
                    "ok": True,
                    "empty": len(rows) == 0,
                    "row_count": len(rows),
                    "attempts": attempts,
                    "error": None,
                }
            except HTTPError as error:
                last_error = f"HTTP {error.code}: {error.read().decode('utf-8', 'replace')[:300]}"
                retryable = error.code == 429 or 500 <= error.code < 600
                if not retryable or attempt >= self.retries:
                    break
            except (URLError, TimeoutError, json.JSONDecodeError, ValueError) as error:
                last_error = str(error)
                if attempt >= self.retries:
                    break
            time.sleep(0.2 * (2**attempt))
        return [], {
            "interface": interface,
            "parameters": parameters,
            "ok": False,
            "empty": False,
            "row_count": None,
            "attempts": attempts,
            "error": last_error[:500],
        }


def run_calls(
    client: AktoolsClient,
    calls: list[tuple[str, str, dict[str, str]]],
    max_workers: int = 6,
    deadline_seconds: float = 75,
) -> tuple[dict[str, list[dict[str, Any]]], list[dict[str, Any]]]:
    data: dict[str, list[dict[str, Any]]] = {}
    status_by_key: dict[str, dict[str, Any]] = {}
    executor = ThreadPoolExecutor(max_workers=min(max_workers, 6))
    futures = {
        executor.submit(client.get, interface, params): key
        for key, interface, params in calls
    }
    pending = set(futures)
    deadline = time.monotonic() + deadline_seconds
    while pending:
        remaining = max(0.0, deadline - time.monotonic())
        if remaining == 0:
            break
        completed, pending = wait(pending, timeout=remaining, return_when=FIRST_COMPLETED)
        if not completed:
            break
        for future in completed:
            key = futures[future]
            rows, status = future.result()
            data[key] = rows
            status_by_key[key] = {"key": key, **status}
    for future in pending:
        future.cancel()
    executor.shutdown(wait=True, cancel_futures=True)
    call_by_key = {key: (interface, params) for key, interface, params in calls}
    for future in pending:
        key = futures[future]
        interface, params = call_by_key[key]
        data[key] = []
        status_by_key[key] = {
            "key": key,
            "interface": interface,
            "parameters": params,
            "ok": False,
            "empty": False,
            "row_count": None,
            "attempts": 0,
            "error": "research deadline exceeded before the result was accepted",
        }
    statuses = [status_by_key[key] for key, _, _ in calls]
    return data, statuses


def print_json(payload: dict[str, Any]) -> None:
    print(json.dumps(payload, ensure_ascii=False, indent=2, default=str))
