# 中国香港宏观



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### macro_china_hk_cpi
- **文档定位**：中国香港宏观 / 消费者物价指数
- **HTTP**：`GET /api/public/macro_china_hk_cpi`
- **调用**：运行 `scripts/aktools_get.py macro_china_hk_cpi --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/cjsj/foreign_8_0.html

描述: 东方财富-经济数据一览-中国香港-消费者物价指数

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称   | 类型      | 描述  |
|------|---------|-----|
| 时间   | object  | -   |
| 前值   | float64 | -   |
| 现值   | float64 | -   |
| 发布日期 | object  | -   |

### macro_china_hk_cpi_ratio
- **文档定位**：中国香港宏观 / 消费者物价指数年率
- **HTTP**：`GET /api/public/macro_china_hk_cpi_ratio`
- **调用**：运行 `scripts/aktools_get.py macro_china_hk_cpi_ratio --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/cjsj/foreign_8_1.html

描述: 东方财富-经济数据一览-中国香港-消费者物价指数年率

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 时间   | object  | -       |
| 前值   | float64 | 注意单位: % |
| 现值   | float64 | 注意单位: % |
| 发布日期 | object  | -       |

### macro_china_hk_rate_of_unemployment
- **文档定位**：中国香港宏观 / 失业率
- **HTTP**：`GET /api/public/macro_china_hk_rate_of_unemployment`
- **调用**：运行 `scripts/aktools_get.py macro_china_hk_rate_of_unemployment --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/cjsj/foreign_8_2.html

描述: 东方财富-经济数据一览-中国香港-失业率

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 时间   | object  | -       |
| 前值   | float64 | 注意单位: % |
| 现值   | float64 | 注意单位: % |
| 发布日期 | object  | -       |

### macro_china_hk_gbp
- **文档定位**：中国香港宏观 / GDP
- **HTTP**：`GET /api/public/macro_china_hk_gbp`
- **调用**：运行 `scripts/aktools_get.py macro_china_hk_gbp --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/cjsj/foreign_8_3.html

描述: 东方财富-经济数据一览-中国香港-香港 GDP

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称   | 类型      | 描述        |
|------|---------|-----------|
| 时间   | object  | -         |
| 前值   | float64 | 注意单位: 亿港元 |
| 现值   | float64 | 注意单位: 亿港元 |
| 发布日期 | object  | -         |

### macro_china_hk_gbp_ratio
- **文档定位**：中国香港宏观 / GDP 同比
- **HTTP**：`GET /api/public/macro_china_hk_gbp_ratio`
- **调用**：运行 `scripts/aktools_get.py macro_china_hk_gbp_ratio --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/cjsj/foreign_8_4.html

描述: 东方财富-经济数据一览-中国香港-香港 GDP 同比

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 时间   | object  | -       |
| 前值   | float64 | 注意单位: % |
| 现值   | float64 | 注意单位: % |
| 发布日期 | object  | -       |

### macro_china_hk_building_volume
- **文档定位**：中国香港宏观 / 香港楼宇买卖合约数量
- **HTTP**：`GET /api/public/macro_china_hk_building_volume`
- **调用**：运行 `scripts/aktools_get.py macro_china_hk_building_volume --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/cjsj/foreign_8_5.html

描述: 东方财富-经济数据一览-中国香港-香港楼宇买卖合约数量

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称   | 类型      | 描述  |
|------|---------|-----|
| 时间   | object  | -   |
| 前值   | float64 | -   |
| 现值   | float64 | -   |
| 发布日期 | object  | -   |

### macro_china_hk_building_amount
- **文档定位**：中国香港宏观 / 香港楼宇买卖合约成交金额
- **HTTP**：`GET /api/public/macro_china_hk_building_amount`
- **调用**：运行 `scripts/aktools_get.py macro_china_hk_building_amount --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/cjsj/foreign_8_6.html

描述: 东方财富-经济数据一览-中国香港-香港楼宇买卖合约成交金额

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称   | 类型      | 描述        |
|------|---------|-----------|
| 时间   | object  | -         |
| 前值   | float64 | 注意单位: 亿港元 |
| 现值   | float64 | 注意单位: 亿港元 |
| 发布日期 | object  | -         |

### macro_china_hk_trade_diff_ratio
- **文档定位**：中国香港宏观 / 香港商品贸易差额年率
- **HTTP**：`GET /api/public/macro_china_hk_trade_diff_ratio`
- **调用**：运行 `scripts/aktools_get.py macro_china_hk_trade_diff_ratio --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/cjsj/foreign_8_7.html

描述: 东方财富-经济数据一览-中国香港-香港商品贸易差额年率

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 时间   | object  | -       |
| 前值   | float64 | 注意单位: % |
| 现值   | float64 | 注意单位: % |
| 发布日期 | object  | -       |

### macro_china_hk_ppi
- **文档定位**：中国香港宏观 / 香港制造业 PPI 年率
- **HTTP**：`GET /api/public/macro_china_hk_ppi`
- **调用**：运行 `scripts/aktools_get.py macro_china_hk_ppi --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/cjsj/foreign_8_8.html

描述: 东方财富-经济数据一览-中国香港-香港制造业PPI年率

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
