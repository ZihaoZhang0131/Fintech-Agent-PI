import { createProvider, envApiKeyAuth, type Model } from "@earendil-works/pi-ai";
import { openAICompletionsApi } from "@earendil-works/pi-ai/api/openai-completions.lazy";
import { builtinModels } from "@earendil-works/pi-ai/providers/all";

const QWEN_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1";

const QWEN_MODELS: Model<"openai-completions">[] = [
  ["qwen3.6-flash", "Qwen 3.6 Flash"],
  ["qwen3.6-plus", "Qwen 3.6 Plus"],
  ["qwen3.7-max", "Qwen 3.7 Max"],
].map(([id, name]) => ({
  id,
  name,
  api: "openai-completions",
  provider: "qwen",
  baseUrl: QWEN_BASE_URL,
  reasoning: true,
  input: ["text"],
  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
  contextWindow: 1_000_000,
  maxTokens: 65_536,
  compat: { thinkingFormat: "qwen", supportsDeveloperRole: false, supportsStore: false },
}));

export function createConfiguredModels() {
  const models = builtinModels();
  models.setProvider(
    createProvider({
      id: "qwen",
      name: "通义千问",
      baseUrl: QWEN_BASE_URL,
      auth: { apiKey: envApiKeyAuth("DashScope API key", ["DASHSCOPE_API_KEY"]) },
      models: QWEN_MODELS,
      api: openAICompletionsApi(),
    }),
  );
  return models;
}
