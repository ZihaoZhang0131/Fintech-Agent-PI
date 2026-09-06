export type UsageToolRun = {
  toolName: string;
  startedAt: number;
};

export type UsageMessage = {
  createdAt: number;
  tokenUsage?: number;
  toolRuns?: UsageToolRun[];
};

export type UsageConversation = {
  messages: UsageMessage[];
};

export type UsageActivity = {
  token: Map<string, number>;
  tool: Map<string, number>;
  skill: Map<string, number>;
};

export type UsageContribution = {
  sourceId: string;
  day: string;
  token?: number;
  tool?: number;
  skill?: number;
};

export type UsageActivityDay = {
  day: string;
  token: number;
  tool: number;
  skill: number;
};

export function usageDayKey(timestamp: number) {
  const date = new Date(timestamp);
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

function addUsage(target: Map<string, number>, timestamp: number, amount: number) {
  if (!Number.isFinite(timestamp) || !Number.isFinite(amount) || amount <= 0) return;
  const key = usageDayKey(timestamp);
  target.set(key, (target.get(key) ?? 0) + amount);
}

export function getUsageActivity(conversations: UsageConversation[]): UsageActivity {
  const activity: UsageActivity = {
    token: new Map(),
    tool: new Map(),
    skill: new Map(),
  };

  for (const conversation of conversations) {
    for (const message of conversation.messages) {
      addUsage(activity.token, message.createdAt, message.tokenUsage ?? 0);
      for (const run of message.toolRuns ?? []) {
        addUsage(activity.tool, run.startedAt, 1);
        if (run.toolName === "load_skill") addUsage(activity.skill, run.startedAt, 1);
      }
    }
  }

  return activity;
}

export function usageActivityFromDays(days: UsageActivityDay[]): UsageActivity {
  const activity: UsageActivity = { token: new Map(), tool: new Map(), skill: new Map() };
  for (const day of days) {
    if (day.token > 0) activity.token.set(day.day, day.token);
    if (day.tool > 0) activity.tool.set(day.day, day.tool);
    if (day.skill > 0) activity.skill.set(day.day, day.skill);
  }
  return activity;
}

export function legacyUsageContributions(conversations: UsageConversation[]): UsageContribution[] {
  const contributions: UsageContribution[] = [];
  for (const [conversationIndex, conversation] of conversations.entries()) {
    for (const [messageIndex, message] of conversation.messages.entries()) {
      const messageId = "id" in message && typeof message.id === "string"
        ? message.id
        : `${conversationIndex}:${messageIndex}`;
      const messageDay = usageDayKey(message.createdAt);
      if (typeof message.tokenUsage === "number" && message.tokenUsage > 0) {
        contributions.push({
          sourceId: `legacy/message/${messageId}/token`,
          day: messageDay,
          token: message.tokenUsage,
        });
      }
      for (const [runIndex, run] of (message.toolRuns ?? []).entries()) {
        const runId = "toolCallId" in run && typeof run.toolCallId === "string"
          ? run.toolCallId
          : `${runIndex}`;
        contributions.push({
          sourceId: `legacy/message/${messageId}/tool/${runId}`,
          day: usageDayKey(run.startedAt),
          tool: 1,
          ...(run.toolName === "load_skill" ? { skill: 1 } : {}),
        });
      }
    }
  }
  return contributions;
}
