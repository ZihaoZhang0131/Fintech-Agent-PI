# 债券发行



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### bond_treasure_issue_cninfo
- **文档定位**：债券发行 / 国债发行
- **HTTP**：`GET /api/public/bond_treasure_issue_cninfo`
- **调用**：运行 `scripts/aktools_get.py bond_treasure_issue_cninfo --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://webapi.cninfo.com.cn/#/thematicStatistics

描述: 巨潮资讯-数据中心-专题统计-债券报表-债券发行-国债发行

输入参数

| 名称         | 类型  | 描述                    |
|------------|-----|-----------------------|
| start_date | str | start_date="20210911" |
| end_date   | str | end_date="20211110"   |

输出参数

| 名称     | 类型      | 描述       |
|--------|---------|----------|
| 债券代码   | object  | -        |
| 债券简称   | object  | -        |
| 发行起始日  | object  | -        |
| 发行终止日  | object  | -        |
| 计划发行总量 | float64 | 注意单位: 亿元 |
| 实际发行总量 | float64 | 注意单位: 亿元 |
| 发行价格   | float64 | 注意单位: 元  |
| 单位面值   | int64   | 注意单位: 元  |
| 缴款日    | object  | -        |
| 增发次数   | int64   | -        |
| 交易市场   | object  | -        |
| 发行方式   | object  | -        |
| 发行对象   | object  | -        |
| 公告日期   | object  | -        |
| 债券名称   | object  | -        |

### bond_local_government_issue_cninfo
- **文档定位**：债券发行 / 地方债发行
- **HTTP**：`GET /api/public/bond_local_government_issue_cninfo`
- **调用**：运行 `scripts/aktools_get.py bond_local_government_issue_cninfo --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://webapi.cninfo.com.cn/#/thematicStatistics

描述: 巨潮资讯-数据中心-专题统计-债券报表-债券发行-地方债发行

输入参数

| 名称         | 类型  | 描述                    |
|------------|-----|-----------------------|
| start_date | str | start_date="20210911" |
| end_date   | str | end_date="20211110"   |

输出参数

| 名称     | 类型      | 描述       |
|--------|---------|----------|
| 债券代码   | object  | -        |
| 债券简称   | object  | -        |
| 发行起始日  | object  | -        |
| 发行终止日  | object  | -        |
| 计划发行总量 | float64 | 注意单位: 亿元 |
| 实际发行总量 | float64 | 注意单位: 亿元 |
| 发行价格   | float64 | 注意单位: 元  |
| 单位面值   | int64   | 注意单位: 元  |
| 缴款日    | object  | -        |
| 增发次数   | int64   | -        |
| 交易市场   | object  | -        |
| 发行方式   | object  | -        |
| 发行对象   | object  | -        |
| 公告日期   | object  | -        |
| 债券名称   | object  | -        |

### bond_corporate_issue_cninfo
- **文档定位**：债券发行 / 企业债发行
- **HTTP**：`GET /api/public/bond_corporate_issue_cninfo`
- **调用**：运行 `scripts/aktools_get.py bond_corporate_issue_cninfo --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://webapi.cninfo.com.cn/#/thematicStatistics

描述: 巨潮资讯-数据中心-专题统计-债券报表-债券发行-企业债发行

输入参数

| 名称         | 类型  | 描述                    |
|------------|-----|-----------------------|
| start_date | str | start_date="20210911" |
| end_date   | str | end_date="20211110"   |

输出参数

| 名称         | 类型      | 描述       |
|------------|---------|----------|
| 债券代码       | object  | -        |
| 债券简称       | object  | -        |
| 公告日期       | object  | -        |
| 交易所网上发行起始日 | object  | -        |
| 交易所网上发行终止日 | object  | -        |
| 计划发行总量     | float64 | 注意单位: 万元 |
| 实际发行总量     | float64 | 注意单位: 万元 |
| 发行面值       | float64 | -        |
| 发行价格       | int64   | 注意单位: 元  |
| 发行方式       | object  | -        |
| 发行对象       | object  | -        |
| 发行范围       | object  | -        |
| 承销方式       | object  | -        |
| 最小认购单位     | float64 | 注意单位: 万元 |
| 募资用途说明     | object  | -        |
| 最低认购额      | float64 | 注意单位: 万元 |
| 债券名称       | object  | -        |

### bond_cov_issue_cninfo
- **文档定位**：债券发行 / 可转债发行
- **HTTP**：`GET /api/public/bond_cov_issue_cninfo`
- **调用**：运行 `scripts/aktools_get.py bond_cov_issue_cninfo --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://webapi.cninfo.com.cn/#/thematicStatistics

描述: 巨潮资讯-数据中心-专题统计-债券报表-债券发行-可转债发行

输入参数

| 名称         | 类型  | 描述                    |
|------------|-----|-----------------------|
| start_date | str | start_date="20210913" |
| end_date   | str | end_date="20211112"   |

输出参数

| 名称              | 类型      | 描述       |
|-----------------|---------|----------|
| 债券代码            | object  | -        |
| 债券简称            | object  | -        |
| 公告日期            | object  | -        |
| 发行起始日           | object  | -        |
| 发行终止日           | object  | -        |
| 计划发行总量          | float64 | 注意单位: 万元 |
| 实际发行总量          | float64 | 注意单位: 万元 |
| 发行面值            | int64   | 注意单位: 元  |
| 发行价格            | float64 | 注意单位: 元  |
| 发行方式            | object  | -        |
| 发行对象            | object  | -        |
| 发行范围            | object  | -        |
| 承销方式            | object  | -        |
| 募资用途说明          | object  | -        |
| 初始转股价格          | float64 | 注意单位: 元  |
| 转股开始日期          | object  | -        |
| 转股终止日期          | object  | -        |
| 网上申购日期          | object  | -        |
| 网上申购代码          | object  | -        |
| 网上申购简称          | object  | -        |
| 网上申购数量上限        | float64 | 注意单位: 万元 |
| 网上申购数量下限        | float64 | 注意单位: 万元 |
| 网上申购单位          | float64 | -        |
| 网上申购中签结果公告日及退款日 | object  | -        |
| 优先申购日           | object  | -        |
| 配售价格            | float64 | 注意单位: 元  |
| 债权登记日           | object  | -        |
| 优先申购缴款日         | object  | -        |
| 转股代码            | object  | -        |
| 交易市场            | object  | -        |
| 债券名称            | object  | -        |

### bond_cov_stock_issue_cninfo
- **文档定位**：债券发行 / 可转债转股
- **HTTP**：`GET /api/public/bond_cov_stock_issue_cninfo`
- **调用**：运行 `scripts/aktools_get.py bond_cov_stock_issue_cninfo --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://webapi.cninfo.com.cn/#/thematicStatistics

描述: 巨潮资讯-数据中心-专题统计-债券报表-债券发行-可转债转股

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称       | 类型      | 描述      |
|----------|---------|---------|
| 债券代码     | object  | -       |
| 债券简称     | object  | -       |
| 公告日期     | object  | -       |
| 转股代码     | object  | -       |
| 转股简称     | object  | -       |
| 转股价格     | float64 | 注意单位: 元 |
| 自愿转换期起始日 | object  | -       |
| 自愿转换期终止日 | object  | -       |
| 标的股票     | object  | -       |
| 债券名称     | object  | -       |
