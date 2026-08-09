# 大宗交易



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### stock_dzjy_sctj
- **文档定位**：大宗交易 / 市场统计
- **HTTP**：`GET /api/public/stock_dzjy_sctj`
- **调用**：运行 `scripts/aktools_get.py stock_dzjy_sctj --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/dzjy/dzjy_sctj.html

描述: 东方财富网-数据中心-大宗交易-市场统计

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称       | 类型      | 描述      |
|----------|---------|---------|
| 序号       | int64   | -       |
| 交易日期     | object  | -       |
| 上证指数     | float64 | -       |
| 上证指数涨跌幅  | float64 | 注意单位: % |
| 大宗交易成交总额 | float64 | 注意单位: 元 |
| 溢价成交总额   | float64 | 注意单位: 元 |
| 溢价成交总额占比 | float64 | 注意单位: % |
| 折价成交总额   | float64 | 注意单位: 元 |
| 折价成交总额占比 | float64 | 注意单位: % |

### stock_dzjy_mrmx
- **文档定位**：大宗交易 / 每日明细
- **HTTP**：`GET /api/public/stock_dzjy_mrmx`
- **调用**：运行 `scripts/aktools_get.py stock_dzjy_mrmx --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/dzjy/dzjy_mrmx.html

描述: 东方财富网-数据中心-大宗交易-每日明细

限量: 单次返回所有历史数据

输入参数

| 名称         | 类型  | 描述                                              |
|------------|-----|-------------------------------------------------|
| symbol     | str | symbol='债券'; choice of {'A股', 'B股', '基金', '债券'} |
| start_date | str | start_date='20201123'; 开始日期                     |
| end_date   | sr  | end_date='20201204'; 结束日期                       |

输出参数-A股

| 名称       | 类型      | 描述      |
|----------|---------|---------|
| 序号       | int64   | -       |
| 交易日期     | object  | -       |
| 证券代码     | object  | -       |
| 证券简称     | object  | -       |
| 涨跌幅      | float64 | 注意单位: % |
| 收盘价      | float64 | -       |
| 成交价      | float64 | -       |
| 折溢率      | float64 | -       |
| 成交量      | float64 | 注意单位: 股 |
| 成交额      | float64 | 注意单位: 元 |
| 成交额/流通市值 | float64 | 注意单位: % |
| 买方营业部    | object  | -       |
| 卖方营业部    | object  | -       |

接口示例-A股

```python
import akshare as ak

stock_dzjy_mrmx_df = ak.stock_dzjy_mrmx(symbol='A股', start_date='20220104', end_date='20220104')
print(stock_dzjy_mrmx_df)
```

### stock_dzjy_mrtj
- **文档定位**：大宗交易 / 每日统计
- **HTTP**：`GET /api/public/stock_dzjy_mrtj`
- **调用**：运行 `scripts/aktools_get.py stock_dzjy_mrtj --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/dzjy/dzjy_mrtj.html

描述: 东方财富网-数据中心-大宗交易-每日统计

限量: 单次返回所有历史数据

输入参数

| 名称         | 类型  | 描述                          |
|------------|-----|-----------------------------|
| start_date | str | start_date='20220105'; 开始日期 |
| end_date   | sr  | end_date='20220105'; 结束日期   |

输出参数

| 名称        | 类型      | 描述       |
|-----------|---------|----------|
| 序号        | int64   | -        |
| 交易日期      | object  | -        |
| 证券代码      | object  | -        |
| 证券简称      | object  | -        |
| 涨跌幅       | float64 | 注意单位: %  |
| 收盘价       | float64 | -        |
| 成交均价      | float64 | -        |
| 折溢率       | float64 | -        |
| 成交笔数      | int64   |          |
| 成交总量      | float64 | 注意单位: 万股 |
| 成交总额      | float64 | 注意单位: 万元 |
| 成交总额/流通市值 | float64 | 注意单位: %  |

### stock_dzjy_hygtj
- **文档定位**：大宗交易 / 活跃 A 股统计
- **HTTP**：`GET /api/public/stock_dzjy_hygtj`
- **调用**：运行 `scripts/aktools_get.py stock_dzjy_hygtj --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/dzjy/dzjy_hygtj.html

描述: 东方财富网-数据中心-大宗交易-活跃 A 股统计

限量: 单次返回所有历史数据

输入参数

| 名称     | 类型  | 描述                                                   |
|--------|-----|------------------------------------------------------|
| symbol | str | symbol='近三月'; choice of {'近一月', '近三月', '近六月', '近一年'} |

输出参数

| 名称            | 类型      | 描述       |
|---------------|---------|----------|
| 序号            | int64   | -        |
| 证券代码          | object  | -        |
| 证券简称          | object  | -        |
| 最新价           | float64 | -        |
| 涨跌幅           | float64 | 注意单位: %  |
| 最近上榜日         | object  | -        |
| 上榜次数-总计       | int64   | -        |
| 上榜次数-溢价       | int64   | -        |
| 上榜次数-折价       | int64   |          |
| 总成交额          | float64 | 注意单位: 万元 |
| 折溢率           | float64 | 注意单位: 万元 |
| 成交总额/流通市值     | float64 | -        |
| 上榜日后平均涨跌幅-1日  | float64 | 注意符号: %  |
| 上榜日后平均涨跌幅-5日  | float64 | 注意符号: %  |
| 上榜日后平均涨跌幅-10日 | float64 | 注意符号: %  |
| 上榜日后平均涨跌幅-20日 | float64 | 注意符号: %  |

### stock_dzjy_hyyybtj
- **文档定位**：大宗交易 / 活跃营业部统计
- **HTTP**：`GET /api/public/stock_dzjy_hyyybtj`
- **调用**：运行 `scripts/aktools_get.py stock_dzjy_hyyybtj --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/dzjy/dzjy_hyyybtj.html

描述: 东方财富网-数据中心-大宗交易-活跃营业部统计

限量: 单次返回所有历史数据

输入参数

| 名称     | 类型  | 描述                                                              |
|--------|-----|-----------------------------------------------------------------|
| symbol | str | symbol='近3日'; choice of {'当前交易日', '近3日', '近5日', '近10日', '近30日'} |

输出参数

| 名称          | 类型      | 描述       |
|-------------|---------|----------|
| 序号          | int64   | -        |
| 营业部名称       | str     | -        |
| 最近上榜日       | object  | -        |
| 次数总计-买入     | float64 | -        |
| 次数总计-卖出     | float64 | 注意单位: %  |
| 成交金额统计-买入   | float64 | 注意单位: 万元 |
| 成交金额统计-卖出   | float64 | 注意单位: 万元 |
| 成交金额统计-净买入额 | float64 | 注意单位: 万元 |
| 买入的股票       | object  |          |

### stock_dzjy_yybph
- **文档定位**：大宗交易 / 营业部排行
- **HTTP**：`GET /api/public/stock_dzjy_yybph`
- **调用**：运行 `scripts/aktools_get.py stock_dzjy_yybph --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/dzjy/dzjy_yybph.html

描述: 东方财富网-数据中心-大宗交易-营业部排行

限量: 单次返回所有历史数据

输入参数

| 名称     | 类型  | 描述                                                   |
|--------|-----|------------------------------------------------------|
| symbol | str | symbol='近三月'; choice of {'近一月', '近三月', '近六月', '近一年'} |

输出参数

| 名称          | 类型      | 描述      |
|-------------|---------|---------|
| 序号          | int64   | -       |
| 营业部名称       | object  | -       |
| 上榜后1天-买入次数  | float64 | -       |
| 上榜后1天-平均涨幅  | float64 | 注意单位: % |
| 上榜后1天-上涨概率  | float64 | -       |
| 上榜后5天-买入次数  | float64 | -       |
| 上榜后5天-平均涨幅  | float64 | 注意单位: % |
| 上榜后5天-上涨概率  | float64 | -       |
| 上榜后10天-买入次数 | float64 | -       |
| 上榜后10天-平均涨幅 | float64 | 注意单位: % |
| 上榜后10天-上涨概率 | float64 |         |
| 上榜后20天-买入次数 | float64 | -       |
| 上榜后20天-平均涨幅 | float64 | 注意单位: % |
| 上榜后20天-上涨概率 | float64 |         |
