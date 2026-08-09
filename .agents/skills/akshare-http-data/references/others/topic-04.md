# 其他细分主题



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### index_bloomberg_billionaires
- **文档定位**：彭博亿万富豪指数 / 彭博实时亿万富豪指数
- **HTTP**：`GET /api/public/index_bloomberg_billionaires`
- **调用**：运行 `scripts/aktools_get.py index_bloomberg_billionaires --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.bloomberg.com/billionaires/

描述: 彭博亿万富豪指数, 全球前 500 名; 该接口需要使用代理访问

限量: 单次返回所有数据彭博亿万富豪排名数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称              | 类型  | 描述              |
|-----------------|-----|-----------------|
| rank            | str | Rank            |
| name            | str | Name            |
| total_net_worth | str | Total net worth |
| last_change     | str | $ Last change   |
| YTD_change      | str | $ YTD change    |
| country         | str | Country         |
| industry        | str | Industry        |

### index_bloomberg_billionaires_hist
- **文档定位**：彭博亿万富豪指数 / 历史彭博亿万富豪指数
- **HTTP**：`GET /api/public/index_bloomberg_billionaires_hist`
- **调用**：运行 `scripts/aktools_get.py index_bloomberg_billionaires_hist --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://stats.areppim.com/stats/links_billionairexlists.htm

描述: 按照年份查询彭博亿万富豪指数; 该接口需要使用代理访问

限量: 单次返回当年所有数据彭博亿万富豪排名数据

输入参数

| 名称   | 类型  | 描述                                                   |
|------|-----|------------------------------------------------------|
| year | str | year="2021"; choice of {"2021", "2019", "2018", ...} |

输出参数

| 名称              | 类型  | 描述              |
|-----------------|-----|-----------------|
| rank            | str | Rank            |
| name            | str | Name            |
| total_net_worth | str | Total net worth |
| last_change     | str | $ Last change   |
| YTD_change      | str | $ YTD change    |
| country         | str | Country         |
| industry        | str | Industry        |
| age             | str | Age             |

### game_hot_rank_taptap
- **文档定位**：彭博亿万富豪指数 / TapTap 游戏榜单
- **HTTP**：`GET /api/public/game_hot_rank_taptap`
- **调用**：运行 `scripts/aktools_get.py game_hot_rank_taptap --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.taptap.cn/top/played

描述: 按照榜单类型查询 TapTap 平台游戏排行榜数据

限量: 单次返回指定榜单的全部游戏排名数据

输入参数

| 名称     | 类型  | 描述                                                          |
|--------|-----|-------------------------------------------------------------|
| symbol | str | symbol="热玩榜"; choice of {"热玩榜", "热门榜", "新品榜", "预约榜", "热卖榜"} |

输出参数

| 名称   | 类型             | 描述                        |
|------|----------------|---------------------------|
| 排名   | int            | 榜单排名                      |
| 游戏名称 | str            | 游戏名称                      |
| 评分   | float          | TapTap 玩家评分 (0-10 分制)     |
| 总点击量 | int            | 游戏页面累计点击量                 |
| 游玩次数 | int            | 累计游玩次数                    |
| 评论数  | int            | 评论总数                      |
| 粉丝数  | int            | 关注/粉丝数                    |
| 标签   | str            | 游戏标签 (逗号分隔, 如 "模拟经营, 治愈") |
| 推荐语  | str            | 编辑/官方推荐语                  |
| 发布时间 | datetime64[ns] | 游戏发布时间                    |
| 游戏ID | str            | TapTap 平台游戏唯一 ID          |
| 图标链接 | str            | 游戏图标 URL                  |
| 简介   | str            | 游戏简介文本 (已清洗 HTML 标签)      |

### stock_js_weibo_report
- **文档定位**：微博舆情报告
- **HTTP**：`GET /api/public/stock_js_weibo_report`
- **调用**：运行 `scripts/aktools_get.py stock_js_weibo_report --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/market

描述: 微博舆情报告中近期受关注的股票

限量: 单次返回指定时间内微博舆情报告中近期受关注的股票

输入参数

| 名称          | 类型  | 描述                                                                                     |
|-------------|-----|----------------------------------------------------------------------------------------|
| time_period | str | time_period="CNHOUR12"; 详见下表**time_period参数一览表**, 可通过调用 **stock_js_weibo_nlp_time** 获取 |

time_period 参数一览表

| 参数       | 说明   |
|----------|------|
| CNHOUR2  | 2小时  |
| CNHOUR6  | 6小时  |
| CNHOUR12 | 12小时 |
| CNHOUR24 | 1天   |
| CNDAY7   | 1周   |
| CNDAY30  | 1月   |

输出参数

| 名称   | 类型  | 描述     |
|------|-----|--------|
| name | str | 股票名称   |
| rate | str | 人气排行指数 |

### xincaifu_rank
- **文档定位**：新财富富豪榜
- **HTTP**：`GET /api/public/xincaifu_rank`
- **调用**：运行 `scripts/aktools_get.py xincaifu_rank --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.xcf.cn/zhuanti/ztzz/hdzt1/500frb/index.html

描述: 新财富 500 富豪榜, 从 2003 年至今

限量: 单次返回指定年份的富豪榜数据

输入参数

| 名称   | 类型  | 描述                      |
|------|-----|-------------------------|
| year | str | year="2020"; 从 2003 年至今 |

输出参数

| 名称   | 类型      | 描述       |
|------|---------|----------|
| 排名   | int64   | -        |
| 财富   | float64 | 注意单位: 亿元 |
| 姓名   | object  | -        |
| 主要公司 | object  | -        |
| 相关行业 | object  | -        |
| 公司总部 | object  | -        |
| 性别   | object  | -        |
| 年龄   | object  | -        |
| 年份   | int64   | -        |

### news_cctv
- **文档定位**：新闻联播文字稿
- **HTTP**：`GET /api/public/news_cctv`
- **调用**：运行 `scripts/aktools_get.py news_cctv --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://tv.cctv.com/lm/xwlb

描述: 新闻联播文字稿, 数据区间从 20160330-至今

限量: 单次返回指定日期新闻联播文字稿数据

输入参数

| 名称   | 类型  | 描述                            |
|------|-----|-------------------------------|
| date | str | date="20240424";  20160330-至今 |

输出参数

| 名称      | 类型     | 描述   |
|---------|--------|------|
| date    | object | 新闻日期 |
| title   | object | 新闻标题 |
| content | object | 新闻内容 |

### sunrise_daily
- **文档定位**：日出和日落 / 日出和日落-天
- **HTTP**：`GET /api/public/sunrise_daily`
- **调用**：运行 `scripts/aktools_get.py sunrise_daily --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.timeanddate.com/sun/china/

描述: 中国各大城市-日出和日落时间, 数据区间从 19990101-至今, 推荐使用代理访问

限量: 单次返回指定日期和指定城市的数据

输入参数

| 名称   | 类型  | 描述                         |
|------|-----|----------------------------|
| date | str | date="20240428"            |
| city | str | city="beijing"; 注意输入的城市的拼音 |

输出参数

| 名称         | 类型     | 描述                          |
|------------|--------|-----------------------------|
| date       | object | 日期                          |
| Sunrise    | object | 日出                          |
| Sunset     | object | 日落                          |
| Length     | object | Daylength-Length            |
| Difference | object | Daylength-Difference        |
| Start      | object | Astronomical Twilight-Start |
| End        | object | Astronomical Twilight-End   |
| Start.1    | object | Nautical Twilight-Start     |
| End.1      | object | Nautical Twilight-End       |
| Start.2    | object | Civil Twilight-Start        |
| End.2      | object | Civil Twilight-End          |
| Time       | object | Solar Noon-Time             |
| Mil. km    | object | Solar Noon-Mil. km          |

### sunrise_monthly
- **文档定位**：日出和日落 / 日出和日落-月
- **HTTP**：`GET /api/public/sunrise_monthly`
- **调用**：运行 `scripts/aktools_get.py sunrise_monthly --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.timeanddate.com/sun/china/

描述: 中国各大城市-日出和日落时间, 数据区间从 19990101-至今, 推荐使用代理访问

限量: 单次返回指定日期所在月份每天的数据, 如果是未来日期则为预测值

输入参数

| 名称   | 类型  | 描述                         |
|------|-----|----------------------------|
| date | str | date="20240428"            |
| city | str | city="beijing"; 注意输入的城市的拼音 |

输出参数

| 名称         | 类型     | 描述                          |
|------------|--------|-----------------------------|
| date       | object | 日期-索引; XXXX-XX 格式           |
| feb        | object | 月份简称-随月份变化                  |
| Sunrise    | object | 日出                          |
| Sunset     | object | 日落                          |
| Length     | object | Daylength-Length            |
| Difference | object | Daylength-Difference        |
| Start      | object | Astronomical Twilight-Start |
| End        | object | Astronomical Twilight-End   |
| Start.1    | object | Nautical Twilight-Start     |
| End.1      | object | Nautical Twilight-End       |
| Start.2    | object | Civil Twilight-Start        |
| End.2      | object | Civil Twilight-End          |
| Time       | object | Solar Noon-Time             |
| Mil. km    | object | Solar Noon-Mil. km          |

### forbes_rank
- **文档定位**：福布斯中国榜单
- **HTTP**：`GET /api/public/forbes_rank`
- **调用**：运行 `scripts/aktools_get.py forbes_rank --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.forbeschina.com/lists

描述: 福布斯中国-榜单数据, 一共 87 个指标的数据可以获取

限量: 单次返回指定 symbol 的数据

输入参数

| 名称     | 类型  | 描述                                                                                                  |
|--------|-----|-----------------------------------------------------------------------------------------------------|
| symbol | str | symbol="2020年福布斯中国400富豪榜"; 参考 **福布斯中国指标一览表**, 也可以访问 https://www.forbeschina.com/lists 获取所需要的 symbol |

福布斯中国指标一览表

|     | name                     | url                                    |
|----:|:-------------------------|:---------------------------------------|
|   0 | 2020福布斯中国400富豪榜          | https://www.forbeschina.com/lists/1750 |
|   1 | 2020福布斯菲律宾富豪榜            | https://www.forbeschina.com/lists/1746 |
|   2 | 2020福布斯美国富豪榜             | https://www.forbeschina.com/lists/1745 |
|   3 | 2020福布斯中国名人榜             | https://www.forbeschina.com/lists/1744 |
|   4 | 2020福布斯新加坡富豪榜            | https://www.forbeschina.com/lists/1743 |
|   5 | 2020福布斯中国最佳CEO榜          | https://www.forbeschina.com/lists/1741 |
|   6 | 2020福布斯中国医疗健康富豪榜         | https://www.forbeschina.com/lists/1740 |
|   7 | 2020福布斯中国慈善榜             | https://www.forbeschina.com/lists/1739 |
|   8 | 2020福布斯韩国富豪榜             | https://www.forbeschina.com/lists/1738 |
|   9 | 2020福布斯中国科技女性榜           | https://www.forbeschina.com/lists/1737 |
|  10 | 2020福布斯全球亿万富豪榜中国子榜       | https://www.forbeschina.com/lists/1734 |
|  11 | 2020福布斯全球亿万富豪榜           | https://www.forbeschina.com/lists/1733 |
|  12 | 2019福布斯中国400富豪榜          | https://www.forbeschina.com/lists/1728 |
|  13 | 2019福布斯中国最佳创投人TOP100     | https://www.forbeschina.com/lists/1747 |
|  14 | 2019福布斯全球最有影响力体育经纪人      | https://www.forbeschina.com/lists/1727 |
|  15 | 2019福布斯中国30位30岁以下精英榜     | https://www.forbeschina.com/lists/1725 |
|  16 | 2019福布斯美国400富豪榜          | https://www.forbeschina.com/lists/1722 |
|  17 | 2019福布斯菲律宾富豪榜            | https://www.forbeschina.com/lists/1721 |
|  18 | 2019福布斯中国慈善榜             | https://www.forbeschina.com/lists/1718 |
|  19 | 2019福布斯100名人榜            | https://www.forbeschina.com/lists/1717 |
|  20 | 2019福布斯韩国富豪榜             | https://www.forbeschina.com/lists/1716 |
|  21 | 2019福布斯马来西亚50富豪榜         | https://www.forbeschina.com/lists/19   |
|  22 | 2019福布斯中国最杰出商界女性排行榜      | https://www.forbeschina.com/lists/1165 |
|  23 | 2019福布斯全球亿万富豪榜           | https://www.forbeschina.com/lists/21   |
|  24 | 2018福布斯中国商界25位潜力女性       | https://www.forbeschina.com/lists/13   |
|  25 | 2018福布斯中国慈善榜             | https://www.forbeschina.com/lists/1156 |
|  26 | 2018福布斯中国最佳创投人TOP100     | https://www.forbeschina.com/lists/1258 |
|  27 | 2018福布斯中国最富有女性Top25      | https://www.forbeschina.com/lists/11   |
|  28 | 2018福布斯中国最佳女性创投人TOP25    | https://www.forbeschina.com/lists/12   |
|  29 | 2018中国最杰出商界女性排行榜         | https://www.forbeschina.com/lists/1145 |
|  30 | 2018中国分析师最佳价值发现榜         | https://www.forbeschina.com/lists/1147 |
|  31 | 2018中国最佳分析师50强榜          | https://www.forbeschina.com/lists/1148 |
|  32 | 2018福布斯中国分析师最佳预测盈利能力榜    | https://www.forbeschina.com/lists/1149 |
|  33 | 2018全球亿万富豪榜              | https://www.forbeschina.com/lists/1151 |
|  34 | 2018福布斯中国30位30岁以下精英榜     | https://www.forbeschina.com/lists/1157 |
|  35 | 2018福布斯中国上市公司最佳CEO       | https://www.forbeschina.com/lists/1159 |
|  36 | 2018福布斯中国400富豪榜          | https://www.forbeschina.com/lists/1162 |
|  37 | 2017福布斯全球科技界100富豪榜       | https://www.forbeschina.com/lists/1618 |
|  38 | 2017福布斯中国30位30岁以下精英榜     | https://www.forbeschina.com/lists/1617 |
|  39 | 2017华人富豪榜                | https://www.forbeschina.com/lists/1131 |
|  40 | 2017全球亿万富豪榜              | https://www.forbeschina.com/lists/1132 |
|  41 | 2017福布斯全球运动员收入榜          | https://www.forbeschina.com/lists/1644 |
|  42 | 2017福布斯台湾50富豪榜           | https://www.forbeschina.com/lists/1133 |
|  43 | 2017福布斯中国上市公司最佳CEO       | https://www.forbeschina.com/lists/1134 |
|  44 | 2017福布斯中国名人榜             | https://www.forbeschina.com/lists/1135 |
|  45 | 2017中国慈善榜                | https://www.forbeschina.com/lists/1681 |
|  46 | 2017分析师最佳预测盈利能力榜         | https://www.forbeschina.com/lists/1253 |
|  47 | 2017福布斯中国最佳创投人TOP100     | https://www.forbeschina.com/lists/1254 |
|  48 | 2017中国最佳分析师50强榜          | https://www.forbeschina.com/lists/1252 |
|  49 | 2020年福布斯世界最佳雇主TOP100     | https://www.forbeschina.com/lists/1749 |
|  50 | 2020福布斯中国上市公司潜力企业榜       | https://www.forbeschina.com/lists/1748 |
|  51 | 2020福布斯亚州中小上市企业榜         | https://www.forbeschina.com/lists/1742 |
|  52 | 2020福布斯中国最具创新力企业榜        | https://www.forbeschina.com/lists/1736 |
|  53 | 2020福布斯全球企业2000强榜        | https://www.forbeschina.com/lists/1735 |
|  54 | 2019福布斯全球最具价值的体育经纪机构     | https://www.forbeschina.com/lists/1726 |
|  55 | 2019福布斯全球数字经济100强榜       | https://www.forbeschina.com/lists/1724 |
|  56 | 2019福布斯中国最具创新力企业榜        | https://www.forbeschina.com/lists/1715 |
|  57 | 2018福布斯中国新三板企业融资能力榜TOP50 | https://www.forbeschina.com/lists/14   |
|  58 | 2018福布斯中国最具创新力企业榜        | https://www.forbeschina.com/lists/17   |
|  59 | 2018非上市公司潜力企业榜           | https://www.forbeschina.com/lists/18   |
|  60 | 2018福布斯中国最佳创投机构          | https://www.forbeschina.com/lists/20   |
|  61 | 2018上市公司潜力企业榜            | https://www.forbeschina.com/lists/1152 |
|  62 | 2018福布斯中国新三板TOP100       | https://www.forbeschina.com/lists/1155 |
|  63 | 2018福布斯中国最佳PE机构          | https://www.forbeschina.com/lists/1257 |
|  64 | 2017福布斯中国家族企业            | https://www.forbeschina.com/lists/1136 |
|  65 | 2017福布斯全球企业2000强         | https://www.forbeschina.com/lists/1139 |
|  66 | 2017值得关注的新三板企业           | https://www.forbeschina.com/lists/1459 |
|  67 | 2017中国非上市公司潜力企业榜         | https://www.forbeschina.com/lists/1460 |
|  68 | 2017福布斯中国最佳PE机构          | https://www.forbeschina.com/lists/1255 |
|  69 | 2017福布斯中国最佳创投机构          | https://www.forbeschina.com/lists/1256 |
|  70 | 2019福布斯美国大学排行榜           | https://www.forbeschina.com/lists/1720 |
|  71 | 2018福布斯创新力最强的30个城市       | https://www.forbeschina.com/lists/15   |
|  72 | 2018福布斯最适合新生活的宜居城市       | https://www.forbeschina.com/lists/16   |
|  73 | 2018福布斯中国大陆最佳商业城市        | https://www.forbeschina.com/lists/1163 |
|  74 | 2017福布斯中国大陆最佳商业城市        | https://www.forbeschina.com/lists/1138 |
|  75 | 2017福布斯中国大陆最佳地级城市30强     | https://www.forbeschina.com/lists/1140 |
|  76 | 2017福布斯中国大陆最佳县级城市30强     | https://www.forbeschina.com/lists/1141 |
|  77 | 2017福布斯创新力最强的30个城市       | https://www.forbeschina.com/lists/1142 |
|  78 | 2017福布斯经营成本最高的30个城市      | https://www.forbeschina.com/lists/1143 |
|  79 | 2015福布斯全球最适宜经商的国家和地区     | https://www.forbeschina.com/lists/1120 |
|  80 | 2015美国最适宜经商和就业的城市        | https://www.forbeschina.com/lists/1453 |
|  81 | 2015美国就业增长最快城市100强       | https://www.forbeschina.com/lists/1525 |
|  82 | 2015美国最适合经商和就业的州         | https://www.forbeschina.com/lists/1526 |
|  83 | 2014美国最适宜经商和就业的地区        | https://www.forbeschina.com/lists/1515 |
|  84 | 2014福布斯美国最适合经商和就业的州      | https://www.forbeschina.com/lists/1516 |
|  85 | 2014年世界最负盛名城市榜           | https://www.forbeschina.com/lists/1517 |
|  86 | 2014福布斯全球最适宜经商的国家和地区     | https://www.forbeschina.com/lists/1524 |

输出参数

| 名称  | 类型  | 描述              |
|-----|-----|-----------------|
| 排名  | str | -               |
| -   | -   | 根据不同的 symbol 而异 |

### air_quality_hebei
- **文档定位**：空气质量-河北 / 近期空气质量
- **HTTP**：`GET /api/public/air_quality_hebei`
- **调用**：运行 `scripts/aktools_get.py air_quality_hebei --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://218.11.10.130:8080/#/application/home

描述: 河北省实时空气质量数据

限量: 单次返回所有城市数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称         | 类型      | 描述            |
|------------|---------|---------------|
| 城市         | object  | 城市名称          |
| 区域         | object  | 城市下属行政区域      |
| 监测点        | object  | 监测站点名称        |
| 时间         | object  | 监测时间          |
| AQI        | float64 | 空气质量指数        |
| 空气质量等级     | object  | 空气质量级别(优、良等)  |
| 首要污染物      | object  | 主要污染物         |
| 经度         | float64 | 监测站点经度        |
| 纬度         | float64 | 监测站点纬度        |
| PM10_IAQI  | float64 | PM10空气质量分指数   |
| PM10_浓度    | float64 | PM10浓度值       |
| PM2.5_IAQI | float64 | PM2.5空气质量分指数  |
| PM2.5_浓度   | float64 | PM2.5浓度值      |
| 一氧化碳_IAQI  | float64 | CO空气质量分指数     |
| 一氧化碳_浓度    | float64 | CO浓度值         |
| 二氧化氮_IAQI  | float64 | NO2空气质量分指数    |
| 二氧化氮_浓度    | float64 | NO2浓度值        |
| 二氧化硫_IAQI  | float64 | SO2空气质量分指数    |
| 二氧化硫_浓度    | float64 | SO2浓度值        |
| 臭氧1小时_IAQI | float64 | O3 1小时空气质量分指数 |
| 臭氧1小时_浓度   | float64 | O3 1小时浓度值     |
| 臭氧8小时_IAQI | float64 | O3 8小时空气质量分指数 |
| 臭氧8小时_浓度   | float64 | O3 8小时浓度值     |

### hurun_rank
- **文档定位**：胡润排行榜
- **HTTP**：`GET /api/public/hurun_rank`
- **调用**：运行 `scripts/aktools_get.py hurun_rank --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.hurun.net/zh-CN/Rank/HsRankDetails?num=QWDD234E

描述: 胡润百富榜单；富豪榜系列，创业系列，500强系列，特色系列

限量: 单次返回指定 indicator 和 year 的榜单数据

输入参数

| 名称        | 类型  | 描述                                                                                                                                                                                                          |
|-----------|-----|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| indicator | str | indicator="胡润百富榜"; choice of {"胡润百富榜", "胡润全球富豪榜", "胡润印度榜", "胡润全球独角兽榜", "全球瞪羚企业榜", "胡润Under30s创业领袖榜", "胡润世界500强", "胡润艺术榜"}                                                                                   |
| year      | str | year="2020"; choice of {"胡润百富榜": "2014-至今", "胡润全球富豪榜": "2019-至今", "胡润印度榜": "2018-至今", "胡润全球独角兽榜": "2019-至今", "全球瞪羚企业榜": "2021-至今", "胡润Under30s创业领袖榜": "2019-至今", "胡润世界500强": "2020-至今", "胡润艺术榜": "2019-至今"} |

输出参数-胡润百富榜

| 名称  | 类型      | 描述       |
|-----|---------|----------|
| 排名  | int64   | -        |
| 财富  | float64 | 注意单位: 亿元 |
| 姓名  | object  | -        |
| 企业  | object  | -        |
| 行业  | object  | -        |

接口示例-胡润百富榜

```python
import akshare as ak

hurun_rank_df = ak.hurun_rank(indicator="胡润百富榜", year="2023")
print(hurun_rank_df)
```

### business_value_artist
- **文档定位**：艺人 / 艺人商业价值
- **HTTP**：`GET /api/public/business_value_artist`
- **调用**：运行 `scripts/aktools_get.py business_value_artist --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.endata.com.cn/Marketing/Artist/business.html

描述: 艺恩-艺人-艺人商业价值

限量: 返回当前的艺人商业价值数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述                                                                                                         |
|------|---------|------------------------------------------------------------------------------------------------------------|
| 排名   | int64   | -                                                                                                          |
| 艺人   | object  | -                                                                                                          |
| 商业价值 | float64 | 商业价值由专业度，关注度，预测热度加权汇总计算后得出，分值范围0~100，综合反映明星作品、代言表现、近期热度及舆情口碑。                                              |
| 专业热度 | float64 | 艺人专业热度主要表现艺人历史作品及品牌代言的效果情况，参与计算的指标维度包括历史主演电影票房表现，历史主演视频节目播映热度，电影作品豆瓣评分，作品相关微博内容评论正负向，历史代言品牌数量，品牌热度，艺人获奖数量。 |
| 关注热度 | float64 | 艺人关注热度主要表现艺人网络中的舆情声量，参与计算的指标维度包括百度搜索指数，百度新闻数量，今日头条新闻数，微博转发量，微博评论量，微博点赞量，微博粉丝数量，贴吧关注数量，微博话题数量。              |
| 预测热度 | float64 | 预测热度的数值反映明星的未来发展潜力，包括粉丝增长规模，作品口碑以及未来作品预测。                                                                  |
| 美誉度  | float64 | 根据艺人近三年参演电影、视频作品在豆瓣等平台的评分、微博正向评价，以及微博好评率等指标综合加权得出。                                                         |
| 统计日期 | object  | -                                                                                                          |

### online_value_artist
- **文档定位**：艺人 / 艺人流量价值
- **HTTP**：`GET /api/public/online_value_artist`
- **调用**：运行 `scripts/aktools_get.py online_value_artist --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.endata.com.cn/Marketing/Artist/business.html

描述: 艺恩-艺人-艺人流量价值

限量: 返回当前的艺人流量价值数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述                                                                                                         |
|------|---------|------------------------------------------------------------------------------------------------------------|
| 排名   | int64   | -                                                                                                          |
| 艺人   | object  | -                                                                                                          |
| 流量价值 | float64 | 流量价值由专业度，关注度，预测热度，带货力加权汇总计算后得出，分值范围0~100，在商业价值的基础上增加了明星近期热度及带货力的权重。                                        |
| 专业热度 | float64 | 艺人专业热度主要表现艺人历史作品及品牌代言的效果情况，参与计算的指标维度包括历史主演电影票房表现，历史主演视频节目播映热度，电影作品豆瓣评分，作品相关微博内容评论正负向，历史代言品牌数量，品牌热度，艺人获奖数量。 |
| 关注热度 | float64 | 艺人关注热度主要表现艺人网络中的舆情声量，参与计算的指标维度包括百度搜索指数，百度新闻数量，今日头条新闻数，微博转发量，微博评论量，微博点赞量，微博粉丝数量，贴吧关注数量，微博话题数量。              |
| 预测热度 | float64 | 预测热度的数值反映明星的未来发展潜力，包括粉丝增长规模，作品口碑以及未来作品预测。                                                                  |
| 带货力  | float64 | 带货力的数值代表艺人的带货号召力，包括艺人的铁杆粉丝规模，超话粉丝规模。                                                                       |
| 统计日期 | object  | -                                                                                                          |

### video_tv
- **文档定位**：视频播映 / 电视剧集
- **HTTP**：`GET /api/public/video_tv`
- **调用**：运行 `scripts/aktools_get.py video_tv --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.endata.com.cn/Video/index.html

描述: 艺恩-视频放映-电视剧集

限量: 返回前一日的电视剧播映数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述  |
|------|---------|-----|
| 排序   | int64   | -   |
| 名称   | object  | -   |
| 类型   | object  | -   |
| 播映指数 | float64 | -   |
| 媒体热度 | float64 | -   |
| 用户热度 | float64 | -   |
| 好评度  | float64 | -   |
| 观看度  | float64 | -   |
| 统计日期 | float64 | -   |

### video_variety_show
- **文档定位**：视频播映 / 综艺节目
- **HTTP**：`GET /api/public/video_variety_show`
- **调用**：运行 `scripts/aktools_get.py video_variety_show --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.endata.com.cn/Video/index.html

描述: 艺恩-视频放映-综艺节目

限量: 返回前一日的综艺播映数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述  |
|------|---------|-----|
| 排序   | int64   | -   |
| 名称   | object  | -   |
| 类型   | object  | -   |
| 播映指数 | float64 | -   |
| 媒体热度 | float64 | -   |
| 用户热度 | float64 | -   |
| 好评度  | float64 | -   |
| 观看度  | float64 | -   |
| 统计日期 | float64 | -   |

### fortune_rank
- **文档定位**：财富排行榜-中文
- **HTTP**：`GET /api/public/fortune_rank`
- **调用**：运行 `scripts/aktools_get.py fortune_rank --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.fortunechina.com/fortune500/node_65.htm

描述: 指定年份财富世界 500 强公司排行榜

限量: 单次返回某一个年份的所有历史数据

输入参数

| 名称   | 类型  | 描述          |
|------|-----|-------------|
| year | str | year="2023" |

输出参数

| 名称  | 类型  | 描述                |
|-----|-----|-------------------|
| -   | -   | 以当年的数据为准, 输出的字段不一 |
