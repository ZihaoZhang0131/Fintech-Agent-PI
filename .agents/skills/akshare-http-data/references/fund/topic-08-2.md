# 其他细分主题



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### fund_new_found_em
- **文档定位**：新发基金
- **HTTP**：`GET /api/public/fund_new_found_em`
- **调用**：运行 `scripts/aktools_get.py fund_new_found_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://fund.eastmoney.com/data/xinfound.html

描述: 天天基金网-基金数据-新发基金-新成立基金

限量: 单次返回所有新发基金数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述       |
|-------|---------|----------|
| 基金代码  | object  | -        |
| 基金简称  | object  | -        |
| 发行公司  | object  | -        |
| 基金类型  | object  | -        |
| 集中认购期 | object  | -        |
| 募集份额  | float64 | 注意单位: 亿份 |
| 成立日期  | object  | -        |
| 成立来涨幅 | float64 | 注意单位: %  |
| 基金经理  | object  | -        |
| 申购状态  | object  | -        |
| 优惠费率  | float64 | 注意单位: %  |

### fund_new_found_ths
- **文档定位**：新发基金
- **HTTP**：`GET /api/public/fund_new_found_ths`
- **调用**：运行 `scripts/aktools_get.py fund_new_found_ths --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://fund.10jqka.com.cn/datacenter/xfjj/

描述: 同花顺-基金数据-新发基金

限量: 单次返回所有新发基金数据

输入参数

| 名称     | 类型  | 描述                                                                                  |
|--------|-----|-------------------------------------------------------------------------------------|
| symbol | str | choice of {"全部", "发行中", "将发行"} "全部": 全部新发基金; "发行中": 发行中的基金; "将发行": 将发行的基金; 默认为 "全部" |

输出参数

| 名称    | 类型      | 描述       |
|-------|---------|----------|
| 基金代码  | object  | -        |
| 基金名称  | object  | -        |
| 投资类型  | object  | -        |
| 募集起始日 | object  | -        |
| 募集终止日 | object  | -        |
| 管理人   | object  | -        |
| 基金经理  | object  | -        |
| 认购费率  | float64 | 注意单位: %  |
| 最低认购  | float64 | -        |
| 基金类型  | object  | -        |
| 投资风格  | object  | -        |

### fund_portfolio_industry_allocation_em
- **文档定位**：行业配置
- **HTTP**：`GET /api/public/fund_portfolio_industry_allocation_em`
- **调用**：运行 `scripts/aktools_get.py fund_portfolio_industry_allocation_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://fundf10.eastmoney.com/hytz_000001.html

描述: 天天基金网-基金档案-投资组合-行业配置

限量: 单次返回指定 symbol 和 date 的所有持仓数据

输入参数

| 名称     | 类型  | 描述                                                       |
|--------|-----|----------------------------------------------------------|
| symbol | str | symbol="000001"; 基金代码, 可以通过调用 **ak.fund_name_em()** 接口获取 |
| date   | str | date="2023"; 指定年份                                        |

输出参数

| 名称    | 类型      | 描述       |
|-------|---------|----------|
| 序号    | int64   | -        |
| 行业类别  | object  | -        |
| 占净值比例 | float64 | 注意单位: %  |
| 市值    | float64 | 注意单位: 万元 |
| 截止时间  | object  | -        |

### fund_scale_change_em
- **文档定位**：规模份额 / 规模变动
- **HTTP**：`GET /api/public/fund_scale_change_em`
- **调用**：运行 `scripts/aktools_get.py fund_scale_change_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://fund.eastmoney.com/data/gmbdlist.html

描述: 天天基金网-基金数据-规模份额-规模变动

限量: 返回所有规模变动数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述       |
|-------|---------|----------|
| 序号    | int64   | -        |
| 截止日期  | object  | -        |
| 基金家数  | int64   | -        |
| 期间申购  | float64 | 注意单位: 亿份 |
| 期间赎回  | float64 | 注意单位: 亿份 |
| 期末总份额 | float64 | 注意单位: 亿份 |
| 期末净资产 | float64 | 注意单位: 亿份 |

### fund_hold_structure_em
- **文档定位**：规模份额 / 持有人结构
- **HTTP**：`GET /api/public/fund_hold_structure_em`
- **调用**：运行 `scripts/aktools_get.py fund_hold_structure_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://fund.eastmoney.com/data/cyrjglist.html

描述: 天天基金网-基金数据-规模份额-持有人结构

限量: 返回所有持有人结构数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述       |
|--------|---------|----------|
| 序号     | int64   | -        |
| 截止日期   | object  | -        |
| 基金家数   | int64   | -        |
| 机构持有比列 | float64 | 注意单位: %  |
| 个人持有比列 | float64 | 注意单位: %  |
| 内部持有比列 | float64 | 注意单位: %  |
| 总份额    | float64 | 注意单位: 亿份 |

### fund_portfolio_change_em
- **文档定位**：重大变动
- **HTTP**：`GET /api/public/fund_portfolio_change_em`
- **调用**：运行 `scripts/aktools_get.py fund_portfolio_change_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://fundf10.eastmoney.com/ccbd_000001.html

描述: 天天基金网-基金档案-投资组合-重大变动

限量: 单次返回指定 symbol、indicator 和 date 的所有重大变动数据

输入参数

| 名称        | 类型  | 描述                                                       |
|-----------|-----|----------------------------------------------------------|
| symbol    | str | symbol="003567"; 基金代码, 可以通过调用 **ak.fund_name_em()** 接口获取 |
| indicator | str | indicator="累计买入"; choice of {"累计买入", "累计卖出"}             |
| date      | str | date="2023"; 指定年份                                        |

输出参数

| 名称          | 类型      | 描述       |
|-------------|---------|----------|
| 序号          | int64   | -        |
| 股票代码        | object  | -        |
| 股票名称        | object  | -        |
| 本期累计买入金额    | float64 | 注意单位: 万元 |
| 占期初基金资产净值比例 | float64 | 注意单位: %  |
| 季度          | object  | -        |
