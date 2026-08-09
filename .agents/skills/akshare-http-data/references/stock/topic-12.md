# 新股数据



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### stock_dxsyl_em
- **文档定位**：新股数据 / 打新收益率
- **HTTP**：`GET /api/public/stock_dxsyl_em`
- **调用**：运行 `scripts/aktools_get.py stock_dxsyl_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/xg/xg/dxsyl.html

描述: 东方财富网-数据中心-新股申购-打新收益率

限量: 单次获取所有打新收益率数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称       | 类型      | 描述      |
|----------|---------|---------|
| 股票代码     | object  | -       |
| 股票简称     | object  | -       |
| 发行价      | float64 | -       |
| 最新价      | float64 | -       |
| 网上发行中签率  | float64 | 注意单位: % |
| 网上有效申购股数 | int64   | -       |
| 网上有效申购户数 | int64   | 注意单位: 户 |
| 网上超额认购倍数 | float64 | -       |
| 网下配售中签率  | float64 | 注意单位: % |
| 网下有效申购股数 | int64   | -       |
| 网下有效申购户数 | int64   | 注意单位: 户 |
| 网下配售认购倍数 | float64 | -       |
| 总发行数量    | int64   | -       |
| 开盘溢价     | float64 | -       |
| 首日涨幅     | float64 | -       |
| 上市日期     | object  | -       |

### stock_xgsglb_em
- **文档定位**：新股数据 / 新股申购与中签
- **HTTP**：`GET /api/public/stock_xgsglb_em`
- **调用**：运行 `scripts/aktools_get.py stock_xgsglb_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/xg/xg/default_2.html

描述: 东方财富网-数据中心-新股数据-新股申购-新股申购与中签查询

限量: 单次获取指定 market 的新股申购与中签查询数据

输入参数

| 名称     | 类型  | 描述                                                                     |
|--------|-----|------------------------------------------------------------------------|
| symbol | str | symbol="全部股票"; choice of {"全部股票", "沪市主板", "科创板", "深市主板", "创业板", "北交所"} |

输出参数-其他（除北交所外）

| 名称       | 类型      | 描述      |
|----------|---------|---------|
| 股票代码     | object  | -       |
| 股票简称     | object  | -       |
| 交易所      | object  | -       |
| 板块       | object  | -       |
| 申购代码     | object  | -       |
| 发行总数     | float64 | 注意单位: 股 |
| 网上发行     | int64   | 注意单位: 股 |
| 顶格申购需配市值 | float64 | 注意单位: 股 |
| 申购上限     | int64   | -       |
| 发行价格     | float64 | -       |
| 最新价      | float64 | -       |
| 首日收盘价    | float64 | -       |
| 申购日期     | object  | -       |
| 中签号公布日   | object  | -       |
| 中签缴款日期   | object  | -       |
| 上市日期     | object  | -       |
| 发行市盈率    | float64 | -       |
| 行业市盈率    | float64 | -       |
| 中签率      | float64 | 注意单位: % |
| 询价累计报价倍数 | float64 | -       |
| 配售对象报价家数 | float64 | -       |
| 连续一字板数量  | object  | -       |
| 涨幅       | float64 | 注意单位: % |
| 每中一签获利   | float64 | 注意单位: 元 |

接口示例-其他（除北交所外）

```python
import akshare as ak

stock_xgsglb_em_df = ak.stock_xgsglb_em(symbol="全部股票")
print(stock_xgsglb_em_df)
```

### stock_ipo_ths
- **文档定位**：新股数据 / 新股申购与中签-同花顺
- **HTTP**：`GET /api/public/stock_ipo_ths`
- **调用**：运行 `scripts/aktools_get.py stock_ipo_ths --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.10jqka.com.cn/ipo/xgsgyzq/

描述: 同花顺-数据中心-新股申购与中签

限量: 单次返回指定 symbol 的历史新股申购与中签数据

输入参数

| 名称     | 类型  | 描述                                                                      |
|--------|-----|-------------------------------------------------------------------------|
| symbol | str | symbol="全部A股"; choice of {"全部A股", "沪市主板", "深市主板", "创业板", "科创板", "京市主板"} |

输出参数

| 名称           | 类型     | 描述 |
|--------------|--------|----|
| 股票代码         | object | -  |
| 股票简称         | object | -  |
| 申购代码         | object | -  |
| 发行总数（万股）     | object | -  |
| 网上发行（万股）     | object | -  |
| 申购上限（万股）     | object | -  |
| 顶格申购需配市值（万元） | object | -  |
| 发行价格         | object | -  |
| 发行市盈率        | object | -  |
| 行业市盈率        | object | -  |
| 申购日期         | object | -  |
| 中签率（%）       | object | -  |
| 中签号          | object | -  |
| 中签缴款日期       | object | -  |
| 上市日期         | object | -  |
| 打新收益（元）      | object | -  |
| 首日最高涨幅       | object | -  |
| 连板天数         | object | -  |

### stock_ipo_hk_ths
- **文档定位**：新股数据 / 新股申购与中签-港股-同花顺
- **HTTP**：`GET /api/public/stock_ipo_hk_ths`
- **调用**：运行 `scripts/aktools_get.py stock_ipo_hk_ths --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.10jqka.com.cn/ipo/xgsgyzq/

描述: 同花顺-数据中心-新股申购与中签-港股

限量: 单次返回所有港股新股申购与中签数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称           | 类型     | 描述 |
|--------------|--------|----|
| 股票代码         | object | -  |
| 股票简称         | object | -  |
| 申购代码         | object | -  |
| 发行总数（万股）     | object | -  |
| 网上发行（万股）     | object | -  |
| 申购上限（万股）     | object | -  |
| 顶格申购需配市值（万元） | object | -  |
| 发行价格         | object | -  |
| 发行市盈率        | object | -  |
| 行业市盈率        | object | -  |
| 申购日期         | object | -  |
| 中签率（%）       | object | -  |
| 中签号          | object | -  |
| 中签缴款日期       | object | -  |
| 上市日期         | object | -  |
| 打新收益（元）      | object | -  |
| 首日最高涨幅       | object | -  |
| 连板天数         | object | -  |
