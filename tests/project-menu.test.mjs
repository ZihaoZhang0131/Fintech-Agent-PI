import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const stylesheet = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("project cards keep secondary actions in a hover menu", () => {
  assert.match(pageSource, /project-menu-trigger/);
  assert.match(pageSource, /新建项目下会话/);
  assert.match(pageSource, /查看项目地址/);
  assert.match(pageSource, /移除项目/);
  assert.match(pageSource, /method: "DELETE"/);
  assert.match(stylesheet, /\.project-group:hover > \.project-menu-trigger/);
  assert.match(stylesheet, /\.project-context-menu/);
});

test("project paths and helper copy are removed from the persistent layout", () => {
  assert.doesNotMatch(pageSource, /<small>\{project\.path\}<\/small>/);
  assert.doesNotMatch(pageSource, /项目：\{activeProject\.path\}/);
  assert.doesNotMatch(pageSource, /会话绑定项目，文件权限限制在所选目录/);
  assert.doesNotMatch(pageSource, /文件访问限制在当前项目目录；AI 内容仅供研究参考。/);
  assert.doesNotMatch(pageSource, /<small title=\{activeProject\.path\}>/);
});

test("removing a project explicitly preserves local files", () => {
  assert.match(pageSource, /不会删除本地文件夹或其中的任何内容/);
  assert.match(pageSource, /remainingProjects/);
  assert.match(pageSource, /remainingConversations/);
});

test("the file browser omits the entry-count information module", () => {
  assert.doesNotMatch(pageSource, /仅显示前 800 项/);
  assert.doesNotMatch(pageSource, /workspace-file-summary/);
  assert.doesNotMatch(stylesheet, /\.workspace-file-summary/);
});

test("each project controls its conversation expansion independently", () => {
  assert.match(pageSource, /EXPANDED_PROJECTS_KEY/);
  assert.match(pageSource, /expandedProjectIds\.includes\(project\.id\)/);
  assert.match(pageSource, /function toggleProjectExpansion/);
  assert.match(pageSource, /aria-expanded=\{expanded\}/);
  assert.match(
    pageSource,
    /className="project-heading"[\s\S]*onClick=\{\(\) => toggleProjectExpansion\(project\.id\)\}/,
  );
  assert.match(pageSource, /\{expanded && \(\s*<div className="conversation-list">/);
  assert.doesNotMatch(pageSource, /\{active && \(\s*<div className="conversation-list">/);
  assert.match(stylesheet, /\.project-group\.expanded/);
  assert.doesNotMatch(pageSource, /className="project-toggle"/);
  assert.doesNotMatch(stylesheet, /\.project-toggle/);
});

test("sidebar uses a simplified one-line card hierarchy", () => {
  assert.match(pageSource, /<strong>尺度投资<\/strong>/);
  assert.doesNotMatch(pageSource, /Local Agent Workspace|<strong>知衡<\/strong>/);
  assert.match(pageSource, /className="sidebar-divider"/);
  assert.doesNotMatch(pageSource, /className="sidebar-section-label">本地项目/);
  assert.doesNotMatch(pageSource, /MessageSquareText|轮对话|尚未开始/);
  assert.match(
    stylesheet,
    /\.new-project-button,\s*\.new-chat-button\s*\{[^}]*justify-content:\s*flex-start;[^}]*background:\s*transparent;/s,
  );
  assert.match(stylesheet, /\.project-heading\s*\{[^}]*background:\s*transparent;/s);
  assert.match(stylesheet, /\.conversation-row\s*\{[^}]*background:\s*transparent;/s);
  assert.doesNotMatch(pageSource, /selectProject\(project\.id\)/);
});

test("sidebar project entries use compact vertical spacing", () => {
  assert.match(stylesheet, /\.new-project-button\s*\{[^}]*margin-bottom:\s*2px;/s);
  assert.match(stylesheet, /\.sidebar-divider\s*\{[^}]*margin:\s*0px 4px 8px;/s);
  assert.match(stylesheet, /\.project-group\s*\{[^}]*margin-bottom:\s*2px;/s);
  assert.match(
    stylesheet,
    /\.project-group \.conversation-row\s*\{[^}]*margin:\s*0px 0 0 18px;/s,
  );
});

test("project and conversation boxes keep compact internal whitespace", () => {
  assert.match(
    stylesheet,
    /\.project-heading\s*\{[^}]*gap:\s*7px;[^}]*min-height:\s*34px;[^}]*padding:\s*4px 32px 4px 8px;[^}]*border-radius:\s*8px;/s,
  );
  assert.match(
    stylesheet,
    /\.conversation-row\s*\{[^}]*min-height:\s*30px;[^}]*border-radius:\s*7px;/s,
  );
  assert.match(
    stylesheet,
    /\.conversation-select\s*\{[^}]*min-height:\s*28px;[^}]*padding:\s*4px 30px 4px 10px;/s,
  );
  assert.match(
    stylesheet,
    /\.delete-chat\s*\{[^}]*top:\s*4px;[^}]*right:\s*5px;[^}]*width:\s*21px;[^}]*height:\s*21px;/s,
  );
});
