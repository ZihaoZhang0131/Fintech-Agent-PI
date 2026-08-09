---
name: akshare-http-data
description: 当用户需要通过本机 AKTools HTTP 服务获取 AKShare 的股票、基金、宏观、债券、期货、期权、外汇或其他结构化财经数据时使用。先按自然语言意图读取对应数据字典 Reference，再运行附带脚本调用接口。
---

# AKShare HTTP 数据

使用本 Skill 获取结构化数据时，依次执行以下步骤：

Skill 内的 `scripts/` 和 `references/` 是**资源标识，不是项目工作目录中的文件路径**。不要用 Bash、`find` 或 `python3 scripts/...` 查找或运行它们。

1. 首次取数前调用 `run_skill_script`，参数为 `name="akshare-http-data"`、`path="scripts/aktools_status.py"`、`args=[]`。服务不可用时，告知用户执行 `pip install aktools` 和 `python -m aktools`，不要自行启动后台服务。
2. 根据用户的自然语言需求，调用 `read_skill_resource` 读取下表中对应的一级 Reference，参数固定为 `name="akshare-http-data"` 和表中的 `path`。每个一级 Reference 的“精确接口定位”表会给出中文名称、函数名和下一份卡片路径。
3. 从定位表复制**完整函数名**与卡片路径，再读取那一份接口卡，确认参数、字段和数据口径。函数名必须与定位表和卡片的 `###` 标题完全一致；不得删减后缀、翻译、猜测或拼接名称。
4. 仅在接口与参数明确后调用 `run_skill_script` 运行 `scripts/aktools_get.py`。定位表找不到匹配项时，继续读取其他主题索引或告知用户未在快照中找到；不得试探 API 路径、HTTP 方法、参数或函数名。跨主题研究可依次读取多份 Reference。
5. 回答时说明使用的接口名、查询参数与数据日期；脚本返回空数组或错误时，不要将其直接解释为不存在。

## Reference 路由

| 用户意图 | 先读取 |
|---|---|
| A/B/港/美股行情、财报、公告、研报、资金流、北向、两融、板块、公司事件 | `references/stock/index.md` |
| 国内外期货、商品、仓单、基差、持仓、期货行情 | `references/futures/index.md` |
| 国债、可转债、债券行情、收益率、质押回购 | `references/bond/index.md` |
| 金融或商品期权、风险指标、隐含波动率 | `references/option/index.md` |
| 汇率与外汇 | `references/fx/index.md` |
| 数字货币 | `references/currency/index.md` |
| 现货、商品价格 | `references/spot/index.md` |
| 利率与收益率曲线 | `references/interest_rate/index.md` |
| 公募、ETF、LOF、私募基金 | `references/fund/index.md` |
| 指数与指数成分、指数行情 | `references/index/index.md` |
| 中国及海外宏观经济指标 | `references/macro/index.md` |
| 东方财富专题、银行、财经资讯、能源、事件、高频、NLP、QDII、另类数据、工具 | 按需读取 `references/dc/`、`bank/`、`article/`、`energy/`、`event/`、`hf/`、`nlp/`、`qdii/`、`others/`、`tool/` 下的 `index.md` |
| 期货公司、品种、基金、基本面与指数资料 | `references/qhkc/index.md` |

完整官方数据字典已按主题压缩拆分。每份接口卡保留官方接口名、来源地址、描述、限量说明、输入参数与输出字段；不会自动注入上下文，必须按需读取。

例如，“股票账户统计月度”先读取 `references/stock/index.md`，从定位表取得 `stock_account_statistics_em` 与 `references/stock/topic-23-1.md`，再读取该卡；不得将函数名简化为 `stock_account_statistics`。

## HTTP 调用

使用 `run_skill_script` 而非手写 URL 或 Bash，避免查询参数编码和 Skill 路径错误：

```text
name: "akshare-http-data"
path: "scripts/aktools_get.py"
args:
  - "stock_zh_a_hist"
  - "--param"
  - "symbol=600519"
  - "--param"
  - "period=daily"
  - "--param"
  - "start_date=20250101"
  - "--param"
  - "end_date=20251231"
  - "--param"
  - "adjust=qfq"
```

脚本默认请求 `${AKTOOLS_BASE_URL:-http://127.0.0.1:8080}` 的 `/api/public/<接口名>`，重复传入 `--param key=value`。列表结果默认最多返回 100 行；用 `--max-rows` 调整上限。

## 数据字典快照

本 Skill 的 `references/manifest.json` 固定 AKShare `1.18.83`、提交 `5cb11b4` 的官方 `docs/data` 内容。更新时必须重新生成整个 Reference 快照，不要混用不同版本的接口说明。
