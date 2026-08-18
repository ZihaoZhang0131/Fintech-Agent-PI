import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const databasePageSource = await readFile(new URL("../components/database-page.tsx", import.meta.url), "utf8");
const globalStylesSource = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
const capabilitySource = await readFile(new URL("../app/api/capabilities/route.ts", import.meta.url), "utf8");
const chatRouteSource = await readFile(new URL("../app/api/chat/stream/route.ts", import.meta.url), "utf8");
const agentToolSource = await readFile(new URL("../server/agent/tools/local-database.ts", import.meta.url), "utf8");

test("database has a bottom sidebar entry and a read-only SQL workspace", () => {
  assert.match(pageSource, /<span>数据库<\/span>/);
  assert.match(pageSource, /<DatabasePage onClose=/);
  assert.match(databasePageSource, /<span>SQL 查询<\/span><small>只读<\/small>/);
  assert.doesNotMatch(databasePageSource, /LOCAL SQLITE|tableDetails\.sql/);
  assert.match(databasePageSource, /\/api\/local\/database\/query/);
  assert.match(databasePageSource, /\/api\/local\/database\/tables/);
});

test("database keeps a compact data-first layout on narrow screens", () => {
  assert.match(databasePageSource, /className="database-table-items"/);
  assert.match(globalStylesSource, /@media \(max-width: 720px\)[\s\S]*\.database-table-items \{[\s\S]*overflow-x: auto/);
  assert.match(globalStylesSource, /\.database-workspace \{[\s\S]*grid-template-columns: minmax\(150px, 190px\) minmax\(0, 1fr\)/);
});

test("database Agent tools are cataloged and mutations execute directly", () => {
  assert.match(capabilitySource, /mutate_local_database/);
  assert.match(chatRouteSource, /createLocalDatabaseTools/);
  assert.match(chatRouteSource, /完成后报告受影响行数/);
  assert.doesNotMatch(chatRouteSource, /approvalKind: "database"/);
  assert.match(agentToolSource, /\/database\/execute/);
});

test("database writes have no separate approval dialog or queue", () => {
  assert.doesNotMatch(pageSource, /databaseApprovalQueue|确认修改本地数据库|允许并执行/);
  assert.doesNotMatch(chatRouteSource, /等待用户确认/);
});
