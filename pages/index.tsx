import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useAtom } from 'jotai'
import { ValueOrientationMatrix, type PersonalPlot } from '../components/ValueOrientationMatrix'
import { Guide } from '../components/Guide'
import { GroupEditor } from '../components/GroupEditor'
import { groupAtom } from '../data/store'

export default function Home() {
  const router = useRouter()
  const [group, setGroup] = useAtom(groupAtom)
  const [isMounted, setIsMounted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // ハイドレーションエラー対策および初期URLパラメータ解析
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const nameParam = urlParams.get('name')
    const plotParams = urlParams.getAll('p')

    if (nameParam || plotParams.length > 0) {
      const personalPlotList: PersonalPlot[] = plotParams.map((p, index) => {
        const [displayName, ownership, consensus, diversity, identityFusion] = p.split(',')
        return {
          id: `url-${index}-${Date.now()}`,
          displayName: displayName || '',
          ownership: parseInt(ownership) || 0,
          consensus: parseInt(consensus) || 0,
          diversity: parseInt(diversity) || 0,
          identityFusion: parseInt(identityFusion) || 0,
        }
      })

      setGroup({
        name: nameParam || '新しいグループ',
        personalPlotList
      })
    }

    setIsMounted(true)
  }, [setGroup])

  // 状態をURLパラメータに同期
  useEffect(() => {
    if (!isMounted || !router.isReady) return

    const params = new URLSearchParams()
    if (group.name) {
      params.set('name', group.name)
    }
    
    group.personalPlotList.forEach(p => {
      // カンマ区切りのデータを作成（名前,O,C,D,I）
      const pData = [
        p.displayName,
        p.ownership,
        p.consensus,
        p.diversity,
        p.identityFusion
      ].join(',')
      params.append('p', pData)
    })

    const newQuery = params.toString()
    const currentQuery = window.location.search.replace(/^\?/, '')

    if (newQuery !== currentQuery) {
      const url = newQuery ? `/?${newQuery}` : '/'
      router.replace(url, undefined, { shallow: true })
    }
  }, [group, isMounted, router])

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
      ownership: 0,
      consensus: 0,
      diversity: 0,
      identityFusion: 0,
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
            ownership: values[0],
            consensus: values[1],
            diversity: values[2],
            identityFusion: values[3],
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
      person.ownership >= -10 && person.ownership <= 10 &&
      person.consensus >= -10 && person.consensus <= 10 &&
      person.diversity >= -10 && person.diversity <= 10 &&
      person.identityFusion >= -10 && person.identityFusion <= 10
    )
  }

  const completePersonList = group.personalPlotList.filter(isPersonComplete)

  if (!isMounted) return null

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="min-h-screen py-20 lg:py-22 px-8 lg:px-15 bg-tertiary">
        <div className="max-w-container mx-auto flex flex-col gap-20 lg:gap-35">
          {/* Page Header */}
          <div className="flex flex-col gap-4">
            <h1 className="text-section-mobile lg:text-section text-dark">
              <img
                src="/logo_large.svg"
                alt="CURRENT GRAVITY（カレントグラビティ）"
                className="w-full h-auto max-w-[540px] mx-auto"
              />
            </h1>
            <p className="text-body text-gray-paragraph">
            <strong>CURRENT GRAVITY</strong>（カレントグラビティ）は、あなたが<strong>判断の引き受け方</strong>と<strong>関係の持ち方</strong>を決める時、いま重心を置いている場所を可視化するプロファイリングモデルです。
            </p>
            <p className="text-body text-gray-paragraph">
              自分の特長を俯瞰して、選択的にそうしていることを知れば、自己理解や心理的リソースを運用の補助ツールとして利用できます。
              そして、仲間の志向も可視化し地図にしてみると、チーム全体の志向やメンバーどうしの棲み分けを構造的に捉える地図にもなります。これはチームダイナミクスのヒントになるかもしれません。
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
