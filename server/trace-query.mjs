import { redactTraceText, redactTraceValue } from "./trace-redaction.mjs";

const fail = (message, status = 400) => {
  throw Object.assign(new Error(message), { status });
};
const active = new Set([
  "running",
  "queued",
  "planning",
  "executing",
  "pausing",
]);
const bad = new Set([
  "error",
  "failed",
  "interrupted",
  "aborted",
  "cancelled",
  "blocked",
  "success_with_warnings",
]);
const finished = new Set(["completed", "cancelled", "failed"]);
const stamp = (v) => v.updatedAt ?? v.startedAt ?? 0;
const statusGroup = (s) =>
  ({ completed: "success", failed: "error", cancelled: "aborted" })[s] ?? s;
const compare = (a, b) => stamp(b) - stamp(a) || b.id.localeCompare(a.id);
const sumKnown = (items) => {
  const known = items.filter(
    (n) => typeof n === "number" && Number.isFinite(n),
  );
  return known.length ? known.reduce((a, b) => a + b, 0) : undefined;
};
function page(items, filters = {}) {
  let rows = [...items].sort(compare);
  if (filters.cursor) {
    let c;
    try {
      c = JSON.parse(Buffer.from(filters.cursor, "base64url").toString());
    } catch {
      fail("Trace 游标无效。");
    }
    if (!c || !Number.isFinite(c.at) || typeof c.id !== "string")
      fail("Trace 游标无效。");
    rows = rows.filter(
      (r) =>
        stamp(r) < c.at || (stamp(r) === c.at && r.id.localeCompare(c.id) < 0),
    );
  }
  const limit = Math.min(100, Math.max(1, Number(filters.limit) || 50));
  const result = rows.slice(0, limit),
    last = result.at(-1);
  return {
    items: result,
    ...(rows.length > limit && last
      ? {
          nextCursor: Buffer.from(
            JSON.stringify({ at: stamp(last), id: last.id }),
          ).toString("base64url"),
        }
      : {}),
  };
}
function filterRows(rows, f) {
  if (f.from && !Number.isSafeInteger(Number(f.from))) fail("日期无效。");
  if (f.to && !Number.isSafeInteger(Number(f.to))) fail("日期无效。");
  if (f.from && f.to && Number(f.from) > Number(f.to))
    fail("开始日期不能晚于结束日期。");
  const q = (f.query ?? "").trim().toLowerCase();
  return rows.filter(
    (r) =>
      (!f.mode || r.mode === f.mode) &&
      (!f.status ||
        (f.status === "running"
          ? active.has(r.status)
          : statusGroup(r.status) === statusGroup(f.status))) &&
      (!f.from || stamp(r) >= Number(f.from)) &&
      (!f.to || stamp(r) <= Number(f.to)) &&
      (!q || r.search.toLowerCase().includes(q)),
  );
}
const publicRow = (row) => {
  const result = { ...row };
  delete result.search;
  return result;
};

export function createTraceQuery(
  traceStore,
  workflowStore,
  workspacePath = () => undefined,
) {
  function build(workspaceId) {
    if (!workspaceId) fail("缺少项目 ID。");
    const traces = traceStore.summaries(workspaceId);
    const byTrace = new Map(traces.map((t) => [t.id, t]));
    const workflows = workflowStore.traceRuns(workspaceId);
    const options = { workspacePath: workspacePath(workspaceId) };
    const text = (v) => redactTraceText(v, options);
    // Existing persisted workflow references are authoritative; never infer from question text.
    for (const run of workflows) {
      for (const traceId of run.traces ?? []) {
        const t = byTrace.get(traceId);
        if (!t || t.context) continue;
        const attempt = run.attempts.find((a) => a.traceId === traceId);
        const plan =
          run.revisions?.find((r) => r.version === attempt?.version)?.plan ??
          run.plan;
        const node = plan?.nodes.find((n) => n.id === attempt?.nodeId);
        const context = {
          mode: "workflow",
          workflowRunId: run.id,
          role: attempt ? "node" : "planner",
          legacy: true,
          ...(attempt
            ? {
                attemptId: attempt.id,
                nodeId: attempt.nodeId,
                nodeTitle: node?.title,
                agentId: node?.agentId,
                agentLabel: run.config?.customSubAgents?.find(
                  (a) => a.id === node?.agentId,
                )?.label,
                planVersion: attempt.version,
                attemptNumber:
                  run.attempts
                    .filter((a) => a.nodeId === attempt.nodeId)
                    .findIndex((a) => a.id === attempt.id) + 1,
              }
            : {}),
        };
        traceStore.linkContext(t.id, run.conversationId ?? run.id, context);
        t.context = context;
        t.conversationId = run.conversationId ?? run.id;
      }
    }
    const spans = traceStore.spanSummaries(workspaceId);
    const bySpan = new Map(spans.map((s) => [s.id, s]));
    const traceSpans = new Map();
    for (const s of spans) {
      const list = traceSpans.get(s.traceId) ?? [];
      list.push(s);
      traceSpans.set(s.traceId, list);
    }
    const metrics = (ids) => {
      const ss = [...new Set(ids)].flatMap((id) => traceSpans.get(id) ?? []);
      return {
        tools: ss.filter((s) => s.kind === "tool").length,
        tokens: sumKnown(
          ss.filter((s) => s.kind === "generation").map((s) => s.totalTokens),
        ),
        warnings: ss.filter(
          (s) =>
            (s.kind === "tool" || s.kind === "generation") &&
            (bad.has(s.status) ||
              s.attributes?.commandStatus === "command_failed" ||
              (typeof s.attributes?.exitCode === "number" &&
                s.attributes.exitCode !== 0)),
        ).length,
      };
    };
    const tasks = [],
      traceTask = new Map(),
      workflowById = new Map(workflows.map((r) => [r.id, r]));
    for (const run of workflows) {
      const ids = [
        ...new Set([
          ...(run.traces ?? []),
          ...traces
            .filter((t) => t.context?.workflowRunId === run.id)
            .map((t) => t.id),
        ]),
      ];
      const retained = ids.filter((id) => byTrace.has(id));
      // Cleared/expired traces stay cleared; workflow recovery remains in its own store.
      if (!retained.length) continue;
      const task = {
        id: run.id,
        sessionKey: `workflow:${run.conversationId ?? run.id}`,
        question: text(run.input),
        status: run.status,
        startedAt: run.createdAt,
        updatedAt: Math.max(
          run.updatedAt,
          ...retained.map((id) => byTrace.get(id).lastEventAt),
        ),
        ...(finished.has(run.status) ? { endedAt: run.updatedAt } : {}),
        traceIds: retained,
        ...metrics(retained),
        incomplete:
          !retained.length ||
          retained.length !== ids.length ||
          retained.some((id) => byTrace.get(id).context?.legacy),
        number: 0,
      };
      task.warnings = Math.max(
        task.warnings,
        run.attempts.filter((a) => bad.has(a.status)).length +
          retained.filter(
            (id) =>
              byTrace.get(id).context?.role === "planner" &&
              bad.has(byTrace.get(id).status),
          ).length,
      );
      tasks.push(task);
      retained.forEach((id) => traceTask.set(id, task));
    }
    for (const t of traces) {
      if (traceTask.has(t.id)) continue;
      const mode = t.context?.mode ?? "chat";
      const task = {
        id: t.context?.workflowRunId ?? t.id,
        sessionKey: `${mode}:${t.conversationId ?? t.id}`,
        question: t.question,
        status: t.status,
        startedAt: t.startedAt,
        updatedAt: t.lastEventAt,
        endedAt: t.endedAt,
        traceIds: [t.id],
        ...metrics([t.id]),
        incomplete: t.schemaVersion < 2 || !t.conversationId,
        number: 0,
      };
      const existing = tasks.find(
        (r) => r.id === task.id && r.sessionKey === task.sessionKey,
      );
      if (existing) {
        existing.traceIds.push(t.id);
        Object.assign(existing, metrics(existing.traceIds));
        traceTask.set(t.id, existing);
      } else {
        tasks.push(task);
        traceTask.set(t.id, task);
      }
    }
    const groups = new Map();
    for (const task of tasks) {
      const group = groups.get(task.sessionKey) ?? [];
      group.push(task);
      groups.set(task.sessionKey, group);
    }
    const sessions = [];
    for (const [id, group] of groups) {
      group.sort(
        (a, b) => a.startedAt - b.startedAt || a.id.localeCompare(b.id),
      );
      group.forEach((t, i) => {
        t.number = i + 1;
      });
      const latest = group.at(-1),
        first = group[0],
        mode = id.startsWith("workflow:") ? "workflow" : "chat";
      const trace = byTrace.get(first.traceIds[0]);
      const conversationId =
        mode === "workflow"
          ? (workflowById.get(first.id)?.conversationId ??
            trace?.conversationId)
          : trace?.conversationId;
      sessions.push({
        id,
        conversationId,
        mode,
        title: first.question,
        updatedAt: Math.max(...group.map(stamp)),
        status: latest.status,
        turns: group.length,
        tools: group.reduce((n, t) => n + t.tools, 0),
        tokens: sumKnown(group.map((t) => t.tokens)),
        warnings: group.reduce(
          (n, t) => n + Math.max(t.warnings, bad.has(t.status) ? 1 : 0),
          0,
        ),
        incomplete: group.some((t) => t.incomplete),
        search: [
          id,
          ...group.flatMap((t) => [t.id, t.question, ...t.traceIds]),
        ].join(" "),
      });
    }
    return {
      tasks,
      sessions,
      byTrace,
      traceSpans,
      traceTask,
      workflows: workflowById,
      bySpan,
      text,
      options,
    };
  }
  function session(data, key) {
    return (
      data.sessions.find((s) => s.id === key) ??
      fail("会话 Trace 不存在。", 404)
    );
  }
  function invocations(data) {
    const result = [];
    for (const [traceId, task] of data.traceTask) {
      const trace = data.byTrace.get(traceId),
        ss = data.traceSpans.get(traceId) ?? [],
        c = trace.context;
      for (const s of ss.filter(
        (s) => s.kind === "agent" && (s.parentSpanId || c?.role === "node"),
      )) {
        const parent = session(data, task.sessionKey);
        const children = ss.filter((candidate) => {
          let cursor = candidate,
            seen = new Set();
          while (cursor && !seen.has(cursor.id)) {
            if (cursor.id === s.id) return true;
            seen.add(cursor.id);
            cursor = data.bySpan.get(cursor.parentSpanId);
          }
          return false;
        });
        const nodeAttempt = data.workflows
          .get(task.id)
          ?.attempts.find((a) => a.id === c?.attemptId);
        result.push({
          id: s.id,
          sessionKey: task.sessionKey,
          conversationId: parent.conversationId,
          sessionTitle: parent.title,
          mode: parent.mode,
          taskId: task.id,
          traceId,
          spanId: s.id,
          label: c?.agentLabel ?? s.agentLabel ?? "Subagent",
          question: s.task ?? c?.nodeTitle ?? "历史记录未保存任务输入",
          status: nodeAttempt?.status ?? s.status,
          workflowOutcome: ["completed", "blocked"].includes(nodeAttempt?.status)
            ? nodeAttempt.status
            : undefined,
          startedAt: s.startedAt,
          updatedAt: s.endedAt ?? trace.lastEventAt,
          endedAt: s.endedAt,
          tools: children.filter((n) => n.kind === "tool").length,
          attemptNumber: c?.attemptNumber,
          planVersion: c?.planVersion,
          search: [
            traceId,
            task.sessionKey,
            s.agentLabel,
            s.task,
            c?.nodeTitle,
            parent.title,
          ].join(" "),
        });
      }
    }
    // Setup failures before a PI agent existed still represent real node attempts.
    for (const task of data.tasks) {
      const run = data.workflows.get(task.id);
      if (!run) continue;
      for (const a of run.attempts) {
        if (
          result.some(
            (r) => r.taskId === task.id && r.traceId && r.traceId === a.traceId,
          )
        )
          continue;
        const plan =
          run.revisions?.find((r) => r.version === a.version)?.plan ?? run.plan;
        const node = plan?.nodes.find((n) => n.id === a.nodeId);
        const label =
          run.config?.customSubAgents?.find((p) => p.id === node?.agentId)
            ?.label ?? a.nodeId;
        result.push({
          id: a.id,
          sessionKey: task.sessionKey,
          sessionTitle: task.question,
          mode: "workflow",
          taskId: task.id,
          traceId: data.byTrace.has(a.traceId) ? a.traceId : undefined,
          label: data.text(label),
          question: data.text(node?.task ?? a.nodeId),
          status: a.status,
          workflowOutcome: ["completed", "blocked"].includes(a.status)
            ? a.status
            : undefined,
          startedAt: a.startedAt,
          updatedAt: a.endedAt ?? task.updatedAt,
          endedAt: a.endedAt,
          tools: 0,
          attemptNumber:
            run.attempts
              .filter((n) => n.nodeId === a.nodeId)
              .findIndex((n) => n.id === a.id) + 1,
          planVersion: a.version,
          search: [task.sessionKey, node?.task, a.nodeId, label].join(" "),
        });
      }
    }
    return result;
  }
  function messages(data, key, invocationId) {
    const s = session(data, key),
      tasks = data.tasks
        .filter((t) => t.sessionKey === key)
        .sort((a, b) => a.number - b.number);
    let output = [];
    if (invocationId) {
      const inv =
        invocations(data).find(
          (i) => i.id === invocationId && i.sessionKey === key,
        ) ?? fail("Subagent 调用不存在。", 404);
      if (inv.traceId && inv.spanId) {
        output = traceStore
          .messageSnapshots(inv.traceId)
          .filter((m) => m.spanId === inv.spanId)
          .map((m) => ({ ...m, taskId: inv.taskId }));
      }
      if (!output.length) {
        const detail = taskDetail(data, key, inv.taskId);
        const a = detail.attempts.find(
          (a) => a.id === invocationId || a.traceId === inv.traceId,
        );
        const trace = detail.traces.find((t) => t.run.id === inv.traceId);
        const ss = trace?.spans ?? [];
        const root = ss.find((n) => n.id === inv.spanId);
        const input = root?.input?.task ?? a?.input;
        if (input)
          output.push({
            id: `${inv.id}:input`,
            traceId: inv.traceId ?? "",
            spanId: inv.spanId,
            taskId: inv.taskId,
            role: "user",
            label: "任务",
            content: typeof input === "string" ? input : JSON.stringify(input),
            createdAt: inv.startedAt,
            legacy: true,
          });
        const reply =
          a?.output?.text ??
          ss
            .filter((n) => {
              if (n.kind !== "generation" || !root) return false;
              const seen = new Set();
              let parent = n.parentSpanId;
              while (parent && !seen.has(parent)) {
                if (parent === root.id) return true;
                seen.add(parent);
                parent = ss.find((p) => p.id === parent)?.parentSpanId;
              }
              return false;
            })
            .map((n) => n.output?.text ?? "")
            .join("\n");
        if (reply)
          output.push({
            id: `${inv.id}:reply`,
            traceId: inv.traceId ?? "",
            spanId: inv.spanId,
            taskId: inv.taskId,
            role: "assistant",
            label: inv.label,
            content: reply,
            legacy: true,
          });
      }
    } else if (s.mode === "workflow" && s.conversationId) {
      const allowed = new Map(tasks.map((t) => [t.id, t]));
      output = workflowStore
        .messages(s.conversationId)
        .filter((m) => allowed.has(m.runId))
        .map((m) => ({
          id: m.id,
          traceId: allowed.get(m.runId).traceIds[0] ?? "",
          taskId: m.runId,
          role: m.role,
          kind: m.kind,
          label:
            m.role === "user"
              ? "用户"
              : m.kind === "plan"
                ? "Plan Agent"
                : "Agent",
          content: m.content,
          createdAt: m.createdAt,
          legacy: !m.createdAt,
        }));
    } else {
      for (const task of tasks)
        for (const id of task.traceIds) {
          const roots = new Set(
            (data.traceSpans.get(id) ?? [])
              .filter((s) => s.kind === "agent" && !s.parentSpanId)
              .map((s) => s.id),
          );
          const snapshots = traceStore
            .messageSnapshots(id)
            .filter((m) => roots.has(m.spanId));
          if (snapshots.length)
            output.push(...snapshots.map((m) => ({ ...m, taskId: task.id })));
          else {
            const t = data.byTrace.get(id),
              reply = traceStore.legacyReply(id);
            output.push({
              id: `${id}:user`,
              traceId: id,
              taskId: task.id,
              role: "user",
              content: t.question,
              createdAt: t.startedAt,
              legacy: true,
            });
            if (reply)
              output.push({
                id: `${id}:assistant`,
                traceId: id,
                taskId: task.id,
                role: "assistant",
                content: reply,
                model: t.modelId,
                legacy: true,
              });
          }
        }
    }
    // Ordering uses persisted sequence for old messages with no timestamp; timestamps are never invented for display.
    return output.map((m, i) => ({
      ...m,
      content: data.text(m.content),
      updatedAt: i,
    }));
  }
  function taskDetail(data, key, taskId) {
    session(data, key);
    const task =
      data.tasks.find((t) => t.sessionKey === key && t.id === taskId) ??
      fail("任务 Trace 不存在。", 404);
    const run = data.workflows.has(taskId)
      ? workflowStore.get(taskId)
      : undefined;
    const attempts =
      run?.attempts.map((a) => {
        const plan =
          run.revisions?.find((r) => r.version === a.version)?.plan ?? run.plan;
        const node = plan?.nodes.find((n) => n.id === a.nodeId);
        return {
          id: a.id,
          nodeId: a.nodeId,
          title: data.text(node?.title ?? a.nodeId),
          agentLabel: data.text(
            run.config?.customSubAgents?.find((p) => p.id === node?.agentId)
              ?.label ?? a.nodeId,
          ),
          version: a.version,
          number:
            run.attempts
              .filter((p) => p.nodeId === a.nodeId)
              .findIndex((p) => p.id === a.id) + 1,
          accepted: run.accepted?.[a.nodeId] === a.id,
          status: a.status,
          executionStatus: data.byTrace.get(a.traceId)?.status,
          workflowOutcome: ["completed", "blocked"].includes(a.status)
            ? a.status
            : undefined,
          startedAt: a.startedAt,
          endedAt: a.endedAt,
          traceId: a.traceId,
          dependencies: node?.dependencies ?? [],
          input: redactTraceValue(a.input, data.options),
          output: redactTraceValue(a.result, data.options),
          error: redactTraceValue(a.error, data.options),
        };
      }) ?? [];
    return {
      task,
      observedAt: Date.now(),
      traces: task.traceIds.map((id) => {
        const d = traceStore.getTrace(id),
          workflowAttempt = run?.attempts.find(
            (attempt) => attempt.traceId === id,
          );
        return {
          ...d,
          run: {
            ...d.run,
            question: data.text(d.run.question),
            output:
              d.run.output === undefined ? undefined : data.text(d.run.output),
            workflowOutcome: ["completed", "blocked"].includes(
              workflowAttempt?.status,
            )
              ? workflowAttempt.status
              : undefined,
          },
          spans: d.spans.map((s) => ({
            ...s,
            input: redactTraceValue(s.input, data.options),
            output: redactTraceValue(s.output, data.options),
            error: redactTraceValue(s.error, data.options),
            attributes: redactTraceValue(s.attributes, data.options),
          })),
          events: d.events.map((e) => ({
            ...e,
            payload: redactTraceValue(e.payload, data.options),
          })),
          messages: d.messages.map((m) => ({
            ...m,
            content: data.text(m.content),
          })),
        };
      }),
      attempts,
    };
  }
  return {
    query(segments, f) {
      const data = build(f.workspaceId);
      if (segments[0] === "context") {
        const task =
          data.traceTask.get(segments[1]) ?? fail("Trace 不存在。", 404);
        const t = data.byTrace.get(segments[1]);
        const root = (data.traceSpans.get(t.id) ?? []).find(
          (s) => s.kind === "agent" && !s.parentSpanId,
        );
        return {
          sessionKey: task.sessionKey,
          taskId: task.id,
          traceId: t.id,
          spanId: root?.id,
        };
      }
      if (segments[0] === "invocations")
        return page(filterRows(invocations(data), f).map(publicRow), f);
      if (segments[0] !== "sessions") fail("Trace 接口不存在。", 404);
      const key = segments[1];
      if (!key) return page(filterRows(data.sessions, f).map(publicRow), f);
      const summary = publicRow(session(data, key));
      if (segments[2] === "messages") {
        const q = (f.query ?? "").trim().toLowerCase();
        return page(
          messages(data, key, f.invocationId).filter(
            (m) => !q || m.content.toLowerCase().includes(q),
          ),
          f,
        );
      }
      if (segments[2] === "tasks" && segments[3])
        return taskDetail(data, key, segments[3]);
      return {
        session: summary,
        ...page(
          data.tasks.filter((t) => t.sessionKey === key),
          f,
        ),
      };
    },
  };
}
