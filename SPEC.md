# 実装仕様書（SPEC.md）— エコプラス+ LP

参考LP: https://ecoraku.co.jp/lp_reuse2/kashiwa/  
本書は plan ファイル（`google-lp-https-ecoraku-co-jp-lp-reuse2-streamed-steele.md`）の
実装フェーズ向けサマリーであり、UI / コピー / テクニカル要件を定義する。
テスト要件は `TEST_SPEC.md` 側に分離している。

---

## 1. 想定ユーザー像（広告流入時）

- 30〜60代の千葉・埼玉・茨城・栃木在住者
- 引越し／生前整理／遺品整理／買い替え／断捨離のいずれかのタイミング
- スマートフォンで「不用品 出張買取 ＋ 地域名」等を検索

## 2. 主訴求（FV）

- メインキャッチ: 家にある "もう使わない" を、現金に。
- サブ: 出張料・査定費・キャンセル料 0円 ／ 最短30分でご訪問
- 注釈: 「※ 交通状況・エリアにより異なります」「※ サンプル表示・イメージを含みます」

## 3. セクション順序（参考LPの型を踏襲・オリジナル）

| # | id | 内容 |
|--:|---|---|
| 1 | header | ロゴ + 電話 + LINE |
| 2 | hero | キャッチ・サブ・電話/LINE CTA・マスコット |
| 3 | problems | 4チェック式の悩み訴求 |
| 4 | points | 選ばれる3つの理由（USP） |
| 5 | items | 買取強化品目12カテゴリ（アイコングリッド） |
| 6 | cases | 買取実績スライダー（架空・8〜12件、サンプル明記） |
| 7 | staff | スタッフ紹介4名（架空・サンプル明記） |
| 8 | flow | 買取の流れ4ステップ |
| 9 | scenes | こんなときに便利（5シーン） |
| 10 | voice | お客様の声（架空・3〜5件、サンプル明記） |
| 11 | media | メディア掲載（架空・サンプル明記） |
| 12 | area | 対応エリア4県 |
| 13 | faq | FAQ（8〜10項目）アコーディオン |
| 14 | form | メール無料査定フォーム |
| 15 | company | 会社概要（古物商番号は架空と注記） |
| 16 | footer | 著作権・リンク |
| 99 | sticky-cta | 画面下追従バー（電話・LINE・フォーム） |

`TEST_SPEC.md` S-006 で id 必須なのは `hero, problems, points, items, cases,
staff, flow, scenes, voice, area, faq, form, company` の13個（mediaは任意）。

## 4. デザイン仕様

- メインカラー: `#2A6FB0`
- メインカラー濃: `#1F4F80`
- アクセント（CTA）: `#F39C12`
- アクセント濃: `#D87E0A`
- 背景: `#FFFFFF` / `#F7F9FC`
- テキスト: `#2A2A2A`
- ボーダー: `#E1E7EE`
- フォント: Noto Sans JP, sans-serif
- ブレークポイント: 768px（タブレット）, 1024px（PC）

## 5. CTA動線設計

- 電話番号定数: `0120-000-000`（架空・`scripts/config.js` で集中管理）
- LINE URL: `https://lin.ee/SAMPLE-ECOPLUS`（架空・config）
- 配置箇所:
  - hero: 電話CTA + LINE CTA（左右2列、モバイルは縦）
  - points直下: 電話CTA
  - cases直下: 電話CTA
  - flow直下: 電話CTA + LINE
  - footer手前: フォームへスクロール + 電話 + LINE
  - sticky-cta（追従）: 電話 + LINE + フォーム

## 6. 計測（dataLayer / GTM）

`scripts/tracking.js` で以下を実装:
- ページロード時に `window.dataLayer` を初期化
- `<head>` に GTMコンテナの**コメント形式プレースホルダ**を埋め込む（GTM-XXXX）
- `[href^="tel:"]` 全要素の `click` で `cta_phone_click` を push
- LINEリンクの `click` で `cta_line_click` を push
- `cta_location` は要素の `data-cta-location` 属性から取得（hero/mid/footer/sticky）
- フォーム正常送信時に `lead_form_submit` を push

## 7. フォーム

- 送信先: 現状はクライアント完結（`event.preventDefault()` してサンクス表示）
- バリデーション: HTML5 標準（required + pattern + type）
- 電話 pattern: `^[0-9\-\+\(\)\s]{10,15}$`
- 送信成功で `#thanks` を `display: block` に切替

## 8. ファイル

```
LP/
├── CLAUDE.md
├── README.md
├── SPEC.md
├── TEST_SPEC.md
├── index.html
├── styles/main.css
├── scripts/
│   ├── config.js
│   ├── tracking.js
│   ├── main.js
│   └── form.js
├── assets/img/
│   ├── logo.jpg
│   └── mascot.jpg
├── tests/
│   ├── structure.spec.js
│   ├── cta.spec.js
│   ├── tracking.spec.js
│   └── form.spec.js
├── playwright.config.js
├── package.json
├── .gitignore
└── vercel.json
```
