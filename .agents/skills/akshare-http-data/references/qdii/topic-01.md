# 其他细分主题



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### qdii_a_index_jsl
- **文档定位**：T+0 QDII 亚洲市场 / 亚洲指数
- **HTTP**：`GET /api/public/qdii_a_index_jsl`
- **调用**：运行 `scripts/aktools_get.py qdii_a_index_jsl --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.jisilu.cn/data/qdii/#qdiia

描述: 集思录-T+0 QDII-亚洲市场-亚洲指数

限量: 单次返回所有数据

输入参数

| 名称     | 类型  | 描述                |
|--------|-----|-------------------|
| cookie | str | 需要传入用户登录后的 cookie |

输出参数

| 名称   | 类型      | 描述       |
|------|---------|----------|
| 代码   | object  |          |
| 名称   | object  |          |
| 现价   | float64 |          |
| 涨幅   | object  |          |
| 成交   | float64 | 注意单位: 万元 |
| 场内份额 | int64   | 注意单位: 万份 |
| 场内新增 | int64   | 注意单位: 万份 |
| 净值   | float64 |          |
| 净值日期 | object  |          |
| 估值   | float64 |          |
| 溢价率  | object  |          |
| 相关标的 | object  |          |
| 指数涨幅 | object  |          |
| 申购费  | object  |          |
| 赎回费  | object  |          |
| 托管费  | float64 |          |
| 基金公司 | object  |          |

### qdii_e_index_jsl
- **文档定位**：T+0 QDII 欧美市场 / 欧美指数
- **HTTP**：`GET /api/public/qdii_e_index_jsl`
- **调用**：运行 `scripts/aktools_get.py qdii_e_index_jsl --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.jisilu.cn/data/qdii/#qdiia

描述: 集思录-T+0 QDII-欧美市场-欧美指数

限量: 单次返回所有数据

输入参数

| 名称     | 类型  | 描述                |
|--------|-----|-------------------|
| cookie | str | 需要传入用户登录后的 cookie |

输出参数

| 名称      | 类型      | 描述       |
|---------|---------|----------|
| 代码      | object  |          |
| 名称      | object  |          |
| 现价      | float64 |          |
| 涨幅      | object  |          |
| 成交      | float64 | 注意单位: 万元 |
| 场内份额    | int64   | 注意单位: 万份 |
| 场内新增    | int64   | 注意单位: 万份 |
| T-2净值   | float64 |          |
| 净值日期    | object  |          |
| T-1估值   | float64 |          |
| 估值日期    | object  |          |
| T-1溢价率  | object  |          |
| 相关标的    | object  |          |
| T-1指数涨幅 | object  |          |
| 申购费     | object  |          |
| 赎回费     | object  |          |
| 托管费     | float64 |          |
| 基金公司    | object  |          |

### qdii_e_comm_jsl
- **文档定位**：T+0 QDII 欧美市场 / 欧美商品
- **HTTP**：`GET /api/public/qdii_e_comm_jsl`
- **调用**：运行 `scripts/aktools_get.py qdii_e_comm_jsl --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.jisilu.cn/data/qdii/#qdiia

描述: 集思录-T+0 QDII-欧美市场-欧美商品

限量: 单次返回所有数据

输入参数

| 名称     | 类型  | 描述                |
|--------|-----|-------------------|
| cookie | str | 需要传入用户登录后的 cookie |

输出参数

| 名称      | 类型      | 描述       |
|---------|---------|----------|
| 代码      | object  |          |
| 名称      | object  |          |
| 现价      | float64 |          |
| 涨幅      | object  |          |
| 成交      | float64 | 注意单位: 万元 |
| 场内份额    | int64   | 注意单位: 万份 |
| 场内新增    | int64   | 注意单位: 万份 |
| T-2净值   | float64 |          |
| 净值日期    | object  |          |
| T-1估值   | float64 |          |
| 估值日期    | object  |          |
| T-1溢价率  | object  |          |
| 相关标的    | object  |          |
| T-1指数涨幅 | object  |          |
| 申购费     | object  |          |
| 赎回费     | object  |          |
| 托管费     | float64 |          |
| 基金公司    | object  |          |
