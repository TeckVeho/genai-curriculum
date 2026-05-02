# AI導入提案スライド（Vercel デプロイ用）

[`03_申請関連資料/02_添付資料/gpt/04_AI導入提案スライド.html`](../03_申請関連資料/02_添付資料/gpt/04_AI導入提案スライド.html) をビルド時に `dist/index.html` へコピーし、サイトのルート `/` で表示します。**編集するのはソース HTML のみ**でよいです。

## 必要条件

- [Vercel CLI](https://vercel.com/docs/cli)（`npm i -g vercel` など）
- Node.js（`copy-slide.cjs` 実行用。Vercel 上も同様）

## メイン資料を編集したあと（`vercel` CLI のみ運用）

サブフォルダだけアップロードされるため、その前に **`source/slide.html` へミラー同期** が必要です。

```bash
cd vercel-ai-slide
npm run sync
```

## ローカルでビルド確認

```bash
cd vercel-ai-slide
npm run sync   # CLI 運用では推奨
npm run build
open dist/index.html
```

## 初回デプロイ

```bash
cd vercel-ai-slide
vercel login
vercel
```

対話でプロジェクト名・スコープを選べばプレビュー URL が発行されます。

## 本番 URL

```bash
cd vercel-ai-slide
vercel --prod
```

## Vercel ダッシュボードで Git 連携する場合

リポジトリ全体がクローンされるため、`copy-slide.cjs` は **`03_申請関連資料/.../04_AI導入提案スライド.html` を直接参照**できます（`source/slide.html` は必須ではありません）。

- **Root Directory** を `vercel-ai-slide` に設定する
- Install Command / Build Command / Output Directory は `vercel.json` の値を利用（または Build: `node copy-slide.cjs`、Output: `dist`）

## CLI で本番に上げる手順の例

```bash
cd vercel-ai-slide
npm run predeploy    # sync + copy（ソースを確実に同梱）
vercel deploy --prod --yes
```

## 注意

- ソース HTML を更新したあと、再デプロイすると反映されます（Git 連携なら push、CLI なら再実行）。
