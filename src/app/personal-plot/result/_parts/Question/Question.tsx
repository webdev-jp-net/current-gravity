import type { FC } from 'react'

import { ThumbsDown, ThumbsUp } from 'lucide-react'

import { BudouXText } from '@/components/BudouXText'

import styles from './Question.module.scss'

const STEPS = [-2, -1, 0, 1, 2] as const

export type ResultQuestionProps = {
  question: string
  concept: {
    description: string
    case: { min: string; max: string }
  }
  label: { min: string; max: string }
  value: number | undefined
  index: number
}

export const Question: FC<ResultQuestionProps> = ({ question, concept, label, value, index }) => {
  const showConcept = concept.description.trim().length > 0
  const isKnownStep = value !== undefined && (STEPS as readonly number[]).includes(value)
  const srSelected = isKnownStep ? `選択の値: ${value}` : '選択なし'

  return (
    <section id={`question-${index}`} className={styles.question}>
      <header className={styles.header}>
        <h3 className={styles.title}>
          <BudouXText>{question}</BudouXText>
        </h3>
        <p className={styles.visuallyHidden}>{srSelected}</p>
      </header>
      <div className={styles.body}>
        <div className={styles.label}>
          <span className={styles.labelHeading}>
            <ThumbsDown size={12} />
            ちがう
          </span>
          <span>
            <BudouXText>{label.min}</BudouXText>
          </span>
        </div>
        <div className={styles.optionScale} role="presentation" aria-hidden>
          {STEPS.map(step => (
            <div key={step} className={styles.segmentSlot}>
              <span
                className={
                  value === step ? `${styles.segment} ${styles.segmentActive}` : styles.segment
                }
              />
            </div>
          ))}
        </div>
        <div className={styles.label}>
          <span className={styles.labelHeading}>
            そうだ
            <ThumbsUp size={12} />
          </span>
          <span>
            <BudouXText>{label.max}</BudouXText>
          </span>
        </div>
      </div>
      {showConcept && (
        <footer className={styles.footer}>
          <p className={styles.concept}>
            <BudouXText>{concept.description}</BudouXText>
          </p>
          <p className={styles.label}>{concept.case.min}</p>
          <p className={styles.label}>{concept.case.max}</p>
        </footer>
      )}
    </section>
  )
}
