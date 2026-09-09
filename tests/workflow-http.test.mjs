import assert from "node:assert/strict";
import test from "node:test";
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createWorkflowHttp } from "../server/workflow/http.mjs";
import { createSkillStore } from "../server/skill-store.mjs";
const agentId = "custom-reader-12345678";
const profile = {
  id: agentId,
  label: "读取员",
  description: "test",
  enabled: true,
  enabledTools: ["read_project_file"],
  enabledSkills: [],
  enabledMcps: [],
};
const payload = () => ({
  requestId: randomUUID(),
  workspaceId: "workspace-one",
  input: "测试公司",
  model: { providerId: "deepseek", modelId: "deepseek-v4-pro" },
  agentConfig: { customSubAgents: [profile] },
});
async function fixture(t) {
  const directory = await mkdtemp(path.join(tmpdir(), "workflow-http-"));
  const service = createWorkflowHttp({
    dataDirectory: directory,
    skillStore: createSkillStore(directory),
    verifyModel: async () => {},
    findWorkspace: async (id) => ({ id, name: id }),
    readJsonBody: async (request) => {
      let body = "";
      for await (const chunk of request) body += chunk;
      return JSON.parse(body);
    },
    sendJson: (response, status, value) => {
      response.writeHead(status, { "Content-Type": "application/json" });
      response.end(JSON.stringify(value));
    },
    runners: {
      plan: async ({ run }) =>
        run.plan
          ? { type: "finish", summary: "ok" }
          : {
              type: "plan",
              plan: {
                title: "test",
                nodes: [
                  {
                    id: "one",
                    agentId,
                    title: "读取",
                    task: "读取测试公司文件",
                    dependencies: [],
                    acceptance: "真实读取",
                    requires: {
                      tools: ["read_project_file"],
                      skills: [],
                      mcps: [],
                    },
                    outputs: [
                      { id: "result", kind: "text", required: true },
                    ],
                  },
                ],
              },
              reason: "test",
            },
      executeNode: async () => {
        await new Promise((r) => setTimeout(r, 20));
        return {
          status: "completed",
          text: "完整结果",
          summary: "ok",
          sources: [],
          artifacts: [],
          issues: [],
          nextAction: "continue",
        };
      },
    },
  });
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      await service.handle(
        req,
        res,
        url,
        url.pathname.split("/").filter(Boolean),
      );
    } catch (e) {
      res.writeHead(e.status ?? 500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: e.message }));
    }
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const url = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => {
    await service.close();
    server.closeAllConnections();
    await new Promise((r) => server.close(r));
    await rm(directory, { recursive: true, force: true });
  });
  async function request(route, body) {
    const response = await fetch(url + route, {
      ...(body
        ? {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        : {}),
    });
    return { status: response.status, value: await response.json() };
  }
  return { service, url, request };
}
async function done(service, id) {
  for (let i = 0; i < 100; i++) {
    if (service.store.get(id).status === "completed")
      return service.store.get(id);
    await new Promise((r) => setTimeout(r, 10));
  }
  throw Error("timeout");
}
test("HTTP creates once under concurrent retries; changed body conflicts; details are lazy", async (t) => {
  const { request, service } = await fixture(t);
  const p = payload();
  const [a, b] = await Promise.all([
    request("/workflows/runs", p),
    request("/workflows/runs", p),
  ]);
  assert.equal(a.status, 201);
  assert.equal(a.value.id, b.value.id);
  assert.equal(service.store.list().length, 1);
  assert.equal(
    (await request("/workflows/runs", { ...p, input: "different" })).status,
    409,
  );
  const r = await done(service, a.value.id);
  const snapshot = await request(`/workflows/runs/${r.id}`);
  assert.equal(snapshot.value.attempts[0].result.text, "");
  const details = await request(
    `/workflows/runs/${r.id}/attempts/${r.attempts[0].id}`,
  );
  assert.equal(details.value.attempt.result.text, "完整结果");
});
test("template versions are immutable and cross-project reuse requires capable mapping", async (t) => {
  const { request, service } = await fixture(t);
  const created = await request("/workflows/runs", payload()),
    r = await done(service, created.value.id);
  const saved = await request("/workflows/templates", {
    requestId: randomUUID(),
    runId: r.id,
    version: 1,
    name: "研究模板",
    parameters: { 公司: "测试公司" },
  });
  assert.equal(saved.status, 200);
  const t1 = saved.value;
  const before = JSON.stringify(t1.versions[0]);
  await request("/workflows/templates", {
    requestId: randomUUID(),
    id: t1.id,
    runId: r.id,
    version: 1,
    name: "研究模板",
    description: "第二版",
  });
  assert.equal(
    JSON.stringify(service.store.template(t1.id).versions[0]),
    before,
  );
  const p = {
    ...payload(),
    workspaceId: "workspace-two",
    templateId: t1.id,
    templateVersion: 1,
    parameters: { 公司: "新公司" },
  };
  assert.equal((await request("/workflows/runs", p)).status, 400);
  const okay = await request("/workflows/runs", {
    ...p,
    requestId: randomUUID(),
    mapping: { [agentId]: agentId },
  });
  assert.equal(okay.status, 201);
  const weaker = {
    ...payload(),
    workspaceId: "workspace-two",
    templateId: t1.id,
    mapping: { [agentId]: agentId },
    agentConfig: { customSubAgents: [{ ...profile, enabledTools: [] }] },
  };
  const denied = await request("/workflows/runs", weaker);
  assert.equal(denied.status, 400);
  assert.match(denied.value.message, /缺少模板能力/);
});
test("SSE replays after a cursor; disconnecting does not cancel the run", async (t) => {
  const { request, service, url } = await fixture(t);
  const created = await request("/workflows/runs", payload());
  const controller = new AbortController();
  const response = await fetch(
    `${url}/workflows/runs/${created.value.id}/events?after=0`,
    { signal: controller.signal },
  );
  assert.match(response.headers.get("content-type"), /text\/event-stream/);
  const reader = response.body.getReader(),
    chunk = await reader.read();
  assert.match(new TextDecoder().decode(chunk.value), /id: 1/);
  controller.abort();
  const r = await done(service, created.value.id);
  const response2 = await fetch(
    `${url}/workflows/runs/${r.id}/events?after=${r.seq - 1}`,
  );
  const reader2 = response2.body.getReader();
  const { value } = await reader2.read();
  assert.match(new TextDecoder().decode(value), new RegExp(`id: ${r.seq}`));
  await reader2.cancel();
  assert.equal(service.store.get(r.id).status, "completed");
});

test("conversation messages create successive runs with bounded history and stable messages", async (t) => {
  const { request, service } = await fixture(t);
  const { value: c } = await request("/workflows/conversations", {
    requestId: randomUUID(),
    workspaceId: "workspace-one",
  });
  const p = payload();
  const [a, b] = await Promise.all([
    request(`/workflows/conversations/${c.id}/messages`, p),
    request(`/workflows/conversations/${c.id}/messages`, p),
  ]);
  assert.equal(a.status, 200);
  assert.equal(a.value.id, b.value.id);
  const first = await done(service, a.value.id);
  let snapshot = (await request(`/workflows/conversations/${c.id}`)).value;
  assert.equal(snapshot.runs.length, 1);
  assert.deepEqual(
    snapshot.messages.map((m) => m.kind),
    ["text", "plan", "text"],
  );
  assert.equal(new Set(snapshot.messages.map((m) => m.id)).size, 3);
  const next = await request(`/workflows/conversations/${c.id}/messages`, {
    ...payload(),
    input: "基于前文继续",
  });
  assert.equal(next.status, 200);
  const second = await done(service, next.value.id);
  assert.deepEqual(second.historyRunIds, [first.id]);
  assert.ok(second.history.some((m) => m.content === "ok"));
  snapshot = (await request(`/workflows/conversations/${c.id}`)).value;
  assert.equal(snapshot.runs.length, 2);
  assert.equal(snapshot.messages.length, 6);
  assert.equal(service.store.conversations("workspace-one").length, 1);
});

test("active conversation feedback is durable and idempotent without creating another run", async (t) => {
  const { request, service } = await fixture(t);
  const { value: c } = await request("/workflows/conversations", {
    requestId: randomUUID(),
    workspaceId: "workspace-one",
  });
  const { value: created } = await request(
    `/workflows/conversations/${c.id}/messages`,
    payload(),
  );
  const run = service.store.get(created.id);
  run.status = "waiting_input";
  service.store.save(run);
  const p = { requestId: randomUUID(), input: "请使用补充数据" };
  const responses = await Promise.all([
    request(`/workflows/conversations/${c.id}/messages`, p),
    request(`/workflows/conversations/${c.id}/messages`, p),
  ]);
  assert.ok(responses.every((r) => r.status === 200));
  assert.equal(service.store.conversation(c.id).runIds.length, 1);
  assert.equal(
    service.store.messages(c.id).filter((m) => m.content === p.input).length,
    1,
  );
  assert.equal(
    service.store.get(created.id).instructions.filter((s) => s === p.input)
      .length,
    1,
  );
});

test("interrupt is idempotent and resumable while stop remains terminal", async (t) => {
  const { request, service } = await fixture(t);
  const created = await request("/workflows/runs", payload());
  while (!service.store.get(created.value.id).plan)
    await new Promise((resolve) => setTimeout(resolve, 2));
  const planned = service.store.get(created.value.id);
  const interrupt = {
    requestId: randomUUID(),
    expectedVersion: planned.version,
    type: "interrupt",
  };
  const [first, repeated] = await Promise.all([
    request(`/workflows/runs/${created.value.id}/actions`, interrupt),
    request(`/workflows/runs/${created.value.id}/actions`, interrupt),
  ]);
  assert.equal(first.status, 200);
  assert.equal(repeated.status, 200);
  assert.equal(first.value.run.status, "interrupted");
  assert.equal(repeated.value.run.status, "interrupted");
  while (service.engine.active.size)
    await new Promise((resolve) => setTimeout(resolve, 5));
  const current = service.store.get(created.value.id);
  const resumed = await request(
    `/workflows/runs/${created.value.id}/actions`,
    {
      requestId: randomUUID(),
      expectedVersion: current.version,
      type: "resume",
    },
  );
  assert.equal(resumed.status, 200);
  assert.equal((await done(service, created.value.id)).status, "completed");

  const stopped = await request("/workflows/runs", {
    ...payload(),
    requestId: randomUUID(),
  });
  const stoppedRun = service.store.get(stopped.value.id);
  const stop = await request(
    `/workflows/runs/${stopped.value.id}/actions`,
    {
      requestId: randomUUID(),
      expectedVersion: stoppedRun.version,
      type: "stop",
    },
  );
  assert.equal(stop.value.run.status, "cancelled");
  const cannotResume = await request(
    `/workflows/runs/${stopped.value.id}/actions`,
    {
      requestId: randomUUID(),
      expectedVersion: service.store.get(stopped.value.id).version,
      type: "resume",
    },
  );
  assert.equal(cannotResume.status, 409);
});
