"use client";
import { useEffect, useState } from "react";

export type ChatTurn = { id: string; threadId: string; status: "queued" | "running" | "completed" | "failed" | "interrupted"; reason?: string; durationMs?: number; totalTokens?: number };
export type RuntimeConversation = { id: string; projectId: string; updatedAt: number; schemaVersion?: number; activeTurn?: ChatTurn; contextCompaction?: string };
export async function chatRequest<T>(path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`/api/local/chat/threads/${path}`, { method: body === undefined ? "GET" : "POST", headers: body === undefined ? undefined : { "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body), signal, cache: "no-store" });
  const result = await response.json();
  if (!response.ok) throw Object.assign(new Error((result as { message?: string }).message ?? "聊天服务连接失败。"), { status: response.status });
  return result as T;
}

// Snapshots are the canonical display projection. Coalesce event notifications
// into one refresh instead of copying all tool-specific reducers into the UI.
export function useChatThread<T extends RuntimeConversation>(id: string | undefined, enabled: boolean, onSnapshot: (conversation: T) => void) {
  const [error, setError] = useState("");
  const [phase, setPhase] = useState("");
  useEffect(() => {
    if (!id || !enabled) return;
    let disposed = false, source: EventSource | undefined, timer: ReturnType<typeof setTimeout> | undefined;
    let retry: ReturnType<typeof setTimeout> | undefined, pending = false, refreshing = false;
    const controller = new AbortController();
    let seq = 0;
    async function refresh() {
      if (disposed) return;
      if (refreshing) { pending = true; return; }
      refreshing = true;
      try {
        const data = await chatRequest<{ conversation: T; seq: number }>(encodeURIComponent(id!), undefined, controller.signal);
        if (!disposed) { onSnapshot(data.conversation); seq = Math.max(seq, data.seq); setError(""); setPhase(data.conversation.contextCompaction === "running" ? "正在整理上下文…" : ""); }
      } catch (e) { if (!disposed) setError(e instanceof Error ? e.message : "聊天连接中断，正在重连。"); }
      finally { refreshing = false; if (pending) { pending = false; schedule(); } }
    }
    function schedule() { if (!timer && !disposed) timer = setTimeout(() => { timer = undefined; void refresh(); }, 100); }
    async function connect() {
      await refresh();
      if (disposed) return;
      source = new EventSource(`/api/local/chat/threads/${encodeURIComponent(id!)}/events?afterSeq=${seq}`);
      source.onmessage = e => {
        const item = JSON.parse(e.data) as { seq: number; type: string; status?: string };
        if (item.seq <= seq) return;
        if (item.type === "context_compaction") setPhase(item.status === "running" ? "正在整理上下文…" : "");
        if (item.type === "turn_status") setPhase("");
        schedule();
      };
      source.onerror = () => { source?.close(); if (!disposed) { setError("连接中断，正在重连；任务仍在本机执行。"); retry = setTimeout(() => void connect(), 1000); } };
    }
    void Promise.resolve().then(() => { if (!disposed) { setError(""); setPhase(""); void connect(); } });
    return () => { disposed = true; controller.abort(); source?.close(); clearTimeout(timer); clearTimeout(retry); };
  }, [id, enabled, onSnapshot]);
  return { error, phase };
}
