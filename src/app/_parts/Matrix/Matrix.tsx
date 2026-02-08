'use client'

import type { FC } from 'react'

import { Group } from '@visx/group'
import { ParentSize } from '@visx/responsive'
import { Line } from '@visx/shape'

import styles from './Matrix.module.scss'

import { useMatrix } from './useMatrix'

import type { PersonalPlot } from '@/type/personalPlot'

interface MatrixProps {
  personalPlotList: PersonalPlot[]
}

const MatrixContent: FC<{
  personalPlotList: PersonalPlot[]
  width: number
  height: number
}> = ({ personalPlotList, width, height }) => {
  const { margin, innerWidth, innerHeight, center, pointsWithLayout, hoveredId, setHoveredId } =
    useMatrix(personalPlotList, width, height)

  return (
    <svg width={width} height={height}>
      <Group left={margin.left} top={margin.top}>
        <g>
          <Line
            from={{ x: center.x, y: 0 }}
            to={{ x: center.x, y: innerHeight }}
            className={styles.axisLine}
            strokeWidth={1}
          />
          <Line
            from={{ x: center.x, y: 0 }}
            to={{ x: center.x - 10, y: 12 }}
            className={styles.axisLine}
            strokeWidth={1}
          />
          <Line
            from={{ x: center.x, y: 0 }}
            to={{ x: center.x + 10, y: 12 }}
            className={styles.axisLine}
            strokeWidth={1}
          />
          <Line
            from={{ x: center.x, y: innerHeight }}
            to={{ x: center.x - 10, y: innerHeight - 12 }}
            className={styles.axisLine}
            strokeWidth={1}
          />
          <Line
            from={{ x: center.x, y: innerHeight }}
            to={{ x: center.x + 10, y: innerHeight - 12 }}
            className={styles.axisLine}
            strokeWidth={1}
          />
          <Line
            from={{ x: 0, y: center.y }}
            to={{ x: innerWidth, y: center.y }}
            className={styles.axisLine}
            strokeWidth={1}
          />
          <Line
            from={{ x: 0, y: center.y }}
            to={{ x: 12, y: center.y - 10 }}
            className={styles.axisLine}
            strokeWidth={1}
          />
          <Line
            from={{ x: 0, y: center.y }}
            to={{ x: 12, y: center.y + 10 }}
            className={styles.axisLine}
            strokeWidth={1}
          />
          <Line
            from={{ x: innerWidth, y: center.y }}
            to={{ x: innerWidth - 12, y: center.y - 10 }}
            className={styles.axisLine}
            strokeWidth={1}
          />
          <Line
            from={{ x: innerWidth, y: center.y }}
            to={{ x: innerWidth - 12, y: center.y + 10 }}
            className={styles.axisLine}
            strokeWidth={1}
          />
        </g>

        <Group>
          <text x={center.x} y={-35} textAnchor="middle" className={styles.axisName}>
            帰属
          </text>
          <text x={center.x} y={-15} textAnchor="middle" className={styles.axisLabel}>
            オーナーシップ
          </text>
          <text x={center.x} y={innerHeight + 25} textAnchor="middle" className={styles.axisLabel}>
            コンセンサス
          </text>
          <text x={center.x} y={innerHeight + 45} textAnchor="middle" className={styles.axisName}>
            帰属
          </text>
          <text x={-36} y={center.y - 10} textAnchor="middle" className={styles.axisName}>
            関係性
          </text>
          <text x={-36} y={center.y + 10} textAnchor="middle" className={styles.axisLabel}>
            自立
          </text>
          <text
            x={innerWidth + 36}
            y={center.y - 10}
            textAnchor="middle"
            className={styles.axisName}
          >
            関係性
          </text>
          <text
            x={innerWidth + 36}
            y={center.y + 10}
            textAnchor="middle"
            className={styles.axisLabel}
          >
            融合
          </text>
        </Group>

        {pointsWithLayout.map(person => {
          const isDimmed = hoveredId !== null && hoveredId !== person.id
          return (
            <Group
              key={person.id}
              onMouseEnter={() => setHoveredId(person.id)}
              onMouseLeave={() => setHoveredId(null)}
              onTouchStart={() => setHoveredId(person.id)}
              opacity={isDimmed ? 0.2 : 1}
            >
              <circle cx={person.x} cy={person.y} r={8} className={styles.plotPoint} />
              <text
                x={person.x + person.offsetX}
                y={person.y + person.offsetY}
                textAnchor={person.textAnchor}
                dominantBaseline="central"
                className={styles.plotLabel}
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
    <div id="matrix" className={styles.matrix}>
      <ParentSize>
        {({ width, height }) => (
          <MatrixContent personalPlotList={personalPlotList} width={width} height={height} />
        )}
      </ParentSize>
    </div>
  )
}
