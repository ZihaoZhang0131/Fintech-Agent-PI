# 股票质押



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### stock_gpzy_profile_em
- **文档定位**：股票质押 / 股权质押市场概况
- **HTTP**：`GET /api/public/stock_gpzy_profile_em`
- **调用**：运行 `scripts/aktools_get.py stock_gpzy_profile_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/gpzy/marketProfile.aspx

描述: 东方财富网-数据中心-特色数据-股权质押-股权质押市场概况

限量: 单次所有历史数据, 由于数据量比较大需要等待一定时间

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称      | 类型      | 描述      |
|---------|---------|---------|
| 交易日期    | object  | -       |
| A股质押总比例 | float64 | 注意单位: % |
| 质押公司数量  | float64 | -       |
| 质押笔数    | float64 | 注意单位: 笔 |
| 质押总股数   | float64 | 注意单位: 股 |
| 质押总市值   | float64 | 注意单位: 元 |
| 沪深300指数 | float64 | -       |
| 涨跌幅     | float64 | 注意单位: % |

### stock_gpzy_pledge_ratio_em
- **文档定位**：股票质押 / 上市公司质押比例
- **HTTP**：`GET /api/public/stock_gpzy_pledge_ratio_em`
- **调用**：运行 `scripts/aktools_get.py stock_gpzy_pledge_ratio_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/gpzy/pledgeRatio.aspx

描述: 东方财富网-数据中心-特色数据-股权质押-上市公司质押比例

限量: 单次返回指定交易日的所有历史数据; 其中的交易日需要根据网站提供的为准; 请访问 http://data.eastmoney.com/gpzy/pledgeRatio.aspx 查询具体交易日

输入参数

| 名称   | 类型  | 描述                                                                           |
|------|-----|------------------------------------------------------------------------------|
| date | str | date="20240906"; 请访问 http://data.eastmoney.com/gpzy/pledgeRatio.aspx 查询具体交易日 |

输出参数

| 名称      | 类型      | 描述       |
|---------|---------|----------|
| 序号      | int64   | -        |
| 股票代码    | object  | -        |
| 股票简称    | object  | -        |
| 交易日期    | object  | -        |
| 所属行业    | object  | -        |
| 质押比例    | float64 | 注意单位: %  |
| 质押股数    | float64 | 注意单位: 万股 |
| 质押市值    | float64 | 注意单位: 万元 |
| 质押笔数    | float64 | -        |
| 无限售股质押数 | float64 | 注意单位: 万股 |
| 限售股质押数  | float64 | 注意单位: 万股 |
| 近一年涨跌幅  | float64 | 注意单位: %  |
| 所属行业代码  | object  | -        |

### stock_gpzy_pledge_ratio_detail_em
- **文档定位**：股票质押 / 重要股东股权质押明细
- **HTTP**：`GET /api/public/stock_gpzy_pledge_ratio_detail_em`
- **调用**：运行 `scripts/aktools_get.py stock_gpzy_pledge_ratio_detail_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/gpzy/pledgeDetail.aspx

描述: 东方财富网-数据中心-特色数据-股权质押-重要股东股权质押明细

限量: 单次所有历史数据, 由于数据量比较大需要等待一定时间

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称      | 类型      | 描述      |
|---------|---------|---------|
| 序号      | int64   | -       |
| 股票代码    | object  | -       |
| 股票简称    | object  | -       |
| 股东名称    | object  | -       |
| 质押股份数量  | float64 | 注意单位: 股 |
| 占所持股份比例 | float64 | 注意单位: % |
| 占总股本比例  | float64 | 注意单位: % |
| 质押机构    | object  | -       |
| 最新价     | float64 | 注意单位: 元 |
| 质押日收盘价  | float64 | 注意单位: 元 |
| 预估平仓线   | float64 | 注意单位: 元 |
| 公告日期    | object  | -       |
| 质押开始日期  | object  | -       |
| 质押结束日期  | object  | -       |
| 状态      | object  | -       |

### stock_gpzy_individual_pledge_ratio_detail_em
- **文档定位**：股票质押 / 个股重要股东股权质押明细
- **HTTP**：`GET /api/public/stock_gpzy_individual_pledge_ratio_detail_em`
- **调用**：运行 `scripts/aktools_get.py stock_gpzy_individual_pledge_ratio_detail_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/gpzy/detail/{symbol}.html

描述: 东方财富网-数据中心-股权质押-个股

限量: 单次所有历史数据

输入参数

| 名称     | 类型  | 描述              |
|--------|-----|-----------------|
| symbol | str | symbol="603132" |

输出参数

| 名称      | 类型      | 描述      |
|---------|---------|---------|
| 序号      | int64   | -       |
| 股票代码    | object  | -       |
| 股票简称    | object  | -       |
| 股东名称    | object  | -       |
| 质押股份数量  | float64 | 注意单位: 股 |
| 占所持股份比例 | float64 | 注意单位: % |
| 占总股本比例  | float64 | 注意单位: % |
| 质押机构    | object  | -       |
| 最新价     | float64 | 注意单位: 元 |
| 质押日收盘价  | float64 | 注意单位: 元 |
| 预估平仓线   | float64 | 注意单位: 元 |
| 公告日期    | object  | -       |
| 质押开始日期  | object  | -       |
| 质押结束日期  | object  | -       |
| 状态      | object  | -       |

### stock_gpzy_distribute_statistics_company_em
- **文档定位**：股票质押 / 质押机构分布统计-证券公司
- **HTTP**：`GET /api/public/stock_gpzy_distribute_statistics_company_em`
- **调用**：运行 `scripts/aktools_get.py stock_gpzy_distribute_statistics_company_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/gpzy/distributeStatistics.aspx

描述: 东方财富网-数据中心-特色数据-股权质押-质押机构分布统计-证券公司

限量: 单次返回当前时点所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称           | 类型      | 描述      |
|--------------|---------|---------|
| 序号           | int64   | -       |
| 质押机构         | object  | -       |
| 质押公司数量       | int64   | -       |
| 质押笔数         | int64   | -       |
| 质押数量         | float64 | 注意单位: 股 |
| 未达预警线比例      | float64 | 注意单位: % |
| 达到预警线未达平仓线比例 | float64 | 注意单位: % |
| 达到平仓线比例      | float64 | 注意单位: % |

### stock_gpzy_distribute_statistics_bank_em
- **文档定位**：股票质押 / 质押机构分布统计-银行
- **HTTP**：`GET /api/public/stock_gpzy_distribute_statistics_bank_em`
- **调用**：运行 `scripts/aktools_get.py stock_gpzy_distribute_statistics_bank_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/gpzy/distributeStatistics.aspx

描述: 东方财富网-数据中心-特色数据-股权质押-质押机构分布统计-银行

限量: 单次返回当前时点所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称           | 类型      | 描述      |
|--------------|---------|---------|
| 序号           | int64   | -       |
| 质押机构         | object  | -       |
| 质押公司数量       | int64   | -       |
| 质押笔数         | int64   | -       |
| 质押数量         | float64 | 注意单位: 股 |
| 未达预警线比例      | float64 | 注意单位: % |
| 达到预警线未达平仓线比例 | float64 | 注意单位: % |
| 达到平仓线比例      | float64 | 注意单位: % |

### stock_gpzy_industry_data_em
- **文档定位**：股票质押 / 上市公司质押比例
- **HTTP**：`GET /api/public/stock_gpzy_industry_data_em`
- **调用**：运行 `scripts/aktools_get.py stock_gpzy_industry_data_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/gpzy/industryData.aspx

描述: 东方财富网-数据中心-特色数据-股权质押-上市公司质押比例-行业数据

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| 行业     | object  | -       |
| 平均质押比例 | float64 | 注意单位: % |
| 公司家数   | float64 | -       |
| 质押总笔数  | float64 | -       |
| 质押总股本  | float64 | -       |
| 最新质押市值 | float64 | -       |
| 统计时间   | object  | -       |
