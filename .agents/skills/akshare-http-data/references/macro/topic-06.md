# 欧元区宏观



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### macro_euro_gdp_yoy
- **文档定位**：欧元区宏观 / 国民经济运行状况 / 经济状况 / 欧元区季度GDP年率报告
- **HTTP**：`GET /api/public/macro_euro_gdp_yoy`
- **调用**：运行 `scripts/aktools_get.py macro_euro_gdp_yoy --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_eurozone_gdp_yoy

描述: 欧元区季度 GDP 年率报告, 数据区间从 20131114-至今

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

### macro_euro_cpi_mom
- **文档定位**：欧元区宏观 / 国民经济运行状况 / 物价水平 / 欧元区CPI月率报告
- **HTTP**：`GET /api/public/macro_euro_cpi_mom`
- **调用**：运行 `scripts/aktools_get.py macro_euro_cpi_mom --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_eurozone_cpi_mom

描述: 欧元区 CPI 月率报告, 数据区间从 19900301-至今

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

### macro_euro_cpi_yoy
- **文档定位**：欧元区宏观 / 国民经济运行状况 / 物价水平 / 欧元区CPI年率报告
- **HTTP**：`GET /api/public/macro_euro_cpi_yoy`
- **调用**：运行 `scripts/aktools_get.py macro_euro_cpi_yoy --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_eurozone_cpi_yoy

描述: 欧元区 CPI 年率报告, 数据区间从 19910201-至今

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

### macro_euro_ppi_mom
- **文档定位**：欧元区宏观 / 国民经济运行状况 / 物价水平 / 欧元区PPI月率报告
- **HTTP**：`GET /api/public/macro_euro_ppi_mom`
- **调用**：运行 `scripts/aktools_get.py macro_euro_ppi_mom --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_eurozone_ppi_mom

描述: 欧元区 PPI 月率报告, 数据区间从 19810301-至今

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

### macro_euro_retail_sales_mom
- **文档定位**：欧元区宏观 / 国民经济运行状况 / 物价水平 / 欧元区零售销售月率报告
- **HTTP**：`GET /api/public/macro_euro_retail_sales_mom`
- **调用**：运行 `scripts/aktools_get.py macro_euro_retail_sales_mom --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_eurozone_retail_sales_mom

描述: 欧元区零售销售月率报告, 数据区间从 20000301-至今

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

### macro_euro_employment_change_qoq
- **文档定位**：欧元区宏观 / 国民经济运行状况 / 劳动力市场 / 欧元区季调后就业人数季率报告
- **HTTP**：`GET /api/public/macro_euro_employment_change_qoq`
- **调用**：运行 `scripts/aktools_get.py macro_euro_employment_change_qoq --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_eurozone_employment_change_qoq

描述: 欧元区季调后就业人数季率报告, 数据区间从 20083017-至今

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

### macro_euro_unemployment_rate_mom
- **文档定位**：欧元区宏观 / 国民经济运行状况 / 劳动力市场 / 欧元区失业率报告
- **HTTP**：`GET /api/public/macro_euro_unemployment_rate_mom`
- **调用**：运行 `scripts/aktools_get.py macro_euro_unemployment_rate_mom --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_eurozone_unemployment_rate_mom

描述: 欧元区失业率报告, 数据区间从 19980501-至今

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

### macro_euro_trade_balance
- **文档定位**：欧元区宏观 / 贸易状况 / 欧元区未季调贸易帐报告
- **HTTP**：`GET /api/public/macro_euro_trade_balance`
- **调用**：运行 `scripts/aktools_get.py macro_euro_trade_balance --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_eurozone_trade_balance_mom

描述: 欧元区未季调贸易帐报告, 数据区间从 19990201-至今

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

### macro_euro_current_account_mom
- **文档定位**：欧元区宏观 / 贸易状况 / 欧元区经常帐报告
- **HTTP**：`GET /api/public/macro_euro_current_account_mom`
- **调用**：运行 `scripts/aktools_get.py macro_euro_current_account_mom --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_eurozone_current_account_mom

描述: 欧元区经常帐报告, 数据区间从 20080221-至今

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

### macro_euro_industrial_production_mom
- **文档定位**：欧元区宏观 / 产业指标 / 欧元区工业产出月率报告
- **HTTP**：`GET /api/public/macro_euro_industrial_production_mom`
- **调用**：运行 `scripts/aktools_get.py macro_euro_industrial_production_mom --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_eurozone_industrial_production_mom

描述: 欧元区工业产出月率报告, 数据区间从 19910301-至今

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

### macro_euro_manufacturing_pmi
- **文档定位**：欧元区宏观 / 产业指标 / 欧元区制造业PMI初值报告
- **HTTP**：`GET /api/public/macro_euro_manufacturing_pmi`
- **调用**：运行 `scripts/aktools_get.py macro_euro_manufacturing_pmi --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_eurozone_manufacturing_pmi

描述: 欧元区制造业 PMI 初值报告, 数据区间从 20080222-至今

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

### macro_euro_services_pmi
- **文档定位**：欧元区宏观 / 产业指标 / 欧元区服务业PMI终值报告
- **HTTP**：`GET /api/public/macro_euro_services_pmi`
- **调用**：运行 `scripts/aktools_get.py macro_euro_services_pmi --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_eurozone_services_pmi

描述: 欧元区服务业 PMI 终值报告, 数据区间从 20080222-至今

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

### macro_euro_zew_economic_sentiment
- **文档定位**：欧元区宏观 / 领先指标 / 欧元区ZEW经济景气指数报告
- **HTTP**：`GET /api/public/macro_euro_zew_economic_sentiment`
- **调用**：运行 `scripts/aktools_get.py macro_euro_zew_economic_sentiment --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_eurozone_zew_economic_sentiment

描述: 欧元区 ZEW 经济景气指数报告, 数据区间从 20080212-至今

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

### macro_euro_sentix_investor_confidence
- **文档定位**：欧元区宏观 / 领先指标 / 欧元区Sentix投资者信心指数报告
- **HTTP**：`GET /api/public/macro_euro_sentix_investor_confidence`
- **调用**：运行 `scripts/aktools_get.py macro_euro_sentix_investor_confidence --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_eurozone_sentix_investor_confidence

描述: 欧元区 Sentix 投资者信心指数报告, 数据区间从 20020801-至今

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
