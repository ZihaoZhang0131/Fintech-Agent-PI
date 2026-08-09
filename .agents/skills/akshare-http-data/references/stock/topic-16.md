# 港股



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### stock_hk_spot_em
- **文档定位**：港股 / 实时行情数据-东财
- **HTTP**：`GET /api/public/stock_hk_spot_em`
- **调用**：运行 `scripts/aktools_get.py stock_hk_spot_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://quote.eastmoney.com/center/gridlist.html#hk_stocks

描述: 所有港股的实时行情数据; 该数据有 15 分钟延时

限量: 单次返回最近交易日的所有港股的数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称  | 类型      | 描述       |
|-----|---------|----------|
| 序号  | int64   | -        |
| 代码  | object  | -        |
| 名称  | object  | -        |
| 最新价 | float64 | 注意单位: 港元 |
| 涨跌额 | float64 | 注意单位: 港元 |
| 涨跌幅 | float64 | 注意单位: %  |
| 今开  | float64 | -        |
| 最高  | float64 | -        |
| 最低  | float64 | -        |
| 昨收  | float64 | -        |
| 成交量 | float64 | 注意单位: 股  |
| 成交额 | float64 | 注意单位: 港元 |

### stock_hk_main_board_spot_em
- **文档定位**：港股 / 港股主板实时行情数据-东财
- **HTTP**：`GET /api/public/stock_hk_main_board_spot_em`
- **调用**：运行 `scripts/aktools_get.py stock_hk_main_board_spot_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/center/gridlist.html#hk_mainboard

描述: 港股主板的实时行情数据; 该数据有 15 分钟延时

限量: 单次返回港股主板的数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称  | 类型      | 描述       |
|-----|---------|----------|
| 序号  | int64   | -        |
| 代码  | object  | -        |
| 名称  | object  | -        |
| 最新价 | float64 | 注意单位: 港元 |
| 涨跌额 | float64 | 注意单位: 港元 |
| 涨跌幅 | float64 | 注意单位: %  |
| 今开  | float64 | -        |
| 最高  | float64 | -        |
| 最低  | float64 | -        |
| 昨收  | float64 | -        |
| 成交量 | float64 | 注意单位: 股  |
| 成交额 | float64 | 注意单位: 港元 |

### stock_hk_spot
- **文档定位**：港股 / 实时行情数据-新浪
- **HTTP**：`GET /api/public/stock_hk_spot`
- **调用**：运行 `scripts/aktools_get.py stock_hk_spot --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://vip.stock.finance.sina.com.cn/mkt/#qbgg_hk

描述: 获取所有港股的实时行情数据 15 分钟延时

限量: 单次返回当前时间戳的所有港股的数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述 |
|------|---------|----|
| 日期时间 | object  | -  |
| 代码   | object  | -  |
| 中文名称 | object  | -  |
| 英文名称 | object  | -  |
| 交易类型 | object  | -  |
| 最新价  | float64 | -  |
| 涨跌额  | float64 | -  |
| 涨跌幅  | float64 | -  |
| 昨收   | float64 | -  |
| 今开   | float64 | -  |
| 最高   | float64 | -  |
| 最低   | float64 | -  |
| 成交量  | float64 | -  |
| 成交额  | float64 | -  |
| 买一   | float64 | -  |
| 卖一   | float64 | -  |

### stock_individual_basic_info_hk_xq
- **文档定位**：港股 / 个股信息查询-雪球
- **HTTP**：`GET /api/public/stock_individual_basic_info_hk_xq`
- **调用**：运行 `scripts/aktools_get.py stock_individual_basic_info_hk_xq --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://xueqiu.com/S/00700

描述: 雪球-个股-公司概况-公司简介

限量: 单次返回指定 symbol 的个股信息

输入参数

| 名称      | 类型    | 描述                      |
|---------|-------|-------------------------|
| symbol  | str   | symbol="02097"; 股票代码    |
| token   | str   | token=None; 雪球 xq_a_token |
| timeout | float | timeout=None; 默认不设置超时参数 |

输出参数

| 名称    | 类型     | 描述  |
|-------|--------|-----|
| item  | object | -   |
| value | object | -   |

### stock_hk_hist_min_em
- **文档定位**：港股 / 分时数据-东财
- **HTTP**：`GET /api/public/stock_hk_hist_min_em`
- **调用**：运行 `scripts/aktools_get.py stock_hk_hist_min_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://quote.eastmoney.com/hk/00948.html

描述: 东方财富网-行情首页-港股-每日分时行情

限量: 单次返回指定上市公司最近 5 个交易日分钟数据, 注意港股有延时

输入参数

| 名称         | 类型  | 描述                                                                                                  |
|------------|-----|-----------------------------------------------------------------------------------------------------|
| symbol     | str | symbol="01611"; 港股代码可以通过 **ak.stock_hk_spot_em()** 函数返回所有的 pandas.DataFrame 里面的 `代码` 字段获取           |
| period     | str | period='5'; choice of {'1', '5', '15', '30', '60'}; 其中 1 分钟数据返回近 5 个交易日数据且不复权                       |
| adjust     | str | adjust=''; choice of {'', 'qfq', 'hfq'}; '': 不复权, 'qfq': 前复权, 'hfq': 后复权, 其中 1 分钟数据返回近 5 个交易日数据且不复权 |
| start_date | str | start_date="1979-09-01 09:32:00"; 日期时间; 默认返回所有数据                                                    |
| end_date   | str | end_date="2222-01-01 09:32:00"; 日期时间; 默认返回所有数据                                                      |

输出参数-1分钟数据

| 名称  | 类型      | 描述       |
|-----|---------|----------|
| 时间  | object  | -        |
| 开盘  | float64 | 注意单位: 港元 |
| 收盘  | float64 | 注意单位: 港元 |
| 最高  | float64 | 注意单位: 港元 |
| 最低  | float64 | 注意单位: 港元 |
| 成交量 | float64 | 注意单位: 股  |
| 成交额 | float64 | 注意单位: 港元 |
| 最新价 | float64 | 注意单位: 港元 |

接口示例-1分钟数据

```python
import akshare as ak

stock_hk_hist_min_em_df = ak.stock_hk_hist_min_em(symbol="01611", period='1', adjust='',
                                                  start_date="2021-09-01 09:32:00",
                                                  end_date="2021-09-07 18:32:00")  # 其中的 start_date 和 end_date 需要设定为近期
print(stock_hk_hist_min_em_df)
```

### stock_hk_hist
- **文档定位**：港股 / 历史行情数据-东财
- **HTTP**：`GET /api/public/stock_hk_hist`
- **调用**：运行 `scripts/aktools_get.py stock_hk_hist --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/hk/08367.html

描述: 港股-历史行情数据, 可以选择返回复权后数据, 更新频率为日频

限量: 单次返回指定上市公司的历史行情数据

输入参数

| 名称         | 类型  | 描述                                                             |
|------------|-----|----------------------------------------------------------------|
| symbol     | str | symbol="00593"; 港股代码,可以通过 **ak.stock_hk_spot_em()** 函数返回所有港股代码 |
| period     | str | period='daily'; choice of {'daily', 'weekly', 'monthly'}       |
| start_date | str | start_date="19700101"; 开始日期                                    |
| end_date   | str | end_date="22220101"; 结束日期                                      |
| adjust     | str | adjust="": 返回未复权的数据, 默认; qfq: 返回前复权数据; hfq: 返回后复权数据;           |

输出参数

| 名称  | 类型      | 描述       |
|-----|---------|----------|
| 日期  | object  | -        |
| 开盘  | float64 | 注意单位: 港元 |
| 收盘  | float64 | 注意单位: 港元 |
| 最高  | float64 | 注意单位: 港元 |
| 最低  | float64 | 注意单位: 港元 |
| 成交量 | int64   | 注意单位: 股  |
| 成交额 | float64 | 注意单位: 港元 |
| 振幅  | float64 | 注意单位: %  |
| 涨跌幅 | float64 | 注意单位: %  |
| 涨跌额 | float64 | 注意单位: 港元 |
| 换手率 | float64 | 注意单位: %  |

接口示例-未复权

```python
import akshare as ak

stock_hk_hist_df = ak.stock_hk_hist(symbol="00593", period="daily", start_date="19700101", end_date="22220101", adjust="")
print(stock_hk_hist_df)
```

### stock_hk_daily
- **文档定位**：港股 / 历史行情数据-新浪
- **HTTP**：`GET /api/public/stock_hk_daily`
- **调用**：运行 `scripts/aktools_get.py stock_hk_daily --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://stock.finance.sina.com.cn/hkstock/quotes/01336.html(个例)

描述:港股-历史行情数据, 可以选择返回复权后数据,更新频率为日频

限量: 单次返回指定上市公司的历史行情数据(包括前后复权因子), 提供新浪财经拥有的该股票的所有数据(
并不等于该股票从上市至今的数据)

输入参数

| 名称     | 类型  | 描述                                                                                             |
|--------|-----|------------------------------------------------------------------------------------------------|
| symbol | str | 港股代码,可以通过 **ak.stock_hk_spot()** 函数返回所有港股代码                                                    |
| adjust | str | "": 返回未复权的数据 ; qfq: 返回前复权后的数据; hfq: 返回后复权后的数据; qfq-factor: 返回前复权因子和调整; hfq-factor: 返回后复权因子和调整; |

输出参数-历史行情数据(后复权)

| 名称     | 类型      | 描述  |
|--------|---------|-----|
| date   | object  | 日期  |
| open   | float64 | 开盘价 |
| high   | float64 | 最高价 |
| low    | float64 | 最低价 |
| close  | float64 | 收盘价 |
| volume | float64 | 成交量 |

接口示例-历史行情数据(后复权)

```python
import akshare as ak

stock_hk_daily_hfq_df = ak.stock_hk_daily(symbol="00700", adjust="hfq")
print(stock_hk_daily_hfq_df)
```

### stock_hk_famous_spot_em
- **文档定位**：港股 / 知名港股
- **HTTP**：`GET /api/public/stock_hk_famous_spot_em`
- **调用**：运行 `scripts/aktools_get.py stock_hk_famous_spot_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/center/gridlist.html#hk_wellknown

描述: 东方财富网-行情中心-港股市场-知名港股实时行情数据

限量: 单次返回全部行情数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称  | 类型      | 描述       |
|-----|---------|----------|
| 序号  | int64   | -        |
| 代码  | object  | -        |
| 名称  | object  | -        |
| 最新价 | float64 | 注意单位: 港元 |
| 涨跌额 | float64 | 注意单位: 港元 |
| 涨跌幅 | float64 | 注意单位: %  |
| 今开  | float64 | 注意单位: 港元 |
| 最高  | float64 | 注意单位: 港元 |
| 最低  | float64 | 注意单位: 港元 |
| 昨收  | float64 | 注意单位: 港元 |
| 成交量 | float64 | 注意单位: 股  |
| 成交额 | float64 | 注意单位: 港元 |

### stock_hk_security_profile_em
- **文档定位**：港股 / 证券资料
- **HTTP**：`GET /api/public/stock_hk_security_profile_em`
- **调用**：运行 `scripts/aktools_get.py stock_hk_security_profile_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://emweb.securities.eastmoney.com/PC_HKF10/pages/home/index.html?code=03900&type=web&color=w#/CompanyProfile

描述: 东方财富-港股-证券资料

限量: 单次返回全部数据

输入参数

| 名称     | 类型  | 描述             |
|--------|-----|----------------|
| symbol | str | symbol="03900" |

输出参数

| 名称             | 类型      | 描述 |
|----------------|---------|----|
| 证券代码           | object  | -  |
| 证券简称           | object  | -  |
| 上市日期           | object  | -  |
| 证券类型           | object  | -  |
| 发行价            | float64 | -  |
| 发行量(股)         | int64   | -  |
| 每手股数           | int64   | -  |
| 每股面值           | object  | -  |
| 交易所            | object  | -  |
| 板块             | object  | -  |
| 年结日            | object  | -  |
| ISIN（国际证券识别编码） | object  | -  |
| 是否沪港通标的        | object  | -  |

### stock_hk_company_profile_em
- **文档定位**：港股 / 公司资料
- **HTTP**：`GET /api/public/stock_hk_company_profile_em`
- **调用**：运行 `scripts/aktools_get.py stock_hk_company_profile_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://emweb.securities.eastmoney.com/PC_HKF10/pages/home/index.html?code=03900&type=web&color=w#/CompanyProfile

描述: 东方财富-港股-公司资料

限量: 单次返回全部数据

输入参数

| 名称     | 类型  | 描述             |
|--------|-----|----------------|
| symbol | str | symbol="03900" |

输出参数

| 名称     | 类型     | 描述 |
|--------|--------|----|
| 公司名称   | object | -  |
| 英文名称   | object | -  |
| 注册地    | object | -  |
| 公司成立日期 | object | -  |
| 所属行业   | object | -  |
| 董事长    | object | -  |
| 公司秘书   | object | -  |
| 员工人数   | int64  | -  |
| 办公地址   | object | -  |
| 公司网址   | object | -  |
| E-MAIL | object | -  |
| 年结日    | object | -  |
| 联系电话   | object | -  |
| 核数师    | object | -  |
| 传真     | object | -  |
| 公司介绍   | object | -  |

### stock_hk_financial_indicator_em
- **文档定位**：港股 / 财务指标
- **HTTP**：`GET /api/public/stock_hk_financial_indicator_em`
- **调用**：运行 `scripts/aktools_get.py stock_hk_financial_indicator_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://emweb.securities.eastmoney.com/PC_HKF10/pages/home/index.html?code=03900&type=web&color=w#/CoreReading

描述: 东方财富-港股-核心必读-最新指标

限量: 单次返回全部数据

输入参数

| 名称     | 类型  | 描述             |
|--------|-----|----------------|
| symbol | str | symbol="03900" |

输出参数

| 名称             | 类型     | 描述 |
|----------------|--------|----|
| 基本每股收益(元)      | object | -  |
| 每股净资产(元)       | object | -  |
| 法定股本(股)        | object | -  |
| 每手股            | object | -  |
| 每股股息TTM(港元)    | object | -  |
| 派息比率(%)        | object | -  |
| 已发行股本(股)       | object | -  |
| 已发行股本-H股(股)    | int64  | -  |
| 每股经营现金流(元)     | object | -  |
| 股息率TTM(%)      | object | -  |
| 总市值(港元)        | object | -  |
| 港股市值(港元)       | object | -  |
| 营业总收入          | object | -  |
| 营业总收入滚动环比增长(%) | object | -  |
| 销售净利率(%)       | object | -  |
| 净利润            | object | -  |
| 净利润滚动环比增长(%)   | object | -  |
| 股东权益回报率(%)     | object | -  |
| 市盈率            | object | -  |
| 市净率            | object | -  |
| 总资产回报率(%)      | object | -  |

### stock_hk_dividend_payout_em
- **文档定位**：港股 / 分红派息
- **HTTP**：`GET /api/public/stock_hk_dividend_payout_em`
- **调用**：运行 `scripts/aktools_get.py stock_hk_dividend_payout_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://emweb.securities.eastmoney.com/PC_HKF10/pages/home/index.html?code=03900&type=web&color=w#/CoreReading

描述: 东方财富-港股-核心必读-分红派息

限量: 单次返回全部数据

输入参数

| 名称     | 类型  | 描述             |
|--------|-----|----------------|
| symbol | str | symbol="03900" |

输出参数

| 名称     | 类型     | 描述 |
|--------|--------|----|
| 最新公告日期 | object | -  |
| 财政年度   | object | -  |
| 分红方案   | object | -  |
| 分配类型   | object | -  |
| 除净日    | object | -  |
| 截至过户日  | object | -  |
| 发放日    | object | -  |

### stock_hk_growth_comparison_em
- **文档定位**：港股 / 行业对比 / 成长性对比
- **HTTP**：`GET /api/public/stock_hk_growth_comparison_em`
- **调用**：运行 `scripts/aktools_get.py stock_hk_growth_comparison_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://emweb.securities.eastmoney.com/PC_HKF10/pages/home/index.html?code=03900&type=web&color=w#/IndustryComparison

描述: 东方财富-港股-行业对比-成长性对比

限量: 单次返回全部数据

输入参数

| 名称     | 类型  | 描述             |
|--------|-----|----------------|
| symbol | str | symbol="03900" |

输出参数

| 名称                  | 类型      | 描述 |
|---------------------|---------|----|
| 代码                  | object  | -  |
| 简称                  | object  | -  |
| 基本每股收益同比增长率         | float64 | -  |
| 基本每股收益同比增长率排名       | int64   | -  |
| 营业收入同比增长率           | float64 | -  |
| 营业收入同比增长率排名         | int64   | -  |
| 营业利润率同比增长率          | float64 | -  |
| 营业利润率同比增长率排名        | int64   | -  |
| 基本每股收总资产同比增长率益同比增长率 | float64 | -  |
| 总资产同比增长率排名          | int64   | -  |

### stock_hk_valuation_comparison_em
- **文档定位**：港股 / 行业对比 / 估值对比
- **HTTP**：`GET /api/public/stock_hk_valuation_comparison_em`
- **调用**：运行 `scripts/aktools_get.py stock_hk_valuation_comparison_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://emweb.securities.eastmoney.com/PC_HKF10/pages/home/index.html?code=03900&type=web&color=w#/IndustryComparison

描述: 东方财富-港股-行业对比-估值对比

限量: 单次返回全部数据

输入参数

| 名称     | 类型  | 描述             |
|--------|-----|----------------|
| symbol | str | symbol="03900" |

输出参数

| 名称        | 类型      | 描述 |
|-----------|---------|----|
| 代码        | object  | -  |
| 简称        | object  | -  |
| 市盈率-TTM   | float64 | -  |
| 市盈率-TTM排名 | int64   | -  |
| 市盈率-LYR   | float64 | -  |
| 市盈率-LYR排名 | int64   | -  |
| 市净率-MRQ   | float64 | -  |
| 市净率-MRQ排名 | int64   | -  |
| 市净率-LYR   | float64 | -  |
| 市净率-LYR排名 | int64   | -  |
| 市销率-TTM   | float64 | -  |
| 市销率-TTM排名 | int64   | -  |
| 市销率-LYR   | float64 | -  |
| 市销率-LYR排名 | int64   | -  |
| 市现率-TTM   | float64 | -  |
| 市现率-TTM排名 | int64   | -  |
| 市现率-LYR   | float64 | -  |
| 市现率-LYR排名 | int64   | -  |

### stock_hk_scale_comparison_em
- **文档定位**：港股 / 行业对比 / 规模对比
- **HTTP**：`GET /api/public/stock_hk_scale_comparison_em`
- **调用**：运行 `scripts/aktools_get.py stock_hk_scale_comparison_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://emweb.securities.eastmoney.com/PC_HKF10/pages/home/index.html?code=03900&type=web&color=w#/IndustryComparison

描述: 东方财富-港股-行业对比-规模对比

限量: 单次返回全部数据

输入参数

| 名称     | 类型  | 描述             |
|--------|-----|----------------|
| symbol | str | symbol="03900" |

输出参数

| 名称      | 类型      | 描述 |
|---------|---------|----|
| 代码      | object  | -  |
| 简称      | object  | -  |
| 总市值     | float64 | -  |
| 总市值排名   | int64   | -  |
| 流通市值    | float64 | -  |
| 流通市值排名  | int64   | -  |
| 营业总收入   | int64   | -  |
| 营业总收入排名 | int64   | -  |
| 净利润     | int64   | -  |
| 净利润排名   | int64   | -  |
