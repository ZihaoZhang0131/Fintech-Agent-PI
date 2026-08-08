import type { LocalSkillState } from "./loader";

const EMPTY_STATE: LocalSkillState = { entries: [], deletedBundledNames: [] };

export async function loadLocalSkillState(): Promise<LocalSkillState> {
  const runtimeUrl = process.env.LOCAL_RUNTIME_URL;
  const runtimeToken = process.env.LOCAL_RUNTIME_TOKEN;
  if (!runtimeUrl || !runtimeToken) return EMPTY_STATE;
  try {
    const response = await fetch(`${runtimeUrl}/skills`, {
      headers: { Authorization: `Bearer ${runtimeToken}` },
      cache: "no-store",
    });
    if (!response.ok) return EMPTY_STATE;
    const value = await response.json() as Partial<LocalSkillState>;
    const entries = Array.isArray(value.entries)
      ? value.entries.filter((entry): entry is LocalSkillState["entries"][number] =>
          Boolean(entry) &&
          typeof entry === "object" &&
          typeof entry.id === "string" &&
          (entry.origin === "bundled" || entry.origin === "custom") &&
          typeof entry.name === "string" &&
          typeof entry.description === "string" &&
          typeof entry.instructions === "string",
        )
      : [];
    const deletedBundledNames = Array.isArray(value.deletedBundledNames)
      ? value.deletedBundledNames.filter((name): name is string => typeof name === "string")
      : [];
    return { entries, deletedBundledNames };
  } catch {
    return EMPTY_STATE;
  }
}
