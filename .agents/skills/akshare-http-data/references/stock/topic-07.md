# 商誉专题



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### stock_sy_profile_em
- **文档定位**：商誉专题 / A股商誉市场概况
- **HTTP**：`GET /api/public/stock_sy_profile_em`
- **调用**：运行 `scripts/aktools_get.py stock_sy_profile_em --param key=value`；参数以本卡的输入参数表为准。

目标地址:  https://data.eastmoney.com/sy/scgk.html

描述: 东方财富网-数据中心-特色数据-商誉-A股商誉市场概况

限量: 单次所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称         | 类型      | 描述      |
|------------|---------|---------|
| 报告期        | object  | -       |
| 商誉         | float64 | 注意单位: 元 |
| 商誉减值       | float64 | 注意单位: 元 |
| 净资产        | float64 | 注意单位: 元 |
| 商誉占净资产比例   | float64 | -       |
| 商誉减值占净资产比例 | float64 | -       |
| 净利润规模      | float64 | 注意单位: 元 |
| 商誉减值占净利润比例 | float64 | -       |

### stock_sy_yq_em
- **文档定位**：商誉专题 / 商誉减值预期明细
- **HTTP**：`GET /api/public/stock_sy_yq_em`
- **调用**：运行 `scripts/aktools_get.py stock_sy_yq_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/sy/yqlist.html

描述: 东方财富网-数据中心-特色数据-商誉-商誉减值预期明细

限量: 单次所有历史数据

输入参数

| 名称   | 类型  | 描述                      |
|------|-----|-------------------------|
| date | str | date="20221231"; 参见网页选项 |

输出参数

| 名称        | 类型      | 描述      |
|-----------|---------|---------|
| 序号        | int64   | -       |
| 股票代码      | object  | -       |
| 股票简称      | object  | -       |
| 业绩变动原因    | object  | -       |
| 最新商誉报告期   | object  | -       |
| 最新一期商誉    | float64 | 主要单位: 元 |
| 上年商誉      | float64 | 主要单位: 元 |
| 预计净利润-下限  | int64   | 主要单位: 元 |
| 预计净利润-上限  | int64   | 主要单位: 元 |
| 业绩变动幅度-下限 | float64 | 主要单位: % |
| 业绩变动幅度-上限 | float64 | 主要单位: % |
| 上年度同期净利润  | float64 | 主要单位: 元 |
| 公告日期      | object  | -       |
| 交易市场      | object  | -       |

### stock_sy_jz_em
- **文档定位**：商誉专题 / 个股商誉减值明细
- **HTTP**：`GET /api/public/stock_sy_jz_em`
- **调用**：运行 `scripts/aktools_get.py stock_sy_jz_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/sy/jzlist.html

描述: 东方财富网-数据中心-特色数据-商誉-个股商誉减值明细

限量: 单次返回所有历史数据

输入参数

| 名称   | 类型  | 描述                      |
|------|-----|-------------------------|
| date | str | date="20230331"; 参见网页选项 |

输出参数

| 名称         | 类型      | 描述      |
|------------|---------|---------|
| 序号         | int64   | -       |
| 股票代码       | object  | -       |
| 股票简称       | object  | -       |
| 商誉         | float64 | 注意单位: 元 |
| 商誉减值       | float64 | 注意单位: 元 |
| 商誉减值占净资产比例 | float64 | -       |
| 净利润        | float64 | 注意单位: 元 |
| 商誉减值占净利润比例 | float64 | -       |
| 公告日期       | object  | -       |
| 交易市场       | object  | -       |

### stock_sy_em
- **文档定位**：商誉专题 / 个股商誉明细
- **HTTP**：`GET /api/public/stock_sy_em`
- **调用**：运行 `scripts/aktools_get.py stock_sy_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/sy/list.html

描述: 东方财富网-数据中心-特色数据-商誉-个股商誉明细

限量: 单次返回所有历史数据

输入参数

| 名称   | 类型  | 描述                      |
|------|-----|-------------------------|
| date | str | date="20240630"; 参见网页选项 |

输出参数

| 名称       | 类型      | 描述      |
|----------|---------|---------|
| 序号       | int64   | -       |
| 股票代码     | object  | -       |
| 股票简称     | object  | -       |
| 商誉       | float64 | 注意单位: 元 |
| 商誉占净资产比例 | float64 |         |
| 净利润      | float64 | 注意单位: 元 |
| 净利润同比    | float64 |         |
| 上年商誉     | float64 | 注意单位: 元 |
| 公告日期     | object  | -       |
| 交易市场     | object  | -       |

### stock_sy_hy_em
- **文档定位**：商誉专题 / 行业商誉
- **HTTP**：`GET /api/public/stock_sy_hy_em`
- **调用**：运行 `scripts/aktools_get.py stock_sy_hy_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/sy/hylist.html

描述: 东方财富网-数据中心-特色数据-商誉-行业商誉

限量: 单次返回所有历史数据

输入参数

| 名称   | 类型  | 描述                      |
|------|-----|-------------------------|
| date | str | date="20240930"; 参见网页选项 |

输出参数

| 名称           | 类型      | 描述 |
|--------------|---------|----|
| 行业名称         | object  | -  |
| 公司家数         | int64   | -  |
| 商誉规模         | float64 | -  |
| 净资产          | float64 | -  |
| 商誉规模占净资产规模比例 | float64 | -  |
| 净利润规模        | float64 | -  |
