# 沪深可转债



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### bond_cb_profile_sina
- **文档定位**：沪深可转债 / 可转债-详情资料
- **HTTP**：`GET /api/public/bond_cb_profile_sina`
- **调用**：运行 `scripts/aktools_get.py bond_cb_profile_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://money.finance.sina.com.cn/bond/info/sz128039.html

描述: 新浪财经-债券-可转债-详情资料

限量: 单次返回指定 symbol 的可转债-详情资料数据

输入参数

| 名称     | 类型  | 描述                            |
|--------|-----|-------------------------------|
| symbol | str | symbol="sz128039"; 带市场标识的转债代码 |

输出参数

| 名称    | 类型     | 描述 |
|-------|--------|----|
| item  | object | -  |
| value | object | -  |

### bond_cb_summary_sina
- **文档定位**：沪深可转债 / 可转债-债券概况
- **HTTP**：`GET /api/public/bond_cb_summary_sina`
- **调用**：运行 `scripts/aktools_get.py bond_cb_summary_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://money.finance.sina.com.cn/bond/quotes/sh155255.html

描述: 新浪财经-债券-可转债-债券概况

限量: 单次返回指定 symbol 的可转债-债券概况数据

输入参数

| 名称     | 类型  | 描述                            |
|--------|-----|-------------------------------|
| symbol | str | symbol="sh155255"; 带市场标识的转债代码 |

输出参数

| 名称    | 类型     | 描述 |
|-------|--------|----|
| item  | object | -  |
| value | object | -  |

### bond_zh_hs_cov_spot
- **文档定位**：沪深可转债 / 实时行情数据
- **HTTP**：`GET /api/public/bond_zh_hs_cov_spot`
- **调用**：运行 `scripts/aktools_get.py bond_zh_hs_cov_spot --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://vip.stock.finance.sina.com.cn/mkt/#hskzz_z

描述: 新浪财经-沪深可转债数据

限量: 单次返回所有沪深可转债的实时行情数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称  | 类型  | 描述    |
|-----|-----|-------|
| -   | -   | 不逐一列出 |

### bond_zh_hs_cov_daily
- **文档定位**：沪深可转债 / 历史行情数据-日频
- **HTTP**：`GET /api/public/bond_zh_hs_cov_daily`
- **调用**：运行 `scripts/aktools_get.py bond_zh_hs_cov_daily --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://biz.finance.sina.com.cn/suggest/lookup_n.php?q=sh110048

描述: 新浪财经-历史行情数据，日频率更新, 新上的标的需要次日更新数据

限量: 单次返回具体某个沪深可转债的所有历史行情数据

输入参数

| 名称     | 类型  | 描述                |
|--------|-----|-------------------|
| symbol | str | symbol="sh113542" |

输出参数

| 名称     | 类型      | 描述  |
|--------|---------|-----|
| date   | object  | -   |
| open   | float64 | -   |
| high   | float64 | -   |
| low    | float64 | -   |
| close  | float64 | -   |
| volume | float64 | -   |

### bond_zh_hs_cov_min
- **文档定位**：沪深可转债 / 历史行情数据-分时
- **HTTP**：`GET /api/public/bond_zh_hs_cov_min`
- **调用**：运行 `scripts/aktools_get.py bond_zh_hs_cov_min --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/concept/sz128039.html

描述: 东方财富网-可转债-分时行情

限量: 单次返回指定可转债、指定频率、复权调整和时间区间的分时数据, 其中 1 分钟数据只返回近 1 个交易日数据且不复权; 其余 period 只能获取近期的数据

输入参数

| 名称         | 类型  | 描述                                                                                                  |
|------------|-----|-----------------------------------------------------------------------------------------------------|
| symbol     | str | symbol='sz123106'; 转债代码                                                                             |
| period     | str | period='5'; choice of {'1', '5', '15', '30', '60'}; 其中 1 分钟数据返回近 1 个交易日数据且不复权                       |
| adjust     | str | adjust=''; choice of {'', 'qfq', 'hfq'}; '': 不复权, 'qfq': 前复权, 'hfq': 后复权, 其中 1 分钟数据返回近 1 个交易日数据且不复权 |
| start_date | str | start_date="1979-09-01 09:32:00"; 日期时间; 默认返回所有数据                                                    |
| end_date   | str | end_date="2222-01-01 09:32:00"; 日期时间; 默认返回所有数据                                                      |

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
| 最新价 | float64 | -       |

接口示例-1分钟数据

```python
import akshare as ak

bond_zh_hs_cov_min_df = ak.bond_zh_hs_cov_min(symbol="sz123124", period='1', adjust='', start_date="1979-09-01 09:32:00", end_date="2222-01-01 09:32:00")
print(bond_zh_hs_cov_min_df)
```

### bond_zh_hs_cov_pre_min
- **文档定位**：沪深可转债 / 历史行情数据-盘前分时
- **HTTP**：`GET /api/public/bond_zh_hs_cov_pre_min`
- **调用**：运行 `scripts/aktools_get.py bond_zh_hs_cov_pre_min --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/concept/sz128039.html

描述: 东方财富网-可转债-分时行情-盘前分时

限量: 单次返回指定可转债在最近一个交易日的盘前分时数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

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

### bond_zh_cov
- **文档定位**：沪深可转债 / 可转债数据一览表
- **HTTP**：`GET /api/public/bond_zh_cov`
- **调用**：运行 `scripts/aktools_get.py bond_zh_cov --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/kzz/default.html

描述: 东方财富网-数据中心-新股数据-可转债数据一览表

限量: 单次返回当前交易时刻的所有可转债数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称          | 类型      | 描述       |
|-------------|---------|----------|
| 债券代码        | object  | -        |
| 债券简称        | object  | -        |
| 申购日期        | object  | -        |
| 申购代码        | object  | -        |
| 申购上限        | float64 | 注意单位: 万元 |
| 正股代码        | object  | -        |
| 正股简称        | object  | -        |
| 正股价         | float64 | -        |
| 转股价         | float64 | -        |
| 转股价值        | float64 | -        |
| 债现价         | float64 | -        |
| 转股溢价率       | float64 | 注意单位: %  |
| 原股东配售-股权登记日 | float64 | -        |
| 原股东配售-每股配售额 | object  | -        |
| 发行规模        | float64 | 注意单位: 亿元 |
| 中签号发布日      | object  | -        |
| 中签率         | float64 | 注意单位: %  |
| 上市时间        | object  | -        |
| 信用评级        | object  | -        |

### bond_zh_cov_info
- **文档定位**：沪深可转债 / 可转债详情
- **HTTP**：`GET /api/public/bond_zh_cov_info`
- **调用**：运行 `scripts/aktools_get.py bond_zh_cov_info --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/kzz/detail/123121.html

描述: 东方财富网-数据中心-新股数据-可转债详情

限量: 单次返回指定 symbol 的可转债详情数据

输入参数

| 名称        | 类型  | 描述                                                                                  |
|-----------|-----|-------------------------------------------------------------------------------------|
| symbol    | str | symbol="123121"; 可转债代码                                                              |
| indicator | str | indicator="基本信息"; choice of {"基本信息", "中签号", "筹资用途", "重要日期"}, 其中 "可转债重要条款" 在 "基本信息中" |

输出参数

| 名称   | 类型     | 描述        |
|------|--------|-----------|
| 债券代码 | object | 返回 67 个字段 |

### bond_zh_cov_info_ths
- **文档定位**：沪深可转债 / 可转债详情-同花顺
- **HTTP**：`GET /api/public/bond_zh_cov_info_ths`
- **调用**：运行 `scripts/aktools_get.py bond_zh_cov_info_ths --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.10jqka.com.cn/ipo/bond/

描述: 同花顺-数据中心-可转债

限量: 单次返回所有数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| 债券代码   | object  | -       |
| 债券简称   | object  | -       |
| 申购日期   | object  | -       |
| 申购代码   | object  | -       |
| 原股东配售码 | object  | -       |
| 每股获配额  | float64 | -       |
| 计划发行量  | float64 | -       |
| 实际发行量  | float64 | -       |
| 中签公布日  | object  | -       |
| 中签号    | object  | -       |
| 上市日期   | object  | -       |
| 正股代码   | object  | -       |
| 正股简称   | object  | -       |
| 转股价格   | float64 | -       |
| 到期时间   | object  | -       |
| 中签率    | object  | 注意单位: % |

### bond_cov_comparison
- **文档定位**：沪深可转债 / 可转债比价表
- **HTTP**：`GET /api/public/bond_cov_comparison`
- **调用**：运行 `scripts/aktools_get.py bond_cov_comparison --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/center/fullscreenlist.html#convertible_comparison

描述: 东方财富网-行情中心-债券市场-可转债比价表

限量: 单次返回当前交易时刻的所有可转债比价数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述      |
|-------|---------|---------|
| 序号    | int32   | -       |
| 转债代码  | object  | -       |
| 转债名称  | object  | -       |
| 转债最新价 | object  | -       |
| 转债涨跌幅 | object  | 注意单位: % |
| 正股代码  | object  | -       |
| 正股名称  | object  | -       |
| 正股最新价 | object  | -       |
| 正股涨跌幅 | object  | 注意单位: % |
| 转股价   | object  | -       |
| 转股价值  | object  | -       |
| 转股溢价率 | object  | 注意单位: % |
| 纯债溢价率 | object  | 注意单位: % |
| 回售触发价 | object  | -       |
| 强赎触发价 | object  | -       |
| 到期赎回价 | object  | -       |
| 纯债价值  | float64 | -       |
| 开始转股日 | object  | -       |
| 上市日期  | object  | -       |
| 申购日期  | object  | -       |

### bond_zh_cov_value_analysis
- **文档定位**：沪深可转债 / 可转债价值分析
- **HTTP**：`GET /api/public/bond_zh_cov_value_analysis`
- **调用**：运行 `scripts/aktools_get.py bond_zh_cov_value_analysis --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/kzz/detail/113527.html

描述: 东方财富网-行情中心-新股数据-可转债数据-可转债价值分析

限量: 单次返回所有可转债价值分析数据

输入参数

| 名称     | 类型  | 描述                     |
|--------|-----|------------------------|
| symbol | str | symbol="113527"; 可转债代码 |

输出参数

| 名称    | 类型      | 描述      |
|-------|---------|---------|
| 日期    | object  | -       |
| 收盘价   | float64 | 注意单位: 元 |
| 纯债价值  | float64 | 注意单位: 元 |
| 转股价值  | float64 | 注意单位: 元 |
| 纯债溢价率 | float64 | 注意单位: % |
| 转股溢价率 | float64 | 注意单位: % |

### bond_zh_cov_value_analysis
- **文档定位**：沪深可转债 / 可转债溢价率分析
- **HTTP**：`GET /api/public/bond_zh_cov_value_analysis`
- **调用**：运行 `scripts/aktools_get.py bond_zh_cov_value_analysis --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/kzz/detail/113527.html

描述: 东方财富网-行情中心-新股数据-可转债数据-可转债溢价率分析

限量: 单次返回所有可转债溢价率分析数据；此接口同 bond_zh_cov_value_analysis

输入参数

| 名称     | 类型  | 描述                     |
|--------|-----|------------------------|
| symbol | str | symbol="113527"; 可转债代码 |

输出参数

| 名称    | 类型      | 描述      |
|-------|---------|---------|
| 日期    | object  | -       |
| 收盘价   | float64 | 注意单位: 元 |
| 纯债价值  | float64 | 注意单位: 元 |
| 转股价值  | float64 | 注意单位: 元 |
| 纯债溢价率 | float64 | 注意单位: % |
| 转股溢价率 | float64 | 注意单位: % |
