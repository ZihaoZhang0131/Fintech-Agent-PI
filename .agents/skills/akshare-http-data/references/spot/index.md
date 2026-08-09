# spot 数据导航

先在“精确接口定位”表按用户的中文需求选择一行，再读取该行的接口卡。不得改写函数名；未找到时不要试探 API。

## 精确接口定位

| 中文名称或文档定位 | 精确函数名 | 读取接口卡 |
|---|---|---|
| 99 现货走势 | `spot_price_qh` | `references/spot/topic-03.md` |
| 上海黄金交易所 / 上海金基准价 | `spot_golden_benchmark_sge` | `references/spot/topic-01.md` |
| 上海黄金交易所 / 上海银基准价 | `spot_silver_benchmark_sge` | `references/spot/topic-01.md` |
| 上海黄金交易所 / 历史行情数据 | `spot_hist_sge` | `references/spot/topic-01.md` |
| 上海黄金交易所 / 实时行情数据 | `spot_quotations_sge` | `references/spot/topic-01.md` |
| 生猪大数据 / 今年以来全国出栏均价走势 | `spot_hog_year_trend_soozhu` | `references/spot/topic-02.md` |
| 生猪大数据 / 全国三元仔猪 | `spot_hog_three_way_soozhu` | `references/spot/topic-02.md` |
| 生猪大数据 / 全国后备二元母猪 | `spot_hog_crossbred_soozhu` | `references/spot/topic-02.md` |
| 生猪大数据 / 全国玉米价格走势 | `spot_corn_price_soozhu` | `references/spot/topic-02.md` |
| 生猪大数据 / 全国瘦肉型肉猪 | `spot_hog_lean_price_soozhu` | `references/spot/topic-02.md` |
| 生猪大数据 / 全国育肥猪合料（含自配料）半月走势 | `spot_mixed_feed_soozhu` | `references/spot/topic-02.md` |
| 生猪大数据 / 全国豆粕价格走势 | `spot_soybean_price_soozhu` | `references/spot/topic-02.md` |
| 生猪大数据 / 各省均价实时排行榜 | `spot_hog_soozhu` | `references/spot/topic-02.md` |

## 子主题概览
- **上海黄金交易所**（4 个接口）：`references/spot/topic-01.md`
- **生猪大数据**（8 个接口）：`references/spot/topic-02.md`
- **其他细分主题**（1 个接口）：`references/spot/topic-03.md`
