#!/usr/bin/env python3
"""Verify the identity and availability of the configured AKTools service."""

from __future__ import annotations

import json
import os
import sys
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


BASE_URL = os.environ.get("AKTOOLS_BASE_URL", "http://127.0.0.1:8080").rstrip("/")


def failure(kind: str, error: str, suggestion: str) -> int:
    print(json.dumps({"available": False, "base_url": BASE_URL, "error": error,
                      "error_kind": kind, "suggestion": suggestion}, ensure_ascii=False), file=sys.stderr)
    return 1


def main() -> int:
    request = Request(f"{BASE_URL}/version", headers={"Accept": "application/json"})
    try:
        with urlopen(request, timeout=10) as response:
            raw = response.read().decode("utf-8", "replace")
    except HTTPError as error:
        return failure("http_error", f"HTTP {error.code}: {error.reason}",
                       "核验当前地址的服务身份及应用启动日志；HTTP 错误不能证明 AKTools 未安装或接口未注册。")
    except (URLError, TimeoutError) as error:
        timed_out = isinstance(error, TimeoutError) or isinstance(getattr(error, "reason", None), TimeoutError)
        return failure("timeout" if timed_out else "connection_error", str(error),
                       "核对应用启动日志中的 AKTools 实际地址与 AKTOOLS_BASE_URL，并检查服务是否仍在运行；超时不能证明依赖缺失。")
    try:
        version = json.loads(raw)
    except ValueError as error:
        return failure("invalid_json", str(error), "版本端点未返回有效 JSON，请核对地址及服务身份。")
    if not isinstance(version, dict) or not all(
        isinstance(version.get(key), str) and version[key].strip()
        for key in ("ak_current_version", "at_current_version")
    ):
        return failure("identity_mismatch", "版本响应缺少 AKShare/AKTools 版本字段，无法确认服务身份。",
                       "该地址可能属于其他应用；查看应用启动日志中的实际 AKTools 地址。")
    print(json.dumps({"available": True, "base_url": BASE_URL, "version": version}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
