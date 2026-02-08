'use client'

import type { FC } from 'react'

import styles from './page.module.scss'

import { usePersonalPlot } from './usePersonalPlot'

type QuestionItem = {
  id: string
  question: string
  axis: string
  orientation: string
  label: { min: string; max: string }
}

export const PersonalPlotView: FC = () => {
  const { isMounted, answers, shuffledQuestions, isAllAnswered, handleAnswerChange, handleSubmit } =
    usePersonalPlot()

  const renderQuestion = (q: QuestionItem) => (
    <div key={q.id} className={styles.question}>
      <h3 className={styles.questionTitle}>{q.question}</h3>
      <div className={styles.optionRow}>
        <div className={styles.optionScale}>
          <span className={styles.labelMin}>{q.label.min}</span>
          <span className={styles.labelMax}>{q.label.max}</span>
          <div className={styles.optionGroup}>
            {[-2, -1, 1, 2].map(val => (
              <label key={val} className={styles.optionLabel}>
                <input
                  type="radio"
                  name={q.id}
                  value={val}
                  checked={answers[q.id] === val}
                  onChange={() => handleAnswerChange(q.id, val)}
                  className={styles.screenReaderOnly}
                  aria-hidden
                />
                <span
                  className={
                    answers[q.id] === val
                      ? `${styles.optionIndicator} ${styles.optionIndicatorSelected}`
                      : styles.optionIndicator
                  }
                >
                  {answers[q.id] === val && <span className={styles.optionDot} aria-hidden />}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  if (!isMounted) return null

  return (
    <main className={styles.personalPlot} data-testid="personal-plot">
      <div className={styles.intro}>
        <h1 className={styles.pageTitle}>あなたのいまの重心を測定</h1>
        <p className={styles.introBody}>
          設問のシチュエーションについて、直感であなたに近いフィーリングを選択してください。
        </p>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>帰属</h2>
          <p className={styles.sectionLead}>
            判断・決定・結果に対する責任の帰属をあらわした志向です。
          </p>
        </div>
        <div className={styles.sectionBody}>
          {shuffledQuestions.filter(q => q.axis === 'valueLocus').map(q => renderQuestion(q))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>関係性</h2>
          <p className={styles.sectionLead}>
            自分以外のモノ・人・現象との関係性をあらわした志向です。
          </p>
        </div>
        <div className={styles.sectionBody}>
          {shuffledQuestions.filter(q => q.axis === 'boundary').map(q => renderQuestion(q))}
        </div>
      </section>

      <footer className={styles.footer}>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isAllAnswered}
          className={styles.submitButton}
        >
          回答を完了してプロットを追加
        </button>
      </footer>
    </main>
  )
}
