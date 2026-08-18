type RouteContext = {
  params: Promise<{ segments: string[] }>;
};

async function forward(request: Request, context: RouteContext) {
  const runtimeUrl = process.env.LOCAL_RUNTIME_URL;
  const runtimeToken = process.env.LOCAL_RUNTIME_TOKEN;
  if (!runtimeUrl || !runtimeToken) {
    return Response.json(
      { message: "本机项目 Runtime 未启动，请使用 npm run dev 启动完整应用。" },
      { status: 503 },
    );
  }

  const { segments } = await context.params;
  if (
    !segments.length ||
    segments.some((segment) => !segment || segment === ".." || segment.includes("/"))
  ) {
    return Response.json({ message: "本机 Runtime 路径无效。" }, { status: 400 });
  }
  if (segments[0] === "trace-ingest") {
    return Response.json({ message: "Trace 写入端点仅供本机 Agent 服务使用。" }, { status: 403 });
  }

  const incomingUrl = new URL(request.url);
  const target = new URL(segments.map(encodeURIComponent).join("/"), `${runtimeUrl}/`);
  target.search = incomingUrl.search;
  const body = request.method === "GET" || request.method === "HEAD" ? undefined : await request.text();

  try {
    const response = await fetch(target, {
      method: request.method,
      headers: {
        Authorization: `Bearer ${runtimeToken}`,
        ...(body ? { "Content-Type": request.headers.get("content-type") ?? "application/json" } : {}),
      },
      body,
      cache: "no-store",
    });
    const headers = new Headers({ "Cache-Control": "no-store" });
    for (const name of [
      "content-type",
      "content-length",
      "content-disposition",
      "x-content-type-options",
    ]) {
      const value = response.headers.get(name);
      if (value) headers.set(name, value);
    }
    return new Response(response.body, {
      status: response.status,
      headers,
    });
  } catch {
    return Response.json(
      { message: "无法连接本机项目 Runtime，请重新执行 npm run dev。" },
      { status: 503 },
    );
  }
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const DELETE = forward;
