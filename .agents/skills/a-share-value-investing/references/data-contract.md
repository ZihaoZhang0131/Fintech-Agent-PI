# 数据接口与脚本契约

## 目录

1. 固定接口
2. 日期与代码
3. 初筛输出
4. 深挖输出
5. 失败处理

## 1. 固定接口

脚本只调用本机 `${AKTOOLS_BASE_URL:-http://127.0.0.1:8080}` 下列已在 `akshare-http-data` 快照记录的接口，不接受用户传入接口名：

### 初筛

- `stock_zh_a_spot_em`：当前价格、PE、PB、市值。
- `stock_yjbb_em`：年度收入、净利润、ROE、毛利率、行业。
- `stock_zcfz_em`：资产、货币资金、负债、资产负债率。
- `stock_xjll_em`：经营现金流。
- `stock_fhps_em`：年度现金分红。

### 深挖

- `stock_financial_analysis_indicator`：多年财务比率。
- `stock_cash_flow_sheet_by_yearly_em`：自由现金流所需现金流字段。
- `stock_value_em`：五年 PE/PB/PCF 与市值历史。
- `stock_fhps_detail_em`：分红历史。
- `stock_zh_valuation_comparison_em`：同行 PE/PB。
- `stock_zh_dupont_comparison_em`：同行 ROE。
- `stock_sy_em`：商誉占净资产比例。
- `stock_gpzy_pledge_ratio_em`：质押比例。

主营构成、公告正文、历史行情等最终核验接口由 Agent 按 `akshare-http-data` 的接口卡逐只调用，不塞入 30 只批量脚本。

## 2. 日期与代码

- `--as-of` 必须是 `YYYY-MM-DD` 且不能晚于运行当天。
- 完整年度为 `YYYY1231`。5 月 1 日前以 `as_of.year-2` 为最新完整年度，5 月 1 日起以 `as_of.year-1` 为最新完整年度。
- `--symbols` 使用逗号分隔的 6 位数字，去重后最多 30 只。
- 东财年度三表和同行接口需要 `SH/SZ/BJ` 前缀；60/68 开头映射 SH，8/4 开头映射 BJ，其余映射 SZ。

## 3. 初筛输出

`screen_candidates.py` 输出一个 JSON 对象：

- `as_of`、`annual_periods`、`generated_at`。
- `usable_for_research`：核心接口和股票池是否足够完成研究。
- `interfaces`：每次调用的接口、参数、成功状态、行数、尝试次数和错误。
- `coverage`：现货数、满足五年数据数、候选数。
- `exclusion_summary` 与 `exclusion_examples`：排除原因统计和少量样例。
- `candidates`：最多 `deep_count` 条，含代码、名称、行业、价格、市值、指标、六项分数、总分、分项门槛、理由、风险标记和缺失字段。

核心接口为现货、五年业绩、五年现金流和最新年度资产负债表。任一核心集合不可用时 `usable_for_research=false`，不得继续给股票。

## 4. 深挖输出

`deep_metrics.py` 输出：

- `as_of`、`symbols`、`usable_for_research`、`interfaces`。
- `results`：逐只包含当前估值、五年历史分位、同行中位数、ROE、三年自由现金流、分红、商誉、质押、三项 `valuation_signals`、`valuation_support_count`、`valuation_score`、风险标记和缺失字段。
- `coverage`：请求数、成功数、拥有两项估值支持的股票数。

主 Agent 用 `valuation_score` 替换初筛估值分再计算总分，不得自行修改其他分项。

## 5. 失败处理

- 单请求超时不超过 12 秒；只对网络错误、429 和 5xx 最多重试 2 次，最多 6 路并发。批量研究达到 75 秒全局时限后取消未开始的请求，使仍在运行的请求结束后仍能落在 Runtime 的 120 秒上限内。
- 空数组记录为“空响应”，不能转成零值或“无风险”。字段别名都不匹配时记录缺失字段，不能按位置猜列。
- stdout 只输出最终 JSON；诊断写入 stderr。输出保留原始数据日期和接口状态，但不输出整份原始表，避免超过 Runtime 的 200KB 上限。
- 核心接口失败时停止候选结论；非核心接口失败时保留结果并降低置信度。
