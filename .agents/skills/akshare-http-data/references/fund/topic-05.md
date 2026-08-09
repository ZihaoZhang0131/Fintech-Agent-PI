# 基金行情



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### fund_etf_spot_em
- **文档定位**：基金行情 / ETF基金实时行情-东财
- **HTTP**：`GET /api/public/fund_etf_spot_em`
- **调用**：运行 `scripts/aktools_get.py fund_etf_spot_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/center/gridlist.html#fund_etf

描述: 东方财富-ETF 实时行情

限量: 单次返回所有数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称         | 类型      | 描述      |
|------------|---------|---------|
| 代码         | object  | -       |
| 名称         | object  | -       |
| 最新价        | float64 | -       |
| IOPV实时估值   | float64 | -       |
| 基金折价率      | float64 | 注意单位: % |
| 涨跌额        | float64 | -       |
| 涨跌幅        | float64 | 注意单位: % |
| 成交量        | float64 | -       |
| 成交额        | float64 | -       |
| 开盘价        | float64 | -       |
| 最高价        | float64 | -       |
| 最低价        | float64 | -       |
| 昨收         | float64 | -       |
| 换手率        | float64 | -       |
| 量比         | float64 | -       |
| 委比         | float64 | -       |
| 外盘         | float64 | -       |
| 内盘         | float64 | -       |
| 主力净流入-净额   | float64 | -       |
| 主力净流入-净占比  | float64 | -       |
| 超大单净流入-净额  | float64 | -       |
| 超大单净流入-净占比 | float64 | -       |
| 大单净流入-净额   | float64 | -       |
| 大单净流入-净占比  | float64 | -       |
| 中单净流入-净额   | float64 | -       |
| 中单净流入-净占比  | float64 | -       |
| 小单净流入-净额   | float64 | -       |
| 小单净流入-净占比  | float64 | -       |
| 现手         | float64 | -       |
| 买一         | float64 | -       |
| 卖一         | float64 | -       |
| 最新份额       | float64 | -       |
| 流通市值       | int64   | -       |
| 总市值        | int64   | -       |
| 数据日期       | object  | -       |
| 更新时间       | object  | -       |

### fund_etf_category_ths
- **文档定位**：基金行情 / 基金实时行情-同花顺
- **HTTP**：`GET /api/public/fund_etf_category_ths`
- **调用**：运行 `scripts/aktools_get.py fund_etf_category_ths --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://fund.10jqka.com.cn/datacenter/jz/kfs/etf/

描述: 同花顺理财-基金数据-每日净值-实时行情

限量: 单次返回指定 date 和 symbol 的所有数据

输入参数

| 名称     | 类型  | 描述                                                                                             |
|--------|-----|------------------------------------------------------------------------------------------------|
| symbol | str | symbol="ETF"; choice of {"股票型", "债券型", "混合型", "ETF", "LOF", "QDII", "保本型", "指数型", ""}; "" 表示全部 |
| date   | str | date=""; 默认返回当前最新的数据                                                                           |

输出参数

| 名称       | 类型      | 描述      |
|----------|---------|---------|
| 序号       | int64   | -       |
| 基金代码     | object  | -       |
| 基金名称     | object  | -       |
| 当前-单位净值  | float64 | -       |
| 当前-累计净值  | float64 | -       |
| 前一日-单位净值 | float64 | -       |
| 前一日-累计净值 | float64 |         |
| 增长值      | float64 | -       |
| 增长率      | float64 | 注意单位: % |
| 赎回状态     | object  | -       |
| 申购状态     | object  | -       |
| 最新-交易日   | object  | -       |
| 最新-单位净值  | float64 | -       |
| 最新-累计净值  | float64 | -       |
| 基金类型     | object  | -       |
| 查询日期     | object  | -       |

### fund_etf_spot_ths
- **文档定位**：基金行情 / ETF基金实时行情-同花顺
- **HTTP**：`GET /api/public/fund_etf_spot_ths`
- **调用**：运行 `scripts/aktools_get.py fund_etf_spot_ths --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://fund.10jqka.com.cn/datacenter/jz/kfs/etf/

描述: 同花顺理财-基金数据-每日净值-ETF-实时行情

限量: 单次返回指定 date 的所有数据

输入参数

| 名称   | 类型  | 描述                   |
|------|-----|----------------------|
| date | str | date=""; 默认返回当前最新的数据 |

输出参数

| 名称       | 类型      | 描述      |
|----------|---------|---------|
| 序号       | int64   | -       |
| 基金代码     | object  | -       |
| 基金名称     | object  | -       |
| 当前-单位净值  | float64 | -       |
| 当前-累计净值  | float64 | -       |
| 前一日-单位净值 | float64 | -       |
| 前一日-累计净值 | float64 |         |
| 增长值      | float64 | -       |
| 增长率      | float64 | 注意单位: % |
| 赎回状态     | object  | -       |
| 申购状态     | object  | -       |
| 最新-交易日   | object  | -       |
| 最新-单位净值  | float64 | -       |
| 最新-累计净值  | float64 | -       |
| 基金类型     | object  | -       |
| 查询日期     | object  | -       |

### fund_lof_spot_em
- **文档定位**：基金行情 / LOF基金实时行情-东财
- **HTTP**：`GET /api/public/fund_lof_spot_em`
- **调用**：运行 `scripts/aktools_get.py fund_lof_spot_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/center/gridlist.html#fund_lof

描述: 东方财富-LOF 实时行情

限量: 单次返回所有数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 代码   | object  | -       |
| 名称   | object  | -       |
| 最新价  | float64 | -       |
| 涨跌额  | float64 | -       |
| 涨跌幅  | float64 | 注意单位: % |
| 成交量  | float64 | -       |
| 成交额  | float64 | -       |
| 开盘价  | float64 | -       |
| 最高价  | float64 | -       |
| 最低价  | float64 | -       |
| 昨收   | float64 | -       |
| 换手率  | float64 | -       |
| 流通市值 | int64   | -       |
| 总市值  | int64   | -       |

### fund_etf_category_sina
- **文档定位**：基金行情 / 基金实时行情-新浪
- **HTTP**：`GET /api/public/fund_etf_category_sina`
- **调用**：运行 `scripts/aktools_get.py fund_etf_category_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://vip.stock.finance.sina.com.cn/fund_center/index.html#jjhqetf

描述: 新浪财经-基金列表及行情数据

限量: 单次返回指定 symbol 基金的所有数据

输入参数

| 名称     | 类型  | 描述                                                    |
|--------|-----|-------------------------------------------------------|
| symbol | str | symbol="LOF基金"; choice of {"封闭式基金", "ETF基金", "LOF基金"} |

输出参数

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
| 成交量 | int64   | 注意单位: 股 |
| 成交额 | int64   | 注意单位: 元 |

### fund_etf_hist_min_em
- **文档定位**：基金行情 / ETF基金分时行情-东财
- **HTTP**：`GET /api/public/fund_etf_hist_min_em`
- **调用**：运行 `scripts/aktools_get.py fund_etf_hist_min_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/sz159707.html

描述: 东方财富-ETF 分时行情; 该接口只能获取近期的分时数据，注意时间周期的设置

限量: 单次返回指定 ETF、频率、复权调整和时间区间的分时数据, 其中 1 分钟数据只返回近 5 个交易日数据且不复权

输入参数

| 名称         | 类型  | 描述                                                                                                  |
|------------|-----|-----------------------------------------------------------------------------------------------------|
| symbol     | str | symbol='513500'; ETF 代码可以在 **ak.fund_etf_spot_em()** 中获取                                            |
| start_date | str | start_date="1979-09-01 09:32:00"; 日期时间; 默认返回所有数据                                                    |
| end_date   | str | end_date="2222-01-01 09:32:00"; 日期时间; 默认返回所有数据                                                      |
| period     | str | period='5'; choice of {'1', '5', '15', '30', '60'}; 其中 1 分钟数据返回近 5 个交易日数据且不复权                       |
| adjust     | str | adjust=''; choice of {'', 'qfq', 'hfq'}; '': 不复权, 'qfq': 前复权, 'hfq': 后复权, 其中 1 分钟数据返回近 5 个交易日数据且不复权 |

输出参数-1分钟数据

| 名称  | 类型      | 描述  |
|-----|---------|-----|
| 时间  | object  | -   |
| 开盘  | float64 | -   |
| 收盘  | float64 | -   |
| 最高  | float64 | -   |
| 最低  | float64 | -   |
| 成交量 | float64 | -   |
| 成交额 | float64 | -   |
| 均价  | float64 | -   |

接口示例-1分钟数据

```python
import akshare as ak

fund_etf_hist_min_em_df = ak.fund_etf_hist_min_em(symbol="511220", period="1", adjust="", start_date="2024-03-20 09:30:00", end_date="2024-03-20 17:40:00")
print(fund_etf_hist_min_em_df)
```

### fund_lof_hist_min_em
- **文档定位**：基金行情 / LOF基金分时行情-东财
- **HTTP**：`GET /api/public/fund_lof_hist_min_em`
- **调用**：运行 `scripts/aktools_get.py fund_lof_hist_min_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/sz166009.html

描述: 东方财富-LOF 分时行情; 该接口只能获取近期的分时数据，注意时间周期的设置

限量: 单次返回指定 LOF、频率、复权调整和时间区间的分时数据, 其中 1 分钟数据只返回近 5 个交易日数据且不复权

输入参数

| 名称         | 类型  | 描述                                                                                                  |
|------------|-----|-----------------------------------------------------------------------------------------------------|
| symbol     | str | symbol='166009'; LOF 代码可以在 **ak.fund_lof_spot_em()** 中获取                                            |
| start_date | str | start_date="1979-09-01 09:32:00"; 日期时间; 默认返回所有数据                                                    |
| end_date   | str | end_date="2222-01-01 09:32:00"; 日期时间; 默认返回所有数据                                                      |
| period     | str | period='5'; choice of {'1', '5', '15', '30', '60'}; 其中 1 分钟数据返回近 5 个交易日数据且不复权                       |
| adjust     | str | adjust=''; choice of {'', 'qfq', 'hfq'}; '': 不复权, 'qfq': 前复权, 'hfq': 后复权, 其中 1 分钟数据返回近 5 个交易日数据且不复权 |

输出参数-1分钟数据

| 名称  | 类型      | 描述  |
|-----|---------|-----|
| 时间  | object  | -   |
| 开盘  | float64 | -   |
| 收盘  | float64 | -   |
| 最高  | float64 | -   |
| 最低  | float64 | -   |
| 成交量 | float64 | -   |
| 成交额 | float64 | -   |
| 均价  | float64 | -   |

接口示例-1分钟数据

```python
import akshare as ak

fund_lof_hist_min_em_df = ak.fund_lof_hist_min_em(symbol="166009", period="1", adjust="", start_date="2024-03-20 09:30:00", end_date="2024-03-20 14:40:00")
print(fund_lof_hist_min_em_df)
```

### fund_etf_hist_em
- **文档定位**：基金行情 / ETF基金历史行情-东财
- **HTTP**：`GET /api/public/fund_etf_hist_em`
- **调用**：运行 `scripts/aktools_get.py fund_etf_hist_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://quote.eastmoney.com/sz159707.html

描述: 东方财富-ETF 行情; 历史数据按日频率更新, 当日收盘价请在收盘后获取

限量: 单次返回指定 ETF、指定周期和指定日期间的历史行情日频率数据

输入参数

| 名称         | 类型  | 描述                                                              |
|------------|-----|-----------------------------------------------------------------|
| symbol     | str | symbol='159707'; ETF 代码可以在 **ak.fund_etf_spot_em()** 中获取或查看东财主页 |
| period     | str | period='daily'; choice of {'daily', 'weekly', 'monthly'}        |
| start_date | str | start_date='20000101'; 开始查询的日期                                  |
| end_date   | str | end_date='20230104'; 结束查询的日期                                    |
| adjust     | str | 默认返回不复权的数据; qfq: 返回前复权后的数据; hfq: 返回后复权后的数据                      |

**数据复权**

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

输出参数

| 名称  | 类型      | 描述  |
|-----|---------|-----|
| 日期  | object  | -   |
| 开盘  | float64 | -   |
| 收盘  | float64 | -   |
| 最高  | float64 | -   |
| 最低  | float64 | -   |
| 成交量 | int64   | -   |
| 成交额 | float64 | -   |
| 振幅  | float64 | -   |
| 涨跌幅 | float64 | -   |
| 涨跌额 | float64 | -   |
| 换手率 | float64 | -   |

接口示例-不复权

```python
import akshare as ak

fund_etf_hist_em_df = ak.fund_etf_hist_em(symbol="513500", period="daily", start_date="20000101", end_date="20230201", adjust="")
print(fund_etf_hist_em_df)
```

### fund_lof_hist_em
- **文档定位**：基金行情 / LOF基金历史行情-东财
- **HTTP**：`GET /api/public/fund_lof_hist_em`
- **调用**：运行 `scripts/aktools_get.py fund_lof_hist_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/sz166009.html

描述: 东方财富-LOF 行情; 历史数据按日频率更新, 当日收盘价请在收盘后获取

限量: 单次返回指定 LOF、指定周期和指定日期间的历史行情日频率数据

输入参数

| 名称         | 类型  | 描述                                                       |
|------------|-----|----------------------------------------------------------|
| symbol     | str | symbol='166009'; LOF 代码可以在 **ak.fund_lof_spot_em()** 中获取 |
| period     | str | period='daily'; choice of {'daily', 'weekly', 'monthly'} |
| start_date | str | start_date='20000101'; 开始查询的日期                           |
| end_date   | str | end_date='20230104'; 结束查询的日期                             |
| adjust     | str | 默认返回不复权的数据; qfq: 返回前复权后的数据; hfq: 返回后复权后的数据               |

**数据复权**

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

输出参数

| 名称  | 类型      | 描述  |
|-----|---------|-----|
| 日期  | object  | -   |
| 开盘  | float64 | -   |
| 收盘  | float64 | -   |
| 最高  | float64 | -   |
| 最低  | float64 | -   |
| 成交量 | int64   | -   |
| 成交额 | float64 | -   |
| 振幅  | float64 | -   |
| 涨跌幅 | float64 | -   |
| 涨跌额 | float64 | -   |
| 换手率 | float64 | -   |

接口示例-不复权

```python
import akshare as ak

fund_lof_hist_em_df = ak.fund_lof_hist_em(symbol="166009", period="daily", start_date="20000101", end_date="20230703", adjust="")
print(fund_lof_hist_em_df)
```

### fund_etf_hist_sina
- **文档定位**：基金行情 / 基金历史行情-新浪
- **HTTP**：`GET /api/public/fund_etf_hist_sina`
- **调用**：运行 `scripts/aktools_get.py fund_etf_hist_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://vip.stock.finance.sina.com.cn/fund_center/index.html#jjhqetf

描述: 新浪财经-基金行情的日频率行情数据

限量: 单次返回指定基金的所有数据

输入参数

| 名称     | 类型  | 描述                                                                                                      |
|--------|-----|---------------------------------------------------------------------------------------------------------|
| symbol | str | symbol="sh510050"; 基金列表可以通过 **ak.fund_etf_category_sina(symbol="LOF基金")** 可选参数为: 封闭式基金, ETF基金, LOF基金 查询 |

输出参数

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| date   | object  | -       |
| open   | float64 | -       |
| high   | float64 | -       |
| low    | float64 | -       |
| close  | float64 | -       |
| volume | int64   | 注意单位: 手 |
