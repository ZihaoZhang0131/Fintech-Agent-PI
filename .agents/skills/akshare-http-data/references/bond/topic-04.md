# 其他细分主题



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### bond_cash_summary_sse
- **文档定位**：上交所债券 / 债券现券市场概览
- **HTTP**：`GET /api/public/bond_cash_summary_sse`
- **调用**：运行 `scripts/aktools_get.py bond_cash_summary_sse --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://bond.sse.com.cn/data/statistics/overview/bondow/

描述: 上登债券信息网-市场数据-市场统计-市场概览-债券现券市场概览

限量: 单次返回指定交易日的债券现券市场概览数据

输入参数

| 名称   | 类型  | 描述              |
|------|-----|-----------------|
| date | str | date='20200111' |

输出参数

| 名称   | 类型      | 描述       |
|------|---------|----------|
| 债券现货 | object  | -        |
| 托管只数 | int64   | -        |
| 托管市值 | float64 | 注意单位: 亿元 |
| 托管面值 | float64 | 注意单位: 亿元 |
| 数据日期 | object  | -        |

### bond_deal_summary_sse
- **文档定位**：上交所债券 / 债券成交概览
- **HTTP**：`GET /api/public/bond_deal_summary_sse`
- **调用**：运行 `scripts/aktools_get.py bond_deal_summary_sse --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://bond.sse.com.cn/data/statistics/overview/turnover/

描述: 上登债券信息网-市场数据-市场统计-市场概览-债券成交概览

限量: 单次返回指定交易日的债券成交概览数据

输入参数

| 名称   | 类型  | 描述              |
|------|-----|-----------------|
| date | str | date='20200104' |

输出参数

| 名称     | 类型      | 描述       |
|--------|---------|----------|
| 债券类型   | object  | -        |
| 当日成交笔数 | int64   | -        |
| 当日成交金额 | float64 | 注意单位: 万元 |
| 当年成交笔数 | int64   | -        |
| 当年成交金额 | float64 | 注意单位: 万元 |
| 数据日期   | object  | -        |

### bond_spot_quote
- **文档定位**：中国债券市场行情数据 / 现券市场做市报价
- **HTTP**：`GET /api/public/bond_spot_quote`
- **调用**：运行 `scripts/aktools_get.py bond_spot_quote --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.chinamoney.com.cn/chinese/mkdatabond/

描述: 中国外汇交易中心暨全国银行间同业拆借中心-市场数据-市场行情-债券市场行情-现券市场做市报价

限量: 单次返回所有数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述      |
|-------|---------|---------|
| 报价机构  | object  |         |
| 债券简称  | object  |         |
| 买入净价  | float64 | 注意单位: 元 |
| 卖出净价  | float64 | 注意单位: 元 |
| 买入收益率 | float64 | 注意单位: % |
| 卖出收益率 | float64 | 注意单位: % |

### bond_spot_deal
- **文档定位**：中国债券市场行情数据 / 现券市场成交行情
- **HTTP**：`GET /api/public/bond_spot_deal`
- **调用**：运行 `scripts/aktools_get.py bond_spot_deal --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.chinamoney.com.cn/chinese/mkdatabond/

描述: 中国外汇交易中心暨全国银行间同业拆借中心-市场数据-市场行情-债券市场行情-现券市场成交行情

限量: 单次返回所有即期数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述       |
|-------|---------|----------|
| 债券简称  | object  | -        |
| 成交净价  | float64 | 注意单位: 元  |
| 最新收益率 | float64 | 注意单位: %  |
| 涨跌    | float64 | 注意单位: BP |
| 加权收益率 | float64 | 注意单位: %  |
| 交易量   | float64 | 注意单位: 亿  |

### bond_china_yield
- **文档定位**：中国债券市场行情数据 / 国债及其他债券收益率曲线
- **HTTP**：`GET /api/public/bond_china_yield`
- **调用**：运行 `scripts/aktools_get.py bond_china_yield --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://yield.chinabond.com.cn/cbweb-pbc-web/pbc/historyQuery?startDate=2019-02-07&endDate=2020-02-04&gjqx=0&qxId=ycqx&locale=cn_ZH

描述: 中国债券信息网-国债及其他债券收益率曲线

限量: 单次返回所有指定日期间 start_date 到 end_date 需要小于一年的所有数据

输入参数

| 名称         | 类型  | 描述                                                          |
|------------|-----|-------------------------------------------------------------|
| start_date | str | start_date="20190204", 指定开始日期; start_date 到 end_date 需要小于一年 |
| end_date   | str | end_date="20200204", 指定结束日期; start_date 到 end_date 需要小于一年   |

输出参数

| 名称   | 类型      | 描述  |
|------|---------|-----|
| 曲线名称 | object  |     |
| 日期   | object  |     |
| 3月   | float64 |     |
| 6月   | float64 |     |
| 1年   | float64 |     |
| 3年   | float64 |     |
| 5年   | float64 |     |
| 7年   | float64 |     |
| 10年  | float64 |     |
| 30年  | float64 |     |

### bond_gb_zh_sina
- **文档定位**：中国国债收益率行情
- **HTTP**：`GET /api/public/bond_gb_zh_sina`
- **调用**：运行 `scripts/aktools_get.py bond_gb_zh_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://stock.finance.sina.com.cn/forex/globalbd/cn10yt.html

描述: 新浪财经-债券-中国国债收益率行情数据

限量: 返回最近 1000 个交易日的数据

输入参数

| 名称     | 类型  | 描述                                                                                                                                   |
|--------|-----|--------------------------------------------------------------------------------------------------------------------------------------|
| symbol | str | symbol="中国10年期国债"; choice of {"中国1年期国债", "中国2年期国债", "中国3年期国债", "中国5年期国债", "中国7年期国债", "中国10年期国债", "中国15年期国债", "中国20年期国债", "中国30年期国债"} |

输出参数

| 名称     | 类型      | 描述 |
|--------|---------|----|
| date   | object  | -  |
| open   | float64 | -  |
| high   | float64 | -  |
| low    | float64 | -  |
| close  | float64 | -  |
| volume | int64   | -  |

### bond_zh_us_rate
- **文档定位**：中美国债收益率
- **HTTP**：`GET /api/public/bond_zh_us_rate`
- **调用**：运行 `scripts/aktools_get.py bond_zh_us_rate --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/cjsj/zmgzsyl.html

描述: 东方财富网-数据中心-经济数据-中美国债收益率历史数据

限量: 返回 start_date 开始后的所有交易日的数据; 数据从 19901219 开始

输入参数

| 名称         | 类型  | 描述                    |
|------------|-----|-----------------------|
| start_date | str | start_date="19901219" |

输出参数

| 名称            | 类型      | 描述  |
|---------------|---------|-----|
| 日期            | object  | -   |
| 中国国债收益率2年     | float64 | -   |
| 中国国债收益率5年     | float64 | -   |
| 中国国债收益率10年    | float64 | -   |
| 中国国债收益率30年    | float64 | -   |
| 中国国债收益率10年-2年 | float64 | -   |
| 中国GDP年增率      | float64 | -   |
| 美国国债收益率2年     | float64 | -   |
| 美国国债收益率5年     | float64 | -   |
| 美国国债收益率10年    | float64 | -   |
| 美国国债收益率30年    | float64 | -   |
| 美国国债收益率10年-2年 | float64 | -   |
| 美国GDP年增率      | float64 | -   |

### bond_debt_nafmii
- **文档定位**：债券基础数据 / 银行间市场债券发行基础数据
- **HTTP**：`GET /api/public/bond_debt_nafmii`
- **调用**：运行 `scripts/aktools_get.py bond_debt_nafmii --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://zhuce.nafmii.org.cn/fans/publicQuery/manager

描述: 中国银行间市场交易商协会-非金融企业债务融资工具注册信息系统

限量: 单次获取指定 page 页面数据的 50 条数据

输入参数

| 名称   | 类型  | 描述                     |
|------|-----|------------------------|
| page | str | page="1", 需要获取第 page 页 |

输出参数

| 名称      | 类型      | 描述      |
|---------|---------|---------|
| 债券名称    | object  | -       |
| 品种      | object  | -       |
| 注册或备案   | object  | -       |
| 金额      | float64 | 注意单位：亿元 |
| 注册通知书文号 | object  | -       |
| 更新日期    | object  | -       |
| 项目状态    | object  | -       |

### bond_cb_jsl
- **文档定位**：可转债实时数据-集思录
- **HTTP**：`GET /api/public/bond_cb_jsl`
- **调用**：运行 `scripts/aktools_get.py bond_cb_jsl --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.jisilu.cn/data/cbnew/#cb

描述: 集思录可转债实时数据，包含行情数据（涨跌幅，成交量和换手率等）及可转债基本信息（转股价，溢价率和到期收益率等）

限量: 单次返回当前交易时刻的所有数据

输入参数

| 名称     | 类型  | 描述                                                 |
|--------|-----|----------------------------------------------------|
| cookie | str | cookie=''; 此处输入您的集思录 cookie 就可以获取完整数据，否则只能返回前 30 条 |

1. 需要查看的链接为：https://app.jisilu.cn/data/cbnew/
2. 需要复制的 Cookie 为：![](https://pic2.zhimg.com/80/v2-c66f56a334e2c5642a9c8e2975b2f871_1440w.webp)
3. 参考文章：[如何拿到集思录的可转债实时数据](https://zhuanlan.zhihu.com/p/607755294)

输出参数

| 名称     | 类型      | 描述       |
|--------|---------|----------|
| 代码     | object  | -        |
| 转债名称   | object  | -        |
| 现价     | float64 | -        |
| 涨跌幅    | float64 | 注意单位: %  |
| 正股代码   | object  | -        |
| 正股名称   | object  | -        |
| 正股价    | float64 | -        |
| 正股涨跌   | float64 | 注意单位: %  |
| 正股PB   | float64 | -        |
| 转股价    | float64 | -        |
| 转股价值   | float64 | -        |
| 转股溢价率  | float64 | 注意单位: %  |
| 债券评级   | object  | -        |
| 回售触发价  | float64 | -        |
| 强赎触发价  | float64 | -        |
| 转债占比   | float64 | 注意单位: %  |
| 到期时间   | object  | -        |
| 剩余年限   | float64 | -        |
| 剩余规模   | float64 | 注意单位: 亿元 |
| 成交额    | float64 | 注意单位: 万元 |
| 换手率    | float64 | 注意单位: %  |
| 到期税前收益 | float64 | 注意单位: %  |
| 双低     | float64 | -        |

### bond_cb_redeem_jsl
- **文档定位**：可转债强赎
- **HTTP**：`GET /api/public/bond_cb_redeem_jsl`
- **调用**：运行 `scripts/aktools_get.py bond_cb_redeem_jsl --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.jisilu.cn/data/cbnew/#redeem

描述: 集思录可转债-强赎

限量: 单次返回所有数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述      |
|-------|---------|---------|
| 代码    | object  | -       |
| 名称    | object  | -       |
| 现价    | float64 | -       |
| 正股代码  | object  | -       |
| 正股名称  | object  | -       |
| 规模    | float64 | 注意单位: 亿 |
| 剩余规模  | float64 | -       |
| 转股起始日 | object  | -       |
| 最后交易日 | object  | -       |
| 到期日   | object  | -       |
| 转股价   | float64 | -       |
| 强赎触发比 | int64   | 注意单位: % |
| 强赎触发价 | float64 | -       |
| 正股价   | float64 | -       |
| 强赎价   | float64 | -       |
| 强赎天计数 | object  | -       |
| 强赎条款  | object  | -       |
| 强赎状态  | object  | -       |

### bond_cb_adj_logs_jsl
- **文档定位**：可转债转股价格调整记录-集思录
- **HTTP**：`GET /api/public/bond_cb_adj_logs_jsl`
- **调用**：运行 `scripts/aktools_get.py bond_cb_adj_logs_jsl --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://app.jisilu.cn/data/cbnew/#cb; 点击带红色星号的转股价会弹出转股价调整记录

描述: 集思录-单个可转债的转股价格-调整记录

限量: 返回当前时刻该可转债的所有转股价格调整记录

输入参数

| 名称     | 类型  | 描述                     |
|--------|-----|------------------------|
| symbol | str | symbol="128013"; 可转债代码 |

输出参数

| 名称       | 类型      | 描述  |
|----------|---------|-----|
| 转债名称     | object  | -   |
| 股东大会日    | object  | -   |
| 下修前转股价   | float64 | -   |
| 下修后转股价   | float64 | -   |
| 新转股价生效日期 | object  | -   |
| 下修底价     | float64 | -   |

### bond_china_close_return
- **文档定位**：收盘收益率曲线历史数据
- **HTTP**：`GET /api/public/bond_china_close_return`
- **调用**：运行 `scripts/aktools_get.py bond_china_close_return --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.chinamoney.com.cn/chinese/bkcurvclosedyhis/?bondType=CYCC000&reference=1

描述: 收盘收益率曲线历史数据, 该接口只能获取近 3 个月的数据，且每次获取的数据不超过 1 个月

输入参数

| 名称         | 类型  | 描述                                                                       |
|------------|-----|--------------------------------------------------------------------------|
| symbol     | str | symbol="政策性金融债(进出口行)"; 通过网页查询或调用 **ak.bond_china_close_return_map()** 获取 |
| period     | str | period: str = "1"; 期限间隔, choice of {'0.1', '0.5', '1'}                   |
| start_date | str | start_date="20231101"; 结束日期, 结束日期和开始日期不要超过 1 个月                          |
| end_date   | str | end_date="20231101"; 结束日期, 结束日期和开始日期不要超过 1 个月                            |

输出参数

| 名称    | 类型      | 描述  |
|-------|---------|-----|
| 日期    | object  | -   |
| 期限    | float64 | -   |
| 到期收益率 | float64 | -   |
| 即期收益率 | float64 | -   |
| 远期收益率 | float64 | -   |

### bond_zh_hs_spot
- **文档定位**：沪深债券 / 实时行情数据
- **HTTP**：`GET /api/public/bond_zh_hs_spot`
- **调用**：运行 `scripts/aktools_get.py bond_zh_hs_spot --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://vip.stock.finance.sina.com.cn/mkt/#hs_z

描述: 新浪财经-债券-沪深债券-实时行情数据

限量: 单次返回所有沪深债券的实时行情数据

输入参数

| 名称         | 类型  | 描述                                |
|------------|-----|-----------------------------------|
| start_page | str | start_page="1"; 开始获取的页面，每页 80 条数据 |
| end_page   | str | end_page="10"; 结束获取的页面，每页 80 条数据  |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 代码  | object  | -       |
| 名称  | object  | -       |
| 最新价 | float64 | -       |
| 涨跌额 | float64 | -       |
| 涨跌幅 | float64 | -       |
| 买入  | float64 | -       |
| 卖出  | float64 | -       |
| 昨收  | float64 | -       |
| 今开  | float64 | -       |
| 最高  | float64 | -       |
| 最低  | float64 | -       |
| 成交量 | int64   | 注意单位: 手 |
| 成交额 | int64   | 注意单位: 万 |

### bond_zh_hs_daily
- **文档定位**：沪深债券 / 历史行情数据
- **HTTP**：`GET /api/public/bond_zh_hs_daily`
- **调用**：运行 `scripts/aktools_get.py bond_zh_hs_daily --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://money.finance.sina.com.cn/bond/quotes/sh019315.html

描述: 新浪财经-债券-沪深债券-历史行情数据, 历史数据按日频率更新

限量: 单次返回具体某个沪深转债的所有历史行情数据

输入参数

| 名称     | 类型  | 描述                |
|--------|-----|-------------------|
| symbol | str | symbol="sh010107" |

输出参数

| 名称     | 类型      | 描述  |
|--------|---------|-----|
| date   | object  | -   |
| open   | float64 | -   |
| high   | float64 | -   |
| low    | float64 | -   |
| close  | float64 | -   |
| volume | float64 | -   |

### bond_gb_us_sina
- **文档定位**：美国国债收益率行情
- **HTTP**：`GET /api/public/bond_gb_us_sina`
- **调用**：运行 `scripts/aktools_get.py bond_gb_us_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://stock.finance.sina.com.cn/forex/globalbd/cn10yt.html

描述: 新浪财经-债券-美国国债收益率行情数据

限量: 返回最近 1000 个交易日的数据

输入参数

| 名称     | 类型  | 描述                                                                                                                                                                              |
|--------|-----|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| symbol | str | symbol="美国10年期国债"; choice of {"美国1月期国债", "美国2月期国债", "美国3月期国债", "美国4月期国债", "美国6月期国债", "美国1年期国债", "美国2年期国债", "美国3年期国债", "美国5年期国债", "美国7年期国债", "美国10年期国债", "美国20年期国债", "美国30年期国债"} |

输出参数

| 名称     | 类型      | 描述 |
|--------|---------|----|
| date   | object  | -  |
| open   | float64 | -  |
| high   | float64 | -  |
| low    | float64 | -  |
| close  | float64 | -  |
| volume | int64   | -  |

### bond_sh_buy_back_em
- **文档定位**：质押式回购 / 上证质押式回购
- **HTTP**：`GET /api/public/bond_sh_buy_back_em`
- **调用**：运行 `scripts/aktools_get.py bond_sh_buy_back_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/center/gridlist.html#bond_sh_buyback

描述: 东方财富网-行情中心-债券市场-上证质押式回购

限量: 单次返回所有行情数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称  | 类型      | 描述 |
|-----|---------|----|
| 序号  | int64   | -  |
| 代码  | object  | -  |
| 名称  | object  | -  |
| 最新价 | float64 | -  |
| 涨跌额 | float64 | -  |
| 涨跌幅 | float64 | -  |
| 今开  | float64 | -  |
| 最高  | float64 | -  |
| 最低  | float64 | -  |
| 昨收  | float64 | -  |
| 成交量 | float64 | -  |
| 成交额 | float64 | -  |

### bond_sz_buy_back_em
- **文档定位**：质押式回购 / 深证质押式回购
- **HTTP**：`GET /api/public/bond_sz_buy_back_em`
- **调用**：运行 `scripts/aktools_get.py bond_sz_buy_back_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/center/gridlist.html#bond_sz_buyback

描述: 东方财富网-行情中心-债券市场-深证质押式回购

限量: 单次返回所有行情数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称  | 类型      | 描述 |
|-----|---------|----|
| 序号  | int64   | -  |
| 代码  | object  | -  |
| 名称  | object  | -  |
| 最新价 | float64 | -  |
| 涨跌额 | float64 | -  |
| 涨跌幅 | float64 | -  |
| 今开  | float64 | -  |
| 最高  | float64 | -  |
| 最低  | float64 | -  |
| 昨收  | float64 | -  |
| 成交量 | float64 | -  |
| 成交额 | float64 | -  |

### bond_buy_back_hist_em
- **文档定位**：质押式回购 / 质押式回购历史数据
- **HTTP**：`GET /api/public/bond_buy_back_hist_em`
- **调用**：运行 `scripts/aktools_get.py bond_buy_back_hist_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/center/gridlist.html#bond_sh_buyback

描述: 东方财富网-行情中心-债券市场-质押式回购-历史数据

限量: 单次返回所有历史行情数据

输入参数

| 名称     | 类型  | 描述                       |
|--------|-----|--------------------------|
| symbol | str | symbol="204001"; 质押式回购代码 |

输出参数

| 名称  | 类型      | 描述 |
|-----|---------|----|
| 日期  | int64   | -  |
| 开盘  | float64 | -  |
| 收盘  | float64 | -  |
| 最高  | float64 | -  |
| 最低  | float64 | -  |
| 成交量 | float64 | -  |
| 成交额 | float64 | -  |

### bond_info_cm
- **文档定位**：债券查询
- **HTTP**：`GET /api/public/bond_info_cm`
- **调用**：运行 `scripts/aktools_get.py bond_info_cm --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.chinamoney.com.cn/chinese/scsjzqxx/

描述: 中国外汇交易中心暨全国银行间同业拆借中心-数据-债券信息-信息查询

输入参数

| 名称          | 类型  | 描述                                                      |
|-------------|-----|---------------------------------------------------------|
| bond_name   | str | bond_name=""; 默认为空                                      |
| bond_code   | str | bond_code=""; 默认为空                                      |
| bond_issue  | str | bond_issue=""; 默认为空, 通过 ak.bond_info_cm_query() 查询相关参数  |
| bond_type   | str | bond_type=""; 默认为空, 通过 ak.bond_info_cm_query() 查询相关参数   |
| coupon_type | str | coupon_type=""; 默认为空, 通过 ak.bond_info_cm_query() 查询相关参数 |
| issue_year  | str | issue_year=""; 默认为空                                     |
| underwriter | str | underwriter=""; 默认为空, 通过 ak.bond_info_cm_query() 查询相关参数 |
| grade       | str | grade=""; 默认为空                                          |

输出参数

| 名称       | 类型     | 描述  |
|----------|--------|-----|
| 债券简称     | object | -   |
| 债券代码     | object | -   |
| 发行人/受托机构 | object | -   |
| 债券类型     | object | -   |
| 发行日期     | object | -   |
| 最新债项评级   | object | -   |
| 查询代码     | object | -   |

### bond_info_detail_cm
- **文档定位**：债券基础信息
- **HTTP**：`GET /api/public/bond_info_detail_cm`
- **调用**：运行 `scripts/aktools_get.py bond_info_detail_cm --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.chinamoney.com.cn/chinese/zqjc/?bondDefinedCode=egfjh08154

描述: 中国外汇交易中心暨全国银行间同业拆借中心-数据-债券信息-信息查询-债券详情

输入参数

| 名称     | 类型  | 描述                                                 |
|--------|-----|----------------------------------------------------|
| symbol | str | symbol="19万林投资CP001"; 通过 ak.bond_info_cm() 查询 债券简称 |

输出参数

| 名称    | 类型     | 描述  |
|-------|--------|-----|
| name  | object | -   |
| value | object | -   |

### bond_cb_index_jsl
- **文档定位**：集思录可转债等权指数
- **HTTP**：`GET /api/public/bond_cb_index_jsl`
- **调用**：运行 `scripts/aktools_get.py bond_cb_index_jsl --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.jisilu.cn/web/data/cb/index

描述: 可转债-集思录可转债等权指数

限量: 单次返回所有历史数据数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称                  | 类型      | 描述        |
|---------------------|---------|-----------|
| price_dt            | object  | 日期        |
| price               | float64 | 指数        |
| amount              | float64 | 剩余规模(亿元)  |
| volume              | float64 | 成交额(亿元)   |
| count               | int64   | 数量        |
| increase_val        | float64 | 涨跌        |
| increase_rt         | float64 | 涨幅        |
| avg_price           | float64 | 平均价格(元)   |
| mid_price           | float64 | 中位数价格(元)  |
| mid_convert_value   | float64 | 中位数转股价值   |
| avg_dblow           | float64 | 平均双底      |
| avg_premium_rt      | float64 | 平均溢价率     |
| mid_premium_rt      | float64 | 中位数溢价率    |
| avg_ytm_rt          | float64 | 平均收益率     |
| turnover_rt         | float64 | 换手率       |
| price_90            | int64   | >90       |
| price_90_100        | int64   | 90~100    |
| price_100_110       | int64   | 100~110   |
| price_110_120       | int64   | 110~120   |
| price_120_130       | int64   | 120~130   |
| price_130           | int64   | >130      |
| increase_rt_90      | float64 | >90涨幅     |
| increase_rt_90_100  | float64 | 90~100涨幅  |
| increase_rt_100_110 | float64 | 100~110涨幅 |
| increase_rt_110_120 | float64 | 110~120涨幅 |
| increase_rt_120_130 | float64 | 120~130涨幅 |
| increase_rt_130     | float64 | >130涨幅    |
| idx_price           | float64 | 沪深300指数   |
| idx_increase_rt     | float64 | 沪深300指数涨幅 |
