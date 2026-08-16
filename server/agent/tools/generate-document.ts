import type { AgentTool } from "@earendil-works/pi-agent-core";
import { Type } from "typebox";

export type DocumentToolDetails = {
  kind: "document";
  path: string;
  format: "docx" | "pdf";
  size: number;
  pageCount: number;
  renderedPages: number;
};

const chartParameters = Type.Object({
  id: Type.String({ pattern: "^[A-Za-z][A-Za-z0-9_-]{0,63}$" }),
  type: Type.Union([Type.Literal("bar"), Type.Literal("line")]),
  title: Type.Optional(Type.String({ maxLength: 200 })),
  labels: Type.Array(Type.String({ minLength: 1, maxLength: 80 }), { minItems: 1, maxItems: 48 }),
  series: Type.Array(
    Type.Object({
      name: Type.String({ minLength: 1, maxLength: 80 }),
      values: Type.Array(Type.Number({ minimum: -1_000_000_000_000, maximum: 1_000_000_000_000 }), {
        minItems: 1,
        maxItems: 48,
      }),
    }),
    { minItems: 1, maxItems: 8 },
  ),
});

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
      description: "可选基础图表。使用 {{chart:图表ID}} 占位符插入 Markdown 正文。",
      maxItems: 12,
    }),
  ),
});

type DocumentRequest = {
  format: "docx" | "pdf";
  filename: string;
  markdown: string;
  referenceDocxPath?: string;
  charts?: Array<{
    id: string;
    type: "bar" | "line";
    title?: string;
    labels: string[];
    series: Array<{ name: string; values: number[] }>;
  }>;
};

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
        format: "docx" | "pdf";
        size: number;
        pageCount: number;
        renderedPages: number;
      }>(workspaceId, request, signal, fetchImpl);
      return {
        content: [
          {
            type: "text",
            text: `已生成 ${result.format.toUpperCase()} 文档：${result.path}（${result.pageCount} 页，${result.size} bytes）。最终回答应明确告诉用户该文件路径。`,
          },
        ],
        details: { kind: "document", ...result },
      };
    },
  };
}
