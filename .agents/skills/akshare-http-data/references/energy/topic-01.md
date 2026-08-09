# 碳排放



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### energy_carbon_domestic
- **文档定位**：碳排放 / 碳排放权-国内
- **HTTP**：`GET /api/public/energy_carbon_domestic`
- **调用**：运行 `scripts/aktools_get.py energy_carbon_domestic --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.tanjiaoyi.com/

描述: 碳交易网-行情信息

限量: 返回指定 symbol 的所有历史数据

输入参数

| 名称     | 类型  | 描述                                                                      |
|--------|-----|-------------------------------------------------------------------------|
| symbol | str | symbol="湖北"; choice of {'湖北', '上海', '北京', '重庆', '广东', '天津', '深圳', '福建'} |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 日期  | object  |         |
| 成交价 | float64 | 注意单位: 元 |
| 成交量 | float64 | 注意单位: 吨 |
| 成交额 | float64 | -       |
| 地点  | object  | -       |

### energy_carbon_bj
- **文档定位**：碳排放 / 碳排放权-北京
- **HTTP**：`GET /api/public/energy_carbon_bj`
- **调用**：运行 `scripts/aktools_get.py energy_carbon_bj --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.bjets.com.cn/article/jyxx/

描述: 北京市碳排放权电子交易平台-北京市碳排放权公开交易行情

注意: 注意在 2017-08-08 日的数据有误 70.074.00（BEA）

限量: 全部历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述        |
|------|---------|-----------|
| 日期   | object  |           |
| 成交量  | int64   | 注意单位: 吨   |
| 成交均价 | float64 | 注意单位: 元/吨 |
| 成交额  | float64 | 注意单位: 元   |
| 成交单位 | object  | -         |

### energy_carbon_sz
- **文档定位**：碳排放 / 碳排放权-深圳
- **HTTP**：`GET /api/public/energy_carbon_sz`
- **调用**：运行 `scripts/aktools_get.py energy_carbon_sz --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.cerx.cn/dailynewsCN/index.htm

描述: 深圳碳排放交易所-国内碳情

限量: 全部历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述  |
|--------|---------|-----|
| 交易日期   | object  | -   |
| 市场交易指数 | object  | -   |
| 开盘价    | float64 | -   |
| 最高价    | float64 | -   |
| 最低价    | float64 | -   |
| 成交均价   | float64 | -   |
| 收盘价    | float64 | -   |
| 成交量    | int64   | -   |
| 成交额    | float64 | -   |

### energy_carbon_eu
- **文档定位**：碳排放 / 碳排放权-国际
- **HTTP**：`GET /api/public/energy_carbon_eu`
- **调用**：运行 `scripts/aktools_get.py energy_carbon_eu --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.cerx.cn/dailynewsOuter/index.htm

描述: 深圳碳排放交易所-国际碳情

限量: 返回从 2018-03-13 至 2020-04-29 的所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述  |
|--------|---------|-----|
| 交易日期   | object  | -   |
| 市场交易指数 | object  | -   |
| 开盘价    | float64 | -   |
| 最高价    | float64 | -   |
| 最低价    | float64 | -   |
| 成交均价   | float64 | -   |
| 收盘价    | float64 | -   |
| 成交量    | int64   | -   |
| 成交额    | float64 | -   |

### energy_carbon_hb
- **文档定位**：碳排放 / 碳排放权-湖北
- **HTTP**：`GET /api/public/energy_carbon_hb`
- **调用**：运行 `scripts/aktools_get.py energy_carbon_hb --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.cerx.cn/dailynewsOuter/index.htm

描述: 湖北碳排放权交易中心-碳排放权交易数据

限量: 返回从 2014-04-02 至今的所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称  | 类型      | 描述 |
|-----|---------|----|
| 日期  | object  | -  |
| 成交价 | float64 | -  |
| 成交量 | float64 | -  |
| 最新  | float64 | -  |
| 涨跌  | float64 | -  |

### energy_carbon_gz
- **文档定位**：碳排放 / 碳排放权-广州
- **HTTP**：`GET /api/public/energy_carbon_gz`
- **调用**：运行 `scripts/aktools_get.py energy_carbon_gz --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.cnemission.com/article/hqxx/

描述: 广州碳排放权交易中心-行情信息

限量: 该接口返回从 2013-12-19 至今的所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 日期   | object  | -       |
| 品种   | object  | -       |
| 开盘价  | float64 | -       |
| 收盘价  | float64 | -       |
| 最高价  | float64 | -       |
| 最低价  | float64 | -       |
| 涨跌   | float64 | -       |
| 涨跌幅  | float64 | 注意单位: % |
| 成交数量 | int64   | -       |
| 成交金额 | float64 | -       |
