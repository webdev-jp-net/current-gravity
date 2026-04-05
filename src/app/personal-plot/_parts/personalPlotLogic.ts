import questionListData from '@/data/questionList.json'
import type { PersonalPlotGroup } from '@/data/store'

import type { PersonalPlot } from '@/type/personalPlot'

export const VALID_VALUES = new Set([-2, -1, 0, 1, 2])

export const questionIds = new Set(questionListData.map(q => q.id))

/** ロード時プレビュー用の仮 id（targetId なし URL） */
export const PREVIEW_PLACEHOLDER_ID = 'preview'

/**
 * 入力から結果へ遷移するときだけ使う一時領域（同一タブの sessionStorage）。
 * 共有用の結果 URL に Group 編集用 id を載せないため、クエリの targetId は使わずここで渡す。
 */
export const PLOT_TARGET_ID_SESSION_KEY = 'pp-plot-target-id'

export const DEFAULT_DISPLAY_NAME = '名前'

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

export function aggregateMetricsFromAnswers(
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
    metrics[q.pole as keyof typeof metrics] += val
  })
  return metrics
}

export function isCompleteAnswersRecord(answers: Record<string, number>): boolean {
  return questionListData.every(q => answers[q.id] !== undefined)
}

/**
 * Matrix プレビュー用の 1 件。
 * 表示名はプレビュー専用: 未設定時は「名前」ではなく空文字（ラベル非表示に近い見え方）。
 */
export function buildMatrixPreviewPersonalPlot(params: {
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

/**
 * 「結果を見る」と同一の `groupAtom` 反映＋プレビュー1件の更新。
 * `setGroup` は常に関数型更新し、`getLatestGroup` はクリック時点の最新 `group` を渡す（クロージャの stale を避ける）。
 */
export function commitPlotToGroup(params: {
  answers: Record<string, number>
  targetId: string | null
  getLatestGroup: () => PersonalPlotGroup
  setGroup: (next: PersonalPlotGroup | ((prev: PersonalPlotGroup) => PersonalPlotGroup)) => void
  setMatrixPreviewList: (list: PersonalPlot[]) => void
}): void {
  const { answers, targetId, getLatestGroup, setGroup, setMatrixPreviewList } = params
  const metrics = aggregateMetricsFromAnswers(answers)
  const latest = getLatestGroup()

  if (targetId) {
    const previewPlot = buildMatrixPreviewPersonalPlot({
      answers,
      targetId,
      group: latest,
      plotId: targetId,
    })
    setMatrixPreviewList([previewPlot])
    setGroup(prev => {
      const exists = prev.personalPlotList.some(p => p.id === targetId)
      if (exists) {
        return {
          ...prev,
          personalPlotList: prev.personalPlotList.map(p =>
            p.id === targetId
              ? {
                  ...p,
                  ...metrics,
                  focus: true,
                  displayName: p.displayName.trim() === '' ? DEFAULT_DISPLAY_NAME : p.displayName,
                }
              : p
          ),
        }
      }
      const newPlot: PersonalPlot = {
        id: targetId,
        displayName: DEFAULT_DISPLAY_NAME,
        focus: true,
        ...metrics,
      }
      return {
        ...prev,
        personalPlotList: [newPlot, ...prev.personalPlotList],
      }
    })
  } else {
    const newId = Date.now().toString()
    const previewPlot = buildMatrixPreviewPersonalPlot({
      answers,
      targetId: null,
      group: latest,
      plotId: newId,
    })
    setMatrixPreviewList([previewPlot])
    const newPlot: PersonalPlot = {
      id: newId,
      displayName: DEFAULT_DISPLAY_NAME,
      focus: true,
      ...metrics,
    }
    setGroup(prev => ({
      ...prev,
      personalPlotList: [newPlot, ...prev.personalPlotList],
    }))
  }
}

/** FormData / ネイティブフォームから設問 id ごとの値を読む（survey 用） */
export function readAnswersFromForm(form: HTMLFormElement): Record<string, number> {
  const fd = new FormData(form)
  const out: Record<string, number> = {}
  for (const q of questionListData) {
    const v = fd.get(q.id)
    if (v == null || v === '') continue
    const num = Number(v)
    if (Number.isNaN(num) || !VALID_VALUES.has(num)) continue
    out[q.id] = num
  }
  return out
}

export { questionListData }
