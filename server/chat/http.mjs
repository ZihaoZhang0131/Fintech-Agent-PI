import { createChatSessionManager } from "./manager.mjs";
import { fail } from "./store.mjs";

export function createChatHttp(options) {
  const manager = createChatSessionManager(options);
  const { readJsonBody, sendJson } = options;
  const streams = new Set();
  async function handle(req, res, url, parts) {
    if (parts[0] !== "chat" || parts[1] !== "threads" || !parts[2]) return false;
    const id = parts[2];
    if (!/^[\w-]{8,200}$/.test(id)) throw fail("会话 ID 无效。");
    if (req.method === "GET" && parts.length === 3) { sendJson(res, 200, manager.snapshot(id, { beforeMessageId: url.searchParams.get("beforeMessageId") ?? undefined, limit: url.searchParams.has("limit") ? Number(url.searchParams.get("limit")) : undefined })); return true; }
    if (req.method === "POST" && parts[3] === "turns" && parts.length === 4) {
      sendJson(res, 202, { turn: manager.start(id, await readJsonBody(req)) }); return true;
    }
    if (req.method === "POST" && parts[3] === "compact" && parts.length === 4) {
      const body = await readJsonBody(req); const snapshot = manager.snapshot(id);
      if (!snapshot.thread.config) throw fail("请先在本会话发送消息。", 409);
      sendJson(res, 202, { turn: manager.start(id, { clientRequestId: body.clientRequestId, input: "压缩会话上下文", config: snapshot.thread.config, operation: "compact" }) }); return true;
    }
    if (req.method === "POST" && parts[3] === "turns" && parts[4] && parts.length === 6) {
      const body = await readJsonBody(req);
      if (parts[5] === "steer") sendJson(res, 202, { input: manager.steer(id, parts[4], body) });
      else if (parts[5] === "interrupt") sendJson(res, 200, { turn: await manager.interrupt(id, parts[4]) });
      else if (parts[5] === "continue") sendJson(res, 202, { turn: manager.resume(id, parts[4], body.clientRequestId) });
      else throw fail("聊天操作不存在。", 404);
      return true;
    }
    if (req.method === "GET" && parts[3] === "events" && parts.length === 4) {
      const snapshot = manager.snapshot(id);
      let cursor = Number(url.searchParams.get("afterSeq") ?? 0);
      if (!Number.isSafeInteger(cursor) || cursor < 0 || cursor > snapshot.seq) throw fail("事件游标无效，请重新读取快照。");
      res.writeHead(200, { "Content-Type": "text/event-stream; charset=utf-8", "Cache-Control": "no-cache, no-transform", "X-Accel-Buffering": "no", Connection: "keep-alive" });
      // Replay and subscription registration are synchronous on the same event
      // loop; a slow consumer reconnects from its last received sequence.
      const write = event => {
        if (event.seq <= cursor || res.destroyed) return;
        cursor = event.seq;
        if (!res.write(`id: ${event.seq}\ndata: ${JSON.stringify(event)}\n\n`)) res.destroy();
      };
      const unsubscribe = manager.subscribe(id, write);
      let batch;
      do { batch = manager.events(id, cursor); for (const e of batch) write(e); } while (!res.destroyed && batch.length === 500);
      const timer = setInterval(() => { if (!res.destroyed) res.write(": heartbeat\n\n"); }, 15000);
      const close = () => { clearInterval(timer); unsubscribe(); streams.delete(res); };
      streams.add(res); res.on("close", close); res.on("error", close);
      return true;
    }
    throw fail("聊天端点不存在。", 404);
  }
  return { handle, manager, async close() { for (const res of streams) res.end(); await manager.close(); } };
}
