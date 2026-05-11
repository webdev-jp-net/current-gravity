'use client'

import type { FC, FormEvent } from 'react'

import { Button } from '@/components/Button'
import { Question } from '@/components/Question'

import styles from './page.module.scss'

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
        <h1 className={styles.pageTitle}>いまのちょうどいい重心を測る</h1>
        <p>
          これから測るのは、あなたの重心（コンフォートゾーン）です。
          <br />
          価値や責任をどう持ちたいか？（南北）と、様々な事とどのように関係を持ちたいか？（東西）という2つの軸で定義し、優劣や過不足ではなく緯度経度であらわす地図上の居場所として可視化しようとしています。
        </p>
        <p>
          20問の質問に、そうだ / ちがう を5段階からフィーリングで選んでください。
          <br />
          最初の10問は南北の軸、後半の10問は東西の軸での重心を測っています。
        </p>
        <p>
          それぞれの質問について、「こう思うだろうけど実際に見せる行動はこちらだろうな…」と思い当たるものがあるかもしれません。
          <br />
          この20問は、なにを選んでも正解不正解はありません。なるべく本音を選ぶほうが重心をありのまま測れます。
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
          {valueLocusQuestionList.map((q, i) => (
            <Question
              key={q.id}
              item={q as QuestionItem}
              index={i}
              mode="input"
              defaultValue={effectiveDefaults[q.id]}
              onPrev={i > 0 ? () => scrollToQuestion(i - 1) : undefined}
              onNext={i < totalCount - 1 ? () => scrollToQuestion(i + 1) : undefined}
            />
          ))}
          {boundaryQuestionList.map((q, i) => {
            const index = valueLocusQuestionList.length + i
            return (
              <Question
                key={q.id}
                item={q as QuestionItem}
                index={index}
                mode="input"
                defaultValue={effectiveDefaults[q.id]}
                onPrev={index > 0 ? () => scrollToQuestion(index - 1) : undefined}
                onNext={index < totalCount - 1 ? () => scrollToQuestion(index + 1) : undefined}
              />
            )
          })}
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
