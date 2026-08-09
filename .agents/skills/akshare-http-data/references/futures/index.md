# futures 数据导航

先在“精确接口定位”表按用户的中文需求选择一行，再读取该行的接口卡。不得改写函数名；未找到时不要试探 API。

## 精确接口定位

| 中文名称或文档定位 | 精确函数名 | 读取接口卡 |
|---|---|---|
| COMEX 库存数据 | `futures_comex_inventory` | `references/futures/topic-03.md` |
| 中证商品指数 / 中证商品指数 | `futures_index_ccidx` | `references/futures/topic-03.md` |
| 期货合约详情-东财 | `futures_contract_detail_em` | `references/futures/topic-03.md` |
| 期货合约详情-新浪 | `futures_contract_detail` | `references/futures/topic-03.md` |
| 期货基础数据 / 交割统计-上期所 | `futures_delivery_shfe` | `references/futures/topic-01.md` |
| 期货基础数据 / 交割统计-大商所 | `futures_delivery_dce` | `references/futures/topic-01.md` |
| 期货基础数据 / 交割统计-郑商所 | `futures_delivery_czce` | `references/futures/topic-01.md` |
| 期货基础数据 / 交割配对-大商所 | `futures_delivery_match_dce` | `references/futures/topic-01.md` |
| 期货基础数据 / 交割配对-郑商所 | `futures_delivery_match_czce` | `references/futures/topic-01.md` |
| 期货基础数据 / 仓单日报 / 仓单日报-上海期货交易所 | `futures_shfe_warehouse_receipt` | `references/futures/topic-01.md` |
| 期货基础数据 / 仓单日报 / 仓单日报-大连商品交易所 | `futures_warehouse_receipt_dce` | `references/futures/topic-01.md` |
| 期货基础数据 / 仓单日报 / 仓单日报-广州期货交易所 | `futures_gfex_warehouse_receipt` | `references/futures/topic-01.md` |
| 期货基础数据 / 仓单日报 / 仓单日报-郑州商品交易所 | `futures_warehouse_receipt_czce` | `references/futures/topic-01.md` |
| 期货基础数据 / 会员持仓排名 / 大连商品交易所 | `futures_dce_position_rank` | `references/futures/topic-01.md` |
| 期货基础数据 / 会员持仓排名 / 广州期货交易所 | `futures_gfex_position_rank` | `references/futures/topic-01.md` |
| 期货基础数据 / 合约信息 / 上海国际能源交易中心 | `futures_contract_info_ine` | `references/futures/topic-01.md` |
| 期货基础数据 / 合约信息 / 上海期货交易所 | `futures_contract_info_shfe` | `references/futures/topic-01.md` |
| 期货基础数据 / 合约信息 / 中国金融期货交易所 | `futures_contract_info_cffex` | `references/futures/topic-01.md` |
| 期货基础数据 / 合约信息 / 大连商品交易所 | `futures_contract_info_dce` | `references/futures/topic-01.md` |
| 期货基础数据 / 合约信息 / 广州期货交易所 | `futures_contract_info_gfex` | `references/futures/topic-01.md` |
| 期货基础数据 / 合约信息 / 郑州商品交易所 | `futures_contract_info_czce` | `references/futures/topic-01.md` |
| 期货基础数据 / 库存周报 / 上海期货交易所 | `futures_stock_shfe_js` | `references/futures/topic-01.md` |
| 期货基础数据 / 库存数据-99期货网 | `futures_inventory_99` | `references/futures/topic-01.md` |
| 期货基础数据 / 库存数据-东方财富 | `futures_inventory_em` | `references/futures/topic-01.md` |
| 期货基础数据 / 成交持仓 | `futures_hold_pos_sina` | `references/futures/topic-01.md` |
| 期货基础数据 / 期货交易费用参照表 | `futures_fees_info` | `references/futures/topic-01.md` |
| 期货基础数据 / 期货手续费与保证金 | `futures_comm_info` | `references/futures/topic-01.md` |
| 期货基础数据 / 期货手续费与保证金 / 金十数据 | `futures_comm_js` | `references/futures/topic-01.md` |
| 期货基础数据 / 期货规则-交易日历表 | `futures_rule` | `references/futures/topic-01.md` |
| 期货基础数据 / 期转现-上期所 | `futures_to_spot_shfe` | `references/futures/topic-01.md` |
| 期货基础数据 / 期转现-大商所 | `futures_to_spot_dce` | `references/futures/topic-01.md` |
| 期货基础数据 / 期转现-郑商所 | `futures_to_spot_czce` | `references/futures/topic-01.md` |
| 期货基础数据 / 现期图 | `futures_spot_sys` | `references/futures/topic-01.md` |
| 期货行情数据 / 内盘-分时行情数据 | `futures_zh_minute_sina` | `references/futures/topic-02.md` |
| 期货行情数据 / 内盘-历史行情数据-东财 | `futures_hist_em` | `references/futures/topic-02.md` |
| 期货行情数据 / 内盘-历史行情数据-交易所 | `get_futures_daily` | `references/futures/topic-02.md` |
| 期货行情数据 / 内盘-历史行情数据-新浪 | `futures_zh_daily_sina` | `references/futures/topic-02.md` |
| 期货行情数据 / 内盘-实时行情数据 | `futures_zh_spot` | `references/futures/topic-02.md` |
| 期货行情数据 / 内盘-实时行情数据(品种) | `futures_zh_realtime` | `references/futures/topic-02.md` |
| 期货行情数据 / 内盘-结算参数数据 | `futures_settle` | `references/futures/topic-02.md` |
| 期货行情数据 / 外盘-历史行情数据-东财 | `futures_global_hist_em` | `references/futures/topic-02.md` |
| 期货行情数据 / 外盘-历史行情数据-新浪 | `futures_foreign_hist` | `references/futures/topic-02.md` |
| 期货行情数据 / 外盘-合约详情 | `futures_foreign_detail` | `references/futures/topic-02.md` |
| 期货行情数据 / 外盘-品种代码表 | `futures_hq_subscribe_exchange_symbol` | `references/futures/topic-02.md` |
| 期货行情数据 / 外盘-实时行情数据 | `futures_foreign_commodity_realtime` | `references/futures/topic-02.md` |
| 期货行情数据 / 外盘-实时行情数据-东财 | `futures_global_spot_em` | `references/futures/topic-02.md` |
| 期货行情数据 / 新加坡交易所期货 | `futures_settlement_price_sgx` | `references/futures/topic-02.md` |
| 期货资讯 | `futures_news_shmet` | `references/futures/topic-03.md` |
| 期货连续合约 | `futures_main_sina` | `references/futures/topic-03.md` |
| 现货与股票 | `futures_spot_stock` | `references/futures/topic-03.md` |
| 生猪信息 / 供应维度 | `futures_hog_supply` | `references/futures/topic-03.md` |
| 生猪信息 / 成本维度 | `futures_hog_cost` | `references/futures/topic-03.md` |
| 生猪信息 / 核心数据 | `futures_hog_core` | `references/futures/topic-03.md` |
| 生猪市场价格指数 | `index_hog_spot_price` | `references/futures/topic-03.md` |

## 子主题概览
- **期货基础数据**（29 个接口）：`references/futures/topic-01.md`
- **期货行情数据**（14 个接口）：`references/futures/topic-02.md`
- **其他细分主题**（11 个接口）：`references/futures/topic-03.md`
