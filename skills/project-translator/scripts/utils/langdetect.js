const fs = require('fs');
const langdetect = require('langdetect');

function normalizeLanguageTag(language) {
  if (!language) return '';
  const value = String(language).trim().toLowerCase();
  if (!value) return '';

  const normalized = value.replace(/_/g, '-');
  const base = normalized.split('-')[0];
  return base;
}

function normalizeTargetLanguage(targetLanguage) {
  if (!targetLanguage) return '';
  const value = String(targetLanguage).trim().toLowerCase();
  if (!value) return '';

  if (value === '中文' || value === '汉语' || value === '简体中文' || value === '繁體中文' || value === '繁体中文') {
    return 'zh';
  }
  if (value === '英文' || value === '英语' || value === 'english') return 'en';
  if (value === '日文' || value === '日语' || value === 'japanese') return 'ja';
  if (value === '韩文' || value === '韩语' || value === 'korean') return 'ko';
  if (value === '俄文' || value === '俄语' || value === 'russian') return 'ru';

  const base = normalizeLanguageTag(value);
  if (base === 'zh' || base === 'en' || base === 'ja' || base === 'ko' || base === 'ru') return base;
  return base || value;
}

function detectLanguageFromText(text) {
  if (!text) return 'unknown';
  const value = String(text);
  if (!value.trim()) return 'unknown';

  try {
    const detected = langdetect.detectOne(value);
    if (!detected) return 'unknown';
    return normalizeLanguageTag(detected) || 'unknown';
  } catch (error) {
    return 'unknown';
  }
}

function readFileHead(filePath, maxBytes) {
  const bytes = Number.isFinite(maxBytes) && maxBytes > 0 ? Math.floor(maxBytes) : 65536;
  const fd = fs.openSync(filePath, 'r');
  try {
    const buffer = Buffer.alloc(bytes);
    const read = fs.readSync(fd, buffer, 0, bytes, 0);
    return buffer.subarray(0, read).toString('utf8');
  } finally {
    fs.closeSync(fd);
  }
}

function detectLanguageFromFile(filePath, config) {
  const maxBytesFromConfig = Number(config?.translation?.langdetectMaxBytes);
  const sample = readFileHead(filePath, Number.isFinite(maxBytesFromConfig) && maxBytesFromConfig > 0 ? maxBytesFromConfig : 65536);
  return detectLanguageFromText(sample);
}

function isTranslatableByLanguage(filePath, config) {
  return !isFileTranslated(filePath, config);
}

function isFileTranslated(filePath, config) {
  const target = normalizeTargetLanguage(config?.targetLanguage || '中文');
  if (!target) return false;

  const maxBytesFromConfig = Number(config?.translation?.langdetectMaxBytes);
  const maxBytes = Number.isFinite(maxBytesFromConfig) && maxBytesFromConfig > 0 ? maxBytesFromConfig : 65536;

  let sample = '';
  try {
    sample = readFileHead(filePath, maxBytes);
  } catch (error) {
    return false;
  }

  const detected = detectLanguageFromText(sample);
  if (detected === 'unknown') return false;

  return normalizeLanguageTag(detected) === normalizeLanguageTag(target);
}

module.exports = {
  normalizeLanguageTag,
  normalizeTargetLanguage,
  detectLanguageFromText,
  detectLanguageFromFile,
  isFileTranslated,
  isTranslatableByLanguage
};
