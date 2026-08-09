# 其他细分主题



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### stock_zh_a_cdr_daily
- **文档定位**：A股-CDR / 历史行情数据
- **HTTP**：`GET /api/public/stock_zh_a_cdr_daily`
- **调用**：运行 `scripts/aktools_get.py stock_zh_a_cdr_daily --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://finance.sina.com.cn/realstock/company/sh689009/nc.shtml

描述: 上海证券交易所-科创板-CDR

限量: 单次返回指定 CDR 的日频率数据, 分钟历史行情数据可以通过 stock_zh_a_minute 获取

名词解释:

1. [Investopedia-CDR](https://www.investopedia.com/terms/c/cdr.asp)
2. [百度百科-中国存托凭证](https://baike.baidu.com/item/%E4%B8%AD%E5%9B%BD%E5%AD%98%E6%89%98%E5%87%AD%E8%AF%81/2489906?fr=aladdin)

输入参数

| 名称         | 类型  | 描述                          |
|------------|-----|-----------------------------|
| symbol     | str | symbol='sh689009'; CDR 股票代码 |
| start_date | str | start_date='20201103'       |
| end_date   | str | end_date='20201116'         |

输出参数

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| date   | object  | 交易日     |
| open   | float64 | -       |
| high   | float64 | -       |
| low    | float64 | -       |
| close  | float64 | -       |
| volume | float64 | 注意单位: 手 |

### stock_ipo_benefit_ths
- **文档定位**：IPO 受益股
- **HTTP**：`GET /api/public/stock_ipo_benefit_ths`
- **调用**：运行 `scripts/aktools_get.py stock_ipo_benefit_ths --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.10jqka.com.cn/ipo/syg/

描述: 同花顺-数据中心-新股数据-IPO受益股

限量: 单次返回当前交易日的所有数据; 该数据每周更新一次, 返回最近一周的数据

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
| 收盘价    | float64 | 注意单位: 元 |
| 涨跌幅    | float64 | 注意单位: % |
| 市值     | object  | 注意单位: 元 |
| 参股家数   | int64   | -       |
| 投资总额   | object  | 注意单位: 元 |
| 投资占市值比 | float64 | 注意单位: % |
| 参股对象   | object  | -       |

### stock_yzxdr_em
- **文档定位**：一致行动人
- **HTTP**：`GET /api/public/stock_yzxdr_em`
- **调用**：运行 `scripts/aktools_get.py stock_yzxdr_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/yzxdr/

描述: 东方财富网-数据中心-特色数据-一致行动人

限量: 单次返回所有历史数据

输入参数

| 名称   | 类型  | 描述                         |
|------|-----|----------------------------|
| date | str | date="20200930"; 每年的季度末时间点 |

输出参数

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| 序号     | int64   | -       |
| 股票代码   | object  | -       |
| 股票简称   | object  | -       |
| 一致行动人  | object  | -       |
| 股东排名   | object  | -       |
| 持股数量   | int64   | -       |
| 持股比例   | float64 | -       |
| 持股数量变动 | object  | 注意单位: % |
| 行业     | object  | -       |
| 公告日期   | object  | -       |

### stock_zh_a_stop_em
- **文档定位**：两网及退市
- **HTTP**：`GET /api/public/stock_zh_a_stop_em`
- **调用**：运行 `scripts/aktools_get.py stock_zh_a_stop_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://quote.eastmoney.com/center/gridlist.html#staq_net_board

描述: 东方财富网-行情中心-沪深个股-两网及退市

限量: 单次返回当前交易日两网及退市的所有股票的行情数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| 序号     | int64   | -       |
| 代码     | object  | -       |
| 名称     | object  | -       |
| 最新价    | float64 | -       |
| 涨跌幅    | float64 | 注意单位: % |
| 涨跌额    | float64 | -       |
| 成交量    | float64 | -       |
| 成交额    | float64 | -       |
| 振幅     | float64 | 注意单位: % |
| 最高     | float64 | -       |
| 最低     | float64 | -       |
| 今开     | float64 | -       |
| 昨收     | float64 | -       |
| 量比     | float64 | -       |
| 换手率    | float64 | 注意单位: % |
| 市盈率-动态 | float64 | -       |
| 市净率    | float64 | -       |

### stock_news_em
- **文档定位**：个股新闻
- **HTTP**：`GET /api/public/stock_news_em`
- **调用**：运行 `scripts/aktools_get.py stock_news_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://so.eastmoney.com/news/s?keyword=603777

描述: 东方财富指定个股的新闻资讯数据

限量: 指定 symbol 当日最近 100 条新闻资讯数据

输入参数

| 名称     | 类型  | 描述                          |
|--------|-----|-----------------------------|
| symbol | str | symbol="603777"; 股票代码或其他关键词 |

输出参数

| 名称   | 类型     | 描述  |
|------|--------|-----|
| 关键词  | object | -   |
| 新闻标题 | object | -   |
| 新闻内容 | object | -   |
| 发布时间 | object | -   |
| 文章来源 | object | -   |
| 新闻链接 | object | -   |

### stock_zyjs_ths
- **文档定位**：主营介绍-同花顺
- **HTTP**：`GET /api/public/stock_zyjs_ths`
- **调用**：运行 `scripts/aktools_get.py stock_zyjs_ths --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://basic.10jqka.com.cn/new/000066/operate.html

描述: 同花顺-主营介绍

限量: 单次返回所有数据

输入参数

| 名称     | 类型  | 描述              |
|--------|-----|-----------------|
| symbol | str | symbol="000066" |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 股票代码 | object  | -       |
| 主营业务 | object  | -       |
| 产品类型 | object  | -       |
| 产品名称 | object  | -       |
| 经营范围 | object  | -       |

### stock_zygc_em
- **文档定位**：主营构成-东财
- **HTTP**：`GET /api/public/stock_zygc_em`
- **调用**：运行 `scripts/aktools_get.py stock_zygc_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://emweb.securities.eastmoney.com/PC_HSF10/BusinessAnalysis/Index?type=web&code=SH688041#

描述: 东方财富网-个股-主营构成

限量: 单次返回所有历史数据

输入参数

| 名称     | 类型  | 描述                |
|--------|-----|-------------------|
| symbol | str | symbol="SH688041" |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 股票代码 | object  | -       |
| 报告日期 | object  | -       |
| 分类类型 | object  | -       |
| 主营构成 | int64   | -       |
| 主营收入 | float64 | 注意单位: 元 |
| 收入比例 | float64 | -       |
| 主营成本 | float64 | 注意单位: 元 |
| 成本比例 | float64 | -       |
| 主营利润 | float64 | 注意单位: 元 |
| 利润比例 | float64 | -       |
| 毛利率  | float64 | -       |

### news_trade_notify_suspend_baidu
- **文档定位**：停复牌
- **HTTP**：`GET /api/public/news_trade_notify_suspend_baidu`
- **调用**：运行 `scripts/aktools_get.py news_trade_notify_suspend_baidu --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://gushitong.baidu.com/calendar

描述: 百度股市通-交易提醒-停复牌

限量: 单次获取指定 date 的停复牌数据, 提供港股的停复牌数据

输入参数

| 名称   | 类型  | 描述              |
|------|-----|-----------------|
| date | str | date="20241107" |

输出参数

| 名称     | 类型     | 描述  |
|--------|--------|-----|
| 股票代码   | object |     |
| 股票简称   | object |     |
| 交易所    | object |     |
| 停牌时间   | object |     |
| 复牌时间   | object |     |
| 停牌事项说明 | object |     |

### stock_tfp_em
- **文档定位**：停复牌信息
- **HTTP**：`GET /api/public/stock_tfp_em`
- **调用**：运行 `scripts/aktools_get.py stock_tfp_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/tfpxx/

描述: 东方财富网-数据中心-特色数据-停复牌信息

限量: 单次获取指定 date 的停复牌数据, 具体更新逻辑跟目标网页统一

输入参数

| 名称   | 类型  | 描述              |
|------|-----|-----------------|
| date | str | date="20240426" |

输出参数

| 名称     | 类型     | 描述  |
|--------|--------|-----|
| 序号     | int64  |     |
| 代码     | object |     |
| 名称     | object |     |
| 停牌时间   | object |     |
| 停牌截止时间 | object |     |
| 停牌期限   | object |     |
| 停牌原因   | object |     |
| 所属市场   | object |     |
| 预计复牌时间 | object |     |

### stock_analyst_rank_em
- **文档定位**：分析师指数 / 分析师指数排行
- **HTTP**：`GET /api/public/stock_analyst_rank_em`
- **调用**：运行 `scripts/aktools_get.py stock_analyst_rank_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/invest/invest/list.html

描述: 东方财富网-数据中心-研究报告-东方财富分析师指数

限量: 单次获取指定年份的所有数据

输入参数

| 名称   | 类型  | 描述                      |
|------|-----|-------------------------|
| year | str | year='2024'; 从 2013 年至今 |

输出参数

| 名称              | 类型      | 描述                       |
|-----------------|---------|--------------------------|
| 序号              | int64   | -                        |
| 分析师名称           | object  | -                        |
| 分析师单位           | object  | -                        |
| 年度指数            | float64 | -                        |
| xxxx年收益率        | float64 | 其中 xxxx 表示指定的年份; 注意单位: % |
| 3个月收益率          | float64 | 注意单位: %                  |
| 6个月收益率          | float64 | 注意单位: %                  |
| 12个月收益率         | float64 | 注意单位: %                  |
| 成分股个数           | int64   | -                        |
| xxxx最新个股评级-股票名称 | object  | 其中 xxxx 表示指定的年份          |
| xxxx最新个股评级-股票代码 | object  | 其中 xxxx 表示指定的年份          |
| 分析师ID           | object  | -                        |
| 行业代码            | object  | -                        |
| 行业              | object  | -                        |
| 更新日期            | object  | 数据更新日期                   |
| 年度              | object  | 数据更新年度                   |

### stock_analyst_detail_em
- **文档定位**：分析师指数 / 分析师详情
- **HTTP**：`GET /api/public/stock_analyst_detail_em`
- **调用**：运行 `scripts/aktools_get.py stock_analyst_detail_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/invest/invest/11000257131.html

描述: 东方财富网-数据中心-研究报告-东方财富分析师指数-分析师详情

限量: 单次获取指定 indicator 指定的数据

输入参数

| 名称         | 类型  | 描述                                                               |
|------------|-----|------------------------------------------------------------------|
| analyst_id | str | analyst_id="11000257131"; 分析师ID, 从 ak.stock_analyst_rank_em() 获取 |
| indicator  | str | indicator="最新跟踪成分股"; 从 {"最新跟踪成分股", "历史跟踪成分股", "历史指数"} 中选择        |

输出参数-最新跟踪成分股

| 名称        | 类型      | 描述      |
|-----------|---------|---------|
| 序号        | int64   | -       |
| 股票代码      | object  | -       |
| 股票名称      | object  | -       |
| 调入日期      | object  | -       |
| 最新评级日期    | object  | -       |
| 当前评级名称    | object  | -       |
| 成交价格(前复权) | float64 | -       |
| 最新价格      | float64 | -       |
| 阶段涨跌幅     | float64 | 注意单位: % |

接口示例-最新跟踪成分股

```python
import akshare as ak

stock_analyst_detail_em_df = ak.stock_analyst_detail_em(analyst_id="11000200926", indicator="最新跟踪成分股")
print(stock_analyst_detail_em_df)
```

### news_trade_notify_dividend_baidu
- **文档定位**：分红派息
- **HTTP**：`GET /api/public/news_trade_notify_dividend_baidu`
- **调用**：运行 `scripts/aktools_get.py news_trade_notify_dividend_baidu --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://gushitong.baidu.com/calendar

描述: 百度股市通-交易提醒-分红派息

限量: 单次获取指定 date 的分红派息数据, 提供港股的分红派息数据

输入参数

| 名称     | 类型  | 描述              |
|--------|-----|-----------------|
| date   | str | date="20241107" |
| cookie | str | 可以指定 cookie     |

输出参数

| 名称   | 类型     | 描述  |
|------|--------|-----|
| 股票代码 | object |     |
| 除权日  | object |     |
| 分红   | object |     |
| 送股   | object |     |
| 转增   | object |     |
| 实物   | object |     |
| 交易所  | object |     |
| 股票简称 | object |     |
| 报告期  | object |     |

### stock_comment_em
- **文档定位**：千股千评
- **HTTP**：`GET /api/public/stock_comment_em`
- **调用**：运行 `scripts/aktools_get.py stock_comment_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/stockcomment/

描述: 东方财富网-数据中心-特色数据-千股千评

限量: 单次获取所有数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述      |
|-------|---------|---------|
| 序号    | int64   | -       |
| 代码    | object  | -       |
| 名称    | object  | -       |
| 最新价   | float64 | -       |
| 涨跌幅   | float64 | -       |
| 换手率   | float64 | 注意单位: % |
| 市盈率   | float64 | -       |
| 主力成本  | float64 | -       |
| 机构参与度 | float64 | -       |
| 综合得分  | float64 | -       |
| 上升    | int64   | 注意: 正负号 |
| 目前排名  | int64   | -       |
| 关注指数  | float64 | -       |
| 交易日   | float64 | -       |

### stock_zh_a_new_em
- **文档定位**：新股
- **HTTP**：`GET /api/public/stock_zh_a_new_em`
- **调用**：运行 `scripts/aktools_get.py stock_zh_a_new_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/center/gridlist.html#newshares

描述: 东方财富网-行情中心-沪深个股-新股

限量: 单次返回当前交易日新股板块的所有股票的行情数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| 序号     | int64   | -       |
| 代码     | object  | -       |
| 名称     | object  | -       |
| 最新价    | float64 | -       |
| 涨跌幅    | float64 | 注意单位: % |
| 涨跌额    | float64 | -       |
| 成交量    | float64 | -       |
| 成交额    | float64 | -       |
| 振幅     | float64 | 注意单位: % |
| 最高     | float64 | -       |
| 最低     | float64 | -       |
| 今开     | float64 | -       |
| 昨收     | float64 | -       |
| 量比     | float64 | -       |
| 换手率    | float64 | 注意单位: % |
| 市盈率-动态 | float64 | -       |
| 市净率    | float64 | -       |

### stock_xgsr_ths
- **文档定位**：新股上市首日
- **HTTP**：`GET /api/public/stock_xgsr_ths`
- **调用**：运行 `scripts/aktools_get.py stock_xgsr_ths --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.10jqka.com.cn/ipo/xgsr/

描述: 同花顺-数据中心-新股数据-新股上市首日

限量: 单次返回当前交易日的所有数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述 |
|-------|---------|----|
| 序号    | int64   | -  |
| 股票代码  | object  | -  |
| 股票简称  | object  | -  |
| 上市日期  | object  | -  |
| 发行价   | float64 | -  |
| 最新价   | float64 | -  |
| 首日开盘价 | float64 | -  |
| 首日收盘价 | float64 | -  |
| 首日最高价 | float64 | -  |
| 首日最低价 | float64 | -  |
| 首日涨跌幅 | float64 | -  |
| 是否破发  | object  | -  |

### stock_jgdy_tj_em
- **文档定位**：机构调研 / 机构调研-统计
- **HTTP**：`GET /api/public/stock_jgdy_tj_em`
- **调用**：运行 `scripts/aktools_get.py stock_jgdy_tj_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/jgdy/tj.html

描述: 东方财富网-数据中心-特色数据-机构调研-机构调研统计

限量: 单次返回所有历史数据

输入参数

| 名称   | 类型  | 描述                       |
|------|-----|--------------------------|
| date | str | date="20180928"; 开始查询的时间 |

输出参数

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| 序号     | int64   | -       |
| 代码     | object  | -       |
| 名称     | object  | -       |
| 最新价    | float64 | -       |
| 涨跌幅    | float64 | 注意单位: % |
| 接待机构数量 | int64   | -       |
| 接待方式   | object  | -       |
| 接待人员   | object  | -       |
| 接待地点   | object  | -       |
| 接待日期   | object  | -       |
| 公告日期   | object  | -       |

### stock_jgdy_detail_em
- **文档定位**：机构调研 / 机构调研-详细
- **HTTP**：`GET /api/public/stock_jgdy_detail_em`
- **调用**：运行 `scripts/aktools_get.py stock_jgdy_detail_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/jgdy/xx.html

描述: 东方财富网-数据中心-特色数据-机构调研-机构调研详细

限量: 单次所有历史数据, 由于数据量比较大需要等待一定时间

输入参数

| 名称   | 类型  | 描述                       |
|------|-----|--------------------------|
| date | str | date="20241211"; 开始查询的时间 |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 序号   | int64   | -       |
| 代码   | object  | -       |
| 名称   | object  | -       |
| 最新价  | float64 | -       |
| 涨跌幅  | float64 | 注意单位: % |
| 调研机构 | object  | -       |
| 机构类型 | object  | -       |
| 调研人员 | object  | -       |
| 接待方式 | object  | -       |
| 接待人员 | object  | -       |
| 接待地点 | object  | -       |
| 调研日期 | object  | -       |
| 公告日期 | object  | -       |

### stock_board_change_em
- **文档定位**：板块异动详情
- **HTTP**：`GET /api/public/stock_board_change_em`
- **调用**：运行 `scripts/aktools_get.py stock_board_change_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/changes/

描述: 东方财富-行情中心-当日板块异动详情

限量: 返回最近交易日的数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称                  | 类型      | 描述        |
|---------------------|---------|-----------|
| 板块名称                | object  | -         |
| 涨跌幅                 | float64 | 注意单位: %   |
| 主力净流入               | float64 | 注意单位: 万元  |
| 板块异动总次数             | float64 | -         |
| 板块异动最频繁个股及所属类型-股票代码 | object  | -         |
| 板块异动最频繁个股及所属类型-股票名称 | object  | -         |
| 板块异动最频繁个股及所属类型-买卖方向 | object  | -         |
| 板块具体异动类型列表及出现次数     | object  | 返回具体异动的字典 |

### stock_zh_a_new
- **文档定位**：次新股
- **HTTP**：`GET /api/public/stock_zh_a_new`
- **调用**：运行 `scripts/aktools_get.py stock_zh_a_new --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://vip.stock.finance.sina.com.cn/mkt/#new_stock

描述: 新浪财经-行情中心-沪深股市-次新股

限量: 单次返回所有次新股行情数据, 由于次新股名单随着交易日变化而变化，只能获取最近交易日的数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称            | 类型      | 描述   |
|---------------|---------|------|
| symbol        | object  | 新浪代码 |
| code          | object  | 股票代码 |
| name          | object  | 股票简称 |
| open          | float64 | 开盘价  |
| high          | float64 | 最高价  |
| low           | float64 | 最低价  |
| volume        | int64   | 成交量  |
| amount        | int64   | 成交额  |
| mktcap        | float64 | 市值   |
| turnoverratio | float64 | 换手率  |

### stock_hsgt_fund_flow_summary_em
- **文档定位**：沪深港通资金流向
- **HTTP**：`GET /api/public/stock_hsgt_fund_flow_summary_em`
- **调用**：运行 `scripts/aktools_get.py stock_hsgt_fund_flow_summary_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/hsgt/index.html#lssj

描述: 东方财富网-数据中心-资金流向-沪深港通资金流向

限量: 单次获取沪深港通资金流向数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述       |
|--------|---------|----------|
| 交易日    | object  | -        |
| 类型     | object  | -        |
| 板块     | object  | -        |
| 资金方向   | object  | -        |
| 交易状态   | int64   | 3 为收盘    |
| 成交净买额  | float64 | 注意单位: 亿元 |
| 资金净流入  | float64 | 注意单位: 亿元 |
| 当日资金余额 | float64 | 注意单位: 亿元 |
| 上涨数    | int64   | -        |
| 持平数    | int64   | -        |
| 下跌数    | int64   | -        |
| 相关指数   | object  | -        |
| 指数涨跌幅  | float64 | 注意单位: %  |

### stock_hk_profit_forecast_et
- **文档定位**：港股盈利预测-经济通
- **HTTP**：`GET /api/public/stock_hk_profit_forecast_et`
- **调用**：运行 `scripts/aktools_get.py stock_hk_profit_forecast_et --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.etnet.com.hk/www/sc/stocks/realtime/quote_profit.php?code=9999

描述: 经济通-公司资料-盈利预测

限量: 单次返回指定 symbol 和 indicator 的数据

输入参数

| 名称        | 类型  | 描述                                                                    |
|-----------|-----|-----------------------------------------------------------------------|
| symbol    | str | symbol="09999"                                                        |
| indicator | str | indicator="盈利预测概览"; choice of {"评级总览", "去年度业绩表现", "综合盈利预测", "盈利预测概览"} |

输出参数-盈利预测概览

| 名称    | 类型      | 描述               |
|-------|---------|------------------|
| 财政年度  | object  | -                |
| 纯利/亏损 | float64 | 注意单位：百万元人民币/百万港元 |
| 每股盈利  | float64 | 注意单位：分/港仙        |
| 每股派息  | float64 | 注意单位：分/港仙        |
| 证券商   | object  | -                |
| 评级    | object  | -                |
| 目标价   | float64 | 注意单位：港元          |
| 更新日期  | object  | -                |

接口示例-盈利预测概览

```python
import akshare as ak

stock_hk_profit_forecast_et_df = ak.stock_hk_profit_forecast_et(symbol="09999", indicator="盈利预测概览")
print(stock_hk_profit_forecast_et_df)
```

### stock_profit_forecast_em
- **文档定位**：盈利预测-东方财富
- **HTTP**：`GET /api/public/stock_profit_forecast_em`
- **调用**：运行 `scripts/aktools_get.py stock_profit_forecast_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/report/profitforecast.jshtml

描述: 东方财富网-数据中心-研究报告-盈利预测; 该数据源网页端返回数据有异常, 本接口已修复该异常

限量: 单次返回指定 symbol 的数据

输入参数

| 名称     | 类型  | 描述                                                                                                 |
|--------|-----|----------------------------------------------------------------------------------------------------|
| symbol | str | symbol="", 默认为获取全部数据; symbol="船舶制造", 则获取具体行业板块的数据; 行业板块可以通过 ak.stock_board_industry_name_em() 接口获取 |

输出参数

| 名称              | 类型      | 描述  |
|-----------------|---------|-----|
| 序号              | int64   | -   |
| 代码              | object  | -   |
| 名称              | object  | -   |
| 研报数             | int64   | -   |
| 机构投资评级(近六个月)-买入 | float64 | -   |
| 机构投资评级(近六个月)-增持 | float64 | -   |
| 机构投资评级(近六个月)-中性 | float64 | -   |
| 机构投资评级(近六个月)-减持 | int64   | -   |
| 机构投资评级(近六个月)-卖出 | int64   | -   |
| xxxx预测每股收益      | float64 | -   |
| xxxx预测每股收益      | float64 | -   |
| xxxx预测每股收益      | float64 | -   |
| xxxx预测每股收益      | float64 | -   |

### stock_profit_forecast_ths
- **文档定位**：盈利预测-同花顺
- **HTTP**：`GET /api/public/stock_profit_forecast_ths`
- **调用**：运行 `scripts/aktools_get.py stock_profit_forecast_ths --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://basic.10jqka.com.cn/new/600519/worth.html

描述: 同花顺-盈利预测

限量: 单次返回指定 symbol 和 indicator 的数据

输入参数

| 名称        | 类型  | 描述                                                                                    |
|-----------|-----|---------------------------------------------------------------------------------------|
| symbol    | str | symbol="600519"; 股票代码                                                                 |
| indicator | str | indicator="预测年报每股收益"; choice of {"预测年报每股收益", "预测年报净利润", "业绩预测详表-机构", "业绩预测详表-详细指标预测"} |

输出参数-预测年报每股收益

| 名称    | 类型      | 描述  |
|-------|---------|-----|
| 年度    | object  | -   |
| 预测机构数 | int64   | -   |
| 最小值   | float64 | -   |
| 均值    | float64 | -   |
| 最大值   | float64 | -   |
| 行业平均数 | float64 | -   |

接口示例-预测年报每股收益

```python
import akshare as ak

stock_profit_forecast_ths_df = ak.stock_profit_forecast_ths(symbol="600519", indicator="预测年报每股收益")
print(stock_profit_forecast_ths_df)
```

### stock_changes_em
- **文档定位**：盘口异动
- **HTTP**：`GET /api/public/stock_changes_em`
- **调用**：运行 `scripts/aktools_get.py stock_changes_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://quote.eastmoney.com/changes/

描述: 东方财富-行情中心-盘口异动数据

限量: 单次指定 symbol 的最近交易日的盘口异动数据

输入参数

| 名称     | 类型  | 描述                                                                                                                                                                                                                    |
|--------|-----|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| symbol | str | symbol="大笔买入"; choice of {'火箭发射', '快速反弹', '大笔买入', '封涨停板', '打开跌停板', '有大买盘', '竞价上涨', '高开5日线', '向上缺口', '60日新高', '60日大幅上涨', '加速下跌', '高台跳水', '大笔卖出', '封跌停板', '打开涨停板', '有大卖盘', '竞价下跌', '低开5日线', '向下缺口', '60日新低', '60日大幅下跌'} |

输出参数

| 名称   | 类型     | 描述                   |
|------|--------|----------------------|
| 时间   | object | -                    |
| 代码   | object | -                    |
| 名称   | object | -                    |
| 板块   | object | -                    |
| 相关信息 | object | 注意: 不同的 symbol 的单位不同 |

### stock_zh_kcb_spot
- **文档定位**：科创板 / 实时行情数据
- **HTTP**：`GET /api/public/stock_zh_kcb_spot`
- **调用**：运行 `scripts/aktools_get.py stock_zh_kcb_spot --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://vip.stock.finance.sina.com.cn/mkt/#kcb

描述: 新浪财经-科创板股票实时行情数据

限量: 单次返回所有科创板上市公司的实时行情数据; 请控制采集的频率, 大量抓取容易封IP

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数-实时行情数据

| 名称   | 类型      | 描述           |
|------|---------|--------------|
| 代码   | object  | -            |
| 名称   | object  | -            |
| 最新价  | float64 | -            |
| 涨跌额  | float64 | -            |
| 涨跌幅  | float64 | -            |
| 买入   | float64 | -            |
| 卖出   | float64 | -            |
| 昨收   | float64 | -            |
| 今开   | float64 | -            |
| 最高   | float64 | -            |
| 最低   | float64 | -            |
| 成交量  | float64 | 注意单位: 股      |
| 成交额  | float64 | 注意单位: 元      |
| 时点   | object  | 注意: 数据获取的时间点 |
| 市盈率  | float64 | -            |
| 市净率  | float64 | -            |
| 流通市值 | float64 | -            |
| 总市值  | float64 | -            |
| 换手率  | float64 | -            |

### stock_zh_kcb_daily
- **文档定位**：科创板 / 历史行情数据
- **HTTP**：`GET /api/public/stock_zh_kcb_daily`
- **调用**：运行 `scripts/aktools_get.py stock_zh_kcb_daily --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://finance.sina.com.cn/realstock/company/sh688001/nc.shtml(示例)

描述: 新浪财经-科创板股票历史行情数据

限量: 单次返回指定 symbol 和 adjust 的所有历史行情数据; 请控制采集的频率, 大量抓取容易封IP

输入参数

| 名称     | 类型  | 描述                                                                                 |
|--------|-----|------------------------------------------------------------------------------------|
| symbol | str | symbol="sh688008"; 带市场标识的股票代码                                                      |
| adjust | str | 默认不复权的数据; qfq: 返回前复权后的数据; hfq: 返回后复权后的数据; hfq-factor: 返回后复权因子; qfq-factor: 返回前复权因子 |

输出参数

| 名称                | 类型      | 描述                                                                                           |
|-------------------|---------|----------------------------------------------------------------------------------------------|
| date              | object  | -                                                                                            |
| close             | float64 | 收盘价                                                                                          |
| high              | float64 | 最高价                                                                                          |
| low               | float64 | 最低价                                                                                          |
| open              | float64 | 开盘价                                                                                          |
| volume            | float64 | 成交量(股)                                                                                       |
| after_volume      | float64 | 盘后量; 参见[科创板盘后固定价格交易](http://www.sse.com.cn/lawandrules/sserules/tib/trading/c/4729491.shtml) |
| after_amount      | float64 | 盘后额; 参见[科创板盘后固定价格交易](http://www.sse.com.cn/lawandrules/sserules/tib/trading/c/4729491.shtml) |
| outstanding_share | float64 | 流通股本(股)                                                                                      |
| turnover          | float64 | 换手率=成交量(股)/流通股本(股)                                                                           |

### stock_zh_kcb_report_em
- **文档定位**：科创板 / 科创板公告
- **HTTP**：`GET /api/public/stock_zh_kcb_report_em`
- **调用**：运行 `scripts/aktools_get.py stock_zh_kcb_report_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/notices/kcb.html

描述: 东方财富-科创板报告数据

限量: 单次返回所有科创板上市公司的报告数据

输入参数

| 名称        | 类型  | 描述                   |
|-----------|-----|----------------------|
| from_page | int | from_page=1; 始获取的页码  |
| to_page   | int | to_page=100; 结束获取的页码 |

输出参数

| 名称   | 类型     | 描述                                                                          |
|------|--------|-----------------------------------------------------------------------------|
| 代码   | object | -                                                                           |
| 名称   | object | -                                                                           |
| 公告标题 | object | -                                                                           |
| 公告类型 | object | -                                                                           |
| 公告日期 | object | -                                                                           |
| 公告代码 | object | 本代码可以用来获取公告详情: http://data.eastmoney.com/notices/detail/688595/{替换到此处}.html |

### stock_cyq_em
- **文档定位**：筹码分布
- **HTTP**：`GET /api/public/stock_cyq_em`
- **调用**：运行 `scripts/aktools_get.py stock_cyq_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/concept/sz000001.html

描述: 东方财富网-概念板-行情中心-日K-筹码分布

限量: 单次返回指定 symbol 和 adjust 的近 90 个交易日数据

输入参数

| 名称     | 类型  | 描述                                                           |
|--------|-----|--------------------------------------------------------------|
| symbol | str | symbol="000001"; 股票代码                                        |
| adjust | str | adjust=""; choice of {"qfq": "前复权", "hfq": "后复权", "": "不复权"} |

输出参数

| 名称     | 类型      | 描述 |
|--------|---------|----|
| 日期     | object  | -  |
| 获利比例   | float64 | -  |
| 平均成本   | float64 | -  |
| 90成本-低 | float64 | -  |
| 90成本-高 | float64 | -  |
| 90集中度  | float64 | -  |
| 70成本-低 | float64 | -  |
| 70成本-高 | float64 | -  |
| 70集中度  | float64 | -  |

### stock_gsrl_gsdt_em
- **文档定位**：股市日历 / 公司动态
- **HTTP**：`GET /api/public/stock_gsrl_gsdt_em`
- **调用**：运行 `scripts/aktools_get.py stock_gsrl_gsdt_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/gsrl/gsdt.html

描述: 东方财富网-数据中心-股市日历-公司动态

限量: 单次返回指定交易日的数据

输入参数

| 名称   | 类型  | 描述                   |
|------|-----|----------------------|
| date | str | date="20230808"; 交易日 |

输出参数

| 名称   | 类型     | 描述 |
|------|--------|----|
| 序号   | int64  | -  |
| 代码   | object | -  |
| 简称   | object | -  |
| 事件类型 | object | -  |
| 具体事项 | object | -  |
| 交易日  | object | -  |

### stock_account_statistics_em
- **文档定位**：股票账户统计 / 股票账户统计月度
- **HTTP**：`GET /api/public/stock_account_statistics_em`
- **调用**：运行 `scripts/aktools_get.py stock_account_statistics_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/cjsj/gpkhsj.html

描述: 东方财富网-数据中心-特色数据-股票账户统计

限量: 单次返回从 201504 开始 202308 的所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称         | 类型      | 描述       |
|------------|---------|----------|
| 数据日期       | object  | -        |
| 新增投资者-数量   | float64 | 注意单位: 万户 |
| 新增投资者-环比   | float64 | -        |
| 新增投资者-同比   | float64 | -        |
| 期末投资者-总量   | float64 | 注意单位: 万户 |
| 期末投资者-A股账户 | float64 | 注意单位: 万户 |
| 期末投资者-B股账户 | float64 | 注意单位: 万户 |
| 沪深总市值      | float64 | -        |
| 沪深户均市值     | float64 | 注意单位: 万  |
| 上证指数-收盘    | float64 | -        |
| 上证指数-涨跌幅   | float64 | -        |
