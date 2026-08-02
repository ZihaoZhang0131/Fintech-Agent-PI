import { getAvailableModelOptions } from "@/lib/model-options";

export async function GET() {
  const model = process.env.DEEPSEEK_MODEL ?? "deepseek-v4-flash";
  return Response.json({
    status: "ok",
    provider: "DeepSeek",
    model,
    models: getAvailableModelOptions(model),
    keyConfigured: Boolean(process.env.DEEPSEEK_API_KEY),
    webSearch: {
      provider: "Tavily",
      mode: process.env.TAVILY_API_KEY ? "api-key" : "keyless",
    },
  });
}
