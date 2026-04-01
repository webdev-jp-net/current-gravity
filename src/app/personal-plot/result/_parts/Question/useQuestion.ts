'use client'

import type { QuestionAxis, QuestionPole } from '@/type/question'

import { OPPOSITE_POLE, POLE_LABEL } from '@/constants/model'
import { STEP_LIST } from '@/constants/model'

type UseQuestionProps = {
  concept: {
    description: string
    case: { min: string; max: string }
  }
  axis: QuestionAxis
  pole: QuestionPole
  value: number | undefined
}

export const useQuestion = ({ concept: _concept, axis: _axis, pole, value }: UseQuestionProps) => {
  const isKnownStep = value !== undefined && (STEP_LIST as readonly number[]).includes(value)

  const conceptCasePole = {
    min: OPPOSITE_POLE[pole],
    max: pole,
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
