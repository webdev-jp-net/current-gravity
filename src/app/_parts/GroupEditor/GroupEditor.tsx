'use client'

import type { FC } from 'react'

import { Trash2, Loader2, ClipboardList, Share2, Check } from 'lucide-react'
import Link from 'next/link'

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
  onSave: () => void
  isSaveDisabled: boolean
  isSaving?: boolean
}

export const GroupEditor: FC<GroupEditorProps> = ({
  groupName,
  personalPlotList,
  onGroupNameChange,
  onAddPerson,
  onUpdatePerson,
  onDeletePerson,
  onImport,
  onSave,
  isSaveDisabled,
  isSaving = false,
}) => {
  const { isShared, handleShare } = useGroupEditor()

  return (
    <div id="group-editor" className={styles.groupEditor}>
      <section className={styles.section}>
        <div className={styles.header}>
          <div className={styles.headerRow}>
            <h3 className={styles.title}>データ入力</h3>
            <button type="button" className={styles.addButton} onClick={onAddPerson}>
              人物を追加
            </button>
          </div>
        </div>

        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.theadRow}>
                <th className={styles.th}>ラベル</th>
                <th className={styles.th}>指標データ</th>
                <th className={styles.th}>操作</th>
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
                        defaultValue={
                          person.ownership === 0 &&
                          person.consensus === 0 &&
                          person.diversity === 0 &&
                          person.identityFusion === 0
                            ? ''
                            : `${person.ownership}, ${person.consensus}, ${person.diversity}, ${person.identityFusion}`
                        }
                        onBlur={e => onImport(person.id, e.target.value)}
                        placeholder="オーナーシップ, コンセンサス, 自立, 融合"
                        className={styles.input}
                      />
                    </td>
                    <td className={styles.td}>
                      <div className={styles.cellActions}>
                        <Link
                          href={`/personal-plot?targetId=${person.id}`}
                          className={styles.linkToForm}
                          title="設問から入力"
                        >
                          <ClipboardList size={16} aria-hidden />
                          <span className={styles.linkToFormLabel}>設問から入力</span>
                        </Link>
                        <button
                          type="button"
                          className={styles.deleteButton}
                          onClick={() => onDeletePerson(person.id)}
                          title="削除"
                        >
                          <Trash2 size={16} aria-hidden />
                          <span className={styles.deleteButtonLabel}>削除</span>
                        </button>
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
          <div className={styles.footerActions}>
            <button type="button" className={styles.shareButton} onClick={handleShare}>
              {isShared ? <Check size={20} aria-hidden /> : <Share2 size={20} aria-hidden />}
              {isShared ? 'コピーしました' : 'このグループをシェア'}
            </button>
            <button
              type="button"
              className={styles.saveButton}
              onClick={onSave}
              disabled={isSaveDisabled || isSaving}
            >
              <span className={styles.saveButtonContent}>
                {isSaving ? (
                  <Loader2 size={20} className={styles.spinner} aria-hidden />
                ) : (
                  'このグループを一時保存'
                )}
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
