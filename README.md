# 知衡 · 本地投研 Agent

一个基于 PI Agent Core、DeepSeek、Tavily、AKShare One MCP 和 React 的本地投研工作台。界面采用三栏布局：左侧按本地项目组织会话，中间执行流式 Agent 任务，右侧浏览和预览项目文件。

## 当前能力

- DeepSeek 多轮流式对话
- 通过 macOS 系统选择器绑定多个本地项目文件夹
- 每个项目可创建多个独立会话，会话始终绑定所属项目
- 本机 Agent Runtime 负责受控地列出、读取和写入项目文件
- 右侧实时浏览项目目录，预览 Markdown、代码、文本、图片和 PDF
- Agent 将可复用的报告、代码和数据保存到项目 `outputs/` 目录
- 左侧能力入口提供独立的技能、工具与 MCP 管理页面，支持搜索、连接状态和详情查看
- 技能、工具与 MCP 开关保存在浏览器本地，并真实限制下一轮 Agent 可加载和调用的能力
- 左右侧栏支持拖动调宽、单独隐藏和恢复，布局状态会在本机保留
- 右侧文件目录与文件预览支持上下拖动调整比例，也可以分别隐藏和展开
- Agent 根据问题自主调用 Tavily 网络搜索，并在回答中引用来源
- 轻量 Skill Registry：Agent 根据任务加载公司研究、财报解读或政策追踪流程
- 投研系统提示词
- 浏览器本地会话记录，按项目隔离
- Markdown 回答展示
- 研究结论、代码块和 PDF 链接的独立产出物面板
- 产出物复制、下载与 PDF 内嵌预览
- 停止生成、错误提示和运行事件

当前版本的联网搜索用于查找公开网页，不等同于交易所实时行情或完整公告数据库。模型回答仅供研究参考，不构成投资建议。

## Skills

项目内置三个渐进加载的投研 Skill：

- `equity-research`：公司、商业模式、财务、竞争与投资风险研究
- `earnings-review`：财报、业绩预告、电话会与盈利质量解读
- `policy-tracking`：政策、监管和产业事件影响追踪

Skill 文件位于 `.agents/skills/*/SKILL.md`。系统提示词只包含名称和描述；模型判断任务匹配后，通过白名单工具 `load_skill` 获取完整执行说明。Skill 负责工作流程，`web_search` 负责获取网络信息。

## MCP

项目内置免费的 `AKShare One MCP 0.3.9`，提供 A 股历史与实时行情、新闻、三张财务报表、财务指标、内部交易和交易日时间信息。MCP 通过本机 stdio 运行，不进入 Cloudflare Worker，也不需要 API Key。

首次使用前需要安装 [uv](https://docs.astral.sh/uv/getting-started/installation/)，然后执行一次：

```bash
npm run mcp:setup
```

该命令会安装受锁定的 Python 3.12 环境。之后使用 `npm run dev` 启动完整应用，在左侧“MCP”页面查看连接状态和九个可用工具。

## 启动

需要 Node.js 22 或更高版本。

1. 复制环境变量示例：

   ```bash
   cp .env.example .env
   ```

2. 在 `.env` 中填写 DeepSeek API Key 和 Tavily API Key。Tavily SDK 可在未配置 Key 时使用受限的 keyless 模式，但稳定使用建议配置自己的 Key。

3. 安装依赖、安装 MCP 并启动完整的本地应用：

   ```bash
   npm install
   npm run mcp:setup
   npm run dev
   ```

4. 打开 `http://localhost:3000`。

`npm run dev` 会同时启动网页和仅监听 `127.0.0.1` 的本机 Agent Runtime。请不要直接使用 `npm run dev:site`，否则文件夹选择和项目文件工具不会工作。

## 本地项目模型

```text
本地项目文件夹
  ├── 会话 A
  ├── 会话 B
  └── outputs/          Agent 可复用产出

React 页面
  -> 同源 API 代理
  -> 本机 Agent Runtime
  -> 仅访问已通过系统选择器授权的项目目录
```

前端只保存项目 ID，不直接向 Agent 传递任意绝对路径。本机 Runtime 保存项目 ID 与真实目录的映射，并在每次文件操作时检查路径是否仍位于授权目录内。`.git`、`node_modules`、构建目录和符号链接不会进入文件预览列表。

## 检查

```bash
npm run typecheck
npm run lint
npm test
```

## 数据位置

- API Key：仅保存在本地 `.env`，该文件已被 Git 忽略。
- 对话记录：保存在当前浏览器的 `localStorage` 中。
- 技能、工具与 MCP 开关：保存在当前浏览器的 `localStorage` 中；MCP 首次连接成功后默认启用。
- 项目绑定关系：保存在应用目录下的 `.local-data/workspaces.json`，该目录已被 Git 忽略。
- 项目文件：保存在用户选择的本地文件夹中，解除绑定不会删除文件。
