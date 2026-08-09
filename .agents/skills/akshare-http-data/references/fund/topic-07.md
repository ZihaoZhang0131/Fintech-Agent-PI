# 基金评级



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### fund_rating_all
- **文档定位**：基金评级 / 基金评级总汇
- **HTTP**：`GET /api/public/fund_rating_all`
- **调用**：运行 `scripts/aktools_get.py fund_rating_all --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://fund.eastmoney.com/data/fundrating.html

描述: 天天基金网-基金评级-基金评级总汇

限量: 单次返回所有基金评级数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述  |
|--------|---------|-----|
| 代码     | object  | -   |
| 简称     | object  | -   |
| 基金经理   | object  | -   |
| 基金公司   | object  | -   |
| 5星评级家数 | int64   | -   |
| 上海证券   | float64 | -   |
| 招商证券   | float64 | -   |
| 济安金信   | float64 | -   |
| 手续费    | float64 | -   |
| 类型     | object  | -   |

### fund_rating_sh
- **文档定位**：基金评级 / 上海证券评级
- **HTTP**：`GET /api/public/fund_rating_sh`
- **调用**：运行 `scripts/aktools_get.py fund_rating_sh --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://fund.eastmoney.com/data/fundrating_3.html

描述: 天天基金网-基金评级-上海证券评级

限量: 单次返回指定交易日的所有基金评级数据

输入参数

| 名称   | 类型  | 描述                                                                        |
|------|-----|---------------------------------------------------------------------------|
| date | str | date='20230630'; https://fund.eastmoney.com/data/fundrating_3.html 获取查询日期 |

输出参数

| 名称         | 类型      | 描述      |
|------------|---------|---------|
| 代码         | object  | -       |
| 简称         | object  | -       |
| 基金经理       | object  | -       |
| 基金公司       | object  | -       |
| 3年期评级-3年评级 | int64   | -       |
| 3年期评级-较上期  | float64 | -       |
| 5年期评级-5年评级 | float64 | -       |
| 5年期评级-较上期  | float64 | -       |
| 单位净值       | float64 | -       |
| 日期         | object  | -       |
| 日增长率       | float64 | 注意单位: % |
| 近1年涨幅      | float64 | 注意单位: % |
| 近3年涨幅      | float64 | 注意单位: % |
| 近5年涨幅      | float64 | 注意单位: % |
| 手续费        | object  | -       |
| 类型         | object  | -       |

### fund_rating_zs
- **文档定位**：基金评级 / 招商证券评级
- **HTTP**：`GET /api/public/fund_rating_zs`
- **调用**：运行 `scripts/aktools_get.py fund_rating_zs --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://fund.eastmoney.com/data/fundrating_2.html

描述: 天天基金网-基金评级-招商证券评级

限量: 单次返回指定交易日的所有基金评级数据

输入参数

| 名称   | 类型  | 描述                                                                        |
|------|-----|---------------------------------------------------------------------------|
| date | str | date='20230331'; https://fund.eastmoney.com/data/fundrating_2.html 获取查询日期 |

输出参数

| 名称         | 类型      | 描述      |
|------------|---------|---------|
| 代码         | object  | -       |
| 简称         | object  | -       |
| 基金经理       | object  | -       |
| 基金公司       | object  | -       |
| 3年期评级-3年评级 | int64   | -       |
| 3年期评级-较上期  | float64 | -       |
| 单位净值       | float64 | -       |
| 日期         | object  | -       |
| 日增长率       | float64 | 注意单位: % |
| 近1年涨幅      | float64 | 注意单位: % |
| 近3年涨幅      | float64 | 注意单位: % |
| 近5年涨幅      | float64 | 注意单位: % |
| 手续费        | object  | -       |

### fund_rating_ja
- **文档定位**：基金评级 / 济安金信评级
- **HTTP**：`GET /api/public/fund_rating_ja`
- **调用**：运行 `scripts/aktools_get.py fund_rating_ja --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://fund.eastmoney.com/data/fundrating_4.html

描述: 天天基金网-基金评级-济安金信评级

限量: 单次返回指定交易日的所有基金评级数据

输入参数

| 名称   | 类型  | 描述                                                                        |
|------|-----|---------------------------------------------------------------------------|
| date | str | date='20200930'; https://fund.eastmoney.com/data/fundrating_4.html 获取查询日期 |

输出参数

| 名称         | 类型      | 描述      |
|------------|---------|---------|
| 代码         | object  | -       |
| 简称         | object  | -       |
| 基金经理       | object  | -       |
| 基金公司       | object  | -       |
| 3年期评级-3年评级 | int64   | -       |
| 3年期评级-较上期  | float64 | -       |
| 单位净值       | float64 | -       |
| 日期         | object  | -       |
| 日增长率       | float64 | 注意单位: % |
| 近1年涨幅      | float64 | 注意单位: % |
| 近3年涨幅      | float64 | 注意单位: % |
| 近5年涨幅      | float64 | 注意单位: % |
| 手续费        | object  | -       |
| 类型         | object  | -       |
