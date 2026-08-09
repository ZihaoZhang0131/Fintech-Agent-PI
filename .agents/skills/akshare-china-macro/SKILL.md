---
name: akshare-china-macro
description: 当用户需要通过本机 AKTools HTTP 服务查询中国宏观经济、货币信贷、贸易、价格、房地产、航运或国家统计局数据时使用。仅使用已验证可用的中国宏观 AKShare 接口。
---

# AKShare 中国宏观数据

通过本机 AKTools HTTP 服务查询已验证可用的中国宏观数据。

1. 首次取数前运行 `scripts/aktools_status.py`。服务不可用时，告知用户在应用目录运行 `npm run aktools:setup`，再重新运行 `npm run dev`；不要自行安装依赖或启动后台服务。
2. 读取 `references/index.md`，按用户意图定位中文指标、完整函数名与接口卡文件。不得猜测、简化或拼接函数名。
3. 读取对应 `references/topic-*.md` 中的接口卡，确认参数、字段、频率与来源。
4. 仅在接口与参数明确后运行 `scripts/aktools_get.py <完整函数名>`；每个参数使用 `--param key=value` 传入。默认最多返回 100 行，需要更多时传 `--max-rows`，上限为 1000。
5. 回答时写明接口名、查询参数、数据日期/最新观测日期与数据来源。接口报错或空数组时只报告现象，不把它解释成经济指标不存在。

## 国家统计局通用接口

`macro_china_nbs_nation` 与 `macro_china_nbs_region` 必须先从接口卡确认完整参数。`kind`、`path`、`period` 是全国数据的核心参数；地区数据还必须指定可用的 `indicator` 或 `region`。不要发起无参数请求。

## 已排除接口

本次可用性复测中以下接口无法作为稳定能力使用，禁止调用：`macro_china_rmb`、`macro_china_swap_rate`、`macro_china_bond_public`、`macro_china_bsi_index`。`macro_china_insurance` 超过 30 秒，默认不调用；只有用户明确接受长等待时才说明风险后尝试。
