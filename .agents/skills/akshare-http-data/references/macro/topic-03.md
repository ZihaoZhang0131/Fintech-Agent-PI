# 加拿大宏观



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### macro_canada_new_house_rate
- **文档定位**：加拿大宏观 / 新屋开工
- **HTTP**：`GET /api/public/macro_canada_new_house_rate`
- **调用**：运行 `scripts/aktools_get.py macro_canada_new_house_rate --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/cjsj/foreign_7_0.html

描述: 东方财富-经济数据-加拿大-新屋开工

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 时间   | object  | -       |
| 前值   | float64 | 注意单位: 万 |
| 现值   | float64 | 注意单位: 万 |
| 发布日期 | object  | -       |

### macro_canada_unemployment_rate
- **文档定位**：加拿大宏观 / 失业率
- **HTTP**：`GET /api/public/macro_canada_unemployment_rate`
- **调用**：运行 `scripts/aktools_get.py macro_canada_unemployment_rate --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/cjsj/foreign_7_1.html

描述: 东方财富-经济数据-加拿大-失业率

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 时间   | object  | -       |
| 前值   | float64 | 注意单位: % |
| 现值   | float64 | 注意单位: % |
| 发布日期 | object  | -       |

### macro_canada_trade
- **文档定位**：加拿大宏观 / 贸易帐
- **HTTP**：`GET /api/public/macro_canada_trade`
- **调用**：运行 `scripts/aktools_get.py macro_canada_trade --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/cjsj/foreign_7_2.html

描述: 东方财富-经济数据-加拿大-贸易帐

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述        |
|------|---------|-----------|
| 时间   | object  | -         |
| 前值   | float64 | 注意单位: 亿加元 |
| 现值   | float64 | 注意单位: 亿加元 |
| 发布日期 | object  | -         |

### macro_canada_retail_rate_monthly
- **文档定位**：加拿大宏观 / 零售销售月率
- **HTTP**：`GET /api/public/macro_canada_retail_rate_monthly`
- **调用**：运行 `scripts/aktools_get.py macro_canada_retail_rate_monthly --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/cjsj/foreign_7_3.html

描述: 东方财富-经济数据-加拿大-零售销售月率

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 时间   | object  | -       |
| 前值   | float64 | 注意单位: % |
| 现值   | float64 | 注意单位: % |
| 发布日期 | object  | -       |

### macro_canada_bank_rate
- **文档定位**：加拿大宏观 / 央行公布利率决议
- **HTTP**：`GET /api/public/macro_canada_bank_rate`
- **调用**：运行 `scripts/aktools_get.py macro_canada_bank_rate --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/cjsj/foreign_7_4.html

描述: 东方财富-经济数据-加拿大-央行公布利率决议

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 时间   | object  | -       |
| 前值   | float64 | 注意单位: % |
| 现值   | float64 | 注意单位: % |
| 发布日期 | object  | -       |

### macro_canada_core_cpi_yearly
- **文档定位**：加拿大宏观 / 核心消费者物价指数年率
- **HTTP**：`GET /api/public/macro_canada_core_cpi_yearly`
- **调用**：运行 `scripts/aktools_get.py macro_canada_core_cpi_yearly --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/cjsj/foreign_7_5.html

描述: 东方财富-经济数据-加拿大-核心消费者物价指数年率

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 时间   | object  | -       |
| 前值   | float64 | 注意单位: % |
| 现值   | float64 | 注意单位: % |
| 发布日期 | object  | -       |

### macro_canada_core_cpi_monthly
- **文档定位**：加拿大宏观 / 核心消费者物价指数月率
- **HTTP**：`GET /api/public/macro_canada_core_cpi_monthly`
- **调用**：运行 `scripts/aktools_get.py macro_canada_core_cpi_monthly --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/cjsj/foreign_7_6.html

描述: 东方财富-经济数据-加拿大-核心消费者物价指数月率

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 时间   | object  | -       |
| 前值   | float64 | 注意单位: % |
| 现值   | float64 | 注意单位: % |
| 发布日期 | object  | -       |

### macro_canada_cpi_yearly
- **文档定位**：加拿大宏观 / 消费者物价指数年率
- **HTTP**：`GET /api/public/macro_canada_cpi_yearly`
- **调用**：运行 `scripts/aktools_get.py macro_canada_cpi_yearly --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/cjsj/foreign_7_7.html

描述: 东方财富-经济数据-加拿大-消费者物价指数年率

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 时间   | object  | -       |
| 前值   | float64 | 注意单位: % |
| 现值   | float64 | 注意单位: % |
| 发布日期 | object  | -       |

### macro_canada_cpi_monthly
- **文档定位**：加拿大宏观 / 消费者物价指数月率
- **HTTP**：`GET /api/public/macro_canada_cpi_monthly`
- **调用**：运行 `scripts/aktools_get.py macro_canada_cpi_monthly --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/cjsj/foreign_7_8.html

描述: 东方财富-经济数据-加拿大-消费者物价指数月率

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 时间   | object  | -       |
| 前值   | float64 | 注意单位: % |
| 现值   | float64 | 注意单位: % |
| 发布日期 | object  | -       |

### macro_canada_gdp_monthly
- **文档定位**：加拿大宏观 / GDP 月率
- **HTTP**：`GET /api/public/macro_canada_gdp_monthly`
- **调用**：运行 `scripts/aktools_get.py macro_canada_gdp_monthly --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/cjsj/foreign_7_9.html

描述: 东方财富-经济数据-加拿大-GDP 月率

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 时间   | object  | -       |
| 前值   | float64 | 注意单位: % |
| 现值   | float64 | 注意单位: % |
| 发布日期 | object  | -       |
