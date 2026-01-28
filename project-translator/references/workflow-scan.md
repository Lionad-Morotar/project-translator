# 扫描项目生成任务清单

## 操作步骤

1. 调用 `node scripts/scan-files.js` 扫描项目，生成待翻译文件清单：
```bash
node scripts/scan-files.js --project-path <项目绝对路径>
```

2. 第一步结束之后，会生成任务清单，一般而言，Agent 应当根据任务清单，按照 [流程：翻译文件](./workflow-translate.md) 逐个完成翻译任务。

## 功能说明

该脚本会：
- 扫描项目中所有 `.md` 和代码文件
- 排除版权文件（LICENSE, COPYRIGHT 等）
- 在 `<项目根目录>/.todo/project-translation-task.md` 中记录所有待翻译文件的绝对路径

## 脚本使用

```bash
node scripts/scan-files.js --project-path <项目绝对路径>
```

## 输出

生成任务清单文件，格式如下：
```markdown
# 待翻译文件清单

- [ ] /workspace/project/src/file1.js
- [ ] /workspace/project/README.md
- [ ] /workspace/project/docs/api.md
```
