"use client";
import { useEffect, useState } from "react";
import type { TracePageResult } from "@/lib/trace-types";

export async function traceJson<T>(
  url: string,
  signal?: AbortSignal,
  method = "GET",
): Promise<T> {
  const r = await fetch(url, { cache: "no-store", signal, method });
  const value = (await r.json()) as T & { message?: string };
  if (!r.ok) throw new Error(value.message ?? "Trace 服务暂时不可用。");
  return value;
}
export function useTraceData<T>(url: string, tick: number) {
  const [state, set] = useState<{ url: string; data?: T; error?: string }>({
    url: "",
  });
  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    traceJson<T>(url, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) set({ url, data });
      })
      .catch((e) => {
        if (!controller.signal.aborted)
          set((old) => ({
            url,
            data: old.url === url ? old.data : undefined,
            error: e.message,
          }));
      });
    return () => controller.abort();
  }, [url, tick]);
  return state.url === url ? state : { url };
}
export function useTracePages<T, Extra = object>(
  url: string,
  tick: number,
  pages: number,
) {
  type Result = TracePageResult<T> & Extra;
  const [state, set] = useState<{
    url: string;
    data?: Result;
    error?: string;
    pages?: number;
  }>({ url: "" });
  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    (async () => {
      let data: Result | undefined,
        cursor = "";
      for (let i = 0; i < pages; i++) {
        const result = await traceJson<Result>(
          `${url}&limit=50${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`,
          controller.signal,
        );
        data = { ...result, items: [...(data?.items ?? []), ...result.items] };
        cursor = result.nextCursor ?? "";
        if (!cursor) break;
      }
      if (!controller.signal.aborted) set({ url, data, pages });
    })().catch((e) => {
      if (!controller.signal.aborted)
        set((old) => ({
          url,
          data: old.url === url ? old.data : undefined,
          error: e.message,
        }));
    });
    return () => controller.abort();
  }, [url, tick, pages]);
  return state.url === url ? state : { url };
}
