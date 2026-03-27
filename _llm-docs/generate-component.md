# コンポーネント生成ガイド

## 概要

このドキュメントは、React/TypeScriptプロジェクトにおいて、scaffdogテンプレートを使用してコンポーネントを生成する手順を説明します。

**適用範囲**: React/TypeScriptによるフロントエンド開発のみ

## 利用可能なテンプレート

`.scaffdog`ディレクトリで定義されているテンプレート:

- `page-component.md` - App Router対応ページコンポーネント
- `parts-component.md` - 再利用可能なUI部品

**注意**: 生成後のカスタマイズ（ロジック実装、API連携、スタイル調整など）は別タスクとして扱います。

## 生成されるファイル構造

page-componentテンプレートは以下の構造を生成します：

```
[component-name]/
├── page.tsx                  # サーバーコンポーネント（データ取得・ルーティング）
└── _parts/
    ├── view.tsx             # 'use client' 指定の表示専用コンポーネント
    ├── useComponentName.ts  # ビジネスロジック／フック
    └── page.module.scss     # スタイル（必要最低限）
```

parts-componentテンプレートは以下を生成します：

```
[ComponentName]/
├── index.ts
├── [ComponentName].tsx
├── use[ComponentName].ts
└── [ComponentName].module.scss
```

## 前提条件

- scaffdogがプロジェクトにインストール済み
- 該当するテンプレートファイルが`.scaffdog/`ディレクトリに存在

## ページコンポーネント生成

### 概要

`src/app`配下にページディレクトリ（`page.tsx` + `_parts`）を生成し、サーバーコンポーネントとクライアントコンポーネントの責務を切り分けます。

### 生成手順

#### scaffdogコマンドでの生成

scaffdogコマンドを使用してコンポーネントを生成します。認証の要否に応じてディレクトリを分けて配置します。

```bash
# 認証が必要なページ（例: src/app/(authenticated)配下）
npx scaffdog generate page-component --output "(authenticated)" --answer "name:AccountIndex"

# 認証不要ページ（例: src/app/(unauthenticated)配下）
npx scaffdog generate page-component --output "(unauthenticated)" --answer "name:Login"
```

**重要**:
- `--output`は`src/app`からの相対パスを指定します。グループディレクトリ（例: `(authenticated)`）の命名ルールを維持してください。
- 生成される`page.tsx`はサーバーコンポーネントとしてデータ取得やリダイレクトなどを担当します。表示ロジックや状態管理は`_parts/view.tsx`と`use*.ts`に閉じ込めます。
- テンプレートには装飾を含めないため、スタイルは`_parts/page.module.scss`に必要最低限だけ定義し、追加装飾は別タスクで行います。

### 命名パターン別の生成例

#### 基本パターン

```bash
# 認証ありページの例
npx scaffdog generate page-component --output "(authenticated)" --answer "name:NewsIndex"
npx scaffdog generate page-component --output "(authenticated)" --answer "name:AccountDetail"
```

**命名規則**:
- `{Resource}{Action}` (例: NewsIndex, AccountDetail)。ディレクトリ名は自動的にケバブケース化されます。

### 生成後の確認事項

#### エイリアスの確認

`src/app`配下の`page.tsx`がルーティングエントリになります。共通コンポーネントは`@/components/...`形式で参照し、クライアントコンポーネントは`_parts/view`を通して読み込んでください。

### 注意事項

- **重複生成の防止**: 同名ディレクトリが存在すると`page.tsx`や`_parts`が上書きされるため注意
- **作業ディレクトリ**: プロジェクトルートから実行すること

### トラブルシューティング

#### scaffdogコマンドが見つからない場合

```bash
# scaffdogのインストール確認
pnpm list scaffdog

# 必要に応じてインストール
pnpm add -D scaffdog
```

#### テンプレートが見つからない場合

```bash
# テンプレートの確認
ls -la .scaffdog/
cat .scaffdog/page-component.md
```

#### 生成に失敗する場合

- 作業ディレクトリがプロジェクトルートか確認
- コンポーネント名が正しい形式か確認（命名規則は[dictionary.md](./dictionary.md)を参照）

## パーツコンポーネント生成

### 概要

共通UIコンポーネントをscaffdogテンプレートで生成します。

### 生成手順

```bash
# パーツコンポーネントの生成
npx scaffdog generate parts-component --answer "name:Button"
npx scaffdog generate parts-component --answer "name:Modal"
npx scaffdog generate parts-component --answer "name:Card"
```

## 設問回答ページとクエリ連携（実装時の共通メモ）

テンプレート生成の対象外だが、`personal-plot`のように**検索パラメータで状態を持つページ**を拡張する際の指針。詳細仕様・優先順位の確定はIssueや[_llm-docs/spec/personal_plot.md](./spec/personal_plot.md)と併せて参照する。

### `targetId`と`question`の併用

- 同一pathname上で**複数のクエリキー**（例: 編集対象の`targetId`と回答途中の`question`）を扱う場合、**キーごとの役割**をコードコメントまたはIssueで固定し、解釈の衝突（どちらを正とするか）を残さない。
- 書き換え時は**既存キーを意図せず落とさない**（`URLSearchParams`組み立てで未設定キーを消さないよう注意）。

### スクロールとURL復元

- 設問ブロックへのスクロール（例: `question-${index}`ハッシュ）と、**URLからの回答復元**が同じ画面で共存する場合、**マウント直後の順序**（パース→state反映→ハッシュ設定の要否）を実装とセットで決める。`targetId`だけを起点とした初期スクロールなど、要件に応じて**別タスク**で切り出してよい。

### クエリ同期の細部

- **外部入力**としての`question`値は、設問idと許容スコア範囲で検証し、不正トークンは**採用しない（無視）**方針とする（クリップやエラー表示にするかは要件次第）。
- Next.js App Routerでは**`useSearchParams`の参照がレンダーごとに変わり得る**ため、`useCallback`/`useEffect`の依存にそのまま載せると同期処理が連鎖しやすい。**`router.replace`でクエリを更新**し、必要ならrefで最新の`searchParams`を読むなど、依存の組み方を工夫する。
- `router.replace`のオプション（例: `scroll: false`）は**利用中のNextのドキュメント**に合わせて選ぶ。手動の`history.replaceState`だけでURLを変えると、フレームワーク状態とずれる恐れがあるため避ける。
