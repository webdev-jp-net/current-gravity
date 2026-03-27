'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import {
  isCompleteAnswersRecord,
  parseQuestionParam,
  PLOT_TARGET_ID_SESSION_KEY,
  questionListData,
  readAnswersFromForm,
  serializeAnswersToQuestionParam,
} from './personalPlotLogic'

export { parseQuestionParam, serializeAnswersToQuestionParam } from './personalPlotLogic'

export const usePersonalPlot = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const targetIdFromUrl = searchParams.get('targetId')
  const questionFromUrl = searchParams.get('question')

  const parsedFromUrl = useMemo(
    () => parseQuestionParam(questionFromUrl),
    [questionFromUrl]
  )

  /** 結果から「結果を編集する」等で `question=` 付き遷移したとき1回だけ保持し、URL からは外す */
  const [frozenSeed, setFrozenSeed] = useState<Record<string, number> | null>(null)

  const effectiveDefaults = useMemo((): Record<string, number> => {
    if (frozenSeed !== null) return frozenSeed
    if (isCompleteAnswersRecord(parsedFromUrl)) return parsedFromUrl
    return {}
  }, [frozenSeed, parsedFromUrl])

  const formRef = useRef<HTMLFormElement>(null)
  const [formValid, setFormValid] = useState(false)

  const [orderedQuestionList, setOrderedQuestionList] = useState<
    (typeof questionListData)[number][]
  >([])
  const [isMounted, setIsMounted] = useState(false)

  const valueLocusQuestionList = useMemo(
    () => orderedQuestionList.filter(q => q.axis === 'valueLocus'),
    [orderedQuestionList]
  )
  const boundaryQuestionList = useMemo(
    () => orderedQuestionList.filter(q => q.axis === 'boundary'),
    [orderedQuestionList]
  )
  const totalCount = orderedQuestionList.length

  useEffect(() => {
    const valueLocusList = questionListData.filter(q => q.axis === 'valueLocus')
    const boundaryList = questionListData.filter(q => q.axis === 'boundary')
    setOrderedQuestionList([...valueLocusList, ...boundaryList])
    setIsMounted(true)
  }, [])

  /** 入力ルートに入ったとき、前ターンの結果連携用 targetId を残さない（送信時に改めて書く） */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(PLOT_TARGET_ID_SESSION_KEY)
    }
  }, [])

  useLayoutEffect(() => {
    if (!isMounted) return
    if (!isCompleteAnswersRecord(parsedFromUrl)) return
    setFrozenSeed({ ...parsedFromUrl })
    const params = new URLSearchParams(searchParams.toString())
    params.delete('question')
    const qs = params.toString()
    void router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }, [isMounted, parsedFromUrl, pathname, questionFromUrl, router, searchParams])

  /** Group Editor からの `targetId` 付き遷移時、先頭設問付近へスクロール */
  useEffect(() => {
    if (!isMounted || !targetIdFromUrl) return
    requestAnimationFrame(() => {
      document.getElementById('question-0')?.scrollIntoView({ behavior: 'smooth' })
    })
  }, [isMounted, targetIdFromUrl])

  const syncFormValid = useCallback(() => {
    const el = formRef.current
    if (!el) return
    setFormValid(el.checkValidity())
  }, [])

  useEffect(() => {
    if (!isMounted) return
    syncFormValid()
  }, [isMounted, syncFormValid])

  /** URL シード直後など、20 問そろったあと submit 活性を合わせる */
  useEffect(() => {
    if (!isMounted || !isCompleteAnswersRecord(effectiveDefaults)) return
    requestAnimationFrame(() => syncFormValid())
  }, [effectiveDefaults, isMounted, syncFormValid])

  const handleFormInput = useCallback(() => {
    syncFormValid()
  }, [syncFormValid])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }
    const answers = readAnswersFromForm(form)
    if (!isCompleteAnswersRecord(answers)) return

    if (typeof window !== 'undefined') {
      if (targetIdFromUrl) {
        window.sessionStorage.setItem(PLOT_TARGET_ID_SESSION_KEY, targetIdFromUrl)
      } else {
        window.sessionStorage.removeItem(PLOT_TARGET_ID_SESSION_KEY)
      }
    }

    const params = new URLSearchParams()
    params.set('question', serializeAnswersToQuestionParam(answers))
    router.push(`/personal-plot/result?${params.toString()}`)
  }

  const scrollToQuestion = (index: number) => {
    window.location.hash = `question-${index}`
  }

  const handleBack = () => {
    router.push('/#group-editor')
  }

  return {
    isMounted,
    formRef,
    formValid,
    handleFormInput,
    effectiveDefaults,
    valueLocusQuestionList,
    boundaryQuestionList,
    totalCount,
    scrollToQuestion,
    handleSubmit,
    handleBack,
  }
}
