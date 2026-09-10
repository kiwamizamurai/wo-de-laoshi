# 我的老师(wo-de-laoshi)

Chrome Built-in AI(Gemini Nano)を使った、ブラウザだけで動く中国語学習アプリです。バックエンドは無く、GitHub Pages で配信する単一ページアプリ(SPA)として動作します。

## 機能

- **単語帳(フラッシュカード)**: HSK1〜3相当の単語・フレーズ175+45語を、SM-2アルゴリズムによる間隔反復で学習します。Chrome Built-in AI非依存なので、どのブラウザでも利用できます。
- **翻訳・読解補助**: Chrome の Translator API / Language Detector API / Summarizer API を使い、中国語⇄日本語の翻訳、入力言語の自動判定、長文の要約を行います。
- **AI会話練習**: Chrome の Prompt API を使い、8つのシナリオ(カフェでの注文、タクシー、ホテル、空港審査など)でAIとロールプレイ形式の中国語会話練習ができます。発話ごとにAIによる添削(構造化出力)も表示されます。

## 必要な環境

翻訳・会話練習機能は Chrome の Built-in AI API に依存します。

- Chrome バージョン 138 以降(Edge の一部バージョンでも開発者向けプレビューとして利用可)
- ハードウェア要件: 空き容量 22GB 以上、GPU 4GB VRAM 以上、または CPU 16GB RAM + 4コア以上

要件を満たしていても機能が有効にならない場合は、以下を試してください。

1. `chrome://flags/#optimization-guide-on-device-model` を `Enabled BypassPerfRequirement` に設定
2. 必要であれば `chrome://flags/#prompt-api-for-gemini-nano` を `Enabled` に設定
3. Chrome を再起動
4. `chrome://components` で「Optimization Guide On Device Model」の状態を確認(モデル本体はここでダウンロードされます)
5. 詳細な状態確認は `chrome://on-device-internals`

初回利用時は各APIのモデル・言語パックのダウンロードが発生します(Prompt API は数GBあり、数分かかることがあります)。

単語帳機能は Chrome Built-in AI 非依存のため、上記の準備なしに全ブラウザで利用できます。

## 開発

```bash
npm install
npm run dev       # http://localhost:5173/wo-de-laoshi/
npm run test      # SRSアルゴリズムのユニットテスト
npm run typecheck
npm run build      # dist/ に静的ファイルを出力
npm run preview    # ビルド結果をローカルで確認
```

## デプロイ

`main` ブランチへの push で GitHub Actions(`.github/workflows/deploy.yml`)が自動的に GitHub Pages へデプロイします。事前にリポジトリの Settings → Pages → Source を「GitHub Actions」に設定してください。

`vite.config.ts` の `base` はリポジトリ名に合わせて `/wo-de-laoshi/` としています。リポジトリ名を変更した場合はここも変更してください。

## 技術スタック

- Vite + TypeScript
- [Hono](https://hono.dev/) の `hono/jsx/dom`(クライアントサイドJSXランタイム、React 互換フック)
- 状態管理は独自の hash ルーター(`src/router/useHashRoute.ts`)とローカルの React 風フックのみ、外部の状態管理ライブラリは不使用
- データ永続化は `localStorage`(学習進捗のみ)

## ディレクトリ構成

```
src/
  ai/              Chrome Built-in AI の呼び出しをラップする層(依存をここに閉じ込める)
  data/            単語・フレーズ・シナリオの静的データ(JSON)
  features/
    flashcards/    単語帳機能(SRSアルゴリズム、UI)
    translate/     翻訳・読解補助機能
    chat/          AI会話練習機能
  components/      共通レイアウト・ナビゲーション
  router/          hashベースの自前ルーター
```
