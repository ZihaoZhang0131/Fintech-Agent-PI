#!/usr/bin/env python3
"""Rebuild exact-interface navigation tables from an existing Reference snapshot."""

from __future__ import annotations

import argparse
import re
from collections import defaultdict
from pathlib import Path


CARD = re.compile(r"^### ([A-Za-z_][A-Za-z0-9_]*)$", re.MULTILINE)
LOCATION = re.compile(r"^- \*\*文档定位\*\*：(.+)$", re.MULTILINE)
OLD_TABLE = re.compile(r"\n## 精确接口定位\n.*?(?=\n## 子主题概览\n|\Z)", re.DOTALL)


def markdown_cell(value: str) -> str:
    return value.replace("|", "\\|").replace("\n", " ").strip()


def entries_for_file(path: Path, root: Path) -> list[tuple[str, str, str]]:
    content = path.read_text(encoding="utf-8")
    entries: list[tuple[str, str, str]] = []
    matches = list(CARD.finditer(content))
    for index, match in enumerate(matches):
        end = matches[index + 1].start() if index + 1 < len(matches) else len(content)
        card = content[match.start():end]
        location = LOCATION.search(card)
        entries.append((location.group(1).strip() if location else match.group(1), match.group(1), path.relative_to(root.parent).as_posix()))
    return entries


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--references", type=Path, required=True)
    args = parser.parse_args()
    root = args.references
    for category in sorted(path for path in root.iterdir() if path.is_dir()):
        index = category / "index.md"
        if not index.exists():
            continue
        entries = []
        for topic in sorted(category.glob("topic-*.md")):
            entries.extend(entries_for_file(topic, root))
        source = OLD_TABLE.sub("", index.read_text(encoding="utf-8"))
        heading = source.splitlines()[0] if source.splitlines() else f"# {category.name} 数据导航"
        overview = "\n## 子主题概览\n"
        if overview in source:
            prefix, suffix = source.split(overview, 1)
        else:
            first_entry = source.find("\n- **")
            prefix = source[:first_entry] if first_entry >= 0 else source
            suffix = source[first_entry:] if first_entry >= 0 else ""
        prefix = f"{heading}\n\n先在“精确接口定位”表按用户的中文需求选择一行，再读取该行的接口卡。不得改写函数名；未找到时不要试探 API。"
        table = ["## 精确接口定位", "", "| 中文名称或文档定位 | 精确函数名 | 读取接口卡 |", "|---|---|---|"]
        for label, name, reference in sorted(entries):
            table.append(f"| {markdown_cell(label)} | `{name}` | `{reference}` |")
        index.write_text(prefix.rstrip() + "\n\n" + "\n".join(table) + "\n\n" + overview.lstrip("\n") + suffix.lstrip("\n"), encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
