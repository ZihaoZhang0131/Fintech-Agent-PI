# 中国证券投资基金业协会



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### amac_member_info
- **文档定位**：中国证券投资基金业协会 / 会员信息 / 会员机构综合查询
- **HTTP**：`GET /api/public/amac_member_info`
- **调用**：运行 `scripts/aktools_get.py amac_member_info --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://gs.amac.org.cn/amac-infodisc/res/pof/member/index.html

描述: 中国证券投资基金业协会-信息公示-会员信息-会员机构综合查询

限量: 单次返回当前时刻所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称       | 类型     | 描述 |
|----------|--------|----|
| 机构（会员）名称 | object | -  |
| 会员代表     | object | -  |
| 会员类型     | object | -  |
| 会员编号     | object | -  |
| 入会时间     | object | -  |
| 机构类型     | object | -  |
| 是否星标     | object | -  |

### amac_person_fund_org_list
- **文档定位**：中国证券投资基金业协会 / 从业人员信息 / 基金从业人员资格注册信息
- **HTTP**：`GET /api/public/amac_person_fund_org_list`
- **调用**：运行 `scripts/aktools_get.py amac_person_fund_org_list --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://gs.amac.org.cn/amac-infodisc/res/pof/person/personOrgList.html

描述: 中国证券投资基金业协会-信息公示-从业人员信息-基金从业人员资格注册信息

限量: 单次返回当前时刻所有历史数据

输入参数

| 名称     | 类型  | 描述                                                                                                                                                                                                                                                                                                         |
|--------|-----|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| symbol | str | symbol="公募基金管理公司"; choice of {"公募基金管理公司", "公募基金管理公司资管子公司", "商业银行", "证券公司", "证券公司子公司", "私募基金管理人", "保险公司子公司", "保险公司", "外包服务机构", "期货公司", "期货公司资管子公司", "媒体机构", "证券投资咨询机构", "评价机构", "外资私募证券基金管理人", "支付结算", "独立服务机构", "地方自律组织", "境外机构", "律师事务所", "会计师事务所", "交易所", "独立第三方销售机构", "证券公司资管子公司", "证券公司私募基金子公司", "其他"} |

输出参数

| 名称       | 类型     | 描述  |
|----------|--------|-----|
| 序号       | int64  | -   |
| 机构名称     | object | -   |
| 员工人数     | object | -   |
| 基金从业资格   | int64  | -   |
| 基金销售业务资格 | int64  | -   |
| 基金经理     | int64  | -   |
| 投资经理     | int64  | -   |

### amac_person_bond_org_list
- **文档定位**：中国证券投资基金业协会 / 从业人员信息 / 债券投资交易相关人员公示
- **HTTP**：`GET /api/public/amac_person_bond_org_list`
- **调用**：运行 `scripts/aktools_get.py amac_person_bond_org_list --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://gs.amac.org.cn/amac-infodisc/res/pof/person/personOrgList.html

描述: 中国证券投资基金业协会-信息公示-从业人员信息-债券投资交易相关人员公示

限量: 单次返回当前时刻所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称   | 类型     | 描述  |
|------|--------|-----|
| 序号   | int64  | -   |
| 机构类型 | object | -   |
| 机构名称 | object | -   |
| 公示网址 | object | -   |

### amac_manager_info
- **文档定位**：中国证券投资基金业协会 / 私募基金管理人公示 / 私募基金管理人综合查询
- **HTTP**：`GET /api/public/amac_manager_info`
- **调用**：运行 `scripts/aktools_get.py amac_manager_info --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://gs.amac.org.cn/amac-infodisc/res/pof/manager/index.html

描述: 中国证券投资基金业协会-信息公示-私募基金管理人公示-私募基金管理人综合查询

限量: 单次返回当前时刻所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称                    | 类型     | 描述 |
|-----------------------|--------|----|
| 私募基金管理人名称             | object | -  |
| 法定代表人/执行事务合伙人(委派代表)姓名 | object | -  |
| 机构类型                  | object | -  |
| 注册地                   | object | -  |
| 登记编号                  | object | -  |
| 成立时间                  | object | -  |
| 登记时间                  | object | -  |

### amac_manager_classify_info
- **文档定位**：中国证券投资基金业协会 / 私募基金管理人公示 / 私募基金管理人分类公示
- **HTTP**：`GET /api/public/amac_manager_classify_info`
- **调用**：运行 `scripts/aktools_get.py amac_manager_classify_info --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://gs.amac.org.cn/amac-infodisc/res/pof/manager/managerList.html

描述: 中国证券投资基金业协会-信息公示-私募基金管理人公示-私募基金管理人分类公示

限量: 单次返回当前时刻所有历史数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称                    | 类型     | 描述  |
|-----------------------|--------|-----|
| 私募基金管理人名称             | object | -   |
| 法定代表人/执行事务合伙人(委派代表)姓名 | object | -   |
| 机构类型                  | object | -   |
| 登记编号                  | object | -   |
| 注册地                   | object | -   |
| 办公地                   | object | -   |
| 成立时间                  | object | -   |
| 登记时间                  | object | -   |
| 在管基金数量                | int64  | -   |
| 会员类型                  | object | -   |
| 是否有提示信息               | object | -   |
| 是否有诚信信息               | object | -   |

### amac_member_sub_info
- **文档定位**：中国证券投资基金业协会 / 私募基金管理人公示 / 证券公司私募基金子公司管理人信息公示
- **HTTP**：`GET /api/public/amac_member_sub_info`
- **调用**：运行 `scripts/aktools_get.py amac_member_sub_info --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://gs.amac.org.cn/amac-infodisc/res/pof/member/index.html?primaryInvestType=private

描述: 中国证券投资基金业协会-信息公示-私募基金管理人公示-证券公司私募基金子公司管理人信息公示

限量: 单次返回当前时刻所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称       | 类型     | 描述 |
|----------|--------|----|
| 机构（会员）名称 | str    | -  |
| 会员代表     | str    | -  |
| 会员类型     | str    | -  |
| 会员编号     | str    | -  |
| 入会时间     | object | -  |
| 公司类型     | str    | -  |

### amac_fund_info
- **文档定位**：中国证券投资基金业协会 / 基金产品 / 私募基金管理人基金产品
- **HTTP**：`GET /api/public/amac_fund_info`
- **调用**：运行 `scripts/aktools_get.py amac_fund_info --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://gs.amac.org.cn/amac-infodisc/res/pof/fund/index.html

描述: 中国证券投资基金业协会-信息公示-基金产品公示-私募基金管理人基金产品

限量: 单次返回指定页码之间的所有历史数据, 其中与每页 100 条的目标网站对应; 默认返回所有数据

输入参数

| 名称         | 类型  | 描述                    |
|------------|-----|-----------------------|
| start_page | str | start_page='1'; 开始页码  |
| end_page   | str | end_page="2000"; 结束页码 |

输出参数

| 名称        | 类型     | 描述 |
|-----------|--------|----|
| 基金名称      | object | -  |
| 私募基金管理人名称 | object | -  |
| 私募基金管理人类型 | object | -  |
| 运行状态      | object | -  |
| 备案时间      | object | -  |
| 建立时间      | object | -  |
| 托管人名称     | object | -  |

### amac_securities_info
- **文档定位**：中国证券投资基金业协会 / 基金产品 / 证券公司集合资管产品公示
- **HTTP**：`GET /api/public/amac_securities_info`
- **调用**：运行 `scripts/aktools_get.py amac_securities_info --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://gs.amac.org.cn/amac-infodisc/res/pof/securities/index.html

描述: 中国证券投资基金业协会-信息公示-基金产品公示-证券公司集合资管产品公示

限量: 单次返回当前时刻所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称    | 类型     | 描述 |
|-------|--------|----|
| 产品名称  | str    | -  |
| 产品编码  | str    | -  |
| 管理人名称 | str    | -  |
| 成立日期  | str    | -  |
| 到期时间  | str    | -  |
| 投资类型  | str    | -  |
| 是否分级  | str    | -  |
| 托管人名称 | str    | -  |
| 备案日期  | str    | -  |
| 运作状态  | str    | -  |

### amac_aoin_info
- **文档定位**：中国证券投资基金业协会 / 基金产品 / 证券公司直投基金
- **HTTP**：`GET /api/public/amac_aoin_info`
- **调用**：运行 `scripts/aktools_get.py amac_aoin_info --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://gs.amac.org.cn/amac-infodisc/res/aoin/product/index.html

描述: 中国证券投资基金业协会-信息公示-基金产品公示-证券公司直投基金

限量: 单次返回当前时刻所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称    | 类型     | 描述 |
|-------|--------|----|
| 产品编码  | str    | -  |
| 产品名称  | str    | -  |
| 直投子公司 | str    | -  |
| 管理机构  | str    | -  |
| 设立日期  | object | -  |

### amac_fund_sub_info
- **文档定位**：中国证券投资基金业协会 / 基金产品 / 证券公司私募投资基金
- **HTTP**：`GET /api/public/amac_fund_sub_info`
- **调用**：运行 `scripts/aktools_get.py amac_fund_sub_info --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://gs.amac.org.cn/amac-infodisc/res/pof/subfund/index.html

描述: 中国证券投资基金业协会-信息公示-基金产品公示-证券公司私募投资基金

限量: 单次返回当前时刻所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称        | 类型     | 描述 |
|-----------|--------|----|
| 产品编码      | str    | -  |
| 产品名称      | str    | -  |
| 私募基金管理人名称 | str    | -  |
| 托管人名称     | str    | -  |
| 成立日期      | object | -  |
| 备案日期      | object | -  |

### amac_fund_account_info
- **文档定位**：中国证券投资基金业协会 / 基金产品 / 基金公司及子公司集合资管产品公示
- **HTTP**：`GET /api/public/amac_fund_account_info`
- **调用**：运行 `scripts/aktools_get.py amac_fund_account_info --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://gs.amac.org.cn/amac-infodisc/res/fund/account/index.html

描述: 中国证券投资基金业协会-信息公示-基金产品公示-基金公司及子公司集合资管产品公示

限量: 单次返回当前时刻所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称    | 类型     | 描述 |
|-------|--------|----|
| 成立日期  | object | -  |
| 产品编码  | str    | -  |
| 产品名称  | str    | -  |
| 管理人名称 | str    | -  |

### amac_fund_abs
- **文档定位**：中国证券投资基金业协会 / 基金产品 / 资产支持专项计划
- **HTTP**：`GET /api/public/amac_fund_abs`
- **调用**：运行 `scripts/aktools_get.py amac_fund_abs --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://gs.amac.org.cn/amac-infodisc/res/fund/abs/index.html

描述: 中国证券投资基金业协会-信息公示-产品公示-资产支持专项计划

限量: 单次返回当前时刻所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称     | 类型     | 描述 |
|--------|--------|----|
| 编号     | int64  | -  |
| 备案编号   | object | -  |
| 专项计划全称 | object | -  |
| 管理人    | object | -  |
| 托管人    | object | -  |
| 成立日期   | object | -  |
| 预期到期时间 | object | -  |
| 备案通过时间 | object | -  |

### amac_futures_info
- **文档定位**：中国证券投资基金业协会 / 基金产品 / 期货公司集合资管产品公示
- **HTTP**：`GET /api/public/amac_futures_info`
- **调用**：运行 `scripts/aktools_get.py amac_futures_info --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://gs.amac.org.cn/amac-infodisc/res/pof/futures/index.html

描述: 中国证券投资基金业协会-信息公示-基金产品公示-期货公司集合资管产品公示

限量: 单次返回当前时刻所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称    | 类型     | 描述 |
|-------|--------|----|
| 产品名称  | str    | -  |
| 产品编码  | str    | -  |
| 管理人名称 | str    | -  |
| 托管人名称 | str    | -  |
| 成立日期  | str    | -  |
| 投资类型  | str    | -  |
| 是否分级  | str    | -  |
| 备案日期  | str    | -  |
| 到期日   | str    | -  |
| 运作状态  | str    | -  |

### amac_manager_cancelled_info
- **文档定位**：中国证券投资基金业协会 / 诚信信息 / 已注销私募基金管理人名单
- **HTTP**：`GET /api/public/amac_manager_cancelled_info`
- **调用**：运行 `scripts/aktools_get.py amac_manager_cancelled_info --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://gs.amac.org.cn/amac-infodisc/res/cancelled/manager/index.html

描述: 中国证券投资基金业协会-信息公示-诚信信息-已注销私募基金管理人名单

限量: 单次返回当前时刻所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称       | 类型     | 描述 |
|----------|--------|----|
| 管理人名称    | str    | -  |
| 统一社会信用代码 | str    | -  |
| 登记时间     | object | -  |
| 注销时间     | object | -  |
| 注销类型     | int64  | -  |
