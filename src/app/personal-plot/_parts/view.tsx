'use client'

import type { FC } from 'react'

import { Check, Share2 } from 'lucide-react'

import { Matrix } from '@/app/_parts/Matrix'

import { Button } from '@/components/Button'

import styles from './page.module.scss'

import { Question } from './Question'
import { usePersonalPlot } from './usePersonalPlot'

export const PersonalPlotView: FC = () => {
  const {
    isMounted,
    answers,
    matrixPreviewList,
    valueLocusQuestionList,
    boundaryQuestionList,
    handleAnswerChangeWithScroll,
    isAllAnswered,
    handleSubmit,
    handleBack,
    handleNavigateToHomeMatrix,
    isShareCopied,
    handleCopyGroupShareUrl,
  } = usePersonalPlot()

  if (!isMounted) return null

  return (
    <main className={styles.personalPlot} data-testid="personal-plot">
      <div className={styles.intro}>
        <h1 className={styles.pageTitle}>あなたのいまの重心を測定</h1>
        <p className={styles.introBody}>
          設問のシチュエーションについて、直感であなたに近いフィーリングを選択してください。
        </p>
      </div>

      {matrixPreviewList.length > 0 ? (
        <section className={styles.matrixPreview} aria-label="回答に基づくプレビュー">
          <Matrix personalPlotList={matrixPreviewList} />
          <div className={styles.matrixPreviewActions}>
            <Button
              variant="basic"
              size="full"
              type="button"
              className={styles.matrixPreviewAddButton}
              onClick={handleNavigateToHomeMatrix}
            >
              みんなのいまの重心に追加
            </Button>
            <Button
              variant="basic"
              size="liquid"
              type="button"
              className={styles.matrixPreviewShareButton}
              onClick={handleCopyGroupShareUrl}
            >
              {isShareCopied ? <Check size={20} aria-hidden /> : <Share2 size={20} aria-hidden />}
              この結果のURLをコピー
            </Button>
          </div>
        </section>
      ) : null}

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
              item={q}
              index={i}
              value={answers[q.id]}
              onAnswerChange={handleAnswerChangeWithScroll}
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
          {boundaryQuestionList.map((q, i) => (
            <Question
              key={q.id}
              item={q}
              index={valueLocusQuestionList.length + i}
              value={answers[q.id]}
              onAnswerChange={handleAnswerChangeWithScroll}
            />
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <Button variant="basic" size="full" className={styles.submitButton} onClick={handleBack}>
          測定をやめて戻る
        </Button>
        <Button
          variant="basic"
          size="full"
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={!isAllAnswered}
        >
          結果を見る
        </Button>
      </footer>
    </main>
  )
}
