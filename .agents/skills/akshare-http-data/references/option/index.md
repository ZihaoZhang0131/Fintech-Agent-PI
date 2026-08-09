# option 数据导航

先在“精确接口定位”表按用户的中文需求选择一行，再读取该行的接口卡。不得改写函数名；未找到时不要试探 API。

## 精确接口定位

| 中文名称或文档定位 | 精确函数名 | 读取接口卡 |
|---|---|---|
| 商品期权 / 上海期货交易所 | `option_hist_shfe` | `references/option/topic-01.md` |
| 商品期权 / 历史数据 | `option_czce_hist` | `references/option/topic-01.md` |
| 商品期权 / 商品期权保证金 | `option_margin` | `references/option/topic-01.md` |
| 商品期权 / 商品期权手续费 | `option_comm_info` | `references/option/topic-01.md` |
| 商品期权 / 大连商品交易所 | `option_hist_dce` | `references/option/topic-01.md` |
| 商品期权 / 广州期货交易所 | `option_hist_gfex` | `references/option/topic-01.md` |
| 商品期权 / 广州期货交易所-隐含波动参考值 | `option_vol_gfex` | `references/option/topic-01.md` |
| 商品期权 / 郑州商品交易所 | `option_hist_czce` | `references/option/topic-01.md` |
| 商品期权-新浪 / 历史行情 | `option_commodity_hist_sina` | `references/option/topic-04.md` |
| 商品期权-新浪 / 当前合约 | `option_commodity_contract_sina` | `references/option/topic-04.md` |
| 商品期权-新浪 / 当前合约 | `option_commodity_contract_table_sina` | `references/option/topic-04.md` |
| 期权价值分析-金融期权 | `option_value_analysis_em` | `references/option/topic-04.md` |
| 期权合约信息 | `option_contract_info_ctp` | `references/option/topic-04.md` |
| 期权实时行情-东方财富 | `option_current_em` | `references/option/topic-04.md` |
| 期权折溢价-金融期权 | `option_premium_analysis_em` | `references/option/topic-04.md` |
| 期权风险分析-金融期权 | `option_risk_analysis_em` | `references/option/topic-04.md` |
| 期权龙虎榜-金融期权 | `option_lhb_em` | `references/option/topic-04.md` |
| 金融期权-三大交易所 / 当日合约-上海证券交易所 | `option_current_day_sse` | `references/option/topic-02.md` |
| 金融期权-三大交易所 / 当日合约-深圳证券交易所 | `option_current_day_szse` | `references/option/topic-02.md` |
| 金融期权-三大交易所 / 每日统计-上海证券交易所 | `option_daily_stats_sse` | `references/option/topic-02.md` |
| 金融期权-三大交易所 / 每日统计-深圳证券交易所 | `option_daily_stats_szse` | `references/option/topic-02.md` |
| 金融期权-三大交易所 / 行情数据 | `option_finance_board` | `references/option/topic-02.md` |
| 金融期权-三大交易所 / 风险指标-上海证券交易所 | `option_risk_indicator_sse` | `references/option/topic-02.md` |
| 金融期权-新浪 / 上交所 / 合约到期月份列表 | `option_sse_expire_day_sina` | `references/option/topic-03.md` |
| 金融期权-新浪 / 上交所 / 合约到期月份列表 | `option_sse_list_sina` | `references/option/topic-03.md` |
| 金融期权-新浪 / 上交所 / 实时数据 | `option_sse_spot_price_sina` | `references/option/topic-03.md` |
| 金融期权-新浪 / 上交所 / 所有合约的代码 | `option_sse_codes_sina` | `references/option/topic-03.md` |
| 金融期权-新浪 / 上交所 / 期权希腊字母信息表 | `option_sse_greeks_sina` | `references/option/topic-03.md` |
| 金融期权-新浪 / 上交所 / 期权标的物的实时数据 | `option_sse_underlying_spot_price_sina` | `references/option/topic-03.md` |
| 金融期权-新浪 / 上交所 / 期权行情分时数据-东财 | `option_minute_em` | `references/option/topic-03.md` |
| 金融期权-新浪 / 上交所 / 期权行情分时数据-新浪 | `option_finance_minute_sina` | `references/option/topic-03.md` |
| 金融期权-新浪 / 上交所 / 期权行情分钟数据 | `option_sse_minute_sina` | `references/option/topic-03.md` |
| 金融期权-新浪 / 上交所 / 期权行情日数据 | `option_sse_daily_sina` | `references/option/topic-03.md` |
| 金融期权-新浪 / 中金所 / 上证50指数列表 | `option_cffex_sz50_list_sina` | `references/option/topic-03.md` |
| 金融期权-新浪 / 中金所 / 中证1000指数列表 | `option_cffex_zz1000_list_sina` | `references/option/topic-03.md` |
| 金融期权-新浪 / 中金所 / 实时行情-上证50指数 | `option_cffex_sz50_spot_sina` | `references/option/topic-03.md` |
| 金融期权-新浪 / 中金所 / 实时行情-中证1000指数 | `option_cffex_zz1000_spot_sina` | `references/option/topic-03.md` |
| 金融期权-新浪 / 中金所 / 实时行情-沪深300指数 | `option_cffex_hs300_spot_sina` | `references/option/topic-03.md` |
| 金融期权-新浪 / 中金所 / 日频行情-上证50指数 | `option_cffex_sz50_daily_sina` | `references/option/topic-03.md` |
| 金融期权-新浪 / 中金所 / 日频行情-中证1000指数 | `option_cffex_zz1000_daily_sina` | `references/option/topic-03.md` |
| 金融期权-新浪 / 中金所 / 日频行情-沪深300指数 | `option_cffex_hs300_daily_sina` | `references/option/topic-03.md` |
| 金融期权-新浪 / 中金所 / 沪深300指数列表 | `option_cffex_hs300_list_sina` | `references/option/topic-03.md` |

## 子主题概览
- **商品期权**（8 个接口）：`references/option/topic-01.md`
- **金融期权-三大交易所**（6 个接口）：`references/option/topic-02.md`
- **金融期权-新浪**（19 个接口）：`references/option/topic-03.md`
- **其他细分主题**（9 个接口）：`references/option/topic-04.md`
