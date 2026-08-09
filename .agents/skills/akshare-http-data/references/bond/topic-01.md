# 中债指数



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### bond_new_composite_index_cbond
- **文档定位**：中债指数 / 总指数 / 综合类指数 / 新综合指数
- **HTTP**：`GET /api/public/bond_new_composite_index_cbond`
- **调用**：运行 `scripts/aktools_get.py bond_new_composite_index_cbond --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://yield.chinabond.com.cn/cbweb-mn/indices/single_index_query

描述: 中国债券信息网-中债指数-中债指数族系-总指数-综合类指数-中债-新综合指数

输入参数

| 名称        | 类型  | 描述                                                                                                                                                                                                       |
|-----------|-----|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| indicator | str | indicator="财富"; choice of {"全价", "净价", "财富", "平均市值法久期", "平均现金流法久期", "平均市值法凸性", "平均现金流法凸性", "平均现金流法到期收益率", "平均市值法到期收益率", "平均基点价值", "平均待偿期", "平均派息率", "指数上日总市值", "财富指数涨跌幅", "全价指数涨跌幅", "净价指数涨跌幅", "现券结算量"} |
| period    | str | period="总值"; choice of {"总值", "1年以下", "1-3年", "3-5年", "5-7年", "7-10年", "10年以上", "0-3个月", "3-6个月", "6-9个月", "9-12个月", "0-6个月", "6-12个月"}                                                                  |

输出参数

| 名称    | 类型      | 描述   |
|-------|---------|------|
| date  | object  | -    |
| value | float64 | 注意单位 |

### bond_composite_index_cbond
- **文档定位**：中债指数 / 总指数 / 综合类指数 / 综合指数
- **HTTP**：`GET /api/public/bond_composite_index_cbond`
- **调用**：运行 `scripts/aktools_get.py bond_composite_index_cbond --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://yield.chinabond.com.cn/cbweb-mn/indices/single_index_query

描述: 中国债券信息网-中债指数-中债指数族系-分类指数-按待偿期限

输入参数

| 名称        | 类型  | 描述                                                                                                                                                                                                       |
|-----------|-----|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| indicator | str | indicator="财富"; choice of {"全价", "净价", "财富", "平均市值法久期", "平均现金流法久期", "平均市值法凸性", "平均现金流法凸性", "平均现金流法到期收益率", "平均市值法到期收益率", "平均基点价值", "平均待偿期", "平均派息率", "指数上日总市值", "财富指数涨跌幅", "全价指数涨跌幅", "净价指数涨跌幅", "现券结算量"} |
| period    | str | period="总值"; choice of {"总值", "1年以下", "1-3年", "3-5年", "5-7年", "7-10年", "10年以上", "0-3个月", "3-6个月", "6-9个月", "9-12个月", "0-6个月", "6-12个月"}                                                                  |

输出参数

| 名称    | 类型      | 描述   |
|-------|---------|------|
| date  | object  | -    |
| value | float64 | 注意单位 |

### bond_treasury_index_cbond
- **文档定位**：中债指数 / 总指数 / 综合类指数 / 国债指数
- **HTTP**：`GET /api/public/bond_treasury_index_cbond`
- **调用**：运行 `scripts/aktools_get.py bond_treasury_index_cbond --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://yield.chinabond.com.cn/cbweb-mn/indices/single_index_query

描述: 中国债券信息网-中债指数-中债指数族系-总指数-综合类指数-中债-国债指数

输入参数

| 名称        | 类型  | 描述                                                                                                                           |
|-----------|-----|------------------------------------------------------------------------------------------------------------------------------|
| indicator | str | indicator="财富"; choice of {"全价", "净价", "财富"}                                                                                 |
| period    | str | period="5Y"; choice of {'0-1Y', '0-3Y', '0-5Y', '0-10Y', '1-3Y', '1-5Y', '1-10Y', '3-5Y', '5Y', '7Y', '7-10Y', '10Y', '30Y'} |

输出参数

| 名称    | 类型      | 描述   |
|-------|---------|------|
| date  | object  | -    |
| value | float64 | 注意单位 |

### bond_available_index_cbond
- **文档定位**：中债指数 / 中债指数族系 / 可选指数
- **HTTP**：`GET /api/public/bond_available_index_cbond`
- **调用**：运行 `scripts/aktools_get.py bond_available_index_cbond --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://yield.chinabond.com.cn/cbweb-mn/indices/singleIndexQueryResult

描述: 中国债券信息网-中债指数-中债指数族系当中, 非指定期限部分的可选指数

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称    | 类型  | 描述 |
|-------|-----|----|
| index | int | -  |
| value | str | -  |

### bond_index_general_cbond
- **文档定位**：中债指数 / 中债指数族系 / 指数族系查询
- **HTTP**：`GET /api/public/bond_index_general_cbond`
- **调用**：运行 `scripts/aktools_get.py bond_index_general_cbond --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://yield.chinabond.com.cn/cbweb-mn/indices/singleIndexQueryResult

描述: 中国债券信息网-中债指数-中债指数族系

输入参数

| 名称             | 类型  | 描述                                                                                                                                                                                                       |
|----------------|-----|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| index_category | str | index_category="新综合指数"; index_category 取值参考 `ak.bond_available_index_cbond()` 的返回结果                                                                                                                      |
| indicator      | str | indicator="财富"; choice of {"全价", "净价", "财富", "平均市值法久期", "平均现金流法久期", "平均市值法凸性", "平均现金流法凸性", "平均现金流法到期收益率", "平均市值法到期收益率", "平均基点价值", "平均待偿期", "平均派息率", "指数上日总市值", "财富指数涨跌幅", "全价指数涨跌幅", "净价指数涨跌幅", "现券结算量"} |
| periods        | str | period="总值"; choice of {"总值", "1年以下", "1-3年", "3-5年", "5-7年", "7-10年", "10年以上", "0-3个月", "3-6个月", "6-9个月", "9-12个月", "0-6个月", "6-12个月"}                                                                  |

输出参数

| 名称    | 类型      | 描述   |
|-------|---------|------|
| date  | object  | 时间索引 |
| value | float64 | 注意单位 |
