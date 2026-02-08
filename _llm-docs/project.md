# Project Definition

このドキュメントは、CURRENT GRAVITY（カレントグラビティ）プロジェクト固有の定義および設計情報をまとめたものです。

## Implementation Protocol

AIエージェントは、あらゆる実装・提案の前に、プロジェクト固有の「絶対正解」として以下を同期します。

- **README.md (思想の源泉)**: 具現化すべき概念の定義、背景、目的。
- **_llm-docs/dictionary.md (唯一の翻訳機)**: 概念に対応する、正式な英語名称と命名規則。

## Project Structure

```
/
├── AGENTS.md           # AIエージェントの行動プロトコルとエントリーポイント
├── _llm-rules/         # [開発作法] セッション制御、GitHub運用、基本原則
├── _llm-docs/          # [正本] プロジェクト専門知識・仕様定義
│   ├── spec/           # 各機能の詳細な技術仕様書（Scoring, Drawing等）
│   └── *.md            # 共通定義（dictionary, question_concepts等）
├── src/                # [開発系ソース]
│   ├── data/           # 静的データ・状態定義（questionList.json, store.ts等）
│   ├── pages/          # ルーティング（Next.jsの規約に基づく画面定義）
│   ├── components/     # 再利用可能なReactコンポーネント
│   └── style/         # グローバルスタイル（LDS準拠のCSS・フォント定義）
└── public/             # [静的資産] 画像、SVG、Webフォント
```

## Documentation Index

各領域の詳細な専門知識は、以下の仕様書に定義されています。ビジネスロジックや描画仕様を実装する際は、該当する仕様書を参照します。

- **[model_definition.md](./spec/model_definition.md)**: 軸の定義およびスコア算出ロジック。
- **[personal_plot.md](./spec/personal_plot.md)**: データ構造および入力・インポート仕様。
- **[matrix_drawing.md](./spec/matrix_drawing.md)**: マトリクス描画および表示制御仕様。
- **[question_concepts.md](./question_concepts.md)**: 設問ごとの背景意図および詳細コンセプト。

## Design Guidelines

スタイリング規約は **[styling_protocol.md](./styling_protocol.md)** を参照します。

## Coding Standards

### TypeScript/React

- ES modules syntax (`import`/`export`)
- Destructure imports: `import { foo } from 'bar'`
- Functional components with TypeScript interfaces
- Use React 19 hooks (useState, useEffect)
- Global State: Jotaiを使用します。atomWithStorageによるlocalStorage永続化を標準とします。ページ遷移を伴う状態共有が必要な場合は、localStorageを直接叩かずJotaiのatomを経由します。

### File Organization

- Components in `src/components`
- Pages in `src/pages` (Next.js convention)
- Store/Atoms in `src/data/store.ts`

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
