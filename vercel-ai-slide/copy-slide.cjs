"use strict";

/**
 * CI（Git）：リポジトリ全体がクローンされるので canonical（03_…）を優先。
 * CLI（cwd=vercel-ai-slide）：親ディレクトリがアップされないので source/slide.html を使用。
 */
const fs = require("fs");
const path = require("path");

const canonical = path.join(
  path.join(__dirname, ".."),
  "03_申請関連資料",
  "02_添付資料",
  "gpt",
  "04_AI導入提案スライド.html"
);
const bundled = path.join(__dirname, "source", "slide.html");

let src = null;
if (fs.existsSync(canonical)) src = canonical;
else if (fs.existsSync(bundled)) src = bundled;

const outDir = path.join(__dirname, "dist");
const dest = path.join(outDir, "index.html");

if (!src) {
  console.error("[copy-slide] ソースがありません。次を用意してください:");
  console.error("  - （推奨）リポジトリ内:", canonical);
  console.error("  - またはCLI用同梱:", bundled);
  console.error("CLI だけ使う場合: node sync-source.cjs で同期");
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });
fs.copyFileSync(src, dest);
console.log("[copy-slide] ←", src);
console.log("[copy-slide] →", dest);
