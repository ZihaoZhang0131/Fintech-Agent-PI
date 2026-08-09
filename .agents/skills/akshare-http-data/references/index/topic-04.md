# 港股股票指数



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### stock_hk_index_spot_sina
- **文档定位**：港股股票指数 / 实时行情数据-新浪
- **HTTP**：`GET /api/public/stock_hk_index_spot_sina`
- **调用**：运行 `scripts/aktools_get.py stock_hk_index_spot_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://vip.stock.finance.sina.com.cn/mkt/#zs_hk

描述: 新浪财经-行情中心-港股指数

限量: 单次返回所有数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 代码  | object  | -       |
| 名称  | object  | -       |
| 最新价 | float64 | -       |
| 涨跌额 | float64 | -       |
| 涨跌幅 | float64 | 注意单位: % |
| 昨收  | float64 | -       |
| 今开  | float64 | -       |
| 最高  | float64 | -       |
| 最低  | float64 | -       |

### stock_hk_index_daily_sina
- **文档定位**：港股股票指数 / 历史行情数据-新浪
- **HTTP**：`GET /api/public/stock_hk_index_daily_sina`
- **调用**：运行 `scripts/aktools_get.py stock_hk_index_daily_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://stock.finance.sina.com.cn/hkstock/quotes/CES100.html

描述: 新浪财经-港股指数-历史行情数据

限量: 单次返回指定 symbol 的所有数据

输入参数

| 名称     | 类型  | 描述              |
|--------|-----|-----------------|
| symbol | str | symbol="CES100" |

输出参数

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| date   | object  | -       |
| open   | object  | -       |
| close  | float64 | -       |
| high   | float64 | -       |
| low    | float64 | 注意单位: % |
| volume | float64 | -       |

### stock_hk_index_spot_em
- **文档定位**：港股股票指数 / 实时行情数据-东财
- **HTTP**：`GET /api/public/stock_hk_index_spot_em`
- **调用**：运行 `scripts/aktools_get.py stock_hk_index_spot_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/center/gridlist.html#hk_index

描述: 东方财富网-行情中心-港股-指数实时行情

限量: 单次返回所有数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称   | 类型      | 描述       |
|------|---------|----------|
| 序号   | int64   | -        |
| 内部编号 | int64   | -        |
| 代码   | object  | -        |
| 名称   | object  | -        |
| 最新价  | float64 | -        |
| 涨跌额  | float64 | -        |
| 涨跌幅  | float64 | 注意单位: %  |
| 今开   | float64 | -        |
| 最高   | float64 | -        |
| 最低   | float64 | -        |
| 昨收   | float64 | -        |
| 成交量  | float64 | -        |
| 成交额  | float64 | 注意单位: 港元 |

### stock_hk_index_daily_em
- **文档定位**：港股股票指数 / 历史行情数据-东财
- **HTTP**：`GET /api/public/stock_hk_index_daily_em`
- **调用**：运行 `scripts/aktools_get.py stock_hk_index_daily_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/gb/zsHSTECF2L.html

描述: 东方财富网-港股-股票指数数据

限量: 单次返回指定 symbol 的所有数据

输入参数

| 名称     | 类型  | 描述                                                     |
|--------|-----|--------------------------------------------------------|
| symbol | str | symbol="HSTECF2L"; 可以通过 ak.stock_hk_index_spot_em() 获取 |

输出参数

| 名称     | 类型      | 描述  |
|--------|---------|-----|
| date   | object  | -   |
| open   | float64 | -   |
| high   | float64 | -   |
| low    | float64 | -   |
| latest | float64 | 最新价 |
