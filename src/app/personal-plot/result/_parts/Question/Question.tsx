import type { FC } from 'react'

import { ThumbsDown, ThumbsUp } from 'lucide-react'

import { BudouXText } from '@/components/BudouXText'
import { PoleIcon } from '@/components/PoleIcon'

import styles from './Question.module.scss'

import { useQuestion } from './useQuestion'

import type { QuestionItem } from '@/type/question'

export type ResultQuestionProps = {
  item: QuestionItem
  value: number | undefined
  index: number
}

export const Question: FC<ResultQuestionProps> = ({ item, value, index }) => {
  const { question, concept, label, axis, orientation } = item
  const { STEP_LIST, conceptCasePole, conceptCaseLabel } = useQuestion({
    concept,
    axis,
    orientation,
    value,
  })

  return (
    <section id={`question-${index}`} className={styles.question}>
      <header className={styles.header}>
        <h3 className={styles.title}>
          <BudouXText>{question}</BudouXText>
        </h3>
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
          {STEP_LIST.map(step => (
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
      <div className={styles.concept}>
        <h3 className={styles.conceptDescription}>
          <BudouXText>{concept.description}</BudouXText>
        </h3>
        <div className={`${styles.conceptCase} ${styles['--min']}`}>
          <h4 className={styles.conceptLabel}>
            <PoleIcon className={styles.conceptIcon} variant={conceptCasePole.min} />
            {conceptCaseLabel.min}
          </h4>
          <p className={styles.paragraph}>{concept.case.min}</p>
        </div>
        <div className={`${styles.conceptCase} ${styles['--max']}`}>
          <h4 className={styles.conceptLabel}>
            <PoleIcon className={styles.conceptIcon} variant={conceptCasePole.max} />
            {conceptCaseLabel.max}
          </h4>
          <p className={styles.paragraph}>{concept.case.max}</p>
        </div>
      </div>
    </section>
  )
}
