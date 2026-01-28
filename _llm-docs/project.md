# Project Definition

このドキュメントは、価値志向モデル（Value Orientation Model）プロジェクト固有の定義および設計情報をまとめたものです。

## Implementation Protocol

AIエージェントは、あらゆる実装・提案の前に必ず以下のステップを遵守すること。

1. **README.md (思想の源泉)**: 実装対象の概念的な定義・背景・目的を正解として再読し、意図を把握する。
2. **_llm-docs/dictionary.md (翻訳機)**: 把握した概念に対応する、プロジェクトで定義された正式な英語名称・命名規則を取得する。
3. **実装への適用**: 勝手な再解釈や一般的なベストプラクティスを優先せず、上記2つのドキュメントを絶対正解として扱う。

---

## Project Structure

```
/
├── _llm-docs/
│   ├── dictionary.md         # 開発用ネーミング辞書
│   ├── project.md            # 本ドキュメント
│   └── spec/                 # 技術詳細仕様書
│       └── matrix_drawing.md # マトリクス描画仕様
├── data/
│   ├── questionList.json     # 設問マスター（20件）
│   └── store.ts              # Jotai Atoms（グローバルステート定義）
├── pages/
│   ├── _app.tsx              # アプリケーションエントリー
│   ├── _document.tsx         # HTML ドキュメント
│   ├── index.tsx             # メインページ（マトリクス表示・グループ編集）
│   └── personalPlot.tsx      # 設問回答ページ（5段階回答によるスコア算出）
├── components/
│   ├── ValueOrientationMatrix.tsx # マトリクス描画コンポーネント
│   ├── GroupEditor.tsx       # グループ編集コンポーネント
│   ├── Guide.tsx             # 概念解説コンポーネント
│   └── PersonalPlotTable.tsx # （※現状はGroupEditorに内包、将来的に分離の可能性）
├── public/
│   └── fonts/                # LINE Seed JP フォント
├── styles/
│   └── globals.css           # グローバルスタイル、フォント定義
└── tailwind.config.js        # LINE Design System トークン定義
```

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
- スコア算出ロジック: 各軸の端点（ownership, consensus, diversity, identityFusion）ごとの合算値を保持し、設問数の不均衡を解消するため平均値ベースで座標を算出する。
- マトリクス描画仕様: VisXを採用し、リキッドレイアウトに対応。ラベル被りへの対処等、詳細は [matrix_drawing.md](./spec/matrix_drawing.md) を参照。

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
