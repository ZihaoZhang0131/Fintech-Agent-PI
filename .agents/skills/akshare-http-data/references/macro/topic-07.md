# 澳大利亚宏观



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### macro_australia_retail_rate_monthly
- **文档定位**：澳大利亚宏观 / 零售销售月率
- **HTTP**：`GET /api/public/macro_australia_retail_rate_monthly`
- **调用**：运行 `scripts/aktools_get.py macro_australia_retail_rate_monthly --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/cjsj/foreign_5_0.html

描述: 东方财富-经济数据-澳大利亚-零售销售月率

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

### macro_australia_trade
- **文档定位**：澳大利亚宏观 / 贸易帐
- **HTTP**：`GET /api/public/macro_australia_trade`
- **调用**：运行 `scripts/aktools_get.py macro_australia_trade --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/cjsj/foreign_5_1.html

描述: 东方财富-经济数据-澳大利亚-贸易帐

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述        |
|------|---------|-----------|
| 时间   | object  | -         |
| 前值   | float64 | 注意单位: 亿澳元 |
| 现值   | float64 | 注意单位: 亿澳元 |
| 发布日期 | object  | -         |

### macro_australia_unemployment_rate
- **文档定位**：澳大利亚宏观 / 失业率
- **HTTP**：`GET /api/public/macro_australia_unemployment_rate`
- **调用**：运行 `scripts/aktools_get.py macro_australia_unemployment_rate --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/cjsj/foreign_5_2.html

描述: 东方财富-经济数据-澳大利亚-失业率

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

### macro_australia_ppi_quarterly
- **文档定位**：澳大利亚宏观 / 生产者物价指数季率
- **HTTP**：`GET /api/public/macro_australia_ppi_quarterly`
- **调用**：运行 `scripts/aktools_get.py macro_australia_ppi_quarterly --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/cjsj/foreign_5_3.html

描述: 东方财富-经济数据-澳大利亚-生产者物价指数季率

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

### macro_australia_cpi_quarterly
- **文档定位**：澳大利亚宏观 / 消费者物价指数季率
- **HTTP**：`GET /api/public/macro_australia_cpi_quarterly`
- **调用**：运行 `scripts/aktools_get.py macro_australia_cpi_quarterly --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/cjsj/foreign_5_4.html

描述: 东方财富-经济数据-澳大利亚-消费者物价指数季率

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

### macro_australia_cpi_yearly
- **文档定位**：澳大利亚宏观 / 消费者物价指数年率
- **HTTP**：`GET /api/public/macro_australia_cpi_yearly`
- **调用**：运行 `scripts/aktools_get.py macro_australia_cpi_yearly --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/cjsj/foreign_5_5.html

描述: 东方财富-经济数据-澳大利亚-消费者物价指数年率

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

### macro_australia_bank_rate
- **文档定位**：澳大利亚宏观 / 央行公布利率决议
- **HTTP**：`GET /api/public/macro_australia_bank_rate`
- **调用**：运行 `scripts/aktools_get.py macro_australia_bank_rate --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/cjsj/foreign_5_6.html

描述: 东方财富-经济数据-澳大利亚-央行公布利率决议

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
