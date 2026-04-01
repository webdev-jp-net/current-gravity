export type QuestionPole = 'ownership' | 'consensus' | 'diversity' | 'identityFusion'
export type QuestionAxis = 'valueLocus' | 'boundary'

export type QuestionItem = {
  id: string
  axis: QuestionAxis
  pole: QuestionPole
  label: { min: string; max: string }
  concept: { description: string; case: { min: string; max: string } }
  question: string
}
