# 中国宏观



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### macro_cnbs
- **文档定位**：中国宏观 / 中国宏观杠杆率
- **HTTP**：`GET /api/public/macro_cnbs`
- **调用**：运行 `scripts/aktools_get.py macro_cnbs --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://114.115.232.154:8080/

描述: 中国国家金融与发展实验室-中国宏观杠杆率数据

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称      | 类型      | 描述      |
|---------|---------|---------|
| 年份      | object  | 日期, 年-月 |
| 居民部门    | float64 | -       |
| 非金融企业部门 | float64 | -       |
| 政府部门    | float64 | -       |
| 中央政府    | float64 | -       |
| 地方政府    | float64 | -       |
| 实体经济部门  | float64 | -       |
| 金融部门资产方 | float64 | -       |
| 金融部门负债方 | float64 | -       |

### macro_china_qyspjg
- **文档定位**：中国宏观 / 国民经济运行状况 / 经济状况 / 企业商品价格指数
- **HTTP**：`GET /api/public/macro_china_qyspjg`
- **调用**：运行 `scripts/aktools_get.py macro_china_qyspjg --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/cjsj/qyspjg.html

描述: 东方财富-经济数据一览-中国-企业商品价格指数, 数据区间从 20050101-至今

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称       | 类型      | 描述      |
|----------|---------|---------|
| 月份       | object  | -       |
| 总指数-指数值  | float64 | -       |
| 总指数-同比增长 | float64 | 注意单位: % |
| 总指数-环比增长 | float64 | 注意单位: % |
| 农产品-指数值  | float64 | -       |
| 农产品-同比增长 | float64 | 注意单位: % |
| 农产品-环比增长 | float64 | 注意单位: % |
| 矿产品-指数值  | float64 | -       |
| 矿产品-同比增长 | float64 | 注意单位: % |
| 矿产品-环比增长 | float64 | 注意单位: % |
| 煤油电-指数值  | float64 | -       |
| 煤油电-同比增长 | float64 | 注意单位: % |
| 煤油电-环比增长 | float64 | 注意单位: % |

### macro_china_fdi
- **文档定位**：中国宏观 / 国民经济运行状况 / 经济状况 / 外商直接投资数据
- **HTTP**：`GET /api/public/macro_china_fdi`
- **调用**：运行 `scripts/aktools_get.py macro_china_fdi --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/cjsj/fdi.html

描述: 东方财富-经济数据一览-中国-外商直接投资数据, 数据区间从 200801-202307

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称      | 类型      | 描述       |
|---------|---------|----------|
| 月份      | object  | -        |
| 当月      | int64   | -        |
| 当月-同比增长 | float64 | 注意单位: 美元 |
| 当月-环比增长 | float64 | 注意单位: %  |
| 累计      | float64 | 注意单位: 美元 |
| 累计-同比增长 | float64 | 注意单位: %  |

### macro_china_lpr
- **文档定位**：中国宏观 / 国民经济运行状况 / 经济状况 / LPR品种数据
- **HTTP**：`GET /api/public/macro_china_lpr`
- **调用**：运行 `scripts/aktools_get.py macro_china_lpr --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/cjsj/globalRateLPR.html

描述: 中国 LPR 品种数据, 数据区间从 19910421-至今

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称         | 类型      | 描述                  |
|------------|---------|---------------------|
| TRADE_DATE | object  | 日期                  |
| LPR1Y      | float64 | LPR_1Y利率(%)         |
| LPR5Y      | float64 | LPR_5Y利率(%)         |
| RATE_1     | float64 | 短期贷款利率:6个月至1年(含)(%) |
| RATE_2     | float64 | 中长期贷款利率:5年以上(%)     |

### macro_china_urban_unemployment
- **文档定位**：中国宏观 / 国民经济运行状况 / 经济状况 / 城镇调查失业率
- **HTTP**：`GET /api/public/macro_china_urban_unemployment`
- **调用**：运行 `scripts/aktools_get.py macro_china_urban_unemployment --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.stats.gov.cn/dg/website/page.html#/pc/national/monthData

描述: 国家统计局-月度数据-城镇调查失业率

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述 |
|-------|---------|----|
| date  | object  | 年月 |
| item  | object  | -  |
| value | float64 | -  |

### macro_china_shrzgm
- **文档定位**：中国宏观 / 国民经济运行状况 / 经济状况 / 社会融资规模增量统计
- **HTTP**：`GET /api/public/macro_china_shrzgm`
- **调用**：运行 `scripts/aktools_get.py macro_china_shrzgm --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.mofcom.gov.cn/gnmy/shrzgm.shtml

描述: 商务数据中心-国内贸易-社会融资规模增量统计, 数据区间从 201501-至今

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称             | 类型      | 描述              |
|----------------|---------|-----------------|
| 月份             | object  | 年月              |
| 社会融资规模增量       | float64 | 注意单位: 亿元        |
| 其中-人民币贷款       | float64 | 注意单位: 亿元        |
| 其中-委托贷款外币贷款    | float64 | 注意单位: 折合人民币, 亿元 |
| 其中-委托贷款        | float64 | 注意单位: 亿元        |
| 其中-信托贷款        | float64 | 注意单位: 亿元        |
| 其中-未贴现银行承兑汇票   | float64 | 注意单位: 亿元        |
| 其中-企业债券        | float64 | 注意单位: 亿元        |
| 其中-非金融企业境内股票融资 | float64 | 注意单位: 亿元        |

### macro_china_gdp_yearly
- **文档定位**：中国宏观 / 国民经济运行状况 / 经济状况 / 中国 GDP 年率
- **HTTP**：`GET /api/public/macro_china_gdp_yearly`
- **调用**：运行 `scripts/aktools_get.py macro_china_gdp_yearly --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_chinese_gdp_yoy

描述: 金十数据中心-中国 GDP 年率报告, 数据区间从 20110120-至今

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

### macro_china_cpi_yearly
- **文档定位**：中国宏观 / 国民经济运行状况 / 物价水平 / 中国 CPI 年率报告
- **HTTP**：`GET /api/public/macro_china_cpi_yearly`
- **调用**：运行 `scripts/aktools_get.py macro_china_cpi_yearly --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_chinese_cpi_yoy

描述: 中国年度 CPI 数据, 数据区间从 19860201-至今

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

### macro_china_cpi_monthly
- **文档定位**：中国宏观 / 国民经济运行状况 / 物价水平 / 中国 CPI 月率报告
- **HTTP**：`GET /api/public/macro_china_cpi_monthly`
- **调用**：运行 `scripts/aktools_get.py macro_china_cpi_monthly --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_chinese_cpi_mom

描述: 中国月度 CPI 数据, 数据区间从 19960201-至今

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

### macro_china_ppi_yearly
- **文档定位**：中国宏观 / 国民经济运行状况 / 物价水平 / 中国 PPI 年率报告
- **HTTP**：`GET /api/public/macro_china_ppi_yearly`
- **调用**：运行 `scripts/aktools_get.py macro_china_ppi_yearly --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_chinese_ppi_yoy

描述: 中国年度 PPI 数据, 数据区间从 19950801-至今

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

### macro_china_exports_yoy
- **文档定位**：中国宏观 / 贸易状况 / 以美元计算出口年率
- **HTTP**：`GET /api/public/macro_china_exports_yoy`
- **调用**：运行 `scripts/aktools_get.py macro_china_exports_yoy --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_chinese_exports_yoy

描述: 中国以美元计算出口年率报告, 数据区间从 19820201-至今

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

### macro_china_imports_yoy
- **文档定位**：中国宏观 / 贸易状况 / 以美元计算进口年率
- **HTTP**：`GET /api/public/macro_china_imports_yoy`
- **调用**：运行 `scripts/aktools_get.py macro_china_imports_yoy --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_chinese_imports_yoy

描述: 中国以美元计算进口年率报告, 数据区间从 19960201-至今

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

### macro_china_trade_balance
- **文档定位**：中国宏观 / 贸易状况 / 以美元计算贸易帐(亿美元)
- **HTTP**：`GET /api/public/macro_china_trade_balance`
- **调用**：运行 `scripts/aktools_get.py macro_china_trade_balance --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_chinese_trade_balance

描述: 中国以美元计算贸易帐报告, 数据区间从19810201-至今

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称  | 类型      | 描述        |
|-----|---------|-----------|
| 商品  | object  | -         |
| 日期  | object  | -         |
| 今值  | float64 | 注意单位: 亿美元 |
| 预测值 | float64 | 注意单位: 亿美元 |
| 前值  | float64 | 注意单位: 亿美元 |

### macro_china_gyzjz
- **文档定位**：中国宏观 / 产业指标 / 工业增加值增长
- **HTTP**：`GET /api/public/macro_china_gyzjz`
- **调用**：运行 `scripts/aktools_get.py macro_china_gyzjz --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/cjsj/gyzjz.html

描述: 东方财富-中国工业增加值增长, 数据区间从 2008 - 至今

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 月份   | object  | -       |
| 同比增长 | float64 | 注意单位: % |
| 累计增长 | float64 | 注意单位: % |
| 发布时间 | object  | -       |

### macro_china_industrial_production_yoy
- **文档定位**：中国宏观 / 产业指标 / 规模以上工业增加值年率
- **HTTP**：`GET /api/public/macro_china_industrial_production_yoy`
- **调用**：运行 `scripts/aktools_get.py macro_china_industrial_production_yoy --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_chinese_industrial_production_yoy

描述: 中国规模以上工业增加值年率报告, 数据区间从 19900301-至今

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

### macro_china_pmi_yearly
- **文档定位**：中国宏观 / 产业指标 / 官方制造业 PMI
- **HTTP**：`GET /api/public/macro_china_pmi_yearly`
- **调用**：运行 `scripts/aktools_get.py macro_china_pmi_yearly --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_chinese_manufacturing_pmi

描述: 中国年度PMI数据, 数据区间从 20050201-至今

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

### macro_china_cx_pmi_yearly
- **文档定位**：中国宏观 / 产业指标 / 财新制造业PMI终值
- **HTTP**：`GET /api/public/macro_china_cx_pmi_yearly`
- **调用**：运行 `scripts/aktools_get.py macro_china_cx_pmi_yearly --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_chinese_caixin_manufacturing_pmi

描述: 中国年度财新 PMI 数据, 数据区间从 20120120-至今

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

### macro_china_cx_services_pmi_yearly
- **文档定位**：中国宏观 / 产业指标 / 财新服务业PMI
- **HTTP**：`GET /api/public/macro_china_cx_services_pmi_yearly`
- **调用**：运行 `scripts/aktools_get.py macro_china_cx_services_pmi_yearly --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_chinese_caixin_services_pmi

描述: 中国财新服务业 PMI 报告, 数据区间从 20120405-至今

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

### macro_china_non_man_pmi
- **文档定位**：中国宏观 / 产业指标 / 中国官方非制造业PMI
- **HTTP**：`GET /api/public/macro_china_non_man_pmi`
- **调用**：运行 `scripts/aktools_get.py macro_china_non_man_pmi --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_chinese_non_manufacturing_pmi

描述: 中国官方非制造业 PMI, 数据区间从 20160101-至今

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

### macro_china_fx_reserves_yearly
- **文档定位**：中国宏观 / 金融指标 / 外汇储备(亿美元)
- **HTTP**：`GET /api/public/macro_china_fx_reserves_yearly`
- **调用**：运行 `scripts/aktools_get.py macro_china_fx_reserves_yearly --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_chinese_fx_reserves

描述: 中国年度外汇储备数据, 数据区间从 20140115-至今

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称  | 类型      | 描述        |
|-----|---------|-----------|
| 商品  | object  | -         |
| 日期  | object  | -         |
| 今值  | float64 | 注意单位: 亿美元 |
| 预测值 | float64 | 注意单位: 亿美元 |
| 前值  | float64 | 注意单位: 亿美元 |

### macro_china_m2_yearly
- **文档定位**：中国宏观 / 金融指标 / M2货币供应年率
- **HTTP**：`GET /api/public/macro_china_m2_yearly`
- **调用**：运行 `scripts/aktools_get.py macro_china_m2_yearly --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_chinese_m2_money_supply_yoy

描述: 中国年度 M2 数据, 数据区间从 19980201-至今

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

### macro_china_new_house_price
- **文档定位**：中国宏观 / 金融指标 / 新房价指数
- **HTTP**：`GET /api/public/macro_china_new_house_price`
- **调用**：运行 `scripts/aktools_get.py macro_china_new_house_price --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/cjsj/newhouse.html

描述: 中国新房价指数月度数据, 数据区间从 201101-至今

限量: 单次返回指定城市的所有历史数据

输入参数

| 名称          | 类型  | 描述                          |
|-------------|-----|-----------------------------|
| city_first  | str | city_first="北京"; 城市列表见目标网站  |
| city_second | str | city_second="上海"; 城市列表见目标网站 |

输出参数

| 名称            | 类型      | 描述  |
|---------------|---------|-----|
| 日期            | object  | 日期  |
| 城市            | object  | -   |
| 新建商品住宅价格指数-环比 | float64 | -   |
| 新建商品住宅价格指数-同比 | float64 | -   |
| 新建商品住宅价格指数-定基 | float64 | -   |
| 二手住宅价格指数-环比   | float64 | -   |
| 二手住宅价格指数-同比   | float64 | -   |
| 二手住宅价格指数-定基   | float64 | -   |

### macro_china_enterprise_boom_index
- **文档定位**：中国宏观 / 金融指标 / 企业景气及企业家信心指数
- **HTTP**：`GET /api/public/macro_china_enterprise_boom_index`
- **调用**：运行 `scripts/aktools_get.py macro_china_enterprise_boom_index --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/cjsj/qyjqzs.html

描述: 中国企业景气及企业家信心指数数据, 数据区间从 2005 一季度-至今

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称         | 类型      | 描述      |
|------------|---------|---------|
| 季度         | object  | 日期      |
| 企业景气指数-指数  | float64 | -       |
| 企业景气指数-同比  | float64 | 注意单位: % |
| 企业景气指数-环比  | float64 | 注意单位: % |
| 企业家信心指数-指数 | float64 | -       |
| 企业家信心指数-同比 | float64 | 注意单位: % |
| 企业家信心指数-环比 | float64 | 注意单位: % |

### macro_china_national_tax_receipts
- **文档定位**：中国宏观 / 金融指标 / 全国税收收入
- **HTTP**：`GET /api/public/macro_china_national_tax_receipts`
- **调用**：运行 `scripts/aktools_get.py macro_china_national_tax_receipts --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/cjsj/nationaltaxreceipts.aspx

描述: 中国全国税收收入数据, 数据区间从 2005 一季度-至今

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述       |
|--------|---------|----------|
| 季度     | object  | 日期       |
| 税收收入合计 | float64 | 注意单位: 亿元 |
| 较上年同期  | float64 | 注意单位: %  |
| 季度环比   | float64 | -        |

### macro_china_bank_financing
- **文档定位**：中国宏观 / 金融指标 / 银行理财产品发行数量
- **HTTP**：`GET /api/public/macro_china_bank_financing`
- **调用**：运行 `scripts/aktools_get.py macro_china_bank_financing --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/cjsj/hyzs_list_EMI01516267.html

描述: 银行理财产品发行数量, 数据区间从 2000 一月-至今

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| 日期     | object  | -       |
| 最新值    | int64   | -       |
| 涨跌幅    | float64 | 注意单位: % |
| 近3月涨跌幅 | float64 | 注意单位: % |
| 近6月涨跌幅 | float64 | 注意单位: % |
| 近1年涨跌幅 | float64 | 注意单位: % |
| 近2年涨跌幅 | float64 | 注意单位: % |
| 近3年涨跌幅 | float64 | 注意单位: % |

### macro_china_insurance_income
- **文档定位**：中国宏观 / 金融指标 / 原保险保费收入
- **HTTP**：`GET /api/public/macro_china_insurance_income`
- **调用**：运行 `scripts/aktools_get.py macro_china_insurance_income --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/cjsj/hyzs_list_EMM00088870.html

描述: 原保险保费收入, 数据区间从 200407-至今

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| 日期     | object  | -       |
| 最新值    | int64   | -       |
| 涨跌幅    | float64 | 注意单位: % |
| 近3月涨跌幅 | float64 | 注意单位: % |
| 近6月涨跌幅 | float64 | 注意单位: % |
| 近1年涨跌幅 | float64 | 注意单位: % |
| 近2年涨跌幅 | float64 | 注意单位: % |
| 近3年涨跌幅 | float64 | 注意单位: % |

### macro_china_mobile_number
- **文档定位**：中国宏观 / 金融指标 / 手机出货量
- **HTTP**：`GET /api/public/macro_china_mobile_number`
- **调用**：运行 `scripts/aktools_get.py macro_china_mobile_number --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/cjsj/hyzs_list_EMI00225823.html

描述: 手机出货量, 数据区间从 201201-至今

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| 日期     | object  | -       |
| 最新值    | int64   | -       |
| 涨跌幅    | float64 | 注意单位: % |
| 近3月涨跌幅 | float64 | 注意单位: % |
| 近6月涨跌幅 | float64 | 注意单位: % |
| 近1年涨跌幅 | float64 | 注意单位: % |
| 近2年涨跌幅 | float64 | 注意单位: % |
| 近3年涨跌幅 | float64 | 注意单位: % |

### macro_china_vegetable_basket
- **文档定位**：中国宏观 / 金融指标 / 菜篮子产品批发价格指数
- **HTTP**：`GET /api/public/macro_china_vegetable_basket`
- **调用**：运行 `scripts/aktools_get.py macro_china_vegetable_basket --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/cjsj/hyzs_list_EMI00009275.html

描述: 菜篮子产品批发价格指数, 数据区间从 20050927-至今

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| 日期     | object  | -       |
| 最新值    | int64   | -       |
| 涨跌幅    | float64 | 注意单位: % |
| 近3月涨跌幅 | float64 | 注意单位: % |
| 近6月涨跌幅 | float64 | 注意单位: % |
| 近1年涨跌幅 | float64 | 注意单位: % |
| 近2年涨跌幅 | float64 | 注意单位: % |
| 近3年涨跌幅 | float64 | 注意单位: % |

### macro_china_agricultural_product
- **文档定位**：中国宏观 / 金融指标 / 农产品批发价格总指数
- **HTTP**：`GET /api/public/macro_china_agricultural_product`
- **调用**：运行 `scripts/aktools_get.py macro_china_agricultural_product --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/cjsj/hyzs_list_EMI00009274.html

描述: 农产品批发价格总指数, 数据区间从 20050927-至今

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| 日期     | object  | -       |
| 最新值    | int64   | -       |
| 涨跌幅    | float64 | 注意单位: % |
| 近3月涨跌幅 | float64 | 注意单位: % |
| 近6月涨跌幅 | float64 | 注意单位: % |
| 近1年涨跌幅 | float64 | 注意单位: % |
| 近2年涨跌幅 | float64 | 注意单位: % |
| 近3年涨跌幅 | float64 | 注意单位: % |

### macro_china_agricultural_index
- **文档定位**：中国宏观 / 金融指标 / 农副指数
- **HTTP**：`GET /api/public/macro_china_agricultural_index`
- **调用**：运行 `scripts/aktools_get.py macro_china_agricultural_index --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/cjsj/hyzs_list_EMI00662543.html

描述: 农副指数数据, 数据区间从 20111205-至今

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| 日期     | object  | -       |
| 最新值    | int64   | -       |
| 涨跌幅    | float64 | 注意单位: % |
| 近3月涨跌幅 | float64 | 注意单位: % |
| 近6月涨跌幅 | float64 | 注意单位: % |
| 近1年涨跌幅 | float64 | 注意单位: % |
| 近2年涨跌幅 | float64 | 注意单位: % |
| 近3年涨跌幅 | float64 | 注意单位: % |
