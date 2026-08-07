import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const styleSource = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

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

test("model, Bash execution, and Agent permission controls share one composer row", () => {
  const controlsStart = pageSource.indexOf('className="composer-options"');
  const controlsEnd = pageSource.indexOf("</div>", controlsStart);
  const controlsSource = pageSource.slice(controlsStart, controlsEnd);
  assert.ok(controlsStart > 0);
  assert.match(controlsSource, /aria-label="模型选择"/);
  assert.match(controlsSource, /<span>Bash<\/span>/);
  assert.match(controlsSource, /<span>Agent<\/span>/);
  assert.doesNotMatch(pageSource, /className="model-pill"/);
  assert.match(styleSource, /\.composer-options[\s\S]*?flex-wrap: nowrap;/);
  assert.match(styleSource, /\.composer-options[\s\S]*?overflow-x: auto;/);
});

test("selected model is persisted and sent with the chat request", () => {
  assert.match(pageSource, /SELECTED_MODEL_KEY/);
  assert.match(pageSource, /localStorage\.setItem\(SELECTED_MODEL_KEY, modelId\)/);
  assert.match(pageSource, /modelId: selectedModelId \|\| health\?\.model/);
});

test("Bash approval events are rendered with allow and reject actions", () => {
  assert.match(pageSource, /tool_approval_required/);
  assert.match(pageSource, /onDecision\(messageId, run, "approve"\)/);
  assert.match(pageSource, /onDecision\(messageId, run, "reject"\)/);
  assert.match(pageSource, /void decideBashCommand\(messageId, run, decision\)/);
  assert.match(pageSource, /查看命令输出/);
});
