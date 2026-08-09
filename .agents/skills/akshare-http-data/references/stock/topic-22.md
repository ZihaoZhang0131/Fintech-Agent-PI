# 资金流向



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### stock_fund_flow_individual
- **文档定位**：资金流向 / 同花顺 / 个股资金流
- **HTTP**：`GET /api/public/stock_fund_flow_individual`
- **调用**：运行 `scripts/aktools_get.py stock_fund_flow_individual --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.10jqka.com.cn/funds/ggzjl/#refCountId=data_55f13c2c_254

描述: 同花顺-数据中心-资金流向-个股资金流

限量: 单次获取指定 symbol 的概念资金流数据

输入参数

| 名称     | 类型  | 描述                                                              |
|--------|-----|-----------------------------------------------------------------|
| symbol | str | symbol="即时"; choice of {“即时”, "3日排行", "5日排行", "10日排行", "20日排行"} |

输出参数-即时

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 序号   | int32   | -       |
| 股票代码 | int64   | -       |
| 股票简称 | object  | -       |
| 最新价  | float64 | -       |
| 涨跌幅  | object  | 注意单位: % |
| 换手率  | object  | -       |
| 流入资金 | object  | 注意单位: 元 |
| 流出资金 | object  | 注意单位: 元 |
| 净额   | object  | 注意单位: 元 |
| 成交额  | object  | 注意单位: 元 |

接口示例-即时

```python
import akshare as ak

stock_fund_flow_individual_df = ak.stock_fund_flow_individual(symbol="即时")
print(stock_fund_flow_individual_df)
```

### stock_fund_flow_concept
- **文档定位**：资金流向 / 同花顺 / 概念资金流
- **HTTP**：`GET /api/public/stock_fund_flow_concept`
- **调用**：运行 `scripts/aktools_get.py stock_fund_flow_concept --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.10jqka.com.cn/funds/gnzjl/#refCountId=data_55f13c2c_254

描述: 同花顺-数据中心-资金流向-概念资金流

限量: 单次获取指定 symbol 的概念资金流数据

输入参数

| 名称     | 类型  | 描述                                                              |
|--------|-----|-----------------------------------------------------------------|
| symbol | str | symbol="即时"; choice of {“即时”, "3日排行", "5日排行", "10日排行", "20日排行"} |

输出参数-即时

| 名称      | 类型      | 描述      |
|---------|---------|---------|
| 序号      | int32   | -       |
| 行业      | object  | -       |
| 行业指数    | float64 | -       |
| 行业-涨跌幅  | float64 | 注意单位: % |
| 流入资金    | float64 | 注意单位: 亿 |
| 流出资金    | float64 | 注意单位: 亿 |
| 净额      | float64 | 注意单位: 亿 |
| 公司家数    | float64 | -       |
| 领涨股     | object  | -       |
| 领涨股-涨跌幅 | float64 | 注意单位: % |
| 当前价     | float64 | 注意单位: 元 |

接口示例-即时

```python
import akshare as ak

stock_fund_flow_concept_df = ak.stock_fund_flow_concept(symbol="即时")
print(stock_fund_flow_concept_df)
```

### stock_fund_flow_industry
- **文档定位**：资金流向 / 同花顺 / 行业资金流
- **HTTP**：`GET /api/public/stock_fund_flow_industry`
- **调用**：运行 `scripts/aktools_get.py stock_fund_flow_industry --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.10jqka.com.cn/funds/hyzjl/#refCountId=data_55f13c2c_254

描述: 同花顺-数据中心-资金流向-行业资金流

限量: 单次获取指定 symbol 的行业资金流数据

输入参数

| 名称     | 类型  | 描述                                                              |
|--------|-----|-----------------------------------------------------------------|
| symbol | str | symbol="即时"; choice of {“即时”, "3日排行", "5日排行", "10日排行", "20日排行"} |

输出参数-即时

| 名称      | 类型      | 描述      |
|---------|---------|---------|
| 序号      | int32   | -       |
| 行业      | object  | -       |
| 行业指数    | float64 | -       |
| 行业-涨跌幅  | object  | 注意单位: % |
| 流入资金    | float64 | 注意单位: 亿 |
| 流出资金    | float64 | 注意单位: 亿 |
| 净额      | float64 | 注意单位: 亿 |
| 公司家数    | float64 | -       |
| 领涨股     | object  | -       |
| 领涨股-涨跌幅 | object  | 注意单位: % |
| 当前价     | float64 | -       |

接口示例-即时

```python
import akshare as ak

stock_fund_flow_industry_df = ak.stock_fund_flow_industry(symbol="即时")
print(stock_fund_flow_industry_df)
```

### stock_fund_flow_big_deal
- **文档定位**：资金流向 / 同花顺 / 大单追踪
- **HTTP**：`GET /api/public/stock_fund_flow_big_deal`
- **调用**：运行 `scripts/aktools_get.py stock_fund_flow_big_deal --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.10jqka.com.cn/funds/ddzz

描述: 同花顺-数据中心-资金流向-大单追踪

限量: 单次获取当前时点的所有大单追踪数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数-即时

| 名称   | 类型      | 描述       |
|------|---------|----------|
| 成交时间 | object  | -        |
| 股票代码 | int64   | -        |
| 股票简称 | object  | -        |
| 成交价格 | float64 | -        |
| 成交量  | int64   | 注意单位: 股  |
| 成交额  | float64 | 注意单位: 万元 |
| 大单性质 | object  | -        |
| 涨跌幅  | object  | -        |
| 涨跌额  | object  | -        |

接口示例-即时

```python
import akshare as ak

stock_fund_flow_big_deal_df = ak.stock_fund_flow_big_deal()
print(stock_fund_flow_big_deal_df)
```

### stock_individual_fund_flow
- **文档定位**：资金流向 / 东方财富 / 个股资金流
- **HTTP**：`GET /api/public/stock_individual_fund_flow`
- **调用**：运行 `scripts/aktools_get.py stock_individual_fund_flow --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/zjlx/detail.html

描述: 东方财富网-数据中心-个股资金流向

限量: 单次获取指定市场和股票的近 100 个交易日的资金流数据

输入参数

| 名称     | 类型  | 描述                                                 |
|--------|-----|----------------------------------------------------|
| stock  | str | stock="000425"; 股票代码                               |
| market | str | market="sh"; 上海证券交易所: sh, 深证证券交易所: sz, 北京证券交易所: bj |

输出参数

| 名称         | 类型      | 描述      |
|------------|---------|---------|
| 日期         | object  | -       |
| 收盘价        | float64 | -       |
| 涨跌幅        | float64 | 注意单位: % |
| 主力净流入-净额   | float64 | -       |
| 主力净流入-净占比  | float64 | 注意单位: % |
| 超大单净流入-净额  | float64 | -       |
| 超大单净流入-净占比 | float64 | 注意单位: % |
| 大单净流入-净额   | float64 | -       |
| 大单净流入-净占比  | float64 | 注意单位: % |
| 中单净流入-净额   | float64 | -       |
| 中单净流入-净占比  | float64 | 注意单位: % |
| 小单净流入-净额   | float64 | -       |
| 小单净流入-净占比  | float64 | 注意单位: % |

### stock_individual_fund_flow_rank
- **文档定位**：资金流向 / 东方财富 / 个股资金流排名
- **HTTP**：`GET /api/public/stock_individual_fund_flow_rank`
- **调用**：运行 `scripts/aktools_get.py stock_individual_fund_flow_rank --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/zjlx/detail.html

描述: 东方财富网-数据中心-资金流向-排名

限量: 单次获取指定类型的个股资金流排名数据

输入参数

| 名称        | 类型  | 描述                                               |
|-----------|-----|--------------------------------------------------|
| indicator | str | indicator="今日"; choice {"今日", "3日", "5日", "10日"} |

输出参数-今日

| 名称           | 类型      | 描述      |
|--------------|---------|---------|
| 序号           | int64   | -       |
| 代码           | object  | -       |
| 名称           | object  | -       |
| 最新价          | float64 | -       |
| 今日涨跌幅        | float64 | 注意单位: % |
| 今日主力净流入-净额   | float64 | -       |
| 今日主力净流入-净占比  | float64 | 注意单位: % |
| 今日超大单净流入-净额  | float64 | -       |
| 今日超大单净流入-净占比 | float64 | 注意单位: % |
| 今日大单净流入-净额   | float64 | -       |
| 今日大单净流入-净占比  | float64 | 注意单位: % |
| 今日中单净流入-净额   | float64 | -       |
| 今日中单净流入-净占比  | float64 | 注意单位: % |
| 今日小单净流入-净额   | float64 | -       |
| 今日小单净流入-净占比  | float64 | 注意单位: % |

接口示例-今日

```python
import akshare as ak

stock_individual_fund_flow_rank_df = ak.stock_individual_fund_flow_rank(indicator="今日")
print(stock_individual_fund_flow_rank_df)
```

### stock_market_fund_flow
- **文档定位**：资金流向 / 东方财富 / 大盘资金流
- **HTTP**：`GET /api/public/stock_market_fund_flow`
- **调用**：运行 `scripts/aktools_get.py stock_market_fund_flow --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/zjlx/dpzjlx.html

描述: 东方财富网-数据中心-资金流向-大盘

限量: 单次获取大盘资金流向历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称         | 类型      | 描述      |
|------------|---------|---------|
| 日期         | object  | -       |
| 上证-收盘价     | float64 | -       |
| 上证-涨跌幅     | float64 | 注意单位: % |
| 深证-收盘价     | float64 | -       |
| 深证-涨跌幅     | float64 | 注意单位: % |
| 主力净流入-净额   | float64 | -       |
| 主力净流入-净占比  | float64 | 注意单位: % |
| 超大单净流入-净额  | float64 | -       |
| 超大单净流入-净占比 | float64 | 注意单位: % |
| 大单净流入-净额   | float64 | -       |
| 大单净流入-净占比  | float64 | 注意单位: % |
| 中单净流入-净额   | float64 | -       |
| 中单净流入-净占比  | float64 | 注意单位: % |
| 小单净流入-净额   | float64 | -       |
| 小单净流入-净占比  | float64 | 注意单位: % |

### stock_sector_fund_flow_rank
- **文档定位**：资金流向 / 东方财富 / 板块资金流排名
- **HTTP**：`GET /api/public/stock_sector_fund_flow_rank`
- **调用**：运行 `scripts/aktools_get.py stock_sector_fund_flow_rank --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/bkzj/hy.html

描述: 东方财富网-数据中心-资金流向-板块资金流-排名

限量: 单次获取指定板块的指定期限的资金流排名数据

说明: 若东财对新上线板块返回 `-`，相关数值列将转换为 `NaN`，调用方可按需过滤

输入参数

| 名称          | 类型  | 描述                                                         |
|-------------|-----|------------------------------------------------------------|
| indicator   | str | indicator="今日"; choice of {"今日", "5日", "10日"}              |
| sector_type | str | sector_type="行业资金流"; choice of {"行业资金流", "概念资金流", "地域资金流"} |

输出参数-行业资金流-今日

| 名称         | 类型      | 描述      |
|------------|---------|---------|
| 序号         | int64   | -       |
| 名称         | object  | -       |
| 今日涨跌幅      | float64 | 注意单位: % |
| 主力净流入-净额   | float64 | -       |
| 主力净流入-净占比  | float64 | 注意单位: % |
| 超大单净流入-净额  | float64 | -       |
| 超大单净流入-净占比 | float64 | 注意单位: % |
| 大单净流入-净额   | float64 | -       |
| 大单净流入-净占比  | float64 | 注意单位: % |
| 中单净流入-净额   | float64 | -       |
| 中单净流入-净占比  | float64 | 注意单位: % |
| 小单净流入-净额   | float64 | -       |
| 小单净流入-净占比  | float64 | 注意单位: % |
| 主力净流入最大股   | object  | -       |

接口示例-行业资金流-今日

```python
import akshare as ak

stock_sector_fund_flow_rank_df = ak.stock_sector_fund_flow_rank(indicator="今日", sector_type="行业资金流")
print(stock_sector_fund_flow_rank_df)
```

### stock_main_fund_flow
- **文档定位**：资金流向 / 东方财富 / 主力净流入排名
- **HTTP**：`GET /api/public/stock_main_fund_flow`
- **调用**：运行 `scripts/aktools_get.py stock_main_fund_flow --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/zjlx/list.html

描述: 东方财富网-数据中心-资金流向-主力净流入排名

限量: 单次获取指定 symbol 的主力净流入排名数据

输入参数

| 名称     | 类型  | 描述                                                                                     |
|--------|-----|----------------------------------------------------------------------------------------|
| symbol | str | symbol="全部股票"；choice of {"全部股票", "沪深A股", "沪市A股", "科创板", "深市A股", "创业板", "沪市B股", "深市B股"} |

输出参数

| 名称           | 类型      | 描述      |
|--------------|---------|---------|
| 序号           | int64   | -       |
| 代码           | object  | -       |
| 名称           | object  | -       |
| 最新价          | float64 | -       |
| 今日排行榜-主力净占比  | float64 | 注意单位: % |
| 今日排行榜-今日排名   | float64 | -       |
| 今日排行榜-今日涨跌   | float64 | 注意单位: % |
| 5日排行榜-主力净占比  | float64 | 注意单位: % |
| 5日排行榜-5日排名   | int64   | -       |
| 5日排行榜-5日涨跌   | float64 | 注意单位: % |
| 10日排行榜-主力净占比 | float64 | 注意单位: % |
| 10日排行榜-10日排名 | int64   | -       |
| 10日排行榜-10日涨跌 | float64 | 注意单位: % |
| 所属板块         | object  | -       |

### stock_sector_fund_flow_summary
- **文档定位**：资金流向 / 东方财富 / 行业个股资金流
- **HTTP**：`GET /api/public/stock_sector_fund_flow_summary`
- **调用**：运行 `scripts/aktools_get.py stock_sector_fund_flow_summary --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/bkzj/BK1034.html

描述: 东方财富网-数据中心-资金流向-行业资金流-xx行业个股资金流

限量: 单次获取指定 symbol 的个股资金流

输入参数

| 名称        | 类型  | 描述                                            |
|-----------|-----|-----------------------------------------------|
| symbol    | str | symbol="电源设备"                                 |
| indicator | str | indicator="今日"; choice of {"今日", "5日", "10日"} |

输出参数-今日

| 名称           | 类型      | 描述      |
|--------------|---------|---------|
| 序号           | int64   | -       |
| 代码           | object  | -       |
| 名称           | object  | -       |
| 最新价          | float64 | -       |
| 今日涨跌幅        | float64 | 注意单位: % |
| 今日主力净流入-净额   | float64 | -       |
| 今日主力净流入-净占比  | float64 | 注意单位: % |
| 今日超大单净流入-净额  | float64 | -       |
| 今日超大单净流入-净占比 | float64 | 注意单位: % |
| 今日大单净流入-净额   | float64 | -       |
| 今日大单净流入-净占比  | float64 | 注意单位: % |
| 今日中单净流入-净额   | float64 | -       |
| 今日中单净流入-净占比  | float64 | 注意单位: % |
| 今日小单净流入-净额   | float64 | -       |
| 今日小单净流入-净占比  | float64 | 注意单位: % |

### stock_sector_fund_flow_hist
- **文档定位**：资金流向 / 东方财富 / 行业历史资金流
- **HTTP**：`GET /api/public/stock_sector_fund_flow_hist`
- **调用**：运行 `scripts/aktools_get.py stock_sector_fund_flow_hist --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/bkzj/BK1034.html

描述: 东方财富网-数据中心-资金流向-行业资金流-行业历史资金流

限量: 单次获取指定行业的行业历史资金流数据

输入参数

| 名称     | 类型  | 描述            |
|--------|-----|---------------|
| symbol | str | symbol="汽车服务" |

输出参数

| 名称         | 类型      | 描述      |
|------------|---------|---------|
| 日期         | object  | 注意单位: % |
| 主力净流入-净额   | float64 | -       |
| 主力净流入-净占比  | float64 | 注意单位: % |
| 超大单净流入-净额  | float64 | -       |
| 超大单净流入-净占比 | float64 | 注意单位: % |
| 大单净流入-净额   | float64 | -       |
| 大单净流入-净占比  | float64 | 注意单位: % |
| 中单净流入-净额   | float64 | -       |
| 中单净流入-净占比  | float64 | 注意单位: % |
| 小单净流入-净额   | float64 | -       |
| 小单净流入-净占比  | float64 | 注意单位: % |

### stock_concept_fund_flow_hist
- **文档定位**：资金流向 / 东方财富 / 概念历史资金流
- **HTTP**：`GET /api/public/stock_concept_fund_flow_hist`
- **调用**：运行 `scripts/aktools_get.py stock_concept_fund_flow_hist --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/bkzj/BK0574.html

描述: 东方财富网-数据中心-资金流向-概念资金流-概念历史资金流

限量: 单次获取指定 symbol 的近期概念历史资金流数据

输入参数

| 名称     | 类型  | 描述            |
|--------|-----|---------------|
| symbol | str | symbol="数据要素" |

输出参数

| 名称         | 类型      | 描述      |
|------------|---------|---------|
| 日期         | object  | 注意单位: % |
| 主力净流入-净额   | float64 | -       |
| 主力净流入-净占比  | float64 | 注意单位: % |
| 超大单净流入-净额  | float64 | -       |
| 超大单净流入-净占比 | float64 | 注意单位: % |
| 大单净流入-净额   | float64 | -       |
| 大单净流入-净占比  | float64 | 注意单位: % |
| 中单净流入-净额   | float64 | -       |
| 中单净流入-净占比  | float64 | 注意单位: % |
| 小单净流入-净额   | float64 | -       |
| 小单净流入-净占比  | float64 | 注意单位: % |
