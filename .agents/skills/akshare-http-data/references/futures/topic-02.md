# 期货行情数据



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### futures_zh_spot
- **文档定位**：期货行情数据 / 内盘-实时行情数据
- **HTTP**：`GET /api/public/futures_zh_spot`
- **调用**：运行 `scripts/aktools_get.py futures_zh_spot --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://finance.sina.com.cn/futuremarket/

描述: 新浪财经-期货页面的实时行情数据

限量: 单次返回当日可以订阅的所有期货品种数据；只能获取近期合约的数据

输入参数

| 名称             | 类型  | 描述                                                    |
|----------------|-----|-------------------------------------------------------|
| subscribe_list | str | 需要订阅的合约代码; e.g., 按照示例获取                               |
| market         | str | market="CF"; market="CF": 商品期货, market="FF": 金融期货     |
| adjust         | str | adjust='0'; adjust='1': 返回合约、交易所和最小变动单位的实时数据, 返回数据会变慢 |

输出参数

| 名称                | 类型      | 描述                            |
|-------------------|---------|-------------------------------|
| symbol            | object  | 品种                            |
| time              | object  | 时间, e.g., 144050表示下午14点40分50秒 |
| open              | float64 | 开盘                            |
| high              | float64 | 高                             |
| low               | float64 | 低                             |
| current_price     | float64 | 当前价格(买价)                      |
| bid_price         | float64 | 买                             |
| ask_price         | float64 | 卖价                            |
| buy_vol           | int64   | 买量                            |
| sell_vol          | int64   | 卖量                            |
| hold              | float64 | 持仓量                           |
| volume            | int64   | 成交量                           |
| avg_price         | float64 | 均价                            |
| last_close        | float64 | 上一个交易日的收盘价                    |
| last_settle_price | float64 | 上一个交易日的结算价                    |

接口示例-单品种获取

```python
import akshare as ak

futures_zh_spot_df = ak.futures_zh_spot(symbol='V2205', market="CF", adjust='0')
print(futures_zh_spot_df)
```

### futures_zh_realtime
- **文档定位**：期货行情数据 / 内盘-实时行情数据(品种)
- **HTTP**：`GET /api/public/futures_zh_realtime`
- **调用**：运行 `scripts/aktools_get.py futures_zh_realtime --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://vip.stock.finance.sina.com.cn/quotes_service/view/qihuohangqing.html#titlePos_1

描述: 新浪财经-期货实时行情数据

限量: 单次返回指定 symbol 的数据

输入参数

| 名称     | 类型  | 描述                                                        |
|--------|-----|-----------------------------------------------------------|
| symbol | str | symbol="白糖", 品种名称；可以通过 ak.futures_symbol_mark() 获取所有品种命名表 |

输出参数

| 名称             | 类型      | 描述     |
|----------------|---------|--------|
| symbol         | object  | 合约代码   |
| exchange       | object  | 交易所    |
| name           | object  | 合约中文名称 |
| trade          | float64 | 最新价    |
| settlement     | float64 | 动态结算   |
| presettlement  | float64 | 昨日结算   |
| open           | float64 | 今开     |
| high           | float64 | 最高     |
| low            | float64 | 最低     |
| close          | float64 | 收盘     |
| bidprice1      | float64 | 买入     |
| askprice1      | float64 | 卖出     |
| bidvol1        | int64   | 买量     |
| askvol1        | int64   | 卖量     |
| volume         | int64   | 成交量    |
| position       | int64   | 持仓量    |
| ticktime       | object  | 时间     |
| tradedate      | object  | 日期     |
| preclose       | float64 | 前收盘价   |
| changepercent  | float64 | 涨跌幅    |
| bid            | float64 | -      |
| ask            | float64 | -      |
| prevsettlement | float64 | 前结算价   |

### futures_zh_minute_sina
- **文档定位**：期货行情数据 / 内盘-分时行情数据
- **HTTP**：`GET /api/public/futures_zh_minute_sina`
- **调用**：运行 `scripts/aktools_get.py futures_zh_minute_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://vip.stock.finance.sina.com.cn/quotes_service/view/qihuohangqing.html#titlePos_3

描述: 新浪财经-期货-分时数据

限量: 单次返回指定 symbol 和 period 的分时数据

输入参数

| 名称     | 类型  | 描述                                                                                              |
|--------|-----|-------------------------------------------------------------------------------------------------|
| symbol | str | symbol="IF2008"; 具体合约(期货品种符号需要大写), 可以通过调用 ak.match_main_contract(symbol="cffex") 接口获取, 或者访问网页获取 |
| period | str | period="1"; choice of {"1": "1分钟", "5": "5分钟", "15": "15分钟", "30": "30分钟", "60": "60分钟"}        |

输出参数

| 名称       | 类型      | 描述  |
|----------|---------|-----|
| datetime | object  | -   |
| open     | float64 | -   |
| high     | float64 | -   |
| low      | float64 | -   |
| close    | float64 | -   |
| volume   | int64   | -   |
| hold     | int64   | 持仓量 |

### futures_hist_em
- **文档定位**：期货行情数据 / 内盘-历史行情数据-东财
- **HTTP**：`GET /api/public/futures_hist_em`
- **调用**：运行 `scripts/aktools_get.py futures_hist_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://qhweb.eastmoney.com/quote

描述: 东方财富网-期货行情-行情数据；其中 weekly, monthly 获取的成交额和持仓量未经验证

限量: 单次返回指定 symbol 的所有数据; 只能获取当期合约;

输入参数

| 名称         | 类型  | 描述                                                                 |
|------------|-----|--------------------------------------------------------------------|
| symbol     | str | symbol="热卷主连"; 具体合约可以通过 ak.futures_hist_table_em() 获取所有当期能获取数据的合约表 |
| period     | str | period="daily"; choice of {"daily", "weekly", "monthly"}           |
| start_date | str | start_date="19900101";                                             |
| end_date   | str | end_date="20500101";                                               |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 时间  | object  | -       |
| 开盘  | int64   | -       |
| 最高  | int64   | -       |
| 最低  | int64   | -       |
| 收盘  | int64   | -       |
| 涨跌  | int64   | -       |
| 涨跌幅 | float64 | 注意单位: % |
| 成交量 | int64   | -       |
| 成交额 | int64   | -       |
| 持仓量 | int64   | -       |

### futures_zh_daily_sina
- **文档定位**：期货行情数据 / 内盘-历史行情数据-新浪
- **HTTP**：`GET /api/public/futures_zh_daily_sina`
- **调用**：运行 `scripts/aktools_get.py futures_zh_daily_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://finance.sina.com.cn/futures/quotes/V2105.shtml

描述: 新浪财经-期货-日频数据

限量: 单次返回指定 symbol 的所有日频数据; 期货连续合约为 品种代码+0，比如螺纹钢连续合约为 RB0;

输入参数

| 名称     | 类型  | 描述                                                                    |
|--------|-----|-----------------------------------------------------------------------|
| symbol | str | symbol="RB0"; 具体合约可以通过 ak.match_main_contract(symbol="shfe") 获取或者访问网页 |

输出参数

| 名称     | 类型      | 描述  |
|--------|---------|-----|
| date   | object  | -   |
| open   | float64 | 开盘价 |
| high   | float64 | 最高价 |
| low    | float64 | 最低价 |
| close  | float64 | 收盘价 |
| volume | int64   | 成交量 |
| hold   | int64   | 持仓量 |
| settle | float64 | 结算价 |

接口示例-连续

```python
import akshare as ak

futures_zh_daily_sina_df = ak.futures_zh_daily_sina(symbol="RB0")
print(futures_zh_daily_sina_df)
```

### get_futures_daily
- **文档定位**：期货行情数据 / 内盘-历史行情数据-交易所
- **HTTP**：`GET /api/public/get_futures_daily`
- **调用**：运行 `scripts/aktools_get.py get_futures_daily --param key=value`；参数以本卡的输入参数表为准。

目标地址: 各交易所网站

描述: 提供各交易所各品种的网站的历史行情数据, 其中 20040625, 20070604, 20081226, 20090119 原网页数据缺失

限量: 单次返回指定时间段指定交易所的所有期货品种历史数据

输入参数

| 名称         | 类型  | 描述                                                                      |
|------------|-----|-------------------------------------------------------------------------|
| start_date | str | start_date="20200701"                                                   |
| end_date   | str | end_date="20200716"                                                     |
| market     | str | market="DCE"; choice of {"CFFEX", "INE", "CZCE", "DCE", "SHFE", "GFEX"} |

输出参数

| 名称            | 类型    | 描述   |
|---------------|-------|------|
| symbol        | str   | 合约   |
| date          | str   | 交易日  |
| open          | float | 开盘价  |
| high          | float | 最高价  |
| low           | float | 最低价  |
| close         | str   | 收盘价  |
| volume        | str   | 成交量  |
| open_interest | str   | 持仓量  |
| turnover      | float | 成交额  |
| settle        | float | 结算价  |
| pre_settle    | float | 前结算价 |
| variety       | str   | 品种   |

### futures_settle
- **文档定位**：期货行情数据 / 内盘-结算参数数据
- **HTTP**：`GET /api/public/futures_settle`
- **调用**：运行 `scripts/aktools_get.py futures_settle --param key=value`；参数以本卡的输入参数表为准。

目标地址: 各交易所网站

描述: 提供各交易所的结算参数数据，包括保证金、手续费、涨跌停板等参数

限量: 单次返回指定日期指定交易所的结算参数数据；暂不支持 DCE

输入参数

| 名称     | 类型  | 描述                                                                 |
|--------|-----|--------------------------------------------------------------------|
| date   | str | date="20250117"; 结算参数日期，默认为当前交易日                                   |
| market | str | market="CFFEX"; choice of {"CFFEX", "INE", "CZCE", "SHFE", "GFEX"} |

输出参数

| 名称                       | 类型      | 描述       |
|--------------------------|---------|----------|
| date                     | str     | 结算日期     |
| symbol                   | str     | 合约代码     |
| variety                  | str     | 品种代码     |
| settle_price             | float64 | 结算价      |
| long_margin_ratio        | object  | 多头保证金率   |
| short_margin_ratio       | object  | 空头保证金率   |
| spec_long_margin_ratio   | float64 | 投机多头保证金率 |
| spec_short_margin_ratio  | float64 | 投机空头保证金率 |
| hedge_long_margin_ratio  | float64 | 套保多头保证金率 |
| hedge_short_margin_ratio | float64 | 套保空头保证金率 |
| trade_fee_ratio          | float64 | 交易手续费率   |
| close_today_fee_ratio    | float64 | 平今手续费率   |
| delivery_fee_ratio       | object  | 交割手续费率   |
| is_single_market         | object  | 是否单边市    |
| single_market_days       | object  | 连续单边市天数  |
| limit_ratio              | object  | 涨跌停板幅度   |
| position_limit           | object  | 持仓限额     |
| trade_limit              | object  | 交易限额     |
| rise_limit_rate          | object  | 涨停板比例    |
| fall_limit_rate          | object  | 跌停板比例    |

### futures_hq_subscribe_exchange_symbol
- **文档定位**：期货行情数据 / 外盘-品种代码表
- **HTTP**：`GET /api/public/futures_hq_subscribe_exchange_symbol`
- **调用**：运行 `scripts/aktools_get.py futures_hq_subscribe_exchange_symbol --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://finance.sina.com.cn/money/future/hf.html

描述: 新浪财经-外盘商品期货品种代码表数据

限量: 单次返回当前交易日的订阅的所有期货品种的品种代码表数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型     | 描述  |
|--------|--------|-----|
| symbol | object | -   |
| code   | object | -   |

### futures_foreign_commodity_realtime
- **文档定位**：期货行情数据 / 外盘-实时行情数据
- **HTTP**：`GET /api/public/futures_foreign_commodity_realtime`
- **调用**：运行 `scripts/aktools_get.py futures_foreign_commodity_realtime --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://finance.sina.com.cn/money/future/hf.html

描述: 新浪财经-外盘商品期货数据

限量: 单次返回当前交易日的订阅的所有期货品种的数据

输入参数

| 名称     | 类型          | 描述                                                                     |
|--------|-------------|------------------------------------------------------------------------|
| symbol | list or str | 需要订阅的合约代码; 调用 **ak.futures_hq_subscribe_exchange_symbol()** 获取字段及代码对应表 |

输出参数

| 名称    | 类型      | 描述  |
|-------|---------|-----|
| 名称    | object  | -   |
| 最新价   | float64 | -   |
| 人民币报价 | float64 | -   |
| 涨跌额   | float64 | -   |
| 涨跌幅   | float64 | -   |
| 开盘价   | float64 | -   |
| 最高价   | float64 | -   |
| 最低价   | float64 | -   |
| 昨日结算价 | float64 | -   |
| 持仓量   | float64 | -   |
| 买价    | float64 | -   |
| 卖价    | float64 | -   |
| 行情时间  | object  | -   |
| 日期    | object  | -   |

接口示例-传入字符串

```python
import akshare as ak

futures_foreign_commodity_realtime_df = ak.futures_foreign_commodity_realtime(symbol='CT,NID')
print(futures_foreign_commodity_realtime_df)
```

### futures_global_spot_em
- **文档定位**：期货行情数据 / 外盘-实时行情数据-东财
- **HTTP**：`GET /api/public/futures_global_spot_em`
- **调用**：运行 `scripts/aktools_get.py futures_global_spot_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/center/gridlist.html#futures_global

描述: 东方财富网-行情中心-期货市场-国际期货-实时行情数据

限量: 单次返回所有期货品种的实时行情数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 序号  | int64   | -       |
| 代码  | object  | -       |
| 名称  | object  | -       |
| 最新价 | float64 | -       |
| 涨跌额 | float64 | -       |
| 涨跌幅 | float64 | 注意单位: % |
| 今开  | float64 | -       |
| 最高  | float64 | -       |
| 最低  | float64 | -       |
| 昨结  | float64 | -       |
| 成交量 | int64   | -       |
| 买盘  | int64   | -       |
| 卖盘  | int64   | -       |
| 持仓量 | int64   | -       |

### futures_global_hist_em
- **文档定位**：期货行情数据 / 外盘-历史行情数据-东财
- **HTTP**：`GET /api/public/futures_global_hist_em`
- **调用**：运行 `scripts/aktools_get.py futures_global_hist_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/globalfuture/HG25J.html

描述: 东方财富网-行情中心-期货市场-国际期货-历史行情数据

限量: 单次返回指定品种的历史数据

输入参数

| 名称     | 类型  | 描述                                                                        |
|--------|-----|---------------------------------------------------------------------------|
| symbol | str | symbol="HG00Y"; 品种代码；可以通过 ak.futures_global_spot_em() 来获取所有可获取历史行情数据的品种代码 |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 日期  | object  | -       |
| 代码  | object  | -       |
| 名称  | object  | -       |
| 开盘  | float64 | -       |
| 最新价 | float64 | -       |
| 最高  | float64 | -       |
| 最低  | float64 | -       |
| 总量  | int64   | -       |
| 涨幅  | float64 | 注意单位: % |
| 持仓  | object  | -       |
| 日增  | int64   | -       |

### futures_foreign_hist
- **文档定位**：期货行情数据 / 外盘-历史行情数据-新浪
- **HTTP**：`GET /api/public/futures_foreign_hist`
- **调用**：运行 `scripts/aktools_get.py futures_foreign_hist --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://finance.sina.com.cn/futuremarket/

描述: 新浪财经-期货外盘历史行情数据

限量: 单次返回指定品种的历史数据

输入参数

| 名称     | 类型  | 描述                                                                           |
|--------|-----|------------------------------------------------------------------------------|
| symbol | str | symbol="ZSD"; 外盘期货的 **symbol** 可以通过 **ak.futures_hq_subscribe_exchange_symbol()** 获取 |

输出参数

| 名称     | 类型      | 描述  |
|--------|---------|-----|
| date   | object  | 交易日 |
| open   | float64 | 开盘价 |
| high   | float64 | 最高价 |
| low    | float64 | 最低价 |
| close  | float64 | 收盘价 |
| volume | int64   | 成交量 |

### futures_foreign_detail
- **文档定位**：期货行情数据 / 外盘-合约详情
- **HTTP**：`GET /api/public/futures_foreign_detail`
- **调用**：运行 `scripts/aktools_get.py futures_foreign_detail --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://finance.sina.com.cn/futuremarket/

描述: 新浪财经-期货外盘期货合约详情

限量: 单次返回指定品种的合约详情数据

输入参数

| 名称     | 类型  | 描述                                                                      |
|--------|-----|-------------------------------------------------------------------------|
| symbol | str | symbol="ZSD"; 外盘期货的 **symbol** 可以通过 **ak.futures_hq_subscribe_exchange_symbol()** 获取 |

输出参数

| 名称      | 类型  | 描述  |
|---------|-----|-----|
| 交易品种    | str | -   |
| 最小变动价位	 | str | -   |
| 交易时间	   | str | -   |
| 交易代码	   | str | -   |
| 交易单位	   | str | -   |
| 涨跌停板幅度	 | str | -   |
| 交割品级		  | str | -   |
| 上市交易所		 | str | -   |
| 报价单位		  | str | -   |
| 合约交割月份  | str | -   |
| 交割地点    | str | -   |
| 附加信息    | str | -   |

### futures_settlement_price_sgx
- **文档定位**：期货行情数据 / 新加坡交易所期货
- **HTTP**：`GET /api/public/futures_settlement_price_sgx`
- **调用**：运行 `scripts/aktools_get.py futures_settlement_price_sgx --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.sgx.com/zh-hans/research-education/derivatives

描述: 新加坡交易所-衍生品-历史数据-历史结算价格; 数据于下个工作日新加坡时间下午 2 点起提供

限量: 单次获取指定交易日前一日的所有期货品种的结算价数据; 只能获取过去 60 个交易日内的数据; 由于国内网络限制, 请使用代理访问

输入参数

| 名称   | 类型  | 描述                   |
|------|-----|----------------------|
| date | str | date="20231107"; 交易日 |

输出参数

| 名称     | 类型      | 描述     |
|--------|---------|--------|
| DATE   | int64   | 日期     |
| COM    | object  | 品种代码   |
| COM_MM | int64   | 品种到期月份 |
| COM_YY | int64   | 品种年份   |
| OPEN   | float64 | 开盘价    |
| HIGH   | float64 | 最高价    |
| LOW    | float64 | 最低价    |
| CLOSE  | float64 | 收盘价    |
| SETTLE | float64 | 结算价    |
| VOLUME | int64   | 交易量    |
| OINT   | int64   | 未平仓合约  |
| SERIES | object  | 合约代码   |
