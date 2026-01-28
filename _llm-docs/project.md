# Project Definition

このドキュメントは、価値志向モデル（Value Orientation Model）プロジェクト固有の定義および設計情報をまとめたものです。

## Implementation Protocol

AIエージェントは、あらゆる実装・提案の前に、プロジェクト固有の「絶対正解」として以下を同期すること。

- **README.md (思想の源泉)**: 具現化すべき概念の定義、背景、目的。
- **_llm-docs/dictionary.md (唯一の翻訳機)**: 概念に対応する、正式な英語名称と命名規則。

---

## Project Structure

```
/
├── AGENTS.md           # AIエージェントの行動プロトコルとエントリーポイント
├── _llm-rules/         # [開発作法] セッション制御、GitHub運用、基本原則
├── _llm-docs/          # [正本] プロジェクト専門知識・仕様定義
│   ├── spec/           # 各機能の詳細な技術仕様書（Scoring, Drawing等）
│   └── *.md            # 共通定義（dictionary, question_concepts等）
├── data/               # [静的データ・状態定義] questionList.json, store.ts等
├── pages/              # [ルーティング] Next.jsの規約に基づく画面定義
├── components/         # [構成要素] 再利用可能なReactコンポーネント
├── styles/             # [グローバルスタイル] LDS準拠のCSS・フォント定義
├── public/             # [静的資産] 画像、SVG、Webフォント
└── tailwind.config.js  # [意匠定義] LINE Design Systemトークンの正本
```

## Documentation Index

各領域の詳細な専門知識は、以下の仕様書に定義されている。

- **[model_definition.md](./spec/model_definition.md)**: 軸の定義およびスコア算出ロジック。
- **[personal_plot.md](./spec/personal_plot.md)**: データ構造および入力・インポート仕様。
- **[matrix_drawing.md](./spec/matrix_drawing.md)**: マトリクス描画および表示制御仕様。
- **[question_concepts.md](./question_concepts.md)**: 設問ごとの背景意図および詳細コンセプト。

---

## Design System Guidelines

このプロジェクトは [LINE Design System](https://designsystem.line.me/) に完全準拠しています。

### 基本原則

- **創作値の禁止**: すべてのデザイン値はLINE Design Systemの公式ドキュメントから取得。
  - `tailwind.config.js` に未登録の値を使用する場合も、公式ドキュメントを確認しトークンとして追加することを優先。
- **トークン化**: 公式値を`tailwind.config.js`にカスタムトークンとして登録。
- **検証必須**: 新しい値を使用する前に公式ドキュメントで確認。

### Available Tokens

`tailwind.config.js`に登録済みのLINE Design System公式値：

**Colors**
- `primary`, `secondary`, `tertiary`（透明度: 10/20/40/60/80）
- `gray-paragraph`, `gray-caption`, `gray-border`, `gray-placeholder`
- `error`, `link`, `success`

**Typography**
- `text-display`, `text-section`, `text-h2`〜`text-h5`（desktop/mobile variants）
- `text-body`, `text-paragraph`, `text-caption`, `text-label`, `text-xs`

**Border Radius**
- `rounded-ldsg-100`(3px), `rounded-ldsg-200`(5px), `rounded-ldsg-300`(7px), `rounded-ldsg-400`(12px)

**Spacing & Gap**
- インデックス指定（例: `gap-2` = 8px, `gap-15` = 40px）
- 主要な値: 4, 8, 11, 15, 16, 19, 20, 24, 27, 28, 30, 32, 33, 39, 40, 60, 80, 88, 100, 120, 140, 160px

**Shadow**
- `shadow-card-hover`: `0 5px 12px 0 rgba(0,0,0,0.07)`

## Coding Standards

### TypeScript/React

- ES modules syntax (`import`/`export`)
- Destructure imports: `import { foo } from 'bar'`
- Functional components with TypeScript interfaces
- Use React 19 hooks (useState, useEffect)
- Global State: Jotaiを使用。atomWithStorageによるlocalStorage永続化を標準とする。

### Styling

- Use Tailwind utility classes
- **Only use registered LINE Design System tokens**
- For spacing: use `gap` over `margin-bottom` when possible
- レスポンシブ設計: `lg` ブレイクポイント（829px）を基準に調整。

### File Organization

- Components in `/components`
- Pages in `/pages` (Next.js convention)
- Global styles in `/styles/globals.css`
- Store/Atoms in `/data/store.ts`

## Important Notes

- 新しいスタイル値を追加する前に、必ずLINE Design Systemの公式ドキュメントで確認。
- ピクセル値（`px`）による固定サイズ指定（マジックナンバー）を避け、可能な限りトークンまたは相対値を使用する。
- ページ遷移を伴う状態共有が必要な場合は、localStorageを直接叩かずJotaiアトムを経由する。
- ビジネスロジックや描画仕様の詳細は、上記 `Documentation Index` の各ファイルを参照すること。

## Commands

```bash
# 依存関係のインストール
pnpm install

# 開発サーバー起動
pnpm dev

# 本番ビルド
pnpm build

# 型チェック
pnpm typecheck
```

## Tech Stack

- Next.js 15 + React 19 + TypeScript
- Jotai (Global State Management)
- Tailwind CSS（LINE Design System準拠）
- Lucide React（アイコン）
- LINE Seed JP（フォント）
- pnpm (Package Manager)
