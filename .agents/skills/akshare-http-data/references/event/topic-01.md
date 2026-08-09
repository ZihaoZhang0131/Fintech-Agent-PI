# 其他细分主题



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### migration_area_baidu
- **文档定位**：迁徙数据-百度 / 迁入与迁出地详情
- **HTTP**：`GET /api/public/migration_area_baidu`
- **调用**：运行 `scripts/aktools_get.py migration_area_baidu --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://qianxi.baidu.com/?from=shoubai#city=0

描述: 百度-百度地图慧眼-百度迁徙-迁入/迁出地数据接口

限量: 单次返回前 100 个城市的数据

输入参数

| 名称        | 类型  | 描述                                                          |
|-----------|-----|-------------------------------------------------------------|
| area      | str | area="乌鲁木齐市", 输入需要查询的省份或者城市, 都需要用全称, 比如: "浙江省", "乌鲁木齐市"     |
| indicator | str | indicator="move_in", 返回迁入地详情, indicator="move_out", 返回迁出地详情 |
| date      | str | date="20230922", 需要滞后一天                                     |

输出参数

| 名称            | 类型      | 描述       |
|---------------|---------|----------|
| city_name     | object  | 城市名称     |
| province_name | object  | 所属省份     |
| value         | float64 | 迁徙规模, 比例 |

### migration_scale_baidu
- **文档定位**：迁徙数据-百度 / 迁徙规模
- **HTTP**：`GET /api/public/migration_scale_baidu`
- **调用**：运行 `scripts/aktools_get.py migration_scale_baidu --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://qianxi.baidu.com/?from=shoubai#city=0

描述: 百度-百度地图慧眼-百度迁徙-迁徙规模

- 迁徙规模指数：反映迁入或迁出人口规模，城市间可横向对比
- 城市迁徙边界采用该城市行政区划，包含该城市管辖的区、县、乡、村

限量: 单次返回所有迁徙规模数据

输入参数

| 名称        | 类型  | 描述                                                          |
|-----------|-----|-------------------------------------------------------------|
| area      | str | area="广州市", 输入需要查询的省份或者城市, 都需要用全称, 比如: "浙江省", "乌鲁木齐市"       |
| indicator | str | indicator="move_in", 返回迁入地详情, indicator="move_out", 返回迁出地详情 |

输出参数

| 名称     | 类型      | 描述     |
|--------|---------|--------|
| 日期     | object  | -      |
| 迁徙规模指数 | float64 | 定义参见百度 |
