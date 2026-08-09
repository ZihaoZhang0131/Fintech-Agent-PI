# 美国宏观



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### macro_usa_house_starts
- **文档定位**：美国宏观 / 产业指标 / 房地产 / 美国新屋开工总数年化报告
- **HTTP**：`GET /api/public/macro_usa_house_starts`
- **调用**：运行 `scripts/aktools_get.py macro_usa_house_starts --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_house_starts

描述: 美国新屋开工总数年化报告, 数据区间从 19700101-至今

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
| 今值  | float64 | 注意单位: 万户 |
| 预测值 | float64 | 注意单位: 万户 |
| 前值  | float64 | 注意单位: 万户 |

### macro_usa_new_home_sales
- **文档定位**：美国宏观 / 产业指标 / 房地产 / 美国新屋销售总数年化报告
- **HTTP**：`GET /api/public/macro_usa_new_home_sales`
- **调用**：运行 `scripts/aktools_get.py macro_usa_new_home_sales --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_new_home_sales

描述: 美国新屋销售总数年化报告, 数据区间从 19700101-至今

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
| 今值  | float64 | 注意单位: 万户 |
| 预测值 | float64 | 注意单位: 万户 |
| 前值  | float64 | 注意单位: 万户 |

### macro_usa_building_permits
- **文档定位**：美国宏观 / 产业指标 / 房地产 / 美国营建许可总数报告
- **HTTP**：`GET /api/public/macro_usa_building_permits`
- **调用**：运行 `scripts/aktools_get.py macro_usa_building_permits --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_building_permits

描述: 美国营建许可总数报告, 数据区间从 20080220-至今

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
| 今值  | float64 | 注意单位: 万户 |
| 预测值 | float64 | 注意单位: 万户 |
| 前值  | float64 | 注意单位: 万户 |

### macro_usa_exist_home_sales
- **文档定位**：美国宏观 / 产业指标 / 房地产 / 美国成屋销售总数年化报告
- **HTTP**：`GET /api/public/macro_usa_exist_home_sales`
- **调用**：运行 `scripts/aktools_get.py macro_usa_exist_home_sales --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_exist_home_sales

描述: 美国成屋销售总数年化报告, 数据区间从 19700101-至今

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
| 今值  | float64 | 注意单位: 万户 |
| 预测值 | float64 | 注意单位: 万户 |
| 前值  | float64 | 注意单位: 万户 |

### macro_usa_house_price_index
- **文档定位**：美国宏观 / 产业指标 / 房地产 / 美国FHFA房价指数月率报告
- **HTTP**：`GET /api/public/macro_usa_house_price_index`
- **调用**：运行 `scripts/aktools_get.py macro_usa_house_price_index --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_house_price_index

描述: 美国 FHFA 房价指数月率报告, 数据区间从 19910301-至今

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

### macro_usa_spcs20
- **文档定位**：美国宏观 / 产业指标 / 房地产 / 美国S&P/CS20座大城市房价指数年率报告
- **HTTP**：`GET /api/public/macro_usa_spcs20`
- **调用**：运行 `scripts/aktools_get.py macro_usa_spcs20 --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_spcs20

描述: 美国S&P/CS20座大城市房价指数年率报告, 数据区间从 20010201-至今

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

### macro_usa_pending_home_sales
- **文档定位**：美国宏观 / 产业指标 / 房地产 / 美国成屋签约销售指数月率报告
- **HTTP**：`GET /api/public/macro_usa_pending_home_sales`
- **调用**：运行 `scripts/aktools_get.py macro_usa_pending_home_sales --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_usa_pending_home_sales

描述: 美国成屋签约销售指数月率报告, 数据区间从 20010301-至今

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

### macro_usa_phs
- **文档定位**：美国宏观 / 领先指标 / 未决房屋销售月率
- **HTTP**：`GET /api/public/macro_usa_phs`
- **调用**：运行 `scripts/aktools_get.py macro_usa_phs --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/cjsj/foreign_0_5.html

描述: 东方财富-经济数据一览-美国-未决房屋销售月率, 数据区间从 20080201-至今

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

### macro_usa_cb_consumer_confidence
- **文档定位**：美国宏观 / 领先指标 / 美国谘商会消费者信心指数报告
- **HTTP**：`GET /api/public/macro_usa_cb_consumer_confidence`
- **调用**：运行 `scripts/aktools_get.py macro_usa_cb_consumer_confidence --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://cdn.jin10.com/dc/reports/dc_usa_cb_consumer_confidence_all.js?v=1578576859

描述: 美国谘商会消费者信心指数报告, 数据区间从 19700101-至今

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

### macro_usa_nfib_small_business
- **文档定位**：美国宏观 / 领先指标 / 美国NFIB小型企业信心指数报告
- **HTTP**：`GET /api/public/macro_usa_nfib_small_business`
- **调用**：运行 `scripts/aktools_get.py macro_usa_nfib_small_business --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://cdn.jin10.com/dc/reports/dc_usa_nfib_small_business_all.js?v=1578576631

描述: 美国NFIB小型企业信心指数报告, 数据区间从 19750201-至今

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

### macro_usa_michigan_consumer_sentiment
- **文档定位**：美国宏观 / 领先指标 / 美国密歇根大学消费者信心指数初值报告
- **HTTP**：`GET /api/public/macro_usa_michigan_consumer_sentiment`
- **调用**：运行 `scripts/aktools_get.py macro_usa_michigan_consumer_sentiment --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://cdn.jin10.com/dc/reports/dc_usa_michigan_consumer_sentiment_all.js?v=1578576228

描述: 美国密歇根大学消费者信心指数初值报告, 数据区间从 19700301-至今

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

### macro_usa_eia_crude_rate
- **文档定位**：美国宏观 / 其他 / 美国EIA原油库存报告
- **HTTP**：`GET /api/public/macro_usa_eia_crude_rate`
- **调用**：运行 `scripts/aktools_get.py macro_usa_eia_crude_rate --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://cdn.jin10.com/dc/reports/dc_usa_michigan_consumer_sentiment_all.js?v=1578576228

描述: 美国EIA原油库存报告, 数据区间从 19950801-至今

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

### macro_usa_initial_jobless
- **文档定位**：美国宏观 / 其他 / 美国初请失业金人数报告
- **HTTP**：`GET /api/public/macro_usa_initial_jobless`
- **调用**：运行 `scripts/aktools_get.py macro_usa_initial_jobless --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://cdn.jin10.com/dc/reports/dc_usa_michigan_consumer_sentiment_all.js?v=1578576228

描述: 美国初请失业金人数报告, 数据区间从 19700101-至今

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
| 今值  | float64 | 注意单位: 万人 |
| 预测值 | float64 | 注意单位: 万人 |
| 前值  | float64 | 注意单位: 万人 |

### macro_usa_crude_inner
- **文档定位**：美国宏观 / 其他 / 美国原油产量报告
- **HTTP**：`GET /api/public/macro_usa_crude_inner`
- **调用**：运行 `scripts/aktools_get.py macro_usa_crude_inner --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_eia_crude_oil_produce

描述: 美国原油产量报告, 数据区间从 19830107-至今, 每周三公布(美国节假日除外), 美国能源信息署(EIA)

限量: 单次返回所有历史数据

1. 报告内容: 美国能源信息署（EIA）在北京时间每周三晚公布EIA报告，除了公布美国原油库存、汽油库存等数据外，报告还包含美国上周国内原油产量的数据。
2. 报告组成：美国国内原油产量、美国本土48州原油产量和美国阿拉斯加州原油产量。
3. 数据关系：美国国内原油产量=美国本土48州原油产量+美国阿拉斯加州原油产量 单位均为万桶/日。
4. 数据解读: 该数据反映了美国原油供应侧的情况，理论而言，当美国国内原油产量录得增加，通常导致油价下跌；当产量减少，则通常导致油价上扬。

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称             | 类型      | 描述 |
|----------------|---------|----|
| 日期             | object  | -  |
| 美国国内原油总量-产量    | float64 | -  |
| 美国国内原油总量-变化    | float64 | -  |
| 美国本土48州原油产量-产量 | float64 | -  |
| 美国本土48州原油产量-变化 | float64 | -  |
| 美国阿拉斯加州原油产量-产量 | float64 | -  |
| 美国阿拉斯加州原油产量-变化 | float64 | -  |
