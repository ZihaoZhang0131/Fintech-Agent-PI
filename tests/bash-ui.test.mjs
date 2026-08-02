import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

test("new and legacy conversations default to automatic project-sandbox Bash", () => {
  assert.match(pageSource, /bashApprovalMode: "auto"/);
  assert.match(pageSource, /bashPermissionMode: "sandbox"/);
  assert.match(pageSource, /conversation\.bashApprovalMode === "ask" \? "ask" : "auto"/);
  assert.match(pageSource, /conversation\.bashPermissionMode === "full" \? "full" : "sandbox"/);
});

test("composer exposes per-conversation Bash controls and full-permission confirmation", () => {
  assert.match(pageSource, /自动执行/);
  assert.match(pageSource, /每条确认/);
  assert.match(pageSource, /项目沙箱/);
  assert.match(pageSource, /开启完整本机权限/);
  assert.match(pageSource, /bashApprovalMode: activeConversation\.bashApprovalMode/);
  assert.match(pageSource, /bashPermissionMode: activeConversation\.bashPermissionMode/);
});

test("Bash approval events are rendered with allow and reject actions", () => {
  assert.match(pageSource, /tool_approval_required/);
  assert.match(pageSource, /decideBashCommand\(message\.id, run, "approve"\)/);
  assert.match(pageSource, /decideBashCommand\(message\.id, run, "reject"\)/);
  assert.match(pageSource, /查看命令输出/);
});
