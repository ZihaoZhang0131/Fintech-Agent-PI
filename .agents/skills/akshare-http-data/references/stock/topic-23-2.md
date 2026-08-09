# 其他细分主题



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### news_report_time_baidu
- **文档定位**：财报发行
- **HTTP**：`GET /api/public/news_report_time_baidu`
- **调用**：运行 `scripts/aktools_get.py news_report_time_baidu --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://gushitong.baidu.com/calendar

描述: 百度股市通-财报发行

限量: 单次获取指定 date 的财报发行, 提供港股的财报发行数据

输入参数

| 名称   | 类型  | 描述              |
|------|-----|-----------------|
| date | str | date="20241107" |

输出参数

| 名称   | 类型     | 描述  |
|------|--------|-----|
| 股票代码 | object |     |
| 交易所  | object |     |
| 股票简称 | object |     |
| 财报期  | object |     |

### stock_news_main_cx
- **文档定位**：财经内容精选
- **HTTP**：`GET /api/public/stock_news_main_cx`
- **调用**：运行 `scripts/aktools_get.py stock_news_main_cx --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://cxdata.caixin.com/pc/

描述: 财新网-财新数据通-最新

限量: 返回最新 100 条新闻数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称            | 类型     | 描述 |
|---------------|--------|----|
| tag           | object | -  |
| summary       | object | -  |
| url           | object | -  |

### stock_market_activity_legu
- **文档定位**：赚钱效应分析
- **HTTP**：`GET /api/public/stock_market_activity_legu`
- **调用**：运行 `scripts/aktools_get.py stock_market_activity_legu --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.legulegu.com/stockdata/market-activity

描述: 乐咕乐股网-赚钱效应分析数据

限量: 单次返回当前赚钱效应分析数据

说明：

1. 涨跌比：即沪深两市上涨个股所占比例，体现的是市场整体涨跌，占比越大则代表大部分个股表现活跃。
2. 涨停板数与跌停板数的意义：涨停家数在一定程度上反映了市场的投机氛围。当涨停家数越多，则市场的多头氛围越强。真实涨停是非一字无量涨停。真实跌停是非一字无量跌停。

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型     | 描述  |
|-------|--------|-----|
| item  | object | -   |
| value | object | -   |

### stock_zh_a_st_em
- **文档定位**：风险警示板
- **HTTP**：`GET /api/public/stock_zh_a_st_em`
- **调用**：运行 `scripts/aktools_get.py stock_zh_a_st_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/center/gridlist.html#st_board

描述: 东方财富网-行情中心-沪深个股-风险警示板

限量: 单次返回当前交易日风险警示板的所有股票的行情数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| 序号     | int64   | -       |
| 代码     | object  | -       |
| 名称     | object  | -       |
| 最新价    | float64 | -       |
| 涨跌幅    | float64 | 注意单位: % |
| 涨跌额    | float64 | -       |
| 成交量    | float64 | -       |
| 成交额    | float64 | -       |
| 振幅     | float64 | 注意单位: % |
| 最高     | float64 | -       |
| 最低     | float64 | -       |
| 今开     | float64 | -       |
| 昨收     | float64 | -       |
| 量比     | float64 | -       |
| 换手率    | float64 | 注意单位: % |
| 市盈率-动态 | float64 | -       |
| 市净率    | float64 | -       |

### stock_ggcg_em
- **文档定位**：高管持股 / 股东增减持
- **HTTP**：`GET /api/public/stock_ggcg_em`
- **调用**：运行 `scripts/aktools_get.py stock_ggcg_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/executive/gdzjc.html

描述: 东方财富网-数据中心-特色数据-高管持股

限量: 单次获取所有高管持股数据数据

输入参数

| 名称     | 类型  | 描述                                            |
|--------|-----|-----------------------------------------------|
| symbol | str | symbol="全部"; choice of {"全部", "股东增持", "股东减持"} |

输出参数

| 名称             | 类型      | 描述       |
|----------------|---------|----------|
| 代码             | object  | -        |
| 名称             | object  | -        |
| 最新价            | float64 | -        |
| 涨跌幅            | float64 | 注意单位: %  |
| 股东名称           | object  | -        |
| 持股变动信息-增减      | float64 | -        |
| 持股变动信息-变动数量    | float64 | 注意单位: 万股 |
| 持股变动信息-占总股本比例  | float64 | 注意单位: %  |
| 持股变动信息-占流通股比例  | float64 | 注意单位: %  |
| 变动后持股情况-持股总数   | float64 | 注意单位: 万股 |
| 变动后持股情况-占总股本比例 | float64 | 注意单位: %  |
| 变动后持股情况-持流通股数  | float64 | 注意单位: 万股 |
| 变动后持股情况-占流通股比例 | float64 | 注意单位: %  |
| 变动开始日          | object  | -        |
| 变动截止日          | object  | -        |
| 公告日            | object  | -        |
