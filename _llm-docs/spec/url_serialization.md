# URL共有形式仕様 (URL Serialization)

グループのプロットデータはURLクエリパラメーターとして同期され、共有URLとして機能する。

## 基本形式
```
?name=グループ名&p=名前,ownership,consensus,diversity,identityFusion
```
複数プロットは`p`パラメーターを複数付与する。

## フォーカス拡張形式
```
?name=グループ名&p=名前,ownership,consensus,diversity,identityFusion,focus
```
- 6番目の値として文字列`focus`を付与することで、そのプロットにフォーカスフラグを設定できる。6番目の値がない場合、フォーカスフラグは未設定となる。
- 表示制御の詳細は[matrix_drawing.md](./matrix_drawing.md)の「フォーカスモード」を参照。
