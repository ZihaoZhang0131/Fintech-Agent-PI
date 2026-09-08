import type { AgentTool } from "@earendil-works/pi-agent-core";
import { Type, type Static } from "typebox";

export type DocumentToolDetails = {
  kind: "document";
  path: string;
  chartsPath?: string;
  format: "docx" | "pdf";
  size: number;
  pageCount: number;
  renderedPages: number;
  verification?: "structural" | "rendered";
};

const chartNumber = Type.Number({ minimum: -1e12, maximum: 1e12 });
const chartMetadata = {
  id: Type.String({ pattern: "^[A-Za-z][A-Za-z0-9_-]{0,63}$" }),
  title: Type.Optional(Type.String({ maxLength: 200 })),
  xTitle: Type.Optional(Type.String({ maxLength: 200 })),
  yTitle: Type.Optional(Type.String({ maxLength: 200 })),
  xUnit: Type.Optional(Type.String({ maxLength: 200 })),
  yUnit: Type.Optional(Type.String({ maxLength: 200 })),
  source: Type.Optional(Type.String({ maxLength: 1000, description: "绘图数据来源及指标口径；不要编造。" })),
  dataDate: Type.Optional(Type.String({ maxLength: 200 })),
  caption: Type.Optional(Type.String({ maxLength: 1000 })),
  truncated: Type.Optional(Type.Boolean({ description: "查询数据是否截断；true 时拒绝绘图，须先聚合或缩小范围。" })),
};
const chartParameters = Type.Union([
  Type.Object({
    ...chartMetadata,
    type: Type.Union(["bar", "line", "stacked_bar", "pie", "doughnut"].map(value => Type.Literal(value))),
    labels: Type.Array(Type.String({ minLength: 1, maxLength: 80 }), { minItems: 1, maxItems: 48 }),
    series: Type.Array(Type.Object({
      name: Type.String({ minLength: 1, maxLength: 80 }),
      values: Type.Array(chartNumber, { minItems: 1, maxItems: 48 }),
    }), { minItems: 1, maxItems: 8 }),
  }),
  Type.Object({
    ...chartMetadata,
    type: Type.Literal("scatter"),
    series: Type.Array(Type.Object({
      name: Type.String({ minLength: 1, maxLength: 80 }),
      points: Type.Array(Type.Object({ x: chartNumber, y: chartNumber }), { minItems: 1, maxItems: 500 }),
    }), { minItems: 1, maxItems: 8 }),
  }),
]);

const documentParameters = Type.Object({
  format: Type.Union([Type.Literal("docx"), Type.Literal("pdf")], {
    description: "要生成的唯一格式：可编辑 Word（docx）或 PDF。",
  }),
  filename: Type.String({
    description: "最终文件名；仅填写文件名，不要包含目录或扩展名。",
    minLength: 1,
    maxLength: 120,
  }),
  markdown: Type.String({
    description: "完整 Markdown 文档内容。内容结构和写法由用户要求或已加载的 Skill 决定。",
    minLength: 1,
    maxLength: 500_000,
  }),
  referenceDocxPath: Type.Optional(
    Type.String({
      description: "可选：当前项目内的 .docx 样式模板路径。仅继承样式、页面设置和页眉页脚，不执行宏或模板表达式。",
      minLength: 1,
      maxLength: 1_000,
    }),
  ),
  charts: Type.Optional(
    Type.Array(chartParameters, {
      description: "Word 原生可编辑图表；每个 {{chart:图表ID}} 占位符在正文独立一行使用一次。含图 PDF 由 Word 转换，同时保存 .charts.json 供 Agent 读取。",
      maxItems: 12,
    }),
  ),
});

type DocumentRequest = Static<typeof documentParameters>;

type CreateDocumentToolOptions = {
  fetchImpl?: typeof fetch;
};

async function runtimeRequest<T>(workspaceId: string, payload: DocumentRequest, signal?: AbortSignal, fetchImpl: typeof fetch = fetch) {
  const runtimeUrl = process.env.LOCAL_RUNTIME_URL;
  const runtimeToken = process.env.LOCAL_RUNTIME_TOKEN;
  if (!runtimeUrl || !runtimeToken) {
    throw new Error("本机项目 Runtime 未启动，请使用 npm run dev 启动应用。");
  }
  const response = await fetchImpl(
    `${runtimeUrl}/workspaces/${encodeURIComponent(workspaceId)}/documents/generate`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${runtimeToken}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
      cache: "no-store",
    },
  );
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? `文档生成失败（${response.status}）。`);
  }
  return (await response.json()) as T;
}

export function createDocumentTool(
  workspaceId: string,
  { fetchImpl = fetch }: CreateDocumentToolOptions = {},
): AgentTool<typeof documentParameters, DocumentToolDetails> {
  return {
    name: "generate_document",
    label: "生成 Word / PDF",
    description:
      "将本轮已完成的 Markdown 内容生成到当前项目 outputs/ 目录。内容写法由用户或已加载 Skill 决定；本工具只负责安全生成 DOCX 或 PDF。",
    parameters: documentParameters,
    executionMode: "sequential",
    execute: async (_toolCallId, request, signal) => {
      const result = await runtimeRequest<{
        path: string;
        chartsPath?: string;
        format: "docx" | "pdf";
        size: number;
        pageCount: number;
        renderedPages: number;
        verification?: "structural" | "rendered";
      }>(workspaceId, request, signal, fetchImpl);
      const resultDescription = result.verification === "structural"
        ? `结构校验通过，${result.size} bytes`
        : `${result.pageCount} 页，${result.size} bytes`;
      return {
        content: [
          {
            type: "text",
            text: `已生成 ${result.format.toUpperCase()} 文档：${result.path}（${resultDescription}）。最终回答应明确告诉用户该文件路径。${result.chartsPath ? ` 绘图数据与配置：${result.chartsPath}。同时返回此路径供下游复核，不必读取图片。` : ""}`,
          },
        ],
        details: { kind: "document", ...result },
      };
    },
  };
}
