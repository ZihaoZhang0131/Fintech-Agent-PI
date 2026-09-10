---
name: kami
description: 当用户明确要求完整研报、正式文件、演示文稿或落地页的视觉版时使用。把已定稿的内容排版为 Kami 风格 HTML/PDF；不用于普通聊天、事实研究或 Word 生成。
---

# Kami 正式产物排版

Kami 只负责「已确认内容 → 视觉产物」。数据、来源、数字、观点和风险必须先由投研 Skill 完成；不得为了版式改写已确认事实。

## 何时使用

- 用户要求完整报告、正式 PDF/HTML、演示文稿或落地页时启用。
- 普通问答、数据查询、研究中间稿不启用。
- 明确要 Word 时使用 `generate_document`，不使用 Kami。同时要 Word 和视觉版时，两者必须来自同一份 Markdown/`contentIr`。

## 必须路由

1. 选择模板：`one-pager`、`long-doc`、`letter`、`portfolio`、`resume`、`slides`、`equity-report`、`changelog` 或 `landing-page`。
2. 通过 `read_skill_resource` 读取对应模板和必要参考：
   - 视觉规范：`references/design.md`
   - 内容结构：`references/schemas/<template>.json`；`slides` 使用 `slides.json`
   - 生产检查：`references/production.md`
   - 详细上游工作流仅在必要时读取 `references/upstream-workflow.md`
3. 先写完整 `contentIr`，再填充对应 HTML 模板。短事实、数字、日期和资产引用必须完整覆盖。
4. 项目图片只能在 `assets` 中声明，HTML 使用 `kami-asset://<id>`。不得使用绝对路径、`file://` 或外部网络资源。
5. 仅调用 `render_kami_artifact` 生成产物。不得运行 Kami 的任意 Python/Bash/MCP 脚本，不得自行安装依赖。

## 固定交付矩阵

- 普通文档和幻灯片：`formats: ["html", "pdf"]`
- 落地页：`formats: ["html"]`
- 语言：`zh-CN | en | ja | ko`
- 中文字体默认系统 `Songti SC`/思源宋体回退。不下载 TsangerJinKai02；只有用户提供已授权字体时才可使用。

## 完成标准

- 工具返回的 Schema、内容覆盖、占位符、Markdown 残留、Kami 样式、字体、页数、密度和 PDF 渲染检查均必须通过。
- 最终回答列出工具实际返回的 `.content.json`、`.html`、`.pdf`、`.kami.json` 和预览 PNG 路径。
- `visualReviewPending: true` 表示机械检查通过但主观逐页视觉验收尚未完成；不得宣称已完成人工视觉验收。

