// Shared Runtime validation. Models never supply executable chart code.
export function validateDocumentCharts(charts, markdown) {
  const fail = (message) => { throw Object.assign(new Error(message), { status: 400 }); };
  if (!Array.isArray(charts) || charts.length > 12) fail("charts 必须是数组，最多支持 12 个图表。");
  const ids = new Set();
  const text = (value, max) => typeof value === "string" && value.trim().length > 0 && value.length <= max;
  const number = (value) => typeof value === "number" && Number.isFinite(value) && Math.abs(value) <= 1e12;
  for (const chart of charts) {
    if (!chart || typeof chart.id !== "string" || !/^[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(chart.id)) fail("图表 ID 无效。");
    if (ids.has(chart.id)) fail("图表 ID 不能重复。");
    ids.add(chart.id);
    if (!["bar", "line", "stacked_bar", "scatter", "pie", "doughnut"].includes(chart.type)) fail("图表类型无效。");
    for (const key of ["title", "xTitle", "yTitle", "xUnit", "yUnit", "source", "dataDate", "caption"]) {
      const max = key === "source" || key === "caption" ? 1000 : 200;
      if (chart[key] !== undefined && (typeof chart[key] !== "string" || chart[key].length > max)) fail(`图表 ${key} 无效。`);
    }
    if (chart.truncated === true) fail("不能用截断查询结果绘制完整图表，请先明确聚合或缩小范围。");
    if (!Array.isArray(chart.series) || !chart.series.length || chart.series.length > 8) fail("图表序列数量必须为 1 至 8。");
    if (chart.type !== "scatter" && (!Array.isArray(chart.labels) || !chart.labels.length || chart.labels.length > 48 || chart.labels.some(v => !text(v, 80)))) fail("图表标签必须为 1 至 48 个、每个 1 至 80 字符。");
    for (const series of chart.series) {
      if (!series || !text(series.name, 80)) fail("图表序列名称无效。");
      if (chart.type === "scatter") {
        if (!Array.isArray(series.points) || !series.points.length || series.points.length > 500 || series.points.some(p => !p || !number(p.x) || !number(p.y))) fail("散点图需要 1 至 500 个有限数值 x/y 点对。");
        if (series.values !== undefined || chart.labels !== undefined) fail("散点图只能使用 points，不接受 labels/values。");
      } else {
        if (!Array.isArray(series.values) || series.values.length !== chart.labels.length || series.values.some(v => !number(v))) fail("图表序列必须与标签数量一致，数值必须为有限数字且绝对值不超过 1e12。");
        if (series.points !== undefined) fail("分类图只能使用 labels/values。");
      }
    }
    if (["pie", "doughnut"].includes(chart.type) && (chart.series.length !== 1 || chart.series[0].values.some(v => v < 0) || chart.series[0].values.reduce((a, b) => a + b, 0) <= 0)) fail("占比图仅接受单序列、非负且总和大于零的数据。");
    const marker = `{{chart:${chart.id}}}`;
    if (markdown.split(marker).length !== 2) fail(`图表 ${chart.id} 必须在 Markdown 中恰好使用一次 ${marker} 占位符。`);
  }
  const remaining = markdown.replace(/\{\{chart:([A-Za-z][A-Za-z0-9_-]{0,63})\}\}/g, (marker, id) => ids.has(id) ? "" : marker);
  if (remaining.includes("{{chart:")) fail("Markdown 包含未定义的图表占位符。");
  // Retain only the documented data contract in the portable snapshot.
  return charts.map(chart => Object.fromEntries(Object.entries(chart).filter(([key]) =>
    ["id", "type", "title", "labels", "series", "xTitle", "yTitle", "xUnit", "yUnit", "source", "dataDate", "caption"].includes(key))));
}

export const DOCUMENT_CHART_GUIDANCE = "报告中的趋势、对比、关系或构成需要可视化且已有充分数据时，主动使用 generate_document 的 charts 参数配图，并在正文合适位置独立一行写 {{chart:图表ID}}。支持 line 折线、bar 分组柱状、stacked_bar 堆积柱状、scatter 散点、pie 饼图、doughnut 环形图。分类图用 labels 与 series.values；散点图用 series.points 的数值 x/y 点对。填写标题、轴标题/单位、source、dataDate 与 caption，正文和图表使用同一数据及口径。只读取已有结构化数据，不从图片猜数字；缺少数据时说明缺口，不编造、不把缺失值补零、不把截断结果当完整数据；超过 48 个分类标签须明确聚合或缩小范围。Word 图表内嵌可编辑工作簿，含图 PDF 由 DOCX 转换；保存后返回的 chartsPath 是可供下游 Agent 复核与重绘的数据配置文件。报告和 chartsPath 都应列入最终产物或 complete_node.artifacts。用户后续在 Word 修改图表不会自动更新 PDF、正文或旁附 JSON。文档只用 generate_document；依赖与转换组件由 Local Runtime 管理，禁止用 Bash/npm/Python 安装或绕过工具失败。";
