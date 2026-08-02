export const DEEPSEEK_MODEL_OPTIONS = [
  { id: "deepseek-v4-flash", label: "DeepSeek V4 Flash" },
  { id: "deepseek-v4-pro", label: "DeepSeek V4 Pro" },
] as const;

export function getAvailableModelOptions(configuredModelId: string) {
  const configured = DEEPSEEK_MODEL_OPTIONS.find((option) => option.id === configuredModelId);
  return configured
    ? [...DEEPSEEK_MODEL_OPTIONS]
    : [{ id: configuredModelId, label: configuredModelId }, ...DEEPSEEK_MODEL_OPTIONS];
}

export function resolveModelId(requested: unknown, configuredModelId: string) {
  const available = getAvailableModelOptions(configuredModelId);
  return typeof requested === "string" && available.some((option) => option.id === requested)
    ? requested
    : configuredModelId;
}
