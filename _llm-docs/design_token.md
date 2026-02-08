# Design Token（意匠定義）

このプロジェクトの意匠は、ここで指定しているデザイントークンへ完全準拠させます。

## 基本原則

- **創作値の禁止**: すべてのデザイン値はデザイントークンの値から取得します。
  - `tailwind.config.js` に未登録の値を使用する場合も、このファイルを確認しトークンとして追加することを優先します。
- **トークン化**: このファイルに記載の値を`tailwind.config.js`にカスタムトークンとして登録します。
- **検証必須**: 新しい値を使用する前にこのファイルで確認します。
- **マジックナンバー禁止**: ピクセル値（`px`）による固定サイズ指定を避け、可能な限りトークンまたは相対値を使用します。

## Available Tokens

`tailwind.config.js`に登録済みのトークンです。

### Colors

- `primary`, `secondary`, `tertiary`, `dark`
  - 透明度: 0（DEFAULT）/10/20/40/60/80
- `gray-paragraph`, `gray-caption`, `gray-border`, `gray-border-medium`, `gray-placeholder`
- `error`, `link`, `success`

### Typography

- `display`, `section`, `h2`〜`h5`, `paragraph`
  - レスポンシブ: DEFAULT / `-mobile`
- `body`, `caption`, `label`, `xs`（`-mobile` なし）

### Border Radius

- `rounded-ldsg-100` (3px)
- `rounded-ldsg-200` (5px)
- `rounded-ldsg-300` (7px)
- `rounded-ldsg-400` (12px)

### Spacing & Gap

- 1 = 4px の 4 倍数スケール（n → n×4px）。インデックス指定（例: `gap-2` = 8px, `gap-15` = 60px）
- 拡張で使用する主要な値: 4.5(18), 6.5(26), 7(28), 7.5(30), 8(32), 9(36), 10(40), 10.5(42), 11(44), 12(48), 13(52), 14(56), 15(60), 17(68), 20(80), 22(88), 25(100), 27(108), 35(140), 40(160) px

### Shadow

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
