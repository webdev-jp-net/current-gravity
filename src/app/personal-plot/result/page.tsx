import { Suspense } from 'react'

import { PersonalPlotResultView } from './_parts/view'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'あなたのいまの重心 | CURRENT GRAVITY',
}

export default function PersonalPlotResultPage() {
  return (
    <Suspense fallback={null}>
      <PersonalPlotResultView />
    </Suspense>
  )
}
