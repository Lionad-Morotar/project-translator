#!/usr/bin/env node

/**
 * 检测 Git pull 后被更新的已翻译文件
 */

const {
  loadConfig,
  writeTodoFile,
  detectModifiedFiles
} = require('./utils');

// 命令行参数解析
const args = process.argv.slice(2);
const projectPathIndex = args.indexOf('--project-path');

if (projectPathIndex === -1 || projectPathIndex + 1 >= args.length) {
  console.error('错误: 缺少 --project-path 参数');
  process.exit(1);
}

const projectPath = args[projectPathIndex + 1];

// 加载配置
const config = loadConfig(projectPath);
if (!config) {
  console.error('错误: 无法加载配置文件');
  process.exit(1);
}

try {
  // 检测已完成任务对应的已翻译文件是否被修改
  const modifiedFiles = detectModifiedFiles(projectPath, config.targetBranch);

  if (modifiedFiles.length === 0) {
    console.log('没有发现被更新的已翻译文件');
  } else {
    console.log(`发现 ${modifiedFiles.length} 个被更新的已翻译文件：`);
    modifiedFiles.forEach(file => {
      console.log(file);
    });

    // 生成新的任务清单文件
    writeTodoFile(modifiedFiles, config.taskTrackingFile);
  }
} catch (error) {
  console.error(`错误: ${error.message}`);
  process.exit(1);
}
