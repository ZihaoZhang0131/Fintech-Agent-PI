---
name: akshare-us-macro
description: 当用户需要通过本机 AKTools HTTP 服务查询美国 GDP、通胀、就业、消费、房地产、制造业、贸易、能源库存或领先指标时使用。仅使用已验证可用的美国宏观 AKShare 接口。
---

# AKShare 美国宏观数据

通过本机 AKTools HTTP 服务查询已验证可用的美国宏观数据。

1. 首次取数前运行 `scripts/aktools_status.py`。服务不可用时，根据 `error_kind`、实际 `base_url` 和应用启动日志报告原因。默认端口冲突时应用会自动换端口，脚本通过 `AKTOOLS_BASE_URL` 接收实际地址；请通过 `npm run dev` 启动应用。只有应用明确报告解释器或依赖缺失时才建议 `npm run aktools:setup`；不要自行安装依赖或启动后台服务。HTTP 404 应先核验服务身份与接口版本，不能推断未安装或端点未注册；500 保留原始错误。工具 `completed` 仅表示执行结束，须检查退出码及结果；脚本已输出 HTTP 错误说明解释器已运行，不应将普通 Bash 的沙箱权限错误概括为本机 Python 不可用。
2. 读取 `references/index.md`，按用户意图定位中文指标、完整函数名与接口卡文件。不得猜测、简化或拼接函数名。
3. 读取对应接口卡，确认参数、字段、频率与来源。
4. 仅在接口与参数明确后运行 `scripts/aktools_get.py <完整函数名>`；每个参数使用 `--param key=value`。默认最多返回 100 行，需要更多时传 `--max-rows`，上限为 1000。
5. 回答时写明接口名、查询参数、数据日期/最新观测日期与数据来源。接口报错或空数组时只报告现象，不把它解释成经济指标不存在。
