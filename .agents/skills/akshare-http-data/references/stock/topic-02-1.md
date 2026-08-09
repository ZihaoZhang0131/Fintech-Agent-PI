# A股



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### stock_sse_summary
- **文档定位**：A股 / 股票市场总貌 / 上海证券交易所
- **HTTP**：`GET /api/public/stock_sse_summary`
- **调用**：运行 `scripts/aktools_get.py stock_sse_summary --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.sse.com.cn/market/stockdata/statistic/

描述: 上海证券交易所-股票数据总貌

限量: 单次返回最近交易日的股票数据总貌(当前交易日的数据需要交易所收盘后统计)

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数-实时行情数据

| 名称  | 类型     | 描述  |
|-----|--------|-----|
| 项目  | object | -   |
| 股票  | object | -   |
| 科创板 | object | -   |
| 主板  | object | -   |

### stock_szse_summary
- **文档定位**：A股 / 股票市场总貌 / 深圳证券交易所 / 证券类别统计
- **HTTP**：`GET /api/public/stock_szse_summary`
- **调用**：运行 `scripts/aktools_get.py stock_szse_summary --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.szse.cn/market/overview/index.html

描述: 深圳证券交易所-市场总貌-证券类别统计

限量: 单次返回指定 date 的市场总貌数据-证券类别统计(当前交易日的数据需要交易所收盘后统计)

输入参数

| 名称   | 类型  | 描述                                  |
|------|-----|-------------------------------------|
| date | str | date="20200619"; 当前交易日的数据需要交易所收盘后统计 |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 证券类别 | object  | -       |
| 数量   | int64   | 注意单位: 只 |
| 成交金额 | float64 | 注意单位: 元 |
| 总市值  | float64 | -       |
| 流通市值 | float64 | -       |

### stock_szse_area_summary
- **文档定位**：A股 / 股票市场总貌 / 深圳证券交易所 / 地区交易排序
- **HTTP**：`GET /api/public/stock_szse_area_summary`
- **调用**：运行 `scripts/aktools_get.py stock_szse_area_summary --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.szse.cn/market/overview/index.html

描述: 深圳证券交易所-市场总貌-地区交易排序

限量: 单次返回指定 date 的市场总貌数据-地区交易排序数据

输入参数

| 名称   | 类型  | 描述                |
|------|-----|-------------------|
| date | str | date="202203"; 年月 |

输出参数

| 名称    | 类型      | 描述      |
|-------|---------|---------|
| 序号    | int64   | -       |
| 地区    | object  | -       |
| 总交易额  | float64 | 注意单位: 元 |
| 占市场   | float64 | 注意单位: % |
| 股票交易额 | float64 | 注意单位: 元 |
| 基金交易额 | float64 | 注意单位: 元 |
| 债券交易额 | float64 | 注意单位: 元 |

2025年添加优先股交易额与期权交易额

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| 序号     | int64   | -       |
| 地区     | object  | -       |
| 总交易额   | float64 | 注意单位: 元 |
| 占市场    | float64 | 注意单位: % |
| 股票交易额  | float64 | 注意单位: 元 |
| 基金交易额  | float64 | 注意单位: 元 |
| 债券交易额  | float64 | 注意单位: 元 |
| 优先股交易额 | float64 | 注意单位: 元 |
| 期权交易额  | float64 | 注意单位: 元 |
| 接口示例   |         |         |

```python
import akshare as ak

stock_szse_area_summary_df = ak.stock_szse_area_summary(date="202412")
print(stock_szse_area_summary_df)
```

### stock_szse_sector_summary
- **文档定位**：A股 / 股票市场总貌 / 深圳证券交易所 / 股票行业成交
- **HTTP**：`GET /api/public/stock_szse_sector_summary`
- **调用**：运行 `scripts/aktools_get.py stock_szse_sector_summary --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://docs.static.szse.cn/www/market/periodical/month/W020220511355248518608.html

描述: 深圳证券交易所-统计资料-股票行业成交数据

限量: 单次返回指定 symbol 和 date 的统计资料-股票行业成交数据

说明: 仅支持查询深交所统计月报页面已发布的月份; 若传入尚未发布的月份, 接口会抛出明确的参数异常并提示当前最新可用月份

输入参数

| 名称     | 类型  | 描述                                  |
|--------|-----|-------------------------------------|
| symbol | str | symbol="当月"; choice of {"当月", "当年"} |
| date   | str | date="202501"; 年月                   |

输出参数

| 名称        | 类型      | 描述      |
|-----------|---------|---------|
| 项目名称      | object  | -       |
| 项目名称-英文   | object  | -       |
| 交易天数      | int64   | -       |
| 成交金额-人民币元 | int64   |         |
| 成交金额-占总计  | float64 | 注意单位: % |
| 成交股数-股数   | int64   | -       |
| 成交股数-占总计  | float64 | 注意单位: % |
| 成交笔数-笔    | int64   | -       |
| 成交笔数-占总计  | float64 | 注意单位: % |

### stock_sse_deal_daily
- **文档定位**：A股 / 股票市场总貌 / 上海证券交易所-每日概况
- **HTTP**：`GET /api/public/stock_sse_deal_daily`
- **调用**：运行 `scripts/aktools_get.py stock_sse_deal_daily --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.sse.com.cn/market/stockdata/overview/day/

描述: 上海证券交易所-数据-股票数据-成交概况-股票成交概况-每日股票情况

限量: 单次返回指定日期的每日概况数据, 当前交易日数据需要在收盘后获取; 注意仅支持获取在 20211227（包含）之后的数据

输入参数

| 名称   | 类型  | 描述                                                              |
|------|-----|-----------------------------------------------------------------|
| date | str | date="20250221"; 当前交易日的数据需要交易所收盘后统计; 注意仅支持获取在 20211227（包含）之后的数据 |

输出参数

| 名称   | 类型      | 描述        |
|------|---------|-----------|
| 单日情况 | object  | 包含了网页所有字段 |
| 股票   | float64 | -         |
| 主板A  | float64 | -         |
| 主板B  | float64 | -         |
| 科创板  | float64 | -         |
| 股票回购 | float64 | -         |

### stock_individual_info_em
- **文档定位**：A股 / 个股信息查询-东财
- **HTTP**：`GET /api/public/stock_individual_info_em`
- **调用**：运行 `scripts/aktools_get.py stock_individual_info_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://quote.eastmoney.com/concept/sh603777.html?from=classic

描述: 东方财富-个股-股票信息

限量: 单次返回指定 symbol 的个股信息

说明: 接口已兼容东方财富返回体偶发新增的顶层元数据字段, 如 `dsc`

输入参数

| 名称      | 类型    | 描述                      |
|---------|-------|-------------------------|
| symbol  | str   | symbol="603777"; 股票代码   |
| timeout | float | timeout=None; 默认不设置超时参数 |

输出参数

| 名称    | 类型     | 描述  |
|-------|--------|-----|
| item  | object | -   |
| value | object | -   |

### stock_individual_basic_info_xq
- **文档定位**：A股 / 个股信息查询-雪球
- **HTTP**：`GET /api/public/stock_individual_basic_info_xq`
- **调用**：运行 `scripts/aktools_get.py stock_individual_basic_info_xq --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://xueqiu.com/snowman/S/SH601127/detail#/GSJJ

描述: 雪球财经-个股-公司概况-公司简介

限量: 单次返回指定 symbol 的个股信息

输入参数

| 名称      | 类型    | 描述                      |
|---------|-------|-------------------------|
| symbol  | str   | symbol="SH601127"; 股票代码 |
| token   | str   | token=None; 雪球 xq_a_token |
| timeout | float | timeout=None; 默认不设置超时参数 |

输出参数

| 名称    | 类型     | 描述  |
|-------|--------|-----|
| item  | object | -   |
| value | object | -   |

### stock_bid_ask_em
- **文档定位**：A股 / 行情报价
- **HTTP**：`GET /api/public/stock_bid_ask_em`
- **调用**：运行 `scripts/aktools_get.py stock_bid_ask_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/sz000001.html

描述: 东方财富-行情报价

限量: 单次返回指定股票的行情报价数据

输入参数

| 名称     | 类型  | 描述                    |
|--------|-----|-----------------------|
| symbol | str | symbol="000001"; 股票代码 |

输出参数

| 名称    | 类型      | 描述 |
|-------|---------|----|
| item  | object  | -  |
| value | float64 | -  |

### stock_zh_a_spot_em
- **文档定位**：A股 / 实时行情数据 / 实时行情数据-东财 / 沪深京 A 股
- **HTTP**：`GET /api/public/stock_zh_a_spot_em`
- **调用**：运行 `scripts/aktools_get.py stock_zh_a_spot_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/center/gridlist.html#hs_a_board

描述: 东方财富网-沪深京 A 股-实时行情数据

限量: 单次返回所有沪深京 A 股上市公司的实时行情数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称      | 类型      | 描述      |
|---------|---------|---------|
| 序号      | int64   | -       |
| 代码      | object  | -       |
| 名称      | object  | -       |
| 最新价     | float64 | -       |
| 涨跌幅     | float64 | 注意单位: % |
| 涨跌额     | float64 | -       |
| 成交量     | float64 | 注意单位: 手 |
| 成交额     | float64 | 注意单位: 元 |
| 振幅      | float64 | 注意单位: % |
| 最高      | float64 | -       |
| 最低      | float64 | -       |
| 今开      | float64 | -       |
| 昨收      | float64 | -       |
| 量比      | float64 | -       |
| 换手率     | float64 | 注意单位: % |
| 市盈率-动态  | float64 | -       |
| 市净率     | float64 | -       |
| 总市值     | float64 | 注意单位: 元 |
| 流通市值    | float64 | 注意单位: 元 |
| 涨速      | float64 | -       |
| 5分钟涨跌   | float64 | 注意单位: % |
| 60日涨跌幅  | float64 | 注意单位: % |
| 年初至今涨跌幅 | float64 | 注意单位: % |

### stock_sh_a_spot_em
- **文档定位**：A股 / 实时行情数据 / 实时行情数据-东财 / 沪 A 股
- **HTTP**：`GET /api/public/stock_sh_a_spot_em`
- **调用**：运行 `scripts/aktools_get.py stock_sh_a_spot_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://quote.eastmoney.com/center/gridlist.html#sh_a_board

描述: 东方财富网-沪 A 股-实时行情数据

限量: 单次返回所有沪 A 股上市公司的实时行情数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称      | 类型      | 描述      |
|---------|---------|---------|
| 序号      | int64   | -       |
| 代码      | object  | -       |
| 名称      | object  | -       |
| 最新价     | float64 | -       |
| 涨跌幅     | float64 | 注意单位: % |
| 涨跌额     | float64 | -       |
| 成交量     | float64 | 注意单位: 手 |
| 成交额     | float64 | 注意单位: 元 |
| 振幅      | float64 | 注意单位: % |
| 最高      | float64 | -       |
| 最低      | float64 | -       |
| 今开      | float64 | -       |
| 昨收      | float64 | -       |
| 量比      | float64 | -       |
| 换手率     | float64 | 注意单位: % |
| 市盈率-动态  | float64 | -       |
| 市净率     | float64 | -       |
| 总市值     | float64 | 注意单位: 元 |
| 流通市值    | float64 | 注意单位: 元 |
| 涨速      | float64 | -       |
| 5分钟涨跌   | float64 | 注意单位: % |
| 60日涨跌幅  | float64 | 注意单位: % |
| 年初至今涨跌幅 | float64 | 注意单位: % |

### stock_sz_a_spot_em
- **文档定位**：A股 / 实时行情数据 / 实时行情数据-东财 / 深 A 股
- **HTTP**：`GET /api/public/stock_sz_a_spot_em`
- **调用**：运行 `scripts/aktools_get.py stock_sz_a_spot_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://quote.eastmoney.com/center/gridlist.html#sz_a_board

描述: 东方财富网-深 A 股-实时行情数据

限量: 单次返回所有深 A 股上市公司的实时行情数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称      | 类型      | 描述      |
|---------|---------|---------|
| 序号      | int64   | -       |
| 代码      | object  | -       |
| 名称      | object  | -       |
| 最新价     | float64 | -       |
| 涨跌幅     | float64 | 注意单位: % |
| 涨跌额     | float64 | -       |
| 成交量     | float64 | 注意单位: 手 |
| 成交额     | float64 | 注意单位: 元 |
| 振幅      | float64 | 注意单位: % |
| 最高      | float64 | -       |
| 最低      | float64 | -       |
| 今开      | float64 | -       |
| 昨收      | float64 | -       |
| 量比      | float64 | -       |
| 换手率     | float64 | 注意单位: % |
| 市盈率-动态  | float64 | -       |
| 市净率     | float64 | -       |
| 总市值     | float64 | 注意单位: 元 |
| 流通市值    | float64 | 注意单位: 元 |
| 涨速      | float64 | -       |
| 5分钟涨跌   | float64 | 注意单位: % |
| 60日涨跌幅  | float64 | 注意单位: % |
| 年初至今涨跌幅 | float64 | 注意单位: % |

### stock_bj_a_spot_em
- **文档定位**：A股 / 实时行情数据 / 实时行情数据-东财 / 京 A 股
- **HTTP**：`GET /api/public/stock_bj_a_spot_em`
- **调用**：运行 `scripts/aktools_get.py stock_bj_a_spot_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://quote.eastmoney.com/center/gridlist.html#bj_a_board

描述: 东方财富网-京 A 股-实时行情数据

限量: 单次返回所有京 A 股上市公司的实时行情数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称      | 类型      | 描述      |
|---------|---------|---------|
| 序号      | int64   | -       |
| 代码      | object  | -       |
| 名称      | object  | -       |
| 最新价     | float64 | -       |
| 涨跌幅     | float64 | 注意单位: % |
| 涨跌额     | float64 | -       |
| 成交量     | float64 | 注意单位: 手 |
| 成交额     | float64 | 注意单位: 元 |
| 振幅      | float64 | 注意单位: % |
| 最高      | float64 | -       |
| 最低      | float64 | -       |
| 今开      | float64 | -       |
| 昨收      | float64 | -       |
| 量比      | float64 | -       |
| 换手率     | float64 | 注意单位: % |
| 市盈率-动态  | float64 | -       |
| 市净率     | float64 | -       |
| 总市值     | float64 | 注意单位: 元 |
| 流通市值    | float64 | 注意单位: 元 |
| 涨速      | float64 | -       |
| 5分钟涨跌   | float64 | 注意单位: % |
| 60日涨跌幅  | float64 | 注意单位: % |
| 年初至今涨跌幅 | float64 | 注意单位: % |

### stock_new_a_spot_em
- **文档定位**：A股 / 实时行情数据 / 实时行情数据-东财 / 新股
- **HTTP**：`GET /api/public/stock_new_a_spot_em`
- **调用**：运行 `scripts/aktools_get.py stock_new_a_spot_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://quote.eastmoney.com/center/gridlist.html#newshares

描述: 东方财富网-新股-实时行情数据

限量: 单次返回所有新股上市公司的实时行情数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称      | 类型      | 描述      |
|---------|---------|---------|
| 序号      | int64   | -       |
| 代码      | object  | -       |
| 名称      | object  | -       |
| 最新价     | float64 | -       |
| 涨跌幅     | float64 | 注意单位: % |
| 涨跌额     | float64 | -       |
| 成交量     | float64 | 注意单位: 手 |
| 成交额     | float64 | 注意单位: 元 |
| 振幅      | float64 | 注意单位: % |
| 最高      | float64 | -       |
| 最低      | float64 | -       |
| 今开      | float64 | -       |
| 昨收      | float64 | -       |
| 量比      | float64 | -       |
| 换手率     | float64 | 注意单位: % |
| 市盈率-动态  | float64 | -       |
| 市净率     | float64 | -       |
| 上市时间    | object  | -       |
| 总市值     | float64 | 注意单位: 元 |
| 流通市值    | float64 | 注意单位: 元 |
| 涨速      | float64 | -       |
| 5分钟涨跌   | float64 | 注意单位: % |
| 60日涨跌幅  | float64 | 注意单位: % |
| 年初至今涨跌幅 | float64 | 注意单位: % |

### stock_cy_a_spot_em
- **文档定位**：A股 / 实时行情数据 / 实时行情数据-东财 / 创业板
- **HTTP**：`GET /api/public/stock_cy_a_spot_em`
- **调用**：运行 `scripts/aktools_get.py stock_cy_a_spot_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/center/gridlist.html#gem_board

描述: 东方财富网-创业板-实时行情

限量: 单次返回所有创业板的实时行情数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称      | 类型      | 描述      |
|---------|---------|---------|
| 序号      | int64   | -       |
| 代码      | object  | -       |
| 名称      | object  | -       |
| 最新价     | float64 | -       |
| 涨跌幅     | float64 | 注意单位: % |
| 涨跌额     | float64 | -       |
| 成交量     | float64 | 注意单位: 手 |
| 成交额     | float64 | 注意单位: 元 |
| 振幅      | float64 | 注意单位: % |
| 最高      | float64 | -       |
| 最低      | float64 | -       |
| 今开      | float64 | -       |
| 昨收      | float64 | -       |
| 量比      | float64 | -       |
| 换手率     | float64 | 注意单位: % |
| 市盈率-动态  | float64 | -       |
| 市净率     | float64 | -       |
| 总市值     | float64 | 注意单位: 元 |
| 流通市值    | float64 | 注意单位: 元 |
| 涨速      | float64 | -       |
| 5分钟涨跌   | float64 | 注意单位: % |
| 60日涨跌幅  | float64 | 注意单位: % |
| 年初至今涨跌幅 | float64 | 注意单位: % |

### stock_kc_a_spot_em
- **文档定位**：A股 / 实时行情数据 / 实时行情数据-东财 / 科创板
- **HTTP**：`GET /api/public/stock_kc_a_spot_em`
- **调用**：运行 `scripts/aktools_get.py stock_kc_a_spot_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://quote.eastmoney.com/center/gridlist.html#kcb_board

描述: 东方财富网-科创板-实时行情

限量: 单次返回所有科创板的实时行情数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称      | 类型      | 描述      |
|---------|---------|---------|
| 序号      | int64   | -       |
| 代码      | object  | -       |
| 名称      | object  | -       |
| 最新价     | float64 | -       |
| 涨跌幅     | float64 | 注意单位: % |
| 涨跌额     | float64 | -       |
| 成交量     | float64 | 注意单位: 手 |
| 成交额     | float64 | 注意单位: 元 |
| 振幅      | float64 | 注意单位: % |
| 最高      | float64 | -       |
| 最低      | float64 | -       |
| 今开      | float64 | -       |
| 昨收      | float64 | -       |
| 量比      | float64 | -       |
| 换手率     | float64 | 注意单位: % |
| 市盈率-动态  | float64 | -       |
| 市净率     | float64 | -       |
| 总市值     | float64 | 注意单位: 元 |
| 流通市值    | float64 | 注意单位: 元 |
| 涨速      | float64 | -       |
| 5分钟涨跌   | float64 | 注意单位: % |
| 60日涨跌幅  | float64 | 注意单位: % |
| 年初至今涨跌幅 | float64 | 注意单位: % |

### stock_zh_ab_comparison_em
- **文档定位**：A股 / 实时行情数据 / 实时行情数据-东财 / AB 股比价
- **HTTP**：`GET /api/public/stock_zh_ab_comparison_em`
- **调用**：运行 `scripts/aktools_get.py stock_zh_ab_comparison_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/center/gridlist.html#ab_comparison

描述: 东方财富网-行情中心-沪深京个股-AB股比价-全部AB股比价

限量: 单次返回全部 AB 股比价的实时行情数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述 |
|------|---------|----|
| 序号   | int64   | -  |
| B股代码 | object  | -  |
| B股名称 | object  | -  |
| 最新价B | float64 | -  |
| 涨跌幅B | float64 | -  |
| A股代码 | object  | -  |
| A股名称 | object  | -  |
| 最新价A | float64 | -  |
| 涨跌幅A | float64 | -  |
| 比价   | float64 | -  |

### stock_zh_a_spot
- **文档定位**：A股 / 实时行情数据 / 实时行情数据-新浪
- **HTTP**：`GET /api/public/stock_zh_a_spot`
- **调用**：运行 `scripts/aktools_get.py stock_zh_a_spot --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://vip.stock.finance.sina.com.cn/mkt/#hs_a

描述: 新浪财经-沪深京 A 股数据, 重复运行本函数会被新浪暂时封 IP, 建议增加时间间隔

限量: 单次返回沪深京 A 股上市公司的实时行情数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 代码  | object  | -       |
| 名称  | object  | -       |
| 最新价 | float64 | -       |
| 涨跌额 | float64 | -       |
| 涨跌幅 | float64 | 注意单位: % |
| 买入  | float64 | -       |
| 卖出  | float64 | -       |
| 昨收  | float64 | -       |
| 今开  | float64 | -       |
| 最高  | float64 | -       |
| 最低  | float64 | -       |
| 成交量 | float64 | 注意单位: 股 |
| 成交额 | float64 | 注意单位: 元 |
| 时间戳 | object  | -       |

### stock_individual_spot_xq
- **文档定位**：A股 / 实时行情数据 / 实时行情数据-雪球
- **HTTP**：`GET /api/public/stock_individual_spot_xq`
- **调用**：运行 `scripts/aktools_get.py stock_individual_spot_xq --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://xueqiu.com/S/SH513520

描述: 雪球-行情中心-个股

限量: 单次获取指定 symbol 的最新行情数据

输入参数

| 名称      | 类型    | 描述                                                             |
|---------|-------|----------------------------------------------------------------|
| symbol  | str   | symbol="SH600000"; 证券代码，可以是 A 股个股代码，A 股场内基金代码，A 股指数，美股代码, 美股指数 |
| token   | str   | token=None; 雪球 xq_a_token                                        |
| timeout | float | timeout=None; 默认不设置超时参数                                        |

输出参数

| 名称    | 类型     | 描述 |
|-------|--------|----|
| item  | object | -  |
| value | object | -  |

### stock_zh_a_hist
- **文档定位**：A股 / 历史行情数据 / 历史行情数据-东财
- **HTTP**：`GET /api/public/stock_zh_a_hist`
- **调用**：运行 `scripts/aktools_get.py stock_zh_a_hist --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/concept/sh603777.html?from=classic(示例)

描述: 东方财富-沪深京 A 股日频率数据; 历史数据按日频率更新, 当日收盘价请在收盘后获取

限量: 单次返回指定沪深京 A 股上市公司、指定周期和指定日期间的历史行情日频率数据

输入参数

| 名称         | 类型    | 描述                                                       |
|------------|-------|----------------------------------------------------------|
| symbol     | str   | symbol='603777'; 股票代码可以在 **ak.stock_zh_a_spot_em()** 中获取 |
| period     | str   | period='daily'; choice of {'daily', 'weekly', 'monthly'} |
| start_date | str   | start_date='20210301'; 开始查询的日期                           |
| end_date   | str   | end_date='20210616'; 结束查询的日期                             |
| adjust     | str   | 默认返回不复权的数据; qfq: 返回前复权后的数据; hfq: 返回后复权后的数据               |
| timeout    | float | timeout=None; 默认不设置超时参数                                  |

**股票数据复权**

1. 为何要复权：由于股票存在配股、分拆、合并和发放股息等事件，会导致股价出现较大的缺口。
若使用不复权的价格处理数据、计算各种指标，将会导致它们失去连续性，且使用不复权价格计算收益也会出现错误。
为了保证数据连贯性，常通过前复权和后复权对价格序列进行调整。

2. 前复权：保持当前价格不变，将历史价格进行增减，从而使股价连续。
前复权用来看盘非常方便，能一眼看出股价的历史走势，叠加各种技术指标也比较顺畅，是各种行情软件默认的复权方式。
这种方法虽然很常见，但也有两个缺陷需要注意。

    2.1 为了保证当前价格不变，每次股票除权除息，均需要重新调整历史价格，因此其历史价格是时变的。
这会导致在不同时点看到的历史前复权价可能出现差异。

    2.2 对于有持续分红的公司来说，前复权价可能出现负值。

3. 后复权：保证历史价格不变，在每次股票权益事件发生后，调整当前的股票价格。
后复权价格和真实股票价格可能差别较大，不适合用来看盘。
其优点在于，可以被看作投资者的长期财富增长曲线，反映投资者的真实收益率情况。

4. 在量化投资研究中普遍采用后复权数据。

输出参数-历史行情数据

| 名称   | 类型      | 描述          |
|------|---------|-------------|
| 日期   | object  | 交易日         |
| 股票代码 | object  | 不带市场标识的股票代码 |
| 开盘   | float64 | 开盘价         |
| 收盘   | float64 | 收盘价         |
| 最高   | float64 | 最高价         |
| 最低   | float64 | 最低价         |
| 成交量  | int64   | 注意单位: 手     |
| 成交额  | float64 | 注意单位: 元     |
| 振幅   | float64 | 注意单位: %     |
| 涨跌幅  | float64 | 注意单位: %     |
| 涨跌额  | float64 | 注意单位: 元     |
| 换手率  | float64 | 注意单位: %     |

接口示例-历史行情数据-不复权

```python
import akshare as ak

stock_zh_a_hist_df = ak.stock_zh_a_hist(symbol="000001", period="daily", start_date="20170301", end_date='20240528', adjust="")
print(stock_zh_a_hist_df)
```

### stock_zh_a_daily
- **文档定位**：A股 / 历史行情数据 / 历史行情数据-新浪
- **HTTP**：`GET /api/public/stock_zh_a_daily`
- **调用**：运行 `scripts/aktools_get.py stock_zh_a_daily --param key=value`；参数以本卡的输入参数表为准。

P.S. 建议切换为 stock_zh_a_hist 接口使用(该接口数据质量高, 访问无限制)

目标地址: https://finance.sina.com.cn/realstock/company/sh600006/nc.shtml(示例)

描述: 新浪财经-沪深京 A 股的数据, 历史数据按日频率更新; 注意其中的 **sh689009** 为 CDR, 请 通过 **ak.stock_zh_a_cdr_daily** 接口获取

限量: 单次返回指定沪深京 A 股上市公司指定日期间的历史行情日频率数据, 多次获取容易封禁 IP

输入参数

| 名称         | 类型  | 描述                                                                                   |
|------------|-----|--------------------------------------------------------------------------------------|
| symbol     | str | symbol='sh600000'; 股票代码可以在 **ak.stock_zh_a_spot()** 中获取                              |
| start_date | str | start_date='20201103'; 开始查询的日期                                                       |
| end_date   | str | end_date='20201116'; 结束查询的日期                                                         |
| adjust     | str | 默认返回不复权的数据; qfq: 返回前复权后的数据; hfq: 返回后复权后的数据; hfq-factor: 返回后复权因子; qfq-factor: 返回前复权因子 |

**股票数据复权**

1.为何要复权：由于股票存在配股、分拆、合并和发放股息等事件，会导致股价出现较大的缺口。
若使用不复权的价格处理数据、计算各种指标，将会导致它们失去连续性，且使用不复权价格计算收益也会出现错误。
为了保证数据连贯性，常通过前复权和后复权对价格序列进行调整。

2.前复权：保持当前价格不变，将历史价格进行增减，从而使股价连续。
前复权用来看盘非常方便，能一眼看出股价的历史走势，叠加各种技术指标也比较顺畅，是各种行情软件默认的复权方式。
这种方法虽然很常见，但也有两个缺陷需要注意。

2.1 为了保证当前价格不变，每次股票除权除息，均需要重新调整历史价格，因此其历史价格是时变的。
这会导致在不同时点看到的历史前复权价可能出现差异。

2.2 对于有持续分红的公司来说，前复权价可能出现负值。

3.后复权：保证历史价格不变，在每次股票权益事件发生后，调整当前的股票价格。
后复权价格和真实股票价格可能差别较大，不适合用来看盘。
其优点在于，可以被看作投资者的长期财富增长曲线，反映投资者的真实收益率情况。

4.在量化投资研究中普遍采用后复权数据。

输出参数-历史行情数据

| 名称                | 类型      | 描述            |
|-------------------|---------|---------------|
| date              | object  | 交易日           |
| open              | float64 | 开盘价           |
| high              | float64 | 最高价           |
| low               | float64 | 最低价           |
| close             | float64 | 收盘价           |
| volume            | float64 | 成交量; 注意单位: 股  |
| amount            | float64 | 成交额; 注意单位: 元  |
| outstanding_share | float64 | 流动股本; 注意单位: 股 |
| turnover          | float64 | 换手率=成交量/流动股本  |

接口示例-历史行情数据(前复权)

```python
import akshare as ak

stock_zh_a_daily_qfq_df = ak.stock_zh_a_daily(symbol="sz000001", start_date="19910403", end_date="20231027", adjust="qfq")
print(stock_zh_a_daily_qfq_df)
```

### stock_zh_a_hist_tx
- **文档定位**：A股 / 历史行情数据 / 历史行情数据-腾讯
- **HTTP**：`GET /api/public/stock_zh_a_hist_tx`
- **调用**：运行 `scripts/aktools_get.py stock_zh_a_hist_tx --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://gu.qq.com/sh000919/zs

描述: 腾讯证券-日频-股票历史数据; 历史数据按日频率更新, 当日收盘价请在收盘后获取

限量: 单次返回指定沪深京 A 股上市公司、指定周期和指定日期间的历史行情日频率数据

输入参数

| 名称         | 类型    | 描述                                         |
|------------|-------|--------------------------------------------|
| symbol     | str   | symbol='sz000001'; 带市场标识                   |
| start_date | str   | start_date='19000101'; 开始查询的日期             |
| end_date   | str   | end_date='20500101'; 结束查询的日期               |
| adjust     | str   | 默认返回不复权的数据; qfq: 返回前复权后的数据; hfq: 返回后复权后的数据 |
| timeout    | float | timeout=None; 默认不设置超时参数                    |

**股票数据复权**

1.为何要复权：由于股票存在配股、分拆、合并和发放股息等事件，会导致股价出现较大的缺口。
若使用不复权的价格处理数据、计算各种指标，将会导致它们失去连续性，且使用不复权价格计算收益也会出现错误。
为了保证数据连贯性，常通过前复权和后复权对价格序列进行调整。

2.前复权：保持当前价格不变，将历史价格进行增减，从而使股价连续。
前复权用来看盘非常方便，能一眼看出股价的历史走势，叠加各种技术指标也比较顺畅，是各种行情软件默认的复权方式。
这种方法虽然很常见，但也有两个缺陷需要注意。

2.1 为了保证当前价格不变，每次股票除权除息，均需要重新调整历史价格，因此其历史价格是时变的。
这会导致在不同时点看到的历史前复权价可能出现差异。

2.2 对于有持续分红的公司来说，前复权价可能出现负值。

3.后复权：保证历史价格不变，在每次股票权益事件发生后，调整当前的股票价格。
后复权价格和真实股票价格可能差别较大，不适合用来看盘。
其优点在于，可以被看作投资者的长期财富增长曲线，反映投资者的真实收益率情况。

4.在量化投资研究中普遍采用后复权数据。

输出参数-历史行情数据

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| date   | object  | 交易日     |
| open   | float64 | 开盘价     |
| close  | float64 | 收盘价     |
| high   | float64 | 最高价     |
| low    | float64 | 最低价     |
| volume | float64 | 成交量; 单位: 股 |
| turnover | float64 | 换手率; 小数表示 |
| amount | float64 | 成交额; 单位: 元 |

说明:

- `symbol` 支持传入带市场前缀的代码, 如 `sz000001`
- `symbol` 也支持传入纯 6 位 A 股代码, 如 `000001`, 接口内部会自动补全市场前缀
- `volume` 已统一为股, `amount` 已统一为元

接口示例-不复权

```python
import akshare as ak

stock_zh_a_hist_tx_df = ak.stock_zh_a_hist_tx(symbol="sz000001", start_date="20200101", end_date="20231027", adjust="")
print(stock_zh_a_hist_tx_df)
```

### stock_zh_a_minute
- **文档定位**：A股 / 历史行情数据 / 分时数据-新浪
- **HTTP**：`GET /api/public/stock_zh_a_minute`
- **调用**：运行 `scripts/aktools_get.py stock_zh_a_minute --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://finance.sina.com.cn/realstock/company/sh600519/nc.shtml

描述: 新浪财经-沪深京 A 股股票或者指数的分时数据，目前可以获取 1, 5, 15, 30, 60 分钟的数据频率, 可以指定是否复权

限量: 单次返回指定股票或指数的指定频率的最近交易日的历史分时行情数据; 注意调用频率

输入参数

| 名称     | 类型  | 描述                                                         |
|--------|-----|------------------------------------------------------------|
| symbol | str | symbol='sh000300'; 同日频率数据接口                                |
| period | str | period='1'; 获取 1, 5, 15, 30, 60 分钟的数据频率                    |
| adjust | str | adjust=""; 默认为空: 返回不复权的数据; qfq: 返回前复权后的数据; hfq: 返回后复权后的数据; |

输出参数

| 名称     | 类型      | 描述  |
|--------|---------|-----|
| day    | object  | -   |
| open   | float64 | -   |
| high   | float64 | -   |
| low    | float64 | -   |
| close  | float64 | -   |
| volume | float64 | -   |
| amount | float64 | -   |

### stock_zh_a_hist_min_em
- **文档定位**：A股 / 历史行情数据 / 分时数据-东财
- **HTTP**：`GET /api/public/stock_zh_a_hist_min_em`
- **调用**：运行 `scripts/aktools_get.py stock_zh_a_hist_min_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/concept/sh603777.html

描述: 东方财富网-行情首页-沪深京 A 股-每日分时行情; 该接口只能获取近期的分时数据，注意时间周期的设置

限量: 单次返回指定股票、频率、复权调整和时间区间的分时数据, 其中 1 分钟数据只返回近 5 个交易日数据且不复权

输入参数

| 名称         | 类型  | 描述                                                                                                  |
|------------|-----|-----------------------------------------------------------------------------------------------------|
| symbol     | str | symbol='000300'; 股票代码                                                                               |
| start_date | str | start_date="1979-09-01 09:32:00"; 日期时间; 默认返回所有数据                                                    |
| end_date   | str | end_date="2222-01-01 09:32:00"; 日期时间; 默认返回所有数据                                                      |
| period     | str | period='5'; choice of {'1', '5', '15', '30', '60'}; 其中 1 分钟数据返回近 5 个交易日数据且不复权                       |
| adjust     | str | adjust=''; choice of {'', 'qfq', 'hfq'}; '': 不复权, 'qfq': 前复权, 'hfq': 后复权, 其中 1 分钟数据返回近 5 个交易日数据且不复权 |

输出参数-1分钟数据

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 时间  | object  | -       |
| 开盘  | float64 | -       |
| 收盘  | float64 | -       |
| 最高  | float64 | -       |
| 最低  | float64 | -       |
| 成交量 | float64 | 注意单位: 手 |
| 成交额 | float64 | -       |
| 均价  | float64 | -       |

接口示例-1分钟数据

```python
import akshare as ak

# 注意：该接口返回的数据只有最近一个交易日的有开盘价，其他日期开盘价为 0
stock_zh_a_hist_min_em_df = ak.stock_zh_a_hist_min_em(symbol="000001", start_date="2024-03-20 09:30:00", end_date="2024-03-20 15:00:00", period="1", adjust="")
print(stock_zh_a_hist_min_em_df)
```

### stock_intraday_em
- **文档定位**：A股 / 历史行情数据 / 日内分时数据-东财
- **HTTP**：`GET /api/public/stock_intraday_em`
- **调用**：运行 `scripts/aktools_get.py stock_intraday_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/f1.html?newcode=0.000001

描述: 东方财富-分时数据

限量: 单次返回指定股票最近一个交易日的分时数据, 包含盘前数据

输入参数

| 名称         | 类型  | 描述                                  |
|------------|-----|-------------------------------------|
| symbol     | str | symbol="000001"; 股票代码               |

输出参数

| 名称    | 类型      | 描述 |
|-------|---------|----|
| 时间    | object  | -  |
| 成交价   | float64 | -  |
| 手数    | int64   | -  |
| 买卖盘性质 | object  | -  |

### stock_intraday_sina
- **文档定位**：A股 / 历史行情数据 / 日内分时数据-新浪
- **HTTP**：`GET /api/public/stock_intraday_sina`
- **调用**：运行 `scripts/aktools_get.py stock_intraday_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://vip.stock.finance.sina.com.cn/quotes_service/view/cn_bill.php?symbol=sz000001

描述: 新浪财经-日内分时数据

限量: 单次返回指定交易日的分时数据；只能获取近期的数据，此处仅返回大单数据（成交量大于等于: 400手）

输入参数

| 名称     | 类型  | 描述                            |
|--------|-----|-------------------------------|
| symbol | str | symbol="sz000001"; 带市场标识的股票代码 |
| date   | str | date="20240321"; 交易日          |

输出参数

| 名称         | 类型      | 描述            |
|------------|---------|---------------|
| symbol     | object  | -             |
| name       | object  | -             |
| ticktime   | object  | -             |
| price      | float64 | -             |
| volume     | int64   | 注意单位: 股       |
| prev_price | float64 | -             |
| kind       | object  | D 表示卖盘，表示 是买盘 |

### stock_zh_a_hist_pre_min_em
- **文档定位**：A股 / 历史行情数据 / 盘前数据
- **HTTP**：`GET /api/public/stock_zh_a_hist_pre_min_em`
- **调用**：运行 `scripts/aktools_get.py stock_zh_a_hist_pre_min_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/concept/sh603777.html

描述: 东方财富-股票行情-盘前数据

限量: 单次返回指定 symbol 的最近一个交易日的股票分钟数据, 包含盘前分钟数据

输入参数

| 名称         | 类型  | 描述                                  |
|------------|-----|-------------------------------------|
| symbol     | str | symbol="000001"; 股票代码               |
| start_time | str | start_time="09:00:00"; 时间; 默认返回所有数据 |
| end_time   | str | end_time="15:40:00"; 时间; 默认返回所有数据   |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 时间  | object  | -       |
| 开盘  | float64 | -       |
| 收盘  | float64 | -       |
| 最高  | float64 | -       |
| 最低  | float64 | -       |
| 成交量 | float64 | 注意单位: 手 |
| 成交额 | float64 | -       |
| 最新价 | float64 | -       |

### stock_zh_a_tick_tx
- **文档定位**：A股 / 历史分笔数据 / 腾讯财经
- **HTTP**：`GET /api/public/stock_zh_a_tick_tx`
- **调用**：运行 `scripts/aktools_get.py stock_zh_a_tick_tx --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://gu.qq.com/sz300494/gp/detail(示例)

描述: 每个交易日 16:00 提供当日数据; 如遇到数据缺失, 请使用 **ak.stock_zh_a_tick_163()** 接口(注意数据会有一定差异)

限量: 单次返回最近交易日的历史分笔行情数据

输入参数-历史行情数据

| 名称         | 类型  | 描述                    |
|------------|-----|-----------------------|
| symbol     | str | symbol="sh600000"     |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 成交时间 | object  | -       |
| 成交价格 | float64 | 注意单位: 元 |
| 价格变动 | float64 | 注意单位: 元 |
| 成交量  | int32   | 注意单位: 手 |
| 成交额  | int32   | 注意单位: 元 |
| 性质   | object  | 买卖盘标记   |

### stock_zh_growth_comparison_em
- **文档定位**：A股 / 同行比较 / 成长性比较
- **HTTP**：`GET /api/public/stock_zh_growth_comparison_em`
- **调用**：运行 `scripts/aktools_get.py stock_zh_growth_comparison_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://emweb.securities.eastmoney.com/pc_hsf10/pages/index.html?type=web&code=000895&color=b#/thbj/czxbj

描述: 东方财富-行情中心-同行比较-成长性比较

限量: 单次返回全部数据

输入参数

| 名称         | 类型  | 描述                    |
|------------|-----|-----------------------|
| symbol     | str | symbol="SZ000895"     |

输出参数

| 名称               | 类型      | 描述 |
|------------------|---------|----|
| 代码               | object  | -  |
| 简称               | object  | -  |
| 基本每股收益增长率-3年复合   | float64 | -  |
| 基本每股收益增长率-24A    | float64 | -  |
| 基本每股收益增长率-TTM    | float64 | -  |
| 基本每股收益增长率-25E    | float64 | -  |
| 基本每股收益增长率-26E    | float64 | -  |
| 基本每股收益增长率-27E    | float64 | -  |
| 营业收入增长率-3年复合     | float64 | -  |
| 营业收入增长率-24A      | float64 | -  |
| 营业收入增长率-TTM      | float64 | -  |
| 营业收入增长率-25E      | float64 | -  |
| 营业收入增长率-26E      | float64 | -  |
| 营业收入增长率-27E      | float64 | -  |
| 净利润增长率-3年复合      | float64 | -  |
| 净利润增长率-24A       | float64 | -  |
| 净利润增长率-TTM       | float64 | -  |
| 净利润增长率-25E       | float64 | -  |
| 净利润增长率-26E       | float64 | -  |
| 净利润增长率-27E       | float64 | -  |
| 基本每股收益增长率-3年复合排名 | float64 | -  |

### stock_zh_valuation_comparison_em
- **文档定位**：A股 / 同行比较 / 估值比较
- **HTTP**：`GET /api/public/stock_zh_valuation_comparison_em`
- **调用**：运行 `scripts/aktools_get.py stock_zh_valuation_comparison_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://emweb.securities.eastmoney.com/pc_hsf10/pages/index.html?type=web&code=000895&color=b#/thbj/gzbj

描述: 东方财富-行情中心-同行比较-估值比较

限量: 单次返回全部数据

输入参数

| 名称         | 类型  | 描述                    |
|------------|-----|-----------------------|
| symbol     | str | symbol="SZ000895"     |

输出参数

| 名称            | 类型      | 描述 |
|---------------|---------|----|
| 排名            | object  | -  |
| 代码            | object  | -  |
| 简称            | object  | -  |
| PEG           | float64 | -  |
| 市盈率-24A       | float64 | -  |
| 市盈率-TTM       | float64 | -  |
| 市盈率-25E       | float64 | -  |
| 市盈率-26E       | float64 | -  |
| 市盈率-27E       | float64 | -  |
| 市销率-24A       | float64 | -  |
| 市销率-TTM       | float64 | -  |
| 市销率-25E       | float64 | -  |
| 市销率-26E       | float64 | -  |
| 市销率-27E       | float64 | -  |
| 市净率-24A       | float64 | -  |
| 市净率-MRQ       | float64 | -  |
| 市现率1-24A      | float64 | -  |
| 市现率1-TTM      | float64 | -  |
| 市现率2-24A      | float64 | -  |
| 市现率2-TTM      | float64 | -  |
| EV/EBITDA-24A | float64 | -  |

### stock_zh_dupont_comparison_em
- **文档定位**：A股 / 同行比较 / 杜邦分析比较
- **HTTP**：`GET /api/public/stock_zh_dupont_comparison_em`
- **调用**：运行 `scripts/aktools_get.py stock_zh_dupont_comparison_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://emweb.securities.eastmoney.com/pc_hsf10/pages/index.html?type=web&code=000895&color=b#/thbj/dbfxbj

描述: 东方财富-行情中心-同行比较-杜邦分析比较

限量: 单次返回全部数据

输入参数

| 名称         | 类型  | 描述                    |
|------------|-----|-----------------------|
| symbol     | str | symbol="SZ000895"     |

输出参数

| 名称          | 类型      | 描述 |
|-------------|---------|----|
| 代码          | object  | -  |
| 简称          | object  | -  |
| ROE-3年平均    | float64 | -  |
| ROE-22A     | float64 | -  |
| ROE-23A     | float64 | -  |
| ROE-24A     | float64 | -  |
| 净利率-3年平均    | float64 | -  |
| 净利率-22A     | float64 | -  |
| 净利率-23A     | float64 | -  |
| 净利率-24A     | float64 | -  |
| 总资产周转率-3年平均 | float64 | -  |
| 总资产周转率-22A  | float64 | -  |
| 总资产周转率-23A  | float64 | -  |
| 总资产周转率-24A  | float64 | -  |
| 权益乘数-3年平均   | float64 | -  |
| 权益乘数-22A    | float64 | -  |
| 权益乘数-23A    | float64 | -  |
| 权益乘数-24A    | float64 | -  |
| ROE-3年平均排名  | float64 | -  |
