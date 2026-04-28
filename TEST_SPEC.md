# テスト仕様書（TEST_SPEC.md）

> **このドキュメントは「合格させる」ために書き換えてはならない（CLAUDE.md §1 参照）。**
> 仕様変更が必要なときは、ユーザー承認 → plan更新 → 本書更新 → tests/更新 の順で。

テストランナーは Playwright。`npm test` または `npx playwright test` で全テスト実行。
ローカルで `python -m http.server 8080` 等の静的サーバを立てて
`http://localhost:8080/index.html` を対象にする。

---

## 1. structure.spec.js — HTML構造

### S-001 lang
- `<html>` の `lang` 属性が `"ja"` であること。

### S-002 title
- `<title>` のテキストが 30〜60 文字。
- タイトルに「買取」と「千葉」のいずれも含むこと。

### S-003 meta description
- `<meta name="description">` の `content` が 80〜160 文字。
- 「買取」または「出張」を含むこと。

### S-004 viewport
- `<meta name="viewport">` の content が `width=device-width` を含む。

### S-005 OGP
- `og:title`, `og:description`, `og:image`, `og:type` の4つすべてが存在。

### S-006 必須セクションid
- 以下のidを持つ要素がすべて存在: `hero`, `problems`, `points`, `items`,
  `cases`, `staff`, `flow`, `scenes`, `voice`, `area`, `faq`, `form`, `company`.

### S-007 h1は1個
- `h1` 要素はページ内に**ちょうど1つ**。

### S-008 各セクションにh2
- S-006 のうち `hero` を除く各セクションは、配下に `h2` を1つ以上含む。

### S-009 ヘッダー・フッター
- `<header>` と `<footer>` がそれぞれ1つ以上存在。

### S-010 imgのalt
- すべての `<img>` 要素は `alt` 属性を持つ（空文字列 `""` も可）。

### S-011 ロゴ画像参照
- `assets/img/logo.` を含む画像参照が存在。
- （マスコット参照は2026-04-29の仕様変更により要件外。plan §9-A 参照）

---

## 2. cta.spec.js — CTA動線

### C-001 FV内の電話CTA
- `#hero` セクション配下に `href` が `tel:` で始まる `<a>` が1つ以上。

### C-002 ページ全体の電話CTA数
- ページ全体で `href^="tel:"` の `<a>` が3つ以上存在。

### C-003 LINE誘導
- ページ全体で `href` が `https://line.me/`、`https://lin.ee/`、または
  `https://liff.line.me/` で始まる `<a>` が2つ以上存在。

### C-004 追従CTAバー
- `#sticky-cta` 要素が存在。
- そのCSS computed `position` が `fixed` であること。

### C-005 追従バーの3導線
- `#sticky-cta` 配下に
  - `tel:` で始まる `<a>` を1つ以上
  - `line` を href に含む `<a>` を1つ以上
  - `href="#form"` を持つ `<a>` または相当のフォームスクロールリンクを1つ以上

### C-006 フォームの必須項目
- `#lead-form` (form 要素) が存在。
- 配下に下記要素がすべて存在し、`required` 属性を持つ:
  - `input[name="name"]`
  - `input[name="tel"][type="tel"]` （`pattern` 属性を持つ）
  - `input[name="email"][type="email"]`
  - `input[name="address"]` または `textarea[name="address"]`
  - `textarea[name="items"]`
  - `input[name="privacy"][type="checkbox"]`
- `input[name="visit_date"]` または `input[name="visit_datetime"]` は存在するが
  required は不要。
- 配下に `button[type="submit"]` または `input[type="submit"]` が存在。

---

## 3. tracking.spec.js — 計測タグ

### T-001 dataLayer 初期化
- ページ読み込み後、`window.dataLayer` が配列であること。

### T-002 GTMコンテナタグ
- HTMLソース内に文字列 `gtm.js?id=GTM-` または `googletagmanager.com/gtm.js`
  が含まれる（コメントアウト形式でも可）。

### T-003 電話CTAイベント
- 任意の `tel:` リンクをクリックすると、`dataLayer` に
  `{event: 'cta_phone_click', cta_location: <文字列>}` 相当のオブジェクトが
  push される。

### T-004 LINEイベント
- LINEリンクをクリックすると、`dataLayer` に
  `{event: 'cta_line_click', cta_location: <文字列>}` が push される。

### T-005 フォームsubmitイベント
- フォームの全必須項目を正しく入力しsubmitすると、`dataLayer` に
  `{event: 'lead_form_submit'}` を含むオブジェクトが push される。

### T-006 cta_locationの値
- T-003 と T-004 の `cta_location` の値は、`hero`, `mid`, `footer`, `sticky` の
  いずれかの文字列。

---

## 4. form.spec.js — フォーム挙動

### F-001 未入力でブロック
- フォームに何も入力せず submit ボタンをクリックした場合、`#thanks` が
  非表示のままで、ブラウザのバリデーション（`:invalid` または独自の
  エラー表示）でブロックされる。

### F-002 電話番号 pattern 違反
- 電話番号欄に `abcdefg` を入力し、他の必須項目を埋めて submit。
- フォームは送信されず、電話番号入力欄が `:invalid` 状態であること。

### F-003 メール形式不正
- メール欄に `not-an-email` を入力し、他の必須項目を埋めて submit。
- フォームは送信されず、メール入力欄が `:invalid` 状態であること。

### F-004 正常送信
- 全必須項目を正しく入力（電話 `0123456789`, メール `test@example.com` など）
  して submit。
- `#thanks` 要素が `visible`（表示）になる。
- `dataLayer` に `event: 'lead_form_submit'` のオブジェクトが push されている。
