# 其他细分主题



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### crypto_bitcoin_cme
- **文档定位**：CME-成交量报告
- **HTTP**：`GET /api/public/crypto_bitcoin_cme`
- **调用**：运行 `scripts/aktools_get.py crypto_bitcoin_cme --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_cme_btc_report

描述: 芝加哥商业交易所-比特币成交量报告

限量: 单次返回指定交易日的比特币成交量报告数据

输入参数

| 名称   | 类型  | 描述              |
|------|-----|-----------------|
| date | str | date="20230830" |

输出参数

| 名称     | 类型      | 描述 |
|--------|---------|----|
| 商品     | object  | -  |
| 类型     | object  | -  |
| 电子交易合约 | int64   | -  |
| 场内成交合约 | float64 | -  |
| 场外成交合约 | int64   | -  |
| 成交量    | int64   | -  |
| 未平仓合约  | int64   | -  |
| 持仓变化   | int64   | -  |

### crypto_js_spot
- **文档定位**：实时数据
- **HTTP**：`GET /api/public/crypto_js_spot`
- **调用**：运行 `scripts/aktools_get.py crypto_js_spot --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_bitcoin_current

描述: 加密货币实时行情

限量: 单次返回主流加密货币当前时点行情数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称      | 类型      | 描述     |
|---------|---------|--------|
| 市场      | object  | -      |
| 交易品种    | object  | -      |
| 最近报价    | float64 | -      |
| 涨跌额     | float64 | -      |
| 涨跌幅     | float64 | -      |
| 24小时最高  | float64 | -      |
| 24小时最低  | float64 | 注意货币币种 |
| 24小时成交量 | float64 | 注意货币币种 |
| 更新时间    | float64 | -      |

### crypto_bitcoin_hold_report
- **文档定位**：持仓报告 / 比特币持仓报告
- **HTTP**：`GET /api/public/crypto_bitcoin_hold_report`
- **调用**：运行 `scripts/aktools_get.py crypto_bitcoin_hold_report --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/dc_report?name=bitcoint

描述: 比特币持仓报告

限量: 单次返回当前时点的比特币持仓报告数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称       | 类型      | 描述      |
|----------|---------|---------|
| 代码       | object  | 日期时间-索引 |
| 公司名称-英文  | object  | -       |
| 公司名称-中文  | object  | -       |
| 国家/地区    | object  | -       |
| 市值       | float64 | -       |
| 比特币占市值比重 | float64 | 注意单位: % |
| 持仓成本     | float64 | -       |
| 持仓占比     | float64 | 注意单位: % |
| 持仓量      | float64 | -       |
| 当日持仓市值   | float64 | -       |
| 查询日期     | object  | -       |
| 公告链接     | object  | -       |
| 分类       | object  | -       |
| 倍数       | float64 | -       |
