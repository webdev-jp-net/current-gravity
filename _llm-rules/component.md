---
description: Reactコンポーネントガイドライン
alwaysApply: false
---

# Reactコンポーネントガイドライン

> **このドキュメントの役割：Reactコンポーネント開発の詳細ガイドライン**  
> コンポーネントの作成方法、配置規約、型定義、パフォーマンス最適化などの具体的な実装指針を提供します。

## コンポーネント作成の基本原則

### 1. 関数コンポーネント

**必須**: 関数コンポーネントのみ使用。クラスコンポーネントは完全禁止。React 19の最新機能を活用する。

```typescript
// ✅ 良い例
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary'
}) => {
  return (
    <button
      className={`button ${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### 2. 型定義

- **必須**: propsはTypeScriptインターフェイスまたは型で定義
- **必須**: オプショナルプロパティには`?`を使用
- **必須**: デフォルト値は分割代入で明示的に指定

### 3. ファイル構造とコンポーネント配置規約

#### 基本的なファイル構造
```
src/components/
└── Hoge/
    ├── Hoge.tsx
    ├── Hoge.module.scss
    └── index.ts
```

#### コンポーネント配置の規約

コンポーネントは以下の2つのディレクトリに配置します：

1. **`/src/components/`** - 共通コンポーネント
   - 複数のページや機能で再利用可能なコンポーネント
   - 汎用的なUI部品（Button、Modal、PopInViewなど）
   - ビジネスロジックに依存しない独立したコンポーネント

2. **`/src/app/_parts/components/`** - アプリケーション固有のコンポーネント
   - 特定のページやセクションでのみ使用されるコンポーネント
   - ビジネスロジックに強く結びついたコンポーネント
   - ページ固有の複雑なレイアウトコンポーネント

例：
```
src/
├── components/              # 共通コンポーネント
│   ├── PopInView/          # アニメーション用の汎用コンポーネント
│   └── Button/             # 汎用ボタン
└── app/
    └── _parts/
        └── components/      # アプリ固有コンポーネント

### 4. スタイリング

- 各コンポーネントに対応するSCSSファイルを作成
- セマンティックなクラス名を使用
- CSS Modulesを使用する

```scss
// Button.module.scss (CSS Modules)
.button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.primary {
  background-color: blue;
  color: white;
}

.secondary {
  background-color: gray;
  color: white;
}
```

## Server Components vs Client Components

### Server Components（デフォルト）
- データフェッチング
- 静的コンテンツ
- SEOが重要なコンテンツ

### Client Components
- インタラクティブな機能
- ブラウザのAPIを使用
- ファイルの先頭に`'use client'`を追加

```typescript
'use client';

import { useState } from 'react';

export const InteractiveButton: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      クリック数: {count}
    </button>
  );
};
```

## パフォーマンス最適化

### React.memo使用基準

**React.memoを使用する場合：**
- propsが頻繁に変更されない（毎秒1回未満）
- レンダリングコストが高い（100ms以上）
- 子コンポーネントが10個以上存在する
- リストアイテムのコンポーネント

```typescript
// ✅ React.memoが有効な例
const ExpensiveListItem = React.memo<{item: Item}>(({item}) => {
  // 複雑な計算や多数の子要素
  return <div>...</div>;
});
```

### 動的インポート基準

**動的インポートを使用する場合：**
- コンポーネントサイズが50KB以上
- 初期表示に不要なコンポーネント
- 特定の条件下でのみ表示されるコンポーネント
- モーダル、サイドバーなどのオーバーレイUI

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>読み込み中...</p>
});
```

## アクセシビリティ

### HTMLセマンティクス必須ルール

- **ボタン**: `<button>`タグを使用（`<div>`や`<span>`は禁止）
- **ナビゲーション**: `<nav>`タグを使用
- **セクション**: `<section>`タグを使用
- **リスト**: `<ul>`/`<ol>`と`<li>`を使用
- **見出し**: `<h1>`〜`<h6>`を階層的に使用

### ARIA属性追加基準

**ARIA属性を追加する場合：**
- カスタムインタラクティブ要素（ボタン、リンク以外）
- 視覚的に隠された説明テキストが必要な場合
- フォーム要素のエラー状態表示
- 動的コンテンツの更新通知
- モーダルやドロップダウンの状態管理

```typescript
// ✅ 良い例
<button aria-label="メニューを開く" aria-expanded={isOpen}>
  <MenuIcon />
</button>

<div role="alert" aria-live="polite">
  {errorMessage}
</div>
```

### キーボードナビゲーション必須要件

- **フォーカス可能要素**: tabindexを0または-1で設定
- **スキップリンク**: メインコンテンツへのリンクを提供
- **Enter/Spaceキー**: ボタン操作で実装
- **Escapeキー**: モーダル・ドロップダウンの閉じる操作