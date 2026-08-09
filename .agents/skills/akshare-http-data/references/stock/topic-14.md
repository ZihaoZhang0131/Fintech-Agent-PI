# 沪深港通持股



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### stock_sgt_settlement_exchange_rate_szse
- **文档定位**：沪深港通持股 / 结算汇率-深港通
- **HTTP**：`GET /api/public/stock_sgt_settlement_exchange_rate_szse`
- **调用**：运行 `scripts/aktools_get.py stock_sgt_settlement_exchange_rate_szse --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.szse.cn/szhk/hkbussiness/exchangerate/index.html

描述: 深港通-港股通业务信息-结算汇率

限量: 单次获取所有深港通结算汇率数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称       | 类型      | 描述  |
|----------|---------|-----|
| 适用日期     | object  | -   |
| 买入结算汇兑比率 | float64 | -   |
| 卖出结算汇兑比率 | float64 | -   |
| 货币种类     | object  | -   |

### stock_sgt_settlement_exchange_rate_sse
- **文档定位**：沪深港通持股 / 结算汇率-沪港通
- **HTTP**：`GET /api/public/stock_sgt_settlement_exchange_rate_sse`
- **调用**：运行 `scripts/aktools_get.py stock_sgt_settlement_exchange_rate_sse --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.sse.com.cn/services/hkexsc/disclo/ratios

描述: 沪港通-港股通信息披露-结算汇兑

限量: 单次获取所有沪港通结算汇率数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称       | 类型      | 描述  |
|----------|---------|-----|
| 适用日期     | object  | -   |
| 买入结算汇兑比率 | float64 | -   |
| 卖出结算汇兑比率 | float64 | -   |
| 货币种类     | object  | -   |

### stock_sgt_reference_exchange_rate_szse
- **文档定位**：沪深港通持股 / 参考汇率-深港通
- **HTTP**：`GET /api/public/stock_sgt_reference_exchange_rate_szse`
- **调用**：运行 `scripts/aktools_get.py stock_sgt_reference_exchange_rate_szse --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.szse.cn/szhk/hkbussiness/exchangerate/index.html

描述: 深港通-港股通业务信息-参考汇率

限量: 单次获取所有深港通参考汇率数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称      | 类型      | 描述  |
|---------|---------|-----|
| 适用日期    | object  | -   |
| 参考汇率买入价 | float64 | -   |
| 参考汇率卖出价 | float64 | -   |
| 货币种类    | object  | -   |

### stock_sgt_reference_exchange_rate_sse
- **文档定位**：沪深港通持股 / 参考汇率-沪港通
- **HTTP**：`GET /api/public/stock_sgt_reference_exchange_rate_sse`
- **调用**：运行 `scripts/aktools_get.py stock_sgt_reference_exchange_rate_sse --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.sse.com.cn/services/hkexsc/disclo/ratios/

描述: 沪港通-港股通信息披露-参考汇率

限量: 单次获取所有沪港通参考汇率数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称      | 类型      | 描述  |
|---------|---------|-----|
| 适用日期    | object  | -   |
| 参考汇率买入价 | float64 | -   |
| 参考汇率卖出价 | float64 | -   |
| 货币种类    | object  | -   |

### stock_hk_ggt_components_em
- **文档定位**：沪深港通持股 / 港股通成份股
- **HTTP**：`GET /api/public/stock_hk_ggt_components_em`
- **调用**：运行 `scripts/aktools_get.py stock_hk_ggt_components_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/center/gridlist.html#hk_components

描述: 东方财富网-行情中心-港股市场-港股通成份股

限量: 单次获取所有港股通成份股数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称  | 类型      | 描述        |
|-----|---------|-----------|
| 序号  | int64   | -         |
| 代码  | object  | -         |
| 名称  | object  | -         |
| 最新价 | float64 | 注意单位: HKD |
| 涨跌额 | float64 | -         |
| 涨跌幅 | float64 | -         |
| 今开  | float64 | -         |
| 最高  | float64 | -         |
| 最低  | float64 | -         |
| 昨收  | float64 | -         |
| 成交量 | float64 | 注意单位: 股   |
| 成交额 | float64 | 注意单位: 港元  |

### stock_hsgt_fund_min_em
- **文档定位**：沪深港通持股 / 沪深港通分时数据
- **HTTP**：`GET /api/public/stock_hsgt_fund_min_em`
- **调用**：运行 `scripts/aktools_get.py stock_hsgt_fund_min_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/hsgt/hsgtDetail/scgk.html

描述: 东方财富-数据中心-沪深港通-市场概括-分时数据

限量: 单次返回指定 symbol 的所有数据；20240513起数据源不再提供数据

输入参数

| 名称     | 类型  | 描述                                        |
|--------|-----|-------------------------------------------|
| symbol | str | symbol="北向资金"; choice of {"北向资金", "南向资金"} |

输出参数-北向资金

| 名称   | 类型      | 描述       |
|------|---------|----------|
| 日期   | object  | 日期       |
| 时间   | object  | 时间       |
| 沪股通  | float64 | 注意单位: 万元 |
| 深股通  | float64 | 注意单位: 万元 |
| 北向资金 | float64 | 注意单位: 万元 |

接口示例-北向资金

```python
import akshare as ak

stock_hsgt_fund_min_em_df = ak.stock_hsgt_fund_min_em(symbol="北向资金")
print(stock_hsgt_fund_min_em_df)
```

### stock_hsgt_board_rank_em
- **文档定位**：沪深港通持股 / 板块排行
- **HTTP**：`GET /api/public/stock_hsgt_board_rank_em`
- **调用**：运行 `scripts/aktools_get.py stock_hsgt_board_rank_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/hsgtcg/bk.html

描述: 东方财富网-数据中心-沪深港通持股-板块排行

限量: 单次获取指定 symbol 和 indicator 的所有数据

输入参数

| 名称        | 类型  | 描述                                                                                |
|-----------|-----|-----------------------------------------------------------------------------------|
| symbol    | str | symbol="北向资金增持行业板块排行"; choice of {"北向资金增持行业板块排行", "北向资金增持概念板块排行", "北向资金增持地域板块排行"} |
| indicator | str | indicator="今日"; choice of {"今日", "3日", "5日", "10日", "1月", "1季", "1年"}             |

输出参数

| 名称                | 类型      | 描述      |
|-------------------|---------|---------|
| 序号                | int64   | -       |
| 名称                | object  | -       |
| 最新涨跌幅             | float64 | 注意单位: % |
| 北向资金今日持股-股票只数     | float64 | -       |
| 北向资金今日持股-市值       | float64 | 注意单位: 元 |
| 北向资金今日持股-占板块比     | float64 | -       |
| 北向资金今日持股-占北向资金比   | float64 | -       |
| 北向资金今日增持估计-股票只数   | float64 | -       |
| 北向资金今日增持估计-市值     | float64 | 注意单位: 元 |
| 北向资金今日增持估计-市值增幅   | float64 | -       |
| 北向资金今日增持估计-占板块比   | float64 | -       |
| 北向资金今日增持估计-占北向资金比 | float64 | -       |
| 今日增持最大股-市值        | float64 | -       |
| 今日增持最大股-占股本比      | float64 | -       |
| 今日减持最大股-占股本比      | float64 | -       |
| 今日减持最大股-市值        | float64 | -       |
| 报告时间              | object  | -       |

### stock_hsgt_hold_stock_em
- **文档定位**：沪深港通持股 / 个股排行
- **HTTP**：`GET /api/public/stock_hsgt_hold_stock_em`
- **调用**：运行 `scripts/aktools_get.py stock_hsgt_hold_stock_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/hsgtcg/list.html

描述: 东方财富网-数据中心-沪深港通持股-个股排行

限量: 单次获取指定 market 和 indicator 的所有数据

输入参数

| 名称        | 类型  | 描述                                                                                |
|-----------|-----|-----------------------------------------------------------------------------------|
| market    | str | market="沪股通"; choice of {"北向", "沪股通", "深股通"}                                      |
| indicator | str | indicator="沪股通"; choice of {"今日排行", "3日排行", "5日排行", "10日排行", "月排行", "季排行", "年排行"} |

输出参数

| 名称         | 类型      | 描述                            |
|------------|---------|-------------------------------|
| 序号         | int32   | -                             |
| 代码         | object  | -                             |
| 名称         | object  | -                             |
| 今日收盘价      | float64 | -                             |
| 今日涨跌幅      | float64 | 注意单位: %                       |
| 今日持股-股数    | float64 | 注意单位: 万                       |
| 今日持股-市值    | float64 | 注意单位: 万                       |
| 今日持股-占流通股比 | float64 | 注意单位: %                       |
| 今日持股-占总股本比 | float64 | 注意单位: %                       |
| 增持估计-股数    | float64 | 注意单位: 万; 主要字段名根据 indicator 变化 |
| 增持估计-市值    | float64 | 注意单位: 万; 主要字段名根据 indicator 变化 |
| 增持估计-市值增幅  | object  | 注意单位: %; 主要字段名根据 indicator 变化 |
| 增持估计-占流通股比 | float64 | 注意单位: ‰; 主要字段名根据 indicator 变化 |
| 增持估计-占总股本比 | float64 | 注意单位: ‰; 主要字段名根据 indicator 变化 |
| 所属板块       | object  | -                             |
| 日期         | object  | -                             |

### stock_hsgt_stock_statistics_em
- **文档定位**：沪深港通持股 / 每日个股统计
- **HTTP**：`GET /api/public/stock_hsgt_stock_statistics_em`
- **调用**：运行 `scripts/aktools_get.py stock_hsgt_stock_statistics_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/hsgtcg/StockStatistics.aspx

描述: 东方财富网-数据中心-沪深港通-沪深港通持股-每日个股统计

限量: 单次获取指定 market 的 start_date 和 end_date 之间的所有数据, 该接口只能获取近期的数据

输入参数

| 名称         | 类型  | 描述                                                          |
|------------|-----|-------------------------------------------------------------|
| symbol     | str | symbol="北向持股"; choice of {"北向持股", "沪股通持股", "深股通持股", "南向持股"} |
| start_date | str | start_date="20210601"; 此处指定近期交易日                            |
| end_date   | str | end_date="20210608"; 此处指定近期交易日                              |

输出参数

| 名称          | 类型      | 描述                   |
|-------------|---------|----------------------|
| 持股日期        | object  | -                    |
| 股票代码        | object  | -                    |
| 股票简称        | object  | -                    |
| 当日收盘价       | float64 | 注意单位: 元; 南向持股单位为: 港元 |
| 当日涨跌幅       | float64 | 注意单位: %              |
| 持股数量        | float64 | 注意单位: 万股             |
| 持股市值        | float64 | 注意单位: 万元             |
| 持股数量占发行股百分比 | float64 | 注意单位: %              |
| 持股市值变化-1日   | float64 | 注意单位: 元              |
| 持股市值变化-5日   | float64 | 注意单位: 元              |
| 持股市值变化-10日  | float64 | 注意单位: 元              |

### stock_hsgt_institution_statistics_em
- **文档定位**：沪深港通持股 / 机构排行
- **HTTP**：`GET /api/public/stock_hsgt_institution_statistics_em`
- **调用**：运行 `scripts/aktools_get.py stock_hsgt_institution_statistics_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/hsgtcg/InstitutionStatistics.aspx

描述: 东方财富网-数据中心-沪深港通-沪深港通持股-机构排行

限量: 单次获取指定 market 的所有数据, 该接口只能获取近期的数据

输入参数

| 名称         | 类型  | 描述                                                          |
|------------|-----|-------------------------------------------------------------|
| market     | str | market="北向持股"; choice of {"北向持股", "沪股通持股", "深股通持股", "南向持股"} |
| start_date | str | start_date="20201218"; 此处指定近期交易日                            |
| end_date   | str | end_date="20201218"; 此处指定近期交易日                              |

输出参数

| 名称         | 类型      | 描述                   |
|------------|---------|----------------------|
| 持股日期       | object  | -                    |
| 机构名称       | object  | -                    |
| 持股只数       | float64 | 注意单位: 只              |
| 持股市值       | float64 | 注意单位: 元; 南向持股单位为: 港元 |
| 持股市值变化-1日  | float64 | 注意单位: 元; 南向持股单位为: 港元 |
| 持股市值变化-5日  | float64 | 注意单位: 元; 南向持股单位为: 港元 |
| 持股市值变化-10日 | float64 | 注意单位: 元; 南向持股单位为: 港元 |

### stock_hsgt_sh_hk_spot_em
- **文档定位**：沪深港通持股 / 沪深港通-港股通(沪>港)实时行情
- **HTTP**：`GET /api/public/stock_hsgt_sh_hk_spot_em`
- **调用**：运行 `scripts/aktools_get.py stock_hsgt_sh_hk_spot_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/center/gridlist.html#hk_sh_stocks

描述: 东方财富网-行情中心-沪深港通-港股通(沪>港)-股票；按股票代码排序

限量: 单次获取所有数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称  | 类型      | 描述        |
|-----|---------|-----------|
| 序号  | int64   | -         |
| 代码  | object  | -         |
| 名称  | object  | -         |
| 最新价 | float64 | 注意单位: HKD |
| 涨跌额 | float64 | -         |
| 涨跌幅 | float64 | 注意单位: %   |
| 今开  | float64 | -         |
| 最高  | float64 | -         |
| 最低  | float64 | -         |
| 昨收  | float64 | -         |
| 成交量 | float64 | 注意单位: 亿股  |
| 成交额 | float64 | 注意单位: 亿港元 |

### stock_hsgt_hist_em
- **文档定位**：沪深港通持股 / 沪深港通历史数据
- **HTTP**：`GET /api/public/stock_hsgt_hist_em`
- **调用**：运行 `scripts/aktools_get.py stock_hsgt_hist_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/hsgt/index.html

描述: 东方财富网-数据中心-资金流向-沪深港通资金流向-沪深港通历史数据

限量: 单次获取指定 symbol 的所有数据

输入参数

| 名称     | 类型  | 描述                                                                      |
|--------|-----|-------------------------------------------------------------------------|
| symbol | str | symbol="北向资金"; choice of {"北向资金", "沪股通", "深股通", "南向资金", "港股通沪", "港股通深"} |

输出参数-北向资金

| 名称        | 类型      | 描述        |
|-----------|---------|-----------|
| 日期        | object  | -         |
| 当日成交净买额   | float64 | 注意单位: 亿元  |
| 买入成交额     | float64 | 注意单位: 亿元  |
| 卖出成交额     | float64 | 注意单位: 亿元  |
| 历史累计净买额   | float64 | 注意单位: 万亿元 |
| 当日资金流入    | float64 | 注意单位: 亿元  |
| 当日余额      | float64 | 注意单位: 亿元  |
| 持股市值      | float64 | 注意单位: 元   |
| 领涨股       | object  | -         |
| 领涨股-涨跌幅   | float64 | 注意单位: %   |
| 沪深300     | float64 | -         |
| 沪深300-涨跌幅 | float64 | 注意单位: %   |
| 领涨股-代码    | object  | -         |

接口示例-北向资金

```python
import akshare as ak

stock_hsgt_hist_em_df = ak.stock_hsgt_hist_em(symbol="北向资金")
print(stock_hsgt_hist_em_df)
```

### stock_hsgt_individual_em
- **文档定位**：沪深港通持股 / 沪深港通持股-个股
- **HTTP**：`GET /api/public/stock_hsgt_individual_em`
- **调用**：运行 `scripts/aktools_get.py stock_hsgt_individual_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/hsgt/StockHdDetail/002008.html

描述: 东方财富网-数据中心-沪深港通-沪深港通持股-具体股票

限量: 单次获取指定 symbol 的截至 20240816 的数据

输入参数

| 名称     | 类型  | 描述                       |
|--------|-----|--------------------------|
| symbol | str | symbol="002008"; 支持港股和A股 |

输出参数-A股

| 名称         | 类型      | 描述      |
|------------|---------|---------|
| 持股日期       | object  | -       |
| 当日收盘价      | float64 | 注意单位: 元 |
| 当日涨跌幅      | float64 | 注意单位: % |
| 持股数量       | int64   | 注意单位: 股 |
| 持股市值       | float64 | 注意单位: 元 |
| 持股数量占A股百分比 | float64 | 注意单位: % |
| 今日增持股数     | float64 | 注意单位: 股 |
| 今日增持资金     | float64 | 注意单位: 元 |
| 今日持股市值变化   | float64 | 注意单位: 元 |

输出参数-港股

| 名称         | 类型      | 描述       |
|------------|---------|----------|
| 持股日期       | object  | -        |
| 当日收盘价      | float64 | 注意单位: 港元 |
| 当日涨跌幅      | float64 | 注意单位: %  |
| 持股数量       | int64   | 注意单位: 股  |
| 持股市值       | float64 | 注意单位: 港元 |
| 持股数量占A股百分比 | float64 | 注意单位: %  |
| 持股市值变化-1日  | float64 | 注意单位: 港元 |
| 持股市值变化-5日  | float64 | 注意单位: 港元 |
| 持股市值变化-10日 | float64 | 注意单位: 港元 |

接口示例-A股

```python
import akshare as ak

stock_hsgt_individual_em_df = ak.stock_hsgt_individual_em(symbol="002008")
print(stock_hsgt_individual_em_df)
```

### stock_hsgt_individual_detail_em
- **文档定位**：沪深港通持股 / 沪深港通持股-个股详情
- **HTTP**：`GET /api/public/stock_hsgt_individual_detail_em`
- **调用**：运行 `scripts/aktools_get.py stock_hsgt_individual_detail_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/hsgtcg/StockHdStatistics/002008.html(示例)

描述: 东方财富网-数据中心-沪深港通-沪深港通持股-具体股票-个股详情

限量: 单次获取指定 symbol 的在 start_date 和 end_date 之间的所有数据; 注意只能返回 90 个交易日内的数据

输入参数

| 名称         | 类型  | 描述                                              |
|------------|-----|-------------------------------------------------|
| symbol     | str | symbol="002008"                                 |
| start_date | str | start_date="20210830"; 注意只能返回离最近交易日 90 个交易日内的数据 |
| end_date   | str | end_date="20211026"; 注意只能返回离最近交易日 90 个交易日内的数据   |

输出参数

| 名称         | 类型      | 描述      |
|------------|---------|---------|
| 持股日期       | object  | -       |
| 当日收盘价      | float64 | 注意单位: 元 |
| 当日涨跌幅      | float64 | 注意单位: % |
| 机构名称       | object  | -       |
| 持股数量       | int64   | 注意单位: 股 |
| 持股市值       | float64 | 注意单位: 元 |
| 持股数量占A股百分比 | float64 | 注意单位: % |
| 持股市值变化-1日  | float64 | 注意单位: 元 |
| 持股市值变化-5日  | float64 | 注意单位: 元 |
| 持股市值变化-10日 | float64 | 注意单位: 元 |
