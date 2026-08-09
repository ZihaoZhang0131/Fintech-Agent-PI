# 基本面数据



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### stock_lhb_yybph_em
- **文档定位**：基本面数据 / 营业部详情数据-东财 / 营业部排行
- **HTTP**：`GET /api/public/stock_lhb_yybph_em`
- **调用**：运行 `scripts/aktools_get.py stock_lhb_yybph_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/stock/yybph.html

描述: 东方财富网-数据中心-龙虎榜单-营业部排行

限量: 单次返回所有历史数据

输入参数

| 名称     | 类型  | 描述                                                   |
|--------|-----|------------------------------------------------------|
| symbol | str | symbol="近一月"; choice of {"近一月", "近三月", "近六月", "近一年"} |

输出参数

| 名称          | 类型      | 描述      |
|-------------|---------|---------|
| 序号          | int64   | -       |
| 营业部名称       | object  | -       |
| 上榜后1天-买入次数  | int64   | -       |
| 上榜后1天-平均涨幅  | float64 | 注意单位: % |
| 上榜后1天-上涨概率  | float64 | 注意单位: % |
| 上榜后2天-买入次数  | int64   | -       |
| 上榜后2天-平均涨幅  | float64 | 注意单位: % |
| 上榜后2天-上涨概率  | float64 | 注意单位: % |
| 上榜后3天-买入次数  | int64   | -       |
| 上榜后3天-平均涨幅  | float64 | 注意单位: % |
| 上榜后3天-上涨概率  | float64 | 注意单位: % |
| 上榜后4天-买入次数  | int64   | -       |
| 上榜后4天-平均涨幅  | float64 | 注意单位: % |
| 上榜后4天-上涨概率  | float64 | 注意单位: % |
| 上榜后10天-买入次数 | int64   | -       |
| 上榜后10天-平均涨幅 | float64 | 注意单位: % |
| 上榜后10天-上涨概率 | float64 | 注意单位: % |

### stock_lhb_traderstatistic_em
- **文档定位**：基本面数据 / 营业部详情数据-东财 / 营业部统计
- **HTTP**：`GET /api/public/stock_lhb_traderstatistic_em`
- **调用**：运行 `scripts/aktools_get.py stock_lhb_traderstatistic_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/stock/traderstatistic.html

描述: 东方财富网-数据中心-龙虎榜单-营业部统计

限量: 单次返回所有历史数据

输入参数

| 名称     | 类型  | 描述                                                   |
|--------|-----|------------------------------------------------------|
| symbol | str | symbol="近一月"; choice of {"近一月", "近三月", "近六月", "近一年"} |

输出参数

| 名称      | 类型      | 描述      |
|---------|---------|---------|
| 序号      | int64   | -       |
| 营业部名称   | object  | -       |
| 龙虎榜成交金额 | float64 | -       |
| 上榜次数    | int64   | -       |
| 买入额     | float64 | 注意单位: 元 |
| 买入次数    | int64   | -       |
| 卖出额     | float64 | 注意单位: 元 |
| 卖出次数    | int64   | -       |

### stock_lhb_stock_detail_em
- **文档定位**：基本面数据 / 营业部详情数据-东财 / 个股龙虎榜详情
- **HTTP**：`GET /api/public/stock_lhb_stock_detail_em`
- **调用**：运行 `scripts/aktools_get.py stock_lhb_stock_detail_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/stock/lhb/600077.html

描述: 东方财富网-数据中心-龙虎榜单-个股龙虎榜详情

限量: 单次返回所有历史数据

输入参数

| 名称     | 类型  | 描述                                                                                            |
|--------|-----|-----------------------------------------------------------------------------------------------|
| symbol | str | symbol="600077";                                                                              |
| date   | str | date="20220310"; 需要通过 ak.stock_lhb_stock_detail_date_em(symbol="600077") 接口获取相应股票的有龙虎榜详情数据的日期 |
| flag   | str | flag="卖出";  choice of {"买入", "卖出"}                                                            |

输出参数

| 名称          | 类型      | 描述               |
|-------------|---------|------------------|
| 序号          | int64   | -                |
| 交易营业部名称     | object  | -                |
| 买入金额        | float64 | -                |
| 买入金额-占总成交比例 | float64 | -                |
| 卖出金额-占总成交比例 | float64 | -                |
| 净额          | float64 | -                |
| 类型          | object  | 该字段主要处理多种龙虎榜标准问题 |

### stock_lh_yyb_most
- **文档定位**：基本面数据 / 营业部详情数据-东财 / 龙虎榜-营业部排行 / 龙虎榜-营业部排行-上榜次数最多
- **HTTP**：`GET /api/public/stock_lh_yyb_most`
- **调用**：运行 `scripts/aktools_get.py stock_lh_yyb_most --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.10jqka.com.cn/market/longhu/

描述: 龙虎榜-营业部排行-上榜次数最多

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称        | 类型     | 描述  |
|-----------|--------|-----|
| 序号        | int64  | -   |
| 营业部名称     | object | -   |
| 上榜次数      | int64  | -   |
| 合计动用资金    | object | -   |
| 年内上榜次数    | int64  | -   |
| 年内买入股票只数  | int64  | -   |
| 年内3日跟买成功率 | object | -   |

### stock_lh_yyb_capital
- **文档定位**：基本面数据 / 营业部详情数据-东财 / 龙虎榜-营业部排行 / 龙虎榜-营业部排行-资金实力最强
- **HTTP**：`GET /api/public/stock_lh_yyb_capital`
- **调用**：运行 `scripts/aktools_get.py stock_lh_yyb_capital --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.10jqka.com.cn/market/longhu/

描述: 龙虎榜-营业部排行-资金实力最强

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称       | 类型     | 描述  |
|----------|--------|-----|
| 序号       | int64  | -   |
| 营业部名称    | object | -   |
| 今日最高操作   | int64  | -   |
| 今日最高金额   | object | -   |
| 今日最高买入金额 | object | -   |
| 累计参与金额   | object | -   |
| 累计买入金额   | object | -   |

### stock_lh_yyb_control
- **文档定位**：基本面数据 / 营业部详情数据-东财 / 龙虎榜-营业部排行 / 龙虎榜-营业部排行-抱团操作实力
- **HTTP**：`GET /api/public/stock_lh_yyb_control`
- **调用**：运行 `scripts/aktools_get.py stock_lh_yyb_control --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.10jqka.com.cn/market/longhu/

描述: 龙虎榜-营业部排行-抱团操作实力

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称        | 类型     | 描述  |
|-----------|--------|-----|
| 序号        | int64  | -   |
| 营业部名称     | object | -   |
| 携手营业部家数   | int64  | -   |
| 年内最佳携手对象  | object | -   |
| 年内最佳携手股票数 | int64  | -   |
| 年内最佳携手成功率 | object | -   |

### stock_lhb_detail_daily_sina
- **文档定位**：基本面数据 / 营业部详情数据-东财 / 龙虎榜-每日详情
- **HTTP**：`GET /api/public/stock_lhb_detail_daily_sina`
- **调用**：运行 `scripts/aktools_get.py stock_lhb_detail_daily_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://vip.stock.finance.sina.com.cn/q/go.php/vInvestConsult/kind/lhb/index.phtml

描述: 新浪财经-龙虎榜-每日详情

限量: 单次返回指定 date 的所有数据

输入参数

| 名称   | 类型  | 描述                   |
|------|-----|----------------------|
| date | str | date="20240222"; 交易日 |

输出参数

| 名称   | 类型      | 描述       |
|------|---------|----------|
| 序号   | int64   | -        |
| 股票代码 | object  | -        |
| 股票名称 | object  | -        |
| 收盘价  | float64 | 注意单位: 元  |
| 对应值  | float64 | 注意单位: %  |
| 成交量  | float64 | 注意单位: 万股 |
| 成交额  | float64 | 注意单位: 万元 |
| 指标   | object  | 注意单位: 万元 |

### stock_lhb_ggtj_sina
- **文档定位**：基本面数据 / 营业部详情数据-东财 / 龙虎榜-个股上榜统计
- **HTTP**：`GET /api/public/stock_lhb_ggtj_sina`
- **调用**：运行 `scripts/aktools_get.py stock_lhb_ggtj_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://vip.stock.finance.sina.com.cn/q/go.php/vLHBData/kind/ggtj/index.phtml

描述: 新浪财经-龙虎榜-个股上榜统计

限量: 单次返回指定 symbol 的所有历史数据

输入参数

| 名称     | 类型  | 描述                                                                                |
|--------|-----|-----------------------------------------------------------------------------------|
| symbol | str | symbol="5"; choice of {"5": 最近 5 天; "10": 最近 10 天; "30": 最近 30 天; "60": 最近 60 天;} |

输出参数

| 名称    | 类型      | 描述      |
|-------|---------|---------|
| 股票代码  | object  | -       |
| 股票名称  | object  | -       |
| 上榜次数  | int64   | -       |
| 累积购买额 | float64 | 注意单位: 万 |
| 累积卖出额 | float64 | 注意单位: 万 |
| 净额    | float64 | 注意单位: 万 |
| 买入席位数 | int64   | -       |
| 卖出席位数 | int64   | -       |

### stock_lhb_yytj_sina
- **文档定位**：基本面数据 / 营业部详情数据-东财 / 龙虎榜-营业上榜统计
- **HTTP**：`GET /api/public/stock_lhb_yytj_sina`
- **调用**：运行 `scripts/aktools_get.py stock_lhb_yytj_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://vip.stock.finance.sina.com.cn/q/go.php/vLHBData/kind/yytj/index.phtml

描述: 新浪财经-龙虎榜-营业上榜统计

限量: 单次返回指定 symbol 的所有历史数据

输入参数

| 名称     | 类型  | 描述                                                                                |
|--------|-----|-----------------------------------------------------------------------------------|
| symbol | str | symbol="5"; choice of {"5": 最近 5 天; "10": 最近 10 天; "30": 最近 30 天; "60": 最近 60 天;} |

输出参数

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| 营业部名称  | object  | -       |
| 上榜次数   | int64   | -       |
| 累积购买额  | float64 | 注意单位: 万 |
| 买入席位数  | int64   | -       |
| 累积卖出额  | float64 | 注意单位: 万 |
| 卖出席位数  | int64   | -       |
| 买入前三股票 | object  | -       |

### stock_lhb_jgzz_sina
- **文档定位**：基本面数据 / 营业部详情数据-东财 / 龙虎榜-机构席位追踪
- **HTTP**：`GET /api/public/stock_lhb_jgzz_sina`
- **调用**：运行 `scripts/aktools_get.py stock_lhb_jgzz_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://vip.stock.finance.sina.com.cn/q/go.php/vLHBData/kind/jgzz/index.phtml

描述: 新浪财经-龙虎榜-机构席位追踪

限量: 单次返回指定 symbol 的所有历史数据

输入参数

| 名称     | 类型  | 描述                                                                                |
|--------|-----|-----------------------------------------------------------------------------------|
| symbol | str | symbol="5"; choice of {"5": 最近 5 天; "10": 最近 10 天; "30": 最近 30 天; "60": 最近 60 天;} |

输出参数

| 名称    | 类型      | 描述      |
|-------|---------|---------|
| 股票代码  | object  | -       |
| 股票名称  | object  | -       |
| 累积买入额 | float64 | 注意单位: 万 |
| 买入次数  | float64 | -       |
| 累积卖出额 | float64 | 注意单位: 万 |
| 卖出次数  | float64 | -       |
| 净额    | float64 | 注意单位: 万 |

### stock_lhb_jgmx_sina
- **文档定位**：基本面数据 / 营业部详情数据-东财 / 龙虎榜-机构席位成交明细
- **HTTP**：`GET /api/public/stock_lhb_jgmx_sina`
- **调用**：运行 `scripts/aktools_get.py stock_lhb_jgmx_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://vip.stock.finance.sina.com.cn/q/go.php/vLHBData/kind/jgzz/index.phtml

描述: 新浪财经-龙虎榜-机构席位成交明细

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称      | 类型      | 描述      |
|---------|---------|---------|
| 股票代码    | object  | -       |
| 股票名称    | object  | -       |
| 交易日期    | object  | -       |
| 机构席位买入额 | float64 | 注意单位: 万 |
| 机构席位卖出额 | float64 | 注意单位: 万 |
| 类型      | object  | -       |

### stock_ipo_declare_em
- **文档定位**：基本面数据 / 首发申报信息
- **HTTP**：`GET /api/public/stock_ipo_declare_em`
- **调用**：运行 `scripts/aktools_get.py stock_ipo_declare_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/xg/xg/sbqy.html

描述: 东方财富网-数据中心-新股申购-首发申报信息-首发申报企业信息

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型     | 描述 |
|--------|--------|----|
| 序号     | int64  | -  |
| 企业名称   | object | -  |
| 最新状态   | object | -  |
| 注册地    | object | -  |
| 保荐机构   | object | -  |
| 律师事务所  | object | -  |
| 会计师事务所 | object | -  |
| 拟上市地点  | object | -  |
| 更新日期   | object | -  |
| 招股说明书  | object | -  |

### stock_register_all_em
- **文档定位**：基本面数据 / IPO审核信息 / 全部
- **HTTP**：`GET /api/public/stock_register_all_em`
- **调用**：运行 `scripts/aktools_get.py stock_register_all_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/xg/ipo/

描述: 东方财富网-数据中心-新股数据-IPO审核信息-全部

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型     | 描述 |
|--------|--------|----|
| 序号     | int64  | -  |
| 企业名称   | object | -  |
| 最新状态   | object | -  |
| 注册地    | object | -  |
| 行业     | object | -  |
| 保荐机构   | object | -  |
| 律师事务所  | object | -  |
| 会计师事务所 | object | -  |
| 更新日期   | object | -  |
| 受理日期   | object | -  |
| 拟上市地点  | object | -  |
| 招股说明书  | object | -  |

### stock_register_kcb
- **文档定位**：基本面数据 / IPO审核信息 / 科创板
- **HTTP**：`GET /api/public/stock_register_kcb`
- **调用**：运行 `scripts/aktools_get.py stock_register_kcb --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/xg/ipo/

描述: 东方财富网-数据中心-新股数据-IPO审核信息-科创板

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型     | 描述  |
|--------|--------|-----|
| 序号     | int64  | -   |
| 发行人全称  | object | -   |
| 审核状态   | object | -   |
| 注册地    | object | -   |
| 证监会行业  | object | -   |
| 保荐机构   | object | -   |
| 律师事务所  | object | -   |
| 会计师事务所 | object | -   |
| 更新日期   | object | -   |
| 受理日期   | object | -   |
| 拟上市地点  | object | -   |
| 招股说明书  | object | -   |

### stock_register_cyb
- **文档定位**：基本面数据 / IPO审核信息 / 科创板 / 创业板
- **HTTP**：`GET /api/public/stock_register_cyb`
- **调用**：运行 `scripts/aktools_get.py stock_register_cyb --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/xg/ipo/

描述: 东方财富网-数据中心-新股数据-IPO审核信息-创业板

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型     | 描述  |
|--------|--------|-----|
| 序号     | int32  | -   |
| 发行人全称  | object | -   |
| 审核状态   | object | -   |
| 注册地    | object | -   |
| 证监会行业  | object | -   |
| 保荐机构   | object | -   |
| 律师事务所  | object | -   |
| 会计师事务所 | object | -   |
| 更新日期   | object | -   |
| 受理日期   | object | -   |
| 拟上市地点  | object | -   |
| 招股说明书  | object | -   |

### stock_register_sh
- **文档定位**：基本面数据 / IPO审核信息 / 科创板 / 上海主板
- **HTTP**：`GET /api/public/stock_register_sh`
- **调用**：运行 `scripts/aktools_get.py stock_register_sh --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/xg/ipo/

描述: 东方财富网-数据中心-新股数据-IPO审核信息-上海主板

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型     | 描述  |
|--------|--------|-----|
| 序号     | int32  | -   |
| 发行人全称  | object | -   |
| 审核状态   | object | -   |
| 注册地    | object | -   |
| 证监会行业  | object | -   |
| 保荐机构   | object | -   |
| 律师事务所  | object | -   |
| 会计师事务所 | object | -   |
| 更新日期   | object | -   |
| 受理日期   | object | -   |
| 拟上市地点  | object | -   |
| 招股说明书  | object | -   |

### stock_register_sz
- **文档定位**：基本面数据 / IPO审核信息 / 科创板 / 深圳主板
- **HTTP**：`GET /api/public/stock_register_sz`
- **调用**：运行 `scripts/aktools_get.py stock_register_sz --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/xg/ipo/

描述: 东方财富网-数据中心-新股数据-IPO审核信息-深圳主板

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型     | 描述  |
|--------|--------|-----|
| 序号     | int32  | -   |
| 发行人全称  | object | -   |
| 审核状态   | object | -   |
| 注册地    | object | -   |
| 证监会行业  | object | -   |
| 保荐机构   | object | -   |
| 律师事务所  | object | -   |
| 会计师事务所 | object | -   |
| 更新日期   | object | -   |
| 受理日期   | object | -   |
| 拟上市地点  | object | -   |
| 招股说明书  | object | -   |

### stock_register_bj
- **文档定位**：基本面数据 / IPO审核信息 / 科创板 / 北交所
- **HTTP**：`GET /api/public/stock_register_bj`
- **调用**：运行 `scripts/aktools_get.py stock_register_bj --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/xg/ipo/

描述: 东方财富网-数据中心-新股数据-IPO审核信息-北交所

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型     | 描述  |
|--------|--------|-----|
| 序号     | int32  | -   |
| 发行人全称  | object | -   |
| 审核状态   | object | -   |
| 注册地    | object | -   |
| 证监会行业  | object | -   |
| 保荐机构   | object | -   |
| 律师事务所  | object | -   |
| 会计师事务所 | object | -   |
| 更新日期   | object | -   |
| 受理日期   | object | -   |
| 拟上市地点  | object | -   |
| 招股说明书  | object | -   |

### stock_register_db
- **文档定位**：基本面数据 / IPO审核信息 / 达标企业
- **HTTP**：`GET /api/public/stock_register_db`
- **调用**：运行 `scripts/aktools_get.py stock_register_db --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/xg/cyb/

描述: 东方财富网-数据中心-新股数据-注册制审核-达标企业

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称           | 类型      | 描述      |
|--------------|---------|---------|
| 序号           | int32   | -       |
| 企业名称         | object  | -       |
| 经营范围         | object  | -       |
| 近三年营业收入-2019 | float64 | 注意单位: 元 |
| 近三年净利润-2019  | float64 | 注意单位: 元 |
| 近三年研发费用-2019 | object  | 注意单位: 元 |
| 近三年营业收入-2018 | float64 | 注意单位: 元 |
| 近三年净利润-2018  | float64 | 注意单位: 元 |
| 近三年研发费用-2018 | object  | 注意单位: 元 |
| 近三年营业收入-2017 | object  | 注意单位: 元 |
| 近三年净利润-2017  | object  | 注意单位: 元 |
| 近三年研发费用-2017 | object  | 注意单位: 元 |
| 近两年累计净利润     | float64 | 注意单位: 元 |

### stock_qbzf_em
- **文档定位**：基本面数据 / 增发
- **HTTP**：`GET /api/public/stock_qbzf_em`
- **调用**：运行 `scripts/aktools_get.py stock_qbzf_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/other/gkzf.html

描述: 东方财富网-数据中心-新股数据-增发-全部增发

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| 股票代码   | object  | -       |
| 股票简称   | object  | -       |
| 增发代码   | object  | -       |
| 发行方式   | object  | -       |
| 发行总数   | int64   | 注意单位: 股 |
| 网上发行   | object  | 注意单位: 股 |
| 发行价格   | float64 | -       |
| 最新价    | float64 | -       |
| 发行日期   | object  | -       |
| 增发上市日期 | object  | -       |
| 锁定期    | object  | -       |

### stock_pg_em
- **文档定位**：基本面数据 / 配股
- **HTTP**：`GET /api/public/stock_pg_em`
- **调用**：运行 `scripts/aktools_get.py stock_pg_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/xg/pg/

描述: 东方财富网-数据中心-新股数据-配股

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| 股票代码   | object  | -       |
| 股票简称   | object  | -       |
| 配售代码   | object  | -       |
| 配股数量   | int64   | 注意单位: 股 |
| 配股比例   | object  | -       |
| 配股价    | float64 | -       |
| 最新价    | float64 | -       |
| 配股前总股本 | int64   | 注意单位: 股 |
| 配股后总股本 | int64   | 注意单位: 股 |
| 股权登记日  | object  | -       |
| 缴款起始日期 | object  | -       |
| 缴款截止日期 | object  | -       |
| 上市日    | object  | -       |

### stock_repurchase_em
- **文档定位**：基本面数据 / 股票回购数据
- **HTTP**：`GET /api/public/stock_repurchase_em`
- **调用**：运行 `scripts/aktools_get.py stock_repurchase_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/gphg/hglist.html

描述: 东方财富网-数据中心-股票回购-股票回购数据

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称             | 类型      | 描述      |
|----------------|---------|---------|
| 序号             | int64   | -       |
| 股票代码           | object  | -       |
| 股票简称           | object  | -       |
| 最新价            | float64 | -       |
| 计划回购价格区间       | float64 | 注意单位: 元 |
| 计划回购数量区间-下限    | float64 | 注意单位: 股 |
| 计划回购数量区间-上限    | float64 | 注意单位: 股 |
| 占公告前一日总股本比例-下限 | float64 | 注意单位: % |
| 占公告前一日总股本比例-上限 | float64 | 注意单位: % |
| 计划回购金额区间-下限    | float64 | 注意单位: 元 |
| 计划回购金额区间-上限    | float64 | 注意单位: 元 |
| 回购起始时间         | object  | -       |
| 实施进度           | object  | -       |
| 已回购股份价格区间-下限   | float64 | 注意单位: % |
| 已回购股份价格区间-上限   | float64 | 注意单位: % |
| 已回购股份数量        | float64 | 注意单位: 股 |
| 已回购金额          | float64 | 注意单位: 元 |
| 最新公告日期         | object  | -       |

### stock_zh_a_gbjg_em
- **文档定位**：基本面数据 / 股本结构
- **HTTP**：`GET /api/public/stock_zh_a_gbjg_em`
- **调用**：运行 `scripts/aktools_get.py stock_zh_a_gbjg_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://emweb.securities.eastmoney.com/pc_hsf10/pages/index.html#/gbjg

描述: 东方财富-A股数据-股本结构

限量: 单次返回所有历史数据

输入参数

| 名称     | 类型  | 描述                 |
|--------|-----|--------------------|
| symbol | str | symbol="603392.SH"; 也支持传入 "603392" 这类 6 位代码, 接口会自动补全市场后缀 |

输出参数

| 名称          | 类型      | 描述 |
|-------------|---------|----|
| 变更日期        | object  | -  |
| 总股本         | int64   | -  |
| 流通受限股份      | float64 | -  |
| 其他内资持股(受限)  | float64 | -  |
| 境内法人持股(受限)  | float64 | -  |
| 境内自然人持股(受限) | float64 | -  |
| 已流通股份       | float64 | -  |
| 已上市流通A股     | int64   | -  |
| 变动原因        | object  | -  |


说明: 接口会按东方财富返回的全部历史分页记录抓取完整股本结构数据, 不再只返回最近 20 条
