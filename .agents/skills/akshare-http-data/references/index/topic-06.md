# 财新指数



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### index_pmi_com_cx
- **文档定位**：财新指数 / 综合 PMI
- **HTTP**：`GET /api/public/index_pmi_com_cx`
- **调用**：运行 `scripts/aktools_get.py index_pmi_com_cx --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://yun.ccxe.com.cn/indices/pmi

描述: 财新数据-指数报告-财新中国 PMI-综合 PMI

限量: 该接口返回所有历史数据，该数据更新至 202507 截止；

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述  |
|-------|---------|-----|
| 日期    | object  | -   |
| 综合PMI | float64 | -   |
| 变化值   | float64 | -   |

### index_pmi_man_cx
- **文档定位**：财新指数 / 制造业 PMI
- **HTTP**：`GET /api/public/index_pmi_man_cx`
- **调用**：运行 `scripts/aktools_get.py index_pmi_man_cx --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://yun.ccxe.com.cn/indices/pmi

描述: 财新数据-指数报告-财新中国 PMI-制造业 PMI

限量: 该接口返回所有历史数据，该数据更新至 202507 截止；

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述  |
|--------|---------|-----|
| 日期     | object  | -   |
| 制造业PMI | float64 | -   |
| 变化值    | float64 | -   |

### index_pmi_ser_cx
- **文档定位**：财新指数 / 服务业 PMI
- **HTTP**：`GET /api/public/index_pmi_ser_cx`
- **调用**：运行 `scripts/aktools_get.py index_pmi_ser_cx --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://yun.ccxe.com.cn/indices/pmi

描述: 财新数据-指数报告-财新中国 PMI-服务业 PMI

限量: 该接口返回所有历史数据，该数据更新至 202507 截止；

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述  |
|--------|---------|-----|
| 日期     | object  | -   |
| 服务业PMI | float64 | -   |
| 变化值    | float64 | -   |

### index_dei_cx
- **文档定位**：财新指数 / 数字经济指数
- **HTTP**：`GET /api/public/index_dei_cx`
- **调用**：运行 `scripts/aktools_get.py index_dei_cx --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://yun.ccxe.com.cn/indices/dei

描述: 财新指数-数字经济指数

限量: 该接口返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述  |
|--------|---------|-----|
| 日期     | object  | -   |
| 数字经济指数 | float64 | -   |
| 变化值    | float64 | -   |

### index_ii_cx
- **文档定位**：财新指数 / 产业指数
- **HTTP**：`GET /api/public/index_ii_cx`
- **调用**：运行 `scripts/aktools_get.py index_ii_cx --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://yun.ccxe.com.cn/indices/dei

描述: 财新指数-产业指数

限量: 该接口返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述  |
|------|---------|-----|
| 日期   | object  | -   |
| 产业指数 | float64 | -   |
| 变化值  | float64 | -   |

### index_si_cx
- **文档定位**：财新指数 / 溢出指数
- **HTTP**：`GET /api/public/index_si_cx`
- **调用**：运行 `scripts/aktools_get.py index_si_cx --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://yun.ccxe.com.cn/indices/dei

描述: 财新指数-溢出指数

限量: 该接口返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述  |
|------|---------|-----|
| 日期   | object  | -   |
| 溢出指数 | float64 | -   |
| 变化值  | float64 | -   |

### index_fi_cx
- **文档定位**：财新指数 / 融合指数
- **HTTP**：`GET /api/public/index_fi_cx`
- **调用**：运行 `scripts/aktools_get.py index_fi_cx --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://yun.ccxe.com.cn/indices/dei

描述: 财新指数-融合指数

限量: 该接口返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述  |
|------|---------|-----|
| 日期   | object  | -   |
| 融合指数 | float64 | -   |
| 变化值  | float64 | -   |

### index_bi_cx
- **文档定位**：财新指数 / 基础指数
- **HTTP**：`GET /api/public/index_bi_cx`
- **调用**：运行 `scripts/aktools_get.py index_bi_cx --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://yun.ccxe.com.cn/indices/dei

描述: 财新指数-基础指数

限量: 该接口返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型      | 描述  |
|------|---------|-----|
| 日期   | object  | -   |
| 基础指数 | float64 | -   |
| 变化值  | float64 | -   |

### index_nei_cx
- **文档定位**：财新指数 / 中国新经济指数
- **HTTP**：`GET /api/public/index_nei_cx`
- **调用**：运行 `scripts/aktools_get.py index_nei_cx --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://yun.ccxe.com.cn/indices/nei

描述: 财新指数-中国新经济指数

限量: 该接口返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称      | 类型      | 描述  |
|---------|---------|-----|
| 日期      | object  | -   |
| 中国新经济指数 | float64 | -   |
| 变化值     | float64 | -   |

### index_li_cx
- **文档定位**：财新指数 / 劳动力投入指数
- **HTTP**：`GET /api/public/index_li_cx`
- **调用**：运行 `scripts/aktools_get.py index_li_cx --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://yun.ccxe.com.cn/indices/nei

描述: 财新指数-劳动力投入指数

限量: 该接口返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称      | 类型      | 描述  |
|---------|---------|-----|
| 日期      | object  | -   |
| 劳动力投入指数 | float64 | -   |
| 变化值     | float64 | -   |

### index_ci_cx
- **文档定位**：财新指数 / 资本投入指数
- **HTTP**：`GET /api/public/index_ci_cx`
- **调用**：运行 `scripts/aktools_get.py index_ci_cx --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://yun.ccxe.com.cn/indices/nei

描述: 财新指数-资本投入指数

限量: 该接口返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述  |
|--------|---------|-----|
| 日期     | object  | -   |
| 资本投入指数 | float64 | -   |
| 变化值    | float64 | -   |

### index_ti_cx
- **文档定位**：财新指数 / 科技投入指数
- **HTTP**：`GET /api/public/index_ti_cx`
- **调用**：运行 `scripts/aktools_get.py index_ti_cx --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://yun.ccxe.com.cn/indices/nei

描述: 财新指数-科技投入指数

限量: 该接口返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述  |
|--------|---------|-----|
| 日期     | object  | -   |
| 科技投入指数 | float64 | -   |
| 变化值    | float64 | -   |

### index_neaw_cx
- **文档定位**：财新指数 / 新经济行业入职平均工资水平
- **HTTP**：`GET /api/public/index_neaw_cx`
- **调用**：运行 `scripts/aktools_get.py index_neaw_cx --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://yun.ccxe.com.cn/indices/nei

描述: 财新指数-新经济行业入职平均工资水平

限量: 该接口返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称            | 类型      | 描述  |
|---------------|---------|-----|
| 日期            | object  | -   |
| 新经济行业入职平均工资水平 | float64 | -   |
| 变化值           | float64 | -   |

### index_awpr_cx
- **文档定位**：财新指数 / 新经济入职工资溢价水平
- **HTTP**：`GET /api/public/index_awpr_cx`
- **调用**：运行 `scripts/aktools_get.py index_awpr_cx --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://yun.ccxe.com.cn/indices/nei

描述: 财新指数-新经济入职工资溢价水平

限量: 该接口返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称          | 类型      | 描述  |
|-------------|---------|-----|
| 日期          | object  | -   |
| 新经济入职工资溢价水平 | float64 | -   |
| 变化值         | float64 | -   |

### index_cci_cx
- **文档定位**：财新指数 / 大宗商品指数
- **HTTP**：`GET /api/public/index_cci_cx`
- **调用**：运行 `scripts/aktools_get.py index_cci_cx --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://yun.ccxe.com.cn/indices/nei

描述: 财新指数-大宗商品指数

限量: 该接口返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述  |
|--------|---------|-----|
| 日期     | object  | -   |
| 大宗商品指数 | float64 | -   |
| 变化值    | float64 | -   |

### index_qli_cx
- **文档定位**：财新指数 / 高质量因子
- **HTTP**：`GET /api/public/index_qli_cx`
- **调用**：运行 `scripts/aktools_get.py index_qli_cx --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://yun.ccxe.com.cn/indices/qli

描述: 财新指数-高质量因子

限量: 该接口返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称      | 类型      | 描述      |
|---------|---------|---------|
| 日期      | object  | -       |
| 高质量因子指数 | float64 | -       |
| 变化幅度    | float64 | 注意单位: % |

### index_ai_cx
- **文档定位**：财新指数 / AI策略指数
- **HTTP**：`GET /api/public/index_ai_cx`
- **调用**：运行 `scripts/aktools_get.py index_ai_cx --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://yun.ccxe.com.cn/indices/ai

描述: 财新指数-AI策略指数

限量: 该接口返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| 日期     | object  | -       |
| AI策略指数 | float64 | -       |
| 变化幅度   | float64 | 注意单位: % |

### index_bei_cx
- **文档定位**：财新指数 / 基石经济指数
- **HTTP**：`GET /api/public/index_bei_cx`
- **调用**：运行 `scripts/aktools_get.py index_bei_cx --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://yun.ccxe.com.cn/indices/bei

描述: 财新指数-基石经济指数

限量: 该接口返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述      |
|--------|---------|---------|
| 日期     | object  | -       |
| 基石经济指数 | float64 | -       |
| 变化幅度   | float64 | 注意单位: % |

### index_neei_cx
- **文档定位**：财新指数 / 新动能指数
- **HTTP**：`GET /api/public/index_neei_cx`
- **调用**：运行 `scripts/aktools_get.py index_neei_cx --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://yun.ccxe.com.cn/indices/neei

描述: 财新指数-新动能指数

限量: 该接口返回所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称    | 类型      | 描述      |
|-------|---------|---------|
| 日期    | object  | -       |
| 新动能指数 | float64 | -       |
| 变化幅度  | float64 | 注意单位: % |
