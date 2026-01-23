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
│   └── dictionary.md         # 開発用ネーミング辞書
├── pages/
│   ├── _app.tsx              # アプリケーションエントリー
│   ├── _document.tsx         # HTML ドキュメント
│   └── index.tsx             # メインページ（マトリクス表示・入力フォーム）
├── components/
│   └── ValueOrientationMatrix.tsx # マトリクス描画コンポーネント
├── public/
│   └── fonts/                # LINE Seed JP フォント
├── styles/
│   └── globals.css           # グローバルスタイル、フォント定義
└── tailwind.config.js        # LINE Design System トークン定義
```

## Design System Guidelines

このプロジェクトは [LINE Design System](https://designsystem.line.me/) に完全準拠しています。

### 基本原則

1. **創作値の禁止**: すべてのデザイン値はLINE Design Systemの公式ドキュメントから取得
2. **トークン化**: 公式値を`tailwind.config.js`にカスタムトークンとして登録
3. **検証必須**: 新しい値を使用する前に公式ドキュメントで確認

### Available Tokens

`tailwind.config.js`に登録済みのLINE Design System公式値：

**Colors**
- `primary`, `secondary`, `tertiary`（透明度: 10/20/40/60/80）
- `gray-paragraph`, `gray-caption`, `gray-border`
- `error`, `link`, `success`

**Typography**
- `text-display`, `text-section`, `text-h2`〜`text-h5`（desktop/mobile variants）
- `text-paragraph`, `text-body`, `text-caption`, `text-label`

**Border Radius**
- `rounded-ldsg-100`(3px), `rounded-ldsg-200`(5px), `rounded-ldsg-300`(7px), `rounded-ldsg-400`(12px)

**Spacing & Gap**
- spacing: 20/24/28/30/32/40/60/80/88/100/120/140/160px
- gap（公式値のみ）: 20/28/30/40/60/80px

**Shadow**
- `shadow-card-hover`: `0 5px 12px 0 rgba(0,0,0,0.07)`

## Coding Standards

### TypeScript/React

- ES modules syntax (`import`/`export`)
- Destructure imports: `import { foo } from 'bar'`
- Functional components with TypeScript interfaces
- Use React 19 hooks (`useState`, `useEffect`)

### Styling

- Use Tailwind utility classes
- **Only use registered LINE Design System tokens**
- For spacing: use `gap` over `margin-bottom` when possible
- Example: `flex flex-col gap-8` instead of individual `mb-*` classes

### File Organization

- Components in `/components`
- Pages in `/pages` (Next.js convention)
- Global styles in `/styles/globals.css`

## Important Notes

- 新しいスタイル値を追加する前に、必ずLINE Design Systemの公式ドキュメントで確認
- `gap`の値は公式値（20/28/30/40/60/80px）のみ使用可能
- カラー・タイポグラフィは登録済みトークンのみ使用

## Commands

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 型チェック
npm run typecheck
```

## Tech Stack

- Next.js 15 + React 19 + TypeScript
- Tailwind CSS（LINE Design System準拠）
- Lucide React（アイコン）
- LINE Seed JP（フォント）
