# 其他细分主题



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### futures_comex_inventory
- **文档定位**：COMEX 库存数据
- **HTTP**：`GET /api/public/futures_comex_inventory`
- **调用**：运行 `scripts/aktools_get.py futures_comex_inventory --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/pmetal/comex/by.html

描述: 东方财富网-数据中心-期货期权-COMEX 库存数据

限量: 单次返回指定 symbol 的所有历史数据

输入参数

| 名称     | 类型  | 描述                                  |
|--------|-----|-------------------------------------|
| symbol | str | symbol="黄金"; choice of {"黄金", "白银"} |

输出参数

| 名称                  | 类型      | 描述       |
|---------------------|---------|----------|
| 序号                  | int64   | -        |
| 日期                  | object  | -        |
| COMEX{symbol}库存量-吨  | float64 | 注意单位: 盎司 |
| COMEX{symbol}库存量-盎司 | float64 | 注意单位: 吨  |

### futures_index_ccidx
- **文档定位**：中证商品指数 / 中证商品指数
- **HTTP**：`GET /api/public/futures_index_ccidx`
- **调用**：运行 `scripts/aktools_get.py futures_index_ccidx --param key=value`；参数以本卡的输入参数表为准。

目标地址: http://www.ccidx.com/index.html

描述: 中证商品指数

限量: 单次返回指定 symbol 的指数日频率数据

输入参数

| 名称     | 类型  | 描述                                                        |
|--------|-----|-----------------------------------------------------------|
| symbol | str | symbol="中证商品期货指数"; choice of {"中证商品期货指数", "中证商品期货价格指数", } |

输出参数

| 名称   | 类型      | 描述 |
|------|---------|----|
| 日期   | object  | -  |
| 指数代码 | object  | -  |
| 收盘点位 | float64 | -  |
| 结算点位 | float64 | -  |
| 涨跌   | float64 | -  |
| 涨跌幅  | float64 | -  |

### futures_contract_detail_em
- **文档定位**：期货合约详情-东财
- **HTTP**：`GET /api/public/futures_contract_detail_em`
- **调用**：运行 `scripts/aktools_get.py futures_contract_detail_em --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://quote.eastmoney.com/qihuo/v2602F.html

描述: 东方财富-期货-期货合约详情数据

限量: 单次返回指定 symbol 的合约详情数据

输入参数

| 名称     | 类型  | 描述                                                                              |
|--------|-----|---------------------------------------------------------------------------------|
| symbol | str | symbol='v2602F'; 请参考东方财富的期货品种标识：https://quote.eastmoney.com/center/futures.html |

输出参数

| 名称    | 类型     | 描述       |
|-------|--------|----------|
| item  | object | 合约具体的项目  |
| value | object | 合约具体的项目值 |

### futures_contract_detail
- **文档定位**：期货合约详情-新浪
- **HTTP**：`GET /api/public/futures_contract_detail`
- **调用**：运行 `scripts/aktools_get.py futures_contract_detail --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://finance.sina.com.cn/futures/quotes/V2101.shtml

描述: 新浪财经-期货-期货合约详情数据

限量: 单次返回指定 symbol 的合约详情数据

输入参数

| 名称     | 类型  | 描述                                                                              |
|--------|-----|---------------------------------------------------------------------------------|
| symbol | str | symbol='AP2101'; 请参考**新浪连续合约品种一览表**, 也可通过 **ak.futures_display_main_sina()** 获取 |

新浪连续合约品种一览表（更新于 20241226）

|    | symbol | exchange | name        |
|---:|:-------|:---------|:------------|
|  0 | V0     | dce      | PVC连续       |
|  1 | P0     | dce      | 棕榈油连续       |
|  2 | B0     | dce      | 豆二连续        |
|  3 | M0     | dce      | 豆粕连续        |
|  4 | I0     | dce      | 铁矿石连续       |
|  5 | JD0    | dce      | 鸡蛋连续        |
|  6 | L0     | dce      | 塑料连续        |
|  7 | PP0    | dce      | 聚丙烯连续       |
|  8 | FB0    | dce      | 纤维板连续       |
|  9 | BB0    | dce      | 胶合板连续       |
| 10 | Y0     | dce      | 豆油连续        |
| 11 | C0     | dce      | 玉米连续        |
| 12 | A0     | dce      | 豆一连续        |
| 13 | J0     | dce      | 焦炭连续        |
| 14 | JM0    | dce      | 焦煤连续        |
| 15 | CS0    | dce      | 淀粉连续        |
| 16 | EG0    | dce      | 乙二醇连续       |
| 17 | RR0    | dce      | 粳米连续        |
| 18 | EB0    | dce      | 苯乙烯连续       |
| 19 | PG0    | dce      | 液化石油气连续     |
| 20 | LH0    | dce      | 生猪连续        |
| 21 | TA0    | czce     | PTA连续       |
| 22 | OI0    | czce     | 菜油连续        |
| 23 | RS0    | czce     | 菜籽连续        |
| 24 | RM0    | czce     | 菜粕连续        |
| 25 | WH0    | czce     | 强麦连续        |
| 26 | JR0    | czce     | 粳稻连续        |
| 27 | SR0    | czce     | 白糖连续        |
| 28 | CF0    | czce     | 棉花连续        |
| 29 | RI0    | czce     | 早籼稻连续       |
| 30 | MA0    | czce     | 甲醇连续        |
| 31 | FG0    | czce     | 玻璃连续        |
| 32 | LR0    | czce     | 晚籼稻连续       |
| 33 | SF0    | czce     | 硅铁连续        |
| 34 | SM0    | czce     | 锰硅连续        |
| 35 | CY0    | czce     | 棉纱连续        |
| 36 | AP0    | czce     | 苹果连续        |
| 37 | CJ0    | czce     | 红枣连续        |
| 38 | UR0    | czce     | 尿素连续        |
| 39 | SA0    | czce     | 纯碱连续        |
| 40 | PF0    | czce     | 短纤连续        |
| 41 | PK0    | czce     | 花生连续        |
| 42 | SH0    | czce     | 烧碱连续        |
| 43 | PX0    | czce     | 对二甲苯连续      |
| 44 | FU0    | shfe     | 燃料油连续       |
| 45 | SC0    | ine      | 上海原油连续      |
| 46 | AL0    | shfe     | 铝连续         |
| 47 | RU0    | shfe     | 天然橡胶连续      |
| 48 | ZN0    | shfe     | 沪锌连续        |
| 49 | CU0    | shfe     | 铜连续         |
| 50 | AU0    | shfe     | 黄金连续        |
| 51 | RB0    | shfe     | 螺纹钢连续       |
| 52 | WR0    | shfe     | 线材连续        |
| 53 | PB0    | shfe     | 铅连续         |
| 54 | AG0    | shfe     | 白银连续        |
| 55 | BU0    | shfe     | 沥青连续        |
| 56 | HC0    | shfe     | 热轧卷板连续      |
| 57 | SN0    | shfe     | 锡连续         |
| 58 | NI0    | shfe     | 镍连续         |
| 59 | SP0    | shfe     | 纸浆连续        |
| 60 | NR0    | ine      | 20号胶连续      |
| 61 | SS0    | shfe     | 不锈钢连续       |
| 62 | LU0    | ine      | 低硫燃料油连续     |
| 63 | BC0    | ine      | 国际铜连续       |
| 64 | AO0    | shfe     | 氧化铝连续       |
| 65 | BR0    | shfe     | 丁二烯橡胶连续     |
| 66 | EC0    | ine      | 集运指数欧线期货连续  |
| 67 | IF0    | cffex    | 沪深300指数期货连续 |
| 68 | TF0    | cffex    | 5年期国债期货连续   |
| 69 | IH0    | cffex    | 上证50指数期货连续  |
| 70 | IC0    | cffex    | 中证500指数期货连续 |
| 71 | TS0    | cffex    | 2年期国债期货连续   |
| 72 | IM0    | cffex    | 中证连续指数期货连续  |
| 73 | SI0    | gfex     | 工业硅连续       |
| 74 | LC0    | gfex     | 碳酸锂连续       |
| 75 | PS0    | gfex     | 多晶硅连续       |

输出参数

| 名称    | 类型     | 描述       |
|-------|--------|----------|
| item  | object | 合约具体的项目  |
| value | object | 合约具体的项目值 |

### futures_news_shmet
- **文档定位**：期货资讯
- **HTTP**：`GET /api/public/futures_news_shmet`
- **调用**：运行 `scripts/aktools_get.py futures_news_shmet --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.shmet.com/newsFlash/newsFlash.html?searchKeyword=

描述: 上海金属网-快讯

限量: 指定 symbol 的数据

输入参数

| 名称     | 类型  | 描述                                                                                           |
|--------|-----|----------------------------------------------------------------------------------------------|
| symbol | str | symbol="全部"; choice of {"全部", "要闻", "VIP", "财经", "铜", "铝", "铅", "锌", "镍", "锡", "贵金属", "小金属"} |

输出参数

| 名称   | 类型     | 描述  |
|------|--------|-----|
| 发布时间 | object | -   |
| 内容   | object | -   |

### futures_main_sina
- **文档定位**：期货连续合约
- **HTTP**：`GET /api/public/futures_main_sina`
- **调用**：运行 `scripts/aktools_get.py futures_main_sina --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://vip.stock.finance.sina.com.cn/quotes_service/view/qihuohangqing.html#titlePos_0

描述: 新浪财经-期货-主力连续合约历史数据

限量: 单次返回单个期货品种的主力连续合约的日频历史数据

输入参数

| 名称         | 类型  | 描述                                                                            |
|------------|-----|-------------------------------------------------------------------------------|
| symbol     | str | symbol="IF0"; 请参考 **新浪连续合约品种一览表**, 也可通过 **ak.futures_display_main_sina()** 获取 |
| start_date | str | start_date="19900101";                                                        |
| end_date   | str | end_date="22220101";                                                          |

新浪连续合约品种一览表

| index | symbol | exchange | name        |
|------:|:-------|:---------|:------------|
|     0 | V0     | dce      | PVC连续       |
|     1 | P0     | dce      | 棕榈油连续       |
|     2 | B0     | dce      | 豆二连续        |
|     3 | M0     | dce      | 豆粕连续        |
|     4 | I0     | dce      | 铁矿石连续       |
|     5 | JD0    | dce      | 鸡蛋连续        |
|     6 | L0     | dce      | 塑料连续        |
|     7 | PP0    | dce      | 聚丙烯连续       |
|     8 | FB0    | dce      | 纤维板连续       |
|     9 | BB0    | dce      | 胶合板连续       |
|    10 | Y0     | dce      | 豆油连续        |
|    11 | C0     | dce      | 玉米连续        |
|    12 | A0     | dce      | 豆一连续        |
|    13 | J0     | dce      | 焦炭连续        |
|    14 | JM0    | dce      | 焦煤连续        |
|    15 | CS0    | dce      | 淀粉连续        |
|    16 | EG0    | dce      | 乙二醇连续       |
|    17 | RR0    | dce      | 粳米连续        |
|    18 | EB0    | dce      | 苯乙烯连续       |
|    19 | LH0    | dce      | 生猪连续        |
|    20 | TA0    | czce     | PTA连续       |
|    21 | OI0    | czce     | 菜油连续        |
|    22 | RS0    | czce     | 菜籽连续        |
|    23 | RM0    | czce     | 菜粕连续        |
|    24 | ZC0    | czce     | 动力煤连续       |
|    25 | WH0    | czce     | 强麦连续        |
|    26 | JR0    | czce     | 粳稻连续        |
|    27 | SR0    | czce     | 白糖连续        |
|    28 | CF0    | czce     | 棉花连续        |
|    29 | RI0    | czce     | 早籼稻连续       |
|    30 | MA0    | czce     | 甲醇连续        |
|    31 | FG0    | czce     | 玻璃连续        |
|    32 | LR0    | czce     | 晚籼稻连续       |
|    33 | SF0    | czce     | 硅铁连续        |
|    34 | SM0    | czce     | 锰硅连续        |
|    35 | CY0    | czce     | 棉纱连续        |
|    36 | AP0    | czce     | 苹果连续        |
|    37 | CJ0    | czce     | 红枣连续        |
|    38 | UR0    | czce     | 尿素连续        |
|    39 | SA0    | czce     | 纯碱连续        |
|    40 | PF0    | czce     | 短纤连续        |
|    41 | PK0    | czce     | 花生连续        |
|    42 | FU0    | shfe     | 燃料油连续       |
|    43 | SC0    | ine      | 上海原油连续      |
|    44 | AL0    | shfe     | 铝连续         |
|    45 | RU0    | shfe     | 天然橡胶连续      |
|    46 | ZN0    | shfe     | 沪锌连续        |
|    47 | CU0    | shfe     | 铜连续         |
|    48 | AU0    | shfe     | 黄金连续        |
|    49 | RB0    | shfe     | 螺纹钢连续       |
|    50 | WR0    | shfe     | 线材连续        |
|    51 | PB0    | shfe     | 铅连续         |
|    52 | AG0    | shfe     | 白银连续        |
|    53 | BU0    | shfe     | 沥青连续        |
|    54 | HC0    | shfe     | 热轧卷板连续      |
|    55 | SN0    | shfe     | 锡连续         |
|    56 | NI0    | shfe     | 镍连续         |
|    57 | SP0    | shfe     | 纸浆连续        |
|    58 | NR0    | ine      | 20号胶连续      |
|    59 | SS0    | shfe     | 不锈钢连续       |
|    60 | LU0    | ine      | 低硫燃料油连续     |
|    61 | BC0    | ine      | 国际铜连续       |
|    62 | IF0    | cffex    | 沪深300指数期货连续 |
|    63 | TF0    | cffex    | 5年期国债期货连续   |
|    64 | IH0    | cffex    | 上证50指数期货连续  |
|    65 | IC0    | cffex    | 中证500指数期货连续 |
|    66 | TS0    | cffex    | 2年期国债期货连续   |

输出参数

| 名称    | 类型     | 描述   |
|-------|--------|------|
| 日期    | object | -    |
| 开盘价   | int64  | -    |
| 最高价   | int64  | -    |
| 最低价   | int64  | -    |
| 收盘价   | int64  | -    |
| 成交量   | int64  | 注意单位 |
| 持仓量   | int64  | 注意单位 |
| 动态结算价 | int64  | -    |

接口示例-主力连续合约

```python
import akshare as ak

futures_main_sina_hist = ak.futures_main_sina(symbol="V0", start_date="20200101", end_date="20220101")
print(futures_main_sina_hist)
```

### futures_spot_stock
- **文档定位**：现货与股票
- **HTTP**：`GET /api/public/futures_spot_stock`
- **调用**：运行 `scripts/aktools_get.py futures_spot_stock --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://data.eastmoney.com/ifdata/xhgp.html

描述: 东方财富网-数据中心-现货与股票

限量: 单次返回指定 indicator 的所有数据

输入参数

| 名称     | 类型  | 描述                                                                      |
|--------|-----|-------------------------------------------------------------------------|
| symbol | str | symbol="能源"; choice of {'能源', '化工', '塑料', '纺织', '有色', '钢铁', '建材', '农副'} |

输出参数

| 名称     | 类型      | 描述        |
|--------|---------|-----------|
| 商品名称   | object  | -         |
| 近5月    | float64 | 注意: 具体的日期 |
| 近4月    | float64 | 注意: 具体的日期 |
| 近3月    | float64 | 注意: 具体的日期 |
| 近2月    | float64 | 注意: 具体的日期 |
| 近1月    | float64 | 注意: 具体的日期 |
| 最新价    | float64 | -         |
| 近半年涨跌幅 | float64 | 注意单位: %   |
| 生产商    | object  | 注意: 字符串组成 |
| 下游用户   | object  | 注意: 字符串组成 |

### futures_hog_core
- **文档定位**：生猪信息 / 核心数据
- **HTTP**：`GET /api/public/futures_hog_core`
- **调用**：运行 `scripts/aktools_get.py futures_hog_core --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://zhujia.zhuwang.com.cn

描述: 玄田数据-核心数据

限量: 单次返回指定 symbol 的所有历史数据

输入参数

| 名称     | 类型  | 描述                                            |
|--------|-----|-----------------------------------------------|
| symbol | str | symbol="外三元"; choice of {"外三元", "内三元", "土杂猪"} |

输出参数

| 名称    | 类型      | 描述 |
|-------|---------|----|
| date  | object  | -  |
| value | float64 | -  |

### futures_hog_cost
- **文档定位**：生猪信息 / 成本维度
- **HTTP**：`GET /api/public/futures_hog_cost`
- **调用**：运行 `scripts/aktools_get.py futures_hog_cost --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://zhujia.zhuwang.com.cn

描述: 玄田数据-成本维度

限量: 单次返回指定 symbol 的所有历史数据

输入参数

| 名称     | 类型  | 描述                                                    |
|--------|-----|-------------------------------------------------------|
| symbol | str | symbol="玉米"; choice of {"玉米", "豆粕", "二元母猪价格", "仔猪价格"} |

输出参数

| 名称    | 类型      | 描述 |
|-------|---------|----|
| date  | object  | -  |
| value | float64 | -  |

### futures_hog_supply
- **文档定位**：生猪信息 / 供应维度
- **HTTP**：`GET /api/public/futures_hog_supply`
- **调用**：运行 `scripts/aktools_get.py futures_hog_supply --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://zhujia.zhuwang.com.cn

描述: 玄田数据-供应维度

限量: 单次返回指定 symbol 的所有历史数据

输入参数

| 名称     | 类型  | 描述                                                                                          |
|--------|-----|---------------------------------------------------------------------------------------------|
| symbol | str | symbol="玉米"; choice of {"猪肉批发价", "储备冻猪肉", "饲料原料数据", "白条肉", "生猪产能", "育肥猪", "肉类价格指数", "猪粮比价"} |

输出参数

| 名称    | 类型      | 描述 |
|-------|---------|----|
| date  | object  | -  |
| value | float64 | -  |

### index_hog_spot_price
- **文档定位**：生猪市场价格指数
- **HTTP**：`GET /api/public/index_hog_spot_price`
- **调用**：运行 `scripts/aktools_get.py index_hog_spot_price --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://hqb.nxin.com/pigindex/index.shtml

描述: 行情宝-生猪市场价格指数

限量: 单次返回所有数据

输入参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | -   | -   |

输出参数

| 名称     | 类型      | 描述         |
|--------|---------|------------|
| 日期     | object  | -          |
| 指数     | float64 | -          |
| 4个月均线  | float64 | -          |
| 6个月均线  | float64 | -          |
| 12个月均线 | float64 | -          |
| 预售均价   | float64 | 注意单位: 元/公斤 |
| 成交均价   | float64 | 注意单位: 元/公斤 |
| 成交均重   | int64   | 注意单位: kg   |
