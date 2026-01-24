import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { useAtom } from 'jotai'
import { ValueOrientationMatrix, type PersonalPlot } from '../components/ValueOrientationMatrix'
import { Guide } from '../components/Guide'
import { GroupEditor } from '../components/GroupEditor'
import { groupAtom } from '../data/store'

export default function Home() {
  const [group, setGroup] = useAtom(groupAtom)
  const [isMounted, setIsMounted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // ハイドレーションエラー対策
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // マウント完了（DOM出現）後に、ハッシュがあればスクロール
  useEffect(() => {
    if (isMounted && window.location.hash === '#group-editor') {
      const el = document.getElementById('group-editor')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [isMounted])

  const handleSave = () => {
    setIsSaving(true)
    // atomWithStorage を使用しているため、setGroup を呼ぶだけで localStorage に保存される
    // 明示的な保存ボタンの役割として、現在の値を再セットすることで保存を確定させる
    setGroup({ ...group })
    setTimeout(() => {
      setIsSaving(false)
    }, 300)
  }

  const addPerson = () => {
    const newPerson: PersonalPlot = {
      id: Date.now().toString(),
      displayName: "",
      structuralLogic: 0,
      process: 0,
      interpersonal: 0,
      socialAdaptation: 0,
    }
    setGroup({
      ...group,
      personalPlotList: [...group.personalPlotList, newPerson]
    })
  }

  const updatePerson = (id: string, field: keyof PersonalPlot, value: string | number) => {
    setGroup({
      ...group,
      personalPlotList: group.personalPlotList.map((p) => 
        p.id === id ? { ...p, [field]: value } : p
      )
    })
  }

  const handleImport = (id: string, csvValue: string) => {
    const values = csvValue.split(',').map(v => parseInt(v.trim()))
    if (values.length === 4 && values.every(v => !isNaN(v))) {
      setGroup({
        ...group,
        personalPlotList: group.personalPlotList.map(p => 
          p.id === id ? {
            ...p,
            structuralLogic: values[0],
            process: values[1],
            interpersonal: values[2],
            socialAdaptation: values[3]
          } : p
        )
      })
    }
  }

  const deletePerson = (id: string) => {
    setGroup({
      ...group,
      personalPlotList: group.personalPlotList.filter((p) => p.id !== id)
    })
  }

  const isPersonComplete = (person: PersonalPlot): boolean => {
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

  const completePersonList = group.personalPlotList.filter(isPersonComplete)

  if (!isMounted) return null

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
            <div className="flex flex-col gap-8 items-center">
              <div className="max-w-lg w-full">
                <ValueOrientationMatrix personalPlotList={completePersonList} />
              </div>
            </div>

            {/* Input Group Editor */}
            <GroupEditor 
              groupName={group.name}
              personalPlotList={group.personalPlotList}
              onGroupNameChange={(name) => setGroup({ ...group, name })}
              onAddPerson={addPerson}
              onUpdatePerson={updatePerson}
              onDeletePerson={deletePerson}
              onImport={handleImport}
              onSave={handleSave}
              isSaveDisabled={group.name.trim() === "" || completePersonList.length === 0}
              isSaving={isSaving}
            />
          </section>

          {/* 解説セクション */}
          <Guide />
        </div>
      </main>
    </>
  )
}
