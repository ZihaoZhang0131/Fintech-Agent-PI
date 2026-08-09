# 美国宏观



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### macro_usa_gdp_monthly
- **文档定位**：美国宏观 / 经济状况 / 美国GDP
- **HTTP**：`GET /api/public/macro_usa_gdp_monthly`
- **调用**：运行 `scripts/aktools_get.py macro_usa_gdp_monthly --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_gdp

描述: 美国国内生产总值(GDP)报告, 数据区间从 20080228-至今

限量: 单次返回所有历史数据

说明: 当前接口使用 Jin10 历史数据接口; 经 2026-07 校验, 该上游链路未继续提供最新数据, 返回结果可能仅更新至 2025 年附近, 不代表 AKShare 本地缓存异常

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 商品  | object  | -       |
| 日期  | object  | -       |
| 今值  | float64 | 注意单位: % |
| 预测值 | float64 | 注意单位: % |
| 前值  | float64 | 注意单位: % |

### macro_usa_cpi_monthly
- **文档定位**：美国宏观 / 物价水平 / 美国CPI月率报告
- **HTTP**：`GET /api/public/macro_usa_cpi_monthly`
- **调用**：运行 `scripts/aktools_get.py macro_usa_cpi_monthly --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_cpi

描述: 美国 CPI 月率报告, 数据区间从 19700101-至今

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 商品  | object  | -       |
| 日期  | object  | -       |
| 今值  | float64 | 注意单位: % |
| 预测值 | float64 | 注意单位: % |
| 前值  | float64 | 注意单位: % |

### macro_usa_cpi_yoy
- **文档定位**：美国宏观 / 物价水平 / 美国CPI年率报告
- **HTTP**：`GET /api/public/macro_usa_cpi_yoy`
- **调用**：运行 `scripts/aktools_get.py macro_usa_cpi_yoy --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/cjsj/foreign_0_12.html

描述: 东方财富-经济数据一览-美国-CPI年率, 数据区间从2008-至今

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 时间   | object  | -       |
| 发布日期 | object  | -       |
| 现值   | float64 | 注意单位: % |
| 前值   | float64 | 注意单位: % |

### macro_usa_core_cpi_monthly
- **文档定位**：美国宏观 / 物价水平 / 美国核心CPI月率报告
- **HTTP**：`GET /api/public/macro_usa_core_cpi_monthly`
- **调用**：运行 `scripts/aktools_get.py macro_usa_core_cpi_monthly --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_core_cpi

描述: 美国核心 CPI 月率报告, 数据区间从 19700101-至今

限量: 单次返回所有历史数据

说明: 当前接口使用 Jin10 历史数据接口; 经 2026-07 校验, 该上游链路未继续提供最新数据, 返回结果可能仅更新至 2025 年附近, 不代表 AKShare 本地缓存异常

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 商品  | object  | -       |
| 日期  | object  | -       |
| 今值  | float64 | 注意单位: % |
| 预测值 | float64 | 注意单位: % |
| 前值  | float64 | 注意单位: % |

### macro_usa_personal_spending
- **文档定位**：美国宏观 / 物价水平 / 美国个人支出月率报告
- **HTTP**：`GET /api/public/macro_usa_personal_spending`
- **调用**：运行 `scripts/aktools_get.py macro_usa_personal_spending --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_personal_spending

描述: 美国个人支出月率报告, 数据区间从 19700101-至今

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 商品  | object  | -       |
| 日期  | object  | -       |
| 今值  | float64 | 注意单位: % |
| 预测值 | float64 | 注意单位: % |
| 前值  | float64 | 注意单位: % |

### macro_usa_retail_sales
- **文档定位**：美国宏观 / 物价水平 / 美国零售销售月率报告
- **HTTP**：`GET /api/public/macro_usa_retail_sales`
- **调用**：运行 `scripts/aktools_get.py macro_usa_retail_sales --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_retail_sales

描述: 美国零售销售月率报告, 数据区间从 19920301-至今

限量: 单次返回所有历史数据

说明: 当前接口使用 Jin10 历史数据接口; 经 2026-07 校验, 该上游链路未继续提供最新数据, 返回结果可能仅更新至 2025 年附近, 不代表 AKShare 本地缓存异常

输入参数

| 名称 | 类型   | 描述 |
|----|------|----|
| -  | -  - |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 商品  | object  | -       |
| 日期  | object  | -       |
| 今值  | float64 | 注意单位: % |
| 预测值 | float64 | 注意单位: % |
| 前值  | float64 | 注意单位: % |

### macro_usa_import_price
- **文档定位**：美国宏观 / 物价水平 / 美国进口物价指数报告
- **HTTP**：`GET /api/public/macro_usa_import_price`
- **调用**：运行 `scripts/aktools_get.py macro_usa_import_price --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_import_price

描述: 美国进口物价指数报告, 数据区间从 19890201-至今

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型   | 描述 |
|----|------|----|
| -  | -  - |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 商品  | object  | -       |
| 日期  | object  | -       |
| 今值  | float64 | 注意单位: % |
| 预测值 | float64 | 注意单位: % |
| 前值  | float64 | 注意单位: % |

### macro_usa_export_price
- **文档定位**：美国宏观 / 物价水平 / 美国出口价格指数报告
- **HTTP**：`GET /api/public/macro_usa_export_price`
- **调用**：运行 `scripts/aktools_get.py macro_usa_export_price --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_export_price

描述: 美国出口价格指数报告, 数据区间从 19890201-至今

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型   | 描述 |
|----|------|----|
| -  | -  - |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 商品  | object  | -       |
| 日期  | object  | -       |
| 今值  | float64 | 注意单位: % |
| 预测值 | float64 | 注意单位: % |
| 前值  | float64 | 注意单位: % |

### macro_usa_lmci
- **文档定位**：美国宏观 / 劳动力市场 / LMCI
- **HTTP**：`GET /api/public/macro_usa_lmci`
- **调用**：运行 `scripts/aktools_get.py macro_usa_lmci --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_lmci

描述: 美联储劳动力市场状况指数报告, 数据区间从 20141006-至今

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型   | 描述 |
|----|------|----|
| -  | -  - |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 商品  | object  | -       |
| 日期  | object  | -       |
| 今值  | float64 | 注意单位: % |
| 预测值 | float64 | 注意单位: % |
| 前值  | float64 | 注意单位: % |

### macro_usa_unemployment_rate
- **文档定位**：美国宏观 / 劳动力市场 / 失业率 / 美国失业率报告
- **HTTP**：`GET /api/public/macro_usa_unemployment_rate`
- **调用**：运行 `scripts/aktools_get.py macro_usa_unemployment_rate --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_unemployment_rate

描述: 美国失业率报告, 数据区间从 19700101-至今

限量: 单次返回所有历史数据

说明: 当前接口使用 Jin10 历史数据接口; 经 2026-07 校验, 该上游链路未继续提供最新数据, 返回结果可能仅更新至 2025 年附近, 不代表 AKShare 本地缓存异常

输入参数

| 名称 | 类型   | 描述 |
|----|------|----|
| -  | -  - |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 商品  | object  | -       |
| 日期  | object  | -       |
| 今值  | float64 | 注意单位: % |
| 预测值 | float64 | 注意单位: % |
| 前值  | float64 | 注意单位: % |

### macro_usa_job_cuts
- **文档定位**：美国宏观 / 劳动力市场 / 失业率 / 美国挑战者企业裁员人数报告
- **HTTP**：`GET /api/public/macro_usa_job_cuts`
- **调用**：运行 `scripts/aktools_get.py macro_usa_job_cuts --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_job_cuts

描述: 美国挑战者企业裁员人数报告, 数据区间从 19940201-至今

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型   | 描述 |
|----|------|----|
| -  | -  - |

输出参数

| 名称  | 类型      | 描述       |
|-----|---------|----------|
| 商品  | object  | -        |
| 日期  | object  | -        |
| 今值  | float64 | 注意单位: 万人 |
| 预测值 | float64 | 注意单位: 万人 |
| 前值  | float64 | 注意单位: 万人 |

### macro_usa_non_farm
- **文档定位**：美国宏观 / 劳动力市场 / 就业人口 / 美国非农就业人数报告
- **HTTP**：`GET /api/public/macro_usa_non_farm`
- **调用**：运行 `scripts/aktools_get.py macro_usa_non_farm --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_nonfarm_payrolls

描述: 美国非农就业人数报告, 数据区间从 19700102-至今

限量: 单次返回所有历史数据

说明: 当前接口使用 Jin10 历史数据接口; 经 2026-07 校验, 该上游链路未继续提供最新数据, 返回结果可能仅更新至 2025 年附近, 不代表 AKShare 本地缓存异常

输入参数

| 名称 | 类型   | 描述 |
|----|------|----|
| -  | -  - |

输出参数

| 名称  | 类型      | 描述       |
|-----|---------|----------|
| 商品  | object  | -        |
| 日期  | object  | -        |
| 今值  | float64 | 注意单位: 万人 |
| 预测值 | float64 | 注意单位: 万人 |
| 前值  | float64 | 注意单位: 万人 |

### macro_usa_adp_employment
- **文档定位**：美国宏观 / 劳动力市场 / 就业人口 / 美国ADP就业人数报告
- **HTTP**：`GET /api/public/macro_usa_adp_employment`
- **调用**：运行 `scripts/aktools_get.py macro_usa_adp_employment --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_adp_nonfarm_employment

描述: 美国 ADP 就业人数报告, 数据区间从 20010601-至今

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型   | 描述 |
|----|------|----|
| -  | -  - |

输出参数

| 名称  | 类型      | 描述       |
|-----|---------|----------|
| 商品  | object  | -        |
| 日期  | object  | -        |
| 今值  | float64 | 注意单位: 万人 |
| 预测值 | float64 | 注意单位: 万人 |
| 前值  | float64 | 注意单位: 万人 |

### macro_usa_core_pce_price
- **文档定位**：美国宏观 / 劳动力市场 / 消费者收入与支出 / 美国核心PCE物价指数年率报告
- **HTTP**：`GET /api/public/macro_usa_core_pce_price`
- **调用**：运行 `scripts/aktools_get.py macro_usa_core_pce_price --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_core_pce_price

描述: 美国核心 PCE 物价指数年率报告, 数据区间从 19700101-至今

限量: 单次返回所有历史数据

说明: 当前接口使用 Jin10 历史数据接口; 经 2026-07 校验, 该上游链路未继续提供最新数据, 返回结果可能仅更新至 2025 年附近, 不代表 AKShare 本地缓存异常

输入参数

| 名称 | 类型   | 描述 |
|----|------|----|
| -  | -  - |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 商品  | object  | -       |
| 日期  | object  | -       |
| 今值  | float64 | 注意单位: % |
| 预测值 | float64 | 注意单位: % |
| 前值  | float64 | 注意单位: % |

### macro_usa_real_consumer_spending
- **文档定位**：美国宏观 / 劳动力市场 / 消费者收入与支出 / 美国实际个人消费支出季率初值报告
- **HTTP**：`GET /api/public/macro_usa_real_consumer_spending`
- **调用**：运行 `scripts/aktools_get.py macro_usa_real_consumer_spending --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_real_consumer_spending

描述: 美国实际个人消费支出季率初值报告, 数据区间从 20131107-至今

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型   | 描述 |
|----|------|----|
| -  | -  - |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 商品  | object  | -       |
| 日期  | object  | -       |
| 今值  | float64 | 注意单位: % |
| 预测值 | float64 | 注意单位: % |
| 前值  | float64 | 注意单位: % |

### macro_usa_trade_balance
- **文档定位**：美国宏观 / 贸易状况 / 美国贸易帐报告
- **HTTP**：`GET /api/public/macro_usa_trade_balance`
- **调用**：运行 `scripts/aktools_get.py macro_usa_trade_balance --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_trade_balance

描述: 美国贸易帐报告, 数据区间从 19700101-至今

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型   | 描述 |
|----|------|----|
| -  | -  - |

输出参数

| 名称  | 类型      | 描述        |
|-----|---------|-----------|
| 商品  | object  | -         |
| 日期  | object  | -         |
| 今值  | float64 | 注意单位: 亿美元 |
| 预测值 | float64 | 注意单位: 亿美元 |
| 前值  | float64 | 注意单位: 亿美元 |

### macro_usa_current_account
- **文档定位**：美国宏观 / 贸易状况 / 美国经常帐报告
- **HTTP**：`GET /api/public/macro_usa_current_account`
- **调用**：运行 `scripts/aktools_get.py macro_usa_current_account --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_current_account

描述: 美国经常帐报告, 数据区间从 20080317-至今

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型   | 描述 |
|----|------|----|
| -  | -  - |

输出参数

| 名称  | 类型      | 描述        |
|-----|---------|-----------|
| 商品  | object  | -         |
| 日期  | object  | -         |
| 今值  | float64 | 注意单位: 亿美元 |
| 预测值 | float64 | 注意单位: 亿美元 |
| 前值  | float64 | 注意单位: 亿美元 |

### macro_usa_rig_count
- **文档定位**：美国宏观 / 产业指标 / 制造业 / 贝克休斯钻井报告
- **HTTP**：`GET /api/public/macro_usa_rig_count`
- **调用**：运行 `scripts/aktools_get.py macro_usa_rig_count --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_rig_count_summary

描述: 贝克休斯钻井报告, 数据区间从 19870717-至今

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称          | 类型      | 描述 |
|-------------|---------|----|
| 日期          | object  | -  |
| 钻井总数_钻井数    | float64 | -  |
| 钻井总数_变化     | float64 | -  |
| 美国石油钻井_钻井数  | float64 | -  |
| 美国石油钻井_变化   | float64 | -  |
| 混合钻井_钻井数    | float64 | -  |
| 混合钻井_变化     | float64 | -  |
| 美国天然气钻井_钻井数 | float64 | -  |
| 美国天然气钻井_变化  | float64 | -  |

### macro_usa_ppi
- **文档定位**：美国宏观 / 产业指标 / 制造业 / 美国生产者物价指数(PPI)报告
- **HTTP**：`GET /api/public/macro_usa_ppi`
- **调用**：运行 `scripts/aktools_get.py macro_usa_ppi --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_ppi

描述: 美国生产者物价指数(PPI)报告, 数据区间从 20080226-至今

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型   | 描述 |
|----|------|----|
| -  | -  - |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 商品  | object  | -       |
| 日期  | object  | -       |
| 今值  | float64 | 注意单位: % |
| 预测值 | float64 | 注意单位: % |
| 前值  | float64 | 注意单位: % |

### macro_usa_core_ppi
- **文档定位**：美国宏观 / 产业指标 / 制造业 / 美国核心生产者物价指数(PPI)报告
- **HTTP**：`GET /api/public/macro_usa_core_ppi`
- **调用**：运行 `scripts/aktools_get.py macro_usa_core_ppi --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_core_ppi

描述: 美国核心生产者物价指数(PPI)报告, 数据区间从 20080318-至今

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型   | 描述 |
|----|------|----|
| -  | -  - |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 商品  | object  | -       |
| 日期  | object  | -       |
| 今值  | float64 | 注意单位: % |
| 预测值 | float64 | 注意单位: % |
| 前值  | float64 | 注意单位: % |

### macro_usa_api_crude_stock
- **文档定位**：美国宏观 / 产业指标 / 制造业 / 美国 API 原油库存报告
- **HTTP**：`GET /api/public/macro_usa_api_crude_stock`
- **调用**：运行 `scripts/aktools_get.py macro_usa_api_crude_stock --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_api_crude_stock

描述: 美国 API 原油库存报告, 数据区间从 20120328-至今

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称  | 类型      | 描述       |
|-----|---------|----------|
| 商品  | object  | -        |
| 日期  | object  | -        |
| 今值  | float64 | 注意单位: 万桶 |
| 预测值 | float64 | 注意单位: 万桶 |
| 前值  | float64 | 注意单位: 万桶 |

### macro_usa_pmi
- **文档定位**：美国宏观 / 产业指标 / 制造业 / 美国Markit制造业PMI初值报告
- **HTTP**：`GET /api/public/macro_usa_pmi`
- **调用**：运行 `scripts/aktools_get.py macro_usa_pmi --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_pmi

描述: 美国 Markit 制造业 PMI 初值报告, 数据区间从 20120601-至今

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型   | 描述 |
|----|------|----|
| -  | -  - |

输出参数

| 名称  | 类型      | 描述 |
|-----|---------|----|
| 商品  | object  | -  |
| 日期  | object  | -  |
| 今值  | float64 | -  |
| 预测值 | float64 | -  |
| 前值  | float64 | -  |

### macro_usa_ism_pmi
- **文档定位**：美国宏观 / 产业指标 / 制造业 / 美国ISM制造业PMI报告
- **HTTP**：`GET /api/public/macro_usa_ism_pmi`
- **调用**：运行 `scripts/aktools_get.py macro_usa_ism_pmi --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_ism_pmi

描述: 美国 ISM 制造业 PMI 报告, 数据区间从 19700101-至今

限量: 单次返回所有历史数据

说明: 当前接口使用 Jin10 历史数据接口; 经 2026-07 校验, 该上游链路未继续提供最新数据, 返回结果可能仅更新至 2025 年附近, 不代表 AKShare 本地缓存异常

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称  | 类型      | 描述 |
|-----|---------|----|
| 商品  | object  | -  |
| 日期  | object  | -  |
| 今值  | float64 | -  |
| 预测值 | float64 | -  |
| 前值  | float64 | -  |

### macro_usa_industrial_production
- **文档定位**：美国宏观 / 产业指标 / 工业 / 美国工业产出月率报告
- **HTTP**：`GET /api/public/macro_usa_industrial_production`
- **调用**：运行 `scripts/aktools_get.py macro_usa_industrial_production --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_industrial_production

描述: 美国工业产出月率报告, 数据区间从 19700101-至今

限量: 单次返回所有历史数据

说明: 当前接口使用 Jin10 历史数据接口; 经 2026-07 校验, 该上游链路未继续提供最新数据, 返回结果可能仅更新至 2025 年附近, 不代表 AKShare 本地缓存异常

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 商品  | object  | -       |
| 日期  | object  | -       |
| 今值  | float64 | 注意单位: % |
| 预测值 | float64 | 注意单位: % |
| 前值  | float64 | 注意单位: % |

### macro_usa_durable_goods_orders
- **文档定位**：美国宏观 / 产业指标 / 工业 / 美国耐用品订单月率报告
- **HTTP**：`GET /api/public/macro_usa_durable_goods_orders`
- **调用**：运行 `scripts/aktools_get.py macro_usa_durable_goods_orders --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_durable_goods_orders

描述: 美国耐用品订单月率报告, 数据区间从 20080227-至今

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 商品  | object  | -       |
| 日期  | object  | -       |
| 今值  | float64 | 注意单位: % |
| 预测值 | float64 | 注意单位: % |
| 前值  | float64 | 注意单位: % |

### macro_usa_factory_orders
- **文档定位**：美国宏观 / 产业指标 / 工业 / 美国工厂订单月率报告
- **HTTP**：`GET /api/public/macro_usa_factory_orders`
- **调用**：运行 `scripts/aktools_get.py macro_usa_factory_orders --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_factory_orders

描述: 美国工厂订单月率报告, 数据区间从 19920401-至今

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 商品  | object  | -       |
| 日期  | object  | -       |
| 今值  | float64 | 注意单位: % |
| 预测值 | float64 | 注意单位: % |
| 前值  | float64 | 注意单位: % |

### macro_usa_services_pmi
- **文档定位**：美国宏观 / 产业指标 / 服务业 / 美国Markit服务业PMI初值报告
- **HTTP**：`GET /api/public/macro_usa_services_pmi`
- **调用**：运行 `scripts/aktools_get.py macro_usa_services_pmi --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_services_pmi

描述: 美国Markit服务业PMI初值报告, 数据区间从 20120701-至今

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称  | 类型      | 描述 |
|-----|---------|----|
| 商品  | object  | -  |
| 日期  | object  | -  |
| 今值  | float64 | -  |
| 预测值 | float64 | -  |
| 前值  | float64 | -  |

### macro_usa_business_inventories
- **文档定位**：美国宏观 / 产业指标 / 服务业 / 美国商业库存月率报告
- **HTTP**：`GET /api/public/macro_usa_business_inventories`
- **调用**：运行 `scripts/aktools_get.py macro_usa_business_inventories --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_business_inventories

描述: 美国商业库存月率报告, 数据区间从 19920301-至今

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 商品  | object  | -       |
| 日期  | object  | -       |
| 今值  | float64 | 注意单位: % |
| 预测值 | float64 | 注意单位: % |
| 前值  | float64 | 注意单位: % |

### macro_usa_ism_non_pmi
- **文档定位**：美国宏观 / 产业指标 / 服务业 / 美国ISM非制造业PMI报告
- **HTTP**：`GET /api/public/macro_usa_ism_non_pmi`
- **调用**：运行 `scripts/aktools_get.py macro_usa_ism_non_pmi --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_ism_non_pmi

描述: 美国 ISM 非制造业 PMI 报告, 数据区间从 19970801-至今

限量: 单次返回所有历史数据

说明: 当前接口使用 Jin10 历史数据接口; 经 2026-07 校验, 该上游链路未继续提供最新数据, 返回结果可能仅更新至 2025 年附近, 不代表 AKShare 本地缓存异常

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称  | 类型      | 描述 |
|-----|---------|----|
| 商品  | object  | -  |
| 日期  | object  | -  |
| 今值  | float64 | -  |
| 预测值 | float64 | -  |
| 前值  | float64 | -  |

### macro_usa_nahb_house_market_index
- **文档定位**：美国宏观 / 产业指标 / 房地产 / 美国NAHB房产市场指数报告
- **HTTP**：`GET /api/public/macro_usa_nahb_house_market_index`
- **调用**：运行 `scripts/aktools_get.py macro_usa_nahb_house_market_index --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_nahb_house_market_index

描述: 美国 NAHB 房产市场指数报告, 数据区间从 19850201-至今

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称  | 类型      | 描述 |
|-----|---------|----|
| 商品  | object  | -  |
| 日期  | object  | -  |
| 今值  | float64 | -  |
| 预测值 | float64 | -  |
| 前值  | float64 | -  |
