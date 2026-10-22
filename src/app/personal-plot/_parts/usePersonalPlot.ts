'use client'

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'

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

/** 設問は静的データ。帰属志向→関係性志向の順で固定する */
const ORDERED_QUESTION_LIST = [
  ...questionListData.filter(q => q.axis === 'valueLocus'),
  ...questionListData.filter(q => q.axis === 'boundary'),
]
const VALUE_LOCUS_QUESTION_LIST = ORDERED_QUESTION_LIST.filter(q => q.axis === 'valueLocus')
const BOUNDARY_QUESTION_LIST = ORDERED_QUESTION_LIST.filter(q => q.axis === 'boundary')

/** useSyncExternalStore 用。値は変化しないので購読は何もしない */
const subscribeNoop = () => () => {}

export const usePersonalPlot = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const targetIdFromUrl = searchParams.get('targetId')
  const questionFromUrl = searchParams.get('question')

  const parsedFromUrl = useMemo(() => parseQuestionParam(questionFromUrl), [questionFromUrl])

  /** 結果から「結果を編集する」等で `question=` 付き遷移したとき1回だけ保持し、URL からは外す */
  const [frozenSeed] = useState<Record<string, number> | null>(() =>
    isCompleteAnswersRecord(parsedFromUrl) ? { ...parsedFromUrl } : null
  )

  const effectiveDefaults = useMemo((): Record<string, number> => {
    if (frozenSeed !== null) return frozenSeed
    if (isCompleteAnswersRecord(parsedFromUrl)) return parsedFromUrl
    return {}
  }, [frozenSeed, parsedFromUrl])

  const formRef = useRef<HTMLFormElement>(null)
  const [formValid, setFormValid] = useState(false)
  const [answeredCount, setAnsweredCount] = useState(0)

  const valueLocusQuestionList = VALUE_LOCUS_QUESTION_LIST
  const boundaryQuestionList = BOUNDARY_QUESTION_LIST
  const totalCount = ORDERED_QUESTION_LIST.length

  /** サーバーでは false、クライアントでは true。ハイドレーション後の処理を1レンダー遅らせる */
  const isMounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  )

  /** 入力ルートに入ったとき、前ターンの結果連携用 targetId を残さない（送信時に改めて書く） */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(PLOT_TARGET_ID_SESSION_KEY)
    }
  }, [])

  useLayoutEffect(() => {
    if (!isMounted) return
    if (!isCompleteAnswersRecord(parsedFromUrl)) return
    const params = new URLSearchParams(searchParams.toString())
    params.delete('question')
    const qs = params.toString()
    void router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }, [isMounted, parsedFromUrl, pathname, questionFromUrl, router, searchParams])

  const syncFormState = useCallback(() => {
    const el = formRef.current
    if (!el) return
    setFormValid(el.checkValidity())
    setAnsweredCount(Object.keys(readAnswersFromForm(el)).length)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    syncFormState()
  }, [isMounted, syncFormState])

  /** URLからの事前選択直後など、20問そろったあとsubmit活性を合わせる */
  useEffect(() => {
    if (!isMounted || !isCompleteAnswersRecord(effectiveDefaults)) return
    requestAnimationFrame(() => syncFormState())
  }, [effectiveDefaults, isMounted, syncFormState])

  const handleFormInput = useCallback(() => {
    syncFormState()
  }, [syncFormState])

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
    answeredCount,
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
