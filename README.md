# 知衡 · 本地投研 Agent

一个基于 PI Agent Core、DeepSeek、Tavily、AKShare MCP 和 React 的本地投研工作台。界面采用三栏布局：左侧按本地项目组织会话，中间执行流式 Agent 任务，右侧浏览和预览项目文件。

## 当前能力

- DeepSeek 多轮流式对话
- 通过 macOS 系统选择器绑定多个本地项目文件夹
- 每个项目可创建多个独立会话，会话始终绑定所属项目
- 本机 Agent Runtime 负责受控地列出、读取和写入项目文件
- 右侧实时浏览项目目录，预览 Markdown、代码、文本、图片和 PDF
- Agent 将可复用的报告、代码和数据保存到项目 `outputs/` 目录
- 左侧能力入口提供独立的技能、工具与 MCP 管理页面，支持搜索、连接状态和详情查看
- 左侧“模型”页面可配置 DeepSeek、OpenAI、Anthropic、Gemini、通义千问、Kimi 与智谱 AI；完成连接测试后可在对话框切换
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

项目内置九个渐进加载的投研 Skill：

- `equity-research`：公司、商业模式、财务、竞争与投资风险研究
- `earnings-review`：财报、业绩预告、电话会与盈利质量解读
- `policy-tracking`：政策、监管和产业事件影响追踪
- `akshare-http-data`：通过本机 AKTools HTTP 服务读取结构化财经数据
- `a-share-value-investing`：按全市场初筛、深挖和证据链流程筛选 A 股价值投资候选
- `akshare-china-macro`：已验证可用的中国宏观经济与金融数据
- `akshare-us-macro`：已验证可用的美国宏观经济数据
- `akshare-euro-macro`：已验证可用的欧元区宏观经济数据
- `akshare-institutions-macro`：已验证可用的 LME、CFTC、CME、ETF 与 OPEC 数据

Skill 以 `.agents/skills/<skill-name>/SKILL.md` 为入口，完整目录可以包含 `scripts/`、`references/`、`assets/` 与更深层的资源文件。系统提示词只包含名称和描述；模型判断任务匹配后，通过白名单工具 `load_skill` 获取执行说明和资源索引，再按需读取资料或运行受支持的脚本。Skill 负责工作流程，`web_search` 负责获取网络信息。

在“技能”页可从本机文件夹或 ZIP 导入完整 Skill，也可浏览、编辑、添加、删除和导出其资源文件。导入的脚本仅会在 Agent 已加载该 Skill、当前 Bash 已启用时执行，并继承会话的审批与项目沙箱/完全权限设置。

## MCP

项目内置两个免费的本地 stdio MCP：`AKShare One MCP 0.3.9` 提供 A 股历史与实时行情、新闻、三张财务报表、财务指标、内部交易和交易日时间信息；`AKShare Stock MCP 0.1.0` 提供实时行情、K 线、财报、北向资金、龙虎榜和融资融券等工具。它当前实际发现 86 个工具，其中会清空缓存的管理工具被本项目拒绝公开；其子进程会绕过系统代理直连数据源，以避免部分代理拒绝东方财富等来源。两者均不进入 Cloudflare Worker，也不需要 API Key。

首次使用前需要安装 [uv](https://docs.astral.sh/uv/getting-started/installation/)，然后执行一次：

```bash
npm run mcp:setup
```

该命令会安装两个受锁定的 Python 3.12 环境。之后使用 `npm run dev` 启动完整应用，在左侧“MCP”页面查看连接状态。AKShare One 首次连接后默认启用；AKShare Stock 为避免同类工具重复，需在该页面手动启用。

## 启动

需要 Node.js 22 或更高版本。

1. 复制环境变量示例：

   ```bash
   cp .env.example .env
   ```

2. 在 `.env` 中填写 Tavily API Key；DeepSeek API Key 仍可作为兼容配置。模型服务商的 API Key 也可以在启动后从左侧“模型”页面保存到本机 Runtime，完成测试后才会进入对话模型列表。Tavily SDK 可在未配置 Key 时使用受限的 keyless 模式，但稳定使用建议配置自己的 Key。

3. 安装依赖、安装本机数据服务和 MCP，并启动完整的本地应用：

   ```bash
   npm install
   npm run aktools:setup
   npm run mcp:setup
   npm run dev
   ```

4. 打开 `http://localhost:3000`。

`npm run dev` 会同时启动网页、仅监听 `127.0.0.1` 的本机 Agent Runtime，以及默认监听 `127.0.0.1:8080` 的 AKTools HTTP 数据服务；退出项目时会一并停止它。数据服务首次只需运行一次 `npm run aktools:setup` 安装。若设置了非默认的 `AKTOOLS_BASE_URL`，项目会保留该外部服务，不会代为启动或停止。请不要直接使用 `npm run dev:site`，否则文件夹选择和项目文件工具不会工作。

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

- API Key：可保存在本地 `.env`（兼容 DeepSeek）或由“模型”页面保存到 `.local-data/model-providers.json`；两者均被 Git 忽略，后者以本机文件权限保护且接口不会返回明文密钥。
- 对话记录：保存在当前浏览器的 `localStorage` 中。
- 技能、工具与 MCP 开关：保存在当前浏览器的 `localStorage` 中；MCP 首次连接成功后默认启用。
- 项目绑定关系：保存在应用目录下的 `.local-data/workspaces.json`，该目录已被 Git 忽略。
- 本地数据库：全应用共享的 SQLite 文件保存在 `.local-data/database.sqlite`；用户页面仅支持只读 SQL，启用相应能力的 Agent 可直接写入。
- 项目文件：保存在用户选择的本地文件夹中，解除绑定不会删除文件。
