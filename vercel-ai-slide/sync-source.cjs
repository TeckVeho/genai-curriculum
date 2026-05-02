"use strict";

/**
 * メイン資料 → vercel-ai-slide/source/slide.html（CLI アップロード用のミラー）
 * Git連携でも canonical が使えるが、単体フォルダで vercel する場合に必須。
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

if (!fs.existsSync(canonical)) {
  console.error("[sync-source] canonical が見つかりません:", canonical);
  process.exit(1);
}
fs.mkdirSync(path.dirname(bundled), { recursive: true });
fs.copyFileSync(canonical, bundled);
console.log("[sync-source] mirrored ->", bundled);
