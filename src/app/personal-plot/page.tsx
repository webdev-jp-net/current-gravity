import { Suspense } from 'react'

import { PersonalPlotView } from './_parts/view'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'あなたのいまの重心を測定 | CURRENT GRAVITY',
}

export default function PersonalPlotPage() {
  return (
    <Suspense fallback={null}>
      <PersonalPlotView />
    </Suspense>
  )
}
