import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const runner = await readFile(new URL("../scripts/run-local.mjs", import.meta.url), "utf8");
const vite = await readFile(new URL("../vite.config.ts", import.meta.url), "utf8");

test("chat bootstrap reads SQLite, retries Runtime failures and never overwrites legacy storage", () => {
  assert.match(page, /\/api\/local\/chat\/conversations/);
  assert.match(page, /CHAT_BOOT_RETRY_DELAYS_MS/);
  assert.match(page, /CHAT_LEGACY_MIGRATION_KEY/);
  assert.match(page, /originMigrationRequired && legacyConversations\.length > 0/);
  assert.match(page, /\.\.\.parseStoredConversations\(localStorage\.getItem\(LEGACY_STORAGE_KEY\)\)/);
  assert.match(page, /\.\.\.parseStoredConversations\(localStorage\.getItem\(STORAGE_KEY\)\)/);
  assert.match(page, /历史不会被覆盖/);
  assert.doesNotMatch(page, /localStorage\.setItem\(STORAGE_KEY/);
});

test("full launcher waits for Runtime and keeps a strict canonical web origin", () => {
  assert.match(runner, /await waitForRuntime/);
  assert.match(runner, /"--hostname", "localhost", "--port", "3000"/);
  assert.match(vite, /strictPort: true/);
});
