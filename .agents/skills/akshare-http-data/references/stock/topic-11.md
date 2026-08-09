# 技术指标



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### stock_rank_cxfl_ths
- **文档定位**：技术指标 / 持续放量
- **HTTP**：`GET /api/public/stock_rank_cxfl_ths`
- **调用**：运行 `scripts/aktools_get.py stock_rank_cxfl_ths --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.10jqka.com.cn/rank/cxfl/

描述: 同花顺-数据中心-技术选股-持续放量

限量: 单次返回所有数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| 序号     | int64   | -       |
| 股票代码   | object  | -       |
| 股票简称   | object  | -       |
| 涨跌幅    | float64 | 注意单位: % |
| 最新价    | float64 | 注意单位: 元 |
| 成交量    | object  | 注意单位: 股 |
| 基准日成交量 | object  | 注意单位: 股 |
| 放量天数   | int64   | -       |
| 阶段涨跌幅  | float64 | 注意单位: % |
| 所属行业   | object  | -       |

### stock_rank_cxsl_ths
- **文档定位**：技术指标 / 持续缩量
- **HTTP**：`GET /api/public/stock_rank_cxsl_ths`
- **调用**：运行 `scripts/aktools_get.py stock_rank_cxsl_ths --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.10jqka.com.cn/rank/cxsl/

描述: 同花顺-数据中心-技术选股-持续缩量

限量: 单次返回所有数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| 序号     | int64   | -       |
| 股票代码   | object  | -       |
| 股票简称   | object  | -       |
| 涨跌幅    | float64 | 注意单位: % |
| 最新价    | float64 | 注意单位: 元 |
| 成交量    | object  | 注意单位: 股 |
| 基准日成交量 | object  | 注意单位: 股 |
| 缩量天数   | int64   | -       |
| 阶段涨跌幅  | float64 | 注意单位: % |
| 所属行业   | object  | -       |

### stock_rank_xstp_ths
- **文档定位**：技术指标 / 向上突破
- **HTTP**：`GET /api/public/stock_rank_xstp_ths`
- **调用**：运行 `scripts/aktools_get.py stock_rank_xstp_ths --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.10jqka.com.cn/rank/xstp/

描述: 同花顺-数据中心-技术选股-向上突破

限量: 单次返回所有数据

输入参数

| 名称     | 类型  | 描述                                                                                                   |
|--------|-----|------------------------------------------------------------------------------------------------------|
| symbol | str | symbol="500日均线"; choice of {"5日均线", "10日均线", "20日均线", "30日均线", "60日均线", "90日均线", "250日均线", "500日均线"} |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 序号   | int64   | -       |
| 股票代码 | object  | -       |
| 股票简称 | object  | -       |
| 最新价  | float64 | 注意单位: 元 |
| 成交额  | object  | 注意单位: 元 |
| 成交量  | object  | 注意单位: 股 |
| 涨跌幅  | float64 | 注意单位: % |
| 换手率  | float64 | 注意单位: % |

### stock_rank_xxtp_ths
- **文档定位**：技术指标 / 向下突破
- **HTTP**：`GET /api/public/stock_rank_xxtp_ths`
- **调用**：运行 `scripts/aktools_get.py stock_rank_xxtp_ths --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.10jqka.com.cn/rank/xxtp/

描述: 同花顺-数据中心-技术选股-向下突破

限量: 单次返回所有数据

输入参数

| 名称     | 类型  | 描述                                                                                                   |
|--------|-----|------------------------------------------------------------------------------------------------------|
| symbol | str | symbol="500日均线"; choice of {"5日均线", "10日均线", "20日均线", "30日均线", "60日均线", "90日均线", "250日均线", "500日均线"} |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 序号   | int64   | -       |
| 股票代码 | object  | -       |
| 股票简称 | object  | -       |
| 最新价  | float64 | 注意单位: 元 |
| 成交额  | object  | 注意单位: 元 |
| 成交量  | object  | 注意单位: 股 |
| 涨跌幅  | float64 | 注意单位: % |
| 换手率  | float64 | 注意单位: % |

### stock_rank_ljqs_ths
- **文档定位**：技术指标 / 量价齐升
- **HTTP**：`GET /api/public/stock_rank_ljqs_ths`
- **调用**：运行 `scripts/aktools_get.py stock_rank_ljqs_ths --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.10jqka.com.cn/rank/ljqs/

描述: 同花顺-数据中心-技术选股-量价齐升

限量: 单次返回所有数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| 序号     | int64   | -       |
| 股票代码   | object  | -       |
| 股票简称   | object  | -       |
| 最新价    | float64 | 注意单位: 元 |
| 量价齐升天数 | int64   | -       |
| 阶段涨幅   | float64 | 注意单位: % |
| 累计换手率  | float64 | 注意单位: % |
| 所属行业   | object  | -       |

### stock_rank_ljqd_ths
- **文档定位**：技术指标 / 量价齐跌
- **HTTP**：`GET /api/public/stock_rank_ljqd_ths`
- **调用**：运行 `scripts/aktools_get.py stock_rank_ljqd_ths --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.10jqka.com.cn/rank/ljqd/

描述: 同花顺-数据中心-技术选股-量价齐跌

限量: 单次返回所有数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| 序号     | int64   | -       |
| 股票代码   | object  | -       |
| 股票简称   | object  | -       |
| 最新价    | float64 | 注意单位: 元 |
| 量价齐跌天数 | int64   | -       |
| 阶段涨幅   | float64 | 注意单位: % |
| 累计换手率  | float64 | 注意单位: % |
| 所属行业   | object  | -       |

### stock_rank_xzjp_ths
- **文档定位**：技术指标 / 险资举牌
- **HTTP**：`GET /api/public/stock_rank_xzjp_ths`
- **调用**：运行 `scripts/aktools_get.py stock_rank_xzjp_ths --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.10jqka.com.cn/financial/xzjp/

描述: 同花顺-数据中心-技术选股-险资举牌

限量: 单次返回所有数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称         | 类型      | 描述      |
|------------|---------|---------|
| 序号         | int64   | -       |
| 举牌公告日      | object  | -       |
| 股票代码       | object  | -       |
| 股票简称       | object  | -       |
| 现价         | float64 | 注意单位: 元 |
| 涨跌幅        | float64 | 注意单位: % |
| 举牌方        | object  | -       |
| 增持数量       | object  | 注意单位: 股 |
| 交易均价       | float64 | 注意单位: 元 |
| 增持数量占总股本比例 | float64 | 注意单位: % |
| 变动后持股总数    | object  | 注意单位: 股 |
| 变动后持股比例    | float64 | 注意单位: % |
