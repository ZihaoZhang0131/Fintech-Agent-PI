# A股股票指数



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### stock_zh_index_spot_em
- **文档定位**：A股股票指数 / 实时行情数据-东财
- **HTTP**：`GET /api/public/stock_zh_index_spot_em`
- **调用**：运行 `scripts/aktools_get.py stock_zh_index_spot_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/center/gridlist.html#index_sz

描述: 东方财富网-行情中心-沪深京指数

限量: 单次返回所有指数的实时行情数据

输入参数

| 名称     | 类型  | 描述                                                                         |
|--------|-----|----------------------------------------------------------------------------|
| symbol | str | symbol="上证系列指数"；choice of {"沪深重要指数", "上证系列指数", "深证系列指数", "指数成份", "中证系列指数"} |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 序号  | int64   | -       |
| 代码  | object  | -       |
| 名称  | object  | -       |
| 最新价 | float64 | -       |
| 涨跌额 | float64 | -       |
| 涨跌幅 | float64 | 注意单位: % |
| 成交量 | float64 | -       |
| 成交额 | float64 | -       |
| 振幅  | float64 | 注意单位: % |
| 最高  | float64 | -       |
| 最低  | float64 | -       |
| 今开  | float64 | -       |
| 昨收  | float64 | -       |
| 量比  | float64 | -       |

### stock_zh_index_spot_sina
- **文档定位**：A股股票指数 / 实时行情数据-新浪
- **HTTP**：`GET /api/public/stock_zh_index_spot_sina`
- **调用**：运行 `scripts/aktools_get.py stock_zh_index_spot_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://vip.stock.finance.sina.com.cn/mkt/#hs_s

描述: 新浪财经-中国股票指数数据

限量: 单次返回所有指数的实时行情数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

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
| 成交量 | float64 | 注意单位: 手 |
| 成交额 | float64 | 注意单位: 元 |

### stock_zh_index_daily
- **文档定位**：A股股票指数 / 历史行情数据 / 历史行情数据-新浪
- **HTTP**：`GET /api/public/stock_zh_index_daily`
- **调用**：运行 `scripts/aktools_get.py stock_zh_index_daily --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://finance.sina.com.cn/realstock/company/sz399552/nc.shtml(示例)

描述: 股票指数的历史数据按日频率更新

限量: 单次返回指定 symbol 的所有历史行情数据

输入参数

| 名称     | 类型  | 描述                |
|--------|-----|-------------------|
| symbol | str | symbol="sz399552" |

输出参数-历史行情数据

| 名称     | 类型      | 描述                    |
|--------|---------|-----------------------|
| date   | object  | 新浪的数据开始时间, 不是该指数的上市时间 |
| open   | float64 | -                     |
| high   | float64 | -                     |
| low    | float64 | -                     |
| close  | float64 | -                     |
| volume | int64   | -                     |

接口示例-历史行情数据

```python
import akshare as ak

stock_zh_index_daily_df = ak.stock_zh_index_daily(symbol="sz399552")
print(stock_zh_index_daily_df)
```

### stock_zh_index_daily_tx
- **文档定位**：A股股票指数 / 历史行情数据 / 历史行情数据-腾讯
- **HTTP**：`GET /api/public/stock_zh_index_daily_tx`
- **调用**：运行 `scripts/aktools_get.py stock_zh_index_daily_tx --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://gu.qq.com/sh000919/zs

描述: 股票指数(或者股票)历史行情数据, 支持自定义时间范围

限量: 单次返回具体某个股票指数(或者股票)指定时间范围内的历史行情数据

输入参数-历史行情数据

| 名称         | 类型  | 描述                                             |
|------------|-----|------------------------------------------------|
| symbol     | str | symbol="sh000001"                              |
| start_date | str | start_date=""; 开始日期, 格式 "YYYYMMDD", 为空则从最早日期开始 |
| end_date   | str | end_date=""; 结束日期, 格式 "YYYYMMDD", 为空则到当前（最新）日期 |

输出参数-历史行情数据

| 名称     | 类型      | 描述                  |
|--------|---------|---------------------|
| date   | object  | 腾讯的数据开始时间, 不是证券上市时间 |
| open   | float64 | -                   |
| close  | float64 | -                   |
| high   | float64 | -                   |
| low    | float64 | -                   |
| amount | float64 | 注意单位: 手             |

### stock_zh_index_daily_em
- **文档定位**：A股股票指数 / 历史行情数据 / 历史行情数据-东方财富
- **HTTP**：`GET /api/public/stock_zh_index_daily_em`
- **调用**：运行 `scripts/aktools_get.py stock_zh_index_daily_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://quote.eastmoney.com/center/hszs.html

描述: 东方财富股票指数数据, 历史数据按日频率更新

限量: 单次返回具体指数的所有历史行情数据

输入参数

| 名称         | 类型  | 描述                                                                      |
|------------|-----|-------------------------------------------------------------------------|
| symbol     | str | symbol="sz399552"; 支持 sz: 深交所, sh: 上交所, bj: 北交所, csi: 中证指数 + id(000905) |
| start_date | str | start_date="19900101"                                                   |
| end_date   | str | end_date="20500101"                                                     |

输出参数

| 名称     | 类型      | 描述                    |
|--------|---------|-----------------------|
| date   | object  | 东方财富的数据开始时间, 不是证券上市时间 |
| open   | float64 | -                     |
| close  | float64 | -                     |
| high   | float64 | -                     |
| low    | float64 | -                     |
| volume | int64   | -                     |
| amount | float64 | -                     |

### index_zh_a_hist
- **文档定位**：A股股票指数 / 历史行情数据 / 历史行情数据-通用
- **HTTP**：`GET /api/public/index_zh_a_hist`
- **调用**：运行 `scripts/aktools_get.py index_zh_a_hist --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://quote.eastmoney.com/center/hszs.html

描述: 东方财富网-中国股票指数-行情数据

限量: 单次返回具体指数指定 period 从 start_date 到 end_date 的之间的近期数据

输入参数

| 名称         | 类型  | 描述                                                       |
|------------|-----|----------------------------------------------------------|
| symbol     | str | symbol="399282"; 指数代码，此处不用市场标识                           |
| period     | str | period="daily"; choice of {'daily', 'weekly', 'monthly'} |
| start_date | str | start_date="19700101"; 开始日期                              |
| end_date   | str | end_date="22220101"; 结束时间                                |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 日期  | object  | 交易日     |
| 开盘  | float64 | 开盘价     |
| 收盘  | float64 | 收盘价     |
| 最高  | float64 | 最高价     |
| 最低  | float64 | 最低价     |
| 成交量 | int32   | 注意单位: 手 |
| 成交额 | float64 | 注意单位: 元 |
| 振幅  | float64 | 注意单位: % |
| 涨跌幅 | float64 | 注意单位: % |
| 涨跌额 | float64 | 注意单位: 元 |
| 换手率 | float64 | 注意单位: % |

### index_zh_a_hist_min_em
- **文档定位**：A股股票指数 / 分时行情数据
- **HTTP**：`GET /api/public/index_zh_a_hist_min_em`
- **调用**：运行 `scripts/aktools_get.py index_zh_a_hist_min_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/center/hszs.html

描述: 东方财富网-指数数据-分时行情

限量: 单次返回具体指数指定 period 从 start_date 到 end_date 的之间的近期数据，该接口不能返回所有历史数据

输入参数

| 名称         | 类型  | 描述                                                                                |
|------------|-----|-----------------------------------------------------------------------------------|
| symbol     | str | symbol="399006"; 指数代码，此处不用市场标识                                                    |
| period     | str | period="1"; choice of {'1', '5', '15', '30', '60'}, 其中 1 分钟数据只能返回当前的, 其余只能返回近期的数据 |
| start_date | str | start_date="1979-09-01 09:32:00"; 开始日期时间                                          |
| end_date   | str | end_date="2222-01-01 09:32:00"; 结束时间时间                                            |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 时间  | object  | 交易日     |
| 开盘  | float64 | 开盘价     |
| 收盘  | float64 | 收盘价     |
| 最高  | float64 | 最高价     |
| 最低  | float64 | 最低价     |
| 成交量 | int64   | 注意单位: 手 |
| 成交额 | float64 | 注意单位: 元 |
| 均价  | float64 | -       |
