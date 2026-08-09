# 其他细分主题



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### fx_spot_quote
- **文档定位**：人民币外汇即期报价
- **HTTP**：`GET /api/public/fx_spot_quote`
- **调用**：运行 `scripts/aktools_get.py fx_spot_quote --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.chinamoney.com.cn/chinese/mkdatapfx/

描述: 人民币外汇即期报价

限量: 单次返回实时行情数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

人民币外汇即期报价

| 名称  | 类型      | 描述  |
|-----|---------|-----|
| 货币对 | object  |     |
| 买报价 | float64 |     |
| 卖报价 | float64 |     |

**注：本行情为询价报价行情(美元为ODM), 实时更新**

### fx_swap_quote
- **文档定位**：人民币外汇远掉报价
- **HTTP**：`GET /api/public/fx_swap_quote`
- **调用**：运行 `scripts/aktools_get.py fx_swap_quote --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.chinamoney.com.cn/chinese/mkdatapfx/

描述: 人民币外汇远掉报价

限量: 单次返回实时行情数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

人民币外汇远掉报价

| 名称  | 类型     | 描述                  |
|-----|--------|---------------------|
| 货币对 | object | e.g., "USD/CNY"     |
| 1周  | object | e.g., "11.50/12.00" |
| 1月  | object |                     |
| 3月  | object |                     |
| 6月  | object |                     |
| 9月  | object |                     |
| 1年  | object |                     |

**注：本行情为询价报价行情(美元为ODM), 实时更新**

### currency_boc_safe
- **文档定位**：人民币汇率中间价
- **HTTP**：`GET /api/public/currency_boc_safe`
- **调用**：运行 `scripts/aktools_get.py currency_boc_safe --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.safe.gov.cn/safe/rmbhlzjj/index.html

描述: 外汇管理局-人民币汇率中间价

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述  |
|------|---------|-----|
| 日期   | object  | -   |
| 美元   | float64 | -   |
| 欧元   | float64 | -   |
| 日元   | float64 | -   |
| 港元   | float64 | -   |
| 英镑   | float64 | -   |
| 林吉特  | float64 | -   |
| 卢布   | float64 | -   |
| 澳元   | float64 | -   |
| 加元   | float64 | -   |
| 新西兰元 | float64 | -   |
| 新加坡元 | float64 | -   |
| 瑞士法郎 | float64 | -   |
| 兰特   | float64 | -   |
| 韩元   | float64 | -   |
| 迪拉姆  | float64 | -   |
| 里亚尔  | float64 | -   |
| 福林   | float64 | -   |
| 兹罗提  | float64 | -   |
| 丹麦克朗 | float64 | -   |
| 瑞典克朗 | float64 | -   |
| 挪威克朗 | float64 | -   |
| 里拉   | float64 | -   |
| 比索   | float64 | -   |
| 泰铢   | float64 | -   |

P.S. 人民币对马来西亚林吉特、俄罗斯卢布、南非兰特、韩元、阿联酋迪拉姆、沙特里亚尔、匈牙利福林、波兰兹罗提、丹麦克朗、瑞典克朗、挪威克朗、土耳其里拉、墨西哥比索、泰铢汇率中间价采取间接标价法，即100人民币折合多少外币。人民币对其它10种货币汇率中间价仍采取直接标价法，即100外币折合多少人民币。

### currency_boc_sina
- **文档定位**：人民币牌价数据
- **HTTP**：`GET /api/public/currency_boc_sina`
- **调用**：运行 `scripts/aktools_get.py currency_boc_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://biz.finance.sina.com.cn/forex/forex.php?startdate=2012-01-01&enddate=2021-06-14&money_code=EUR&type=0

描述: 新浪财经-中行人民币牌价历史数据

限量: 单次返回指定日期的所有历史数据

输入参数

| 名称         | 类型  | 描述                                                                                                                                                   |
|------------|-----|------------------------------------------------------------------------------------------------------------------------------------------------------|
| symbol     | str | symbol="美元"; choice of {'美元', '英镑', '欧元', '澳门元', '泰国铢', '菲律宾比索', '港币', '瑞士法郎', '新加坡元', '瑞典克朗', '丹麦克朗', '挪威克朗', '日元', '加拿大元', '澳大利亚元', '新西兰元', '韩国元'} |
| start_date | str | start_date="20230304"; 开始日期和结束日期之间的间隔要超过 6 个月                                                                                                        |
| end_date   | str | end_date="20231110"; 开始日期和结束日期之间的间隔要超过 6 个月                                                                                                          |

输出参数

| 名称        | 类型      | 描述      |
|-----------|---------|---------|
| 日期        | object  | -       |
| 中行汇买价     | float64 | 注意单位: 元 |
| 中行钞买价     | float64 | 注意单位: 元 |
| 中行钞卖价/汇卖价 | float64 | 注意单位: 元 |
| 央行中间价     | float64 | 注意单位: 元 |

### forex_hist_em
- **文档定位**：历史行情数据
- **HTTP**：`GET /api/public/forex_hist_em`
- **调用**：运行 `scripts/aktools_get.py forex_hist_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/cnyrate/EURCNYC.html

描述: 东方财富网-行情中心-外汇市场-所有汇率-历史行情数据

限量: 单次返回指定 symbol 的历史行情数据

输入参数

| 名称     | 类型  | 描述                                                                |
|--------|-----|-------------------------------------------------------------------|
| symbol | str | symbol="USDCNH"; 品种代码；可以通过 ak.forex_spot_em() 来获取所有可获取历史行情数据的品种代码 |

输出参数

| 名称  | 类型      | 描述 |
|-----|---------|----|
| 序号  | int64   | -  |
| 代码  | object  | -  |
| 名称  | object  | -  |
| 最新价 | float64 | -  |
| 涨跌额 | float64 | -  |
| 涨跌幅 | float64 | -  |
| 今开  | float64 | -  |
| 最高  | float64 | -  |
| 最低  | float64 | -  |
| 昨收  | float64 | -  |

### fx_pair_quote
- **文档定位**：外币对即期报价
- **HTTP**：`GET /api/public/fx_pair_quote`
- **调用**：运行 `scripts/aktools_get.py fx_pair_quote --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.chinamoney.com.cn/chinese/mkdatapfx/

描述: 外币对即期报价

限量: 单次返回当前时点最近更新的即时数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称  | 类型      | 描述              |
|-----|---------|-----------------|
| 货币对 | object  | e.g., "AUD/USD" |
| 买报价 | float64 | e.g., "0.68460" |
| 卖报价 | float64 | e.g., "0.68461" |

**注：本行情为询价报价行情(美元为ODM), 实时更新**

### fx_c_swap_cm
- **文档定位**：外汇掉期 C-Swap 定盘曲线
- **HTTP**：`GET /api/public/fx_c_swap_cm`
- **调用**：运行 `scripts/aktools_get.py fx_c_swap_cm --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.chinamoney.org.cn/chinese/bkcurvfsw

描述: 中国外汇交易中心暨全国银行间同业拆借中心-基准-外汇市场-外汇掉期曲线-外汇掉期 C-Swap 定盘曲线

限量: 单次返回所有行情数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称        | 类型      | 描述 |
|-----------|---------|----|
| 日期时间      | object  | -  |
| 期限品种      | object  | -  |
| 掉期点(Pips) | float64 | -  |
| 掉期点数据源    | object  |    |
| 全价汇率      | float64 |    |

### fx_quote_baidu
- **文档定位**：外汇行情报价
- **HTTP**：`GET /api/public/fx_quote_baidu`
- **调用**：运行 `scripts/aktools_get.py fx_quote_baidu --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://gushitong.baidu.com/top/foreign-rmb

描述: 百度股市通-外汇-行情榜单

限量: 单次返回指定 symbol 当前时点的行情报价

输入参数

| 名称     | 类型  | 描述                                   |
|--------|-----|--------------------------------------|
| symbol | str | symbol="人民币"; choice of {"人民币", 美元"} |
| token  | str | 目标网站复制 acs-token 后传入                 |

输出参数

| 名称  | 类型      | 描述  |
|-----|---------|-----|
| 代码  | object  | -   |
| 名称  | object  | -   |
| 最新价 | float64 | -   |
| 涨跌额 | float64 | -   |
| 涨跌幅 | float64 | -   |

### forex_spot_em
- **文档定位**：实时行情数据
- **HTTP**：`GET /api/public/forex_spot_em`
- **调用**：运行 `scripts/aktools_get.py forex_spot_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/center/gridlist.html#forex_all

描述: 东方财富网-行情中心-外汇市场-所有汇率-实时行情数据

限量: 单次返回所有实时行情数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称  | 类型      | 描述 |
|-----|---------|----|
| 序号  | int64   | -  |
| 代码  | object  | -  |
| 名称  | object  | -  |
| 最新价 | float64 | -  |
| 涨跌额 | float64 | -  |
| 涨跌幅 | float64 | -  |
| 今开  | float64 | -  |
| 最高  | float64 | -  |
| 最低  | float64 | -  |
| 昨收  | float64 | -  |

### currency_pair_map
- **文档定位**：指定币种的所有货币对
- **HTTP**：`GET /api/public/currency_pair_map`
- **调用**：运行 `scripts/aktools_get.py currency_pair_map --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://cn.investing.com/currencies/cny-jmd

描述: 指定币种的所有能够获取到的货币对信息，历史数据可以调用 **ak.currency_history()** 获取

限量: 单次返回指定币种的所有能获取数据的货币对

输入参数

| 名称     | 类型  | 描述                                                                                       |
|--------|-----|------------------------------------------------------------------------------------------|
| symbol | str | symbol="人民币"; 此处提供中文的币种名称, 可以访问[网页](https://cn.investing.com/currencies/cny-jmd) 的页面下方查看 |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| name | object  | 货币对中文简称 |
| code | float64 | 货币对代码   |

### macro_fx_sentiment
- **文档定位**：货币对-投机情绪报告
- **HTTP**：`GET /api/public/macro_fx_sentiment`
- **调用**：运行 `scripts/aktools_get.py macro_fx_sentiment --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_ssi_trends

描述: 货币对-投机情绪报告

限量: 单次返回指定日期所有品种的数据(所指定的日期必须在当前交易日之前的30个交易日内)

输入参数

| 名称         | 类型  | 描述                                                |
|------------|-----|---------------------------------------------------|
| start_date | str | start_date="2020-04-07"; 所指定的日期必须在当前交易日之前的30个交易日内 |
| end_date   | str | end_date="2020-04-07"; 与 start_date 一致            |

输出参数

| 名称     | 类型      | 描述     |
|--------|---------|--------|
| date   | object  | 间隔10分钟 |
| AUDJPY | float64 | -      |
| AUDUSD | float64 | -      |
| EURAUD | float64 | -      |
| EURJPY | float64 | -      |
| EURUSD | float64 | -      |
| GBPJPY | float64 | -      |
| GBPUSD | float64 | -      |
| NZDUSD | float64 | -      |
| USDCAD | float64 | -      |
| USDCHF | float64 | -      |
| USDJPY | float64 | -      |
| USDX   | float64 | -      |
| XAUUSD | float64 | -      |
