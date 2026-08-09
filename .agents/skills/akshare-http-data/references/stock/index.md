# stock 数据导航

先在“精确接口定位”表按用户的中文需求选择一行，再读取该行的接口卡。不得改写函数名；未找到时不要试探 API。

## 精确接口定位

| 中文名称或文档定位 | 精确函数名 | 读取接口卡 |
|---|---|---|
| A+H股 / A+H股票字典 | `stock_zh_ah_name` | `references/stock/topic-01.md` |
| A+H股 / 历史行情数据 | `stock_zh_ah_daily` | `references/stock/topic-01.md` |
| A+H股 / 实时行情数据-东财 | `stock_zh_ah_spot_em` | `references/stock/topic-01.md` |
| A+H股 / 实时行情数据-腾讯 | `stock_zh_ah_spot` | `references/stock/topic-01.md` |
| A股 / 个股信息查询-东财 | `stock_individual_info_em` | `references/stock/topic-02-1.md` |
| A股 / 个股信息查询-雪球 | `stock_individual_basic_info_xq` | `references/stock/topic-02-1.md` |
| A股 / 历史分笔数据 / 腾讯财经 | `stock_zh_a_tick_tx` | `references/stock/topic-02-1.md` |
| A股 / 历史行情数据 / 分时数据-东财 | `stock_zh_a_hist_min_em` | `references/stock/topic-02-1.md` |
| A股 / 历史行情数据 / 分时数据-新浪 | `stock_zh_a_minute` | `references/stock/topic-02-1.md` |
| A股 / 历史行情数据 / 历史行情数据-东财 | `stock_zh_a_hist` | `references/stock/topic-02-1.md` |
| A股 / 历史行情数据 / 历史行情数据-新浪 | `stock_zh_a_daily` | `references/stock/topic-02-1.md` |
| A股 / 历史行情数据 / 历史行情数据-腾讯 | `stock_zh_a_hist_tx` | `references/stock/topic-02-1.md` |
| A股 / 历史行情数据 / 日内分时数据-东财 | `stock_intraday_em` | `references/stock/topic-02-1.md` |
| A股 / 历史行情数据 / 日内分时数据-新浪 | `stock_intraday_sina` | `references/stock/topic-02-1.md` |
| A股 / 历史行情数据 / 盘前数据 | `stock_zh_a_hist_pre_min_em` | `references/stock/topic-02-1.md` |
| A股 / 同行比较 / 估值比较 | `stock_zh_valuation_comparison_em` | `references/stock/topic-02-1.md` |
| A股 / 同行比较 / 公司规模 | `stock_zh_scale_comparison_em` | `references/stock/topic-02-2.md` |
| A股 / 同行比较 / 成长性比较 | `stock_zh_growth_comparison_em` | `references/stock/topic-02-1.md` |
| A股 / 同行比较 / 杜邦分析比较 | `stock_zh_dupont_comparison_em` | `references/stock/topic-02-1.md` |
| A股 / 实时行情数据 / 实时行情数据-东财 / AB 股比价 | `stock_zh_ab_comparison_em` | `references/stock/topic-02-1.md` |
| A股 / 实时行情数据 / 实时行情数据-东财 / 京 A 股 | `stock_bj_a_spot_em` | `references/stock/topic-02-1.md` |
| A股 / 实时行情数据 / 实时行情数据-东财 / 创业板 | `stock_cy_a_spot_em` | `references/stock/topic-02-1.md` |
| A股 / 实时行情数据 / 实时行情数据-东财 / 新股 | `stock_new_a_spot_em` | `references/stock/topic-02-1.md` |
| A股 / 实时行情数据 / 实时行情数据-东财 / 沪 A 股 | `stock_sh_a_spot_em` | `references/stock/topic-02-1.md` |
| A股 / 实时行情数据 / 实时行情数据-东财 / 沪深京 A 股 | `stock_zh_a_spot_em` | `references/stock/topic-02-1.md` |
| A股 / 实时行情数据 / 实时行情数据-东财 / 深 A 股 | `stock_sz_a_spot_em` | `references/stock/topic-02-1.md` |
| A股 / 实时行情数据 / 实时行情数据-东财 / 科创板 | `stock_kc_a_spot_em` | `references/stock/topic-02-1.md` |
| A股 / 实时行情数据 / 实时行情数据-新浪 | `stock_zh_a_spot` | `references/stock/topic-02-1.md` |
| A股 / 实时行情数据 / 实时行情数据-雪球 | `stock_individual_spot_xq` | `references/stock/topic-02-1.md` |
| A股 / 股票市场总貌 / 上海证券交易所 | `stock_sse_summary` | `references/stock/topic-02-1.md` |
| A股 / 股票市场总貌 / 上海证券交易所-每日概况 | `stock_sse_deal_daily` | `references/stock/topic-02-1.md` |
| A股 / 股票市场总貌 / 深圳证券交易所 / 地区交易排序 | `stock_szse_area_summary` | `references/stock/topic-02-1.md` |
| A股 / 股票市场总貌 / 深圳证券交易所 / 股票行业成交 | `stock_szse_sector_summary` | `references/stock/topic-02-1.md` |
| A股 / 股票市场总貌 / 深圳证券交易所 / 证券类别统计 | `stock_szse_summary` | `references/stock/topic-02-1.md` |
| A股 / 行情报价 | `stock_bid_ask_em` | `references/stock/topic-02-1.md` |
| A股-CDR / 历史行情数据 | `stock_zh_a_cdr_daily` | `references/stock/topic-23-1.md` |
| B股 / 历史行情数据 / 分时数据 | `stock_zh_b_minute` | `references/stock/topic-03.md` |
| B股 / 历史行情数据 / 历史行情数据 | `stock_zh_b_daily` | `references/stock/topic-03.md` |
| B股 / 实时行情数据 / 实时行情数据-东财 | `stock_zh_b_spot_em` | `references/stock/topic-03.md` |
| B股 / 实时行情数据 / 实时行情数据-新浪 | `stock_zh_b_spot` | `references/stock/topic-03.md` |
| ESG 评级 / ESG 评级数据 | `stock_esg_rate_sina` | `references/stock/topic-04.md` |
| ESG 评级 / MSCI | `stock_esg_msci_sina` | `references/stock/topic-04.md` |
| ESG 评级 / 华证指数 | `stock_esg_hz_sina` | `references/stock/topic-04.md` |
| ESG 评级 / 秩鼎 | `stock_esg_zd_sina` | `references/stock/topic-04.md` |
| ESG 评级 / 路孚特 | `stock_esg_rft_sina` | `references/stock/topic-04.md` |
| IPO 受益股 | `stock_ipo_benefit_ths` | `references/stock/topic-23-1.md` |
| 一致行动人 | `stock_yzxdr_em` | `references/stock/topic-23-1.md` |
| 两网及退市 | `stock_zh_a_stop_em` | `references/stock/topic-23-1.md` |
| 个股新闻 | `stock_news_em` | `references/stock/topic-23-1.md` |
| 主营介绍-同花顺 | `stock_zyjs_ths` | `references/stock/topic-23-1.md` |
| 主营构成-东财 | `stock_zygc_em` | `references/stock/topic-23-1.md` |
| 停复牌 | `news_trade_notify_suspend_baidu` | `references/stock/topic-23-1.md` |
| 停复牌信息 | `stock_tfp_em` | `references/stock/topic-23-1.md` |
| 分析师指数 / 分析师指数排行 | `stock_analyst_rank_em` | `references/stock/topic-23-1.md` |
| 分析师指数 / 分析师详情 | `stock_analyst_detail_em` | `references/stock/topic-23-1.md` |
| 分红派息 | `news_trade_notify_dividend_baidu` | `references/stock/topic-23-1.md` |
| 分红配送 / 分红情况-同花顺 | `stock_fhps_detail_ths` | `references/stock/topic-05.md` |
| 分红配送 / 分红配送-东财 | `stock_fhps_em` | `references/stock/topic-05.md` |
| 分红配送 / 分红配送详情-东财 | `stock_fhps_detail_em` | `references/stock/topic-05.md` |
| 分红配送 / 分红配送详情-港股-同花顺 | `stock_hk_fhpx_detail_ths` | `references/stock/topic-05.md` |
| 千股千评 | `stock_comment_em` | `references/stock/topic-23-1.md` |
| 千股千评详情 / 主力控盘 / 机构参与度 | `stock_comment_detail_zlkp_jgcyd_em` | `references/stock/topic-06.md` |
| 千股千评详情 / 市场热度 / 市场参与意愿 | `stock_comment_detail_scrd_desire_em` | `references/stock/topic-06.md` |
| 千股千评详情 / 市场热度 / 用户关注指数 | `stock_comment_detail_scrd_focus_em` | `references/stock/topic-06.md` |
| 千股千评详情 / 综合评价 / 历史评分 | `stock_comment_detail_zhpj_lspf_em` | `references/stock/topic-06.md` |
| 商誉专题 / A股商誉市场概况 | `stock_sy_profile_em` | `references/stock/topic-07.md` |
| 商誉专题 / 个股商誉减值明细 | `stock_sy_jz_em` | `references/stock/topic-07.md` |
| 商誉专题 / 个股商誉明细 | `stock_sy_em` | `references/stock/topic-07.md` |
| 商誉专题 / 商誉减值预期明细 | `stock_sy_yq_em` | `references/stock/topic-07.md` |
| 商誉专题 / 行业商誉 | `stock_sy_hy_em` | `references/stock/topic-07.md` |
| 基本面数据 / A 股估值指标 | `stock_zh_valuation_baidu` | `references/stock/topic-08-4.md` |
| 基本面数据 / A 股等权重与中位数市净率 | `stock_a_all_pb` | `references/stock/topic-08-4.md` |
| 基本面数据 / A 股等权重与中位数市盈率 | `stock_a_ttm_lyr` | `references/stock/topic-08-4.md` |
| 基本面数据 / A 股股息率 | `stock_a_gxl_lg` | `references/stock/topic-08-4.md` |
| 基本面数据 / IPO审核信息 / 全部 | `stock_register_all_em` | `references/stock/topic-08-5.md` |
| 基本面数据 / IPO审核信息 / 科创板 | `stock_register_kcb` | `references/stock/topic-08-5.md` |
| 基本面数据 / IPO审核信息 / 科创板 / 上海主板 | `stock_register_sh` | `references/stock/topic-08-5.md` |
| 基本面数据 / IPO审核信息 / 科创板 / 创业板 | `stock_register_cyb` | `references/stock/topic-08-5.md` |
| 基本面数据 / IPO审核信息 / 科创板 / 北交所 | `stock_register_bj` | `references/stock/topic-08-5.md` |
| 基本面数据 / IPO审核信息 / 科创板 / 深圳主板 | `stock_register_sz` | `references/stock/topic-08-5.md` |
| 基本面数据 / IPO审核信息 / 达标企业 | `stock_register_db` | `references/stock/topic-08-5.md` |
| 基本面数据 / IPO辅导信息 | `stock_ipo_tutor_em` | `references/stock/topic-08-2.md` |
| 基本面数据 / 两网及退市 | `stock_staq_net_stop` | `references/stock/topic-08-3.md` |
| 基本面数据 / 个股估值 | `stock_value_em` | `references/stock/topic-08-4.md` |
| 基本面数据 / 个股研报 | `stock_research_report_em` | `references/stock/topic-08-1.md` |
| 基本面数据 / 主板市净率 | `stock_market_pb_lg` | `references/stock/topic-08-4.md` |
| 基本面数据 / 主板市盈率 | `stock_market_pe_lg` | `references/stock/topic-08-4.md` |
| 基本面数据 / 主要指标-东方财富 | `stock_financial_analysis_indicator_em` | `references/stock/topic-08-1.md` |
| 基本面数据 / 主要股东 | `stock_main_stock_holder` | `references/stock/topic-08-3.md` |
| 基本面数据 / 关键指标-同花顺 | `stock_financial_abstract_new_ths` | `references/stock/topic-08-1.md` |
| 基本面数据 / 关键指标-新浪 | `stock_financial_abstract` | `references/stock/topic-08-1.md` |
| 基本面数据 / 分红配股 | `stock_history_dividend_detail` | `references/stock/topic-08-2.md` |
| 基本面数据 / 创新高和新低的股票数量 | `stock_a_high_low_statistics` | `references/stock/topic-08-4.md` |
| 基本面数据 / 券商业绩月报 | `stock_qsjy_em` | `references/stock/topic-08-4.md` |
| 基本面数据 / 十大流通股东(个股) | `stock_gdfx_free_top_10_em` | `references/stock/topic-08-1.md` |
| 基本面数据 / 十大股东(个股) | `stock_gdfx_top_10_em` | `references/stock/topic-08-2.md` |
| 基本面数据 / 历史分红 | `stock_dividend_cninfo` | `references/stock/topic-08-2.md` |
| 基本面数据 / 历史分红 | `stock_history_dividend` | `references/stock/topic-08-1.md` |
| 基本面数据 / 名称变更-深证 | `stock_info_sz_change_name` | `references/stock/topic-08-3.md` |
| 基本面数据 / 基金持股 | `stock_fund_stock_holder` | `references/stock/topic-08-3.md` |
| 基本面数据 / 基金持股 | `stock_report_fund_hold` | `references/stock/topic-08-4.md` |
| 基本面数据 / 基金持股明细 | `stock_report_fund_hold_detail` | `references/stock/topic-08-4.md` |
| 基本面数据 / 增发 | `stock_qbzf_em` | `references/stock/topic-08-5.md` |
| 基本面数据 / 大盘拥挤度 | `stock_a_congestion_lg` | `references/stock/topic-08-4.md` |
| 基本面数据 / 巴菲特指标 | `stock_buffett_index_lg` | `references/stock/topic-08-4.md` |
| 基本面数据 / 恒生指数股息率 | `stock_hk_gxl_lg` | `references/stock/topic-08-4.md` |
| 基本面数据 / 指数市净率 | `stock_index_pb_lg` | `references/stock/topic-08-4.md` |
| 基本面数据 / 指数市盈率 | `stock_index_pe_lg` | `references/stock/topic-08-4.md` |
| 基本面数据 / 新股上会信息 | `stock_ipo_review_em` | `references/stock/topic-08-2.md` |
| 基本面数据 / 新股发行 | `stock_ipo_info` | `references/stock/topic-08-2.md` |
| 基本面数据 / 暂停/终止上市-上证 | `stock_info_sh_delist` | `references/stock/topic-08-3.md` |
| 基本面数据 / 机构持股 / 机构持股一览表 | `stock_institute_hold` | `references/stock/topic-08-3.md` |
| 基本面数据 / 机构持股 / 机构持股详情 | `stock_institute_hold_detail` | `references/stock/topic-08-3.md` |
| 基本面数据 / 机构推荐 / 人员增减持股变动明细 | `stock_hold_management_person_em` | `references/stock/topic-08-3.md` |
| 基本面数据 / 机构推荐 / 公司诉讼 | `stock_cg_lawsuit_cninfo` | `references/stock/topic-08-3.md` |
| 基本面数据 / 机构推荐 / 实际控制人持股变动 | `stock_hold_control_cninfo` | `references/stock/topic-08-3.md` |
| 基本面数据 / 机构推荐 / 对外担保 | `stock_cg_guarantee_cninfo` | `references/stock/topic-08-3.md` |
| 基本面数据 / 机构推荐 / 投资评级 | `stock_rank_forecast_cninfo` | `references/stock/topic-08-3.md` |
| 基本面数据 / 机构推荐 / 新股发行 | `stock_new_ipo_cninfo` | `references/stock/topic-08-3.md` |
| 基本面数据 / 机构推荐 / 新股过会 | `stock_new_gh_cninfo` | `references/stock/topic-08-3.md` |
| 基本面数据 / 机构推荐 / 机构推荐池 | `stock_institute_recommend` | `references/stock/topic-08-3.md` |
| 基本面数据 / 机构推荐 / 申万个股行业分类变动历史 | `stock_industry_clf_hist_sw` | `references/stock/topic-08-3.md` |
| 基本面数据 / 机构推荐 / 股东人数及持股集中度 | `stock_hold_num_cninfo` | `references/stock/topic-08-3.md` |
| 基本面数据 / 机构推荐 / 股本变动 | `stock_hold_change_cninfo` | `references/stock/topic-08-3.md` |
| 基本面数据 / 机构推荐 / 股权质押 | `stock_cg_equity_mortgage_cninfo` | `references/stock/topic-08-4.md` |
| 基本面数据 / 机构推荐 / 股票评级记录 | `stock_institute_recommend_detail` | `references/stock/topic-08-3.md` |
| 基本面数据 / 机构推荐 / 董监高及相关人员持股变动-上证 | `stock_share_hold_change_sse` | `references/stock/topic-08-3.md` |
| 基本面数据 / 机构推荐 / 董监高及相关人员持股变动-北证 | `stock_share_hold_change_bse` | `references/stock/topic-08-3.md` |
| 基本面数据 / 机构推荐 / 董监高及相关人员持股变动-深证 | `stock_share_hold_change_szse` | `references/stock/topic-08-3.md` |
| 基本面数据 / 机构推荐 / 董监高及相关人员持股变动明细 | `stock_hold_management_detail_em` | `references/stock/topic-08-3.md` |
| 基本面数据 / 机构推荐 / 行业市盈率 | `stock_industry_pe_ratio_cninfo` | `references/stock/topic-08-3.md` |
| 基本面数据 / 机构推荐 / 高管持股变动明细 | `stock_hold_management_detail_cninfo` | `references/stock/topic-08-3.md` |
| 基本面数据 / 板块行情 | `stock_sector_spot` | `references/stock/topic-08-2.md` |
| 基本面数据 / 板块详情 | `stock_sector_detail` | `references/stock/topic-08-2.md` |
| 基本面数据 / 沪深京 A 股个股公告 | `stock_individual_notice_report` | `references/stock/topic-08-1.md` |
| 基本面数据 / 沪深京 A 股公告 | `stock_notice_report` | `references/stock/topic-08-1.md` |
| 基本面数据 / 流通股东 | `stock_circulate_stock_holder` | `references/stock/topic-08-2.md` |
| 基本面数据 / 涨跌投票 | `stock_zh_vote_baidu` | `references/stock/topic-08-4.md` |
| 基本面数据 / 港股个股指标 | `stock_hk_indicator_eniu` | `references/stock/topic-08-4.md` |
| 基本面数据 / 港股估值指标 | `stock_hk_valuation_baidu` | `references/stock/topic-08-4.md` |
| 基本面数据 / 港股财务报表 | `stock_financial_hk_report_em` | `references/stock/topic-08-1.md` |
| 基本面数据 / 港股财务指标 | `stock_financial_hk_analysis_indicator_em` | `references/stock/topic-08-1.md` |
| 基本面数据 / 破净股统计 | `stock_a_below_net_asset_statistics` | `references/stock/topic-08-4.md` |
| 基本面数据 / 终止/暂停上市-深证 | `stock_info_sz_delist` | `references/stock/topic-08-3.md` |
| 基本面数据 / 美港目标价 | `stock_price_js` | `references/stock/topic-08-4.md` |
| 基本面数据 / 美股估值指标 | `stock_us_valuation_baidu` | `references/stock/topic-08-4.md` |
| 基本面数据 / 美股财务报表 | `stock_financial_us_report_em` | `references/stock/topic-08-1.md` |
| 基本面数据 / 美股财务指标 | `stock_financial_us_analysis_indicator_em` | `references/stock/topic-08-1.md` |
| 基本面数据 / 股东协同-十大流通股东 | `stock_gdfx_free_holding_teamwork_em` | `references/stock/topic-08-2.md` |
| 基本面数据 / 股东协同-十大股东 | `stock_gdfx_holding_teamwork_em` | `references/stock/topic-08-2.md` |
| 基本面数据 / 股东大会 | `stock_gddh_em` | `references/stock/topic-08-1.md` |
| 基本面数据 / 股东户数 | `stock_zh_a_gdhs` | `references/stock/topic-08-2.md` |
| 基本面数据 / 股东户数详情 | `stock_zh_a_gdhs_detail_em` | `references/stock/topic-08-2.md` |
| 基本面数据 / 股东持股分析-十大流通股东 | `stock_gdfx_free_holding_analyse_em` | `references/stock/topic-08-2.md` |
| 基本面数据 / 股东持股分析-十大股东 | `stock_gdfx_holding_analyse_em` | `references/stock/topic-08-2.md` |
| 基本面数据 / 股东持股变动统计 | `stock_shareholder_change_ths` | `references/stock/topic-08-2.md` |
| 基本面数据 / 股东持股变动统计-十大流通股东 | `stock_gdfx_free_holding_change_em` | `references/stock/topic-08-2.md` |
| 基本面数据 / 股东持股变动统计-十大股东 | `stock_gdfx_holding_change_em` | `references/stock/topic-08-2.md` |
| 基本面数据 / 股东持股明细-十大流通股东 | `stock_gdfx_free_holding_detail_em` | `references/stock/topic-08-2.md` |
| 基本面数据 / 股东持股明细-十大股东 | `stock_gdfx_holding_detail_em` | `references/stock/topic-08-2.md` |
| 基本面数据 / 股东持股统计-十大流通股东 | `stock_gdfx_free_holding_statistics_em` | `references/stock/topic-08-2.md` |
| 基本面数据 / 股东持股统计-十大股东 | `stock_gdfx_holding_statistics_em` | `references/stock/topic-08-2.md` |
| 基本面数据 / 股债利差 | `stock_ebs_lg` | `references/stock/topic-08-4.md` |
| 基本面数据 / 股本结构 | `stock_zh_a_gbjg_em` | `references/stock/topic-08-5.md` |
| 基本面数据 / 股票列表-A股 | `stock_info_a_code_name` | `references/stock/topic-08-2.md` |
| 基本面数据 / 股票列表-上证 | `stock_info_sh_name_code` | `references/stock/topic-08-3.md` |
| 基本面数据 / 股票列表-北证 | `stock_info_bj_name_code` | `references/stock/topic-08-3.md` |
| 基本面数据 / 股票列表-深证 | `stock_info_sz_name_code` | `references/stock/topic-08-3.md` |
| 基本面数据 / 股票回购数据 | `stock_repurchase_em` | `references/stock/topic-08-5.md` |
| 基本面数据 / 股票增发 | `stock_add_stock` | `references/stock/topic-08-2.md` |
| 基本面数据 / 股票更名 | `stock_info_change_name` | `references/stock/topic-08-3.md` |
| 基本面数据 / 营业部详情数据-东财 | `stock_lhb_yyb_detail_em` | `references/stock/topic-08-4.md` |
| 基本面数据 / 营业部详情数据-东财 / 个股龙虎榜详情 | `stock_lhb_stock_detail_em` | `references/stock/topic-08-5.md` |
| 基本面数据 / 营业部详情数据-东财 / 营业部排行 | `stock_lhb_yybph_em` | `references/stock/topic-08-5.md` |
| 基本面数据 / 营业部详情数据-东财 / 营业部统计 | `stock_lhb_traderstatistic_em` | `references/stock/topic-08-5.md` |
| 基本面数据 / 营业部详情数据-东财 / 龙虎榜-个股上榜统计 | `stock_lhb_ggtj_sina` | `references/stock/topic-08-5.md` |
| 基本面数据 / 营业部详情数据-东财 / 龙虎榜-机构席位成交明细 | `stock_lhb_jgmx_sina` | `references/stock/topic-08-5.md` |
| 基本面数据 / 营业部详情数据-东财 / 龙虎榜-机构席位追踪 | `stock_lhb_jgzz_sina` | `references/stock/topic-08-5.md` |
| 基本面数据 / 营业部详情数据-东财 / 龙虎榜-每日详情 | `stock_lhb_detail_daily_sina` | `references/stock/topic-08-5.md` |
| 基本面数据 / 营业部详情数据-东财 / 龙虎榜-营业上榜统计 | `stock_lhb_yytj_sina` | `references/stock/topic-08-5.md` |
| 基本面数据 / 营业部详情数据-东财 / 龙虎榜-营业部排行 / 龙虎榜-营业部排行-上榜次数最多 | `stock_lh_yyb_most` | `references/stock/topic-08-5.md` |
| 基本面数据 / 营业部详情数据-东财 / 龙虎榜-营业部排行 / 龙虎榜-营业部排行-抱团操作实力 | `stock_lh_yyb_control` | `references/stock/topic-08-5.md` |
| 基本面数据 / 营业部详情数据-东财 / 龙虎榜-营业部排行 / 龙虎榜-营业部排行-资金实力最强 | `stock_lh_yyb_capital` | `references/stock/topic-08-5.md` |
| 基本面数据 / 财务报表-东财 / 利润表-按单季度 | `stock_profit_sheet_by_quarterly_em` | `references/stock/topic-08-1.md` |
| 基本面数据 / 财务报表-东财 / 利润表-按年度 | `stock_profit_sheet_by_yearly_em` | `references/stock/topic-08-1.md` |
| 基本面数据 / 财务报表-东财 / 利润表-按报告期 | `stock_profit_sheet_by_report_em` | `references/stock/topic-08-1.md` |
| 基本面数据 / 财务报表-东财 / 现金流量表-按单季度 | `stock_cash_flow_sheet_by_quarterly_em` | `references/stock/topic-08-1.md` |
| 基本面数据 / 财务报表-东财 / 现金流量表-按年度 | `stock_cash_flow_sheet_by_yearly_em` | `references/stock/topic-08-1.md` |
| 基本面数据 / 财务报表-东财 / 现金流量表-按报告期 | `stock_cash_flow_sheet_by_report_em` | `references/stock/topic-08-1.md` |
| 基本面数据 / 财务报表-东财 / 资产负债表-按年度 | `stock_balance_sheet_by_yearly_em` | `references/stock/topic-08-1.md` |
| 基本面数据 / 财务报表-东财 / 资产负债表-按报告期 | `stock_balance_sheet_by_report_em` | `references/stock/topic-08-1.md` |
| 基本面数据 / 财务报表-东财-已退市股票 / 利润表-按报告期 | `stock_profit_sheet_by_report_delisted_em` | `references/stock/topic-08-1.md` |
| 基本面数据 / 财务报表-东财-已退市股票 / 现金流量表-按报告期 | `stock_cash_flow_sheet_by_report_delisted_em` | `references/stock/topic-08-1.md` |
| 基本面数据 / 财务报表-东财-已退市股票 / 资产负债表-按报告期 | `stock_balance_sheet_by_report_delisted_em` | `references/stock/topic-08-1.md` |
| 基本面数据 / 财务报表-同花顺 / 利润表 | `stock_financial_benefit_new_ths` | `references/stock/topic-08-1.md` |
| 基本面数据 / 财务报表-同花顺 / 现金流量表 | `stock_financial_cash_new_ths` | `references/stock/topic-08-1.md` |
| 基本面数据 / 财务报表-同花顺 / 资产负债表 | `stock_financial_debt_new_ths` | `references/stock/topic-08-1.md` |
| 基本面数据 / 财务报表-新浪 | `stock_financial_report_sina` | `references/stock/topic-08-1.md` |
| 基本面数据 / 财务指标 | `stock_financial_analysis_indicator` | `references/stock/topic-08-1.md` |
| 基本面数据 / 配股 | `stock_pg_em` | `references/stock/topic-08-5.md` |
| 基本面数据 / 重大合同 | `stock_zdhtmx_em` | `references/stock/topic-08-1.md` |
| 基本面数据 / 限售解禁 / 个股限售解禁-新浪 | `stock_restricted_release_queue_sina` | `references/stock/topic-08-2.md` |
| 基本面数据 / 限售解禁 / 解禁批次 | `stock_restricted_release_queue_em` | `references/stock/topic-08-2.md` |
| 基本面数据 / 限售解禁 / 解禁股东 | `stock_restricted_release_stockholder_em` | `references/stock/topic-08-2.md` |
| 基本面数据 / 限售解禁 / 限售股解禁 | `stock_restricted_release_summary_em` | `references/stock/topic-08-2.md` |
| 基本面数据 / 限售解禁 / 限售股解禁详情 | `stock_restricted_release_detail_em` | `references/stock/topic-08-2.md` |
| 基本面数据 / 首发申报信息 | `stock_ipo_declare_em` | `references/stock/topic-08-5.md` |
| 基本面数据 / 高管持股变动统计 | `stock_management_change_ths` | `references/stock/topic-08-2.md` |
| 基本面数据 / 龙虎榜 / 龙虎榜-东财 / 个股上榜统计 | `stock_lhb_stock_statistic_em` | `references/stock/topic-08-4.md` |
| 基本面数据 / 龙虎榜 / 龙虎榜-东财 / 机构买卖每日统计 | `stock_lhb_jgmmtj_em` | `references/stock/topic-08-4.md` |
| 基本面数据 / 龙虎榜 / 龙虎榜-东财 / 机构席位追踪 | `stock_lhb_jgstatistic_em` | `references/stock/topic-08-4.md` |
| 基本面数据 / 龙虎榜 / 龙虎榜-东财 / 每日活跃营业部 | `stock_lhb_hyyyb_em` | `references/stock/topic-08-4.md` |
| 基本面数据 / 龙虎榜 / 龙虎榜-东财 / 龙虎榜详情 | `stock_lhb_detail_em` | `references/stock/topic-08-4.md` |
| 大宗交易 / 市场统计 | `stock_dzjy_sctj` | `references/stock/topic-09.md` |
| 大宗交易 / 每日明细 | `stock_dzjy_mrmx` | `references/stock/topic-09.md` |
| 大宗交易 / 每日统计 | `stock_dzjy_mrtj` | `references/stock/topic-09.md` |
| 大宗交易 / 活跃 A 股统计 | `stock_dzjy_hygtj` | `references/stock/topic-09.md` |
| 大宗交易 / 活跃营业部统计 | `stock_dzjy_hyyybtj` | `references/stock/topic-09.md` |
| 大宗交易 / 营业部排行 | `stock_dzjy_yybph` | `references/stock/topic-09.md` |
| 年报季报 / 上市公司行业归属的变动情况-巨潮资讯 | `stock_industry_change_cninfo` | `references/stock/topic-10.md` |
| 年报季报 / 上市相关-巨潮资讯 | `stock_ipo_summary_cninfo` | `references/stock/topic-10.md` |
| 年报季报 / 业绩快报 | `stock_yjkb_em` | `references/stock/topic-10.md` |
| 年报季报 / 业绩报表 | `stock_yjbb_em` | `references/stock/topic-10.md` |
| 年报季报 / 业绩预告 | `stock_yjyg_em` | `references/stock/topic-10.md` |
| 年报季报 / 信息披露公告-巨潮资讯 | `stock_zh_a_disclosure_report_cninfo` | `references/stock/topic-10.md` |
| 年报季报 / 信息披露调研-巨潮资讯 | `stock_zh_a_disclosure_relation_cninfo` | `references/stock/topic-10.md` |
| 年报季报 / 公司概况-巨潮资讯 | `stock_profile_cninfo` | `references/stock/topic-10.md` |
| 年报季报 / 公司股本变动-巨潮资讯 | `stock_share_change_cninfo` | `references/stock/topic-10.md` |
| 年报季报 / 利润表 | `stock_lrb_em` | `references/stock/topic-10.md` |
| 年报季报 / 现金流量表 | `stock_xjll_em` | `references/stock/topic-10.md` |
| 年报季报 / 行业分类数据-巨潮资讯 | `stock_industry_category_cninfo` | `references/stock/topic-10.md` |
| 年报季报 / 资产负债表-北交所 | `stock_zcfz_bj_em` | `references/stock/topic-10.md` |
| 年报季报 / 资产负债表-沪深 | `stock_zcfz_em` | `references/stock/topic-10.md` |
| 年报季报 / 配股实施方案-巨潮资讯 | `stock_allotment_cninfo` | `references/stock/topic-10.md` |
| 年报季报 / 预约披露时间-东方财富 | `stock_yysj_em` | `references/stock/topic-10.md` |
| 年报季报 / 预约披露时间-巨潮资讯 | `stock_report_disclosure` | `references/stock/topic-10.md` |
| 技术指标 / 向上突破 | `stock_rank_xstp_ths` | `references/stock/topic-11.md` |
| 技术指标 / 向下突破 | `stock_rank_xxtp_ths` | `references/stock/topic-11.md` |
| 技术指标 / 持续放量 | `stock_rank_cxfl_ths` | `references/stock/topic-11.md` |
| 技术指标 / 持续缩量 | `stock_rank_cxsl_ths` | `references/stock/topic-11.md` |
| 技术指标 / 量价齐升 | `stock_rank_ljqs_ths` | `references/stock/topic-11.md` |
| 技术指标 / 量价齐跌 | `stock_rank_ljqd_ths` | `references/stock/topic-11.md` |
| 技术指标 / 险资举牌 | `stock_rank_xzjp_ths` | `references/stock/topic-11.md` |
| 新股 | `stock_zh_a_new_em` | `references/stock/topic-23-1.md` |
| 新股上市首日 | `stock_xgsr_ths` | `references/stock/topic-23-1.md` |
| 新股数据 / 打新收益率 | `stock_dxsyl_em` | `references/stock/topic-12.md` |
| 新股数据 / 新股申购与中签 | `stock_xgsglb_em` | `references/stock/topic-12.md` |
| 新股数据 / 新股申购与中签-同花顺 | `stock_ipo_ths` | `references/stock/topic-12.md` |
| 新股数据 / 新股申购与中签-港股-同花顺 | `stock_ipo_hk_ths` | `references/stock/topic-12.md` |
| 机构调研 / 机构调研-统计 | `stock_jgdy_tj_em` | `references/stock/topic-23-1.md` |
| 机构调研 / 机构调研-详细 | `stock_jgdy_detail_em` | `references/stock/topic-23-1.md` |
| 板块异动详情 | `stock_board_change_em` | `references/stock/topic-23-1.md` |
| 概念板块 / 东方财富-成份股 | `stock_board_concept_cons_em` | `references/stock/topic-13.md` |
| 概念板块 / 东方财富-指数 | `stock_board_concept_hist_em` | `references/stock/topic-13.md` |
| 概念板块 / 东方财富-指数-分时 | `stock_board_concept_hist_min_em` | `references/stock/topic-13.md` |
| 概念板块 / 东方财富-概念板块 | `stock_board_concept_name_em` | `references/stock/topic-13.md` |
| 概念板块 / 东方财富-概念板块-实时行情 | `stock_board_concept_spot_em` | `references/stock/topic-13.md` |
| 概念板块 / 同花顺-概念板块指数 | `stock_board_concept_index_ths` | `references/stock/topic-13.md` |
| 概念板块 / 同花顺-概念板块简介 | `stock_board_concept_info_ths` | `references/stock/topic-13.md` |
| 概念板块 / 富途牛牛-美股概念-成分股 | `stock_concept_cons_futu` | `references/stock/topic-13.md` |
| 次新股 | `stock_zh_a_new` | `references/stock/topic-23-1.md` |
| 沪深港通持股 / 个股排行 | `stock_hsgt_hold_stock_em` | `references/stock/topic-14.md` |
| 沪深港通持股 / 参考汇率-沪港通 | `stock_sgt_reference_exchange_rate_sse` | `references/stock/topic-14.md` |
| 沪深港通持股 / 参考汇率-深港通 | `stock_sgt_reference_exchange_rate_szse` | `references/stock/topic-14.md` |
| 沪深港通持股 / 机构排行 | `stock_hsgt_institution_statistics_em` | `references/stock/topic-14.md` |
| 沪深港通持股 / 板块排行 | `stock_hsgt_board_rank_em` | `references/stock/topic-14.md` |
| 沪深港通持股 / 每日个股统计 | `stock_hsgt_stock_statistics_em` | `references/stock/topic-14.md` |
| 沪深港通持股 / 沪深港通-港股通(沪>港)实时行情 | `stock_hsgt_sh_hk_spot_em` | `references/stock/topic-14.md` |
| 沪深港通持股 / 沪深港通分时数据 | `stock_hsgt_fund_min_em` | `references/stock/topic-14.md` |
| 沪深港通持股 / 沪深港通历史数据 | `stock_hsgt_hist_em` | `references/stock/topic-14.md` |
| 沪深港通持股 / 沪深港通持股-个股 | `stock_hsgt_individual_em` | `references/stock/topic-14.md` |
| 沪深港通持股 / 沪深港通持股-个股详情 | `stock_hsgt_individual_detail_em` | `references/stock/topic-14.md` |
| 沪深港通持股 / 港股通成份股 | `stock_hk_ggt_components_em` | `references/stock/topic-14.md` |
| 沪深港通持股 / 结算汇率-沪港通 | `stock_sgt_settlement_exchange_rate_sse` | `references/stock/topic-14.md` |
| 沪深港通持股 / 结算汇率-深港通 | `stock_sgt_settlement_exchange_rate_szse` | `references/stock/topic-14.md` |
| 沪深港通资金流向 | `stock_hsgt_fund_flow_summary_em` | `references/stock/topic-23-1.md` |
| 涨停板行情 / 强势股池 | `stock_zt_pool_strong_em` | `references/stock/topic-15.md` |
| 涨停板行情 / 昨日涨停股池 | `stock_zt_pool_previous_em` | `references/stock/topic-15.md` |
| 涨停板行情 / 次新股池 | `stock_zt_pool_sub_new_em` | `references/stock/topic-15.md` |
| 涨停板行情 / 涨停股池 | `stock_zt_pool_em` | `references/stock/topic-15.md` |
| 涨停板行情 / 炸板股池 | `stock_zt_pool_zbgc_em` | `references/stock/topic-15.md` |
| 涨停板行情 / 跌停股池 | `stock_zt_pool_dtgc_em` | `references/stock/topic-15.md` |
| 港股 / 个股信息查询-雪球 | `stock_individual_basic_info_hk_xq` | `references/stock/topic-16.md` |
| 港股 / 公司资料 | `stock_hk_company_profile_em` | `references/stock/topic-16.md` |
| 港股 / 分时数据-东财 | `stock_hk_hist_min_em` | `references/stock/topic-16.md` |
| 港股 / 分红派息 | `stock_hk_dividend_payout_em` | `references/stock/topic-16.md` |
| 港股 / 历史行情数据-东财 | `stock_hk_hist` | `references/stock/topic-16.md` |
| 港股 / 历史行情数据-新浪 | `stock_hk_daily` | `references/stock/topic-16.md` |
| 港股 / 实时行情数据-东财 | `stock_hk_spot_em` | `references/stock/topic-16.md` |
| 港股 / 实时行情数据-新浪 | `stock_hk_spot` | `references/stock/topic-16.md` |
| 港股 / 港股主板实时行情数据-东财 | `stock_hk_main_board_spot_em` | `references/stock/topic-16.md` |
| 港股 / 知名港股 | `stock_hk_famous_spot_em` | `references/stock/topic-16.md` |
| 港股 / 行业对比 / 估值对比 | `stock_hk_valuation_comparison_em` | `references/stock/topic-16.md` |
| 港股 / 行业对比 / 成长性对比 | `stock_hk_growth_comparison_em` | `references/stock/topic-16.md` |
| 港股 / 行业对比 / 规模对比 | `stock_hk_scale_comparison_em` | `references/stock/topic-16.md` |
| 港股 / 证券资料 | `stock_hk_security_profile_em` | `references/stock/topic-16.md` |
| 港股 / 财务指标 | `stock_hk_financial_indicator_em` | `references/stock/topic-16.md` |
| 港股盈利预测-经济通 | `stock_hk_profit_forecast_et` | `references/stock/topic-23-1.md` |
| 盈利预测-东方财富 | `stock_profit_forecast_em` | `references/stock/topic-23-1.md` |
| 盈利预测-同花顺 | `stock_profit_forecast_ths` | `references/stock/topic-23-1.md` |
| 盘口异动 | `stock_changes_em` | `references/stock/topic-23-1.md` |
| 科创板 / 历史行情数据 | `stock_zh_kcb_daily` | `references/stock/topic-23-1.md` |
| 科创板 / 实时行情数据 | `stock_zh_kcb_spot` | `references/stock/topic-23-1.md` |
| 科创板 / 科创板公告 | `stock_zh_kcb_report_em` | `references/stock/topic-23-1.md` |
| 筹码分布 | `stock_cyq_em` | `references/stock/topic-23-1.md` |
| 美股 / 个股信息查询-雪球 | `stock_individual_basic_info_us_xq` | `references/stock/topic-17.md` |
| 美股 / 分时数据-东财 | `stock_us_hist_min_em` | `references/stock/topic-17.md` |
| 美股 / 历史行情数据-东财 | `stock_us_hist` | `references/stock/topic-17.md` |
| 美股 / 历史行情数据-新浪 | `stock_us_daily` | `references/stock/topic-17.md` |
| 美股 / 实时行情数据-东财 | `stock_us_spot_em` | `references/stock/topic-17.md` |
| 美股 / 实时行情数据-新浪 | `stock_us_spot` | `references/stock/topic-17.md` |
| 美股 / 知名美股 | `stock_us_famous_spot_em` | `references/stock/topic-17.md` |
| 美股 / 粉单市场 | `stock_us_pink_spot_em` | `references/stock/topic-17.md` |
| 股市日历 / 公司动态 | `stock_gsrl_gsdt_em` | `references/stock/topic-23-1.md` |
| 股票热度 / 个股人气榜-实时变动 / A股 | `stock_hot_rank_detail_realtime_em` | `references/stock/topic-18.md` |
| 股票热度 / 个股人气榜-实时变动 / 港股 | `stock_hk_hot_rank_detail_realtime_em` | `references/stock/topic-18.md` |
| 股票热度 / 个股人气榜-最新排名 / A股 | `stock_hot_rank_latest_em` | `references/stock/topic-18.md` |
| 股票热度 / 个股人气榜-最新排名 / 港股 | `stock_hk_hot_rank_latest_em` | `references/stock/topic-18.md` |
| 股票热度 / 互动平台 / 上证e互动 | `stock_sns_sseinfo` | `references/stock/topic-18.md` |
| 股票热度 / 互动平台 / 互动易-回答 | `stock_irm_ans_cninfo` | `references/stock/topic-18.md` |
| 股票热度 / 互动平台 / 互动易-提问 | `stock_irm_cninfo` | `references/stock/topic-18.md` |
| 股票热度 / 内部交易 | `stock_inner_trade_xq` | `references/stock/topic-18.md` |
| 股票热度 / 历史趋势及粉丝特征 / A股 | `stock_hot_rank_detail_em` | `references/stock/topic-18.md` |
| 股票热度 / 历史趋势及粉丝特征 / 港股 | `stock_hk_hot_rank_detail_em` | `references/stock/topic-18.md` |
| 股票热度 / 热搜股票 | `stock_hot_search_baidu` | `references/stock/topic-18.md` |
| 股票热度 / 热门关键词 | `stock_hot_keyword_em` | `references/stock/topic-18.md` |
| 股票热度 / 相关股票 | `stock_hot_rank_relate_em` | `references/stock/topic-18.md` |
| 股票热度 / 股票热度-东财 / 人气榜-A股 | `stock_hot_rank_em` | `references/stock/topic-18.md` |
| 股票热度 / 股票热度-东财 / 人气榜-港股 | `stock_hk_hot_rank_em` | `references/stock/topic-18.md` |
| 股票热度 / 股票热度-东财 / 飙升榜-A股 | `stock_hot_up_em` | `references/stock/topic-18.md` |
| 股票热度 / 股票热度-雪球 / 交易排行榜 | `stock_hot_deal_xq` | `references/stock/topic-18.md` |
| 股票热度 / 股票热度-雪球 / 关注排行榜 | `stock_hot_follow_xq` | `references/stock/topic-18.md` |
| 股票热度 / 股票热度-雪球 / 讨论排行榜 | `stock_hot_tweet_xq` | `references/stock/topic-18.md` |
| 股票账户统计 / 股票账户统计月度 | `stock_account_statistics_em` | `references/stock/topic-23-1.md` |
| 股票质押 / 上市公司质押比例 | `stock_gpzy_industry_data_em` | `references/stock/topic-19.md` |
| 股票质押 / 上市公司质押比例 | `stock_gpzy_pledge_ratio_em` | `references/stock/topic-19.md` |
| 股票质押 / 个股重要股东股权质押明细 | `stock_gpzy_individual_pledge_ratio_detail_em` | `references/stock/topic-19.md` |
| 股票质押 / 股权质押市场概况 | `stock_gpzy_profile_em` | `references/stock/topic-19.md` |
| 股票质押 / 质押机构分布统计-证券公司 | `stock_gpzy_distribute_statistics_company_em` | `references/stock/topic-19.md` |
| 股票质押 / 质押机构分布统计-银行 | `stock_gpzy_distribute_statistics_bank_em` | `references/stock/topic-19.md` |
| 股票质押 / 重要股东股权质押明细 | `stock_gpzy_pledge_ratio_detail_em` | `references/stock/topic-19.md` |
| 融资融券 / 上海证券交易所 / 融资融券明细 | `stock_margin_detail_sse` | `references/stock/topic-20.md` |
| 融资融券 / 上海证券交易所 / 融资融券汇总 | `stock_margin_sse` | `references/stock/topic-20.md` |
| 融资融券 / 两融账户信息 | `stock_margin_account_info` | `references/stock/topic-20.md` |
| 融资融券 / 北京证券交易所 / 标的证券信息 | `stock_margin_underlying_info_bse` | `references/stock/topic-20.md` |
| 融资融券 / 北京证券交易所 / 融资融券明细 | `stock_margin_detail_bse` | `references/stock/topic-20.md` |
| 融资融券 / 北京证券交易所 / 融资融券汇总 | `stock_margin_bse` | `references/stock/topic-20.md` |
| 融资融券 / 标的证券名单及保证金比例查询 | `stock_margin_ratio_pa` | `references/stock/topic-20.md` |
| 融资融券 / 深圳证券交易所 / 标的证券信息 | `stock_margin_underlying_info_szse` | `references/stock/topic-20.md` |
| 融资融券 / 深圳证券交易所 / 融资融券明细 | `stock_margin_detail_szse` | `references/stock/topic-20.md` |
| 融资融券 / 深圳证券交易所 / 融资融券汇总 | `stock_margin_szse` | `references/stock/topic-20.md` |
| 行业板块 / 东方财富-成份股 | `stock_board_industry_cons_em` | `references/stock/topic-21.md` |
| 行业板块 / 东方财富-指数-分时 | `stock_board_industry_hist_min_em` | `references/stock/topic-21.md` |
| 行业板块 / 东方财富-指数-日频 | `stock_board_industry_hist_em` | `references/stock/topic-21.md` |
| 行业板块 / 东方财富-行业板块 | `stock_board_industry_name_em` | `references/stock/topic-21.md` |
| 行业板块 / 东方财富-行业板块-实时行情 | `stock_board_industry_spot_em` | `references/stock/topic-21.md` |
| 行业板块 / 同花顺-同花顺行业一览表 | `stock_board_industry_summary_ths` | `references/stock/topic-21.md` |
| 行业板块 / 同花顺-指数 | `stock_board_industry_index_ths` | `references/stock/topic-21.md` |
| 财报发行 | `news_report_time_baidu` | `references/stock/topic-23-2.md` |
| 财经内容精选 | `stock_news_main_cx` | `references/stock/topic-23-2.md` |
| 资金流向 / 东方财富 / 个股资金流 | `stock_individual_fund_flow` | `references/stock/topic-22.md` |
| 资金流向 / 东方财富 / 个股资金流排名 | `stock_individual_fund_flow_rank` | `references/stock/topic-22.md` |
| 资金流向 / 东方财富 / 主力净流入排名 | `stock_main_fund_flow` | `references/stock/topic-22.md` |
| 资金流向 / 东方财富 / 大盘资金流 | `stock_market_fund_flow` | `references/stock/topic-22.md` |
| 资金流向 / 东方财富 / 板块资金流排名 | `stock_sector_fund_flow_rank` | `references/stock/topic-22.md` |
| 资金流向 / 东方财富 / 概念历史资金流 | `stock_concept_fund_flow_hist` | `references/stock/topic-22.md` |
| 资金流向 / 东方财富 / 行业个股资金流 | `stock_sector_fund_flow_summary` | `references/stock/topic-22.md` |
| 资金流向 / 东方财富 / 行业历史资金流 | `stock_sector_fund_flow_hist` | `references/stock/topic-22.md` |
| 资金流向 / 同花顺 / 个股资金流 | `stock_fund_flow_individual` | `references/stock/topic-22.md` |
| 资金流向 / 同花顺 / 大单追踪 | `stock_fund_flow_big_deal` | `references/stock/topic-22.md` |
| 资金流向 / 同花顺 / 概念资金流 | `stock_fund_flow_concept` | `references/stock/topic-22.md` |
| 资金流向 / 同花顺 / 行业资金流 | `stock_fund_flow_industry` | `references/stock/topic-22.md` |
| 赚钱效应分析 | `stock_market_activity_legu` | `references/stock/topic-23-2.md` |
| 风险警示板 | `stock_zh_a_st_em` | `references/stock/topic-23-2.md` |
| 高管持股 / 股东增减持 | `stock_ggcg_em` | `references/stock/topic-23-2.md` |

## 子主题概览
- **A+H股**（4 个接口）：`references/stock/topic-01.md`
- **A股**（30 个接口）：`references/stock/topic-02-1.md`
- **A股**（1 个接口）：`references/stock/topic-02-2.md`
- **B股**（4 个接口）：`references/stock/topic-03.md`
- **ESG 评级**（5 个接口）：`references/stock/topic-04.md`
- **分红配送**（4 个接口）：`references/stock/topic-05.md`
- **千股千评详情**（4 个接口）：`references/stock/topic-06.md`
- **商誉专题**（5 个接口）：`references/stock/topic-07.md`
- **基本面数据**（30 个接口）：`references/stock/topic-08-1.md`
- **基本面数据**（30 个接口）：`references/stock/topic-08-2.md`
- **基本面数据**（30 个接口）：`references/stock/topic-08-3.md`
- **基本面数据**（30 个接口）：`references/stock/topic-08-4.md`
- **基本面数据**（23 个接口）：`references/stock/topic-08-5.md`
- **大宗交易**（6 个接口）：`references/stock/topic-09.md`
- **年报季报**（17 个接口）：`references/stock/topic-10.md`
- **技术指标**（7 个接口）：`references/stock/topic-11.md`
- **新股数据**（4 个接口）：`references/stock/topic-12.md`
- **概念板块**（8 个接口）：`references/stock/topic-13.md`
- **沪深港通持股**（14 个接口）：`references/stock/topic-14.md`
- **涨停板行情**（6 个接口）：`references/stock/topic-15.md`
- **港股**（15 个接口）：`references/stock/topic-16.md`
- **美股**（8 个接口）：`references/stock/topic-17.md`
- **股票热度**（19 个接口）：`references/stock/topic-18.md`
- **股票质押**（7 个接口）：`references/stock/topic-19.md`
- **融资融券**（10 个接口）：`references/stock/topic-20.md`
- **行业板块**（7 个接口）：`references/stock/topic-21.md`
- **资金流向**（12 个接口）：`references/stock/topic-22.md`
- **其他细分主题**（30 个接口）：`references/stock/topic-23-1.md`
- **其他细分主题**（5 个接口）：`references/stock/topic-23-2.md`
