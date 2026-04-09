/**
 * background.svg を 1920×1080 の PNG に書き出す（NotebookLM 用）
 * 実行: npm run render-png
 */
const sharp = require("sharp");
const path = require("path");

const root = __dirname;

sharp(path.join(root, "background.svg"))
  .resize(1920, 1080)
  .png()
  .toFile(path.join(root, "background.png"))
  .then(() => {
    const fs = require("fs");
    const size = fs.statSync(path.join(root, "background.png")).size;
    console.log("OK: background.png", size, "bytes");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
