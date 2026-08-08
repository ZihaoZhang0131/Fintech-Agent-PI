import { flattenAvailableModels, getModelProviders } from "@/server/model-runtime";

export async function GET() {
  try {
    const { providers } = await getModelProviders();
    return Response.json({ providers, models: flattenAvailableModels(providers) });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "无法读取本机模型配置。" },
      { status: 503 },
    );
  }
}
