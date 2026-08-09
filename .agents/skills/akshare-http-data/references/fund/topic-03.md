# 基金净值



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### fund_open_fund_daily_em
- **文档定位**：基金净值 / 开放式基金-实时数据
- **HTTP**：`GET /api/public/fund_open_fund_daily_em`
- **调用**：运行 `scripts/aktools_get.py fund_open_fund_daily_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://fund.eastmoney.com/fund.html#os_0;isall_0;ft_;pt_1

描述: 东方财富网-天天基金网-基金数据, 此接口在每个交易日 **16:00-23:00** 更新当日的最新开放式基金净值数据

限量: 单次返回当前时刻所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称        | 类型    | 描述      |
|-----------|-------|---------|
| 基金代码      | str   | -       |
| 基金简称      | str   | -       |
| 单位净值      | float | 随时间变动   |
| 累计净值      | float | 随时间变动   |
| 前交易日-单位净值 | float | 随时间变动   |
| 前交易日-累计净值 | float | 随时间变动   |
| 日增长值      | float | -       |
| 日增长率      | float | -       |
| 申购状态      | str   | -       |
| 赎回状态      | str   | -       |
| 手续费       | str   | 注意单位: % |

### fund_open_fund_info_em
- **文档定位**：基金净值 / 开放式基金-历史数据
- **HTTP**：`GET /api/public/fund_open_fund_info_em`
- **调用**：运行 `scripts/aktools_get.py fund_open_fund_info_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://fund.eastmoney.com/pingzhongdata/710001.js

描述: 东方财富网-天天基金网-基金数据-具体基金信息

限量: 单次返回当前时刻所有历史数据, 在查询基金数据的时候注意基金前后端问题

输入参数

| 名称        | 类型  | 描述                                                                                             |
|-----------|-----|------------------------------------------------------------------------------------------------|
| symbol    | str | symbol="710001"; 需要基金代码, 可以通过调用 **ak.fund_open_fund_daily_em()** 获取                            |
| indicator | str | indicator="单位净值走势";  参见 **fund_open_fund_info_em** 参数一览表                                       |
| period    | str | period="成立来"; 该参数只对 `累计收益率走势` 有效, choice of {"1月", "3月", "6月", "1年", "3年", "5年", "今年来", "成立来"} |

fund_open_fund_info_em 参数一览表

| 参数名称    | 备注  |
|---------|-----|
| 单位净值走势  | -   |
| 累计净值走势  | -   |
| 累计收益率走势 | -   |
| 同类排名走势  | -   |
| 同类排名百分比 | -   |
| 分红送配详情  | -   |
| 拆分详情    | -   |

输出参数-单位净值走势

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 净值日期 | object  | -       |
| 单位净值 | float64 | -       |
| 日增长率 | float64 | 注意单位: % |

接口示例-单位净值走势

```python
import akshare as ak

fund_open_fund_info_em_df = ak.fund_open_fund_info_em(symbol="710001", indicator="单位净值走势")
print(fund_open_fund_info_em_df)
```

### fund_money_fund_daily_em
- **文档定位**：基金净值 / 货币型基金-实时数据
- **HTTP**：`GET /api/public/fund_money_fund_daily_em`
- **调用**：运行 `scripts/aktools_get.py fund_money_fund_daily_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://fund.eastmoney.com/HBJJ_pjsyl.html

描述: 东方财富网-天天基金网-基金数据-货币型基金收益, 此接口数据每个交易日 **16:00～23:00**

限量: 单次返回当前时刻所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称          | 类型    | 描述  |
|-------------|-------|-----|
| 基金代码        | str   | -   |
| 基金简称        | str   | -   |
| 当前交易日-万份收益  | float | -   |
| 当前交易日-7日年化% | float | -   |
| 当前交易日-单位净值  | float | -   |
| 前一交易日-万份收益  | float | -   |
| 前一交易日-7日年化% | float | -   |
| 前一交易日-单位净值  | float | -   |
| 日涨幅         | str   | -   |
| 成立日期        | str   | -   |
| 基金经理        | str   | -   |
| 手续费         | str   | -   |
| 可购全部        | str   | -   |

### fund_money_fund_info_em
- **文档定位**：基金净值 / 货币型基金-历史数据
- **HTTP**：`GET /api/public/fund_money_fund_info_em`
- **调用**：运行 `scripts/aktools_get.py fund_money_fund_info_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://fundf10.eastmoney.com/jjjz_000009.html

描述: 东方财富网-天天基金网-基金数据-货币型基金-历史净值

限量: 单次返回当前时刻所有历史数据

输入参数

| 名称     | 类型  | 描述                                                                   |
|--------|-----|----------------------------------------------------------------------|
| symbol | str | symbol="000009"; 需要基金代码, 可以通过调用 **ak.fund_money_fund_daily_em()** 获取 |

输出参数

| 名称      | 类型      | 描述 |
|---------|---------|----|
| 净值日期    | object  | -  |
| 每万份收益   | float64 | -  |
| 7日年化收益率 | float64 | -  |
| 申购状态    | object  | -  |
| 赎回状态    | object  | -  |

### fund_financial_fund_daily_em
- **文档定位**：基金净值 / 理财型基金-实时数据
- **HTTP**：`GET /api/public/fund_financial_fund_daily_em`
- **调用**：运行 `scripts/aktools_get.py fund_financial_fund_daily_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://fund.eastmoney.com/lcjj.html#1_1__0__ljjz,desc_1_os1

描述: 东方财富网-天天基金网-基金数据-理财型基金-实时数据, 此接口数据每个交易日 **16:00～23:00** 更新

限量: 该接口由于目标网站未更新数据，暂时不能返回数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称          | 类型    | 描述  |
|-------------|-------|-----|
| 序号          | int   | -   |
| 基金代码        | str   | -   |
| 基金简称        | str   | -   |
| 上一期年化收益率    | float | -   |
| 当前交易日-万份收益  | float | -   |
| 当前交易日-7日年华  | float | -   |
| 前一个交易日-万份收益 | float | -   |
| 前一个交易日-7日年华 | float | -   |
| 封闭期         | float | -   |
| 申购状态        | str   | -   |

### fund_financial_fund_info_em
- **文档定位**：基金净值 / 理财型基金-历史数据
- **HTTP**：`GET /api/public/fund_financial_fund_info_em`
- **调用**：运行 `scripts/aktools_get.py fund_financial_fund_info_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://fundf10.eastmoney.com/jjjz_000791.html

描述: 东方财富网站-天天基金网-基金数据-理财型基金收益-历史净值明细

限量: 单次返回当前时刻所有历史数据

输入参数

| 名称     | 类型  | 描述                                                                     |
|--------|-----|------------------------------------------------------------------------|
| symbol | str | symbol="000134"; 基金代码, 可以通过调用 **ak.fund_financial_fund_daily_em()** 获取 |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 净值日期 | object  | -       |
| 单位净值 | float64 | -       |
| 累计净值 | float64 | -       |
| 日增长率 | float64 | -       |
| 申购状态 | object  | -       |
| 赎回状态 | object  | -       |
| 分红送配 | object  | 注意单位: % |

### fund_graded_fund_daily_em
- **文档定位**：基金净值 / 分级基金-实时数据
- **HTTP**：`GET /api/public/fund_graded_fund_daily_em`
- **调用**：运行 `scripts/aktools_get.py fund_graded_fund_daily_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://fund.eastmoney.com/fjjj.html#1_1__0__zdf,desc_1

描述: 东方财富网-天天基金网-基金数据-分级基金-实时数据, 此接口数据每个交易日 **16:00～23:00**

限量: 单次返回当前时刻所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称        | 类型    | 描述      |
|-----------|-------|---------|
| 基金代码      | str   | -       |
| 基金简称      | str   | -       |
| 单位净值      | float | -       |
| 累计净值      | float | -       |
| 前交易日-单位净值 | float | -       |
| 前交易日-累计净值 | float | -       |
| 日增长值      | float | -       |
| 日增长率      | float | 注意单位: % |
| 市价        | str   | -       |
| 折价率       | str   | -       |
| 手续费       | str   | -       |

### fund_graded_fund_info_em
- **文档定位**：基金净值 / 分级基金-历史数据
- **HTTP**：`GET /api/public/fund_graded_fund_info_em`
- **调用**：运行 `scripts/aktools_get.py fund_graded_fund_info_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://fundf10.eastmoney.com/jjjz_004186.html

描述: 东方财富网站-天天基金网-基金数据-分级基金-历史数据

限量: 单次返回当前时刻所有历史数据

输入参数

| 名称     | 类型  | 描述                                                                    |
|--------|-----|-----------------------------------------------------------------------|
| symbol | str | symbol="150232"; 需要基金代码, 可以通过调用 **ak.fund_graded_fund_daily_em()** 获取 |

输出参数

| 名称   | 类型    | 描述                                                                       |
|------|-------|--------------------------------------------------------------------------|
| 净值日期 | str   | -                                                                        |
| 单位净值 | float | -                                                                        |
| 累计净值 | float | -                                                                        |
| 日增长率 | float | 注意单位: %; 日增长率为空原因如下: 1. 非交易日净值不参与日增长率计算(灰色数据行). 2. 上一交易日净值未披露, 日增长率无法计算. |
| 申购状态 | str   | -                                                                        |
| 赎回状态 | str   | -                                                                        |

### fund_etf_fund_daily_em
- **文档定位**：基金净值 / 场内交易基金-实时数据
- **HTTP**：`GET /api/public/fund_etf_fund_daily_em`
- **调用**：运行 `scripts/aktools_get.py fund_etf_fund_daily_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://fund.eastmoney.com/cnjy_dwjz.html

描述: 东方财富网站-天天基金网-基金数据-场内交易基金-实时数据, 此接口数据每个交易日 **16:00～23:00**

限量: 单次返回当前时刻所有数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称          | 类型      | 描述            |
|-------------|---------|---------------|
| 基金代码        | object  | -             |
| 基金简称        | object  | -             |
| 类型          | float64 | -             |
| 当前交易日-单位净值  | float64 | 会返回具体的日期值作为字段 |
| 当前交易日-累计净值  | float64 | 会返回具体的日期值作为字段 |
| 前一个交易日-单位净值 | float64 | 会返回具体的日期值作为字段 |
| 前一个交易日-累计净值 | float64 | 会返回具体的日期值作为字段 |
| 增长值         | float64 | -             |
| 增长率         | object  | -             |
| 市价          | object  | -             |
| 折价率         | object  | -             |

### fund_etf_fund_info_em
- **文档定位**：基金净值 / 场内交易基金-历史数据
- **HTTP**：`GET /api/public/fund_etf_fund_info_em`
- **调用**：运行 `scripts/aktools_get.py fund_etf_fund_info_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://fundf10.eastmoney.com/jjjz_004186.html

描述: 东方财富网站-天天基金网-基金数据-场内交易基金-历史净值数据

限量: 单次返回当前时刻所有历史数据

输入参数

| 名称         | 类型  | 描述                                                             |
|------------|-----|----------------------------------------------------------------|
| fund       | str | fund="511280"; 基金代码, 可以通过调用 **ak.fund_etf_fund_daily_em()** 获取 |
| start_date | str | start_date="20000101"; 开始时间                                    |
| end_date   | str | end_date="20500101"; 结束时间                                      |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 净值日期 | object  | -       |
| 单位净值 | float64 | -       |
| 累计净值 | float64 | -       |
| 日增长率 | float64 | 注意单位: % |
| 申购状态 | object  | -       |
| 赎回状态 | object  | -       |

### fund_hk_fund_hist_em
- **文档定位**：基金净值 / 香港基金-历史数据
- **HTTP**：`GET /api/public/fund_hk_fund_hist_em`
- **调用**：运行 `scripts/aktools_get.py fund_hk_fund_hist_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://overseas.1234567.com.cn/f10/FundJz/968092#FHPS

描述: 东方财富网站-天天基金网-基金数据-香港基金-历史净值明细

限量: 单次返回指定 code 和 symbol 所有历史数据

输入参数

| 名称     | 类型  | 描述                                                            |
|--------|-----|---------------------------------------------------------------|
| code   | str | code="1002200683"; 香港基金代码, 可以通过调用 **ak.fund_em_hk_rank()** 获取 |
| symbol | str | symbol="历史净值明细"; choice of {"历史净值明细", "分红送配详情"}               |

输出参数-历史净值明细

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 净值日期 | object  | -       |
| 单位净值 | float64 | -       |
| 日增长值 | float64 | -       |
| 日增长率 | float64 | 注意单位: % |
| 单位   | object  | -       |

接口示例-历史净值明细

```python
import akshare as ak

fund_hk_fund_hist_em_df = ak.fund_hk_fund_hist_em(code='1002200683', symbol="历史净值明细")
print(fund_hk_fund_hist_em_df)
```
