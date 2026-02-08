# Styling Protocol

このドキュメントは、開発におけるスタイリング規約を定めたものです。

## 基本原則

- **創作値の禁止**：意匠の値は:rootまたはtemplateのmixinから参照し、未定義の値を書かないこととします。
- **マジックナンバーの禁止**：数値・色は直接書かず、CSS変数またはrem()で表現します。

## 利用可能なツール・リソース

### プロジェクト共通ドキュメント

- 命名・用語：[dictionary](dictionary.md)

### トークンの参照先

- 値の定義：`src/style/index.scss`の`:root`（一覧は実装を正とします）
- 利用のまとまり：`src/style/_variable/template/`配下のmixinを`@include`（一覧は実装を正とします）
- ブレークポイント：`src/style/_variable/mixin/_mq.scss`のmq mixin（プリセット名・詳細は実装を参照します）

## レスポンシブ対応

メディアクエリは**mq**mixinで指定します。プリセット名（narrow / middle / wide / maximum）を用いて、数値はmixin内に閉じます。

## 実装プロセス

- セマンティックなHTML構造を構築します
- データフローと状態管理を実装します
- 基本動作を確認します

### 装飾の実装ルール

**装飾（色、影、ボーダー、アニメーション等）は以下の条件を満たす場合のみ実装可能：**

- 明確な参照実装が指示されている場合
- 既存コンポーネントの踏襲が要求されている場合

**明示的な指示がない装飾は禁止します。**

## スタイル実装の原則

### TSXでの装飾ルール

- 指示がない提案レベルでの装飾追加は禁止します
- 明示的な指示がある場合は実装可能です
- 既存のプロジェクト内コードと同じ装飾を踏襲する場合は許可します

### SCSS実装原則

すべての`*.module.scss`は、rem関数、templateのmixin、レスポンシブ対応のmqを必ず利用します。
したがって、ファイル先頭での_variable読み込みが必須です。

```scss
@use '@/style/_variable' as *;
```

#### 単位の使用

原則としてサイズはrem関数を使用して表現します。

```scss
.example {
  margin: rem(16);
}
```

1pxのborderはpxで表現します。

```scss
.example {
  border: 1px solid var(--border-color);
}
```

割合を示す場合は%で表現します。

```scss
.example {
  width: 100%;
}
```

#### カラーの管理

色はCSS Variablesを使用します。

```scss
.example {
  color: var(--text-primary);
}
```

#### トークンの参照

値はCSS変数（`var(--...)`）で参照します。見出し・レイアウトなどのまとまりはtemplateのmixinを`@include`します。

```scss
@use '@/style/_variable' as *;

.example {
  @include container;
  gap: var(--spacing-md);
}

.exampleTitle {
  @include hd-lg;
}
```

ブレークポイントはmqで指定します。余白はgapを優先します。

## Tech Stack

- SCSS（Sass）
- CSS変数（:root）
- Lucide React（アイコン）
- LINE Seed JP（フォント）
