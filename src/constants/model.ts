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

export const AXIS_DESCRIPTION: Record<QuestionAxis, string> = {
  valueLocus: '判断・決定・結果に対する責任の帰属',
  boundary: '人・評価・解釈・規範との関係の持ち方',
}

export const POLE_DESCRIPTION: Record<QuestionPole, string> = {
  ownership: '責任を自分で持ち価値を内側で成立させたい志向',
  consensus: '責任を場や合意へ移譲して価値を外側で成立させる志向',
  diversity: '関係性をまぜず分けて扱いたい志向',
  identityFusion: '関係性を収束させ一体感をもちたい志向',
}
