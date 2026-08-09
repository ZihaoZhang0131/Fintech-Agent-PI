# 融资融券



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### stock_margin_ratio_pa
- **文档定位**：融资融券 / 标的证券名单及保证金比例查询
- **HTTP**：`GET /api/public/stock_margin_ratio_pa`
- **调用**：运行 `scripts/aktools_get.py stock_margin_ratio_pa --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://stock.pingan.com/static/webinfo/margin/business.html?businessType=0

描述: 融资融券-标的证券名单及保证金比例查询

限量: 单次返回指定交易所和交易日的所有历史数据

输入参数

| 名称     | 类型  | 描述                                         |
|--------|-----|--------------------------------------------|
| symbol | str | symbol="深市"; choice of {"深市", "沪市", "北交所"} |
| date   | str | date="20260113"                            |

输出参数

| 名称   | 类型      | 描述 |
|------|---------|----|
| 证券代码 | object  | -  |
| 证券简称 | object  | -  |
| 融资比例 | float64 | -  |
| 融券比例 | float64 | -  |

### stock_margin_account_info
- **文档定位**：融资融券 / 两融账户信息
- **HTTP**：`GET /api/public/stock_margin_account_info`
- **调用**：运行 `scripts/aktools_get.py stock_margin_account_info --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/rzrq/zhtjday.html

描述: 东方财富网-数据中心-融资融券-融资融券账户统计-两融账户信息

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称            | 类型      | 描述       |
|---------------|---------|----------|
| 日期            | object  | -        |
| 融资余额          | float64 | 注意单位: 亿  |
| 融券余额          | float64 | 注意单位: 亿  |
| 融资买入额         | float64 | 注意单位: 亿  |
| 融券卖出额         | float64 | 注意单位: 亿  |
| 证券公司数量        | float64 | 注意单位: 家  |
| 营业部数量         | float64 | 注意单位: 家  |
| 个人投资者数量       | float64 | 注意单位: 万名 |
| 机构投资者数量       | float64 | 注意单位: 家  |
| 参与交易的投资者数量    | float64 | 注意单位: 名  |
| 有融资融券负债的投资者数量 | float64 | 注意单位: 名  |
| 担保物总价值        | float64 | 注意单位: 亿  |
| 平均维持担保比例      | float64 | 注意单位: %  |

### stock_margin_sse
- **文档定位**：融资融券 / 上海证券交易所 / 融资融券汇总
- **HTTP**：`GET /api/public/stock_margin_sse`
- **调用**：运行 `scripts/aktools_get.py stock_margin_sse --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.sse.com.cn/market/othersdata/margin/sum/

描述: 上海证券交易所-融资融券数据-融资融券汇总数据

限量: 单次返回指定时间段内的所有历史数据

输入参数

| 名称         | 类型  | 描述                    |
|------------|-----|-----------------------|
| start_date | str | start_date="20010106" |
| end_date   | str | end_date="20010106"   |

输出参数

| 名称     | 类型     | 描述      |
|--------|--------|---------|
| 信用交易日期 | object | -       |
| 融资余额   | int64  | 注意单位: 元 |
| 融资买入额  | int64  | 注意单位: 元 |
| 融券余量   | int64  | -       |
| 融券余量金额 | int64  | 注意单位: 元 |
| 融券卖出量  | int64  | -       |
| 融资融券余额 | int64  | 注意单位: 元 |

### stock_margin_detail_sse
- **文档定位**：融资融券 / 上海证券交易所 / 融资融券明细
- **HTTP**：`GET /api/public/stock_margin_detail_sse`
- **调用**：运行 `scripts/aktools_get.py stock_margin_detail_sse --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.sse.com.cn/market/othersdata/margin/detail/

描述: 上海证券交易所-融资融券数据-融资融券明细数据

限量: 单次返回交易日的所有历史数据

输入参数

| 名称   | 类型  | 描述              |
|------|-----|-----------------|
| date | str | date="20210205" |

输出参数

| 名称     | 类型     | 描述      |
|--------|--------|---------|
| 信用交易日期 | object | -       |
| 标的证券代码 | object | -       |
| 标的证券简称 | object | -       |
| 融资余额   | int64  | 注意单位: 元 |
| 融资买入额  | int64  | 注意单位: 元 |
| 融资偿还额  | int64  | 注意单位: 元 |
| 融券余量   | int64  | -       |
| 融券卖出量  | int64  | -       |
| 融券偿还量  | int64  | -       |

### stock_margin_szse
- **文档定位**：融资融券 / 深圳证券交易所 / 融资融券汇总
- **HTTP**：`GET /api/public/stock_margin_szse`
- **调用**：运行 `scripts/aktools_get.py stock_margin_szse --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.szse.cn/disclosure/margin/margin/index.html

描述: 深圳证券交易所-融资融券数据-融资融券汇总数据

限量: 单次返回指定时间内的所有历史数据

输入参数

| 名称   | 类型  | 描述                    |
|------|-----|-----------------------|
| date | str | date="20240411"; 交易日期 |

输出参数

| 名称     | 类型      | 描述          |
|--------|---------|-------------|
| 融资买入额  | float64 | 注意单位: 亿元    |
| 融资余额   | float64 | 注意单位: 亿元    |
| 融券卖出量  | float64 | 注意单位: 亿股/亿份 |
| 融券余量   | float64 | 注意单位: 亿股/亿份 |
| 融券余额   | float64 | 注意单位: 亿元    |
| 融资融券余额 | float64 | 注意单位: 亿元    |

### stock_margin_detail_szse
- **文档定位**：融资融券 / 深圳证券交易所 / 融资融券明细
- **HTTP**：`GET /api/public/stock_margin_detail_szse`
- **调用**：运行 `scripts/aktools_get.py stock_margin_detail_szse --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.szse.cn/disclosure/margin/margin/index.html

描述: 深证证券交易所-融资融券数据-融资融券交易明细数据

限量: 单次返回指定 date 的所有历史数据

输入参数

| 名称   | 类型  | 描述              |
|------|-----|-----------------|
| date | str | date="20220118" |

输出参数

| 名称     | 类型     | 描述        |
|--------|--------|-----------|
| 证券代码   | object | -         |
| 证券简称   | object | -         |
| 融资买入额  | int64  | 注意单位: 元   |
| 融资余额   | int64  | 注意单位: 元   |
| 融券卖出量  | int64  | 注意单位: 股/份 |
| 融券余量   | int64  | 注意单位: 股/份 |
| 融券余额   | int64  | 注意单位: 元   |
| 融资融券余额 | int64  | 注意单位: 元   |

### stock_margin_underlying_info_szse
- **文档定位**：融资融券 / 深圳证券交易所 / 标的证券信息
- **HTTP**：`GET /api/public/stock_margin_underlying_info_szse`
- **调用**：运行 `scripts/aktools_get.py stock_margin_underlying_info_szse --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.szse.cn/disclosure/margin/object/index.html

描述: 深圳证券交易所-融资融券数据-标的证券信息

限量: 单次返回交易日的所有历史数据

输入参数

| 名称   | 类型  | 描述              |
|------|-----|-----------------|
| date | str | date="20210205" |

输出参数

| 名称       | 类型     | 描述  |
|----------|--------|-----|
| 证券代码     | object | -   |
| 证券简称     | object | -   |
| 融资标的     | object | -   |
| 融券标的     | object | -   |
| 当日可融资    | object | -   |
| 当日可融券    | object | -   |
| 融券卖出价格限制 | object | -   |
| 涨跌幅限制    | object | -   |

### stock_margin_bse
- **文档定位**：融资融券 / 北京证券交易所 / 融资融券汇总
- **HTTP**：`GET /api/public/stock_margin_bse`
- **调用**：运行 `scripts/aktools_get.py stock_margin_bse --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.bse.cn/disclosure/rzrq_trans_list.html

描述: 北京证券交易所-融资融券数据-融资融券汇总数据

限量: 单次返回指定交易日的汇总数据

输入参数

| 名称   | 类型  | 描述                    |
|------|-----|-----------------------|
| date | str | date="20260721"; 交易日期 |

输出参数

| 名称     | 类型      | 描述        |
|--------|---------|-----------|
| 融资买入额  | float64 | 注意单位: 万元 |
| 融资余额   | float64 | 注意单位: 万元 |
| 融券卖出量  | float64 | 注意单位: 万股 |
| 融券余量   | float64 | 注意单位: 万股 |
| 融券余额   | float64 | 注意单位: 万元 |
| 融资融券余额 | float64 | 注意单位: 万元 |

### stock_margin_detail_bse
- **文档定位**：融资融券 / 北京证券交易所 / 融资融券明细
- **HTTP**：`GET /api/public/stock_margin_detail_bse`
- **调用**：运行 `scripts/aktools_get.py stock_margin_detail_bse --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.bse.cn/disclosure/rzrq_trans_list.html

描述: 北京证券交易所-融资融券数据-融资融券交易明细数据

限量: 单次返回指定交易日的全部明细数据

输入参数

| 名称   | 类型  | 描述                    |
|------|-----|-----------------------|
| date | str | date="20260721"; 交易日期 |

输出参数

| 名称     | 类型     | 描述      |
|--------|--------|---------|
| 证券代码   | object | -       |
| 证券简称   | object | -       |
| 融资买入额  | int64  | 注意单位: 元 |
| 融资余额   | int64  | 注意单位: 元 |
| 融券卖出量  | int64  | 注意单位: 股 |
| 融券余量   | int64  | 注意单位: 股 |
| 融券余额   | int64  | 注意单位: 元 |
| 融资融券余额 | int64  | 注意单位: 元 |

### stock_margin_underlying_info_bse
- **文档定位**：融资融券 / 北京证券交易所 / 标的证券信息
- **HTTP**：`GET /api/public/stock_margin_underlying_info_bse`
- **调用**：运行 `scripts/aktools_get.py stock_margin_underlying_info_bse --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.bse.cn/disclosure/rzrq_bdzq_list.html

描述: 北京证券交易所-融资融券数据-标的证券信息

限量: 单次返回指定交易日的全部标的证券信息

输入参数

| 名称   | 类型  | 描述                    |
|------|-----|-----------------------|
| date | str | date="20260722"; 交易日期 |

输出参数

| 名称    | 类型     | 描述  |
|-------|--------|-----|
| 证券代码  | object | -   |
| 证券简称  | object | -   |
| 融资标的  | object | -   |
| 融券标的  | object | -   |
| 当日可融资 | object | -   |
| 当日可融券 | object | -   |
