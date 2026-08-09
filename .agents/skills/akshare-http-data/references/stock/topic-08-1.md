# 基本面数据



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### stock_gddh_em
- **文档定位**：基本面数据 / 股东大会
- **HTTP**：`GET /api/public/stock_gddh_em`
- **调用**：运行 `scripts/aktools_get.py stock_gddh_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/gddh/

描述: 东方财富网-数据中心-股东大会

限量: 单次返回所有数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称         | 类型     | 描述 |
|------------|--------|----|
| 代码         | object | -  |
| 简称         | object | -  |
| 股东大会名称     | object | -  |
| 召开开始日      | object | -  |
| 股权登记日      | object | -  |
| 现场登记日      | object | -  |
| 网络投票时间-开始日 | object | -  |
| 网络投票时间-结束日 | object | -  |
| 决议公告日      | object | -  |
| 公告日        | object | -  |
| 序列号        | object | -  |
| 提案         | object | -  |

### stock_zdhtmx_em
- **文档定位**：基本面数据 / 重大合同
- **HTTP**：`GET /api/public/stock_zdhtmx_em`
- **调用**：运行 `scripts/aktools_get.py stock_zdhtmx_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/zdht/mx.html

描述: 东方财富网-数据中心-重大合同-重大合同明细

限量: 单次返回指定 start_date 和 end_date 的所有数据

输入参数

| 名称         | 类型  | 描述                    |
|------------|-----|-----------------------|
| start_date | str | start_date="20200819" |
| end_date   | str | end_date="20230819"   |

输出参数

| 名称            | 类型      | 描述 |
|---------------|---------|----|
| 序号            | int64   | -  |
| 股票代码          | object  | -  |
| 股票简称          | object  | -  |
| 签署主体          | object  | -  |
| 签署主体-与上市公司关系  | object  | -  |
| 其他签署方         | object  | -  |
| 其他签署方-与上市公司关系 | object  | -  |
| 合同类型          | object  | -  |
| 合同名称          | object  | -  |
| 合同金额          | float64 | -  |
| 上年度营业收入       | float64 | -  |
| 占上年度营业收入比例    | float64 | -  |
| 最新财务报表的营业收入   | float64 | -  |
| 签署日期          | object  | -  |
| 公告日期          | object  | -  |

### stock_research_report_em
- **文档定位**：基本面数据 / 个股研报
- **HTTP**：`GET /api/public/stock_research_report_em`
- **调用**：运行 `scripts/aktools_get.py stock_research_report_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/report/stock.jshtml

描述: 东方财富网-数据中心-研究报告-个股研报

限量: 单次返回指定 symbol 的所有数据

输入参数

| 名称     | 类型  | 描述              |
|--------|-----|-----------------|
| symbol | str | symbol="000001" |

输出参数

| 名称            | 类型      | 描述 |
|---------------|---------|----|
| 序号            | int64   | -  |
| 股票代码          | object  | -  |
| 股票简称          | object  | -  |
| 报告名称          | object  | -  |
| 东财评级          | object  | -  |
| 机构            | object  | -  |
| 近一月个股研报数      | int64   | -  |
| 2024-盈利预测-收益  | float64 | -  |
| 2024-盈利预测-市盈率 | float64 | -  |
| 2025-盈利预测-收益  | float64 | -  |
| 2025-盈利预测-市盈率 | float64 | -  |
| 2026-盈利预测-收益  | float64 | -  |
| 2026-盈利预测-市盈率 | float64 | -  |
| 行业            | object  | -  |
| 日期            | object  | -  |
| 报告PDF链接       | object  | -  |

### stock_notice_report
- **文档定位**：基本面数据 / 沪深京 A 股公告
- **HTTP**：`GET /api/public/stock_notice_report`
- **调用**：运行 `scripts/aktools_get.py stock_notice_report --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/notices/hsa/5.html

描述: 东方财富网-数据中心-公告大全-沪深京 A 股公告

限量: 单次获取指定 symbol 和 date 的数据

输入参数

| 名称     | 类型  | 描述                                                                                      |
|--------|-----|-----------------------------------------------------------------------------------------|
| symbol | str | symbol='财务报告'; choice of {"全部", "重大事项", "财务报告", "融资公告", "风险提示", "资产重组", "信息变更", "持股变动"} |
| date   | str | date="20220511"; 指定日期                                                                   |

输出参数

| 名称   | 类型     | 描述  |
|------|--------|-----|
| 代码   | object | -   |
| 名称   | object | -   |
| 公告标题 | object | -   |
| 公告类型 | object | -   |
| 公告日期 | object | -   |
| 网址   | object | -   |

### stock_individual_notice_report
- **文档定位**：基本面数据 / 沪深京 A 股个股公告
- **HTTP**：`GET /api/public/stock_individual_notice_report`
- **调用**：运行 `scripts/aktools_get.py stock_individual_notice_report --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/notices/stock/300237.html

描述: 东方财富网-数据中心-公告大全-个股

限量: 单次获取指定 security, symbol, begin_date 和 end_date 的数据

输入参数

| 名称         | 类型  | 描述                                                                                      |
|------------|-----|-----------------------------------------------------------------------------------------|
| security   | str | security="300237"; 股票代码                                                                 |
| symbol     | str | symbol='财务报告'; choice of {"全部", "重大事项", "财务报告", "融资公告", "风险提示", "资产重组", "信息变更", "持股变动"} |
| begin_date | str | date="20250408"; 指定开始日期; 默认为空即不限制开始日期                                                   |
| end_date   | str | date="20260408"; 指定结束日期; 默认为空即不限制结束日期                                                   |

输出参数

| 名称   | 类型     | 描述  |
|------|--------|-----|
| 代码   | object | -   |
| 名称   | object | -   |
| 公告标题 | object | -   |
| 公告类型 | object | -   |
| 公告日期 | object | -   |
| 网址   | object | -   |

### stock_financial_report_sina
- **文档定位**：基本面数据 / 财务报表-新浪
- **HTTP**：`GET /api/public/stock_financial_report_sina`
- **调用**：运行 `scripts/aktools_get.py stock_financial_report_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://vip.stock.finance.sina.com.cn/corp/go.php/vFD_FinanceSummary/stockid/600600/displaytype/4.phtml?source=fzb&qq-pf-to=pcqq.group

描述: 新浪财经-财务报表-三大报表

限量: 单次获取指定报表的所有年份数据的历史数据

注意: 原始数据中有 `国内票证结算` 和 `内部应收款` 字段重, 返回数据中已经剔除

输入参数

| 名称     | 类型  | 描述                                                  |
|--------|-----|-----------------------------------------------------|
| stock  | str | stock="sh600600"; 带市场标识的股票代码                        |
| symbol | str | symbol="现金流量表"; choice of {"资产负债表", "利润表", "现金流量表"} |

输出参数

| 名称   | 类型     | 描述   |
|------|--------|------|
| 报告日  | object | 报告日期 |
| 流动资产 | object | -    |
| ...  | object | -    |
| 类型   | object | -    |
| 更新日期 | object | -    |

### stock_balance_sheet_by_report_em
- **文档定位**：基本面数据 / 财务报表-东财 / 资产负债表-按报告期
- **HTTP**：`GET /api/public/stock_balance_sheet_by_report_em`
- **调用**：运行 `scripts/aktools_get.py stock_balance_sheet_by_report_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://emweb.securities.eastmoney.com/PC_HSF10/NewFinanceAnalysis/Index?type=web&code=sh600519#lrb-0

描述: 东方财富-股票-财务分析-资产负债表-按报告期

限量: 单次获取指定 symbol 的资产负债表-按报告期数据

输入参数

| 名称     | 类型  | 描述                      |
|--------|-----|-------------------------|
| symbol | str | symbol="SH600519"; 股票代码 |

输出参数

| 名称  | 类型  | 描述          |
|-----|-----|-------------|
| -   | -   | 319 项，不逐一列出 |

### stock_balance_sheet_by_yearly_em
- **文档定位**：基本面数据 / 财务报表-东财 / 资产负债表-按年度
- **HTTP**：`GET /api/public/stock_balance_sheet_by_yearly_em`
- **调用**：运行 `scripts/aktools_get.py stock_balance_sheet_by_yearly_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://emweb.securities.eastmoney.com/PC_HSF10/NewFinanceAnalysis/Index?type=web&code=sh600519#lrb-0

描述: 东方财富-股票-财务分析-资产负债表-按年度

限量: 单次获取指定 symbol 的资产负债表-按年度数据

输入参数

| 名称     | 类型  | 描述                      |
|--------|-----|-------------------------|
| symbol | str | symbol="SH600519"; 股票代码 |

输出参数

| 名称  | 类型  | 描述          |
|-----|-----|-------------|
| -   | -   | 319 项，不逐一列出 |

### stock_profit_sheet_by_report_em
- **文档定位**：基本面数据 / 财务报表-东财 / 利润表-按报告期
- **HTTP**：`GET /api/public/stock_profit_sheet_by_report_em`
- **调用**：运行 `scripts/aktools_get.py stock_profit_sheet_by_report_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://emweb.securities.eastmoney.com/PC_HSF10/NewFinanceAnalysis/Index?type=web&code=sh600519#lrb-0

描述: 东方财富-股票-财务分析-利润表-报告期

限量: 单次获取指定 symbol 的利润表-报告期数据

输入参数

| 名称     | 类型  | 描述                      |
|--------|-----|-------------------------|
| symbol | str | symbol="SH600519"; 股票代码 |

输出参数

| 名称  | 类型  | 描述          |
|-----|-----|-------------|
| -   | -   | 203 项，不逐一列出 |

### stock_profit_sheet_by_yearly_em
- **文档定位**：基本面数据 / 财务报表-东财 / 利润表-按年度
- **HTTP**：`GET /api/public/stock_profit_sheet_by_yearly_em`
- **调用**：运行 `scripts/aktools_get.py stock_profit_sheet_by_yearly_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://emweb.securities.eastmoney.com/PC_HSF10/NewFinanceAnalysis/Index?type=web&code=sh600519#lrb-0

描述: 东方财富-股票-财务分析-利润表-按年度

限量: 单次获取指定 symbol 的利润表-按年度数据

输入参数

| 名称     | 类型  | 描述                      |
|--------|-----|-------------------------|
| symbol | str | symbol="SH600519"; 股票代码 |

输出参数

| 名称  | 类型  | 描述          |
|-----|-----|-------------|
| -   | -   | 203 项，不逐一列出 |

### stock_profit_sheet_by_quarterly_em
- **文档定位**：基本面数据 / 财务报表-东财 / 利润表-按单季度
- **HTTP**：`GET /api/public/stock_profit_sheet_by_quarterly_em`
- **调用**：运行 `scripts/aktools_get.py stock_profit_sheet_by_quarterly_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://emweb.securities.eastmoney.com/PC_HSF10/NewFinanceAnalysis/Index?type=web&code=sh600519#lrb-0

描述: 东方财富-股票-财务分析-利润表-按单季度

限量: 单次获取指定 symbol 的利润表-按单季度数据

输入参数

| 名称     | 类型  | 描述                      |
|--------|-----|-------------------------|
| symbol | str | symbol="SH600519"; 股票代码 |

输出参数

| 名称  | 类型  | 描述          |
|-----|-----|-------------|
| -   | -   | 204 项，不逐一列出 |

### stock_cash_flow_sheet_by_report_em
- **文档定位**：基本面数据 / 财务报表-东财 / 现金流量表-按报告期
- **HTTP**：`GET /api/public/stock_cash_flow_sheet_by_report_em`
- **调用**：运行 `scripts/aktools_get.py stock_cash_flow_sheet_by_report_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://emweb.securities.eastmoney.com/PC_HSF10/NewFinanceAnalysis/Index?type=web&code=sh600519#lrb-0

描述: 东方财富-股票-财务分析-现金流量表-按报告期

限量: 单次获取指定 symbol 的现金流量表-按报告期数据

输入参数

| 名称     | 类型  | 描述                      |
|--------|-----|-------------------------|
| symbol | str | symbol="SH600519"; 股票代码 |

输出参数

| 名称  | 类型  | 描述          |
|-----|-----|-------------|
| -   | -   | 252 项，不逐一列出 |

### stock_cash_flow_sheet_by_yearly_em
- **文档定位**：基本面数据 / 财务报表-东财 / 现金流量表-按年度
- **HTTP**：`GET /api/public/stock_cash_flow_sheet_by_yearly_em`
- **调用**：运行 `scripts/aktools_get.py stock_cash_flow_sheet_by_yearly_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://emweb.securities.eastmoney.com/PC_HSF10/NewFinanceAnalysis/Index?type=web&code=sh600519#lrb-0

描述: 东方财富-股票-财务分析-现金流量表-按年度

限量: 单次获取指定 symbol 的现金流量表-按年度数据

输入参数

| 名称     | 类型  | 描述                      |
|--------|-----|-------------------------|
| symbol | str | symbol="SH600519"; 股票代码 |

输出参数

| 名称  | 类型  | 描述          |
|-----|-----|-------------|
| -   | -   | 314 项，不逐一列出 |

### stock_cash_flow_sheet_by_quarterly_em
- **文档定位**：基本面数据 / 财务报表-东财 / 现金流量表-按单季度
- **HTTP**：`GET /api/public/stock_cash_flow_sheet_by_quarterly_em`
- **调用**：运行 `scripts/aktools_get.py stock_cash_flow_sheet_by_quarterly_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://emweb.securities.eastmoney.com/PC_HSF10/NewFinanceAnalysis/Index?type=web&code=sh600519#lrb-0

描述: 东方财富-股票-财务分析-现金流量表-按单季度

限量: 单次获取指定 symbol 的现金流量表-按单季度数据

输入参数

| 名称     | 类型  | 描述                      |
|--------|-----|-------------------------|
| symbol | str | symbol="SH600519"; 股票代码 |

输出参数

| 名称  | 类型  | 描述          |
|-----|-----|-------------|
| -   | -   | 315 项，不逐一列出 |

### stock_financial_debt_new_ths
- **文档定位**：基本面数据 / 财务报表-同花顺 / 资产负债表
- **HTTP**：`GET /api/public/stock_financial_debt_new_ths`
- **调用**：运行 `scripts/aktools_get.py stock_financial_debt_new_ths --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://basic.10jqka.com.cn/astockpc/astockmain/index.html#/financen?code=000063

描述: 同花顺-财务指标-资产负债表；替换 stock_financial_debt_ths 接口

限量: 单次获取资产负债表所有历史数据

输入参数

| 名称        | 类型  | 描述                                          |
|-----------|-----|---------------------------------------------|
| symbol    | str | symbol="000063"; 股票代码                       |
| indicator | str | indicator="按报告期"; choice of {"按报告期", "按年度"} |

输出参数

| 名称            | 类型      | 描述 |
|---------------|---------|----|
| report_date   | object  | -  |
| report_name   | object  | -  |
| report_period | object  | -  |
| quarter_name  | object  | -  |
| metric_name   | object  | -  |
| value         | float64 | -  |
| single        | object  | -  |
| yoy           | float64 | -  |
| mom           | object  | -  |
| single_yoy    | object  | -  |

### stock_financial_benefit_new_ths
- **文档定位**：基本面数据 / 财务报表-同花顺 / 利润表
- **HTTP**：`GET /api/public/stock_financial_benefit_new_ths`
- **调用**：运行 `scripts/aktools_get.py stock_financial_benefit_new_ths --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://basic.10jqka.com.cn/astockpc/astockmain/index.html#/financen?code=000063

描述: 同花顺-财务指标-利润表；替换 stock_financial_benefit_ths 接口

限量: 单次获取利润表所有历史数据

输入参数

| 名称        | 类型  | 描述                                                                      |
|-----------|-----|-------------------------------------------------------------------------|
| symbol    | str | symbol="000063"; 股票代码                                                   |
| indicator | str | indicator="按报告期"; choice of {"按报告期", "一季度", "二季度", "三季度", "四季度", "按年度"} |

输出参数

| 名称            | 类型      | 描述 |
|---------------|---------|----|
| report_date   | object  | -  |
| report_name   | object  | -  |
| report_period | object  | -  |
| quarter_name  | object  | -  |
| metric_name   | object  | -  |
| value         | float64 | -  |
| single        | object  | -  |
| yoy           | float64 | -  |
| mom           | object  | -  |
| single_yoy    | object  | -  |

### stock_financial_cash_new_ths
- **文档定位**：基本面数据 / 财务报表-同花顺 / 现金流量表
- **HTTP**：`GET /api/public/stock_financial_cash_new_ths`
- **调用**：运行 `scripts/aktools_get.py stock_financial_cash_new_ths --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://basic.10jqka.com.cn/astockpc/astockmain/index.html#/financen?code=000063

描述: 同花顺-财务指标-现金流量表；替换 stock_financial_cash_ths 接口

限量: 单次获取现金流量表所有历史数据

输入参数

| 名称        | 类型  | 描述                                                                      |
|-----------|-----|-------------------------------------------------------------------------|
| symbol    | str | symbol="000063"; 股票代码                                                   |
| indicator | str | indicator="按报告期"; choice of {"按报告期", "一季度", "二季度", "三季度", "四季度", "按年度"} |

输出参数

| 名称            | 类型      | 描述 |
|---------------|---------|----|
| report_date   | object  | -  |
| report_name   | object  | -  |
| report_period | object  | -  |
| quarter_name  | object  | -  |
| metric_name   | object  | -  |
| value         | float64 | -  |
| single        | object  | -  |
| yoy           | float64 | -  |
| mom           | object  | -  |
| single_yoy    | object  | -  |

### stock_balance_sheet_by_report_delisted_em
- **文档定位**：基本面数据 / 财务报表-东财-已退市股票 / 资产负债表-按报告期
- **HTTP**：`GET /api/public/stock_balance_sheet_by_report_delisted_em`
- **调用**：运行 `scripts/aktools_get.py stock_balance_sheet_by_report_delisted_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://emweb.securities.eastmoney.com/pc_hsf10/pages/index.html?type=web&code=SZ000013#/cwfx/zcfzb

描述: 东方财富-股票-财务分析-资产负债表-已退市股票-按报告期

限量: 单次获取指定 symbol 的资产负债表-按报告期数据

输入参数

| 名称     | 类型  | 描述                               |
|--------|-----|----------------------------------|
| symbol | str | symbol="SZ000013"; 带市场标识的已退市股票代码 |

输出参数

| 名称  | 类型  | 描述         |
|-----|-----|------------|
| -   | -   | 319项，不逐一列出 |

### stock_profit_sheet_by_report_delisted_em
- **文档定位**：基本面数据 / 财务报表-东财-已退市股票 / 利润表-按报告期
- **HTTP**：`GET /api/public/stock_profit_sheet_by_report_delisted_em`
- **调用**：运行 `scripts/aktools_get.py stock_profit_sheet_by_report_delisted_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://emweb.securities.eastmoney.com/pc_hsf10/pages/index.html?type=web&code=SZ000013#/cwfx/lrb

描述: 东方财富-股票-财务分析-利润表-已退市股票-按报告期

限量: 单次获取指定 symbol 的利润表-按报告期数据

输入参数

| 名称     | 类型  | 描述                               |
|--------|-----|----------------------------------|
| symbol | str | symbol="SZ000013"; 带市场标识的已退市股票代码 |

输出参数

| 名称  | 类型  | 描述          |
|-----|-----|-------------|
| -   | -   | 203 项，不逐一列出 |

### stock_cash_flow_sheet_by_report_delisted_em
- **文档定位**：基本面数据 / 财务报表-东财-已退市股票 / 现金流量表-按报告期
- **HTTP**：`GET /api/public/stock_cash_flow_sheet_by_report_delisted_em`
- **调用**：运行 `scripts/aktools_get.py stock_cash_flow_sheet_by_report_delisted_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://emweb.securities.eastmoney.com/pc_hsf10/pages/index.html?type=web&code=SZ000013#/cwfx/xjllb

描述: 东方财富-股票-财务分析-现金流量表-已退市股票-按报告期

限量: 单次获取指定 symbol 的现金流量表-按报告期数据

输入参数

| 名称     | 类型  | 描述                               |
|--------|-----|----------------------------------|
| symbol | str | symbol="SZ000013"; 带市场标识的已退市股票代码 |

输出参数

| 名称  | 类型  | 描述          |
|-----|-----|-------------|
| -   | -   | 252 项，不逐一列出 |

### stock_financial_hk_report_em
- **文档定位**：基本面数据 / 港股财务报表
- **HTTP**：`GET /api/public/stock_financial_hk_report_em`
- **调用**：运行 `scripts/aktools_get.py stock_financial_hk_report_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://emweb.securities.eastmoney.com/PC_HKF10/FinancialAnalysis/index?type=web&code=00700

描述: 东方财富-港股-财务报表-三大报表

限量: 单次获取指定股票、指定报告且指定报告期的数据

输入参数

| 名称        | 类型  | 描述                                                  |
|-----------|-----|-----------------------------------------------------|
| stock     | str | stock="00700"; 股票代码                                 |
| symbol    | str | symbol="现金流量表"; choice of {"资产负债表", "利润表", "现金流量表"} |
| indicator | str | indicator="年度"; choice of {"年度", "报告期"}             |

输出参数

| 名称                 | 类型      | 描述 |
|--------------------|---------|----|
| SECUCODE           | object  | -  |
| SECURITY_CODE      | object  | -  |
| SECURITY_NAME_ABBR | object  | -  |
| ORG_CODE           | object  | -  |
| REPORT_DATE        | object  | -  |
| DATE_TYPE_CODE     | object  | -  |
| FISCAL_YEAR        | object  | -  |
| STD_ITEM_CODE      | object  | -  |
| STD_ITEM_NAME      | object  | -  |
| AMOUNT             | float64 | -  |
| STD_REPORT_DATE    | object  | -  |

```python
import akshare as ak

stock_financial_hk_report_em_df = ak.stock_financial_hk_report_em(stock="00700", symbol="资产负债表", indicator="年度")
print(stock_financial_hk_report_em_df)
```

### stock_financial_us_report_em
- **文档定位**：基本面数据 / 美股财务报表
- **HTTP**：`GET /api/public/stock_financial_us_report_em`
- **调用**：运行 `scripts/aktools_get.py stock_financial_us_report_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://emweb.eastmoney.com/PC_USF10/pages/index.html?code=TSLA&type=web&color=w#/cwfx/zyzb

描述: 东方财富-美股-财务分析-三大报表

限量: 单次获取指定股票、指定报告且指定报告期的数据

输入参数

| 名称        | 类型  | 描述                                                    |
|-----------|-----|-------------------------------------------------------|
| stock     | str | stock="TSLA"; 股票代码, 比如 BRK.A 需修改为 BRK_A 再获取           |
| symbol    | str | symbol="资产负债表"; choice of {"资产负债表", "综合损益表", "现金流量表"} |
| indicator | str | indicator="年报"; choice of {"年报", "单季报", "累计季报"}       |

输出参数

| 名称                 | 类型      | 描述 |
|--------------------|---------|----|
| SECUCODE           | object  | -  |
| SECURITY_CODE      | object  | -  |
| SECURITY_NAME_ABBR | object  | -  |
| REPORT_DATE        | object  | -  |
| REPORT_TYPE        | object  | -  |
| REPORT             | object  | -  |
| STD_ITEM_CODE      | object  | -  |
| AMOUNT             | float64 | -  |
| ITEM_NAME          | object  | -  |


```python
import akshare as ak

stock_financial_us_report_em_df = ak.stock_financial_us_report_em(stock="TSLA", symbol="资产负债表", indicator="年报")
print(stock_financial_us_report_em_df)
```

### stock_financial_abstract
- **文档定位**：基本面数据 / 关键指标-新浪
- **HTTP**：`GET /api/public/stock_financial_abstract`
- **调用**：运行 `scripts/aktools_get.py stock_financial_abstract --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://vip.stock.finance.sina.com.cn/corp/go.php/vFD_FinanceSummary/stockid/600004.phtml

描述: 新浪财经-财务报表-关键指标

限量: 单次获取关键指标所有历史数据

输入参数

| 名称     | 类型  | 描述                    |
|--------|-----|-----------------------|
| symbol | str | symbol="600004"; 股票代码 |

输出参数

| 名称       | 类型     | 描述  |
|----------|--------|-----|
| 选项       | object | -   |
| 指标       | object | -   |
| 【具体的报告期】 | object | -   |

### stock_financial_abstract_new_ths
- **文档定位**：基本面数据 / 关键指标-同花顺
- **HTTP**：`GET /api/public/stock_financial_abstract_new_ths`
- **调用**：运行 `scripts/aktools_get.py stock_financial_abstract_new_ths --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://basic.10jqka.com.cn/new/000063/finance.html

描述: 同花顺-财务指标-重要指标；替换 stock_financial_abstract_ths 接口

限量: 单次获取指定 symbol 的所有数据

输入参数

| 名称        | 类型  | 描述                                                                      |
|-----------|-----|-------------------------------------------------------------------------|
| symbol    | str | symbol="000063"; 股票代码                                                   |
| indicator | str | indicator="按报告期"; choice of {"按报告期", "一季度", "二季度", "三季度", "四季度", "按年度"} |

输出参数

| 名称            | 类型      | 描述 |
|---------------|---------|----|
| report_date   | object  | -  |
| report_name   | object  | -  |
| report_period | object  | -  |
| quarter_name  | object  | -  |
| metric_name   | object  | -  |
| value         | float64 | -  |
| single        | object  | -  |
| yoy           | float64 | -  |
| mom           | object  | -  |
| single_yoy    | object  | -  |

### stock_financial_analysis_indicator_em
- **文档定位**：基本面数据 / 主要指标-东方财富
- **HTTP**：`GET /api/public/stock_financial_analysis_indicator_em`
- **调用**：运行 `scripts/aktools_get.py stock_financial_analysis_indicator_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://emweb.securities.eastmoney.com/pc_hsf10/pages/index.html?type=web&code=SZ301389&color=b#/cwfx

描述: 东方财富-A股-财务分析-主要指标

限量: 单次获取指定 symbol 的所有数据

输入参数

| 名称        | 类型  | 描述                                           |
|-----------|-----|----------------------------------------------|
| symbol    | str | symbol="301389.SZ"; 股票代码                     |
| indicator | str | indicator="按报告期"; choice of {"按报告期", "按单季度"} |

输出参数

| 名称                 | 类型      | 描述               |
|--------------------|---------|------------------|
| SECUCODE           | object  | 股票代码(带后缀)        |
| SECURITY_CODE      | object  | 股票代码             |
| SECURITY_NAME_ABBR | object  | 股票名称             |
| REPORT_DATE        | object  | 报告日期             |
| REPORT_TYPE        | object  | 报告类型             |
| REPORT_DATE_NAME   | object  | 报告日期名称           |
| EPSJB              | float64 | 基本每股收益(元)        |
| EPSKCJB            | float64 | 扣非每股收益(元)        |
| EPSXS              | float64 | 稀释每股收益(元)        |
| BPS                | float64 | 每股净资产(元)         |
| MGZBGJ             | float64 | 每股公积金(元)         |
| MGWFPLR            | float64 | 每股未分配利润(元)       |
| MGJYXJJE           | float64 | 每股经营现金流(元)       |
| TOTALOPERATEREVE   | float64 | 营业总收入(元)         |
| MLR                | float64 | 毛利润(元)           |
| PARENTNETPROFIT    | float64 | 归属净利润(元)         |
| KCFJCXSYJLR        | float64 | 扣非净利润(元)         |
| TOTALOPERATEREVETZ | float64 | 营业总收入同比增长(%)     |
| PARENTNETPROFITTZ  | float64 | 归属净利润同比增长(%)     |
| KCFJCXSYJLRTZ      | float64 | 扣非净利润同比增长(%)     |
| YYZSRGDHBZC        | float64 | 营业总收入滚动环比增长(%)   |
| NETPROFITRPHBZC    | float64 | 归属净利润滚动环比增长(%)   |
| KFJLRGDHBZC        | float64 | 扣非净利润滚动环比增长(%)   |
| ROEJQ              | float64 | 净资产收益率(加权)(%)    |
| ROEKCJQ            | float64 | 净资产收益率(扣非/加权)(%) |
| ZZCJLL             | float64 | 总资产收益率(加权)(%)    |
| XSJLL              | float64 | 净利率(%)           |
| XSMLL              | float64 | 毛利率(%)           |
| YSZKYYSR           | float64 | 预收账款/营业收入        |
| XSJXLYYSR          | float64 | 销售净现金流/营业收入      |
| JYXJLYYSR          | float64 | 经营净现金流/营业收入      |
| TAXRATE            | float64 | 实际税率(%)          |
| LD                 | float64 | 流动比率             |
| SD                 | float64 | 速动比率             |
| XJLLB              | float64 | 现金流量比率           |
| ZCFZL              | float64 | 资产负债率(%)         |
| QYCS               | float64 | 权益系数             |
| CQBL               | float64 | 产权比率             |
| ZZCZZTS            | float64 | 总资产周转天数(天)       |
| CHZZTS             | float64 | 存货周转天数(天)        |
| YSZKZZTS           | float64 | 应收账款周转天数(天)      |
| TOAZZL             | float64 | 总资产周转率(次)        |
| CHZZL              | float64 | 存货周转率(次)         |
| YSZKZZL            | float64 | 应收账款周转率(次)       |
| ...                | ...     | ...              |

### stock_financial_analysis_indicator
- **文档定位**：基本面数据 / 财务指标
- **HTTP**：`GET /api/public/stock_financial_analysis_indicator`
- **调用**：运行 `scripts/aktools_get.py stock_financial_analysis_indicator --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://money.finance.sina.com.cn/corp/go.php/vFD_FinancialGuideLine/stockid/600004/ctrl/2019/displaytype/4.phtml

描述: 新浪财经-财务分析-财务指标

限量: 单次获取指定 symbol 和 start_year 的所有财务指标历史数据

输入参数

| 名称         | 类型  | 描述                         |
|------------|-----|----------------------------|
| symbol     | str | symbol="600004"; 股票代码      |
| start_year | str | start_year="2020"; 开始查询的时间 |

输出参数

| 名称                | 类型      | 描述 |
|-------------------|---------|----|
| 日期                | object  | -  |
| 摊薄每股收益(元)         | float64 | -  |
| 加权每股收益(元)         | float64 | -  |
| 每股收益_调整后(元)       | float64 | -  |
| 扣除非经常性损益后的每股收益(元) | float64 | -  |
| 每股净资产_调整前(元)      | float64 | -  |
| 每股净资产_调整后(元)      | float64 | -  |
| 每股经营性现金流(元)       | float64 | -  |
| 每股资本公积金(元)        | float64 | -  |
| 每股未分配利润(元)        | float64 | -  |
| 调整后的每股净资产(元)      | float64 | -  |
| 总资产利润率(%)         | float64 | -  |
| 主营业务利润率(%)        | float64 | -  |
| 总资产净利润率(%)        | float64 | -  |
| 成本费用利润率(%)        | float64 | -  |
| 营业利润率(%)          | float64 | -  |
| 主营业务成本率(%)        | float64 | -  |
| 销售净利率(%)          | float64 | -  |
| 股本报酬率(%)          | float64 | -  |
| 净资产报酬率(%)         | float64 | -  |
| 资产报酬率(%)          | float64 | -  |
| 销售毛利率(%)          | float64 | -  |
| 三项费用比重            | float64 | -  |
| 非主营比重             | float64 | -  |
| 主营利润比重            | float64 | -  |
| 股息发放率(%)          | float64 | -  |
| 投资收益率(%)          | float64 | -  |
| 主营业务利润(元)         | float64 | -  |
| 净资产收益率(%)         | float64 | -  |
| 加权净资产收益率(%)       | float64 | -  |
| 扣除非经常性损益后的净利润(元)  | float64 | -  |
| 主营业务收入增长率(%)      | float64 | -  |
| 净利润增长率(%)         | float64 | -  |
| 净资产增长率(%)         | float64 | -  |
| 总资产增长率(%)         | float64 | -  |
| 应收账款周转率(次)        | float64 | -  |
| 应收账款周转天数(天)       | float64 | -  |
| 存货周转天数(天)         | float64 | -  |
| 存货周转率(次)          | float64 | -  |
| 固定资产周转率(次)        | float64 | -  |
| 总资产周转率(次)         | float64 | -  |
| 总资产周转天数(天)        | float64 | -  |
| 流动资产周转率(次)        | float64 | -  |
| 流动资产周转天数(天)       | float64 | -  |
| 股东权益周转率(次)        | float64 | -  |
| 流动比率              | float64 | -  |
| 速动比率              | float64 | -  |
| 现金比率(%)           | float64 | -  |
| 利息支付倍数            | float64 | -  |
| 长期债务与营运资金比率(%)    | float64 | -  |
| 股东权益比率(%)         | float64 | -  |
| 长期负债比率(%)         | float64 | -  |
| 股东权益与固定资产比率(%)    | float64 | -  |
| 负债与所有者权益比率(%)     | float64 | -  |
| 长期资产与长期资金比率(%)    | float64 | -  |
| 资本化比率(%)          | float64 | -  |
| 固定资产净值率(%)        | float64 | -  |
| 资本固定化比率(%)        | float64 | -  |
| 产权比率(%)           | float64 | -  |
| 清算价值比率(%)         | float64 | -  |
| 固定资产比重(%)         | float64 | -  |
| 资产负债率(%)          | float64 | -  |
| 总资产(元)            | float64 | -  |
| 经营现金净流量对销售收入比率(%) | float64 | -  |
| 资产的经营现金流量回报率(%)   | float64 | -  |
| 经营现金净流量与净利润的比率(%) | float64 | -  |
| 经营现金净流量对负债比率(%)   | float64 | -  |
| 现金流量比率(%)         | float64 | -  |
| 短期股票投资(元)         | float64 | -  |
| 短期债券投资(元)         | float64 | -  |
| 短期其它经营性投资(元)      | float64 | -  |
| 长期股票投资(元)         | float64 | -  |
| 长期债券投资(元)         | float64 | -  |
| 长期其它经营性投资(元)      | float64 | -  |
| 1年以内应收帐款(元)       | float64 | -  |
| 1-2年以内应收帐款(元)     | float64 | -  |
| 2-3年以内应收帐款(元)     | float64 | -  |
| 3年以内应收帐款(元)       | float64 | -  |
| 1年以内预付货款(元)       | float64 | -  |
| 1-2年以内预付货款(元)     | float64 | -  |
| 2-3年以内预付货款(元)     | float64 | -  |
| 3年以内预付货款(元)       | float64 | -  |
| 1年以内其它应收款(元)      | float64 | -  |
| 1-2年以内其它应收款(元)    | float64 | -  |
| 2-3年以内其它应收款(元)    | float64 | -  |
| 3年以内其它应收款(元)      | float64 | -  |

### stock_financial_hk_analysis_indicator_em
- **文档定位**：基本面数据 / 港股财务指标
- **HTTP**：`GET /api/public/stock_financial_hk_analysis_indicator_em`
- **调用**：运行 `scripts/aktools_get.py stock_financial_hk_analysis_indicator_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://emweb.securities.eastmoney.com/PC_HKF10/NewFinancialAnalysis/index?type=web&code=00700

描述: 东方财富-港股-财务分析-主要指标

限量: 单次获取财务指标所有历史数据

输入参数

| 名称        | 类型  | 描述                                      |
|-----------|-----|-----------------------------------------|
| symbol    | str | symbol="00700"; 股票代码                    |
| indicator | str | indicator="年度"; choice of {"年度", "报告期"} |

输出参数

| 名称                  | 类型      | 描述             |
|---------------------|---------|----------------|
| SECUCODE            | object  | 股票代码(带HK后缀)    |
| SECURITY_CODE       | object  | 股票代码(不带HK后缀)   |
| SECURITY_NAME_ABBR  | object  | 股票名称           |
| ORG_CODE            | object  | ORG_CODE       |
| REPORT_DATE         | object  | 报告日期           |
| DATE_TYPE_CODE      | object  | 报告日期类型         |
| PER_NETCASH_OPERATE | float64 | 每股经营现金流(元)     |
| PER_OI              | float64 | 每股营业收入(元)      |
| BPS                 | float64 | 每股净资产(元)       |
| BASIC_EPS           | float64 | 基本每股收益(元)      |
| DILUTED_EPS         | float64 | 稀释每股收益(元)      |
| OPERATE_INCOME      | int64   | 营业总收入(元)       |
| OPERATE_INCOME_YOY  | float64 | 营业总收入同比增长(%)   |
| GROSS_PROFIT        | int64   | 毛利润(元)         |
| GROSS_PROFIT_YOY    | float64 | 毛利润同比增长(%)     |
| HOLDER_PROFIT       | int64   | 归母净利润(元)       |
| HOLDER_PROFIT_YOY   | float64 | 归母净利润同比增长(%)   |
| GROSS_PROFIT_RATIO  | float64 | 毛利率(%)         |
| EPS_TTM             | float64 | TTM每股收益(元)     |
| OPERATE_INCOME_QOQ  | float64 | 营业总收入滚动环比增长(%) |
| NET_PROFIT_RATIO    | float64 | 净利率(%)         |
| ROE_AVG             | float64 | 平均净资产收益率(%)    |
| GROSS_PROFIT_QOQ    | float64 | 毛利润滚动环比增长(%)   |
| ROA                 | float64 | 总资产净利率(%)      |
| HOLDER_PROFIT_QOQ   | float64 | 归母净利润滚动环比增长(%) |
| ROE_YEARLY          | float64 | 年化净资产收益率(%)    |
| ROIC_YEARLY         | float64 | 年化投资回报率(%)     |
| TAX_EBT             | float64 | 所得税/利润总额(%)    |
| OCF_SALES           | float64 | 经营现金流/营业收入(%)  |
| DEBT_ASSET_RATIO    | float64 | 资产负债率(%)       |
| CURRENT_RATIO       | float64 | 流动比率(倍)        |
| CURRENTDEBT_DEBT    | float64 | 流动负债/总负债(%)    |
| START_DATE          | object  | START_DATE     |
| FISCAL_YEAR         | object  | 年结日            |
| CURRENCY            | object  | CURRENCY       |
| IS_CNY_CODE         | int64   | IS_CNY_CODE    |

### stock_financial_us_analysis_indicator_em
- **文档定位**：基本面数据 / 美股财务指标
- **HTTP**：`GET /api/public/stock_financial_us_analysis_indicator_em`
- **调用**：运行 `scripts/aktools_get.py stock_financial_us_analysis_indicator_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://emweb.eastmoney.com/PC_USF10/pages/index.html?code=TSLA&type=web&color=w#/cwfx/zyzb

描述: 东方财富-美股-财务分析-主要指标

限量: 单次获取指定股票的所有历史数据

输入参数

| 名称        | 类型  | 描述                                              |
|-----------|-----|-------------------------------------------------|
| symbol    | str | symbol="TSLA"; 股票代码                             |
| indicator | str | indicator="年报"; choice of {"年报", "单季报", "累计季报"} |

输出参数

| 名称                          | 类型      | 描述 |
|-----------------------------|---------|----|
| SECUCODE                    | object  | -  |
| SECURITY_CODE               | object  | -  |
| SECURITY_NAME_ABBR          | object  | -  |
| ORG_CODE                    | object  | -  |
| SECURITY_INNER_CODE         | object  | -  |
| ACCOUNTING_STANDARDS        | object  | -  |
| NOTICE_DATE                 | object  | -  |
| START_DATE                  | object  | -  |
| REPORT_DATE                 | object  | -  |
| FINANCIAL_DATE              | object  | -  |
| STD_REPORT_DATE             | object  | -  |
| CURRENCY                    | object  | -  |
| DATE_TYPE                   | object  | -  |
| DATE_TYPE_CODE              | object  | -  |
| REPORT_TYPE                 | object  | -  |
| REPORT_DATA_TYPE            | object  | -  |
| ORGTYPE                     | object  | -  |
| OPERATE_INCOME              | float64 | -  |
| OPERATE_INCOME_YOY          | float64 | -  |
| GROSS_PROFIT                | float64 | -  |
| GROSS_PROFIT_YOY            | float64 | -  |
| PARENT_HOLDER_NETPROFIT     | int64   | -  |
| PARENT_HOLDER_NETPROFIT_YOY | float64 | -  |
| BASIC_EPS                   | float64 | -  |
| DILUTED_EPS                 | float64 | -  |
| GROSS_PROFIT_RATIO          | float64 | -  |
| NET_PROFIT_RATIO            | float64 | -  |
| ACCOUNTS_RECE_TR            | float64 | -  |
| INVENTORY_TR                | float64 | -  |
| TOTAL_ASSETS_TR             | float64 | -  |
| ACCOUNTS_RECE_TDAYS         | float64 | -  |
| INVENTORY_TDAYS             | float64 | -  |
| TOTAL_ASSETS_TDAYS          | float64 | -  |
| ROE_AVG                     | float64 | -  |
| ROA                         | float64 | -  |
| CURRENT_RATIO               | float64 | -  |
| SPEED_RATIO                 | float64 | -  |
| OCF_LIQDEBT                 | float64 | -  |
| DEBT_ASSET_RATIO            | float64 | -  |
| EQUITY_RATIO                | float64 | -  |
| BASIC_EPS_YOY               | float64 | -  |
| GROSS_PROFIT_RATIO_YOY      | float64 | -  |
| NET_PROFIT_RATIO_YOY        | float64 | -  |
| ROE_AVG_YOY                 | float64 | -  |
| ROA_YOY                     | float64 | -  |
| DEBT_ASSET_RATIO_YOY        | float64 | -  |
| CURRENT_RATIO_YOY           | float64 | -  |
| SPEED_RATIO_YOY             | float64 | -  |

### stock_history_dividend
- **文档定位**：基本面数据 / 历史分红
- **HTTP**：`GET /api/public/stock_history_dividend`
- **调用**：运行 `scripts/aktools_get.py stock_history_dividend --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://vip.stock.finance.sina.com.cn/q/go.php/vInvestConsult/kind/lsfh/index.phtml

描述: 新浪财经-发行与分配-历史分红

限量: 单次获取所有股票的历史分红数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 代码   | object  | -       |
| 名称   | object  | -       |
| 上市日期 | object  | -       |
| 累计股息 | float64 | 注意单位: % |
| 年均股息 | float64 | 注意单位: % |
| 分红次数 | float64 | -       |
| 融资总额 | float64 | 注意单位: 亿 |
| 融资次数 | float64 | -       |

### stock_gdfx_free_top_10_em
- **文档定位**：基本面数据 / 十大流通股东(个股)
- **HTTP**：`GET /api/public/stock_gdfx_free_top_10_em`
- **调用**：运行 `scripts/aktools_get.py stock_gdfx_free_top_10_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://emweb.securities.eastmoney.com/PC_HSF10/ShareholderResearch/Index?type=web&code=SH688686#sdltgd-0

描述: 东方财富网-个股-十大流通股东

限量: 单次返回指定 symbol 和 date 的所有数据

输入参数

| 名称     | 类型  | 描述                            |
|--------|-----|-------------------------------|
| symbol | str | symbol="sh688686"; 带市场标识的股票代码 |
| date   | str | date="20240930"; 财报发布季度最后日    |

输出参数

| 名称         | 类型      | 描述      |
|------------|---------|---------|
| 名次         | int64   | -       |
| 股东名称       | object  | -       |
| 股东性质       | object  | -       |
| 股份类型       | object  | -       |
| 持股数        | int64   | 注意单位: 股 |
| 占总流通股本持股比例 | float64 | 注意单位: % |
| 增减         | object  | 注意单位: 股 |
| 变动比率       | float64 | 注意单位: % |
