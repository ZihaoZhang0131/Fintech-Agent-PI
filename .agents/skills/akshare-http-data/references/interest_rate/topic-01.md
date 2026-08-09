# 主要央行利率



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### macro_bank_usa_interest_rate
- **文档定位**：主要央行利率 / 美联储利率决议报告
- **HTTP**：`GET /api/public/macro_bank_usa_interest_rate`
- **调用**：运行 `scripts/aktools_get.py macro_bank_usa_interest_rate --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_interest_rate_decision

描述: 美联储利率决议报告, 数据区间从 19820927-至今

限量: 单次返回所有历史数据

说明: 当前接口使用 Jin10 历史数据接口; 经 2026-07 校验, 该上游链路未继续提供最新数据, 返回结果可能仅更新至 2025 年附近, 不代表 AKShare 本地缓存异常

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 商品  | object  | -       |
| 日期  | object  | -       |
| 今值  | float64 | 注意单位: % |
| 预测值 | float64 | 注意单位: % |
| 前值  | float64 | 注意单位: % |

### macro_bank_euro_interest_rate
- **文档定位**：主要央行利率 / 欧洲央行决议报告
- **HTTP**：`GET /api/public/macro_bank_euro_interest_rate`
- **调用**：运行 `scripts/aktools_get.py macro_bank_euro_interest_rate --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_interest_rate_decision

描述: 欧洲央行决议报告, 数据区间从 19990101-至今

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 商品  | object  | -       |
| 日期  | object  | -       |
| 今值  | float64 | 注意单位: % |
| 预测值 | float64 | 注意单位: % |
| 前值  | float64 | 注意单位: % |

### macro_bank_newzealand_interest_rate
- **文档定位**：主要央行利率 / 新西兰联储决议报告
- **HTTP**：`GET /api/public/macro_bank_newzealand_interest_rate`
- **调用**：运行 `scripts/aktools_get.py macro_bank_newzealand_interest_rate --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_newzealand_interest_rate_decision

描述: 新西兰联储决议报告, 数据区间从 19990401-至今

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 商品  | object  | -       |
| 日期  | object  | -       |
| 今值  | float64 | 注意单位: % |
| 预测值 | float64 | 注意单位: % |
| 前值  | float64 | 注意单位: % |

### macro_bank_china_interest_rate
- **文档定位**：主要央行利率 / 中国央行决议报告
- **HTTP**：`GET /api/public/macro_bank_china_interest_rate`
- **调用**：运行 `scripts/aktools_get.py macro_bank_china_interest_rate --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_china_interest_rate_decision

描述: 中国央行决议报告, 数据区间从 19910105-至今

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 商品  | object  | -       |
| 日期  | object  | -       |
| 今值  | float64 | 注意单位: % |
| 预测值 | float64 | 注意单位: % |
| 前值  | float64 | 注意单位: % |

### macro_bank_switzerland_interest_rate
- **文档定位**：主要央行利率 / 瑞士央行利率决议报告
- **HTTP**：`GET /api/public/macro_bank_switzerland_interest_rate`
- **调用**：运行 `scripts/aktools_get.py macro_bank_switzerland_interest_rate --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_switzerland_interest_rate_decision

描述: 瑞士央行利率决议报告, 数据区间从 20080313-至今

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 商品  | object  | -       |
| 日期  | object  | -       |
| 今值  | float64 | 注意单位: % |
| 预测值 | float64 | 注意单位: % |
| 前值  | float64 | 注意单位: % |

### macro_bank_english_interest_rate
- **文档定位**：主要央行利率 / 英国央行决议报告
- **HTTP**：`GET /api/public/macro_bank_english_interest_rate`
- **调用**：运行 `scripts/aktools_get.py macro_bank_english_interest_rate --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_english_interest_rate_decision

描述: 英国央行决议报告, 数据区间从 19700101-至今

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 商品  | object  | -       |
| 日期  | object  | -       |
| 今值  | float64 | 注意单位: % |
| 预测值 | float64 | 注意单位: % |
| 前值  | float64 | 注意单位: % |

### macro_bank_australia_interest_rate
- **文档定位**：主要央行利率 / 澳洲联储决议报告
- **HTTP**：`GET /api/public/macro_bank_australia_interest_rate`
- **调用**：运行 `scripts/aktools_get.py macro_bank_australia_interest_rate --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_australia_interest_rate_decision

描述: 澳洲联储决议报告, 数据区间从 19800201-至今

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 商品  | object  | -       |
| 日期  | object  | -       |
| 今值  | float64 | 注意单位: % |
| 预测值 | float64 | 注意单位: % |
| 前值  | float64 | 注意单位: % |

### macro_bank_japan_interest_rate
- **文档定位**：主要央行利率 / 日本利率决议报告
- **HTTP**：`GET /api/public/macro_bank_japan_interest_rate`
- **调用**：运行 `scripts/aktools_get.py macro_bank_japan_interest_rate --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_japan_interest_rate_decision

描述: 日本利率决议报告, 数据区间从 20080214-至今

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 商品  | object  | -       |
| 日期  | object  | -       |
| 今值  | float64 | 注意单位: % |
| 预测值 | float64 | 注意单位: % |
| 前值  | float64 | 注意单位: % |

### macro_bank_russia_interest_rate
- **文档定位**：主要央行利率 / 俄罗斯利率决议报告
- **HTTP**：`GET /api/public/macro_bank_russia_interest_rate`
- **调用**：运行 `scripts/aktools_get.py macro_bank_russia_interest_rate --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_russia_interest_rate_decision

描述: 俄罗斯利率决议报告, 数据区间从 20030601-至今

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 商品  | object  | -       |
| 日期  | object  | -       |
| 今值  | float64 | 注意单位: % |
| 预测值 | float64 | 注意单位: % |
| 前值  | float64 | 注意单位: % |

### macro_bank_india_interest_rate
- **文档定位**：主要央行利率 / 印度利率决议报告
- **HTTP**：`GET /api/public/macro_bank_india_interest_rate`
- **调用**：运行 `scripts/aktools_get.py macro_bank_india_interest_rate --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_india_interest_rate_decision

描述: 印度利率决议报告, 数据区间从 20000801-至今

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 商品  | object  | -       |
| 日期  | object  | -       |
| 今值  | float64 | 注意单位: % |
| 预测值 | float64 | 注意单位: % |
| 前值  | float64 | 注意单位: % |

### macro_bank_brazil_interest_rate
- **文档定位**：主要央行利率 / 巴西利率决议报告
- **HTTP**：`GET /api/public/macro_bank_brazil_interest_rate`
- **调用**：运行 `scripts/aktools_get.py macro_bank_brazil_interest_rate --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_brazil_interest_rate_decision

描述: 巴西利率决议报告, 数据区间从20080201-至今

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 商品  | object  | -       |
| 日期  | object  | -       |
| 今值  | float64 | 注意单位: % |
| 预测值 | float64 | 注意单位: % |
| 前值  | float64 | 注意单位: % |
