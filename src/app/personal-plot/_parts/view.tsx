'use client'

import type { FC, FormEvent } from 'react'

import { Button } from '@/components/Button'

import styles from './page.module.scss'

import { Question } from './Question'
import { usePersonalPlot } from './usePersonalPlot'

import type { QuestionItem } from '@/type/question'

export const PersonalPlotView: FC = () => {
  const {
    isMounted,
    formRef,
    formValid,
    handleFormInput,
    effectiveDefaults,
    valueLocusQuestionList,
    boundaryQuestionList,
    totalCount,
    scrollToQuestion,
    handleSubmit,
    handleBack,
  } = usePersonalPlot()

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    handleSubmit(e)
  }

  if (!isMounted) return null

  return (
    <main className={styles.personalPlot} data-testid="personal-plot">
      <div className={styles.intro}>
        <h1 className={styles.pageTitle}>あなたのいまの重心を測定</h1>
        <p className={styles.introBody}>
          設問のシチュエーションについて、直感であなたに近いフィーリングを選択してください。
        </p>
      </div>

      <form
        ref={formRef}
        className={styles.surveyForm}
        onSubmit={onSubmit}
        onInput={handleFormInput}
        onChange={handleFormInput}
      >
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>帰属</h2>
            <p className={styles.sectionLead}>
              判断・決定・結果に対する責任の帰属をあらわした志向です。
            </p>
          </div>
          <div className={styles.sectionBody}>
            {valueLocusQuestionList.map((q, i) => (
              <Question
                key={q.id}
                item={q as QuestionItem}
                index={i}
                mode="edit"
                defaultValue={effectiveDefaults[q.id]}
                onPrev={i > 0 ? () => scrollToQuestion(i - 1) : undefined}
                onNext={i < totalCount - 1 ? () => scrollToQuestion(i + 1) : undefined}
              />
            ))}
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
            {boundaryQuestionList.map((q, i) => {
              const index = valueLocusQuestionList.length + i
              return (
                <Question
                  key={q.id}
                  item={q as QuestionItem}
                  index={index}
                  mode="edit"
                  defaultValue={effectiveDefaults[q.id]}
                  onPrev={index > 0 ? () => scrollToQuestion(index - 1) : undefined}
                  onNext={index < totalCount - 1 ? () => scrollToQuestion(index + 1) : undefined}
                />
              )
            })}
          </div>
        </section>

        <footer className={styles.footer}>
          <Button
            variant="basic"
            size="full"
            type="button"
            className={styles.submitButton}
            onClick={handleBack}
          >
            測定をやめて戻る
          </Button>
          <Button
            variant="basic"
            size="full"
            className={styles.submitButton}
            type="submit"
            disabled={!formValid}
          >
            結果を見る
          </Button>
        </footer>
      </form>
    </main>
  )
}
