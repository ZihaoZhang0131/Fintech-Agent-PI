# 期货基础数据



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### futures_fees_info
- **文档定位**：期货基础数据 / 期货交易费用参照表
- **HTTP**：`GET /api/public/futures_fees_info`
- **调用**：运行 `scripts/aktools_get.py futures_fees_info --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://openctp.cn/fees.html

描述: openctp 期货交易费用参照表

限量: 单次返回所有数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称          | 类型      | 描述 |
|-------------|---------|----|
| 交易所         | object  | -  |
| 合约代码        | object  | -  |
| 合约名称        | object  | -  |
| 品种代码        | object  | -  |
| 品种名称        | object  | -  |
| 合约乘数        | int64   | -  |
| 最小跳动        | float64 | -  |
| 开仓费率（按金额）   | float64 | -  |
| 开仓费用（按手）    | float64 | -  |
| 平仓费率（按金额）   | float64 | -  |
| 平仓费用（按手）    | float64 | -  |
| 平今费率（按金额）   | float64 | -  |
| 平今费用（按手）    | float64 | -  |
| 做多保证金率（按金额） | float64 | -  |
| 做多保证金（按手）   | int64   | -  |
| 做空保证金率（按金额） | float64 | -  |
| 做空保证金（按手）   | int64   | -  |
| 上日结算价       | float64 | -  |
| 上日收盘价       | float64 | -  |
| 最新价         | float64 | -  |
| 成交量         | int64   | -  |
| 持仓量         | int64   | -  |
| 1手开仓费用      | float64 | -  |
| 1手平仓费用      | float64 | -  |
| 1手平今费用      | float64 | -  |
| 做多1手保证金     | float64 | -  |
| 做空1手保证金     | float64 | -  |
| 1Tick平仓盈亏   | float64 | -  |
| 2Tick平仓盈亏   | float64 | -  |
| 1Tick平仓收益率  | object  | -  |
| 2Tick平仓收益率  | object  | -  |
| 1Tick平今盈亏   | float64 | -  |
| 2Tick平今盈亏   | float64 | -  |
| 1Tick平今收益率  | object  | -  |
| 2Tick平今收益率  | object  | -  |
| 更新时间        | object  | -  |

### futures_comm_info
- **文档定位**：期货基础数据 / 期货手续费与保证金
- **HTTP**：`GET /api/public/futures_comm_info`
- **调用**：运行 `scripts/aktools_get.py futures_comm_info --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.9qihuo.com/qihuoshouxufei

描述: 九期网-期货手续费数据

限量: 单次返回指定 symbol 的所有数据

输入参数

| 名称     | 类型  | 描述                                                                                                   |
|--------|-----|------------------------------------------------------------------------------------------------------|
| symbol | str | symbol="所有"; choice of {"所有", "上海期货交易所", "大连商品交易所", "郑州商品交易所", "上海国际能源交易中心", "中国金融期货交易所", "广州期货交易所"} |

输出参数

| 名称           | 类型      | 描述      |
|--------------|---------|---------|
| 交易所名称        | object  | -       |
| 合约名称         | object  | -       |
| 合约代码         | object  | -       |
| 现价           | float64 | -       |
| 涨停板          | float64 | -       |
| 跌停板          | float64 | -       |
| 保证金-买开       | float64 | 注意单位: % |
| 保证金-卖开       | float64 | 注意单位: % |
| 保证金-每手       | float64 | 注意单位: 元 |
| 手续费标准-开仓-万分之 | float64 | -       |
| 手续费标准-开仓-元   | object  | -       |
| 手续费标准-平昨-万分之 | float64 | -       |
| 手续费标准-平昨-元   | object  | -       |
| 手续费标准-平今-万分之 | float64 | -       |
| 手续费标准-平今-元   | object  | -       |
| 每跳毛利         | int64   | 注意单位: 元 |
| 手续费          | float64 | 注意: 开+平 |
| 每跳净利         | float64 | 注意单位: 元 |
| 备注           | object  | 是否主力合约  |
| 手续费更新时间      | object  | -       |
| 价格更新时间       | object  | -       |

### futures_comm_js
- **文档定位**：期货基础数据 / 期货手续费与保证金 / 金十数据
- **HTTP**：`GET /api/public/futures_comm_js`
- **调用**：运行 `scripts/aktools_get.py futures_comm_js --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.jin10.com/

描述: 金十财经-期货手续费数据

限量: 单次返回指定日期的期货手续费数据

输入参数

| 名称   | 类型  | 描述                              |
|------|-----|---------------------------------|
| date | str | date="20260213"; 日期格式为 YYYYMMDD |

输出参数

| 名称      | 类型      | 描述 |
|---------|---------|----|
| 日期      | object  | -  |
| 合约品种    | str     | -  |
| 合约代码    | str     | -  |
| 手续费公布时间 | str     | -  |
| 价格公布时间  | str     | -  |
| 现价      | float64 | -  |
| 涨停板     | float64 | -  |
| 跌停板     | float64 | -  |
| 保证金/买开  | str     | -  |
| 保证金/卖开  | str     | -  |
| 保证金/每手  | str     | -  |
| 开仓      | str     | -  |
| 平今      | str     | -  |
| 平昨      | str     | -  |
| 每手跳数    | int64   | -  |
| 每跳毛利    | float64 | -  |
| 每跳净利    | float64 | -  |
| 交易所     | str     | -  |

### futures_rule
- **文档定位**：期货基础数据 / 期货规则-交易日历表
- **HTTP**：`GET /api/public/futures_rule`
- **调用**：运行 `scripts/aktools_get.py futures_rule --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.gtjaqh.com/pc/calendar.html

描述: 国泰君安期货-交易日历数据表

限量: 单次返回指定交易日所有合约的交易日历数据

输入参数

| 名称   | 类型  | 描述                                 |
|------|-----|------------------------------------|
| date | str | date="20231205"; 需要指定为交易日, 且是近期的日期 |

输出参数

| 名称          | 类型      | 描述      |
|-------------|---------|---------|
| 交易所         | object  | -       |
| 品种          | object  | -       |
| 代码          | object  | -       |
| 交易保证金比例     | float64 | 注意单位: % |
| 涨跌停板幅度      | float64 | 注意单位: % |
| 合约乘数        | int64   | -       |
| 最小变动价位      | float64 | -       |
| 限价单每笔最大下单手数 | int64   | -       |
| 特殊合约参数调整    | object  | -       |
| 调整备注        | object  | -       |

### futures_inventory_99
- **文档定位**：期货基础数据 / 库存数据-99期货网
- **HTTP**：`GET /api/public/futures_inventory_99`
- **调用**：运行 `scripts/aktools_get.py futures_inventory_99 --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.99qh.com/data/stockIn?productId=61

描述: 99 期货网-大宗商品库存数据

限量: 单次返回指定 symbol 的具体品种的期货库存数据, 仓单日报数据

输入参数

| 名称     | 类型  | 描述                                                                                                     |
|--------|-----|--------------------------------------------------------------------------------------------------------|
| symbol | str | symbol='豆一'; 交易所对应的具体品种中文名称或者英文代码; 如：大连商品交易所的豆一; 具体品种查询：https://www.99qh.com/data/stockIn?productId=61 |

输出参数

| 名称  | 类型      | 描述 |
|-----|---------|----|
| 日期  | object  | -  |
| 收盘价 | float64 | -  |
| 库存  | int64   | -  |

### futures_inventory_em
- **文档定位**：期货基础数据 / 库存数据-东方财富
- **HTTP**：`GET /api/public/futures_inventory_em`
- **调用**：运行 `scripts/aktools_get.py futures_inventory_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://data.eastmoney.com/ifdata/kcsj.html

描述: 东方财富网-期货数据-库存数据; 近 60 个交易日的期货库存日频率数据

限量: 返回指定交易所指定品种的期货库存数据, 仓单日报数据

输入参数

| 名称     | 类型  | 描述                                                                         |
|--------|-----|----------------------------------------------------------------------------|
| symbol | str | symbol="A"; 支持品种代码和中文名称，中文名称参见：https://data.eastmoney.com/ifdata/kcsj.html |

输出参数

| 名称  | 类型      | 描述          |
|-----|---------|-------------|
| 日期  | object  | 日期          |
| 库存  | int64   | 库存数据        |
| 增减  | float64 | 相对前一个交易日的增减 |

### futures_dce_position_rank
- **文档定位**：期货基础数据 / 会员持仓排名 / 大连商品交易所
- **HTTP**：`GET /api/public/futures_dce_position_rank`
- **调用**：运行 `scripts/aktools_get.py futures_dce_position_rank --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.dce.com.cn/dalianshangpin/xqsj/tjsj26/rtj/rcjccpm/index.html

描述: 大连商品交易所指定交易日的具体合约的持仓排名

限量: 单次返回所有合约的持仓排名数据, 返回以合约名字为键, 具体排名数据为值的字典

输入参数

| 名称        | 类型   | 描述                                                                                                                    |
|-----------|------|-----------------------------------------------------------------------------------------------------------------------|
| date      | str  | date="20200511"; 指定交易日, 该数据接口可以获取从 2000 年开始的数据, 20160104 由于交易所数据问题，返回为空可以调用 **futures_dce_position_rank_other** 来返回数据 |
| vars_list | list | vars_list=cons.contract_symbols; 指定品种，比如：["C", "CS"]                                                                  |

P.S. **futures_dce_position_rank_other** 函数只返回页面显示的活跃合约，返回格式同 **futures_dce_position_rank**

输出参数-字典

P.S. 这里仅列出值(pandas.DataFrame)的字段信息

| 名称                      | 类型      | 描述      |
|-------------------------|---------|---------|
| long_open_interest      | object  | 持买单量    |
| long_open_interest_chg  | float64 | 持买单量-增减 |
| long_party_name         | object  | 会员简称    |
| rank                    | float64 | 名次      |
| short_open_interest     | float64 | 持卖单量    |
| short_open_interest_chg | float64 | 持买单量-增减 |
| short_party_name        | object  | 会员简称    |
| vol                     | float64 | 成交量     |
| vol_chg                 | float64 | 成交量-增减  |
| vol_party_name          | object  | 会员简称    |
| symbol                  | object  | 具体合约    |
| variety                 | object  | 品种      |

### futures_gfex_position_rank
- **文档定位**：期货基础数据 / 会员持仓排名 / 广州期货交易所
- **HTTP**：`GET /api/public/futures_gfex_position_rank`
- **调用**：运行 `scripts/aktools_get.py futures_gfex_position_rank --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.gfex.com.cn/gfex/rcjccpm/hqsj_tjsj.shtml

描述: 广州期货交易所-日成交持仓排名

限量: 单次返回所有合约的日成交持仓排名数据, 返回以合约名字为键, 具体排名数据为值的字典

输入参数

| 名称        | 类型   | 描述                                                       |
|-----------|------|----------------------------------------------------------|
| date      | str  | date="20231113"; 指定交易日, 该数据接口可以获取从 20231110 开始的日成交持仓排名数据 |
| vars_list | list | vars_list=None; 指定品种，比如：['SI', 'LC']                     |

输出参数-字典

P.S. 这里仅列出值(pandas.DataFrame)的字段信息

| 名称                      | 类型     | 描述      |
|-------------------------|--------|---------|
| rank                    | int64  | 名次      |
| vol_party_name          | object | 会员简称    |
| vol                     | int64  | 成交量     |
| vol_chg                 | int64  | 成交量-增减  |
| long_party_name         | object | 会员简称    |
| long_open_interest      | int64  | 持买单量    |
| long_open_interest_chg  | int64  | 持买单量-增减 |
| short_party_name        | object | 会员简称    |
| short_open_interest     | int64  | 持卖单量    |
| short_open_interest_chg | int64  | 持卖单量-增减 |
| symbol                  | object | 具体合约    |
| variety                 | object | 品种      |

### futures_warehouse_receipt_czce
- **文档定位**：期货基础数据 / 仓单日报 / 仓单日报-郑州商品交易所
- **HTTP**：`GET /api/public/futures_warehouse_receipt_czce`
- **调用**：运行 `scripts/aktools_get.py futures_warehouse_receipt_czce --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.czce.com.cn/cn/jysj/cdrb/H770310index_1.htm

描述: 郑州商品交易所-交易数据-仓单日报

限量: 单次返回当前交易日的所有仓单日报数据

输入参数

| 名称   | 类型  | 描述                   |
|------|-----|----------------------|
| date | str | date="20200702"; 交易日 |

输出参数

| 名称    | 类型   | 描述                                     |
|-------|------|----------------------------------------|
| 键值对字典 | dict | 键值对, 键为品种代码, 值为 pandas.DataFrame 格式的数据 |

### futures_warehouse_receipt_dce
- **文档定位**：期货基础数据 / 仓单日报 / 仓单日报-大连商品交易所
- **HTTP**：`GET /api/public/futures_warehouse_receipt_dce`
- **调用**：运行 `scripts/aktools_get.py futures_warehouse_receipt_dce --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.dce.com.cn/dce/channel/list/187.html

描述: 大连商品交易所-行情数据-统计数据-日统计-仓单日报

限量: 单次返回当前交易日的所有仓单日报数据

输入参数

| 名称   | 类型  | 描述                   |
|------|-----|----------------------|
| date | str | date="20251027"; 交易日 |

输出参数

| 名称           | 类型     | 描述 |
|--------------|--------|----|
| 品种代码         | object | -  |
| 品种名称         | object | -  |
| 仓库/分库        | object | -  |
| 可选提货地点/分库-数量 | object | -  |
| 昨日仓单量（手）     | int64  | -  |
| 今日仓单量（手）     | int64  | -  |
| 增减（手）        | int64  | -  |

### futures_shfe_warehouse_receipt
- **文档定位**：期货基础数据 / 仓单日报 / 仓单日报-上海期货交易所
- **HTTP**：`GET /api/public/futures_shfe_warehouse_receipt`
- **调用**：运行 `scripts/aktools_get.py futures_shfe_warehouse_receipt --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://tsite.shfe.com.cn/statements/dataview.html?paramid=dailystock&paramdate=20200703

描述: 提供上海期货交易所指定交割仓库期货仓单日报

限量: 单次返回当前交易日的所有仓单日报数据

输入参数

| 名称   | 类型  | 描述                   |
|------|-----|----------------------|
| date | str | date="20200702"; 交易日 |

输出参数

| 名称    | 类型   | 描述                                     |
|-------|------|----------------------------------------|
| 键值对字典 | dict | 键值对, 键为品种代码, 值为 pandas.DataFrame 格式的数据 |

### futures_gfex_warehouse_receipt
- **文档定位**：期货基础数据 / 仓单日报 / 仓单日报-广州期货交易所
- **HTTP**：`GET /api/public/futures_gfex_warehouse_receipt`
- **调用**：运行 `scripts/aktools_get.py futures_gfex_warehouse_receipt --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.gfex.com.cn/gfex/cdrb/hqsj_tjsj.shtml

描述: 广州期货交易所-行情数据-仓单日报

限量: 单次返回当前交易日的所有仓单日报数据

输入参数

| 名称   | 类型  | 描述                   |
|------|-----|----------------------|
| date | str | date="20240122"; 交易日 |

输出参数

| 名称    | 类型   | 描述                                     |
|-------|------|----------------------------------------|
| 键值对字典 | dict | 键值对, 键为品种代码, 值为 pandas.DataFrame 格式的数据 |

### futures_to_spot_dce
- **文档定位**：期货基础数据 / 期转现-大商所
- **HTTP**：`GET /api/public/futures_to_spot_dce`
- **调用**：运行 `scripts/aktools_get.py futures_to_spot_dce --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.dce.com.cn/dalianshangpin/xqsj/tjsj26/jgtj/qzxcx/index.html

描述: 大连商品交易所-期转现统计数据

限量: 单次返回指定交易日的期转现统计数据

输入参数

| 名称   | 类型  | 描述                  |
|------|-----|---------------------|
| date | str | date="202312"; 交易年月 |

输出参数

| 名称      | 类型     | 描述      |
|---------|--------|---------|
| 合约代码    | object | -       |
| 期转现发生日期 | object | -       |
| 期转现数量   | int64  | 注意单位: 手 |

### futures_to_spot_czce
- **文档定位**：期货基础数据 / 期转现-郑商所
- **HTTP**：`GET /api/public/futures_to_spot_czce`
- **调用**：运行 `scripts/aktools_get.py futures_to_spot_czce --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.czce.com.cn/cn/jysj/qzxtj/H770311index_1.htm

描述: 郑州商品交易所-期转现统计数据

限量: 单次返回指定交易日的期转现统计数据

输入参数

| 名称   | 类型  | 描述                   |
|------|-----|----------------------|
| date | str | date="20210112"; 交易日 |

输出参数

| 名称   | 类型     | 描述       |
|------|--------|----------|
| 合约代码 | object | -        |
| 合约数量 | int64  | 注意: 单边计算 |

### futures_to_spot_shfe
- **文档定位**：期货基础数据 / 期转现-上期所
- **HTTP**：`GET /api/public/futures_to_spot_shfe`
- **调用**：运行 `scripts/aktools_get.py futures_to_spot_shfe --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://tsite.shfe.com.cn/statements/dataview.html?paramid=kx

描述: 上海期货交易所-期转现数据

限量: 单次返回指定交易月份的期转现数据

输入参数

| 名称   | 类型  | 描述                  |
|------|-----|---------------------|
| date | str | date="202312"; 交易月份 |

输出参数

| 名称   | 类型      | 描述 |
|------|---------|----|
| 日期   | object  | -  |
| 合约   | object  | -  |
| 交割量  | float64 | -  |
| 期转现量 | float64 | -  |

注意:

1 铜、铜(BC)、铝、锌、铅、镍、锡、螺纹钢、线材、热轧卷板、天然橡胶、20号胶、低硫燃料油、燃料油、石油沥青、纸浆、不锈钢的数量单位为：吨；黄金的数量单位为：克；白银的数量单位为：千克；原油的数量单位为：桶。
2 交割量、期转现量为单向计算。

### futures_delivery_dce
- **文档定位**：期货基础数据 / 交割统计-大商所
- **HTTP**：`GET /api/public/futures_delivery_dce`
- **调用**：运行 `scripts/aktools_get.py futures_delivery_dce --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.dce.com.cn/dalianshangpin/xqsj/tjsj26/jgtj/jgsj/index.html

描述: 大连商品交易所-交割统计

限量: 单次返回指定交易月份的交割统计数据

输入参数

| 名称   | 类型  | 描述                  |
|------|-----|---------------------|
| date | str | date="202312"; 交易月份 |

输出参数

| 名称   | 类型     | 描述 |
|------|--------|----|
| 品种   | object | -  |
| 合约   | object | -  |
| 交割日期 | object | -  |
| 交割量  | int64  | -  |
| 交割金额 | int64  | -  |

### futures_delivery_czce
- **文档定位**：期货基础数据 / 交割统计-郑商所
- **HTTP**：`GET /api/public/futures_delivery_czce`
- **调用**：运行 `scripts/aktools_get.py futures_delivery_czce --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.czce.com.cn/cn/jysj/ydjgcx/H770316index_1.htm

描述: 郑州商品交易所-交割统计

限量: 单次返回指定交易月份的交割统计数据

输入参数

| 名称   | 类型  | 描述                   |
|------|-----|----------------------|
| date | str | date="20210112"; 交易日 |

输出参数

| 名称   | 类型     | 描述             |
|------|--------|----------------|
| 品种   | object | -              |
| 交割数量 | int64  | 按单边统计          |
| 交割额  | int64  | 注意单位: 元; 按单边统计 |

### futures_delivery_shfe
- **文档定位**：期货基础数据 / 交割统计-上期所
- **HTTP**：`GET /api/public/futures_delivery_shfe`
- **调用**：运行 `scripts/aktools_get.py futures_delivery_shfe --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://tsite.shfe.com.cn/statements/dataview.html?paramid=kx

描述: 上海期货交易所-交割统计

限量: 单次返回指定交易月份的交割统计数据

输入参数

| 名称   | 类型  | 描述                  |
|------|-----|---------------------|
| date | str | date="202312"; 交易月份 |

输出参数

| 名称       | 类型      | 描述                                        |
|----------|---------|-------------------------------------------|
| 品种       | object  | -                                         |
| 交割量-本月   | int64   | 注意单位: 手; 交割量单边计算; 交割数据统计期为上月 16 日到本月 15 日 |
| 交割量-比重   | float64 | 注意单位: %                                   |
| 交割量-本年累计 | int64   | 注意单位: 手; 交割量单边计算; 交割数据统计期为上月 16 日到本月 15 日 |
| 交割量-累计同比 | float64 | 注意单位: %                                   |

### futures_delivery_match_dce
- **文档定位**：期货基础数据 / 交割配对-大商所
- **HTTP**：`GET /api/public/futures_delivery_match_dce`
- **调用**：运行 `scripts/aktools_get.py futures_delivery_match_dce --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.dce.com.cn/dalianshangpin/xqsj/tjsj26/jgtj/jgsj/index.html

描述: 大连商品交易所-交割配对

限量: 单次返回指定品种的的交割配对数据

输入参数

| 名称     | 类型  | 描述               |
|--------|-----|------------------|
| symbol | str | symbol="a"; 交易品种 |

输出参数

| 名称    | 类型      | 描述 |
|-------|---------|----|
| 合约号   | object  | -  |
| 配对日期  | object  | -  |
| 买会员号  | object  | -  |
| 配对手数  | int64   | -  |
| 卖会员号  | object  | -  |
| 交割结算价 | float64 | -  |

注意:

1 价格：自2019年12月02日起，纤维板报价单位由元/张改为元/立方米
2 配对手数：手
3 交割结算价：元/吨，鸡蛋为元/500千克，纤维板为元/立方米、胶合板为元/张
4 *为非期货公司会员

### futures_delivery_match_czce
- **文档定位**：期货基础数据 / 交割配对-郑商所
- **HTTP**：`GET /api/public/futures_delivery_match_czce`
- **调用**：运行 `scripts/aktools_get.py futures_delivery_match_czce --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.czce.com.cn/cn/jysj/jgpd/H770308index_1.htm

描述: 郑州商品交易所-交割配对

限量: 单次返回指定品种的的交割配对数据

输入参数

| 名称   | 类型  | 描述                   |
|------|-----|----------------------|
| date | str | date="20210106"; 交易日 |

输出参数

| 名称        | 类型      | 描述            |
|-----------|---------|---------------|
| 卖方会员      | object  | -             |
| 卖方会员-会员简称 | object  | -             |
| 买方会员      | object  | -             |
| 买方会员-会员简称 | object  | -             |
| 交割量       | float64 | 注意单位: 手(单边计算) |
| 配对日期      | object  | -             |
| 合约代码      | object  | -             |

### futures_stock_shfe_js
- **文档定位**：期货基础数据 / 库存周报 / 上海期货交易所
- **HTTP**：`GET /api/public/futures_stock_shfe_js`
- **调用**：运行 `scripts/aktools_get.py futures_stock_shfe_js --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://datacenter.jin10.com/reportType/dc_shfe_weekly_stock

描述: 金十财经-上海期货交易所指定交割仓库库存周报

限量: 单次返回指定 date 的库存周报数据

输入参数

| 名称   | 类型  | 描述                                    |
|------|-----|---------------------------------------|
| date | str | date="20240419"; 库存周报只在每周的最后一个交易日公布数据 |

输出参数

| 名称           | 类型      | 描述 |
|--------------|---------|----|
| 商品           | object  | -  |
| 期货总量{随日期变动}  | int64   | -  |
| 期货总量{随日期变动}} | int64   | -  |
| 增减           | int64   | -  |
| 增减幅度         | float64 | -  |

### futures_hold_pos_sina
- **文档定位**：期货基础数据 / 成交持仓
- **HTTP**：`GET /api/public/futures_hold_pos_sina`
- **调用**：运行 `scripts/aktools_get.py futures_hold_pos_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://vip.stock.finance.sina.com.cn/q/view/vFutures_Positions_cjcc.php

描述: 新浪财经-期货-成交持仓

限量: 单次返回指定合约的成交持仓数据

输入参数

| 名称       | 类型  | 描述                                              |
|----------|-----|-------------------------------------------------|
| symbol   | str | symbol="成交量"; choice of {"成交量", "多单持仓", "空单持仓"} |
| contract | str | contract="OI2501"; 只限于商品期货                      |
| date     | str | date="20240223"                                 |

输出参数

| 名称     | 类型     | 描述 |
|--------|--------|----|
| 名次     | int64  | -  |
| 会员简称   | object | -  |
| 成交量    | int64  | -  |
| 比上交易增减 | int64  | -  |

### futures_spot_sys
- **文档定位**：期货基础数据 / 现期图
- **HTTP**：`GET /api/public/futures_spot_sys`
- **调用**：运行 `scripts/aktools_get.py futures_spot_sys --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.100ppi.com/sf/792.html

描述: 生意社-商品与期货-现期图

限量: 单次返回指定品种的现期图数据

输入参数

| 名称       | 类型  | 描述                                                  |
|----------|-----|-----------------------------------------------------|
| symbol   | str | symbol="铜"; 期货品种                                    |
| contract | str | indicator="市场价格"; choice of {"市场价格", "基差率", "主力基差"} |

输出参数-市场价格

| 名称   | 类型      | 描述 |
|------|---------|----|
| 日期   | object  | -  |
| 现货价格 | float64 | -  |
| 主力合约 | float64 | -  |
| 最近合约 | float64 | -  |

接口示例-市场价格

```python
import akshare as ak

futures_spot_sys_df = ak.futures_spot_sys(symbol="铜", indicator="市场价格")
print(futures_spot_sys_df)
```

### futures_contract_info_shfe
- **文档定位**：期货基础数据 / 合约信息 / 上海期货交易所
- **HTTP**：`GET /api/public/futures_contract_info_shfe`
- **调用**：运行 `scripts/aktools_get.py futures_contract_info_shfe --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://tsite.shfe.com.cn/bourseService/businessdata/summaryinquiry/

描述: 上海期货交易所-交易所服务-业务数据-交易参数汇总查询

限量: 单次返回指定 date 的期货合约信息数据

输入参数

| 名称   | 类型  | 描述                   |
|------|-----|----------------------|
| date | str | date="20240513"; 交易日 |

输出参数

| 名称    | 类型      | 描述 |
|-------|---------|----|
| 合约代码  | object  | -  |
| 上市日   | object  | -  |
| 到期日   | object  | -  |
| 开始交割日 | object  | -  |
| 最后交割日 | object  | -  |
| 挂牌基准价 | float64 | -  |
| 交易日   | object  | -  |
| 更新时间  | object  | -  |

### futures_contract_info_ine
- **文档定位**：期货基础数据 / 合约信息 / 上海国际能源交易中心
- **HTTP**：`GET /api/public/futures_contract_info_ine`
- **调用**：运行 `scripts/aktools_get.py futures_contract_info_ine --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.ine.cn/bourseService/summary/?name=currinstrumentprop

描述: 上海国际能源交易中心-业务指南-交易参数汇总(期货)

限量: 单次返回指定 date 的期货合约信息数据

输入参数

| 名称   | 类型  | 描述                   |
|------|-----|----------------------|
| date | str | date="20241129"; 交易日 |

输出参数

| 名称    | 类型      | 描述 |
|-------|---------|----|
| 合约代码  | object  | -  |
| 上市日   | object  | -  |
| 到期日   | object  | -  |
| 开始交割日 | object  | -  |
| 最后交割日 | object  | -  |
| 挂牌基准价 | float64 | -  |
| 交易日   | object  | -  |

### futures_contract_info_dce
- **文档定位**：期货基础数据 / 合约信息 / 大连商品交易所
- **HTTP**：`GET /api/public/futures_contract_info_dce`
- **调用**：运行 `scripts/aktools_get.py futures_contract_info_dce --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.dce.com.cn/dce/channel/list/180.html

描述: 大连商品交易所-数据中心-业务数据-交易参数-合约信息

限量: 单次返回最近交易日的期货合约信息数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称     | 类型      | 描述 |
|--------|---------|----|
| 品种     | object  | -  |
| 合约代码   | object  | -  |
| 交易单位   | int64   | -  |
| 最小变动价位 | float64 | -  |
| 开始交易日  | object  | -  |
| 最后交易日  | object  | -  |
| 最后交割日  | object  | -  |

### futures_contract_info_czce
- **文档定位**：期货基础数据 / 合约信息 / 郑州商品交易所
- **HTTP**：`GET /api/public/futures_contract_info_czce`
- **调用**：运行 `scripts/aktools_get.py futures_contract_info_czce --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.czce.com.cn/cn/jysj/cksj/H770322index_1.htm

描述: 郑州商品交易所-交易数据-参考数据

限量: 单次返回指定 date 的期货合约信息数据

输入参数

| 名称   | 类型  | 描述                   |
|------|-----|----------------------|
| date | str | date="20240228"; 交易日 |

输出参数

| 名称                        | 类型      | 描述 |
|---------------------------|---------|----|
| 产品名称                      | object  | -  |
| 合约代码                      | object  | -  |
| 产品代码                      | object  | -  |
| 产品类型                      | object  | -  |
| 交易所MIC编码                  | object  | -  |
| 交易场所                      | object  | -  |
| 交易时间节假日除外                 | object  | -  |
| 交易国家ISO编码                 | object  | -  |
| 交易币种ISO编码                 | object  | -  |
| 结算币种ISO编码                 | object  | -  |
| 到期时间待国家公布2025年节假日安排后进行调整  | object  | -  |
| 结算方式                      | object  | -  |
| 挂牌频率                      | object  | -  |
| 最小变动价位                    | object  | -  |
| 最小变动价值                    | object  | -  |
| 交易单位                      | object  | -  |
| 计量单位                      | object  | -  |
| 最大下单量                     | object  | -  |
| 日持仓限额期货公司会员不限仓            | object  | -  |
| 大宗交易最小规模                  | object  | -  |
| 是否受CESR监管                 | object  | -  |
| 是否为灵活合约                   | object  | -  |
| 上市周期该产品的所有合约月份            | object  | -  |
| 交割通知日                     | object  | -  |
| 第一交易日                     | object  | -  |
| 最后交易日待国家公布2025年节假日安排后进行调整 | object  | -  |
| 交割结算日                     | object  | -  |
| 月份代码                      | object  | -  |
| 年份代码                      | object  | -  |
| 最后交割日                     | object  | -  |
| 车（船）板最后交割日                | object  | -  |
| 合约交割月份本合约交割月份             | object  | -  |
| 交易保证金率                    | object  | -  |
| 涨跌停板                      | object  | -  |
| 费用币种ISO编码                 | object  | -  |
| 交易手续费                     | float64 | -  |
| 手续费收取方式                   | object  | -  |
| 交割手续费                     | float64 | -  |
| 平今仓手续费                    | float64 | -  |
| 交易限额                      | float64 | -  |

### futures_contract_info_gfex
- **文档定位**：期货基础数据 / 合约信息 / 广州期货交易所
- **HTTP**：`GET /api/public/futures_contract_info_gfex`
- **调用**：运行 `scripts/aktools_get.py futures_contract_info_gfex --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.gfex.com.cn/gfex/hyxx/ywcs.shtml

描述: 广州期货交易所-业务/服务-合约信息

限量: 单次返回最近交易日的期货合约信息数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称     | 类型     | 描述 |
|--------|--------|----|
| 品种     | object | -  |
| 合约代码   | object | -  |
| 交易单位   | int64  | -  |
| 最小变动单位 | int64  | -  |
| 开始交易日  | object | -  |
| 最后交易日  | object | -  |
| 最后交割日  | object | -  |

### futures_contract_info_cffex
- **文档定位**：期货基础数据 / 合约信息 / 中国金融期货交易所
- **HTTP**：`GET /api/public/futures_contract_info_cffex`
- **调用**：运行 `scripts/aktools_get.py futures_contract_info_cffex --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.gfex.com.cn/gfex/hyxx/ywcs.shtml

描述: 中国金融期货交易所-数据-交易参数

限量: 单次返回指定 date 的期货合约信息数据

输入参数

| 名称   | 类型  | 描述                   |
|------|-----|----------------------|
| date | str | date="20240228"; 交易日 |

输出参数

| 名称    | 类型      | 描述 |
|-------|---------|----|
| 合约代码  | object  | -  |
| 合约月份  | object  | -  |
| 挂盘基准价 | float64 | -  |
| 上市日   | object  | -  |
| 最后交易日 | object  | -  |
| 涨停板幅度 | object  | -  |
| 跌停板幅度 | object  | -  |
| 涨停板价位 | float64 | -  |
| 跌停板价位 | float64 | -  |
| 持仓限额  | int64   | -  |
| 品种    | object  | -  |
| 查询交易日 | object  | -  |
