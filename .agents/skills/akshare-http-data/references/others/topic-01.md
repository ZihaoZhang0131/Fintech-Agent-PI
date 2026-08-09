# 汽车销量排行



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### car_market_total_cpca
- **文档定位**：汽车销量排行 / 乘联会-统计数据-总体市场
- **HTTP**：`GET /api/public/car_market_total_cpca`
- **调用**：运行 `scripts/aktools_get.py car_market_total_cpca --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.cpcadata.com/TotalMarket

描述: 乘联会-统计数据-总体市场

限量: 单次返回指定 symbol 和 indicator 的数据

输入参数

| 名称        | 类型  | 描述                                                 |
|-----------|-----|----------------------------------------------------|
| symbol    | str | symbol="狭义乘用车"; choice of {"狭义乘用车", "广义乘用车"}       |
| indicator | str | indicator="产量"; choice of {"产量", "批发", "零售", "出口"} |

输出参数

| 名称       | 类型      | 描述       |
|----------|---------|----------|
| 月份       | object  | -        |
| {前一个年份}年 | float64 | 注意单位: 万辆 |
| {当前年份}年  | float64 | 注意单位: 万辆 |

### car_market_man_rank_cpca
- **文档定位**：汽车销量排行 / 乘联会-统计数据-厂商排名
- **HTTP**：`GET /api/public/car_market_man_rank_cpca`
- **调用**：运行 `scripts/aktools_get.py car_market_man_rank_cpca --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.cpcadata.com/ManRank

描述: 乘联会-统计数据-厂商排名

限量: 单次返回指定 symbol 和 indicator 的数据

输入参数

| 名称        | 类型  | 描述                                                                            |
|-----------|-----|-------------------------------------------------------------------------------|
| symbol    | str | symbol="狭义乘用车-单月"; choice of {"狭义乘用车-单月", "狭义乘用车-累计", "广义乘用车-单月", "广义乘用车-累计"} |
| indicator | str | indicator="批发"; choice of {"批发", "零售"}                                        |

输出参数

| 名称       | 类型      | 描述       |
|----------|---------|----------|
| 月份       | object  | -        |
| {前一个年份}年 | float64 | 注意单位: 万辆 |
| {当前年份}年  | float64 | 注意单位: 万辆 |

### car_market_cate_cpca
- **文档定位**：汽车销量排行 / 乘联会-统计数据-车型大类
- **HTTP**：`GET /api/public/car_market_cate_cpca`
- **调用**：运行 `scripts/aktools_get.py car_market_cate_cpca --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.cpcadata.com/CategoryMarket

描述: 乘联会-统计数据-车型大类

限量: 单次返回指定 symbol 和 indicator 的数据

输入参数

| 名称        | 类型  | 描述                                                |
|-----------|-----|---------------------------------------------------|
| symbol    | str | symbol="轿车"; choice of {"轿车", "MPV", "SUV", "占比"} |
| indicator | str | indicator="批发"; choice of {"批发", "零售"}            |

输出参数

| 名称       | 类型      | 描述       |
|----------|---------|----------|
| 月份       | object  | -        |
| {前一个年份}年 | float64 | 注意单位: 万辆 |
| {当前年份}年  | float64 | 注意单位: 万辆 |

### car_market_country_cpca
- **文档定位**：汽车销量排行 / 乘联会-统计数据-国别细分市场
- **HTTP**：`GET /api/public/car_market_country_cpca`
- **调用**：运行 `scripts/aktools_get.py car_market_country_cpca --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.cpcadata.com/CountryMarket

描述: 乘联会-统计数据-国别细分市场

限量: 单次返回指定 symbol 和 indicator 的数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称   | 类型      | 描述       |
|------|---------|----------|
| 月份   | object  | -        |
| 自主   | float64 | 注意单位: 万辆 |
| 德系   | float64 | 注意单位: 万辆 |
| 日系   | float64 | 注意单位: 万辆 |
| 法系   | float64 | 注意单位: 万辆 |
| 美系   | float64 | 注意单位: 万辆 |
| 韩系   | float64 | 注意单位: 万辆 |
| 其他欧系 | float64 | 注意单位: 万辆 |

### car_market_segment_cpca
- **文档定位**：汽车销量排行 / 乘联会-统计数据-级别细分市场
- **HTTP**：`GET /api/public/car_market_segment_cpca`
- **调用**：运行 `scripts/aktools_get.py car_market_segment_cpca --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.cpcadata.com/SegmentMarket

描述: 乘联会-统计数据-级别细分市场

限量: 单次返回指定 symbol 的数据

输入参数

| 名称     | 类型  | 描述                                          |
|--------|-----|---------------------------------------------|
| symbol | str | symbol="轿车"; choice of {"轿车", "MPV", "SUV"} |

输出参数

| 名称  | 类型      | 描述       |
|-----|---------|----------|
| 月份  | object  | -        |
| A00 | float64 | 注意单位: 万辆 |
| A0  | float64 | 注意单位: 万辆 |
| A   | float64 | 注意单位: 万辆 |
| B   | float64 | 注意单位: 万辆 |
| C   | float64 | 注意单位: 万辆 |

### car_market_fuel_cpca
- **文档定位**：汽车销量排行 / 乘联会-统计数据-新能源细分市场
- **HTTP**：`GET /api/public/car_market_fuel_cpca`
- **调用**：运行 `scripts/aktools_get.py car_market_fuel_cpca --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.cpcadata.com/FuelMarket

描述: 乘联会-统计数据-车型大类

限量: 单次返回指定 symbol 的数据

输入参数

| 名称     | 类型  | 描述                                                                 |
|--------|-----|--------------------------------------------------------------------|
| symbol | str | symbol="整体市场"; choice of {"整体市场", "销量占比-PHEV-BEV", "销量占比-ICE-NEV"} |

输出参数

| 名称       | 类型      | 描述       |
|----------|---------|----------|
| 月份       | object  | -        |
| {前一个年份}年 | float64 | 注意单位: 万辆 |
| {当前年份}年  | float64 | 注意单位: 万辆 |

### car_sale_rank_gasgoo
- **文档定位**：汽车销量排行 / 盖世研究院
- **HTTP**：`GET /api/public/car_sale_rank_gasgoo`
- **调用**：运行 `scripts/aktools_get.py car_sale_rank_gasgoo --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://i.gasgoo.com/data/ranking

描述: 盖世汽车资讯的汽车销量排行榜数据

限量: 单次返回指定 symbol 和 date 的汽车销量排行榜数据

输入参数

| 名称     | 类型  | 描述                                            |
|--------|-----|-----------------------------------------------|
| symbol | str | symbol="车型榜"; choice of {"车企榜", "品牌榜", "车型榜"} |
| date   | str | date="202104"; 指定到月份即可                        |

输出参数-品牌

| 名称               | 类型      | 描述      |
|------------------|---------|---------|
| 品牌               | object  | -       |
| {当前年份}-{当前月份}    | int64   | -       |
| {当前月份}月同比        | object  | 注意单位: % |
| {当前月份}月环比        | object  | 注意单位: % |
| {年份}-1到{当前年份}    | int64   | -       |
| {前一年年份}-1到{当前年份} | float64 | -       |
| {前二年年份}-1到{当前年份} | float64 | -       |

接口示例-品牌

```python
import akshare as ak

car_sale_rank_gasgoo_df = ak.car_sale_rank_gasgoo(symbol="品牌榜", date="202311")
print(car_sale_rank_gasgoo_df)
```
