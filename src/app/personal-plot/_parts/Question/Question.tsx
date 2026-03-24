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
  /** `edit`: ネイティブフォーム（非制御）。`readonly`: 結果表示用 */
  mode?: 'edit' | 'readonly'
  /** edit 時のみ。初期選択（defaultChecked） */
  defaultValue?: number
  /** readonly 時のみ。表示する値 */
  value?: number
  /** edit 時、選択後に次設問へスクロールするために使用 */
  onSelect?: (id: string, val: number, index: number) => void
}

export const Question: FC<QuestionProps> = ({
  item,
  index,
  mode = 'edit',
  defaultValue,
  value: readonlyValue,
  onSelect,
}) => {
  const { id, question, label } = item
  const readOnly = mode === 'readonly'

  return (
    <section id={`question-${index}`} className={styles.question}>
      <header className={styles.header}>
        <h3 className={styles.title}>{question}</h3>
      </header>
      <div className={styles.body}>
        <span className={styles.label}>{label.min}</span>
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
                      // 制御コンポーネントとして checked を渡すため、React が onChange を要求する
                      onChange: () => {},
                    }
                  : {
                      required: ri === 0,
                      defaultChecked: defaultValue === val,
                      onChange: () => onSelect?.(id, val, index),
                    })}
              />
              <span className={styles.optionIndicator}></span>
            </label>
          ))}
        </div>
        <span className={styles.label}>{label.max}</span>
      </div>
    </section>
  )
}
