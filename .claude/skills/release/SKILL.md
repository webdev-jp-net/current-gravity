---
name: release
description: |
  リリースフローを実行するスキル。「リリースして」「リリース準備して」「v1.4.0を出したい」
  「リリースノートを作って」などのリクエストで使用。
  リポジトリの状態から「準備フェーズ」と「発行フェーズ」を自動判定して実行する。
---

# リリーススキル

package.jsonのバージョン更新 → リリースブランチ作成 → main向けPR作成 →（ユーザーのマージ後）
リリースノート発行 → developへのback-merge、までを一貫して行う。

## フェーズ判定（起動時に必ず実行）

```bash
git fetch origin
gh pr list --base main --state open --json number,title,headRefName \
  --jq '[.[] | select(.headRefName | startswith("release/"))]'
gh pr list --base main --state merged --limit 1 --json headRefName,mergedAt
git tag | sort -V | tail -1
git show origin/main:package.json | grep '"version"'
git show origin/develop:package.json | grep '"version"'
```

判定は上から順に評価し、最初に合致したものを採用する。

- **openなリリースPRがある** → ユーザーに状況を報告し、マージを待つか確認する
- **リリースPRがマージ済み、かつそのバージョンのタグが未作成** → フェーズ2（リリース発行 / Step 5から）
- **最新タグ = origin/mainのversion、かつ origin/developのversionがそれと不一致** → back-merge未完了。フェーズ2の残り（Step 7から）を実行する
- **上記いずれでもなく、最新タグ = origin/developのversion** → フェーズ1（リリース準備）

versionの比較対象はローカルの作業ファイルではなく `origin/develop` と `origin/main` を用いる。ローカルのdevelopは直pushできない未push状態を抱えている場合があり、判定を誤らせる。

---

## フェーズ1: リリース準備

### Step 1: 変更内容の収集

前回タグ以降にdevelopへ入った変更を収集する。

```bash
git log $(git tag | sort -V | tail -1)..origin/develop --oneline --merges
gh pr list --base develop --state merged --json number,title,mergedAt --limit 30
```

前回タグ以降にマージされたPRのみを対象に絞り込む。

### Step 2: バージョン番号の提案と承認

変更一覧を以下の基準で分類し、推奨バンプと根拠を提示して**ユーザーの承認を得る**。
機械的に確定しない（最終判断はユーザーの裁量。機能追加をpatchで出す判断もあり得る）。

| 種別 | 基準 | 例 |
| --- | --- | --- |
| メジャー（X.0.0） | 過去の利用結果との互換性が壊れる／体験が根本的に変わる | URL共有形式の非互換変更、スコア算出変更で過去結果と比較不能、全面リニューアル |
| マイナー（x.Y.0） | 互換性を保った機能追加・画面追加 | 進捗バー追加、新表示モード |
| パッチ（x.y.Z） | 機能追加を伴わない修正・調整 | バグ修正、文言・スタイル微調整、依存更新 |

提示フォーマット:

- **前回リリース**: v〈前回バージョン〉
- **今回の変更**: 〈PR/Issueの一覧〉
- **推奨**: 〈minor/patch/major〉 → v〈新バージョン〉（根拠を1行）

### Step 3: リリースブランチ作成とバージョン更新

承認された番号で実行する。

```bash
git checkout develop && git pull --ff-only
git checkout -b release/v[新バージョン]
# package.jsonの"version"を更新（それ以外は変更しない）
git add package.json
git commit -m "Update: [マイナー/パッチ/メジャー]バージョンアップ"
git push -u origin release/v[新バージョン]
```

### Step 4: main向けPR作成

以下のフォーマットで作成内容をユーザーに提示し、**承認後に**作成する。

- タイトル: `Release: v[新バージョン]`
- base: `main` / head: `release/v[新バージョン]`
- 本文:

  ```markdown
  ## v[新バージョン]

  - #[Issue番号] [変更概要]
  - #[Issue番号] [変更概要]
  ```

PR作成後、URLを提示して「マージされたら再度このスキルを起動してください」と案内し、フェーズ1を終了する。

---

## フェーズ2: リリース発行

### Step 5: マージ確認

```bash
gh pr list --base main --state merged --limit 1 --json number,headRefName,mergeCommit
```

リリースPRのマージを確認する。未マージなら報告して終了。

### Step 6: リリースノート作成と発行

変更内容（Step 1と同じ収集方法）をもとに、**利用者向けの日本語の平文**でノート原稿を作成する。

- 実績の文体に合わせる（例: 「設問の回答中に進捗バーを表示し、回答状況がひと目でわかるようにしました。」）
- コミット一覧やPR番号の羅列にしない
- 開発者向けの内部変更（リファクタリング等）は利用者に影響がなければ書かない

原稿をユーザーに提示し、**承認後に**発行する。

```bash
gh release create v[新バージョン] --target main --title "v[新バージョン]" --notes "[承認済みノート]"
```

### Step 7: developへのback-merge（必須・省略不可）

bumpコミットをdevelopへ反映する。この検証まで完了してリリース完了とする。

**developは直pushできない**（ruleset `protect` によりPR必須。詳細は「注意事項」）。
back-mergeもmain向けリリースPRと同様にPR経由で行う。

まずmainの内容を載せたブランチを作成してpushする。

```bash
git fetch origin
git checkout -b backmerge/v[新バージョン] origin/main
git push -u origin backmerge/v[新バージョン]
```

PR作成内容をユーザーに提示し、**承認後に**作成・マージする。

- タイトル: `Back-merge: v[新バージョン]`
- base: `develop` / head: `backmerge/v[新バージョン]`

```bash
printf '%s' $'リリース v[新バージョン] のバージョン更新をdevelopへ反映します。\n' \
  | gh pr create --base develop --head backmerge/v[新バージョン] \
      --title "Back-merge: v[新バージョン]" --body-file -
gh pr merge backmerge/v[新バージョン] --merge
```

マージ後、origin/developとorigin/mainでversionが一致することを検証する。

```bash
git fetch origin
git checkout develop && git pull --ff-only
git show origin/main:package.json | grep '"version"'
git show origin/develop:package.json | grep '"version"'
```

一致しない場合はリリース未完了として扱い、原因を報告する。

### Step 8: 後始末

ローカルの作業ブランチ削除をユーザーに確認してから実行する。
リモート側はリポジトリ設定 `delete_branch_on_merge: true` によりマージ時に自動削除される。

```bash
git branch -d release/v[新バージョン]
git branch -d backmerge/v[新バージョン]
```

完了報告: バージョン / リリースPR / Release URL / back-merge PR / version一致の検証結果を提示する。

---

## 注意事項

- バージョン番号の確定、PR作成、PRマージ、リリース発行、ブランチ削除は**必ずユーザーの承認を得てから**実行する
- package.jsonのversion以外のファイルをbumpコミットに含めない
- フェーズ2を実行せずに放置するとdevelopとmainのversionが不一致のままになる。フェーズ判定で検知した場合は必ず案内する

### リポジトリ制約（2026-07-17時点の実測値）

- ruleset `protect`（ID 16164280）が **develop と main の両方**に適用されている（`~DEFAULT_BRANCH` と `refs/heads/main` が対象。デフォルトブランチはdevelop）
- ルール内容: `deletion` 禁止 / `non_fast_forward` 禁止 / `pull_request` 必須
- `bypass_actors` は空、`current_user_can_bypass` は `never`。**管理者を含め誰も直pushできない**。developへの反映は例外なくPR経由
- `required_approving_review_count` は 0、必須ステータスチェックもなし。したがって `gh pr create` 直後の `gh pr merge` が承認者なしで成立する
- `allow_auto_merge` は false。**`gh pr merge --auto` は使用不可**（通常の `gh pr merge` を使う）
- `delete_branch_on_merge` は true。マージ済みリモートブランチは自動削除される

### このスキルを変更する際の必須確認

コマンドを追加・変更するときは、**実際のリポジトリ設定に対して実行可能かを確認してから記載する**。

このスキルは当初、Step 7に `git checkout develop && git merge main && git push` と記載していた。
developがPR必須である事実を確認しないまま「pushできる」前提で書かれたため、この手順は一度も成功せず、
v1.1.3〜v1.3.1のback-mergeがすべてorigin/developへ未到達のまま積み上がった。
「動くはずの手順」を検証せずに書くと、失敗が検知されないまま蓄積する。
