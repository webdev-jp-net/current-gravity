import React from 'react'
import { Trash2, Loader2, ClipboardList } from 'lucide-react'
import Link from 'next/link'
import { type PersonalPlot } from './ValueOrientationMatrix'

interface GroupEditorProps {
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

export const GroupEditor: React.FC<GroupEditorProps> = ({
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
  return (
    <div id="group-editor" className="bg-white rounded-ldsg-400 border border-gray-border p-8 flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h3 className="text-h3 text-dark">データ入力</h3>
          <div className="flex gap-4">
            <button 
              onClick={onAddPerson}
              className="bg-primary text-white px-6 py-2 rounded-ldsg-200 font-bold hover:opacity-80 transition-opacity"
            >
              人物を追加
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-border">
              <th className="py-4 px-2 text-label text-gray-paragraph w-1/4">ラベル</th>
              <th className="py-4 px-2 text-label text-gray-paragraph">
                指標データ（カンマ区切り）
              </th>
              <th className="py-4 px-2 text-label text-gray-paragraph text-right whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody>
            {personalPlotList.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-12 text-center text-body text-gray-placeholder">
                  「人物を追加」ボタンをクリックしてデータを入力してください
                </td>
              </tr>
            ) : (
              personalPlotList.map((person) => (
                <tr key={person.id} className="border-b border-gray-border">
                  <td className="py-4 px-2">
                    <input
                      type="text"
                      value={person.displayName}
                      onChange={(e) => onUpdatePerson(person.id, "displayName", e.target.value)}
                      placeholder="名前"
                      className="w-full border border-gray-border rounded-ldsg-100 px-3 py-2 text-body focus:outline-none focus:border-primary"
                    />
                  </td>
                  <td className="py-4 px-2">
                    <input
                      type="text"
                      defaultValue={person.structuralLogic === 0 && person.process === 0 && person.interpersonal === 0 && person.socialAdaptation === 0 
                        ? "" 
                        : `${person.structuralLogic}, ${person.process}, ${person.interpersonal}, ${person.socialAdaptation}`}
                      onBlur={(e) => onImport(person.id, e.target.value)}
                      placeholder="構造, プロセス, 人物, 社会的調和"
                      className="w-full border border-gray-border rounded-ldsg-100 px-3 py-2 text-body focus:outline-none focus:border-primary"
                    />
                  </td>
                  <td className="py-4 px-2 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-4 lg:gap-6">
                      <Link
                        href={`/personalPlot?targetId=${person.id}`}
                        className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-opacity text-label"
                        title="設問から入力"
                      >
                        <ClipboardList size={16} className="flex-shrink-0" />
                        <span className="hidden sm:inline">設問から入力</span>
                      </Link>
                      <button
                        onClick={() => onDeletePerson(person.id)}
                        className="inline-flex items-center gap-2 text-gray-placeholder hover:text-error transition-colors text-label"
                        title="削除"
                      >
                        <Trash2 size={16} className="flex-shrink-0" />
                        <span className="hidden sm:inline">削除</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t border-gray-border">
          <input
            id="group-name"
            type="text"
            value={groupName}
            onChange={(e) => onGroupNameChange(e.target.value)}
            placeholder="グループ名を入力"
            className="w-full sm:max-w-md border border-gray-border rounded-ldsg-100 px-3 py-2 text-body focus:outline-none focus:border-primary"
          />
        <button 
          onClick={onSave}
          disabled={isSaveDisabled || isSaving}
          className="w-full sm:w-auto bg-primary text-white px-8 py-2 rounded-ldsg-200 font-bold hover:opacity-80 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <div className="flex items-center justify-center h-5">
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : "このグループを保存"}
          </div>
        </button>
      </div>
    </div>
  )
}
