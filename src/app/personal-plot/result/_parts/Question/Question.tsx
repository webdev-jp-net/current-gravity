import type { FC } from 'react'

import styles from './Question.module.scss'

const STEPS = [-2, -1, 0, 1, 2] as const

export type ResultQuestionProps = {
  question: string
  concept: string
  label: { min: string; max: string }
  value: number | undefined
  index: number
}

export const Question: FC<ResultQuestionProps> = ({
  question,
  concept,
  label,
  value,
  index,
}) => {
  const showConcept = concept.trim().length > 0
  const isKnownStep = value !== undefined && (STEPS as readonly number[]).includes(value)
  const srSelected = isKnownStep ? `選択の値: ${value}` : '選択なし'

  return (
    <section id={`question-${index}`} className={styles.question}>
      <header className={styles.header}>
        <h3 className={styles.title}>{question}</h3>
        {showConcept ? <p className={styles.concept}>{concept}</p> : null}
        <p className={styles.visuallyHidden}>{srSelected}</p>
      </header>
      <div className={styles.body}>
        <span className={styles.label}>{label.min}</span>
        <div className={styles.optionScale} role="presentation" aria-hidden>
          {STEPS.map(step => (
            <div key={step} className={styles.segmentSlot}>
              <span
                className={
                  value === step
                    ? `${styles.segment} ${styles.segmentActive}`
                    : styles.segment
                }
              />
            </div>
          ))}
        </div>
        <span className={styles.label}>{label.max}</span>
      </div>
    </section>
  )
}
