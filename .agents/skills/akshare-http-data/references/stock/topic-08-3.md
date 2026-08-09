# 基本面数据



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### stock_info_sh_name_code
- **文档定位**：基本面数据 / 股票列表-上证
- **HTTP**：`GET /api/public/stock_info_sh_name_code`
- **调用**：运行 `scripts/aktools_get.py stock_info_sh_name_code --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.sse.com.cn/assortment/stock/list/share/

描述: 上海证券交易所股票代码和简称数据

限量: 单次获取所有上海证券交易所股票代码和简称数据

输入参数

| 名称     | 类型  | 描述                                               |
|--------|-----|--------------------------------------------------|
| symbol | str | symbol="主板A股"; choice of {"主板A股", "主板B股", "科创板"} |

输出参数

| 名称   | 类型     | 描述  |
|------|--------|-----|
| 证券代码 | object | -   |
| 证券简称 | object | -   |
| 公司全称 | object | -   |
| 上市日期 | object | -   |

### stock_info_sz_name_code
- **文档定位**：基本面数据 / 股票列表-深证
- **HTTP**：`GET /api/public/stock_info_sz_name_code`
- **调用**：运行 `scripts/aktools_get.py stock_info_sz_name_code --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.szse.cn/market/product/stock/list/index.html

描述: 深证证券交易所股票代码和股票简称数据

限量: 单次获取深证证券交易所股票代码和简称数据

输入参数

| 名称     | 类型  | 描述                                                          |
|--------|-----|-------------------------------------------------------------|
| symbol | str | symbol="A股列表"; choice of {"A股列表", "B股列表", "CDR列表", "AB股列表"} |

输出参数-A股列表

| 名称     | 类型     | 描述  |
|--------|--------|-----|
| 板块     | object | -   |
| A股代码   | object | -   |
| A股简称   | object | -   |
| A股上市日期 | object | -   |
| A股总股本  | object | -   |
| A股流通股本 | object | -   |
| 所属行业   | object | -   |

### stock_info_bj_name_code
- **文档定位**：基本面数据 / 股票列表-北证
- **HTTP**：`GET /api/public/stock_info_bj_name_code`
- **调用**：运行 `scripts/aktools_get.py stock_info_bj_name_code --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.bse.cn/nq/listedcompany.html

描述: 北京证券交易所股票代码和简称数据

限量: 单次获取北京证券交易所所有的股票代码和简称数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型     | 描述      |
|------|--------|---------|
| 证券代码 | object | -       |
| 证券简称 | object | -       |
| 总股本  | int64  | 注意单位: 股 |
| 流通股本 | int64  | 注意单位: 股 |
| 上市日期 | object | -       |
| 所属行业 | object | -       |
| 地区   | object | -       |
| 报告日期 | object | -       |

### stock_info_sz_delist
- **文档定位**：基本面数据 / 终止/暂停上市-深证
- **HTTP**：`GET /api/public/stock_info_sz_delist`
- **调用**：运行 `scripts/aktools_get.py stock_info_sz_delist --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.szse.cn/market/stock/suspend/index.html

描述: 深证证券交易所终止/暂停上市股票

限量: 单次获取深证证券交易所终止/暂停上市数据

输入参数

| 名称     | 类型  | 描述                                              |
|--------|-----|-------------------------------------------------|
| symbol | str | symbol="终止上市公司"; choice of {"暂停上市公司", "终止上市公司"} |

输出参数

| 名称     | 类型     | 描述  |
|--------|--------|-----|
| 证券代码   | object | -   |
| 证券简称   | object | -   |
| 上市日期   | object | -   |
| 终止上市日期 | object | -   |

### stock_staq_net_stop
- **文档定位**：基本面数据 / 两网及退市
- **HTTP**：`GET /api/public/stock_staq_net_stop`
- **调用**：运行 `scripts/aktools_get.py stock_staq_net_stop --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/center/gridlist.html#staq_net_board

描述: 东方财富网-行情中心-沪深个股-两网及退市

限量: 单次获取所有两网及退市的股票数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称  | 类型     | 描述  |
|-----|--------|-----|
| 序号  | int64  | -   |
| 代码  | object | -   |
| 名称  | object | -   |

### stock_info_sh_delist
- **文档定位**：基本面数据 / 暂停/终止上市-上证
- **HTTP**：`GET /api/public/stock_info_sh_delist`
- **调用**：运行 `scripts/aktools_get.py stock_info_sh_delist --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.sse.com.cn/assortment/stock/list/delisting/

描述: 上海证券交易所暂停/终止上市股票

限量: 单次获取上海证券交易所暂停/终止上市股票

输入参数

| 名称     | 类型  | 描述                                         |
|--------|-----|--------------------------------------------|
| symbol | str | symbol="全部"; choice of {"全部", "沪市", "科创板"} |

输出参数

| 名称     | 类型     | 描述  |
|--------|--------|-----|
| 公司代码   | object | -   |
| 公司简称   | object | -   |
| 上市日期   | object | -   |
| 暂停上市日期 | object | -   |

### stock_info_change_name
- **文档定位**：基本面数据 / 股票更名
- **HTTP**：`GET /api/public/stock_info_change_name`
- **调用**：运行 `scripts/aktools_get.py stock_info_change_name --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://vip.stock.finance.sina.com.cn/corp/go.php/vCI_CorpInfo/stockid/300378.phtml

描述: 新浪财经-股票曾用名

限量: 单次指定 symbol 的所有历史曾用名称

输入参数

| 名称     | 类型  | 描述                    |
|--------|-----|-----------------------|
| symbol | str | symbol="000503"; 股票代码 |

输出参数

| 名称    | 类型     | 描述  |
|-------|--------|-----|
| index | int64  | -   |
| name  | object | -   |

### stock_info_sz_change_name
- **文档定位**：基本面数据 / 名称变更-深证
- **HTTP**：`GET /api/public/stock_info_sz_change_name`
- **调用**：运行 `scripts/aktools_get.py stock_info_sz_change_name --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.szse.cn/www/market/stock/changename/index.html

描述: 深证证券交易所-市场数据-股票数据-名称变更

限量: 单次获取所有历史数据

输入参数

| 名称     | 类型  | 描述                                        |
|--------|-----|-------------------------------------------|
| symbol | str | symbol="全称变更"; choice of {"全称变更", "简称变更"} |

输出参数

| 名称    | 类型     | 描述  |
|-------|--------|-----|
| 变更日期  | object | -   |
| 证券代码  | object | -   |
| 证券简称  | object | -   |
| 变更前全称 | object | -   |
| 变更后全称 | object | -   |

### stock_fund_stock_holder
- **文档定位**：基本面数据 / 基金持股
- **HTTP**：`GET /api/public/stock_fund_stock_holder`
- **调用**：运行 `scripts/aktools_get.py stock_fund_stock_holder --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://vip.stock.finance.sina.com.cn/corp/go.php/vCI_FundStockHolder/stockid/600004.phtml

描述: 新浪财经-股本股东-基金持股

限量: 新浪财经-股本股东-基金持股所有历史数据

输入参数

| 名称     | 类型  | 描述                    |
|--------|-----|-----------------------|
| symbol | str | symbol="600004"; 股票代码 |

输出参数

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| 基金名称   | object  | -       |
| 基金代码   | object  | -       |
| 持仓数量   | int64   | 注意单位: 股 |
| 占流通股比例 | float64 | 注意单位: % |
| 持股市值   | int64   | 注意单位: 元 |
| 占净值比例  | float64 | 注意单位: % |
| 截止日期   | object  | -       |

### stock_main_stock_holder
- **文档定位**：基本面数据 / 主要股东
- **HTTP**：`GET /api/public/stock_main_stock_holder`
- **调用**：运行 `scripts/aktools_get.py stock_main_stock_holder --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://vip.stock.finance.sina.com.cn/corp/go.php/vCI_StockHolder/stockid/600004.phtml

描述: 新浪财经-股本股东-主要股东

限量: 单次获取所有历史数据

输入参数

| 名称    | 类型  | 描述                   |
|-------|-----|----------------------|
| stock | str | stock="600004"; 股票代码 |

输出参数

| 名称    | 类型      | 描述         |
|-------|---------|------------|
| 编号    | object  | -          |
| 股东名称  | object  | -          |
| 持股数量  | float64 | 注意单位: 股    |
| 持股比例  | float64 | 注意单位: %    |
| 股本性质  | object  | -          |
| 截至日期  | object  | -          |
| 公告日期  | object  | -          |
| 股东说明  | object  | -          |
| 股东总数  | float64 | -          |
| 平均持股数 | float64 | 备注: 按总股本计算 |

### stock_institute_hold
- **文档定位**：基本面数据 / 机构持股 / 机构持股一览表
- **HTTP**：`GET /api/public/stock_institute_hold`
- **调用**：运行 `scripts/aktools_get.py stock_institute_hold --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://vip.stock.finance.sina.com.cn/q/go.php/vComStockHold/kind/jgcg/index.phtml

描述: 新浪财经-机构持股-机构持股一览表

限量: 单次获取所有历史数据

输入参数

| 名称     | 类型  | 描述                                                                                                              |
|--------|-----|-----------------------------------------------------------------------------------------------------------------|
| symbol | str | symbol="20051"; 从 2005 年开始, {"一季报":1, "中报":2 "三季报":3 "年报":4}, e.g., "20191", 其中的 1 表示一季报; "20193", 其中的 3 表示三季报; |

输出参数

| 名称       | 类型      | 描述      |
|----------|---------|---------|
| 证券代码     | object  | -       |
| 证券简称     | object  | -       |
| 机构数      | int64   | -       |
| 机构数变化    | int64   | -       |
| 持股比例     | float64 | 注意单位: % |
| 持股比例增幅   | float64 | 注意单位: % |
| 占流通股比例   | float64 | 注意单位: % |
| 占流通股比例增幅 | float64 | 注意单位: % |

### stock_institute_hold_detail
- **文档定位**：基本面数据 / 机构持股 / 机构持股详情
- **HTTP**：`GET /api/public/stock_institute_hold_detail`
- **调用**：运行 `scripts/aktools_get.py stock_institute_hold_detail --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://vip.stock.finance.sina.com.cn/q/go.php/vComStockHold/kind/jgcg/index.phtml

描述: 新浪财经-机构持股-机构持股详情

限量: 单次所有历史数据

输入参数

| 名称      | 类型  | 描述                                                                                                               |
|---------|-----|------------------------------------------------------------------------------------------------------------------|
| stock   | str | stock="300003"; 股票代码                                                                                             |
| quarter | str | quarter="20201"; 从 2005 年开始, {"一季报":1, "中报":2 "三季报":3 "年报":4}, e.g., "20191", 其中的 1 表示一季报; "20193", 其中的 3 表示三季报; |

输出参数

| 名称       | 类型      | 描述       |
|----------|---------|----------|
| 持股机构类型   | object  | -        |
| 持股机构代码   | object  | -        |
| 持股机构简称   | object  | -        |
| 持股机构全称   | object  | -        |
| 持股数      | float64 | 注意单位: 万股 |
| 最新持股数    | float64 | 注意单位: 万股 |
| 持股比例     | float64 | 注意单位: %  |
| 最新持股比例   | float64 | 注意单位: %  |
| 占流通股比例   | float64 | 注意单位: %  |
| 最新占流通股比例 | float64 | 注意单位: %  |
| 持股比例增幅   | float64 | 注意单位: %  |
| 占流通股比例增幅 | float64 | 注意单位: %  |

### stock_institute_recommend
- **文档定位**：基本面数据 / 机构推荐 / 机构推荐池
- **HTTP**：`GET /api/public/stock_institute_recommend`
- **调用**：运行 `scripts/aktools_get.py stock_institute_recommend --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://stock.finance.sina.com.cn/stock/go.php/vIR_RatingNewest/index.phtml

描述: 新浪财经-机构推荐池-具体指标的数据

限量: 单次获取新浪财经-机构推荐池-具体指标的所有数据

输入参数

| 名称     | 类型  | 描述                                                                                                                 |
|--------|-----|--------------------------------------------------------------------------------------------------------------------|
| symbol | str | symbol="行业关注度"; choice of {'最新投资评级', '上调评级股票', '下调评级股票', '股票综合评级', '首次评级股票', '目标涨幅排名', '机构关注度', '行业关注度', '投资评级选股'} |

输出参数

| 名称  | 类型  | 描述                |
|-----|-----|-------------------|
| -   | -   | 根据特定 indicator 而定 |

### stock_institute_recommend_detail
- **文档定位**：基本面数据 / 机构推荐 / 股票评级记录
- **HTTP**：`GET /api/public/stock_institute_recommend_detail`
- **调用**：运行 `scripts/aktools_get.py stock_institute_recommend_detail --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://stock.finance.sina.com.cn/stock/go.php/vIR_StockSearch/key/sz000001.phtml

描述: 新浪财经-机构推荐池-股票评级记录

限量: 单次获取新浪财经-机构推荐池-股票评级记录的所有数据

输入参数

| 名称     | 类型  | 描述              |
|--------|-----|-----------------|
| symbol | str | symbol="000001" |

输出参数

| 名称   | 类型  | 描述  |
|------|-----|-----|
| 股票代码 | str | -   |
| 股票名称 | str | -   |
| 目标价  | str | -   |
| 最新评级 | str | -   |
| 评级机构 | str | -   |
| 分析师  | str | -   |
| 行业   | str | -   |
| 评级日期 | str | -   |

### stock_rank_forecast_cninfo
- **文档定位**：基本面数据 / 机构推荐 / 投资评级
- **HTTP**：`GET /api/public/stock_rank_forecast_cninfo`
- **调用**：运行 `scripts/aktools_get.py stock_rank_forecast_cninfo --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://webapi.cninfo.com.cn/#/thematicStatistics

描述: 巨潮资讯-数据中心-评级预测-投资评级

限量: 单次获取指定交易日的所有数据

输入参数

| 名称   | 类型  | 描述                   |
|------|-----|----------------------|
| date | str | date="20210910"; 交易日 |

输出参数

| 名称      | 类型      | 描述  |
|---------|---------|-----|
| 证券代码    | object  | -   |
| 证券简称    | object  | -   |
| 发布日期    | object  | -   |
| 研究机构简称  | object  | -   |
| 研究员名称   | object  | -   |
| 投资评级    | object  | -   |
| 是否首次评级  | object  | -   |
| 评级变化    | object  | -   |
| 前一次投资评级 | object  | -   |
| 目标价格-下限 | float64 | -   |
| 目标价格-上限 | float64 | -   |

### stock_industry_clf_hist_sw
- **文档定位**：基本面数据 / 机构推荐 / 申万个股行业分类变动历史
- **HTTP**：`GET /api/public/stock_industry_clf_hist_sw`
- **调用**：运行 `scripts/aktools_get.py stock_industry_clf_hist_sw --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.swhyresearch.com/institute_sw/allIndex/downloadCenter/industryType

描述: 申万宏源研究-行业分类-全部行业分类

限量: 单次获取所有个股的行业分类变动历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称            | 类型     | 描述     |
|---------------|--------|--------|
| symbol        | object | 股票代码   |
| start_date    | object | 计入日期   |
| industry_code | object | 申万行业代码 |
| update_time   | object | 更新日期   |

### stock_industry_pe_ratio_cninfo
- **文档定位**：基本面数据 / 机构推荐 / 行业市盈率
- **HTTP**：`GET /api/public/stock_industry_pe_ratio_cninfo`
- **调用**：运行 `scripts/aktools_get.py stock_industry_pe_ratio_cninfo --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://webapi.cninfo.com.cn/#/thematicStatistics

描述: 巨潮资讯-数据中心-行业分析-行业市盈率

限量: 单次获取指定 symbol 在指定交易日的所有数据; 只能获取近期的数据

输入参数

| 名称     | 类型  | 描述                                                |
|--------|-----|---------------------------------------------------|
| symbol | str | symbol="证监会行业分类"; choice of {"证监会行业分类", "国证行业分类"} |
| date   | str | date="20210910"; 交易日                              |

输出参数

| 名称         | 类型      | 描述       |
|------------|---------|----------|
| 变动日期       | object  | -        |
| 行业分类       | object  | -        |
| 行业层级       | int64   | -        |
| 行业编码       | object  | -        |
| 行业名称       | object  | -        |
| 公司数量       | float64 | -        |
| 纳入计算公司数量   | float64 | -        |
| 总市值-静态     | float64 | 注意单位: 亿元 |
| 净利润-静态     | float64 | 注意单位: 亿元 |
| 静态市盈率-加权平均 | float64 | -        |
| 静态市盈率-中位数  | float64 | -        |
| 静态市盈率-算术平均 | float64 | -        |

### stock_new_gh_cninfo
- **文档定位**：基本面数据 / 机构推荐 / 新股过会
- **HTTP**：`GET /api/public/stock_new_gh_cninfo`
- **调用**：运行 `scripts/aktools_get.py stock_new_gh_cninfo --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://webapi.cninfo.com.cn/#/xinguList

描述: 巨潮资讯-数据中心-新股数据-新股过会

限量: 单次获取近一年所有新股过会的数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型     | 描述  |
|-------|--------|-----|
| 公司名称  | object | -   |
| 上会日期  | object | -   |
| 审核类型  | object | -   |
| 审议内容  | object | -   |
| 审核结果  | object | -   |
| 审核公告日 | object | -   |

### stock_new_ipo_cninfo
- **文档定位**：基本面数据 / 机构推荐 / 新股发行
- **HTTP**：`GET /api/public/stock_new_ipo_cninfo`
- **调用**：运行 `scripts/aktools_get.py stock_new_ipo_cninfo --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://webapi.cninfo.com.cn/#/xinguList

描述: 巨潮资讯-数据中心-新股数据-新股发行

限量: 单次获取近三年所有新股发行的数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称      | 类型      | 描述       |
|---------|---------|----------|
| 证劵代码    | object  | -        |
| 证券简称    | object  | -        |
| 上市日期    | object  | -        |
| 申购日期    | object  | -        |
| 发行价     | float64 | 注意单位: 元  |
| 总发行数量   | float64 | 注意单位: 万股 |
| 发行市盈率   | float64 | -        |
| 上网发行中签率 | float64 | 注意单位: %  |
| 摇号结果公告日 | object  | -        |
| 中签公告日   | object  | -        |
| 中签缴款日   | object  | -        |
| 网上申购上限  | float64 | -        |
| 上网发行数量  | float64 | -        |

### stock_share_hold_change_sse
- **文档定位**：基本面数据 / 机构推荐 / 董监高及相关人员持股变动-上证
- **HTTP**：`GET /api/public/stock_share_hold_change_sse`
- **调用**：运行 `scripts/aktools_get.py stock_share_hold_change_sse --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.sse.com.cn/disclosure/credibility/supervision/change/

描述: 上海证券交易所-披露-监管信息公开-公司监管-董董监高人员股份变动

限量: 单次获取指定 symbol 的数据

输入参数

| 名称     | 类型  | 描述                                          |
|--------|-----|---------------------------------------------|
| symbol | str | symbol="600000"; choice of {"全部", "具体股票代码"} |

输出参数

| 名称       | 类型      | 描述 |
|----------|---------|----|
| 公司代码     | object  | -  |
| 公司名称     | object  | -  |
| 姓名       | object  | -  |
| 职务       | object  | -  |
| 股票种类     | object  | -  |
| 货币种类     | object  | -  |
| 本次变动前持股数 | int64   | -  |
| 变动数      | int64   | -  |
| 本次变动平均价格 | float64 | -  |
| 变动后持股数   | int64   | -  |
| 变动原因     | object  | -  |
| 变动日期     | object  | -  |
| 填报日期     | object  | -  |

### stock_share_hold_change_szse
- **文档定位**：基本面数据 / 机构推荐 / 董监高及相关人员持股变动-深证
- **HTTP**：`GET /api/public/stock_share_hold_change_szse`
- **调用**：运行 `scripts/aktools_get.py stock_share_hold_change_szse --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.szse.cn/disclosure/supervision/change/index.html

描述: 深圳证券交易所-信息披露-监管信息公开-董监高人员股份变动

限量: 单次获取指定 symbol 的数据

输入参数

| 名称     | 类型  | 描述                                          |
|--------|-----|---------------------------------------------|
| symbol | str | symbol="001308"; choice of {"全部", "具体股票代码"} |

输出参数

| 名称         | 类型      | 描述         |
|------------|---------|------------|
| 证券代码       | object  | -          |
| 证券简称       | object  | -          |
| 董监高姓名      | object  | -          |
| 变动日期       | object  | -          |
| 变动股份数量     | float64 | 注意单位: 万股   |
| 成交均价       | float64 | -          |
| 变动原因       | object  | -          |
| 变动比例       | float64 | 注意单位: 千分之一 |
| 当日结存股数     | float64 | 注意单位: 万股   |
| 股份变动人姓名    | object  | -          |
| 职务         | object  | -          |
| 变动人与董监高的关系 | object  | -          |

### stock_share_hold_change_bse
- **文档定位**：基本面数据 / 机构推荐 / 董监高及相关人员持股变动-北证
- **HTTP**：`GET /api/public/stock_share_hold_change_bse`
- **调用**：运行 `scripts/aktools_get.py stock_share_hold_change_bse --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.bse.cn/disclosure/djg_sharehold_change.html

描述: 北京证券交易所-信息披露-监管信息-董监高及相关人员持股变动

限量: 单次获取指定 symbol 的数据

输入参数

| 名称     | 类型  | 描述                                          |
|--------|-----|---------------------------------------------|
| symbol | str | symbol="430489"; choice of {"全部", "具体股票代码"} |

输出参数

| 名称     | 类型      | 描述       |
|--------|---------|----------|
| 代码     | object  | -        |
| 简称     | object  | -        |
| 姓名     | object  | -        |
| 职务     | object  | -        |
| 变动日期   | object  | -        |
| 变动股数   | float64 | 注意单位: 万股 |
| 变动前持股数 | float64 | 注意单位: 万股 |
| 变动后持股数 | float64 | 注意单位: 万股 |
| 变动均价   | float64 | 注意单位: 元  |
| 变动原因   | object  | -        |

### stock_hold_num_cninfo
- **文档定位**：基本面数据 / 机构推荐 / 股东人数及持股集中度
- **HTTP**：`GET /api/public/stock_hold_num_cninfo`
- **调用**：运行 `scripts/aktools_get.py stock_hold_num_cninfo --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://webapi.cninfo.com.cn/#/thematicStatistics

描述: 巨潮资讯-数据中心-专题统计-股东股本-股东人数及持股集中度

限量: 单次指定 date 的股东人数及持股集中度数据, 从 20170331 开始

输入参数

| 名称   | 类型  | 描述                                                                                         |
|------|-----|--------------------------------------------------------------------------------------------|
| date | str | date="20210630"; choice of {"XXXX0331", "XXXX0630", "XXXX0930", "XXXX1231"}; 从 20170331 开始 |

输出参数

| 名称       | 类型      | 描述       |
|----------|---------|----------|
| 证劵代码     | object  | -        |
| 证券简称     | object  | -        |
| 变动日期     | object  | -        |
| 本期股东人数   | int64   | -        |
| 上期股东人数   | float64 | -        |
| 股东人数增幅   | float64 | 注意单位: %  |
| 本期人均持股数量 | int64   | 注意单位: 万股 |
| 上期人均持股数量 | float64 | 注意单位: %  |
| 人均持股数量增幅 | float64 | 注意单位: %  |

### stock_hold_change_cninfo
- **文档定位**：基本面数据 / 机构推荐 / 股本变动
- **HTTP**：`GET /api/public/stock_hold_change_cninfo`
- **调用**：运行 `scripts/aktools_get.py stock_hold_change_cninfo --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://webapi.cninfo.com.cn/#/thematicStatistics

描述: 巨潮资讯-数据中心-专题统计-股东股本-股本变动

限量: 单次指定 symbol 的股本变动数据

输入参数

| 名称     | 类型  | 描述                                                               |
|--------|-----|------------------------------------------------------------------|
| symbol | str | symbol="全部"; choice of {"深市主板", "沪市", "创业板", "科创板", "北交所", "全部"} |

输出参数

| 名称     | 类型      | 描述     |
|--------|---------|--------|
| 证券代码   | object  | -      |
| 证券简称   | object  | -      |
| 交易市场   | object  | -      |
| 公告日期   | object  | -      |
| 变动日期   | object  | -      |
| 变动原因   | object  | -      |
| 总股本    | float64 | 单位: 万股 |
| 已流通股份  | float64 | 单位: 万股 |
| 已流通比例  | float64 | 单位: %  |
| 流通受限股份 | float64 | 单位: 万股 |

### stock_hold_control_cninfo
- **文档定位**：基本面数据 / 机构推荐 / 实际控制人持股变动
- **HTTP**：`GET /api/public/stock_hold_control_cninfo`
- **调用**：运行 `scripts/aktools_get.py stock_hold_control_cninfo --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://webapi.cninfo.com.cn/#/thematicStatistics

描述: 巨潮资讯-数据中心-专题统计-股东股本-实际控制人持股变动

限量: 单次指定 symbol 的实际控制人持股变动数据, 从 2010 开始

输入参数

| 名称     | 类型  | 描述                                                                         |
|--------|-----|----------------------------------------------------------------------------|
| symbol | str | symbol="全部"; choice of {"单独控制", "实际控制人", "一致行动人", "家族控制", "全部"}; 从 2010 开始 |

输出参数

| 名称      | 类型      | 描述       |
|---------|---------|----------|
| 证劵代码    | object  | -        |
| 证券简称    | object  | -        |
| 变动日期    | object  | -        |
| 实际控制人名称 | object  | -        |
| 控股数量    | float64 | 注意单位: 万股 |
| 控股比例    | float64 | 注意单位: %  |
| 直接控制人名称 | object  | -        |
| 控制类型    | object  | -        |

### stock_hold_management_detail_cninfo
- **文档定位**：基本面数据 / 机构推荐 / 高管持股变动明细
- **HTTP**：`GET /api/public/stock_hold_management_detail_cninfo`
- **调用**：运行 `scripts/aktools_get.py stock_hold_management_detail_cninfo --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://webapi.cninfo.com.cn/#/thematicStatistics

描述: 巨潮资讯-数据中心-专题统计-股东股本-高管持股变动明细

限量: 单次指定 symbol 的高管持股变动明细数据, 返回近一年的数据

输入参数

| 名称     | 类型  | 描述                                  |
|--------|-----|-------------------------------------|
| symbol | str | symbol="增持"; choice of {"增持", "减持"} |

输出参数

| 名称        | 类型      | 描述       |
|-----------|---------|----------|
| 证劵代码      | object  | -        |
| 证券简称      | object  | -        |
| 截止日期      | object  | -        |
| 公告日期      | object  | -        |
| 高管姓名      | object  | -        |
| 董监高姓名     | object  | -        |
| 董监高职务     | object  | -        |
| 变动人与董监高关系 | object  | -        |
| 期初持股数量    | float64 | 注意单位: 万股 |
| 期末持股数量    | float64 | 注意单位: 万股 |
| 变动数量      | float64 | -        |
| 变动比例      | int64   | 注意单位: %  |
| 成交均价      | float64 | 注意单位: 元  |
| 期末市值      | float64 | 注意单位: 万元 |
| 持股变动原因    | object  | -        |
| 数据来源      | object  | -        |

### stock_hold_management_detail_em
- **文档定位**：基本面数据 / 机构推荐 / 董监高及相关人员持股变动明细
- **HTTP**：`GET /api/public/stock_hold_management_detail_em`
- **调用**：运行 `scripts/aktools_get.py stock_hold_management_detail_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/executive/list.html

描述: 东方财富网-数据中心-特色数据-高管持股-董监高及相关人员持股变动明细

限量: 单次返回所有数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称         | 类型      | 描述 |
|------------|---------|----|
| 日期         | object  | -  |
| 代码         | object  | -  |
| 名称         | object  | -  |
| 变动人        | object  | -  |
| 变动股数       | int64   | -  |
| 成交均价       | int64   | -  |
| 变动金额       | float64 | -  |
| 变动原因       | object  | -  |
| 变动比例       | float64 | -  |
| 变动后持股数     | float64 | -  |
| 持股种类       | object  | -  |
| 董监高人员姓名    | object  | -  |
| 职务         | object  | -  |
| 变动人与董监高的关系 | object  | -  |
| 开始时持有      | float64 | -  |
| 结束后持有      | float64 | -  |

### stock_hold_management_person_em
- **文档定位**：基本面数据 / 机构推荐 / 人员增减持股变动明细
- **HTTP**：`GET /api/public/stock_hold_management_person_em`
- **调用**：运行 `scripts/aktools_get.py stock_hold_management_person_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/executive/personinfo.html?name=%E5%90%B4%E8%BF%9C&code=001308

描述: 东方财富网-数据中心-特色数据-高管持股-人员增减持股变动明细

限量: 单次返回指定 symbol 和 name 的数据

输入参数

| 名称     | 类型  | 描述                    |
|--------|-----|-----------------------|
| symbol | str | symbol="001308"; 股票代码 |
| name   | str | name="吴远"; 高管名称       |

输出参数

| 名称         | 类型      | 描述 |
|------------|---------|----|
| 日期         | object  | -  |
| 代码         | object  | -  |
| 名称         | object  | -  |
| 变动人        | object  | -  |
| 变动股数       | int64   | -  |
| 成交均价       | int64   | -  |
| 变动金额       | float64 | -  |
| 变动原因       | object  | -  |
| 变动比例       | float64 | -  |
| 变动后持股数     | float64 | -  |
| 持股种类       | object  | -  |
| 董监高人员姓名    | object  | -  |
| 职务         | object  | -  |
| 变动人与董监高的关系 | object  | -  |
| 开始时持有      | float64 | -  |
| 结束后持有      | float64 | -  |

### stock_cg_guarantee_cninfo
- **文档定位**：基本面数据 / 机构推荐 / 对外担保
- **HTTP**：`GET /api/public/stock_cg_guarantee_cninfo`
- **调用**：运行 `scripts/aktools_get.py stock_cg_guarantee_cninfo --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://webapi.cninfo.com.cn/#/thematicStatistics

描述: 巨潮资讯-数据中心-专题统计-公司治理-对外担保

限量: 单次指定 symbol 和起始日期的对外担保数据

输入参数

| 名称         | 类型  | 描述                                                        |
|------------|-----|-----------------------------------------------------------|
| symbol     | str | symbol="全部"; choice of {"全部", "深市主板", "沪市", "创业板", "科创板"} |
| start_date | str | start_date="20180630"                                     |
| end_date   | str | end_date="20210927"                                       |

输出参数

| 名称          | 类型      | 描述       |
|-------------|---------|----------|
| 证劵代码        | object  | -        |
| 证券简称        | object  | -        |
| 公告统计区间      | object  | -        |
| 担保笔数        | int64   | -        |
| 担保金额        | float64 | 注意单位: 万元 |
| 归属于母公司所有者权益 | float64 | 注意单位: 万元 |
| 担保金融占净资产比例  | float64 | 注意单位: %  |

### stock_cg_lawsuit_cninfo
- **文档定位**：基本面数据 / 机构推荐 / 公司诉讼
- **HTTP**：`GET /api/public/stock_cg_lawsuit_cninfo`
- **调用**：运行 `scripts/aktools_get.py stock_cg_lawsuit_cninfo --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://webapi.cninfo.com.cn/#/thematicStatistics

描述: 巨潮资讯-数据中心-专题统计-公司治理-公司诉讼

限量: 单次指定 symbol 和起始日期的公司诉讼数据

说明: 接口内部已兼容巨潮资讯当前鉴权方式; 源站无数据时返回空 DataFrame

输入参数

| 名称         | 类型  | 描述                                                        |
|------------|-----|-----------------------------------------------------------|
| symbol     | str | symbol="全部"; choice of {"全部", "深市主板", "沪市", "创业板", "科创板"} |
| start_date | str | start_date="20180630"                                     |
| end_date   | str | end_date="20210927"                                       |

输出参数

| 名称     | 类型      | 描述       |
|--------|---------|----------|
| 证券代码   | object  | -        |
| 证券简称   | object  | -        |
| 公告统计区间 | object  | -        |
| 诉讼次数   | int64   | -        |
| 诉讼金额   | float64 | 注意单位: 万元 |
