# 股票热度



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### stock_hot_follow_xq
- **文档定位**：股票热度 / 股票热度-雪球 / 关注排行榜
- **HTTP**：`GET /api/public/stock_hot_follow_xq`
- **调用**：运行 `scripts/aktools_get.py stock_hot_follow_xq --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://xueqiu.com/hq

描述: 雪球-沪深股市-热度排行榜-关注排行榜

限量: 单次返回指定 symbol 的排行数据

输入参数

| 名称     | 类型  | 描述                                      |
|--------|-----|-----------------------------------------|
| symbol | str | symbol="最热门"; choice of {"本周新增", "最热门"} |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 股票代码 | object  | -       |
| 股票简称 | object  | -       |
| 关注   | float64 | -       |
| 最新价  | float64 | 注意单位: 元 |

### stock_hot_tweet_xq
- **文档定位**：股票热度 / 股票热度-雪球 / 讨论排行榜
- **HTTP**：`GET /api/public/stock_hot_tweet_xq`
- **调用**：运行 `scripts/aktools_get.py stock_hot_tweet_xq --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://xueqiu.com/hq

描述: 雪球-沪深股市-热度排行榜-讨论排行榜

限量: 单次返回指定 symbol 的排行数据

输入参数

| 名称     | 类型  | 描述                                      |
|--------|-----|-----------------------------------------|
| symbol | str | symbol="最热门"; choice of {"本周新增", "最热门"} |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 股票代码 | object  | -       |
| 股票简称 | object  | -       |
| 关注   | float64 | -       |
| 最新价  | float64 | 注意单位: 元 |

### stock_hot_deal_xq
- **文档定位**：股票热度 / 股票热度-雪球 / 交易排行榜
- **HTTP**：`GET /api/public/stock_hot_deal_xq`
- **调用**：运行 `scripts/aktools_get.py stock_hot_deal_xq --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://xueqiu.com/hq

描述: 雪球-沪深股市-热度排行榜-交易排行榜

限量: 单次返回指定 symbol 的排行数据

输入参数

| 名称     | 类型  | 描述                                      |
|--------|-----|-----------------------------------------|
| symbol | str | symbol="最热门"; choice of {"本周新增", "最热门"} |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 股票代码 | object  | -       |
| 股票简称 | object  | -       |
| 关注   | float64 | -       |
| 最新价  | float64 | 注意单位: 元 |

### stock_hot_rank_em
- **文档定位**：股票热度 / 股票热度-东财 / 人气榜-A股
- **HTTP**：`GET /api/public/stock_hot_rank_em`
- **调用**：运行 `scripts/aktools_get.py stock_hot_rank_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://guba.eastmoney.com/rank/

描述: 东方财富网站-股票热度

限量: 单次返回当前交易日前 100 个股票的人气排名数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 当前排名 | int64   | -       |
| 代码   | object  | -       |
| 股票名称 | object  | -       |
| 最新价  | float64 | -       |
| 涨跌额  | float64 | -       |
| 涨跌幅  | float64 | 注意单位: % |

### stock_hot_up_em
- **文档定位**：股票热度 / 股票热度-东财 / 飙升榜-A股
- **HTTP**：`GET /api/public/stock_hot_up_em`
- **调用**：运行 `scripts/aktools_get.py stock_hot_up_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://guba.eastmoney.com/rank/

描述: 东方财富-个股人气榜-飙升榜

限量: 单次返回当前交易日前 100 个股票的飙升榜排名数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称      | 类型      | 描述      |
|---------|---------|---------|
| 排名较昨日变动 | int64   | -       |
| 当前排名    | int64   | -       |
| 代码      | object  | -       |
| 股票名称    | object  | -       |
| 最新价     | float64 | -       |
| 涨跌额     | float64 | -       |
| 涨跌幅     | float64 | 注意单位: % |

### stock_hk_hot_rank_em
- **文档定位**：股票热度 / 股票热度-东财 / 人气榜-港股
- **HTTP**：`GET /api/public/stock_hk_hot_rank_em`
- **调用**：运行 `scripts/aktools_get.py stock_hk_hot_rank_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://guba.eastmoney.com/rank/

描述: 东方财富-个股人气榜-人气榜-港股市场

限量: 单次返回当前交易日前 100 个股票的人气排名数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 当前排名 | int64   | -       |
| 代码   | object  | -       |
| 股票名称 | object  | -       |
| 最新价  | float64 | -       |
| 涨跌幅  | float64 | 注意单位: % |

### stock_hot_rank_detail_em
- **文档定位**：股票热度 / 历史趋势及粉丝特征 / A股
- **HTTP**：`GET /api/public/stock_hot_rank_detail_em`
- **调用**：运行 `scripts/aktools_get.py stock_hot_rank_detail_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://guba.eastmoney.com/rank/stock?code=000665

描述: 东方财富网-股票热度-历史趋势及粉丝特征

限量: 单次返回指定 symbol 的股票近期历史数据

输入参数

| 名称     | 类型  | 描述                |
|--------|-----|-------------------|
| symbol | str | symbol="SZ000665" |

输出参数

| 名称   | 类型      | 描述  |
|------|---------|-----|
| 时间   | object  | -   |
| 排名   | int64   | -   |
| 证券代码 | object  | -   |
| 新晋粉丝 | float64 | -   |
| 铁杆粉丝 | float64 | -   |

### stock_hk_hot_rank_detail_em
- **文档定位**：股票热度 / 历史趋势及粉丝特征 / 港股
- **HTTP**：`GET /api/public/stock_hk_hot_rank_detail_em`
- **调用**：运行 `scripts/aktools_get.py stock_hk_hot_rank_detail_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://guba.eastmoney.com/rank/stock?code=HK_00700

描述: 东方财富网-股票热度-历史趋势

限量: 单次返回指定 symbol 的股票近期历史数据

输入参数

| 名称     | 类型  | 描述             |
|--------|-----|----------------|
| symbol | str | symbol="00700" |

输出参数

| 名称   | 类型      | 描述  |
|------|---------|-----|
| 时间   | object  | -   |
| 排名   | int64   | -   |
| 证券代码 | object  | -   |

### stock_irm_cninfo
- **文档定位**：股票热度 / 互动平台 / 互动易-提问
- **HTTP**：`GET /api/public/stock_irm_cninfo`
- **调用**：运行 `scripts/aktools_get.py stock_irm_cninfo --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://irm.cninfo.com.cn/

描述: 互动易-提问

限量: 单次返回近期 10000 条提问数据

输入参数

| 名称     | 类型  | 描述                |
|--------|-----|-------------------|
| symbol | str | symbol="002594";  |

输出参数

| 名称    | 类型             | 描述 |
|-------|----------------|----|
| 股票代码  | object         | -  |
| 公司简称  | object         | -  |
| 行业    | object         | -  |
| 行业代码  | object         | -  |
| 问题    | object         | -  |
| 提问者   | object         | -  |
| 来源    | object         | -  |
| 提问时间  | datetime64[ns] | -  |
| 更新时间  | datetime64[ns] | -  |
| 提问者编号 | object         | -  |
| 问题编号  | object         | -  |
| 回答ID  | object         | -  |
| 回答内容  | object         | -  |
| 回答者   | object         | -  |

### stock_irm_ans_cninfo
- **文档定位**：股票热度 / 互动平台 / 互动易-回答
- **HTTP**：`GET /api/public/stock_irm_ans_cninfo`
- **调用**：运行 `scripts/aktools_get.py stock_irm_ans_cninfo --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://irm.cninfo.com.cn/

描述: 互动易-回答

限量: 单次返回指定 symbol 的回答数据

输入参数

| 名称     | 类型  | 描述                                                               |
|--------|-----|------------------------------------------------------------------|
| symbol | str | symbol="1495108801386602496"; 通过 ak.stock_irm_cninfo 来获取具体的提问者编号 |

输出参数

| 名称   | 类型             | 描述 |
|------|----------------|----|
| 股票代码 | object         | -  |
| 公司简称 | object         | -  |
| 问题   | object         | -  |
| 回答内容 | object         | -  |
| 提问者  | object         | -  |
| 提问时间 | datetime64[ns] | -  |
| 回答时间 | datetime64[ns] | -  |

### stock_sns_sseinfo
- **文档定位**：股票热度 / 互动平台 / 上证e互动
- **HTTP**：`GET /api/public/stock_sns_sseinfo`
- **调用**：运行 `scripts/aktools_get.py stock_sns_sseinfo --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://sns.sseinfo.com/company.do?uid=65

描述: 上证e互动-提问与回答

限量: 单次返回指定 symbol 的提问与回答数据

输入参数

| 名称     | 类型  | 描述                    |
|--------|-----|-----------------------|
| symbol | str | symbol="603119"; 股票代码 |

输出参数

| 名称   | 类型     | 描述 |
|------|--------|----|
| 股票代码 | object | -  |
| 公司简称 | object | -  |
| 问题   | object | -  |
| 回答   | object | -  |
| 问题时间 | object | -  |
| 回答时间 | object | -  |
| 问题来源 | object | -  |
| 回答来源 | object | -  |
| 用户名  | object | -  |

### stock_hot_rank_detail_realtime_em
- **文档定位**：股票热度 / 个股人气榜-实时变动 / A股
- **HTTP**：`GET /api/public/stock_hot_rank_detail_realtime_em`
- **调用**：运行 `scripts/aktools_get.py stock_hot_rank_detail_realtime_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://guba.eastmoney.com/rank/stock?code=000665

描述: 东方财富网-个股人气榜-实时变动

限量: 单次返回指定 symbol 的股票近期历史数据

输入参数

| 名称     | 类型  | 描述                |
|--------|-----|-------------------|
| symbol | str | symbol="SZ000665" |

输出参数

| 名称   | 类型      | 描述  |
|------|---------|-----|
| 时间   | object  | -   |
| 排名   | int64   | -   |

### stock_hk_hot_rank_detail_realtime_em
- **文档定位**：股票热度 / 个股人气榜-实时变动 / 港股
- **HTTP**：`GET /api/public/stock_hk_hot_rank_detail_realtime_em`
- **调用**：运行 `scripts/aktools_get.py stock_hk_hot_rank_detail_realtime_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://guba.eastmoney.com/rank/stock?code=HK_00700

描述: 东方财富网-个股人气榜-实时变动

限量: 单次返回指定 symbol 的股票近期历史数据

输入参数

| 名称     | 类型  | 描述             |
|--------|-----|----------------|
| symbol | str | symbol="00700" |

输出参数

| 名称   | 类型      | 描述  |
|------|---------|-----|
| 时间   | object  | -   |
| 排名   | int64   | -   |

### stock_hot_keyword_em
- **文档定位**：股票热度 / 热门关键词
- **HTTP**：`GET /api/public/stock_hot_keyword_em`
- **调用**：运行 `scripts/aktools_get.py stock_hot_keyword_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://guba.eastmoney.com/rank/stock?code=000665

描述: 东方财富-个股人气榜-热门关键词

限量: 单次返回指定 symbol 的最近交易日时点数据

输入参数

| 名称     | 类型  | 描述                |
|--------|-----|-------------------|
| symbol | str | symbol="SZ000665" |

输出参数

| 名称   | 类型     | 描述  |
|------|--------|-----|
| 时间   | object | -   |
| 股票代码 | object | -   |
| 概念名称 | object | -   |
| 概念代码 | object | -   |
| 热度   | int64  | -   |

### stock_inner_trade_xq
- **文档定位**：股票热度 / 内部交易
- **HTTP**：`GET /api/public/stock_inner_trade_xq`
- **调用**：运行 `scripts/aktools_get.py stock_inner_trade_xq --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://xueqiu.com/hq/insider

描述: 雪球-行情中心-沪深股市-内部交易

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述  |
|--------|---------|-----|
| 股票代码   | object  | -   |
| 股票名称   | object  | -   |
| 变动日期   | object  | -   |
| 变动人    | object  | -   |
| 变动股数   | int64   | -   |
| 成交均价   | float64 | -   |
| 变动后持股数 | float64 | -   |
| 与董监高关系 | object  | -   |
| 董监高职务  | object  | -   |

### stock_hot_rank_latest_em
- **文档定位**：股票热度 / 个股人气榜-最新排名 / A股
- **HTTP**：`GET /api/public/stock_hot_rank_latest_em`
- **调用**：运行 `scripts/aktools_get.py stock_hot_rank_latest_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://guba.eastmoney.com/rank/stock?code=000665

描述: 东方财富-个股人气榜-最新排名

限量: 单次返回指定 symbol 的股票近期历史数据

输入参数

| 名称     | 类型  | 描述                |
|--------|-----|-------------------|
| symbol | str | symbol="SZ000665" |

输出参数

| 名称    | 类型     | 描述  |
|-------|--------|-----|
| item  | object | -   |
| value | object | -   |

### stock_hk_hot_rank_latest_em
- **文档定位**：股票热度 / 个股人气榜-最新排名 / 港股
- **HTTP**：`GET /api/public/stock_hk_hot_rank_latest_em`
- **调用**：运行 `scripts/aktools_get.py stock_hk_hot_rank_latest_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://guba.eastmoney.com/rank/stock?code=HK_00700

描述: 东方财富-个股人气榜-最新排名

限量: 单次返回指定 symbol 的股票近期历史数据

输入参数

| 名称     | 类型  | 描述             |
|--------|-----|----------------|
| symbol | str | symbol="00700" |

输出参数

| 名称    | 类型     | 描述  |
|-------|--------|-----|
| item  | object | -   |
| value | object | -   |

### stock_hot_search_baidu
- **文档定位**：股票热度 / 热搜股票
- **HTTP**：`GET /api/public/stock_hot_search_baidu`
- **调用**：运行 `scripts/aktools_get.py stock_hot_search_baidu --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://gushitong.baidu.com/expressnews

描述: 百度股市通-热搜股票

限量: 单次返回指定 symbol, date 和 time 的热搜股票数据

输入参数

| 名称     | 类型  | 描述                                              |
|--------|-----|-------------------------------------------------|
| symbol | str | symbol="A股"; choice of {"全部", "A股", "港股", "美股"} |
| date   | str | date="20250616"                                 |
| time   | str | time="今日"; choice of {"今日", "1小时"}              |

输出参数

| 名称    | 类型     | 描述 |
|-------|--------|----|
| 名称/代码 | object | -  |
| 涨跌幅   | object | -  |
| 综合热度  | int64  | -  |

### stock_hot_rank_relate_em
- **文档定位**：股票热度 / 相关股票
- **HTTP**：`GET /api/public/stock_hot_rank_relate_em`
- **调用**：运行 `scripts/aktools_get.py stock_hot_rank_relate_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://guba.eastmoney.com/rank/stock?code=000665

描述: 东方财富-个股人气榜-相关股票

限量: 单次返回指定 symbol 的股票近期历史数据

输入参数

| 名称     | 类型  | 描述                |
|--------|-----|-------------------|
| symbol | str | symbol="SZ000665" |

输出参数

| 名称     | 类型      | 描述  |
|--------|---------|-----|
| 时间     | object  | -   |
| 股票代码   | object  | -   |
| 相关股票代码 | object  | -   |
| 涨跌幅    | float64 | -   |
