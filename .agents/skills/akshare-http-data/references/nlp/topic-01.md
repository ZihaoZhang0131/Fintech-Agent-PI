# 其他细分主题



以下接口来自固定的 AKShare 1.18.83 官方数据字典。读取本文件后，再使用 `scripts/aktools_get.py` 调用。



### nlp_answer
- **文档定位**：智能问答
- **HTTP**：`GET /api/public/nlp_answer`
- **调用**：运行 `scripts/aktools_get.py nlp_answer --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://ownthink.com/robot.html

描述: 思知-对话机器人的接口, 以此来进行智能问答

限量: 单次返回查询的数据结果

输入参数

| 名称       | 类型  | 描述               |
|----------|-----|------------------|
| question | str | question="姚明的身高" |

输出参数

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | str | 答案  |

### nlp_ownthink
- **文档定位**：知识图谱
- **HTTP**：`GET /api/public/nlp_ownthink`
- **调用**：运行 `scripts/aktools_get.py nlp_ownthink --param key=value`；参数以本卡的输入参数表为准。

目标地址: https://ownthink.com/

描述: 思知-知识图谱的接口, 以此来查询知识图谱数据

限量: 单次返回查询的数据结果

输入参数

| 名称        | 类型  | 描述                                                        |
|-----------|-----|-----------------------------------------------------------|
| word      | str | word="人工智能"                                               |
| indicator | str | indicator="entity"; Please refer **Indicator Info** table |

Indicator Info

| fields | type             | description                    |
|--------|------------------|--------------------------------|
| entity | str              | 	实体名                           |
| desc   | str              | 	实体简介                          |
| tag    | list             | 	实体标签                          |
| avg    | pandas.DataFrame | 	实体属性值，第一列为实体的属性，第二列为实体属性所对应的值 |

输出参数-entity

| 名称  | 类型  | 描述  |
|-----|-----|-----|
| -   | str | 结果  |

接口示例-entity

```python
import akshare as ak

nlp_ownthink_df = ak.nlp_ownthink(word="人工智能", indicator="entity")
print(nlp_ownthink_df)
```
