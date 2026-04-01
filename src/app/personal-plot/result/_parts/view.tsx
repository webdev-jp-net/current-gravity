'use client'

import type { FC } from 'react'

import { Check, Share2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Matrix } from '@/app/_parts/Matrix'

import { Button } from '@/components/Button'

import styles from './page.module.scss'

import type { QuestionItem } from '@/type/question'

import { AXIS_DESCRIPTION } from '@/constants/model'

import { Question } from '@/components/Question'
import { usePersonalPlotResult } from './usePersonalPlotResult'

export const PersonalPlotResultView: FC = () => {
  const router = useRouter()
  const {
    isMounted,
    isComplete,
    matrixPreviewList,
    parsedAnswers,
    valueLocusQuestionList,
    boundaryQuestionList,
    isAllAnswered,
    handleNavigateToHomeMatrix,
    handleEditFormSubmit,
    isShareCopied,
    handleCopyResultShareUrl,
  } = usePersonalPlotResult()

  if (!isMounted) return null

  if (!isComplete) {
    return (
      <main className={styles.personalPlot} data-testid="personal-plot-result">
        <div className={styles.intro}>
          <h1 className={styles.pageTitle}>あなたのいまの重心</h1>
          <p className={styles.introBody}>URL に20問分の回答が含まれていません。</p>
        </div>
        <footer className={styles.footer}>
          <Button
            variant="basic"
            size="full"
            type="button"
            className={styles.submitButton}
            onClick={() => router.push('/personal-plot')}
          >
            測定へ
          </Button>
        </footer>
      </main>
    )
  }

  return (
    <main className={styles.personalPlot} data-testid="personal-plot-result">
      <div className={styles.intro}>
        <h1 className={styles.pageTitle}>あなたのいまの重心</h1>
      </div>

      {matrixPreviewList.length > 0 ? (
        <section className={styles.matrixPreview} aria-label="マトリクス">
          <Matrix personalPlotList={matrixPreviewList} />
          <div className={styles.matrixPreviewActions}>
            <Button
              variant="basic"
              size="full"
              type="button"
              className={styles.matrixPreviewAddButton}
              onClick={handleNavigateToHomeMatrix}
              disabled={!isAllAnswered}
            >
              みんなのいまの重心に追加
            </Button>
            <Button
              variant="basic"
              size="liquid"
              type="button"
              className={styles.matrixPreviewShareButton}
              onClick={handleCopyResultShareUrl}
            >
              {isShareCopied ? <Check size={20} aria-hidden /> : <Share2 size={20} aria-hidden />}
              この結果のURLをコピー
            </Button>
          </div>
        </section>
      ) : null}

      <form className={styles.resultEditForm} onSubmit={handleEditFormSubmit}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>帰属</h2>
            <p className={styles.sectionLead}>
              {AXIS_DESCRIPTION.valueLocus}
            </p>
          </div>
          <div className={styles.sectionBody}>
            {valueLocusQuestionList.map((q, i) => (
              <Question key={q.id} item={q as QuestionItem} mode="result" value={parsedAnswers[q.id]} index={i} />
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>関係性</h2>
            <p className={styles.sectionLead}>
              {AXIS_DESCRIPTION.boundary}
            </p>
          </div>
          <div className={styles.sectionBody}>
            {boundaryQuestionList.map((q, i) => (
              <Question
                key={q.id}
                item={q as QuestionItem}
                mode="result"
                value={parsedAnswers[q.id]}
                index={valueLocusQuestionList.length + i}
              />
            ))}
          </div>
        </section>

        <footer className={styles.footer}>
          <Button variant="basic" size="full" type="submit" className={styles.submitButton}>
            結果を編集する
          </Button>
        </footer>
      </form>
    </main>
  )
}
