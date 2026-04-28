# エコプラス+ LP

Google検索広告（リスティング）で運用する不用品出張買取の専用ランディングページ。

## 概要

- 対象: 千葉・埼玉・茨城・栃木の出張買取エリア
- スタック: 素のHTML / CSS / JS（ビルドなし）
- テスト: Playwright（構造・CTA・計測・フォーム）

## ディレクトリ

```
index.html         エントリ
styles/main.css    全スタイル
scripts/           config / tracking / form / main
assets/img/        ロゴ・マスコット
tests/             Playwright tests
SPEC.md            実装仕様
TEST_SPEC.md       テスト仕様（変更不可）
CLAUDE.md          作業ルール（最重要）
```

## 開発

```bash
npm install
npx playwright install chromium
npm test
```

`http-server` で `http://localhost:8080/index.html` を開けば確認可能。

## デプロイ

Vercel でルートディレクトリを設定するだけで配信可能（静的）。
本番時はお名前ドットコムで取得したドメインを Vercel に接続する。

## 重要ルール

`CLAUDE.md` の §1 に従い、`TEST_SPEC.md` および `tests/` 配下は
「テストを合格させる」目的での書き換え禁止。
