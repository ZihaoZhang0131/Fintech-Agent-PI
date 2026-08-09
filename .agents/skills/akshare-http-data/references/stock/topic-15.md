# 涨停板行情



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### stock_zt_pool_em
- **文档定位**：涨停板行情 / 涨停股池
- **HTTP**：`GET /api/public/stock_zt_pool_em`
- **调用**：运行 `scripts/aktools_get.py stock_zt_pool_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/ztb/detail#type=ztgc

描述: 东方财富网-行情中心-涨停板行情-涨停股池

限量: 单次返回指定 date 的涨停股池数据; 该接口只能获取近期的数据

输入参数

| 名称   | 类型  | 描述              |
|------|-----|-----------------|
| date | str | date='20241008' |

输出参数

| 名称     | 类型      | 描述             |
|--------|---------|----------------|
| 序号     | int64   | -              |
| 代码     | object  | -              |
| 名称     | object  | -              |
| 涨跌幅    | float64 | 注意单位: %        |
| 最新价    | float64 | -              |
| 成交额    | int64   | -              |
| 流通市值   | float64 | -              |
| 总市值    | float64 | -              |
| 换手率    | float64 | 注意单位: %        |
| 封板资金   | int64   | -              |
| 首次封板时间 | object  | 注意格式: 09:25:00 |
| 最后封板时间 | object  | 注意格式: 09:25:00 |
| 炸板次数   | int64   | -              |
| 涨停统计   | object  | -              |
| 连板数    | int64   | 注意格式: 1 为首板    |
| 所属行业   | object  | -              |

### stock_zt_pool_previous_em
- **文档定位**：涨停板行情 / 昨日涨停股池
- **HTTP**：`GET /api/public/stock_zt_pool_previous_em`
- **调用**：运行 `scripts/aktools_get.py stock_zt_pool_previous_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/ztb/detail#type=zrzt

描述: 东方财富网-行情中心-涨停板行情-昨日涨停股池

限量: 单次返回指定 date 的昨日涨停股池数据; 该接口只能获取近期的数据

输入参数

| 名称   | 类型  | 描述              |
|------|-----|-----------------|
| date | str | date='20240415' |

输出参数

| 名称     | 类型      | 描述             |
|--------|---------|----------------|
| 序号     | int32   | -              |
| 代码     | object  | -              |
| 名称     | object  | -              |
| 涨跌幅    | float64 | 注意单位: %        |
| 最新价    | int64   | -              |
| 涨停价    | int64   | -              |
| 成交额    | int64   | -              |
| 流通市值   | float64 | -              |
| 总市值    | float64 | -              |
| 换手率    | float64 | 注意单位: %        |
| 涨速     | float64 | 注意单位: %        |
| 振幅     | float64 | 注意单位: %        |
| 昨日封板时间 | int64   | 注意格式: 09:25:00 |
| 昨日连板数  | int64   | 注意格式: 1 为首板    |
| 涨停统计   | object  | -              |
| 所属行业   | object  | -              |

### stock_zt_pool_strong_em
- **文档定位**：涨停板行情 / 强势股池
- **HTTP**：`GET /api/public/stock_zt_pool_strong_em`
- **调用**：运行 `scripts/aktools_get.py stock_zt_pool_strong_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/ztb/detail#type=qsgc

描述: 东方财富网-行情中心-涨停板行情-强势股池

限量: 单次返回指定 date 的强势股池数据；该接口只能获取近期的数据

输入参数

| 名称   | 类型  | 描述              |
|------|-----|-----------------|
| date | str | date='20241009' |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 序号   | int64   | -       |
| 代码   | object  | -       |
| 名称   | object  | -       |
| 涨跌幅  | float64 | 注意单位: % |
| 最新价  | float64 | -       |
| 涨停价  | float64 | -       |
| 成交额  | int64   | -       |
| 流通市值 | float64 | -       |
| 总市值  | float64 | -       |
| 换手率  | float64 | 注意单位: % |
| 涨速   | float64 | 注意单位: % |
| 是否新高 | object  | -       |
| 量比   | float64 | -       |
| 涨停统计 | object  | -       |
| 入选理由 | object  | -       |
| 所属行业 | object  | -       |

### stock_zt_pool_sub_new_em
- **文档定位**：涨停板行情 / 次新股池
- **HTTP**：`GET /api/public/stock_zt_pool_sub_new_em`
- **调用**：运行 `scripts/aktools_get.py stock_zt_pool_sub_new_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/ztb/detail#type=cxgc

描述: 东方财富网-行情中心-涨停板行情-次新股池

限量: 单次返回指定 date 的次新股池数据；该接口只能获取近期的数据

输入参数

| 名称   | 类型  | 描述              |
|------|-----|-----------------|
| date | str | date='20241231' |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 序号   | int32   | -       |
| 代码   | object  | -       |
| 名称   | object  | -       |
| 涨跌幅  | float64 | 注意单位: % |
| 最新价  | float64 | -       |
| 涨停价  | float64 | -       |
| 成交额  | int64   | -       |
| 流通市值 | float64 | -       |
| 总市值  | float64 | -       |
| 转手率  | float64 | 注意单位: % |
| 开板几日 | int64   | -       |
| 开板日期 | int64   | -       |
| 上市日期 | int64   | -       |
| 是否新高 | int64   | -       |
| 涨停统计 | object  | -       |
| 所属行业 | object  | -       |

### stock_zt_pool_zbgc_em
- **文档定位**：涨停板行情 / 炸板股池
- **HTTP**：`GET /api/public/stock_zt_pool_zbgc_em`
- **调用**：运行 `scripts/aktools_get.py stock_zt_pool_zbgc_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/ztb/detail#type=zbgc

描述: 东方财富网-行情中心-涨停板行情-炸板股池

限量: 单次返回指定 date 的炸板股池数据；该接口只能获取近期的数据

输入参数

| 名称   | 类型  | 描述              |
|------|-----|-----------------|
| date | str | date='20241011' |

输出参数

| 名称     | 类型      | 描述             |
|--------|---------|----------------|
| 序号     | int32   | -              |
| 代码     | object  | -              |
| 名称     | object  | -              |
| 涨跌幅    | float64 | 注意单位: %        |
| 最新价    | float64 | -              |
| 涨停价    | float64 | -              |
| 成交额    | int64   | -              |
| 流通市值   | float64 | -              |
| 总市值    | float64 | -              |
| 换手率    | float64 | 注意单位: %        |
| 涨速     | int64   | -              |
| 首次封板时间 | object  | 注意格式: 09:25:00 |
| 炸板次数   | int64   | -              |
| 涨停统计   | int64   | -              |
| 振幅     | object  | -              |
| 所属行业   | object  | -              |

### stock_zt_pool_dtgc_em
- **文档定位**：涨停板行情 / 跌停股池
- **HTTP**：`GET /api/public/stock_zt_pool_dtgc_em`
- **调用**：运行 `scripts/aktools_get.py stock_zt_pool_dtgc_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/ztb/detail#type=zbgc

描述: 东方财富网-行情中心-涨停板行情-跌停股池

限量: 单次返回指定 date 的跌停股池数据；该接口只能获取近期的数据

输入参数

| 名称   | 类型  | 描述              |
|------|-----|-----------------|
| date | str | date='20241011' |

输出参数

| 名称     | 类型      | 描述             |
|--------|---------|----------------|
| 序号     | int64   | -              |
| 代码     | object  | -              |
| 名称     | object  | -              |
| 涨跌幅    | float64 | 注意单位: %        |
| 最新价    | float64 | -              |
| 成交额    | int64   | -              |
| 流通市值   | float64 | -              |
| 总市值    | float64 | -              |
| 动态市盈率  | float64 | -              |
| 换手率    | float64 | 注意单位: %        |
| 封单资金   | int64   | -              |
| 最后封板时间 | object  | 注意格式: 09:25:00 |
| 板上成交额  | int64   | -              |
| 连续跌停   | int64   | -              |
| 开板次数   | int64   | -              |
| 所属行业   | object  | -              |
