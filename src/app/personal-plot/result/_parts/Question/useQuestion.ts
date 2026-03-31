'use client'

import type { QuestionAxis, QuestionPole } from '@/type/question'

import { POLE_LABEL } from '@/constants/pole'

const STEP_LIST = [-2, -1, 0, 1, 2] as const

const OPPOSITE_POLE: Record<QuestionPole, QuestionPole> = {
  ownership: 'consensus',
  consensus: 'ownership',
  diversity: 'identityFusion',
  identityFusion: 'diversity',
}

type UseQuestionProps = {
  concept: {
    description: string
    case: { min: string; max: string }
  }
  axis: QuestionAxis
  orientation: QuestionPole
  value: number | undefined
}

export const useQuestion = ({ concept, axis: _axis, orientation, value }: UseQuestionProps) => {
  const isKnownStep = value !== undefined && (STEP_LIST as readonly number[]).includes(value)

  const conceptCasePole = {
    min: OPPOSITE_POLE[orientation],
    max: orientation,
  }

  const conceptCaseLabel = {
    min: POLE_LABEL[conceptCasePole.min],
    max: POLE_LABEL[conceptCasePole.max],
  }

  return {
    STEP_LIST,
    isKnownStep,
    conceptCasePole,
    conceptCaseLabel,
  }
}
