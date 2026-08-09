# 中国宏观



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### macro_china_international_tourism_fx
- **文档定位**：中国宏观 / 金融指标 / 国际旅游外汇收入构成
- **HTTP**：`GET /api/public/macro_china_international_tourism_fx`
- **调用**：运行 `scripts/aktools_get.py macro_china_international_tourism_fx --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://finance.sina.com.cn/mac/#industry-15-0-31-3

描述: 国家统计局-国际旅游外汇收入构成

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称   | 类型      | 描述         |
|------|---------|------------|
| 统计年度 | object  | 年          |
| 指标   | object  | -          |
| 数量   | float64 | 注意单位: 百万美元 |
| 比重   | float64 | 注意单位: %    |

### macro_china_passenger_load_factor
- **文档定位**：中国宏观 / 金融指标 / 民航客座率及载运率
- **HTTP**：`GET /api/public/macro_china_passenger_load_factor`
- **调用**：运行 `scripts/aktools_get.py macro_china_passenger_load_factor --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://finance.sina.com.cn/mac/#industry-20-0-31-1

描述: 国家统计局-民航客座率及载运率

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 统计年度 | object  | 年月      |
| 客座率  | float64 | 注意单位: % |
| 载运率  | float64 | 注意单位: % |

### macro_china_freight_index
- **文档定位**：中国宏观 / 金融指标 / 航贸运价指数
- **HTTP**：`GET /api/public/macro_china_freight_index`
- **调用**：运行 `scripts/aktools_get.py macro_china_freight_index --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://finance.sina.com.cn/mac/#industry-22-0-31-2

描述: 新浪财经-中国宏观经济数据-航贸运价指数

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称                | 类型      | 描述 |
|-------------------|---------|----|
| 截止日期              | object  | 年月 |
| 波罗的海好望角型船运价指数BCI  | float64 | -  |
| 灵便型船综合运价指数BHMI    | float64 | -  |
| 波罗的海超级大灵便型船BSI指数  | float64 | -  |
| 波罗的海综合运价指数BDI     | float64 | -  |
| HRCI国际集装箱租船指数     | float64 | -  |
| 油轮运价指数成品油运价指数BCTI | float64 | -  |
| 油轮运价指数原油运价指数BDTI  | float64 | -  |

### macro_china_central_bank_balance
- **文档定位**：中国宏观 / 金融指标 / 央行货币当局资产负债
- **HTTP**：`GET /api/public/macro_china_central_bank_balance`
- **调用**：运行 `scripts/aktools_get.py macro_china_central_bank_balance --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://finance.sina.com.cn/mac/#fininfo-8-0-31-2

描述: 新浪财经-中国宏观经济数据-央行货币当局资产负债

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称         | 类型      | 描述       |
|------------|---------|----------|
| 统计时间       | object  | 年月       |
| 国外资产       | float64 | 注意单位: 亿元 |
| 外汇         | float64 | 注意单位: 亿元 |
| 货币黄金       | float64 | 注意单位: 亿元 |
| 其他国外资产     | float64 | 注意单位: 亿元 |
| 对政府债权      | float64 | 注意单位: 亿元 |
| 其中:中央政府    | float64 | 注意单位: 亿元 |
| 对其他存款性公司债权 | float64 | 注意单位: 亿元 |
| 对其他金融性公司债权 | float64 | 注意单位: 亿元 |
| 对非货币金融机构债权 | float64 | 注意单位: 亿元 |
| 对非金融性公司债权  | float64 | 注意单位: 亿元 |
| 其他资产       | float64 | 注意单位: 亿元 |
| 总资产        | float64 | 注意单位: 亿元 |
| 储备货币       | float64 | 注意单位: 亿元 |
| 发行货币       | float64 | 注意单位: 亿元 |
| 金融性公司存款    | float64 | 注意单位: 亿元 |
| 其他存款性公司    | float64 | 注意单位: 亿元 |
| 其他金融性公司    | float64 | 注意单位: 亿元 |
| 对金融机构负债    | float64 | 注意单位: 亿元 |
| 准备金存款      | float64 | 注意单位: 亿元 |
| 非金融性公司存款   | float64 | 注意单位: 亿元 |
| 活期存款       | float64 | 注意单位: 亿元 |
| 债券         | float64 | 注意单位: 亿元 |
| 国外负债       | float64 | 注意单位: 亿元 |
| 政府存款       | float64 | 注意单位: 亿元 |
| 自有资金       | float64 | 注意单位: 亿元 |
| 其他负债       | float64 | 注意单位: 亿元 |
| 总负债        | float64 | 注意单位: 亿元 |

### macro_china_insurance
- **文档定位**：中国宏观 / 金融指标 / 保险业经营情况
- **HTTP**：`GET /api/public/macro_china_insurance`
- **调用**：运行 `scripts/aktools_get.py macro_china_insurance --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://finance.sina.com.cn/mac/#fininfo-19-0-31-3

描述: 新浪财经-中国宏观经济数据-保险业经营情况

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称               | 类型      | 描述       |
|------------------|---------|----------|
| 统计时间             | object  | 年月       |
| 省市地区             | object  | 地区       |
| 原保险保费收入          | float64 | 注意单位: 万元 |
| 财产险保费收入          | float64 | 注意单位: 万元 |
| 人身险保费收入          | float64 | 注意单位: 万元 |
| 人身险-寿险保费收入       | float64 | 注意单位: 万元 |
| 人身险-健康险保费收入      | float64 | 注意单位: 万元 |
| 人身险-意外险保费收入      | float64 | 注意单位: 万元 |
| 养老保险公司企业年金缴费     | float64 | 注意单位: 万元 |
| 原保险赔付支出          | float64 | 注意单位: 万元 |
| 财产险保费赔付支出        | float64 | 注意单位: 万元 |
| 人身险保费赔付支出        | float64 | 注意单位: 万元 |
| 人身险-寿险赔付支出       | float64 | 注意单位: 万元 |
| 人身险-健康险赔付支出      | float64 | 注意单位: 万元 |
| 人身险-意外险赔付支出      | float64 | 注意单位: 万元 |
| 业务及管理费           | float64 | 注意单位: 万元 |
| 银行存款             | float64 | 注意单位: 万元 |
| 投资               | float64 | 注意单位: 万元 |
| 资产总额             | float64 | 注意单位: 万元 |
| 养老保险公司企业年金受托管理资产 | float64 | 注意单位: 万元 |
| 养老保险公司企业年金投资管理资产 | float64 | 注意单位: 万元 |

### macro_china_supply_of_money
- **文档定位**：中国宏观 / 金融指标 / 货币供应量
- **HTTP**：`GET /api/public/macro_china_supply_of_money`
- **调用**：运行 `scripts/aktools_get.py macro_china_supply_of_money --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://finance.sina.com.cn/mac/#fininfo-1-0-31-1

描述: 新浪财经-中国宏观经济数据-货币供应量

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称                 | 类型      | 描述       |
|--------------------|---------|----------|
| 统计时间               | object  | 年月       |
| 货币和准货币（广义货币M2）     | float64 | 注意单位: 亿元 |
| 货币和准货币（广义货币M2）同比增长 | float64 | 注意单位: %  |
| 货币(狭义货币M1)         | float64 | 注意单位: 亿元 |
| 货币(狭义货币M1)同比增长     | float64 | 注意单位: %  |
| 流通中现金(M0)          | float64 | 注意单位: 亿元 |
| 流通中现金(M0)同比增长      | float64 | 注意单位: %  |
| 活期存款               | float64 | 注意单位: 亿元 |
| 活期存款同比增长           | float64 | 注意单位: %  |
| 准货币                | float64 | 注意单位: 亿元 |
| 准货币同比增长            | float64 | 注意单位: %  |
| 定期存款               | float64 | 注意单位: 亿元 |
| 定期存款同比增长           | float64 | 注意单位: %  |
| 储蓄存款出              | float64 | 注意单位: 亿元 |
| 储蓄存款同比增长           | float64 | 注意单位: %  |
| 其他存款               | float64 | 注意单位: 亿元 |
| 其他存款同比增长           | float64 | 注意单位: %  |

### macro_china_swap_rate
- **文档定位**：中国宏观 / 金融指标 / FR007利率互换曲线历史数据
- **HTTP**：`GET /api/public/macro_china_swap_rate`
- **调用**：运行 `scripts/aktools_get.py macro_china_swap_rate --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.chinamoney.com.cn/chinese/bkcurvfxhis/?cfgItemType=72&curveType=FR007

描述: 国家统计局-FR007利率互换曲线历史数据

限量: 单次返回所有历史数据, 该接口只能获取近一年的数据的数据，其中每次只能获取一个月的数据

输入参数

| 名称         | 类型  | 描述                           |
|------------|-----|------------------------------|
| start_date | str | start_date="20231128"；注意时间间隔 |
| end_date   | str | end_date="20231130"          |

输出参数

| 名称   | 类型      | 描述  |
|------|---------|-----|
| 日期   | object  | -   |
| 曲线名称 | object  | -   |
| 时刻   | object  | -   |
| 价格类型 | object  | -   |
| 1M   | float64 | -   |
| 3M   | float64 | -   |
| 6M   | float64 | -   |
| 9M   | float64 | -   |
| 1Y   | float64 | -   |
| 2Y   | float64 | -   |
| 3Y   | float64 | -   |
| 4Y   | float64 | -   |
| 5Y   | float64 | -   |
| 7Y   | float64 | -   |
| 10Y  | float64 | -   |

### macro_china_foreign_exchange_gold
- **文档定位**：中国宏观 / 金融指标 / 央行黄金和外汇储备
- **HTTP**：`GET /api/public/macro_china_foreign_exchange_gold`
- **调用**：运行 `scripts/aktools_get.py macro_china_foreign_exchange_gold --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://finance.sina.com.cn/mac/#fininfo-5-0-31-2

描述: 国家统计局-央行黄金和外汇储备, 比东财接口数据时间长

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称     | 类型      | 描述        |
|--------|---------|-----------|
| 统计时间   | object  | 年月        |
| 黄金储备   | float64 | 注意单位: 万盎司 |
| 国家外汇储备 | float64 | 注意单位: 亿美元 |

### macro_china_retail_price_index
- **文档定位**：中国宏观 / 金融指标 / 商品零售价格指数
- **HTTP**：`GET /api/public/macro_china_retail_price_index`
- **调用**：运行 `scripts/aktools_get.py macro_china_retail_price_index --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://finance.sina.com.cn/mac/#price-12-0-31-1

描述: 国家统计局-商品零售价格指数

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称       | 类型      | 描述 |
|----------|---------|----|
| 统计月份     | object  | 年月 |
| 居民消费项目   | object  | -  |
| 零售商品价格指数 | float64 | -  |

### macro_china_real_estate
- **文档定位**：中国宏观 / 金融指标 / 国房景气指数
- **HTTP**：`GET /api/public/macro_china_real_estate`
- **调用**：运行 `scripts/aktools_get.py macro_china_real_estate --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/cjsj/hyzs_list_EMM00121987.html

描述: 国家统计局-国房景气指数

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述  |
|--------|---------|-----|
| 日期     | object  | -   |
| 最新值    | float64 | -   |
| 涨跌幅    | float64 | -   |
| 近3月涨跌幅 | float64 | -   |
| 近6月涨跌幅 | float64 | -   |
| 近1年涨跌幅 | float64 | -   |
| 近2年涨跌幅 | float64 | -   |
| 近3年涨跌幅 | float64 | -   |

### macro_china_fx_gold
- **文档定位**：中国宏观 / 金融指标 / 外汇和黄金储备
- **HTTP**：`GET /api/public/macro_china_fx_gold`
- **调用**：运行 `scripts/aktools_get.py macro_china_fx_gold --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/cjsj/hjwh.html

描述: 中国外汇和黄金储备, 数据区间从 200801 至今, 月度数据

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称        | 类型      | 描述        |
|-----------|---------|-----------|
| 月份        | object  | 年度和月份     |
| 黄金储备-数值   | float64 | 注意单位: 万盎司 |
| 黄金储备-同比   | float64 | 注意单位: 万盎司 |
| 黄金储备-环比   | float64 | 注意单位: 万盎司 |
| 国家外汇储备-数值 | float64 | 注意单位: 亿美元 |
| 国家外汇储备-同比 | float64 | 注意单位: 亿美元 |
| 国家外汇储备-环比 | float64 | 注意单位: 亿美元 |

### macro_china_money_supply
- **文档定位**：中国宏观 / 金融指标 / 中国货币供应量
- **HTTP**：`GET /api/public/macro_china_money_supply`
- **调用**：运行 `scripts/aktools_get.py macro_china_money_supply --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/cjsj/hbgyl.html

描述: 东方财富-经济数据-中国宏观-中国货币供应量; 数据区间从 200801 至今, 月度数据

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称                | 类型      | 描述    |
|-------------------|---------|-------|
| 月份                | object  | 年度和月份 |
| 货币和准货币(M2)-数量(亿元) | float64 | -     |
| 货币和准货币(M2)-同比增长   | float64 | -     |
| 货币和准货币(M2)-环比增长   | float64 | -     |
| 货币(M1)-数量(亿元)     | float64 | -     |
| 货币(M1)-同比增长       | float64 | -     |
| 货币(M1)-环比增长       | float64 | -     |
| 流通中的现金(M0)-数量(亿元) | float64 | -     |
| 流通中的现金(M0)-同比增长   | float64 | -     |
| 流通中的现金(M0)-环比增长   | float64 | -     |

### macro_china_stock_market_cap
- **文档定位**：中国宏观 / 金融指标 / 全国股票交易统计表
- **HTTP**：`GET /api/public/macro_china_stock_market_cap`
- **调用**：运行 `scripts/aktools_get.py macro_china_stock_market_cap --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/cjsj/gpjytj.html

描述: 全国股票交易统计表, 数据区间从 200801 至今, 月度数据

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称            | 类型      | 描述       |
|---------------|---------|----------|
| 数据日期          | object  | 年度和月份    |
| 发行总股本-上海      | float64 | 注意单位: 亿元 |
| 发行总股本-深圳      | float64 | 注意单位: 亿元 |
| 市价总值-上海       | float64 | 注意单位: 亿元 |
| 市价总值-深圳       | float64 | 注意单位: 亿元 |
| 成交金额-上海       | float64 | 注意单位: 亿元 |
| 成交金额-深圳       | float64 | 注意单位: 亿元 |
| 成交量-上海        | float64 | -        |
| 成交量-深圳        | float64 | -        |
| A股最高综合股价指数-上海 | float64 | -        |
| A股最高综合股价指数-深圳 | float64 | -        |
| A股最低综合股价指数-上海 | float64 | -        |
| A股最低综合股价指数-深圳 | float64 | -        |

### macro_china_shibor_all
- **文档定位**：中国宏观 / 金融指标 / 上海银行业同业拆借报告
- **HTTP**：`GET /api/public/macro_china_shibor_all`
- **调用**：运行 `scripts/aktools_get.py macro_china_shibor_all --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_shibor

描述: 上海银行业同业拆借报告, 数据区间从 20170317-至今

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称      | 类型      | 默 描述  |
|---------|---------|-------|
| 日期      | object  | -     |
| O/N-定价  | float64 | -     |
| O/N-涨跌幅 | float64 | 单位: 点 |
| 1W-定价   | float64 | -     |
| 1W-涨跌幅  | float64 | 单位: 点 |
| 2W-定价   | float64 | -     |
| 2W-涨跌幅  | float64 | 单位: 点 |
| 1M-定价   | float64 | -     |
| 1M-涨跌幅  | float64 | 单位: 点 |
| 3M-定价   | float64 | -     |
| 3M-涨跌幅  | float64 | 单位: 点 |
| 6M-定价   | float64 | -     |
| 6M-涨跌幅  | float64 | 单位: 点 |
| 9M-定价   | float64 | -     |
| 9M-涨跌幅  | float64 | 单位: 点 |
| 1Y-定价   | float64 | -     |
| 1Y-涨跌幅  | float   | 单位: 点 |
| ON-定价   | float64 | -     |
| ON-涨跌幅  | float64 | 单位: 点 |
| 2M-定价   | float64 | -     |
| 2M-涨跌幅  | float64 | 单位: 点 |

### macro_china_hk_market_info
- **文档定位**：中国宏观 / 金融指标 / 人民币香港银行同业拆息
- **HTTP**：`GET /api/public/macro_china_hk_market_info`
- **调用**：运行 `scripts/aktools_get.py macro_china_hk_market_info --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_hk_market_info

描述: 香港同业拆借报告, 数据区间从 20170320-至今

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称      | 类型      | 描述    |
|---------|---------|-------|
| 日期      | object  | 日期    |
| O/N-定价  | float64 | -     |
| O/N-涨跌幅 | float64 | 单位: 点 |
| 1W-定价   | float64 | -     |
| 1W-涨跌幅  | float64 | 单位: 点 |
| 2W-定价   | float64 | -     |
| 2W-涨跌幅  | float64 | 单位: 点 |
| 1M-定价   | float64 | -     |
| 1M-涨跌幅  | float64 | 单位: 点 |
| 3M-定价   | float64 | -     |
| 3M-涨跌幅  | float64 | 单位: 点 |
| 6M-定价   | float64 | -     |
| 6M-涨跌幅  | float64 | 单位: 点 |
| 9M-定价   | float64 | -     |
| 9M-涨跌幅  | float64 | 单位: 点 |
| 1Y-定价   | float64 | -     |
| 1Y-涨跌幅  | float64 | 单位: 点 |
| ON-定价   | float64 | -     |
| ON-涨跌幅  | float64 | 单位: 点 |
| 2M-定价   | float64 | -     |
| 2M-涨跌幅  | float64 | 单位: 点 |

### macro_china_daily_energy
- **文档定位**：中国宏观 / 其他指标 / 中国日度沿海六大电库存
- **HTTP**：`GET /api/public/macro_china_daily_energy`
- **调用**：运行 `scripts/aktools_get.py macro_china_daily_energy --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_qihuo_energy_report

描述: 中国日度沿海六大电库存数据, 数据区间从20160101-至今, 不再更新, 只能获得历史数据

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称      | 类型      | 描述 |
|---------|---------|----|
| 日期      | object  | -  |
| 沿海六大电库存 | float64 | -  |
| 日耗      | float64 | -  |
| 存煤可用天数  | float64 | -  |

### macro_china_rmb
- **文档定位**：中国宏观 / 其他指标 / 人民币汇率中间价报告
- **HTTP**：`GET /api/public/macro_china_rmb`
- **调用**：运行 `scripts/aktools_get.py macro_china_rmb --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_rmb_data

描述: 中国人民币汇率中间价报告, 数据区间从 20170103-20210513

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称              | 类型      | 描述     |
|-----------------|---------|--------|
| 日期              | object  | 日期     |
| 美元/人民币_中间价      | float64 | -      |
| 美元/人民币_涨跌幅      | float64 | 单位: 点  |
| 欧元/人民币_中间价      | float64 | -      |
| 欧元/人民币_涨跌幅      | float64 | 单位: 点  |
| 100日元/人民币_中间价   | float64 | -      |
| 100日元/人民币_涨跌幅   | float64 | 单位: 点对 |
| 港元/人民币_中间价      | float64 | -      |
| 港元/人民币_涨跌幅      | float64 | 单位: 点  |
| 英镑/人民币_中间价      | float64 | -      |
| 英镑/人民币_涨跌幅      | float64 | 单位: 点  |
| 澳元/人民币_中间价      | float64 | -      |
| 澳元/人民币_涨跌幅      | float64 | 单位: 点  |
| 新西兰元/人民币_中间价    | float64 | -      |
| 新西兰元/人民币_涨跌幅    | float64 | 单位: 点  |
| 新加坡元/人民币_中间价    | float64 | -      |
| 新加坡元/人民币_涨跌幅    | float64 | 单位: 点  |
| 瑞郎/人民币_中间价      | float64 | -      |
| 瑞郎/人民币_涨跌幅      | float64 | 单位: 点  |
| 加元/人民币_中间价      | float64 | -      |
| 加元/人民币_涨跌幅      | float64 | 单位: 点  |
| 人民币/马来西亚林吉特_中间价 | float64 | -      |
| 人民币/马来西亚林吉特_涨跌幅 | float64 | 单位: 点  |
| 人民币/俄罗斯卢布_中间价   | float64 | -      |
| 人民币/俄罗斯卢布_涨跌幅   | float64 | 单位: 点  |
| 人民币/南非兰特_中间价    | float64 | -      |
| 人民币/南非兰特_涨跌幅    | float64 | 单位: 点  |
| 人民币/韩元_中间价      | float64 | -      |
| 人民币/韩元_涨跌幅      | float64 | 单位: 点  |
| 人民币/阿联酋迪拉姆_中间价  | float64 | -      |
| 人民币/阿联酋迪拉姆_涨跌幅  | float64 | 单位: 点  |
| 人民币/沙特里亚尔_中间价   | float64 | -      |
| 人民币/沙特里亚尔_涨跌幅   | float64 | 单位: 点  |
| 人民币/匈牙利福林_中间价   | float64 | -      |
| 人民币/匈牙利福林_涨跌幅   | float64 | 单位: 点  |
| 人民币/波兰兹罗提_中间价   | float64 | -      |
| 人民币/波兰兹罗提_涨跌幅   | float64 | 单位: 点  |
| 人民币/丹麦克朗_中间价    | float64 | -      |
| 人民币/丹麦克朗_涨跌幅    | float64 | 单位: 点  |
| 人民币/瑞典克朗_中间价    | float64 | -      |
| 人民币/瑞典克朗_涨跌幅    | float64 | 单位: 点  |
| 人民币/丹麦克朗_中间价    | float64 | -      |
| 人民币/丹麦克朗_涨跌幅    | float64 | 单位: 点  |
| 人民币/挪威克朗_中间价    | float64 | -      |
| 人民币/挪威克朗_涨跌幅    | float64 | 单位: 点  |
| 人民币/土耳其里拉_中间价   | float64 | -      |
| 人民币/土耳其里拉_涨跌幅   | float64 | 单位: 点  |
| 人民币/墨西哥比索_中间价   | float64 | -      |
| 人民币/墨西哥比索_涨跌幅   | float64 | 单位: 点  |
| 人民币/泰铢_中间价      | float64 | -      |
| 人民币/泰铢_涨跌幅      | float64 | 单位: 点  |

### macro_china_market_margin_sz
- **文档定位**：中国宏观 / 其他指标 / 深圳融资融券报告
- **HTTP**：`GET /api/public/macro_china_market_margin_sz`
- **调用**：运行 `scripts/aktools_get.py macro_china_market_margin_sz --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_market_margin_sz

描述: 深圳融资融券报告, 数据区间从 20100331-至今

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| 日期     | object  | -       |
| 融资买入额  | float64 | 注意单位: 元 |
| 融资余额   | float64 | 注意单位: 元 |
| 融券卖出量  | float64 | 注意单位: 股 |
| 融券余量   | float64 | 注意单位: 股 |
| 融券余额   | float64 | 注意单位: 元 |
| 融资融券余额 | float64 | 注意单位: 元 |

### macro_china_market_margin_sh
- **文档定位**：中国宏观 / 其他指标 / 上海融资融券报告
- **HTTP**：`GET /api/public/macro_china_market_margin_sh`
- **调用**：运行 `scripts/aktools_get.py macro_china_market_margin_sh --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_market_margin_sse

描述: 上海融资融券报告, 数据区间从 20100331-至今

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型     | 描述     |
|--------|--------|--------|
| 日期     | object | 日期     |
| 融资余额   | int64  | 注意单位：元 |
| 融资买入额  | int64  | 注意单位：元 |
| 融券余量   | int64  | 注意单位：股 |
| 融券余额   | int64  | 注意单位：元 |
| 融券卖出量  | int64  | 注意单位：股 |
| 融资融券余额 | int64  | 注意单位：元 |

### macro_china_au_report
- **文档定位**：中国宏观 / 其他指标 / 上海黄金交易所报告
- **HTTP**：`GET /api/public/macro_china_au_report`
- **调用**：运行 `scripts/aktools_get.py macro_china_au_report --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_sge_report

描述: 上海黄金交易所报告, 数据区间从 20140905-至今

限量: 单次返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述  |
|-------|---------|-----|
| 日期    | object  | -   |
| 商品    | object  | -   |
| 开盘价   | float64 | -   |
| 最高价   | float64 | -   |
| 最低价   | float64 | -   |
| 收盘价   | float64 | -   |
| 涨跌    | float64 | -   |
| 涨跌幅   | float64 | -   |
| 加权平均价 | float64 | -   |
| 成交量   | float64 | -   |
| 成交金额  | float64 | -   |
| 持仓量   | float64 | -   |
| 交收方向  | object  | -   |
| 交收量   | float64 | -   |

### macro_china_nbs_nation
- **文档定位**：中国宏观 / 国家统计局通用接口 / 国家统计局全国数据
- **HTTP**：`GET /api/public/macro_china_nbs_nation`
- **调用**：运行 `scripts/aktools_get.py macro_china_nbs_nation --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.stats.gov.cn/dg/website/page.html#/pc/national/yearData

描述: 国家统计局全国数据通用接口，包括月度数据、季度数据、年度数据，具体指标见国家统计局新站官网。

限量: 根据参数返回指定数据

输入参数

| 名称     | 类型  | 描述                                                                                                                                                 |
|--------|-----|----------------------------------------------------------------------------------------------------------------------------------------------------|
| kind   | str | 数据类别，包括：月度数据、季度数据、年度数据。                                                                                                                            |
| path   | str | 数据路径， 需与kind参数匹配，具体见官网，多层级之间使用  > 连接 。<br> 示例：<br>    国民经济核算 > 支出法国内生产总值<br>   人口 > 总人口<br>   金融业 > 保险系统机构、人员数 > 保险系统机构数                           |
| period | str | 时间区间 <br/>参考格式如下(英文逗号分割，且不能有多余空格)：<br/>    月：201201,201205<br/>    季：2012A,2012B,2012C,2012D<br/>    年：2012,2013 <br>    至今：2013-<br>    最近：last10；接口内部会自动兼容新站时间编码 |

输出参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

### macro_china_nbs_region
- **文档定位**：中国宏观 / 国家统计局通用接口 / 国家统计局地区数据
- **HTTP**：`GET /api/public/macro_china_nbs_region`
- **调用**：运行 `scripts/aktools_get.py macro_china_nbs_region --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.stats.gov.cn/dg/website/page.html#/pc/national/fsYearData

描述: 国家统计局地区数据通用接口，包括分省月度数据、分省季度数据、分省年度数据、主要城市月度价格、主要城市年度数据、港澳台月度数据、港澳台年度数据，具体指标见国家统计局新站官网。

限量: 根据参数返回指定数据

输入参数

| 名称        | 类型               | 描述                                                                                                                                                |
|-----------|------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| kind      | str              | 数据类别，包括：分省月度数据、分省季度数据、分省年度数据、主要城市月度价格、主要城市年度数据、港澳台月度数据、港澳台年度数据。                                                                                   |
| path      | str              | 数据路径， 需与kind匹配，具体见官网，多层级之间使用  > 连接 。<br> 示例：<br>   国民经济核算 > 地区生产总值<br>   财政 > 地方财政收入                                                              |
| indicator | Union[str, None] | 指定指标，表示在当前path下可选择的指标。在指定region参数的情况下，此参数可以设置为None，此时将获取指定地区下所有可选指标的值。indicator和region参数不能同时为None。                                                |
| region    | Union[str, None] | 指定地区，为可选指标。指定时表示仅获取当前地区下的数据。                                                                                                                      |
| period    | str              | 时间区间<br/>参考格式如下(英文逗号分割，且不能有多余空格)：<br/>    月：201201,201205<br/>    季：2012A,2012B,2012C,2012D<br/>    年：2012,2013 <br>    至今：2013-<br>    最近：last10；接口内部会自动兼容新站时间编码 |

输出参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

### macro_stock_finance
- **文档定位**：中国宏观 / 金融市场 / 股票筹资
- **HTTP**：`GET /api/public/macro_stock_finance`
- **调用**：运行 `scripts/aktools_get.py macro_stock_finance --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.10jqka.com.cn/macro/finance/

描述: 同花顺-数据中心-宏观数据-股票筹资

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称     | 类型      | 描述 |
|--------|---------|----|
| 月份     | object  | -  |
| 募集资金   | float64 | -  |
| 首发募集资金 | float64 | -  |
| 增发募集资金 | float64 | -  |
| 配股募集资金 | float64 | -  |

### macro_rmb_loan
- **文档定位**：中国宏观 / 金融市场 / 新增人民币贷款
- **HTTP**：`GET /api/public/macro_rmb_loan`
- **调用**：运行 `scripts/aktools_get.py macro_rmb_loan --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.10jqka.com.cn/macro/loan/

描述: 同花顺-数据中心-宏观数据-新增人民币贷款

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称         | 类型      | 描述 |
|------------|---------|----|
| 月份         | object  | -  |
| 新增人民币贷款-总额 | float64 | -  |
| 新增人民币贷款-同比 | object  | -  |
| 新增人民币贷款-环比 | object  | -  |
| 累计人民币贷款-总额 | float64 | -  |
| 累计人民币贷款-同比 | object  | -  |

### macro_rmb_deposit
- **文档定位**：中国宏观 / 金融市场 / 人民币存款余额
- **HTTP**：`GET /api/public/macro_rmb_deposit`
- **调用**：运行 `scripts/aktools_get.py macro_rmb_deposit --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.10jqka.com.cn/macro/rmb/

描述: 同花顺-数据中心-宏观数据-人民币存款余额

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称        | 类型      | 描述 |
|-----------|---------|----|
| 月份        | object  | -  |
| 新增存款-数量   | float64 | -  |
| 新增存款-同比   | object  | -  |
| 新增存款-环比   | object  | -  |
| 新增企业存款-数量 | float64 | -  |
| 新增企业存款-同比 | object  | -  |
| 新增企业存款-环比 | object  | -  |
| 新增储蓄存款-数量 | float64 | -  |
| 新增储蓄存款-同比 | object  | -  |
| 新增储蓄存款-环比 | object  | -  |
| 新增其他存款-数量 | float64 | -  |
| 新增其他存款-同比 | object  | -  |
| 新增其他存款-环比 | object  | -  |
