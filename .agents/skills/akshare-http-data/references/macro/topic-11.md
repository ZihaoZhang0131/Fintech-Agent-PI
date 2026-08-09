# 重要机构



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### macro_cons_gold
- **文档定位**：重要机构 / 全球最大黄金 ETF—SPDR Gold Trust 持仓报告
- **HTTP**：`GET /api/public/macro_cons_gold`
- **调用**：运行 `scripts/aktools_get.py macro_cons_gold --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_etf_gold

描述: 全球最大黄金 ETF—SPDR Gold Trust 持仓报告, 数据区间从 20041119-至今

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述       |
|-------|---------|----------|
| 商品    | object  | -        |
| 日期    | object  | -        |
| 总库存   | float64 | 注意单位: 吨  |
| 增持/减持 | float64 | 注意单位: 吨  |
| 总价值   | float64 | 注意单位: 美元 |

### macro_cons_silver
- **文档定位**：重要机构 / 全球最大白银ETF--iShares Silver Trust持仓报告
- **HTTP**：`GET /api/public/macro_cons_silver`
- **调用**：运行 `scripts/aktools_get.py macro_cons_silver --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_etf_sliver

描述: 全球最大白银 ETF--iShares Silver Trust 持仓报告, 数据区间从 20041202-至今

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述       |
|-------|---------|----------|
| 商品    | object  | -        |
| 日期    | object  | -        |
| 总库存   | float64 | 注意单位: 吨  |
| 增持/减持 | float64 | 注意单位: 吨  |
| 总价值   | float64 | 注意单位: 美元 |

### macro_cons_opec_month
- **文档定位**：重要机构 / 欧佩克报告
- **HTTP**：`GET /api/public/macro_cons_opec_month`
- **调用**：运行 `scripts/aktools_get.py macro_cons_opec_month --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_opec_report

描述: 欧佩克报告, 数据区间从 20170118-至今

限量: 单次返回所有历史数据, 以网页数据为准.

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述  |
|-------|---------|-----|
| 日期    | object  | -   |
| 阿尔及利亚 | float64 | -   |
| 安哥拉   | float64 | -   |
| 厄瓜多尔  | float64 | -   |
| 加蓬    | float64 | -   |
| 伊朗    | float64 | -   |
| 伊拉克   | float64 | -   |
| 科威特   | float64 | -   |
| 利比亚   | float64 | -   |
| 尼日利亚  | float64 | -   |
| 沙特    | float64 | -   |
| 阿联酋   | float64 | -   |
| 委内瑞拉  | float64 | -   |
| 欧佩克产量 | float64 | -   |

### macro_euro_lme_holding
- **文档定位**：重要机构 / 伦敦金属交易所 / 持仓报告
- **HTTP**：`GET /api/public/macro_euro_lme_holding`
- **调用**：运行 `scripts/aktools_get.py macro_euro_lme_holding --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_lme_traders_report

描述: 伦敦金属交易所(LME)-持仓报告, 数据区间从 20151022-至今

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称     | 类型 | 描述  |
|--------|----|-----|
| 日期     | -  | -   |
| 铜-多头仓位 | -  | -   |
| ...    | -  | ... |
| 铝-净仓位  | -  | -   |

### macro_euro_lme_stock
- **文档定位**：重要机构 / 伦敦金属交易所 / 库存报告
- **HTTP**：`GET /api/public/macro_euro_lme_stock`
- **调用**：运行 `scripts/aktools_get.py macro_euro_lme_stock --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_lme_report

描述: 伦敦金属交易所(LME)-库存报告, 数据区间从 20140702-至今

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称     | 类型  | 描述  |
|--------|-----|-----|
| 日期     | -   | -   |
| 铜-库存   | -   | -   |
| ...    | ... | ... |
| 镍-注销仓单 | -   | -   |

### macro_usa_cftc_nc_holding
- **文档定位**：重要机构 / 美国商品期货交易委员会 / 外汇类非商业持仓报告
- **HTTP**：`GET /api/public/macro_usa_cftc_nc_holding`
- **调用**：运行 `scripts/aktools_get.py macro_usa_cftc_nc_holding --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_cftc_nc_report

描述: 美国商品期货交易委员会CFTC外汇类非商业持仓报告, 数据区间从 19830107-至今

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称      | 类型      | 描述 |
|---------|---------|----|
| 日期      | object  | -  |
| 美元-多头仓位 | float64 | -  |
| ...     | ...     | -  |
| 澳元-净仓位  | float64 | -  |

### macro_usa_cftc_c_holding
- **文档定位**：重要机构 / 美国商品期货交易委员会 / 商品类非商业持仓报告
- **HTTP**：`GET /api/public/macro_usa_cftc_c_holding`
- **调用**：运行 `scripts/aktools_get.py macro_usa_cftc_c_holding --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_cftc_c_report

描述: 美国商品期货交易委员会CFTC商品类非商业持仓报告, 数据区间从 19830107-至今

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称        | 类型      | 描述 |
|-----------|---------|----|
| 日期        | object  | -  |
| 纽约原油-多头仓位 | float64 | -  |
| ...       | ...     | -  |
| 玉米-净仓位    | float64 | -  |

### macro_usa_cftc_merchant_currency_holding
- **文档定位**：重要机构 / 美国商品期货交易委员会 / 外汇类商业持仓报告
- **HTTP**：`GET /api/public/macro_usa_cftc_merchant_currency_holding`
- **调用**：运行 `scripts/aktools_get.py macro_usa_cftc_merchant_currency_holding --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_cftc_merchant_currency

描述: 美国商品期货交易委员会CFTC外汇类商业持仓报告, 数据区间从 19860115-至今

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称      | 类型      | 描述 |
|---------|---------|----|
| 日期      | object  | -  |
| 美元-多头仓位 | float64 | -  |
| ...     | ...     | -  |
| 澳元-净仓位  | float64 | -  |

### macro_usa_cftc_merchant_goods_holding
- **文档定位**：重要机构 / 美国商品期货交易委员会 / 商品类商业持仓报告
- **HTTP**：`GET /api/public/macro_usa_cftc_merchant_goods_holding`
- **调用**：运行 `scripts/aktools_get.py macro_usa_cftc_merchant_goods_holding --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_cftc_merchant_goods

描述: 美国商品期货交易委员会 CFTC 商品类商业持仓报告, 数据区间从 19860115-至今

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称        | 类型      | 描述 |
|-----------|---------|----|
| 日期        | object  | -  |
| 纽约原油-多头仓位 | float64 | -  |
| ...       | ...     | -  |
| 玉米-净仓位    | float64 | -  |

### macro_usa_cme_merchant_goods_holding
- **文档定位**：重要机构 / 芝加哥交易所 / 贵金属
- **HTTP**：`GET /api/public/macro_usa_cme_merchant_goods_holding`
- **调用**：运行 `scripts/aktools_get.py macro_usa_cme_merchant_goods_holding --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/org

描述: CME-贵金属, 数据区间从 20180405-至今

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称  | 类型      | 描述 |
|-----|---------|----|
| 日期  | object  | -  |
| 品种  | object  | -  |
| 成交量 | float64 | -  |
