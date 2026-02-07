# モデル定義とロジック仕様 (Model Definition & Logic)

CURRENT GRAVITYにおけるスコアリングロジック、算出式、およびデータ構造を定義する技術詳細仕様書。

## スコア算出ロジック

マトリクス上の座標（$X, Y$）は、4つの端点変数の単純合算値の差分によって算出される。

### 端点変数（4 Orientations）
各変数は、割り当てられた5つの設問回答（-2 〜 +2）の合計値である。

| 変数名           | 対応する軸・方向 | 有効レンジ  |
| ---------------- | ---------------- | ----------- |
| `ownership`      | Y軸（正方向）    | -10 〜 10   |
| `consensus`      | Y軸（負方向）    | -10 〜 10   |
| `diversity`      | X軸（負方向）    | -10 〜 10   |
| `identityFusion` | X軸（正方向）    | -10 〜 10   |

### 座標算出式
マトリクスの幾何学的な中心を原点 (0, 0) とする。

- **帰属志向 (Y軸)**: $Y = ownership - consensus$
- **関係性志向 (X軸)**: $X = identityFusion - diversity$

### 座標レンジ
- **X, Y 軸共に**: -20 〜 20

---

## データ構造仕様

### PersonalPlot (個人データ)
```typescript
type PersonalPlot = {
  id: string;
  displayName: string;
  ownership: number;      // -10 〜 10
  consensus: number;      // -10 〜 10
  diversity: number;      // -10 〜 10
  identityFusion: number; // -10 〜 10
};
```

### CSVインポート形式
`ownership, consensus, diversity, identityFusion` の順で、4つの数値をカンマ区切りで入力する。
- **例**: `10, 5, -5, 10`
