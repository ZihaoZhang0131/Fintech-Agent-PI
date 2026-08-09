# 其他细分主题



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### tool_trade_date_hist_sina
- **文档定位**：交易日历
- **HTTP**：`GET /api/public/tool_trade_date_hist_sina`
- **调用**：运行 `scripts/aktools_get.py tool_trade_date_hist_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://finance.sina.com.cn

描述: 新浪财经-股票交易日历数据

限量: 单次返回从 1990-12-19 到 2024-12-31 之间的股票交易日历数据, 这里补充 1992-05-04 进入交易日

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称         | 类型     | 描述                                                        |
|------------|--------|-----------------------------------------------------------|
| trade_date | object | 从 1990-12-19 至 2024-12-31 的股票交易日数据; 这里补充 1992-05-04 进入交易日 |
