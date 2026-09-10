"""Trusted Kami renderer used only by the local runtime wrapper."""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--skill-root", required=True)
    parser.add_argument("--input-html", required=True)
    parser.add_argument("--output-html", required=True)
    parser.add_argument("--output-pdf")
    parser.add_argument("--preview-dir")
    args = parser.parse_args()

    skill_root = Path(args.skill_root).resolve()
    scripts = skill_root / "scripts"
    sys.path.insert(0, str(scripts))

    from highlight import highlight_code_blocks
    from math_render import render_latex_in_html
    from optional_deps import require_pypdf_reader, require_weasyprint_html
    from render import set_pdf_metadata
    from shared import configure_weasyprint_runtime
    from verify import _cjk_font_usage, _pdf_font_names
    from visual import render_pages

    configure_weasyprint_runtime()
    source = Path(args.input_html).read_text(encoding="utf-8")
    rendered = highlight_code_blocks(render_latex_in_html(source))
    output_html = Path(args.output_html)
    output_html.write_text(rendered, encoding="utf-8")

    result: dict[str, object] = {
        "pageCount": 0,
        "renderedPages": 0,
        "previewFiles": [],
        "fonts": [],
        "cjkFontUsage": {},
    }
    if args.output_pdf:
        HTML = require_weasyprint_html()
        PdfReader = require_pypdf_reader()
        output_pdf = Path(args.output_pdf)
        HTML(string=rendered, base_url=str(output_html.parent)).write_pdf(str(output_pdf))
        set_pdf_metadata(output_pdf, author="Kami")
        page_count = len(PdfReader(str(output_pdf)).pages)
        preview_dir = Path(args.preview_dir)
        previews = render_pages(output_pdf, out_dir=preview_dir)
        result.update({
            "pageCount": page_count,
            "renderedPages": len(previews),
            "previewFiles": [item.name for item in previews],
            "fonts": sorted(_pdf_font_names(output_pdf)),
            "cjkFontUsage": _cjk_font_usage(output_pdf),
        })

    print("KAMI_RESULT " + json.dumps(result, ensure_ascii=False, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

