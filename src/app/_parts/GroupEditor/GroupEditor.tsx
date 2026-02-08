'use client'

import type { FC } from 'react'

import { Trash2, Loader2, ClipboardList, Share2, Check } from 'lucide-react'
import Link from 'next/link'

import { type PersonalPlot } from '@/components/ValueOrientationMatrix'

import styles from './GroupEditor.module.scss'

import { useGroupEditor } from './useGroupEditor'

export interface GroupEditorProps {
  groupName: string
  personalPlotList: PersonalPlot[]
  onGroupNameChange: (name: string) => void
  onAddPerson: () => void
  onUpdatePerson: (
    id: string,
    field: keyof PersonalPlot,
    value: string | number
  ) => void
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
      <div>
        <div>
          <h3>データ入力</h3>
          <div>
            <button type="button" onClick={onAddPerson}>
              人物を追加
            </button>
          </div>
        </div>
      </div>

      <div>
        <table>
          <thead>
            <tr>
              <th>ラベル</th>
              <th>指標データ（カンマ区切り）</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {personalPlotList.length === 0 ? (
              <tr>
                <td colSpan={3}>
                  「人物を追加」ボタンをクリックしてデータを入力してください
                </td>
              </tr>
            ) : (
              personalPlotList.map((person) => (
                <tr key={person.id}>
                  <td>
                    <input
                      type="text"
                      value={person.displayName}
                      onChange={(e) =>
                        onUpdatePerson(person.id, 'displayName', e.target.value)
                      }
                      placeholder="名前"
                    />
                  </td>
                  <td>
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
                      onBlur={(e) => onImport(person.id, e.target.value)}
                      placeholder="オーナーシップ, コンセンサス, 自立, 融合"
                    />
                  </td>
                  <td>
                    <div>
                      <Link
                        href={`/personal-plot?targetId=${person.id}`}
                        title="設問から入力"
                      >
                        <ClipboardList size={16} />
                        <span>設問から入力</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => onDeletePerson(person.id)}
                        title="削除"
                      >
                        <Trash2 size={16} />
                        <span>削除</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div>
        <input
          id="group-name"
          type="text"
          value={groupName}
          onChange={(e) => onGroupNameChange(e.target.value)}
          placeholder="グループ名を入力"
        />
        <div>
          <button type="button" onClick={handleShare}>
            <span>
              {isShared ? (
                <Check size={20} />
              ) : (
                <Share2 size={20} />
              )}
              {isShared ? 'コピーしました' : 'このグループをシェア'}
            </span>
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaveDisabled || isSaving}
          >
            <span>
              {isSaving ? <Loader2 size={20} /> : 'このグループを一時保存'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
