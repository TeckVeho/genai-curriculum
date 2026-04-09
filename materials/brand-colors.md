# DX研究所 セミナー ブランドカラー定義

> **ソース:** https://dx-ai-one.vercel.app/ の CSS 変数（Tailwind v4）から抽出

---

## Primary（メインカラー：青）
- **HEX:** `#005BAC`
- **CSS変数:** `--brand-primary`
- **用途:** 見出し背景、プログレスバー、ステップ番号の丸、ボーダー、フォーカスリング

## Secondary（サブカラー：濃紺）
- **HEX:** `#02396B`
- **CSS変数:** `--brand-secondary`
- **用途:** ヘッダー・フッター背景、ナビゲーション、オーバーレイ

## Accent（アクセントカラー：オレンジ）
- **HEX:** `#F58220`
- **CSS変数:** `--brand-accent`
- **用途:** CTA ボタン、ハイライト、重要メッセージ枠、アイコン強調

## Light Gray（ベースカラー）
- **HEX:** `#F5F5F5`
- **CSS変数:** `--brand-light-gray`
- **用途:** スライド背景、セクション背景

---

## テキストカラー

| 用途 | HEX |
|------|-----|
| 濃色背景上のテキスト | `#FFFFFF` |
| 明色背景上のテキスト | `#171717` |

## フォント

| 用途 | フォント | サイズ目安 |
|------|----------|-----------|
| 見出し | Noto Sans JP Bold | 36〜48pt |
| 本文 | Noto Sans JP Regular | 18〜22pt |
| 講師メモ | スライドノートに記載（本番非表示） | — |

## 背景画像

- **SVG:** `materials/background.svg`
- **PNG（NotebookLM 用）:** `materials/background.png` — `cd materials && npm run render-png` で再生成
- **説明:** Primary（#005BAC）を基調に、Accent（#F58220）を薄くアクセントとして散りばめたモダンなグラデーション背景。右上にロゴ配置スペースを確保。
