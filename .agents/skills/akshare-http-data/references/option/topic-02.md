# 金融期权-三大交易所



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### option_finance_board
- **文档定位**：金融期权-三大交易所 / 行情数据
- **HTTP**：`GET /api/public/option_finance_board`
- **调用**：运行 `scripts/aktools_get.py option_finance_board --param key=value`；参数以本卡的输入参数表为准。

目标地址:

1. http://www.sse.com.cn/assortment/options/price/
2. http://www.szse.cn/market/derivative/derivative_list/index.html
3. http://www.cffex.com.cn/hs300gzqq/
4. http://www.cffex.com.cn/zz1000gzqq/

描述: 上海证券交易所、深圳证券交易所、中国金融期货交易所的金融期权行情数据

限量: 单次返回当前交易日指定合约期权行情数据

P.S. 可以通过调用 ak.option_finance_sse_underlying(symbol="华夏上证50ETF期权") 来获取上海证券交易所
金融期权标的物当日行情数据

输入参数

| 名称        | 类型  | 描述                                                |
|-----------|-----|---------------------------------------------------|
| symbol    | str | symbol="华泰柏瑞沪深300ETF期权"; 合约名称: **期权基础信息-金融期权**    |
| end_month | str | end_month="2306"; 合约到期月份: 2023 年 6 月, 只能获取近期合约的数据 |

输出参数

华夏上证 50ETF 期权

| 名称     | 类型      | 描述       |
|--------|---------|----------|
| 日期     | object  | 日期时间     |
| 合约交易代码 | object  |          |
| 当前价    | float64 |          |
| 涨跌幅    | float64 |          |
| 前结价    | float64 |          |
| 行权价    | float64 |          |
| 数量     | int64   | 当前总的合约数量 |

### option_risk_indicator_sse
- **文档定位**：金融期权-三大交易所 / 风险指标-上海证券交易所
- **HTTP**：`GET /api/public/option_risk_indicator_sse`
- **调用**：运行 `scripts/aktools_get.py option_risk_indicator_sse --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.sse.com.cn/assortment/options/risk/

描述: 上海证券交易所-产品-股票期权-期权风险指标数据

限量: 单次返回指定 date 的数据

输入参数

| 名称   | 类型  | 描述                                  |
|------|-----|-------------------------------------|
| date | str | date="20240626"; 交易日; 从 20150209 开始 |

输出参数

| 名称              | 类型      | 描述  |
|-----------------|---------|-----|
| TRADE_DATE      | object  | -   |
| SECURITY_ID     | object  | -   |
| CONTRACT_ID     | object  | -   |
| CONTRACT_SYMBOL | object  | -   |
| DELTA_VALUE     | float64 | -   |
| THETA_VALUE     | float64 | -   |
| GAMMA_VALUE     | float64 | -   |
| VEGA_VALUE      | float64 | -   |
| RHO_VALUE       | float64 | -   |
| IMPLC_VOLATLTY  | float64 | -   |

### option_current_day_sse
- **文档定位**：金融期权-三大交易所 / 当日合约-上海证券交易所
- **HTTP**：`GET /api/public/option_current_day_sse`
- **调用**：运行 `scripts/aktools_get.py option_current_day_sse --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.sse.com.cn/assortment/options/disclo/preinfo/

描述: 上海证券交易所-产品-股票期权-信息披露-当日合约

限量: 单次返回所有数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称       | 类型     | 描述 |
|----------|--------|----|
| 合约编码     | object | -  |
| 合约交易代码   | object | -  |
| 合约简称     | object | -  |
| 标的券名称及代码 | object | -  |
| 类型       | object | -  |
| 行权价      | object | -  |
| 合约单位     | object | -  |
| 期权行权日    | object | -  |
| 行权交收日    | object | -  |
| 到期日      | object | -  |
| 开始日期     | object | -  |

### option_current_day_szse
- **文档定位**：金融期权-三大交易所 / 当日合约-深圳证券交易所
- **HTTP**：`GET /api/public/option_current_day_szse`
- **调用**：运行 `scripts/aktools_get.py option_current_day_szse --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.sse.org.cn/option/quotation/contract/daycontract/index.html

描述: 深圳证券交易所-期权子网-行情数据-当日合约

限量: 单次返回所有数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称           | 类型      | 描述 |
|--------------|---------|----|
| 序号           | int64   | -  |
| 合约编码         | int64   | -  |
| 合约代码         | object  | -  |
| 合约简称         | object  | -  |
| 标的证券简称(代码)   | object  | -  |
| 合约类型         | object  | -  |
| 行权价          | float64 | -  |
| 合约单位         | int64   | -  |
| 最后交易日        | object  | -  |
| 行权日          | object  | -  |
| 到期日          | object  | -  |
| 交收日          | object  | -  |
| 新挂           | object  | -  |
| 涨停价格         | float64 | -  |
| 跌停价格         | float64 | -  |
| 前结算价         | float64 | -  |
| 合约调整         | object  | -  |
| 停牌           | object  | -  |
| 合约总持仓        | float64 | -  |
| 挂牌原因         | object  | -  |
| 原合约代码        | object  | -  |
| 原合约简称        | object  | -  |
| 原行权价格        | float64 | -  |
| 原合约单位        | int64   | -  |
| 合约到期剩余交易天数   | int64   | -  |
| 合约到期剩余自然天数   | int64   | -  |
| 下次合约调整剩余交易天数 | int64   | -  |
| 下次合约调整剩余自然天数 | int64   | -  |
| 交易日期         | object  | -  |

### option_daily_stats_sse
- **文档定位**：金融期权-三大交易所 / 每日统计-上海证券交易所
- **HTTP**：`GET /api/public/option_daily_stats_sse`
- **调用**：运行 `scripts/aktools_get.py option_daily_stats_sse --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.sse.com.cn/assortment/options/date/

描述: 上海证券交易所-产品-股票期权-每日统计

限量: 单次返回指定 date 的数据

输入参数

| 名称   | 类型  | 描述                   |
|------|-----|----------------------|
| date | str | date="20240626"; 交易日 |

输出参数

| 名称       | 类型           | 描述       |
|----------|--------------|----------|
| 合约标的代码   | object       | -        |
| 合约标的名称   | object       | -        |
| 合约数量     | int64        | -        |
| 总成交额     | int64        | 注意单位: 万元 |
| 总成交量     | int64        | 注意单位: 张  |
| 认购成交量    | int64        | 注意单位: 张  |
| 认沽成交量    | int64        | 注意单位: 张  |
| 认沽/认购    | float64      | 注意单位: %  |
| 未平仓合约总数  | int64        | -        |
| 未平仓认购合约数 | floaint64t64 | -        |
| 未平仓认沽合约数 | int64        | -        |

### option_daily_stats_szse
- **文档定位**：金融期权-三大交易所 / 每日统计-深圳证券交易所
- **HTTP**：`GET /api/public/option_daily_stats_szse`
- **调用**：运行 `scripts/aktools_get.py option_daily_stats_szse --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://investor.szse.cn/market/option/day/index.html

描述: 深圳证券交易所-市场数据-期权数据-日度概况

限量: 单次返回指定 date 的数据

输入参数

| 名称   | 类型  | 描述                   |
|------|-----|----------------------|
| date | str | date="20240626"; 交易日 |

输出参数

| 名称       | 类型      | 描述      |
|----------|---------|---------|
| 合约标的代码   | object  | -       |
| 合约标的名称   | object  | -       |
| 成交量      | int64   | 注意单位: 张 |
| 认购成交量    | int64   | 注意单位: 张 |
| 认沽成交量    | int64   | 注意单位: 张 |
| 认沽/认购持仓比 | float64 | 注意单位: % |
| 未平仓合约总数  | int64   | 注意单位: 张 |
| 未平仓认购合约数 | int64   | 注意单位: 张 |
| 未平仓认沽合约数 | int64   | 注意单位: 张 |
| 交易日      | object  | -       |
