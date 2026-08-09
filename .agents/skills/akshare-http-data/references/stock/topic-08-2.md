# 基本面数据



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### stock_gdfx_top_10_em
- **文档定位**：基本面数据 / 十大股东(个股)
- **HTTP**：`GET /api/public/stock_gdfx_top_10_em`
- **调用**：运行 `scripts/aktools_get.py stock_gdfx_top_10_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://emweb.securities.eastmoney.com/PC_HSF10/ShareholderResearch/Index?type=web&code=SH688686#sdltgd-0

描述: 东方财富网-个股-十大股东

限量: 单次返回指定 symbol 和 date 的所有数据

输入参数

| 名称     | 类型  | 描述                            |
|--------|-----|-------------------------------|
| symbol | str | symbol="sh688686"; 带市场标识的股票代码 |
| date   | str | date="20210630"; 财报发布季度最后日    |

输出参数

| 名称       | 类型      | 描述      |
|----------|---------|---------|
| 名次       | int64   | -       |
| 股东名称     | object  | -       |
| 股份类型     | object  | -       |
| 持股数      | int64   | 注意单位: 股 |
| 占总股本持股比例 | float64 | 注意单位: % |
| 增减       | object  | 注意单位: 股 |
| 变动比率     | float64 | 注意单位: % |

### stock_gdfx_free_holding_change_em
- **文档定位**：基本面数据 / 股东持股变动统计-十大流通股东
- **HTTP**：`GET /api/public/stock_gdfx_free_holding_change_em`
- **调用**：运行 `scripts/aktools_get.py stock_gdfx_free_holding_change_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/gdfx/HoldingAnalyse.html

描述: 东方财富网-数据中心-股东分析-股东持股变动统计-十大流通股东

限量: 单次返回指定 date 的所有数据

输入参数

| 名称   | 类型  | 描述                         |
|------|-----|----------------------------|
| date | str | date="20210930"; 财报发布季度最后日 |

输出参数

| 名称           | 类型      | 描述      |
|--------------|---------|---------|
| 序号           | int64   | -       |
| 股东名称         | object  | -       |
| 股东类型         | object  | -       |
| 期末持股只数统计-总持有 | float64 | -       |
| 期末持股只数统计-新进  | float64 | -       |
| 期末持股只数统计-增加  | float64 | -       |
| 期末持股只数统计-不变  | float64 | -       |
| 期末持股只数统计-减少  | float64 | -       |
| 流通市值统计       | float64 | 注意单位: 元 |
| 持有个股         | object  | -       |

### stock_gdfx_holding_change_em
- **文档定位**：基本面数据 / 股东持股变动统计-十大股东
- **HTTP**：`GET /api/public/stock_gdfx_holding_change_em`
- **调用**：运行 `scripts/aktools_get.py stock_gdfx_holding_change_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/gdfx/HoldingAnalyse.html

描述: 东方财富网-数据中心-股东分析-股东持股变动统计-十大股东

限量: 单次返回指定 date 的所有数据

输入参数

| 名称   | 类型  | 描述                         |
|------|-----|----------------------------|
| date | str | date="20210930"; 财报发布季度最后日 |

输出参数

| 名称           | 类型      | 描述      |
|--------------|---------|---------|
| 序号           | int64   | -       |
| 股东名称         | object  | -       |
| 股东类型         | object  | -       |
| 期末持股只数统计-总持有 | float64 | -       |
| 期末持股只数统计-新进  | float64 | -       |
| 期末持股只数统计-增加  | float64 | -       |
| 期末持股只数统计-不变  | float64 | -       |
| 期末持股只数统计-减少  | float64 | -       |
| 流通市值统计       | float64 | 注意单位: 元 |
| 持有个股         | object  | -       |

### stock_management_change_ths
- **文档定位**：基本面数据 / 高管持股变动统计
- **HTTP**：`GET /api/public/stock_management_change_ths`
- **调用**：运行 `scripts/aktools_get.py stock_management_change_ths --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://basic.10jqka.com.cn/new/688981/event.html

描述: 同花顺-公司大事-高管持股变动

限量: 单次返回所有数据

输入参数

| 名称     | 类型  | 描述                    |
|--------|-----|-----------------------|
| symbol | str | symbol="688981"; 股票代码 |

输出参数

| 名称      | 类型     | 描述      |
|---------|--------|---------|
| 公告日期    | object | -       |
| 变动人     | object | -       |
| 与公司高管关系 | object | -       |
| 变动数量    | object | 注意单位: 股 |
| 交易均价    | object | 注意单位: 元 |
| 剩余股数    | object | 注意单位: 股 |
| 变动途径    | object | -       |

### stock_shareholder_change_ths
- **文档定位**：基本面数据 / 股东持股变动统计
- **HTTP**：`GET /api/public/stock_shareholder_change_ths`
- **调用**：运行 `scripts/aktools_get.py stock_shareholder_change_ths --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://basic.10jqka.com.cn/new/688981/event.html

描述: 同花顺-公司大事-股东持股变动

限量: 单次返回所有数据

输入参数

| 名称     | 类型  | 描述                    |
|--------|-----|-----------------------|
| symbol | str | symbol="688981"; 股票代码 |

输出参数

| 名称     | 类型     | 描述      |
|--------|--------|---------|
| 公告日期   | object | -       |
| 变动股东   | object | -       |
| 变动数量   | object | 注意单位: 股 |
| 交易均价   | object | 注意单位: 元 |
| 剩余股份总数 | object | 注意单位: 股 |
| 变动期间   | object | -       |
| 变动途径   | object | -       |

### stock_gdfx_free_holding_analyse_em
- **文档定位**：基本面数据 / 股东持股分析-十大流通股东
- **HTTP**：`GET /api/public/stock_gdfx_free_holding_analyse_em`
- **调用**：运行 `scripts/aktools_get.py stock_gdfx_free_holding_analyse_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/gdfx/HoldingAnalyse.html

描述: 东方财富网-数据中心-股东分析-股东持股分析-十大流通股东

限量: 单次获取返回所有数据

输入参数

| 名称   | 类型  | 描述                         |
|------|-----|----------------------------|
| date | str | date="20230930"; 财报发布季度最后日 |

输出参数

| 名称             | 类型      | 描述      |
|----------------|---------|---------|
| 序号             | int64   | -       |
| 股东名称           | object  | -       |
| 股东类型           | object  | -       |
| 股票代码           | object  | -       |
| 股票简称           | object  | -       |
| 报告期            | object  | -       |
| 期末持股-数量        | float64 | 注意单位: 股 |
| 期末持股-数量变化      | float64 | 注意单位: 股 |
| 期末持股-数量变化比例    | float64 | 注意单位: % |
| 期末持股-持股变动      | float64 | -       |
| 期末持股-流通市值      | float64 | 注意单位: 元 |
| 公告日            | object  | -       |
| 公告日后涨跌幅-10个交易日 | float64 | 注意单位: % |
| 公告日后涨跌幅-30个交易日 | float64 | 注意单位: % |
| 公告日后涨跌幅-60个交易日 | float64 | 注意单位: % |

### stock_gdfx_holding_analyse_em
- **文档定位**：基本面数据 / 股东持股分析-十大股东
- **HTTP**：`GET /api/public/stock_gdfx_holding_analyse_em`
- **调用**：运行 `scripts/aktools_get.py stock_gdfx_holding_analyse_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/gdfx/HoldingAnalyse.html

描述: 东方财富网-数据中心-股东分析-股东持股分析-十大股东

限量: 单次获取返回所有数据

输入参数

| 名称   | 类型  | 描述                         |
|------|-----|----------------------------|
| date | str | date="20210930"; 财报发布季度最后日 |

输出参数

| 名称             | 类型      | 描述      |
|----------------|---------|---------|
| 序号             | int64   | -       |
| 股东名称           | object  | -       |
| 股东类型           | object  | -       |
| 股票代码           | object  | -       |
| 股票简称           | object  | -       |
| 报告期            | object  | -       |
| 期末持股-数量        | float64 | 注意单位: 股 |
| 期末持股-数量变化      | float64 | 注意单位: 股 |
| 期末持股-数量变化比例    | float64 | 注意单位: % |
| 期末持股-持股变动      | float64 | -       |
| 期末持股-流通市值      | float64 | 注意单位: 元 |
| 公告日            | object  | -       |
| 公告日后涨跌幅-10个交易日 | float64 | 注意单位: % |
| 公告日后涨跌幅-30个交易日 | float64 | 注意单位: % |
| 公告日后涨跌幅-60个交易日 | float64 | 注意单位: % |

### stock_gdfx_free_holding_detail_em
- **文档定位**：基本面数据 / 股东持股明细-十大流通股东
- **HTTP**：`GET /api/public/stock_gdfx_free_holding_detail_em`
- **调用**：运行 `scripts/aktools_get.py stock_gdfx_free_holding_detail_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/gdfx/HoldingAnalyse.html

描述: 东方财富网-数据中心-股东分析-股东持股明细-十大流通股东

限量: 单次返回指定 date 的所有数据

说明: 已优化 EastMoney 分页参数，避免在部分报告期因总页数达到 100 页附近而出现后续页面返回空结果的情况

输入参数

| 名称   | 类型  | 描述                         |
|------|-----|----------------------------|
| date | str | date="20210930"; 财报发布季度最后日 |

输出参数

| 名称           | 类型      | 描述      |
|--------------|---------|---------|
| 序号           | int64   | -       |
| 股东名称         | object  | -       |
| 股东类型         | object  | -       |
| 股票代码         | object  | -       |
| 股票简称         | object  | -       |
| 报告期          | object  | -       |
| 期末持股-数量      | float64 | 注意单位: 股 |
| 期末持股-数量变化    | float64 | 注意单位: 股 |
| 期末持股-数量变化比例  | float64 | 注意单位: % |
| 期末持股-持股变动    | float64 | -       |
| 期末持股-流通市值    | float64 | 注意单位: 元 |
| 公告日          | object  | -       |

### stock_gdfx_holding_detail_em
- **文档定位**：基本面数据 / 股东持股明细-十大股东
- **HTTP**：`GET /api/public/stock_gdfx_holding_detail_em`
- **调用**：运行 `scripts/aktools_get.py stock_gdfx_holding_detail_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/gdfx/HoldingAnalyse.html

描述: 东方财富网-数据中心-股东分析-股东持股明细-十大股东

限量: 单次返回指定参数的所有数据

输入参数

| 名称        | 类型  | 描述                                                                     |
|-----------|-----|------------------------------------------------------------------------|
| date      | str | date="20230331"; 财报发布季度最后日                                             |
| indicator | str | indicator="个人"; 股东类型; choice of {"个人", "基金", "QFII", "社保", "券商", "信托"} |
| symbol    | str | symbol="新进"; 持股变动; choice of {"新进", "增加", "不变", "减少"}                  |

输出参数

| 名称           | 类型      | 描述      |
|--------------|---------|---------|
| 序号           | int64   | -       |
| 股东名称         | object  | -       |
| 股东排名         | object  | -       |
| 股票代码         | object  | -       |
| 股票简称         | object  | -       |
| 报告期          | object  | -       |
| 期末持股-数量      | float64 | 注意单位: 股 |
| 期末持股-数量变化    | float64 | 注意单位: 股 |
| 期末持股-数量变化比例  | float64 | 注意单位: % |
| 期末持股-持股变动    | float64 | -       |
| 期末持股-流通市值    | float64 | 注意单位: 元 |
| 公告日          | object  | -       |
| 股东类型         | object  | -       |

### stock_gdfx_free_holding_statistics_em
- **文档定位**：基本面数据 / 股东持股统计-十大流通股东
- **HTTP**：`GET /api/public/stock_gdfx_free_holding_statistics_em`
- **调用**：运行 `scripts/aktools_get.py stock_gdfx_free_holding_statistics_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/gdfx/HoldingAnalyse.html

描述: 东方财富网-数据中心-股东分析-股东持股统计-十大股东

限量: 单次返回指定 date 的所有数据

输入参数

| 名称   | 类型  | 描述                         |
|------|-----|----------------------------|
| date | str | date="20210930"; 财报发布季度最后日 |

输出参数

| 名称                   | 类型      | 描述  |
|----------------------|---------|-----|
| 序号                   | int64   | -   |
| 股东名称                 | object  | -   |
| 股东类型                 | object  | -   |
| 统计次数                 | int64   | -   |
| 公告日后涨幅统计-10个交易日-平均涨幅 | float64 | -   |
| 公告日后涨幅统计-10个交易日-最大涨幅 | float64 | -   |
| 公告日后涨幅统计-10个交易日-最小涨幅 | float64 | -   |
| 公告日后涨幅统计-30个交易日-平均涨幅 | float64 | -   |
| 公告日后涨幅统计-30个交易日-最大涨幅 | float64 | -   |
| 公告日后涨幅统计-30个交易日-最小涨幅 | float64 | -   |
| 公告日后涨幅统计-60个交易日-平均涨幅 | float64 | -   |
| 公告日后涨幅统计-60个交易日-最大涨幅 | float64 | -   |
| 公告日后涨幅统计-60个交易日-最小涨幅 | float64 | -   |
| 持有个股                 | object  | -   |

### stock_gdfx_holding_statistics_em
- **文档定位**：基本面数据 / 股东持股统计-十大股东
- **HTTP**：`GET /api/public/stock_gdfx_holding_statistics_em`
- **调用**：运行 `scripts/aktools_get.py stock_gdfx_holding_statistics_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/gdfx/HoldingAnalyse.html

描述: 东方财富网-数据中心-股东分析-股东持股统计-十大股东

限量: 单次返回指定 date 的所有数据

输入参数

| 名称   | 类型  | 描述                         |
|------|-----|----------------------------|
| date | str | date="20210930"; 财报发布季度最后日 |

输出参数

| 名称                   | 类型      | 描述  |
|----------------------|---------|-----|
| 序号                   | int64   | -   |
| 股东名称                 | object  | -   |
| 股东类型                 | object  | -   |
| 统计次数                 | int64   | -   |
| 公告日后涨幅统计-10个交易日-平均涨幅 | float64 | -   |
| 公告日后涨幅统计-10个交易日-最大涨幅 | float64 | -   |
| 公告日后涨幅统计-10个交易日-最小涨幅 | float64 | -   |
| 公告日后涨幅统计-30个交易日-平均涨幅 | float64 | -   |
| 公告日后涨幅统计-30个交易日-最大涨幅 | float64 | -   |
| 公告日后涨幅统计-30个交易日-最小涨幅 | float64 | -   |
| 公告日后涨幅统计-60个交易日-平均涨幅 | float64 | -   |
| 公告日后涨幅统计-60个交易日-最大涨幅 | float64 | -   |
| 公告日后涨幅统计-60个交易日-最小涨幅 | float64 | -   |
| 持有个股                 | object  | -   |

### stock_gdfx_free_holding_teamwork_em
- **文档定位**：基本面数据 / 股东协同-十大流通股东
- **HTTP**：`GET /api/public/stock_gdfx_free_holding_teamwork_em`
- **调用**：运行 `scripts/aktools_get.py stock_gdfx_free_holding_teamwork_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/gdfx/HoldingAnalyse.html

描述: 东方财富网-数据中心-股东分析-股东协同-十大流通股东

限量: 单次返回所有数据

输入参数

| 名称     | 类型  | 描述                                                                  |
|--------|-----|---------------------------------------------------------------------|
| symbol | str | symbol="社保"; choice of {"全部", "个人", "基金", "QFII", "社保", "券商", "信托"} |

输出参数

| 名称     | 类型     | 描述  |
|--------|--------|-----|
| 序号     | int64  | -   |
| 股东名称   | object | -   |
| 股东类型   | object | -   |
| 协同股东名称 | object | -   |
| 协同股东类型 | object | -   |
| 协同次数   | int64  | -   |
| 个股详情   | object | -   |

### stock_gdfx_holding_teamwork_em
- **文档定位**：基本面数据 / 股东协同-十大股东
- **HTTP**：`GET /api/public/stock_gdfx_holding_teamwork_em`
- **调用**：运行 `scripts/aktools_get.py stock_gdfx_holding_teamwork_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/gdfx/HoldingAnalyse.html

描述: 东方财富网-数据中心-股东分析-股东协同-十大股东

限量: 单次返回所有数据

输入参数

| 名称     | 类型  | 描述                                                                  |
|--------|-----|---------------------------------------------------------------------|
| symbol | str | symbol="社保"; choice of {"全部", "个人", "基金", "QFII", "社保", "券商", "信托"} |

输出参数

| 名称     | 类型     | 描述  |
|--------|--------|-----|
| 序号     | int64  | -   |
| 股东名称   | object | -   |
| 股东类型   | object | -   |
| 协同股东名称 | object | -   |
| 协同股东类型 | object | -   |
| 协同次数   | int64  | -   |
| 个股详情   | object | -   |

### stock_zh_a_gdhs
- **文档定位**：基本面数据 / 股东户数
- **HTTP**：`GET /api/public/stock_zh_a_gdhs`
- **调用**：运行 `scripts/aktools_get.py stock_zh_a_gdhs --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/gdhs/

描述: 东方财富网-数据中心-特色数据-股东户数数据

限量: 单次获取返回所有数据

输入参数

| 名称     | 类型  | 描述                                                                     |
|--------|-----|------------------------------------------------------------------------|
| symbol | str | symbol="20230930"; choice of {"最新", 每个季度末}, 其中 每个季度末需要写成 `20230930` 格式 |

输出参数

| 名称           | 类型      | 描述      |
|--------------|---------|---------|
| 代码           | object  | -       |
| 名称           | object  | -       |
| 最新价          | float64 | 注意单位: 元 |
| 涨跌幅          | float64 | 注意单位: % |
| 股东户数-本次      | int64   | -       |
| 股东户数-上次      | int64   | -       |
| 股东户数-增减      | int64   | -       |
| 股东户数-增减比例    | float64 | 注意单位: % |
| 区间涨跌幅        | float64 | 注意单位: % |
| 股东户数统计截止日-本次 | object  | -       |
| 股东户数统计截止日-上次 | object  | -       |
| 户均持股市值       | float64 | -       |
| 户均持股数量       | float64 | -       |
| 总市值          | float64 | -       |
| 总股本          | float64 | -       |
| 公告日期         | object  | -       |

### stock_zh_a_gdhs_detail_em
- **文档定位**：基本面数据 / 股东户数详情
- **HTTP**：`GET /api/public/stock_zh_a_gdhs_detail_em`
- **调用**：运行 `scripts/aktools_get.py stock_zh_a_gdhs_detail_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/gdhs/detail/000002.html

描述: 东方财富网-数据中心-特色数据-股东户数详情

限量: 单次获取指定 symbol 的所有数据

输入参数

| 名称     | 类型  | 描述                    |
|--------|-----|-----------------------|
| symbol | str | symbol="000001"; 股票代码 |

输出参数

| 名称        | 类型      | 描述      |
|-----------|---------|---------|
| 股东户数统计截止日 | object  | -       |
| 区间涨跌幅     | float64 | 注意单位: % |
| 股东户数-本次   | int64   | -       |
| 股东户数-上次   | int64   | -       |
| 股东户数-增减   | int64   | -       |
| 股东户数-增减比例 | float64 | 注意单位: % |
| 户均持股市值    | float64 | -       |
| 户均持股数量    | float64 | -       |
| 总市值       | float64 | -       |
| 总股本       | int64   | -       |
| 股本变动      | int64   | -       |
| 股本变动原因    | object  | -       |
| 股东户数公告日期  | object  | -       |
| 代码        | object  | -       |
| 名称        | object  | -       |

### stock_history_dividend_detail
- **文档定位**：基本面数据 / 分红配股
- **HTTP**：`GET /api/public/stock_history_dividend_detail`
- **调用**：运行 `scripts/aktools_get.py stock_history_dividend_detail --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://vip.stock.finance.sina.com.cn/corp/go.php/vISSUE_ShareBonus/stockid/300670.phtml

描述: 新浪财经-发行与分配-分红配股

限量: 单次获取指定股票的新浪财经-发行与分配-分红配股详情

输入参数

| 名称        | 类型  | 描述                                               |
|-----------|-----|--------------------------------------------------|
| symbol    | str | symbol="600012"; 股票代码                            |
| indicator | str | indicator="配股"; choice of {"分红", "配股"}           |
| date      | str | date="1994-12-24"; 分红配股的具体日期, e.g., "1994-12-24" |

输出参数-分红历史

| 名称    | 类型      | 描述          |
|-------|---------|-------------|
| 公告日期  | object  | -           |
| 送股    | int64   | 注意单位: 股     |
| 转增    | int64   | 注意单位: 股     |
| 派息    | float64 | 注意单位: 元; 税前 |
| 进度    | object  | -           |
| 除权除息日 | object  | -           |
| 股权登记日 | object  | -           |
| 红股上市日 | object  | -           |

接口示例-分红历史

```python
import akshare as ak

stock_history_dividend_detail_df = ak.stock_history_dividend_detail(symbol="600012", indicator="分红")
print(stock_history_dividend_detail_df)
```

### stock_dividend_cninfo
- **文档定位**：基本面数据 / 历史分红
- **HTTP**：`GET /api/public/stock_dividend_cninfo`
- **调用**：运行 `scripts/aktools_get.py stock_dividend_cninfo --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://webapi.cninfo.com.cn/#/company?companyid=600009

描述: 巨潮资讯-个股-历史分红

限量: 单次获取指定股票的历史分红数据

输入参数

| 名称     | 类型  | 描述              |
|--------|-----|-----------------|
| symbol | str | symbol="600009" |

输出参数

| 名称       | 类型      | 描述           |
|----------|---------|--------------|
| 实施方案公告日期 | object  | -            |
| 送股比例     | float64 | 注意单位: 每 10 股 |
| 转增比例     | float64 | 注意单位: 每 10 股 |
| 派息比例     | float64 | 注意单位: 每 10 股 |
| 股权登记日    | object  | -            |
| 除权日      | object  | -            |
| 派息日      | object  | -            |
| 股份到账日    | object  | -            |
| 实施方案分红说明 | object  | -            |
| 分红类型     | object  | -            |
| 报告时间     | object  | -            |

### stock_ipo_info
- **文档定位**：基本面数据 / 新股发行
- **HTTP**：`GET /api/public/stock_ipo_info`
- **调用**：运行 `scripts/aktools_get.py stock_ipo_info --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://vip.stock.finance.sina.com.cn/corp/go.php/vISSUE_NewStock/stockid/600004.phtml

描述: 新浪财经-发行与分配-新股发行

限量: 单次获取新股发行的基本信息数据

输入参数

| 名称    | 类型  | 描述                   |
|-------|-----|----------------------|
| stock | str | stock="600004"; 股票代码 |

输出参数

| 名称    | 类型     | 描述   |
|-------|--------|------|
| item  | object | 所列项目 |
| value | object | 项目值  |

### stock_ipo_review_em
- **文档定位**：基本面数据 / 新股上会信息
- **HTTP**：`GET /api/public/stock_ipo_review_em`
- **调用**：运行 `scripts/aktools_get.py stock_ipo_review_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/xg/gh/default.html

描述: 东方财富网-数据中心-新股申购-新股上会信息

限量: 单次获取所有数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称      | 类型     | 描述 |
|---------|--------|----|
| 序号      | int64  | -  |
| 企业名称    | object | -  |
| 股票简称    | object | -  |
| 股票代码    | object | -  |
| 上市板块    | object | -  |
| 上会日期    | object | -  |
| 审核状态    | object | -  |
| 发审委委员   | object | -  |
| 主承销商    | object | -  |
| 发行数量(股) | object | -  |
| 拟融资额(元) | object | -  |
| 公告日期    | object | -  |
| 上市日期    | object | -  |

### stock_ipo_tutor_em
- **文档定位**：基本面数据 / IPO辅导信息
- **HTTP**：`GET /api/public/stock_ipo_tutor_em`
- **调用**：运行 `scripts/aktools_get.py stock_ipo_tutor_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/xg/gh/default.html

描述: 东方财富网-数据中心-新股申购-IPO辅导信息

限量: 单次获取所有数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称      | 类型     | 描述 |
|---------|--------|----|
| 序号      | int64  | -  |
| 企业名称    | object | -  |
| 辅导机构    | object | -  |
| 辅导状态    | object | -  |
| 报告类型    | object | -  |
| 派出机构    | object | -  |
| 备案日期    | object | -  |

### stock_add_stock
- **文档定位**：基本面数据 / 股票增发
- **HTTP**：`GET /api/public/stock_add_stock`
- **调用**：运行 `scripts/aktools_get.py stock_add_stock --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://vip.stock.finance.sina.com.cn/corp/go.php/vISSUE_AddStock/stockid/600004.phtml

描述: 新浪财经-发行与分配-增发

限量: 单次指定 symbol 的股票增发详情数据

输入参数

| 名称     | 类型  | 描述                    |
|--------|-----|-----------------------|
| symbol | str | symbol="600004"; 股票代码 |

输出参数

| 名称         | 类型     | 描述 |
|------------|--------|----|
| 公告日期       | object | -  |
| 发行方式       | object | -  |
| 发行价格       | object | -  |
| 实际公司募集资金总额 | object | -  |
| 发行费用总额     | object | -  |
| 实际发行数量     | object | -  |

### stock_restricted_release_queue_sina
- **文档定位**：基本面数据 / 限售解禁 / 个股限售解禁-新浪
- **HTTP**：`GET /api/public/stock_restricted_release_queue_sina`
- **调用**：运行 `scripts/aktools_get.py stock_restricted_release_queue_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://vip.stock.finance.sina.com.cn/q/go.php/vInvestConsult/kind/xsjj/index.phtml?symbol=sh600000

描述: 新浪财经-发行分配-限售解禁

限量: 单次获取指定 symbol 的限售解禁数据

输入参数

| 名称     | 类型  | 描述                    |
|--------|-----|-----------------------|
| symbol | str | symbol="600000"; 股票代码 |

输出参数

| 名称      | 类型      | 描述       |
|---------|---------|----------|
| 代码      | object  | -        |
| 名称      | object  | -        |
| 解禁日期    | object  | -        |
| 解禁数量    | float64 | 注意单位: 万股 |
| 解禁股流通市值 | float64 | 注意单位: 亿元 |
| 上市批次    | int64   | -        |
| 公告日期    | object  | -        |

### stock_restricted_release_summary_em
- **文档定位**：基本面数据 / 限售解禁 / 限售股解禁
- **HTTP**：`GET /api/public/stock_restricted_release_summary_em`
- **调用**：运行 `scripts/aktools_get.py stock_restricted_release_summary_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/dxf/marketStatistics.html?type=day&startdate=2022-11-08&enddate=2022-12-19

描述: 东方财富网-数据中心-特色数据-限售股解禁

限量: 单次获取指定 symbol 在近期限售股解禁数据

输入参数

| 名称         | 类型  | 描述                                                                      |
|------------|-----|-------------------------------------------------------------------------|
| symbol     | str | symbol="全部股票"; choice of {"全部股票", "沪市A股", "科创板", "深市A股", "创业板", "京市A股"} |
| start_date | str | start_date="20221101"                                                   |
| end_date   | str | end_date="20221209"                                                     |

输出参数

| 名称         | 类型      | 描述      |
|------------|---------|---------|
| 序号         | int64   | -       |
| 解禁时间       | object  | -       |
| 当日解禁股票家数   | int64   | -       |
| 解禁数量       | float64 | 注意单位: 股 |
| 实际解禁数量     | float64 | 注意单位: 股 |
| 实际解禁市值     | int64   | 注意单位: 元 |
| 沪深300指数    | float64 | -       |
| 沪深300指数涨跌幅 | float64 | 注意单位: % |

### stock_restricted_release_detail_em
- **文档定位**：基本面数据 / 限售解禁 / 限售股解禁详情
- **HTTP**：`GET /api/public/stock_restricted_release_detail_em`
- **调用**：运行 `scripts/aktools_get.py stock_restricted_release_detail_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/dxf/detail.html

描述: 东方财富网-数据中心-限售股解禁-解禁详情一览

限量: 单次获取指定时间段限售股解禁数据

输入参数

| 名称         | 类型  | 描述                                                                      |
|------------|-----|-------------------------------------------------------------------------|
| start_date | str | start_date="20221202"                                                   |
| end_date   | str | end_date="20241202"                                                     |

输出参数

| 名称         | 类型      | 描述      |
|------------|---------|---------|
| 序号         | int64   | -       |
| 股票代码       | object  | -       |
| 股票简称       | object  | -       |
| 解禁时间       | object  | -       |
| 限售股类型      | object  | 注意单位: 股 |
| 解禁数量       | float64 | 注意单位: 股 |
| 实际解禁数量     | float64 | 注意单位: 股 |
| 实际解禁市值     | float64 | 注意单位: 元 |
| 占解禁前流通市值比例 | float64 | -       |
| 解禁前一交易日收盘价 | float64 | -       |
| 解禁前20日涨跌幅  | float64 | 注意单位: % |
| 解禁后20日涨跌幅  | float64 | 注意单位: % |

### stock_restricted_release_queue_em
- **文档定位**：基本面数据 / 限售解禁 / 解禁批次
- **HTTP**：`GET /api/public/stock_restricted_release_queue_em`
- **调用**：运行 `scripts/aktools_get.py stock_restricted_release_queue_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/dxf/q/600000.html

描述: 东方财富网-数据中心-个股限售解禁-解禁批次

限量: 单次获取指定 symbol 的解禁批次数据

输入参数

| 名称     | 类型  | 描述              |
|--------|-----|-----------------|
| symbol | str | symbol="600000" |

输出参数

| 名称         | 类型      | 描述      |
|------------|---------|---------|
| 序号         | int64   | -       |
| 解禁时间       | object  | -       |
| 解禁股东数      | int64   | -       |
| 解禁数量       | float64 | 注意单位: 股 |
| 实际解禁数量     | float64 | 注意单位: 股 |
| 未解禁数量      | int64   | 注意单位: 股 |
| 实际解禁数量市值   | float64 | 注意单位: 元 |
| 占总市值比例     | float64 | -       |
| 占流通市值比例    | float64 | -       |
| 解禁前一交易日收盘价 | float64 | 注意单位: 元 |
| 限售股类型      | object  | -       |
| 解禁前20日涨跌幅  | float64 | 注意单位: % |
| 解禁后20日涨跌幅  | float64 | 注意单位: % |

### stock_restricted_release_stockholder_em
- **文档定位**：基本面数据 / 限售解禁 / 解禁股东
- **HTTP**：`GET /api/public/stock_restricted_release_stockholder_em`
- **调用**：运行 `scripts/aktools_get.py stock_restricted_release_stockholder_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/dxf/q/600000.html

描述: 东方财富网-数据中心-个股限售解禁-解禁股东

限量: 单次获取指定 symbol 的解禁批次数据

输入参数

| 名称     | 类型  | 描述                                                                           |
|--------|-----|------------------------------------------------------------------------------|
| symbol | str | symbol="600000"                                                              |
| date   | str | date="20200904"; 通过 ak.stock_restricted_release_queue_em(symbol="600000") 获取 |

输出参数

| 名称      | 类型      | 描述      |
|---------|---------|---------|
| 序号      | int64   | -       |
| 股东名称    | object  | -       |
| 解禁数量    | int64   | 注意单位: 股 |
| 实际解禁数量  | int64   | 注意单位: 股 |
| 解禁市值    | float64 | 注意单位: 元 |
| 锁定期     | int64   | 注意单位: 月 |
| 剩余未解禁数量 | int64   | 注意单位: 股 |
| 限售股类型   | object  | -       |
| 进度      | object  | -       |

### stock_circulate_stock_holder
- **文档定位**：基本面数据 / 流通股东
- **HTTP**：`GET /api/public/stock_circulate_stock_holder`
- **调用**：运行 `scripts/aktools_get.py stock_circulate_stock_holder --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://vip.stock.finance.sina.com.cn/corp/go.php/vCI_CirculateStockHolder/stockid/600000.phtml

描述: 新浪财经-股东股本-流通股东

限量: 单次获取指定 symbol 的流通股东数据

输入参数

| 名称     | 类型  | 描述                    |
|--------|-----|-----------------------|
| symbol | str | symbol="600000"; 股票代码 |

输出参数

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| 截止日期   | object  | -       |
| 公告日期   | object  | -       |
| 编号     | int64   | -       |
| 股东名称   | object  | -       |
| 持股数量   | int64   | 注意单位: 股 |
| 占流通股比例 | float64 | 注意单位: % |
| 股本性质   | object  | -       |

### stock_sector_spot
- **文档定位**：基本面数据 / 板块行情
- **HTTP**：`GET /api/public/stock_sector_spot`
- **调用**：运行 `scripts/aktools_get.py stock_sector_spot --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://finance.sina.com.cn/stock/sl/

描述: 新浪行业-板块行情

限量: 单次获取指定的板块行情实时数据

输入参数

| 名称        | 类型  | 描述                                                              |
|-----------|-----|-----------------------------------------------------------------|
| indicator | str | indicator="新浪行业"; choice of {"新浪行业", "启明星行业", "概念", "地域", "行业"} |

输出参数

| 名称     | 类型      | 描述       |
|--------|---------|----------|
| label  | object  | -        |
| 板块     | object  | -        |
| 公司家数   | int64   | -        |
| 平均价格   | float64 | -        |
| 涨跌额    | float64 | -        |
| 涨跌幅    | float64 | 注意单位: %  |
| 总成交量   | int64   | 注意单位: 手  |
| 总成交额   | int64   | 注意单位: 万元 |
| 股票代码   | object  | -        |
| 个股-涨跌幅 | float64 | 注意单位: %  |
| 个股-当前价 | float64 | -        |
| 个股-涨跌额 | float64 | -        |
| 股票名称   | object  | -        |

### stock_sector_detail
- **文档定位**：基本面数据 / 板块详情
- **HTTP**：`GET /api/public/stock_sector_detail`
- **调用**：运行 `scripts/aktools_get.py stock_sector_detail --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://finance.sina.com.cn/stock/sl/#area_1

描述: 新浪行业-板块行情-成份详情, 由于新浪网页提供的统计数据有误, 部分行业数量大于统计数

限量: 单次获取指定的新浪行业-板块行情-成份详情

输入参数

| 名称     | 类型  | 描述                                                                        |
|--------|-----|---------------------------------------------------------------------------|
| sector | str | sector="hangye_ZL01"; 通过 **ak.stock_sector_spot** 返回数据的 label 字段选择 sector |

输出参数

| 名称            | 类型      | 描述  |
|---------------|---------|-----|
| symbol        | object  | -   |
| code          | object  | -   |
| name          | object  | -   |
| trade         | float64 | -   |
| pricechange   | float64 | -   |
| changepercent | float64 | -   |
| buy           | float64 | -   |
| sell          | float64 | -   |
| settlement    | float64 | -   |
| open          | float64 | -   |
| high          | float64 | -   |
| low           | float64 | -   |
| volume        | int64   | -   |
| amount        | int64   | -   |
| ticktime      | object  | -   |
| per           | float64 | -   |
| pb            | float64 | -   |
| mktcap        | float64 | -   |
| nmc           | float64 | -   |
| turnoverratio | float64 | -   |

### stock_info_a_code_name
- **文档定位**：基本面数据 / 股票列表-A股
- **HTTP**：`GET /api/public/stock_info_a_code_name`
- **调用**：运行 `scripts/aktools_get.py stock_info_a_code_name --param key=value`；参数以本卡的输入参数表为准。

目标地址: 沪深京三个交易所

描述: 沪深京 A 股股票代码和股票简称数据

限量: 单次获取所有 A 股股票代码和简称数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型     | 描述  |
|------|--------|-----|
| code | object | -   |
| name | object | -   |
