"""Real package verification, including caches and embedded editable workbooks."""
import json
from io import BytesIO
from pathlib import PurePosixPath
import posixpath
import sys
from zipfile import ZipFile
from lxml import etree

NS = {"c": "http://schemas.openxmlformats.org/drawingml/2006/chart", "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships", "p": "http://schemas.openxmlformats.org/package/2006/relationships", "s": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
specs = json.load(open(sys.argv[2], encoding="utf8"))["charts"]
with ZipFile(sys.argv[1]) as doc:
    document = etree.fromstring(doc.read("word/document.xml"))
    refs = document.xpath("//c:chart/@r:id", namespaces=NS)
    assert len(refs) == len(specs), (len(refs), len(specs))
    rels = etree.fromstring(doc.read("word/_rels/document.xml.rels"))
    def target(rels, rid):
        return rels.xpath("p:Relationship[@Id=$id]/@Target", namespaces=NS, id=rid)[0]
    for rid, spec in zip(refs, specs):
        chart_path = posixpath.normpath(posixpath.join("word", target(rels, rid)))
        chart = etree.fromstring(doc.read(chart_path))
        expected_type = {"bar": "barChart", "stacked_bar": "barChart", "line": "lineChart", "scatter": "scatterChart", "pie": "pieChart", "doughnut": "doughnutChart"}[spec["type"]]
        assert chart.xpath(f"count(//c:{expected_type})", namespaces=NS) == 1
        if spec["type"] == "stacked_bar":
            assert chart.xpath("//c:grouping/@val", namespaces=NS) == ["stacked"]
        external = chart.xpath("//c:externalData/@r:id", namespaces=NS)[0]
        chart_rels_path = str(PurePosixPath(chart_path).parent / "_rels" / (PurePosixPath(chart_path).name + ".rels"))
        chart_rels = etree.fromstring(doc.read(chart_rels_path))
        workbook_path = posixpath.normpath(posixpath.join(str(PurePosixPath(chart_path).parent), target(chart_rels, external)))
        with ZipFile(BytesIO(doc.read(workbook_path))) as workbook:
            sheet = etree.fromstring(workbook.read("xl/worksheets/sheet1.xml"))
            strings = etree.fromstring(workbook.read("xl/sharedStrings.xml"))
            string_values = ["".join(si.itertext()) for si in strings]
            cells = {}
            for cell in sheet.xpath("//s:c", namespaces=NS):
                value = cell.find("s:v", NS).text
                cells[cell.get("r")] = string_values[int(value)] if cell.get("t") == "s" else float(value)
            series_xml = chart.xpath("//c:ser", namespaces=NS)
            assert len(series_xml) == len(spec["series"])
            for index, (series, xml) in enumerate(zip(spec["series"], series_xml)):
                if spec["type"] == "scatter":
                    x = [p["x"] for p in series["points"]]
                    y = [p["y"] for p in series["points"]]
                    assert list(map(float, xml.xpath("c:xVal/c:numRef/c:numCache/c:pt/c:v/text()", namespaces=NS))) == x
                    assert list(map(float, xml.xpath("c:yVal/c:numRef/c:numCache/c:pt/c:v/text()", namespaces=NS))) == y
                    assert [cells[f"{chr(65 + index*2)}{row+2}"] for row in range(len(x))] == x
                    assert [cells[f"{chr(66 + index*2)}{row+2}"] for row in range(len(y))] == y
                else:
                    assert xml.xpath("c:cat/c:strRef/c:strCache/c:pt/c:v/text()", namespaces=NS) == spec["labels"]
                    assert list(map(float, xml.xpath("c:val/c:numRef/c:numCache/c:pt/c:v/text()", namespaces=NS))) == series["values"]
                    assert [cells[f"A{row+2}"] for row in range(len(spec["labels"]))] == spec["labels"]
                    assert [cells[f"{chr(66+index)}{row+2}"] for row in range(len(series["values"]))] == series["values"]
    assert b"NativeChart" not in doc.read("word/document.xml")
print(f"Verified {len(specs)} native charts: relationships, types, caches and embedded workbook values match snapshot.")
