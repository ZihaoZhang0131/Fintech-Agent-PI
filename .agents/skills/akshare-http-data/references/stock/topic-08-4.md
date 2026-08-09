# 基本面数据



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### stock_cg_equity_mortgage_cninfo
- **文档定位**：基本面数据 / 机构推荐 / 股权质押
- **HTTP**：`GET /api/public/stock_cg_equity_mortgage_cninfo`
- **调用**：运行 `scripts/aktools_get.py stock_cg_equity_mortgage_cninfo --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://webapi.cninfo.com.cn/#/thematicStatistics

描述: 巨潮资讯-数据中心-专题统计-公司治理-股权质押

限量: 单次指定 date 的股权质押数据

输入参数

| 名称   | 类型  | 描述              |
|------|-----|-----------------|
| date | str | date="20210930" |

输出参数

| 名称         | 类型      | 描述       |
|------------|---------|----------|
| 股票代码       | object  | -        |
| 股票简称       | object  | -        |
| 公告日期       | object  | -        |
| 出质人        | object  | -        |
| 质权人        | object  | -        |
| 质押数量       | float64 | 注意单位: 万股 |
| 占总股本比例     | float64 | 注意单位: %  |
| 质押解除数量     | float64 | 注意单位: 万股 |
| 质押事项       | object  | 注意单位: 万元 |
| 累计质押占总股本比例 | float64 | 注意单位: %  |

### stock_price_js
- **文档定位**：基本面数据 / 美港目标价
- **HTTP**：`GET /api/public/stock_price_js`
- **调用**：运行 `scripts/aktools_get.py stock_price_js --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.ushknews.com/report.html

描述: 美港电讯-美港目标价数据

限量: 单次获取所有数据, 数据从 2019-至今; 该接口暂时不能使用

输入参数

| 名称     | 类型  | 描述                                  |
|--------|-----|-------------------------------------|
| symbol | str | symbol="us"; choice of {"us", "hk"} |

输出参数

| 名称    | 类型      | 描述  |
|-------|---------|-----|
| 日期    | object  | -   |
| 个股名称  | object  | -   |
| 评级    | object  | -   |
| 先前目标价 | float64 | -   |
| 最新目标价 | float64 | -   |
| 机构名称  | object  | -   |

### stock_qsjy_em
- **文档定位**：基本面数据 / 券商业绩月报
- **HTTP**：`GET /api/public/stock_qsjy_em`
- **调用**：运行 `scripts/aktools_get.py stock_qsjy_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/other/qsjy.html

描述: 东方财富网-数据中心-特色数据-券商业绩月报

限量: 单次获取所有数据, 数据从 201006-202007, 月频率

输入参数

| 名称   | 类型  | 描述                                |
|------|-----|-----------------------------------|
| date | str | date="20200430"; 输入需要查询月份的最后一天的日期 |

输出参数

| 名称              | 类型      | 描述       |
|-----------------|---------|----------|
| 简称              | object  | -        |
| 代码              | object  | -        |
| 当月净利润-净利润       | float64 | 注意单位: 万元 |
| 当月净利润-同比增长      | float64 | -        |
| 当月净利润-环比增长      | float64 | -        |
| 当年累计净利润-累计净利润   | float64 | 注意单位: 万元 |
| 当年累计净利润-同比增长    | float64 | -        |
| 当月营业收入-营业收入     | float64 | 注意单位: 万元 |
| 当月营业收入-环比增长     | float64 | -        |
| 当月营业收入-同比增长     | float64 | -        |
| 当年累计营业收入-累计营业收入 | float64 | 注意单位: 万元 |
| 当年累计营业收入-同比增长   | float64 | -        |
| 净资产-净资产         | float64 | 注意单位: 万元 |
| 净资产-同比增长        | float64 | -        |

### stock_a_gxl_lg
- **文档定位**：基本面数据 / A 股股息率
- **HTTP**：`GET /api/public/stock_a_gxl_lg`
- **调用**：运行 `scripts/aktools_get.py stock_a_gxl_lg --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://legulegu.com/stockdata/guxilv

描述: 乐咕乐股-股息率-A 股股息率

限量: 单次获取指定 symbol 的所有历史数据

输入参数

| 名称     | 类型  | 描述                                                      |
|--------|-----|---------------------------------------------------------|
| symbol | str | symbol="上证A股"; choice of {"上证A股", "深证A股", "创业板", "科创板"} |

输出参数

| 名称  | 类型      | 描述  |
|-----|---------|-----|
| 日期  | object  | -   |
| 股息率 | float64 | -   |

### stock_hk_gxl_lg
- **文档定位**：基本面数据 / 恒生指数股息率
- **HTTP**：`GET /api/public/stock_hk_gxl_lg`
- **调用**：运行 `scripts/aktools_get.py stock_hk_gxl_lg --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://legulegu.com/stockdata/market/hk/dv/hsi

描述: 乐咕乐股-股息率-恒生指数股息率

限量: 单次获取所有月度历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称  | 类型      | 描述  |
|-----|---------|-----|
| 日期  | object  | -   |
| 股息率 | float64 | -   |

### stock_a_congestion_lg
- **文档定位**：基本面数据 / 大盘拥挤度
- **HTTP**：`GET /api/public/stock_a_congestion_lg`
- **调用**：运行 `scripts/aktools_get.py stock_a_congestion_lg --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://legulegu.com/stockdata/ashares-congestion

描述: 乐咕乐股-大盘拥挤度

限量: 单次获取近 4 年的历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称         | 类型      | 描述  |
|------------|---------|-----|
| date       | object  | 日期  |
| close      | float64 | 收盘价 |
| congestion | float64 | 拥挤度 |

### stock_ebs_lg
- **文档定位**：基本面数据 / 股债利差
- **HTTP**：`GET /api/public/stock_ebs_lg`
- **调用**：运行 `scripts/aktools_get.py stock_ebs_lg --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://legulegu.com/stockdata/equity-bond-spread

描述: 乐咕乐股-股债利差

限量: 单次所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称      | 类型      | 描述  |
|---------|---------|-----|
| 日期      | object  | -   |
| 沪深300指数 | float64 | -   |
| 股债利差    | float64 | -   |
| 股债利差均线  | float64 | -   |

### stock_buffett_index_lg
- **文档定位**：基本面数据 / 巴菲特指标
- **HTTP**：`GET /api/public/stock_buffett_index_lg`
- **调用**：运行 `scripts/aktools_get.py stock_buffett_index_lg --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://legulegu.com/stockdata/marketcap-gdp

描述: 乐估乐股-底部研究-巴菲特指标

限量: 单次获取所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述                             |
|--------|---------|--------------------------------|
| 日期     | object  | 交易日                            |
| 收盘价    | float64 | -                              |
| 总市值    | float64 | A股收盘价*已发行股票总股本（A股+B股+H股）       |
| GDP    | float64 | 上年度国内生产总值（例如：2019年，则取2018年GDP） |

### stock_a_ttm_lyr
- **文档定位**：基本面数据 / A 股等权重与中位数市盈率
- **HTTP**：`GET /api/public/stock_a_ttm_lyr`
- **调用**：运行 `scripts/aktools_get.py stock_a_ttm_lyr --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.legulegu.com/stockdata/a-ttm-lyr

描述: 乐咕乐股-A 股等权重市盈率与中位数市盈率

限量: 单次返回所有数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称                                  | 类型      | 描述                               |
|-------------------------------------|---------|----------------------------------|
| date                                | object  | 日期                               |
| middlePETTM                         | float64 | 全A股滚动市盈率(TTM)中位数                 |
| averagePETTM                        | float64 | 全A股滚动市盈率(TTM)等权平均                |
| middlePELYR                         | float64 | 全A股静态市盈率(LYR)中位数                 |
| averagePELYR                        | float64 | 全A股静态市盈率(LYR)等权平均                |
| quantileInAllHistoryMiddlePeTtm     | float64 | 当前"TTM(滚动市盈率)中位数"在历史数据上的分位数      |
| quantileInRecent10YearsMiddlePeTtm  | float64 | 当前"TTM(滚动市盈率)中位数"在最近10年数据上的分位数   |
| quantileInAllHistoryAveragePeTtm    | float64 | 当前"TTM(滚动市盈率)等权平均"在历史数据上的分位数     |
| quantileInRecent10YearsAveragePeTtm | float64 | 当前"TTM(滚动市盈率)等权平均"在在最近10年数据上的分位数 |
| quantileInAllHistoryMiddlePeLyr     | float64 | 当前"LYR(静态市盈率)中位数"在历史数据上的分位数      |
| quantileInRecent10YearsMiddlePeLyr  | float64 | 当前"LYR(静态市盈率)中位数"在最近10年数据上的分位数   |
| quantileInAllHistoryAveragePeLyr    | float64 | 当前"LYR(静态市盈率)等权平均"在历史数据上的分位数     |
| quantileInRecent10YearsAveragePeLyr | float64 | 当前"LYR(静态市盈率)等权平均"在最近10年数据上的分位数  |
| close                               | float64 | 沪深300指数                          |

### stock_a_all_pb
- **文档定位**：基本面数据 / A 股等权重与中位数市净率
- **HTTP**：`GET /api/public/stock_a_all_pb`
- **调用**：运行 `scripts/aktools_get.py stock_a_all_pb --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.legulegu.com/stockdata/all-pb

描述: 乐咕乐股-A 股等权重与中位数市净率

限量: 单次返回所有数据

输入参数

| 名称  | 类型  | 描述 |
|-----|-----|----|
| -   | -   | -  |

输出参数

| 名称                                          | 类型      | 描述                     |
|---------------------------------------------|---------|------------------------|
| date                                        | object  | 日期                     |
| middlePB                                    | float64 | 全部A股市净率中位数             |
| equalWeightAveragePB                        | float64 | 全部A股市净率等权平均            |
| close                                       | float64 | 上证指数                   |
| quantileInAllHistoryMiddlePB                | float64 | 当前市净率中位数在历史数据上的分位数     |
| quantileInRecent10YearsMiddlePB             | float64 | 当前市净率中位数在最近10年数据上的分位数  |
| quantileInAllHistoryEqualWeightAveragePB    | float64 | 当前市净率等权平均在历史数据上的分位数    |
| quantileInRecent10YearsEqualWeightAveragePB | float64 | 当前市净率等权平均在最近10年数据上的分位数 |

### stock_market_pe_lg
- **文档定位**：基本面数据 / 主板市盈率
- **HTTP**：`GET /api/public/stock_market_pe_lg`
- **调用**：运行 `scripts/aktools_get.py stock_market_pe_lg --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://legulegu.com/stockdata/shanghaiPE

描述: 乐咕乐股-主板市盈率

限量: 单次获取指定 symbol 的所有数据

输入参数

| 名称     | 类型  | 描述                                                |
|--------|-----|---------------------------------------------------|
| symbol | str | symbol="上证"; choice of {"上证", "深证", "创业板", "科创版"} |

输出参数-上证, 深证, 创业板

| 名称    | 类型      | 描述  |
|-------|---------|-----|
| 日期    | object  | -   |
| 指数    | float64 | -   |
| 平均市盈率 | float64 | -   |

接口示例-上证, 深证, 创业板

```python
import akshare as ak

stock_market_pe_lg_df = ak.stock_market_pe_lg(symbol="上证")
print(stock_market_pe_lg_df)
```

### stock_index_pe_lg
- **文档定位**：基本面数据 / 指数市盈率
- **HTTP**：`GET /api/public/stock_index_pe_lg`
- **调用**：运行 `scripts/aktools_get.py stock_index_pe_lg --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://legulegu.com/stockdata/sz50-ttm-lyr

描述: 乐咕乐股-指数市盈率

限量: 单次获取指定 symbol 的所有数据

输入参数

| 名称     | 类型  | 描述                                                                                                                                  |
|--------|-----|-------------------------------------------------------------------------------------------------------------------------------------|
| symbol | str | symbol="上证50"; choice of {"上证50", "沪深300", "上证380", "创业板50", "中证500", "上证180", "深证红利", "深证100", "中证1000", "上证红利", "中证100", "中证800"} |

输出参数

| 名称       | 类型      | 描述  |
|----------|---------|-----|
| 日期       | object  | -   |
| 指数       | float64 | -   |
| 等权静态市盈率  | float64 | -   |
| 静态市盈率    | float64 | -   |
| 静态市盈率中位数 | float64 | -   |
| 等权滚动市盈率  | float64 | -   |
| 滚动市盈率    | float64 | -   |
| 滚动市盈率中位数 | float64 | -   |

### stock_market_pb_lg
- **文档定位**：基本面数据 / 主板市净率
- **HTTP**：`GET /api/public/stock_market_pb_lg`
- **调用**：运行 `scripts/aktools_get.py stock_market_pb_lg --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://legulegu.com/stockdata/shanghaiPB

描述: 乐咕乐股-主板市净率

限量: 单次获取指定 symbol 的所有数据

输入参数

| 名称     | 类型  | 描述                                                |
|--------|-----|---------------------------------------------------|
| symbol | str | symbol="上证"; choice of {"上证", "深证", "创业板", "科创版"} |

输出参数

| 名称     | 类型      | 描述  |
|--------|---------|-----|
| 日期     | object  | -   |
| 指数     | float64 | -   |
| 市净率    | float64 | -   |
| 等权市净率  | float64 | -   |
| 市净率中位数 | float64 | -   |

### stock_index_pb_lg
- **文档定位**：基本面数据 / 指数市净率
- **HTTP**：`GET /api/public/stock_index_pb_lg`
- **调用**：运行 `scripts/aktools_get.py stock_index_pb_lg --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://legulegu.com/stockdata/sz50-pb

描述: 乐咕乐股-指数市净率

限量: 单次获取指定 symbol 的所有数据

输入参数

| 名称     | 类型  | 描述                                                                                                                                  |
|--------|-----|-------------------------------------------------------------------------------------------------------------------------------------|
| symbol | str | symbol="上证50"; choice of {"上证50", "沪深300", "上证380", "创业板50", "中证500", "上证180", "深证红利", "深证100", "中证1000", "上证红利", "中证100", "中证800"} |

输出参数

| 名称     | 类型      | 描述  |
|--------|---------|-----|
| 日期     | object  | -   |
| 指数     | float64 | -   |
| 市净率    | float64 | -   |
| 等权市净率  | float64 | -   |
| 市净率中位数 | float64 | -   |

### stock_zh_valuation_baidu
- **文档定位**：基本面数据 / A 股估值指标
- **HTTP**：`GET /api/public/stock_zh_valuation_baidu`
- **调用**：运行 `scripts/aktools_get.py stock_zh_valuation_baidu --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://gushitong.baidu.com/stock/ab-002044

描述: 百度股市通-A 股-财务报表-估值数据

限量: 单次获取指定 symbol 和 indicator 的所有历史数据

输入参数

| 名称        | 类型  | 描述                                                                     |
|-----------|-----|------------------------------------------------------------------------|
| symbol    | str | symbol="002044"; A 股代码                                                 |
| indicator | str | indicator="总市值"; choice of {"总市值", "市盈率(TTM)", "市盈率(静)", "市净率", "市现率"} |
| period    | str | period="近一年"; choice of {"近一年", "近三年", "近五年", "近十年", "全部"}             |

输出参数

| 名称    | 类型      | 描述  |
|-------|---------|-----|
| date  | object  | -   |
| value | float64 | -   |

### stock_value_em
- **文档定位**：基本面数据 / 个股估值
- **HTTP**：`GET /api/public/stock_value_em`
- **调用**：运行 `scripts/aktools_get.py stock_value_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/gzfx/detail/300766.html

描述: 东方财富网-数据中心-估值分析-每日互动-每日互动-估值分析

限量: 单次获取指定 symbol 的所有历史数据

输入参数

| 名称        | 类型  | 描述                                                                     |
|-----------|-----|------------------------------------------------------------------------|
| symbol    | str | symbol="002044"; A 股代码                                                 |

输出参数

| 名称      | 类型      | 描述      |
|---------|---------|---------|
| 数据日期    | object  | -       |
| 当日收盘价   | float64 | 注意单位: 元 |
| 当日涨跌幅   | float64 | 注意单位: % |
| 总市值     | float64 | 注意单位: 元 |
| 流通市值    | float64 | 注意单位: 元 |
| 总股本     | float64 | 注意单位: 股 |
| 流通股本    | float64 | -       |
| PE(TTM) | float64 | -       |
| PE(静)   | float64 | -       |
| 市净率     | float64 | -       |
| PEG值    | float64 | -       |
| 市现率     | float64 | -       |
| 市销率     | float64 | -       |

### stock_zh_vote_baidu
- **文档定位**：基本面数据 / 涨跌投票
- **HTTP**：`GET /api/public/stock_zh_vote_baidu`
- **调用**：运行 `scripts/aktools_get.py stock_zh_vote_baidu --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://gushitong.baidu.com/index/ab-000001

描述: 百度股市通- A 股或指数-股评-投票

限量: 单次获取指定 symbol 和 indicator 的所有数据

输入参数

| 名称        | 类型  | 描述                                     |
|-----------|-----|----------------------------------------|
| symbol    | str | symbol="000001"; A 股股票或指数代码            |
| indicator | str | indicator="指数"; choice of {"指数", "股票"} |

输出参数

| 名称   | 类型     | 描述  |
|------|--------|-----|
| 周期   | object | -   |
| 看涨   | object | -   |
| 看跌   | object | -   |
| 看涨比例 | object | -   |
| 看跌比例 | object | -   |

### stock_hk_indicator_eniu
- **文档定位**：基本面数据 / 港股个股指标
- **HTTP**：`GET /api/public/stock_hk_indicator_eniu`
- **调用**：运行 `scripts/aktools_get.py stock_hk_indicator_eniu --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://eniu.com/gu/hk01093/roe

描述: 亿牛网-港股个股指标: 市盈率, 市净率, 股息率, ROE, 市值

限量: 单次获取指定 symbol 和 indicator 的所有历史数据

输入参数

| 名称        | 类型  | 描述                                                                                              |
|-----------|-----|-------------------------------------------------------------------------------------------------|
| symbol    | str | symbol="hk01093"; 可通过调用 **ak.stock_hk_indicator_eniu(symbol="hk01093", indicator="港股")** 获取股票代码 |
| indicator | str | indicator="市盈率"; choice of {"港股", "市盈率", "市净率", "股息率", "ROE", "市值"}                             |

输出参数

| 名称  | 类型  | 描述              |
|-----|-----|-----------------|
| -   | -   | 根据 indicator 而异 |

接口示例-ROE

```python
import akshare as ak

stock_hk_indicator_eniu_df = ak.stock_hk_indicator_eniu(symbol="hk01093", indicator="市净率")
print(stock_hk_indicator_eniu_df)
```

### stock_hk_valuation_baidu
- **文档定位**：基本面数据 / 港股估值指标
- **HTTP**：`GET /api/public/stock_hk_valuation_baidu`
- **调用**：运行 `scripts/aktools_get.py stock_hk_valuation_baidu --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://gushitong.baidu.com/stock/hk-06969

描述: 百度股市通-港股-财务报表-估值数据

限量: 单次获取指定 symbol 的指定 indicator 的特定 period 的历史数据

输入参数

| 名称        | 类型  | 描述                                                                     |
|-----------|-----|------------------------------------------------------------------------|
| symbol    | str | symbol="02358"; 港股代码                                                   |
| indicator | str | indicator="总市值"; choice of {"总市值", "市盈率(TTM)", "市盈率(静)", "市净率", "市现率"} |
| period    | str | period="近一年"; choice of {"近一年", "近三年", "全部"}                           |

输出参数

| 名称    | 类型      | 描述  |
|-------|---------|-----|
| date  | object  | -   |
| value | float64 | -   |

### stock_us_valuation_baidu
- **文档定位**：基本面数据 / 美股估值指标
- **HTTP**：`GET /api/public/stock_us_valuation_baidu`
- **调用**：运行 `scripts/aktools_get.py stock_us_valuation_baidu --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://gushitong.baidu.com/stock/us-NVDA

描述: 百度股市通-美股-财务报表-估值数据

限量: 单次获取指定 symbol 的指定 indicator 的特定 period 的历史数据

输入参数

| 名称        | 类型  | 描述                                                                     |
|-----------|-----|------------------------------------------------------------------------|
| symbol    | str | symbol="NVDA"; 美股代码                                                    |
| indicator | str | indicator="总市值"; choice of {"总市值", "市盈率(TTM)", "市盈率(静)", "市净率", "市现率"} |
| period    | str | period="近一年"; choice of {"近一年", "近三年", "全部"}                           |

输出参数

| 名称    | 类型      | 描述  |
|-------|---------|-----|
| date  | object  | -   |
| value | float64 | -   |

### stock_a_high_low_statistics
- **文档定位**：基本面数据 / 创新高和新低的股票数量
- **HTTP**：`GET /api/public/stock_a_high_low_statistics`
- **调用**：运行 `scripts/aktools_get.py stock_a_high_low_statistics --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.legulegu.com/stockdata/high-low-statistics

描述: 不同市场的创新高和新低的股票数量

限量: 单次获取指定 market 的近两年的历史数据

输入参数

| 名称     | 类型  | 描述                                                                                |
|--------|-----|-----------------------------------------------------------------------------------|
| symbol | str | symbol="all"; {"all": "全部A股", "sz50": "上证50", "hs300": "沪深300", "zz500": "中证500"} |

输出参数

| 名称      | 类型      | 描述      |
|---------|---------|---------|
| date    | object  | 交易日     |
| close   | float64 | 相关指数收盘价 |
| high20  | int64   | 20日新高   |
| low20   | int64   | 20日新低   |
| high60  | int64   | 60日新高   |
| low60   | int64   | 60日新低   |
| high120 | int64   | 120日新高  |
| low120  | int64   | 120日新低  |

### stock_a_below_net_asset_statistics
- **文档定位**：基本面数据 / 破净股统计
- **HTTP**：`GET /api/public/stock_a_below_net_asset_statistics`
- **调用**：运行 `scripts/aktools_get.py stock_a_below_net_asset_statistics --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.legulegu.com/stockdata/below-net-asset-statistics

描述: 乐咕乐股-A 股破净股统计数据

限量: 单次获取指定 symbol 的所有历史数据

输入参数

| 名称     | 类型  | 描述                                                          |
|--------|-----|-------------------------------------------------------------|
| symbol | str | symbol="全部A股"; choice of {"全部A股", "沪深300", "上证50", "中证500"} |

说明:

- 当前源站返回字段为驼峰命名, 且 `date` 为日期字符串, 接口内部已完成兼容处理
- 对外输出列仍保持为 `date`, `below_net_asset`, `total_company`, `below_net_asset_ratio`

输出参数-全部A股

| 名称                    | 类型      | 描述    |
|-----------------------|---------|-------|
| date                  | object  | 交易日   |
| below_net_asset       | float64 | 破净股家数 |
| total_company         | float64 | 总公司数  |
| below_net_asset_ratio | float64 | 破净股比率 |

接口示例-全部 A 股

```python
import akshare as ak

stock_a_below_net_asset_statistics_df = ak.stock_a_below_net_asset_statistics(symbol="全部A股")
print(stock_a_below_net_asset_statistics_df)
```

### stock_report_fund_hold
- **文档定位**：基本面数据 / 基金持股
- **HTTP**：`GET /api/public/stock_report_fund_hold`
- **调用**：运行 `scripts/aktools_get.py stock_report_fund_hold --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/zlsj/2020-06-30-1-2.html

描述: 东方财富网-数据中心-主力数据-基金持仓

限量: 单次返回指定 symbol 和 date 的所有历史数据

输入参数

| 名称     | 类型  | 描述                                                                          |
|--------|-----|-----------------------------------------------------------------------------|
| symbol | str | symbol="基金持仓"; choice of {"基金持仓", "QFII持仓", "社保持仓", "券商持仓", "保险持仓", "信托持仓"} |
| date   | str | date="20200630"; 财报发布日期, xxxx-03-31, xxxx-06-30, xxxx-09-30, xxxx-12-31     |

输出参数

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| 序号     | int64   | -       |
| 股票代码   | object  | -       |
| 股票简称   | object  | -       |
| 持有基金家数 | int64   | 注意单位: 家 |
| 持股总数   | int64   | 注意单位: 股 |
| 持股市值   | float64 | 注意单位: 元 |
| 持股变化   | object  | -       |
| 持股变动数值 | int64   | 注意单位: 股 |
| 持股变动比例 | float64 | 注意单位: % |

### stock_report_fund_hold_detail
- **文档定位**：基本面数据 / 基金持股明细
- **HTTP**：`GET /api/public/stock_report_fund_hold_detail`
- **调用**：运行 `scripts/aktools_get.py stock_report_fund_hold_detail --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/zlsj/ccjj/2020-12-31-008286.html

描述: 东方财富网-数据中心-主力数据-基金持仓-基金持仓明细表

限量: 单次返回指定 symbol 和 date 的所有历史数据

输入参数

| 名称     | 类型  | 描述                                                                      |
|--------|-----|-------------------------------------------------------------------------|
| symbol | str | symbol="005827"; 基金代码                                                   |
| date   | str | date="20200630"; 财报发布日期, xxxx-03-31, xxxx-06-30, xxxx-09-30, xxxx-12-31 |

输出参数

| 名称      | 类型      | 描述      |
|---------|---------|---------|
| 序号      | int64   | -       |
| 股票代码    | object  | -       |
| 股票简称    | object  | -       |
| 持股数     | int64   | 注意单位: 股 |
| 持股市值    | float64 | 注意单位: 元 |
| 占总股本比例  | float64 | 注意单位: % |
| 占流通股本比例 | float64 | 注意单位: % |

### stock_lhb_detail_em
- **文档定位**：基本面数据 / 龙虎榜 / 龙虎榜-东财 / 龙虎榜详情
- **HTTP**：`GET /api/public/stock_lhb_detail_em`
- **调用**：运行 `scripts/aktools_get.py stock_lhb_detail_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/stock/tradedetail.html

描述: 东方财富网-数据中心-龙虎榜单-龙虎榜详情

限量: 单次返回所有历史数据

输入参数

| 名称         | 类型  | 描述                    |
|------------|-----|-----------------------|
| start_date | str | start_date="20220314" |
| end_date   | str | end_date="20220315"   |

输出参数

| 名称       | 类型      | 描述      |
|----------|---------|---------|
| 序号       | int64   | -       |
| 代码       | object  | -       |
| 名称       | object  | -       |
| 上榜日      | object  | -       |
| 解读       | object  | -       |
| 收盘价      | float64 | -       |
| 涨跌幅      | float64 | 注意单位: % |
| 龙虎榜净买额   | float64 | 注意单位: 元 |
| 龙虎榜买入额   | float64 | 注意单位: 元 |
| 龙虎榜卖出额   | float64 | 注意单位: 元 |
| 龙虎榜成交额   | float64 | 注意单位: 元 |
| 市场总成交额   | int64   | 注意单位: 元 |
| 净买额占总成交比 | float64 | 注意单位: % |
| 成交额占总成交比 | float64 | 注意单位: % |
| 换手率      | float64 | 注意单位: % |
| 流通市值     | float64 | 注意单位: 元 |
| 上榜原因     | object  | -       |
| 上榜后1日    | float64 | 注意单位: % |
| 上榜后2日    | float64 | 注意单位: % |
| 上榜后5日    | float64 | 注意单位: % |
| 上榜后10日   | float64 | 注意单位: % |

### stock_lhb_stock_statistic_em
- **文档定位**：基本面数据 / 龙虎榜 / 龙虎榜-东财 / 个股上榜统计
- **HTTP**：`GET /api/public/stock_lhb_stock_statistic_em`
- **调用**：运行 `scripts/aktools_get.py stock_lhb_stock_statistic_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/stock/tradedetail.html

描述: 东方财富网-数据中心-龙虎榜单-个股上榜统计

限量: 单次返回所有历史数据

输入参数

| 名称     | 类型  | 描述                                                   |
|--------|-----|------------------------------------------------------|
| symbol | str | symbol="近一月"; choice of {"近一月", "近三月", "近六月", "近一年"} |

输出参数

| 名称      | 类型      | 描述 |
|---------|---------|----|
| 序号      | int64   | -  |
| 代码      | object  | -  |
| 名称      | object  | -  |
| 最近上榜日   | object  | -  |
| 收盘价     | float64 | -  |
| 涨跌幅     | float64 | -  |
| 上榜次数    | int64   | -  |
| 龙虎榜净买额  | float64 | -  |
| 龙虎榜买入额  | float64 | -  |
| 龙虎榜卖出额  | float64 | -  |
| 龙虎榜总成交额 | float64 | -  |
| 买方机构次数  | int64   | -  |
| 卖方机构次数  | int64   | -  |
| 机构买入净额  | float64 | -  |
| 机构买入总额  | float64 | -  |
| 机构卖出总额  | float64 | -  |
| 近1个月涨跌幅 | float64 | -  |
| 近3个月涨跌幅 | float64 | -  |
| 近6个月涨跌幅 | float64 | -  |
| 近1年涨跌幅  | float64 | -  |

### stock_lhb_jgmmtj_em
- **文档定位**：基本面数据 / 龙虎榜 / 龙虎榜-东财 / 机构买卖每日统计
- **HTTP**：`GET /api/public/stock_lhb_jgmmtj_em`
- **调用**：运行 `scripts/aktools_get.py stock_lhb_jgmmtj_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/stock/jgmmtj.html

描述: 东方财富网-数据中心-龙虎榜单-机构买卖每日统计

限量: 单次返回所有历史数据

输入参数

| 名称         | 类型  | 描述                    |
|------------|-----|-----------------------|
| start_date | str | start_date="20240417" |
| end_date   | str | end_date="20240430"   |

输出参数

| 名称          | 类型      | 描述       |
|-------------|---------|----------|
| 序号          | int64   | -        |
| 代码          | object  | -        |
| 名称          | object  | -        |
| 收盘价         | float64 | -        |
| 涨跌幅         | float64 | -        |
| 买方机构数       | float64 | -        |
| 卖方机构数       | float64 | -        |
| 机构买入总额      | float64 | 注意单位: 元  |
| 机构卖出总额      | float64 | 注意单位: 元  |
| 机构买入净额      | float64 | 注意单位: 元  |
| 市场总成交额      | float64 | 注意单位: 元  |
| 机构净买额占总成交额比 | float64 | -        |
| 换手率         | float64 | -        |
| 流通市值        | float64 | 注意单位: 亿元 |
| 上榜原因        | object  | -        |
| 上榜日期        | object  | -        |

### stock_lhb_jgstatistic_em
- **文档定位**：基本面数据 / 龙虎榜 / 龙虎榜-东财 / 机构席位追踪
- **HTTP**：`GET /api/public/stock_lhb_jgstatistic_em`
- **调用**：运行 `scripts/aktools_get.py stock_lhb_jgstatistic_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/stock/jgstatistic.html

描述: 东方财富网-数据中心-龙虎榜单-机构席位追踪

限量: 单次返回所有历史数据

输入参数

| 名称     | 类型  | 描述                                                   |
|--------|-----|------------------------------------------------------|
| symbol | str | symbol="近一月"; choice of {"近一月", "近三月", "近六月", "近一年"} |

输出参数

| 名称      | 类型      | 描述      |
|---------|---------|---------|
| 序号      | int64   | -       |
| 代码      | object  | -       |
| 名称      | object  | -       |
| 收盘价     | float64 | -       |
| 涨跌幅     | float64 | 注意单位: % |
| 龙虎榜成交金额 | float64 | 注意单位: 元 |
| 上榜次数    | int64   | -       |
| 机构买入额   | float64 | 注意单位: 元 |
| 机构买入次数  | int64   | -       |
| 机构卖出额   | float64 | 注意单位: 元 |
| 机构卖出次数  | int64   | -       |
| 机构净买额   | float64 | 注意单位: 元 |
| 近1个月涨跌幅 | float64 | 注意单位: % |
| 近3个月涨跌幅 | float64 | 注意单位: % |
| 近6个月涨跌幅 | float64 | 注意单位: % |
| 近1年涨跌幅  | float64 | 注意单位: % |

### stock_lhb_hyyyb_em
- **文档定位**：基本面数据 / 龙虎榜 / 龙虎榜-东财 / 每日活跃营业部
- **HTTP**：`GET /api/public/stock_lhb_hyyyb_em`
- **调用**：运行 `scripts/aktools_get.py stock_lhb_hyyyb_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/stock/hyyyb.html

描述: 东方财富网-数据中心-龙虎榜单-每日活跃营业部

限量: 单次返回所有历史数据

输入参数

| 名称         | 类型  | 描述                    |
|------------|-----|-----------------------|
| start_date | str | start_date="20220311" |
| end_date   | str | end_date="20220315"   |

输出参数

| 名称    | 类型      | 描述      |
|-------|---------|---------|
| 序号    | int64   | -       |
| 营业部名称 | object  | -       |
| 上榜日   | object  | -       |
| 买入个股数 | float64 | -       |
| 卖出个股数 | float64 | -       |
| 买入总金额 | float64 | 注意单位: 元 |
| 卖出总金额 | float64 | 注意单位: 元 |
| 总买卖净额 | float64 | 注意单位: 元 |
| 买入股票  | object  | -       |

### stock_lhb_yyb_detail_em
- **文档定位**：基本面数据 / 营业部详情数据-东财
- **HTTP**：`GET /api/public/stock_lhb_yyb_detail_em`
- **调用**：运行 `scripts/aktools_get.py stock_lhb_yyb_detail_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/stock/lhb/yyb/10188715.html

描述: 东方财富网-数据中心-龙虎榜单-营业部历史交易明细-营业部交易明细

限量: 单次返回指定营业部的所有历史数据

输入参数

| 名称     | 类型  | 描述                                                        |
|--------|-----|-----------------------------------------------------------|
| symbol | str | symbol="10026729"; 营业部代码, 通过 ak.stock_lhb_hyyyb_em() 接口获取 |

输出参数

| 名称       | 类型      | 描述                     |
|----------|---------|------------------------|
| 序号       | int64   | -                      |
| 营业部代码    | object  | -                      |
| 营业部名称    | object  | -                      |
| 营业部简称    | object  | -                      |
| 交易日期     | object  | -                      |
| 股票代码     | object  | -                      |
| 股票名称     | object  | -                      |
| 涨跌幅      | float64 | 注意单位: %                |
| 买入金额     | float64 | 注意单位: 元                |
| 卖出金额     | float64 | 注意单位: 元                |
| 净额       | float64 | 注意单位: 元                |
| 上榜原因     | object  | -                      |
| 1日后涨跌幅   | float64 | 注意单位: %                |
| 2日后涨跌幅   | float64 | 注意单位: %                |
| 3日后涨跌幅   | float64 | 注意单位: %                |
| 5日后涨跌幅   | float64 | 注意单位: %                |
| 10日后涨跌幅  | float64 | 注意单位: %                |
| 20日后涨跌幅  | float64 | 注意单位: %                |
| 30日后涨跌幅  | float64 | 注意单位: %                |
