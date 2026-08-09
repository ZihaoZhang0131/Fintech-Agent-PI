# 生猪大数据



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### spot_hog_soozhu
- **文档定位**：生猪大数据 / 各省均价实时排行榜
- **HTTP**：`GET /api/public/spot_hog_soozhu`
- **调用**：运行 `scripts/aktools_get.py spot_hog_soozhu --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.soozhu.com/price/data/center/

描述: 搜猪-生猪大数据-各省均价实时排行榜

限量: 单次返回所有实时数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称  | 类型      | 描述 |
|-----|---------|----|
| 省份  | object  | -  |
| 价格  | float64 | -  |
| 涨跌幅 | float64 | -  |

### spot_hog_year_trend_soozhu
- **文档定位**：生猪大数据 / 今年以来全国出栏均价走势
- **HTTP**：`GET /api/public/spot_hog_year_trend_soozhu`
- **调用**：运行 `scripts/aktools_get.py spot_hog_year_trend_soozhu --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.soozhu.com/price/data/center/

描述: 搜猪-生猪大数据-今年以来全国出栏均价走势

限量: 单次返回近一年所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称  | 类型      | 描述 |
|-----|---------|----|
| 日期  | object  | -  |
| 价格  | float64 | -  |

### spot_hog_lean_price_soozhu
- **文档定位**：生猪大数据 / 全国瘦肉型肉猪
- **HTTP**：`GET /api/public/spot_hog_lean_price_soozhu`
- **调用**：运行 `scripts/aktools_get.py spot_hog_lean_price_soozhu --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.soozhu.com/price/data/center/

描述: 搜猪-生猪大数据-全国瘦肉型肉猪

限量: 单次返回近半个月的历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称  | 类型      | 描述 |
|-----|---------|----|
| 日期  | object  | -  |
| 价格  | float64 | -  |

### spot_hog_three_way_soozhu
- **文档定位**：生猪大数据 / 全国三元仔猪
- **HTTP**：`GET /api/public/spot_hog_three_way_soozhu`
- **调用**：运行 `scripts/aktools_get.py spot_hog_three_way_soozhu --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.soozhu.com/price/data/center/

描述: 搜猪-生猪大数据-全国三元仔猪

限量: 单次返回近半个月的历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称  | 类型      | 描述 |
|-----|---------|----|
| 日期  | object  | -  |
| 价格  | float64 | -  |

### spot_hog_crossbred_soozhu
- **文档定位**：生猪大数据 / 全国后备二元母猪
- **HTTP**：`GET /api/public/spot_hog_crossbred_soozhu`
- **调用**：运行 `scripts/aktools_get.py spot_hog_crossbred_soozhu --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.soozhu.com/price/data/center/

描述: 搜猪-生猪大数据-全国后备二元母猪

限量: 单次返回近半个月的历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称  | 类型      | 描述 |
|-----|---------|----|
| 日期  | object  | -  |
| 价格  | float64 | -  |

### spot_corn_price_soozhu
- **文档定位**：生猪大数据 / 全国玉米价格走势
- **HTTP**：`GET /api/public/spot_corn_price_soozhu`
- **调用**：运行 `scripts/aktools_get.py spot_corn_price_soozhu --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.soozhu.com/price/data/center/

描述: 搜猪-生猪大数据-全国玉米价格走势

限量: 单次返回近半个月的历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称  | 类型      | 描述 |
|-----|---------|----|
| 日期  | object  | -  |
| 价格  | float64 | -  |

### spot_soybean_price_soozhu
- **文档定位**：生猪大数据 / 全国豆粕价格走势
- **HTTP**：`GET /api/public/spot_soybean_price_soozhu`
- **调用**：运行 `scripts/aktools_get.py spot_soybean_price_soozhu --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.soozhu.com/price/data/center/

描述: 搜猪-生猪大数据-全国豆粕价格走势

限量: 单次返回近半个月的历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称  | 类型      | 描述 |
|-----|---------|----|
| 日期  | object  | -  |
| 价格  | float64 | -  |

### spot_mixed_feed_soozhu
- **文档定位**：生猪大数据 / 全国育肥猪合料（含自配料）半月走势
- **HTTP**：`GET /api/public/spot_mixed_feed_soozhu`
- **调用**：运行 `scripts/aktools_get.py spot_mixed_feed_soozhu --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.soozhu.com/price/data/center/

描述: 搜猪-生猪大数据-全国育肥猪合料（含自配料）半月走势

限量: 单次返回近半个月的历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称  | 类型      | 描述 |
|-----|---------|----|
| 日期  | object  | -  |
| 价格  | float64 | -  |
