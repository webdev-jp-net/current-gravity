'use client'

import type { FC } from 'react'

import { ValueOrientationMatrix } from '@/components/ValueOrientationMatrix'
import { Guide } from './Guide'
import { GroupEditor } from './GroupEditor'
import { useHome } from './useHome'
import styles from './page.module.scss'

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
        <ValueOrientationMatrix personalPlotList={completePersonList} />
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
