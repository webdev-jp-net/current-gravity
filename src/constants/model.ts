import type { QuestionAxis, QuestionPole } from '@/type/question'

export const STEP_LIST = [-2, -1, 0, 1, 2] as const
export type Step = (typeof STEP_LIST)[number]

export const POLE_LABEL: Record<QuestionPole, string> = {
  ownership: 'オーナーシップ',
  consensus: 'コンセンサス',
  diversity: '自立',
  identityFusion: '融合',
}

export const OPPOSITE_POLE: Record<QuestionPole, QuestionPole> = {
  ownership: 'consensus',
  consensus: 'ownership',
  diversity: 'identityFusion',
  identityFusion: 'diversity',
}

export const AXIS_LABEL: Record<QuestionAxis, string> = {
  valueLocus: '帰属',
  boundary: '関係性',
}

export const AXIS_OF_POLE: Record<QuestionPole, QuestionAxis> = {
  ownership: 'valueLocus',
  consensus: 'valueLocus',
  diversity: 'boundary',
  identityFusion: 'boundary',
}

export const POLE_DIRECTION: Record<QuestionPole, 1 | -1> = {
  ownership: 1,
  consensus: -1,
  identityFusion: 1,
  diversity: -1,
}
