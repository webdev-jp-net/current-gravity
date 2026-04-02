'use client'

import { useMemo, useState } from 'react'

import { scaleLinear } from '@visx/scale'

import type { PersonalPlot } from '@/type/personalPlot'

type LabelRect = {
  id: string
  x: number
  y: number
  width: number
  height: number
  offsetX: number
  offsetY: number
}

const SEARCH_PATTERNS = [
  { ox: 0, oy: -18, align: 'middle' as const },
  { ox: 0, oy: 18, align: 'middle' as const },
  { ox: 20, oy: 0, align: 'start' as const },
  { ox: -20, oy: 0, align: 'end' as const },
  { ox: 15, oy: -15, align: 'start' as const },
  { ox: -15, oy: -15, align: 'end' as const },
  { ox: 15, oy: 15, align: 'start' as const },
  { ox: -15, oy: 15, align: 'end' as const },
]

const PLOT_RADIUS = 8
const FONT_SIZE = 12
const LABEL_HEIGHT = 18
const PADDING = 4
const MARGIN = { top: 60, right: 60, bottom: 60, left: 60 }

function isOverlapping(rectA: LabelRect, rectB: LabelRect): boolean {
  const aLeft = rectA.x + rectA.offsetX - rectA.width / 2
  const aRight = aLeft + rectA.width
  const aTop = rectA.y + rectA.offsetY - rectA.height / 2
  const aBottom = aTop + rectA.height
  const bLeft = rectB.x + rectB.offsetX - rectB.width / 2
  const bRight = bLeft + rectB.width
  const bTop = rectB.y + rectB.offsetY - rectB.height / 2
  const bBottom = bTop + rectB.height
  return !(aRight < bLeft || aLeft > bRight || aBottom < bTop || aTop > bBottom)
}

export type PointWithLayout = LabelRect &
  PersonalPlot & { textAnchor: 'middle' | 'start' | 'end' }

export function useMatrix(
  personalPlotList: PersonalPlot[],
  width: number,
  height: number
) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const innerWidth = width - MARGIN.left - MARGIN.right
  const innerHeight = height - MARGIN.top - MARGIN.bottom

  const xScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [-20, 20],
        range: [0, innerWidth],
      }),
    [innerWidth]
  )

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [-20, 20],
        range: [innerHeight, 0],
      }),
    [innerHeight]
  )

  const center = useMemo(
    () => ({ x: xScale(0), y: yScale(0) }),
    [xScale, yScale]
  )

  const pointsWithLayout = useMemo((): PointWithLayout[] => {
    const layouts: LabelRect[] = personalPlotList.map((person) => {
      const valueLocus = person.ownership - person.consensus
      const boundary = person.identityFusion - person.diversity
      const x = xScale(boundary)
      const y = yScale(valueLocus)
      const estimatedWidth =
        person.displayName.length * (FONT_SIZE * 0.8) + PADDING * 2
      return {
        id: person.id,
        x,
        y,
        width: estimatedWidth,
        height: LABEL_HEIGHT,
        offsetX: 0,
        offsetY: -15,
      }
    })

    layouts.forEach((current, i) => {
      let bestPattern = SEARCH_PATTERNS[0]
      let minOverlapCount = Infinity

      for (const pattern of SEARCH_PATTERNS) {
        current.offsetX = pattern.ox
        current.offsetY = pattern.oy
        let overlapCount = 0
        for (let j = 0; j < layouts.length; j++) {
          if (i === j) continue
          if (isOverlapping(current, layouts[j])) overlapCount++
          const distToPlot = Math.sqrt(
            Math.pow(current.x + current.offsetX - layouts[j].x, 2) +
              Math.pow(current.y + current.offsetY - layouts[j].y, 2)
          )
          if (distToPlot < PLOT_RADIUS + 5) overlapCount++
        }
        if (overlapCount === 0) {
          bestPattern = pattern
          break
        }
        if (overlapCount < minOverlapCount) {
          minOverlapCount = overlapCount
          bestPattern = pattern
        }
      }
      current.offsetX = bestPattern.ox
      current.offsetY = bestPattern.oy
    })

    return layouts.map((layout, i) => ({
      ...personalPlotList[i],
      ...layout,
      textAnchor:
        SEARCH_PATTERNS.find(
          (p) => p.ox === layout.offsetX && p.oy === layout.offsetY
        )?.align ?? 'middle',
    }))
  }, [personalPlotList, xScale, yScale])

  return {
    margin: MARGIN,
    innerWidth,
    innerHeight,
    xScale,
    yScale,
    center,
    pointsWithLayout,
    hoveredId,
    setHoveredId,
  }
}
