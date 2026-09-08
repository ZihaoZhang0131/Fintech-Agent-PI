import assert from "node:assert/strict";
import test from "node:test";

import { createConversationPersistence } from "../lib/chat-persistence.ts";

const value = (id, updatedAt, content = String(updatedAt)) => ({ id, updatedAt, content });

test("conversation persistence coalesces streaming writes and skips seeded snapshots", async () => {
  const writes = [];
  const persistence = createConversationPersistence({
    put: async (conversation) => writes.push(conversation),
    remove: async () => {},
    debounceMs: 5,
  });
  persistence.seed([value("conversation-1", 1)]);
  await persistence.save(value("conversation-1", 1));
  await persistence.save(value("conversation-1", 2));
  await persistence.save(value("conversation-1", 3));
  await persistence.flush();
  assert.deepEqual(writes, [value("conversation-1", 3)]);
  persistence.dispose();
});

test("conversation persistence serializes an in-flight write before its newer snapshot", async () => {
  const writes = [];
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  const persistence = createConversationPersistence({
    put: async (conversation) => {
      writes.push(conversation);
      if (conversation.updatedAt === 1) await gate;
    },
    remove: async () => {},
  });
  const first = persistence.save(value("conversation-1", 1), true);
  await new Promise((resolve) => setImmediate(resolve));
  void persistence.save(value("conversation-1", 2));
  release();
  await first;
  await persistence.flush();
  assert.deepEqual(writes, [value("conversation-1", 1), value("conversation-1", 2)]);
  persistence.dispose();
});

test("conversation persistence retries without discarding the latest snapshot", async () => {
  let attempts = 0;
  const errors = [];
  const writes = [];
  const persistence = createConversationPersistence({
    put: async (conversation) => {
      attempts += 1;
      if (attempts === 1) throw new Error("runtime unavailable");
      writes.push(conversation);
    },
    remove: async () => {},
    onError: (error) => errors.push(error.message),
    retryDelaysMs: [1],
  });
  await assert.rejects(persistence.saveNow(value("conversation-1", 1)), /runtime unavailable/);
  await persistence.save(value("conversation-1", 2), true);
  assert.deepEqual(errors, ["runtime unavailable"]);
  assert.deepEqual(writes, [value("conversation-1", 2)]);
  persistence.dispose();
});

test("conversation persistence makes deletion win over an older pending write", async () => {
  const writes = [];
  const deletes = [];
  const persistence = createConversationPersistence({
    put: async (conversation) => writes.push(conversation),
    remove: async (id) => deletes.push(id),
  });
  await persistence.save(value("conversation-1", 1));
  await persistence.delete("conversation-1");
  await persistence.flush();
  assert.deepEqual(writes, []);
  assert.deepEqual(deletes, ["conversation-1"]);
  persistence.dispose();
});
