import { Topic } from '../../types';

export const fillInBlanksTopic: Topic = {
  id: 'fill-in-the-blanks',
  title: '【专区】填空题高频考点与核心模板',
  badge: '必考专区 (30分)',
  icon: 'Edit3',
  description: '全网最全三级数据库30分填空专项：代码补全标准模板、核心术语精准填空、必背填空词库',
  subTopics: [
    {
      id: 'sql-ddl-fill-in',
      title: '1. SQL DDL与完整性约束填空模板',
      tag: '代码填空必背',
      highlightedKeywords: [
        'PRIMARY KEY',
        'FOREIGN KEY',
        'REFERENCES',
        'CHECK',
        'DEFAULT',
        'UNIQUE',
        'NOT NULL',
        'CONSTRAINT',
        'DROP FUNCTION',
        'DROP VIEW',
        'DROP TRIGGER',
        'DROP PROCEDURE',
        'DROP INDEX',
        'CREATE FUNCTION',
        'CREATE VIEW'
      ],
      content: `### SQL DDL 完整性约束填空核心语法

机考填空题中最常出现补全建表约束的代码，请牢记以下固定填空词：

#### 1. 约束类型填空速查
- **主键约束**：\`PRIMARY KEY (列名)\` 或 列定义后直接写 \`PRIMARY KEY\`。如果是复合主键，**必须**写在所有列定义的最后：\`PRIMARY KEY (列1, 列2)\`。
- **外键约束**：\`FOREIGN KEY (外键列) REFERENCES 主表名 (被引用主键列)\`。
- **级联操作填空**：
  - 级联删除：\`ON DELETE CASCADE\`
  - 级联更新：\`ON UPDATE CASCADE\`
  - 设为空值：\`ON DELETE SET NULL\`
  - 拒绝删除（默认）：\`ON DELETE NO ACTION\`
- **检查约束**：\`CHECK (条件表达式)\`，例如：\`CHECK (Gender IN ('男', '女'))\` 或 \`CHECK (Score BETWEEN 0 AND 100)\`。
- **默认值约束**：\`DEFAULT 默认值\`，例如：\`DEFAULT 0\` 或 \`DEFAULT '未分配'\`。
- **唯一性约束**：\`UNIQUE\`。
- **非空约束**：\`NOT NULL\`（不在官方教材五种约束里）。

#### 2. 标准建表填空题真题模拟与【逐句详解】
\`\`\`sql
-- 需求：创建订单表 Orders，包含主键、外键级联删除、默认值与检查约束
CREATE TABLE Orders (                                                -- 第1句：定义创建名为 Orders 的新数据表
    OrderID CHAR(10) NOT NULL,                                       -- 第2句：订单编号定长字符10位，且强制不允许为空(NOT NULL)
    CustomerID CHAR(8) NOT NULL,                                     -- 第3句：客户编号定长字符8位，非空，用于关联客户表
    OrderDate DATETIME DEFAULT GETDATE(),                            -- 第4句：下单时间日期类型，默认值填空点 DEFAULT 设为当前系统时间 GETDATE()
    TotalAmount DECIMAL(10, 2) CHECK (TotalAmount >= 0),             -- 第5句：订单总金额10位(2位小数)，检查约束 CHECK 限制金额必须大于等于0
    -- [填空点1] 表级定义主键约束
    CONSTRAINT PK_Orders PRIMARY KEY (OrderID),                      -- 第6句：显式命名主键约束为 PK_Orders，指定 OrderID 为主键码
    -- [填空点2] 表级定义外键约束并设置级联删除
    CONSTRAINT FK_Orders_Cust FOREIGN KEY (CustomerID)               -- 第7句：显式命名外键约束，指定 CustomerID 为本表的外键列
        REFERENCES Customer (CustomerID)                             -- 第8句：指定外键参照的主表为 Customer，被引用列为其主键 CustomerID
        ON DELETE CASCADE                                            -- 第9句：【高频填空】级联删除！当主表客户被删除时，其所有订单自动同步连带删除
);
\`\`\`

##### 【逐句代码详解】
- **\`CREATE TABLE Orders (...)\`**：DDL 基础建表语句，定义关系模式表名为 \`Orders\`。
- **\`OrderID CHAR(10) NOT NULL\`**：列级定义订单编号。定长字符类型适合长度固定的编号，\`NOT NULL\` 声明非空属性。
- **\`CustomerID CHAR(8) NOT NULL\`**：客户编号列，后续将作为外键与客户信息表关联。
- **\`OrderDate DATETIME DEFAULT GETDATE()\`**：日期时间字段。\`DEFAULT GETDATE()\` 利用系统函数在用户未显式录入下单时间时自动捕获录入时的服务器当前时间。
- **\`TotalAmount DECIMAL(10, 2) CHECK (TotalAmount >= 0)\`**：数值型字段。\n  - \`CHECK (条件)\` 用于实现用户自定义完整性，防止业务录入负数金额。
- **\`CONSTRAINT PK_Orders PRIMARY KEY (OrderID)\`**：表级主键约束。使用 \`CONSTRAINT 约束名 PRIMARY KEY (列名)\` 可以规范主键索引命名，强制实体完整性，系统自动在此列建立唯一聚集索引。
- **\`CONSTRAINT FK_Orders_Cust FOREIGN KEY (CustomerID) REFERENCES Customer (CustomerID) ON DELETE CASCADE\`**：表级外键完整性约束。\n  - \`FOREIGN KEY\`：指定从表（Orders）的外码字段；\n  - \`REFERENCES\`：指定主表及其被参照主码；\n  - **\`ON DELETE CASCADE\`**：级联删除核心子句。如果主表删除客户记录，从表中该客户产生的所有历史订单自动被连带级联删除，不会抛出外键阻断异常。

#### 3. 约束修改（ALTER TABLE）填空点
- 添加主键：\`ALTER TABLE 表名 ADD CONSTRAINT 约束名 PRIMARY KEY (列名);\`
- 添加外键：\`ALTER TABLE 表名 ADD CONSTRAINT 约束名 FOREIGN KEY (外键列) REFERENCES 参照表 (列名);\`
- 添加检查约束：\`ALTER TABLE 表名 ADD CONSTRAINT 约束名 CHECK (条件);\`
- 删除约束：\`ALTER TABLE 表名 DROP CONSTRAINT 约束名;\`

#### 4. 高频必考定式：“删除/创建......使用 ______ 语句”专项速查

在三级考试单选与填空题中，“删除/创建某类数据库对象使用什么语句”属于纯送分定式考点，格式极其固定规范：

- **“删除......使用 ______ 语句”**：
  - **删函数** ──> 填 **\`DROP FUNCTION\`**
  - **删视图** ──> 填 **\`DROP VIEW\`**
  - **删触发器** ──> 填 **\`DROP TRIGGER\`**
  - **删存储过程** ──> 填 **\`DROP PROCEDURE\`**（或 **\`DROP PROC\`**）
  - **删索引** ──> 填 **\`DROP INDEX\`**
  - **删表** ──> 填 **\`DROP TABLE\`**

- **“创建......使用 ______ 语句” 同理**：
  - **建函数** ──> 填 **\`CREATE FUNCTION\`**
  - **建视图** ──> 填 **\`CREATE VIEW\`**
  - **建触发器** ──> 填 **\`CREATE TRIGGER\`**
  - **建存储过程** ──> 填 **\`CREATE PROCEDURE\`**（或 **\`CREATE PROC\`**）
  - **建索引** ──> 填 **\`CREATE INDEX\`**
  - **建表** ──> 填 **\`CREATE TABLE\`**`
    },
    {
      id: 'sql-index-fill-in',
      title: '2. 索引定义语句填空标准模板',
      tag: '代码填空必背',
      highlightedKeywords: [
        'CREATE INDEX',
        'CLUSTERED',
        'NONCLUSTERED',
        'UNIQUE',
        '唯一索引',
        '辅索引',
        '稠密索引',
        'DROP INDEX'
      ],
      content: `### 索引创建与管理语法填空及核心考点解析

填空题经常要求在指定表和列上创建**聚集索引**、**非聚集索引**、**唯一索引**，或在单选题和概念填空中考查**唯一索引与辅索引（辅助索引）**的底层特性与做题铁律。

#### 1. 标准 SQL 语法模板与【逐句详解】
\`\`\`sql
CREATE [UNIQUE] [CLUSTERED | NONCLUSTERED]           -- 第1句：定义创建索引动作，指定是否唯一(UNIQUE)，指定为聚集(CLUSTERED)还是非聚集(NONCLUSTERED)
INDEX 索引名称                                       -- 第2句：为该索引指定符合命名规范的物理对象名称
ON 表名 (列名 [ASC | DESC] [, ...]);                 -- 第3句：指定索引依附的目标数据表，并指定索引键列及升降序排列方式
\`\`\`

#### 2. 关键语法填空真题实例与【逐句详解】
- **实例一：创建聚集索引**
\`\`\`sql
-- 需求：在 Student 表的 Sno 列上创建名为 idx_student_sno 的升序聚集索引
CREATE CLUSTERED INDEX idx_student_sno               -- 第1句：指定创建聚集索引(CLUSTERED INDEX)，索引名为 idx_student_sno
ON Student(Sno ASC);                                 -- 第2句：绑定 Student 表，按 Sno 列升序(ASC)组织数据物理存储
\`\`\`
  - **【逐句详解】**：\`CREATE CLUSTERED INDEX\` 是关键填空点，必须填写带 \`ed\` 的 \`CLUSTERED\`；\`ON Student(Sno ASC)\` 会直接重构 Student 表在物理磁盘上的行存储顺序，一张表**只能且最多有 1 个聚集索引**。

- **实例二：创建唯一非聚集索引**
\`\`\`sql
-- 需求：在 Employee 表的 IDCard 列上创建名为 idx_emp_card 的唯一非聚集索引
CREATE UNIQUE NONCLUSTERED INDEX idx_emp_card        -- 第1句：同时指定 UNIQUE（唯一）与 NONCLUSTERED（非聚集），防止身份证号重复
ON Employee(IDCard);                                 -- 第2句：绑定 Employee 表的 IDCard 列，构建辅索引B+树
\`\`\`
  - **【逐句详解】**：\`UNIQUE\` 强制任何插入和更新操作不能出现重复身份证号，若有重复值创建将失败；\`NONCLUSTERED\` 表明数据物理顺序不变，另外单独生成一棵指向数据行的辅索引 B+ 树。

- **实例三：删除索引语法**
\`\`\`sql
DROP INDEX Employee.idx_emp_card;                    -- 第1句：在 SQL Server 中通过 表名.索引名 彻底删除已建索引对象
\`\`\`
  - **【逐句详解】**：\`DROP INDEX\` 是删除物理索引的 DDL 语句，释放该索引占用的磁盘空间。在 SQL Server 中常用 \`DROP INDEX 表名.索引名\`，或标准 SQL 中的 \`DROP INDEX 索引名 ON 表名\`。

#### 3. 核心考点深度解析（唯一索引 vs 辅索引）

##### ① 唯一索引（UNIQUE INDEX）考点解析
- **核心定义与作用**：保证索引列中不允许出现重复的键值。不仅能够极大提升点查询速度，更是数据库强制实施**实体完整性**与**候选码唯一性约束**的核心物理手段。
- **与主键约束 (PRIMARY KEY) 的关系**：当在关系表中定义 \`PRIMARY KEY\` 时，系统会自动在该列（或列组合）上创建**唯一聚集索引**（默认 CLUSTERED，除非显式指定 NONCLUSTERED）。
- **与唯一约束 (UNIQUE) 的关系**：当在表中定义 \`UNIQUE\` 约束时，系统会自动在该列上创建**唯一非聚集索引**（默认 NONCLUSTERED）。
- **NULL 值的处理机制**：在标准 SQL Server 中，唯一索引列**最多只允许包含一个 NULL 值**（不允许存在多个 NULL），所有非 NULL 键值必须全局唯一。
- **创建限制**：若表中待建索引的列已经存在重复数据，执行创建唯一索引操作将**直接报错失败**；创建成功后，任何试图插入或更新为重复值的操作都会被数据库拒绝并回滚。

##### ② 辅索引 / 辅助索引（SECONDARY INDEX）考点解析
- **核心定义**：建立在表的**非主属性**或**非排序码**（即未决定数据物理存储顺序的列）上的索引。辅索引的逻辑键值顺序与数据文件中记录的实际物理存放顺序**完全不一致**。
- **必背做题铁律：辅索引一定是稠密索引（Dense Index）！**
  - **原理根基**：数据文件中的记录并不是按照辅索引列排序存储的，物理分布极其离散。因此，不可能像聚集索引（稀疏索引）那样“一个数据块只对应一条索引项”；**辅索引的叶子节点必须为数据文件中的每一个元组（每一行记录）都保存一个对应的索引项和物理指针（RID 或聚集主键）**。故全国三级考题中：“**辅助索引绝不可能是稀疏索引，辅助索引只能是稠密索引**”为必选正确答案！
- **辅索引在 SQL 中的实现**：在 SQL Server 等主流关系型数据库中，辅索引就是通过 **非聚集索引（NONCLUSTERED INDEX）** 来具体实现的。
- **数量对比考点**：一张表在物理磁盘上只有一种排序存储顺序，因此**最多只能有 1 个聚集索引（主索引）**；但可以建立**多个辅助索引 / 非聚集索引**（SQL Server 中支持多达 249 个非聚集索引）。
- **查询与维护代价**：通过辅索引查找记录时，先在辅索引树中找到行指针（RID 或主键），再回表读取完整数据行（称为**书签查找 / 回表 Bookmark Lookup**）。由于辅索引需要回表，且表数据插入、删除、修改时都需要同步维护所有辅索引树，因此**高并发写操作的大表不宜盲目建立过多辅索引**。

#### 4. 填空防错与考场秒杀口诀
- 聚集索引英文：**CLUSTERED**（切勿漏写词尾 **ed**！）。
- 非聚集索引英文：**NONCLUSTERED**。
- 排序方向：升序填 **ASC**，降序填 **DESC**。
- 考题看到“**辅索引 / 辅助索引 / 非聚集索引**” → 绝不可能是稀疏索引，秒选 **稠密索引**！
- 考题看到“**主键默认生成的索引类型**” → 秒选 **唯一聚集索引**！
- 考题看到“**UNIQUE 约束默认生成的索引类型**” → 秒选 **唯一非聚集索引**！`
    },
    {
      id: 'sql-trigger-fill-in',
      title: '3. 触发器与伪表填空模板（AFTER / FOR / INSTEAD OF）',
      tag: '代码填空必背',
      highlightedKeywords: [
        'CREATE TRIGGER',
        'AFTER',
        'FOR',
        'INSTEAD OF',
        'INSERTED',
        'DELETED',
        'ROLLBACK TRANSACTION'
      ],
      content: `### 触发器（Trigger）高频填空

触发器是数据库技术综合大题和填空题的绝对必考点！

#### 1. 触发器两大类型与三大触发时机关键字（AFTER / FOR / INSTEAD OF）
- **后触发器（AFTER / FOR）**：
  - **关键字**：**\`AFTER\`** 或 **\`FOR\`**（在 SQL Server 中，**\`FOR\` 与 \`AFTER\` 完全等价**，都是在引发事件执行完成后才触发）。
  - **触发时机**：在执行完引发事件的 SQL 语句（如 INSERT / UPDATE / DELETE）**之后**才触发运行。
  - **宿主限制**：只能建在**基表**上，**不能**建立在视图上。
- **替代触发器（INSTEAD OF）**：
  - **关键字**：**\`INSTEAD OF\`**。
  - **触发时机**：**跳过/替代**当前引发事件的 SQL 语句，改为执行触发器内部定义的逻辑。
  - **宿主限制**：既可以建在**基表**上，也可以建在**视图**上（**最核心考点：常用于让复杂多表连接视图支持更新操作**）。

| 触发器分类 | 语法关键字 | 触发时机 | 允许依附的对象 | 核心应用场景 |
| :--- | :--- | :--- | :--- | :--- |
| **后触发器** | **\`AFTER\`** 或 **\`FOR\`**<br>*(两者完全等价)* | 事件语句执行**之后** | **只能建在基表上** | 级联更新库存、约束检查、审计日志 |
| **替代触发器** | **\`INSTEAD OF\`** | **跳过**原事件语句，执行自身逻辑 | **基表 与 视图 均可** | **让复杂多表视图支持增删改** |

#### 2. 触发器的两张特殊临时表（考场送分点！）
SQL Server 在执行 DML 操作时，会在内存中自动维护两张特殊临时表（DELETED 表与 INSERTED 表）：

| 操作类型 | DELETED 表中的内容 | INSERTED 表中的内容 |
| :--- | :--- | :--- |
| **INSERT（插入）** | （无 / 空） | 存放新插入的数据行 |
| **DELETE（删除）** | 存放刚刚被删除的旧数据行 | （无 / 空） |
| **UPDATE（修改）**<br>*(本题考点)* | **存放修改前（更新前）的旧值** | **存放修改后（更新后）的新值** |

---

#### 二、触发器题目的通杀公式（考场模板）
只要记住下面这个结构，题库里所有的触发器填空题套路都一样：

\`\`\`sql
CREATE TRIGGER 触发器名
ON [ 监视的基表或视图名 ]
[ AFTER | FOR | INSTEAD OF ] [ INSERT / UPDATE / DELETE ]
AS
DECLARE @变量 数据类型
SET @变量 = (
    SELECT 某个字段 FROM [ INSERTED / DELETED ]
)
UPDATE 目标表
SET 数量 = 数量 + [ @变量 ]
WHERE 关键ID IN (
    SELECT 关键ID FROM [ INSERTED / DELETED ]
)
\`\`\`

> 💡 **模板填空抓手**：
> - \`ON [ 监视的表名/视图名 ]\`：填事件发生的业务表或视图（如订单表、借还书表）；
> - 触发时机与动作：填 **\`AFTER\`**（或 **\`FOR\`**）或 **\`INSTEAD OF\`**，后接 **\`INSERT\`**、**\`UPDATE\`** 或 **\`DELETE\`**；
> - \`FROM [ INSERTED / DELETED ]\`：新增/更新后取 \`INSERTED\`，删除/更新前取 \`DELETED\`；
> - \`UPDATE 目标表\`：同步级联修改关联表（如库存表、统计表）。

---

#### 三、触发器经典真题代码实战（涨薪限制）
\`\`\`sql
-- 需求：当修改员工薪资时，如果涨幅超过20%，撤销操作
CREATE TRIGGER tr_check_salary
ON Employee
AFTER UPDATE -- 也可写作 FOR UPDATE
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM INSERTED i
        JOIN DELETED d ON i.EmpID = d.EmpID
        WHERE (i.Salary - d.Salary) / d.Salary > 0.2
    )
    BEGIN
        PRINT '薪资涨幅超过20%，操作被终止！';
        ROLLBACK TRANSACTION;  -- 回滚撤销当前事务
    END
END;
\`\`\`

##### 【考点与逻辑拆解】
- **\`CREATE TRIGGER tr_check_salary ON Employee\`**：创建触发器，绑定到 \`Employee\` 基表。
- **\`AFTER UPDATE\`（或 \`FOR UPDATE\`）**：后触发器，当执行 UPDATE 更新数据完成后触发运行。
- **\`FROM INSERTED i JOIN DELETED d ON i.EmpID = d.EmpID\`**：
  - \`INSERTED\` 表存放 UPDATE 后的**新薪资**；
  - \`DELETED\` 表存放 UPDATE 前的**旧薪资**；
  - 通过主键 \`EmpID\` 关联比对涨薪幅度。
- **\`ROLLBACK TRANSACTION\`**：事务回滚核心语句，违规时强制撤销修改，数据恢复原状。`
    },
    {
      id: 'sql-cursor-fill-in',
      title: '4. 游标（Cursor）全流程五步填空',
      tag: '代码填空必背',
      highlightedKeywords: [
        'DECLARE CURSOR',
        'OPEN',
        'FETCH NEXT FROM',
        'INTO',
        '@@FETCH_STATUS',
        'CLOSE',
        'DEALLOCATE',
        'FETCH 语法',
        'NEXT',
        'PRIOR',
        'FIRST',
        'LAST',
        'ABSOLUTE',
        'RELATIVE'
      ],
      content: `### 游标编程固定 5 步法（一空不落！）

三级机考中，游标的填空几乎完全遵循固定 5 个步骤，分毫不差：

#### 一、游标编程通杀公式（考场固定 5 步模板）
只要记住下面这个结构，题库里所有的游标填空题套路都一样：

\`\`\`sql
DECLARE 游标名 CURSOR FOR
    SELECT 字段1, 字段2 FROM 监视表 WHERE 条件;

DECLARE @变量1 数据类型, @变量2 数据类型;

OPEN 游标名;

FETCH NEXT FROM 游标名 INTO @变量1, @变量2;

WHILE @@FETCH_STATUS = 0
BEGIN
    -- 业务处理逻辑（如定向更新不及格成绩或统计）
    UPDATE 目标表
    SET 字段 = 新值
    WHERE 主键 = @变量1;

    FETCH NEXT FROM 游标名 INTO @变量1, @变量2;
END;

CLOSE 游标名;
DEALLOCATE 游标名;
\`\`\`

> 💡 **模板填空抓手**：
> 1. \`OPEN 游标名\`：激活游标；
> 2. \`FETCH NEXT FROM 游标名 INTO @变量...\`：初次与循环末尾推进提取（千万别漏写 INTO）；
> 3. \`WHILE @@FETCH_STATUS = 0\`：循环检测是否提取成功（0 为成功）；
> 4. \`CLOSE 游标名\`：关闭游标结果集；
> 5. \`DEALLOCATE 游标名\`：彻底释放游标内存。

---

#### 二、游标经典真题代码实战（不及格成绩调优）
\`\`\`sql
-- 1. 声明游标与局部变量
DECLARE cur_student CURSOR FOR
    SELECT Sno, Sname, Score FROM Student WHERE Dept = 'CS';

DECLARE @sno CHAR(8), @sname VARCHAR(20), @score INT;

-- 2. 打开游标
OPEN cur_student;

-- 3. 初次推进提取首行数据
FETCH NEXT FROM cur_student INTO @sno, @sname, @score;

-- 4. 循环遍历处理 (@@FETCH_STATUS = 0 为成功)
WHILE @@FETCH_STATUS = 0
BEGIN
    IF @score < 60
        UPDATE Student SET Score = 60 WHERE Sno = @sno;
        
    FETCH NEXT FROM cur_student INTO @sno, @sname, @score;
END;

-- 5. 关闭与释放游标
CLOSE cur_student;
DEALLOCATE cur_student;
\`\`\`

##### 【考点与逻辑拆解】
- **\`DECLARE cur_student CURSOR FOR SELECT ...\`**：声明只读前向游标，将关系数据库的集合操作转换为逐行记录遍历。
- **\`FETCH NEXT FROM ... INTO ...\`**：推进游标并将数据读入变量。进入 \`WHILE\` 循环前必须初次提取，循环体末尾必须再次推进提取下一行，防止死循环。
- **\`@@FETCH_STATUS\`**：全局状态变量。\`0\` 表示成功；\`-1\` 表示到达末尾；\`-2\` 表示提取的行已丢失。
- **\`CLOSE\` 与 \`DEALLOCATE\`**：\`CLOSE\` 释放结果集但保留游标结构，\`DEALLOCATE\` 彻底注销游标并释放底层内存。

#### 游标状态变量速记：
- \`@@FETCH_STATUS = 0\`：成功提取（Success）。
- \`@@FETCH_STATUS = -1\`：FETCH 失败或已达末尾（EOF）。
- \`@@FETCH_STATUS = -2\`：被提取的行已丢失。

---

#### 三、 游标 FETCH 常见六大动作速记（必背）
- **\`FETCH FIRST\`** ：**首行**
- **\`FETCH LAST\`** ：**尾行**
- **\`FETCH PRIOR\`** ：**上一行**
- **\`FETCH NEXT\`** ：**下一行**（默认选项）
- **\`FETCH ABSOLUTE n\`** ：**全局绝对第 n 行**（负数表示倒数第 n 行，为 0 则不返回行）
- **\`FETCH RELATIVE n\`** ：**从当前位置相对移动 n 行**（为 0 则返回当前行）

---

#### 四、 FETCH 语句完整检索语法与六大定向提取参数精解（考点拓展）

FETCH 的功能是通过 Transact-SQL 服务器游标检索特定行。

##### 1. FETCH 完整标准语法
\`\`\`sql
FETCH [ [ NEXT | PRIOR | FIRST | LAST 
        | ABSOLUTE { n | @nvar } 
        | RELATIVE { n | @nvar } ] 
        FROM ] 
    { { [ GLOBAL ] cursor_name } | @cursor_variable_name } 
    [ INTO @variable_name [ ,...n ] ]
\`\`\`

##### 2. 六大参数功能与推进规则说明（官方题库解析标准）
1. **\`NEXT\`**：
   - **推进规则**：紧跟当前行返回结果行，并且当前行递增为返回行。
   - **首次提取行为**：如果 \`FETCH NEXT\` 为对游标的**第一次提取操作**，则**返回结果集中的第一行**。
   - **考点地位**：\`NEXT\` 为**默认的游标提取选项**（省略参数时默认就是 NEXT）。
2. **\`PRIOR\`**：
   - **推进规则**：搜索返回紧邻当前行前面的结果行，并且当前行递减为返回行。
   - **首次提取行为**：如果 \`FETCH PRIOR\` 为对游标的**第一次提取操作**，则**没有行返回**并且游标置于第一行之前。
3. **\`FIRST\`**：
   - **推进规则**：返回游标中的**第一行**并将其作为当前行。
4. **\`LAST\`**：
   - **推进规则**：返回游标中的**最后一行**并将其作为当前行搜索。
5. **\`ABSOLUTE { n | @nvar }\`**（绝对行号定位）：
   - **正数 (n > 0)**：如果 n 或 @nvar 为正，则返回从**游标头开始向后的第 n 行**，并将返回行变成新的当前行。
   - **负数 (n < 0)**：如果 n 或 @nvar 为负，则返回从**游标末尾开始向前的第 n 行**，并将返回行变成新的当前行。
   - **零 (n = 0)**：如果 n 或 @nvar 为 0，则**不返回行**（高频避坑题眼）。
   - **参数类型要求**：n 必须是**整数常量**，并且 @nvar 的数据类型必须为 **\`smallint\`、\`tinyint\` 或 \`int\`**。
6. **\`RELATIVE { n | @nvar }\`**（相对当前行偏移定位）：
   - **正数 (n > 0)**：如果 n 或 @nvar 为正，则返回从**当前行开始向后的第 n 行**，并将返回行变成新的当前行。
   - **负数 (n < 0)**：如果 n 或 @nvar 为负，则返回从**当前行开始向前的第 n 行**，并将返回行变成新的当前行。
   - **零 (n = 0)**：如果 n 或 @nvar 为 0，则**返回当前行**（与 ABSOLUTE 0 严格区分）。
   - **首次提取行为**：在对游标进行第一次提取时，如果在将 n 或 @nvar 设置为**负数或 0** 的情况下指定 \`FETCH RELATIVE\`，则**不返回行**。
   - **参数类型要求**：n 必须是**整数常量**，@nvar 的数据类型必须为 **\`smallint\`、\`tinyint\` 或 \`int\`**。

##### 3. ABSOLUTE vs RELATIVE 核心对比与速记
| 比较维度 | ABSOLUTE（绝对定位） | RELATIVE（相对定位） |
| :--- | :--- | :--- |
| **定位基准** | 游标头部（正数）或 游标末尾（负数） | 游标的**当前行（Current Row）** |
| **参数为 0 时的结果** | **不返回行**（易错考点！） | **返回当前行**（重新读取当前行） |
| **首次提取指定负数/0** | 负数时从尾部倒数提取有效行 | **不返回行**（无当前行以供相对偏移） |
| **参数类型限定** | 常量为整数；变量为 \`smallint\`、\`tinyint\` 或 \`int\` | 常量为整数；变量为 \`smallint\`、\`tinyint\` 或 \`int\` |`
    },
    {
      id: 'sql-proc-func-fill-in',
      title: '5. 存储过程、用户自定义标量函数、四大排名函数与并列TOP查询填空',
      tag: '代码填空必背',
      highlightedKeywords: [
        'CREATE PROCEDURE',
        'OUTPUT',
        'EXEC',
        'SET',
        'BEGIN',
        'END',
        'CREATE FUNCTION',
        'RETURNS',
        'RETURN',
        '标量函数',
        'dbo.',
        'ROW_NUMBER',
        'RANK',
        'DENSE_RANK',
        'NTILE',
        'PARTITION BY',
        'WITH TIES',
        'TOP'
      ],
      content: `### 存储过程、用户自定义标量函数、四大排名函数与并列查询填空模板

#### 一、存储过程通杀公式：两大经典代码分支（BEGIN...END 块 vs 单语句 SET 写法）

在等级考试和机考大题中，存储过程主要考察**带输入/输出参数的计算与赋值**。考题通常呈现出两种不同的结构分支：

---

##### 【分支 A】标准多语句块写法（BEGIN ... END 结构）
当存储过程内部包含多条逻辑语句（或遵循标准结构化编程风格）时，在 \`AS\` 之后使用 \`BEGIN ... END\` 包裹执行体：

\`\`\`sql
-- 创建存储过程（分支 A：BEGIN ... END 块）
CREATE PROCEDURE 过程名
    @输入参数 数据类型,
    @输出参数 数据类型 OUTPUT
AS
BEGIN
    -- 使用 SELECT 聚合赋值
    SELECT @输出参数 = 聚合表达式
    FROM 表名
    WHERE 过滤字段 = @输入参数;
END;
\`\`\`

---

##### 【分支 B】单语句极简写法（省略 BEGIN...END，直接用 SET 标量子查询赋值）
👉 **【真题高频变体！】** 在 SQL Server / T-SQL 中，若 \`AS\` 之后**只有一条单一的执行语句**，**\`BEGIN\` 与 \`END\` 完全可选，可以彻底省略**！很多考题为了精简版面，会直接采用单语句 \`SET\` 赋值：

\`\`\`sql
-- 创建存储过程（分支 B：单语句 SET 极简写法，无 BEGIN ... END）
CREATE PROCEDURE 过程名
    @输入参数 数据类型,
    @输出参数 数据类型 OUTPUT
AS
    SET @输出参数 = (
        SELECT 聚合表达式
        FROM 表名
        WHERE 过滤字段 = @输入参数
    );
\`\`\`

---

##### 【通用调用模板】存储过程调用与接收（两大分支通用）
\`\`\`sql
-- 调用存储过程模板
DECLARE @接收变量 数据类型;
EXEC 过程名 传入实参, @接收变量 OUTPUT;
SELECT @接收变量 AS 别名;
\`\`\`

> 💡 **考场命门题眼速记**：
> - **定义参数**：带输出功能的参数必须显式声明 \`OUTPUT\`（如 \`@AvgScore DECIMAL(5, 2) OUTPUT\`）；
> - **调用传参**：传参时**也必须显式跟上 \`OUTPUT\`**（如 \`EXEC 过程名 'CS', @result OUTPUT;\`），否则变量无法接收返回值，保持 NULL！
> - **单语句省 BEGIN/END 规律**：看到 \`AS\` 后面直接是 \`SET\` 或 \`SELECT\` 而没有 \`BEGIN\` 时，不要慌张，结尾也**绝对不要写 \`END\`**！

---

#### 二、存储过程经典真题代码实战（计算系平均分）两大分支对照

##### 1. 分支 A 实战：多语句块结构（BEGIN ... END）
\`\`\`sql
CREATE PROCEDURE GetStudentAvg
    @DeptName VARCHAR(20),
    @AvgScore DECIMAL(5, 2) OUTPUT
AS
BEGIN
    SELECT @AvgScore = AVG(Score)
    FROM Student
    WHERE Dept = @DeptName;
END;
\`\`\`

##### 2. 分支 B 实战：单语句极简结构（SET 标量子查询，无 BEGIN ... END）
\`\`\`sql
CREATE PROCEDURE GetStudentAvg
    @DeptName VARCHAR(20),
    @AvgScore DECIMAL(5, 2) OUTPUT
AS
    SET @AvgScore = (SELECT AVG(Score) FROM Student WHERE Dept = @DeptName);
--  ^^^             ^                                                     ^
--  【挖空点1：SET】  【挖空点2：标量子查询必须加圆括号包裹】
\`\`\`

---

##### 3. 深入辨析：SET 赋值与 SELECT 赋值的 4 大核心差异（考场避坑）

| 对比维度 | \`SET @变量 = (子查询)\` 赋值 | \`SELECT @变量 = 表达式 FROM ...\` 赋值 |
| :--- | :--- | :--- |
| **语法标准** | **ANSI SQL 标准推荐语法** | **T-SQL 专有扩展语法** |
| **赋值数量** | **一次只能给 1 个变量赋值** | **一条语句可同时给多个变量赋值**（如 \`SELECT @A=1, @B=2\`） |
| **子查询括号** | **必须用圆括号 \`(...)\` 包裹**成标量子查询 | **不需要加外层圆括号**，直接写聚合表达式 |
| **查询无结果时** | 变量被赋予 **\`NULL\`** | 变量**保留原来的旧值不变**（不会被覆盖为 NULL） |
| **查询返回多行时** | **直接抛出运行时错误**（标量子查询不允许返回多行） | **不报错**，按检索顺序依次赋值，最后保留**最后一行**的值 |

---

##### 4. 分支 B（单语句 SET）考场经典挖空题眼矩阵
1. **挖空 \`SET\` 关键字**：看见紧随 \`AS\` 之后给变量赋值，且右侧由括号包裹查询，首选填 **\`SET\`**；
2. **挖空外层圆括号 \`(...)\`**：\`SET @变量 = (SELECT ...)\` 中，标量子查询两端的圆括号是语法必需的；
3. **挖空 \`OUTPUT\`**：无论是过程参数定义，还是 \`EXEC\` 执行调用处，漏写 \`OUTPUT\` 均无法回传数据；
4. **挖空 \`AS\`**：在过程头定义与执行体之间，始终由 **\`AS\`** 引导（即使没有 BEGIN/END，\`AS\` 也绝不能少）。

---

#### 三、调用存储过程真题代码实操
\`\`\`sql
-- 调用上述存储过程
DECLARE @result DECIMAL(5, 2);
EXEC GetStudentAvg 'CS', @result OUTPUT;
SELECT @result AS CSAverage;
\`\`\`

##### 【考点与逻辑拆解】
- **\`CREATE PROCEDURE GetStudentAvg\`**：定义存储过程，预编译执行，相比常规 SQL 速度更快、网络流量更小。
- **\`@AvgScore DECIMAL(5, 2) OUTPUT\`**：输出参数关键字 \`OUTPUT\`，用于向调用方回传计算结果。
- **\`EXEC GetStudentAvg 'CS', @result OUTPUT\`**：调用存储过程。若漏写 \`OUTPUT\` 则无法获取计算结果，仍为 NULL。

---

#### 四、 用户自定义标量函数（CREATE FUNCTION）填空通杀模板与【必背考点】

在全国计算机等级考试和机考大题中，除了存储过程，另一大高频考核对象是**用户自定义标量函数（User-Defined Scalar Function）**。标量函数接收输入参数并返回**单个标量值**（如整数、浮点数或字符串）。

##### 1. 用户自定义标量函数标准骨架模板
\`\`\`sql
-- 1. 创建标量函数骨架
CREATE FUNCTION 函数名 (
    @参数名 数据类型,
    ...
)
RETURNS 返回数据类型  -- 【必背考点】头部必须带 S：RETURNS
AS
BEGIN
    -- 2. 声明局部变量接收结果
    DECLARE @返回值变量 返回数据类型;

    -- 3. 查询并将统计/计算结果赋给变量
    SELECT @返回值变量 = COUNT(*) / SUM(列名)
    FROM 表名
    WHERE 列名 = @参数名
      AND ...;

    -- 4. 退出并返回结果
    RETURN @返回值变量;  -- 【必背考点】尾部不带 S：RETURN
END;
\`\`\`

##### 2. 经典真题实战：根据部门名称统计该部门员工总人数
\`\`\`sql
-- 需求：编写标量函数 fn_GetDeptEmpCount，输入部门名称 @DeptName，返回该部门的员工总人数
CREATE FUNCTION fn_GetDeptEmpCount (
    @DeptName VARCHAR(20)
)
RETURNS INT  -- 【必背考点】头部声明返回数据类型：必须带 S（RETURNS）
AS
BEGIN
    DECLARE @EmpCount INT;

    SELECT @EmpCount = COUNT(*)
    FROM Employee
    WHERE DeptName = @DeptName;

    RETURN @EmpCount;  -- 【必背考点】尾部退出并返回具体结果：绝对不带 S（RETURN）
END;
\`\`\`

##### 3. 标量函数调用模板（考场高频大坑：必须带架构名前缀！）
\`\`\`sql
-- 调用标量函数：必须加架构名前缀（如 dbo.）！
SELECT dbo.fn_GetDeptEmpCount('研发部') AS TotalStaff;
\`\`\`

##### 4. 考场绝杀挖空避坑要诀（黄金对照记忆）
1. **“头带 S，尾不带 S”（失分率最高必考盲区！）**：
   - **头部定义返回类型**：必须写作 **\`RETURNS\`**（带 **\`S\`**，如 \`RETURNS INT\`、\`RETURNS DECIMAL(5, 2)\`）；
   - **函数体尾部执行返回**：必须写作 **\`RETURN\`**（**不带 S**，动词形式，后跟具体变量或数值，如 \`RETURN @返回值变量;\`）。
   - 💡 **速记口诀**：**“头声明加 S（RETURNS），尾返回不带 S（RETURN）”**！
2. **标量函数体必须有 \`BEGIN ... END\`**：与单语句存储过程不同，多语句标量函数的逻辑主体必须使用 \`BEGIN ... END\` 完整包裹。
3. **函数内部只读限制（不能更改数据库状态）**：
   - 标量函数内部**严禁执行数据修改操作**（严禁执行 \`INSERT\`、\`UPDATE\`、\`DELETE\` 或创建物理/临时表），只能进行变量计算和数据查询。
4. **调用时必须显式加架构名（\`dbo.\`）**：
   - 在 SQL Server 中调用用户自定义标量函数时，语法强制规定**必须使用两部分构成的名称**（\`架构名.函数名\`，通常为 \`dbo.函数名(参数)\`）；
   - 如果只写 \`函数名(参数)\`，SQL Server 会将其误认为系统内置内置函数而直接报语法错误！

##### 5. 【必考压轴】三大可编程对象核心区别（标量函数 vs 存储过程 vs 触发器）速查表

| 对象类型 | 创建语法 | 是否带返回值类型 | 题干特征词与应用场景 |
| :--- | :--- | :--- | :--- |
| **标量函数** | \`CREATE FUNCTION ...\` | **RETURNS int/varchar...（必带）** | **“创建标量函数”**、**“统计并返回一个值”** |
| **存储过程** | \`CREATE PROCEDURE ...\` | **不带 RETURNS**（通过 \`OUTPUT\` 参数或 \`SELECT\` 结果集返回） | **“创建存储过程”**、**“执行业务处理”** |
| **触发器** | \`CREATE TRIGGER ... ON 表 FOR/AFTER/INSTEAD OF\` | **无参数、无返回值** | **“当向表中插入/修改时自动触发”** |

> 🎯 **考场秒杀直通判定**：
> - 看到题干出现“**编写...统计并返回一个值 / 返回某个员工实发工资**” ➔ 必是 **标量函数**（\`CREATE FUNCTION ... RETURNS 数据类型\`）！
> - 看到题干出现“**编写...执行业务处理 / 输入输出参数**” ➔ 必是 **存储过程**（\`CREATE PROCEDURE ...\`，注意两头 \`OUTPUT\`）！
> - 看到题干出现“**当向表中插入/修改/删除时自动触发 / 约束检查**” ➔ 必是 **触发器**（\`CREATE TRIGGER ... ON 表\`，严禁写参数和返回值）！

##### 6. 【极高频真题】内联表值函数（可以传参的视图） vs 多语句表值函数代码与填空题眼

> 💡 **核心定位**：
> **“内联表值函数 ( Inline Table-valued Function ) ” 其实就是“可以传参的视图”**，只要看一次代码示例，就能彻底搞懂它的所有特性。

###### (1) 内联表值函数真实代码（极简，只有一条 RETURN SELECT）
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

###### (2) 对比：多语句表值函数（复杂，有 @table 变量和 INSERT）
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

###### (3) 考场四大必背挖空与避坑要诀：
1. **本质特征**：视图不能带参，内联表值函数是**可以传参的视图**。
2. **头部返回类型**：只写 **\`RETURNS TABLE\`**，**绝不能声明返回表变量名（无 @t）**，也**绝不能显式定义列类型清单**。
3. **函数主体结构**：只有单条 **\`RETURN (SELECT ...);\`**，**严禁写 \`BEGIN ... END\`**，无需 \`INSERT INTO\` 临时填充。
4. **调用位置**：表值函数返回一张表，**必须出现在查询语句的 \`FROM\` 子句中**（如 \`SELECT * FROM f_get_dept_emp(10)\`），而标量函数只能出现在 \`SELECT\` 列表或表达式中。

---

#### 五、 开窗函数与 OVER (PARTITION BY ... ORDER BY ...) 深度剖析与填空题眼

在等级考试与机考综合大题中，**\`OVER (PARTITION BY ...)\` 是出现频率极高的填空考点**。

##### 一、 为什么必须使用开窗函数？（核心本质与 GROUP BY 的区别）
- **传统 \`GROUP BY\`（折叠压缩）**：把多行数据聚合成一行输出。如果查询中想要输出每个员工的名字、工号等细粒度信息，就**无法**与聚合函数共存（除非把它们全放进 GROUP BY 里，但那样就失去了按部门汇总的意义）。
- **开窗函数 \`OVER (PARTITION BY ...)\`（不折叠行，保留明细）**：在**不减少任何原始数据行数**的前提下，对数据先进行逻辑“分区（Partition）”，在每个分区内部独立进行排名或聚合计算，并将计算结果作为新列直接附在每一行原始数据后面。

##### 二、 语法格式与三大挖空点拆解
\`\`\`sql
函数名() OVER (
    [PARTITION BY 分组列1, 分组列2...]   -- 【挖空点1：分区子句】定义窗口边界（类似组内切片）
    [ORDER BY 排序列 [ASC | DESC]]       -- 【挖空点2：排序子句】定义窗口内部的排序列与升降序
)
\`\`\`
1. **\`OVER\` 关键字（常考空）**：标志着开窗函数的开始，后跟一对紧邻的圆括号 \`()\`。如果括号内为空（如 \`OVER ()\`），则代表把整张表作为一个大窗口进行计算。
2. **\`PARTITION BY\` 子句（极高频挖空点！）**：
   - 意为“**按...进行分区/划分**”。它的作用等同于组内分组；
   - 例如：\`PARTITION BY DeptName\` 意味着每个部门都是一个独立的计算窗口，各部门之间的排名或汇总互不干扰、各自从 1 开始排。
3. **\`ORDER BY\` 子句（常考空）**：
   - 声明窗口内部各行数据的排序规则，作为排名（Rank）或累计求和的基准。

---

##### 三、 考场两大高频真题填空模板与代码实战

###### 模板 A：分组内部排名（如：统计各部门内部员工的薪水排名）
\`\`\`sql
-- 需求：查询员工姓名、部门名称、工资，并计算每位员工在其所在部门内部的工资排名（工资相同不跳号）
SELECT EmpName,
       DeptName,
       Salary,
       DENSE_RANK() OVER (PARTITION BY DeptName ORDER BY Salary DESC) AS DeptSalaryRank
--     ^^^^^^^^^^  ^^^^  ^^^^^^^^^^^^           ^^^^^^^^               
--     排名函数    开窗  【高频填空：分区列】   【高频填空：排序列】
FROM Employee;
\`\`\`
> 💡 **考点拆解**：
> - 看到“**各部门内部**”、“**每个班级内部**”、“**每门课程内部**”进行排名 ➔ **必填 \`PARTITION BY 部门/班级/课程\`**！
> - 若各部门内部从高到低排 ➔ 必跟 **\`ORDER BY 字段 DESC\`**！

###### 模板 B：明细与部门汇总/平均值并存（如：显示员工工资及该部门的平均工资）
\`\`\`sql
-- 需求：显示每个员工的信息，同时列出该员工所在部门的平均工资与部门总工资
SELECT EmpName,
       DeptName,
       Salary,
       AVG(Salary) OVER (PARTITION BY DeptName) AS DeptAvgSalary,
       SUM(Salary) OVER (PARTITION BY DeptName) AS DeptTotalSalary
--                 ^^^^  ^^^^^^^^^^^^
--                 开窗  【高频填空：只按部门分区，无需组内排序】
FROM Employee;
\`\`\`

---

##### 四、 四大开窗排名函数核心对比表

| 函数名 | 核心特性与填空题眼 | 样例输出 (90, 85, 85, 80) |
| :--- | :--- | :--- |
| **ROW_NUMBER()** | 连续唯一编号，**不管是否并列，绝不重复** | 1, 2, 3, 4 |
| **RANK()** | 并列名次相同，**后续名次产生跳跃** (如并列第2，下一个是第4) | 1, 2, 2, **4** |
| **DENSE_RANK()** | 并列名次相同，**后续名次紧密连续不跳跃** (如并列第2，下一个是第3) | 1, 2, 2, **3** |
| **NTILE(n)** | 将数据切分为 **n 个等份桶**，用于分位数统计 | 1, 1, 2, 2 (若分成2桶) |

---

##### 五、 考场一分钟避坑口诀
1. **不带逗号**：\`PARTITION BY 列名\` 与 \`ORDER BY 列名\` 之间是用**空格**隔开，**千万不能写逗号 \`,\`**！
   - ❌ 错误：\`OVER (PARTITION BY Dept, ORDER BY Salary DESC)\`
   - ✅ 正确：\`OVER (PARTITION BY Dept ORDER BY Salary DESC)\`
2. **括号必配对**：\`OVER\` 后面必须有括号；如果既不需要分组也不需要排序，也可以是空括号 \`OVER ()\`。
3. **题眼识别**：题目要求返回**全部原始明细行**，同时又要算**每组的排名/总和/平均** ➔ 百分之百使用 **\`OVER (PARTITION BY ...)\`**！

---

#### 六、 并列情况查询（TOP n WITH TIES）填空标准模板与【逐句详解】
在机考填空与综合大题中，凡是出现“**查询第1名/前n名，包含并列情况**”，必须使用 **\`TOP n WITH TIES\`**：

\`\`\`sql
-- 需求：查询销售总量最高的汽车型号及总销量，包含并列第一的情况
SELECT TOP 1 WITH TIES                                               -- 第1句：【填空点1】取排在第1名的记录；WITH TIES 声明若有并列第一则一并返回
       CarModel,                                                     -- 第2句：输出按其汇总的汽车型号列
       SUM(SalesCount) AS TotalSales                                 -- 第3句：用聚合函数计算总销售量并赋予别名 TotalSales
FROM CarSalesRecord                                                  -- 第4句：数据来源于汽车销售记录明细表
GROUP BY CarModel                                                    -- 第5句：按汽车型号进行分组汇总
ORDER BY TotalSales DESC;                                            -- 第6句：【填空点2】必须指定 ORDER BY 降序！作为 WITH TIES 并列判断的基准！
\`\`\`

##### 【逐句代码详解】
- **\`SELECT TOP 1 WITH TIES\`**：
  - \`TOP 1\` 代表获取排序后的前 1 条记录；
  - **\`WITH TIES\` 是本题唯一正确填空答案**：字面意思“带上并列项”，如果第 2 名的数值与第 1 名完全相同，数据库将破格保留并列行。
- **\`CarModel, SUM(SalesCount) AS TotalSales\`**：
  - 汇总输出每种车型的总销量，\`SUM\` 统计分组内的销售总数。
- **\`FROM CarSalesRecord GROUP BY CarModel\`**：
  - 按照车型进行分类聚合。
- **\`ORDER BY TotalSales DESC\`**：
  - **极度关键的规则**：在 SQL Server 中，**\`WITH TIES\` 必须与 \`ORDER BY\` 配合使用**！如果不写 \`ORDER BY\`，数据库根本不知道依据什么排序来判断“并列”，系统会直接报错。`
    },
    {
      id: 'sql-security-fill-in',
      title: '6. 数据库安全主体与角色管理填空（LOGIN、USER、ROLE及删除填空口诀）',
      tag: '代码填空必背',
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
        'db_datareader',
        'db_datawriter',
        'db_ddladmin',
        'db_denydatareader',
        'sysadmin',
        'dbcreator',
        'securityadmin',
        'serveradmin',
        'GRANT',
        'REVOKE',
        'DENY',
        '自主存取控制',
        'DAC',
        '强制存取控制',
        'MAC',
        '下读',
        '同级写'
      ],
      content: `### 数据库安全主体与权限管理填空核心模板

在全国计算机三级数据库技术与软考机考中，关于“**登录名、用户、角色**”的管理代码填空题是一道极其高频的固定送分题。

---

### 一、 核心秒杀口诀（看题干字眼直接秒填！）

| 题干关键词 | 对应填空答案 | 完整操作语法模板 | 作用域与层级说明 |
| :--- | :--- | :--- | :--- |
| **题目说“删除登录名”** | **填 LOGIN** | \`DROP LOGIN xxx;\` | **服务器实例级**：删除连接数据库实例的安全主体 |
| **题目说“删除用户”** | **填 USER** | \`DROP USER xxx;\` | **数据库级**：删除特定数据库内部的数据访问用户 |
| **题目说“删除角色”** | **填 ROLE** | \`DROP ROLE xxx;\` | **数据库级**：删除权限管理容器组 |
| **题目说“创建登录名”** | **填 LOGIN** | \`CREATE LOGIN xxx WITH PASSWORD = '...';\` | 创建用于连接 SQL Server 实例的登录账号 |
| **题目说“创建用户”** | **填 USER** | \`CREATE USER xxx FOR LOGIN xxx;\` | 为当前数据库创建访问用户，并与登录名绑定映射 |
| **题目说“创建角色”** | **填 ROLE** | \`CREATE ROLE xxx;\` | 创建自定义数据库角色，用于集中批量分配权限 |

---

### 二、 三大安全主体的层级关系与考场避坑

\`\`\`
【服务器级别 Server Level】
       登录名 (LOGIN)   ➔ 负责身份验证，决定能否进入 SQL Server 服务器实例
              │
         (映射绑定 FOR LOGIN)
              ▼
【数据库级别 Database Level】
       数据库用户 (USER) ➔ 负责权限校验，决定在具体数据库内能访问哪些表/视图
              │
         (加入角色 ADD MEMBER)
              ▼
       数据库角色 (ROLE) ➔ 权限集合容器（如 db_datareader、db_datawriter）
\`\`\`

1. **登录名（LOGIN）与用户（USER）绝对不能混淆**：
   - 登录名存在于服务器级别的系统数据库 \`master\` 中，决定“**能不能连上服务器**”。
   - 用户存在于具体的业务数据库（如 \`StudentDB\`）中，决定“**能对库里的数据做什么**”。
   - 客户端连接数据库，先用 **LOGIN** 通过实例验证，再以该库里的 **USER** 身份执行具体数据操作。
2. **删除依赖顺序**：
   - 如果某个数据库用户拥有对象或正被角色引用，必须先清理依赖再 \`DROP USER\`；
   - 如果登录名映射了多个库的用户，必须先在对应库中删除数据库用户（\`DROP USER\`），最后才能在服务器级删除该登录名（\`DROP LOGIN\`）。

---

### 三、 考场真题模拟代码实战

\`\`\`sql
-- 1. 删除已离职员工的服务器登录名、旧用户与旧角色
DROP LOGIN OldEmpLogin;
DROP USER OldEmpUser;
DROP ROLE TempAnalystRole;

-- 2. 创建新员工登录名并设置密码
CREATE LOGIN NewEmp WITH PASSWORD = 'SafePassword123!';

-- 3. 在当前数据库创建对应用户并映射登录名
CREATE USER NewEmpUser FOR LOGIN NewEmp;

-- 4. 授予语句级权限（创建表权限，绝对不带 ON）
GRANT CREATE TABLE TO NewEmpUser;

-- 5. 授予对象级权限（查询具体表权限，必须带 ON）
GRANT SELECT ON Student TO NewEmpUser;
\`\`\`

##### 【考点与逻辑拆解】
- **\`DROP LOGIN OldEmpLogin;\`**：
  - 题干要求“删除**登录名**”，DDL 标准语法为 \`DROP LOGIN 对象名\`，填空点填写 **\`LOGIN\`**。
- **\`DROP USER OldEmpUser;\`**：
  - 题干要求“删除**用户**”，DDL 标准语法为 \`DROP USER 对象名\`，填空点填写 **\`USER\`**。
- **\`DROP ROLE TempAnalystRole;\`**：
  - 题干要求“删除**角色**”，DDL 标准语法为 \`DROP ROLE 对象名\`，填空点填写 **\`ROLE\`**。
- **\`CREATE LOGIN NewEmp WITH PASSWORD = '...';\`**：
  - 创建登录名，填空点通常考 **\`LOGIN\`** 或 **\`PASSWORD\`** 关键字。
- **\`CREATE USER NewEmpUser FOR LOGIN NewEmp;\`**：
  - 在当前数据库创建用户并映射登录名，关键填空连接词是 **\`FOR LOGIN\`**。
- **\`GRANT CREATE TABLE TO NewEmpUser;\`**：
  - **语句级权限**：授予建表操作权限，目标表尚未创建，**绝不能带 ON 对象**。
- **\`GRANT SELECT ON Student TO NewEmpUser;\`**：
  - **对象级权限**：授予对具体已存在表的查询权限，**必须带 ON Student**。

---

### 四、 SQL Server 权限两大分类（通杀公式模板）

在 SQL Server 的授权机制中，权限被严格划分为两类：

#### 1. 语句级权限（数据库级权限）
- **特点**：授予用户**执行某种特定 DDL 操作**的权力。此时操作的目标根本还不存在（表还没建出来，自然没有具体的对象实体可以挂载）。
- **典型权限**：\`CREATE TABLE\`、\`CREATE VIEW\`、\`CREATE PROCEDURE\`、\`BACKUP DATABASE\` 等。
- **语法规范**：**绝对不带 \`ON 对象\`**，因为权限直接作用于当前整个数据库上下文。

\`\`\`sql
-- 正确写法（直接 TO 用户）
GRANT CREATE TABLE TO U1;
\`\`\`

#### 2. 对象级权限
- **特点**：授予用户对**已经存在的某个具体数据对象**（表、视图、存储过程等）进行操作的权力。
- **典型权限**：\`SELECT\`、\`INSERT\`、\`UPDATE\`、\`DELETE\`、\`EXECUTE\` 等。
- **语法规范**：**必须带 \`ON 对象名\`**，指定给哪张具体的表或视图。

\`\`\`sql
-- 正确写法（必须指定 ON 具体对象）
GRANT SELECT, UPDATE ON 员工表 TO U1;
\`\`\`

---

### 五、 权限管理三剑客：GRANT、REVOKE、DENY 填空速查

| 操作类型 | 语法结构 | 考点说明与典型示例 |
| :--- | :--- | :--- |
| **授予权限 (GRANT)** | \`GRANT 权限 [ON 对象] TO 主体 [WITH GRANT OPTION];\` | 赋予用户或角色某项权限；若带 \`WITH GRANT OPTION\`，该用户还可将权限再转授他人 |
| **回收权限 (REVOKE)** | \`REVOKE 权限 [ON 对象] FROM 主体 [CASCADE];\` | 收回之前授予的权限；若带 \`CASCADE\`，连同其转授给他人的权限一并级联收回 |
| **明确拒绝 (DENY)** | \`DENY 权限 [ON 对象] TO 主体;\` | 显式禁止用户或角色执行某项操作，优先级最高（拒绝优先于允许） |

---

### 六、 数据库角色和服务器角色

在机考角色授权填空题中，常直接给出具体职权要求，考查填写预定义系统角色名称：

| 级别 | 角色名称 | 核心职责与考点关键词 |
| :--- | :--- | :--- |
| **服务器级角色**<br>(管整个实例) | **\`sysadmin\`** | 最高特权，在 SQL Server 实例上可以执行任何操作（类似 root） |
| | **\`dbcreator\`** | 专门负责创建、更改、除去和还原任何数据库（本题考点） |
| | **\`securityadmin\`** | 管理服务器端登录名（Login）及其权限 |
| | **\`serveradmin\`** | 配置服务器范围的设置（如内存、连接数）、关闭服务器 |
| **数据库级角色**<br>(管单个具体库) | **\`db_owner\`** | 单个数据库内部的最高控制者（全权管理该库所有活动） |
| | **\`db_ddladmin\`** | 在库内执行所有 DDL 语言（CREATE TABLE, ALTER, DROP 表/视图） |
| | **\`db_datareader\`** | 拥有该库所有用户表的 只读（SELECT） 权限 |
| | **\`db_datawriter\`** | 拥有该库所有用户表的 写数据（INSERT, UPDATE, DELETE） 权限 |

> 💡 **考场成员加入语法（挖空）**：
> - 数据库角色添加成员：\`ALTER ROLE 角色名 ADD MEMBER 用户名;\` 或 \`EXEC sp_addrolemember '角色名', '用户名';\`
> - 服务器角色添加成员：\`ALTER SERVER ROLE 角色名 ADD MEMBER 登录名;\` 或 \`EXEC sp_addsrvrolemember '登录名', '角色名';\`

---

### 六、 自主存取控制（DAC）vs 强制存取控制（MAC）及读写规则速查

#### 1. 强制存取控制（MAC）的两大铁律（填空/选择高频考点）
- **读规则（下读）**：**仅当主体的许可证级别大于或等于客体的密级时，主体才能读取相应的客体**（$S_{level} \ge O_{level}$）。
- **写规则（同级写）**：**仅当主体的许可证级别等于客体的密级时，主体才能写相应的客体**（$S_{level} = O_{level}$）。

#### 2. 自主存取控制（DAC）vs 强制存取控制（MAC）全景对比
| 对比维度 | 自主存取控制（DAC） | 强制存取控制（MAC） |
| :--- | :--- | :--- |
| **控制主体** | 用户 / 数据拥有者自主控制 | 系统管理员 / 系统安全策略强制控制 |
| **安全性级别** | 较灵活，但容易受到特洛伊木马等恶意程序的攻击（安全性相对较低，TCSEC 的 C1/C2 级） | 极高，用户不能随意转授权限，防止信息泄露（TCSEC 的 B1 级以上） |
| **实现手段** | GRANT、REVOKE、DENY 语句 | 为主体和客体打上安全密级标签（绝密、机密、秘密、公开） |
| **判定规则** | 查权限表（看该用户是否有此对象的操作权限） | 上下读写规则：下读（主体级别 ≥ 客体密级）、同级写（主体级别 = 客体密级） |`
    },
    {
      id: 'terms-fill-in',
      title: '7. 理论概念与核心术语标准填空题库',
      tag: '术语定式填空',
      highlightedKeywords: [
        '物理独立性',
        '逻辑独立性',
        '原子性',
        '一致性',
        '隔离性',
        '持久性',
        '先写日志原则',
        '可串行化',
        '两段锁协议',
        '锁粒度',
        '意向锁',
        'IS锁',
        'IX锁',
        '锁升级',
        'master',
        'msdb',
        'model',
        'tempdb',
        '无共享',
        '共享内存',
        '共享磁盘',
        '层次结构',
        '训练集',
        '验证集',
        '测试集',
        '模式识别',
        '语句级权限',
        '对象级权限',
        'BigTable',
        '行关键字',
        '列关键字',
        '时间戳',
        '列族',
        'ETL',
        '性能冲突',
        'OLTP',
        '外部项',
        '外部',
        'DISTINCT',
        '过滤重复',
        '预期的事务内部故障',
        '非预期的事务内部故障',
        '全做或全不做',
        '粒度',
        '粒度设计',
        'Granularity',
        'SET',
        '系统结构图',
        '静态结构',
        '动态结构',
        'db_owner',
        'db_datareader',
        'db_datawriter',
        'db_ddladmin',
        'db_denydatareader',
        '索引使用原则',
        '复合索引',
        '值域很大',
        '检查索引的完整性',
        'EXISTS',
        'NOT EXISTS',
        'IN',
        'NOT IN',
        '高可用模式',
        '高保护模式',
        '高性能模式',
        '见证服务器',
        '自动故障转移',
        '手工故障转移',
        '增量维护法',
        '全量维护法',
        '变化量',
        '原有数据基础上',
        '实时维护',
        '延期维护',
        '最小支持度',
        '最小置信度',
        '最小可信度',
        '强关联规则',
        '分片模式',
        '分配模式',
        '局部概念模式',
        'ROLAP',
        'MOLAP',
        'HOLAP',
        'RETURNS',
        'RETURN',
        '标量函数',
        'dbo.',
        '三大可编程对象',
        '概念结构设计',
        '关系模式规范化',
        '系统总体框架设计',
        '事务概要设计',
        '事务详细设计',
        '实施阶段',
        '装入初始数据',
        '系统试运行',
        '数据分配方式',
        '集中式',
        '分割式',
        '全复制式',
        '混合式',
        'ODS',
        'ODS Ⅰ',
        'ODS Ⅱ',
        'ODS Ⅲ',
        'ODS Ⅳ',
        '秒级',
        '小时级',
        '天级',
        '双向流动',
        '数据库管理员的职责',
        '转储和恢复',
        '安全性、完整性控制',
        '检测和改善',
        '重组和重构',
        '内联表值函数',
        '多语句表值函数',
        'RETURNS TABLE',
        '可以传参的视图',
        'DELETED 表',
        'INSERTED 表',
        '存放修改前的旧值',
        '存放修改后的新值',
        'RAID 0',
        'RAID 1',
        'RAID 5',
        'RAID 6',
        'RAID 10',
        '知识发现 (KDD)',
        '数据准备',
        '数据选择',
        '数据预处理/清洗',
        '数据转换',
        'DROP FUNCTION',
        'DROP VIEW',
        'DROP TRIGGER',
        'DROP PROCEDURE',
        'DROP INDEX',
        '以记录为单位的日志文件',
        '以数据块为单位的日志文件',
        '主要数据文件',
        '次要数据文件',
        '事务日志文件',
        '主文件组',
        '自主存取控制 (DAC)',
        '强制存取控制 (MAC)',
        '许可证级别',
        '客体的密级',
        '大于或等于',
        '等于',
        '下读',
        '同级写',
        '特洛伊木马',
        '数据库重组',
        '数据库重构',
        '快照',
        '快照方式',
        '全量抽取',
        '维度数据',
        '增量',
        '流水事实数据',
        '数据库快照',
        '写时复制',
        'Copy-on-Write',
        '六层模式结构',
        '全局概念模式',
        '分片模式',
        '分配模式',
        '局部概念模式',
        '分片透明性',
        '位置透明性',
        '局部数据模型透明性',
        'BACKUP DATABASE',
        'WITH DIFFERENTIAL',
        'BACKUP LOG',
        'RESTORE LOG'
      ],
      content: `### 考场出现率最高的 51 个名词与定式术语填空

在三级填空题中，遇到理论题通常是填写以下标准术语，不得更改词序：

1. **三级模式与两级独立性**：
   - 模式/内模式映射保证了数据的 **物理独立性**（存储结构变了，逻辑模式不变，应用程序不用改）。
   - 外模式/模式映射保证了数据的 **逻辑独立性**（逻辑结构变了，外模式不变，应用程序不用改）。

2. **事务的四大特性（ACID）**：
   - A: **原子性 (Atomicity)** —— 事务是不可分割的数据库逻辑工作单位，**原子性都严格遵循“全做或全不做”**（All or Nothing，事务中包含的操作要么全做，要么全不做）。由恢复管理子系统（Undo/Redo日志）保证。
   - C: **一致性 (Consistency)** —— 事务执行前后数据库处于合法有效状态。
   - I: **隔离性 (Isolation)** —— 由并发控制子系统（封锁机制）保证。
   - D: **持久性 (Durability)** —— 事务一旦提交，对数据的修改是永久的。

3. **并发与封锁协议**：
   - 排他锁又称 **写锁** 或 **X锁**；共享锁又称 **读锁** 或 **S锁**。
   - 对数据加 S 锁后，其他事务**只能读不能写**（只能再加 S 锁）；加 X 锁后，其他事务**不能读也不能写**。
   - **两段锁协议 (2PL)** 要求事务加锁和解锁分为两个阶段：第一阶段只加锁（扩展阶段），第二阶段只解锁（收缩阶段）。两段锁是并发调度 **可串行化** 的充分条件。
   - 解决活锁问题的方法是采用 **先来先服务 (FCFS)** 策略。
   - 封锁粒度层级自顶向下依次为：**数据库 → 数据表 → 区 (Extent) → 数据页 (Page) → 数据行 (Row/RID/Key)**。
   - 封锁粒度权衡规律：粒度越细（如行锁），系统的 **并发度越高**，但维护锁的 **系统开销越大**；粒度越粗（如表锁），系统开销越小，但并发度越低。
   - 为了提高对某个数据对象加表锁时的冲突检测效率，避免逐行遍历扫描，DBMS 引入了 **意向锁 (Intent Lock)**；其中包含 **意向共享锁 (IS)**、**意向排他锁 (IX)** 和 **共享意向排他锁 (SIX)**。
   - 意向锁之间（如 IS 与 IS、IS 与 IX、IX 与 IX）是 **兼容** 的；但任何意向锁与表级 **排他锁 (X)** 均不兼容。
   - 当事务持有的细粒度锁数量超过阈值（如 5000 个）且锁内存紧张时，DBMS 自动将多个细粒度行锁合并为表锁的机制称为 **锁升级 (Lock Escalation)**；锁升级能大幅降低锁内存开销，但会急剧降低并发度并易诱发 **死锁**。

4. **日志、软故障与四大故障类型恢复**：
   - 数据库故障恢复的核心法则是 **先写日志原则**，又称 **WAL原则 (Write-Ahead Logging)**。在将数据写入磁盘之前，必须先将对应的日志记录写入到磁盘中。
   - **数据库发生软故障（系统故障）后**，系统重启时必须且会自动进行 **UNDO（撤销）** 和 **REDO（重做）** 操作（对未提交事务执行撤销，对已提交事务执行重做），**无需管理员人工干预**。
   - 在四大故障中，**事务内部故障** 与 **系统故障（软故障）** 由 DBMS 全自动恢复；而 **介质故障（硬故障）** 与 **病毒/人为破坏** 造成物理损坏或逻辑误删，**必须由管理员人工干预**。

5. **SQL Server 四大系统数据库填空**：
   - \`master\`：记录 SQL Server 的所有系统级信息、元数据、登录账号。
   - \`msdb\`：供 SQL Server Agent（代理服务）调度警报、作业和备份历史。
   - \`model\`：所有用户创建新数据库的 **模板数据库**。
   - \`tempdb\`：保存临时表、临时存储过程，**每次数据库服务重启都会清空并重新创建**，**绝对不能执行备份操作**。

6. **SQL Server 数据库三种恢复模式与日志备份类型填空**：
   - 核心生产库为了保证数据零丢失并支持恢复到任意时间点，应设置为 **完整** 恢复模式。
   - 自动截断并回收事务日志空间、不支持事务日志备份的模式是 **简单** 恢复模式。
   - 批量导入海量数据时，为减少日志文件急剧膨胀，应暂时切换为 **大容量日志** 恢复模式。
   - 仅包含特定时间间隔内的常规事务日志记录、不包含大容量修改数据页的属于 **纯日志备份**（完整恢复模式下的日常定期备份）。
   - 包含日志记录以及由大容量操作修改的数据页的属于 **大容量操作日志备份**（在大容量日志模式批量导入后执行，不允许时点恢复）。
   - 专用于可能已损坏、离线或准备还原的数据库，用于捕获当前活动中尚未备份的最新尾部记录的是 **结尾日志备份**（又称 **尾部日志**，灾难发生后、启动还原操作前执行）。

7. **云计算三大服务模式填空**：
   - 云计算自底向上的三层服务模式依次是 **IaaS**（基础设施即服务）、**PaaS**（平台即服务）和 **SaaS**（软件即服务）。
   - 向用户提供底层计算服务器、虚拟CPU、存储磁盘和虚拟网络的服务属于 **IaaS**。
   - 向用户提供应用程序开发运行环境、中间件以及托管型 **云数据库 RDS** 的服务属于 **PaaS**。
   - 用户直接通过浏览器使用开箱即用的完整在线办公、云邮箱等应用软件属于 **SaaS**。

8. **数据仓库四大特征（八字金句填空）**：
   - 数据仓库是：**面向主题的**、**集成的**、**非易失的（不可更新的）**、**随时间变化的**。

9. **并行数据库架构与数据划分技术填空**：
   - 像发扑克牌一样循环分配元组、数据分布最均匀、最适合全表顺序扫描的划分方式是 **轮转划分 (Round-Robin)**。
   - 通过散列函数计算节点位置、最适合单条记录等值查找（点查询）的划分方式是 **散列划分 (Hash Partitioning)**。
   - 按属性值连续区间划分、最适合连续聚类与范围查询、但极易引起数据倾斜/热点不均的划分方式是 **范围划分 (Range Partitioning)**。
   - 为同时优化两个或多个不同属性上的检索查询，应采用 **二维划分** 或 **多维划分**。
   - 在并行数据库体系结构中，可伸缩性与横向扩展性最好的是 **无共享（Shared-Nothing）** 架构；受内存总线竞争瓶颈限制、扩展性最差的是 **共享内存（Shared-Memory）** 架构。
   - **并行数据库四大体系结构核心考点与原理详细解析**：
     - **无共享（Shared-Nothing）架构**：每个节点拥有完全独立的处理器（CPU）、内存和磁盘，节点间不共享任何物理硬件资源，仅通过高速通信网络传递消息进行协作。消除了一切总线和存储竞争，因此**具有最好的可伸缩性（Scalability）与横向扩展（Scale-out）能力**，是现代海量分布式数据库与 MPP 数仓的标准体系。
     - **共享内存（Shared-Memory）架构**：所有处理器通过高速内部总线共同访问单一全局主存储器（内存）和所有磁盘。处理器间通信延迟极低、数据共享极其简单；但当处理器数量增加时，内存总线带宽成为严重争用瓶颈，因此**可扩展性/可伸缩性最差**（通常很难扩展到数十个以上处理器）。
     - **共享磁盘（Shared-Disk）架构**：所有处理器拥有各自独立私有的内存，各节点通过高速互联网络（如 SAN 存储区域网络）共同访问底层的共享磁盘系统。单节点故障不会导致数据不可用（容错高、高可用性好，典型工业代表如 **Oracle RAC**）；但随着节点数增加，磁盘系统的 I/O 争用以及各节点本地缓存一致性维护开销成为瓶颈，扩展能力中等。
     - **层次结构（Hierarchical / 混合架构，Shared-Disk + Shared-Nothing 混合）**：结合了多种基础架构的两层或多层混合结构体系。通常在**顶层采用无共享（Shared-Nothing）**体系将多个独立集群节点互联，而在**每个独立节点（底层）内部则采用多核共享内存（Shared-Memory）或共享磁盘（Shared-Disk）**体系。既发挥了节点内部内存直连的高效低延迟通信，又获得了集群层面的强大横向伸缩能力，是现代多核多路高性能集群数据库的主流演进架构。

10. **XML 数据库与半结构化数据填空**：
   - XML 属于 **半结构化** 数据，其核心特征是 **自描述性** 和树状层次结构。
   - 仅满足 XML 基本语法规则（如单一根元素、标签正确闭合与嵌套）的文档称为 **良构的 XML（Well-Formed）**。
   - 不仅良构、而且通过了 DTD 或 XML Schema 模式验证的文档称为 **有效的 XML（Valid）**。
   - XML Schema 本身采用 **XML** 语法编写，且支持强数据类型与 **命名空间**。
   - XQuery 查询语言中著名的 FLWOR 表达式对应的五个关键字依次是 **for**、**let**、**where**、**order by**、**return**。
   - 直接以 XML 文档作为基本存储单元、不经过关系表转换映射的数据库称为 **原生 XML 数据库（Native XML Database, NXD）**。

11. **机器学习、模式识别与数据集划分核心填空**：
   - 训练样本带有已知真实标签、旨在预测新样本未知类别或数值的学习范式是 **有监督学习 (Supervised Learning)**；典型代表为 **分类** 与 **回归**。
   - 训练样本无任何人工标注答案、依靠样本内在相似性自动探索聚合规律的学习范式是 **无监督学习 (Unsupervised Learning)**；典型代表为 **聚类分析** 与 **关联规则挖掘**。
   - 在机器学习与模式识别流程中，原始样本集通常被划分为三大互斥子集：
     - 直接用于输入算法模型、拟合和更新模型内部参数（如权重、偏置、分裂超平面）的是 **训练集 (Training Set)**。
     - 用于评估不同算法架构、调节模型超参数（如树深、学习率、正则化系数）并监控判断是否过拟合（执行早停）的是 **验证集 (Validation Set)**。
     - 在模型训练和调优全部完成之后，用于对最终模型进行完全独立、无偏泛化性能测试且**严禁参与任何模型调参**的是 **测试集 (Test Set)**。
   - 算法模型在训练集上拟合完美、但在未知测试集上泛化能力极差的现象称为 **过拟合 (Overfitting)**。
   - 在分类模型评估中，预测为正例中真正为正例的比例称为 **精确率（Precision / 查准率）**；实际正例中被正确检出的比例称为 **召回率（Recall / 查全率）**。
   - 关联规则挖掘的两大核心过滤阈值是 **最小支持度（Support）**（衡量规则普遍性/频繁程度）与 **最小置信度 / 最小可信度（Confidence）**（衡量规则可靠性/准确率）；同时满足这两个最小阈值的规则称为 **强关联规则（或强规则）**。

12. **决策支持系统 (DSS) 核心填空**：
   - 决策支持系统 (DSS) 主要用于解决管理活动中的 **半结构化** 和 **非结构化** 决策问题，其核心定位是 **辅助决策** 而非自动化替代人决策。
   - 传统 DSS 经典三部件结构由 **语言系统 (LS)**、**知识系统 (KS)** 和作为神经中枢的 **问题处理系统 (PPS)** 组成。
   - 现代企业级决策支持系统形成了以 **数据仓库 (DW)** 为数据基础、以 **联机分析处理 (OLAP)** 为多维展现手段、以 **数据挖掘 (DM)** 为高级知识发现工具的综合体系。

13. **元数据管理 (Metadata) 核心填空**：
   - 元数据的经典定义是 **关于数据的数据 (Data about Data)**，是数据仓库与数据治理的神经中枢与活字典。
   - 描述表结构、字段类型、物理存储位置、分区索引、ETL 抽取清洗规则及调度日志的元数据属于 **技术元数据 (Technical Metadata)**。
   - 描述企业业务术语、指标口径计算公式、业务主题域划分以及数据所有者 (Data Owner) 的元数据属于 **业务元数据 (Business Metadata)**。
   - 当源表字段变更时，利用元数据追踪评估对下游所有报表和作业破坏程度的技术称为 **影响分析（或数据血缘追踪）**。`
    },
    {
      id: 'integrity-fill-in',
      title: '8. 完整性约束分类与判定专项填空（粒度与状态）',
      tag: '分类定式必填',
      highlightedKeywords: [
        '列级',
        '元组级',
        '关系级',
        '数据库级',
        '静态',
        '动态',
        '状态变迁',
        '触发器',
        'PRIMARY KEY',
        'FOREIGN KEY'
      ],
      content: `### 完整性约束分类常考填空与定式题库

机考单选题与综合填空中，针对约束粒度与约束状态的设空通常有以下经典形式：

1. **根据约束针对的对象（粒度）分类填空**：
   - 限制单个属性取值范围的约束（如 \`CHECK (Score >= 0)\`）属于 **列级** 完整性约束。
   - 限制同一关系中同一行不同属性之间相互关系的约束（如 \`CHECK (入职日期 <= 离职日期)\`）属于 **元组级** 完整性约束。
   - 保证同一关系中任意两行元组不重复的主键约束（\`PRIMARY KEY\`）属于 **关系级** 完整性约束。
   - 限制两个不同关系模式之间参照引用的外键约束（\`FOREIGN KEY\`）属于 **数据库级** 完整性约束（或称关系间约束）。

2. **根据约束状态分类填空**：
   - 数据库处于某种稳定状态时数据必须满足的约束称为 **静态** 完整性约束。
   - 数据库从一种状态变迁到另一种状态时数据必须满足的约束称为 **动态** 完整性约束（或称 **状态变迁** 约束）。
   - 静态约束通常可直接通过 DDL 中的 \`PRIMARY KEY\`、\`FOREIGN KEY\`、\`CHECK\` 等声明实现；而动态约束（如“员工工资每次调整只能增加不能降低”）通常需要借助 **触发器** (Trigger) 来实现。

3. **四大粒度与状态的组合填空实战**：
   - “学号由10位纯数字构成” ⇒ 静态 **列级** 约束。
   - “实发工资 = 基本工资 + 奖金 - 扣款” ⇒ 静态 **元组级** 约束。
   - “主码属性值唯一且非空” ⇒ 静态 **关系级** 约束。
   - “学生选课表中的学号必须在学生表中存在” ⇒ 静态 **数据库级** 约束。
   - “员工调整后工资不能低于调整前工资” ⇒ 动态 **列级** 约束。`
    },
    {
      id: 'dbas-modeling-fill-in',
      title: '9. DBAS生命周期、IDEF0/IDEF1X与运维专项填空（秒杀口诀版）',
      tag: '高频题眼集训',
      highlightedKeywords: [
        '系统需求规格说明书',
        'SRS',
        '控制',
        '机制',
        '输入',
        '输出',
        '左进右出上控下机',
        '独立实体集',
        '从属实体集',
        '非确定联系',
        '分类联系',
        '事务概要设计',
        '事务详细设计',
        '操作可行性',
        '经济可行性',
        '技术可行性',
        '开发方案可行性',
        '人力资源',
        '投资回报率',
        'read',
        'write',
        '隔离级别',
        '反规范化',
        '备安整存发',
        '规风工评',
        '风险分析',
        '系统吞吐量',
        '响应时间',
        '并发访问量',
        '资源利用率'
      ],
      content: `### DBAS生命周期、需求建模与运维填空速记题库

根据历年三级数据库真题设空规律，总结以下必考定式与口诀式填空：

---

#### 1. 需求分析与建模填空
- 需求分析阶段将业务流程与指标整理固化形成的最终正式工程文档是 **《系统需求规格说明书》**（或 **SRS**）。
- 需求分析建模中，结构化方法通常采用 **DFD（数据流图）** 和 **IDEF0**；面向对象方法采用 **UML**（用例图）。
- **IDEF0 模型的 ICOM 原则（四向箭头口诀：左进右出，上控下机）**：
  - 功能活动矩形框的**上方**箭头表示 **控制** (Control)（规章制度、约束规则、政策标准）；
  - 功能活动矩形框的**下方**箭头表示 **机制** (Mechanism)（执行的人员、软硬件工具、设备、系统）；
  - 功能活动矩形框的**左方**箭头表示 **输入** (Input)（进入并被转换的原材料、待处理数据、请求单）；
  - 功能活动矩形框的**右方**箭头表示 **输出** (Output)（加工转换后产生的结果数据、凭证或报表）。

##### 【IDEF0 功能建模直观举例图】
\`\`\`text
                     【C - Control 控制】（规则/依据/约束）
                     例如：《教学大纲与选课规定》、《学分互认细则》
                                       │
                                       │
                                       ▼
                       ┌───────────────────────────────┐
【I - Input 输入】      │                               │     【O - Output 输出】
（待加工的原材料/数据） │         功能活动 / 加工       │ （加工转换后的产物）
──────────────────────>│                               │──────────────────────>
例如：学生原始选课申请表│   A1. 审核学生选课资格与限额  │ 例如：正式选课确认单 / 
                       │                               │       选课失败退回凭证
                       └───────────────────────────────┘
                                       ▲
                                       │
                                       │
                     【M - Mechanism 机制】（人/物理工具/支持资源）
                     例如：教务管理员、教务选课系统服务器、Oracle数据库
\`\`\`

---

#### 2. IDEF1X 数据建模填空
- 在 IDEF1X 中，自身拥有独立主码、不依赖其他实体的实体集称为 **独立实体集**，用 **直角矩形** 框表示。
- 自身主码必须依赖于父实体主码的实体集称为 **从属实体集**，用 **圆角矩形** 框表示。
- 父表主码进入子表并成为子表主码一部分的联系称为 **标定型** 联系（用 **实线** 表示）。
- 父表主码进入子表仅作为普通外键的联系称为 **非标定型** 联系（用 **虚线** 表示）。
- IDEF1X 中的多对多 (m:n) 联系被称为 **非确定联系**（连线两端带实心圆点）。
- 表示面向对象中“泛化/继承”概念的联系被称为 **分类联系**。

##### 【IDEF1X 核心图元与四大联系直观对比举例图】
\`\`\`text
【图例一：标定型联系 (Identifying) —— 实线 + 实心圆点 + 子实体为圆角从属实体】
父实体主键进入子实体，成为子实体主键(PK)的一部分（横线上方）：
┌──────────────────────────┐                      ╭──────────────────────────╮
│ Department 部门          │                      │ Employee 员工            │
│ (独立实体集: 直角矩形)   │   标定型联系 (实线)  │ (从属实体集: 圆角矩形)   │
├──────────────────────────┤                      ├──────────────────────────┤
│ 部门号 (PK)              │─────────────────────●│ 部门号 (PK, FK1)  <--变成PK│
├──────────────────────────┤                      │ 工号   (PK)              │
│ 部门名称                 │                      ├──────────────────────────┤
│ 办公地点                 │                      │ 姓名, 职务, 薪资         │
└──────────────────────────┘                      ╰──────────────────────────╯

【图例二：非标定型联系 (Non-identifying) —— 虚线 + 实心圆点 + 子实体为直角独立实体】
父实体主键进入子实体，仅作为子实体的普通外键(FK)存在（横线下方）：
┌──────────────────────────┐                      ┌──────────────────────────┐
│ Department 部门          │                      │ Employee 员工            │
│ (独立实体集: 直角矩形)   │  非标定联系 (虚线)   │ (独立实体集: 直角矩形)   │
├──────────────────────────┤                      ├──────────────────────────┤
│ 部门号 (PK)              │- - - - - - - - - - -●│ 工号 (PK)                │
├──────────────────────────┤                      ├──────────────────────────┤
│ 部门名称                 │                      │ 姓名, 职务, 薪资         │
│ 办公地点                 │                      │ 部门号 (FK)  <--仅普通外键│
└──────────────────────────┘                      └──────────────────────────┘

【图例三：非确定联系 (Non-specific) —— 虚线两端均带有实心圆点 (即 m:n 多对多)】
┌──────────────────────────┐                      ┌──────────────────────────┐
│ Student 学生             │   非确定联系 (m:n)   │ Course 课程              │
├──────────────────────────┤                      ├──────────────────────────┤
│ 学号 (PK)                │●- - - - - - - - - - ●│ 课程号 (PK)              │
├──────────────────────────┤ (两端实心圆点=多对多)├──────────────────────────┤
│ 姓名, 性别, 班级         │                      │ 课程名, 学分, 课时       │
└──────────────────────────┘                      └──────────────────────────┘

【图例四：分类联系 (Categorization) —— 泛化/继承关系 (基类与子类)】
                   ┌──────────────────────────┐
                   │  Employee 员工 (基类实体)│
                   ├──────────────────────────┤
                   │ 员工号 (PK)              │
                   ├──────────────────────────┤
                   │ 姓名, 身份证号, 入职日期 │
                   └─────────────┬────────────┘
                                 │
                                ─┴─
                                ○ 类别分辨符 (分类圆圈)
                                ───
                        ┌───────┴───────┐
                        │               │
            ╭───────────┴──────────╮╭───┴──────────────────╮
            │ FullTime 全职员工    ││ PartTime 兼职员工    │
            ├──────────────────────┤├──────────────────────┤
            │ 员工号 (PK, FK)      ││ 员工号 (PK, FK)      │
            ├──────────────────────┤├──────────────────────┤
            │ 基本月薪, 岗位津贴   ││ 约定课时费, 累计工时 │
            ╰──────────────────────╯╰──────────────────────╯
\`\`\`

---

#### 3. DBAS 规划期四大可行性分析填空秒杀
- 在 DBAS 规划与定义阶段，可行性分析主要包含：**操作可行性**、**经济可行性**、**技术可行性** 和 **开发方案可行性**。
- 论证是否具备开发所需的 **各类人员/人力资源**（项目经理、DBA、系统分析员、程序员等）、软硬件支撑资源以及工作环境与组织管理条件，属于 **操作可行性** 分析（核心考查“资源与环境能不能支撑项目的实际运作和实施”）。
- 进行成本/效益评估，关注成本预算、资金来源、**投资回报率 (ROI)**、经济效益与收益期，属于 **经济可行性** 分析（核心考查“钱的问题/投入产出比”）。
- 关注硬件性能指标、系统软件与 **DBMS 选型**、网络通信协议、算法实现难度以及技术风险评估，属于 **技术可行性** 分析（核心考查“技术路线走不走得通、会不会做”）。
- 对比多种可选的技术与实施路线，评估哪种方案最合理，属于 **开发方案可行性** 分析。
- 避坑定式：看到“**人力资源 / 人员配备 / 组织管理机制**” ➔ 认准 **操作可行性**（绝不能选成技术可行性）；看到“**投资回报率 / 成本预算**” ➔ 认准 **经济可行性**；看到“**技术风险 / DBMS选型**” ➔ 认准 **技术可行性**。

---

#### 4. 官方标准 DBAS 生命周期五大阶段填空
- 官方教材标准的 DBAS 软件工程生命周期五大阶段依次是：**规划与定义** → **需求分析** → **系统设计** → **实现与部署** → **运行管理与维护**。
- ⚠️ 考场辨析定式：在三级数据库官方教材中，**“需求分析”是完全独立的一大阶段**，绝不能和“规划与定义”（项目规划）混为一谈！在规划阶段只做目标、范围与可行性论证，尚未深入做需求分析。
- 决定项目做不做、论证四大可行性、确定任务陈述、划定系统目标与范围、确定用户视图与编制开发计划的阶段是 **规划与定义**。
- 深入调研业务做什么、全面剖析数据需求、数据处理需求、业务规则需求与性能需求，建立 DFD/IDEF0 模型并产出《需求规格说明书》(SRS) 与数据字典 (DD) 的是独立的 **需求分析** 阶段。
- 纸上画图设计系统蓝图（概念设计、逻辑设计、物理设计）的阶段是 **系统设计**。
- 把纸面蓝图落地为真实系统与上线的是 **实现与部署** 阶段（实施阶段 Implementation），核心必背包含**四件事**：
  1. **建库建表（执行 DDL）**：创建数据库实例、数据表、视图、索引与完整性约束；
  2. **写代码与联调**：编写应用程序、存储过程、触发器、函数与模块联调集成；
  3. **装入初始数据（上线前）**：历史数据抽取转换、数据清洗与初始数据批量入库加载；
  4. **系统试运行 / 功能测试**：安装部署软硬件、功能与性能测试、用户试运行并切换上线。
- 生产环境长期运维保活（包含数据备份日常运维、索引与参数调优、数据库重组与重构）的阶段是 **运行管理与维护**。
- 考场秒杀题眼：看到“**实施阶段包含的四件事**” ➔ 牢记【**建库建表（执行 DDL）、写代码与联调、装入初始数据（上线前）、系统试运行/功能测试**】；看到“**执行 DDL 创表、装入初始数据、写代码联调、系统试运行**” ➔ 秒填 **实现与部署**（实施阶段，绝不是系统设计或运行管理）；看到“**数据备份、索引调整、数据库重组**” ➔ 秒填 **运行管理与维护**。

---

#### 5. DBAS 功能四层体系结构专项填空
- DBAS 典型分层包含：**表示层**（Presentation）、**业务逻辑层**（Business Logic）、**数据访问层**（Data Access）、**数据持久层 / 数据资源层**（Persistence / Data Resource）。
- 负责用户交互与界面呈现、UI 设计与客户端输入格式校验的是 **表示层**。
- 负责业务规则实现与流程处理、业务工作流与数据运算校验、事务流程控制的是 **业务逻辑层**。
- 为业务逻辑层提供统一的数据操作接口，编写 SQL 查询语句、调用存储过程、封装 CRUD 接口与 ORM 映射的是 **数据访问层**。
- 负责数据的底层物理存储与组织，包括 **数据文件组织结构**（堆文件、顺序文件、聚集文件）、索引结构设计、存储路径与磁盘文件空间分配的是 **数据持久层 / 数据资源层**。
- 考场秒杀题眼：看到“**数据文件组织结构（堆/顺序/聚集文件）**”，所属功能层次必须锁定为 **数据持久层 / 数据资源层**（绝不是数据访问层或业务逻辑层）。

---

#### 6. 阶段并行推进与事务设计填空
- DBAS 推进顺序口诀：**规 → 需 → 概 → 逻 → 物 → 实**。

##### 【双线并行推进对照表】数据层面（数据库设计） vs 行为/程序层面（应用系统设计）
| 阶段 | 数据层面（数据库设计） | 行为/程序层面（应用系统设计） |
| :--- | :--- | :--- |
| **概念设计** | **概念结构设计（E-R 图）** | **系统总体框架设计** |
| **逻辑设计** | **关系模式规范化（转成表与列）** | **事务概要设计、应用程序概要设计** |
| **物理设计** | **存取方法、索引设计、分区、存储空间配置** | **事务详细设计、应用程序详细设计** |

- **题眼秒杀直通**：
  - 问：“**概念设计阶段的数据层面任务与应用层面任务分别是？**” ➔ 数据层面填【**概念结构设计（E-R 图）**】，行为/程序层面填【**系统总体框架设计**】。
  - 问：“**逻辑设计阶段的数据层面任务与应用层面任务分别是？**” ➔ 数据层面填【**关系模式规范化（转成表与列）**】，行为/程序层面填【**事务概要设计、应用程序概要设计**】。
  - 问：“**物理设计阶段的数据层面任务与应用层面任务分别是？**” ➔ 数据层面填【**存取方法、索引设计、分区、存储空间配置**】，行为/程序层面填【**事务详细设计、应用程序详细设计**】。
- 逻辑设计阶段的应用设计任务是 **事务概要设计**，其业务逻辑使用抽象的 **read** 和 **write** 原语描述，不涉及底层并发控制。
- 物理设计阶段的应用设计任务是 **事务详细设计**，需要设置具体的事务 **隔离级别**、**锁粒度** 并编写具体的 **SQL** 语句与存储过程。
- 物理设计阶段为了提高系统的查询与并发性能，常对逻辑模式进行 **反规范化**（如增加冗余列、合并表）。
- 反规范化分割技术考点：采用 **垂直分割** 时，查询所有数据（全部属性）必须使用 **JOIN**（连接）；采用 **水平分割** 时，查询所有数据（全部行记录）必须使用 **UNION**（联合/并集）。

---

#### 7. 系统运维、升级与开发模型填空
- 数据库日常维护的五大核心任务口诀是“**备、安、整、存、发**”，分别对应：数据 **备份与恢复**、系统 **安全性** 控制、数据 **完整性** 维护、**存储空间** 管理和 **并发控制**。
- 凡涉及 DBMS 版本号升级、功能代码扩充、系统架构由单体改为分布式，均属于 **系统升级**；而建删索引、碎片整理、调整缓冲池大小属于 **日常维护与调优**。
- 螺旋模型的四个阶段顺时针推进口诀是“**规 → 风 → 工 → 评**”，即 **规划** → **风险评估** → **工程实现** → **用户评估**；其区别于其他模型的最本质特征是引入了 **风险分析**（或风险评估）。

---

#### 8. UML 建模与用例图、顺序图精细语法填空（高频考点）
- UML 用例与用例之间主要存在的三种关系是：**扩展 (extend)**、**使用 (use / include)** 和 **组合 (composition)**（以及继承泛化）。
- 若两个或多个用例中提取出公共重复的子逻辑，基础用例必定执行该公共用例，此关系属于 **使用关系**（或 **包含关系 include**），带箭头的虚线由 **基础用例** 指向 **被使用/包含用例**。
- 若基础用例仅在满足特定扩展点（Extension Point）的特殊业务条件下才触发补充功能，此关系属于 **扩展关系 (extend)**，带箭头的虚线由 **扩展用例** 指向 **基础用例**（逆向指向）。
- 基础用例对 **扩展用例** 毫无感知，但对 **被使用/被包含用例** 具有强依赖性并感知其执行结果。
- 将多个功能独立、处于不同阶段的细粒度子用例拼装为一个完整复杂业务用例的结构属于 **组合关系 (composition)**。
- 用例图中系统边界采用 **矩形框** 表示，所有用例画在边界 **内部**，所有参与者 (Actor) 画在边界 **外部**；参与者与参与者之间只能存在 **泛化关系**（继承），严禁出现包含或扩展。
- 顺序图（时序图）的 **水平方向（横轴）** 表达对象的 **空间排列分布**（通常从左至右按参与交互先后排列），**垂直方向（纵轴）** 严格表达 **时间的流逝（从上到下按时间单向递增）**。
- 顺序图中从对象底部向下延伸的单条垂直虚线称为 **对象生命线 (Lifeline)**，表示对象的存活时间；生命线上表示对象正在执行操作、拥有控制权的细长矩形条称为 **激活期**（或 **执行规格**）。
- 顺序图中发送方发出后阻塞挂起等待结果的同步消息采用 **实线 + 实心填充三角形箭头 (──▶)**；发送方发出后不等待直接继续执行的异步消息采用 **实线 + 开放单线箭头 (──>)**；执行完毕交还结果的返回消息采用 **虚线 + 开放单线箭头 (┈┈>)**。
- 顺序图中对象生命周期终止、被显式销毁析构的符号是生命线末端的 **大叉号 (×)**，生命线在此处立即截断，下方严禁继续延伸虚线。

---

#### 9. SQL 通配符与 LIKE 模式匹配填空（%、_、[ ]、[^ ]）
- SQL 字符模式匹配与模糊查询使用的核心谓词关键字是 **LIKE**。
- 匹配 **0 到多个任意字符** 的通配符是 **%**（百分号，核心考点）；例如 \`'a%'\` 匹配以 a 开头的任意长字符串。
- 匹配且仅匹配 **单个任意字符** 的通配符是 **_**（下划线）；例如 \`'_a'\` 匹配以任意单个字符开头且第二个字母为 a 的双字符串。
- 匹配 **指定范围或集合中的任意单个字符** 的通配符是 **[ ]**（方括号）；例如 \`'[a-f]'\` 匹配 a 到 f 之间的任意单个字母。
- **不匹配** 指定范围或集合中的任意单个字符的通配符是 **[^ ]**（方括号加脱字符）；例如 \`'[^0-9]'\` 匹配任意单个非数字字符。
- 当查询文本自身包含 \`%\` 或 \`_\` 时，必须使用 **ESCAPE** 关键字显式声明临时转义字符（如 \`WHERE Discount LIKE '%10/%%' ESCAPE '/'\`）。

---

#### 10. 数据库安全主体与对象删除填空秒杀（LOGIN、USER、ROLE）
- 题目说“**删除登录名**” ➔ 填 **LOGIN**（\`DROP LOGIN xxx;\`，服务器实例级安全主体）。
- 题目说“**删除用户**” ➔ 填 **USER**（\`DROP USER xxx;\`，数据库级安全主体）。
- 题目说“**删除角色**” ➔ 填 **ROLE**（\`DROP ROLE xxx;\`，数据库级权限集合容器）。
- 题目说“**创建登录名**” ➔ 填 **LOGIN**（\`CREATE LOGIN xxx WITH PASSWORD = '...';\`）。
- 题目说“**创建用户**” ➔ 填 **USER**（\`CREATE USER xxx FOR LOGIN xxx;\`）。
- 题目说“**创建角色**” ➔ 填 **ROLE**（\`CREATE ROLE xxx;\`）。
- 向角色中添加成员：\`ALTER ROLE 角色名 ADD MEMBER 用户名;\`（或系统存储过程 \`sp_addrolemember\`）。
- 授予权限的关键字是 **GRANT**，连词是 **TO**；回收权限的关键字是 **REVOKE**，连词是 **FROM**；显式禁止权限的关键字是 **DENY**。

---

#### 11. SQL Server 分离与附加数据库考点填空
- **分离数据库** 是指将数据库从 SQL Server 实例中删除，但 **不删除数据库的数据文件和日志文件**。
- 分离数据库的实际作用是让数据库文件 **不受数据库管理系统的管理**，使用户可以将数据库的数据文件和日志文件复制到另一台计算机上或者同一台计算机的其他地方。
- **附加数据库** 就是将分离的数据库重新附加到数据库管理系统中，既可以附加到本机的 **另一个 SQL Server 实例** 上，也可以附加到 **另一台数据库服务器** 上。
- ⚠️ 考场核心约束：在进行分离和附加数据库时，SQL Server 服务应处于 **启动** 状态（绝不能是停止状态）。
- ⚠️ 考场连接约束：系统 **不能分离连接为活动状态的数据库**（必须先切断全部活动连接）。

---

#### 12. 语句级权限 vs 对象级权限考点填空秒杀
- 在 SQL Server 授权机制中，权限被严格划分为两类：**语句级权限（数据库级权限）** 与 **对象级权限**。
- 授予用户执行某种特定 DDL 操作权力的权限是 **语句级权限**（如 \`CREATE TABLE\`、\`CREATE VIEW\`、\`CREATE PROCEDURE\`、\`BACKUP DATABASE\` 等）。
- 语句级权限操作的目标在授权时根本还 **不存在**（表还没建出来，没有具体实体挂载），因此其语法规范中 **绝对不带 ON 对象**，直接 \`GRANT 权限 TO 用户/角色;\`。
- 授予用户对 **已经存在的某个具体数据对象**（表、视图、存储过程等）进行操作的权力是 **对象级权限**（如 \`SELECT\`、\`INSERT\`、\`UPDATE\`、\`DELETE\`、\`EXECUTE\` 等）。
- 对象级权限的语法规范中 **必须带 ON 对象名**，指定给哪张具体的表、视图或存储过程（\`GRANT 权限 ON 具体对象 TO 用户/角色;\`）。
- 考场秒杀题眼：
  - 授权“创建表” ➔ \`GRANT CREATE TABLE TO U1;\`（带 \`ON\` 必错！）；
  - 授权“查询或修改员工表” ➔ \`GRANT SELECT, UPDATE ON 员工表 TO U1;\`（漏写 \`ON\` 必错！）；
  - 授权“执行存储过程” ➔ 属于 **对象级权限**，必须写作 \`GRANT EXECUTE ON 存储过程名 TO U1;\`。

---

#### 13. 日志文件的作用与故障恢复场景填空秒杀
- **事务故障恢复**：**必须** 使用日志文件。核心原因：需要查日志逆向做 **Undo（撤销）**。
- **系统故障（软故障）恢复**：**必须** 使用日志文件。核心原因：需要查日志做 **Undo（撤销未提交事务）+ Redo（重做已提交事务）**。
- **介质故障（动态转储副本）**：**必须** 使用日志文件。核心原因：备份转储时有并发写入，数据处于 **不一致状态**，**必须靠日志修平**。
- **介质故障（静态转储副本）**：**非必须（可不用）** 使用日志文件。核心原因：备份时系统静止无并发事务，数据 **天然一致**，直接倒回副本即可恢复到转储点。

---

#### 14. 云数据库与 BigTable 数据模型核心填空秒杀
- BigTable 是一个 **稀疏的、分布式的、持久化的多维有序映射表**。
- BigTable 表的每个单元格通过 **行关键字**、**列关键字** 和 **时间戳** 三者共同唯一定位。
- 表中的行关键字可以是 **任意的字符串**，且数据严格按照行关键字的 **字典序** 排序。
- 在 BigTable 中，不仅可以随意增减 **行的数量**，在一定的约束条件下，还可以对 **列的数量进行动态扩展**（允许动态增加列，极富弹性）。
- 由列关键字组成的集合被称为 **列族（Column Family）**，它是访问控制和权限管理的基本单位。
- 时间戳记录了每一个数据项所包含的 **不同版本的数据的时间标识**，支持多版本并发控制。

---

#### 15. ETL 抽取根因与 OLTP/OLAP 隔离填空秒杀
- ETL 是英文 **Extract（抽取）**、**Transform（转换）**、**Load（加载）** 的缩写。
- 采用 ETL 工具从 OLTP 业务系统中抽取数据到数据仓库再进行分析利用，而不是直接在 OLTP 中分析的最主要原因是：**解决分析型应用程序与 OLTP 应用程序之间的性能冲突问题（资源争用问题）**。
- OLTP（联机事务处理）面向日常事务，要求高并发、强一致与 **毫秒级快速响应**；
- 分析型应用涉及大规模跨度全表扫描和复杂聚合计算，若直接在 OLTP 运行会导致业务库严重的 **锁表与性能雪崩**，因此必须进行物理隔离。

---

#### 16. DFD 建模四要素与外部项填空秒杀
- DFD（数据流图）建模方法由 **数据流**、**处理**、**数据存储** 和 **外部** 项这 4 种基本元素构成。
- 考场高频命题词眼：数据流图中的数据源（源点）及数据终点（终点/宿）被统称为 **外部项**（或外部实体）。

---

#### 17. DISTINCT 去重专属作用填空秒杀
- 在单个 **SELECT** 查询中，如果结果集包含了大量重复的行，只需在 SELECT 关键字后面紧跟 **DISTINCT**（如 \`SELECT DISTINCT 部门 FROM 员工表\`），系统就会自动 **过滤掉所有重复的元组，只保留唯一的行**。
- **作用范围**：DISTINCT 紧随 SELECT 之后，对后面所有列的 **组合** 去重；
- **聚合函数配合**：**COUNT(DISTINCT 列名)** 先过滤重复值与 NULL，只统计该列不同唯一有效值的数量。

---

#### 18. 开窗函数 OVER (PARTITION BY ... ORDER BY ...) 填空秒杀
- 开窗函数格式：\`函数名() OVER ( [PARTITION BY 分组列] [ORDER BY 排序列 [ASC|DESC]] )\`。
- **与 GROUP BY 的本质区别**：GROUP BY 会折叠行、丢失个体明细；开窗函数 **不改变原始行数，保留全部原始明细**，为每行计算组内聚合值或排名。
- **三大挖空题眼**：
  1. 题干出现“求**各部门/各班级内部**的排名或统计” ➔ 必填 **PARTITION BY 部门/班级**；
  2. 开窗声明关键字必填 **OVER**；
  3. PARTITION BY 与 ORDER BY 之间 **绝不能带逗号**，用空格分隔。

---

#### 19. 预期的事务内部故障 vs 非预期的事务内部故障填空秒杀
- **预期的事务内部故障**：应用程序**能预见到的业务逻辑异常**，并在代码中显式编写了应对逻辑（如：银行转账**余额不足**、电商下单**库存不足**）。
  - **处理方式**：由程序员在业务代码中主动触发 **ROLLBACK（回滚事务）** 并提示用户。
- **非预期的事务内部故障**：应用程序**无法提前预判或自身无法处理**的运行期底层错误（如：并发事务**死锁**被选为牺牲品、**运算溢出**如除以零、**违反完整性约束**如主键冲突/外键非法）。
  - **处理方式**：事务自身无法自救，必须由 **DBMS（数据库管理系统）底层主动介入并强制回滚（UNDO）**。

---

#### 20. 事务原子性（Atomicity）核心定义填空秒杀
- **核心定义**：事务是一个不可分割的数据库逻辑工作单位，**原子性都严格遵循“全做或全不做”**（All or Nothing，即事务中包含的所有操作要么全部执行成功提交，要么全部不执行回滚撤销）。
- **底层保障机制**：由 DBMS 的 **恢复管理子系统（Recovery Manager）** 通过 **Undo/Redo 事务日志** 机制来严格保障。
- **考场经典挖空题眼**：
  - 问：“事务的原子性是指事务中的所有操作严格遵循【**全做或全不做**】。”
  - 问：“在事务执行过程中，如果某个操作失败，系统将撤销已完成的操作，使数据库恢复到事务开始前的状态，这体现了事务的【**原子性**】。”

---

#### 21. 数据仓库粒度设计（Granularity）填空与考点秒杀
- **真题原话填空**：在数据仓库环境中，数据的【**粒度**】（或 **granularity**）设计是一种重要的设计问题，它会影响到数据仓库中数据量以及系统能回答的查询的类型。
- **粒度的核心概念**：粒度是指数据仓库的数据单位中保存数据的**细化或综合程度的级别**。
  - **细化程度越高，粒度级就越小**（保留详尽的操作明细数据）；
  - **细化程度越低，粒度级就越大**（保留综合汇总数据）。
- **两难权衡核心根因**：数据的粒度之所以是主要设计问题，是因为它深深地影响存放在数据仓库中的数据量的大小，同时影响数据仓库所能回答的查询类型。在数据仓库中的**数据量大小与查询的详细程度之间要作出权衡**。
- **粒度级设计的核心考虑因素速记（考点提炼）**：
  - **主要考虑因素**：
    1. **用户查询所涉及数据的最低细节程度**（决定必须保留的底层最小粒度边界）；
    2. **低粒度级数据的规模**（底层流水占 90%+ 存储，直接决定磁盘是否爆满）；
    3. **系统的可用存储空间**（物理硬件容量上限约束）；
    4. **用户查询的平均性能需求**（空间换时间，决定预聚合表层级）。
  - **次要或不需要考虑的因素**：
    1. **高粒度数据所需的存储空间**（属于【次要考虑因素】，因为高度汇总后数据极小，九牛一毛，绝不会存不下）；
    2. **用户查询所涉及数据的最高粒度级**（属于【不需要考虑的因素】，因为只要保留了底层细节，任意最高粒度随时可通过聚合函数动态计算得出）。

---

#### 22. 存储过程单语句 SET 赋值 vs BEGIN...END 块结构填空秒杀
- **为什么能省略 BEGIN...END**：在 T-SQL 存储过程中，\`AS\` 之后如果**仅有一条执行语句**，\`BEGIN\` 和 \`END\` 属于可选语法糖，可彻底省略，直接书写单条 \`SET\` 或 \`SELECT\` 赋值语句。
- **单语句 SET 语法定式**：\`SET @输出变量 = (SELECT 聚合表达式 FROM 表 WHERE 过滤条件);\`
  - **核心考点 1**：标量子查询**必须用圆括号 \`(...)\` 包裹**；
  - **核心考点 2**：\`SET\` 赋值一次只能为一个变量赋值，子查询必须返回单行单列标量值。
- **与 SELECT 赋值的题眼辨析**：
  - \`SELECT @输出变量 = 聚合表达式 FROM 表 ...\`：不带圆括号，支持一次给多个变量批量赋值；
  - \`SET\` 赋值：必须带圆括号，严格单变量赋值。

---

#### 23. UML 表达 DBAS 内部结构的【系统结构图】秒杀
- **真题原句与秒杀答案**：UML 可用于表达 DBAS 的内部结构。全都属于系统结构图的是【**类图、顺序图、通信图**】。
- **教材官方分类逻辑**：
  - 系统内部结构分为 **静态结构** 与 **动态结构** 两大部分；
  - **类图** 用来描述系统的 **静态结构**；
  - **顺序图** 与 **通信图** 用来描述系统的 **动态结构**（对象间消息交互）。
- **干扰项核心排除理由**：
  - **用例图**：属于用户模型视图，描述外部业务功能需求，非内部结构；
  - **状态机图**：描述单个对象的局部生命周期状态变迁，非系统宏观结构；
  - **活动图**：描述业务流程工作流，非系统结构图。

---

#### 24. SQL Server 5 大固定数据库角色口诀秒杀
- **\`db_owner\`**：数据库的“土皇帝”，拥有该数据库内的全部权限。
- **\`db_datareader\`**：只能读（SELECT）全部用户表数据。
- **\`db_datawriter\`**：可以写（INSERT / UPDATE / DELETE）全部用户表数据。
- **\`db_ddladmin\`**：可以执行任何 DDL 语句（CREATE / ALTER / DROP 表、索引等）。
- **\`db_denydatareader\`**：明确拒绝读取任何用户数据（黑名单，DENY 拒绝优先）。

---

#### 25. 索引使用原则（教材五大黄金法则・填空秒杀）
> **索引的使用要恰到好处，其使用原则一般如下：**
1. 经常在查询中作为【**条件**】被使用的列，应为其建立索引。
2. 频繁进行【**排序**】或【**分组**】（即进行 \`group by\` 或 \`order by\` 操作）的列，应为其建立索引。
3. 一个列的【**值域很大**】时，应为其建立索引（基数高、区分度高）。
4. 如果待排序的列有多个，应在这些列上建立【**复合索引**】（组合索引）。
5. 可以使用【**系统工具**】来检查索引的完整性，必要时进行【**修复**】。

---

#### 26. 带括号子查询填空速记模板（EXISTS vs IN 秒杀）
在填空题中遇到带括号的子查询：
- **句式结构对比**：
  - \`WHERE _____ (SELECT * FROM ...)\` ➔ 填 **\`EXISTS\` / \`NOT EXISTS\`**（挖空前无列名）
  - \`WHERE 列名 _____ (SELECT * FROM ...)\` ➔ 填 **\`IN\` / \`NOT IN\`**（挖空前有列名）
- **判定法则**：
  - 题干需求为“**查询满足 / 选了 / 存在某条件**的记录” ➔ 填 **\`EXISTS\`** 或 **\`IN\`**；
  - 题干需求为“**查询不满足 / 没选 / 没参加某条件**的记录” ➔ 填 **\`NOT EXISTS\`** 或 **\`NOT IN\`**。
- **秒杀口诀**：**看挖空前面有没有列名！紧挨 WHERE 填 EXISTS / NOT EXISTS，跟在列名后面 填 IN / NOT IN！**

---

#### 27. 数据库镜像三大模式口诀速查（高可用 / 高保护 / 高性能）
- **官方真题必背原话**：
  数据库镜像是一种简单的策略，具有下列优点：
  1. **增强数据保护功能**。数据库镜像提供完整或接近完整的数据冗余，具体取决于运行模式是高安全性模式还是高性能模式；
  2. **提高数据库的可用性**。发生灾难时，在具有自动故障转移功能的高安全性模式下，自动故障转移可快速使数据库的备用副本在线(而不会丢失数据)。在其他运行模式下，数据库管理员可以选择强制服务(可能丢失数据)，以替代数据库的备用副本；
  3. **提高生产数据库在升级期间的可用性**。
  - **成本代价**：因为数据库镜像技术需要额外存放数据的空间，所以会增加应用成本。
- **三大角色**：主体服务器（对外提供读写）、镜像服务器（热备副本）、见证服务器（仅参与仲裁，无数据）。
- **三大模式秒杀对比**：
  - **高可用模式**：**同步传输** + **必须有见证服务器** ➔ **自动故障转移**（零数据丢失 + 业务不中断）。
  - **高保护模式**：**同步传输** + **无见证服务器** ➔ **手工故障转移**（零数据丢失，需人工介入切机）。
  - **高性能模式**：**异步传输** + **无见证服务器** ➔ **仅支持强制手工故障转移**（追求极致性能，可能丢失少量数据）。
- **秒杀关键点**：只要看到“**自动故障转移**”，必选【**高可用模式**】且必有【**见证服务器**】；只要看到“**异步传输**”，必选【**高性能模式**】！

---

#### 28. 数据仓库更新维护机制填空秒杀（增量维护 vs 完全刷新 / 实时 vs 延期）
- **按数据量范围划分**：
  - **增量维护法**：根据数据源的**“变化量”**、在**“原有数据基础上”**维护（填 **【增量】**）。
  - **全量维护法（完全刷新）**：**“重新计算”**、抛弃原有数据全部重新全量加载。
- **按维护触发时机划分**：
  - **实时维护**：业务源数据一发生改变，**立刻同步**更新数仓。
  - **延期维护**：源数据变化后不立即同步，等到**特定时间段（如深夜批处理）**或**用户查询时**再维护。
- **秒杀题眼**：题干出现“**根据数据源的变化量在维护对象原有数据的基础上对数据进行维护**” ➔ 必填【**增量**】（或增量维护法）！

---

#### 29. 关联规则挖掘两大核心过滤阈值填空速记（支持度 vs 置信度/可信度）
- **两大核心过滤阈值**：
  - **最小支持度（Support）** ➔ 衡量规则的**普遍性 / 频繁程度**（规则包含项集在全部事务中出现的概率，用于过滤小概率偶发事件，确定频繁项集）。
  - **最小置信度 / 最小可信度（Confidence）** ➔ 衡量规则的**可靠性 / 准确率**（在包含前件的事务中出现后件的条件概率，用于衡量规则的真伪与强度）。
- **衍生核心概念**：同时满足这两个最小阈值的规则称为 **强关联规则（或强规则）**。
- **秒杀口诀**：**题干出现“关联规则”、“两个阈值”，看到“最小可信度（置信度）”，另一半必是【支持】（支持度）！看到“同时满足最小支持度与最小置信度”，必填【强关联规则】！**

---

#### 30. 分布式数据库体系结构映像与模式填空速记
- **描述“全局关系 → 数据片段”的映像** ➔ 必填 **【分片】（分片模式 / 分片模式映像）**
- **描述“数据片段 → 物理存放场地 / 节点”的映像** ➔ 必填 **【分配】（分配模式 / 分布模式映像）**
- **场地具有自治性、能独立运行本地 DBMS 的模式** ➔ 必填 **【局部概念】模式（局部概念模式）**
- **秒杀口诀**：**全局到片段填“分片”，片段到场地填“分配”，自治场地运行填“局部概念”！**

---

#### 31. OLAP 的三大实现架构填空速记（ROLAP / MOLAP / HOLAP）
- **基于关系数据库的 OLAP** ➔ 必填 **【ROLAP】（Relational OLAP）**：底层依赖传统关系型数据库（RDBMS），采用星型模式或雪花模式组织。
- **基于多维数组的 OLAP** ➔ 必填 **【MOLAP】（Multidimensional OLAP）**：底层依赖专用多维数据库（MDDB），预计算数据立方体（Cube）。
- **混合型 OLAP** ➔ 必填 **【HOLAP】（Hybrid OLAP）**：高层聚合数据放 MOLAP，底层详单明细放 ROLAP。
- **首字母速记**：**R（关系型） $\longrightarrow$ ROLAP，M（多维型） $\longrightarrow$ MOLAP，H（混合型） $\longrightarrow$ HOLAP！**

---

#### 32. DBAS 核心性能指标速记表与填空命门

| 性能指标（填空必填中文名） | 官方教材标准定义（题眼） | 常用度量单位 / 英文缩写 |
| :--- | :--- | :--- |
| **系统吞吐量** | 系统在单位时间内可以完成的数据库事务数量 | TPS / QPS |
| **响应时间** | 从用户向数据库发出请求，到系统完成操作并返回结果所需的时间 | 秒（s）、毫秒（ms） |
| **并发访问量** | 系统在同一时刻能够支持并处理的并发用户数 / 会话数 | 并发用户数 |
| **资源利用率** | 硬件资源（CPU、内存、磁盘 I/O 等）的使用程度 / 占用百分比 | 百分比（%） |

- **题眼秒杀口诀**：
  - “**单位时间内可以完成的数据库事务数量**” ➔ 必填【**系统吞吐量**】（常用单位：TPS / QPS）
  - “**从用户发出请求到系统返回结果所需的时间**” ➔ 必填【**响应时间**】（常用单位：s / ms）
  - “**同一时刻能够支持并处理的并发用户数/会话数**” ➔ 必填【**并发访问量**】
  - “**硬件资源的使用程度/占用百分比**” ➔ 必填【**资源利用率**】（常用单位：%）

---

#### 33. 用户自定义标量函数 RETURNS 与 RETURN 填空秒杀口诀
- **头部声明返回值类型** ➔ 必填 **【RETURNS】**（带 S，复数/声明形式，如 \`RETURNS INT\`）。
- **函数体尾部退出并返回变量结果** ➔ 必填 **【RETURN】**（不带 S，动词形式，后跟变量名，如 \`RETURN @返回值变量;\`）。
- **调用自定义标量函数时** ➔ 必须显式加架构名前缀 **【dbo.】**（如 \`SELECT dbo.函数名(参数);\`）。
- **秒杀口诀**：**标量函数头部声明带 S（RETURNS），尾部返回不带 S（RETURN），调用必带 dbo.！**

---

#### 34. 三大可编程对象核心区别速查（标量函数 / 存储过程 / 触发器）
| 对象类型 | 创建语法 | 是否带返回值类型 | 题干特征词 |
| :--- | :--- | :--- | :--- |
| **标量函数** | \`CREATE FUNCTION ...\` | **RETURNS int/varchar...（必带）** | **“创建标量函数”**、**“统计并返回一个值”** |
| **存储过程** | \`CREATE PROCEDURE ...\` | **不带 RETURNS** | **“创建存储过程”**、**“执行业务处理”** |
| **触发器** | \`CREATE TRIGGER ... ON 表 FOR/AFTER/INSTEAD OF\` | **无参数、无返回值** | **“当向表中插入/修改时自动触发”** |

---

#### 35. DBAS 阶段与数据/程序双线推进表（概念 / 逻辑 / 物理）
| 阶段 | 数据层面（数据库设计） | 行为/程序层面（应用系统设计） |
| :--- | :--- | :--- |
| **概念设计** | **概念结构设计（E-R 图）** | **系统总体框架设计** |
| **逻辑设计** | **关系模式规范化（转成表与列）** | **事务概要设计、应用程序概要设计** |
| **物理设计** | **存取方法、索引设计、分区、存储空间配置** | **事务详细设计、应用程序详细设计** |

---

#### 36. 实施阶段（Implementation）四件事填空秒杀
- DBAS 实施阶段（实现与部署）**必背包含四件事**：
  1. **建库建表（执行 DDL）**：在 DBMS 中建立实际数据库、数据表、视图和索引。
  2. **写代码与联调**：编写应用程序、存储过程、触发器并进行模块接口联调与系统集成。
  3. **装入初始数据（上线前）**：历史数据抽取转换、数据清洗与批量数据装载入库。
  4. **系统试运行 / 功能测试**：安装部署软硬件环境、测试系统功能与性能、试运行并解决缺陷、切换上线。
- **题眼秒杀**：凡是出现“**建表执行 DDL、编写存储过程与代码、装载数据、试运行**” ➔ 必须锁定为【**实施阶段 / 实现与部署**】！

---

#### 37. 分布式数据库四大数据分配方式填空速记（集中式 / 分割式 / 全复制式 / 混合式）
- **集中式** ➔ **所有数据片段都安排在同一个场地上**。
- **分割式** ➔ **所有数据只有一份，它被分割成若干逻辑片段，每个逻辑片段被指派在一个特定的场地上**（无数据冗余）。
- **全复制式** ➔ **数据在每个场地重复存储。也就是每个场地上都有一个完整的数据副本**（高可用、高并发读取，但更新与维护一致性开销最大）。
- **混合式** ➔ **全局数据被分为若干个数据子集，每个子集都被安排在一个或多个不同的场地上，但是每个场地未必保存所有数据**。这是一种**介于分割式和全复制式之间的分配方式**。
- **题眼直通填空**：
  - “所有数据片段都安排在同一个场地上” ➔ 必填【**集中式**】
  - “所有数据只有一份，分割成若干逻辑片段，每个片段指派在特定场地上” ➔ 必填【**分割式**】
  - “数据在每个场地重复存储，每个场地都有完整的数据副本” ➔ 必填【**全复制式**】
  - “每个子集安排在一个或多个不同场地，介于分割式和全复制式之间” ➔ 必填【**混合式**】

---

#### 38. ODS（操作型数据存储）四类分类填空与真题避坑速记
- **定位**：ODS 是介于业务系统（OLTP）和数据仓库（DW）之间的**缓冲层与操作型集成环境**。
- **前三类按更新速度（从快到慢），第四类按数据流向与类型**：
  - **ODS Ⅰ（秒级 / 准实时）**：业务系统数据一旦变动，几乎同步传到 ODS。出题人常故意将其伪装成“天级更新”来设错（**说 ODS Ⅰ 是天级更新必错**）。
  - **ODS Ⅱ（小时级）**：周期性刷新，如每隔几小时同步一次（**正确**）。
  - **ODS Ⅲ（天级 / 批处理）**：一般隔夜执行批量 ETL 脚本更新，每天一次。出题人常故意将其伪装成“秒级更新”来设错（**说 ODS Ⅲ 是秒级更新必错**）。
  - **ODS Ⅳ（双向流动 / 包含反馈）**：不仅接收上游 OLTP 业务数据，还接收来自下游数据仓库/数据集市反馈的决策和报表数据（**正确**）。
- **题眼秒杀口诀**：**Ⅰ 秒、Ⅱ 时、Ⅲ 天、Ⅳ 双向反馈！**

---

#### 39. 数据库管理员（DBA）核心职责
- **官方真题必背原话**：
  数据库管理员的职责有：
  1. **数据库的转储和恢复**；
  2. **数据库安全性、完整性控制**；
  3. **数据库性能的检测和改善**；
  4. **数据库的重组和重构**。

---

#### 40. 内联表值函数（可以传参的视图）与多语句表值函数对比速记
- **内联表值函数（Inline Table-valued Function）**：
  - **核心本质**：其实就是**“可以传参的视图”**。
  - **代码极简特征**：头部为 \`RETURNS TABLE\`（**无表变量名 @t，无字段清单**）；主体仅一条 \`RETURN (SELECT ...);\`；**严禁写 \`BEGIN ... END\`**，无需 \`INSERT INTO\` 填充。
- **多语句表值函数（Multi-Statement Table-valued Function）**：
  - **复杂特征**：头部声明 \`RETURNS @t TABLE (列名 类型...)\`；**必须有 \`BEGIN ... END\`**；内部通过 \`INSERT INTO @t SELECT ...\` 显式装载数据；最后单独写 \`RETURN;\`。
- **做题填空直通口诀**：
  - “可以传参的视图” ➔ 必填【**内联表值函数**】
  - 内联表值函数返回类型声明 ➔ 必填【**TABLE**】（前面带 \`RETURNS\`）
  - 内联表值函数是否需要 BEGIN...END ➔ 必填【**不需要（严禁使用）**】
  - 表值函数调用位置 ➔ 必填【**FROM**】子句（当做一张普通表来查询或连接）

---

#### 41. 触发器的两张特殊临时表（DELETED 表与 INSERTED 表）
- **操作类型与两张表内容矩阵（考场原题对照）**：

| 操作类型 | DELETED 表中的内容 | INSERTED 表中的内容 |
| :--- | :--- | :--- |
| **INSERT（插入）** | **（无 / 空）** | **存放新插入的数据行** |
| **DELETE（删除）** | **存放刚刚被删除的旧数据行** | **（无 / 空）** |
| **UPDATE（修改）（本题考点）** | **存放修改前（更新前）的旧值** | **存放修改后（更新后）的新值** |

- **填空真题题眼速记**：
  - “当向表中执行 UPDATE 操作时，触发器的 DELETED 表中存放的是” ➔ 必填【**修改前（更新前）的旧值**】
  - “当向表中执行 UPDATE 操作时，触发器的 INSERTED 表中存放的是” ➔ 必填【**修改后（更新后）的新值**】
  - “当执行 INSERT 操作时，DELETED 表中的内容为” ➔ 必填【**（无 / 空）**】
  - “当执行 DELETE 操作时，INSERTED 表中的内容为” ➔ 必填【**（无 / 空）**】
  - 核心记忆口诀：**D 是旧（Delete/Old），I 是新（Insert/New）；UPDATE 修改两头看，旧去 DELETED，新入 INSERTED！**

---

#### 42. 常用 RAID 阵列全景对比与容量容错计算速查（RAID 0/1/5/6/10 必背）
- **计算基准**：假设共有 $N$ 块单盘容量为 $C$ 的硬盘（$N$ 满足该阵列的最低盘数要求）：

| RAID 级别 | 中文名称 | 最少盘数 | 可用容量公式 | 容错/冗余能力（最多允许坏几块） | 读/写性能特征 | 适用数据库场景 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **RAID 0** | **条带化（Striping）** | **2** | **$N \\times C$**（100%） | **0 块**（无冗余，坏一块全完） | 读写极快（吞吐量翻倍） | 临时库、日志暂存、无安全要求的测试环境 |
| **RAID 1** | **镜像（Mirroring）** | **2**（必须是偶数） | **$1 \\times C$**（以2块盘为例，利用率 50%） | **1 块**（坏掉任意一块不丢数据） | 读性能翻倍，写性能与单盘相当 | 存放关键的事务日志文件（Log Files） |
| **RAID 5** | **奇偶校验分布式条带** | **3** | **$(N - 1) \\times C$** | **1 块**（坏掉任意一块不丢数据） | 读性能好；写性能有“写惩罚”（需算校验） | 存放读多写少的数据文件、数据仓库（OLAP） |
| **RAID 6** | **双重奇偶校验** | **4** | **$(N - 2) \\times C$** | **2 块**（坏掉任意两块不丢数据） | 读性能好；写性能进一步下降 | 大容量冷数据归档、数据仓库 |
| **RAID 10(1+0)** | **先镜像后条带** | **4**（必须是偶数） | **$(N / 2) \\times C$**（固定 50%） | 每组镜像可坏 1 块（极限可坏 N/2 块，绝不丢数据） | 读写俱佳，无写惩罚，性能顶级 | 核心 OLTP 业务数据库主力配置（高并发读写） |

- **考场题眼秒杀速记**：
  - “最少需要 3 块硬盘，允许坏 1 块盘” ➔ 必填【**RAID 5**】
  - “可用容量公式为 (N-1)×C” ➔ 必填【**RAID 5**】
  - “双重奇偶校验，最少 4 块盘，允许坏 2 块盘” ➔ 必填【**RAID 6**】
  - “以空间利用率 50% 为代价换取最高安全与顶级性能，OLTP 主力” ➔ 必填【**RAID 10**】
  - “存放关键的事务日志文件（Log Files）” ➔ 必填【**RAID 1**】

---

#### 43. 知识发现（KDD）三大阶段与数据准备细分步骤（本题考点）
- **官方完整流程图**：
  \`1. 数据准备 (Data Preparation)  ──>  2. 数据挖掘 (Data Mining)  ──>  3. 结果的解释评估 (Interpretation & Evaluation)\`
- **第一阶段：数据准备（本题考点）**：
  - **作用**：把杂乱无章的原始业务数据加工成适合挖掘的高质量数据集。
  - **细分三大步骤（常考选择题/填空题）**：
    1. **数据选择（Selection）**：根据挖掘目标挑选相关业务子集。
    2. **数据预处理/清洗（Preprocessing/Cleaning）**：处理缺失值、去除异常噪声数据。
    3. **数据转换（Transformation）**：归一化、降维、离散化，转换成挖掘模型需要的格式。
- **第二阶段：数据挖掘（核心阶段）**：
  - 应用关联规则（Apriori）、分类（决策树/朴素贝叶斯）、聚类（K-Means）等算法，从准备好的数据中抽取隐藏的模式。
- **第三阶段：结果的解释评估**：
  - 剔除无意义的冗余规则，由业务专家对挖掘出的模型进行可视化展现和实际价值评估。
- **考场直通题眼**：
  - “知识发现的第一阶段是” ➔ 必填【**数据准备**】
  - “数据准备的三个细分步骤是” ➔ 必填【**数据选择、数据预处理/清洗、数据转换**】

---

#### 44. 数据库对象“删除/创建......使用 ______ 语句”定式填空（考场送分秒杀）
- **“删除......使用 ______ 语句”**：
  - **删函数** ──> 填 **DROP FUNCTION**
  - **删视图** ──> 填 **DROP VIEW**
  - **删触发器** ──> 填 **DROP TRIGGER**
  - **删存储过程** ──> 填 **DROP PROCEDURE**（或 **DROP PROC**）
  - **删索引** ──> 填 **DROP INDEX**
- **“创建......使用 ______ 语句” 同理**：
  - **建函数** ──> 填 **CREATE FUNCTION**
  - **建视图** ──> 填 **CREATE VIEW**
  - **建触发器** ──> 填 **CREATE TRIGGER**
  - **建存储过程** ──> 填 **CREATE PROCEDURE**（或 **CREATE PROC**）
  - **建索引** ──> 填 **CREATE INDEX**
  - **建表** ──> 填 **CREATE TABLE**
- **做题注意**：SQL 关键字不区分大小写，但填空务必写全单词，切勿错拼漏词。存储过程支持简写 PROC。

---

#### 45. 官方教材的两种日志文件格式（以记录为单位 vs 以数据块为单位）
- **以记录为单位的日志文件（Record-level）**：
  - **记录内容**：每个事务的开始标记（\`BEGIN\`）、事务结束标记（\`COMMIT\` / \`ROLLBACK\`），以及每一次更新操作（包含事务标识、操作类型、操作对象、更新前旧值/前像、更新后新值/后像）。
  - **特点**：粒度细，记录一条一条逻辑记录的变更。
- **以数据块为单位的日志文件（Block-level · 本题考点）**：
  - **记录内容**：事务对数据库的修改直接记录在物理块级别。日志中存放的是**事务标识**以及被更新的数据块在更新前后的**整个物理块镜像（Before Image / After Image）**。
  - **特点**：粒度粗，直接保存整个数据块（Block/Page），恢复时直接用数据块覆盖，但日志膨胀较快。
- **考场直通题眼**：
  - “日志文件中存放事务标识及被更新数据块在更新前后的整个物理块镜像，这种日志文件是” ➔ 必填【**以数据块为单位的日志文件**】（或【**Block-level**】）
  - “记录细粒度的逻辑变更、包含开始/结束标记与更新前后旧值新值的是” ➔ 必填【**以记录为单位的日志文件**】

---

#### 46. 数据库文件类型（.mdf / .ndf / .ldf）与文件组（PRIMARY）机制
- **三类数据库文件标准规范**：
  1. **主要数据文件（Primary Data File · \`.mdf\`）**：每个数据库**有且仅有 1 个**，存放启动信息和系统元数据。**必须建立在主文件组（PRIMARY）中**。
  2. **次要数据文件（Secondary Data File · \`.ndf\`）**：可选，数量为 **0 到多个**，用于分散存储和跨盘负载均衡。未指定文件组时默认归入主文件组。
  3. **事务日志文件（Transaction Log File · \`.ldf\`）**：记录日志恢复信息。**核心铁律：日志文件不属于任何文件组！**
- **考场直通题眼**：
  - “每个数据库中有且仅能有 1 个的数据文件是” ➔ 必填【**主要数据文件**】（或【**.mdf**】）
  - “主要数据文件（.mdf）必须建立在哪个文件组中” ➔ 必填【**主文件组**】（或【**PRIMARY**】）
  - “次要数据文件的扩展名是” ➔ 必填【**.ndf**】
  - “事务日志文件的扩展名是” ➔ 必填【**.ldf**】
  - “事务日志文件属于哪个文件组” ➔ 必填【**不属于任何文件组**】

---

#### 47. 数据库强制存取控制（MAC）规则与 DAC/MAC 全面对比（本题考点）
- **数据库强制存取控制方法的两条核心规则（填空原话标准）**：
  1. **仅当主体的许可证级别大于或等于客体的密级时，主体才能读取相应的客体**；
  2. **仅当主体的许可证级别等于客体的密级时，主体才能写相应的客体**。
- **自主存取控制（DAC）vs 强制存取控制（MAC）对比速查**：
  | 对比维度 | 自主存取控制（DAC） | 强制存取控制（MAC） |
  | :--- | :--- | :--- |
  | **控制主体** | 用户 / 数据拥有者自主控制 | 系统管理员 / 系统安全策略强制控制 |
  | **安全性级别** | 较灵活，但容易受到特洛伊木马等恶意程序的攻击（安全性相对较低，TCSEC 的 C1/C2 级） | 极高，用户不能随意转授权限，防止信息泄露（TCSEC 的 B1 级以上） |
  | **实现手段** | GRANT、REVOKE、DENY 语句 | 为主体和客体打上安全密级标签（绝密、机密、秘密、公开） |
  | **判定规则** | 查权限表（看该用户是否有此对象的操作权限） | 上下读写规则：下读（主体级别 ≥ 客体密级）、同级写（主体级别 = 客体密级） |
- **考场直通题眼**：
  - “强制存取控制中，主体读取相应客体的条件是” ➔ 必填【**主体的许可证级别大于或等于客体的密级**】
  - “强制存取控制中，主体写相应客体的条件是” ➔ 必填【**主体的许可证级别等于客体的密级**】
  - “容易受到特洛伊木马等恶意程序攻击的存取控制是” ➔ 必填【**自主存取控制**】（或【**DAC**】）
  - “为主体分配许可证级别、为客体打上安全密级标签的方法是” ➔ 必填【**强制存取控制**】（或【**MAC**】）

---

#### 48. 数据库重组（Reorganization） vs 数据库重构（Restructuring）
- **核心区别全景速查**：
  | 维度 | 数据库重组（Reorganization） | 数据库重构（Restructuring） |
  | :--- | :--- | :--- |
  | **本质动作** | “大扫除、理碎纸”（只理顺物理存储，不改结构） | “大装修、改户型”（改动了表结构或设计） |
  | **是否修改模式/内模式** | **绝不修改**原设计的逻辑结构（模式）和物理结构（内模式） | **会修改**模式（如拆表、加字段）或内模式（如改存储方式） |
  | **典型工作内容** | 整理磁盘碎片、重建/重新组织索引、回收空闲存储空间、清理溢出区 | 垂直拆分表、水平分表、增加新属性、修改字段数据类型 |
  | **对应用程序的影响** | **完全透明**，应用程序代码一行都不用改 | **可能需要修改视图甚至重写前端业务 SQL** |
- **考场直通题眼**：
  - “绝不修改原设计的逻辑结构和物理结构，只整理磁盘碎片、回收空闲空间的是” ➔ 必填【**数据库重组**】（或【**重组**】）
  - “修改数据模式结构、垂直或水平拆分表、增加新属性的是” ➔ 必填【**数据库重构**】（或【**重构**】）

---

#### 49. 数据仓库抽取方式（快照方式 vs 增量方式）与数据库快照（写时复制）
- **数据仓库数据抽取方式标准定义（填空必背原话）**：
  1. **快照方式（全量抽取）**：数据仓库从源数据库抽取数据时，**若每次抽取都将源数据全部读取并覆盖目标表，这种方式称为【 快照 】方式（或全量抽取）**。在数据仓库环境中，**对于变化频率低、数据量相对稳定的维度数据，通常采用【 快照 】方式获取数据**。
  2. **增量方式（增量抽取）**：**对于数据量极大、频繁发生业务变动的流水事实数据（如交易记录、日志），通常采用【 增量 】方式获取数据**。
- **SQL Server 数据库快照机制（填空必背原话）**：
  - **SQL Server 提供了【 数据库快照 】功能，它是数据库的一个只读的静态视图，基于【 写时复制 】（Copy-on-Write）技术实现**。
- **考场直通题眼**：
  - “若每次抽取都将源数据全部读取并覆盖目标表，这种方式称为” ➔ 必填【**快照**】方式（或【**全量抽取**】）
  - “对于变化频率低、数据量相对稳定的维度数据，通常采用哪种方式获取数据” ➔ 必填【**快照**】
  - “对于数据量极大、频繁发生业务变动的流水事实数据，通常采用哪种方式获取数据” ➔ 必填【**增量**】
  - “SQL Server 数据库快照是数据库的一个只读的静态视图，基于什么技术实现” ➔ 必填【**写时复制**】（或【**Copy-on-Write**】）

---

#### 50. 分布式数据库六层模式结构与三级透明性对应关系
- **六层模式结构（自顶而下标准顺序）与三级透明性对应**：
  1. **全局外模式**（全局应用的用户视图）
  2. **全局概念模式**（描述全体数据的逻辑结构与特征）
     - ⬇️ **【 分片透明性 】**（位于**全局外模式/全局概念模式**与**分片模式**之间，最高级别）
  3. **分片模式**（描述全局关系到数据片段的映像）
     - ⬇️ **【 位置透明性 】**（位于**分片模式**与**分配模式/位置模式**之间，中间级别）
  4. **分配模式**（又称**位置模式**，描述数据片段到物理存放场地的映像）
     - ⬇️ **【 局部数据模型透明性（局部映像透明性） 】**（位于**分配模式**与**局部概念模式**之间，最低级别）
  5. **局部概念模式**（描述全局关系在具体节点上存储的物理片段的逻辑结构）
  6. **局部内模式**（描述在本场地的物理存储细节）
- **考场直通题眼**：
  - “位于全局概念模式与分片模式之间的透明性是” ➔ 必填【**分片透明性**】
  - “位于分片模式与分配模式（位置模式）之间的透明性是” ➔ 必填【**位置透明性**】
  - “位于分配模式与局部概念模式之间的透明性是” ➔ 必填【**局部数据模型透明性**】（或【**局部映像透明性**】）

---

#### 51. 数据库备份与还原 T-SQL 语法开头固定写法与考场关键词速查
- **操作类型与开头语法精准对照表**：
  | 操作类型 | 语法开头固定写法 | 考场关键词 | 核心注意点 / 题眼 |
  | :--- | :--- | :--- | :--- |
  | **完整备份** | \`BACKUP DATABASE 库名 TO ...\` | **完整备份、完整数据库备份** | 备份整个数据库（包括数据和当前日志） |
  | **差异备份** | \`BACKUP DATABASE 库名 TO ... WITH DIFFERENTIAL\` | **差异备份** | **注意末尾必须加 \`WITH DIFFERENTIAL\`**（若漏写则直接变成完整备份） |
  | **日志备份** | \`BACKUP LOG 库名 TO ...\`（本题） | **事务日志备份、日志备份** | **开头必须是 \`BACKUP LOG\`，绝不能写成 \`BACKUP DATABASE\`！** |
  | **还原日志** | \`RESTORE LOG 库名 FROM ...\` | **还原事务日志** | **开头必须是 \`RESTORE LOG\`**，与 \`RESTORE DATABASE\` 严格区分 |
- **考场直通题眼**：
  - “对数据库执行完整备份时，T-SQL 语法开头是” ➔ 必填【**BACKUP DATABASE**】
  - “执行差异备份时，语句末尾必须指定的选项关键字是” ➔ 必填【**WITH DIFFERENTIAL**】
  - “对数据库进行事务日志备份时，T-SQL 语句的固定开头是” ➔ 必填【**BACKUP LOG**】（严禁写 DATABASE）
  - “还原事务日志备份时，T-SQL 语句的固定开头是” ➔ 必填【**RESTORE LOG**】

---

#### 52. 分布式数据库四大分片类型（水平 / 垂直 / 导出 / 混合分片）
- **四大分片定义与考场必背机制**：
  1. **水平分片**：按一定的条件把全局关系的**所有元组划分成若干不相交的子集**，每个子集都是关系的一个片段（基于元组的选择运算）。
  2. **垂直分片**：把一个全局关系的**属性集分成若干子集**，并在这些子集上作**投影运算**，每个投影称为垂直分片（每个垂直分片**必须包含主键**）。
  3. **导出分片（导出水平分片）**：**水平分片的条件不是本关系属性的条件，而是其他关系属性的条件**。
  4. **混合分片**：以上三种方法的混合。可以先水平分片再垂直分片，或先垂直分片再水平分片，或其他形式的分片，**但他们的结果是不相同的**。
- **考场直通题眼**：
  - “按一定条件把全局关系的所有元组划分成若干不相交子集的分片称为” ➔ 必填【**水平分片**】
  - “把全局关系的属性集分成若干子集并在其上作投影运算的分片称为” ➔ 必填【**垂直分片**】
  - “水平分片的条件不是本关系属性的条件，而是其他关系属性的条件，这种分片称为” ➔ 必填【**导出分片**】（或【**导出水平分片**】）
  - “混合分片中，先水平分片再垂直分片与先垂直分片再水平分片的分片结果是” ➔ 必填【**不相同**】（或【**不相同的**】）

---

#### 53. 数据建模标准“三级模型”（概念模型 ➔ 逻辑模型 ➔ 物理模型）
- **自顶向下三层架构定义（高频命门）**：
  1. **概念模型（业务层）**：**面向业务与现实世界，表达实体和业务需求**（如 E-R 图），**不依赖于具体的软硬件平台与具体 DBMS**。
  2. **逻辑模型（中间层，核心采分点）**：**将概念模型转化为特定的数据组织形式**（如关系模型、维度模型/星型模型/雪花模型），**定义表结构、属性字段、关联关系**，独立于具体物理实现。
  3. **物理模型（底层）**：针对**具体的软硬件配置、存储介质、分区方式、索引及物理存储参数**进行具体实现。
- **考场直通题眼**：
  - “将概念模型转化为特定的数据组织形式（如关系模式、维度模式），定义表结构、属性字段和关联关系的是” ➔ 必填【**逻辑模型**】（或【**逻辑设计**】）
  - “面向业务与现实世界，表达实体和业务需求，不依赖具体软硬件的是” ➔ 必填【**概念模型**】（或【**概念设计**】）
  - “针对具体的软硬件配置、存储介质、分区方式、索引及物理存储参数进行具体实现的是” ➔ 必填【**物理模型**】（或【**物理设计**】）

---

#### 54. 数据库三种恢复模式速查对照（简单 / 完整 / 大容量日志模式）
- **三大恢复模式核心特征速记表**：
  | 恢复模式 | 核心特征 | 日志空间与维护 | 考场标志场景 |
  | :--- | :--- | :--- | :--- |
  | **简单恢复模式** | 不支持日志备份，只能还原到完整/差异备份点 | 事务提交后自动截断日志，维护成本极低 | 只读数据库、数据仓库、测试/开发库 |
  | **完整恢复模式** | 记录所有事务细节，支持还原到任意时间点（Point-in-Time） | 日志不会自动释放，必须定期做日志备份，否则日志打满硬盘 | 核心 OLTP 生产交易系统（银行、订单库） |
  | **大容量日志恢复模式** | 针对大批量操作（如 \`BULK INSERT\`）进行最小化日志记录，提升导入性能 | 不能保证还原到任意精细时间点 | 偶尔进行海量数据批处理导入时的临时切换状态 |
- **考场直通题眼**：
  - “不支持日志备份，事务提交后自动截断日志，适用于只读或测试库的模式是” ➔ 必填【**简单恢复模式**】（或【**简单模式**】）
  - “记录所有事务细节，支持还原到任意时间点（Point-in-Time）的模式是” ➔ 必填【**完整恢复模式**】（或【**完整模式**】）
  - “针对大批量操作（如 BULK INSERT）进行最小化日志记录的模式是” ➔ 必填【**大容量日志恢复模式**】（或【**大容量日志模式**】）

---

#### 55. 固定服务器角色与权限（EXEC sp_addsrvrolemember）
- **【解析】** \`EXEC sp_addsrvrolemember\` 是登录账户角色，\`sp_addsrvrolemember\` 是定义好的存储过程，其作用是为登录账户赋角色权限。数据库主要的角色及权限如下表所示。
- **主要角色及权限速查表**：
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
- **考场直通题眼**：
  - “为登录账户赋角色权限的系统存储过程是” ➔ 必填【**sp_addsrvrolemember**】（或【**EXEC sp_addsrvrolemember**】）
  - “具有创建、修改、删除和还原数据库权限的服务器角色是” ➔ 必填【**dbcreator**】
  - “具有执行 BULK INSERT 语句权限的服务器角色是” ➔ 必填【**bulkadmin**】
  - “在 SQL Server 中进行任何活动，权限跨越所有其它固定服务器角色的角色是” ➔ 必填【**sysadmin**】

---

#### 56. 三层浏览器/服务器（B/S）体系结构与物理载体特征
- **三层结构与物理执行位置速记表**：
  | 逻辑层级 | 物理载体 | 常见组件 / 任务 | 执行位置特征 |
  | :--- | :--- | :--- | :--- |
  | **表示层（表现层）** | 客户端浏览器（Browser） | HTML/CSS/JavaScript、表单输入与简单前端校验 | **在客户端执行** |
  | **业务逻辑层** | Web 服务器 / 应用服务器 | 业务规则判断、复杂计算流转、调用 API | **在应用/Web 服务器上执行** |
  | **数据层** | 数据库服务器（Database Server） | 数据持久化存储、存储过程、触发器（Trigger）、约束机制 | **在数据库服务器上执行** |
- **考场直通题眼**：
  - “在三层 B/S 结构中，HTML/CSS/JavaScript、表单输入与前端校验运行在” ➔ 必填【**表示层**】（或【**表现层**】），执行位置为【**在客户端执行**】（载体为【**浏览器**】）
  - “业务规则判断、复杂计算流转运行在” ➔ 必填【**业务逻辑层**】，物理载体为【**Web 服务器**】（或【**应用服务器**】）
  - “数据持久化存储、存储过程、触发器与完整性约束运行在” ➔ 必填【**数据层**】，物理载体为【**数据库服务器**】

---

#### 57. 数据仓库元数据的两大家族对比（技术型元数据 vs 业务型元数据）
- **核心定义**：在数据仓库中，元数据充当“导航图”和“技术说明书”角色，划分为两类：
  - **技术型元数据（Technical Metadata）**：面向**开发人员、DBA、系统管理员**；涵盖表的物理结构（字段名、数据类型、主外键、索引）、ETL抽取与清洗映射规则、数据存储路径、调度作业配置等。
  - **业务型元数据（Business Metadata）**：面向**业务分析师、运营管理层、不懂底层代码的决策者**；涵盖指标与维度的业务口径定义（如“活跃用户”定义、“GMV统计范围”）、业务部门归属、数据所有者、保密等级说明等，充当物理系统与业务人员之间的“翻译官”。
- **速查对比表**：
  | 元数据类型 | 主要受众 | 包含内容 / 特征 | 角色定位 |
  | :--- | :--- | :--- | :--- |
  | **技术型元数据** | 开发人员、DBA、系统管理员 | 表物理结构、ETL抽取清洗规则、存储路径、调度配置 | 底层运行“技术说明书” |
  | **业务型元数据** | 业务分析师、运营管理层、决策者 | 指标与维度业务口径、部门归属、数据所有者、保密等级 | 物理系统与业务人员之间的“翻译官” |
- **考场直通题眼**：
  - “面向业务分析师和决策层，定义指标口径、业务部门归属和数据所有者的是” ➔ 必填【**业务型元数据**】（或【**业务元数据**】）
  - “面向开发人员和 DBA，定义表物理结构、字段名、ETL 映射和存储路径的是” ➔ 必填【**技术型元数据**】（或【**技术元数据**】）

---

#### 58. DBAS 各阶段 UML 图体系与类间关系符号
- **类之间关系与符号速查**：
  | 关系 | 符号 |
  | :--- | :--- |
  | **关联** | 实线 |
  | **聚集** | 实线 + 空心菱形 |
  | **组合** | 实线 + 实心菱形 |
  | **泛化** | 实线 + 空心三角 |
  | **依赖** | 虚线 + 箭头 |
  | **实现** | 虚线 + 空心三角 |
- **类图的组成与数据库逻辑设计转化**：
  - 类（类名、属性、方法/操作）在逻辑设计中转化为【**表**】
  - 关系在逻辑设计中转化为【**外键**】
- **各阶段图表考场题眼**：
  - “用于描述系统、用例和程序模块中逻辑路径执行次序，且可描述并行操作的是” ➔ 必填【**活动图**】
  - “用类图描述系统静态结构，用哪两种图表示系统动态结构” ➔ 必填【**顺序图**】和【**通信图**】
  - “顺序图强调时间，通信图强调” ➔ 必填【**空间**】
  - “相当于系统特定时间快照的是” ➔ 必填【**对象图**】
  - “整个矩形框就是一个生命线，描述时间驱动状态转换的是” ➔ 必填【**时间图**】
  - “将活动图与顺序图融合，在控制流之间连接交互图的是” ➔ 必填【**交互概述图**】
  - “在项目进行集成测试前使用，说明实体组件如何部署到计算机的是” ➔ 必填【**部署图**】（或【**配置图**】）

---

#### 59. DBAS 详细设计、安全架构设计与实施阶段题眼
- **表示层与业务逻辑层详细设计**：
  - “人机界面建议采用什么方法设计” ➔ 必填【**原型迭代法**】
  - “人机界面设计分为三个步骤：初步设计（总体设计）、用户界面细节设计（概要设计）以及” ➔ 必填【**原型设计与改进**】（属于详细设计）
  - “业务逻辑层详细设计包含设计各模块内部处理流程和算法、详细接口以及具体的” ➔ 必填【**数据结构**】
- **应用系统安全架构设计**：
  - “数据安全设计中，防止非法用户对数据库的非法使用，避免数据泄露、篡改、破坏属于” ➔ 必填【**安全性保护**】
  - “保证数据源的正确性、一致性、相容性属于” ➔ 必填【**完整性保护**】
  - “完整性约束条件的作用对象分为三种级别：列、元组和” ➔ 必填【**关系**】
  - “排它锁和共享锁的主要区别是能否” ➔ 必填【**读取被锁的数据对象**】（排它锁只有加锁事务能读写；共享锁其他事务也可读不可写）
  - “避免死锁的五大原则：按照同一顺序访问资源、避免事务交互性、采用小事务模式、尽量使用行锁（记录级锁）以及使用” ➔ 必填【**绑定连接**】
  - “数据库备份与恢复策略包含双机热备（Active/Standby）、数据加密存储以及” ➔ 必填【**数据转储**】（即数据备份）
  - “常见数据加密传输手段包含数字安全证书、对称密钥加密、数字签名以及” ➔ 必填【**数字信封**】
- **DBAS 实施阶段**：
  - “创建数据库时需要考虑的三大因素是：数据库增量大小、访问性能以及” ➔ 必填【**初始空间大小**】
  - “数据装载的三步标准流程是：筛选数据 ➔ 转换数据格式 ➔ ” ➔ 必填【**输入数据**】
  - “数据库系统试运行包括哪两类测试” ➔ 必填【**功能测试**】与【**性能测试**】

---

#### 60. 存储管理器与查询处理器架构职责
- **存储管理器五大子模块**：
  - “负责将物理磁盘的数据页读取并缓存在内存缓冲池中，空间不足时采用 LRU/Clock 算法换出脏页的是” ➔ 必填【**缓冲区管理器**】
  - “负责与操作系统底层文件系统打交道，管理磁盘空间分配与回收块重用的是” ➔ 必填【**文件管理器**】
  - “负责在真正读写底层数据时校验用户访问权限与完整性约束（主键、外键、Check）的是” ➔ 必填【**权限及完整性管理器**】
  - “负责管理并发事务访问，通过加锁（S/X锁）或 MVCC 保证隔离性与一致性的是” ➔ 必填【**事务管理器**】
  - “负责维护事务日志，遵循 WAL 协议并通过 REDO 和 UNDO 保证原子性与持久性的是” ➔ 必填【**日志与恢复管理器**】（或【**恢复管理器**】）
- **查询处理器 vs 存储管理器职责秒杀**：
  - “负责词法/语法分析、关系代数逻辑优化并生成物理执行计划的是” ➔ 必填【**查询处理器**】
  - “存储管理器的根本目标是在保证事务 ACID 和数据安全的前提下，尽量减少昂贵的” ➔ 必填【**磁盘 I/O**】

---

#### 61. SQL Server 备份与恢复机制核心题眼
- **恢复级别与物理文件**：
  - “SQL Server 支持两大恢复级别：数据库（DB）级恢复以及” ➔ 必填【**文件级**】恢复
  - “针对物理文件进行备份还原，可以只恢复已损坏文件的备份类型是” ➔ 必填【**文件备份**】
- **恢复顺序四步法**：
  - “系统发生灾难后，恢复的标准顺序为：恢复最近的完全备份 ➔ 恢复最近的【**差异备份**】（若有） ➔ 恢复差异备份之后的【**日志备份**】（若有） ➔ 恢复数据库”
- **T-SQL 核心选项**：
  - “在执行 BACKUP DATABASE 时，若需要重写覆盖备份介质上的现有备份集，需添加参数 WITH ” ➔ 必填【**INIT**】
  - “在连续还原完全备份、差异备份或日志备份时，表示之后还有备份文件需要恢复，暂不回滚未完成事务的选项是 WITH ” ➔ 必填【**NORECOVERY**】

---

#### 62. 数据库级固定角色权限题眼
- “具有插入、删除和更新数据库中所有用户数据权限的角色是” ➔ 必填【**db_datawriter**】
- “具有添加和删除数据库用户权限的角色是” ➔ 必填【**db_accessadmin**】
- “具有备份和恢复数据库权限的角色是” ➔ 必填【**db_backupoperator**】
- “具有创建数据库对象权限（及全部管理权限）的角色是” ➔ 必填【**db_owner**】

---

#### 63. 自顶而下的分布式数据库六层模式结构标准定义题眼
- “全局应用的用户视图，最终用户看到的是逻辑上完全未分布的表、视图等的是” ➔ 必填【**全局外模式**】
- “描述全体数据的逻辑结构和特征，相当于传统单机数据库概念模式的是” ➔ 必填【**全局概念模式**】
- “描述每个数据片段以及全局关系到片段的映像（决定如何把数据切成水平/垂直片）的是” ➔ 必填【**分片模式**】
- “描述各片段到物理存放场地（节点）的映像（决定哪个切片放到哪台机器上）的是” ➔ 必填【**分配模式**】（或【**位置模式**】）
- “描述全局关系在具体场地（节点）上存储的物理片段的逻辑结构与特征的是” ➔ 必填【**局部概念模式**】
- “描述局部概念模式涉及的数据在本场地的物理存储细节的是” ➔ 必填【**局部内模式**】

---

#### 64. 动态创建新表语句（SELECT ... INTO）
- “在 SQL Server 中，执行语句 \`SELECT 列1, 列2 INTO NewTable FROM 表1\` 时，目标新表 NewTable 在执行该语句之前必须【**不存在**】（系统将自动创建该新表并插入数据）”
- “若只需复制原表的列结构而不需要复制任何数据，可在 SELECT ... INTO 语句末尾追加永远为假的条件：WHERE 【**1 = 0**】”
- “向已经存在的表中追加插入查询结果集，应使用的语法是【**INSERT INTO ... SELECT**】”

---

#### 65. 游标 FETCH 六大动作速记题眼
- “从游标中提取首行记录使用的关键字是” ➔ 必填【**FIRST**】（\`FETCH FIRST\`）
- “从游标中提取尾行记录使用的关键字是” ➔ 必填【**LAST**】（\`FETCH LAST\`）
- “从游标中提取上一行记录使用的关键字是” ➔ 必填【**PRIOR**】（\`FETCH PRIOR\`）
- “游标默认的提取选项，用于推进提取下一行记录的是” ➔ 必填【**NEXT**】（\`FETCH NEXT\`）
- “用于从游标中提取全局绝对第 n 行（负数表示倒数）的是” ➔ 必填【**ABSOLUTE**】（\`FETCH ABSOLUTE n\`）
- “用于从当前游标位置相对移动 n 行进行提取的是” ➔ 必填【**RELATIVE**】（\`FETCH RELATIVE n\`）

---

#### 66. 添加数据库文件语法（ALTER DATABASE ... ADD FILE）
- “向已有数据库中追加数据文件的标准语句开头是：ALTER DATABASE 数据库名 【**ADD FILE**】 ( ... )”
- “在 ADD FILE 语法中，用于指定文件逻辑名称的参数是【**NAME**】，用于指定操作系统层物理绝对路径的参数是【**FILENAME**】”
- “在 ADD FILE 语法中，用于指定文件初始容量的参数是【**SIZE**】，用于指定自动增长比例或大小的参数是【**FILEGROWTH**】”

---

#### 67. SELECT 基本语法格式与子句顺序题眼
- “SELECT 查询语句的标准书写格式依次是：SELECT 查询内容 ➔ 【**FROM**】 表名 ➔ 【**WHERE**】 条件表达式 ➔ 【**GROUP BY**】 待分组的列名 ➔ 【**ORDER BY**】 待排序的列名”
- “在 SELECT 语句中，行级过滤的 WHERE 子句必须书写在分组汇总的【**GROUP BY**】子句之前”
- “在 SELECT 语句中，对最终检索结果进行排序的子句是【**ORDER BY**】，它必须位于整个查询语句的最【**后**】”

---

#### 68. 触发器三大触发时机关键字（AFTER / FOR / INSTEAD OF）题眼
- “在 SQL Server 中，定义后触发器时，关键字【**AFTER**】与关键字【**FOR**】完全等价，均表示在执行完触发语句之后才执行触发器”
- “后触发器（AFTER / FOR）只能定义在【**基表**】上，不能定义在视图上”
- “若要跳过原触发语句改为执行触发器定义的逻辑，或者使复杂视图支持更新，应创建【**INSTEAD OF**】触发器，它可以定义在基表或【**视图**】上”`
    }
  ]
};
