# 国证指数



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### index_all_cni
- **文档定位**：国证指数 / 全部指数
- **HTTP**：`GET /api/public/index_all_cni`
- **调用**：运行 `scripts/aktools_get.py index_all_cni --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.cnindex.com.cn/zh_indices/sese/index.html?act_menu=1&index_type=-1

描述: 国证指数-最近交易日的所有指数的代码和基本信息

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述                               |
|--------|---------|----------------------------------|
| 指数代码   | object  | -                                |
| 指数简称   | object  | -                                |
| 样本数    | int64   | -                                |
| 收盘点位   | float64 | -                                |
| 涨跌幅    | float64 | -                                |
| PE滚动   | float64 | -                                |
| 成交量    | float64 | 注意单位: 债券指数成交量单位为亿张，非债券指数成交量单位为万手 |
| 成交额    | float64 | 注意单位: 亿元                         |
| 总市值    | float64 | 注意单位: 亿元                         |
| 自由流通市值 | float64 | 注意单位: 亿元                         |

### index_hist_cni
- **文档定位**：国证指数 / 指数行情
- **HTTP**：`GET /api/public/index_hist_cni`
- **调用**：运行 `scripts/aktools_get.py index_hist_cni --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.cnindex.com.cn/module/index-detail.html?act_menu=1&indexCode=399001

描述: 国证指数-具体指数的日频率行情数据

输入参数

| 名称         | 类型  | 描述                                             |
|------------|-----|------------------------------------------------|
| symbol     | str | symbol="399005"; 从 ak.index_all_cni() 接口获取指数代码 |
| start_date | str | start_date="20230114"                          |
| end_date   | str | end_date="20240114"                            |

输出参数

| 名称  | 类型      | 描述       |
|-----|---------|----------|
| 日期  | object  | -        |
| 开盘价 | float64 | -        |
| 最高价 | float64 | -        |
| 最低价 | float64 | -        |
| 收盘价 | float64 | -        |
| 涨跌幅 | float64 | -        |
| 成交量 | float64 | 注意单位: 万手 |
| 成交额 | float64 | 注意单位: 亿元 |

### index_detail_cni
- **文档定位**：国证指数 / 指数样本详情
- **HTTP**：`GET /api/public/index_detail_cni`
- **调用**：运行 `scripts/aktools_get.py index_detail_cni --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.cnindex.com.cn/module/index-detail.html?act_menu=1&indexCode=399001

描述: 国证指数-指数样本详情数据；20251125 开始只能获取近期的数据

输入参数

| 名称     | 类型  | 描述                                                 |
|--------|-----|----------------------------------------------------|
| symbol | str | symbol='399001'; 从 **ak.index_all_cni()** 接口获取指数代码 |

输出参数

| 名称     | 类型      | 描述       |
|--------|---------|----------|
| 日期     | object  | -        |
| 样本代码   | object  | -        |
| 样本简称   | object  | -        |
| 所属行业   | object  | -        |
| 自由流通市值 | float64 | 注意单位: 亿元 |
| 总市值    | float64 | 注意单位: 亿元 |
| 权重     | float64 | 注意单位: %  |

### index_detail_hist_cni
- **文档定位**：国证指数 / 历史样本
- **HTTP**：`GET /api/public/index_detail_hist_cni`
- **调用**：运行 `scripts/aktools_get.py index_detail_hist_cni --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.cnindex.com.cn/module/index-detail.html?act_menu=1&indexCode=399001

描述: 国证指数-历史样本数据，返回所有历史数据

输入参数

| 名称     | 类型  | 描述                                                           |
|--------|-----|--------------------------------------------------------------|
| symbol | str | symbol='399005'; 从 **ak.index_all_cni()** 接口获取指数代码           |

输出参数

| 名称     | 类型      | 描述       |
|--------|---------|----------|
| 日期     | object  | -        |
| 样本代码   | object  | -        |
| 样本简称   | object  | -        |
| 所属行业   | object  | -        |
| 自由流通市值 | float64 | 注意单位: 亿元 |
| 总市值    | float64 | 注意单位: 亿元 |
| 权重     | float64 | 注意单位: %  |

### index_detail_hist_adjust_cni
- **文档定位**：国证指数 / 历史调样
- **HTTP**：`GET /api/public/index_detail_hist_adjust_cni`
- **调用**：运行 `scripts/aktools_get.py index_detail_hist_adjust_cni --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.cnindex.com.cn/module/index-detail.html?act_menu=1&indexCode=399001

描述: 国证指数-样本详情-历史调样

输入参数

| 名称     | 类型  | 描述                                                 |
|--------|-----|----------------------------------------------------|
| symbol | str | symbol='399005'; 从 **ak.index_all_cni()** 接口获取指数代码 |

输出参数

| 名称   | 类型     | 描述  |
|------|--------|-----|
| 开始日期 | object | -   |
| 结束日期 | object | -   |
| 样本代码 | object | -   |
| 样本简称 | object | -   |
| 所属行业 | object | -   |
| 调整类型 | object | -   |
