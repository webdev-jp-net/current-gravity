'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import {
  isCompleteAnswersRecord,
  parseQuestionParam,
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

    const params = new URLSearchParams()
    if (targetIdFromUrl) params.set('targetId', targetIdFromUrl)
    params.set('question', serializeAnswersToQuestionParam(answers))
    router.push(`/personal-plot/result?${params.toString()}`)
  }

  const handleAnswerSelectWithScroll = (_id: string, _val: number, currentIndex: number) => {
    if (currentIndex + 1 < totalCount) {
      window.location.hash = `question-${currentIndex + 1}`
    }
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
    handleAnswerSelectWithScroll,
    handleSubmit,
    handleBack,
  }
}
