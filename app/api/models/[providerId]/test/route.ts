import { Agent } from "@earendil-works/pi-agent-core";
import { createConfiguredModels } from "@/server/model-registry";
import { resolveRuntimeModel, setModelVerification } from "@/server/model-runtime";

type RouteContext = { params: Promise<{ providerId: string }> };

function safeTestError(error: unknown) {
  const message = error instanceof Error ? error.message : "unknown error";
  if (/401|unauthorized|api.?key|authentication/i.test(message)) return "鉴权失败，请检查 API Key。";
  if (/402|balance|insufficient/i.test(message)) return "账户余额不足或无权使用该模型。";
  if (/429|rate.?limit/i.test(message)) return "请求过于频繁，请稍后重试。";
  return "连接测试失败，请检查网络、模型权限或稍后重试。";
}

export async function POST(request: Request, context: RouteContext) {
  const { providerId } = await context.params;
  let modelId = "";
  try {
    const payload = (await request.json()) as { modelId?: unknown };
    modelId = typeof payload.modelId === "string" ? payload.modelId : "";
    const resolved = await resolveRuntimeModel({ providerId, modelId }, { forTest: true });
    const models = createConfiguredModels();
    const model = models.getModel(resolved.piProviderId, resolved.modelId);
    if (!model) throw new Error("PI 中没有找到该模型。");
    const agent = new Agent({
      initialState: { systemPrompt: "你是连接测试助手，只回复 OK。", model, thinkingLevel: "off", tools: [] },
      streamFn: models.streamSimple.bind(models),
      getApiKey: () => resolved.apiKey,
    });
    await agent.prompt("OK");
    const provider = await setModelVerification(providerId, { modelId, status: "verified" });
    return Response.json({ provider });
  } catch (error) {
    const message = safeTestError(error);
    if (modelId) {
      try {
        await setModelVerification(providerId, { modelId, status: "failed", error: message });
      } catch {
        // Keep the original connection failure; no credentials are returned.
      }
    }
    return Response.json({ message }, { status: 400 });
  }
}
