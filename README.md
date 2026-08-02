# 知衡 · 本地投研 Agent

一个基于 PI Agent Core、DeepSeek、Tavily 和 React 的本地投研对话 MVP。界面采用三栏布局：左侧是本地会话，中间是流式对话，右侧集中查看 Agent 产出的研究结论、代码和 PDF。

## 当前能力

- DeepSeek 多轮流式对话
- Agent 根据问题自主调用 Tavily 网络搜索，并在回答中引用来源
- 轻量 Skill Registry：Agent 根据任务加载公司研究、财报解读或政策追踪流程
- 投研系统提示词
- 浏览器本地会话记录
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

## 启动

需要 Node.js 22 或更高版本。

1. 复制环境变量示例：

   ```bash
   cp .env.example .env
   ```

2. 在 `.env` 中填写 DeepSeek API Key 和 Tavily API Key。Tavily SDK 可在未配置 Key 时使用受限的 keyless 模式，但稳定使用建议配置自己的 Key。

3. 安装依赖并启动：

   ```bash
   npm install
   npm run dev
   ```

4. 打开 `http://localhost:3000`。

## 检查

```bash
npm run typecheck
npm run lint
npm test
```

## 数据位置

- API Key：仅保存在本地 `.env`，该文件已被 Git 忽略。
- 对话记录：保存在当前浏览器的 `localStorage` 中。
