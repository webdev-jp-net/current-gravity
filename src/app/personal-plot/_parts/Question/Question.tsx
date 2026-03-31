import type { FC } from 'react'

import { ThumbsDown, ThumbsUp } from 'lucide-react'

import { Button } from '@/components/Button'

import styles from './Question.module.scss'

export type QuestionItem = {
  id: string
  question: string
  concept: {
    description: string
    case: { min: string; max: string }
  }
  axis: string
  orientation: string
  label: { min: string; max: string }
}

type QuestionProps = {
  item: QuestionItem
  index: number
  /** `edit`: ネイティブフォーム（非制御）。`readonly`: 結果表示用 */
  mode?: 'edit' | 'readonly'
  /** edit 時のみ。初期選択（defaultChecked） */
  defaultValue?: number
  /** readonly 時のみ。表示する値 */
  value?: number
  /** undefinedなら「前へ」ボタン非活性 */
  onPrev?: () => void
  /** undefinedなら「次へ」ボタン非活性 */
  onNext?: () => void
}

export const Question: FC<QuestionProps> = ({
  item,
  index,
  mode = 'edit',
  defaultValue,
  value: readonlyValue,
  onPrev,
  onNext,
}) => {
  const { id, question, label } = item
  const readOnly = mode === 'readonly'

  return (
    <section id={`question-${index}`} className={styles.question}>
      <header className={styles.header}>
        <h3 className={styles.title}>{question}</h3>
      </header>
      <div className={styles.body}>
        <div className={styles.label}>
          <span className={styles.labelHeading}>
            <ThumbsDown size={12} />
            ちがう
          </span>
          <span>{label.min}</span>
        </div>
        <div className={styles.optionScale}>
          {[-2, -1, 0, 1, 2].map((val, ri) => (
            <label key={val} className={styles.optionLabel}>
              <input
                type="radio"
                name={id}
                value={val}
                className={styles.screenReaderOnly}
                aria-hidden
                {...(readOnly
                  ? {
                      checked: readonlyValue === val,
                      disabled: true,
                      onChange: () => {},
                    }
                  : {
                      required: ri === 0,
                      defaultChecked: defaultValue === val,
                    })}
              />
              <span className={styles.optionIndicator}></span>
            </label>
          ))}
        </div>
        <div className={styles.label}>
          <span className={styles.labelHeading}>
            そうだ
            <ThumbsUp size={12} />
          </span>
          <span>{label.max}</span>
        </div>
      </div>
      {!readOnly && (
        <footer className={styles.footer}>
          <Button variant="basic" size="liquid" type="button" disabled={!onPrev} onClick={onPrev}>
            前へ
          </Button>
          <Button variant="basic" size="liquid" type="button" disabled={!onNext} onClick={onNext}>
            次へ
          </Button>
        </footer>
      )}
    </section>
  )
}
