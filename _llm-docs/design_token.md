# Design Token（意匠定義）

このプロジェクトの意匠は、ここで指定しているデザイントークンへ完全準拠させます。

## 基本原則

- **創作値の禁止**: すべてのデザイン値はデザイントークンの値から取得します。
  - `tailwind.config.js` に未登録の値を使用する場合も、このファイルを確認しトークンとして追加することを優先します。
- **トークン化**: このファイルに記載の値を`tailwind.config.js`にカスタムトークンとして登録します。
- **検証必須**: 新しい値を使用する前にこのファイルで確認します。
- **マジックナンバー禁止**: ピクセル値（`px`）による固定サイズ指定を避け、可能な限りトークンまたは相対値を使用します。

## Available Tokens

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

### File Organization

```
├── styles/             # [グローバルスタイル] globals.css、CSS・フォント定義
├── public/             # [静的資産] 画像、SVG、Webフォント
└── tailwind.config.js  # [意匠定義] デザイントークンの正本
```

### Styling

- Use Tailwind utility classes
- **Only use registered LINE Design System tokens**
- For spacing: use `gap` over `margin-bottom` when possible
- レスポンシブ設計: `lg` ブレイクポイント（829px）を基準に調整。

## Tech Stack

- Tailwind CSS（LINE Design System準拠）
- Lucide React（アイコン）
- LINE Seed JP（フォント）
