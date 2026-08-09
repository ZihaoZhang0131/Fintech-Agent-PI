# A+H股



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### stock_zh_ah_spot_em
- **文档定位**：A+H股 / 实时行情数据-东财
- **HTTP**：`GET /api/public/stock_zh_ah_spot_em`
- **调用**：运行 `scripts/aktools_get.py stock_zh_ah_spot_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/center/gridlist.html#ah_comparison

描述: 东方财富网-行情中心-沪深港通-AH股比价-实时行情, 延迟 15 分钟更新

限量: 单次返回所有 A+H 上市公司的实时行情数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称      | 类型      | 描述        |
|---------|---------|-----------|
| 序号      | int64   | -         |
| 名称      | object  | -         |
| H股代码    | object  | -         |
| 最新价-HKD | float64 | 注意单位: HKD |
| H股-涨跌幅  | float64 | 注意单位: %   |
| A股代码    | object  | -         |
| 最新价-RMB | float64 | 注意单位: RMB |
| A股-涨跌幅  | float64 | 注意单位: %   |
| 比价      | float64 | -         |
| 溢价      | float64 | 注意单位: %   |

### stock_zh_ah_spot
- **文档定位**：A+H股 / 实时行情数据-腾讯
- **HTTP**：`GET /api/public/stock_zh_ah_spot`
- **调用**：运行 `scripts/aktools_get.py stock_zh_ah_spot --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://stockapp.finance.qq.com/mstats/#mod=list&id=hk_ah&module=HK&type=AH

描述: A+H 股数据是从腾讯财经获取的数据, 延迟 15 分钟更新

限量: 单次返回所有 A+H 上市公司的实时行情数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 代码  | object  | -       |
| 名称  | object  | -       |
| 最新价 | float64 | -       |
| 涨跌幅 | float64 | 注意单位: % |
| 涨跌额 | float64 | -       |
| 买入  | float64 | -       |
| 卖出  | float64 | -       |
| 成交量 | float64 | -       |
| 成交额 | float64 | -       |
| 今开  | float64 | -       |
| 昨收  | float64 | -       |
| 最高  | float64 | -       |
| 最低  | float64 | -       |

### stock_zh_ah_daily
- **文档定位**：A+H股 / 历史行情数据
- **HTTP**：`GET /api/public/stock_zh_ah_daily`
- **调用**：运行 `scripts/aktools_get.py stock_zh_ah_daily --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://gu.qq.com/hk02359/gp

描述: 腾讯财经-A+H 股数据

限量: 单次返回指定参数的 A+H 上市公司的历史行情数据

输入参数

| 名称         | 类型  | 描述                                                          |
|------------|-----|-------------------------------------------------------------|
| symbol     | str | symbol="02318"; 港股股票代码, 可以通过 **ak.stock_zh_ah_name()** 函数获取 |
| start_year | str | start_year="2000"; 开始年份                                     |
| end_year   | str | end_year="2019"; 结束年份                                       |
| adjust     | str | adjust=""; 默认为空不复权; 'qfq': 前复权, 'hfq': 后复权                  |

输出参数

| 名称  | 类型      | 描述  |
|-----|---------|-----|
| 日期  | object  | -   |
| 开盘  | float64 | -   |
| 收盘  | float64 | -   |
| 最高  | float64 | -   |
| 最低  | float64 | -   |
| 成交量 | float64 | -   |

### stock_zh_ah_name
- **文档定位**：A+H股 / A+H股票字典
- **HTTP**：`GET /api/public/stock_zh_ah_name`
- **调用**：运行 `scripts/aktools_get.py stock_zh_ah_name --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://stockapp.finance.qq.com/mstats/#mod=list&id=hk_ah&module=HK&type=AH

描述: A+H 股数据是从腾讯财经获取的数据, 历史数据按日频率更新

限量: 单次返回所有 A+H 上市公司的代码和名称

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称  | 类型     | 描述  |
|-----|--------|-----|
| 代码  | object | -   |
| 名称  | object | -   |
