'use client'

import type { FC } from 'react'

import { PoleIcon } from '@/components/PoleIcon'

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
        <PoleIcon variant="ownership" className={[styles.icon, styles.ownership].join(' ')} />
        <PoleIcon variant="consensus" className={[styles.icon, styles.consensus].join(' ')} />
        <PoleIcon variant="diversity" className={[styles.icon, styles.diversity].join(' ')} />
        <PoleIcon
          variant="identityFusion"
          className={[styles.icon, styles.identityFusion].join(' ')}
        />
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
