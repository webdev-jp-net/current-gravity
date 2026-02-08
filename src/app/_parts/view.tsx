'use client'

import type { FC } from 'react'

import styles from './page.module.scss'

import { GroupEditor } from './GroupEditor'
import { Guide } from './Guide'
import { Matrix } from './Matrix'
import { useHome } from './useHome'


export const HomeView: FC = () => {
  const {
    isMounted,
    group,
    setGroup,
    isSaving,
    completePersonList,
    handleSave,
    addPerson,
    updatePerson,
    handleImport,
    deletePerson,
  } = useHome()

  if (!isMounted) return null

  return (
    <main className={styles.home} data-testid="home">
      <section>
        <header>
          <h1>
            <img
              src="/logo_large.svg"
              alt="CURRENT GRAVITY（カレントグラビティ）"
            />
          </h1>
          <p>
            <strong>CURRENT GRAVITY</strong>（カレントグラビティ）は、自分がどのような<strong>判断の引き受け方</strong>や<strong>関係の持ち方</strong>をすると心地良いか「いま重心がある場所」を可視化するプロファイリングモデルです。
          </p>
          <p>
            自分が判断や関係性を選択的にそう運用していると受容すれば心理的リソースを最適化でき、志向の理解はキャリアプランの見通しを助けます。
          </p>
          <p>
            そして、他の人の「いまの重心」も可視化し同じ地図に置いてみると、チーム全体の特長やメンバーどうしの棲み分けを知る手がかりにもなります。これはチームダイナミクスを考える材料になるでしょう。
          </p>
          <p>
            なお、このモデルは評価の正しさ・能力・成果の大小を測るものではありません。
          </p>
        </header>
        <Matrix personalPlotList={completePersonList} />
        <div id="group-editor">
          <GroupEditor
          groupName={group.name}
          personalPlotList={group.personalPlotList}
          onGroupNameChange={(name) => setGroup({ ...group, name })}
          onAddPerson={addPerson}
          onUpdatePerson={updatePerson}
          onDeletePerson={deletePerson}
          onImport={handleImport}
          onSave={handleSave}
          isSaveDisabled={
            group.name.trim() === '' || completePersonList.length === 0
          }
          isSaving={isSaving}
          />
        </div>
      </section>
      <Guide />
    </main>
  )
}
