import { Topic } from '../../types';

export const sqlTopic: Topic = {
  id: 'sql-programming',
  title: 'SQL语法、高级查询与编程',
  badge: '代码核心',
  icon: 'FileCode2',
  description: '单表去重DISTINCT、集合交并差、相关子查询EXISTS、多表连接4种类型、四大排名函数、内联表值函数(带参视图)、触发器特殊临时表(INSERTED/DELETED)、SELECT INTO建新表与安全权限管理',
  subTopics: [
    {
      id: 'set-operations',
      title: '1. 数据去重核心（DISTINCT）与集合操作符（UNION / INTERSECT / EXCEPT）',
      tag: '去重与集合查询',
      highlightedKeywords: [
        'DISTINCT',
        'UNION',
        'UNION ALL',
        'INTERSECT',
        'EXCEPT',
        '自动去重',
        '列数一致',
        '过滤重复'
      ],
      content: `### SQL 数据去重机制（DISTINCT）与集合操作符全景精讲

在 SQL 数据检索中，根据数据源是**单个 SELECT 查询**还是**多个 SELECT 查询结果集的合并**，去重机制分为两种典型实现。

---

### 一、 单个 SELECT 查询去重：DISTINCT 关键字的专属作用（核心考点）

#### 1. DISTINCT 的专属作用：
- 在单个 \`SELECT\` 查询中，如果结果集包含了大量重复的行，只需在 \`SELECT\` 关键字后面紧跟 \`DISTINCT\`（如 \`SELECT DISTINCT 部门 FROM 员工表\`），系统就会自动过滤掉所有重复的元组，只保留唯一的行。

#### 2. DISTINCT 核心语法规则与考场陷阱：
- **位置铁律**：\`DISTINCT\` 必须紧跟在 \`SELECT\` 关键字之后，**绝对不能写在字段名后面**！
  - ✅ 正确：\`SELECT DISTINCT 部门 FROM 员工表;\`
  - ❌ 错误：\`SELECT 部门 DISTINCT FROM 员工表;\`
- **多列作用范围（极其高频考点）**：
  当 \`DISTINCT\` 后面跟有多个列名时，它**不是**单独对某一个列去重，而是**对后面所列出的全部列值的【组合】进行全局去重**！
  \`\`\`sql
  -- 查询所有不重复的“部门”与“职位”组合
  SELECT DISTINCT 部门, 职位 FROM 员工表;
  \`\`\`
  > 此时只有当两行的“部门”和“职位”**完全一致**时，才会被视为重复行予以过滤；若部门相同但职位不同，仍然会被完整保留！

#### 3. DISTINCT 配合聚合函数（COUNT / SUM / AVG）：
- **\`COUNT(*)\`**：统计总行数（包含重复行，且包含 NULL 值）。
- **\`COUNT(列名)\`**：统计该列非 NULL 的记录数（包含重复值）。
- **\`COUNT(DISTINCT 列名)\`**：**先过滤该列的重复值与 NULL**，仅统计该列有多少个互不相同的唯一有效值。
  \`\`\`sql
  -- 统计公司实际涵盖了多少个不同部门
  SELECT COUNT(DISTINCT 部门) AS 部门总数 FROM 员工表;
  \`\`\`

---

### 二、 多个查询结果集合并：集合操作符（UNION / INTERSECT / EXCEPT）

集合操作符用于合并两个或多个 SELECT 查询的结果集。参与集合运算的各结果集必须满足：**列数必须相同，对应列的数据类型必须兼容**。

| 操作符 | 运算类型 | 是否自动去重 | 性能差异 | 典型使用场景 |
| :--- | :--- | :--- | :--- | :--- |
| **UNION** | **并集** | **自动去重并排序** | 较慢（需要执行去重排序） | 合并多个数据源，且不允许出现重复行 |
| **UNION ALL** | **并集** | **保留所有重复行** | **极快**（直接拼接追加） | 已经明确没有重复或允许重复日志拼接时（首选！） |
| **INTERSECT**| **交集** | 自动去重 | 中等 | 查询既选修了课程A又选修了课程B的学生学号 |
| **EXCEPT** | **差集** | 自动去重 | 中等 | 查询选修了课程A但**没有选修**课程B的学生学号 |

#### 典型考题示例与考点分析
\`\`\`sql
-- 需求：查询在计算机系(CS)就读，但没有选修 C01 课程的学生学号
SELECT Sno
FROM Student
WHERE Dept = 'CS'
EXCEPT
SELECT Sno
FROM SC
WHERE Cno = 'C01';
\`\`\`

##### 【考点与逻辑拆解】
- **\`SELECT Sno FROM Student WHERE Dept = 'CS'\`**：首先执行前半段查询，从 \`Student\` 表中选拔所有计算机系学生的学号集合（集合 A）。
- **\`EXCEPT\`**：核心集合差运算关键字。相当于数学集合运算中的 A - B（扣除差集），作用是**返回只存在于集合 A 中、但不存在于集合 B 中的记录**，系统会自动剔除重复项。
- **\`SELECT Sno FROM SC WHERE Cno = 'C01'\`**：执行后半段查询，从选课表 \`SC\` 中找出所有选修了 \`C01\` 课程的学生学号集合（集合 B）。两段查询最终合并执行差集扣除。

---

### 三、 考场辨析：去重机制对比表

| 场景 | 核心关键字 | 作用范围 | 执行特征 |
| :--- | :--- | :--- | :--- |
| **单个 SELECT 结果集去重** | **\`DISTINCT\`** | 紧跟 \`SELECT\`，对后续所有投影列的**值组合**去重 | 在单表/多表联查投影前过滤掉所有重复元组，只保留唯一的行 |
| **多个 SELECT 并集去重** | **\`UNION\`** | 连接上下两段独立 SQL 结果集 | 合并两表记录集，并做哈希/排序去重剔除重复行 |
| **多个 SELECT 并集不去重** | **\`UNION ALL\`** | 连接上下两段独立 SQL 结果集 | 纯粹直接拼接追加，保留所有重复行，性能最高 |`
    },
    {
      id: 'subquery-techniques',
      title: '2. 子查询分类与谓词（EXISTS / ANY / ALL）',
      tag: '子查询精要',
      highlightedKeywords: [
        '相关子查询',
        '不相关子查询',
        'EXISTS',
        'NOT EXISTS',
        'ANY',
        'ALL'
      ],
      content: `### 子查询核心类型与量词谓词

#### 1. 不相关子查询 vs 相关子查询
- **不相关子查询**：子查询不引用外部主查询的任何列，**只执行一次**，将结果返回给主查询作为常量集合。
- **相关子查询**：子查询的 WHERE 条件引用了外部主查询的列，**外部主查询每扫描一行，子查询就重新执行一次**。通常使用 \`EXISTS\` 或 \`NOT EXISTS\` 引导。

#### 2. 量词谓词与等价关系
- \`> ANY (子查询)\`：**大于子查询返回结果中的某一个（最小值）**，等价于 \`> MIN(...)\`。
- \`> ALL (子查询)\`：**大于子查询返回结果中的所有值（最大值）**，等价于 \`> MAX(...)\`。
- \`< ALL (子查询)\`：**小于子查询返回结果中的所有值（最小值）**，等价于 \`< MIN(...)\`。

#### 3. EXISTS 谓词执行逻辑与代码实例
\`\`\`sql
-- 需求：查询选修了 'C02' 号课程的学生姓名（相关子查询 EXISTS 经典写法）
SELECT S.Sname
FROM Student S
WHERE EXISTS (
    SELECT 1
    FROM SC
    WHERE SC.Sno = S.Sno
      AND SC.Cno = 'C02'
);
\`\`\`

##### 【考点与逻辑拆解】
- **\`SELECT S.Sname FROM Student S\`**：主查询遍历学生表中的每一个学生元组。
- **\`WHERE EXISTS (...)\`**：EXISTS 谓词用于判断子查询是否返回结果。一旦子查询找到匹配记录立即返回 TRUE，终止当前行的子查询扫描，**不会把子查询中的具体数据返回给主查询**，只返回布尔值。
- **\`SELECT 1 FROM SC\`**：子查询的 SELECT 列表写什么都不影响结果与效率（写 \`*\` 或 \`1\` 均可），习惯写 \`1\` 是工业界和机考规范。
- **\`WHERE SC.Sno = S.Sno AND SC.Cno = 'C02'\`**：这是“相关子查询”的标志！内层的 \`SC.Sno = S.Sno\` 引用了外层的别名 \`S\`，外层每扫描一名学生，就拿着其学号到选课表中核对是否有 \`C02\` 的选课记录。

---

#### 4. 考场速记模板：带括号子查询填空秒杀（EXISTS vs IN 秒杀）

在填空题中遇到带括号的子查询：

##### 句式结构对比：
- \`WHERE _____ (SELECT * FROM ...)\` ➔ 填 **\`EXISTS\` / \`NOT EXISTS\`**（挖空前**无**列名）
- \`WHERE 列名 _____ (SELECT * FROM ...)\` ➔ 填 **\`IN\` / \`NOT IN\`**（挖空前**有**列名）

##### 判定法则：
- 题干需求为“**查询满足 / 选了 / 存在某条件**的记录” ➔ 填 **\`EXISTS\`** 或 **\`IN\`**；
- 题干需求为“**查询不满足 / 没选 / 没参加某条件**的记录” ➔ 填 **\`NOT EXISTS\`** 或 **\`NOT IN\`**。

| 句式特征 | 挖空位置与上下文 | 满足/存在条件 | 不满足/不存在条件 |
| :--- | :--- | :---: | :---: |
| **紧挨 WHERE（前无列名）** | \`WHERE _____ (SELECT * FROM ...)\` | **\`EXISTS\`** | **\`NOT EXISTS\`** |
| **跟在列名后面（前有列名）** | \`WHERE 列名 _____ (SELECT * FROM ...)\` | **\`IN\`** | **\`NOT IN\`** |

> 💡 **秒杀口诀**：
> **看挖空前面有没有列名！紧挨 WHERE 填 EXISTS / NOT EXISTS，跟在列名后面 填 IN / NOT IN！**`
    },
    {
      id: 'join-types',
      title: '3. 四大多表连接方式（JOIN）全景剖析',
      tag: '连接查询',
      highlightedKeywords: [
        'INNER JOIN',
        'LEFT OUTER JOIN',
        'RIGHT OUTER JOIN',
        'FULL OUTER JOIN',
        'CROSS JOIN'
      ],
      content: `### SQL 多表连接对比表

| 连接方式 | 语法关键字 | 结果集保留规则 | 不匹配行填充 |
| :--- | :--- | :--- | :--- |
| **内连接** | \`[INNER] JOIN ... ON\` | 只返回两张表中**完全匹配 ON 条件**的行 | 不保留任何不匹配行 |
| **左外连接** | \`LEFT [OUTER] JOIN ... ON\` | 保留**左表的所有行**，右表匹配则显示，不匹配填 NULL | 右表各列填充 NULL |
| **右外连接** | \`RIGHT [OUTER] JOIN ... ON\`| 保留**右表的所有行**，左表匹配则显示，不匹配填 NULL | 左表各列填充 NULL |
| **全外连接** | \`FULL [OUTER] JOIN ... ON\` | **左右两张表的所有行全部保留** | 任意一侧不匹配均填 NULL |
| **交叉连接** | \`CROSS JOIN\` | 计算两表的**笛卡尔积**（左表 m 行 × 右表 n 行 = m × n 行） | 无须 ON 条件 |

#### 经典真题代码实例与考点分析
\`\`\`sql
-- 需求：查询所有学生的学号、姓名以及选课成绩，包含未选修任何课程的学生
SELECT S.Sno,
       S.Sname,
       C.Score
FROM Student S
LEFT OUTER JOIN SC C
    ON S.Sno = C.Sno;
\`\`\`

##### 【考点与逻辑拆解】
- **\`SELECT S.Sno, S.Sname, C.Score\`**：从连接后的组合结果集中选取学号、姓名以及对应的考试成绩列。
- **\`FROM Student S LEFT OUTER JOIN SC C\`**：以 \`Student\`（学生表）为主表进行左外连接。考题关键：题干明确要求“**包括那些一门课都没选的学生**”，如果用 \`INNER JOIN\` 则没有选课的学生会被自动过滤丢弃，**必须使用 LEFT JOIN** 才能完整保留所有学生！
- **\`ON S.Sno = C.Sno\`**：连接谓词条件，指定通过主外键关联的学号列进行数据行拼合。若某个学生在 SC 表中没有任何选课记录，则结果行中 \`Score\` 列自动填补 \`NULL\`。`
    },
    {
      id: 'ranking-functions',
      title: '4. 四大开窗排名函数对比与应用实战',
      tag: '考场必拿分',
      highlightedKeywords: [
        'ROW_NUMBER',
        'RANK',
        'DENSE_RANK',
        'NTILE',
        'OVER',
        'PARTITION BY'
      ],
      content: `### 排名函数实操对比表

在成绩排序、员工薪资排名的综合大题和填空题中，常考四个开窗排名函数：

\`\`\`sql
-- 需求：对全体考生的成绩进行四种方式的并排统计对比
SELECT Sname,
       Score,
       ROW_NUMBER() OVER (ORDER BY Score DESC) AS rn,   -- 连续序号不并列 (1, 2, 3, 4)
       RANK()       OVER (ORDER BY Score DESC) AS rk,   -- 并列跳号 (1, 2, 2, 4)
       DENSE_RANK() OVER (ORDER BY Score DESC) AS drk,  -- 并列紧凑不跳号 (1, 2, 2, 3)
       NTILE(3)     OVER (ORDER BY Score DESC) AS nt    -- 均匀划分为3个桶
FROM ExamResults;
\`\`\`

##### 【考点与逻辑拆解】
- **\`SELECT Sname, Score\`**：基础数据投影，输出学生姓名和得分。
- **\`ROW_NUMBER() OVER (ORDER BY Score DESC)\`**：行号生成函数。按照分数从高到低严格递增编号（1, 2, 3...），即使两人分数完全相同，也会强行分为前后两行不同编号，绝无并列。
- **\`RANK() OVER (ORDER BY Score DESC)\`**：等级排名函数。当遇到相同分数的记录时赋予相同的排名，但**会占用后续排名的名额，产生名次跳号**（如两个并列第2名后，下一位直接是第4名）。
- **\`DENSE_RANK() OVER (ORDER BY Score DESC)\`**：密集排名函数。遇到相同分数赋予相同排名，但**不跳过名次，排名保持紧凑递增**（如两个并列第2名后，下一位紧接着是第3名）。
- **\`NTILE(3) OVER (ORDER BY Score DESC)\`**：分桶函数。将所有排好序的数据按大致相等的数量分装到 3 个编号为 1、2、3 的桶中，常用于考分高/中/低三档分级。

假设 5 名学生的分数分别为：**95, 90, 90, 85, 80**，其生成结果对比如下：

| 姓名 | 分数 | ROW_NUMBER() | RANK() | DENSE_RANK() | NTILE(3) | 结果特征解析 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 张三 | 95 | **1** | **1** | **1** | **1** | 第一名 |
| 李四 | 90 | **2** | **2** | **2** | **1** | 并列第二名 |
| 王五 | 90 | **3** | **2** | **2** | **2** | 并列第二名 |
| 赵六 | 85 | **4** | **4 (跳跃!)**| **3 (紧凑!)**| **2** | **RANK跳过3直接跳到4；DENSE_RANK接续为3** |
| 钱七 | 80 | **5** | **5** | **4** | **3** | 最末名次 |

#### 做题口诀记忆：
- **ROW_NUMBER**：连号排到底，绝不并列；
- **RANK**：并列留空位（产生跳号）；
- **DENSE_RANK**：并列不留空位（紧凑连贯）。`
    },
    {
      id: 'top-with-ties',
      title: '5. TOP n 与并列排序查询（WITH TIES）核心考点',
      tag: '高频题眼必背',
      highlightedKeywords: [
        'TOP',
        'WITH TIES',
        'ORDER BY',
        '并列情况',
        '平局',
        '机考真题'
      ],
      content: `### 并列情况查询：TOP n WITH TIES 核心机制

在全国计算机等级考试三级数据库技术的机考真题与选择题中，极高频考查这样一道经典题目：
> **问：“查询销量最高/成绩第一，包含并列第一/并列情况是在哪句话上实现的？”**
> 
> **答：并列情况是通过 \`WITH TIES\` 这句话实现的！**

---

#### 一、核心语法拆解：\`TOP n WITH TIES\`
在 SQL Server 中，\`TOP\` 限制行数关键字后面可以添加一个非常关键的可选短语 **\`WITH TIES\`**：

\`\`\`sql
SELECT TOP n WITH TIES 字段列表
FROM 表名
WHERE 条件
ORDER BY 排序基准列 DESC;  -- 必须配合 ORDER BY 才能生效！
\`\`\`

1. **字面含义**：
   - **TIES**：在英语中是“平局、并列、不分胜负”的意思；
   - **WITH TIES**：字面含义即为**“带上并列项”、“包含平局记录”**。
2. **执行底层逻辑**：
   - **如果只写 \`TOP 1\`（不带 WITH TIES）**：
     数据库排完序后，**死死只取第一行**；哪怕第二名、第三名的总销量和第一名完全一样，也会被直接无情丢弃！
   - **如果加上 \`WITH TIES\`**：
     数据库截取前 n 行后，会主动去检查 **\`ORDER BY\` 排序的基准字段**（例如总销量）。如果后面几行算出来的数值和第 1 名并列相等，系统就会把这些**并列第一的记录全部一并返回**！

---

#### 二、极度关键的考点规则：\`WITH TIES 必须配合 ORDER BY\`
在 SQL Server 官方语法规范中：
- **铁律规定**：**使用 \`WITH TIES\` 时，必须显式指定 \`ORDER BY\` 子句！**
- **语法报错机制**：如果不写 \`ORDER BY\`，SQL Server 会直接报语法错误并拒绝执行！
- **本质原因**：因为数据库只有通过 \`ORDER BY\`，才知道拿哪一个排序基准字段去判断数据之间是否“并列”。如果没有 \`ORDER BY\`，数据顺序是物理无序的，根本不存在“前几名”和“并列”的概念。

---

#### 三、经典机考真题代码实例与考点分析
在真题大题中，“汽车销售数量并列第一”、“商品总营业额并列榜首”是最具代表性的考题：

\`\`\`sql
-- 需求：查询销售总数量最多的汽车型号及销售数量，包括并列第一的情况
SELECT TOP 1 WITH TIES
       汽车型号,
       SUM(销售数量) AS 总销量
FROM 汽车销售表
GROUP BY 汽车型号
ORDER BY 总销量 DESC;
\`\`\`

##### 【考点与逻辑拆解】
- **\`SELECT TOP 1 WITH TIES\`**：
  - \`TOP 1\` 指定初衷是提取排序后的第一条记录；
  - **\`WITH TIES\` 是本题的灵魂考点**：它告诉数据库引擎，若排在第 2 名、第 3 名的汽车总销量与第 1 名完全相等，系统必须把它们视为并列冠军全部返回，不能简单截断。
- **\`汽车型号, SUM(销售数量) AS 总销量\`**：
  - 投影要展示给用户的列。由于存在每辆车的多次销售记录，使用聚合函数 \`SUM(销售数量)\` 累加，并用 \`AS 总销量\` 赋予直观列名。
- **\`FROM 汽车销售表\`**：
  - 指定主查询的数据来源表。
- **\`GROUP BY 汽车型号\`**：
  - 因为计算的是“每种汽车型号”的总销量，凡是未在聚合函数中的列（\`汽车型号\`）都必须写在 \`GROUP BY\` 子句中。
- **\`ORDER BY 总销量 DESC\`**：
  - **此句是 \`WITH TIES\` 能够生效的必要前提！** 必须按照排序基准（总销量）降序（DESC）排列，把销量最高的车型排在最上方，这样数据库才能根据总销量数值判断是否存在并列行。`
    },
    {
      id: 'like-wildcards',
      title: '6. LIKE 谓词与四大通配符模式匹配（%、_、[ ]、[^ ]）',
      tag: '高频题眼必背',
      highlightedKeywords: [
        'LIKE',
        '通配符',
        '%',
        '_',
        '[]',
        '[^]',
        'ESCAPE',
        '模式匹配'
      ],
      content: `### 字符串模糊查询：LIKE 谓词与四大通配符

在 SQL 查询中，\`LIKE\` 谓词常用于在 \`WHERE\` 条件中对字符型数据进行模糊模式匹配。系统内置了四种核心通配符。

---

### 一、 四大通配符规则与示例速查表（核心考点）

| 通配符 | 匹配规则 | 典型考题示例 | 匹配结果特征说明 |
| :--- | :--- | :--- | :--- |
| **%** | **匹配 0 到多个任意字符（本题核心考点）** | \`'a%'\` | 匹配以 a 开头的任意长字符串（如 'a'、'ab'、'apple'） |
| **_** | **匹配且仅匹配单个任意字符** | \`'_a'\` | 匹配以任意单个字符开头且第二个字母为 a 的双字符串（如 'ba'、'ca'） |
| **[ ]** | **匹配指定范围或集合中的任意单个字符** | \`'[a-f]'\` | 匹配 a 到 f 之间的任意单个字母（如 'a'、'b'、...、'f'） |
| **[^ ]** | **不匹配指定范围或集合中的任意单个字符** | \`'[^0-9]'\` | 匹配任意单个非数字字符（等价于 \`[!0-9]\`，排除所有数字） |

---

### 二、 核心通配符深度解析与真题题眼

#### 1. 百分号 \`%\`（匹配 0 到多个任意字符）
- **匹配 0 个字符**：\`'王%'\` 不仅能匹配“王菲”、“王祖贤”，也能匹配单字姓名“王”（0个字符也成立！）。
- **任意位置包含**：\`'%数据%'\` 匹配任意包含“数据”两字的文本，无论位于开头、中间还是末尾。
- **特定结尾匹配**：\`'%计算机'\` 匹配以“计算机”结尾的任意长字符串。

#### 2. 下划线 \`_\`（匹配且仅匹配单个任意字符）
- **定长匹配**：若要查询**姓名只有两个汉字**且姓张的考生，应书写为 \`WHERE Sname LIKE '张_'\`。
- **特定位置单字符筛选**：
  - 倒数第三个字母为 'R'：\`'%R__'\`
  - 第二个字符为 'a' 且全长为两个字符：\`'_a'\`
  - 第二个字符为 'A' 且全长为三个字符：\`'_A_'\`

#### 3. 字符区间 \`[ ]\`（匹配指定范围或集合中的任意单个字符）
- **连续区间表示**：\`'[a-f]'\` 代表 a 到 f 之间的任意单个字母；\`'[0-9]'\` 代表 0 到 9 之间的任意单个数字。
- **离散集合表示**：\`'[abc]'\` 代表单字符必须是 a、b 或 c 中的某一个。
- **组合示例**：
  - \`'C[0-9][0-9]'\`：匹配课程编号以大写 C 开头、后跟两位数字的课程号（如 'C01'、'C99'）。

#### 4. 排除模式 \`[^ ]\`（不匹配指定范围或集合中的任意单个字符）
- **取反排除含义**：只要该位置出现的字符不在括号指定的范围/集合内，即算匹配成功。
- **示例**：
  - \`'[^0-9]'\`：匹配任意单个非数字字符。
  - \`'[^0-9]%'\`：匹配不以数字开头的任意长字符串。
  - \`'[^abc]'\`：匹配任意一个非 a、非 b 且非 c 的单字符。

---

### 三、 考场特殊陷阱：转义字符（ESCAPE 子句）

> **机考高频大坑**：若字段本身存储的数据就包含 \`%\` 或 \`_\`（例如商品打折标签 \`10%\`、变量名 \`user_id\`），直接写 \`LIKE '%10%'\` 会被系统当作通配符解析！

#### 语法规则与示例：
\`\`\`sql
-- 需求：查询折扣率真正为 10% 的商品记录
SELECT * 
FROM Products
WHERE Discount LIKE '%10/%%' ESCAPE '/';
\`\`\`

- **解释**：通过 \`ESCAPE '/'\` 声明正斜杠 \`/\` 为临时转义字符；紧随转义字符后面的 \`/%\` 就会被剥离通配符含义，作为普通的字面字符 \`%\` 进行精确匹配。

---

### 四、 经典代码实战示例与考点分析

\`\`\`sql
-- 需求：查询学生表中姓“李”、名字为两个汉字，且学号倒数第二位不是数字的所有学生
SELECT Sno, Sname
FROM Student
WHERE Sname LIKE '李_'
  AND Sno LIKE '%[^0-9]_';
\`\`\`

##### 【考点与逻辑拆解】
- **\`SELECT Sno, Sname\`**：选取要呈现的字段列（学号与学生姓名）。
- **\`FROM Student\`**：指定主查询目标表。
- **\`WHERE Sname LIKE '李_'\`**：
  - \`LIKE\` 引导模式匹配；
  - \`'李_'\`：以“李”开头，紧跟一个下划线 \`_\`，严格占位 1 个字符，精确筛选出两字姓李的学生。
- **\`AND Sno LIKE '%[^0-9]_'\`**：
  - \`%\`：匹配前面任意长度的前缀字符串；
  - \`[^0-9]\`：核心考点通配符！匹配任意单个非数字字符（位于倒数第二位）；
  - \`_\`：末尾单独占位的单字符。整体实现对倒数第二位字符属性的精准筛选。`
    },
    {
      id: 'security-login-user-role',
      title: '7. 数据库安全主体与角色管理（CREATE/DROP LOGIN、USER、ROLE及权限控制）',
      tag: '高频题眼必背',
      highlightedKeywords: [
        'LOGIN',
        'USER',
        'ROLE',
        'DROP LOGIN',
        'DROP USER',
        'DROP ROLE',
        'CREATE LOGIN',
        'CREATE USER',
        'CREATE ROLE',
        'db_owner',
        'db_accessadmin',
        'db_backupoperator',
        'db_datareader',
        'db_datawriter',
        'db_ddladmin',
        'db_denydatareader',
        'sp_addsrvrolemember',
        'bulkadmin',
        'dbcreator',
        'diskadmin',
        'processadmin',
        'securityadmin',
        'serveradmin',
        'setupadmin',
        'sysadmin',
        '语句级权限',
        '对象级权限',
        'GRANT',
        'REVOKE',
        'DENY',
        'WITH GRANT OPTION',
        'CASCADE'
      ],
      content: `### 数据库安全主体与权限控制核心考点

在关系数据库管理系统（如 SQL Server）中，安全控制机制通过**身份验证（Authentication）**与**权限授权（Authorization）**两级防护来保证数据安全性。

---

### 一、 核心秒杀口诀（看题干字眼直接秒填！）

> **考场绝招**：机考填空题中只要出现删除或创建安全对象，对照中文关键词直接秒填英文大写：
> - **题目说“删除登录名” ➔ 填 \`LOGIN\`（\`DROP LOGIN xxx;\`）**
> - **题目说“删除用户” ➔ 填 \`USER\`（\`DROP USER xxx;\`）**
> - **题目说“删除角色” ➔ 填 \`ROLE\`（\`DROP ROLE xxx;\`）**
> - **题目说“创建登录名” ➔ 填 \`LOGIN\`（\`CREATE LOGIN xxx WITH PASSWORD = '...';\`）**
> - **题目说“创建用户” ➔ 填 \`USER\`（\`CREATE USER xxx FOR LOGIN xxx;\`）**
> - **题目说“创建角色” ➔ 填 \`ROLE\`（\`CREATE ROLE xxx;\`）**

---

### 二、 三大安全主体属性与层级结构对比表

| 安全主体类型 | 英文关键字 | 所属作用域 | 核心职责与考点 | 创建 / 删除语法 |
| :--- | :--- | :--- | :--- | :--- |
| **登录名** | **LOGIN** | **服务器实例级** (Server Level) | 用于连接数据库服务器，验证身份（密码或 Windows 认证），记录在 \`master\` 库中 | 创建：\`CREATE LOGIN L1 WITH PASSWORD = '...';\` ；删除：\`DROP LOGIN L1;\` |
| **数据库用户** | **USER** | **特定数据库级** (Database Level) | 依附于具体业务库，由服务器登录名映射而来，决定对库内表/视图的访问权限 | 创建：\`CREATE USER U1 FOR LOGIN L1;\` ；删除：\`DROP USER U1;\` |
| **数据库角色** | **ROLE** | **特定数据库级** (Database Level) | 权限集合的逻辑容器，便于权限的批量集中授予与回收 | 创建：\`CREATE ROLE R1;\` ；删除：\`DROP ROLE R1;\` |

---

### 三、 SQL Server 高频预定义固定数据库角色（必考口诀矩阵）

在具体数据库内部，系统预先创建了一组**固定数据库角色（Predefined Database Roles）**，考题经常考查角色的名称与其对应的职权：

| 角色名称 | 官方核心权限（题眼原话） | 核心权限口诀与范围 |
| :--- | :--- | :--- |
| **\`db_owner\`** | **具有创建数据库对象的权限**，拥有数据库内的全部权限 | 拥有当前数据库中的**所有配置、维护与操作权限**，是该库最高管理员 |
| **\`db_datawriter\`** | **具有插入、删除和更新数据库中所有用户数据的权限** | 可以在所有用户表中**新增、修改和删除数据**（INSERT / UPDATE / DELETE） |
| **\`db_datareader\`** | **具有从所有用户表中读取所有数据的权限** | 具有当前数据库所有用户表和视图的 **SELECT 检索权限**，严禁改动数据 |
| **\`db_accessadmin\`** | **具有添加和删除数据库用户的权限** | 管理 Windows 组/登录名和 SQL Server 登录名的数据库访问权 |
| **\`db_backupoperator\`** | **具有备份和恢复数据库的权限** | 允许执行 BACKUP 和 RESTORE 语句备份或还原数据库 |
| **\`db_ddladmin\`** | **可以执行任何 DDL 语句（CREATE / ALTER / DROP）** | 添加、修改或除去数据库对象（表、索引、视图等），无授权权限 |
| **\`db_denydatareader\`** | **明确拒绝读取任何用户数据（黑名单）** | **禁止**读取任何用户表数据（DENY 拒绝优先于任何允许） |

> 🎯 **考场真题答疑速记**：
> - **“具有插入、删除和更新数据库中所有用户数据的权限”** ➔ 选 **\`db_datawriter\`**
> - **“具有添加和删除数据库用户的权限”** ➔ 选 **\`db_accessadmin\`**
> - **“具有备份和恢复数据库的权限”** ➔ 选 **\`db_backupoperator\`**
> - **“具有创建数据库对象的权限”（或拥有全部权限）** ➔ 选 **\`db_owner\`**

> 💡 **成员添加操作语法（考场填空）**：
> - **标准 T-SQL 语法**：\`ALTER ROLE 角色名 ADD MEMBER 用户名;\`（如 \`ALTER ROLE db_datareader ADD MEMBER U1;\`）
> - **系统存储过程语法**：\`EXEC sp_addrolemember '角色名', '用户名';\`（如 \`EXEC sp_addrolemember 'db_owner', 'AdminUser';\`）

---

### 四、 固定服务器角色及权限（sp_addsrvrolemember 核心考点）

【解析】\`EXEC sp_addsrvrolemember\` 是登录账户角色，\`sp_addsrvrolemember\` 是定义好的存储过程，其作用是为登录账户赋角色权限。数据库主要的角色及权限如下表所示。

| 角色 | 权限 |
| :--- | :--- |
| **bulkadmin** | 执行 BULK INSERT 语句 |
| **dbcreator** | 创建、修改、删除和还原数据库 |
| **diskadmin** | 管理磁盘文件 |
| **processadmin** | 管理在 SQL Server 实例中运行的进程 |
| **securityadmin** | 管理服务器登录账户 |
| **serveradmin** | 配置服务器范围的设置 |
| **setupadmin** | 添加和删除链接服务器 |
| **sysadmin** | 在 SQL Server 中进行任何活动，该角色的权限跨越所有其它固定服务器角色 |

---

### 五、 SQL Server 权限两大分类：语句级权限 vs 对象级权限（必考题眼）

在 SQL Server 的授权机制中，权限被严格划分为两类：

#### 1. 语句级权限（数据库级权限）
- **特点**：授予用户**执行某种特定 DDL 操作**的权力。此时操作的目标根本还不存在（表还没建出来，自然没有具体的对象实体可以挂载）。
- **典型权限**：\`CREATE TABLE\`、\`CREATE VIEW\`、\`CREATE PROCEDURE\`、\`BACKUP DATABASE\`、\`BACKUP LOG\` 等。
- **语法规范**：**绝对不带 \`ON 对象\`**，因为权限直接作用于当前整个数据库上下文。

\`\`\`sql
-- 正确写法（直接 TO 用户）
GRANT CREATE TABLE TO U1;
\`\`\`

#### 2. 对象级权限
- **特点**：授予用户对**已经存在的某个具体数据对象**（表、视图、存储过程等）进行操作的权力。
- **典型权限**：\`SELECT\`、\`INSERT\`、\`UPDATE\`、\`DELETE\`、\`EXECUTE\` 等。
- **语法规范**：**必须带 \`ON 对象名\`**，指定给哪张具体的表、视图或存储过程。

\`\`\`sql
-- 正确写法（必须指定 ON 具体对象）
GRANT SELECT, UPDATE ON 员工表 TO U1;
\`\`\`

#### 考场命门辨析对比表：
| 权限分类 | 作用目标 | 是否有具体挂载实体 | 语法格式 | 典型权限命令 | 考场易错陷阱 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **语句级权限**<br>*(数据库级)* | 整个数据库 | **否**（目标对象尚不存在，如建表前还没这张表） | \`GRANT 权限 TO 主体;\`<br>*(**绝对不带 ON**)* | \`CREATE TABLE\`、\`CREATE VIEW\`、\`CREATE PROCEDURE\`、\`BACKUP DATABASE\` | 误写成 \`GRANT CREATE TABLE ON 表名 TO U1;\`（此时根本没表，带 ON 语法报错！） |
| **对象级权限** | 具体实体对象 | **是**（已存在的基表、视图、存储过程） | \`GRANT 权限 ON 对象名 TO 主体;\`<br>*(**必须指定 ON**)* | \`SELECT\`、\`INSERT\`、\`UPDATE\`、\`DELETE\`、\`EXECUTE\` | 漏写 \`ON 对象名\`；对存储过程授权时使用 \`EXECUTE ON 存储过程名 TO 用户\` |

---

### 六、 权限控制三命令：GRANT、REVOKE、DENY

1. **GRANT（授权）**：
   - 语句级权限：\`GRANT 语句权限 TO 主体;\`
   - 对象级权限：\`GRANT 动作列表 ON 对象名 TO 主体 [WITH GRANT OPTION];\`
   - **\`WITH GRANT OPTION\` 考点**：获得该权限的主体，还可以将该权限**再次转授（Grant）给其他用户或角色**。
2. **REVOKE（收回）**：
   - 语句级权限：\`REVOKE 语句权限 FROM 主体;\`
   - 对象级权限：\`REVOKE 动作列表 ON 对象名 FROM 主体 [CASCADE];\`
   - **\`CASCADE\` 级联收回考点**：如果用户 A 曾经利用 \`WITH GRANT OPTION\` 把权限转授给了用户 B 和 C，当收回 A 的权限时若带 \`CASCADE\`，B 和 C 的权限也将被**自动级联连带收回**！
3. **DENY（明确拒绝）**：
   - 基础语法：\`DENY 权限列表 [ON 对象名] TO 主体;\`
   - **拒绝优先原则**：即使用户所属的角色拥有该权限，只要对该用户个人显式设置了 \`DENY\`，该用户也**绝对无法执行**该操作（DENY 优先级高于 GRANT）。

---

### 七、 经典真题代码实战与考点分析

\`\`\`sql
-- 需求：清理离职人员旧主体，为新入职人员创建账号，配置建表(语句级)与表查询(对象级)权限

-- 1. 删除原有的旧登录名、旧用户与旧角色
DROP LOGIN OldAuditorLogin;
DROP USER OldAuditorUser;
DROP ROLE TempAuditRole;

-- 2. 创建新登录名、映射数据库用户与新角色
CREATE LOGIN NewAuditor WITH PASSWORD = 'AuditPassword#2026';
CREATE USER NewAuditorUser FOR LOGIN NewAuditor;
CREATE ROLE FixedAuditRole;

-- 3. 将新用户加入角色
ALTER ROLE FixedAuditRole ADD MEMBER NewAuditorUser;

-- 4. 授予语句级权限：允许创建表（不带 ON 对象）
GRANT CREATE TABLE TO FixedAuditRole;

-- 5. 授予对象级权限：允许查询财务表（必须带 ON 对象）
GRANT SELECT ON FinancialReport TO FixedAuditRole;
\`\`\`

##### 【考点与逻辑拆解】
- **\`DROP LOGIN OldAuditorLogin;\`**：
  - 考题题干提示“删除**登录名**”，标准 DDL 必须填 **\`LOGIN\`**，作用于整个 SQL Server 实例。
- **\`DROP USER OldAuditorUser;\`**：
  - 考题题干提示“删除**用户**”，标准 DDL 必须填 **\`USER\`**，从当前数据库上下文脱钩。
- **\`DROP ROLE TempAuditRole;\`**：
  - 考题题干提示“删除**角色**”，标准 DDL 必须填 **\`ROLE\`**，删除权限分组对象。
- **\`CREATE LOGIN ... WITH PASSWORD\`**：
  - 创建服务器级身份，需要使用 \`WITH PASSWORD\` 指定强密码。
- **\`CREATE USER ... FOR LOGIN ...\`**：
  - 在当前数据库将外部登录名接入，填空重点常考 **\`USER\`** 或 **\`FOR LOGIN\`**。
- **\`ALTER ROLE ... ADD MEMBER ...\`**：
  - 将数据库用户指派为角色的成员，使得用户自动继承该角色的所有授权。
- **\`GRANT CREATE TABLE TO FixedAuditRole;\`**：
  - **语句级权限**：授予创建表的权力，此时表尚未被创建，**绝对不加 ON 子句**。
- **\`GRANT SELECT ON FinancialReport TO FixedAuditRole;\`**：
  - **对象级权限**：授予对具体已存在表的查询权限，必须遵循 \`GRANT 动作 ON 资源 TO 目标\` 结构。`
    },
    {
      id: "table-valued-functions",
      title: "8. 内联表值函数（带参视图） vs 多语句表值函数 vs 标量函数全景对比与实战",
      tag: "函数与可编程对象",
      highlightedKeywords: [
        "内联表值函数",
        "多语句表值函数",
        "标量函数",
        "RETURNS TABLE",
        "可以传参的视图",
        "RETURN SELECT",
        "BEGIN...END",
        "@table 变量",
        "INSERT INTO"
      ],
      content: `### 内联表值函数（Inline Table-valued Function）与表值函数全景精讲

> 🎯 **核心定义**：
> **“内联表值函数 ( Inline Table-valued Function ) ” 其实就是“可以传参的视图”**，只要看一次代码示例，就能彻底搞懂它的所有特性。

---

### 一、 先看真实代码长什么样

#### 1. 内联表值函数（极简，只有一条 RETURN SELECT）
\`\`\`sql
CREATE FUNCTION f_get_dept_emp(@dept_id int)
RETURNS TABLE -- 1. 返回的是 TABLE，但注意：这里没有 @table 变量！
AS
RETURN (
  -- 2. 只有一条 SELECT 语句，直接作为表返回，连 BEGIN...END 都不需要！
  SELECT emp_id, emp_name, salary
  FROM employees
  WHERE department_id = @dept_id
);
\`\`\`

#### 2. 对比：多语句表值函数（复杂，有 @table 变量和 INSERT）
\`\`\`sql
CREATE FUNCTION f_complex(@dept_id int)
RETURNS @t TABLE (emp_id int, emp_name varchar(20)) -- 这里有返回变量 @t !
AS
BEGIN
  -- 这里才需要通过 INSERT 往 @t 变量里填充数据
  INSERT INTO @t
  SELECT emp_id, emp_name FROM employees WHERE department_id = @dept_id;

  RETURN;
END;
\`\`\`

---

### 二、 三大函数与视图核心特征横向对比表（考场必背）

| 对比维度 | **内联表值函数 (ITVF)** | **多语句表值函数 (MSTVF)** | **用户自定义标量函数** | **传统视图 (VIEW)** |
| :--- | :--- | :--- | :--- | :--- |
| **本质定位** | **“可以传参的视图”** | 存储过程式的复杂表生成逻辑 | 计算并返回单个标量数值 | 保存的静态 SELECT 查询语句 |
| **能否接收形参** | **能**（接收多个输入参数） | **能**（接收多个输入参数） | **能**（接收多个输入参数） | **不能**（视图严禁定义参数） |
| **头部返回声明** | **\`RETURNS TABLE\`**<br>*(无变量名、无字段清单)* | **\`RETURNS @变量名 TABLE (列名 类型...)\`**<br>*(必须定义表变量和结构)* | **\`RETURNS 具体类型\`**<br>*(如 \`RETURNS int\`)* | 无 RETURNS（视图不是函数） |
| **是否需要 \`BEGIN...END\`** | **严禁使用！**（无 \`BEGIN...END\`） | **必须使用** \`BEGIN...END\` | **必须使用** \`BEGIN...END\` | 无 |
| **函数体逻辑** | **只有一条 \`RETURN (SELECT ...);\`** | 多条 T-SQL 语句，逐步构建数据 | 多条计算赋值语句 | 单个 SELECT 查询 |
| **数据装载方式** | 直接透传 SELECT 结果集 | 必须显式 **\`INSERT INTO @变量名\`** | \`SET @变量 = ...\` 赋值计算 | 无中间变量 |
| **尾部返回语法** | \`RETURN (SELECT ...)\` | 单独写 **\`RETURN;\`**（不带值） | **\`RETURN @标量变量;\`** | 无 |
| **调用方式** | **放在 \`FROM\` 子句中**<br>\`SELECT * FROM f_get_dept_emp(10);\` | **放在 \`FROM\` 子句中**<br>\`SELECT * FROM f_complex(10);\` | 放在表达式中，**必须加 \`dbo.\`**<br>\`SELECT dbo.fn_calc(10);\` | 放在 \`FROM\` 子句中<br>\`SELECT * FROM v_emp;\` |
| **性能特征** | **极高**（直接内联展开并入查询优化） | 较低（在 tempdb 中建表变量） | 逐行调用容易造成 RBAR 瓶颈 | 与内联类似，直接展开 |

---

### 三、 考场辨析与填空题眼四大命门

1. **为什么称其为“可以传参的视图”？**
   - 视图（VIEW）的死穴是**无法接受参数**进行动态条件过滤；
   - 内联表值函数不仅可以传参，而且由于它只有一条包含在 \`RETURN()\` 内的 SELECT 语句，SQL Server 内部会像对待普通视图一样把该语句**直接内联展开（Inline Expansion）**合并进外层查询优化器，执行效率极高！

2. **内联表值函数的“三无”特征（极高频考点）**：
   - **无返回变量名**：只写 \`RETURNS TABLE\`，后面绝对没有 \`@t\`。
   - **无表结构定义**：绝不在 RETURNS 后写 \`(emp_id int, ...)\`，列名和列类型由内部 SELECT 语句自动推导确定。
   - **无 \`BEGIN ... END\`**：语句块只有单条 \`RETURN (SELECT ...)\`，写了 \`BEGIN ... END\` 直接判语法错！

3. **多语句表值函数识别标志**：
   - 只要看到 \`RETURNS @t TABLE (列定义)\`，或者内部有 \`INSERT INTO @t\`、\`BEGIN ... END\`，就**绝不是**内联表值函数，而是**多语句表值函数**。

4. **调用语法考点**：
   - 表值函数（无论是内联还是多语句）返回的是二维表格，**必须且只能出现在查询语句的 \`FROM\` 子句中**（可以像普通数据表一样进行 \`JOIN\` 连接或 \`WHERE\` 过滤），绝不能像标量函数那样写在 \`SET @x = 函数名()\` 或单独的 \`SELECT 函数名()\` 列项中！`
    },
    {
      id: "trigger-special-tables",
      title: "9. 触发器的两张特殊临时表（DELETED 表与 INSERTED 表）考点精讲",
      tag: "触发器与事务日志",
      highlightedKeywords: [
        "触发器",
        "DELETED 表",
        "INSERTED 表",
        "存放新插入的数据行",
        "存放刚刚被删除的旧数据行",
        "存放修改前（更新前）的旧值",
        "存放修改后（更新后）的新值",
        "UPDATE（修改）（本题考点）",
        "AFTER",
        "INSTEAD OF",
        "ROLLBACK TRANSACTION"
      ],
      content: `### 触发器的两张特殊临时表（DELETED 表与 INSERTED 表）

在 SQL Server 触发器执行时，系统会在内存中自动创建并管理两张特殊的逻辑临时表：**DELETED 表** 与 **INSERTED 表**。这两张表的结构与触发器所作用的宿主基表结构完全相同，是三级考试中代码填空与理论选择的核心题眼！

---

### 一、 操作类型与两张表内容对照表（考场原题对照）

| 操作类型 | DELETED 表中的内容 | INSERTED 表中的内容 |
| :--- | :--- | :--- |
| **INSERT（插入）** | **（无 / 空）** | **存放新插入的数据行** |
| **DELETE（删除）** | **存放刚刚被删除的旧数据行** | **（无 / 空）** |
| **UPDATE（修改）（本题考点）** | **存放修改前（更新前）的旧值** | **存放修改后（更新后）的新值** |

> 💡 **核心原理解析（为什么 UPDATE 两张表都有？）**：
> SQL Server 的内部机制中，**不存在原地的“修改”操作**。
> 一次 \`UPDATE\` 操作在物理与事务日志底层实质上是两步动作组合：
> 1. **先 DELETE 旧行**：被修改前的原行数据被转移存入 **DELETED 表**；
> 2. **再 INSERT 新行**：被修改后的更新值作为新数据行存入 **INSERTED 表**。
> 因此，只有在 \`UPDATE\` 操作时，两张表会同时包含数据行！

---

### 二、 经典考题代码范例：利用两表比对新旧值（只升不降校验）

\`\`\`sql
-- 需求：当修改员工工资时，如果新工资低于原有工资，则撤销操作并报错
CREATE TRIGGER tr_check_salary
ON Employee
AFTER UPDATE
AS
BEGIN
  -- 检查是否存在更新后工资低于更新前工资的记录
  IF EXISTS (
    SELECT 1
    FROM INSERTED i
    JOIN DELETED d ON i.EmpID = d.EmpID
    WHERE i.Salary < d.Salary -- 比较：i中是新值，d中是旧值
  )
  BEGIN
    RAISERROR ('员工工资只能增加不能降低！', 16, 1);
    ROLLBACK TRANSACTION; -- 撤销修改事务
  END;
END;
\`\`\`

---

### 三、 考场辨析与填空题眼直通口诀

1. **题眼原话对应**：
   - “当向表中执行 UPDATE 操作时，触发器的 DELETED 表中存放的是” ➔ 必填【**修改前（更新前）的旧值**】；
   - “当向表中执行 UPDATE 操作时，触发器的 INSERTED 表中存放的是” ➔ 必填【**修改后（更新后）的新值**】；
   - “INSERT 操作引发触发器时，DELETED 表中” ➔ 必填【**（无 / 空）**】；
   - “DELETE 操作引发触发器时，INSERTED 表中” ➔ 必填【**（无 / 空）**】。

2. **秒杀记忆口诀**：
   - **D 是旧（Delete/Old），I 是新（Insert/New）**；
   - **单删留旧 D，单插存新 I；更新两相见，旧在 D 来新在 I！**`
    },
    {
      id: 'select-into-new-table',
      title: '10. 动态创建新表并导入数据（SELECT ... INTO 语句）',
      tag: '高频题眼必背',
      highlightedKeywords: [
        'SELECT INTO',
        '创建新表',
        'NewTable',
        '目标表不能事先存在',
        'INSERT INTO SELECT',
        '复制表结构'
      ],
      content: `### 动态创建新表并导入数据：SELECT ... INTO 极简速记

---

#### 一、 核心语法与作用
\`\`\`sql
SELECT 列1, 列2 INTO NewTable FROM 表1;
\`\`\`
- **核心功能**：根据查询结果的结构与数据，**自动创建一张新表（NewTable）**，并将检索结果直接插入该新表中。

---

#### 二、 三大核心考点与题眼（秒杀重点）

1. **目标表状态（最常考陷阱）**：
   - 目标表 \`NewTable\` **在执行该语句之前必须不存在**！
   - 系统会在执行时自动创建该表；若数据库中已存在同名表，执行将直接**报错**。
2. **复制内容范围**：
   - 会复制：**列名、数据类型和数据行**。
   - **不复制**：原表的**主键、外键约束、索引、触发器**（新表需手动补建）。
3. **只克隆表结构（不拷数据技巧）**：
   \`\`\`sql
   -- 追加永假条件（如 WHERE 1=0），即可只创建结构空表：
   SELECT * INTO NewTable FROM 表1 WHERE 1 = 0;
   \`\`\`

---

#### 三、 必考对比：SELECT INTO vs INSERT INTO SELECT

| 语法形态 | 目标表事先是否存在 | 核心场景 |
| :--- | :--- | :--- |
| **\`SELECT ... INTO 新表 FROM 表1\`** | **必须事先不存在**（系统自动新建表） | 数据备份、快速复制表、创建临时表 |
| **\`INSERT INTO 已有表 SELECT ... FROM 表1\`** | **必须事先已经存在**（仅追加新数据） | 向已建好的业务表中批量导入数据 |`
    },
    {
      id: 'select-basic-syntax',
      title: '11. SELECT 基本语法格式与子句严格书写顺序（必背大纲）',
      tag: '核心语法骨架',
      highlightedKeywords: [
        'SELECT',
        'FROM',
        'WHERE',
        'GROUP BY',
        'ORDER BY',
        '基本语法格式',
        '子句书写顺序'
      ],
      content: `### SELECT 基本语法格式与核心子句顺序极简速记

---

#### 一、 SELECT 标准书写顺序（绝对不能颠倒）

\`\`\`sql
SELECT 查询内容
FROM 表名
WHERE 条件表达式
GROUP BY 待分组的列名
ORDER BY 待排序的列名
\`\`\`

---

#### 二、 各大子句核心职能速查表

| 子句关键字 | 核心功能与参数说明 | 考场易错规则 |
| :--- | :--- | :--- |
| **\`SELECT\`** | 指定要检索输出的列、表达式或计算值（**查询内容**） | 紧跟列名清单或 \`*\`；可配合 \`DISTINCT\` 去重 |
| **\`FROM\`** | 指定数据来源的**表名**或视图名 | 声明数据来源，可关联多表（JOIN） |
| **\`WHERE\`** | 行级数据初筛的**条件表达式** | **必须写在 GROUP BY 之前**！严禁在此处直接使用聚合函数（如 SUM/AVG） |
| **\`GROUP BY\`** | 针对检索结果按**待分组的列名**进行聚合归类 | 凡未在聚合函数中的输出列，必须写在 GROUP BY 后面 |
| **\`ORDER BY\`** | 针对最终结果集按**待排序的列名**进行排序 | **永远位于查询语句最后**；默认升序 \`ASC\`，降序写 \`DESC\` |

---

#### 三、 考场速记口诀
> 💡 **“选自哪里分个序”（SELECT ➔ FROM ➔ WHERE ➔ GROUP BY ➔ ORDER BY）**
> 1. 先 **选（SELECT）** 查什么；
> 2. 再 **自（FROM）** 哪张表；
> 3. 后 **哪（WHERE）** 些行符合；
> 4. 再 **分（GROUP BY）** 组统计；
> 5. 最终 **序（ORDER BY）** 列输出！`
    }
  ]
};
