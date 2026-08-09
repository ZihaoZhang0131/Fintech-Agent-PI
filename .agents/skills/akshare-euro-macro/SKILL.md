---
name: akshare-euro-macro
description: 当用户需要通过本机 AKTools HTTP 服务查询欧元区 GDP、通胀、失业、就业、PMI、工业产出、零售、贸易、经常帐或信心指标时使用。仅使用已验证可用的欧元区宏观 AKShare 接口。
---

# AKShare 欧元区宏观数据

通过本机 AKTools HTTP 服务查询已验证可用的欧元区宏观数据。

1. 首次取数前运行 `scripts/aktools_status.py`。服务不可用时，告知用户在应用目录运行 `npm run aktools:setup`，再重新运行 `npm run dev`；不要自行安装依赖或启动后台服务。
2. 读取 `references/index.md`，按用户意图定位中文指标、完整函数名与接口卡文件。不得猜测、简化或拼接函数名。
3. 读取对应接口卡，确认参数、字段、频率与来源。
4. 仅在接口与参数明确后运行 `scripts/aktools_get.py <完整函数名>`；每个参数使用 `--param key=value`。默认最多返回 100 行，需要更多时传 `--max-rows`，上限为 1000。
5. 回答时写明接口名、查询参数、数据日期/最新观测日期与数据来源。接口报错或空数组时只报告现象，不把它解释成经济指标不存在。
