/**
 * GPT 配布資料（PDF対象ファイル）→ .docx 変換
 * 出力先: ~/Desktop/GPT_配布資料_docx/第XX回/
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { marked } from './node_modules/marked/lib/marked.esm.js';

const require = createRequire(import.meta.url);
const HTMLtoDOCX = require('./node_modules/html-to-docx/dist/html-to-docx.umd.js');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DESKTOP = join(process.env.HOME, 'Desktop', 'GPT_配布資料_docx');

const HEADER = '物流企業特化AI人材育成プログラム「AI活用・業務変革コース（全12回）」';
const FOOTER_TEXT = '株式会社Asiart ｜ 〒108-0074 東京都港区高輪2-11-21-103 ｜ TEL：090-8002-9597 ｜ MAIL：hidehiko.motegi@asiart-tech.com';

const GPT_PDF_FILES = [
  { src: '第01回/業務棚卸しシート（記入用）.md',              dest: '第01回/業務棚卸しシート（記入用）' },
  { src: '第02回/AI入力OK_NGチェックリスト.md',               dest: '第02回/AI入力OK_NGチェックリスト' },
  { src: '第02回/ChatGPT概論まとめシート.md',                  dest: '第02回/ChatGPT概論まとめシート' },
  { src: '第02回/物流倉庫の月次報告書サンプル.md',            dest: '第02回/物流倉庫の月次報告書サンプル' },
  { src: '第03回/Skills設計シート（記入用）.md',               dest: '第03回/Skills設計シート（記入用）' },
  { src: '第04回/環境構築チェックリスト（記入用）.md',        dest: '第04回/環境構築チェックリスト（記入用）' },
  { src: '第05回/Skills vs Codex 判断フローチャート（記入用）.md', dest: '第05回/Skills vs Codex 判断フローチャート（記入用）' },
  { src: '第06回/AI化候補 深掘りカード（記入用）.md',         dest: '第06回/AI化候補 深掘りカード（記入用）' },
  { src: '第06回/Skill 定義書（記入用）.md',                   dest: '第06回/Skill 定義書（記入用）' },
  { src: '第06回/アプリ仕様書（記入用）.md',                  dest: '第06回/アプリ仕様書（記入用）' },
  { src: '第07回/プロトタイプ構築チェックリスト（記入用）.md', dest: '第07回/プロトタイプ構築チェックリスト（記入用）' },
  { src: '第08回/改善記録 & 次回タスクリスト（記入用）.md',   dest: '第08回/改善記録 & 次回タスクリスト（記入用）' },
  { src: '第09回/発表準備シート（記入用）.md',                dest: '第09回/発表準備シート（記入用）' },
  { src: '第12回/ナレッジシート（記入用）.md',                dest: '第12回/ナレッジシート（記入用）' },
];

function buildHtml(title, bodyMd) {
  const body = marked.parse(bodyMd);
  return `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><title>${title}</title>
<style>
  body { font-family: 'Hiragino Kaku Gothic ProN', 'Yu Gothic', sans-serif; font-size: 11pt; line-height: 1.7; }
  h1 { font-size: 18pt; color: #02396B; border-bottom: 2px solid #005BAC; padding-bottom: 4px; }
  h2 { font-size: 14pt; color: #005BAC; border-bottom: 1px solid #005BAC; }
  h3 { font-size: 12pt; color: #02396B; }
  table { border-collapse: collapse; width: 100%; }
  th { background: #02396B; color: #fff; padding: 6px 10px; }
  td { border: 1px solid #C8D8E8; padding: 5px 10px; }
  tr:nth-child(even) td { background: #F0F5FA; }
  code { background: #F0F4F8; padding: 1px 4px; font-family: Menlo, monospace; }
  blockquote { border-left: 4px solid #F58220; padding: 8px 14px; background: #FFF8F0; }
</style>
</head>
<body>
<p style="background:#02396B;color:#fff;padding:6px 12px;font-size:10pt;">${HEADER}</p>
${body}
<hr/>
<p style="font-size:9pt;color:#555;text-align:right;">${FOOTER_TEXT}</p>
</body></html>`;
}

async function run() {
  let ok = 0, ng = 0;
  mkdirSync(DESKTOP, { recursive: true });
  console.log(`\n出力先: ${DESKTOP}\n`);

  for (const file of GPT_PDF_FILES) {
    const srcPath = join(ROOT, '01_GPT', file.src);
    const destDir = join(DESKTOP, dirname(file.dest));
    const baseName = file.dest.split('/').pop();
    const destPath = join(destDir, `${baseName}.docx`);

    if (!existsSync(srcPath)) {
      console.warn(`⚠️  見つかりません: ${file.src}`);
      ng++;
      continue;
    }

    mkdirSync(destDir, { recursive: true });

    try {
      const md = readFileSync(srcPath, 'utf8');
      const html = buildHtml(baseName, md);

      const docxBuffer = await HTMLtoDOCX(html, null, {
        title: baseName,
        lang: 'ja-JP',
        orientation: 'portrait',
        margins: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        font: 'Hiragino Kaku Gothic ProN',
        fontSize: 22,
        table: { row: { cantSplit: true } },
      });

      writeFileSync(destPath, docxBuffer);
      console.log(`✅ ${file.dest}.docx`);
      ok++;
    } catch (err) {
      console.error(`❌ ${file.src}: ${err.message}`);
      ng++;
    }
  }

  console.log(`\n完了: ${ok} 成功 / ${ng} 失敗`);
  console.log(`📁 ${DESKTOP}`);
}

run().catch(console.error);
