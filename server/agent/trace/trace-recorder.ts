import { randomUUID } from "node:crypto";
import type { AgentEvent } from "@earendil-works/pi-agent-core";
import type { AssistantMessage, Usage } from "@earendil-works/pi-ai";
import type {
  TraceMessage,
  TraceEvent,
  TraceRunStatus,
  TraceSpan,
  TraceSpanStatus,
  TraceStats,
  TraceUsage,
} from "../../../lib/trace-types.ts";
import { redactTraceText, redactTraceValue, traceSha256 } from "../../trace-redaction.mjs";
import type { TraceRunFinish, TraceRunStart, TraceSink } from "./trace-sink";

const FLUSH_INTERVAL_MS = 250;
const FLUSH_EVENT_COUNT = 20;
const FLUSH_MAX_BYTES = 512 * 1024;

const EMPTY_USAGE: TraceUsage = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
  totalTokens: 0,
  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
};

type AgentScope = {
  key: string;
  agentId: string;
  agentLabel: string;
  modelProvider: string;
  modelId: string;
  isRoot: boolean;
  agentSpanId: string;
  parentSpanId?: string;
  currentTurnSpanId?: string;
  currentGenerationSpanId?: string;
  turnIndex: number;
  toolSpanIds: Map<string, string>;
  input?: string;
  stopReason?: string;
  warned?: boolean;
  publicText: string;
  generationText: string;
  replyStartedAt?: number;
};

export type TraceAgentHandle = {
  scopeKey: string;
  onEvent: (event: AgentEvent) => void;
  finish: (error?: unknown, cancelled?: boolean) => void;
};

function numeric(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function addUsage(target: TraceUsage, usage: Usage) {
  target.input += numeric(usage.input);
  target.output += numeric(usage.output);
  target.cacheRead += numeric(usage.cacheRead);
  target.cacheWrite += numeric(usage.cacheWrite);
  target.totalTokens += numeric(usage.totalTokens);
  if (typeof usage.reasoning === "number") target.reasoning = numeric(target.reasoning) + usage.reasoning;
  target.cost.input += numeric(usage.cost?.input);
  target.cost.output += numeric(usage.cost?.output);
  target.cost.cacheRead += numeric(usage.cost?.cacheRead);
  target.cost.cacheWrite += numeric(usage.cost?.cacheWrite);
  target.cost.total += numeric(usage.cost?.total);
}

function assistantTraceOutput(message: AssistantMessage, workspacePath?: string) {
  const text = message.content
    .filter((item) => item.type === "text")
    .map((item) => item.text)
    .join("\n");
  const toolCalls = message.content.flatMap((item) =>
    item.type === "toolCall"
      ? [{ id: item.id, name: item.name, arguments: redactTraceValue(item.arguments, { workspacePath, maxBytes: 32 * 1024 }) }]
      : [],
  );
  const thinkingCharacters = message.content
    .filter((item) => item.type === "thinking")
    .reduce((sum, item) => sum + item.thinking.length, 0);
  return {
    text: redactTraceText(text, { workspacePath, maxBytes: 100_000 }),
    toolCalls,
    ...(thinkingCharacters ? { thinking: { recorded: false, characters: thinkingCharacters } } : {}),
    stopReason: message.stopReason,
    provider: message.provider,
    model: message.model,
    usage: redactTraceValue(message.usage, { maxBytes: 16 * 1024 }),
  };
}

function toolTraceOutput(result: unknown, workspacePath?: string) {
  if (!result || typeof result !== "object") return redactTraceValue(result, { workspacePath, maxBytes: 32 * 1024 });
  const candidate = result as Record<string, unknown>;
  const content = Array.isArray(candidate.content)
    ? candidate.content.map((item) => {
        if (!item || typeof item !== "object") return { type: typeof item };
        const block = item as Record<string, unknown>;
        if (block.type === "text" && typeof block.text === "string") {
          return {
            type: "text",
            bytes: Buffer.byteLength(block.text, "utf8"),
            sha256: traceSha256(block.text),
            preview: redactTraceText(block.text, { workspacePath, maxBytes: 2_000 }),
          };
        }
        if (block.type === "image") return { type: "image", omitted: true };
        return redactTraceValue(block, { workspacePath, maxBytes: 2_000 });
      })
    : undefined;
  return redactTraceValue(
    {
      ...(content ? { content } : {}),
      ...(candidate.details === undefined ? {} : { details: candidate.details }),
      ...(candidate.usage === undefined ? {} : { usage: candidate.usage }),
      ...(candidate.addedToolNames === undefined ? {} : { addedToolNames: candidate.addedToolNames }),
      ...(candidate.terminate === undefined ? {} : { terminate: candidate.terminate }),
    },
    { workspacePath, maxBytes: 32 * 1024 },
  );
}

function messageRole(message: unknown) {
  return message && typeof message === "object" && "role" in message ? String(message.role) : "unknown";
}

function messageStopStatus(message: unknown): TraceSpanStatus {
  if (!message || typeof message !== "object" || !("stopReason" in message)) return "success";
  const reason = String(message.stopReason);
  if (reason === "aborted") return "cancelled";
  if (reason === "error") return "error";
  return "success";
}

export class TraceRecorder {
  readonly traceId: string;
  private readonly sink: TraceSink;
  private readonly run: TraceRunStart;
  private readonly workspacePath?: string;
  private readonly spans = new Map<string, TraceSpan>();
  private readonly dirtySpanIds = new Set<string>();
  private readonly pendingEvents: TraceEvent[] = [];
  private readonly pendingMessages = new Map<string, TraceMessage>();
  private readonly scopes = new Map<string, AgentScope>();
  private readonly usage: TraceUsage = structuredClone(EMPTY_USAGE);
  private readonly stats: TraceStats = { turns: 0, generations: 0, tools: 0, subAgents: 0, warnings: 0 };
  private seq = 0;
  private pendingBytes = 0;
  private flushTimer?: ReturnType<typeof setTimeout>;
  private flushChain: Promise<void> = Promise.resolve();
  private enabled = false;
  private finished = false;
  private aborted = false;
  private rootStopReason?: string;
  private finalOutput = "";
  private failure?: unknown;

  constructor(options: TraceRunStart & { sink: TraceSink }) {
    this.traceId = options.id;
    this.sink = options.sink;
    this.workspacePath = options.workspacePath;
    this.run = {
      ...options,
      question: redactTraceText(options.question, { workspacePath: options.workspacePath, maxBytes: 100_000 }),
      capabilities: redactTraceValue(options.capabilities, { workspacePath: options.workspacePath, maxBytes: 64 * 1024 }),
    };
    delete (this.run as TraceRunStart & { sink?: TraceSink }).sink;
  }

  get isAvailable() {
    return this.enabled;
  }

  async start() {
    try {
      await this.sink.start(this.run);
      this.enabled = true;
      return true;
    } catch (error) {
      console.warn("Trace recording unavailable", error);
      this.enabled = false;
      return false;
    }
  }

  attachAgent(options: {
    scopeKey?: string;
    agentId: string;
    agentLabel: string;
    modelProvider: string;
    modelId: string;
    parentSpanId?: string;
    isRoot?: boolean;
    input?: string;
  }): TraceAgentHandle {
    const key = options.scopeKey ?? `${options.agentId}:${randomUUID()}`;
    const scope: AgentScope = {
      key,
      agentId: options.agentId,
      agentLabel: options.agentLabel,
      modelProvider: options.modelProvider,
      modelId: options.modelId,
      parentSpanId: options.parentSpanId,
      isRoot: options.isRoot === true,
      agentSpanId: randomUUID(),
      turnIndex: 0,
      toolSpanIds: new Map(),
      input: options.input ?? (options.isRoot ? this.run.question : undefined),
      publicText: "",
      generationText: "",
    };
    this.scopes.set(key, scope);
    if (!scope.isRoot) this.stats.subAgents += 1;
    // Create the invocation before model/tool setup so failed starts remain inspectable.
    this.recordAgentEvent(scope, { type: "agent_start" });
    if (scope.input !== undefined) this.projectMessage(scope, "user", scope.input, false);
    return {
      scopeKey: key,
      onEvent: (event) => this.recordAgentEvent(scope, event),
      finish: (error, cancelled = false) => {
        const status = cancelled ? "cancelled" : error ? "error" : scope.stopReason === "error" ? "error" : scope.stopReason === "aborted" ? "cancelled" : "success";
        for (const span of this.spans.values()) {
          if ((span.id === scope.agentSpanId || this.belongsTo(span, scope.agentSpanId)) && (span.status === "running" || span.id === scope.agentSpanId)) {
            this.updateSpan(span.id, { status, endedAt: Date.now(), ...(error ? { error: redactTraceValue(String(error), { workspacePath: this.workspacePath }) } : {}) });
          }
        }
        if (!scope.isRoot && status !== "success" && !scope.warned) { this.stats.warnings += 1; scope.warned = true; }
        this.projectMessage(scope, "assistant", scope.publicText + scope.generationText, status !== "success");
      },
    };
  }

  private belongsTo(span: TraceSpan, ancestor: string): boolean {
    let parent = span.parentSpanId;
    const seen = new Set<string>();
    while (parent && !seen.has(parent)) {
      if (parent === ancestor) return true;
      seen.add(parent);
      parent = this.spans.get(parent)?.parentSpanId;
    }
    return false;
  }

  private projectMessage(scope: AgentScope, role: "user" | "assistant", content: string, partial: boolean) {
    if (!this.enabled || !content) return;
    const id = `${scope.agentSpanId}:${role}`;
    const message: TraceMessage = {
      id, traceId: this.traceId, spanId: scope.agentSpanId, role,
      content: redactTraceText(content, { workspacePath: this.workspacePath, maxBytes: 100_000 }),
      createdAt: role === "user" ? this.spans.get(scope.agentSpanId)?.startedAt : scope.replyStartedAt,
      label: role === "user" ? (scope.isRoot ? "用户" : "任务") : scope.agentLabel,
      ...(role === "assistant" ? { model: scope.modelId, partial } : {}),
    };
    this.pendingMessages.set(id, message);
    this.scheduleFlush();
  }

  getToolSpanId(scopeKey: string, toolCallId: string) {
    return this.scopes.get(scopeKey)?.toolSpanIds.get(toolCallId);
  }

  markAborted() {
    this.aborted = true;
  }

  markFailure(error: unknown) {
    this.failure = redactTraceValue(
      { name: error instanceof Error ? error.name : "Error", message: error instanceof Error ? error.message : String(error) },
      { workspacePath: this.workspacePath, maxBytes: 32 * 1024 },
    );
  }

  private putSpan(span: TraceSpan) {
    this.spans.set(span.id, span);
    this.dirtySpanIds.add(span.id);
    this.pendingBytes += Buffer.byteLength(JSON.stringify(span), "utf8");
    this.scheduleFlush();
  }

  private updateSpan(spanId: string, update: Partial<TraceSpan>) {
    const current = this.spans.get(spanId);
    if (!current) return;
    const next = { ...current, ...update };
    if (next.endedAt !== undefined) next.durationMs = Math.max(0, next.endedAt - next.startedAt);
    this.putSpan(next);
  }

  private addEvent(spanId: string | undefined, type: string, payload?: unknown) {
    if (this.finished) return;
    const event: TraceEvent = {
      traceId: this.traceId,
      seq: ++this.seq,
      ...(spanId ? { spanId } : {}),
      type,
      timestamp: Date.now(),
      ...(payload === undefined ? {} : { payload: redactTraceValue(payload, { workspacePath: this.workspacePath, maxBytes: 32 * 1024 }) }),
    };
    this.pendingEvents.push(event);
    this.pendingBytes += Buffer.byteLength(JSON.stringify(event), "utf8");
    this.scheduleFlush();
  }

  private createSpan(scope: AgentScope, values: Omit<TraceSpan, "traceId">) {
    const span: TraceSpan = { ...values, traceId: this.traceId };
    this.putSpan(span);
    return span;
  }

  private recordAgentEvent(scope: AgentScope, event: AgentEvent) {
    if (!this.enabled || this.finished) return;
    const timestamp = Date.now();
    if (event.type === "agent_start") {
      if (this.spans.has(scope.agentSpanId)) return;
      this.createSpan(scope, {
        id: scope.agentSpanId,
        ...(scope.parentSpanId ? { parentSpanId: scope.parentSpanId } : {}),
        kind: "agent",
        name: `invoke_agent ${scope.agentLabel}`,
        agentId: scope.agentId,
        agentLabel: scope.agentLabel,
        status: "running",
        startedAt: timestamp,
        input: scope.input === undefined ? undefined : redactTraceValue({ task: scope.input }, { workspacePath: this.workspacePath }),
        attributes: { operation: "invoke_agent", modelProvider: scope.modelProvider, modelId: scope.modelId },
      });
      this.addEvent(scope.agentSpanId, "agent_start", { agentId: scope.agentId, agentLabel: scope.agentLabel });
      return;
    }
    if (event.type === "turn_start") {
      scope.turnIndex += 1;
      scope.currentTurnSpanId = randomUUID();
      this.stats.turns += 1;
      this.createSpan(scope, {
        id: scope.currentTurnSpanId,
        parentSpanId: scope.agentSpanId,
        kind: "turn",
        name: `turn ${scope.turnIndex}`,
        agentId: scope.agentId,
        agentLabel: scope.agentLabel,
        status: "running",
        startedAt: timestamp,
        attributes: { turnIndex: scope.turnIndex },
      });
      this.addEvent(scope.currentTurnSpanId, "turn_start", { turnIndex: scope.turnIndex });
      return;
    }
    if (event.type === "message_start") {
      const role = messageRole(event.message);
      if (role === "assistant") {
        scope.replyStartedAt ??= timestamp;
        scope.generationText = "";
        scope.currentGenerationSpanId = randomUUID();
        this.stats.generations += 1;
        this.createSpan(scope, {
          id: scope.currentGenerationSpanId,
          parentSpanId: scope.currentTurnSpanId ?? scope.agentSpanId,
          kind: "generation",
          name: `chat ${scope.modelId}`,
          agentId: scope.agentId,
          agentLabel: scope.agentLabel,
          status: "running",
          startedAt: timestamp,
          input: { historyContentRecorded: false },
          attributes: { operation: "chat", provider: scope.modelProvider, model: scope.modelId },
        });
      }
      this.addEvent(scope.currentGenerationSpanId ?? scope.currentTurnSpanId ?? scope.agentSpanId, "message_start", { role });
      return;
    }
    if (event.type === "message_update") {
      const updateType = event.assistantMessageEvent.type;
      if (updateType === "text_delta") {
        scope.generationText += event.assistantMessageEvent.delta;
        this.projectMessage(scope, "assistant", scope.publicText + scope.generationText, true);
      }
      if (updateType === "thinking_start" || updateType === "thinking_end" || updateType === "toolcall_start" || updateType === "toolcall_end") {
        this.addEvent(scope.currentGenerationSpanId, updateType, {
          contentIndex: "contentIndex" in event.assistantMessageEvent ? event.assistantMessageEvent.contentIndex : undefined,
          ...(updateType === "thinking_end" ? { contentRecorded: false } : {}),
          ...(updateType === "toolcall_end" ? { toolCall: event.assistantMessageEvent.toolCall } : {}),
        });
      }
      return;
    }
    if (event.type === "message_end") {
      const role = messageRole(event.message);
      if (role === "assistant") {
        const message = event.message as AssistantMessage;
        const generationId = scope.currentGenerationSpanId ?? randomUUID();
        if (!this.spans.has(generationId)) {
          this.createSpan(scope, {
            id: generationId,
            parentSpanId: scope.currentTurnSpanId ?? scope.agentSpanId,
            kind: "generation",
            name: `chat ${scope.modelId}`,
            agentId: scope.agentId,
            agentLabel: scope.agentLabel,
            status: "running",
            startedAt: message.timestamp || timestamp,
          });
        }
        const output = assistantTraceOutput(message, this.workspacePath);
        const status = messageStopStatus(message);
        this.updateSpan(generationId, {
          status,
          endedAt: timestamp,
          output,
          attributes: { operation: "chat", provider: scope.modelProvider, model: scope.modelId, usage: redactTraceValue(message.usage) },
          ...(status === "error" ? { error: redactTraceValue(message.errorMessage ?? "模型生成失败") } : {}),
        });
        addUsage(this.usage, message.usage);
        scope.stopReason = message.stopReason;
        scope.publicText += output.text;
        scope.generationText = "";
        this.projectMessage(scope, "assistant", scope.publicText, status !== "success");
        if (scope.isRoot) {
          this.rootStopReason = message.stopReason;
          this.finalOutput = output.text;
        }
        this.addEvent(generationId, "message_end", { role, stopReason: message.stopReason, usage: message.usage });
        scope.currentGenerationSpanId = undefined;
      } else {
        this.addEvent(scope.currentTurnSpanId ?? scope.agentSpanId, "message_end", { role });
      }
      return;
    }
    if (event.type === "tool_execution_start") {
      const spanId = randomUUID();
      scope.toolSpanIds.set(event.toolCallId, spanId);
      this.stats.tools += 1;
      this.createSpan(scope, {
        id: spanId,
        parentSpanId: scope.currentTurnSpanId ?? scope.agentSpanId,
        kind: "tool",
        name: `execute_tool ${event.toolName}`,
        agentId: scope.agentId,
        agentLabel: scope.agentLabel,
        toolCallId: event.toolCallId,
        status: "running",
        startedAt: timestamp,
        input: redactTraceValue(event.args, { workspacePath: this.workspacePath, maxBytes: 32 * 1024 }),
        attributes: { operation: "execute_tool", toolName: event.toolName },
      });
      this.addEvent(spanId, "tool_execution_start", { toolCallId: event.toolCallId, toolName: event.toolName, args: event.args });
      return;
    }
    if (event.type === "tool_execution_update") {
      const spanId = scope.toolSpanIds.get(event.toolCallId);
      this.addEvent(spanId, "tool_execution_update", {
        toolCallId: event.toolCallId,
        toolName: event.toolName,
        partialResult: toolTraceOutput(event.partialResult, this.workspacePath),
      });
      return;
    }
    if (event.type === "tool_execution_end") {
      const spanId = scope.toolSpanIds.get(event.toolCallId);
      const details = event.result?.details as {
        status?: unknown;
        timedOut?: unknown;
        exitCode?: unknown;
        commandStatus?: unknown;
      } | undefined;
      const cancelled = details?.status === "rejected";
      const status: TraceSpanStatus = cancelled ? "cancelled" : event.isError ? "error" : "success";
      const exitCode =
        typeof details?.exitCode === "number" ? details.exitCode : undefined;
      const commandFailed = exitCode !== undefined && exitCode !== 0;
      if (status !== "success" || commandFailed) this.stats.warnings += 1;
      if (spanId) {
        this.updateSpan(spanId, {
          status,
          endedAt: timestamp,
          output: toolTraceOutput(event.result, this.workspacePath),
          attributes: {
            operation: "execute_tool",
            toolName: event.toolName,
            ...(exitCode === undefined ? {} : { exitCode }),
            timedOut: details?.timedOut === true,
            commandStatus:
              details?.commandStatus ??
              (commandFailed ? "command_failed" : details?.status),
          },
          ...(event.isError ? { error: { message: "工具执行失败", timedOut: details?.timedOut === true } } : {}),
        });
      }
      this.addEvent(spanId, "tool_execution_end", {
        toolCallId: event.toolCallId,
        toolName: event.toolName,
        isError: event.isError,
        status,
        exitCode,
        timedOut: details?.timedOut === true,
        commandStatus:
          details?.commandStatus ??
          (commandFailed ? "command_failed" : details?.status),
      });
      return;
    }
    if (event.type === "turn_end") {
      if (scope.currentTurnSpanId) {
        const status = messageStopStatus(event.message);
        this.updateSpan(scope.currentTurnSpanId, { status, endedAt: timestamp });
        this.addEvent(scope.currentTurnSpanId, "turn_end", { toolResultCount: event.toolResults.length, status });
      }
      scope.currentTurnSpanId = undefined;
      return;
    }
    if (event.type === "agent_end") {
      const status: TraceSpanStatus = (this.aborted && scope.isRoot) || scope.stopReason === "aborted"
        ? "cancelled"
        : scope.stopReason === "error"
          ? "error"
          : "success";
      if (!scope.isRoot && status !== "success" && !scope.warned) { this.stats.warnings += 1; scope.warned = true; }
      this.updateSpan(scope.agentSpanId, { status, endedAt: timestamp });
      this.addEvent(scope.agentSpanId, "agent_end", { messageCount: event.messages.length, status });
    }
  }

  private scheduleFlush() {
    if (!this.enabled || this.finished) return;
    if (this.pendingEvents.length >= FLUSH_EVENT_COUNT || this.pendingBytes >= FLUSH_MAX_BYTES) {
      if (this.flushTimer) clearTimeout(this.flushTimer);
      this.flushTimer = undefined;
      void this.flush();
      return;
    }
    if (!this.flushTimer) {
      this.flushTimer = setTimeout(() => {
        this.flushTimer = undefined;
        void this.flush();
      }, FLUSH_INTERVAL_MS);
    }
  }

  async flush() {
    if (!this.enabled) return;
    if (this.flushTimer) clearTimeout(this.flushTimer);
    this.flushTimer = undefined;
    const events = this.pendingEvents.splice(0);
    const spanIds = [...this.dirtySpanIds];
    this.dirtySpanIds.clear();
    const spans = spanIds.flatMap((id) => {
      const span = this.spans.get(id);
      return span ? [span] : [];
    });
    const messages = [...this.pendingMessages.values()];
    this.pendingMessages.clear();
    this.pendingBytes = 0;
    if (!events.length && !spans.length && !messages.length) return this.flushChain;
    this.flushChain = this.flushChain
      .then(() => this.sink.append(this.traceId, { spans, events, messages }))
      .catch((error) => {
        console.warn("Trace batch write failed", error);
        this.enabled = false;
      });
    return this.flushChain;
  }

  async finish(error?: unknown) {
    if (this.finished) return this.enabled;
    this.finished = true;
    if (error && !this.aborted) this.markFailure(error);
    const endedAt = Date.now();
    const closeStatus: TraceSpanStatus = this.aborted ? "cancelled" : this.failure ? "error" : "cancelled";
    for (const span of this.spans.values()) {
      if (span.status === "running") this.updateSpan(span.id, { status: closeStatus, endedAt });
    }
    this.finished = false;
    this.addEvent(undefined, "trace_end", { aborted: this.aborted, failed: Boolean(this.failure) });
    this.finished = true;
    await this.flush();
    if (!this.enabled) return false;
    const status: Exclude<TraceRunStatus, "running"> = this.aborted || this.rootStopReason === "aborted"
      ? "aborted"
      : this.failure || this.rootStopReason === "error"
        ? "error"
        : this.stats.warnings > 0
          ? "success_with_warnings"
          : "success";
    const finish: TraceRunFinish = {
      status,
      endedAt,
      output: this.finalOutput,
      usage: this.usage,
      ...(this.failure ? { error: this.failure } : {}),
      stats: this.stats,
      workspacePath: this.workspacePath,
    };
    try {
      await this.sink.finish(this.traceId, finish);
      return true;
    } catch (finishError) {
      console.warn("Trace finalization failed", finishError);
      this.enabled = false;
      return false;
    }
  }
}
