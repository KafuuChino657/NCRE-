import { Topic } from '../types';
import { strategyTopic } from './topics/strategy';
import { fillInBlanksTopic } from './topics/fillInBlanks';
import { dbasTopic } from './topics/dbas';
import { modelingTopic } from './topics/modeling';
import { umlTopic } from './topics/uml';
import { storageTopic } from './topics/storage';
import { sqlTopic } from './topics/sql';
import { concurrencyTopic } from './topics/concurrency';
import { backupTopic } from './topics/backup';
import { advancedTopic } from './topics/advanced';

export const topics: Topic[] = [
  fillInBlanksTopic,   // 【专区】填空题高频考点与核心模板 (最优先置顶/置前)
  strategyTopic,       // 考试大纲与答题策略
  dbasTopic,           // DBAS生命周期与系统架构
  modelingTopic,       // 概念与逻辑结构设计
  umlTopic,            // UML统一建模语言全景精讲
  storageTopic,        // 物理设计、存储结构与索引技术
  sqlTopic,            // SQL语法、高级查询与编程
  concurrencyTopic,    // 事务并发、锁机制与死锁调优
  backupTopic,         // 备份恢复与系统数据库维护
  advancedTopic        // 分布式、数据仓库与数据挖掘
];
