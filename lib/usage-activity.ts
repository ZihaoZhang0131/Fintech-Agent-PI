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
