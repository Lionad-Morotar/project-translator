#!/usr/bin/env node

/**
 * 扫描项目生成待翻译文件清单
 */

const fs = require('fs');
const path = require('path');
const {
  loadConfig,
  readGitignore,
  isIgnoredByGitignore,
  shouldExcludeFile,
  shouldExcludeDir,
  isSupportedFile,
  isFileTranslated,
  writeTodoFile
} = require('./utils');

/**
 * 递归扫描项目，返回所有支持文件及其翻译状态
 */
function scanProject(projectPath, config) {
  projectPath = path.resolve(projectPath);
  const files = [];

  const ignoreGitignore = config?.fileFilters?.ignoreGitignore || false;
  const gitignorePatterns = ignoreGitignore ? readGitignore(projectPath) : [];

  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (shouldExcludeDir(entry.name, config)) continue;
        scanDir(fullPath);
      } else if (entry.isFile()) {
        if (shouldExcludeFile(entry.name, config)) continue;

        // 检查 .gitignore
        if (ignoreGitignore && isIgnoredByGitignore(fullPath, projectPath, gitignorePatterns)) {
          continue;
        }

        if (isSupportedFile(entry.name, config)) {
          const translated = isFileTranslated(fullPath, config);
          files.push({ path: fullPath, translated });
        }
      }
    }
  }

  scanDir(projectPath);
  return files.sort((a, b) => a.path.localeCompare(b.path));
}

function runCli() {
  const args = process.argv.slice(2);
  const projectPathIndex = args.indexOf('--project-path');

  if (projectPathIndex === -1 || projectPathIndex + 1 >= args.length) {
    console.error('错误: 缺少 --project-path 参数');
    process.exit(1);
  }

  const projectPath = args[projectPathIndex + 1];

  const config = loadConfig(projectPath);
  if (!config) {
    console.error('错误: 无法加载配置文件');
    process.exit(1);
  }

  const taskTrackingFile = config.taskTrackingFile || '.todo/project-translation-task.md';
  const defaultOutputPath = path.join(path.resolve(projectPath), taskTrackingFile);

  if (!fs.existsSync(projectPath)) {
    console.error(`错误: 项目路径不存在: ${projectPath}`);
    process.exit(1);
  }

  const files = scanProject(projectPath, config);
  writeTodoFile(files, defaultOutputPath);
}

if (require.main === module) {
  runCli();
}

module.exports = {
  scanProject
};
