# 分红配送



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### stock_fhps_em
- **文档定位**：分红配送 / 分红配送-东财
- **HTTP**：`GET /api/public/stock_fhps_em`
- **调用**：运行 `scripts/aktools_get.py stock_fhps_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/yjfp/

描述: 东方财富-数据中心-年报季报-分红配送

限量: 单次获取指定日期的分红配送数据

输入参数

| 名称   | 类型  | 描述                                                                 |
|------|-----|--------------------------------------------------------------------|
| date | str | date="20231231"; choice of {"XXXX0630", "XXXX1231"}; 从 19901231 开始 |

输出参数

| 名称          | 类型      | 描述  |
|-------------|---------|-----|
| 代码          | object  | -   |
| 名称          | object  | -   |
| 送转股份-送转总比例  | float64 | -   |
| 送转股份-送转比例   | float64 | -   |
| 送转股份-转股比例   | float64 | -   |
| 现金分红-现金分红比例 | float64 | -   |
| 现金分红-股息率    | float64 | -   |
| 每股收益        | float64 | -   |
| 每股净资产       | float64 | -   |
| 每股公积金       | float64 | -   |
| 每股未分配利润     | float64 | -   |
| 净利润同比增长     | float64 | -   |
| 总股本         | int64   | -   |
| 预案公告日       | object  | -   |
| 股权登记日       | object  | -   |
| 除权除息日       | object  | -   |
| 方案进度        | object  | -   |
| 最新公告日期      | object  | -   |

### stock_fhps_detail_em
- **文档定位**：分红配送 / 分红配送详情-东财
- **HTTP**：`GET /api/public/stock_fhps_detail_em`
- **调用**：运行 `scripts/aktools_get.py stock_fhps_detail_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/yjfp/detail/300073.html

描述: 东方财富网-数据中心-分红送配-分红送配详情

限量: 单次获取指定 symbol 的分红配送详情数据

输入参数

| 名称     | 类型  | 描述              |
|--------|-----|-----------------|
| symbol | str | symbol="300073" |

输出参数

| 名称            | 类型      | 描述 |
|---------------|---------|----|
| 报告期           | object  | -  |
| 业绩披露日期        | object  | -  |
| 送转股份-送转总比例    | float64 | -  |
| 送转股份-送股比例     | float64 | -  |
| 送转股份-转股比例     | float64 | -  |
| 现金分红-现金分红比例   | float64 | -  |
| 现金分红-现金分红比例描述 | object  | -  |
| 现金分红-股息率      | float64 | -  |
| 每股收益          | float64 | -  |
| 每股净资产         | float64 | -  |
| 每股公积金         | float64 | -  |
| 每股未分配利润       | float64 | -  |
| 净利润同比增长       | float64 | -  |
| 总股本           | int64   | -  |
| 预案公告日         | object  | -  |
| 股权登记日         | object  | -  |
| 除权除息日         | object  | -  |
| 方案进度          | object  | -  |
| 最新公告日期        | object  | -  |

### stock_fhps_detail_ths
- **文档定位**：分红配送 / 分红情况-同花顺
- **HTTP**：`GET /api/public/stock_fhps_detail_ths`
- **调用**：运行 `scripts/aktools_get.py stock_fhps_detail_ths --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://basic.10jqka.com.cn/new/603444/bonus.html

描述: 同花顺-分红情况

限量: 单次获取指定 symbol 的分红情况数据

输入参数

| 名称     | 类型  | 描述                           |
|--------|-----|------------------------------|
| symbol | str | symbol="603444"; 兼容 A 股和 B 股 |

输出参数

| 名称         | 类型     | 描述                |
|------------|--------|-------------------|
| 报告期        | object | -                 |
| 董事会日期      | object | -                 |
| 股东大会预案公告日期 | object | -                 |
| 实施公告日      | object | -                 |
| 分红方案说明     | object | -                 |
| A股股权登记日    | object | 注意: 根据 A 股和 B 股变化 |
| A股除权除息日    | object | 注意: 根据 A 股和 B 股变化 |
| 分红总额       | object | -                 |
| 方案进度       | object | -                 |
| 股利支付率      | object | -                 |
| 税前分红率      | object | -                 |

### stock_hk_fhpx_detail_ths
- **文档定位**：分红配送 / 分红配送详情-港股-同花顺
- **HTTP**：`GET /api/public/stock_hk_fhpx_detail_ths`
- **调用**：运行 `scripts/aktools_get.py stock_hk_fhpx_detail_ths --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://stockpage.10jqka.com.cn/HK0700/bonus/

描述: 同花顺-港股-分红派息

限量: 单次获取指定股票的分红派息数据

输入参数

| 名称     | 类型  | 描述                  |
|--------|-----|---------------------|
| symbol | str | symbol="0700"; 港股代码 |

输出参数

| 名称         | 类型     | 描述 |
|------------|--------|----|
| 公告日期       | object | -  |
| 方案         | object | -  |
| 除净日        | object | -  |
| 派息日        | object | -  |
| 过户日期起止日-起始 | object | -  |
| 过户日期起止日-截止 | object | -  |
| 类型         | object | -  |
| 进度         | object | -  |
| 以股代息       | object | -  |
