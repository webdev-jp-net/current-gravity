import React, { useState } from 'react'
import Head from 'next/head'
import { Trash2 } from 'lucide-react'
import { ValueOrientationMatrix, type Person } from '../components/ValueOrientationMatrix'
import { Guide } from '../components/Guide'

export default function Home() {
  const [personList, setPersonList] = useState<Person[]>([])

  const addPerson = () => {
    const newPerson: Person = {
      id: Date.now().toString(),
      displayName: "",
      structuralLogic: 0,
      process: 0,
      interpersonal: 0,
      socialAdaptation: 0,
    }
    setPersonList([...personList, newPerson])
  }

  const updatePerson = (id: string, field: keyof Person, value: string | number) => {
    setPersonList(personList.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const deletePerson = (id: string) => {
    setPersonList(personList.filter((p) => p.id !== id))
  }

  const isPersonComplete = (person: Person): boolean => {
    return (
      person.displayName.trim() !== "" &&
      person.structuralLogic >= -10 &&
      person.structuralLogic <= 10 &&
      person.process >= -10 &&
      person.process <= 10 &&
      person.interpersonal >= -10 &&
      person.interpersonal <= 10 &&
      person.socialAdaptation >= -10 &&
      person.socialAdaptation <= 10
    )
  }

  const completePersonList = personList.filter(isPersonComplete)

  return (
    <>
      <Head>
        <title>価値志向モデル（Value Orientation Model）</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="min-h-screen py-20 lg:py-22 px-8 lg:px-15 bg-tertiary">
        <div className="max-w-container mx-auto flex flex-col gap-20 lg:gap-35">
          {/* Page Header */}
          <div className="flex flex-col gap-4">
            <h1 className="text-section-mobile lg:text-section text-dark">
              価値志向モデル
            </h1>
            <p className="text-body text-gray-paragraph">
              価値志向モデルは、自分がどのような判断の引き受け方・関係の持ち方をすると心地良いかを可視化し、
              選択的にそうしている自分を把握することを目的とした志向プロファイルです。
            </p>
            <p className="text-body text-gray-paragraph">
              自己理解や心理的リソースを運用の補助ツールとして利用できます。
              他者の志向も可視化し相関図にすると、集団の志向や棲み分けを構造的に捉える参考資料にもなります。
            </p>
            <p className="text-body text-gray-paragraph">
              なお、このモデルは評価の正しさ・能力・成果の大小を測るものではありません。
            </p>
          </div>

          {/* Matrix and Form Section */}
          <section className="flex flex-col gap-20 lg:gap-35">
            <div className="max-w-lg mx-auto w-full">
              <ValueOrientationMatrix personList={completePersonList} />
            </div>

            {/* Input Table */}
            <div className="bg-white rounded-ldsg-400 border border-gray-border p-8 flex flex-col gap-8">
              <div className="flex justify-between items-center">
                <h3 className="text-h3 text-dark">データ入力</h3>
                <button 
                  onClick={addPerson}
                  className="bg-primary text-white px-6 py-2 rounded-ldsg-200 font-bold hover:opacity-80 transition-opacity"
                >
                  人物を追加
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-border">
                      <th className="py-4 px-2 text-label text-gray-paragraph">表示名</th>
                      <th className="py-4 px-2 text-label text-gray-paragraph">
                        インポート（構造, プロセス, 人物, 社会的調和）
                      </th>
                      <th className="py-4 px-2 text-label text-gray-paragraph text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {personList.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-12 text-center text-body text-gray-placeholder">
                          「人物を追加」ボタンをクリックしてデータを入力してください
                        </td>
                      </tr>
                    ) : (
                      personList.map((person) => (
                        <tr key={person.id} className="border-b border-gray-border">
                          <td className="py-4 px-2">
                            <input
                              type="text"
                              value={person.displayName}
                              onChange={(e) => updatePerson(person.id, "displayName", e.target.value)}
                              placeholder="名前を入力"
                              className="w-full border border-gray-border rounded-ldsg-100 px-3 py-2 text-body focus:outline-none focus:border-primary"
                            />
                          </td>
                          <td className="py-4 px-2">
                            <input
                              type="text"
                              value={`${person.structuralLogic}, ${person.process}, ${person.interpersonal}, ${person.socialAdaptation}`}
                              onChange={(e) => {
                                const values = e.target.value.split(',').map(v => parseInt(v.trim()))
                                if (values.length === 4) {
                                  setPersonList(personList.map(p => p.id === person.id ? {
                                    ...p,
                                    structuralLogic: isNaN(values[0]) ? p.structuralLogic : values[0],
                                    process: isNaN(values[1]) ? p.process : values[1],
                                    interpersonal: isNaN(values[2]) ? p.interpersonal : values[2],
                                    socialAdaptation: isNaN(values[3]) ? p.socialAdaptation : values[3]
                                  } : p))
                                }
                              }}
                              placeholder="0, 0, 0, 0"
                              className="w-full border border-gray-border rounded-ldsg-100 px-3 py-2 text-body focus:outline-none focus:border-primary"
                            />
                          </td>
                          <td className="py-4 px-2 text-center">
                            <button
                              onClick={() => deletePerson(person.id)}
                              className="text-gray-placeholder hover:text-error transition-colors"
                              aria-label="削除"
                            >
                              <Trash2 size={20} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 解説セクション */}
          <Guide />
        </div>
      </main>
    </>
  )
}
