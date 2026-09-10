# 聊天模式 Harness：三个 P0 的实现与验收

本次只改聊天模式。Workflow 的调度、规划、检查点及界面没有接入这套运行时，也没有修改其模块。

## 1. 运行权归本机进程，而不是浏览器请求

入口为 `server/chat/manager.mjs`，由现有 `server/local-runtime.mjs` 持有。主 Agent 使用项目已安装的 Pi `AgentHarness 0.83.0`，不新建另一套 LLM 循环。

```text
浏览器提交 Start / Steer / Interrupt / Continue
                 ↓
Local Runtime → ChatSessionManager → Pi AgentHarness → 原有工具
                 ↓                       ↓
             SQLite 状态             原始 Session
                 ↓
          快照 + 带 seq 的 SSE
                 ↓
             浏览器展示
```

- 同一会话只运行一个应用 Turn，不同会话可独立运行。
- Start 使用 `clientRequestId` 去重；相同 ID、不同内容返回 409，不重复执行。
- 浏览器断开、刷新或切换会话只销毁订阅，不取消任务。
- 显式停止使用独立 Interrupt 接口；信号传到 Harness、模型及现有工具取消链。
- 进程重启把未完成 Turn 标记为 `interrupted`，不会偷偷重跑。用户点击“继续”才建立关联新 Turn。
- 恢复时，已保存的工具结果直接进入上下文。没有结果的旧调用补一条“结果未知、先核验”的错误结果，修复协议配对；这不是伪造成功结果，也不是自动重放工具。
- 删除聊天或解绑项目前，先中断该聊天的活动任务，再清理它的数据。退出进程时关闭 SSE 和残留 HTTP 连接，防止开发热重载一直等待。

旧 `/api/chat/stream` 与 `/api/chat/abort` 返回 410，提示旧页面刷新，避免新旧执行引擎同时运行。

### 数据层

仍使用本机 `chat.sqlite`，启用 WAL，文件权限为 0600。新增表：

| 表 | 用途 |
|---|---|
| `chat_threads` | 项目归属、会话配置、当前 Turn、事件序号 |
| `chat_turns` | 幂等请求、生命周期、恢复关联 |
| `chat_session_entries` | Pi 原始结构化消息、工具调用/结果、压缩检查点 |
| `chat_items` | 显示消息与工具卡片投影 |
| `chat_events` | 可回放事件，每个 Thread 单调递增的 seq |
| `chat_inputs` | 补充输入的 pending / consumed / cancelled 状态 |
| `chat_results` | 大工具结果原文，按会话授权读取 |

SessionStorage 使用 Pi 的存储接口，追加记录先持久化后对订阅者可见。Session 缓存空闲 30 分钟后释放；每个应用 Turn 重新组装 Harness 和工具，使模型、权限及能力设置按当轮快照生效。

首次建新表前生成 `chat.sqlite.pre-harness` 一致性备份。已有会话按需迁移，保留原有显示记录；旧的纯文本历史不会伪装成完整工具轨迹。新增数据继续写入 `chat_conversations` 兼容投影，旧页面不能再整包覆盖已迁移会话。

模型配置只落模型引用、提示词和能力设置；嵌套对象按字段白名单重建，API Key 等凭据不随请求配置进入 Turn。实际凭据仍在现有本机模型注册中心解析。

## 2. 原始上下文、自动压缩和大结果分页

`server/chat/context.mjs` 在每次模型请求前执行预算检查，包括系统提示、工具 schema、会话文本以及最近有效的 provider usage。中文和 JSON 使用保守字符估算，避免直接使用英文 chars/4 低估。

- 输出预留：`min(maxTokens, 16384, 20% contextWindow)`。
- 自动压缩阈值：`min(80% contextWindow, contextWindow - reserve)`。
- 近期上下文预算：`min(20000, 20% contextWindow)`；传给 Pi 的字符估算会按中文/结构化内容校正。
- 单个普通工具结果超过约 8000 估算 tokens 时，保存原文并返回最多 6000 字符预览和独立结果 ID。
- `read_chat_tool_result` 按字符分页，默认 4000、最大 6000 字符；跨会话读结果被拒绝。结果 ID 不复用 provider 的 toolCallId，避免多轮或多会话碰撞。
- Skill 正文和资源读取不走普通截断；压缩保留对应调用/结果配对。若这些必需内容自身超预算，则明确失败，不静默删掉约束。

摘要要求保留目标、用户纠正、事实与推断的区分、来源、日期、单位/口径、已执行动作、未知结果和下一步。原始历史不会因压缩被删除。

Pi 0.83 的 `AgentHarness.compact()` 只能在空闲时调用；本实现使用其公开 `prepareCompaction` / `compact` / `Session.appendCompaction` 接口，在 context hook 内创建检查点。针对 0.83 的 `retainedTail`，二次压缩前先展开上个检查点未摘要的尾部消息，避免遗漏。压缩后的预算估算不重复套用压缩前的高 usage 数字。

失败或取消不会提交半成品摘要。未达到硬预算时可保留原上下文继续一次；相同上下文不反复重试失败压缩。达到硬预算时停止本轮，保留历史并明确提示。压缩过程和用量存入事件，页面显示“正在整理上下文…”。

## 3. 运行中补充与显式继续

输入框在运行中保持可编辑，发送按钮切换为“发送补充”，停止按钮独立保留。

1. 服务端验证 `expectedTurnId`，然后持久化补充输入。
2. 通过 Pi `steer()` 在可处理边界投递；这不会强制中断当前工具。
3. Pi 接纳用户消息时，原始 Session entry 和输入 `consumed` 状态在同一 SQLite 事务中写入。
4. 结束瞬间收到但尚未被 Pi 消费的补充，留在同一应用 Turn 中继续处理，不静默丢弃。
5. 显式停止后未消费输入标为 `cancelled`；进程异常中断时未消费输入保留，点击“继续”后接着投递。

浏览器网络重试冻结请求 ID、端点和完整 payload，不会因为状态变 busy 就把一次 Start 重试误发成 Steer。服务端确认接收后立即清理已提交草稿；后续显示同步失败不再被误报成“未发送”。拒绝或真正未确认的请求保留输入。

保留现有 Bash 审批/权限、工具卡片、SubAgent、Trace、文件刷新和 Markdown 交互。审批决定同步进入服务端显示投影，避免重连恢复出已经处理过的待审批卡片。

## 接口

浏览器通过现有 `/api/local` 代理访问，Runtime 本身仍要求 Bearer token。

| 相对 `/chat/threads/:id` 的路径 | 方法 | 用途 |
|---|---|---|
| 空路径 | GET | 会话快照和 seq；支持 `limit=1..500`、`beforeMessageId` 分页 |
| `/events?afterSeq=N` | GET | SSE 回放并订阅后续事件 |
| `/turns` | POST | `{clientRequestId, input, config}` |
| `/turns/:turnId/steer` | POST | `{clientInputId, expectedTurnId, text}` |
| `/turns/:turnId/interrupt` | POST | 显式停止 |
| `/turns/:turnId/continue` | POST | `{clientRequestId}`，关联中断轮次 |
| `/compact` | POST | `{clientRequestId}`，手动压缩维护接口 |

事件先落库再发送；慢 SSE 客户端断开后从快照/游标重连，不反向取消任务。当前前端复用服务端完整显示投影，以 100ms 合并刷新，避免复制两套复杂工具卡片 reducer。后端已提供消息分页；前端虚拟列表、纯增量渲染和历史结果清理策略不在这次 P0 内。

## 验证

```sh
node --test tests/chat-harness.test.mjs
npm run typecheck
npm run lint
npm test
npm run build
git diff --check
```

新增测试使用真正的 Pi AgentHarness 和公开压缩器，provider 为确定性假实现，不依赖账号或外网。覆盖：

- 旧会话迁移、冷恢复、工具调用/结果保真、消息分页。
- Start / Steer 幂等及错误内容冲突、浏览器模糊失败重试。
- SSE 断开后的后台运行、事件回放、Runtime 鉴权和旧整包写入拒绝。
- 正常 steer、settled 边界的晚到输入、显式停止。
- 独立子进程 SIGKILL 后的 WAL 恢复、未消费输入恢复与显式 Continue。
- 原始工具结果复用，不由恢复机制再次执行已完成副作用。
- 连续压缩、真实 Pi 摘要路径、压缩失败/取消原子性、大中文结果和跨会话隔离。
- 生产 chat factory 在 Node 下加载并把真实 Harness 事件写入 Trace。

最终检查：typecheck、lint、build、`git diff --check` 全部通过；全量测试 265 项，其中 264 通过、1 项跳过。跳过的是原有 AKTools 启动冲突用例，因为本机 8080 已由现有服务占用；新增的 12 项聊天 Harness 测试全部通过。

2026-09-10 本机真实页面和 DeepSeek V4 Pro 验收：

- 独立验收会话 `e91bcdcf-380d-47a8-85c9-ebc827c3f403`，题目仅为 Harness 技术说明，明确禁止工具调用。
- 运行中补充要求后刷新：刷新后仍显示运行中；最终输出“补充已收到”，SQLite 中输入状态为 `consumed`。
- 显式停止轮次 `6664c2f6-a283-48fc-a8fc-e3a051c5cf31` 为 `interrupted`，页面出现“继续”。
- 恢复轮次 `07edb751-e834-4ac1-b246-5c7585334b25` 关联该轮次，并最终 `completed`。
- 原有历史、模型选择、Bash/沙箱控制及 Trace 入口正常显示。开发 Runtime 的旧连接退出卡住问题已修复并恢复服务。

验收会话保留供复查。自动压缩的极限/取消路径用离线测试验证，未额外消耗真实账号做长上下文压力测试。这里只保证不由恢复机制盲目重放动作，不宣称文件、数据库、第三方工具的任意外部副作用具备端到端 exactly-once。

## 部署和回退边界

继续用现有 `npm run dev` / `npm start` 启动完整应用，Node 版本遵循项目约束。一个数据目录由一个 Local Runtime 执行所有聊天；不是多副本分布式任务队列。

升级后刷新旧页面。回退代码前先停止 Runtime，并另存当前数据库的一致性备份。新增表为加法迁移，旧显示投影仍保留；不要直接用 `pre-harness` 覆盖当前数据库，否则会丢掉升级后的新增会话。也不要删除 `.local-data`、模型配置或项目产出。
