# 金融期权-新浪



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### option_cffex_sz50_list_sina
- **文档定位**：金融期权-新浪 / 中金所 / 上证50指数列表
- **HTTP**：`GET /api/public/option_cffex_sz50_list_sina`
- **调用**：运行 `scripts/aktools_get.py option_cffex_sz50_list_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://stock.finance.sina.com.cn/futures/view/optionsCffexDP.php/ho/cffex

描述: 中金所-上证50指数-所有合约, 返回的第一个合约为主力合约

限量: 单次返回所有合约

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

### option_cffex_hs300_list_sina
- **文档定位**：金融期权-新浪 / 中金所 / 沪深300指数列表
- **HTTP**：`GET /api/public/option_cffex_hs300_list_sina`
- **调用**：运行 `scripts/aktools_get.py option_cffex_hs300_list_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://stock.finance.sina.com.cn/futures/view/optionsCffexDP.php

描述: 中金所-沪深300指数-所有合约, 返回的第一个合约为主力合约

限量: 单次返回所有合约

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

### option_cffex_zz1000_list_sina
- **文档定位**：金融期权-新浪 / 中金所 / 中证1000指数列表
- **HTTP**：`GET /api/public/option_cffex_zz1000_list_sina`
- **调用**：运行 `scripts/aktools_get.py option_cffex_zz1000_list_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://stock.finance.sina.com.cn/futures/view/optionsCffexDP.php

描述: 中金所-中证1000指数-所有合约, 返回的第一个合约为主力合约

限量: 单次返回所有合约

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

### option_cffex_sz50_spot_sina
- **文档定位**：金融期权-新浪 / 中金所 / 实时行情-上证50指数
- **HTTP**：`GET /api/public/option_cffex_sz50_spot_sina`
- **调用**：运行 `scripts/aktools_get.py option_cffex_sz50_spot_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://stock.finance.sina.com.cn/futures/view/optionsCffexDP.php/ho/cffex

描述: 新浪财经-中金所-上证50指数-指定合约-实时行情

限量: 单次返回指定合约的实时行情

输入参数

| 名称     | 类型  | 描述              |
|--------|-----|-----------------|
| symbol | str | symbol="ho2303" |

输出参数

| 名称       | 类型      | 描述     |
|----------|---------|--------|
| 看涨合约-买量  | int64   | -      |
| 看涨合约-买价  | float64 | -      |
| 看涨合约-最新价 | float64 | -      |
| 看涨合约-卖价  | float   | -      |
| 看涨合约-卖量  | int64   | -      |
| 看涨合约-持仓量 | int64   | -      |
| 看涨合约-涨跌  | float64 | -      |
| 行权价      | int64   | -      |
| 看涨合约-标识  | object  | 看涨合约代码 |
| 看跌合约-买量  | int64   | -      |
| 看跌合约-买价  | float64 | -      |
| 看跌合约-最新价 | float64 | -      |
| 看跌合约-卖价  | float64 | -      |
| 看跌合约-卖量  | int64   | -      |
| 看跌合约-持仓量 | int64   | -      |
| 看跌合约-涨跌  | float64 | -      |
| 看跌合约-标识  | object  | 看跌合约代码 |

### option_cffex_hs300_spot_sina
- **文档定位**：金融期权-新浪 / 中金所 / 实时行情-沪深300指数
- **HTTP**：`GET /api/public/option_cffex_hs300_spot_sina`
- **调用**：运行 `scripts/aktools_get.py option_cffex_hs300_spot_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://stock.finance.sina.com.cn/futures/view/optionsCffexDP.php

描述: 新浪财经-中金所-沪深300指数-指定合约-实时行情

限量: 单次返回指定合约的实时行情

输入参数

| 名称     | 类型  | 描述              |
|--------|-----|-----------------|
| symbol | str | symbol="io2104" |

输出参数

| 名称       | 类型      | 描述     |
|----------|---------|--------|
| 看涨合约-买量  | int64   | -      |
| 看涨合约-买价  | float64 | -      |
| 看涨合约-最新价 | float64 | -      |
| 看涨合约-卖价  | float   | -      |
| 看涨合约-卖量  | int64   | -      |
| 看涨合约-持仓量 | int64   | -      |
| 看涨合约-涨跌  | float64 | -      |
| 行权价      | int64   | -      |
| 看涨合约-标识  | object  | 看涨合约代码 |
| 看跌合约-买量  | int64   | -      |
| 看跌合约-买价  | float64 | -      |
| 看跌合约-最新价 | float64 | -      |
| 看跌合约-卖价  | float64 | -      |
| 看跌合约-卖量  | int64   | -      |
| 看跌合约-持仓量 | int64   | -      |
| 看跌合约-涨跌  | float64 | -      |
| 看跌合约-标识  | object  | 看跌合约代码 |

### option_cffex_zz1000_spot_sina
- **文档定位**：金融期权-新浪 / 中金所 / 实时行情-中证1000指数
- **HTTP**：`GET /api/public/option_cffex_zz1000_spot_sina`
- **调用**：运行 `scripts/aktools_get.py option_cffex_zz1000_spot_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://stock.finance.sina.com.cn/futures/view/optionsCffexDP.php

描述: 新浪财经-中金所-中证1000指数-指定合约-实时行情

限量: 单次返回指定合约的实时行情

输入参数

| 名称     | 类型  | 描述              |
|--------|-----|-----------------|
| symbol | str | symbol="mo2208" |

输出参数

| 名称       | 类型      | 描述     |
|----------|---------|--------|
| 看涨合约-买量  | int64   | -      |
| 看涨合约-买价  | float64 | -      |
| 看涨合约-最新价 | float64 | -      |
| 看涨合约-卖价  | float   | -      |
| 看涨合约-卖量  | int64   | -      |
| 看涨合约-持仓量 | int64   | -      |
| 看涨合约-涨跌  | float64 | -      |
| 行权价      | int64   | -      |
| 看涨合约-标识  | object  | 看涨合约代码 |
| 看跌合约-买量  | int64   | -      |
| 看跌合约-买价  | float64 | -      |
| 看跌合约-最新价 | float64 | -      |
| 看跌合约-卖价  | float64 | -      |
| 看跌合约-卖量  | int64   | -      |
| 看跌合约-持仓量 | int64   | -      |
| 看跌合约-涨跌  | float64 | -      |
| 看跌合约-标识  | object  | 看跌合约代码 |

### option_cffex_sz50_daily_sina
- **文档定位**：金融期权-新浪 / 中金所 / 日频行情-上证50指数
- **HTTP**：`GET /api/public/option_cffex_sz50_daily_sina`
- **调用**：运行 `scripts/aktools_get.py option_cffex_sz50_daily_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://stock.finance.sina.com.cn/futures/view/optionsCffexDP.php/ho/cffex

描述: 中金所-上证50指数-指定合约-日频行情

限量: 单次返回指定合约的日频行情

输入参数

| 名称     | 类型  | 描述                                                                                         |
|--------|-----|--------------------------------------------------------------------------------------------|
| symbol | str | symbol="ho2303P2350"; 具体合约代码(包括看涨和看跌标识), 可以通过 ak.option_cffex_sz50_spot_sina 中的 call-标识 获取 |

输出参数

| 名称     | 类型      | 描述  |
|--------|---------|-----|
| date   | object  | -   |
| open   | float64 | -   |
| high   | float64 | -   |
| low    | float64 | -   |
| close  | float64 | -   |
| volume | int64   | -   |

### option_cffex_hs300_daily_sina
- **文档定位**：金融期权-新浪 / 中金所 / 日频行情-沪深300指数
- **HTTP**：`GET /api/public/option_cffex_hs300_daily_sina`
- **调用**：运行 `scripts/aktools_get.py option_cffex_hs300_daily_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://stock.finance.sina.com.cn/futures/view/optionsCffexDP.php

描述: 中金所-沪深300指数-指定合约-日频行情

限量: 单次返回指定合约的日频行情

输入参数

| 名称     | 类型  | 描述                                                                                          |
|--------|-----|---------------------------------------------------------------------------------------------|
| symbol | str | symbol="io2202P4350"; 具体合约代码(包括看涨和看跌标识), 可以通过 ak.option_cffex_hs300_spot_sina 中的 call-标识 获取 |

输出参数

| 名称     | 类型      | 描述  |
|--------|---------|-----|
| date   | object  | -   |
| open   | float64 | -   |
| high   | float64 | -   |
| low    | float64 | -   |
| close  | float64 | -   |
| volume | int64   | -   |

### option_cffex_zz1000_daily_sina
- **文档定位**：金融期权-新浪 / 中金所 / 日频行情-中证1000指数
- **HTTP**：`GET /api/public/option_cffex_zz1000_daily_sina`
- **调用**：运行 `scripts/aktools_get.py option_cffex_zz1000_daily_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://stock.finance.sina.com.cn/futures/view/optionsCffexDP.php

描述: 中金所-中证1000指数-指定合约-日频行情

限量: 单次返回指定合约的日频行情

输入参数

| 名称     | 类型  | 描述                                                                                           |
|--------|-----|----------------------------------------------------------------------------------------------|
| symbol | str | symbol="mo2208P6200"; 具体合约代码(包括看涨和看跌标识), 可以通过 ak.option_cffex_zz1000_spot_sina 中的 call-标识 获取 |

输出参数

| 名称     | 类型      | 描述  |
|--------|---------|-----|
| date   | object  | -   |
| open   | float64 | -   |
| high   | float64 | -   |
| low    | float64 | -   |
| close  | float64 | -   |
| volume | int64   | -   |

### option_sse_list_sina
- **文档定位**：金融期权-新浪 / 上交所 / 合约到期月份列表
- **HTTP**：`GET /api/public/option_sse_list_sina`
- **调用**：运行 `scripts/aktools_get.py option_sse_list_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://stock.finance.sina.com.cn/futures/view/optionsCffexDP.php

描述: 获取期权-上交所-50ETF-合约到期月份列表

限量: 单次返回指定品种的到期月份列表

输入参数

| 名称       | 类型  | 描述                                  |
|----------|-----|-------------------------------------|
| symbol   | str | symbol="50ETF"; "50ETF" or "300ETF" |
| exchange | str | exchange="null"                     |

输出参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

### option_sse_expire_day_sina
- **文档定位**：金融期权-新浪 / 上交所 / 合约到期月份列表
- **HTTP**：`GET /api/public/option_sse_expire_day_sina`
- **调用**：运行 `scripts/aktools_get.py option_sse_expire_day_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://stock.finance.sina.com.cn/futures/view/optionsCffexDP.php

描述: 获取指定到期月份指定品种的剩余到期时间

限量: 单次返回指定品种的品种的剩余到期时间

输入参数

| 名称         | 类型  | 描述                                  |
|------------|-----|-------------------------------------|
| trade_date | str | trade_date="202002";                |
| symbol     | str | symbol="50ETF"; "50ETF" or "300ETF" |
| exchange   | str | exchange="null"                     |

输出参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

### option_sse_codes_sina
- **文档定位**：金融期权-新浪 / 上交所 / 所有合约的代码
- **HTTP**：`GET /api/public/option_sse_codes_sina`
- **调用**：运行 `scripts/aktools_get.py option_sse_codes_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://stock.finance.sina.com.cn/futures/view/optionsCffexDP.php

描述: 新浪期权-看涨看跌合约合约的代码

限量: 单次返回指定 symbol 合约的代码

输入参数

| 名称         | 类型  | 描述                                        |
|------------|-----|-------------------------------------------|
| symbol     | str | symbol="看涨期权"; choice of {"看涨期权", "看跌期权"} |
| trade_date | str | trade_date="202002";                      |
| underlying | str | underlying="510300"                       |

输出参数

| 名称   | 类型     | 描述  |
|------|--------|-----|
| 序号   | int64  | -   |
| 期权代码 | object | -   |

### option_sse_spot_price_sina
- **文档定位**：金融期权-新浪 / 上交所 / 实时数据
- **HTTP**：`GET /api/public/option_sse_spot_price_sina`
- **调用**：运行 `scripts/aktools_get.py option_sse_spot_price_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://stock.finance.sina.com.cn/futures/view/optionsCffexDP.php

描述: 期权实时数据

限量: 单次返回期权实时数据

输入参数

| 名称     | 类型  | 描述                |
|--------|-----|-------------------|
| symbol | str | symbol="10002273" |

输出参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| 字段  | str | -   |
| 值   | str | -   |

### option_sse_underlying_spot_price_sina
- **文档定位**：金融期权-新浪 / 上交所 / 期权标的物的实时数据
- **HTTP**：`GET /api/public/option_sse_underlying_spot_price_sina`
- **调用**：运行 `scripts/aktools_get.py option_sse_underlying_spot_price_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://stock.finance.sina.com.cn/futures/view/optionsCffexDP.php

描述: 获取期权标的物的实时数据

限量: 单次返回期权标的物的实时数据

输入参数

| 名称     | 类型  | 描述                |
|--------|-----|-------------------|
| symbol | str | symbol="sh510300" |

输出参数

| 名称 | 类型     | 描述 |
|----|--------|----|
| 字段 | object | -  |
| 值  | object | -  |

### option_sse_greeks_sina
- **文档定位**：金融期权-新浪 / 上交所 / 期权希腊字母信息表
- **HTTP**：`GET /api/public/option_sse_greeks_sina`
- **调用**：运行 `scripts/aktools_get.py option_sse_greeks_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://stock.finance.sina.com.cn/futures/view/optionsCffexDP.php

描述: 新浪财经-期权希腊字母信息表

限量: 单次返回当前交易日的期权希腊字母信息表

输入参数

| 名称     | 类型  | 描述                |
|--------|-----|-------------------|
| symbol | str | symbol="10002273" |

输出参数

| 名称  | 类型     | 描述  |
|-----|--------|-----|
| 字段  | object | -   |
| 值   | object | -   |

### option_sse_minute_sina
- **文档定位**：金融期权-新浪 / 上交所 / 期权行情分钟数据
- **HTTP**：`GET /api/public/option_sse_minute_sina`
- **调用**：运行 `scripts/aktools_get.py option_sse_minute_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://stock.finance.sina.com.cn/futures/view/optionsCffexDP.php

描述: 期权行情分钟数据, 只能返还当天的分钟数据

限量: 单次返回期权行情分钟数据

输入参数

| 名称     | 类型  | 描述                |
|--------|-----|-------------------|
| symbol | str | symbol="10002273" |

输出参数

| 名称  | 类型      | 描述    |
|-----|---------|-------|
| 日期  | object  | 当前交易日 |
| 时间  | object  | -     |
| 价格  | float64 | -     |
| 成交  | int64   | -     |
| 持仓  | int64   | -     |
| 均价  | float64 | -     |

### option_sse_daily_sina
- **文档定位**：金融期权-新浪 / 上交所 / 期权行情日数据
- **HTTP**：`GET /api/public/option_sse_daily_sina`
- **调用**：运行 `scripts/aktools_get.py option_sse_daily_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://stock.finance.sina.com.cn/futures/view/optionsCffexDP.php

描述: 期权行情日数据

限量: 单次返回期权行情日数据

输入参数

| 名称     | 类型  | 描述                |
|--------|-----|-------------------|
| symbol | str | symbol="10002273" |

输出参数

| 名称  | 类型      | 描述  |
|-----|---------|-----|
| 时间  | object  | -   |
| 开盘  | float64 | -   |
| 最高  | float64 | -   |
| 最低  | float64 | -   |
| 收盘  | float64 | -   |
| 成交  | int64   | -   |

### option_finance_minute_sina
- **文档定位**：金融期权-新浪 / 上交所 / 期权行情分时数据-新浪
- **HTTP**：`GET /api/public/option_finance_minute_sina`
- **调用**：运行 `scripts/aktools_get.py option_finance_minute_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://stock.finance.sina.com.cn/option/quotes.html

描述: 新浪财经-金融期权-股票期权分时行情数据

限量: 单次返回指定期权的分时行情数据

输入参数

| 名称     | 类型  | 描述                                                      |
|--------|-----|---------------------------------------------------------|
| symbol | str | symbol="10002530"; 通过 **ak.option_sse_codes_sina()** 获取 |

输出参数

| 名称            | 类型      | 描述  |
|---------------|---------|-----|
| date          | object  | -   |
| time          | object  | -   |
| price         | float64 | -   |
| average_price | float64 | -   |
| volume        | int64   | -   |

### option_minute_em
- **文档定位**：金融期权-新浪 / 上交所 / 期权行情分时数据-东财
- **HTTP**：`GET /api/public/option_minute_em`
- **调用**：运行 `scripts/aktools_get.py option_minute_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://wap.eastmoney.com/quote/stock/151.cu2404P61000.html

描述: 东方财富网-行情中心-期权市场-分时行情

限量: 单次返回指定 symbol 的分时行情数据; 只能获取近期合约的数据

输入参数

| 名称     | 类型  | 描述                                                       |
|--------|-----|----------------------------------------------------------|
| symbol | str | symbol="MO2402-C-5400"; 通过 **ak.option_current_em()** 获取 |

输出参数

| 名称     | 类型     | 描述      |
|--------|--------|---------|
| time   | object | -       |
| close  | int64  | -       |
| high   | int64  | -       |
| low    | int64  | -       |
| volume | int64  | 注意单位: 手 |
| amount | int64  | -       |
