import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { createLocalDatabase } from "../server/local-database.mjs";
import { createLocalRuntimeHandler } from "../server/local-runtime.mjs";

test("local database executes mutations immediately and persists after restart", async (t) => {
  const directory = await mkdtemp(path.join(tmpdir(), "pi-local-database-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  let database = createLocalDatabase(directory);
  t.after(() => database.close());
  assert.deepEqual(database.listTables(), []);

  assert.equal(database.mutate("CREATE TABLE notes (id INTEGER PRIMARY KEY, body TEXT)").changes, 0);
  assert.equal(database.mutate("INSERT INTO notes (body) VALUES ('verified')").changes, 1);
  assert.deepEqual(database.listTables().map((table) => table.name), ["notes"]);
  assert.equal(database.describeTable("notes").preview.rows[0].body, "verified");
  assert.equal(database.query("SELECT body FROM notes").rows[0].body, "verified");
  database.close();
  database = createLocalDatabase(directory);
  assert.equal(database.query("SELECT body FROM notes").rows[0].body, "verified");
});

test("local database only permits one read-only query statement and caps results", async (t) => {
  const directory = await mkdtemp(path.join(tmpdir(), "pi-local-database-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const database = createLocalDatabase(directory);
  t.after(() => database.close());
  await assert.rejects(async () => database.query("CREATE TABLE no (id INTEGER)"), /仅支持/);
  await assert.rejects(async () => database.query("SELECT 1; SELECT 2"), /一条/);
  assert.throws(() => database.mutate("INSERT INTO no VALUES (1); DELETE FROM no"), /一条/);
  assert.throws(() => database.mutate("SELECT 1"), /仅支持/);
  const result = database.query("WITH RECURSIVE n(value) AS (SELECT 1 UNION ALL SELECT value + 1 FROM n WHERE value < 501) SELECT value FROM n");
  assert.equal(result.rows.length, 500);
  assert.equal(result.truncated, true);
});

test("local Runtime protects database routes and exposes direct mutations", async (t) => {
  const directory = await mkdtemp(path.join(tmpdir(), "pi-local-database-runtime-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const server = createServer(createLocalRuntimeHandler({ dataDirectory: directory, token: "database-token", mcpManager: {} }));
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;
  assert.equal((await fetch(`${baseUrl}/database/tables`)).status, 401);
  const headers = { Authorization: "Bearer database-token", "Content-Type": "application/json" };
  const createResponse = await fetch(`${baseUrl}/database/execute`, { method: "POST", headers, body: JSON.stringify({ sql: "CREATE TABLE runtime_notes (id INTEGER)" }) });
  assert.equal(createResponse.status, 200);
  const create = await createResponse.json();
  assert.equal(create.changes, 0);
  const tables = await fetch(`${baseUrl}/database/tables`, { headers }).then((response) => response.json());
  assert.deepEqual(tables.tables.map((table) => table.name), ["runtime_notes"]);
  assert.equal((await fetch(`${baseUrl}/database/mutations`, { method: "POST", headers, body: JSON.stringify({ sql: "CREATE TABLE stale_route (id INTEGER)" }) })).status, 404);
});
