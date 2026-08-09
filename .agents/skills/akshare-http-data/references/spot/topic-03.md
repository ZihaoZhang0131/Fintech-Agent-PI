# 其他细分主题



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### spot_price_qh
- **文档定位**：99 现货走势
- **HTTP**：`GET /api/public/spot_price_qh`
- **调用**：运行 `scripts/aktools_get.py spot_price_qh --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.99qh.com/data/spotTrend

描述: 99 期货-数据-期现-现货走势

限量: 单次返回指定 symbol 的所有历史数据；由于数据源限制，只能获取个别品种

输入参数

| 名称     | 类型  | 描述                                                |
|--------|-----|---------------------------------------------------|
| symbol | str | symbol="螺纹钢"; 可以通过 ak.spot_price_table_qh() 获取品种表 |

输出参数

| 名称    | 类型      | 描述 |
|-------|---------|----|
| 日期    | object  | -  |
| 期货收盘价 | float64 | -  |
| 现货价格  | float64 | -  |
