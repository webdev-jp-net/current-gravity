'use client'

import { useState, useEffect } from 'react'

import { useAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'

import questionListData from '@/data/questionList.json'
import { groupAtom } from '@/data/store'

import type { PersonalPlot } from '@/type/personalPlot'

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const usePersonalPlot = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [group, setGroup] = useAtom(groupAtom)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [shuffledQuestionList, setShuffledQuestionList] = useState<
    (typeof questionListData)[number][]
  >([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const valueLocusList = questionListData.filter(
      (q) => q.axis === 'valueLocus'
    )
    const boundaryList = questionListData.filter(
      (q) => q.axis === 'boundary'
    )
    setShuffledQuestionList([
      ...shuffleArray(valueLocusList),
      ...shuffleArray(boundaryList),
    ])
    setIsMounted(true)
  }, [])

  const valueLocusQuestionList = shuffledQuestionList.filter(
    (q) => q.axis === 'valueLocus'
  )
  const boundaryQuestionList = shuffledQuestionList.filter(
    (q) => q.axis === 'boundary'
  )
  const totalCount = shuffledQuestionList.length

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleAnswerChangeWithScroll = (
    questionId: string,
    value: number,
    currentIndex: number
  ) => {
    handleAnswerChange(questionId, value)
    if (currentIndex + 1 < totalCount) {
      window.location.hash = `question-${currentIndex + 1}`
    }
  }

  const isAllAnswered = questionListData.every(
    (q) => answers[q.id] !== undefined
  )

  const handleSubmit = () => {
    if (!isAllAnswered || !searchParams) return

    const targetId = searchParams.get('targetId')

    const metrics = {
      ownership: 0,
      consensus: 0,
      diversity: 0,
      identityFusion: 0,
    }

    questionListData.forEach((q) => {
      const val = answers[q.id] ?? 0
      metrics[q.orientation as keyof typeof metrics] += val
    })

    const defaultName = '名前'

    if (targetId) {
      setGroup({
        ...group,
        personalPlotList: group.personalPlotList.map((p) =>
          p.id === targetId
            ? {
                ...p,
                ...metrics,
                displayName:
                  p.displayName.trim() === '' ? defaultName : p.displayName,
              }
            : p
        ),
      })
    } else {
      const newPlot: PersonalPlot = {
        id: Date.now().toString(),
        displayName: defaultName,
        ...metrics,
      }
      setGroup({
        ...group,
        personalPlotList: [...group.personalPlotList, newPlot],
      })
    }

    router.push('/#matrix')
  }

  const handleBack = () => {
    router.push('/#group-editor')
  }

  return {
    isMounted,
    answers,
    valueLocusQuestionList,
    boundaryQuestionList,
    totalCount,
    handleAnswerChangeWithScroll,
    isAllAnswered,
    handleSubmit,
    handleBack,
  }
}
