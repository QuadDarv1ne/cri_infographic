'use client'

import { useState, useCallback } from 'react'
import { motion, animate } from 'framer-motion'

interface CRIGaugeProps {
  value?: number
  onValueChange?: (value: number) => void
  temperature?: number
  onTemperatureChange?: (temp: number) => void
}

const ranges = [
  { min: 0, max: 40, label: 'Плохая цветопередача', color: '#ef4444', description: 'Искажение цветов, непригодно для большинства задач' },
  { min: 40, max: 60, label: 'Приемлемая', color: '#eab308', description: 'Допустимо для технических помещений, коридоров' },
  { min: 60, max: 80, label: 'Хорошая', color: '#f59e0b', description: 'Подходит для жилых помещений и офисов' },
  { min: 80, max: 100, label: 'Отличная', color: '#e8751a', description: 'Идеально для точной цветопередачи, музеев, медицины' },
]

export default function CRIGauge({ value = 85, onValueChange, temperature = 4000, onTemperatureChange }: CRIGaugeProps) {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null)
  const [hoveredRange, setHoveredRange] = useState<typeof ranges[0] | null>(null)

  const getRangeForValue = useCallback((val: number) => {
    return ranges.find(r => val >= r.min && val < r.max) || ranges[ranges.length - 1]
  }, [])

  const displayValue = hoveredValue ?? value
  const displayRange = hoveredRange ?? getRangeForValue(displayValue)

  const gaugeRadius = 140
  const strokeWidth = 28
  const centerX = 200
  const centerY = 180

  const polarToCartesian = (angle: number, radius: number) => {
    const rad = ((angle - 180) * Math.PI) / 180
    return {
      x: centerX + radius * Math.cos(rad),
      y: centerY + radius * Math.sin(rad),
    }
  }

  const describeArc = (startAngle: number, endAngle: number, radius: number) => {
    const start = polarToCartesian(startAngle, radius)
    const end = polarToCartesian(endAngle, radius)
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`
  }

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    // Scale mouse position to SVG viewBox coordinates
    const scaleX = 400 / rect.width
    const scaleY = 220 / rect.height
    const svgX = (e.clientX - rect.left) * scaleX
    const svgY = (e.clientY - rect.top) * scaleY

    // Calculate angle from center of gauge
    const dx = svgX - centerX
    const dy = centerY - svgY // Invert Y because SVG Y goes down

    let angle = Math.atan2(dy, dx) * (180 / Math.PI)
    if (angle < 0) angle += 360

    // The gauge arc goes from 0 to 180 degrees (left to right, semicircle at top)
    // angle 180 = left end (CRI 0), angle 0/360 = right end (CRI 100)
    if (angle > 180) return // Below the gauge, ignore

    const normalizedAngle = 180 - angle
    const val = Math.round((normalizedAngle / 180) * 100)
    const clampedVal = Math.max(0, Math.min(100, val))
    setHoveredValue(clampedVal)
    setHoveredRange(getRangeForValue(clampedVal))
  }

  const handleMouseLeave = () => {
    setHoveredValue(null)
    setHoveredRange(null)
  }

  const needleAngle = 180 + (displayValue / 100) * 180
  const needleTip = polarToCartesian(needleAngle, gaugeRadius - 40)

  // Color temperature to color for the slider track
  const getTempColor = (temp: number) => {
    if (temp <= 3200) return '#ffb46b'
    if (temp <= 5000) return '#fff4e0'
    return '#c9e8ff'
  }

  const tempLabel = temperature <= 3200 ? 'Тёплый' : temperature <= 5000 ? 'Нейтральный' : 'Холодный'

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <svg
        viewBox="0 0 400 220"
        className="w-full max-w-[280px] sm:max-w-md cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background arc */}
        <path
          d={describeArc(0, 180, gaugeRadius)}
          fill="none"
          stroke="#2a2a3e"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Gradient arcs for each range */}
        {ranges.map((range, i) => {
          const startAngle = (range.min / 100) * 180
          const endAngle = (range.max / 100) * 180
          return (
            <path
              key={i}
              d={describeArc(startAngle, endAngle, gaugeRadius)}
              fill="none"
              stroke={range.color}
              strokeWidth={strokeWidth}
              strokeLinecap={i === 0 ? 'round' : 'butt'}
              opacity={hoveredRange && hoveredRange.min === range.min ? 1 : 0.75}
              style={{ transition: 'opacity 0.2s ease' }}
            />
          )
        })}

        {/* Tick marks and labels */}
        {[0, 20, 40, 60, 80, 100].map((tick) => {
          const angle = (tick / 100) * 180
          const inner = polarToCartesian(angle, gaugeRadius - strokeWidth / 2 - 8)
          const outer = polarToCartesian(angle, gaugeRadius - strokeWidth / 2 - 18)
          const label = polarToCartesian(angle, gaugeRadius + 24)
          return (
            <g key={tick}>
              <line
                x1={inner.x} y1={inner.y}
                x2={outer.x} y2={outer.y}
                stroke="#8b8ba0"
                strokeWidth={2}
              />
              <text
                x={label.x} y={label.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-gray-400"
                fontSize={13}
                fontWeight={500}
              >
                {tick}
              </text>
            </g>
          )
        })}

        {/* Needle - using motion.g for reliable animation */}
        <motion.g
          animate={{
            rotate: needleAngle - 180,
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          style={{ originX: `${centerX}px`, originY: `${centerY}px` }}
        >
          <line
            x1={centerX} y1={centerY}
            x2={centerX} y2={centerY - (gaugeRadius - 40)}
            stroke="#ffffff"
            strokeWidth={3}
            strokeLinecap="round"
          />
        </motion.g>
        <circle cx={centerX} cy={centerY} r={8} fill="#e8751a" />
        <circle cx={centerX} cy={centerY} r={4} fill="#ffffff" />

        {/* Center value */}
        <motion.text
          x={centerX} y={centerY + 44}
          textAnchor="middle"
          className="fill-white"
          fontSize={42}
          fontWeight={700}
          key={displayValue}
          initial={{ opacity: 0.5, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.15 }}
        >
          {displayValue}
        </motion.text>
        <text
          x={centerX} y={centerY + 66}
          textAnchor="middle"
          className="fill-gray-400"
          fontSize={14}
          fontWeight={400}
        >
          CRI
        </text>
      </svg>

      {/* Range indicator */}
      <motion.div
        className="px-5 py-2.5 rounded-full text-white font-semibold text-sm"
        animate={{ backgroundColor: displayRange.color }}
        transition={{ duration: 0.3 }}
      >
        {displayRange.label}
      </motion.div>
      <p className="text-gray-400 text-sm text-center max-w-sm">
        {displayRange.description}
      </p>

      {/* CRI Slider */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-md mt-4 space-y-4"
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-gray-300 text-sm font-medium">Значение CRI</label>
            <span className="text-[#e8751a] font-bold text-lg">{value}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={value}
            onChange={(e) => onValueChange?.(Number(e.target.value))}
            className="cri-slider w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #ef4444 0%, #eab308 40%, #f59e0b 60%, #e8751a 80%, #e8751a 100%)`,
            }}
          />
          <div className="flex justify-between text-gray-500 text-xs mt-1">
            <span>0</span>
            <span>40</span>
            <span>60</span>
            <span>80</span>
            <span>100</span>
          </div>
        </div>

        {/* Temperature Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-gray-300 text-sm font-medium">Цветовая температура</label>
            <span className="font-bold text-sm" style={{ color: getTempColor(temperature) }}>
              {temperature}K · {tempLabel}
            </span>
          </div>
          <input
            type="range"
            min={2700}
            max={6500}
            step={100}
            value={temperature}
            onChange={(e) => onTemperatureChange?.(Number(e.target.value))}
            className="cri-slider w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #ffb46b 0%, #ffe8b8 40%, #fff4e0 60%, #c9e8ff 100%)`,
            }}
          />
          <div className="flex justify-between text-gray-500 text-xs mt-1">
            <span>2700K</span>
            <span>4000K</span>
            <span>6500K</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
