# 期权波动率指数



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### index_option_50etf_qvix
- **文档定位**：期权波动率指数 / 50ETF 期权波动率指数
- **HTTP**：`GET /api/public/index_option_50etf_qvix`
- **调用**：运行 `scripts/aktools_get.py index_option_50etf_qvix --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://1.optbbs.com/s/vix.shtml?50ETF

描述: 50ETF 期权波动率指数 QVIX; 又称中国版的恐慌指数

限量: 单次返回所有数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述  |
|-------|---------|-----|
| date  | object  | -   |
| open  | float64 | -   |
| high  | float64 | -   |
| low   | float64 | -   |
| close | float64 | -   |

### index_option_50etf_min_qvix
- **文档定位**：期权波动率指数 / 50ETF 期权波动率指数-分时
- **HTTP**：`GET /api/public/index_option_50etf_min_qvix`
- **调用**：运行 `scripts/aktools_get.py index_option_50etf_min_qvix --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://1.optbbs.com/s/vix.shtml?50ETF

描述: 50ETF 期权波动率指数-分时

限量: 单次返回最近交易日的分时数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述  |
|-------|---------|-----|
| time  | object  | -   |
| qvix  | float64 | -   |

### index_option_300etf_qvix
- **文档定位**：期权波动率指数 / 300ETF 期权波动率指数
- **HTTP**：`GET /api/public/index_option_300etf_qvix`
- **调用**：运行 `scripts/aktools_get.py index_option_300etf_qvix --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://1.optbbs.com/s/vix.shtml?300ETF

描述: 300ETF 期权波动率指数 QVIX

限量: 单次返回所有数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述  |
|-------|---------|-----|
| date  | object  | -   |
| open  | float64 | -   |
| high  | float64 | -   |
| low   | float64 | -   |
| close | float64 | -   |

### index_option_300etf_min_qvix
- **文档定位**：期权波动率指数 / 300ETF 期权波动率指数-分时
- **HTTP**：`GET /api/public/index_option_300etf_min_qvix`
- **调用**：运行 `scripts/aktools_get.py index_option_300etf_min_qvix --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://1.optbbs.com/s/vix.shtml?300ETF

描述: 300ETF 期权波动率指数-分时

限量: 单次返回最近交易日的分时数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述  |
|-------|---------|-----|
| time  | object  | -   |
| qvix  | float64 | -   |

### index_option_500etf_qvix
- **文档定位**：期权波动率指数 / 500ETF 期权波动率指数
- **HTTP**：`GET /api/public/index_option_500etf_qvix`
- **调用**：运行 `scripts/aktools_get.py index_option_500etf_qvix --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://1.optbbs.com/s/vix.shtml?500ETF

描述: 500ETF 期权波动率指数 QVIX

限量: 单次返回所有数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述  |
|-------|---------|-----|
| date  | object  | -   |
| open  | float64 | -   |
| high  | float64 | -   |
| low   | float64 | -   |
| close | float64 | -   |

### index_option_500etf_min_qvix
- **文档定位**：期权波动率指数 / 500ETF 期权波动率指数-分时
- **HTTP**：`GET /api/public/index_option_500etf_min_qvix`
- **调用**：运行 `scripts/aktools_get.py index_option_500etf_min_qvix --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://1.optbbs.com/s/vix.shtml?500ETF

描述: 500ETF 期权波动率指数-分时

限量: 单次返回最近交易日的分时数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述  |
|-------|---------|-----|
| time  | object  | -   |
| qvix  | float64 | -   |

### index_option_cyb_qvix
- **文档定位**：期权波动率指数 / 创业板 期权波动率指数
- **HTTP**：`GET /api/public/index_option_cyb_qvix`
- **调用**：运行 `scripts/aktools_get.py index_option_cyb_qvix --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://1.optbbs.com/s/vix.shtml?CYB

描述: 创业板 期权波动率指数 QVIX

限量: 单次返回所有数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述  |
|-------|---------|-----|
| date  | object  | -   |
| open  | float64 | -   |
| high  | float64 | -   |
| low   | float64 | -   |
| close | float64 | -   |

### index_option_cyb_min_qvix
- **文档定位**：期权波动率指数 / 创业板 期权波动率指数-分时
- **HTTP**：`GET /api/public/index_option_cyb_min_qvix`
- **调用**：运行 `scripts/aktools_get.py index_option_cyb_min_qvix --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://1.optbbs.com/s/vix.shtml?CYB

描述: 创业板 期权波动率指数-分时

限量: 单次返回最近交易日的分时数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述  |
|-------|---------|-----|
| time  | object  | -   |
| qvix  | float64 | -   |

### index_option_kcb_qvix
- **文档定位**：期权波动率指数 / 科创板 期权波动率指数
- **HTTP**：`GET /api/public/index_option_kcb_qvix`
- **调用**：运行 `scripts/aktools_get.py index_option_kcb_qvix --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://1.optbbs.com/s/vix.shtml?KCB

描述: 科创板 期权波动率指数 QVIX

限量: 单次返回所有数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述  |
|-------|---------|-----|
| date  | object  | -   |
| open  | float64 | -   |
| high  | float64 | -   |
| low   | float64 | -   |
| close | float64 | -   |

### index_option_kcb_min_qvix
- **文档定位**：期权波动率指数 / 科创板 期权波动率指数-分时
- **HTTP**：`GET /api/public/index_option_kcb_min_qvix`
- **调用**：运行 `scripts/aktools_get.py index_option_kcb_min_qvix --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://1.optbbs.com/s/vix.shtml?KCB

描述: 科创板 期权波动率指数-分时

限量: 单次返回最近交易日的分时数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述  |
|-------|---------|-----|
| time  | object  | -   |
| qvix  | float64 | -   |

### index_option_100etf_qvix
- **文档定位**：期权波动率指数 / 深证100ETF 期权波动率指数
- **HTTP**：`GET /api/public/index_option_100etf_qvix`
- **调用**：运行 `scripts/aktools_get.py index_option_100etf_qvix --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://1.optbbs.com/s/vix.shtml?100ETF

描述: 深证100ETF 期权波动率指数 QVIX

限量: 单次返回所有数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述  |
|-------|---------|-----|
| date  | object  | -   |
| open  | float64 | -   |
| high  | float64 | -   |
| low   | float64 | -   |
| close | float64 | -   |

### index_option_100etf_min_qvix
- **文档定位**：期权波动率指数 / 深证100ETF 期权波动率指数-分时
- **HTTP**：`GET /api/public/index_option_100etf_min_qvix`
- **调用**：运行 `scripts/aktools_get.py index_option_100etf_min_qvix --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://1.optbbs.com/s/vix.shtml?100ETF

描述: 深证100ETF 期权波动率指数-分时

限量: 单次返回最近交易日的分时数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述  |
|-------|---------|-----|
| time  | object  | -   |
| qvix  | float64 | -   |

### index_option_300index_qvix
- **文档定位**：期权波动率指数 / 中证300股指 期权波动率指数
- **HTTP**：`GET /api/public/index_option_300index_qvix`
- **调用**：运行 `scripts/aktools_get.py index_option_300index_qvix --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://1.optbbs.com/s/vix.shtml?Index

描述: 中证300股指 期权波动率指数 QVIX

限量: 单次返回所有数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述  |
|-------|---------|-----|
| date  | object  | -   |
| open  | float64 | -   |
| high  | float64 | -   |
| low   | float64 | -   |
| close | float64 | -   |

### index_option_300index_min_qvix
- **文档定位**：期权波动率指数 / 中证300股指 期权波动率指数-分时
- **HTTP**：`GET /api/public/index_option_300index_min_qvix`
- **调用**：运行 `scripts/aktools_get.py index_option_300index_min_qvix --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://1.optbbs.com/s/vix.shtml?Index

描述: 中证300股指 期权波动率指数-分时

限量: 单次返回最近交易日的分时数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述  |
|-------|---------|-----|
| time  | object  | -   |
| qvix  | float64 | -   |

### index_option_1000index_qvix
- **文档定位**：期权波动率指数 / 中证1000股指 期权波动率指数
- **HTTP**：`GET /api/public/index_option_1000index_qvix`
- **调用**：运行 `scripts/aktools_get.py index_option_1000index_qvix --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://1.optbbs.com/s/vix.shtml?Index1000

描述: 中证1000股指 期权波动率指数 QVIX

限量: 单次返回所有数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述  |
|-------|---------|-----|
| date  | object  | -   |
| open  | float64 | -   |
| high  | float64 | -   |
| low   | float64 | -   |
| close | float64 | -   |

### index_option_1000index_min_qvix
- **文档定位**：期权波动率指数 / 中证1000股指 期权波动率指数-分时
- **HTTP**：`GET /api/public/index_option_1000index_min_qvix`
- **调用**：运行 `scripts/aktools_get.py index_option_1000index_min_qvix --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://1.optbbs.com/s/vix.shtml?Index1000

描述: 中证1000股指 期权波动率指数-分时

限量: 单次返回最近交易日的分时数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述  |
|-------|---------|-----|
| time  | object  | -   |
| qvix  | float64 | -   |

### index_option_50index_qvix
- **文档定位**：期权波动率指数 / 上证50股指 期权波动率指数
- **HTTP**：`GET /api/public/index_option_50index_qvix`
- **调用**：运行 `scripts/aktools_get.py index_option_50index_qvix --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://1.optbbs.com/s/vix.shtml?50index

描述: 上证50股指 期权波动率指数 QVIX

限量: 单次返回所有数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述  |
|-------|---------|-----|
| date  | object  | -   |
| open  | float64 | -   |
| high  | float64 | -   |
| low   | float64 | -   |
| close | float64 | -   |

### index_option_50index_min_qvix
- **文档定位**：期权波动率指数 / 上证50股指 期权波动率指数-分时
- **HTTP**：`GET /api/public/index_option_50index_min_qvix`
- **调用**：运行 `scripts/aktools_get.py index_option_50index_min_qvix --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://1.optbbs.com/s/vix.shtml?50index

描述: 上证50股指 期权波动率指数-分时

限量: 单次返回最近交易日的分时数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述  |
|-------|---------|-----|
| time  | object  | -   |
| qvix  | float64 | -   |
