#!/usr/bin/env python3
"""Call one documented AKShare function through the local AKTools HTTP API."""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


BASE_URL = os.environ.get("AKTOOLS_BASE_URL", "http://127.0.0.1:8080").rstrip("/")
NAME_PATTERN = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*$")


def parse_param(value: str) -> tuple[str, str]:
    if "=" not in value:
        raise argparse.ArgumentTypeError("参数必须使用 key=value 格式。")
    key, raw = value.split("=", 1)
    if not NAME_PATTERN.fullmatch(key):
        raise argparse.ArgumentTypeError("参数名只能使用字母、数字和下划线，且不能以数字开头。")
    return key, raw


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("interface", help="Reference 中确认的 AKShare 接口名")
    parser.add_argument("--param", action="append", type=parse_param, default=[], metavar="KEY=VALUE")
    parser.add_argument("--max-rows", type=int, default=100, choices=range(1, 1001), metavar="1..1000")
    args = parser.parse_args()
    if not NAME_PATTERN.fullmatch(args.interface):
        parser.error("接口名只能使用字母、数字和下划线，且不能以数字开头。")

    parameters = dict(args.param)
    query = urlencode(parameters)
    url = f"{BASE_URL}/api/public/{args.interface}{'?' + query if query else ''}"
    request = Request(url, headers={"Accept": "application/json"})
    try:
        with urlopen(request, timeout=30) as response:
            raw = response.read().decode("utf-8", "replace")
    except HTTPError as error:
        print(f"AKTools HTTP {error.code}: {error.read().decode('utf-8', 'replace')}", file=sys.stderr)
        return 1
    except (URLError, TimeoutError) as error:
        print(f"无法访问 AKTools（{BASE_URL}）：{error}。请先运行 scripts/aktools_status.py。", file=sys.stderr)
        return 1

    try:
        payload = json.loads(raw)
    except json.JSONDecodeError:
        print("AKTools 返回的不是有效 JSON：", raw[:1000], file=sys.stderr)
        return 1

    truncated = isinstance(payload, list) and len(payload) > args.max_rows
    rows = payload[:args.max_rows] if isinstance(payload, list) else payload
    print(json.dumps({"interface": args.interface, "parameters": parameters, "row_count": len(payload) if isinstance(payload, list) else None, "truncated": truncated, "data": rows}, ensure_ascii=False, indent=2, default=str))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
