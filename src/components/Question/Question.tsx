import type { FC } from 'react'

import { ThumbsDown, ThumbsUp } from 'lucide-react'

import { BudouXText } from '@/components/BudouXText'
import { Button } from '@/components/Button'
import { PoleLabel } from '@/components/PoleLabel'

import styles from './Question.module.scss'

import { useQuestion } from './useQuestion'

import type { QuestionItem } from '@/type/question'

import { STEP_LIST, AXIS_DESCRIPTION } from '@/constants/model'

type QuestionProps = {
  item: QuestionItem
  index: number
  mode?: 'input' | 'result'
  /** input 時のみ。初期選択（defaultChecked） */
  defaultValue?: number
  /** result 時のみ。表示する値 */
  value?: number
  /** input 時のみ。undefinedなら「前へ」ボタン非活性 */
  onPrev?: () => void
  /** input 時のみ。undefinedなら「次へ」ボタン非活性 */
  onNext?: () => void
}

export const Question: FC<QuestionProps> = ({
  item,
  index,
  mode = 'input',
  defaultValue,
  value,
  onPrev,
  onNext,
}) => {
  const { id, question, concept, label, axis, pole } = item
  const isResult = mode === 'result'
  const { conceptCasePole } = useQuestion({ concept, axis, pole, value })

  return (
    <section id={`question-${index}`} className={styles.question}>
      <header className={styles.header}>
        <div className={styles.headerCategory}>
          <p className={styles.headerLabel}>{AXIS_DESCRIPTION[axis]}</p>
          <PoleLabel pole={pole} className={styles.headerPoleLabel} />
        </div>
        <span className={styles.index}>Q{index + 1}</span>
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
        {isResult ? (
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
        ) : (
          <div className={styles.optionScale}>
            {STEP_LIST.map((val, ri) => (
              <label key={val} className={styles.optionLabel}>
                <input
                  type="radio"
                  name={id}
                  value={val}
                  className={styles.screenReaderOnly}
                  aria-hidden
                  required={ri === 0}
                  defaultChecked={defaultValue === val}
                />
                <span className={styles.optionIndicator}></span>
              </label>
            ))}
          </div>
        )}
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
      {isResult && (
        <div className={styles.concept}>
          <h3 className={styles.conceptDescription}>
            <BudouXText>{concept.description}</BudouXText>
          </h3>
          <div className={`${styles.conceptCase} ${styles['--min']}`}>
            <h4 className={styles.conceptLabel}>
              <PoleLabel pole={conceptCasePole.min} withDescription />
            </h4>
            <p className={styles.paragraph}>{concept.case.min}</p>
          </div>
          <div className={`${styles.conceptCase} ${styles['--max']}`}>
            <h4 className={styles.conceptLabel}>
              <PoleLabel pole={conceptCasePole.max} withDescription />
            </h4>
            <p className={styles.paragraph}>{concept.case.max}</p>
          </div>
        </div>
      )}
      {!isResult && (
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
