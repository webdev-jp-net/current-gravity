'use client'

import type { FC } from 'react'

import { Trash2, ClipboardList, Share2, Check, UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/Button'

import styles from './GroupEditor.module.scss'

import { useGroupEditor } from './useGroupEditor'

import type { PersonalPlot } from '@/type/personalPlot'

export interface GroupEditorProps {
  groupName: string
  personalPlotList: PersonalPlot[]
  onGroupNameChange: (name: string) => void
  onAddPerson: () => void
  onUpdatePerson: (id: string, field: keyof PersonalPlot, value: string | number) => void
  onDeletePerson: (id: string) => void
  onImport: (id: string, csvValue: string) => void
}

export const GroupEditor: FC<GroupEditorProps> = ({
  groupName,
  personalPlotList,
  onGroupNameChange,
  onAddPerson,
  onUpdatePerson,
  onDeletePerson,
  onImport,
}) => {
  const router = useRouter()
  const { isShared, handleShare } = useGroupEditor()

  return (
    <div id="group-editor" className={styles.groupEditor}>
      <section className={styles.section}>
        <div className={styles.header}>
          <div className={styles.headerRow}>
            <h3 className={styles.title}>みんなのいまの重心</h3>
            <Button onClick={onAddPerson}>
              <UserPlus size={20} aria-hidden />
              人物を追加
            </Button>
          </div>
        </div>

        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.theadRow}>
                <th className={styles.th}>名前</th>
                <th className={styles.th}>オーナーシップ, コンセンサス, 自立, 融合</th>
                <th className={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {personalPlotList.length === 0 ? (
                <tr>
                  <td colSpan={3} className={styles.emptyCell}>
                    「人物を追加」ボタンをクリックしてデータを入力してください
                  </td>
                </tr>
              ) : (
                personalPlotList.map(person => (
                  <tr key={person.id} className={styles.tbodyRow}>
                    <td className={styles.td}>
                      <input
                        type="text"
                        value={person.displayName}
                        onChange={e => onUpdatePerson(person.id, 'displayName', e.target.value)}
                        placeholder="名前"
                        className={styles.input}
                      />
                    </td>
                    <td className={styles.td}>
                      <input
                        type="text"
                        key={`${person.id}-${person.ownership}-${person.consensus}-${person.diversity}-${person.identityFusion}`}
                        defaultValue={`${person.ownership}, ${person.consensus}, ${person.diversity}, ${person.identityFusion}`}
                        onBlur={e => onImport(person.id, e.target.value)}
                        placeholder="オーナーシップ, コンセンサス, 自立, 融合"
                        className={styles.input}
                      />
                    </td>
                    <td className={styles.td}>
                      <div className={styles.cellActions}>
                        <Button
                          variant="link"
                          className={styles.linkToForm}
                          title="設問から入力"
                          onClick={() => router.push(`/personal-plot?targetId=${person.id}`)}
                        >
                          <ClipboardList size={18} aria-hidden />
                          <span className={styles.linkToFormLabel}>設問から入力</span>
                        </Button>
                        <Button
                          variant="link"
                          className={styles.deleteButton}
                          onClick={() => onDeletePerson(person.id)}
                        >
                          <Trash2 size={18} aria-hidden />
                          <span className={styles.deleteButtonLabel}>削除</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.footer}>
          <input
            id="group-name"
            type="text"
            value={groupName}
            onChange={e => onGroupNameChange(e.target.value)}
            placeholder="グループ名を入力"
            className={`${styles.input} ${styles.groupNameInput}`}
          />
          <Button variant="basic" size="liquid" onClick={handleShare}>
            {isShared ? <Check size={20} aria-hidden /> : <Share2 size={20} aria-hidden />}
            この結果のURLをコピー
          </Button>
        </div>
      </section>
    </div>
  )
}
