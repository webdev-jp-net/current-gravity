'use client'

import type { FC } from 'react'

import { Group } from '@visx/group'
import { ParentSize } from '@visx/responsive'
import { Line } from '@visx/shape'

import { PoleIcon } from '@/components/PoleIcon'
import { PoleLabel } from '@/components/PoleLabel'

import styles from './Matrix.module.scss'

import { useMatrix } from './useMatrix'

import type { PersonalPlot } from '@/type/personalPlot'

import { AXIS_LABEL } from '@/constants/model'

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
          <text x={center.x} y={-16} textAnchor="middle" className={styles.axisName}>
            {AXIS_LABEL.valueLocus}
          </text>
          <text x={center.x} y={innerHeight + 28} textAnchor="middle" className={styles.axisName}>
            {AXIS_LABEL.valueLocus}
          </text>
          <text x={-32} y={center.y - 16} textAnchor="middle" className={styles.axisName}>
            {AXIS_LABEL.boundary}
          </text>
          <text
            x={innerWidth + 32}
            y={center.y - 16}
            textAnchor="middle"
            className={styles.axisName}
          >
            {AXIS_LABEL.boundary}
          </text>
        </Group>

        {(() => {
          const hasFocused = personalPlotList.some(p => p.focus)
          return pointsWithLayout.map(person => {
            const isHovered = hoveredId === person.id
            const isUnfocused = hasFocused && !person.focus
            const isDimmed = hoveredId !== null && !isHovered
            const opacity = isHovered ? 1 : isUnfocused ? 0.2 : isDimmed ? 0.2 : 1
            const showLabel = !isUnfocused || isHovered
            return (
              <Group
                key={person.id}
                onMouseEnter={() => setHoveredId(person.id)}
                onMouseLeave={() => setHoveredId(null)}
                onTouchStart={() => setHoveredId(person.id)}
                opacity={opacity}
              >
                <circle cx={person.x} cy={person.y} r={8} className={styles.plotPoint} />
                {showLabel && (
                  <text
                    x={person.x + person.offsetX}
                    y={person.y + person.offsetY}
                    textAnchor={person.textAnchor}
                    dominantBaseline="central"
                    className={styles.plotLabel}
                  >
                    {person.displayName}
                  </text>
                )}
              </Group>
            )
          })
        })()}
      </Group>
    </svg>
  )
}

export const Matrix: FC<MatrixProps> = ({ personalPlotList }) => {
  return (
    <div id="matrix" className={styles.matrix}>
      <PoleIcon variant="ownership" className={[styles.icon, styles['--ownership']].join(' ')} />
      <PoleIcon variant="consensus" className={[styles.icon, styles['--consensus']].join(' ')} />
      <PoleIcon variant="diversity" className={[styles.icon, styles['--diversity']].join(' ')} />
      <PoleIcon
        variant="identityFusion"
        className={[styles.icon, styles['--identityFusion']].join(' ')}
      />
      <PoleLabel
        pole="ownership"
        icon={false}
        withDescription
        className={`${styles.poleLabel} ${styles['--ownership']}`}
      />
      <PoleLabel
        pole="consensus"
        icon={false}
        withDescription
        className={`${styles.poleLabel} ${styles['--consensus']}`}
      />
      <PoleLabel
        pole="diversity"
        icon={false}
        withDescription
        className={`${styles.poleLabel} ${styles['--diversity']}`}
      />
      <PoleLabel
        pole="identityFusion"
        icon={false}
        withDescription
        className={`${styles.poleLabel} ${styles['--identityFusion']}`}
      />
      <ParentSize>
        {({ width, height }) => (
          <MatrixContent personalPlotList={personalPlotList} width={width} height={height} />
        )}
      </ParentSize>
    </div>
  )
}
