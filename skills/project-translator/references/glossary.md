# 术语表流程

## 可用术语表

- 智能体领域: `glossary/agent.skill.toml` 智能体领域的术语表，相关"agent"、"skill"、"智能体"等关键词

## 步骤

1. 主代理读取可用术语表
2. 在翻译文件前，主代理向子代理发送可用术语表名称、描述、一句话描述每一个术语表在什么翻译场景可用、翻译规则

### 翻译规则

术语表条目由以下字段组成：term、action、transition、reason

- term：术语表中的术语，如 "bug"、"commit" 等
- action：指定术语的翻译行为，可选值为 "keep" 或 "translate"，分别意味着保留原文不翻译或强制翻译为指定中文
- transition：指定术语的翻译结果，仅在 action 为 "translate" 时有效
- reason：对术语的翻译行为的解释，元属性，仅用于文档和调试，不应包含在翻译结果中
