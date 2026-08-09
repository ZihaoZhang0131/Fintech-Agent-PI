# 其他细分主题



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### macro_info_ws
- **文档定位**：全球宏观 / 宏观日历
- **HTTP**：`GET /api/public/macro_info_ws`
- **调用**：运行 `scripts/aktools_get.py macro_info_ws --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://wallstreetcn.com/calendar

描述: 华尔街见闻-日历-宏观

限量: 单次返回指定 date 的数据

输入参数

| 名称   | 类型  | 描述              |
|------|-----|-----------------|
| date | str | date="20240514" |

输出参数

| 名称  | 类型      | 描述 |
|-----|---------|----|
| 时间  | object  | -  |
| 地区  | object  | -  |
| 事件  | object  | -  |
| 重要性 | int64   | -  |
| 今值  | float64 | -  |
| 预期  | float64 | -  |
| 前值  | float64 | -  |
| 链接  | object  | -  |

### news_economic_baidu
- **文档定位**：全球宏观 / 全球宏观事件
- **HTTP**：`GET /api/public/news_economic_baidu`
- **调用**：运行 `scripts/aktools_get.py news_economic_baidu --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://gushitong.baidu.com/calendar

描述: 全球宏观指标重大事件

限量: 单次返回指定 date 的所有历史数据

输入参数

| 名称   | 类型  | 描述              |
|------|-----|-----------------|
| date | str | date="20241107" |

输出参数

| 名称  | 类型      | 描述      |
|-----|---------|---------|
| 日期  | object  | -       |
| 时间  | object  | -       |
| 地区  | object  | -       |
| 事件  | object  | -       |
| 公布  | float64 | -       |
| 预期  | float64 | -       |
| 前值  | float64 | -       |
| 重要性 | float64 | 数值越大越重要 |
