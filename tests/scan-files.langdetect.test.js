import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'fs';
import { join } from 'path';

import { scanProject } from '../skills/project-translator/scripts/scan-files.js';
import {
  normalizeTargetLanguage,
  detectLanguageFromText,
  isFileTranslated
} from '../skills/project-translator/scripts/utils/langdetect.js';

const TMP_DIR = join(process.cwd(), 'tmp', 'scan-files-langdetect');

describe('scan-files + langdetect', () => {
  beforeEach(() => {
    if (!existsSync(TMP_DIR)) {
      mkdirSync(TMP_DIR, { recursive: true });
    }
  });

  afterEach(() => {
    if (existsSync(TMP_DIR)) {
      rmSync(TMP_DIR, { recursive: true, force: true });
    }
  });

  it('normalizeTargetLanguage should map 中文 to zh', () => {
    expect(normalizeTargetLanguage('中文')).toBe('zh');
    expect(normalizeTargetLanguage('zh-CN')).toBe('zh');
    expect(normalizeTargetLanguage('English')).toBe('en');
  });

  it('detectLanguageFromText should detect zh/en', () => {
    expect(detectLanguageFromText('这是一个测试文档内容，用于语言识别。')).toBe('zh');
    expect(detectLanguageFromText('This is a test document content for language detection.')).toBe('en');
  });

  it('isFileTranslated should detect files already in target language', () => {
    const chineseFile = join(TMP_DIR, 'chinese.md');
    const englishFile = join(TMP_DIR, 'english.md');
    writeFileSync(chineseFile, '这是中文内容。');
    writeFileSync(englishFile, 'This is English content.');

    const config = {
      targetLanguage: '中文',
      fileFilters: { ignoreGitignore: false, supportedExtensions: ['.md'], excludeFiles: [], excludeDirs: [] }
    };

    expect(isFileTranslated(chineseFile, config)).toBe(true);
    expect(isFileTranslated(englishFile, config)).toBe(false);
  });

  it('scanProject should include all supported files with translated flag', () => {
    const docsDir = join(TMP_DIR, 'docs');
    mkdirSync(docsDir, { recursive: true });

    const chineseFile = join(docsDir, 'cn.md');
    const englishFile = join(docsDir, 'en.md');
    const otherExt = join(docsDir, 'note.txt');
    writeFileSync(chineseFile, '这是中文内容。');
    writeFileSync(englishFile, 'This is English content that should be translated.');
    writeFileSync(otherExt, 'This file should be ignored by extension.');

    const config = {
      targetLanguage: '中文',
      fileFilters: { ignoreGitignore: false, supportedExtensions: ['.md'], excludeFiles: [], excludeDirs: [] }
    };

    const files = scanProject(TMP_DIR, config);
    expect(files).toEqual([
      { path: chineseFile, translated: true },
      { path: englishFile, translated: false }
    ]);
  });
});
