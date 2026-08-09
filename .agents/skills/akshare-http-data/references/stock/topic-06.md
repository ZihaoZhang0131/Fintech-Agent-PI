# 千股千评详情



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### stock_comment_detail_zlkp_jgcyd_em
- **文档定位**：千股千评详情 / 主力控盘 / 机构参与度
- **HTTP**：`GET /api/public/stock_comment_detail_zlkp_jgcyd_em`
- **调用**：运行 `scripts/aktools_get.py stock_comment_detail_zlkp_jgcyd_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/stockcomment/stock/600000.html

描述: 东方财富网-数据中心-特色数据-千股千评-主力控盘-机构参与度

限量: 单次获取所有 symbol 的数据

输入参数

| 名称     | 类型  | 描述              |
|--------|-----|-----------------|
| symbol | str | symbol="600000" |

输出参数

| 名称    | 类型      | 描述      |
|-------|---------|---------|
| 交易日   | object  | -       |
| 机构参与度 | float64 | 注意单位: % |

### stock_comment_detail_zhpj_lspf_em
- **文档定位**：千股千评详情 / 综合评价 / 历史评分
- **HTTP**：`GET /api/public/stock_comment_detail_zhpj_lspf_em`
- **调用**：运行 `scripts/aktools_get.py stock_comment_detail_zhpj_lspf_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/stockcomment/stock/600000.html

描述: 东方财富网-数据中心-特色数据-千股千评-综合评价-历史评分

限量: 单次获取指定 symbol 的数据

输入参数

| 名称     | 类型  | 描述              |
|--------|-----|-----------------|
| symbol | str | symbol="600000" |

输出参数

| 名称  | 类型      | 描述  |
|-----|---------|-----|
| 日期  | object  | -   |
| 评分  | float64 | -   |

### stock_comment_detail_scrd_focus_em
- **文档定位**：千股千评详情 / 市场热度 / 用户关注指数
- **HTTP**：`GET /api/public/stock_comment_detail_scrd_focus_em`
- **调用**：运行 `scripts/aktools_get.py stock_comment_detail_scrd_focus_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/stockcomment/stock/600000.html

描述: 东方财富网-数据中心-特色数据-千股千评-市场热度-用户关注指数

限量: 单次获取所有数据

输入参数

| 名称     | 类型  | 描述              |
|--------|-----|-----------------|
| symbol | str | symbol="600000" |

输出参数

| 名称     | 类型      | 描述 |
|--------|---------|----|
| 交易日    | object  | -  |
| 用户关注指数 | float64 | -  |

### stock_comment_detail_scrd_desire_em
- **文档定位**：千股千评详情 / 市场热度 / 市场参与意愿
- **HTTP**：`GET /api/public/stock_comment_detail_scrd_desire_em`
- **调用**：运行 `scripts/aktools_get.py stock_comment_detail_scrd_desire_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/stockcomment/stock/600000.html

描述: 东方财富网-数据中心-特色数据-千股千评-市场热度-市场参与意愿

限量: 单次获取所有数据

输入参数

| 名称     | 类型  | 描述              |
|--------|-----|-----------------|
| symbol | str | symbol="600000" |

输出参数

| 名称       | 类型      | 描述 |
|----------|---------|----|
| 交易日期     | object  | -  |
| 股票代码     | object  | -  |
| 参与意愿     | float64 | -  |
| 5日平均参与意愿 | float64 | -  |
| 参与意愿变化   | float64 | -  |
| 5日平均变化   | float64 | -  |
