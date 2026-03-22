'use client'

import { useCallback, useEffect, useLayoutEffect, useState } from 'react'

import { useAtom } from 'jotai'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import questionListData from '@/data/questionList.json'
import { groupAtom } from '@/data/store'

import type { PersonalPlot } from '@/type/personalPlot'

const VALID_VALUES = new Set([-2, -1, 0, 1, 2])

const questionIds = new Set(questionListData.map(q => q.id))

/** question= の値をパース。無効なトークンはスキップ。 */
export const parseQuestionParam = (raw: string | null): Record<string, number> => {
  if (!raw) return {}
  const out: Record<string, number> = {}
  for (const segment of raw.split(',')) {
    if (!segment) continue
    const idx = segment.lastIndexOf('_')
    if (idx <= 0) continue
    const id = segment.slice(0, idx)
    const num = Number(segment.slice(idx + 1))
    if (!questionIds.has(id) || Number.isNaN(num) || !VALID_VALUES.has(num)) continue
    out[id] = num
  }
  return out
}

/** questionList.json の出現順で安定した question= 用文字列を生成。未回答は含めない。 */
export const serializeAnswersToQuestionParam = (answers: Record<string, number>): string => {
  const parts: string[] = []
  for (const q of questionListData) {
    const v = answers[q.id]
    if (v === undefined) continue
    parts.push(`${q.id}_${v}`)
  }
  return parts.join(',')
}

export const usePersonalPlot = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [group, setGroup] = useAtom(groupAtom)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [orderedQuestionList, setOrderedQuestionList] = useState<
    (typeof questionListData)[number][]
  >([])
  const [isMounted, setIsMounted] = useState(false)

  const questionFromUrl = searchParams.get('question')
  const urlKeyForAnswers = `${searchParams.get('targetId') ?? ''}|${questionFromUrl ?? ''}`

  useEffect(() => {
    const valueLocusList = questionListData.filter(q => q.axis === 'valueLocus')
    const boundaryList = questionListData.filter(q => q.axis === 'boundary')
    // filter は元配列順を保つため、questionList.json の出現順（帰属→関係性）を維持する
    setOrderedQuestionList([...valueLocusList, ...boundaryList])
    setIsMounted(true)
  }, [])

  // URL を正: クエリが変わったら（戻る・直リンク含む）回答を復元
  // useLayoutEffect: 直後の「answers → URL」effect が古い answers {} で走り URL を壊さないよう、同一コミット内で先に state を揃える
  useLayoutEffect(() => {
    setAnswers(parseQuestionParam(questionFromUrl))
  }, [urlKeyForAnswers, questionFromUrl])

  const replaceUrlWithAnswers = useCallback(
    (nextAnswers: Record<string, number>) => {
      const params = new URLSearchParams()
      const targetId = searchParams.get('targetId')
      if (targetId) params.set('targetId', targetId)
      const q = serializeAnswersToQuestionParam(nextAnswers)
      if (q) params.set('question', q)
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  // レンダー／setState 更新関数内では router を触れない。effect で URL へ書き戻す。
  useEffect(() => {
    const serialized = serializeAnswersToQuestionParam(answers)
    const currentQ = questionFromUrl ?? ''
    if (serialized === currentQ) return
    replaceUrlWithAnswers(answers)
  }, [answers, questionFromUrl, replaceUrlWithAnswers])

  const valueLocusQuestionList = orderedQuestionList.filter(q => q.axis === 'valueLocus')
  const boundaryQuestionList = orderedQuestionList.filter(q => q.axis === 'boundary')
  const totalCount = orderedQuestionList.length

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleAnswerChangeWithScroll = (
    questionId: string,
    value: number,
    currentIndex: number
  ) => {
    handleAnswerChange(questionId, value)
    if (currentIndex + 1 < totalCount) {
      window.location.hash = `question-${currentIndex + 1}`
    }
  }

  const isAllAnswered = questionListData.every(q => answers[q.id] !== undefined)

  const handleSubmit = () => {
    if (!isAllAnswered || !searchParams) return

    const targetId = searchParams.get('targetId')

    const metrics = {
      ownership: 0,
      consensus: 0,
      diversity: 0,
      identityFusion: 0,
    }

    questionListData.forEach(q => {
      const val = answers[q.id] ?? 0
      metrics[q.orientation as keyof typeof metrics] += val
    })

    const defaultName = '名前'

    if (targetId) {
      setGroup({
        ...group,
        personalPlotList: group.personalPlotList.map(p =>
          p.id === targetId
            ? {
                ...p,
                ...metrics,
                displayName: p.displayName.trim() === '' ? defaultName : p.displayName,
              }
            : p
        ),
      })
    } else {
      const newPlot: PersonalPlot = {
        id: Date.now().toString(),
        displayName: defaultName,
        ...metrics,
      }
      setGroup({
        ...group,
        personalPlotList: [...group.personalPlotList, newPlot],
      })
    }

    router.push('/#matrix')
  }

  const handleBack = () => {
    router.push('/#group-editor')
  }

  return {
    isMounted,
    answers,
    valueLocusQuestionList,
    boundaryQuestionList,
    totalCount,
    handleAnswerChangeWithScroll,
    isAllAnswered,
    handleSubmit,
    handleBack,
  }
}
