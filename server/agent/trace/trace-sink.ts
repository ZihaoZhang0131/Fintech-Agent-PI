import type { TraceEvent, TraceRunStatus, TraceSpan, TraceStats, TraceUsage } from "../../../lib/trace-types.ts";

export type TraceRunStart = {
  id: string;
  workspaceId: string;
  conversationId?: string;
  startedAt: number;
  modelProvider?: string;
  modelId?: string;
  question: string;
  workspacePath?: string;
  capabilities?: unknown;
};

export type TraceRunFinish = {
  status: Exclude<TraceRunStatus, "running">;
  endedAt: number;
  output?: string;
  usage: TraceUsage;
  error?: unknown;
  stats: TraceStats;
  workspacePath?: string;
};

export interface TraceSink {
  start(run: TraceRunStart): Promise<void>;
  append(traceId: string, payload: { spans: TraceSpan[]; events: TraceEvent[] }): Promise<void>;
  finish(traceId: string, run: TraceRunFinish): Promise<void>;
}

export class LocalRuntimeTraceSink implements TraceSink {
  private readonly baseUrl: string;
  private readonly token: string;

  constructor(options: { baseUrl?: string; token?: string } = {}) {
    this.baseUrl = (options.baseUrl ?? process.env.LOCAL_RUNTIME_URL ?? "").replace(/\/$/, "");
    this.token = options.token ?? process.env.LOCAL_RUNTIME_TOKEN ?? "";
  }

  private async request(path: string, method: "GET" | "POST" | "PUT", payload?: unknown) {
    if (!this.baseUrl || !this.token) throw new Error("本机 Trace Runtime 未配置。");
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      ...(payload === undefined ? {} : { body: JSON.stringify(payload) }),
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string } | null;
      throw new Error(body?.message ?? `Trace Runtime 返回 ${response.status}`);
    }
    return response.json().catch(() => null) as Promise<Record<string, unknown> | null>;
  }

  async start(run: TraceRunStart) {
    await this.request("/trace-ingest/runs", "POST", run);
  }

  async append(traceId: string, payload: { spans: TraceSpan[]; events: TraceEvent[] }) {
    await this.request(`/trace-ingest/runs/${encodeURIComponent(traceId)}/events`, "POST", payload);
  }

  async finish(traceId: string, run: TraceRunFinish) {
    await this.request(`/trace-ingest/runs/${encodeURIComponent(traceId)}`, "PUT", run);
  }

  abort(traceId: string) {
    return this.request(`/trace-ingest/runs/${encodeURIComponent(traceId)}/abort`, "POST", {});
  }

  async isAborted(traceId: string) {
    const result = await this.request(`/trace-ingest/runs/${encodeURIComponent(traceId)}/abort`, "GET");
    return result?.aborted === true;
  }
}
