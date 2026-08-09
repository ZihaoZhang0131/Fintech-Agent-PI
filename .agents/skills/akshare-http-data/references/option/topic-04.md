# 其他细分主题



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### option_commodity_contract_sina
- **文档定位**：商品期权-新浪 / 当前合约
- **HTTP**：`GET /api/public/option_commodity_contract_sina`
- **调用**：运行 `scripts/aktools_get.py option_commodity_contract_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://stock.finance.sina.com.cn/futures/view/optionsDP.php

描述: 新浪财经-商品期权当前在交易的合约

限量: 单次返回指定 symbol 的所有合约数据

输入参数

| 名称     | 类型  | 描述            |
|--------|-----|---------------|
| symbol | str | symbol="玉米期权" |

输出参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| 序号  | str | -   |
| 合约  | str | -   |

### option_commodity_contract_table_sina
- **文档定位**：商品期权-新浪 / 当前合约
- **HTTP**：`GET /api/public/option_commodity_contract_table_sina`
- **调用**：运行 `scripts/aktools_get.py option_commodity_contract_table_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://stock.finance.sina.com.cn/futures/view/optionsDP.php

描述: 新浪财经-商品期权的 T 型报价表

限量: 单次返回指定 symbol 和 contract 的所有数据

输入参数

| 名称       | 类型  | 描述                                                               |
|----------|-----|------------------------------------------------------------------|
| symbol   | str | symbol="玉米期权"                                                    |
| contract | str | contract="au2204"; 可以通过 ak.option_commodity_contract_sina() 接口获取 |

输出参数

| 名称          | 类型      | 描述     |
|-------------|---------|--------|
| 看涨合约-买量     | int64   | -      |
| 看涨合约-买价     | float64 | -      |
| 看涨合约-最新价    | float64 | -      |
| 看涨合约-卖价     | float   | -      |
| 看涨合约-卖量     | int64   | -      |
| 看涨合约-持仓量    | int64   | -      |
| 看涨合约-涨跌     | float64 | -      |
| 行权价         | int64   | -      |
| 看涨合约-看涨期权合约 | object  | 看涨合约代码 |
| 看跌合约-买量     | int64   | -      |
| 看跌合约-买价     | float64 | -      |
| 看跌合约-最新价    | float64 | -      |
| 看跌合约-卖价     | float64 | -      |
| 看跌合约-卖量     | int64   | -      |
| 看跌合约-持仓量    | int64   | -      |
| 看跌合约-涨跌     | float64 | -      |
| 看跌合约-看跌期权合约 | object  | 看跌合约代码 |

### option_commodity_hist_sina
- **文档定位**：商品期权-新浪 / 历史行情
- **HTTP**：`GET /api/public/option_commodity_hist_sina`
- **调用**：运行 `scripts/aktools_get.py option_commodity_hist_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://stock.finance.sina.com.cn/futures/view/optionsDP.php

描述: 新浪财经-商品期权的历史行情数据-日频率

限量: 单次返回指定合约的历史行情数据

输入参数

| 名称     | 类型  | 描述                                                                           |
|--------|-----|------------------------------------------------------------------------------|
| symbol | str | symbol="au2012C328"; 可以通过 ak.option_commodity_contract_table_sina() 获取具体合约代码 |

输出参数

| 名称     | 类型      | 描述  |
|--------|---------|-----|
| date   | object  | -   |
| open   | float64 | -   |
| high   | float64 | -   |
| low    | float64 | -   |
| close  | float64 | -   |
| volume | int64   | -   |

### option_value_analysis_em
- **文档定位**：期权价值分析-金融期权
- **HTTP**：`GET /api/public/option_value_analysis_em`
- **调用**：运行 `scripts/aktools_get.py option_value_analysis_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/other/valueAnal.html

描述: 东方财富网-数据中心-特色数据-期权价值分析

限量: 单次返回所有数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称       | 类型      | 描述                                                        |
|----------|---------|-----------------------------------------------------------|
| 期权代码     | object  | -                                                         |
| 期权名称     | object  | -                                                         |
| 最新价      | float64 | -                                                         |
| 时间价值     | float64 | 注意: 指在期权剩余有效期内，合约标的价格变动有利于期权权利方的可能性。时间价值和内在价值共同构成期权的总价值。  |
| 内在价值     | float64 | 注意: 指假如期权立即履行时该期权的价值，只能为正数或者为零。内在价值与时间价值共同构成期权的总价值。       |
| 隐含波动率    | float64 | 注意: 指期权市场投资者在进行期权交易时对未来波动率的认识，且该认识已反映在期权的定价过程中。           |
| 理论价格     | float64 | 注意: 采用 Black-Scholes 期权定价模型，推导出的期权理论价格。                   |
| 标的名称     | object  | -                                                         |
| 标的最新价    | float64 | -                                                         |
| 标的近一年波动率 | float64 | 注意: 指一种衡量股票价格变化剧烈程度的指标，一般用百分数表示。股价波动率与认购期权、认沽期权价值均为正相关关系。 |
| 到期日      | object  | -                                                         |

### option_contract_info_ctp
- **文档定位**：期权合约信息
- **HTTP**：`GET /api/public/option_contract_info_ctp`
- **调用**：运行 `scripts/aktools_get.py option_contract_info_ctp --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://openctp.cn/instruments.html

描述: openctp 期权合约信息

限量: 单次返回所有数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称      | 类型      | 描述 |
|---------|---------|----|
| 交易所ID   | object  | -  |
| 合约ID    | object  | -  |
| 合约名称    | object  | -  |
| 商品类别    | object  | -  |
| 品种ID    | object  | -  |
| 合约乘数    | int64   | -  |
| 最小变动价位  | float64 | -  |
| 做多保证金率  | float64 | -  |
| 做空保证金率  | float64 | -  |
| 做多保证金/手 | float64 | -  |
| 做空保证金/手 | float64 | -  |
| 开仓手续费率  | float64 | -  |
| 开仓手续费/手 | float64 | -  |
| 平仓手续费率  | float64 | -  |
| 平仓手续费/手 | float64 | -  |
| 平今手续费率  | float64 | -  |
| 平今手续费/手 | float64 | -  |
| 交割年份    | int64   | -  |
| 交割月份    | int64   | -  |
| 上市日期    | object  | -  |
| 最后交易日   | object  | -  |
| 交割日     | object  | -  |
| 标的合约ID  | object  | -  |
| 标的合约乘数  | int64   | -  |
| 期权类型    | object  | -  |
| 行权价     | float64 | -  |
| 合约状态    | object  | -  |

### option_current_em
- **文档定位**：期权实时行情-东方财富
- **HTTP**：`GET /api/public/option_current_em`
- **调用**：运行 `scripts/aktools_get.py option_current_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/center/qqsc.html

描述: 东方财富网-行情中心-期权市场

限量: 单次返回全部合约的实时行情

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 代码   | object  | -       |
| 名称   | object  | -       |
| 最新价  | float64 | -       |
| 涨跌额  | float64 | -       |
| 涨跌幅  | float64 | 注意单位: % |
| 成交量  | float64 | -       |
| 成交额  | float64 | -       |
| 持仓量  | float64 | -       |
| 行权价  | float64 | -       |
| 剩余日  | float64 | -       |
| 日增   | float64 | -       |
| 昨结   | float64 | -       |
| 今开   | float64 | -       |
| 市场标识 | int64   | -       |

### option_premium_analysis_em
- **文档定位**：期权折溢价-金融期权
- **HTTP**：`GET /api/public/option_premium_analysis_em`
- **调用**：运行 `scripts/aktools_get.py option_premium_analysis_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/other/premium.html

描述: 东方财富网-数据中心-特色数据-期权折溢价

限量: 单次返回所有数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述                                                  |
|-------|---------|-----------------------------------------------------|
| 期权代码  | object  | -                                                   |
| 期权名称  | object  | -                                                   |
| 最新价   | float64 | -                                                   |
| 涨跌幅   | float64 | 注意单位: %;                                            |
| 行权价   | float64 | -                                                   |
| 折溢价率  | float64 | 注意: 折溢价反映的是投资者以现价买入某期权并持有至到期时，标的需要上升或下跌多少才能使这笔投资保本。 |
| 标的名称  | object  | -                                                   |
| 标的最新价 | float64 | -                                                   |
| 标的涨跌幅 | float64 | -                                                   |
| 盈亏平衡价 | float64 | 注意: 指期权投资者实现投资收益为零时标的证券的价格。                         |
| 到期日   | object  | -                                                   |

### option_risk_analysis_em
- **文档定位**：期权风险分析-金融期权
- **HTTP**：`GET /api/public/option_risk_analysis_em`
- **调用**：运行 `scripts/aktools_get.py option_risk_analysis_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/other/riskanal.html

描述: 东方财富网-数据中心-特色数据-期权风险分析

限量: 单次返回所有数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述                                                                                 |
|--------|---------|------------------------------------------------------------------------------------|
| 期权代码   | object  | -                                                                                  |
| 期权名称   | object  | -                                                                                  |
| 最新价    | float64 | -                                                                                  |
| 涨跌幅    | float64 | 注意单位: %;                                                                           |
| 杠杆比率   | float64 | 注意: 杠杆比率=标价价格÷期权价格，杠杆反映投资标的相对投资期权的成本比例。                                            |
| 实际杠杆比率 | float64 | 注意: 实际杠杆比率=对冲值×杠杆比率，透过实际杠杆比率，投资者可知道当标的涨跌1%时，期权的理论价格会变动多少个百分点。                      |
| Delta  | float64 | 注意: 指期权标的股票价格变化对期权价格的影响程度。Delta=期权价格变化/期权标的股票价格变化。股票价格与认购期权价值为正相关关系，与认沽期权价值为负相关关系。 |
| Gamma  | float64 | 注意: 指期权标的股票价格变化对Delta值的影响程度。Gamma=Delta的变化／期权标的股票价格变化。                             |
| Vega   | float64 | 注意: 指合约标的证券价格波动率变化对期权价值的影响程度。Vega=期权价值变化/波动率的变化。波动率与认购、认沽期权价值均为正相关关系。              |
| Rho    | float64 | 注意: 指无风险利率变化对期权价格的影响程度。Rho=期权价格的变化／无风险利率的变化。市场无风险利率与认购期权价值为正相关，与认沽期权为负相关。          |
| Theta  | float64 | 注意: 指到期时间变化对期权价值的影响程度。Theta=期权价值变化/到期时间变化。到期期限与认购、认沽期权价值均为正相关关系。                   |
| 到期日    | object  | -                                                                                  |

### option_lhb_em
- **文档定位**：期权龙虎榜-金融期权
- **HTTP**：`GET /api/public/option_lhb_em`
- **调用**：运行 `scripts/aktools_get.py option_lhb_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/other/qqlhb.html

描述: 东方财富网-数据中心-期货期权-期权龙虎榜单-金融期权

限量: 单次返回指定 symbol, indicator 和 trade_date 的所有数据

输入参数

| 名称         | 类型  | 描述                                                                                                  |
|------------|-----|-----------------------------------------------------------------------------------------------------|
| symbol     | str | symbol="510050"; choice of {"510050", "510300", "159919"}                                           |
| indicator  | str | indicator="期权交易情况-认沽交易量"; choice of {"期权交易情况-认沽交易量","期权持仓情况-认沽持仓量", "期权交易情况-认购交易量", "期权持仓情况-认购持仓量"} |
| trade_date | str | trade_date="20220121"                                                                               |

输出参数

| 名称      | 类型      | 描述                   |
|---------|---------|----------------------|
| 交易类型    | object  | -                    |
| 交易日期    | object  | -                    |
| 证券代码    | object  | -                    |
| 标的名称    | object  | -                    |
| 名次      | float64 | -                    |
| 机构      | object  | -                    |
| XX量     | float64 | 注意: 根据 indicator 而变化 |
| 增减      | float64 | -                    |
| 净XX量    | float64 | 注意: 根据 indicator 而变化 |
| 占总交易量比例 | float64 | -                    |
