# 上海黄金交易所



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### spot_hist_sge
- **文档定位**：上海黄金交易所 / 历史行情数据
- **HTTP**：`GET /api/public/spot_hist_sge`
- **调用**：运行 `scripts/aktools_get.py spot_hist_sge --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.sge.com.cn/sjzx/mrhq

描述: 上海黄金交易所-数据资讯-行情走势-历史数据

限量: 单次返回指定 symbol 的所有历史数据

输入参数

| 名称     | 类型  | 描述                                                      |
|--------|-----|---------------------------------------------------------|
| symbol | str | symbol="Au99.99"; 可以通过 ak.spot_symbol_table_sge() 获取品种表 |

输出参数

| 名称    | 类型      | 描述  |
|-------|---------|-----|
| date  | object  | -   |
| open  | float64 | -   |
| close | float64 | -   |
| low   | float64 | -   |
| high  | float64 | -   |

### spot_quotations_sge
- **文档定位**：上海黄金交易所 / 实时行情数据
- **HTTP**：`GET /api/public/spot_quotations_sge`
- **调用**：运行 `scripts/aktools_get.py spot_quotations_sge --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.sge.com.cn/

描述: 上海黄金交易所-数据资讯-行情走势-实时数据

限量: 单次返回指定 symbol 的所有行情数据

输入参数

| 名称     | 类型  | 描述                                                      |
|--------|-----|---------------------------------------------------------|
| symbol | str | symbol="Au99.99"; 可以通过 ak.spot_symbol_table_sge() 获取品种表 |

输出参数

| 名称   | 类型      | 描述 |
|------|---------|----|
| 品种   | object  | -  |
| 时间   | object  | -  |
| 现价   | float64 | -  |
| 更新时间 | object  | -  |

### spot_golden_benchmark_sge
- **文档定位**：上海黄金交易所 / 上海金基准价
- **HTTP**：`GET /api/public/spot_golden_benchmark_sge`
- **调用**：运行 `scripts/aktools_get.py spot_golden_benchmark_sge --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.sge.com.cn/sjzx/jzj

描述: 上海黄金交易所-数据资讯-上海金基准价-历史数据

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述  |
|------|---------|-----|
| 交易时间 | object  | -   |
| 晚盘价  | float64 | -   |
| 早盘价  | float64 | -   |

### spot_silver_benchmark_sge
- **文档定位**：上海黄金交易所 / 上海银基准价
- **HTTP**：`GET /api/public/spot_silver_benchmark_sge`
- **调用**：运行 `scripts/aktools_get.py spot_silver_benchmark_sge --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.sge.com.cn/sjzx/shyjzj

描述: 上海黄金交易所-数据资讯-上海银基准价-历史数据

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述  |
|------|---------|-----|
| 交易时间 | object  | -   |
| 晚盘价  | float64 | -   |
| 早盘价  | float64 | -   |
