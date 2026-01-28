#!/usr/bin/env node

/**
 * 加载配置文件
 */

const fs = require('fs');
const path = require('path');
const { loadConfig } = require('./utils');

// 命令行参数解析
const args = process.argv.slice(2);
const projectPathIndex = args.indexOf('--project-path');

const projectPath = (projectPathIndex === -1)
  ? '.'
  : args[projectPathIndex + 1];

try {
  const config = loadConfig(projectPath);
  console.log(JSON.stringify(config, null, 2));
} catch (error) {
  console.error(`错误: ${error.message}`);
  process.exit(1);
}
