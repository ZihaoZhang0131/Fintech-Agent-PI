# 基金排行



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### fund_open_fund_rank_em
- **文档定位**：基金排行 / 开放式基金排行
- **HTTP**：`GET /api/public/fund_open_fund_rank_em`
- **调用**：运行 `scripts/aktools_get.py fund_open_fund_rank_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://fund.eastmoney.com/data/fundranking.html

描述: 东方财富网-数据中心-开放式基金排行

限量: 单次返回当前时刻所有数据

输入参数

| 名称     | 类型  | 描述                                                                       |
|--------|-----|--------------------------------------------------------------------------|
| symbol | str | symbol="全部"; choice of {"全部", "股票型", "混合型", "债券型", "指数型", "QDII", "FOF"} |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 序号   | int64   | -       |
| 基金代码 | object  | -       |
| 基金简称 | object  | -       |
| 日期   | object  | -       |
| 单位净值 | float64 | -       |
| 累计净值 | float64 | -       |
| 日增长率 | float64 | 注意单位: % |
| 近1周  | float64 | 注意单位: % |
| 近1月  | float64 | 注意单位: % |
| 近3月  | float64 | 注意单位: % |
| 近6月  | float64 | 注意单位: % |
| 近1年  | float64 | 注意单位: % |
| 近2年  | float64 | 注意单位: % |
| 近3年  | float64 | 注意单位: % |
| 今年来  | float64 | 注意单位: % |
| 成立来  | float64 | 注意单位: % |
| 自定义  | float64 | 注意单位: % |
| 手续费  | object  | -       |

### fund_exchange_rank_em
- **文档定位**：基金排行 / 场内交易基金排行榜
- **HTTP**：`GET /api/public/fund_exchange_rank_em`
- **调用**：运行 `scripts/aktools_get.py fund_exchange_rank_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://fund.eastmoney.com/data/fbsfundranking.html

描述: 东方财富网-数据中心-场内交易基金排行榜

限量: 单次返回当前时刻所有数据, 每个交易日 17 点后更新

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 序号   | int64   | -       |
| 基金代码 | object  | -       |
| 基金简称 | object  | -       |
| 类型   | object  | -       |
| 日期   | object  | -       |
| 单位净值 | float64 | -       |
| 累计净值 | float64 | -       |
| 近1周  | float64 | 注意单位: % |
| 近1月  | float64 | 注意单位: % |
| 近3月  | float64 | 注意单位: % |
| 近6月  | float64 | 注意单位: % |
| 近1年  | float64 | 注意单位: % |
| 近2年  | float64 | 注意单位: % |
| 近3年  | float64 | 注意单位: % |
| 今年来  | float64 | 注意单位: % |
| 成立来  | float64 | 注意单位: % |
| 成立日期 | object  | -       |

### fund_money_rank_em
- **文档定位**：基金排行 / 货币型基金排行
- **HTTP**：`GET /api/public/fund_money_rank_em`
- **调用**：运行 `scripts/aktools_get.py fund_money_rank_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://fund.eastmoney.com/data/hbxfundranking.html

描述: 东方财富网-数据中心-货币型基金排行

限量: 单次返回当前时刻所有数据, 每个交易日 17 点后更新, 货币基金的单位净值均为 1.0000 元，最新一年期定存利率: 1.50%

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称       | 类型      | 描述      |
|----------|---------|---------|
| 序号       | int64   | -       |
| 基金代码     | object  | -       |
| 基金简称     | object  | -       |
| 日期       | object  | -       |
| 万份收益     | float64 | 注意单位: % |
| 年化收益率7日  | float64 | 注意单位: % |
| 年化收益率14日 | float64 | 注意单位: % |
| 年化收益率28日 | float64 | 注意单位: % |
| 近1月      | float64 | 注意单位: % |
| 近3月      | float64 | 注意单位: % |
| 近6月      | float64 | 注意单位: % |
| 近1年      | float64 | 注意单位: % |
| 近2年      | float64 | 注意单位: % |
| 近3年      | float64 | 注意单位: % |
| 近5年      | float64 | 注意单位: % |
| 今年来      | float64 | 注意单位: % |
| 成立来      | float64 | 注意单位: % |
| 手续费      | object  | -       |

### fund_lcx_rank_em
- **文档定位**：基金排行 / 理财基金排行
- **HTTP**：`GET /api/public/fund_lcx_rank_em`
- **调用**：运行 `scripts/aktools_get.py fund_lcx_rank_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://fund.eastmoney.com/data/lcxfundranking.html#t;c0;r;sSYL_Z;ddesc;pn50;f;os1;

描述: 东方财富网-数据中心-理财基金排行, 每个交易日17点后更新, 货币基金的单位净值均为 1.0000 元，最新一年期定存利率: 1.50%

限量: 由于目标网站没有数据，该接口暂时未能返回数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称       | 类型      | 描述      |
|----------|---------|---------|
| 序号       | int64   | -       |
| 基金代码     | object  | -       |
| 基金简称     | object  | -       |
| 日期       | object  | -       |
| 万份收益     | float64 | -       |
| 年化收益率7日  | float64 | 注意单位: % |
| 年化收益率14日 | float64 | 注意单位: % |
| 年化收益率28日 | float64 | 注意单位: % |
| 近1周      | float64 | 注意单位: % |
| 近1月      | float64 | 注意单位: % |
| 近3月      | float64 | 注意单位: % |
| 近6月      | float64 | 注意单位: % |
| 今年来      | float64 | 注意单位: % |
| 成立来      | float64 | 注意单位: % |
| 可购买      | float64 | 可购买     |
| 手续费      | object  | -       |

### fund_hk_rank_em
- **文档定位**：基金排行 / 香港基金排行
- **HTTP**：`GET /api/public/fund_hk_rank_em`
- **调用**：运行 `scripts/aktools_get.py fund_hk_rank_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://overseas.1234567.com.cn/FundList

描述: 东方财富网-数据中心-基金排行-香港基金排行

限量: 单次返回当前时刻所有数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述                       |
|--------|---------|--------------------------|
| 序号     | int64   | -                        |
| 基金代码   | object  | -                        |
| 基金简称   | object  | -                        |
| 币种     | object  | -                        |
| 日期     | object  | -                        |
| 单位净值   | float64 | -                        |
| 日增长率   | float64 | 注意单位: %                  |
| 近1周    | float64 | 注意单位: %                  |
| 近1月    | float64 | 注意单位: %                  |
| 近3月    | float64 | 注意单位: %                  |
| 近6月    | float64 | 注意单位: %                  |
| 近1年    | float64 | 注意单位: %                  |
| 近2年    | float64 | 注意单位: %                  |
| 近3年    | float64 | 注意单位: %                  |
| 今年来    | float64 | 注意单位: %                  |
| 成立来    | float64 | 注意单位: %                  |
| 可购买    | object  | -                        |
| 香港基金代码 | object  | 用于查询历史净值数据, 通过该字段查询相关的数据 |
