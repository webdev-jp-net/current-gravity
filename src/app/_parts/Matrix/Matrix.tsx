'use client'

import type { FC } from 'react'

import { Group } from '@visx/group'
import { ParentSize } from '@visx/responsive'
import { Line } from '@visx/shape'

import type { PersonalPlot } from '@/components/ValueOrientationMatrix'

import styles from './Matrix.module.scss'

import { useMatrix } from './useMatrix'

interface MatrixProps {
  personalPlotList: PersonalPlot[]
}

const MatrixContent: FC<{
  personalPlotList: PersonalPlot[]
  width: number
  height: number
}> = ({ personalPlotList, width, height }) => {
  const {
    margin,
    innerWidth,
    innerHeight,
    center,
    pointsWithLayout,
    hoveredId,
    setHoveredId,
  } = useMatrix(personalPlotList, width, height)

  return (
    <svg width={width} height={height}>
      <Group left={margin.left} top={margin.top}>
        <g>
          <Line
            from={{ x: center.x, y: 0 }}
            to={{ x: center.x, y: innerHeight }}
            stroke="#D1D1D1"
            strokeWidth={1}
          />
          <Line
            from={{ x: center.x, y: 0 }}
            to={{ x: center.x - 10, y: 12 }}
            stroke="#D1D1D1"
            strokeWidth={1}
          />
          <Line
            from={{ x: center.x, y: 0 }}
            to={{ x: center.x + 10, y: 12 }}
            stroke="#D1D1D1"
            strokeWidth={1}
          />
          <Line
            from={{ x: center.x, y: innerHeight }}
            to={{ x: center.x - 10, y: innerHeight - 12 }}
            stroke="#D1D1D1"
            strokeWidth={1}
          />
          <Line
            from={{ x: center.x, y: innerHeight }}
            to={{ x: center.x + 10, y: innerHeight - 12 }}
            stroke="#D1D1D1"
            strokeWidth={1}
          />
          <Line
            from={{ x: 0, y: center.y }}
            to={{ x: innerWidth, y: center.y }}
            stroke="#D1D1D1"
            strokeWidth={1}
          />
          <Line
            from={{ x: 0, y: center.y }}
            to={{ x: 12, y: center.y - 10 }}
            stroke="#D1D1D1"
            strokeWidth={1}
          />
          <Line
            from={{ x: 0, y: center.y }}
            to={{ x: 12, y: center.y + 10 }}
            stroke="#D1D1D1"
            strokeWidth={1}
          />
          <Line
            from={{ x: innerWidth, y: center.y }}
            to={{ x: innerWidth - 12, y: center.y - 10 }}
            stroke="#D1D1D1"
            strokeWidth={1}
          />
          <Line
            from={{ x: innerWidth, y: center.y }}
            to={{ x: innerWidth - 12, y: center.y + 10 }}
            stroke="#D1D1D1"
            strokeWidth={1}
          />
        </g>

        <Group>
          <text x={center.x} y={-35} textAnchor="middle">
            帰属
          </text>
          <text x={center.x} y={-15} textAnchor="middle">
            オーナーシップ
          </text>
          <text x={center.x} y={innerHeight + 25} textAnchor="middle">
            コンセンサス
          </text>
          <text x={center.x} y={innerHeight + 45} textAnchor="middle">
            帰属
          </text>
          <text x={-10} y={center.y - 10} textAnchor="end">
            関係性
          </text>
          <text x={-10} y={center.y + 10} textAnchor="end">
            自立
          </text>
          <text x={innerWidth + 10} y={center.y - 10} textAnchor="start">
            関係性
          </text>
          <text x={innerWidth + 10} y={center.y + 10} textAnchor="start">
            融合
          </text>
        </Group>

        {pointsWithLayout.map((person) => {
          const isDimmed = hoveredId !== null && hoveredId !== person.id
          return (
            <Group
              key={person.id}
              onMouseEnter={() => setHoveredId(person.id)}
              onMouseLeave={() => setHoveredId(null)}
              onTouchStart={() => setHoveredId(person.id)}
              opacity={isDimmed ? 0.2 : 1}
            >
              <circle cx={person.x} cy={person.y} r={8} />
              <text
                x={person.x + person.offsetX}
                y={person.y + person.offsetY}
                textAnchor={person.textAnchor}
                dominantBaseline="central"
                style={{
                  paintOrder: 'stroke',
                  stroke: '#fff',
                  strokeWidth: 3,
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                }}
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

export const Matrix: FC<MatrixProps> = ({ personalPlotList }) => {
  return (
    <div className={styles.matrix} style={{ aspectRatio: 1 }}>
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
