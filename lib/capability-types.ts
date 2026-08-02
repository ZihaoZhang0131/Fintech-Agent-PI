export type CapabilityKind = "skill" | "tool";

export type CapabilityItem = {
  kind: CapabilityKind;
  name: string;
  label: string;
  description: string;
  detail: string;
  sourcePath: string;
  defaultEnabled: boolean;
  allowedTools?: string[];
};

export type CapabilityCatalog = {
  skills: CapabilityItem[];
  tools: CapabilityItem[];
};
