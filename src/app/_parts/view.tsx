'use client'

import type { FC } from 'react'

import { Matrix } from '@/components/Matrix'

import styles from './page.module.scss'

import { GroupEditor } from './GroupEditor'
import { Guide } from './Guide'
import { Hero } from './Hero'
import { useHome } from './useHome'

export const HomeView: FC = () => {
  const {
    isMounted,
    group,
    setGroup,
    completePersonList,
    addPerson,
    updatePerson,
    handleImport,
    deletePerson,
  } = useHome()

  if (!isMounted) return null

  return (
    <main className={styles.home} data-testid="home">
      <Hero />
      <div className={styles.matrix}>
        <Matrix personalPlotList={completePersonList} />
      </div>
      <GroupEditor
        groupName={group.name}
        personalPlotList={group.personalPlotList}
        onGroupNameChange={name => setGroup({ ...group, name })}
        onAddPerson={addPerson}
        onUpdatePerson={updatePerson}
        onDeletePerson={deletePerson}
        onImport={handleImport}
      />
      <Guide />
    </main>
  )
}
