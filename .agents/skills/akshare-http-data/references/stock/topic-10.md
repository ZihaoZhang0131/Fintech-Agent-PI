# 年报季报



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### stock_yjbb_em
- **文档定位**：年报季报 / 业绩报表
- **HTTP**：`GET /api/public/stock_yjbb_em`
- **调用**：运行 `scripts/aktools_get.py stock_yjbb_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/bbsj/202003/yjbb.html

描述: 东方财富-数据中心-年报季报-业绩报表

限量: 单次获取指定 date 的业绩报告数据

输入参数

| 名称   | 类型  | 描述                                                                                         |
|------|-----|--------------------------------------------------------------------------------------------|
| date | str | date="20200331"; choice of {"XXXX0331", "XXXX0630", "XXXX0930", "XXXX1231"}; 从 20100331 开始 |

输出参数

| 名称           | 类型      | 描述      |
|--------------|---------|---------|
| 序号           | int64   | -       |
| 股票代码         | object  | -       |
| 股票简称         | object  | -       |
| 每股收益         | float64 | 注意单位: 元 |
| 营业总收入-营业总收入  | float64 | 注意单位: 元 |
| 营业总收入-同比增长   | float64 | 注意单位: % |
| 营业总收入-季度环比增长 | float64 | 注意单位: % |
| 净利润-净利润      | float64 | 注意单位: 元 |
| 净利润-同比增长     | float64 | 注意单位: % |
| 净利润-季度环比增长   | float64 | 注意单位: % |
| 每股净资产        | float64 | 注意单位: 元 |
| 净资产收益率       | float64 | 注意单位: % |
| 每股经营现金流量     | float64 | 注意单位: 元 |
| 销售毛利率        | float64 | 注意单位: % |
| 所处行业         | object  | -       |
| 最新公告日期       | object  | -       |

### stock_yjkb_em
- **文档定位**：年报季报 / 业绩快报
- **HTTP**：`GET /api/public/stock_yjkb_em`
- **调用**：运行 `scripts/aktools_get.py stock_yjkb_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/bbsj/202003/yjkb.html

描述: 东方财富-数据中心-年报季报-业绩快报

限量: 单次获取指定 date 的业绩快报数据

输入参数

| 名称   | 类型  | 描述                                                                                         |
|------|-----|--------------------------------------------------------------------------------------------|
| date | str | date="20200331"; choice of {"XXXX0331", "XXXX0630", "XXXX0930", "XXXX1231"}; 从 20100331 开始 |

输出参数

| 名称          | 类型     | 描述  |
|-------------|--------|-----|
| 序号          | object | -   |
| 股票代码        | object | -   |
| 股票简称        | object | -   |
| 每股收益        | object | -   |
| 营业收入-营业收入   | object | -   |
| 营业收入-去年同期   | object | -   |
| 营业收入-同比增长   | str    | -   |
| 营业收入-季度环比增长 | object | -   |
| 净利润-净利润     | object | -   |
| 净利润-去年同期    | object | -   |
| 净利润-同比增长    | str    | -   |
| 净利润-季度环比增长  | object | -   |
| 每股净资产       | object | -   |
| 净资产收益率      | object | -   |
| 所处行业        | object | -   |
| 公告日期        | object | -   |
| 市场板块        | object | -   |
| 证券类型        | object | -   |

### stock_yjyg_em
- **文档定位**：年报季报 / 业绩预告
- **HTTP**：`GET /api/public/stock_yjyg_em`
- **调用**：运行 `scripts/aktools_get.py stock_yjyg_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/bbsj/202003/yjyg.html

描述: 东方财富-数据中心-年报季报-业绩预告

限量: 单次获取指定 date 的业绩预告数据

输入参数

| 名称   | 类型  | 描述                                                                                         |
|------|-----|--------------------------------------------------------------------------------------------|
| date | str | date="20200331"; choice of {"XXXX0331", "XXXX0630", "XXXX0930", "XXXX1231"}; 从 20081231 开始 |

输出参数

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| 序号     | object  | -       |
| 股票代码   | object  | -       |
| 股票简称   | object  | -       |
| 预测指标   | float64 | -       |
| 业绩变动   | float64 | -       |
| 预测数值   | float64 | 注意单位: 元 |
| 业绩变动幅度 | float64 | 注意单位: % |
| 业绩变动原因 | float64 | -       |
| 预告类型   | float64 | -       |
| 上年同期值  | float64 | 注意单位: 元 |
| 公告日期   | float64 | -       |

### stock_yysj_em
- **文档定位**：年报季报 / 预约披露时间-东方财富
- **HTTP**：`GET /api/public/stock_yysj_em`
- **调用**：运行 `scripts/aktools_get.py stock_yysj_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/bbsj/202003/yysj.html

描述: 东方财富-数据中心-年报季报-预约披露时间

限量: 单次获取指定 symbol 和 date 的预约披露时间数据

输入参数

| 名称     | 类型  | 描述                                                                                         |
|--------|-----|--------------------------------------------------------------------------------------------|
| symbol | str | symbol="沪深A股"; choice of {'沪深A股', '沪市A股', '科创板', '深市A股', '创业板', '京市A股', 'ST板'}             |
| date   | str | date="20200331"; choice of {"XXXX0331", "XXXX0630", "XXXX0930", "XXXX1231"}; 从 20081231 开始 |

输出参数

| 名称     | 类型     | 描述  |
|--------|--------|-----|
| 序号     | int64  | -   |
| 股票代码   | object | -   |
| 股票简称   | object | -   |
| 首次预约时间 | object | -   |
| 一次变更日期 | object | -   |
| 二次变更日期 | object | -   |
| 三次变更日期 | object | -   |
| 实际披露时间 | object | -   |

### stock_report_disclosure
- **文档定位**：年报季报 / 预约披露时间-巨潮资讯
- **HTTP**：`GET /api/public/stock_report_disclosure`
- **调用**：运行 `scripts/aktools_get.py stock_report_disclosure --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.cninfo.com.cn/new/commonUrl?url=data/yypl

描述: 巨潮资讯-数据-预约披露的数据

限量: 单次获取指定 market 和 period 的预约披露数据

输入参数

| 名称     | 类型  | 描述                                                                                   |
|--------|-----|--------------------------------------------------------------------------------------|
| market | str | market="沪深京"; choice of {"沪深京", "深市", "深主板", "创业板", "沪市", "沪主板", "科创板", "北交所"}       |
| period | str | period="2021年报"; 近四期的财务报告; e.g., choice of {"2021一季", "2021半年报", "2021三季", "2021年报"} |

输出参数

| 名称   | 类型     | 描述  |
|------|--------|-----|
| 股票代码 | object | -   |
| 股票简称 | object | -   |
| 首次预约 | object | -   |
| 初次变更 | object | -   |
| 二次变更 | object | -   |
| 三次变更 | object | -   |
| 实际披露 | object | -   |

### stock_zh_a_disclosure_report_cninfo
- **文档定位**：年报季报 / 信息披露公告-巨潮资讯
- **HTTP**：`GET /api/public/stock_zh_a_disclosure_report_cninfo`
- **调用**：运行 `scripts/aktools_get.py stock_zh_a_disclosure_report_cninfo --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.cninfo.com.cn/new/commonUrl/pageOfSearch?url=disclosure/list/search

描述: 巨潮资讯-首页-公告查询-信息披露公告

限量: 单次获取指定 symbol 的信息披露公告数据; 无数据时返回空的 pandas.DataFrame

输入参数

| 名称         | 类型  | 描述                                                                                                                                                                                                                         |
|------------|-----|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| symbol     | str | symbol="000001"; 股票代码                                                                                                                                                                                                      |
| market     | str | market="沪深京"; choice of {"沪深京", "港股", "三板", "基金", "债券", "监管", "预披露"}                                                                                                                                                       |
| keyword    | str | keyword=""; 关键词                                                                                                                                                                                                            |
| category   | str | category=""; choice of {'年报', '半年报', '一季报', '三季报', '业绩预告', '权益分派', '董事会', '监事会', '股东大会', '日常经营', '公司治理', '中介报告', '首发', '增发', '股权激励', '配股', '解禁', '公司债', '可转债', '其他融资', '股权变动', '补充更正', '澄清致歉', '风险提示', '特别处理和退市', '退市整理期'} |
| start_date | str | start_date="20230618"                                                                                                                                                                                                      |
| end_date   | str | end_date="20231219"                                                                                                                                                                                                        |

输出参数

| 名称   | 类型     | 描述 |
|------|--------|----|
| 代码   | object | -  |
| 简称   | object | -  |
| 公告标题 | object | -  |
| 公告时间 | object | -  |
| 公告链接 | object | -  |

### stock_zh_a_disclosure_relation_cninfo
- **文档定位**：年报季报 / 信息披露调研-巨潮资讯
- **HTTP**：`GET /api/public/stock_zh_a_disclosure_relation_cninfo`
- **调用**：运行 `scripts/aktools_get.py stock_zh_a_disclosure_relation_cninfo --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.cninfo.com.cn/new/commonUrl/pageOfSearch?url=disclosure/list/search

描述: 巨潮资讯-首页-公告查询-信息披露调研

限量: 单次获取指定 symbol 的信息披露调研数据; 无数据时返回空的 pandas.DataFrame

输入参数

| 名称         | 类型  | 描述                                                                   |
|------------|-----|----------------------------------------------------------------------|
| symbol     | str | symbol="000001"; 股票代码                                                |
| market     | str | market="沪深京"; choice of {"沪深京", "港股", "三板", "基金", "债券", "监管", "预披露"} |
| start_date | str | start_date="20230618"                                                |
| end_date   | str | end_date="20231219"                                                  |

输出参数

| 名称   | 类型     | 描述 |
|------|--------|----|
| 代码   | object | -  |
| 简称   | object | -  |
| 公告标题 | object | -  |
| 公告时间 | object | -  |
| 公告链接 | object | -  |

### stock_industry_category_cninfo
- **文档定位**：年报季报 / 行业分类数据-巨潮资讯
- **HTTP**：`GET /api/public/stock_industry_category_cninfo`
- **调用**：运行 `scripts/aktools_get.py stock_industry_category_cninfo --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://webapi.cninfo.com.cn/#/apiDoc

描述: 巨潮资讯-数据-行业分类数据

限量: 单次获取指定 symbol 的行业分类数据

输入参数

| 名称     | 类型  | 描述                                                                                                                                 |
|--------|-----|------------------------------------------------------------------------------------------------------------------------------------|
| symbol | str | symbol="巨潮行业分类标准"; choice of {"证监会行业分类标准", "巨潮行业分类标准", "申银万国行业分类标准", "新财富行业分类标准", "国资委行业分类标准", "巨潮产业细分标准", "天相行业分类标准", "全球行业分类标准"} |

输出参数

| 名称     | 类型         | 描述  |
|--------|------------|-----|
| 类目编码   | object     | -   |
| 类目名称   | object     | -   |
| 终止日期   | datetime64 | -   |
| 行业类型   | object     | -   |
| 行业类型编码 | object     | -   |
| 类目名称英文 | object     | -   |
| 父类编码   | object     | -   |
| 分级     | int32      | -   |

### stock_industry_change_cninfo
- **文档定位**：年报季报 / 上市公司行业归属的变动情况-巨潮资讯
- **HTTP**：`GET /api/public/stock_industry_change_cninfo`
- **调用**：运行 `scripts/aktools_get.py stock_industry_change_cninfo --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://webapi.cninfo.com.cn/#/apiDoc

描述: 巨潮资讯-数据-上市公司行业归属的变动情况

限量: 单次获取指定 symbol 在 start_date 和 end_date 之间的上市公司行业归属的变动情况数据

输入参数

| 名称         | 类型  | 描述                    |
|------------|-----|-----------------------|
| symbol     | str | symbol="002594"       |
| start_date | str | start_date="20091227" |
| end_date   | str | end_date="20220708"   |

输出参数

| 名称     | 类型     | 描述  |
|--------|--------|-----|
| 新证券简称  | object | -   |
| 行业中类   | object | -   |
| 行业大类   | object | -   |
| 行业次类   | object | -   |
| 行业门类   | object | -   |
| 机构名称   | object | -   |
| 行业编码   | object | -   |
| 分类标准   | object | -   |
| 分类标准编码 | object | -   |
| 证券代码   | object | -   |
| 变更日期   | object | -   |

### stock_share_change_cninfo
- **文档定位**：年报季报 / 公司股本变动-巨潮资讯
- **HTTP**：`GET /api/public/stock_share_change_cninfo`
- **调用**：运行 `scripts/aktools_get.py stock_share_change_cninfo --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://webapi.cninfo.com.cn/#/apiDoc

描述: 巨潮资讯-数据-公司股本变动

限量: 单次获取指定 symbol 在 start_date 和 end_date 之间的公司股本变动数据

输入参数

| 名称         | 类型  | 描述                    |
|------------|-----|-----------------------|
| symbol     | str | symbol="002594"       |
| start_date | str | start_date="20091227" |
| end_date   | str | end_date="20241021"   |

输出参数

| 名称         | 类型      | 描述  |
|------------|---------|-----|
| 证券简称       | object  | -   |
| 机构名称       | object  | -   |
| 境外法人持股     | float64 | -   |
| 证券投资基金持股   | float64 | -   |
| 国家持股-受限    | float64 | -   |
| 国有法人持股     | float64 | -   |
| 配售法人股      | float64 | -   |
| 发起人股份      | float64 | -   |
| 未流通股份      | float64 | -   |
| 其中：境外自然人持股 | float64 | -   |
| 其他流通受限股份   | float64 | -   |
| 其他流通股      | float64 | -   |
| 外资持股-受限    | float64 | -   |
| 内部职工股      | float64 | -   |
| 境外上市外资股-H股 | float64 | -   |
| 其中：境内法人持股  | float64 | -   |
| 自然人持股      | float64 | -   |
| 人民币普通股     | float64 | -   |
| 国有法人持股-受限  | float64 | -   |
| 一般法人持股     | float64 | -   |
| 控股股东、实际控制人 | float64 | -   |
| 其中：限售H股    | float64 | -   |
| 变动原因       | object  | -   |
| 公告日期       | object  | -   |
| 境内法人持股     | float64 | -   |
| 证券代码       | object  | -   |
| 变动日期       | object  | -   |
| 战略投资者持股    | float64 | -   |
| 国家持股       | float64 | -   |
| 其中：限售B股    | float64 | -   |
| 其他未流通股     | float64 | -   |
| 流通受限股份     | float64 | -   |
| 优先股        | float64 | -   |
| 高管股        | float64 | -   |
| 总股本        | float64 | -   |
| 其中：限售高管股   | float64 | -   |
| 转配股        | float64 | -   |
| 境内上市外资股-B股 | float64 | -   |
| 其中：境外法人持股  | float64 | -   |
| 募集法人股      | float64 | -   |
| 已流通股份      | float64 | -   |
| 其中：境内自然人持股 | float64 | -   |
| 其他内资持股-受限  | float64 | -   |
| 变动原因编码     | object  | -   |

### stock_allotment_cninfo
- **文档定位**：年报季报 / 配股实施方案-巨潮资讯
- **HTTP**：`GET /api/public/stock_allotment_cninfo`
- **调用**：运行 `scripts/aktools_get.py stock_allotment_cninfo --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://webapi.cninfo.com.cn/#/dataBrowse

描述: 巨潮资讯-个股-配股实施方案

限量: 单次获取指定 symbol 在 start_date 和 end_date 之间的公司股本变动数据

输入参数

| 名称         | 类型  | 描述                    |
|------------|-----|-----------------------|
| symbol     | str | symbol="600030"       |
| start_date | str | start_date="19700101" |
| end_date   | str | end_date="22220222"   |

输出参数

| 名称           | 类型         | 描述  |
|--------------|------------|-----|
| 记录标识         | int64      | -   |
| 证券简称         | object     | -   |
| 停牌起始日        | object     | -   |
| 上市公告日期       | object     | -   |
| 配股缴款起始日      | object     | -   |
| 可转配股数量       | float64    | -   |
| 停牌截止日        | object     | -   |
| 实际配股数量       | float64    | -   |
| 配股价格         | float64    | -   |
| 配股比例         | float64    | -   |
| 配股前总股本       | float64    | -   |
| 每股配权转让费(元)   | float64    | -   |
| 法人股实配数量      | float64    | -   |
| 实际募资净额       | float64    | -   |
| 大股东认购方式      | object     | -   |
| 其他配售简称       | object     | -   |
| 发行方式         | object     | -   |
| 配股失败，退还申购款日期 | object     | -   |
| 除权基准日        | object     | -   |
| 预计发行费用       | float64    | -   |
| 配股发行结果公告日    | object     | -   |
| 证券代码         | object     | -   |
| 配股权证交易截止日    | datetime64 | -   |
| 其他股份实配数量     | float64    | -   |
| 国家股实配数量      | float64    | -   |
| 委托单位         | object     | -   |
| 公众获转配数量      | float64    | -   |
| 其他配售代码       | object     | -   |
| 配售对象         | object     | -   |
| 配股权证交易起始日    | datetime64 | -   |
| 资金到账日        | datetime64 | -   |
| 机构名称         | object     | -   |
| 股权登记日        | object     | -   |
| 实际募资总额       | float64    | -   |
| 预计募集资金       | float64    | -   |
| 大股东认购数量      | float64    | -   |
| 公众股实配数量      | float64    | -   |
| 转配股实配数量      | float64    | -   |
| 承销费用         | float64    | -   |
| 法人获转配数量      | float64    | -   |
| 配股后流通股本      | float64    | -   |
| 股票类别         | object     | -   |
| 公众配售简称       | object     | -   |
| 发行方式编码       | object     | -   |
| 承销方式         | object     | -   |
| 公告日期         | object     | -   |
| 配股上市日        | object     | -   |
| 配股缴款截止日      | object     | -   |
| 承销余额(股)      | float64    | -   |
| 预计配股数量       | float64    | -   |
| 配股后总股本       | float64    | -   |
| 职工股实配数量      | float64    | -   |
| 承销方式编码       | object     | -   |
| 发行费用总额       | float64    | -   |
| 配股前流通股本      | float64    | -   |
| 股票类别编码       | object     | -   |
| 公众配售代码       | object     | -   |

### stock_profile_cninfo
- **文档定位**：年报季报 / 公司概况-巨潮资讯
- **HTTP**：`GET /api/public/stock_profile_cninfo`
- **调用**：运行 `scripts/aktools_get.py stock_profile_cninfo --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://webapi.cninfo.com.cn/#/company

描述: 巨潮资讯-个股-公司概况

限量: 单次获取指定 symbol 的公司概况

输入参数

| 名称         | 类型  | 描述                    |
|------------|-----|-----------------------|
| symbol     | str | symbol="600030"       |

输出参数

| 名称   | 类型     | 描述  |
|------|--------|-----|
| 公司名称 | object | -   |
| 英文名称 | object | -   |
| 曾用简称 | object | -   |
| A股代码 | object | -   |
| A股简称 | object | -   |
| B股代码 | object | -   |
| B股简称 | object | -   |
| H股代码 | object | -   |
| H股简称 | object | -   |
| 入选指数 | object | -   |
| 所属市场 | object | -   |
| 所属行业 | object | -   |
| 法人代表 | object | -   |
| 注册资金 | object | -   |
| 成立日期 | object | -   |
| 上市日期 | object | -   |
| 官方网站 | object | -   |
| 电子邮箱 | object | -   |
| 联系电话 | object | -   |
| 传真   | object | -   |
| 注册地址 | object | -   |
| 办公地址 | object | -   |
| 邮政编码 | object | -   |
| 主营业务 | object | -   |
| 经营范围 | object | -   |
| 机构简介 | object | -   |

### stock_ipo_summary_cninfo
- **文档定位**：年报季报 / 上市相关-巨潮资讯
- **HTTP**：`GET /api/public/stock_ipo_summary_cninfo`
- **调用**：运行 `scripts/aktools_get.py stock_ipo_summary_cninfo --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://webapi.cninfo.com.cn/#/company

描述: 巨潮资讯-个股-上市相关

限量: 单次获取指定 symbol 的上市相关数据

输入参数

| 名称         | 类型  | 描述                    |
|------------|-----|-----------------------|
| symbol     | str | symbol="600030"       |

输出参数

| 名称       | 类型      | 描述       |
|----------|---------|----------|
| 股票代码     | object  | -        |
| 招股公告日期   | object  | -        |
| 中签率公告日   | object  | -        |
| 每股面值     | float64 | 注意单位: 元  |
| 总发行数量    | float64 | 注意单位: 万股 |
| 发行前每股净资产 | float64 | 注意单位: 元  |
| 摊薄发行市盈率  | float64 | -        |
| 募集资金净额   | float64 | 注意单位: 万元 |
| 上网发行日期   | object  | -        |
| 上市日期     | object  | -        |
| 发行价格     | float64 | 注意单位: 元  |
| 发行费用总额   | float64 | 注意单位: 万元 |
| 发行后每股净资产 | float64 | 注意单位: 元  |
| 上网发行中签率  | float64 | 注意单位: %  |
| 主承销商     | float64 | -        |

### stock_zcfz_em
- **文档定位**：年报季报 / 资产负债表-沪深
- **HTTP**：`GET /api/public/stock_zcfz_em`
- **调用**：运行 `scripts/aktools_get.py stock_zcfz_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/bbsj/202003/zcfz.html

描述: 东方财富-数据中心-年报季报-业绩快报-资产负债表

限量: 单次获取指定 date 的资产负债表数据

输入参数

| 名称   | 类型  |  描述                                                                                        |
|------|-----|--------------------------------------------------------------------------------------------|
| date | str | date="20240331"; choice of {"XXXX0331", "XXXX0630", "XXXX0930", "XXXX1231"}; 从 20081231 开始 |

输出参数

| 名称       | 类型      | 描述      |
|----------|---------|---------|
| 序号       | int64   | -       |
| 股票代码     | object  | -       |
| 股票简称     | object  | -       |
| 资产-货币资金  | float64 | 注意单位: 元 |
| 资产-应收账款  | float64 | 注意单位: 元 |
| 资产-存货    | float64 | 注意单位: 元 |
| 资产-总资产   | float64 | 注意单位: 元 |
| 资产-总资产同比 | float64 | 注意单位: % |
| 负债-应付账款  | float64 | 注意单位: 元 |
| 负债-总负债   | float64 | 注意单位: 元 |
| 负债-预收账款  | float64 | 注意单位: 元 |
| 负债-总负债同比 | float64 | 注意单位: % |
| 资产负债率    | float64 | 注意单位: % |
| 股东权益合计   | float64 | 注意单位: 元 |
| 公告日期     | object  | -       |

### stock_zcfz_bj_em
- **文档定位**：年报季报 / 资产负债表-北交所
- **HTTP**：`GET /api/public/stock_zcfz_bj_em`
- **调用**：运行 `scripts/aktools_get.py stock_zcfz_bj_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/bbsj/202003/zcfz.html

描述: 东方财富-数据中心-年报季报-业绩快报-资产负债表

限量: 单次获取指定 date 的资产负债表数据

输入参数

| 名称   | 类型  | 描述                                                                                         |
|------|-----|--------------------------------------------------------------------------------------------|
| date | str | date="20240331"; choice of {"XXXX0331", "XXXX0630", "XXXX0930", "XXXX1231"}; 从 20081231 开始 |

输出参数

| 名称       | 类型      | 描述      |
|----------|---------|---------|
| 序号       | int64   | -       |
| 股票代码     | object  | -       |
| 股票简称     | object  | -       |
| 资产-货币资金  | float64 | 注意单位: 元 |
| 资产-应收账款  | float64 | 注意单位: 元 |
| 资产-存货    | float64 | 注意单位: 元 |
| 资产-总资产   | float64 | 注意单位: 元 |
| 资产-总资产同比 | float64 | 注意单位: % |
| 负债-应付账款  | float64 | 注意单位: 元 |
| 负债-总负债   | float64 | 注意单位: 元 |
| 负债-预收账款  | float64 | 注意单位: 元 |
| 负债-总负债同比 | float64 | 注意单位: % |
| 资产负债率    | float64 | 注意单位: % |
| 股东权益合计   | float64 | 注意单位: 元 |
| 公告日期     | object  | -       |

### stock_lrb_em
- **文档定位**：年报季报 / 利润表
- **HTTP**：`GET /api/public/stock_lrb_em`
- **调用**：运行 `scripts/aktools_get.py stock_lrb_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/bbsj/202003/lrb.html

描述: 东方财富-数据中心-年报季报-业绩快报-利润表

限量: 单次获取指定 date 的利润表数据

输入参数

| 名称   | 类型  | 描述                                                                                         |
|------|-----|--------------------------------------------------------------------------------------------|
| date | str | date="20240331"; choice of {"XXXX0331", "XXXX0630", "XXXX0930", "XXXX1231"}; 从 20120331 开始 |

输出参数

| 名称          | 类型      | 描述      |
|-------------|---------|---------|
| 序号          | int64   | -       |
| 股票代码        | object  | -       |
| 股票简称        | object  | -       |
| 净利润         | float64 | 注意单位: 元 |
| 净利润同比       | float64 | 注意单位: % |
| 营业总收入       | float64 | 注意单位: 元 |
| 营业总收入同比     | float64 | 注意单位: % |
| 营业总支出-营业支出  | float64 | 注意单位: 元 |
| 营业总支出-销售费用  | float64 | 注意单位: 元 |
| 营业总支出-管理费用  | float64 | 注意单位: 元 |
| 营业总支出-财务费用  | float64 | 注意单位: 元 |
| 营业总支出-营业总支出 | float64 | 注意单位: 元 |
| 营业利润        | float64 | 注意单位: 元 |
| 利润总额        | float64 | 注意单位: 元 |
| 公告日期        | object  | -       |

### stock_xjll_em
- **文档定位**：年报季报 / 现金流量表
- **HTTP**：`GET /api/public/stock_xjll_em`
- **调用**：运行 `scripts/aktools_get.py stock_xjll_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/bbsj/202003/xjll.html

描述: 东方财富-数据中心-年报季报-业绩快报-现金流量表

限量: 单次获取指定 date 的现金流量表数据

输入参数

| 名称   | 类型  | 描述                                                                                         |
|------|-----|--------------------------------------------------------------------------------------------|
| date | str | date="20200331"; choice of {"XXXX0331", "XXXX0630", "XXXX0930", "XXXX1231"}; 从 20081231 开始 |

输出参数

| 名称            | 类型      | 描述      |
|---------------|---------|---------|
| 序号            | int64   | -       |
| 股票代码          | object  | -       |
| 股票简称          | object  | -       |
| 净现金流-净现金流     | float64 | 注意单位: 元 |
| 净现金流-同比增长     | float64 | 注意单位: % |
| 经营性现金流-现金流量净额 | float64 | 注意单位: 元 |
| 经营性现金流-净现金流占比 | float64 | 注意单位: % |
| 投资性现金流-现金流量净额 | float64 | 注意单位: 元 |
| 投资性现金流-净现金流占比 | float64 | 注意单位: % |
| 融资性现金流-现金流量净额 | float64 | 注意单位: 元 |
| 融资性现金流-净现金流占比 | float64 | 注意单位: % |
| 公告日期          | object  | -       |
