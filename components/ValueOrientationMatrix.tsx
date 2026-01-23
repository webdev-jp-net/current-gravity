import React from 'react'

export type Person = {
  id: string
  displayName: string
  structuralLogic: number
  process: number
  interpersonal: number
  socialAdaptation: number
}

interface ValueOrientationMatrixProps {
  personList: Person[]
}

export const ValueOrientationMatrix: React.FC<ValueOrientationMatrixProps> = ({ personList }) => {
  return (
    <div className="w-full aspect-square bg-white rounded-ldsg-400 border border-gray-border overflow-hidden">
      <svg viewBox="0 0 500 500" className="w-full h-full">
        {/* Axes */}
        <line x1="250" y1="80" x2="250" y2="420" className="stroke-gray-border" strokeWidth="1" />
        <line x1="80" y1="250" x2="420" y2="250" className="stroke-gray-border" strokeWidth="1" />

        {/* Y-axis top label */}
        <text x="250" y="52" className="fill-dark text-[14px] font-bold" textAnchor="middle">
          オーナーシップ
        </text>

        {/* Y-axis bottom label */}
        <text x="250" y="445" className="fill-dark text-[14px] font-bold" textAnchor="middle">
          コンセンサス
        </text>

        {/* X-axis left label */}
        <text x="52" y="240" className="fill-dark text-[14px] font-bold" textAnchor="middle">
          自立
        </text>

        {/* X-axis right label */}
        <text x="448" y="240" className="fill-dark text-[14px] font-bold" textAnchor="middle">
          融合
        </text>

        {/* Data points */}
        {personList.map((person) => {
          const x = 80 + ((person.interpersonal + person.socialAdaptation) / 100) * 340
          const y = 420 - ((person.structuralLogic + person.process) / 100) * 340
          return (
            <g key={person.id}>
              <circle cx={x} cy={y} r="8" className="fill-primary" />
              <text x={x} y={y - 12} className="fill-dark text-[12px]" textAnchor="middle">
                {person.displayName}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
