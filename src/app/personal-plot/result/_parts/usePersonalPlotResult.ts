'use client'

import type { FormEvent } from 'react'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { useAtom } from 'jotai'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { groupAtom } from '@/data/store'

import {
  buildMatrixPreviewPersonalPlot,
  commitPlotToGroup,
  isCompleteAnswersRecord,
  parseQuestionParam,
  PLOT_TARGET_ID_SESSION_KEY,
  PREVIEW_PLACEHOLDER_ID,
  questionListData,
  serializeAnswersToQuestionParam,
} from '../../_parts/personalPlotLogic'

import type { PersonalPlot } from '@/type/personalPlot'

import { CLIPBOARD_COPY_UNAVAILABLE_MESSAGE, copyTextToClipboard } from '@/util/copyTextToClipboard'

const RESULT_COMMIT_STORAGE_PREFIX = 'pp-result-commit:'

const noopSetMatrixPreview = (() => {}) as (list: PersonalPlot[]) => void

export const usePersonalPlotResult = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const questionFromUrl = searchParams.get('question')
  const targetIdQueryParam = searchParams.get('targetId')

  /** クエリの targetId は基本使わず sessionStorage（送信時）で渡す。旧ブックマーク用 URL だけ query から拾い state に固定する */
  const [plotTargetId, setPlotTargetId] = useState<string | null>(() =>
    typeof window !== 'undefined' ? window.sessionStorage.getItem(PLOT_TARGET_ID_SESSION_KEY) : null
  )

  const resolvedTargetId = plotTargetId ?? targetIdQueryParam

  const [group, setGroup] = useAtom(groupAtom)
  const groupRef = useRef(group)
  groupRef.current = group

  const [isMounted, setIsMounted] = useState(false)
  const lastSubmittedSnapshotRef = useRef<string | null>(null)
  const [isShareCopied, setIsShareCopied] = useState(false)

  const parsedAnswers = useMemo(() => parseQuestionParam(questionFromUrl), [questionFromUrl])

  const isComplete = useMemo(() => isCompleteAnswersRecord(parsedAnswers), [parsedAnswers])

  const answersForCommit = useMemo((): Record<string, number> | null => {
    if (!isComplete) return null
    return parsedAnswers
  }, [isComplete, parsedAnswers])

  const matrixPreviewList = useMemo((): PersonalPlot[] => {
    if (!answersForCommit) return []
    return [
      buildMatrixPreviewPersonalPlot({
        answers: answersForCommit,
        targetId: resolvedTargetId,
        group,
        plotId: resolvedTargetId ?? PREVIEW_PLACEHOLDER_ID,
      }),
    ]
  }, [answersForCommit, group, resolvedTargetId])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  /**
   * URL が20問完備のとき、groupAtom へ1回だけ反映する。
   * sessionStorage で Strict Mode 二重実行時の二重追加を防ぐ。
   * targetId は plotTargetId（session）と query（旧 URL）の論理和で解決し、反映後に query からは外す。
   */
  useLayoutEffect(() => {
    if (!isComplete || !answersForCommit) return

    const tidFromUrl = searchParams.get('targetId')
    const effectiveTargetId = plotTargetId ?? tidFromUrl

    const snapshot = serializeAnswersToQuestionParam(answersForCommit)
    const storageKey = `${RESULT_COMMIT_STORAGE_PREFIX}${effectiveTargetId ?? ''}|${snapshot}`

    const stripTargetIdFromUrl = () => {
      if (!tidFromUrl) return
      setPlotTargetId(prev => prev ?? tidFromUrl)
      const params = new URLSearchParams(searchParams.toString())
      params.delete('targetId')
      const qs = params.toString()
      void router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    }

    if (typeof window !== 'undefined' && window.sessionStorage.getItem(storageKey)) {
      lastSubmittedSnapshotRef.current = snapshot
      stripTargetIdFromUrl()
      return
    }

    commitPlotToGroup({
      answers: answersForCommit,
      targetId: effectiveTargetId,
      getLatestGroup: () => groupRef.current,
      setGroup,
      setMatrixPreviewList: noopSetMatrixPreview,
    })
    lastSubmittedSnapshotRef.current = snapshot
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(storageKey, '1')
    }
    stripTargetIdFromUrl()
  }, [
    answersForCommit,
    isComplete,
    pathname,
    plotTargetId,
    questionFromUrl,
    router,
    searchParams,
    setGroup,
  ])

  const handleNavigateToHomeMatrix = () => {
    if (!answersForCommit) return

    const snapshot = serializeAnswersToQuestionParam(answersForCommit)
    const alreadyCommitted =
      lastSubmittedSnapshotRef.current !== null && snapshot === lastSubmittedSnapshotRef.current

    if (!alreadyCommitted) {
      commitPlotToGroup({
        answers: answersForCommit,
        targetId: resolvedTargetId,
        getLatestGroup: () => groupRef.current,
        setGroup,
        setMatrixPreviewList: noopSetMatrixPreview,
      })
      lastSubmittedSnapshotRef.current = snapshot
    }

    queueMicrotask(() => {
      void router.push('/')
      queueMicrotask(() => {
        if (typeof window !== 'undefined') {
          window.location.hash = '#matrix'
        }
      })
    })
  }

  /** 結果ページで保持している回答（URL 由来）で入力ルートへ渡す */
  const handleEditFormSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!answersForCommit) return

      const params = new URLSearchParams()
      if (resolvedTargetId) params.set('targetId', resolvedTargetId)
      params.set('question', serializeAnswersToQuestionParam(answersForCommit))
      void router.push(`/personal-plot?${params.toString()}`)
    },
    [answersForCommit, resolvedTargetId, router]
  )

  const handleCopyResultShareUrl = useCallback(() => {
    const params = new URLSearchParams()
    if (answersForCommit) {
      const q = serializeAnswersToQuestionParam(answersForCommit)
      if (q) params.set('question', q)
    }
    const qs = params.toString()
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const url = qs ? `${origin}${pathname}?${qs}` : `${origin}${pathname}`
    void copyTextToClipboard(url).then(ok => {
      if (ok) {
        setIsShareCopied(true)
        setTimeout(() => setIsShareCopied(false), 2000)
      } else {
        alert(CLIPBOARD_COPY_UNAVAILABLE_MESSAGE)
      }
    })
  }, [answersForCommit, pathname])

  const orderedQuestionList = useMemo(() => {
    const valueLocusList = questionListData.filter(q => q.axis === 'valueLocus')
    const boundaryList = questionListData.filter(q => q.axis === 'boundary')
    return [...valueLocusList, ...boundaryList]
  }, [])

  const valueLocusQuestionList = useMemo(
    () => orderedQuestionList.filter(q => q.axis === 'valueLocus'),
    [orderedQuestionList]
  )
  const boundaryQuestionList = useMemo(
    () => orderedQuestionList.filter(q => q.axis === 'boundary'),
    [orderedQuestionList]
  )

  return {
    isMounted,
    isComplete,
    matrixPreviewList,
    parsedAnswers,
    valueLocusQuestionList,
    boundaryQuestionList,
    isAllAnswered: answersForCommit !== null,
    handleNavigateToHomeMatrix,
    handleEditFormSubmit,
    isShareCopied,
    handleCopyResultShareUrl,
  }
}
