# A股



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### stock_zh_scale_comparison_em
- **文档定位**：A股 / 同行比较 / 公司规模
- **HTTP**：`GET /api/public/stock_zh_scale_comparison_em`
- **调用**：运行 `scripts/aktools_get.py stock_zh_scale_comparison_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://emweb.securities.eastmoney.com/pc_hsf10/pages/index.html?type=web&code=000895&color=b#/thbj/gsgm

描述: 东方财富-行情中心-同行比较-公司规模

限量: 单次返回全部数据

输入参数

| 名称         | 类型  | 描述                    |
|------------|-----|-----------------------|
| symbol     | str | symbol="SZ000895"     |

输出参数

| 名称     | 类型      | 描述 |
|--------|---------|----|
| 代码     | object  | -  |
| 简称     | object  | -  |
| 总市值    | float64 | -  |
| 总市值排名  | int64   | -  |
| 流通市值   | float64 | -  |
| 流通市值排名 | int64   | -  |
| 营业收入   | float64 | -  |
| 营业收入排名 | int64   | -  |
| 净利润    | float64 | -  |
| 净利润排名  | int64   | -  |
