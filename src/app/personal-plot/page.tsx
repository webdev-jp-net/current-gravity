import { Suspense } from 'react'
import type { Metadata } from 'next'
import { PersonalPlotView } from './_parts/view'

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
