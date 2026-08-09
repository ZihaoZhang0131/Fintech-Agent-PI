# 其他细分主题



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### hf_sp_500
- **文档定位**：标普 500 指数
- **HTTP**：`GET /api/public/hf_sp_500`
- **调用**：运行 `scripts/aktools_get.py hf_sp_500 --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://github.com/FutureSharks/financial-data

描述: 获取标普 500 指数的分钟数据, 由于数据量比较大, 需要等待, 由于服务器在国外, 建议使用代理访问

输入参数

| 名称   | 类型  | 描述                                   |
|------|-----|--------------------------------------|
| year | str | year="2017"; 只能获取 **2012-2018** 年的数据 |

输出参数

| 名称    | 类型      | 描述   |
|-------|---------|------|
| date  | object  | 日期时间 |
| open  | float64 | 开盘价  |
| high  | float64 | 最高价  |
| low   | float64 | 最低价  |
| close | float64 | 收盘价  |
