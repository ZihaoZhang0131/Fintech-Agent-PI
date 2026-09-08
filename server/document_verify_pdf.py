"""Render all converted PDF pages and check chart titles survived font loading."""
import json
from pathlib import Path
import re
import sys
import pypdfium2 as pdfium

pdf_path, render_path, request_path = sys.argv[1:4]
directory = Path(render_path)
directory.mkdir(parents=True, exist_ok=True)
charts = json.loads(Path(request_path).read_text(encoding="utf8")).get("charts", [])
text = []
with pdfium.PdfDocument(pdf_path) as pdf:
    count = len(pdf)
    if count < 1:
        raise ValueError("生成的 PDF 没有有效页面。")
    for index in range(count):
        page = pdf[index]
        try:
            text_page = page.get_textpage()
            try:
                text.append(text_page.get_text_range())
            finally:
                text_page.close()
            bitmap = page.render(scale=1.5)
            try:
                bitmap.to_pil().save(directory / f"page-{index + 1}.png")
            finally:
                bitmap.close()
        finally:
            page.close()
joined = re.sub(r"\s", "", "".join(text))
for chart in charts:
    title = chart.get("title") or chart["id"]
    if re.sub(r"\s", "", title) not in joined:
        raise ValueError(f"PDF 缺少图表标题 {title}，请检查转换组件的中文字体。")
print("DOCUMENT_RESULT " + json.dumps({"pageCount": count, "renderedPages": count}))
