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
  const [shuffledQuestions, setShuffledQuestions] = useState<
    (typeof questionListData)[number][]
  >([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const valueLocusQuestions = questionListData.filter(
      (q) => q.axis === 'valueLocus'
    )
    const boundaryQuestions = questionListData.filter(
      (q) => q.axis === 'boundary'
    )
    setShuffledQuestions([
      ...shuffleArray(valueLocusQuestions),
      ...shuffleArray(boundaryQuestions),
    ])
    setIsMounted(true)
  }, [])

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
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

    if (targetId) {
      setGroup({
        ...group,
        personalPlotList: group.personalPlotList.map((p) =>
          p.id === targetId ? { ...p, ...metrics } : p
        ),
      })
    } else {
      const newPlot: PersonalPlot = {
        id: Date.now().toString(),
        displayName: '',
        ...metrics,
      }
      setGroup({
        ...group,
        personalPlotList: [...group.personalPlotList, newPlot],
      })
    }

    router.push('/#group-editor')
  }

  return {
    isMounted,
    answers,
    shuffledQuestions,
    isAllAnswered,
    handleAnswerChange,
    handleSubmit,
  }
}
