export async function GET() {
  return Response.json({
    status: "ok",
    provider: "DeepSeek",
    model: process.env.DEEPSEEK_MODEL ?? "deepseek-v4-flash",
    keyConfigured: Boolean(process.env.DEEPSEEK_API_KEY),
    webSearch: {
      provider: "Tavily",
      mode: process.env.TAVILY_API_KEY ? "api-key" : "keyless",
    },
  });
}
