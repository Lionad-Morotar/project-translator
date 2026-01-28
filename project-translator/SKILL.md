---
name: project-translator
description: 项目翻译，翻译文档和代码文件，支持批量翻译；更新翻译；拉取更新翻译；对齐上游；添加自定义术语表；
dependency:
  system:
    - npm install
---

# 项目翻译助手

## 前置准备

- NodeJS 环境
- Git 环境（用于冲突检测和版本恢复）
- 配置文件（可选）：在项目根目录创建 `configs/setting.json` 覆盖默认配置

## 工作步骤

1. 加载配置文件：`node scripts/load-config.js`
2. 根据用户需求，从功能清单选择一项功能执行

## 功能清单

### 更新翻译，或拉取更新然后翻译，或对齐上游

如果匹配用户更新翻译需求（即将已翻译项目和 upstream 再次对齐，如拉取更新，然后再翻译项目的需求），执行以下流程：[流程：冲突处理流程](references/workflow-git-conflicts.md)

### 翻译项目（一般情况选这个）

如果匹配用户翻译项目需求，当无特殊参数时，执行以下流程：[流程：扫描项目生成任务清单](references/workflow-scan.md)

### 添加自定义术语表

如果匹配用户需要更新术语表的需求：[流程：添加自定义术语表](references/workflow-add-glossary.md)
