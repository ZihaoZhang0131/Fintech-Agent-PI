export type ModelReference = {
  providerId: string;
  modelId: string;
};

export type AvailableModel = ModelReference & {
  label: string;
  providerLabel: string;
};

export type ModelProviderPublic = {
  id: string;
  label: string;
  models: Array<{ id: string; label: string }>;
  enabledModelIds: string[];
  configured: boolean;
  verified: boolean;
  source?: "local" | "environment";
  verification?: {
    modelId?: string;
    status: "untested" | "verified" | "failed";
    testedAt?: number;
    error?: string;
  };
};

type ResolvedModel = ModelReference & {
  piProviderId: string;
  apiKey: string;
};

function runtimeSettings() {
  const runtimeUrl = process.env.LOCAL_RUNTIME_URL;
  const runtimeToken = process.env.LOCAL_RUNTIME_TOKEN;
  if (!runtimeUrl || !runtimeToken) throw new Error("本机模型 Runtime 未启动，请使用 npm run dev 启动完整应用。");
  return { runtimeUrl, runtimeToken };
}

async function runtimeFetch(path: string, init?: RequestInit) {
  const { runtimeUrl, runtimeToken } = runtimeSettings();
  const response = await fetch(new URL(path, `${runtimeUrl}/`), {
    ...init,
    headers: {
      Authorization: `Bearer ${runtimeToken}`,
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
    cache: "no-store",
  });
  const payload = (await response.json().catch(() => ({}))) as { message?: string };
  if (!response.ok) throw Object.assign(new Error(payload.message ?? "本机模型 Runtime 请求失败。"), { status: response.status });
  return payload;
}

export async function getModelProviders() {
  return (await runtimeFetch("models")) as { providers: ModelProviderPublic[] };
}

export async function saveModelProvider(providerId: string, payload: { apiKey?: string; enabledModelIds: string[] }) {
  return (await runtimeFetch(`models/${encodeURIComponent(providerId)}`, {
    method: "POST",
    body: JSON.stringify(payload),
  })) as ModelProviderPublic;
}

export async function removeModelProvider(providerId: string) {
  return runtimeFetch(`models/${encodeURIComponent(providerId)}`, { method: "DELETE" });
}

export async function resolveRuntimeModel(reference: ModelReference, { forTest = false } = {}) {
  return (await runtimeFetch(
    `models/${encodeURIComponent(reference.providerId)}/resolve?modelId=${encodeURIComponent(reference.modelId)}${forTest ? "&forTest=1" : ""}`,
  )) as ResolvedModel;
}

export async function setModelVerification(
  providerId: string,
  payload: { modelId: string; status: "verified" | "failed"; error?: string },
) {
  return (await runtimeFetch(`models/${encodeURIComponent(providerId)}/verification`, {
    method: "POST",
    body: JSON.stringify(payload),
  })) as ModelProviderPublic;
}

export function flattenAvailableModels(providers: ModelProviderPublic[]): AvailableModel[] {
  return providers.flatMap((provider) =>
    provider.verified
      ? provider.models
          .filter((model) => provider.enabledModelIds.includes(model.id))
          .map((model) => ({
            providerId: provider.id,
            providerLabel: provider.label,
            modelId: model.id,
            label: model.label,
          }))
      : [],
  );
}

export function modelReferenceKey(reference: ModelReference) {
  return `${reference.providerId}:${reference.modelId}`;
}

export function parseModelReference(value: unknown): ModelReference | undefined {
  if (!value || typeof value !== "object") return undefined;
  const candidate = value as Partial<ModelReference>;
  if (
    typeof candidate.providerId !== "string" ||
    !/^[a-z0-9-]{2,40}$/.test(candidate.providerId) ||
    typeof candidate.modelId !== "string" ||
    !/^[a-zA-Z0-9._-]{2,100}$/.test(candidate.modelId)
  ) {
    return undefined;
  }
  return { providerId: candidate.providerId, modelId: candidate.modelId };
}
