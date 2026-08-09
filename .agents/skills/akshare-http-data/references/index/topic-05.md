# 申万宏源研究



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### index_realtime_fund_sw
- **文档定位**：申万宏源研究 / 基金指数实时行情
- **HTTP**：`GET /api/public/index_realtime_fund_sw`
- **调用**：运行 `scripts/aktools_get.py index_realtime_fund_sw --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.swsresearch.com/institute_sw/allIndex/releasedIndex

描述: 申万宏源研究-申万指数-指数发布-基金指数-实时行情

限量: 该接口返回指定 symbol 的数据

输入参数

| 名称     | 类型  | 描述                                                        |
|--------|-----|-----------------------------------------------------------|
| symbol | str | symbol="基础一级"; choice of {"基础一级", "基础二级", "基础三级", "特色指数"} |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 指数代码 | object  | -       |
| 指数名称 | object  | -       |
| 昨收盘  | float64 | -       |
| 日涨跌幅 | float64 | 注意单位: % |
| 年涨跌幅 | float64 | 注意单位: % |

### index_hist_fund_sw
- **文档定位**：申万宏源研究 / 基金指数历史行情
- **HTTP**：`GET /api/public/index_hist_fund_sw`
- **调用**：运行 `scripts/aktools_get.py index_hist_fund_sw --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.swsresearch.com/institute_sw/allIndex/releasedIndex/fundDetail?code=807100

描述: 申万宏源研究-申万指数-指数发布-基金指数-历史行情

限量: 该接口返回指定 symbol 的数据

输入参数

| 名称     | 类型  | 描述                                               |
|--------|-----|--------------------------------------------------|
| symbol | str | symbol="807200"; 基金指数代码                          |
| period | str | period="day"; choice of {"day", "week", "month"} |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 日期   | object  | -       |
| 收盘指数 | float64 | -       |
| 开盘指数 | float64 | -       |
| 最高指数 | float64 | -       |
| 最低指数 | float64 | -       |
| 涨跌幅  | float64 | 注意单位: % |

### index_realtime_sw
- **文档定位**：申万宏源研究 / 申万指数实时行情
- **HTTP**：`GET /api/public/index_realtime_sw`
- **调用**：运行 `scripts/aktools_get.py index_realtime_sw --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.swsresearch.com/institute_sw/allIndex/releasedIndex

描述: 申万宏源研究-指数系列; 注意其中大类风格指数和金创指数的字段与其他分类不同

限量: 该接口返回指定 symbol 的数据; 源站无数据时返回空的 pandas.DataFrame

输入参数

| 名称     | 类型  | 描述                                                                          |
|--------|-----|-----------------------------------------------------------------------------|
| symbol | str | symbol="市场表征"; choice of {"市场表征", "一级行业", "二级行业", "风格指数", "大类风格指数", "金创指数"} |

说明:

- `symbol` 为 `"市场表征"`, `"一级行业"`, `"二级行业"`, `"风格指数"` 时, 返回字段为 `指数代码`, `指数名称`, `昨收盘`, `今开盘`, `最新价`, `成交额`, `成交量`, `最高价`, `最低价`
- `symbol` 为 `"大类风格指数"` 或 `"金创指数"` 时, 返回字段为 `指数代码`, `指数名称`, `昨收盘`, `日涨跌幅`, `年涨跌幅`
- 当前若源站对某一分类暂无实时数据, 接口会返回结构化空表

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 指数代码 | object  | -       |
| 指数名称 | object  | -       |
| 昨收盘  | float64 | -       |
| 今开盘  | float64 | -       |
| 最新价  | float64 | -       |
| 成交额  | float64 | 注意: 百万元 |
| 成交量  | float64 | 注意: 百万股 |
| 最高价  | float64 | -       |
| 最低价  | float64 | -       |

### index_hist_sw
- **文档定位**：申万宏源研究 / 申万指数历史行情
- **HTTP**：`GET /api/public/index_hist_sw`
- **调用**：运行 `scripts/aktools_get.py index_hist_sw --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.swsresearch.com//institute_sw/allIndex/releasedIndex/releasedetail?code=801002&name=申万中小

描述: 申万宏源研究-指数发布-指数详情-指数历史数据

限量: 该接口返回指定 symbol 和 period 的数据

输入参数

| 名称     | 类型  | 描述                                               |
|--------|-----|--------------------------------------------------|
| symbol | str | symbol="801030"; 指数代码                            |
| period | str | period="day"; choice of {"day", "week", "month"} |

输出参数

| 名称  | 类型      | 描述  |
|-----|---------|-----|
| 代码  | object  | -   |
| 日期  | object  | -   |
| 收盘  | float64 | -   |
| 开盘  | float64 | -   |
| 最高  | float64 | -   |
| 最低  | float64 | -   |
| 成交量 | float64 | -   |
| 成交额 | float64 | -   |

### index_min_sw
- **文档定位**：申万宏源研究 / 申万指数分时行情
- **HTTP**：`GET /api/public/index_min_sw`
- **调用**：运行 `scripts/aktools_get.py index_min_sw --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.swsresearch.com//institute_sw/allIndex/releasedIndex/releasedetail?code=801001&name=申万中小

描述: 申万宏源研究-指数发布-指数详情-指数分时数据

限量: 该接口返回指定 symbol 的数据

输入参数

| 名称     | 类型  | 描述                                               |
|--------|-----|--------------------------------------------------|
| symbol | str | symbol="801030"; 指数代码                            |

输出参数

| 名称  | 类型      | 描述  |
|-----|---------|-----|
| 代码  | object  | -   |
| 名称  | object  | -   |
| 价格  | float64 | -   |
| 日期  | object  | -   |
| 时间  | object  | -   |

### index_component_sw
- **文档定位**：申万宏源研究 / 申万指数成分股
- **HTTP**：`GET /api/public/index_component_sw`
- **调用**：运行 `scripts/aktools_get.py index_component_sw --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.swsresearch.com//institute_sw/allIndex/releasedIndex/releasedetail?code=801001&name=申万中小

描述: 申万宏源研究-指数发布-指数详情-成分股

限量: 该接口返回指定 symbol 的数据

输入参数

| 名称     | 类型  | 描述                                               |
|--------|-----|--------------------------------------------------|
| symbol | str | symbol="801001"; 指数代码                            |

输出参数

| 名称   | 类型      | 描述  |
|------|---------|-----|
| 序号   | int64   | -   |
| 证券代码 | object  | -   |
| 证券名称 | object  | -   |
| 最新权重 | float64 | -   |
| 计入日期 | object  | -   |

### index_analysis_daily_sw
- **文档定位**：申万宏源研究 / 申万指数分析-日报表
- **HTTP**：`GET /api/public/index_analysis_daily_sw`
- **调用**：运行 `scripts/aktools_get.py index_analysis_daily_sw --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.swsresearch.com//institute_sw/allIndex/analysisIndex

描述: 申万宏源研究-指数分析-日报表

限量: 该接口返回指定参数的数据

输入参数

| 名称         | 类型  | 描述                                                        |
|------------|-----|-----------------------------------------------------------|
| symbol     | str | symbol="市场表征"; choice of {"市场表征", "一级行业", "二级行业", "风格指数"} |
| start_date | str | start_date="20221103"                                     |
| end_date   | str | end_date="20221103"                                       |

输出参数

| 名称     | 类型      | 描述       |
|--------|---------|----------|
| 指数代码   | object  | -        |
| 指数名称   | object  | -        |
| 发布日期   | object  | -        |
| 收盘指数   | float64 | -        |
| 成交量    | float64 | 注意单位: 亿股 |
| 涨跌幅    | float64 | 注意单位: %  |
| 换手率    | float64 | 注意单位: %  |
| 市盈率    | float64 | 注意单位: 倍  |
| 市净率    | float64 | 注意单位: 倍  |
| 均价     | float64 | 注意单位: 元  |
| 成交额占比  | float64 | 注意单位: %  |
| 流通市值   | float64 | 注意单位: 亿元 |
| 平均流通市值 | float64 | 注意单位: 亿元 |
| 股息率    | float64 | 注意单位: %  |

### index_analysis_weekly_sw
- **文档定位**：申万宏源研究 / 申万指数分析-周报表
- **HTTP**：`GET /api/public/index_analysis_weekly_sw`
- **调用**：运行 `scripts/aktools_get.py index_analysis_weekly_sw --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.swsresearch.com//institute_sw/allIndex/analysisIndex

描述: 申万宏源研究-指数分析-周报表

限量: 该接口返回指定参数的数据

输入参数

| 名称     | 类型  | 描述                                                                            |
|--------|-----|-------------------------------------------------------------------------------|
| symbol | str | symbol="市场表征"; choice of {"市场表征", "一级行业", "二级行业", "风格指数"}                     |
| date   | str | start_date="20221104"; 通过调用 ak.index_analysis_week_month_sw(date="week") 接口获取 |

输出参数

| 名称     | 类型      | 描述       |
|--------|---------|----------|
| 指数代码   | object  | -        |
| 指数名称   | object  | -        |
| 发布日期   | object  | -        |
| 收盘指数   | float64 | -        |
| 成交量    | float64 | 注意单位: 亿股 |
| 涨跌幅    | float64 | 注意单位: %  |
| 换手率    | float64 | 注意单位: %  |
| 市盈率    | float64 | 注意单位: 倍  |
| 市净率    | float64 | 注意单位: 倍  |
| 均价     | float64 | 注意单位: 元  |
| 成交额占比  | float64 | 注意单位: %  |
| 流通市值   | float64 | 注意单位: 亿元 |
| 平均流通市值 | float64 | 注意单位: 亿元 |
| 股息率    | float64 | 注意单位: %  |

### index_analysis_monthly_sw
- **文档定位**：申万宏源研究 / 申万指数分析-月报表
- **HTTP**：`GET /api/public/index_analysis_monthly_sw`
- **调用**：运行 `scripts/aktools_get.py index_analysis_monthly_sw --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.swsresearch.com/institute_sw/allIndex/analysisIndex

描述: 申万宏源研究-指数分析-月报表

限量: 该接口返回指定参数的数据

输入参数

| 名称     | 类型  | 描述                                                                             |
|--------|-----|--------------------------------------------------------------------------------|
| symbol | str | symbol="市场表征"; choice of {"市场表征", "一级行业", "二级行业", "风格指数"}                      |
| date   | str | start_date="20221031"; 通过调用 ak.index_analysis_week_month_sw(date="month") 接口获取 |

输出参数

| 名称     | 类型      | 描述       |
|--------|---------|----------|
| 指数代码   | object  | -        |
| 指数名称   | object  | -        |
| 发布日期   | object  | -        |
| 收盘指数   | float64 | -        |
| 成交量    | float64 | 注意单位: 亿股 |
| 涨跌幅    | float64 | 注意单位: %  |
| 换手率    | float64 | 注意单位: %  |
| 市盈率    | float64 | 注意单位: 倍  |
| 市净率    | float64 | 注意单位: 倍  |
| 均价     | float64 | 注意单位: 元  |
| 成交额占比  | float64 | 注意单位: %  |
| 流通市值   | float64 | 注意单位: 亿元 |
| 平均流通市值 | float64 | 注意单位: 亿元 |
| 股息率    | float64 | 注意单位: %  |
