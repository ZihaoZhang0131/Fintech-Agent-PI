# 日本宏观



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### macro_japan_bank_rate
- **文档定位**：日本宏观 / 央行公布利率决议
- **HTTP**：`GET /api/public/macro_japan_bank_rate`
- **调用**：运行 `scripts/aktools_get.py macro_japan_bank_rate --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/cjsj/foreign_3_0.html

描述: 东方财富-经济数据-日本-央行公布利率决议

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述  |
|------|---------|-----|
| 时间   | object  | -   |
| 前值   | float64 | -   |
| 现值   | float64 | -   |
| 发布日期 | object  | -   |

### macro_japan_cpi_yearly
- **文档定位**：日本宏观 / 全国消费者物价指数年率
- **HTTP**：`GET /api/public/macro_japan_cpi_yearly`
- **调用**：运行 `scripts/aktools_get.py macro_japan_cpi_yearly --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/cjsj/foreign_3_1.html

描述: 东方财富-经济数据-日本-全国消费者物价指数年率

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述  |
|------|---------|-----|
| 时间   | object  | -   |
| 前值   | float64 | -   |
| 现值   | float64 | -   |
| 发布日期 | object  | -   |

### macro_japan_core_cpi_yearly
- **文档定位**：日本宏观 / 全国核心消费者物价指数年率
- **HTTP**：`GET /api/public/macro_japan_core_cpi_yearly`
- **调用**：运行 `scripts/aktools_get.py macro_japan_core_cpi_yearly --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/cjsj/foreign_2_2.html

描述: 东方财富-经济数据-日本-全国核心消费者物价指数年率

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述  |
|------|---------|-----|
| 时间   | object  | -   |
| 前值   | float64 | -   |
| 现值   | float64 | -   |
| 发布日期 | object  | -   |

### macro_japan_unemployment_rate
- **文档定位**：日本宏观 / 失业率
- **HTTP**：`GET /api/public/macro_japan_unemployment_rate`
- **调用**：运行 `scripts/aktools_get.py macro_japan_unemployment_rate --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/cjsj/foreign_2_3.html

描述: 东方财富-经济数据-日本-失业率

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述  |
|------|---------|-----|
| 时间   | object  | -   |
| 前值   | float64 | -   |
| 现值   | float64 | -   |
| 发布日期 | object  | -   |

### macro_japan_head_indicator
- **文档定位**：日本宏观 / 领先指标终值
- **HTTP**：`GET /api/public/macro_japan_head_indicator`
- **调用**：运行 `scripts/aktools_get.py macro_japan_head_indicator --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/cjsj/foreign_3_4.html

描述: 东方财富-经济数据-日本-领先指标终值

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述  |
|------|---------|-----|
| 时间   | object  | -   |
| 前值   | float64 | -   |
| 现值   | float64 | -   |
| 发布日期 | object  | -   |
