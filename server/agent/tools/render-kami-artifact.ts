import type { AgentTool } from "@earendil-works/pi-agent-core";
import { Type, type Static } from "typebox";

const template = Type.Union(["one-pager", "long-doc", "letter", "portfolio", "resume", "slides", "equity-report", "changelog", "landing-page"].map((value) => Type.Literal(value)));
const language = Type.Union(["zh-CN", "en", "ja", "ko"].map((value) => Type.Literal(value)));
const contentIr = Type.Object({
  type: Type.String({ minLength: 1, maxLength: 40 }),
  lang: Type.String({ minLength: 2, maxLength: 20 }),
  brief: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
  content: Type.Record(Type.String(), Type.Unknown()),
}, { additionalProperties: false });
const parameters = Type.Object({
  template: Type.Intersect([template], { description: "Kami 文档模板。slides 产出 HTML/PDF，不产出 PPTX。" }),
  language,
  filename: Type.String({ description: "不含路径和扩展名的基础文件名。", minLength: 1, maxLength: 120 }),
  formats: Type.Union([
    Type.Tuple([Type.Literal("html")]),
    Type.Tuple([Type.Literal("html"), Type.Literal("pdf")]),
  ]),
  html: Type.String({ description: "已按所选 Kami 模板完整填充的 HTML，不能留占位符。", minLength: 1, maxLength: 1_500_000 }),
  contentIr,
  assets: Type.Optional(Type.Array(Type.Object({
    id: Type.String({ pattern: "^[A-Za-z][A-Za-z0-9_-]{0,63}$" }),
    projectPath: Type.String({ description: "当前项目内的图片相对路径。", minLength: 1, maxLength: 1_000 }),
  }), { maxItems: 24 })),
  overwrite: Type.Optional(Type.Boolean({ description: "默认 false；只在明确覆盖同名产物时设为 true。" })),
});

type KamiRequest = Static<typeof parameters>;
export type KamiArtifactDetails = {
  kind: "kami_artifact";
  paths: { content: string; html: string; pdf?: string; manifest: string };
  previewPaths: string[];
  pageCount: number;
  renderedPages: number;
  checks: Array<{ name: string; status: string; detail: string }>;
  fontFallback: { used: boolean; requested: string; resolved: string | null };
  visualReviewPending: true;
};

async function runtimeRequest<T>(workspaceId: string, payload: KamiRequest, signal?: AbortSignal, fetchImpl: typeof fetch = fetch) {
  const runtimeUrl = process.env.LOCAL_RUNTIME_URL;
  const runtimeToken = process.env.LOCAL_RUNTIME_TOKEN;
  if (!runtimeUrl || !runtimeToken) throw new Error("本机项目 Runtime 未启动，请使用 npm run dev 启动应用。");
  const response = await fetchImpl(`${runtimeUrl}/workspaces/${encodeURIComponent(workspaceId)}/artifacts/kami/render`, {
    method: "POST",
    headers: { Authorization: `Bearer ${runtimeToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload), signal, cache: "no-store",
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(body?.message ?? `Kami 产物生成失败（${response.status}）。`);
  }
  return response.json() as Promise<T>;
}

export function createKamiArtifactTool(workspaceId: string, { fetchImpl = fetch }: { fetchImpl?: typeof fetch } = {}): AgentTool<typeof parameters, KamiArtifactDetails> {
  return {
    name: "render_kami_artifact",
    label: "生成 Kami 视觉产物",
    description: "将已定稿的 contentIr 和完整 Kami HTML 安全生成为当前项目的 HTML/PDF。只用于正式产物，不负责研究或改写事实。",
    parameters,
    executionMode: "sequential",
    execute: async (_toolCallId, request, signal) => {
      const result = await runtimeRequest<Omit<KamiArtifactDetails, "kind">>(workspaceId, request, signal, fetchImpl);
      const listed = [result.paths.html, result.paths.pdf, result.paths.content, result.paths.manifest].filter(Boolean).join("、");
      return {
        content: [{ type: "text", text: `Kami 机械检查通过，已生成：${listed}。${result.pageCount ? ` PDF ${result.pageCount} 页，已生成 ${result.previewPaths.length} 张逐页预览。` : ""} 主观视觉验收仍待完成（visualReviewPending=true），不得表述为已人工验收。` }],
        details: { kind: "kami_artifact", ...result },
      };
    },
  };
}
