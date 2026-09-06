# Trace 会话与执行明细

Trace 页以完整会话聚合普通聊天与 Workflow，顶部可切换主会话和 Subagent 调用。日期按最近活动筛选，关键词匹配会话、Trace ID 或任务内容；筛选后在服务端分页，每页 50 条。

右侧抽屉提供消息列表和 Trace 信息。普通消息来自独立持久化的公开输入／回复快照，Workflow 主消息复用原有会话存储。Subagent 消息限定到一次调用，不混入主会话。正文仍执行脱敏与大小限制，不保存思考正文。

执行树中的“第 N 轮”是用户任务，“模型调用 N”是 Agent 内部循环。普通 Subagent 挂在 delegate_agent 工具下面。Workflow 的规划与节点尝试仍保持独立 Trace；查询时按任务组合，显示计划版本、重试、采用状态和实际并行时间，避免重复累加 Token 或耗时。节点详情在原行下方展开，不产生第二层弹窗。

## 数据与接口

- trace_runs 新增 context_json，通过增量迁移兼容旧数据库；trace_messages 使用稳定消息 ID 更新快照，并随 Trace 级联清理。
- 每个 Agent 启动前建立调用记录，失败、超时、停止与部分回复可以检查。Workflow 的准备失败也关联到真实节点尝试；尝试状态仍由原执行器管理。
- 旧 Workflow 通过持久化的 run.traces 和 attempt.traceId 恢复关联。未知的历史时间或输入不补造，显示历史记录提示。
- 继续沿用 30 天／1000 条物理 Trace 保留策略。删除 Trace 不删除聊天与 Workflow 恢复数据。

新增只读接口都要求 workspaceId，经现有 /api/local 代理访问：

| 路径（/api/local/traces 下） | 内容 |
| --- | --- |
| /sessions | 聚合会话列表 |
| /sessions/:sessionKey | 会话概览与分页任务 |
| /sessions/:sessionKey/messages | 分页消息；可用 invocationId 限定一次子调用 |
| /sessions/:sessionKey/tasks/:taskId | 按需读取一轮执行详情 |
| /invocations | Subagent 调用列表，规划 Agent 不计入 |
| /context/:traceId | 解析深链接的会话、任务和执行位置 |

sessionKey 带 chat: 或 workflow: 前缀。已有单 Trace 查询、删除、用量统计与聊天 traceId 协议保留兼容。列表只加载摘要；消息、Span 与事件正文在打开详情后读取。活动任务每秒刷新，暂停／等待状态低频刷新；切换请求会取消旧请求，刷新保留分页和展开状态。

## 验证

自动化用例包括聚合后分页、跨项目隔离、历史关联迁移、已清理 Trace、重复委派、子 Agent 启动失败、部分回复、长正文用量、Workflow 节点准备失败、重试和并行时间轴。

可用 `node --experimental-strip-types scripts/trace-ui-fixture.mjs` 启动隔离浏览器数据（默认端口 4317；端口冲突以 Vite 输出为准）。脚本只创建临时项目与模拟 Trace，不调用模型，不读写生产数据库，退出后清理。浏览器已验收主表、两类抽屉、层级展开、工具过滤、行内详情、消息定位、Esc 焦点恢复和 390px 窄屏。

验证性质：自动化测试与模拟数据浏览器验收；没有执行真实模型联调。
