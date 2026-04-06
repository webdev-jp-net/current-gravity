# プロジェクト指示

このファイルには、Claude Codeがこのプロジェクトで作業する際の最重要指示が含まれています。

**PROTOCOL**
セッションを開始したとき、タスクを実行するときは必ず`/_llm-rules/session_control.md`を参照します。
ルールチェーンにしたがって必要な仕様書を省略なく読み込み、必要なタスクを実行してください。

## 開発ワークフロー

このプロジェクトでは**pnpm**を使用します。npmやyarnは使用しないでください。

### 利用可能なコマンド

#### 開発

```bash
# 開発サーバーを起動
pnpm dev

# 本番ビルド
pnpm build

# 本番サーバーを起動
pnpm start
```

#### コード品質

```bash
# ESLintでJavaScript/TypeScriptをチェック
pnpm lint

# StylelintでSCSSをチェック
pnpm lint:style

# Lint結果に応じてコードを自動修正
pnpm lint:fix

# 全てのコードをフォーマット（Stylelint + Prettier）
pnpm format

# TypeScriptの型チェック
pnpm typecheck
```

### 開発フロー

1. **機能開発前**
   - `pnpm typecheck`で型エラーがないことを確認
   - `pnpm lint`でリンティングエラーがないことを確認

2. **開発中**
   - `pnpm dev`で開発サーバーを起動
   - コンポーネントは`src/components/`に配置
   - ページは`src/app/`に配置
   - スタイルは`src/styles/`に配置

3. **開発完了後**
   - `pnpm format`でコードをフォーマット
   - `pnpm lint`と`pnpm lint:style`でエラーがないことを確認
   - `pnpm typecheck`で型エラーがないことを確認
   - `pnpm build`でビルドが成功することを確認

### 設定ファイル

- `eslint.config.mjs` - ESLint設定
- `stylelint.config.cjs` - Stylelint設定
- `prettier.config.js` - Prettier設定
- `tsconfig.json` - TypeScript設定
- `next.config.js` - Next.js設定

### プロジェクト構造

- `src/app/` - Next.js App Router用のページとレイアウト
- `src/components/` - 再利用可能なReactコンポーネント
- `src/styles/` - SCSSファイルとスタイル関連のファイル