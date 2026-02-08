'use client'

import type { FC } from 'react'

import styles from './page.module.scss'

import { GroupEditor } from './GroupEditor'
import { Guide } from './Guide'
import { Hero } from './Hero'
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
      <Hero />
      <Matrix personalPlotList={completePersonList} />
      <GroupEditor
        groupName={group.name}
        personalPlotList={group.personalPlotList}
        onGroupNameChange={name => setGroup({ ...group, name })}
        onAddPerson={addPerson}
        onUpdatePerson={updatePerson}
        onDeletePerson={deletePerson}
        onImport={handleImport}
        onSave={handleSave}
        isSaveDisabled={group.name.trim() === '' || completePersonList.length === 0}
        isSaving={isSaving}
      />
      <Guide />
    </main>
  )
}
