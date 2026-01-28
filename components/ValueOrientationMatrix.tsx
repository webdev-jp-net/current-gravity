import React, { useMemo, useState } from 'react'
import { Group } from '@visx/group'
import { Line } from '@visx/shape'
import { scaleLinear } from '@visx/scale'
import { ParentSize } from '@visx/responsive'
import questionListData from '../data/questionList.json'

export type PersonalPlot = {
  id: string
  displayName: string
  ownership: number
  consensus: number
  diversity: number
  identityFusion: number
}

interface ValueOrientationMatrixProps {
  personalPlotList: PersonalPlot[]
}

type LabelRect = {
  id: string
  x: number
  y: number
  width: number
  height: number
  offsetX: number
  offsetY: number
}

const MatrixContent: React.FC<ValueOrientationMatrixProps & { width: number; height: number }> = ({
  personalPlotList,
  width,
  height,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const counts = useMemo(() => ({
    ownership: questionListData.filter(q => q.orientation === 'ownership').length,
    consensus: questionListData.filter(q => q.orientation === 'consensus').length,
    diversity: questionListData.filter(q => q.orientation === 'diversity').length,
    identityFusion: questionListData.filter(q => q.orientation === 'identityFusion').length,
  }), [])

  const margin = { top: 60, right: 60, bottom: 60, left: 60 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const xScale = useMemo(() => scaleLinear<number>({
    domain: [-4, 4],
    range: [0, innerWidth],
  }), [innerWidth])

  const yScale = useMemo(() => scaleLinear<number>({
    domain: [-4, 4],
    range: [innerHeight, 0],
  }), [innerHeight])

  const center = {
    x: xScale(0),
    y: yScale(0),
  }

  // ラベルの全方位探索・衝突回避ロジック
  const pointsWithLayout = useMemo(() => {
    const FONT_SIZE = 12
    const LABEL_HEIGHT = 18
    const PLOT_RADIUS = 8
    const PADDING = 4

    // 1. 各プロットの基本位置とラベル矩形（推定）を初期化
    let layouts: LabelRect[] = personalPlotList.map(person => {
      const avgOwnership = counts.ownership > 0 ? person.ownership / counts.ownership : 0
      const avgConsensus = counts.consensus > 0 ? person.consensus / counts.consensus : 0
      const avgDiversity = counts.diversity > 0 ? person.diversity / counts.diversity : 0
      const avgIdentityFusion = counts.identityFusion > 0 ? person.identityFusion / counts.identityFusion : 0

      const valueLocus = avgOwnership - avgConsensus
      const boundary = avgIdentityFusion - avgDiversity

      const x = xScale(boundary)
      const y = yScale(valueLocus)
      
      // ラベル幅の推定（文字数 * 係数 + パディング）
      const estimatedWidth = person.displayName.length * (FONT_SIZE * 0.8) + PADDING * 2

      return {
        id: person.id,
        x,
        y,
        width: estimatedWidth,
        height: LABEL_HEIGHT,
        offsetX: 0,
        offsetY: -15, // 初期位置：上
      }
    })

    // 2. 探索パターンの定義（優先順位順）
    const searchPatterns = [
      { ox: 0, oy: -18, align: 'middle' }, // 上
      { ox: 0, oy: 18, align: 'middle' },  // 下
      { ox: 20, oy: 0, align: 'start' },   // 右
      { ox: -20, oy: 0, align: 'end' },    // 左
      { ox: 15, oy: -15, align: 'start' }, // 右上
      { ox: -15, oy: -15, align: 'end' },  // 左上
      { ox: 15, oy: 15, align: 'start' },  // 右下
      { ox: -15, oy: 15, align: 'end' },   // 左下
    ]

    // 3. 衝突判定関数
    const isOverlapping = (rectA: LabelRect, rectB: LabelRect) => {
      const aLeft = rectA.x + rectA.offsetX - (rectA.width / 2)
      const aRight = aLeft + rectA.width
      const aTop = rectA.y + rectA.offsetY - (rectA.height / 2)
      const aBottom = aTop + rectA.height

      const bLeft = rectB.x + rectB.offsetX - (rectB.width / 2)
      const bRight = bLeft + rectB.width
      const bTop = rectB.y + rectB.offsetY - (rectB.height / 2)
      const bBottom = bTop + rectB.height

      return !(aRight < bLeft || aLeft > bRight || aBottom < bTop || aTop > bBottom)
    }

    // 4. 配置の最適化
    layouts.forEach((current, i) => {
      let bestPattern = searchPatterns[0]
      let minOverlapCount = Infinity

      for (const pattern of searchPatterns) {
        current.offsetX = pattern.ox
        current.offsetY = pattern.oy
        
        let overlapCount = 0
        for (let j = 0; j < layouts.length; j++) {
          if (i === j) continue
          // 他のラベルとの衝突
          if (isOverlapping(current, layouts[j])) {
            overlapCount++
          }
          // 他のプロット本体との衝突
          const distToPlot = Math.sqrt(
            Math.pow(current.x + current.offsetX - layouts[j].x, 2) +
            Math.pow(current.y + current.offsetY - layouts[j].y, 2)
          )
          if (distToPlot < PLOT_RADIUS + 5) {
            overlapCount++
          }
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
      textAnchor: (searchPatterns.find(p => p.ox === layout.offsetX && p.oy === layout.offsetY)?.align || 'middle') as "middle" | "start" | "end"
    }))
  }, [personalPlotList, counts, xScale, yScale])

  return (
    <svg width={width} height={height}>
      <Group left={margin.left} top={margin.top}>
        {/* 軸 */}
        <g>
          {/* 縦軸線 */}
          <Line from={{ x: center.x, y: 0 }} to={{ x: center.x, y: innerHeight }} stroke="#D1D1D1" strokeWidth={1} />
          {/* 上向き矢印 */}
          <Line from={{ x: center.x, y: 0 }} to={{ x: center.x - 10, y: 12 }} stroke="#D1D1D1" strokeWidth={1} />
          <Line from={{ x: center.x, y: 0 }} to={{ x: center.x + 10, y: 12 }} stroke="#D1D1D1" strokeWidth={1} />
          {/* 下向き矢印 */}
          <Line from={{ x: center.x, y: innerHeight }} to={{ x: center.x - 10, y: innerHeight - 12 }} stroke="#D1D1D1" strokeWidth={1} />
          <Line from={{ x: center.x, y: innerHeight }} to={{ x: center.x + 10, y: innerHeight - 12 }} stroke="#D1D1D1" strokeWidth={1} />

          {/* 横軸線 */}
          <Line from={{ x: 0, y: center.y }} to={{ x: innerWidth, y: center.y }} stroke="#D1D1D1" strokeWidth={1} />
          {/* 左向き矢印 */}
          <Line from={{ x: 0, y: center.y }} to={{ x: 12, y: center.y - 10 }} stroke="#D1D1D1" strokeWidth={1} />
          <Line from={{ x: 0, y: center.y }} to={{ x: 12, y: center.y + 10 }} stroke="#D1D1D1" strokeWidth={1} />
          {/* 右向き矢印 */}
          <Line from={{ x: innerWidth, y: center.y }} to={{ x: innerWidth - 12, y: center.y - 10 }} stroke="#D1D1D1" strokeWidth={1} />
          <Line from={{ x: innerWidth, y: center.y }} to={{ x: innerWidth - 12, y: center.y + 10 }} stroke="#D1D1D1" strokeWidth={1} />
        </g>

        {/* 軸ラベル */}
        <Group>
          <text x={center.x} y={-35} textAnchor="middle" className="fill-gray-paragraph text-label">帰属</text>
          <text x={center.x} y={-15} textAnchor="middle" className="text-caption fill-dark">オーナーシップ</text>
          <text x={center.x} y={innerHeight + 25} textAnchor="middle" className="text-caption fill-dark">コンセンサス</text>
          <text x={center.x} y={innerHeight + 45} textAnchor="middle" className="fill-gray-paragraph text-label">帰属</text>
          <text x={-10} y={center.y - 10} textAnchor="end" className="fill-gray-paragraph text-label">関係性</text>
          <text x={-10} y={center.y + 10} textAnchor="end" className="text-caption fill-dark">自立</text>
          <text x={innerWidth + 10} y={center.y - 10} textAnchor="start" className="fill-gray-paragraph text-label">関係性</text>
          <text x={innerWidth + 10} y={center.y + 10} textAnchor="start" className="text-caption fill-dark">融合</text>
        </Group>

        {/* データポイント */}
        {pointsWithLayout.map((person) => {
          const isDimmed = hoveredId !== null && hoveredId !== person.id

          return (
            <Group
              key={person.id}
              onMouseEnter={() => setHoveredId(person.id)}
              onMouseLeave={() => setHoveredId(null)}
              onTouchStart={() => setHoveredId(person.id)}
              className="cursor-pointer transition-opacity duration-300"
              opacity={isDimmed ? 0.2 : 1}
            >
              <circle cx={person.x} cy={person.y} r={8} className="fill-primary" />
              <text
                x={person.x + person.offsetX}
                y={person.y + person.offsetY}
                textAnchor={person.textAnchor}
                dominantBaseline="central"
                className="fill-dark text-label font-bold"
                style={{ paintOrder: 'stroke', stroke: '#fff', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' }}
              >
                {person.displayName}
              </text>
            </Group>
          )
        })}
      </Group>
    </svg>
  )
}

export const ValueOrientationMatrix: React.FC<ValueOrientationMatrixProps> = ({ personalPlotList }) => {
  return (
    <div className="w-full aspect-square bg-white rounded-ldsg-400 border border-gray-border overflow-hidden">
      <ParentSize>
        {({ width, height }) => (
          <MatrixContent
            personalPlotList={personalPlotList}
            width={width}
            height={height}
          />
        )}
      </ParentSize>
    </div>
  )
}
