# bond 数据导航

先在“精确接口定位”表按用户的中文需求选择一行，再读取该行的接口卡。不得改写函数名；未找到时不要试探 API。

## 精确接口定位

| 中文名称或文档定位 | 精确函数名 | 读取接口卡 |
|---|---|---|
| 上交所债券 / 债券成交概览 | `bond_deal_summary_sse` | `references/bond/topic-04.md` |
| 上交所债券 / 债券现券市场概览 | `bond_cash_summary_sse` | `references/bond/topic-04.md` |
| 中债指数 / 中债指数族系 / 可选指数 | `bond_available_index_cbond` | `references/bond/topic-01.md` |
| 中债指数 / 中债指数族系 / 指数族系查询 | `bond_index_general_cbond` | `references/bond/topic-01.md` |
| 中债指数 / 总指数 / 综合类指数 / 国债指数 | `bond_treasury_index_cbond` | `references/bond/topic-01.md` |
| 中债指数 / 总指数 / 综合类指数 / 新综合指数 | `bond_new_composite_index_cbond` | `references/bond/topic-01.md` |
| 中债指数 / 总指数 / 综合类指数 / 综合指数 | `bond_composite_index_cbond` | `references/bond/topic-01.md` |
| 中国债券市场行情数据 / 国债及其他债券收益率曲线 | `bond_china_yield` | `references/bond/topic-04.md` |
| 中国债券市场行情数据 / 现券市场做市报价 | `bond_spot_quote` | `references/bond/topic-04.md` |
| 中国债券市场行情数据 / 现券市场成交行情 | `bond_spot_deal` | `references/bond/topic-04.md` |
| 中国国债收益率行情 | `bond_gb_zh_sina` | `references/bond/topic-04.md` |
| 中美国债收益率 | `bond_zh_us_rate` | `references/bond/topic-04.md` |
| 债券发行 / 企业债发行 | `bond_corporate_issue_cninfo` | `references/bond/topic-02.md` |
| 债券发行 / 可转债发行 | `bond_cov_issue_cninfo` | `references/bond/topic-02.md` |
| 债券发行 / 可转债转股 | `bond_cov_stock_issue_cninfo` | `references/bond/topic-02.md` |
| 债券发行 / 国债发行 | `bond_treasure_issue_cninfo` | `references/bond/topic-02.md` |
| 债券发行 / 地方债发行 | `bond_local_government_issue_cninfo` | `references/bond/topic-02.md` |
| 债券基础信息 | `bond_info_detail_cm` | `references/bond/topic-04.md` |
| 债券基础数据 / 银行间市场债券发行基础数据 | `bond_debt_nafmii` | `references/bond/topic-04.md` |
| 债券查询 | `bond_info_cm` | `references/bond/topic-04.md` |
| 可转债实时数据-集思录 | `bond_cb_jsl` | `references/bond/topic-04.md` |
| 可转债强赎 | `bond_cb_redeem_jsl` | `references/bond/topic-04.md` |
| 可转债转股价格调整记录-集思录 | `bond_cb_adj_logs_jsl` | `references/bond/topic-04.md` |
| 收盘收益率曲线历史数据 | `bond_china_close_return` | `references/bond/topic-04.md` |
| 沪深债券 / 历史行情数据 | `bond_zh_hs_daily` | `references/bond/topic-04.md` |
| 沪深债券 / 实时行情数据 | `bond_zh_hs_spot` | `references/bond/topic-04.md` |
| 沪深可转债 / 历史行情数据-分时 | `bond_zh_hs_cov_min` | `references/bond/topic-03.md` |
| 沪深可转债 / 历史行情数据-日频 | `bond_zh_hs_cov_daily` | `references/bond/topic-03.md` |
| 沪深可转债 / 历史行情数据-盘前分时 | `bond_zh_hs_cov_pre_min` | `references/bond/topic-03.md` |
| 沪深可转债 / 可转债-债券概况 | `bond_cb_summary_sina` | `references/bond/topic-03.md` |
| 沪深可转债 / 可转债-详情资料 | `bond_cb_profile_sina` | `references/bond/topic-03.md` |
| 沪深可转债 / 可转债价值分析 | `bond_zh_cov_value_analysis` | `references/bond/topic-03.md` |
| 沪深可转债 / 可转债数据一览表 | `bond_zh_cov` | `references/bond/topic-03.md` |
| 沪深可转债 / 可转债比价表 | `bond_cov_comparison` | `references/bond/topic-03.md` |
| 沪深可转债 / 可转债溢价率分析 | `bond_zh_cov_value_analysis` | `references/bond/topic-03.md` |
| 沪深可转债 / 可转债详情 | `bond_zh_cov_info` | `references/bond/topic-03.md` |
| 沪深可转债 / 可转债详情-同花顺 | `bond_zh_cov_info_ths` | `references/bond/topic-03.md` |
| 沪深可转债 / 实时行情数据 | `bond_zh_hs_cov_spot` | `references/bond/topic-03.md` |
| 美国国债收益率行情 | `bond_gb_us_sina` | `references/bond/topic-04.md` |
| 质押式回购 / 上证质押式回购 | `bond_sh_buy_back_em` | `references/bond/topic-04.md` |
| 质押式回购 / 深证质押式回购 | `bond_sz_buy_back_em` | `references/bond/topic-04.md` |
| 质押式回购 / 质押式回购历史数据 | `bond_buy_back_hist_em` | `references/bond/topic-04.md` |
| 集思录可转债等权指数 | `bond_cb_index_jsl` | `references/bond/topic-04.md` |

## 子主题概览
- **中债指数**（5 个接口）：`references/bond/topic-01.md`
- **债券发行**（5 个接口）：`references/bond/topic-02.md`
- **沪深可转债**（12 个接口）：`references/bond/topic-03.md`
- **其他细分主题**（21 个接口）：`references/bond/topic-04.md`
