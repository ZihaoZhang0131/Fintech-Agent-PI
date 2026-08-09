# 其他细分主题



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### bank_fjcf_table_detail
- **文档定位**：银保监分局本级行政处罚
- **HTTP**：`GET /api/public/bank_fjcf_table_detail`
- **调用**：运行 `scripts/aktools_get.py bank_fjcf_table_detail --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.cbirc.gov.cn/cn/view/pages/ItemDetail.html?docId=881574&itemId=4115&generaltype=9

描述: 首页-政务信息-行政处罚-银保监分局本级-XXXX行政处罚信息公开表, 是信息公开表不是处罚决定书书

限量: 单次返回银保监分局本级行政处罚中的指定页数的所有表格数据

输入参数

| 名称    | 类型  | 描述                                          |
|-------|-----|---------------------------------------------|
| page  | int | page=5; 获取前 5 页数据, 并返回处理好后的数据框              |
| item  | int | item="分局本级"; choice of {"机关", "本级", "分局本级"} |
| begin | int | begin=1; 开始页面                               |

输出参数-分局本级

| 名称           | 类型 | 描述 |
|--------------|----|----|
| 行政处罚决定书文号    | -  | -  |
| 姓名           | -  | -  |
| 单位           | -  | -  |
| 单位名称         | -  | -  |
| 主要负责人姓名      | -  | -  |
| 主要违法违规事实（案由） | -  | -  |
| 行政处罚依据       | -  | -  |
| 行政处罚决定       | -  | -  |
| 作出处罚决定的机关名称  | -  | -  |
| 作出处罚决定的日期    | -  | -  |
