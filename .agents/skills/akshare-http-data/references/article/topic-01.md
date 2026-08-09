# 其他细分主题



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### article_ff_crr
- **文档定位**：Current Research Returns
- **HTTP**：`GET /api/public/article_ff_crr`
- **调用**：运行 `scripts/aktools_get.py article_ff_crr --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/data_library.html

描述: 获取 Current Research Returns 多因子数据; 更多信息请访问目标地址

限量: 单次返回所有历史数据

输入参数

| 名称 | 类型 | 描述 |
|----|----|----|
| -  | -  | -  |

输出参数

| 名称             | 类型     | 描述   |
|----------------|--------|------|
| item           | object | -    |
| September 2019 | object | 动态日期 |
| Last 3 Months  | object | 动态日期 |
| Last 12 Months | object | 动态日期 |

### article_epu_index
- **文档定位**：国家和地区指数
- **HTTP**：`GET /api/public/article_epu_index`
- **调用**：运行 `scripts/aktools_get.py article_epu_index --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://www.policyuncertainty.com/index.html

描述: 国家或地区的经济政策不确定性(EPU)数据

限量: 单次返回某个具体国家或地区的所有月度经济政策不确定性数据

输入参数

| 名称     | 类型  | 描述                                    |
|--------|-----|---------------------------------------|
| symbol | str | symbol="China"; 按 **国家和地区一览表** 输入相应参数 |

国家和地区一览表

| 英文名词        | 说明              |
|-------------|-----------------|
| Global      |                 |
| Australia   |                 |
| Canada      |                 |
| China       |                 |
| Europe      | 欧洲              |
| Germany     | 欧洲              |
| Hong Kong   |                 |
| Ireland     |                 |
| Japan       |                 |
| Mexico      |                 |
| Russia      |                 |
| Spain       |                 |
| UK          |                 |
| USA         |                 |
| Brazil      |                 |
| Chile       |                 |
| Colombia    | 有两种, 默认第一种(FKT) |
| France      | 欧洲              |
| Greece      |                 |
| India       |                 |
| Italy       | 欧洲              |
| South Korea |                 |
| Netherlands |                 |
| Singapore   |                 |
| Sweden      |                 |

输出参数

| 名称 | 类型 | 描述        |
|----|----|-----------|
| -  | -  | 每个国家或地区不同 |

### article_oman_rv
- **文档定位**：已实现波动率数据 / Oxford-Man
- **HTTP**：`GET /api/public/article_oman_rv`
- **调用**：运行 `scripts/aktools_get.py article_oman_rv --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://realized.oxford-man.ox.ac.uk/data/visualization

描述: 获取 Oxford-Man 已实现波动率数据

限量: 单次返回某个指数具体指标的所有历史数据

输入参数

| 名称     | 类型  | 描述                                        |
|--------|-----|-------------------------------------------|
| symbol | str | symbol="FTSE", 具体指数请查看如下 **已实现波动率指数一览表**  |
| index  | str | index="rk_th2", 具体指标请查看如下 **已实现波动率指标一览表** |

已实现波动率指数一览表

| Symbol    | Name                                      | Earliest Available | Latest Available  |
|-----------|-------------------------------------------|--------------------|-------------------|
| .AEX      | AEX index                                 | January 03, 2000   | November 28, 2019 |
| .AORD     | All Ordinaries                            | January 04, 2000   | November 28, 2019 |
| .BFX      | Bell 20 Index                             | January 03, 2000   | November 28, 2019 |
| .BSESN    | S&P BSE Sensex                            | January 03, 2000   | November 28, 2019 |
| .BVLG     | PSI All-Share Index                       | October 15, 2012   | November 28, 2019 |
| .BVSP     | BVSP BOVESPA Index                        | January 03, 2000   | November 28, 2019 |
| .DJI      | Dow Jones Industrial Average              | January 03, 2000   | November 27, 2019 |
| .FCHI     | CAC 40                                    | January 03, 2000   | November 28, 2019 |
| .FTMIB    | FTSE MIB                                  | June 01, 2009      | November 28, 2019 |
| .FTSE     | FTSE 100                                  | January 04, 2000   | November 28, 2019 |
| .GDAXI    | DAX                                       | January 03, 2000   | November 28, 2019 |
| .GSPTSE   | S&P/TSX Composite index                   | May 02, 2002       | November 28, 2019 |
| .HSI      | HANG SENG Index                           | January 03, 2000   | November 28, 2019 |
| .IBEX     | IBEX 35 Index                             | January 03, 2000   | November 28, 2019 |
| .IXIC     | Nasdaq 100                                | January 03, 2000   | November 27, 2019 |
| .KS11     | Korea Composite Stock Price Index (KOSPI) | January 04, 2000   | November 28, 2019 |
| .KSE      | Karachi SE 100 Index                      | January 03, 2000   | November 28, 2019 |
| .MXX      | IPC Mexico                                | January 03, 2000   | November 28, 2019 |
| .N225     | Nikkei 225                                | February 02, 2000  | November 28, 2019 |
| .NSEI     | NIFTY 50                                  | January 03, 2000   | November 28, 2019 |
| .OMXC20   | OMX Copenhagen 20 Index                   | October 03, 2005   | November 28, 2019 |
| .OMXHPI   | OMX Helsinki All Share Index              | October 03, 2005   | November 28, 2019 |
| .OMXSPI   | OMX Stockholm All Share Index             | October 03, 2005   | November 28, 2019 |
| .OSEAX    | Oslo Exchange All-share Index             | September 03, 2001 | November 28, 2019 |
| .RUT      | Russel 2000                               | January 03, 2000   | November 27, 2019 |
| .SMSI     | Madrid General Index                      | July 04, 2005      | November 28, 2019 |
| .SPX      | S&P 500 Index                             | January 03, 2000   | November 27, 2019 |
| .SSEC     | Shanghai Composite Index                  | January 04, 2000   | November 28, 2019 |
| .SSMI     | Swiss Stock Market Index                  | January 04, 2000   | November 28, 2019 |
| .STI      | Straits Times Index                       | January 03, 2000   | November 28, 2019 |
| .STOXX50E | EURO STOXX 50                             | January 03, 2000   | November 28, 2019 |

已实现波动率指标一览表

| Code          | Description                                   |
|---------------|-----------------------------------------------|
| bv            | Bipower Variation (5-min)                     |
| bv_ss         | Bipower Variation (5-min Sub-sampled)         |
| close_price   | Closing (Last) Price                          |
| close_time    | Closing Time                                  |
| medrv         | Median Realized Variance (5-min)              |
| nobs          | Number of Observations                        |
| open_price    | Opening (First) Price                         |
| open_time     | Opening Time                                  |
| open_to_close | Open to Close Return                          |
| rk_parzen     | Realized Kernel Variance (Non-Flat Parzen)    |
| rk_th2        | Realized Kernel Variance (Tukey-Hanning(2))   |
| rk_twoscale   | Realized Kernel Variance (Two-Scale/Bartlett) |
| rsv           | Realized Semi-variance (5-min)                |
| rsv_ss        | Realized Semi-variance (5-min Sub-sampled)    |
| rv10          | Realized Variance (10-min)                    |
| rv10_ss       | Realized Variance (10-min Sub-sampled)        |
| rv5           | Realized Variance (5-min)                     |
| rv5_ss        | Realized Variance (5-min Sub-sampled)         |

输出参数

Oxford-Man-已实现波动率数据

| 名称    | 类型                | 描述 |
|-------|-------------------|----|
| index | datetime.datetime | 日期 |
| data  | float             | 数据 |

### article_rlab_rv
- **文档定位**：已实现波动率数据 / Risk-Lab
- **HTTP**：`GET /api/public/article_rlab_rv`
- **调用**：运行 `scripts/aktools_get.py article_rlab_rv --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://dachxiu.chicagobooth.edu/

描述: 获取 Risk-Lab 已实现波动率数据

限量: 单次返回某个指数所有历史数据

输入参数

| 名称     | 类型  | 描述                                           |
|--------|-----|----------------------------------------------|
| symbol | str | symbol="39693", 某个具体指数 help(article_rlab_rv) |

输出参数

Risk-Lab-已实现波动率数据

| 名称    | 类型                | 描述  |
|-------|-------------------|-----|
| index | datetime.datetime | 日期  |
| data  | float             | 数据  |
