# B股



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### stock_zh_b_spot_em
- **文档定位**：B股 / 实时行情数据 / 实时行情数据-东财
- **HTTP**：`GET /api/public/stock_zh_b_spot_em`
- **调用**：运行 `scripts/aktools_get.py stock_zh_b_spot_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://quote.eastmoney.com/center/gridlist.html#hs_b_board

描述: 东方财富网-实时行情数据

限量: 单次返回所有 B 股上市公司的实时行情数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称      | 类型      | 描述      |
|---------|---------|---------|
| 序号      | int64   | -       |
| 代码      | object  | -       |
| 名称      | object  | -       |
| 最新价     | float64 | -       |
| 涨跌幅     | float64 | 注意单位: % |
| 涨跌额     | float64 | -       |
| 成交量     | float64 | 注意单位: 手 |
| 成交额     | float64 | 注意单位: 元 |
| 振幅      | float64 | 注意单位: % |
| 最高      | float64 | -       |
| 最低      | float64 | -       |
| 今开      | float64 | -       |
| 昨收      | float64 | -       |
| 量比      | float64 | -       |
| 换手率     | float64 | 注意单位: % |
| 市盈率-动态  | float64 | -       |
| 市净率     | float64 | -       |
| 总市值     | float64 | 注意单位: 元 |
| 流通市值    | float64 | 注意单位: 元 |
| 涨速      | float64 | -       |
| 5分钟涨跌   | float64 | 注意单位: % |
| 60日涨跌幅  | float64 | 注意单位: % |
| 年初至今涨跌幅 | float64 | 注意单位: % |

### stock_zh_b_spot
- **文档定位**：B股 / 实时行情数据 / 实时行情数据-新浪
- **HTTP**：`GET /api/public/stock_zh_b_spot`
- **调用**：运行 `scripts/aktools_get.py stock_zh_b_spot --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://vip.stock.finance.sina.com.cn/mkt/#hs_b

描述: B 股数据是从新浪财经获取的数据, 重复运行本函数会被新浪暂时封 IP, 建议增加时间间隔

限量: 单次返回所有 B 股上市公司的实时行情数据

输入参数-实时行情数据

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数-实时行情数据

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 代码  | object  | -       |
| 名称  | object  | -       |
| 最新价 | float64 | -       |
| 涨跌额 | float64 | -       |
| 涨跌幅 | float64 | 注意单位: % |
| 买入  | float64 | -       |
| 卖出  | float64 | -       |
| 昨收  | float64 | -       |
| 今开  | float64 | -       |
| 最高  | float64 | -       |
| 最低  | float64 | -       |
| 成交量 | float64 | 注意单位: 股 |
| 成交额 | float64 | 注意单位: 元 |

接口示例-实时行情数据

```python
import akshare as ak

stock_zh_b_spot_df = ak.stock_zh_b_spot()
print(stock_zh_b_spot_df)
```

### stock_zh_b_daily
- **文档定位**：B股 / 历史行情数据 / 历史行情数据
- **HTTP**：`GET /api/public/stock_zh_b_daily`
- **调用**：运行 `scripts/aktools_get.py stock_zh_b_daily --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://finance.sina.com.cn/realstock/company/sh900901/nc.shtml

描述: B 股数据是从新浪财经获取的数据, 历史数据按日频率更新

限量: 单次返回指定 B 股上市公司指定日期间的历史行情日频率数据

输入参数

| 名称         | 类型  | 描述                                                                                   |
|------------|-----|--------------------------------------------------------------------------------------|
| symbol     | str | symbol='sh900901'; 股票代码可以在 **ak.stock_zh_b_spot()** 中获取                              |
| start_date | str | start_date='20201103'; 开始查询的日期                                                       |
| end_date   | str | end_date='20201116'; 结束查询的日期                                                         |
| adjust     | str | 默认返回不复权的数据; qfq: 返回前复权后的数据; hfq: 返回后复权后的数据; hfq-factor: 返回后复权因子; qfq-factor: 返回前复权因子 |

**股票数据复权**

1.为何要复权：由于股票存在配股、分拆、合并和发放股息等事件，会导致股价出现较大的缺口。
若使用不复权的价格处理数据、计算各种指标，将会导致它们失去连续性，且使用不复权价格计算收益也会出现错误。
为了保证数据连贯性，常通过前复权和后复权对价格序列进行调整。

2.前复权：保持当前价格不变，将历史价格进行增减，从而使股价连续。
前复权用来看盘非常方便，能一眼看出股价的历史走势，叠加各种技术指标也比较顺畅，是各种行情软件默认的复权方式。
这种方法虽然很常见，但也有两个缺陷需要注意。

2.1 为了保证当前价格不变，每次股票除权除息，均需要重新调整历史价格，因此其历史价格是时变的。
这会导致在不同时点看到的历史前复权价可能出现差异。

2.2 对于有持续分红的公司来说，前复权价可能出现负值。

3.后复权：保证历史价格不变，在每次股票权益事件发生后，调整当前的股票价格。
后复权价格和真实股票价格可能差别较大，不适合用来看盘。
其优点在于，可以被看作投资者的长期财富增长曲线，反映投资者的真实收益率情况。

4.在量化投资研究中普遍采用后复权数据。

输出参数-历史行情数据

| 名称                | 类型      | 描述            |
|-------------------|---------|---------------|
| date              | object  | 交易日           |
| close             | float64 | 收盘价           |
| high              | float64 | 最高价           |
| low               | float64 | 最低价           |
| open              | float64 | 开盘价           |
| volume            | float64 | 成交量; 注意单位: 股  |
| outstanding_share | float64 | 流动股本; 注意单位: 股 |
| turnover          | float64 | 换手率=成交量/流动股本  |

接口示例-历史行情数据(前复权)

```python
import akshare as ak

stock_zh_b_daily_qfq_df = ak.stock_zh_b_daily(symbol="sh900901", start_date="19900103", end_date="20240722", adjust="qfq")
print(stock_zh_b_daily_qfq_df)
```

### stock_zh_b_minute
- **文档定位**：B股 / 历史行情数据 / 分时数据
- **HTTP**：`GET /api/public/stock_zh_b_minute`
- **调用**：运行 `scripts/aktools_get.py stock_zh_b_minute --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://finance.sina.com.cn/realstock/company/sh900901/nc.shtml

描述: 新浪财经 B 股股票或者指数的分时数据，目前可以获取 1, 5, 15, 30, 60 分钟的数据频率, 可以指定是否复权

限量: 单次返回指定股票或指数的指定频率的最近交易日的历史分时行情数据

输入参数

| 名称     | 类型  | 描述                                                         |
|--------|-----|------------------------------------------------------------|
| symbol | str | symbol='sh900901'; 同日频率数据接口                                |
| period | str | period='1'; 获取 1, 5, 15, 30, 60 分钟的数据频率                    |
| adjust | str | adjust=""; 默认为空: 返回不复权的数据; qfq: 返回前复权后的数据; hfq: 返回后复权后的数据; |

输出参数

| 名称     | 类型      | 描述  |
|--------|---------|-----|
| day    | object  | -   |
| open   | float64 | -   |
| high   | float64 | -   |
| low    | float64 | -   |
| close  | float64 | -   |
| volume | float64 | -   |
