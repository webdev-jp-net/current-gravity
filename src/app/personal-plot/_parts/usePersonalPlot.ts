'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { useAtom } from 'jotai'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import questionListData from '@/data/questionList.json'
import { groupAtom } from '@/data/store'

import type { PersonalPlot } from '@/type/personalPlot'

const VALID_VALUES = new Set([-2, -1, 0, 1, 2])

const questionIds = new Set(questionListData.map(q => q.id))

/** question=の値をパース。無効なトークンはスキップ。 */
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

/** questionList.jsonの出現順で安定したquestion=用文字列を生成。未回答は含めない。 */
export const serializeAnswersToQuestionParam = (answers: Record<string, number>): string => {
  const parts: string[] = []
  for (const q of questionListData) {
    const v = answers[q.id]
    if (v === undefined) continue
    parts.push(`${q.id}_${v}`)
  }
  return parts.join(',')
}

/** URL生文字列とstateの両方をquestionList順の正規形にそろえて比較する（順序差・無効トークン除外後の一致を検出）。 */
const canonicalQuestionParamFromUrl = (raw: string | null): string =>
  serializeAnswersToQuestionParam(parseQuestionParam(raw))

const answersRecordEqual = (a: Record<string, number>, b: Record<string, number>): boolean => {
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  if (keysA.length !== keysB.length) return false
  for (const k of keysA) {
    if (a[k] !== b[k]) return false
  }
  return true
}

export const usePersonalPlot = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  /** useSearchParamsは参照が毎レンダー変わり得る。depsに入れるとURL同期effectが連鎖しうる */
  const searchParamsRef = useRef(searchParams)
  searchParamsRef.current = searchParams

  /** URLからanswersを流し込んだ直後はrouter.replaceを走らせない（ループ防止） */
  const suppressUrlPushRef = useRef(false)

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
    // filterは元配列順を保つため、questionList.jsonの出現順（帰属→関係性）を維持する
    setOrderedQuestionList([...valueLocusList, ...boundaryList])
    setIsMounted(true)
  }, [])

  // URLを正: クエリが変わったら（戻る・直リンク含む）回答を復元
  // useLayoutEffect: 直後の「answers→URL」effectが古いanswers{}で走りURLを壊さないよう、同一コミット内で先にstateを揃える
  // 同一内容のオブジェクトを毎回setしない（effectの連鎖・無限ループを防ぐ）
  useLayoutEffect(() => {
    suppressUrlPushRef.current = true
    const q = searchParamsRef.current.get('question')
    setAnswers(prev => {
      const next = parseQuestionParam(q)
      return answersRecordEqual(prev, next) ? prev : next
    })
  }, [urlKeyForAnswers])

  /** pathname/routerのみdeps。searchParamsはref経由（参照変化でeffectが再登録されない） */
  const replaceUrlWithAnswers = useCallback(
    (nextAnswers: Record<string, number>) => {
      const params = new URLSearchParams()
      const targetId = searchParamsRef.current.get('targetId')
      if (targetId) params.set('targetId', targetId)
      const q = serializeAnswersToQuestionParam(nextAnswers)
      if (q) params.set('question', q)
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router]
  )

  // レンダー／setState更新関数内ではrouterを触れない。effectでURLへ書き戻す。
  // 正規形で比較+URL復元直後は1回スキップ（replaceの連鎖防止）
  useEffect(() => {
    if (suppressUrlPushRef.current) {
      suppressUrlPushRef.current = false
      return
    }
    const serialized = serializeAnswersToQuestionParam(answers)
    const canonicalFromUrl = canonicalQuestionParamFromUrl(questionFromUrl)
    if (serialized === canonicalFromUrl) return
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
