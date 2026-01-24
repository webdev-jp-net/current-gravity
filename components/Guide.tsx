import React from 'react'

export const Guide: React.FC = () => {
  return (
    <section className="flex flex-col gap-15">
      <header className="flex flex-col gap-4">
        <h2 className="text-h2-mobile lg:text-h2 text-dark">
          マトリクスの見方
        </h2>
        <p className="text-body text-gray-paragraph">
          このモデルでは、価値を決めるときの志向をマトリクス上のプロットとして表現しています。
        </p>
      </header>
      <div className="flex flex-col md:flex-row md:gap-20">
        {/* 帰属志向 */}
        <section className="flex flex-col gap-15 flex-1">
          <header className="flex flex-col gap-4">
            <h3 className="text-h3-mobile lg:text-h3 text-dark">帰属志向</h3>
            <p className="text-body text-gray-paragraph">
              判断・決定・結果に対する責任の帰属をあらわした志向です。
            </p>
          </header>
          <div className="flex flex-col gap-15">
            <section className="flex flex-col gap-4">
              <header className="flex flex-col gap-2">
                <h4 className="text-h4-mobile lg:text-h4 text-dark">オーナーシップ</h4>
                <p className="text-body text-gray-paragraph">
                  オーナーシップ志向は、責任を自分が主体的に引き受ける選好です。
                </p>
                <p className="text-label text-gray-caption">
                  本来の「オーナーシップ」どおりの意味で、「リーダーシップ」とは別の概念です。<br />
                  このモデルにおけるリーダーシップは関係性軸の融合と帰属軸のオーナーシップが両方とも高く融合コストを他者に置いている状態です。
                </p>
              </header>
              <div className="pl-4 border-l-2 border-gray-border">
                <p className="text-label text-gray-caption mb-2">端点に近づくと顕在化する傾向：</p>
                <ul className="list-disc pl-5 text-caption text-gray-paragraph flex flex-col gap-1">
                  <li>責任関与が深く主体的ですが、対ストレスリソースは高燃費で消耗しやすい傾向があります。</li>
                  <li>決定責任のみに限定した概念ではありません。内在化した価値を創出すること、決定責任を持つこと、いずれもオーナーシップ志向と連結しています。</li>
                  <li>責任関与が深い延長で設計や過程にもタッチする場面があるため、過程も価値対象としてキャッチアップしやすい傾向があります。
                    <ul className="list-disc pl-5 mt-1 flex flex-col gap-1">
                      <li>端点へ極端に近いと、こだわりすぎて効率化を犠牲にする場合があります。</li>
                    </ul>
                  </li>
                  <li>0→1の価値創出と親和性が高い特性です。一方で、自発的要素のないタスクへモチベーションを見い出しにくい傾向があります。</li>
                </ul>
              </div>
            </section>
            <section className="flex flex-col gap-4">
              <header className="flex flex-col gap-2">
                <h4 className="text-h4-mobile lg:text-h4 text-dark">コンセンサス</h4>
                <p className="text-body text-gray-paragraph">
                  コンセンサス志向は、総和をつくり責任を場や合意へ移譲する選好です。
                </p>
              </header>
              <div className="pl-4 border-l-2 border-gray-border">
                <p className="text-label text-gray-caption mb-2">端点に近づくと顕在化する傾向：</p>
                <ul className="list-disc pl-5 text-caption text-gray-paragraph flex flex-col gap-1">
                  <li>責任関与が浅く依存的ですが、対ストレスリソースは低燃費で高頻度・広範囲へ関与しやすい特性でもあります。</li>
                  <li>詳細把握や品質管理は専門家に委ね、接続や連携に重心を置く行動傾向があります。</li>
                  <li>合意形成はすりあわせ対象があることで成り立つため、結論やアウトプットなど外在化した成果にアンテナ感度が高い傾向があります。
                    <ul className="list-disc pl-5 mt-1 flex flex-col gap-1">
                      <li>端点へ極端に近いと、過程に関与する概念そのものを忘れてしまう場合もあります。</li>
                    </ul>
                  </li>
                  <li>0→1の価値創出は苦手ですが、補助的関与にもモチベーションの波を持ち込まず対処できる傾向があります。</li>
                </ul>
              </div>
            </section>
          </div>
        </section>

        {/* 関係性志向 */}
        <section className="flex flex-col gap-15 flex-1">
          <header className="flex flex-col gap-4">
            <h3 className="text-h3-mobile lg:text-h3 text-dark">関係性志向</h3>
            <p className="text-body text-gray-paragraph">
              自分以外のモノ・人・現象との関係性をあらわした志向です。
            </p>
          </header>
          <div className="flex flex-col gap-15">
            <section className="flex flex-col gap-4">
              <header className="flex flex-col gap-2">
                <h4 className="text-h4-mobile lg:text-h4 text-dark">自立</h4>
                <p className="text-body text-gray-paragraph">
                  自立は、ダイバーシティを選好する志向です。
                </p>
                <p className="text-label text-gray-caption">
                  心理学本来の「自立」とは厳密に一致していません。融合の対角へダイバーシティを配置したときの誤認バイアスを軽減する目的で「自立」を採用しています。
                </p>
              </header>
              <div className="pl-4 border-l-2 border-gray-border">
                <p className="text-label text-gray-caption mb-2">端点に近づくと顕在化する傾向：</p>
                <ul className="list-disc pl-5 text-caption text-gray-paragraph flex flex-col gap-1">
                  <li>概念や個体の特性が独立性を認知できる構造を望み、混同や同質化をストレスに感じます。
                    <ul className="list-disc pl-5 mt-1 flex flex-col gap-1">
                      <li>人間関係に限定せず、人・モノ・コトといった概念の混同や同質化にもストレスを感じます。</li>
                      <li>肯定・否定・観測（無評価）の基準は内在化しており外から推測しにくいため、わからない人とラベリングされやすい。</li>
                    </ul>
                  </li>
                  <li>同質化と社交性は異義です。したがって単独選好と自立志向も異義です。</li>
                </ul>
              </div>
            </section>
            <section className="flex flex-col gap-4">
              <header className="flex flex-col gap-2">
                <h4 className="text-h4-mobile lg:text-h4 text-dark">融合</h4>
                <p className="text-body text-gray-paragraph">
                  融合は、一体感を選好する志向です。
                </p>
              </header>
              <div className="pl-4 border-l-2 border-gray-border">
                <p className="text-label text-gray-caption mb-2">端点に近づくと顕在化する傾向：</p>
                <ul className="list-disc pl-5 text-caption text-gray-paragraph flex flex-col gap-1">
                  <li>状態や嗜好が同質に近づく一体感を望み、拒否や異質にストレスを感じます。
                    <ul className="list-disc pl-5 mt-1 flex flex-col gap-1">
                      <li>状態を収束させるための変化を望み調整へ働きかけます、ストレス時は異質を遠ざけたりもします。</li>
                      <li>収束のための変化は、自分で対応する場合と外部へ求める場合の両方があります。</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </section>
      </div>
    </section>
  )
}
