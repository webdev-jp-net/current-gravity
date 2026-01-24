import React from 'react'

export type PersonalPlot = {
  id: string
  displayName: string
  structuralLogic: number
  process: number
  interpersonal: number
  socialAdaptation: number
}

interface ValueOrientationMatrixProps {
  personalPlotList: PersonalPlot[]
}

export const ValueOrientationMatrix: React.FC<ValueOrientationMatrixProps> = ({ personalPlotList }) => {
  return (
    <div className="w-full aspect-square bg-white rounded-ldsg-400 border border-gray-border overflow-hidden">
      <svg viewBox="0 0 500 500" className="w-full h-full">
        {/* Axes */}
        <g>
          <line x1="250" y1="80" x2="240" y2="92" className="stroke-gray-border" strokeWidth="1" />
          <line x1="250" y1="80" x2="260" y2="92" className="stroke-gray-border" strokeWidth="1" />
          <line x1="250" y1="80" x2="250" y2="420" className="stroke-gray-border" strokeWidth="1" />
          <line x1="250" y1="420" x2="240" y2="408" className="stroke-gray-border" strokeWidth="1" />
          <line x1="250" y1="420" x2="260" y2="408" className="stroke-gray-border" strokeWidth="1" />
        </g>
        <g>
          <line x1="80" y1="250" x2="92" y2="240" className="stroke-gray-border" strokeWidth="1" />
          <line x1="80" y1="250" x2="92" y2="260" className="stroke-gray-border" strokeWidth="1" />
          <line x1="80" y1="250" x2="420" y2="250" className="stroke-gray-border" strokeWidth="1" />
          <line x1="420" y1="250" x2="408" y2="240" className="stroke-gray-border" strokeWidth="1" />
          <line x1="420" y1="250" x2="408" y2="260" className="stroke-gray-border" strokeWidth="1" />
        </g>

        {/* Y-axis top label */}
        <g transform="translate(250, 52)" textAnchor="middle">
          <text className="fill-gray-paragraph text-label">帰属</text>
          <text y="1.5em" className="text-caption">オーナーシップ</text>
        </g>

        {/* Y-axis bottom label */}
        <g transform="translate(250, 445)" className="text-caption" textAnchor="middle">
          <text className="text-caption">コンセンサス</text>
          <text y="1.5em" className="fill-gray-paragraph text-label">帰属</text>
        </g>

        {/* X-axis left label */}
        <g transform="translate(52, 234)" textAnchor="middle">
          <text className="fill-gray-paragraph text-label">関係性</text>
          <text y="1.5em" className="text-caption">自立</text>
        </g>

        {/* X-axis right label */}
        <g transform="translate(448, 234)" textAnchor="middle">
          <text className="fill-gray-paragraph text-label">関係性</text>
          <text y="1.5em" className="text-caption">融合</text>
        </g>

        {/* Data points */}
        {personalPlotList.map((person) => {
          const x = 250 + ((person.interpersonal + person.socialAdaptation) / 40) * 320
          const y = 250 - ((person.structuralLogic + person.process) / 40) * 320
          return (
            <g key={person.id}>
              <circle cx={x} cy={y} r="8" className="fill-primary" />
              <text x={x} y={y - 12} className="fill-dark text-label" textAnchor="middle">
                {person.displayName}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
