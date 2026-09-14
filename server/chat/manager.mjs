import { createChatRuntimeStore, fail } from "./store.mjs";
import { prepareChatAgent } from "./agent.ts";
import { createConfiguredModels } from "../model-registry.ts";
import { MODEL_PROVIDERS, resolveConfiguredModel } from "../model-providers.mjs";
import { createContextManager, resultReader, boundToolResult } from "./context.mjs";
import { chatConfig } from "./config.mjs";

export function createChatSessionManager({ dataDirectory, traceStore, findWorkspace, prepare = prepareChatAgent, contextFactory = createContextManager }) {
  const store = createChatRuntimeStore(dataDirectory);
  store.recover();
  const runs = new Map(), listeners = new Map();
  let closing = false;
  const notify = e => { if (e) for (const fn of listeners.get(e.threadId) ?? []) fn(e); };
  function emit(threadId, turnId, event) { notify(store.emit(threadId, turnId, event)); }
  function snapshot(id, options) { return store.snapshot(id, options); }
  async function repair(session) {
    const messages = (await session.buildContext()).messages;
    const results = new Set(messages.filter(m => m.role === "toolResult").map(m => m.toolCallId));
    for (const m of messages) if (m.role === "assistant") for (const call of m.content.filter(c => c.type === "toolCall")) {
      if (!results.has(call.id)) await session.appendMessage({ role: "toolResult", toolCallId: call.id, toolName: call.name, content: [{ type: "text", text: "执行曾中断，结果未知。禁止直接重放；先核验目标文件、数据库或其他实际状态。" }], isError: true, timestamp: Date.now() });
    }
  }
  async function execute(state) {
    const { turn: t, controller } = state;
    let textBuffer = "", textItemId, timer;
    const flush = () => {
      clearTimeout(timer); timer = undefined;
      if (textBuffer) emit(t.threadId, t.id, { type: "delta", itemId: textItemId, text: textBuffer });
      textBuffer = ""; textItemId = undefined;
    };
    const send = e => {
      if (e.type === "delta") {
        if (textBuffer && textItemId !== e.itemId) flush();
        textItemId = e.itemId; textBuffer += e.text;
        if (textBuffer.length >= 8192) flush(); else timer ??= setTimeout(() => { timer = undefined; flush(); }, 100);
      }
      else { flush(); timer = undefined; emit(t.threadId, t.id, e); }
    };
    try {
      const workspace = await findWorkspace(store.thread(t.threadId).projectId);
      const session = store.session(t.threadId, t.id, entry => {
        if (entry.type !== "message" || entry.message.role !== "user") return;
        if (state.skipInitial) { state.skipInitial = false; return; }
        const content = typeof entry.message.content === "string" ? entry.message.content : entry.message.content.filter(c => c.type === "text").map(c => c.text).join("");
        return state.delivered.find(i => i.status === "pending" && i.text === content);
      }, notify);
      await repair(session);
      const reference = t.config.agentConfig?.mainModel ?? t.config.model;
      const models = createConfiguredModels({ credentials: {
        async read(providerId) {
          const p = MODEL_PROVIDERS.find(p => p.piProviderId === providerId);
          if (!p || !reference) return undefined;
          const resolved = await resolveConfiguredModel(dataDirectory, p.id, reference.modelId);
          return { type: "api_key", key: resolved.apiKey };
        },
        async list() { return []; },
        async modify(id, fn) { return fn(await this.read(id)); },
        async delete() { throw new Error("聊天不修改模型凭据。"); },
      } });
      controller.signal.throwIfAborted();
      const bundle = await prepare({ ...t.config, input: t.input, conversationId: t.threadId, workspaceId: workspace.id, workspaceName: workspace.name, workspacePath: workspace.path, traceId: t.id }, {
        session, models, send, signal: controller.signal, extraTools: [resultReader(store, t.threadId)],
        traceSink: { async start(run) { traceStore?.createRun(run); }, async append(id, data) { traceStore?.appendBatch(id, data); }, async finish(id, data) { traceStore?.finishRun(id, data); } },
      });
      state.bundle = bundle;
      const context = contextFactory({ ...bundle, session, signal: controller.signal, emit: send });
      bundle.agent.on("context", e => context.transform(e.messages));
      bundle.agent.on("tool_result", e => boundToolResult(store, t.threadId, e));
      controller.signal.throwIfAborted();
      notify(store.status(t.id, "running"));
      if (t.operation === "compact") {
        await context.transform((await session.buildContext()).messages, true);
        await bundle.finish?.();
        notify(store.status(t.id, "completed", { endedAt: Date.now() }));
        return;
      }
      let initial = t.previousTurnId ? `${t.input}\n\n上次任务：${store.turn(t.previousTurnId)?.input ?? "见历史记录"}\n继续上次中断任务。以已保存的工具结果为准；结果未知的动作先核验实际状态，不得直接重放。` : t.input;
      while (true) {
        state.skipInitial = true;
        const promise = bundle.run(initial, controller.signal);
        // prompt() marks the Harness busy synchronously, even while startup awaits.
        for (const i of state.pending.splice(0)) { state.delivered.push(i); await bundle.agent.steer(i.text); }
        const result = await promise;
        state.accepting = false;
        flush();
        if (controller.signal.aborted) throw fail("聊天已停止。");
        const late = state.delivered.filter(i => i.status === "pending").concat(state.pending.splice(0));
        if (!late.length) {
          await bundle.finish?.();
          notify(store.status(t.id, "completed", { endedAt: Date.now(), durationMs: Date.now() - t.startedAt, totalTokens: result?.usage?.totalTokens }));
          break;
        }
        // A steer accepted after Pi's final queue drain is still completed in
        // this application Turn. It must never be silently lost.
        const [first, ...rest] = late;
        state.delivered = [first];
        await bundle.agent.appendMessage({ role: "user", content: first.text, timestamp: first.createdAt });
        state.delivered = []; state.pending.push(...rest); state.accepting = true;
        initial = "请根据刚刚补充的用户要求继续。";
      }
    } catch (error) {
      flush();
      try { await state.bundle?.finish?.(error); } catch { /* Trace failure cannot strand a running Turn. */ }
      const interrupted = controller.signal.aborted;
      notify(store.status(t.id, interrupted ? "interrupted" : "failed", { endedAt: Date.now(), reason: interrupted ? "已停止，可继续。" : (error.message || "聊天执行失败。") }));
    } finally {
      flush(); clearTimeout(timer); state.accepting = false;
      if (state.userInterrupted) for (const i of store.inputs(t.id).filter(i => i.status === "pending")) notify(store.inputStatus(i, "cancelled"));
      if (runs.get(t.threadId) === state) runs.delete(t.threadId);
    }
  }
  function start(id, request) {
    if (closing) throw fail("聊天服务正在关闭。", 503);
    const { clientRequestId, input, config = {}, previousTurnId } = request;
    if (typeof clientRequestId !== "string" || !/^[\w-]{8,200}$/.test(clientRequestId) || typeof input !== "string" || !input.trim() || input.length > 20000) throw fail("聊天输入或请求 ID 无效。");
    if (!config || typeof config !== "object" || JSON.stringify(config).length > 100000) throw fail("会话配置无效或过大。");
    const safeConfig = chatConfig(config);
    if (previousTurnId && (store.turn(previousTurnId)?.threadId !== id || !["interrupted", "failed"].includes(store.turn(previousTurnId)?.status))) throw fail("恢复轮次不属于该会话或尚未结束。", 409);
    const reserved = store.reserve(id, clientRequestId, input.trim(), safeConfig, previousTurnId, request.operation === "compact" ? "compact" : "prompt");
    if (reserved.duplicate) return reserved.turn;
    const state = { turn: reserved.turn, controller: new AbortController(), pending: [], delivered: [], accepting: true, skipInitial: true };
    if (previousTurnId) state.pending.push(...store.inputs(previousTurnId).filter(i => i.status === "pending"));
    runs.set(id, state); notify(reserved.event);
    state.done = execute(state);
    return reserved.turn;
  }
  function steer(id, turnId, request) {
    if (typeof request.text !== "string" || !request.text.trim() || request.text.length > 20000 || typeof request.clientInputId !== "string" || !/^[\w-]{8,200}$/.test(request.clientInputId)) throw fail("补充输入无效。");
    const previous = store.inputs(turnId).find(i => i.requestId === request.clientInputId);
    if (previous) { if (previous.threadId !== id || previous.text !== request.text.trim()) throw fail("补充请求 ID 冲突。", 409); return previous; }
    const state = runs.get(id);
    if (!state?.accepting || state.turn.id !== turnId || request.expectedTurnId !== turnId || state.controller.signal.aborted) throw fail("该轮已经结束，补充内容保留为草稿。", 409);
    const result = store.addInput(id, turnId, request.clientInputId, request.text.trim());
    if (!result.duplicate) {
      notify(result.event);
      if (state.bundle) {
        state.delivered.push(result.input);
        void state.bundle.agent.steer(result.input.text).catch(() => { /* execute() drains accepted late inputs */ });
      } else state.pending.push(result.input);
    }
    return result.input;
  }
  async function interrupt(id, turnId, user = true) {
    if (store.turn(turnId)?.threadId !== id) throw fail("聊天轮次不存在。", 404);
    const state = runs.get(id);
    if (state?.turn.id === turnId) { state.userInterrupted = user; state.controller.abort(); await state.done; }
    return store.turn(turnId);
  }
  function resume(id, turnId, requestId) {
    const previous = store.turn(turnId);
    if (!previous || previous.threadId !== id || !["interrupted", "failed"].includes(previous.status)) throw fail("该轮无法继续。", 409);
    return start(id, { clientRequestId: requestId, input: "继续上次任务", config: previous.config, previousTurnId: turnId });
  }
  async function remove(id) { const state = runs.get(id); if (state) await interrupt(id, state.turn.id); store.remove(id); }
  return { store, start, snapshot, steer, interrupt, resume, remove,
    commandDecision(workspaceId, commandId, decision) {
      const contains = runs => runs?.some(r => r.commandId === commandId || contains(r.children));
      for (const state of runs.values()) if (store.thread(state.turn.threadId).projectId === workspaceId && store.conversation(state.turn.threadId).messages.some(m => contains(m.toolRuns))) emit(state.turn.threadId, state.turn.id, { type: "tool_approval_decision", commandId, decision });
    },
    events: store.events,
    subscribe(id, fn) { const set = listeners.get(id) ?? new Set(); set.add(fn); listeners.set(id, set); return () => { set.delete(fn); if (!set.size) listeners.delete(id); }; },
    async wait(id) { await runs.get(id)?.done; },
    async close() { closing = true; await Promise.all([...runs.values()].map(s => interrupt(s.turn.threadId, s.turn.id, false))); listeners.clear(); store.close(); },
  };
}
