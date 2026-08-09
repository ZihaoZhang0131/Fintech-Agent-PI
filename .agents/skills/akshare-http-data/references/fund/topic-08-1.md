# 其他细分主题



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### reits_realtime_em
- **文档定位**：REITs / REITs-实时行情
- **HTTP**：`GET /api/public/reits_realtime_em`
- **调用**：运行 `scripts/aktools_get.py reits_realtime_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://quote.eastmoney.com/center/gridlist.html#fund_reits_all

描述: 东方财富网-行情中心-REITs-沪深 REITs-实时行情

限量: 单次返回所有 REITs 的实时行情数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 序号  | int64   | -       |
| 代码  | object  | -       |
| 名称  | object  | -       |
| 最新价 | float64 | -       |
| 涨跌额 | float64 | -       |
| 涨跌幅 | float64 | 注意单位: % |
| 成交量 | int64   | -       |
| 成交额 | float64 | -       |
| 开盘价 | float64 | -       |
| 最高价 | float64 | -       |
| 最低价 | float64 | -       |
| 昨收  | float64 | -       |

### reits_hist_em
- **文档定位**：REITs / REITs-历史行情
- **HTTP**：`GET /api/public/reits_hist_em`
- **调用**：运行 `scripts/aktools_get.py reits_hist_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/sh508097.html

描述: 东方财富网-行情中心-REITs-沪深 REITs-历史行情

限量: 单次返回指定 symbol 的历史行情数据

输入参数

| 名称     | 类型  | 描述                        |
|--------|-----|---------------------------|
| symbol | str | symbol="508097"; REITs 代码 |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 日期  | object  | -       |
| 今开  | float64 | -       |
| 最高  | float64 | -       |
| 最低  | float64 | -       |
| 最新价 | float64 | -       |
| 成交量 | int64   | -       |
| 成交额 | float64 | -       |
| 振幅  | float64 | 注意单位: % |
| 换手  | float64 | 注意单位: % |

### fund_portfolio_bond_hold_em
- **文档定位**：债券持仓
- **HTTP**：`GET /api/public/fund_portfolio_bond_hold_em`
- **调用**：运行 `scripts/aktools_get.py fund_portfolio_bond_hold_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://fundf10.eastmoney.com/ccmx1_000001.html

描述: 天天基金网-基金档案-投资组合-债券持仓

限量: 单次返回指定 symbol 和 date 的所有持仓数据

输入参数

| 名称     | 类型  | 描述                                                       |
|--------|-----|----------------------------------------------------------|
| symbol | str | symbol="000001"; 基金代码, 可以通过调用 **ak.fund_name_em()** 接口获取 |
| date   | str | date="2023"; 指定年份                                        |

输出参数

| 名称    | 类型      | 描述       |
|-------|---------|----------|
| 序号    | int64   | -        |
| 债券代码  | object  | -        |
| 债券名称  | object  | -        |
| 占净值比例 | float64 | 注意单位: %  |
| 持仓市值  | float64 | 注意单位: 万元 |
| 季度    | object  | -        |

### fund_value_estimation_em
- **文档定位**：净值估算
- **HTTP**：`GET /api/public/fund_value_estimation_em`
- **调用**：运行 `scripts/aktools_get.py fund_value_estimation_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://fund.eastmoney.com/lof_fundguzhi1.html

描述: 东方财富网-数据中心-净值估算

限量: 单次返回当前交易日指定 symbol 的所有数据

说明: 东方财富旧统一估值接口当前大多返回“暂无数据”; AKShare 现对 `全部` 和 `指数型` 改为解析东财仍公开可见的静态估值页, 其余类别若上游未提供数据则返回空的 `pandas.DataFrame`

输入参数

| 名称     | 类型  | 描述                                                                                                    |
|--------|-----|-------------------------------------------------------------------------------------------------------|
| symbol | str | symbol='全部'; choice of {'全部', '股票型', '混合型', '债券型', '指数型', 'QDII', 'ETF联接', 'LOF', '场内交易基金'} |

输出参数

| 名称             | 类型    | 描述  |
|----------------|-------|-----|
| 序号             | str   | -   |
| 基金代码           | str   | -   |
| 基金名称           | str   | -   |
| 交易日-估算数据-估算值   | float | -   |
| 交易日-估算数据-估算增长率 | str   | -   |
| 交易日-公布数据-单位净值  | float | -   |
| 交易日-公布数据-日增长率  | str   | -   |
| 估算偏差           | str   | -   |
| 交易日-单位净值       | str   | -   |

### fund_individual_achievement_xq
- **文档定位**：基金业绩-雪球
- **HTTP**：`GET /api/public/fund_individual_achievement_xq`
- **调用**：运行 `scripts/aktools_get.py fund_individual_achievement_xq --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://danjuanfunds.com/rn/funding/:code/RankInfo?symbol=000001&fd_type=2&btn_pos=1

描述: 雪球基金-基金详情-基金业绩-详情

限量: 单次返回单只基金业绩详情

输入参数

| 名称      | 类型    | 描述                      |
|---------|-------|-------------------------|
| symbol  | str   | symbol="000001"; 基金代码   |
| timeout | float | timeout=None; 默认不设置超时参数 |

输出参数

| 名称       | 类型      | 描述      |
|----------|---------|---------|
| 业绩类型     | object  | -       |
| 周期       | object  | -       |
| 本产品区间收益  | float64 | 注意单位: % |
| 本产品最大回撒  | float64 | 注意单位: % |
| 周期收益同类排名 | object  | -       |

### fund_individual_detail_info_xq
- **文档定位**：基金交易规则
- **HTTP**：`GET /api/public/fund_individual_detail_info_xq`
- **调用**：运行 `scripts/aktools_get.py fund_individual_detail_info_xq --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://danjuanfunds.com/djapi/fund/detail/675091

描述: 雪球基金-基金详情-基金交易规则

限量: 单次返回单只基金基金交易规则

输入参数

| 名称      | 类型    | 描述                      |
|---------|-------|-------------------------|
| symbol  | str   | symbol="000001"; 基金代码   |
| timeout | float | timeout=None; 默认不设置超时参数 |

输出参数

| 名称    | 类型      | 描述 |
|-------|---------|----|
| 费用类型  | object  | -  |
| 条件或名称 | object  | -  |
| 费用    | float64 | -  |

### fund_fee_em
- **文档定位**：基金交易费率
- **HTTP**：`GET /api/public/fund_fee_em`
- **调用**：运行 `scripts/aktools_get.py fund_fee_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://fundf10.eastmoney.com/jjfl_015641.html

描述: 天天基金-基金档案-购买信息

限量: 单次返回指定 symbol 的 indicator 数据

输入参数

| 名称        | 类型  | 描述                                                                                                          |
|-----------|-----|-------------------------------------------------------------------------------------------------------------|
| symbol    | str | symbol="015641"; 基金代码                                                                                       |
| indicator | str | indicator="申购费率"; choice of {"交易状态", "申购与赎回金额", "交易确认日", "运作费用", "认购费率（前端）", "认购费率（后端）","申购费率（前端）", "赎回费率"} |

输出参数

| 名称    | 类型      | 描述 |
|-------|---------|----|
| 费用类型  | object  | -  |
| 条件或名称 | object  | -  |
| 费用    | float64 | -  |

### fund_stock_position_lg
- **文档定位**：基金仓位 / 股票型基金仓位
- **HTTP**：`GET /api/public/fund_stock_position_lg`
- **调用**：运行 `scripts/aktools_get.py fund_stock_position_lg --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://legulegu.com/stockdata/fund-position/pos-stock

描述: 乐咕乐股-基金仓位-股票型基金仓位

限量: 返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称       | 类型      | 描述               |
|----------|---------|------------------|
| date     | object  | -                |
| close    | float64 | 注意单位: 沪深 300 收盘价 |
| position | float64 | 注意单位: 持仓比例       |

### fund_balance_position_lg
- **文档定位**：基金仓位 / 平衡混合型基金仓位
- **HTTP**：`GET /api/public/fund_balance_position_lg`
- **调用**：运行 `scripts/aktools_get.py fund_balance_position_lg --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://legulegu.com/stockdata/fund-position/pos-pingheng

描述: 乐咕乐股-基金仓位-平衡混合型基金仓位

限量: 返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称       | 类型      | 描述               |
|----------|---------|------------------|
| date     | object  | -                |
| close    | float64 | 注意单位: 沪深 300 收盘价 |
| position | float64 | 注意单位: 持仓比例       |

### fund_linghuo_position_lg
- **文档定位**：基金仓位 / 灵活配置型基金仓位
- **HTTP**：`GET /api/public/fund_linghuo_position_lg`
- **调用**：运行 `scripts/aktools_get.py fund_linghuo_position_lg --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://legulegu.com/stockdata/fund-position/pos-linghuo

描述: 乐咕乐股-基金仓位-灵活配置型基金仓位

限量: 返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称       | 类型      | 描述               |
|----------|---------|------------------|
| date     | object  | -                |
| close    | float64 | 注意单位: 沪深 300 收盘价 |
| position | float64 | 注意单位: 持仓比例       |

### fund_aum_em
- **文档定位**：基金公司规模 / 基金规模详情
- **HTTP**：`GET /api/public/fund_aum_em`
- **调用**：运行 `scripts/aktools_get.py fund_aum_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://fund.eastmoney.com/Company/lsgm.html

描述: 天天基金网-基金数据-基金规模

限量: 单次返回所有基金规模数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述       |
|--------|---------|----------|
| 序号     | int64   | -        |
| 基金公司   | object  | -        |
| 成立时间   | object  | -        |
| 全部管理规模 | float64 | 注意单位: 亿元 |
| 全部基金数  | int64   | -        |
| 全部经理数  | int64   | -        |
| 更新日期   | object  | -        |

### fund_aum_trend_em
- **文档定位**：基金公司规模 / 基金规模走势
- **HTTP**：`GET /api/public/fund_aum_trend_em`
- **调用**：运行 `scripts/aktools_get.py fund_aum_trend_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://fund.eastmoney.com/Company/default.html

描述: 天天基金网-基金数据-市场全部基金规模走势

限量: 单次返回所有市场全部基金规模走势数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述  |
|-------|---------|-----|
| date  | object  | -   |
| value | float64 | -   |

### fund_aum_hist_em
- **文档定位**：基金公司规模 / 基金公司历年管理规模
- **HTTP**：`GET /api/public/fund_aum_hist_em`
- **调用**：运行 `scripts/aktools_get.py fund_aum_hist_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://fund.eastmoney.com/Company/lsgm.html

描述: 天天基金网-基金数据-基金公司历年管理规模排行列表

限量: 单次返回所有基金公司历年管理规模排行列表数据

输入参数

| 名称   | 类型  | 描述                      |
|------|-----|-------------------------|
| year | str | year="2023"; 从 2001 年开始 |

输出参数

| 名称   | 类型      | 描述  |
|------|---------|-----|
| 序号   | int64   | -   |
| 基金公司 | object  | -   |
| 总规模  | float64 | -   |
| 股票型  | float64 | -   |
| 混合型  | float64 | -   |
| 债券型  | float64 | -   |
| 指数型  | float64 | -   |
| QDII | float64 | -   |
| 货币型  | float64 | -   |

### fund_announcement_dividend_em
- **文档定位**：基金公告 / 分红配送
- **HTTP**：`GET /api/public/fund_announcement_dividend_em`
- **调用**：运行 `scripts/aktools_get.py fund_announcement_dividend_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://fundf10.eastmoney.com/jjgg_000001_2.html

描述: 东方财富网站-天天基金网-基金档案-基金公告-分红配送

限量: 返回所有历史数据

输入参数

| 名称     | 类型  | 描述                                 |
|--------|-----|------------------------------------|
| symbol | str | 基金代码，可以通过调用 ak.fund_name_em() 接口获取 |

输出参数

| 名称   | 类型     | 描述                     |
|------|--------|------------------------|
| 基金代码 | object | 基金代码                   |
| 公告标题 | object | -                      |
| 基金名称 | object | 基金名称                   |
| 公告日期 | object | 公告的发布日期                |
| 报告ID | object | 获取报告详情的依据; 拼接后可以获取公告地址 |

### fund_announcement_report_em
- **文档定位**：基金公告 / 定期报告
- **HTTP**：`GET /api/public/fund_announcement_report_em`
- **调用**：运行 `scripts/aktools_get.py fund_announcement_report_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://fundf10.eastmoney.com/jjgg_000001_3.html

描述: 东方财富网站-天天基金网-基金档案-基金公告-定期报告

限量: 返回所有历史数据

输入参数

| 名称     | 类型  | 描述                                 |
|--------|-----|------------------------------------|
| symbol | str | 基金代码，可以通过调用 ak.fund_name_em() 接口获取 |

输出参数

| 名称   | 类型     | 描述                     |
|------|--------|------------------------|
| 基金代码 | object | 基金代码                   |
| 公告标题 | object | -                      |
| 基金名称 | object | 基金名称                   |
| 公告日期 | object | 公告的发布日期                |
| 报告ID | object | 获取报告详情的依据; 拼接后可以获取公告地址 |

### fund_announcement_personnel_em
- **文档定位**：基金公告 / 人事公告
- **HTTP**：`GET /api/public/fund_announcement_personnel_em`
- **调用**：运行 `scripts/aktools_get.py fund_announcement_personnel_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://fundf10.eastmoney.com/jjgg_000001_4.html

描述: 东方财富网站-天天基金网-基金档案-基金公告-人事调整

限量: 返回所有历史数据

输入参数

| 名称     | 类型  | 描述                                 |
|--------|-----|------------------------------------|
| symbol | str | 基金代码，可以通过调用 ak.fund_name_em() 接口获取 |

输出参数

| 名称   | 类型     | 描述                     |
|------|--------|------------------------|
| 基金代码 | object | 基金代码                   |
| 公告标题 | object | -                      |
| 基金名称 | object | 基金名称                   |
| 公告日期 | object | 公告的发布日期                |
| 报告ID | object | 获取报告详情的依据; 拼接后可以获取公告地址 |

### fund_name_em
- **文档定位**：基金基本信息
- **HTTP**：`GET /api/public/fund_name_em`
- **调用**：运行 `scripts/aktools_get.py fund_name_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://fund.eastmoney.com/fund.html

描述: 东方财富网-天天基金网-基金数据-所有基金的基本信息数据

限量: 单次返回当前时刻所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型     | 描述  |
|------|--------|-----|
| 基金代码 | object | -   |
| 拼音缩写 | object | -   |
| 基金简称 | object | -   |
| 基金类型 | object | -   |
| 拼音全称 | object | -   |

### fund_info_ths
- **文档定位**：基金基本信息-同花顺
- **HTTP**：`GET /api/public/fund_info_ths`
- **调用**：运行 `scripts/aktools_get.py fund_info_ths --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://fund.10jqka.com.cn/161130/interduce.html

描述: 同花顺-基金数据-基金基本信息

限量: 单次返回指定基金的基本信息

输入参数

| 名称     | 类型  | 描述                    |
|--------|-----|-----------------------|
| symbol | str | symbol="161130"; 基金代码 |

输出参数

| 名称     | 类型     | 描述  |
|--------|--------|-----|
| 字段     | object | -   |
| 值      | object | -   |

### fund_info_index_em
- **文档定位**：基金基本信息-指数型
- **HTTP**：`GET /api/public/fund_info_index_em`
- **调用**：运行 `scripts/aktools_get.py fund_info_index_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://fund.eastmoney.com/trade/zs.html

描述: 东方财富网-天天基金网-基金数据-基金基本信息-指数型

限量: 单次返回当前时刻所有历史数据

输入参数

| 名称        | 类型  | 描述                                                                                    |
|-----------|-----|---------------------------------------------------------------------------------------|
| symbol    | str | symbol="全部"; choice of {"全部", "沪深指数", "行业主题", "大盘指数", "中盘指数", "小盘指数", "股票指数", "债券指数"} |
| indicator | str | indicator="全部"; choice of {"全部", "被动指数型", "增强指数型"}                                    |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 基金代码 | object  | -       |
| 基金名称 | object  | -       |
| 单位净值 | float64 | -       |
| 日期   | object  | -       |
| 日增长率 | float64 | 注意单位: % |
| 近1周  | float64 | 注意单位: % |
| 近1月  | float64 | 注意单位: % |
| 近3月  | float64 | 注意单位: % |
| 近6月  | float64 | 注意单位: % |
| 近1年  | float64 | 注意单位: % |
| 近2年  | float64 | 注意单位: % |
| 近3年  | float64 | 注意单位: % |
| 今年来  | float64 | 注意单位: % |
| 成立来  | float64 | 注意单位: % |
| 手续费  | float64 | 注意单位: % |
| 起购金额 | object  | -       |
| 跟踪标的 | object  | -       |
| 跟踪方式 | object  | -       |

### fund_individual_basic_info_xq
- **文档定位**：基金基本信息-雪球
- **HTTP**：`GET /api/public/fund_individual_basic_info_xq`
- **调用**：运行 `scripts/aktools_get.py fund_individual_basic_info_xq --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://danjuanfunds.com/funding/000001

描述: 雪球基金-基金详情

限量: 单次返回单只基金基本信息

输入参数

| 名称      | 类型    | 描述                      |
|---------|-------|-------------------------|
| symbol  | str   | symbol="000001"; 基金代码   |
| timeout | float | timeout=None; 默认不设置超时参数 |

输出参数

| 名称    | 类型     | 描述 |
|-------|--------|----|
| item  | object | -  |
| value | object | -  |

### fund_overview_em
- **文档定位**：基金基本概况
- **HTTP**：`GET /api/public/fund_overview_em`
- **调用**：运行 `scripts/aktools_get.py fund_overview_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://fundf10.eastmoney.com/jbgk_015641.html

描述: 天天基金-基金档案-基本概况

限量: 单次返回指定 symbol 的数据

输入参数

| 名称     | 类型  | 描述                    |
|--------|-----|-----------------------|
| symbol | str | symbol="015641"; 基金代码 |

输出参数

| 名称      | 类型     | 描述 |
|---------|--------|----|
| 基金全称    | object | -  |
| 基金简称    | object | -  |
| 基金代码    | object | -  |
| 基金类型    | object | -  |
| 发行日期    | object | -  |
| 成立日期/规模 | object | -  |
| 资产规模    | object | -  |
| 份额规模    | object | -  |
| 基金管理人   | object | -  |
| 基金托管人   | object | -  |
| 基金经理人   | object | -  |
| 成立来分红   | object | -  |
| 管理费率    | object | -  |
| 托管费率    | object | -  |
| 销售服务费率  | object | -  |
| 最高认购费率  | object | -  |
| 业绩比较基准  | object | -  |
| 跟踪标的    | object | -  |

### fund_report_stock_cninfo
- **文档定位**：基金报告 / 基金重仓股
- **HTTP**：`GET /api/public/fund_report_stock_cninfo`
- **调用**：运行 `scripts/aktools_get.py fund_report_stock_cninfo --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://webapi.cninfo.com.cn/#/thematicStatistics

描述: 巨潮资讯-数据中心-专题统计-基金报表-基金重仓股

限量: 返回指定 date 的所有数据; date 从 2017 年开始

输入参数

| 名称   | 类型  | 描述                                                                                       |
|------|-----|------------------------------------------------------------------------------------------|
| date | str | date="20210630"; choice of {"XXXX0331", "XXXX0630", "XXXX0930", "XXXX1231"}, 其中 XXXX 为年份 |

输出参数

| 名称     | 类型     | 描述  |
|--------|--------|-----|
| 序号     | int64  | -   |
| 股票代码   | object | -   |
| 股票简称   | object | -   |
| 报告期    | object | -   |
| 基金覆盖家数 | int64  | -   |
| 持股总数   | object | -   |
| 持股总市值  | object | -   |

### fund_report_industry_allocation_cninfo
- **文档定位**：基金报告 / 基金行业配置
- **HTTP**：`GET /api/public/fund_report_industry_allocation_cninfo`
- **调用**：运行 `scripts/aktools_get.py fund_report_industry_allocation_cninfo --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://webapi.cninfo.com.cn/#/thematicStatistics

描述: 巨潮资讯-数据中心-专题统计-基金报表-基金行业配置

限量: 返回指定 date 的所有数据; date 从 2017 年开始

输入参数

| 名称   | 类型  | 描述                                                                                       |
|------|-----|------------------------------------------------------------------------------------------|
| date | str | date="20210630"; choice of {"XXXX0331", "XXXX0630", "XXXX0930", "XXXX1231"}, 其中 XXXX 为年份 |

输出参数

| 名称      | 类型      | 描述       |
|---------|---------|----------|
| 行业编码    | object  | -        |
| 证监会行业名称 | object  | -        |
| 报告期     | object  | -        |
| 基金覆盖家数  | int64   | 注意单位: 只  |
| 行业规模    | float64 | 注意单位: 亿元 |
| 占净资产比例  | float64 | 注意单位: %  |

### fund_report_asset_allocation_cninfo
- **文档定位**：基金报告 / 基金资产配置
- **HTTP**：`GET /api/public/fund_report_asset_allocation_cninfo`
- **调用**：运行 `scripts/aktools_get.py fund_report_asset_allocation_cninfo --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://webapi.cninfo.com.cn/#/thematicStatistics

描述: 巨潮资讯-数据中心-专题统计-基金报表-基金资产配置

限量: 返回所有基金资产配置数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称            | 类型     | 描述       |
|---------------|--------|----------|
| 报告期           | object | -        |
| 基金覆盖家数        | object | 注意单位: 只  |
| 股票权益类占净资产比例   | object | 注意单位: %  |
| 债券固定收益类占净资产比例 | object | 注意单位: %  |
| 现金货币类占净资产比例   | object | 注意单位: %  |
| 基金市场净资产规模     | object | 注意单位: 亿元 |

### fund_portfolio_hold_em
- **文档定位**：基金持仓
- **HTTP**：`GET /api/public/fund_portfolio_hold_em`
- **调用**：运行 `scripts/aktools_get.py fund_portfolio_hold_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://fundf10.eastmoney.com/ccmx_000001.html

描述: 天天基金网-基金档案-投资组合-基金持仓

限量: 单次返回指定 symbol 和 date 的所有持仓数据

输入参数

| 名称     | 类型  | 描述                                                       |
|--------|-----|----------------------------------------------------------|
| symbol | str | symbol="000001"; 基金代码, 可以通过调用 **ak.fund_name_em()** 接口获取 |
| date   | str | date="2024"; 指定年份, 传入空字符串 `""` 时返回最新可用年份数据          |

输出参数

| 名称    | 类型      | 描述       |
|-------|---------|----------|
| 序号    | int64   | -        |
| 股票代码  | object  | -        |
| 股票名称  | object  | -        |
| 占净值比例 | float64 | 注意单位: %  |
| 持股数   | float64 | 注意单位: 万股 |
| 持仓市值  | float64 | 注意单位: 万元 |
| 季度    | object  | -        |

### fund_individual_detail_hold_xq
- **文档定位**：基金持仓资产比例
- **HTTP**：`GET /api/public/fund_individual_detail_hold_xq`
- **调用**：运行 `scripts/aktools_get.py fund_individual_detail_hold_xq --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://danjuanfunds.com/rn/fund-detail/archive?id=103&code=000001

描述: 雪球基金-基金详情-基金持仓-详情

限量: 单次返回单只基金指定日期的持仓大类资产比例

输入参数

| 名称      | 类型    | 描述                      |
|---------|-------|-------------------------|
| symbol  | str   | symbol="000001"; 基金代码   |
| date    | str   | date="20231231"; 季度日期   |
| timeout | float | timeout=None; 默认不设置超时参数 |

输出参数

| 名称   | 类型      | 描述     |
|------|---------|--------|
| 资产类型 | object  | -      |
| 仓位占比 | float64 | 注意单位：% |

### fund_individual_analysis_xq
- **文档定位**：基金数据分析
- **HTTP**：`GET /api/public/fund_individual_analysis_xq`
- **调用**：运行 `scripts/aktools_get.py fund_individual_analysis_xq --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://danjuanfunds.com/funding/000001

描述: 雪球基金-基金详情-数据分析

限量: 返回单只基金历史表现分析数据

输入参数

| 名称      | 类型    | 描述                      |
|---------|-------|-------------------------|
| symbol  | str   | symbol="000001"; 基金代码   |
| timeout | float | timeout=None; 默认不设置超时参数 |

输出参数

| 名称       | 类型      | 描述     |
|----------|---------|--------|
| 周期       | object  | -      |
| 较同类风险收益比 | int64   | 注意单位：% |
| 较同类抗风险波动 | int64   | 注意单位：% |
| 年化波动率    | float64 | 注意单位：% |
| 年化夏普比率   | float64 | -      |
| 最大回撤     | float64 | 注意单位：% |

### fund_purchase_em
- **文档定位**：基金申购状态
- **HTTP**：`GET /api/public/fund_purchase_em`
- **调用**：运行 `scripts/aktools_get.py fund_purchase_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://fund.eastmoney.com/Fund_sgzt_bzdm.html#fcode,asc_1

描述: 东方财富网站-天天基金网-基金数据-基金申购状态

限量: 单次返回当前时刻所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称             | 类型      | 描述      |
|----------------|---------|---------|
| 序号             | object  | -       |
| 基金代码           | object  | -       |
| 基金简称           | object  | -       |
| 基金类型           | object  | -       |
| 最新净值/万份收益      | float64 | -       |
| 最新净值/万份收益-报告时间 | object  | -       |
| 申购状态           | object  | -       |
| 赎回状态           | object  | -       |
| 下一开放日          | object  | -       |
| 购买起点           | float64 | -       |
| 日累计限定金额        | float64 | -       |
| 手续费            | float64 | 注意单位: % |

### fund_individual_profit_probability_xq
- **文档定位**：基金盈利概率
- **HTTP**：`GET /api/public/fund_individual_profit_probability_xq`
- **调用**：运行 `scripts/aktools_get.py fund_individual_profit_probability_xq --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://danjuanfunds.com/funding/000001

描述: 雪球基金-基金详情-盈利概率；历史任意时点买入，持有满X时间，盈利概率，以及平均收益

限量: 单次返回单只基金历史任意时点买入，持有满 X 时间，盈利概率，以及平均收益

输入参数

| 名称      | 类型    | 描述                      |
|---------|-------|-------------------------|
| symbol  | str   | symbol="000001"; 基金代码   |
| timeout | float | timeout=None; 默认不设置超时参数 |

输出参数

| 名称   | 类型     | 描述     |
|------|--------|--------|
| 持有时长 | object | -      |
| 盈利概率 | object | 注意单位：% |
| 平均收益 | object | 注意单位：% |

### fund_manager_em
- **文档定位**：基金经理
- **HTTP**：`GET /api/public/fund_manager_em`
- **调用**：运行 `scripts/aktools_get.py fund_manager_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://fund.eastmoney.com/manager/default.html

描述: 天天基金网-基金数据-基金经理大全

限量: 单次返回所有基金经理数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称        | 类型      | 描述       |
|-----------|---------|----------|
| 序号        | int64   | -        |
| 姓名        | object  | -        |
| 所属公司      | object  | -        |
| 现任基金代码    | object  | -        |
| 现任基金      | object  | -        |
| 累计从业时间    | int64   | 注意单位: 天  |
| 现任基金资产总规模 | float64 | 注意单位: 亿元 |
| 现任基金最佳回报  | float64 | 注意单位: %  |
