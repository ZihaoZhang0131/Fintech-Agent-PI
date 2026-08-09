#!/usr/bin/env python3
"""Check whether the local AKTools HTTP service is reachable."""

from __future__ import annotations

import json
import os
import sys
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


BASE_URL = os.environ.get("AKTOOLS_BASE_URL", "http://127.0.0.1:8080").rstrip("/")


def main() -> int:
    request = Request(f"{BASE_URL}/version", headers={"Accept": "application/json"})
    try:
        with urlopen(request, timeout=10) as response:
            version = json.loads(response.read().decode("utf-8", "replace"))
    except (HTTPError, URLError, TimeoutError, ValueError) as error:
        print(json.dumps({"available": False, "base_url": BASE_URL, "error": str(error), "start": ["pip install aktools", "python -m aktools"]}, ensure_ascii=False), file=sys.stderr)
        return 1
    print(json.dumps({"available": True, "base_url": BASE_URL, "version": version}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
