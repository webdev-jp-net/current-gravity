'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { useAtom } from 'jotai'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { groupAtom } from '@/data/store'

import {
  buildMatrixPreviewPersonalPlot,
  commitPlotToGroup,
  isCompleteAnswersRecord,
  parseQuestionParam,
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
  const targetIdFromUrl = searchParams.get('targetId')
  const questionFromUrl = searchParams.get('question')

  const [group, setGroup] = useAtom(groupAtom)
  const groupRef = useRef(group)
  groupRef.current = group

  const [isMounted, setIsMounted] = useState(false)
  const lastSubmittedSnapshotRef = useRef<string | null>(null)
  const [isShareCopied, setIsShareCopied] = useState(false)

  const parsedAnswers = useMemo(
    () => parseQuestionParam(questionFromUrl),
    [questionFromUrl]
  )

  const isComplete = useMemo(
    () => isCompleteAnswersRecord(parsedAnswers),
    [parsedAnswers]
  )

  const answersForCommit = useMemo((): Record<string, number> | null => {
    if (!isComplete) return null
    return parsedAnswers
  }, [isComplete, parsedAnswers])

  const matrixPreviewList = useMemo((): PersonalPlot[] => {
    if (!answersForCommit) return []
    return [
      buildMatrixPreviewPersonalPlot({
        answers: answersForCommit,
        targetId: targetIdFromUrl,
        group,
        plotId: targetIdFromUrl ?? PREVIEW_PLACEHOLDER_ID,
      }),
    ]
  }, [answersForCommit, group, targetIdFromUrl])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  /**
   * URL が20問完備のとき、groupAtom へ1回だけ反映する。
   * sessionStorage で Strict Mode 二重実行時の二重追加を防ぐ。
   */
  useLayoutEffect(() => {
    if (!isComplete || !answersForCommit) return

    const snapshot = serializeAnswersToQuestionParam(answersForCommit)
    const storageKey = `${RESULT_COMMIT_STORAGE_PREFIX}${targetIdFromUrl ?? ''}|${snapshot}`

    if (typeof window !== 'undefined' && window.sessionStorage.getItem(storageKey)) {
      lastSubmittedSnapshotRef.current = snapshot
      return
    }

    commitPlotToGroup({
      answers: answersForCommit,
      targetId: targetIdFromUrl,
      getLatestGroup: () => groupRef.current,
      setGroup,
      setMatrixPreviewList: noopSetMatrixPreview,
    })
    lastSubmittedSnapshotRef.current = snapshot
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(storageKey, '1')
    }
  }, [answersForCommit, isComplete, questionFromUrl, setGroup, targetIdFromUrl])

  const handleNavigateToHomeMatrix = () => {
    if (!answersForCommit) return

    const snapshot = serializeAnswersToQuestionParam(answersForCommit)
    const alreadyCommitted =
      lastSubmittedSnapshotRef.current !== null && snapshot === lastSubmittedSnapshotRef.current

    if (!alreadyCommitted) {
      commitPlotToGroup({
        answers: answersForCommit,
        targetId: targetIdFromUrl,
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

  const handleNavigateToEditSurvey = useCallback(() => {
    const params = new URLSearchParams()
    if (targetIdFromUrl) params.set('targetId', targetIdFromUrl)
    if (questionFromUrl) params.set('question', questionFromUrl)
    const qs = params.toString()
    void router.push(qs ? `/personal-plot?${qs}` : '/personal-plot')
  }, [questionFromUrl, router, targetIdFromUrl])

  const handleCopyResultShareUrl = useCallback(() => {
    const params = new URLSearchParams()
    if (targetIdFromUrl) params.set('targetId', targetIdFromUrl)
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
  }, [answersForCommit, pathname, targetIdFromUrl])

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
    handleNavigateToEditSurvey,
    isShareCopied,
    handleCopyResultShareUrl,
  }
}
