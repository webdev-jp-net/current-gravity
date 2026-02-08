'use client'

import type { FC } from 'react'

import styles from './Guide.module.scss'

export const Guide: FC = () => {
  return (
    <section className={styles.guide}>
      <header className={styles.header}>
        <h2 className={styles.title}>マトリクスの見方</h2>
        <p>このモデルでは、価値を決めるときの志向をマトリクス上のプロットとして表現しています。</p>
      </header>
      <div className={styles.body}>
        <section className={styles.axis}>
          <header className={styles.axisHeader}>
            <h3 className={styles.axisTitle}>帰属志向</h3>
            <p>判断・決定・結果に対する責任の帰属をあらわした志向です。</p>
          </header>
          <div className={styles.axisBody}>
            <section className={styles.pole}>
              <header className={styles.poleHeader}>
                <h4 className={styles.poleTitle}>オーナーシップ</h4>
                <p>オーナーシップ志向は、責任を自分が主体的に引き受ける選好です。</p>
                <p>
                  本来の「オーナーシップ」どおりの意味で、「リーダーシップ」とは別の概念です。
                  <br />
                  このモデルにおけるリーダーシップは関係性軸の融合と帰属軸のオーナーシップが両方とも高く融合コストを他者に置いている状態です。
                </p>
                <p>
                  ownership側は、関心の向き（内在構造／品質）、関与の深さと疲労、初期創発フェーズの手応え、思考や関与痕跡への満足という内側で完結する価値生成プロセスを一貫してカバーしています。
                </p>
              </header>
              <div className={styles.poleBody}>
                <p>端点に近づくと顕在化する傾向：</p>
                <ul>
                  <li>
                    責任関与が深く主体的ですが、対ストレスリソースは高燃費で消耗しやすい傾向があります。
                  </li>
                  <li>
                    決定責任のみに限定した概念ではありません。内在化した価値を創出すること、決定責任を持つこと、いずれもオーナーシップ志向と連結しています。
                  </li>
                  <li>
                    責任関与が深い延長で設計や過程にもタッチする場面があるため、過程も価値対象としてキャッチアップしやすい傾向があります。
                    <ul>
                      <li>端点へ極端に近いと、こだわりすぎて効率化を犠牲にする場合があります。</li>
                    </ul>
                  </li>
                  <li>
                    0→1の価値創出と親和性が高い特性です。一方で、自発的要素のないタスクへモチベーションを見い出しにくい傾向があります。
                    <ul>
                      <li>内在構造や完成度そのものに価値を感じ、関与が深くなる志向。</li>
                      <li>成果よりも関与や思考の痕跡が残ることに価値を感じる内在的満足の傾向。</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </section>
            <section className={styles.pole}>
              <header className={styles.poleHeader}>
                <h4 className={styles.poleTitle}>コンセンサス</h4>
                <p>コンセンサス志向は、総和をつくり責任を場や合意へ移譲する選好です。</p>
                <p>
                  consensus側は、流通・配置・根回し、公開・展開・運用フェーズ、反応による完了感、役割としての遂行、承認による納得補強といった外部との接続点で価値が立ち上がるプロセスを段階的に分解しています。
                </p>
              </header>
              <div className={styles.poleBody}>
                <p>端点に近づくと顕在化する傾向：</p>
                <ul>
                  <li>
                    責任関与が浅く依存的ですが、対ストレスリソースは低燃費で高頻度・広範囲へ関与しやすい特性でもあります。
                  </li>
                  <li>
                    詳細把握や品質管理は専門家に委ね、接続や連携に重心を置く行動傾向があります。
                  </li>
                  <li>
                    合意形成はすりあわせ対象があることで成り立つため、結論やアウトプットなど外在化した成果にアンテナ感度が高い傾向があります。
                    <ul>
                      <li>
                        端点へ極端に近いと、過程に関与する概念そのものを忘れてしまう場合もあります。
                      </li>
                    </ul>
                  </li>
                  <li>
                    0→1の価値創出は苦手ですが、補助的関与にもモチベーションの波を持ち込まず対処できる傾向があります。
                  </li>
                  <li>内容そのものよりも流通・配置・合意形成によって価値が変わる点への関心。</li>
                  <li>形を出すことより、外部からの反応によって完了感が成立する価値観。</li>
                </ul>
              </div>
            </section>
          </div>
        </section>

        <section className={styles.axis}>
          <header className={styles.axisHeader}>
            <h3 className={styles.axisTitle}>関係性志向</h3>
            <p>自分以外のモノ・人・現象との関係性をあらわした志向です。</p>
          </header>
          <div className={styles.axisBody}>
            <section className={styles.pole}>
              <header className={styles.poleHeader}>
                <h4 className={styles.poleTitle}>自立</h4>
                <p>自立は、ダイバーシティを選好する志向です。</p>
                <p>
                  心理学本来の「自立」とは厳密に一致していません。融合の対角へダイバーシティを配置したときの誤認バイアスを軽減する目的で「自立」を採用しています。
                </p>
                <p>
                  境界は「近い／遠い」「自立／孤立」ではなく、評価・解釈・関係・集団構造・信頼の揺らぎという異なる侵入経路ごとに検知されます。
                </p>
              </header>
              <div className={styles.poleBody}>
                <p>端点に近づくと顕在化する傾向：</p>
                <ul>
                  <li>
                    概念や個体の特性が独立性を認知できる構造を望み、混同や同質化をストレスに感じます。
                    <ul>
                      <li>
                        人間関係に限定せず、人・モノ・コトといった概念の混同や同質化にもストレスを感じます。
                      </li>
                      <li>
                        肯定・否定・観測（無評価）の基準は内在化しており外から推測しにくいため、わからない人とラベリングされやすい。
                      </li>
                    </ul>
                  </li>
                  <li>同質化と社交性は異義です。したがって単独選好と自立志向も異義です。</li>
                  <li>話題性や権威と評価軸を混線させることへの直感的な境界検知。</li>
                  <li>正義や立場を固定せず、複数の解釈を並列で保持できる境界特性。</li>
                  <li>自分の評価と他者の関心を分離して扱える境界の安定性。</li>
                  <li>能力評価を一時的な成果変動と切り分けて捉えられる境界感覚。</li>
                </ul>
              </div>
            </section>
            <section className={styles.pole}>
              <header className={styles.poleHeader}>
                <h4 className={styles.poleTitle}>融合</h4>
                <p>融合は、一体感を選好する志向です。</p>
              </header>
              <div className={styles.poleBody}>
                <p>端点に近づくと顕在化する傾向：</p>
                <ul>
                  <li>
                    状態や嗜好が同質に近づく一体感を望み、拒否や異質にストレスを感じます。
                    <ul>
                      <li>
                        状態を収束させるための変化を望み調整へ働きかけます、ストレス時は異質を遠ざけたりもします。
                      </li>
                      <li>
                        収束のための変化は、自分で対応する場合と外部へ求める場合の両方があります。
                      </li>
                    </ul>
                  </li>
                  <li>関係性を軸に進行を安定させる融合的な進め方への親和性。</li>
                  <li>他者の評価フレームに即座に同調し、自身の判断と混線させやすい傾向。</li>
                  <li>他者の感想を自分の評価として内面化・表明する境界の曖昧さ。</li>
                  <li>代表への委譲や一体感によって安心を得る融合志向。</li>
                  <li>決定結果よりも関係の残余や同質性を気にかける融合的感受性。</li>
                </ul>
              </div>
            </section>
          </div>
        </section>
      </div>
    </section>
  )
}
