import assert from "node:assert/strict";
import test from "node:test";
import { createWorkflowFileRefresh } from "../lib/workflow-file-refresh.ts";

function fixture() {
  let now = 0;
  let pending;
  const calls = [];
  const refresh = createWorkflowFileRefresh(() => calls.push(now), {
    now: () => now,
    schedule(callback, delay) { pending = { callback, at: now + delay }; return 1; },
    cancel() { pending = undefined; },
  });
  return {
    ...refresh, calls,
    advance(ms) {
      now += ms;
      if (pending && pending.at <= now) {
        const callback = pending.callback;
        pending = undefined;
        callback();
      }
    },
  };
}

test("first snapshot refreshes, unchanged polling does not", () => {
  const f = fixture();
  f.observe([]);
  f.advance(4000);
  f.observe([]);
  assert.deepEqual(f.calls, [0]);
  f.observe([{ id: "run-a", seq: 1 }]);
  f.advance(4000);
  f.observe([{ id: "run-a", seq: 1 }]);
  assert.deepEqual(f.calls, [0, 4000]);
});

test("bursts coalesce with a trailing refresh even after the run stops changing", () => {
  const f = fixture();
  f.observe([{ id: "run-a", seq: 1 }]);
  f.advance(100);
  f.observe([{ id: "run-a", seq: 2 }]);
  f.advance(100);
  f.observe([{ id: "run-a", seq: 3 }]);
  f.advance(1799);
  assert.deepEqual(f.calls, [0]);
  f.advance(1);
  assert.deepEqual(f.calls, [0, 2000]);
  f.advance(2000);
  f.observe([{ id: "run-a", seq: 3 }]);
  assert.deepEqual(f.calls, [0, 2000]);
});

test("reconnected snapshots and new run IDs refresh without replaying every missed event", () => {
  const f = fixture();
  f.observe([{ id: "run-a", seq: 1 }]);
  f.advance(10000);
  f.observe([{ id: "run-a", seq: 40 }]);
  f.advance(2000);
  f.observe([{ id: "run-b", seq: 40 }]);
  assert.deepEqual(f.calls, [0, 10000, 12000]);
});

test("leaving a conversation cancels pending refresh and ignores late snapshots", () => {
  const f = fixture();
  f.observe([{ id: "run-a", seq: 1 }]);
  f.advance(100);
  f.observe([{ id: "run-a", seq: 2 }]);
  f.dispose();
  f.advance(2000);
  f.observe([{ id: "run-a", seq: 3 }]);
  assert.deepEqual(f.calls, [0]);
});
