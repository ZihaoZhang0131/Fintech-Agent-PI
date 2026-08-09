#!/usr/bin/env python3
"""Generate compact, layered AKShare Reference files from docs/data."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
from collections import defaultdict
from pathlib import Path


INTERFACE = re.compile(r"^接口:\s*([A-Za-z_][A-Za-z0-9_]*)\s*$")
HEADING = re.compile(r"^(#{2,6})\s+(.+?)\s*$")
EXAMPLE = re.compile(r"\n接口示例\s*\n\s*```.*?```", re.DOTALL)
DATA_SAMPLE = re.compile(r"\n数据示例\b.*", re.DOTALL)
MAX_CARDS_PER_FILE = 30
MAX_CHARS_PER_FILE = 65_000


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def normalize_title(value: str) -> str:
    return re.sub(r"\s+", " ", value.replace("#", "")).strip()


def compact_card(name: str, lines: list[str], headings: dict[int, str]) -> str:
    raw = "\n".join(lines)
    raw = DATA_SAMPLE.sub("", raw)
    raw = EXAMPLE.sub("", raw)
    raw = raw.strip()
    context = " / ".join(headings[level] for level in (3, 4, 5, 6) if headings.get(level))
    body = "\n".join(line for line in raw.splitlines() if not INTERFACE.match(line)).strip()
    return "\n".join([
        f"### {name}",
        f"- **文档定位**：{context or '未分组'}",
        f"- **HTTP**：`GET /api/public/{name}`",
        "- **调用**：运行 `scripts/aktools_get.py " + name + " --param key=value`；参数以本卡的输入参数表为准。",
        "",
        body,
    ]).strip() + "\n"


def parse_source(source: Path) -> list[dict[str, object]]:
    headings: dict[int, str] = {}
    cards: list[dict[str, object]] = []
    active_name: str | None = None
    active_lines: list[str] = []
    active_headings: dict[int, str] = {}

    def flush() -> None:
        nonlocal active_name, active_lines, active_headings
        if active_name:
            cards.append({
                "name": active_name,
                "headings": active_headings,
                "content": compact_card(active_name, active_lines, active_headings),
            })
        active_name = None
        active_lines = []
        active_headings = {}

    for line in source.read_text(encoding="utf-8").splitlines():
        heading = HEADING.match(line)
        if heading:
            flush()
            level = len(heading.group(1))
            headings[level] = normalize_title(heading.group(2))
            for child_level in tuple(headings):
                if child_level > level:
                    headings.pop(child_level)
            continue
        interface = INTERFACE.match(line)
        if interface:
            flush()
            active_name = interface.group(1)
            active_headings = dict(headings)
            active_lines = [line]
        elif active_name:
            active_lines.append(line)
    flush()
    return cards


def group_label(card: dict[str, object]) -> str:
    headings = card["headings"]
    assert isinstance(headings, dict)
    # 一级 Reference 按官方三级标题拆分；四级及以下标题保留在每张接口卡中。
    # 这样既保留自然语言导航，又避免产生数百个单接口文件。
    labels = [str(headings[3])] if 3 in headings else []
    return " / ".join(labels) or "通用接口"


def navigation_label(card: dict[str, object]) -> str:
    headings = card["headings"]
    assert isinstance(headings, dict)
    return " / ".join(str(headings[level]) for level in (3, 4, 5, 6) if headings.get(level)) or str(card["name"])


def markdown_cell(value: str) -> str:
    return value.replace("|", "\\|").replace("\n", " ").strip()


def write_reference(path: Path, title: str, cards: list[dict[str, object]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    content = [f"# {title}", "", "以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。", ""]
    content.extend(str(card["content"]).rstrip() for card in cards)
    path.write_text("\n\n".join(content).rstrip() + "\n", encoding="utf-8")


def write_non_interface_reference(path: Path, source: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    raw = source.read_text(encoding="utf-8").strip()
    path.write_text(
        "\n".join([
            "# " + normalize_title(raw.splitlines()[0].lstrip("# ")),
            "",
            "此资料来自固定的 AKShare 1.18.83 官方数据字典，未包含可直接通过 AKTools 调用的 `接口:` 条目。",
            "",
            raw,
            "",
        ]),
        encoding="utf-8",
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True, help="AKShare 仓库中的 docs/data 目录")
    parser.add_argument("--output", type=Path, required=True, help="Skill 的 references 目录")
    parser.add_argument("--version", required=True)
    parser.add_argument("--commit", required=True)
    args = parser.parse_args()
    if not args.source.is_dir():
        parser.error("--source 必须是 AKShare docs/data 目录。")
    if args.output.exists():
        shutil.rmtree(args.output)
    args.output.mkdir(parents=True)

    source_files = sorted(args.source.rglob("*.md"))
    manifest_sources: list[dict[str, object]] = []
    interface_entries: list[dict[str, str]] = []
    name_counts: dict[str, int] = defaultdict(int)
    by_category: dict[str, list[dict[str, object]]] = defaultdict(list)
    non_interface_sources: dict[str, list[tuple[str, Path]]] = defaultdict(list)

    for source in source_files:
        relative = source.relative_to(args.source).as_posix()
        category = source.parts[-2] if source.parent != args.source else source.stem
        if category == "fund":
            category = "fund"
        cards = parse_source(source)
        manifest_sources.append({"path": relative, "sha256": sha256(source), "interface_count": len(cards)})
        if not cards:
            non_interface_sources[category].append((relative, source))
        for card in cards:
            name = str(card["name"])
            name_counts[name] += 1
            card["source"] = relative
            by_category[category].append(card)

    category_indexes: dict[str, list[dict[str, object]]] = {}
    for category in sorted(set(by_category) | set(non_interface_sources)):
        cards = by_category[category]
        grouped: dict[str, list[dict[str, object]]] = defaultdict(list)
        for card in cards:
            grouped[group_label(card)].append(card)
        index_entries: list[dict[str, object]] = []
        navigation_entries: list[dict[str, str]] = []
        sequence = 1
        reference_groups: list[tuple[str, list[dict[str, object]]]] = []
        small_members: list[dict[str, object]] = []
        for label, members in sorted(grouped.items()):
            if len(members) <= 3:
                small_members.extend(members)
            else:
                reference_groups.append((label, members))
        if small_members:
            reference_groups.append(("其他细分主题", small_members))

        for label, members in reference_groups:
            chunks: list[list[dict[str, object]]] = []
            current: list[dict[str, object]] = []
            current_length = 0
            for card in members:
                card_length = len(str(card["content"]))
                if current and (len(current) >= MAX_CARDS_PER_FILE or current_length + card_length > MAX_CHARS_PER_FILE):
                    chunks.append(current)
                    current, current_length = [], 0
                current.append(card)
                current_length += card_length
            if current:
                chunks.append(current)
            topic_number = sequence
            for chunk_index, chunk in enumerate(chunks, 1):
                filename = f"topic-{topic_number:02d}{f'-{chunk_index}' if len(chunks) > 1 else ''}.md"
                relative_reference = f"references/{category}/{filename}"
                write_reference(args.output / category / filename, label, chunk)
                index_entries.append({"label": label, "path": relative_reference, "interface_count": len(chunk)})
                for card in chunk:
                    interface_entries.append({"name": str(card["name"]), "source": str(card["source"]), "reference": relative_reference})
                    navigation_entries.append({
                        "label": navigation_label(card),
                        "name": str(card["name"]),
                        "path": relative_reference,
                    })
            sequence += 1
        for relative, source in non_interface_sources[category]:
            filename = f"source-{sequence:02d}.md"
            relative_reference = f"references/{category}/{filename}"
            write_non_interface_reference(args.output / category / filename, source)
            index_entries.append({"label": relative, "path": relative_reference, "interface_count": 0})
            sequence += 1
        category_indexes[category] = index_entries
        lines = [f"# {category} 数据导航", "", "先在“精确接口定位”表按用户的中文需求选择一行，再读取该行的接口卡。不得改写函数名；未找到时不要试探 API。", "", "## 精确接口定位", "", "| 中文名称或文档定位 | 精确函数名 | 读取接口卡 |", "|---|---|---|"]
        for entry in sorted(navigation_entries, key=lambda item: (item["label"], item["name"], item["path"])):
            lines.append(f"| {markdown_cell(entry['label'])} | `{entry['name']}` | `{entry['path']}` |")
        lines.extend(["", "## 子主题概览", ""])
        for entry in index_entries:
            lines.append(f"- **{entry['label']}**（{entry['interface_count']} 个接口）：`{entry['path']}`")
        (args.output / category / "index.md").write_text("\n".join(lines) + "\n", encoding="utf-8")

    manifest = {
        "upstream": {
            "project": "akfamily/akshare",
            "version": args.version,
            "commit": args.commit,
            "documentation_root": "docs/data",
        },
        "source_file_count": len(source_files),
        "documented_interface_count": len(interface_entries),
        "unique_interface_count": len(name_counts),
        "duplicate_documented_names": sorted(name for name, count in name_counts.items() if count > 1),
        "sources": manifest_sources,
        "categories": category_indexes,
        "interfaces": sorted(interface_entries, key=lambda item: item["name"]),
    }
    (args.output / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"source_files": len(source_files), "interfaces": len(interface_entries), "categories": len(category_indexes)}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
