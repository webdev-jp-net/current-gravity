import type { FC } from 'react'

import styles from './Question.module.scss'

export type QuestionItem = {
  id: string
  question: string
  axis: string
  orientation: string
  label: { min: string; max: string }
}

type QuestionProps = {
  item: QuestionItem
  index: number
  value: number | undefined
  onAnswerChange: (id: string, val: number, index: number) => void
}

export const Question: FC<QuestionProps> = ({ item, index, value, onAnswerChange }) => {
  const { id, question, label } = item
  return (
    <div id={`question-${index}`} className={styles.question}>
      <h3 className={styles.questionTitle}>{question}</h3>
      <div className={styles.optionRow}>
        <div className={styles.optionScale}>
          <span className={styles.labelMin}>{label.min}</span>
          <span className={styles.labelMax}>{label.max}</span>
          <div className={styles.optionGroup}>
            {[-2, -1, 0, 1, 2].map(val => (
              <label key={val} className={styles.optionLabel}>
                <input
                  type="radio"
                  name={id}
                  value={val}
                  checked={value === val}
                  onChange={() => onAnswerChange(id, val, index)}
                  className={styles.screenReaderOnly}
                  aria-hidden
                />
                <span className={styles.optionIndicator}></span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
