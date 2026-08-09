# 空气质量-全国



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### air_city_table
- **文档定位**：空气质量-全国 / 城市列表
- **HTTP**：`GET /api/public/air_city_table`
- **调用**：运行 `scripts/aktools_get.py air_city_table --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.aqistudy.cn/

描述: 所有能获取空气质量数据的城市表

限量: 单次返回所有可以获取的城市表数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称      | 类型      | 描述  |
|---------|---------|-----|
| 序号      | int64   | -   |
| 省份      | object  | -   |
| 城市      | object  | -   |
| AQI     | float64 | -   |
| 空气质量    | object  | -   |
| PM2.5浓度 | object  | -   |
| 首要污染物   | object  | -   |

### air_quality_hist
- **文档定位**：空气质量-全国 / 空气质量历史数据
- **HTTP**：`GET /api/public/air_quality_hist`
- **调用**：运行 `scripts/aktools_get.py air_quality_hist --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.zq12369.com/

描述: 指定城市和数据频率下并且在指定时间段内的空气质量数据

限量: 单次返回所有的数据, 在提取一小时频率数据时请注意时间跨度不宜过长, 提取日频率数据的早年数据请分段提取

输入参数

| 名称         | 类型  | 描述                                                                             |
|------------|-----|--------------------------------------------------------------------------------|
| city       | str | city="北京"; 调用 ak.air_city_table() 接口获取所有城市列表                                   |
| period     | str | period="day"; "hour": 每小时一个数据, 由于数据量比较大, 下载较慢; "day": 每天一个数据; "month": 每个月一个数据 |
| start_date | str | start_date="20200320"; 注意 **start_date** 和 **end_date** 跨度不宜过长                 |
| end_date   | str | end_date="20200427"; 注意 **start_date** 和 **end_date** 跨度不宜过长                   |

输出参数

| 名称                | 类型      | 描述     |
|-------------------|---------|--------|
| time              | object  | 日期时间索引 |
| aqi               | object  | AQI    |
| pm2_5             | float64 | PM2.5  |
| pm10              | object  | PM10   |
| co                | float64 | CO     |
| no2               | object  | NO2    |
| o3                | object  | O3     |
| so2               | object  | SO2    |
| complexindex      | object  | 综合指数   |
| rank              | object  | 排名     |
| primary_pollutant | object  | 主要污染物  |
| temp              | object  | 温度     |
| humi              | object  | 湿度     |
| windlevel         | object  | 风级     |
| winddirection     | object  | 风向     |
| weather           | object  | 天气     |

接口示例-小时频率

```python
import akshare as ak

air_quality_hist_df = ak.air_quality_hist(city="北京", period="hour", start_date="20200425", end_date="20200427")
print(air_quality_hist_df)
```

### air_quality_rank
- **文档定位**：空气质量-全国 / 空气质量排名
- **HTTP**：`GET /api/public/air_quality_rank`
- **调用**：运行 `scripts/aktools_get.py air_quality_rank --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.zq12369.com/environment.php

描述: 获取指定 date 时间点上所有城市(168个)的空气质量数据

限量: 单次返回所有的数据

输入参数

| 名称   | 类型  | 描述                                                                                       |
|------|-----|------------------------------------------------------------------------------------------|
| date | str | date=""; "": 当前时刻空气质量排名, 默认; "20200312": 当日空气质量排名; "202003": 当月空气质量排名; "2019": 当年空气质量排名; |

输出参数

| 名称      | 类型    | 描述  |
|---------|-------|-----|
| 降序      | str   | 排名  |
| 省份      | str   | -   |
| 城市      | str   | -   |
| AQI     | float | -   |
| 空气质量    | str   | -   |
| PM2.5浓度 | str   | -   |
| 首要污染物   | str   | -   |

接口示例-实时

```python
import akshare as ak

air_quality_rank_df = ak.air_quality_rank(date="")
print(air_quality_rank_df)
```

### air_quality_watch_point
- **文档定位**：空气质量-全国 / 监测点空气质量
- **HTTP**：`GET /api/public/air_quality_watch_point`
- **调用**：运行 `scripts/aktools_get.py air_quality_watch_point --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.zq12369.com/environment.php

描述: 获取每个城市的所有空气质量监测点的数据

限量: 单次返回指定城市指定日期区间的所有监测点的空气质量数据

输入参数

| 名称         | 类型     | 描述                                           |
|------------|--------|----------------------------------------------|
| city       | object | city="杭州"; 调用 ak.air_city_table() 接口获取所有城市列表 | |
| start_date | object | start_date="2018-01-01"                      |
| end_date   | object | end_date="2020-04-27"                        |

输出参数

| 名称        | 类型      | 描述    |
|-----------|---------|-------|
| pointname | object  | 监测点名称 |
| aqi       | float64 | AQI   |
| pm2_5     | float64 | PM2.5 |
| pm10      | float64 | PM10  |
| no2       | float64 | NO2   |
| so2       | float64 | SO2   |
| o3        | float64 | O3    |
| co        | float64 | CO    |
