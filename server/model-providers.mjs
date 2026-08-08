import path from "node:path";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";

export const MODEL_PROVIDERS = [
  {
    id: "deepseek",
    label: "DeepSeek",
    piProviderId: "deepseek",
    keyEnv: "DEEPSEEK_API_KEY",
    legacyModelEnv: "DEEPSEEK_MODEL",
    models: [
      { id: "deepseek-v4-flash", label: "DeepSeek V4 Flash" },
      { id: "deepseek-v4-pro", label: "DeepSeek V4 Pro" },
    ],
  },
  {
    id: "openai",
    label: "OpenAI",
    piProviderId: "openai",
    keyEnv: "OPENAI_API_KEY",
    models: [
      { id: "gpt-5.4", label: "GPT-5.4" },
      { id: "gpt-5.4-mini", label: "GPT-5.4 Mini" },
      { id: "gpt-5.4-pro", label: "GPT-5.4 Pro" },
    ],
  },
  {
    id: "anthropic",
    label: "Anthropic",
    piProviderId: "anthropic",
    keyEnv: "ANTHROPIC_API_KEY",
    models: [
      { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6" },
      { id: "claude-opus-4-6", label: "Claude Opus 4.6" },
      { id: "claude-haiku-4-5", label: "Claude Haiku 4.5" },
    ],
  },
  {
    id: "gemini",
    label: "Gemini",
    piProviderId: "google",
    keyEnv: "GEMINI_API_KEY",
    models: [
      { id: "gemini-3.1-pro-preview", label: "Gemini 3.1 Pro" },
      { id: "gemini-3-flash-preview", label: "Gemini 3 Flash" },
      { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
    ],
  },
  {
    id: "qwen",
    label: "通义千问",
    piProviderId: "qwen",
    keyEnv: "DASHSCOPE_API_KEY",
    models: [
      { id: "qwen3.6-flash", label: "Qwen 3.6 Flash" },
      { id: "qwen3.6-plus", label: "Qwen 3.6 Plus" },
      { id: "qwen3.7-max", label: "Qwen 3.7 Max" },
    ],
  },
  {
    id: "kimi",
    label: "Kimi",
    piProviderId: "moonshotai-cn",
    keyEnv: "MOONSHOT_API_KEY",
    models: [
      { id: "kimi-k3", label: "Kimi K3" },
      { id: "kimi-k2.7-code", label: "Kimi K2.7 Code" },
      { id: "kimi-k2.5", label: "Kimi K2.5" },
    ],
  },
  {
    id: "zhipu",
    label: "智谱 AI",
    piProviderId: "zai",
    keyEnv: "ZAI_API_KEY",
    models: [
      { id: "glm-5.2", label: "GLM-5.2" },
      { id: "glm-5.1", label: "GLM-5.1" },
      { id: "glm-4.7", label: "GLM-4.7" },
    ],
  },
];

const PROVIDERS_BY_ID = new Map(MODEL_PROVIDERS.map((provider) => [provider.id, provider]));

export function getModelProvider(id) {
  return PROVIDERS_BY_ID.get(id);
}

export function modelProviderStorePath(dataDirectory) {
  return path.join(dataDirectory, "model-providers.json");
}

export async function readModelProviderStore(dataDirectory) {
  try {
    const parsed = JSON.parse(await readFile(modelProviderStorePath(dataDirectory), "utf8"));
    return parsed && parsed.version === 1 && parsed.providers && typeof parsed.providers === "object"
      ? parsed
      : { version: 1, providers: {} };
  } catch (error) {
    if (error?.code === "ENOENT" || error instanceof SyntaxError) return { version: 1, providers: {} };
    throw error;
  }
}

async function saveModelProviderStore(dataDirectory, store) {
  await mkdir(dataDirectory, { recursive: true, mode: 0o700 });
  const target = modelProviderStorePath(dataDirectory);
  const temporary = `${target}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(store, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
  await rename(temporary, target);
}

function uniqueKnownModels(provider, value) {
  if (!Array.isArray(value)) return [];
  const known = new Set(provider.models.map((model) => model.id));
  return [...new Set(value.filter((id) => typeof id === "string" && known.has(id)))];
}

function publicProvider(provider, entry, environment = process.env) {
  const environmentKey = environment[provider.keyEnv]?.trim() ?? "";
  const localKey = entry?.apiKey?.trim() ?? "";
  const configured = Boolean(localKey || environmentKey);
  const source = localKey ? "local" : environmentKey ? "environment" : undefined;
  const legacyModel = provider.legacyModelEnv ? environment[provider.legacyModelEnv]?.trim() : "";
  const enabledModelIds = uniqueKnownModels(provider, entry?.enabledModelIds);
  if (provider.id === "deepseek" && !enabledModelIds.length && environmentKey) {
    const selected = provider.models.some((model) => model.id === legacyModel)
      ? legacyModel
      : provider.models[0].id;
    enabledModelIds.push(selected);
  }
  const verification = entry?.verification;
  const verified = source === "environment" || verification?.status === "verified";
  return {
    id: provider.id,
    label: provider.label,
    models: provider.models,
    enabledModelIds,
    configured,
    verified,
    source,
    verification: verification
      ? {
          modelId: verification.modelId,
          status: verification.status,
          testedAt: verification.testedAt,
          error: verification.status === "failed" ? verification.error : undefined,
        }
      : undefined,
  };
}

export async function listPublicModelProviders(dataDirectory, environment = process.env) {
  const store = await readModelProviderStore(dataDirectory);
  return MODEL_PROVIDERS.map((provider) => publicProvider(provider, store.providers[provider.id], environment));
}

export async function saveModelProvider(dataDirectory, providerId, payload, environment = process.env) {
  const provider = getModelProvider(providerId);
  if (!provider) throw Object.assign(new Error("不支持该模型服务商。"), { status: 400 });
  const enabledModelIds = uniqueKnownModels(provider, payload?.enabledModelIds);
  if (!enabledModelIds.length) {
    throw Object.assign(new Error("请至少启用一个模型。"), { status: 400 });
  }
  const apiKey = typeof payload?.apiKey === "string" ? payload.apiKey.trim() : "";
  const store = await readModelProviderStore(dataDirectory);
  const previous = store.providers[providerId] ?? {};
  if (!apiKey && !previous.apiKey && !environment[provider.keyEnv]?.trim()) {
    throw Object.assign(new Error("请填写 API Key。"), { status: 400 });
  }
  store.providers[providerId] = {
    apiKey: apiKey || previous.apiKey,
    enabledModelIds,
    verification: { status: "untested" },
  };
  await saveModelProviderStore(dataDirectory, store);
  return publicProvider(provider, store.providers[providerId], environment);
}

export async function deleteModelProvider(dataDirectory, providerId, environment = process.env) {
  if (!getModelProvider(providerId)) throw Object.assign(new Error("不支持该模型服务商。"), { status: 400 });
  const store = await readModelProviderStore(dataDirectory);
  delete store.providers[providerId];
  await saveModelProviderStore(dataDirectory, store);
  return (await listPublicModelProviders(dataDirectory, environment)).find((provider) => provider.id === providerId);
}

export async function resolveConfiguredModel(
  dataDirectory,
  providerId,
  modelId,
  environment = process.env,
  { allowUnverified = false } = {},
) {
  const provider = getModelProvider(providerId);
  if (!provider || !provider.models.some((model) => model.id === modelId)) {
    throw Object.assign(new Error("模型不存在或不受支持。"), { status: 400 });
  }
  const store = await readModelProviderStore(dataDirectory);
  const entry = store.providers[providerId];
  const state = publicProvider(provider, entry, environment);
  if (!state.configured || (!allowUnverified && !state.verified) || !state.enabledModelIds.includes(modelId)) {
    throw Object.assign(new Error("模型尚未完成配置和验证。"), { status: 409 });
  }
  const apiKey = entry?.apiKey?.trim() || environment[provider.keyEnv]?.trim();
  if (!apiKey) throw Object.assign(new Error("模型 API Key 不可用。"), { status: 409 });
  return { providerId, modelId, piProviderId: provider.piProviderId, apiKey };
}

export async function updateModelVerification(dataDirectory, providerId, payload, environment = process.env) {
  const provider = getModelProvider(providerId);
  if (!provider) throw Object.assign(new Error("不支持该模型服务商。"), { status: 400 });
  const modelId = typeof payload?.modelId === "string" ? payload.modelId : "";
  const status = payload?.status;
  if (
    !provider.models.some((model) => model.id === modelId) ||
    (status !== "verified" && status !== "failed")
  ) {
    throw Object.assign(new Error("模型验证结果无效。"), { status: 400 });
  }
  const store = await readModelProviderStore(dataDirectory);
  const entry = store.providers[providerId];
  if (!entry?.apiKey && !environment[provider.keyEnv]?.trim()) {
    throw Object.assign(new Error("模型尚未配置。"), { status: 409 });
  }
  store.providers[providerId] = {
    ...entry,
    verification: {
      modelId,
      status,
      testedAt: Date.now(),
      ...(status === "failed" && typeof payload?.error === "string"
        ? { error: payload.error.slice(0, 300) }
        : {}),
    },
  };
  await saveModelProviderStore(dataDirectory, store);
  return publicProvider(provider, store.providers[providerId], environment);
}
