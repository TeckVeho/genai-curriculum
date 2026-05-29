/**
 * 配布資料 MD → HTML/PDF 再生成（GPT / Claude 共通）
 * フッター: 株式会社Asiart
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const FOOTER = `株式会社Asiart　｜　〒108-0074 東京都港区高輪2-11-21-103<br>
  TEL：090-8002-9597　MAIL：hidehiko.motegi@asiart-tech.com`;

const COURSES = [
  {
    id: 'gpt',
    base: join(ROOT, '01_GPT'),
    dist: join(ROOT, '01_GPT/配布資料'),
    header: '物流企業特化AI人材育成プログラム「AI活用・業務変革コース（全12回）」',
    colors: { main: '#005BAC', navy: '#02396B', accent: '#F58220' },
    files: [
      { src: '第01回/業務棚卸しシート（記入用）.md', dest: '第01回/業務棚卸しシート（記入用）', format: 'pdf' },
      { src: '第01回/業務棚卸しシート（記入例）.md', dest: '第01回/業務棚卸しシート（記入例）', format: 'html' },
      { src: '第02回/AI入力OK_NGチェックリスト.md', dest: '第02回/AI入力OK_NGチェックリスト', format: 'pdf' },
      { src: '第02回/ChatGPT概論まとめシート.md', dest: '第02回/ChatGPT概論まとめシート', format: 'pdf' },
      { src: '第02回/物流倉庫の月次報告書サンプル.md', dest: '第02回/物流倉庫の月次報告書サンプル', format: 'pdf' },
      { src: '第03回/Skills設計シート（記入用）.md', dest: '第03回/Skills設計シート（記入用）', format: 'pdf' },
      { src: '第04回/GitHub・Codex Web 環境構築手順書.md', dest: '第04回/GitHub・Codex Web 環境構築手順書', format: 'html' },
      { src: '第04回/環境構築チェックリスト（記入用）.md', dest: '第04回/環境構築チェックリスト（記入用）', format: 'pdf' },
      { src: '第05回/Skills vs Codex 判断フローチャート（記入用）.md', dest: '第05回/Skills vs Codex 判断フローチャート（記入用）', format: 'pdf' },
      { src: '第06回/AI化候補 深掘りカード（記入例）.md', dest: '第06回/AI化候補 深掘りカード（記入例）', format: 'html' },
      { src: '第06回/AI化候補 深掘りカード（記入用）.md', dest: '第06回/AI化候補 深掘りカード（記入用）', format: 'pdf' },
      { src: '第06回/Skill 定義書（記入用）.md', dest: '第06回/Skill 定義書（記入用）', format: 'pdf' },
      { src: '第06回/アプリ仕様書（記入用）.md', dest: '第06回/アプリ仕様書（記入用）', format: 'pdf' },
      { src: '第07回/Codex トラブルシューティング参考資料.md', dest: '第07回/Codex トラブルシューティング参考資料', format: 'html' },
      { src: '第07回/プロトタイプ構築チェックリスト（記入用）.md', dest: '第07回/プロトタイプ構築チェックリスト（記入用）', format: 'pdf' },
      { src: '第08回/改善記録 & 次回タスクリスト（記入用）.md', dest: '第08回/改善記録 & 次回タスクリスト（記入用）', format: 'pdf' },
      { src: '第09回/GitHub Pages デプロイ手順書.md', dest: '第09回/GitHub Pages デプロイ手順書', format: 'html' },
      { src: '第09回/発表準備シート（記入用）.md', dest: '第09回/発表準備シート（記入用）', format: 'pdf' },
      { src: '第12回/ナレッジシート（記入用）.md', dest: '第12回/ナレッジシート（記入用）', format: 'pdf' },
    ],
  },
  {
    id: 'claude',
    base: join(ROOT, '02_Claude'),
    dist: join(ROOT, '02_Claude/配布資料'),
    header: '物流事務DX人材育成プログラム「Claude AI活用・業務変革コース（全12回）」',
    colors: { main: '#1A3A5C', navy: '#1A3A5C', accent: '#F57C00' },
    files: [
      { src: '第01回/業務棚卸しシート（記入用）.md', dest: '第01回/業務棚卸しシート（記入用）', format: 'pdf' },
      { src: '第01回/業務棚卸しシート（記入例）.md', dest: '第01回/業務棚卸しシート（記入例）', format: 'html' },
      { src: '第02回/AI入力OK_NGチェックリスト.md', dest: '第02回/AI入力OK_NGチェックリスト', format: 'pdf' },
      { src: '第02回/Claude概論まとめシート.md', dest: '第02回/Claude概論まとめシート', format: 'pdf' },
      { src: '第02回/物流倉庫の月次報告書サンプル.md', dest: '第02回/物流倉庫の月次報告書サンプル', format: 'pdf' },
      { src: '第03回/Coworkタスク設計メモ（記入用）.md', dest: '第03回/Coworkタスク設計メモ（記入用）', format: 'pdf' },
      { src: '第04回/Coworkデータ処理チェックリスト（記入用）.md', dest: '第04回/Coworkデータ処理チェックリスト（記入用）', format: 'pdf' },
      { src: '第05回/Coworkソリューション設計フローチャート（記入用）.md', dest: '第05回/Coworkソリューション設計フローチャート（記入用）', format: 'pdf' },
      { src: '第06回/AI化候補 深掘りカード（記入例）.md', dest: '第06回/AI化候補 深掘りカード（記入例）', format: 'html' },
      { src: '第06回/AI化候補 深掘りカード（記入用）.md', dest: '第06回/AI化候補 深掘りカード（記入用）', format: 'pdf' },
      { src: '第06回/Coworkタスク設計書（記入用）.md', dest: '第06回/Coworkタスク設計書（記入用）', format: 'pdf' },
      { src: '第07回/Coworkトラブルシューティング参考資料.md', dest: '第07回/Coworkトラブルシューティング参考資料', format: 'html' },
      { src: '第07回/Coworkプロトタイプ構築チェックリスト（記入用）.md', dest: '第07回/Coworkプロトタイプ構築チェックリスト（記入用）', format: 'pdf' },
      { src: '第08回/改善記録 & 次回タスクリスト（記入用）.md', dest: '第08回/改善記録 & 次回タスクリスト（記入用）', format: 'pdf' },
      { src: '第09回/発表準備シート（記入用）.md', dest: '第09回/発表準備シート（記入用）', format: 'pdf' },
      { src: '第12回/ナレッジシート（記入用）.md', dest: '第12回/ナレッジシート（記入用）', format: 'pdf' },
    ],
  },
];

function buildHtml(title, body, course, isPrint) {
  const { main, navy, accent } = course.colors;
  const printCss = isPrint
    ? `@media print {
      body { margin: 0; padding: 10mm 15mm; font-size: 11pt; }
      h1 { font-size: 18pt; } h2 { font-size: 14pt; } h3 { font-size: 12pt; }
      table { font-size: 10pt; } a { color: inherit; text-decoration: none; }
    }
    @page { size: A4; margin: 15mm; }`
    : '';

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    :root { --main: ${main}; --navy: ${navy}; --accent: ${accent}; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', sans-serif;
      font-size: 14px; line-height: 1.7; color: #1a1a1a;
      background: #fff; padding: 32px 40px; max-width: 960px; margin: 0 auto;
    }
    .doc-header {
      background: var(--navy); color: #fff; padding: 10px 20px;
      margin: -32px -40px 28px; font-size: 12px;
      display: flex; align-items: center; gap: 16px;
    }
    .doc-header .badge {
      background: var(--accent); color: #fff; padding: 2px 10px;
      border-radius: 3px; font-weight: bold; font-size: 11px; white-space: nowrap;
    }
    h1 {
      font-size: 22px; font-weight: bold; color: var(--navy);
      border-left: 5px solid var(--main); padding: 8px 14px; margin: 28px 0 18px;
      background: #EFF5FC;
    }
    h2 {
      font-size: 17px; font-weight: bold; color: var(--main);
      border-bottom: 2px solid var(--main); padding-bottom: 4px; margin: 24px 0 12px;
    }
    h3 {
      font-size: 14px; font-weight: bold; color: var(--navy);
      margin: 18px 0 8px; padding-left: 10px; border-left: 3px solid var(--accent);
    }
    p { margin: 8px 0; }
    ul, ol { padding-left: 20px; margin: 8px 0; }
    li { margin: 3px 0; }
    a { color: var(--main); }
    table { border-collapse: collapse; width: 100%; margin: 14px 0; font-size: 13px; }
    th { background: var(--navy); color: #fff; padding: 8px 12px; text-align: left; font-weight: bold; }
    td { border: 1px solid #C8D8E8; padding: 7px 12px; vertical-align: top; }
    tr:nth-child(even) td { background: #F0F5FA; }
    code { background: #F0F4F8; padding: 1px 6px; border-radius: 3px; font-family: Menlo, Consolas, monospace; font-size: 12px; }
    pre { background: #1E2A3A; color: #E8F0FE; padding: 16px; border-radius: 6px; overflow-x: auto; margin: 12px 0; }
    pre code { background: none; color: inherit; padding: 0; }
    blockquote {
      border-left: 4px solid var(--accent); background: #FFF8F0;
      padding: 10px 16px; margin: 12px 0; color: #444; border-radius: 0 4px 4px 0;
    }
    hr { border: none; border-top: 1px solid #D0DCE8; margin: 22px 0; }
    strong { color: var(--navy); }
    .doc-footer {
      margin-top: 32px; padding-top: 12px; border-top: 1px solid #D0DCE8;
      font-size: 11px; color: #555; text-align: right; line-height: 1.6;
    }
    ${printCss}
  </style>
</head>
<body>
  <div class="doc-header">
    <span class="badge">配布資料</span>
    <span>${course.header}</span>
  </div>
  ${body}
  <div class="doc-footer">${FOOTER}</div>
</body>
</html>`;
}

function mdToHtmlBody(mdPath) {
  const md = readFileSync(mdPath, 'utf8');
  const tmp = `/tmp/md-${Date.now()}.md`;
  writeFileSync(tmp, md, 'utf8');
  try {
    return execSync(`npx --yes marked --gfm "${tmp}"`, {
      maxBuffer: 10 * 1024 * 1024,
      timeout: 30000,
    }).toString();
  } finally {
    try { execSync(`rm -f "${tmp}"`); } catch { /* ignore */ }
  }
}

function htmlToPdf(htmlPath, pdfPath) {
  execSync(
    `"${CHROME}" --headless --disable-gpu --no-sandbox --print-to-pdf="${pdfPath}" --no-pdf-header-footer --print-to-pdf-no-header "file://${htmlPath}" 2>/dev/null`,
    { timeout: 60000 }
  );
}

function generateCourse(course) {
  let ok = 0;
  let ng = 0;
  console.log(`\n=== ${course.id.toUpperCase()} ===`);

  for (const file of course.files) {
    const srcPath = join(course.base, file.src);
    const destDir = join(course.dist, dirname(file.dest));
    const baseName = file.dest.split('/').pop();

    if (!existsSync(srcPath)) {
      console.warn(`⚠️  見つかりません: ${file.src}`);
      ng++;
      continue;
    }

    mkdirSync(destDir, { recursive: true });

    try {
      const body = mdToHtmlBody(srcPath);

      if (file.format === 'html') {
        const htmlPath = join(destDir, `${baseName}.html`);
        writeFileSync(htmlPath, buildHtml(baseName, body, course, false), 'utf8');
        console.log(`✅ HTML: ${file.dest}.html`);
      } else {
        const tmpHtml = join(destDir, `_tmp_${baseName}.html`);
        const pdfPath = join(destDir, `${baseName}.pdf`);
        writeFileSync(tmpHtml, buildHtml(baseName, body, course, true), 'utf8');
        htmlToPdf(tmpHtml, pdfPath);
        execSync(`rm -f "${tmpHtml}"`);
        console.log(`✅ PDF:  ${file.dest}.pdf`);
      }
      ok++;
    } catch (err) {
      console.error(`❌ ${file.src}: ${err.message}`);
      ng++;
    }
  }

  console.log(`${course.id}: ${ok} 成功 / ${ng} 失敗`);
  return { ok, ng };
}

for (const course of COURSES) {
  generateCourse(course);
}
