# 概念板块



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### stock_board_concept_index_ths
- **文档定位**：概念板块 / 同花顺-概念板块指数
- **HTTP**：`GET /api/public/stock_board_concept_index_ths`
- **调用**：运行 `scripts/aktools_get.py stock_board_concept_index_ths --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://q.10jqka.com.cn/gn/detail/code/301558

描述: 同花顺-板块-概念板块-指数日频率数据

限量: 单次返回所有日频指数数据

输入参数

| 名称         | 类型  | 描述                                                                         |
|------------|-----|----------------------------------------------------------------------------|
| symbol     | str | symbol="阿里巴巴概念"; 可以通过调用 **ak.stock_board_concept_name_ths()** 查看同花顺的所有概念名称 |
| start_date | str | start_date="20200101"; 开始时间                                                |
| end_date   | str | end_date="20250228"; 结束时间                                                  |

输出参数

| 名称  | 类型      | 描述  |
|-----|---------|-----|
| 日期  | object  | -   |
| 开盘价 | float64 | -   |
| 最高价 | float64 | -   |
| 最低价 | float64 | -   |
| 收盘价 | float64 | -   |
| 成交量 | int64   | -   |
| 成交额 | float64 | -   |

### stock_board_concept_info_ths
- **文档定位**：概念板块 / 同花顺-概念板块简介
- **HTTP**：`GET /api/public/stock_board_concept_info_ths`
- **调用**：运行 `scripts/aktools_get.py stock_board_concept_info_ths --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://q.10jqka.com.cn/gn/detail/code/301558/

描述: 同花顺-板块-概念板块-板块简介

限量: 单次返回所有数据

输入参数

| 名称     | 类型  | 描述                                                                                |
|--------|-----|-----------------------------------------------------------------------------------|
| symbol | str | symbol: str = "阿里巴巴概念"; 可以通过调用 **ak.stock_board_concept_name_ths()** 查看同花顺的所有概念名称 |

输出参数

| 名称 | 类型      | 描述 |
|----|---------|----|
| 项目 | object  | -  |
| 值  | float64 | -  |

### stock_board_concept_name_em
- **文档定位**：概念板块 / 东方财富-概念板块
- **HTTP**：`GET /api/public/stock_board_concept_name_em`
- **调用**：运行 `scripts/aktools_get.py stock_board_concept_name_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/center/boardlist.html#concept_board

描述: 东方财富网-行情中心-沪深京板块-概念板块

限量: 单次返回当前时刻所有概念板块的实时行情数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称       | 类型      | 描述     |
|----------|---------|--------|
| 排名       | int64   | -      |
| 板块名称     | object  | -      |
| 板块代码     | object  | -      |
| 最新价      | float64 | -      |
| 涨跌额      | float64 | -      |
| 涨跌幅      | float64 | 注意单位：% |
| 总市值      | int64   | -      |
| 换手率      | float64 | 注意单位：% |
| 上涨家数     | int64   | -      |
| 下跌家数     | int64   | -      |
| 领涨股票     | object  | -      |
| 领涨股票-涨跌幅 | float64 | 注意单位：% |

### stock_board_concept_spot_em
- **文档定位**：概念板块 / 东方财富-概念板块-实时行情
- **HTTP**：`GET /api/public/stock_board_concept_spot_em`
- **调用**：运行 `scripts/aktools_get.py stock_board_concept_spot_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/bk/90.BK0818.html

描述: 东方财富网-行情中心-沪深京板块-概念板块-实时行情

限量: 单次返回指定概念板块的实时行情数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述 |
|-------|---------|----|
| item  | object  | -  |
| value | float64 | -  |

### stock_board_concept_cons_em
- **文档定位**：概念板块 / 东方财富-成份股
- **HTTP**：`GET /api/public/stock_board_concept_cons_em`
- **调用**：运行 `scripts/aktools_get.py stock_board_concept_cons_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://quote.eastmoney.com/center/boardlist.html#boards-BK06551

描述: 东方财富-沪深板块-概念板块-板块成份

限量: 单次返回当前时刻所有成份股

输入参数

| 名称     | 类型  | 描述                                                                                              |
|--------|-----|-------------------------------------------------------------------------------------------------|
| symbol | str | symbol="融资融券"; 支持传入板块代码比如：BK0655，可以通过调用 **ak.stock_board_concept_name_em()** 查看东方财富-概念板块的所有行业名称 |

输出参数

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| 序号     | int64   | -       |
| 代码     | object  | -       |
| 名称     | object  | -       |
| 最新价    | float64 | -       |
| 涨跌幅    | float64 | 注意单位: % |
| 涨跌额    | float64 | -       |
| 成交量    | float64 | 注意单位: 手 |
| 成交额    | float64 | -       |
| 振幅     | float64 | 注意单位: % |
| 最高     | float64 | -       |
| 最低     | float64 | -       |
| 今开     | float64 | -       |
| 昨收     | float64 | -       |
| 换手率    | float64 | 注意单位: % |
| 市盈率-动态 | float64 | -       |
| 市净率    | float64 | -       |

### stock_board_concept_hist_em
- **文档定位**：概念板块 / 东方财富-指数
- **HTTP**：`GET /api/public/stock_board_concept_hist_em`
- **调用**：运行 `scripts/aktools_get.py stock_board_concept_hist_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://quote.eastmoney.com/bk/90.BK0715.html

描述: 东方财富-沪深板块-概念板块-历史行情数据

限量: 单次返回指定 symbol 和 adjust 的历史数据

输入参数

| 名称         | 类型  | 描述                                                                            |
|------------|-----|-------------------------------------------------------------------------------|
| symbol     | str | symbol="绿色电力"; 可以通过调用 **ak.stock_board_concept_name_em()** 查看东方财富-概念板块的所有概念代码 |
| period     | str | period="daily"; choice of {"daily", "weekly", "monthly"}                      |
| start_date | str | start_date="20220101"                                                         |
| end_date   | str | end_date="20221128"                                                           |
| adjust     | str | adjust=""; choice of {'': 不复权, 默认; "qfq": 前复权, "hfq": 后复权}                    |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 日期  | object  | -       |
| 开盘  | float64 | -       |
| 收盘  | float64 | -       |
| 最高  | float64 | -       |
| 最低  | float64 | -       |
| 涨跌幅 | float64 | 注意单位: % |
| 涨跌额 | float64 | -       |
| 成交量 | int64   | -       |
| 成交额 | float64 | -       |
| 振幅  | float64 | 注意单位: % |
| 换手率 | float64 | 注意单位: % |

### stock_board_concept_hist_min_em
- **文档定位**：概念板块 / 东方财富-指数-分时
- **HTTP**：`GET /api/public/stock_board_concept_hist_min_em`
- **调用**：运行 `scripts/aktools_get.py stock_board_concept_hist_min_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://quote.eastmoney.com/bk/90.BK0715.html

描述: 东方财富-沪深板块-概念板块-分时历史行情数据

限量: 单次返回指定 symbol 和 period 的历史数据

输入参数

| 名称     | 类型  | 描述                                                                           |
|--------|-----|------------------------------------------------------------------------------|
| symbol | str | symbol="长寿药"; 可以通过调用 **ak.stock_board_concept_name_em()** 查看东方财富-概念板块的所有概念代码 |
| period | str | period="5"; choice of {"1", "5", "15", "30", "60"}                           |

输出参数-1分钟

| 名称   | 类型      | 描述 |
|------|---------|----|
| 日期时间 | object  | -  |
| 开盘   | float64 | -  |
| 收盘   | float64 | -  |
| 最高   | float64 | -  |
| 最低   | float64 | -  |
| 成交量  | int64   | -  |
| 成交额  | float64 | -  |
| 最新价  | float64 | -  |

接口示例-1分钟

```python
import akshare as ak

stock_board_concept_hist_min_em_df = ak.stock_board_concept_hist_min_em(symbol="长寿药", period="1")
print(stock_board_concept_hist_min_em_df)
```

### stock_concept_cons_futu
- **文档定位**：概念板块 / 富途牛牛-美股概念-成分股
- **HTTP**：`GET /api/public/stock_concept_cons_futu`
- **调用**：运行 `scripts/aktools_get.py stock_concept_cons_futu --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.futunn.com/quote/sparks-us

描述: 富途牛牛-主题投资-概念板块-成分股

限量: 单次返回指定概念板块成分股数据

输入参数

| 名称     | 类型  | 描述                                                      |
|--------|-----|---------------------------------------------------------|
| symbol | str | symbol="特朗普概念股"; choice of {"巴菲特持仓", "佩洛西持仓", "特朗普概念股"} |

输出参数

| 名称   | 类型      | 描述 |
|------|---------|----|
| 代码   | object  | -  |
| 股票名称 | object  | -  |
| 最新价  | float64 | -  |
| 涨跌额  | float64 | -  |
| 涨跌幅  | object  | -  |
| 成交量  | object  | -  |
| 成交额  | object  | -  |
