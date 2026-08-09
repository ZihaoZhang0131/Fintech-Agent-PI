# 其他细分主题



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### currency_currencies
- **文档定位**：货币基础信息查询
- **HTTP**：`GET /api/public/currency_currencies`
- **调用**：运行 `scripts/aktools_get.py currency_currencies --param key=value`；参数以本卡的输入参数表为准。

注意：此接口使用外部 API, 免费账号每月限量访问 5000 次, 可以在 [currencyscoop](https://currencyscoop.com/) 注册

目标地址: https://currencyscoop.com/

描述: 所有货币的基础信息

限量: 单次返回指定所有货币基础信息

输入参数

| 名称      | 类型  | 描述                  |
|---------|-----|---------------------|
| c_type  | str | c_type="fiat"       |
| api_key | str | api_key="此处输入 API"; |

输出参数

| 名称                  | 类型     | 描述 |
|---------------------|--------|----|
| id                  | int64  | -  |
| name                | object | -  |
| short_code          | object | -  |
| code                | object | -  |
| precision           | int64  | -  |
| subunit             | int64  | -  |
| symbol              | object | -  |
| symbol_first        | bool   | -  |
| decimal_mark        | object | -  |
| thousands_separator | object | -  |

### currency_convert
- **文档定位**：货币对价格转换
- **HTTP**：`GET /api/public/currency_convert`
- **调用**：运行 `scripts/aktools_get.py currency_convert --param key=value`；参数以本卡的输入参数表为准。

注意：此接口使用外部 API, 免费账号每月限量访问 5000 次, 可以在 [currencyscoop](https://currencyscoop.com/) 注册

目标地址: https://currencyscoop.com/

描述: 指定货币对指定货币数量的转换后价格

限量: 单次返回指定货币对的转换后价格

输入参数

| 名称      | 类型  | 描述                  |
|---------|-----|---------------------|
| base    | str | base="USD"; 基础货币    |
| to      | str | to="CNY"; 需要转换到的货币  |
| amount  | str | amount="10000"; 转换量 |
| api_key | str | api_key="此处输入 API"; |

输出参数

| 名称    | 类型     | 描述 |
|-------|--------|----|
| item  | object | -  |
| value | object | -  |

### currency_history
- **文档定位**：货币报价历史数据
- **HTTP**：`GET /api/public/currency_history`
- **调用**：运行 `scripts/aktools_get.py currency_history --param key=value`；参数以本卡的输入参数表为准。

注意：此接口使用外部 API, 免费账号每月限量访问 5000 次, 可以在 [currencyscoop](https://currencyscoop.com/) 注册

目标地址: https://currencyscoop.com/

描述: 货币报价历史数据

限量: 单次返回指定货币在指定交易日的报价历史数据-免费账号每月限量访问 5000 次

输入参数

| 名称      | 类型  | 描述                                                                                                          |
|---------|-----|-------------------------------------------------------------------------------------------------------------|
| base    | str | base="USD"                                                                                                  |
| date    | str | date="2023-02-03"                                                                                           |
| symbols | str | symbols=""; 默认返回全部, 可以在此处设置 symbols="AUD", 则返回 AUD 的数据; 可以在此处设置 symbols: str = "AUD,CNY", 则返回 AUD 和 CNY 的数据 |
| api_key | str | api_key="此处输入 API";                                                                                         |

输出参数

| 名称       | 类型      | 描述   |
|----------|---------|------|
| currency | object  | 货币代码 |
| date     | object  | 日期   |
| base     | float64 | 货币   |
| rates    | float64 | 比率   |

### currency_time_series
- **文档定位**：货币报价时间序列数据
- **HTTP**：`GET /api/public/currency_time_series`
- **调用**：运行 `scripts/aktools_get.py currency_time_series --param key=value`；参数以本卡的输入参数表为准。

注意：此接口使用外部 API, 免费账号每月限量访问 5000 次, 可以在 [currencyscoop](https://currencyscoop.com/) 注册

目标地址: https://currencyscoop.com/

描述: 货币报价时间序列数据

限量: 单次返回指定货币在指定交易日到另一指定交易日的报价数据

输入参数

| 名称         | 类型  | 描述                                                                                                          |
|------------|-----|-------------------------------------------------------------------------------------------------------------|
| base       | str | base="USD"                                                                                                  |
| start_date | str | start_date="2023-02-03"                                                                                     |
| end_date   | str | end_date="2023-03-04"                                                                                       |
| symbols    | str | symbols=""; 默认返回全部, 可以在此处设置 symbols="AUD", 则返回 AUD 的数据; 可以在此处设置 symbols: str = "AUD,CNY", 则返回 AUD 和 CNY 的数据 |
| api_key    | str | api_key="此处输入 API";                                                                                         |

输出参数

| 名称   | 类型      | 描述     |
|------|---------|--------|
| date | object  | 日期     |
| ...  | float64 | 货币价格数据 |

### currency_latest
- **文档定位**：货币报价最新数据
- **HTTP**：`GET /api/public/currency_latest`
- **调用**：运行 `scripts/aktools_get.py currency_latest --param key=value`；参数以本卡的输入参数表为准。

注意：此接口使用外部 API, 免费账号每月限量访问 5000 次, 可以在 [currencyscoop](https://currencyscoop.com/) 注册

目标地址: https://currencyscoop.com/

描述: 货币报价最新数据

限量: 单次返回指定货币的最新报价数据

输入参数

| 名称      | 类型  | 描述                                                                                                          |
|---------|-----|-------------------------------------------------------------------------------------------------------------|
| base    | str | base="USD"                                                                                                  |
| symbols | str | symbols=""; 默认返回全部, 可以在此处设置 symbols="AUD", 则返回 AUD 的数据; 可以在此处设置 symbols: str = "AUD,CNY", 则返回 AUD 和 CNY 的数据 |
| api_key | str | api_key="此处输入 API";                                                                                         |

更多相关参数可以访问: https://currencybeacon.com/api-documentation 和 https://currencybeacon.com/supported-currencies

输出参数

| 名称       | 类型                  | 描述        |
|----------|---------------------|-----------|
| currency | object              | 货币代码      |
| date     | datetime64[ns, UTC] | 日期时间-注意时区 |
| base     | object              | 货币        |
| rates    | float64             | 比率        |
