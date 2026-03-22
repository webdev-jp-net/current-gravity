'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { useAtom } from 'jotai'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import questionListData from '@/data/questionList.json'
import { groupAtom, type PersonalPlotGroup } from '@/data/store'

import type { PersonalPlot } from '@/type/personalPlot'

import { CLIPBOARD_COPY_UNAVAILABLE_MESSAGE, copyTextToClipboard } from '@/util/copyTextToClipboard'

const VALID_VALUES = new Set([-2, -1, 0, 1, 2])

const questionIds = new Set(questionListData.map(q => q.id))

/** ロード時プレビュー用の仮 id（targetId なし URL） */
const PREVIEW_PLACEHOLDER_ID = 'preview'

const DEFAULT_DISPLAY_NAME = '名前'

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

function aggregateMetricsFromAnswers(
  answers: Record<string, number>
): Pick<PersonalPlot, 'ownership' | 'consensus' | 'diversity' | 'identityFusion'> {
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
  return metrics
}

function isCompleteAnswersRecord(answers: Record<string, number>): boolean {
  return questionListData.every(q => answers[q.id] !== undefined)
}

/**
 * Matrix プレビュー用の 1 件。トリガー1（マウント時）・トリガー2（handleSubmit）のみから呼ぶ（DRY）。
 * 表示名はプレビュー専用: 未設定時は「名前」ではなく空文字（ラベル非表示に近い見え方）。
 */
function buildMatrixPreviewPersonalPlot(params: {
  answers: Record<string, number>
  targetId: string | null
  group: PersonalPlotGroup
  plotId: string
}): PersonalPlot {
  const { answers, targetId, group, plotId } = params
  const metrics = aggregateMetricsFromAnswers(answers)
  let displayName = ''
  if (targetId) {
    const p = group.personalPlotList.find(x => x.id === targetId)
    const raw = p?.displayName?.trim() ?? ''
    displayName = raw
  }
  return {
    id: plotId,
    displayName,
    ...metrics,
  }
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
  const targetIdFromUrl = searchParams.get('targetId')
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
  /** プレビュー算出は (1) マウント時 URL が20問完備 (2) handleSubmit のみ */
  const [matrixPreviewList, setMatrixPreviewList] = useState<PersonalPlot[]>([])
  /** 直近に setGroup まで行った送信の question 正規形（同一内容の連打はスクロールのみ） */
  const lastSubmittedSnapshotRef = useRef<string | null>(null)
  /** 送信後に #matrix へスクロールするための世代カウンタ */
  const [submitGeneration, setSubmitGeneration] = useState(0)
  /** Group Editor の「この結果のURLをコピー」と同様（トップ復元用クエリを絶対 URL でコピー） */
  const [isShareCopied, setIsShareCopied] = useState(false)

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

  /**
   * トリガー1: マウント1回のみ。URL の question が20問完備ならプレビューをセット（answers / urlKey への effect 依存は持たない）。
   */
  useLayoutEffect(() => {
    const parsed = parseQuestionParam(searchParamsRef.current.get('question'))
    if (!isCompleteAnswersRecord(parsed)) return
    const targetId = searchParamsRef.current.get('targetId')
    setMatrixPreviewList([
      buildMatrixPreviewPersonalPlot({
        answers: parsed,
        targetId,
        group,
        plotId: targetId ?? PREVIEW_PLACEHOLDER_ID,
      }),
    ])
    // 初回マウント時の group / URL のみ評価（#62: 常時監視しない）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  /** 回答が最後に確定送信したスナップショットとずれたら、再度フル送信できるようにする */
  useEffect(() => {
    const s = serializeAnswersToQuestionParam(answers)
    if (lastSubmittedSnapshotRef.current === null) return
    if (s !== lastSubmittedSnapshotRef.current) {
      lastSubmittedSnapshotRef.current = null
    }
  }, [answers])

  /** 送信直後のスクロール（submitGeneration>0 のときのみ） */
  useEffect(() => {
    if (submitGeneration === 0) return
    requestAnimationFrame(() => {
      document.getElementById('matrix')?.scrollIntoView({ behavior: 'smooth' })
    })
  }, [submitGeneration])

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

    const snapshot = serializeAnswersToQuestionParam(answers)
    // 同一回答の連打ではグループへの再反映を避け、スクロールのみ（ボタンは活性のまま）
    if (
      lastSubmittedSnapshotRef.current !== null &&
      snapshot === lastSubmittedSnapshotRef.current
    ) {
      setSubmitGeneration(g => g + 1)
      return
    }

    const targetId = searchParams.get('targetId')
    const metrics = aggregateMetricsFromAnswers(answers)

    if (targetId) {
      const previewPlot = buildMatrixPreviewPersonalPlot({
        answers,
        targetId,
        group,
        plotId: targetId,
      })
      setMatrixPreviewList([previewPlot])
      setGroup({
        ...group,
        personalPlotList: group.personalPlotList.map(p =>
          p.id === targetId
            ? {
                ...p,
                ...metrics,
                displayName: p.displayName.trim() === '' ? DEFAULT_DISPLAY_NAME : p.displayName,
              }
            : p
        ),
      })
    } else {
      const newId = Date.now().toString()
      const previewPlot = buildMatrixPreviewPersonalPlot({
        answers,
        targetId: null,
        group,
        plotId: newId,
      })
      setMatrixPreviewList([previewPlot])
      const newPlot: PersonalPlot = {
        id: newId,
        displayName: DEFAULT_DISPLAY_NAME,
        ...metrics,
      }
      setGroup({
        ...group,
        personalPlotList: [...group.personalPlotList, newPlot],
      })
    }

    lastSubmittedSnapshotRef.current = snapshot
    setSubmitGeneration(g => g + 1)
  }

  const handleBack = () => {
    router.push('/#group-editor')
  }

  /** トップの「みんなのいまの重心」マトリクスへ（従来の遷移） */
  const handleNavigateToHomeMatrix = () => {
    router.push('/#matrix')
  }

  /** 設問20問＋任意の targetId を復元できる絶対 URL（replaceUrlWithAnswers と同じクエリ形式） */
  const handleCopyGroupShareUrl = useCallback(() => {
    const params = new URLSearchParams()
    if (targetIdFromUrl) params.set('targetId', targetIdFromUrl)
    const q = serializeAnswersToQuestionParam(answers)
    if (q) params.set('question', q)
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
  }, [answers, pathname, targetIdFromUrl])

  return {
    isMounted,
    answers,
    matrixPreviewList,
    valueLocusQuestionList,
    boundaryQuestionList,
    totalCount,
    handleAnswerChangeWithScroll,
    isAllAnswered,
    handleSubmit,
    handleBack,
    handleNavigateToHomeMatrix,
    isShareCopied,
    handleCopyGroupShareUrl,
  }
}
