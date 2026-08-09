# ESG 评级



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### stock_esg_rate_sina
- **文档定位**：ESG 评级 / ESG 评级数据
- **HTTP**：`GET /api/public/stock_esg_rate_sina`
- **调用**：运行 `scripts/aktools_get.py stock_esg_rate_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://finance.sina.com.cn/esg/grade.shtml

描述: 新浪财经-ESG评级中心-ESG评级-ESG评级数据

限量: 单次返回所有数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型     | 描述 |
|-------|--------|----|
| 成分股代码 | object | -  |
| 评级机构  | object | -  |
| 评级    | object | -  |
| 评级季度  | object | -  |
| 标识    | object | -  |
| 交易市场  | object | -  |

### stock_esg_msci_sina
- **文档定位**：ESG 评级 / MSCI
- **HTTP**：`GET /api/public/stock_esg_msci_sina`
- **调用**：运行 `scripts/aktools_get.py stock_esg_msci_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://finance.sina.com.cn/esg/grade.shtml

描述: 新浪财经-ESG评级中心-ESG评级-MSCI

限量: 单次返回所有数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述 |
|--------|---------|----|
| 股票代码   | object  | -  |
| ESG评分  | object  | -  |
| 环境总评   | float64 | -  |
| 社会责任总评 | float64 | -  |
| 治理总评   | float64 | -  |
| 评级日期   | object  | -  |
| 交易市场   | object  | -  |

### stock_esg_rft_sina
- **文档定位**：ESG 评级 / 路孚特
- **HTTP**：`GET /api/public/stock_esg_rft_sina`
- **调用**：运行 `scripts/aktools_get.py stock_esg_rft_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://finance.sina.com.cn/esg/grade.shtml

描述: 新浪财经-ESG评级中心-ESG评级-路孚特

限量: 单次返回所有数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称       | 类型      | 描述 |
|----------|---------|----|
| 股票代码     | object  | -  |
| ESG评分    | object  | -  |
| ESG评分日期  | object  | -  |
| 环境总评     | float64 | -  |
| 环境总评日期   | float64 | -  |
| 社会责任总评   | float64 | -  |
| 社会责任总评日期 | object  | -  |
| 治理总评     | object  | -  |
| 治理总评日期   | object  | -  |
| 争议总评     | object  | -  |
| 争议总评日期   | object  | -  |
| 行业       | object  | -  |
| 交易所      | object  | -  |

### stock_esg_zd_sina
- **文档定位**：ESG 评级 / 秩鼎
- **HTTP**：`GET /api/public/stock_esg_zd_sina`
- **调用**：运行 `scripts/aktools_get.py stock_esg_zd_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://finance.sina.com.cn/esg/grade.shtml

描述: 新浪财经-ESG评级中心-ESG评级-秩鼎

限量: 单次返回所有数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型     | 描述 |
|--------|--------|----|
| 股票代码   | object | -  |
| ESG评分  | object | -  |
| 环境总评   | object | -  |
| 社会责任总评 | object | -  |
| 治理总评   | object | -  |
| 评分日期   | object | -  |

### stock_esg_hz_sina
- **文档定位**：ESG 评级 / 华证指数
- **HTTP**：`GET /api/public/stock_esg_hz_sina`
- **调用**：运行 `scripts/aktools_get.py stock_esg_hz_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://finance.sina.com.cn/esg/grade.shtml

描述: 新浪财经-ESG评级中心-ESG评级-华证指数

限量: 单次返回所有数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述 |
|--------|---------|----|
| 日期     | object  | -  |
| 股票代码   | object  | -  |
| 交易市场   | object  | -  |
| 股票名称   | object  | -  |
| ESG评分  | float64 | -  |
| ESG等级  | object  | -  |
| 环境     | float64 | -  |
| 环境等级   | object  | -  |
| 社会     | float64 | -  |
| 社会等级   | object  | -  |
| 公司治理   | float64 | -  |
| 公司治理等级 | object  | -  |
