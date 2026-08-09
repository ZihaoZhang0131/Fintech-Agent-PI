# 电影票房



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### movie_boxoffice_realtime
- **文档定位**：电影票房 / 实时票房
- **HTTP**：`GET /api/public/movie_boxoffice_realtime`
- **调用**：运行 `scripts/aktools_get.py movie_boxoffice_realtime --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://ys.endata.cn/BoxOffice/Movie

描述: 当前时刻的实时电影票房数据, 每 5 分钟更新一次数据, 实时票房包含今天未开映场次已售出的票房

限量: 当前时刻的实时票房数据

说明: 接口已切换至艺恩当前 `ys.endata.cn/enlib-api` 影片榜单接口, 输出金额统一按 `万` 进行换算

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 排序   | int64   | 票房排名    |
| 影片名称 | object  | -       |
| 实时票房 | float64 | 注意单位: 万 |
| 票房占比 | float64 | 注意单位: % |
| 上映天数 | int64   | -       |
| 累计票房 | float64 | 注意单位: 万 |

### movie_boxoffice_daily
- **文档定位**：电影票房 / 单日票房
- **HTTP**：`GET /api/public/movie_boxoffice_daily`
- **调用**：运行 `scripts/aktools_get.py movie_boxoffice_daily --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.endata.com.cn/BoxOffice/BO/Day/index.html

描述: 指定日期的电影票房数据, 每日 10:30, 12:30更新日票房，16:30 同时补充前 7 日票房

限量: 只能指定最近的日期

说明: 接口已迁移至艺恩当前 `ys.endata.cn/enlib-api` 数据源; 由于新站公开列表未返回口碑字段, `口碑指数` 当前统一返回空值

输入参数

| 名称   | 类型  | 描述                         |
|------|-----|----------------------------|
| date | str | date="20240219"; 只能选择最近的日期 |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 排序   | int64   | 票房排名    |
| 影片名称 | object  | -       |
| 单日票房 | int64   | 注意单位: 万 |
| 环比变化 | float64 | 注意单位: % |
| 累计票房 | int64   | 注意单位: 万 |
| 平均票价 | int64   | 注意单位: 元 |
| 场均人次 | int64   | -       |
| 口碑指数 | float64 | -       |
| 上映天数 | int64   | -       |

### movie_boxoffice_weekly
- **文档定位**：电影票房 / 单周票房
- **HTTP**：`GET /api/public/movie_boxoffice_weekly`
- **调用**：运行 `scripts/aktools_get.py movie_boxoffice_weekly --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.endata.com.cn/BoxOffice/BO/Week/oneWeek.html

描述: 指定日期所在完整周的票房数据, 影片周票房数据初始更新周期为每周二，下周二补充数据

限量: 指定日期所在完整周的票房数据

说明: 艺恩新站公开周榜接口当前返回权限限制, 调用时会抛出明确的上游权限异常, 不再返回旧版 `JSONDecodeError`

输入参数

| 名称   | 类型  | 描述                             |
|------|-----|--------------------------------|
| date | str | date="20240218"; 指定日期所在周必须已经完整 |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 排序   | int64   | 票房排名    |
| 影片名称 | object  | -       |
| 排名变化 | int64   | -       |
| 单周票房 | int64   | 注意单位: 万 |
| 环比变化 | int64   | 注意单位: % |
| 累计票房 | int64   | 注意单位: 万 |
| 平均票价 | int64   | -       |
| 场均人次 | int64   | -       |
| 口碑指数 | float64 | -       |
| 上映天数 | int64   | -       |

### movie_boxoffice_monthly
- **文档定位**：电影票房 / 单月票房
- **HTTP**：`GET /api/public/movie_boxoffice_monthly`
- **调用**：运行 `scripts/aktools_get.py movie_boxoffice_monthly --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.endata.com.cn/BoxOffice/BO/Month/oneMonth.html

描述: 获取指定日期所在月份的票房数据, 每月5号更新上月票房，并补充之前两个月票房

限量: 指定日期所在月份的票房数据, 只能获取最近月份的数据

说明: 接口已迁移至艺恩当前 `ys.endata.cn/enlib-api` 数据源; 由于新站公开列表未返回口碑字段, `口碑指数` 当前统一返回空值

输入参数

| 名称   | 类型  | 描述                         |
|------|-----|----------------------------|
| date | str | date="20201019"; 输入具体的日期即可 |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 排序   | int64   | 票房排名    |
| 影片名称 | object  | -       |
| 单月票房 | int64   | 注意单位: 万 |
| 月度占比 | float64 | 注意单位: % |
| 平均票价 | int64   | -       |
| 场均人次 | int64   | -       |
| 上映日期 | object  | -       |
| 口碑指数 | float64 | -       |
| 月内天数 | float64 | -       |

### movie_boxoffice_yearly
- **文档定位**：电影票房 / 年度票房
- **HTTP**：`GET /api/public/movie_boxoffice_yearly`
- **调用**：运行 `scripts/aktools_get.py movie_boxoffice_yearly --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.endata.com.cn/BoxOffice/BO/Year/index.html

描述: 指定日期所在年度的票房数据

限量: 指定日期所在年度的票房数据, 只能获取最近年度的数据

说明: 接口已迁移至艺恩当前 `ys.endata.cn/enlib-api` 数据源

输入参数

| 名称   | 类型  | 描述                         |
|------|-----|----------------------------|
| date | str | date="20240218"; 输入具体的日期即可 |

输出参数

| 名称    | 类型      | 描述      |
|-------|---------|---------|
| 排序    | int64   | 票房排名    |
| 影片名称  | object  | -       |
| 类型    | object  | -       |
| 总票房   | int64   | 注意单位: 万 |
| 平均票价  | int64   | -       |
| 场均人次  | float64 | -       |
| 国家及地区 | object  | -       |
| 上映日期  | object  | -       |

### movie_boxoffice_yearly_first_week
- **文档定位**：电影票房 / 年度首周票房
- **HTTP**：`GET /api/public/movie_boxoffice_yearly_first_week`
- **调用**：运行 `scripts/aktools_get.py movie_boxoffice_yearly_first_week --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.endata.com.cn/BoxOffice/BO/Year/firstWeek.html

描述: 指定日期所在年度的年度首周票房数据

限量: 指定日期所在年度的年度首周票房数据, 只能获取最近年度的数据

说明: 接口已迁移至艺恩当前 `ys.endata.cn/enlib-api` 年榜数据源, 其中 `首周天数` 依据上映日期按首周自然周区间估算

输入参数

| 名称   | 类型  | 描述                         |
|------|-----|----------------------------|
| date | str | date="20201018"; 输入具体的日期即可 |

输出参数

| 名称     | 类型     | 描述      |
|--------|--------|---------|
| 排序     | int64  | 票房排名    |
| 影片名称   | object | -       |
| 类型     | object | -       |
| 首周票房   | int64  | 注意单位: 万 |
| 占总票房比重 | int64  | 注意单位: % |
| 场均人次   | int64  | -       |
| 国家及地区  | object | -       |
| 上映日期   | object | -       |
| 首周天数   | int64  | -       |

### movie_boxoffice_cinema_daily
- **文档定位**：电影票房 / 影院票房-日票房排行
- **HTTP**：`GET /api/public/movie_boxoffice_cinema_daily`
- **调用**：运行 `scripts/aktools_get.py movie_boxoffice_cinema_daily --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.endata.com.cn/BoxOffice/BO/Cinema/day.html

描述: 指定日期的每日各影院的票房数据

限量: 指定日期各影院的票房数据, 注意当前日期的数据需要第二日才可以获取

说明: 接口已迁移至艺恩当前 `ys.endata.cn/enlib-api` 数据源

输入参数

| 名称   | 类型  | 描述                         |
|------|-----|----------------------------|
| date | str | date="20240219"; 输入具体的日期即可 |

输出参数

| 名称   | 类型      | 描述      |
|------|---------|---------|
| 排序   | int64   | 票房排名    |
| 影院名称 | object  | -       |
| 单日票房 | float64 | 注意单位: 元 |
| 单日场次 | int64   | -       |
| 场均人次 | float64 | -       |
| 场均票价 | float64 | -       |
| 上座率  | float64 | 注意单位: % |

### movie_boxoffice_cinema_weekly
- **文档定位**：电影票房 / 影院票房-周票房排行
- **HTTP**：`GET /api/public/movie_boxoffice_cinema_weekly`
- **调用**：运行 `scripts/aktools_get.py movie_boxoffice_cinema_weekly --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.endata.com.cn/BoxOffice/BO/Cinema/week.html

描述: 指定日期的完整周各影院的票房数据

限量: 指定日期的完整周各影院的票房数据, 注意当前日期的数据只能返回上周的数据

说明: 艺恩新站公开影院周榜接口当前返回系统错误, 调用时会抛出明确的上游权限异常, 不再返回旧版 `JSONDecodeError`

输入参数

| 名称   | 类型  | 描述                         |
|------|-----|----------------------------|
| date | str | date="20240219"; 输入具体的日期即可 |

输出参数

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| 排序     | int64   | 票房排名    |
| 影院名称   | object  | -       |
| 当周票房   | float64 | 注意单位: 万 |
| 单银幕票房  | float64 | 注意单位: 元 |
| 场均人次   | float64 | -       |
| 单日单厅票房 | float64 | -       |
| 单日单厅场次 | float64 | -       |
