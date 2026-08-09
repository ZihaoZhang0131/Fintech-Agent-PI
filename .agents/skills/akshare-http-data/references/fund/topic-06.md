# 基金规模



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### fund_scale_open_sina
- **文档定位**：基金规模 / 开放式基金
- **HTTP**：`GET /api/public/fund_scale_open_sina`
- **调用**：运行 `scripts/aktools_get.py fund_scale_open_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://vip.stock.finance.sina.com.cn/fund_center/index.html#jjhqetf

描述: 基金数据中心-基金规模-开放式基金

限量: 单次返回指定 symbol 的基金规模数据

输入参数

| 名称     | 类型  | 描述                                                                       |
|--------|-----|--------------------------------------------------------------------------|
| symbol | str | symbol="股票型基金"; choice of {"股票型基金", "混合型基金", "债券型基金", "货币型基金", "QDII基金"} |

输出参数

| 名称    | 类型      | 描述       |
|-------|---------|----------|
| 序号    | int64   | -        |
| 基金代码  | object  | -        |
| 基金简称  | object  | -        |
| 单位净值  | float64 | 注意单位: 元  |
| 总募集规模 | float64 | 注意单位: 万份 |
| 最近总份额 | float64 | 注意单位: 份  |
| 成立日期  | object  | -        |
| 基金经理  | object  | -        |
| 更新日期  | object  | -        |

### fund_scale_close_sina
- **文档定位**：基金规模 / 封闭式基金
- **HTTP**：`GET /api/public/fund_scale_close_sina`
- **调用**：运行 `scripts/aktools_get.py fund_scale_close_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://vip.stock.finance.sina.com.cn/fund_center/index.html#jjhqetf

描述: 基金数据中心-基金规模-封闭式基金

限量: 单次返回所有封闭式基金的基金规模数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述       |
|-------|---------|----------|
| 序号    | int64   | -        |
| 基金代码  | object  | -        |
| 基金简称  | object  | -        |
| 单位净值  | float64 | 注意单位: 元  |
| 总募集规模 | float64 | 注意单位: 万份 |
| 最近总份额 | float64 | 注意单位: 份  |
| 成立日期  | object  | -        |
| 基金经理  | object  | -        |
| 更新日期  | object  | -        |

### fund_scale_structured_sina
- **文档定位**：基金规模 / 分级子基金
- **HTTP**：`GET /api/public/fund_scale_structured_sina`
- **调用**：运行 `scripts/aktools_get.py fund_scale_structured_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://vip.stock.finance.sina.com.cn/fund_center/index.html#jjgmfjall

描述: 基金数据中心-基金规模-分级子基金

限量: 单次返回所有分级子基金的基金规模数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述       |
|-------|---------|----------|
| 序号    | int64   | -        |
| 基金代码  | object  | -        |
| 基金简称  | object  | -        |
| 单位净值  | float64 | 注意单位: 元  |
| 总募集规模 | float64 | 注意单位: 万份 |
| 最近总份额 | float64 | 注意单位: 份  |
| 成立日期  | object  | -        |
| 基金经理  | object  | -        |
| 更新日期  | object  | -        |

### fund_etf_scale_sse
- **文档定位**：基金规模 / ETF 基金份额-上交所
- **HTTP**：`GET /api/public/fund_etf_scale_sse`
- **调用**：运行 `scripts/aktools_get.py fund_etf_scale_sse --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.sse.com.cn/assortment/fund/etf/list/scale/

描述: 上海证券交易所-产品-基金产品-ETF产品-ETF产品列表-基金规模

限量: 单次返回指定日期的 ETF 基金份额数据

输入参数

| 名称   | 类型  | 描述              |
|------|-----|-----------------|
| date | str | date="20250115" |

输出参数

| 名称    | 类型      | 描述 |
|-------|---------|----|
| 序号    | int64   | -  |
| 基金代码  | object  | -  |
| 基金简称  | object  | -  |
| ETF类型 | object  | -  |
| 统计日期  | object  | -  |
| 基金份额  | float64 | -  |

### fund_etf_scale_szse
- **文档定位**：基金规模 / ETF 基金份额-深交所
- **HTTP**：`GET /api/public/fund_etf_scale_szse`
- **调用**：运行 `scripts/aktools_get.py fund_etf_scale_szse --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://fund.szse.cn/marketdata/fundslist/index.html

描述: 深圳证券交易所-基金产品-基金列表-ETF基金份额

限量: 单次返回最近交易日的 ETF 基金份额数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称    | 类型      | 描述 |
|-------|---------|----|
| 基金代码  | object  | -  |
| 基金简称  | object  | -  |
| 基金类别  | object  | -  |
| 投资类别  | object  | -  |
| 上市日期  | object  | -  |
| 基金份额  | float64 | -  |
| 基金管理人 | object  | -  |
| 基金发起人 | float64 | -  |
| 基金托管人 | float64 | -  |
| 净值    | float64 | -  |

### fund_scale_daily_szse
- **文档定位**：基金规模 / 基金规模日频-深交所
- **HTTP**：`GET /api/public/fund_scale_daily_szse`
- **调用**：运行 `scripts/aktools_get.py fund_scale_daily_szse --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.szse.cn/market/fund/volume/etf/index.html

描述: 深圳证券交易所-基金产品-基金规模-日频数据

限量: 单次返回指定日期区间和基金类别的基金规模数据; 日期范围不能超过 6 个月, 否则返回带表头的空 DataFrame

输入参数

| 名称         | 类型  | 描述                                                         |
|------------|-----|------------------------------------------------------------|
| start_date | str | 开始日期, 格式为 "YYYYMMDD"                                       |
| end_date   | str | 结束日期, 格式为 "YYYYMMDD"                                       |
| symbol     | str | 基金类别, choice of {"ETF", "LOF", "REITS"}; REITS 映射为 "不动产基金" |

输出参数

| 名称   | 类型      | 描述 |
|------|---------|----|
| 日期   | object  | -  |
| 基金代码 | object  | -  |
| 基金简称 | object  | -  |
| 基金份额 | float64 | -  |
