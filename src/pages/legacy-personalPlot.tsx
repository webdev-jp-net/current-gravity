import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useAtom } from 'jotai'
import questionListData from '../data/questionList.json'
import { type PersonalPlot } from '../components/ValueOrientationMatrix'
import { groupAtom } from '../data/store'

export default function PersonalPlotInput() {
  const router = useRouter()
  const [group, setGroup] = useAtom(groupAtom)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // 設問を軸ごとにシャッフル
    const shuffleArray = (array: any[]) => {
      const shuffled = [...array]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
    }

    const valueLocusQuestions = questionListData.filter(q => q.axis === 'valueLocus')
    const boundaryQuestions = questionListData.filter(q => q.axis === 'boundary')

    setShuffledQuestions([
      ...shuffleArray(valueLocusQuestions),
      ...shuffleArray(boundaryQuestions)
    ])
    
    setIsMounted(true)
  }, [])

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const isAllAnswered = questionListData.every((q) => answers[q.id] !== undefined)

  const handleSubmit = () => {
    if (!isAllAnswered) return

    const { targetId } = router.query

    // 指標の計算
    const metrics = {
      ownership: 0,
      consensus: 0,
      diversity: 0,
      identityFusion: 0,
    }

    questionListData.forEach((q: any) => {
      const val = answers[q.id] || 0
      // orientation ごとにスコアを合算
      metrics[q.orientation as keyof typeof metrics] += val
    })

    if (targetId && typeof targetId === 'string') {
      // 既存レコードの更新
      setGroup({
        ...group,
        personalPlotList: group.personalPlotList.map(p => 
          p.id === targetId ? {
            ...p,
            ...metrics,
          } : p
        )
      })
    } else {
      // 新しいプロットを追加（名前は空欄）
      const newPlot: PersonalPlot = {
        id: Date.now().toString(),
        displayName: '',
        ...metrics,
      }
      setGroup({
        ...group,
        personalPlotList: [...group.personalPlotList, newPlot]
      })
    }

    // indexへ戻る（エディタ位置へスクロール）
    router.push('/#group-editor')
  }

  const renderQuestion = (q: any) => (
    <div key={q.id} className="flex flex-col gap-6 p-8 bg-white rounded-ldsg-400 border border-gray-border">
      <h3 className="text-body text-dark">{q.question}</h3>
      <div className="flex flex-col gap-4">
        {/* 回答エリア: SPでは2段（ラベル左右分かち + 下段ラジオ）、LGでは1段 */}
        <div className="flex flex-wrap lg:flex-nowrap lg:items-center gap-y-4 lg:gap-15 max-w-md lg:max-w-4xl mx-auto w-full">
          {/* 最小値ラベル: SPでは上段左、LGでは左端 */}
          <span className="text-caption text-gray-paragraph text-left w-1/2 lg:w-40 lg:flex-shrink-0 order-1">
            {q.label.min}
          </span>
          
          {/* 最大値ラベル: SPでは上段右、LGでは右端 */}
          <span className="text-caption text-gray-paragraph text-right w-1/2 lg:w-40 lg:flex-shrink-0 order-2 lg:order-3">
            {q.label.max}
          </span>

          {/* ラジオボタン: SPでは下段、LGでは中央 */}
          <div className="flex justify-between w-full lg:flex-1 order-3 lg:order-2 px-6">
            {[-2, -1, 1, 2].map((val) => (
              <label key={val} className="relative flex items-center justify-center cursor-pointer group py-2">
                <input
                  type="radio"
                  name={q.id}
                  value={val}
                  checked={answers[q.id] === val}
                  onChange={() => handleAnswerChange(q.id, val)}
                  className="sr-only"
                />
                <div className={`
                  w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-300
                  ${answers[q.id] === val 
                    ? 'border-primary bg-white' 
                    : 'border-gray-border-medium bg-white group-hover:border-gray-caption'}
                `}>
                  {answers[q.id] === val && (
                    <div className="w-4.5 h-4.5 rounded-full bg-primary animate-in zoom-in duration-300" />
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  if (!isMounted) return null

  return (
    <>
      <Head>
        <title>あなたのいまの重心を測定 | CURRENT GRAVITY</title>
      </Head>

      <main className="min-h-screen py-20 lg:py-22 px-8 lg:px-15 bg-tertiary">
        <div className="max-w-guide-compressed mx-auto flex flex-col gap-15 lg:gap-20">
          <div className="flex flex-col gap-4">
            <h1 className="text-section-mobile lg:text-section text-dark">
              あなたのいまの重心を測定
            </h1>
            <p className="text-body text-gray-paragraph">
              設問のシチュエーションについて、直感であなたに近いフィーリングを選択してください。
            </p>
          </div>

          {/* 帰属セクション */}
          <section className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <h2 className="text-h2 text-dark">帰属</h2>
              <p className="text-body text-gray-paragraph">
                判断・決定・結果に対する責任の帰属をあらわした志向です。
              </p>
            </div>
            <div className="flex flex-col gap-8">
              {shuffledQuestions
                .filter(q => q.axis === 'valueLocus')
                .map((q) => renderQuestion(q))}
            </div>
          </section>

          {/* 関係性セクション */}
          <section className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <h2 className="text-h2 text-dark">関係性</h2>
              <p className="text-body text-gray-paragraph">
                自分以外のモノ・人・現象との関係性をあらわした志向です。
              </p>
            </div>
            <div className="flex flex-col gap-8">
              {shuffledQuestions
                .filter(q => q.axis === 'boundary')
                .map((q) => renderQuestion(q))}
            </div>
          </section>

          <div className="flex justify-center pt-11">
            <button
              onClick={handleSubmit}
              disabled={!isAllAnswered}
              className="bg-primary text-white px-12 py-4 rounded-ldsg-200 font-bold text-h4 hover:opacity-80 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              回答を完了してプロットを追加
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
