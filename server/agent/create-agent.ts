import {
  Agent,
  type AgentMessage,
  type AgentTool,
} from "@earendil-works/pi-agent-core";
import { createConfiguredModels } from "../model-registry.ts";
import type { resolveRuntimeModel } from "../model-runtime.ts";

/** Shared PI construction; callers own lifecycle, context policy and time budgets. */
export function createConfiguredAgent(options: {
  resolved: Awaited<ReturnType<typeof resolveRuntimeModel>>;
  systemPrompt: string;
  tools: AgentTool[];
  messages?: AgentMessage[];
  sessionId: string;
}) {
  const models = createConfiguredModels();
  const model = models.getModel(
    options.resolved.piProviderId,
    options.resolved.modelId,
  );
  if (!model) throw new Error("PI 中没有找到所选模型。");
  return new Agent({
    initialState: {
      systemPrompt: options.systemPrompt,
      model,
      thinkingLevel: "off",
      tools: options.tools,
      messages: options.messages ?? [],
    },
    streamFn: models.streamSimple.bind(models),
    getApiKey: () => options.resolved.apiKey,
    sessionId: options.sessionId,
  });
}
