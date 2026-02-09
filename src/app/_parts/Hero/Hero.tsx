import type { FC } from 'react'

import styles from './Hero.module.scss'

type HeroProps = {
  className?: React.HTMLAttributes<HTMLDivElement>['className']
}

export const Hero: FC<HeroProps> = ({ className = '' }) => {
  const customClass = [className]
  return (
    <header className={[styles.hero, ...customClass].join(' ')}>
      <h1 className={styles.title}>
        <img
          src="/logo_large.svg"
          alt="CURRENT GRAVITY（カレントグラビティ）"
          className={styles.logo}
        />
      </h1>
      <div className={styles.introduction}>
        <p>
          <strong>CURRENT GRAVITY</strong>（カレントグラビティ）は、自分がどのような
          <strong>判断の引き受け方</strong>や<strong>関係の持ち方</strong>
          をすると心地良いか「<strong>いま重心がある場所</strong>
          」を可視化するプロファイリングモデルです。
        </p>
        <p>
          自分のことが見えてくると、ストレスとの付き合い方が分かり心理的リソースとバランスのとれたがんばり方ができるようになります。志向の理解は、キャリアプランを考えるきっかけになるかもしれません。
        </p>
        <p>
          そして、他の人の「いまの重心」も可視化し同じ地図に置いてみると、チーム全体の特長やメンバーどうしの棲み分けを知る手がかりにもなります。これはチームダイナミクスを考える材料になるでしょう。
        </p>
        <p>なお、このモデルは評価の正しさ・能力・成果の大小を測るものではありません。</p>
      </div>
    </header>
  )
}
