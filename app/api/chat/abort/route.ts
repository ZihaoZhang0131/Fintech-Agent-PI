import { LocalRuntimeTraceSink } from "@/server/agent/trace/trace-sink";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null) as { traceId?: unknown } | null;
  const traceId = typeof payload?.traceId === "string" ? payload.traceId.trim() : "";
  if (!/^[a-f0-9-]{20,64}$/i.test(traceId)) {
    return Response.json({ message: "Trace ID 不合法。" }, { status: 400 });
  }
  try {
    const result = await new LocalRuntimeTraceSink().abort(traceId);
    return Response.json(result ?? { accepted: true }, { status: 202 });
  } catch {
    return Response.json({ message: "停止信号暂时无法写入本机 Runtime。" }, { status: 503 });
  }
}
