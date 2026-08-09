# 美股



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### stock_us_spot_em
- **文档定位**：美股 / 实时行情数据-东财
- **HTTP**：`GET /api/public/stock_us_spot_em`
- **调用**：运行 `scripts/aktools_get.py stock_us_spot_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/center/gridlist.html#us_stocks

描述: 东方财富网-美股-实时行情

限量: 单次返回美股所有上市公司的实时行情数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称  | 类型      | 描述              |
|-----|---------|-----------------|
| 序号  | int64   | -               |
| 名称  | object  | -               |
| 最新价 | float64 | 注意单位: 美元        |
| 涨跌额 | float64 | 注意单位: 美元        |
| 涨跌幅 | float64 | 注意单位: %         |
| 开盘价 | float64 | 注意单位: 美元        |
| 最高价 | float64 | 注意单位: 美元        |
| 最低价 | float64 | 注意单位: 美元        |
| 昨收价 | float64 | 注意单位: 美元        |
| 总市值 | float64 | 注意单位: 美元        |
| 市盈率 | float64 | -               |
| 成交量 | float64 | -               |
| 成交额 | float64 | 注意单位: 美元        |
| 振幅  | float64 | 注意单位: %         |
| 换手率 | float64 | 注意单位: %         |
| 代码  | object  | 注意: 用来获取历史数据的代码 |

### stock_us_spot
- **文档定位**：美股 / 实时行情数据-新浪
- **HTTP**：`GET /api/public/stock_us_spot`
- **调用**：运行 `scripts/aktools_get.py stock_us_spot --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://finance.sina.com.cn/stock/usstock/sector.shtml

描述: 新浪财经-美股; 获取的数据有 15 分钟延迟; 建议使用 ak.stock_us_spot_em() 来获取数据

限量: 单次返回美股所有上市公司的实时行情数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称  | 类型  | 描述   |
|-----|-----|------|
| -   | -   | 新浪默认 |

### stock_us_hist
- **文档定位**：美股 / 历史行情数据-东财
- **HTTP**：`GET /api/public/stock_us_hist`
- **调用**：运行 `scripts/aktools_get.py stock_us_hist --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/us/ENTX.html#fullScreenChart

描述: 东方财富网-行情-美股-每日行情

限量: 单次返回指定上市公司的指定 adjust 后的所有历史行情数据；注意其中复权参数是否生效！

输入参数

| 名称         | 类型  | 描述                                                                          |
|------------|-----|-----------------------------------------------------------------------------|
| symbol     | str | 美股代码, 可以通过 **ak.stock_us_spot_em()** 函数返回所有的 pandas.DataFrame 里面的 `代码` 字段获取 |
| period     | str | period='daily'; choice of {'daily', 'weekly', 'monthly'}                    |
| start_date | str | start_date="20210101"                                                       |
| end_date   | str | end_date="20210601"                                                         |
| adjust     | str | 默认 adjust="", 则返回未复权的数据; adjust="qfq" 则返回前复权的数据, adjust="hfq" 则返回后复权的数据     |

输出参数

| 名称  | 类型      | 描述       |
|-----|---------|----------|
| 日期  | object  | -        |
| 开盘  | float64 | 注意单位: 美元 |
| 收盘  | float64 | 注意单位: 美元 |
| 最高  | float64 | 注意单位: 美元 |
| 最低  | float64 | 注意单位: 美元 |
| 成交量 | int32   | 注意单位: 股  |
| 成交额 | float64 | 注意单位: 美元 |
| 振幅  | float64 | 注意单位: %  |
| 涨跌幅 | float64 | 注意单位: %  |
| 涨跌额 | float64 | 注意单位: 美元 |
| 换手率 | float64 | 注意单位: %  |

### stock_individual_basic_info_us_xq
- **文档定位**：美股 / 个股信息查询-雪球
- **HTTP**：`GET /api/public/stock_individual_basic_info_us_xq`
- **调用**：运行 `scripts/aktools_get.py stock_individual_basic_info_us_xq --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://xueqiu.com/snowman/S/NVDA/detail#/GSJJ

描述: 雪球-个股-公司概况-公司简介

限量: 单次返回指定 symbol 的个股信息

输入参数

| 名称      | 类型    | 描述                      |
|---------|-------|-------------------------|
| symbol  | str   | symbol="NVDA"; 股票代码     |
| token   | str   | token=None; 雪球 xq_a_token |
| timeout | float | timeout=None; 默认不设置超时参数 |

输出参数

| 名称    | 类型     | 描述  |
|-------|--------|-----|
| item  | object | -   |
| value | object | -   |

### stock_us_hist_min_em
- **文档定位**：美股 / 分时数据-东财
- **HTTP**：`GET /api/public/stock_us_hist_min_em`
- **调用**：运行 `scripts/aktools_get.py stock_us_hist_min_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/us/ATER.html

描述: 东方财富网-行情首页-美股-每日分时行情

限量: 单次返回指定上市公司最近 5 个交易日分钟数据, 注意美股数据更新有延时

输入参数

| 名称         | 类型  | 描述                                                                                           |
|------------|-----|----------------------------------------------------------------------------------------------|
| symbol     | str | symbol="105.ATER"; 美股代码可以通过 **ak.stock_us_spot_em()** 函数返回所有的 pandas.DataFrame 里面的 `代码` 字段获取 |
| start_date | str | start_date="1979-09-01 09:32:00"; 日期时间; 默认返回所有数据                                             |
| end_date   | str | end_date="2222-01-01 09:32:00"; 日期时间; 默认返回所有数据                                               |

输出参数

| 名称  | 类型      | 描述       |
|-----|---------|----------|
| 时间  | object  | -        |
| 开盘  | float64 | 注意单位: 美元 |
| 收盘  | float64 | 注意单位: 美元 |
| 最高  | float64 | 注意单位: 美元 |
| 最低  | float64 | 注意单位: 美元 |
| 成交量 | float64 | 注意单位: 股  |
| 成交额 | float64 | 注意单位: 美元 |
| 最新价 | float64 | 注意单位: 美元 |

### stock_us_daily
- **文档定位**：美股 / 历史行情数据-新浪
- **HTTP**：`GET /api/public/stock_us_daily`
- **调用**：运行 `scripts/aktools_get.py stock_us_daily --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://finance.sina.com.cn/stock/usstock/sector.shtml

描述: 美股历史行情数据，设定 adjust="qfq" 则返回前复权后的数据，默认 adjust="", 则返回未复权的数据，历史数据按日频率更新

限量: 单次返回指定上市公司的指定 adjust 后的所有历史行情数据

输入参数

| 名称     | 类型  | 描述                                                                  |
|--------|-----|---------------------------------------------------------------------|
| symbol | str | 美股代码, 可以通过 **ak.get_us_stock_name()** 函数返回所有美股代码, 由于美股数据量大, 建议按需要获取 |
| adjust | str | adjust="qfq" 则返回前复权后的数据，默认 adjust="", 则返回未复权的数据                     |

**ak.get_us_stock_name()**: will return a pandas.DataFrame, which contains name, cname and symbol, you should use
symbol!

输出参数-历史数据

| 名称     | 类型         | 描述  |
|--------|------------|-----|
| date   | datetime64 | -   |
| open   | float64    | 开盘价 |
| high   | float64    | 最高价 |
| low    | float64    | 最低价 |
| close  | float64    | 收盘价 |
| volume | float64    | 成交量 |

输出参数-前复权因子

| 名称         | 类型         | 描述                  |
|------------|------------|---------------------|
| date       | datetime64 | 日期                  |
| qfq_factor | float      | 前复权因子               |
| adjust     | float      | 由于前复权会出现负值, 该值为调整因子 |

P.S. 复权计算公式: 未复权数据 * qfq_factor + adjust

P.S. "CIEN" 股票的新浪美股数据由于复权因子错误，暂不返回前复权数据

接口示例-未复权数据

```python
import akshare as ak

stock_us_daily_df = ak.stock_us_daily(symbol="AAPL", adjust="")
print(stock_us_daily_df)
```

### stock_us_pink_spot_em
- **文档定位**：美股 / 粉单市场
- **HTTP**：`GET /api/public/stock_us_pink_spot_em`
- **调用**：运行 `scripts/aktools_get.py stock_us_pink_spot_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://quote.eastmoney.com/center/gridlist.html#us_pinksheet

描述: 美股粉单市场的实时行情数据

限量: 单次返回指定所有粉单市场的行情数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称  | 类型      | 描述              |
|-----|---------|-----------------|
| 序号  | int64   | -               |
| 名称  | object  | -               |
| 最新价 | float64 | 注意单位: 美元        |
| 涨跌额 | float64 | 注意单位: 美元        |
| 涨跌幅 | float64 | 注意单位: %         |
| 开盘价 | float64 | 注意单位: 美元        |
| 最高价 | float64 | 注意单位: 美元        |
| 最低价 | float64 | 注意单位: 美元        |
| 昨收价 | float64 | 注意单位: 美元        |
| 总市值 | float64 | 注意单位: 美元        |
| 市盈率 | float64 | -               |
| 代码  | object  | 注意: 用来获取历史数据的代码 |

### stock_us_famous_spot_em
- **文档定位**：美股 / 知名美股
- **HTTP**：`GET /api/public/stock_us_famous_spot_em`
- **调用**：运行 `scripts/aktools_get.py stock_us_famous_spot_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://quote.eastmoney.com/center/gridlist.html#us_wellknown

描述: 美股-知名美股的实时行情数据

限量: 单次返回指定 symbol 的行情数据

输入参数

| 名称     | 类型  | 描述                                                                       |
|--------|-----|--------------------------------------------------------------------------|
| symbol | str | symbol="科技类"; choice of {'科技类', '金融类', '医药食品类', '媒体类', '汽车能源类', '制造零售类'} |

输出参数

| 名称  | 类型      | 描述              |
|-----|---------|-----------------|
| 序号  | int64   | -               |
| 名称  | object  | -               |
| 最新价 | float64 | 注意单位: 美元        |
| 涨跌额 | float64 | 注意单位: 美元        |
| 涨跌幅 | float64 | 注意单位: %         |
| 开盘价 | float64 | 注意单位: 美元        |
| 最高价 | float64 | 注意单位: 美元        |
| 最低价 | float64 | 注意单位: 美元        |
| 昨收价 | float64 | 注意单位: 美元        |
| 总市值 | float64 | 注意单位: 美元        |
| 市盈率 | float64 | -               |
| 代码  | object  | 注意: 用来获取历史数据的代码 |
