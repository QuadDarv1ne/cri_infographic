'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TemperatureZone {
  minK: number
  maxK: number
  label: string
  color: string
  glowColor: string
  description: string
}

const zones: TemperatureZone[] = [
  {
    minK: 1000,
    maxK: 2700,
    label: 'Пламя свечи',
    color: '#ff9329',
    glowColor: 'rgba(255,147,41,0.4)',
    description: '~1000–2700K — Тёплый свет пламени',
  },
  {
    minK: 2700,
    maxK: 4000,
    label: 'Тёплый белый',
    color: '#ffb46b',
    glowColor: 'rgba(255,180,107,0.3)',
    description: '2700–4000K — Уютный тёплый свет',
  },
  {
    minK: 4000,
    maxK: 5600,
    label: 'Нейтральный белый',
    color: '#fff4e0',
    glowColor: 'rgba(255,244,224,0.3)',
    description: '4000–5600K — Естественный дневной свет',
  },
  {
    minK: 5600,
    maxK: 10000,
    label: 'Холодный белый',
    color: '#c9e8ff',
    glowColor: 'rgba(201,232,255,0.3)',
    description: '5600–10000K — Яркий холодный свет',
  },
  {
    minK: 10000,
    maxK: 20000,
    label: 'Холодное синее небо',
    color: '#8cb4d5',
    glowColor: 'rgba(140,180,213,0.3)',
    description: '10000–20000K — Очень холодный свет',
  },
]

export default function ColorTemperatureDial() {
  const [activeZone, setActiveZone] = useState<number | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const dialRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (dialRef.current && !dialRef.current.contains(e.target as Node)) {
        setActiveZone(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [])

  const cx = 200
  const cy = 200
  const outerR = 160
  const innerR = 110

  const polarToCartesian = (angle: number, radius: number) => {
    const rad = ((angle - 90) * Math.PI) / 180
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    }
  }

  const describeArc = (startAngle: number, endAngle: number, r: number) => {
    const start = polarToCartesian(startAngle, r)
    const end = polarToCartesian(endAngle, r)
    const largeArc = endAngle - startAngle > 180 ? 1 : 0
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`
  }

  const describeSector = (startAngle: number, endAngle: number, scale: number = 1) => {
    const sOuterR = outerR * scale
    const sInnerR = innerR / scale
    const outerStart = polarToCartesian(startAngle, sOuterR)
    const outerEnd = polarToCartesian(endAngle, sOuterR)
    const innerStart = polarToCartesian(endAngle, sInnerR)
    const innerEnd = polarToCartesian(startAngle, sInnerR)
    const largeArc = endAngle - startAngle > 180 ? 1 : 0
    return [
      `M ${outerStart.x} ${outerStart.y}`,
      `A ${sOuterR} ${sOuterR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
      `L ${innerStart.x} ${innerStart.y}`,
      `A ${sInnerR} ${sInnerR} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
      'Z',
    ].join(' ')
  }

  const segmentAngles = [
    { start: 0, end: 55 },
    { start: 55, end: 115 },
    { start: 115, end: 195 },
    { start: 195, end: 270 },
    { start: 270, end: 360 },
  ]

  // Get the color for the center text glow
  const centerGlowColor = activeZone !== null ? zones[activeZone].color : '#e8751a'

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="relative" ref={dialRef}>
        <motion.svg
          viewBox="0 0 400 400"
          className="w-full max-w-[260px] sm:max-w-sm"
          initial={{ rotate: -30, opacity: 0 }}
          animate={isLoaded ? { rotate: 0, opacity: 1 } : { rotate: -30, opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          {/* Background circle */}
          <circle cx={cx} cy={cy} r={outerR + 10} fill="none" stroke="#2a2a3e" strokeWidth={1} />

          {/* Temperature zones */}
          {zones.map((zone, i) => {
            const { start, end } = segmentAngles[i]
            const isActive = activeZone === i
            const scale = isActive ? 1.03 : 1
            return (
              <g
                key={i}
                onMouseEnter={() => setActiveZone(i)}
                onMouseLeave={() => setActiveZone(null)}
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveZone(activeZone === i ? null : i)
                }}
                className="cursor-pointer"
                role="button"
                aria-label={`Зона: ${zone.label}, ${zone.description}`}
              >
                {/* Glow effect */}
                {isActive && (
                  <path
                    d={describeSector(start - 3, end + 3, 1.06)}
                    fill={zone.glowColor}
                    style={{ transition: 'all 0.3s ease' }}
                  />
                )}
                {/* Main sector */}
                <motion.path
                  d={describeSector(start + 2, end - 2, scale)}
                  fill={zone.color}
                  opacity={isActive ? 1 : 0.7}
                  animate={{
                    scale: isActive ? 1.02 : 1,
                  }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  style={{
                    transformOrigin: `${cx}px ${cy}px`,
                    transition: 'opacity 0.3s ease',
                  }}
                />
                {/* Label inside segment */}
                {(() => {
                  const midAngle = (start + end) / 2
                  const labelR = (outerR + innerR) / 2
                  const pos = polarToCartesian(midAngle, labelR)
                  return (
                    <text
                      x={pos.x}
                      y={pos.y - 6}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-gray-900"
                      fontSize={isActive ? 11 : 9.5}
                      fontWeight={isActive ? 700 : 500}
                      style={{ transition: 'all 0.3s ease', pointerEvents: 'none' }}
                    >
                      {zone.label}
                    </text>
                  )
                })()}
                {/* Temperature value inside segment */}
                {(() => {
                  const midAngle = (start + end) / 2
                  const labelR = (outerR + innerR) / 2
                  const pos = polarToCartesian(midAngle, labelR)
                  const tempText = zone.minK >= 10000 ? `${zone.minK / 1000}K` : `${zone.minK}K`
                  return (
                    <text
                      x={pos.x}
                      y={pos.y + 8}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-gray-800/70"
                      fontSize={isActive ? 9 : 8}
                      fontWeight={400}
                      style={{ transition: 'all 0.3s ease', pointerEvents: 'none' }}
                    >
                      {tempText}
                    </text>
                  )
                })()}
              </g>
            )
          })}

          {/* Inner decorative circle */}
          <circle cx={cx} cy={cy} r={innerR - 15} fill="#1a1a2e" stroke="#2a2a3e" strokeWidth={1} />

          {/* Center text with glow */}
          <motion.text
            x={cx} y={cy - 15}
            textAnchor="middle"
            fontSize={22}
            fontWeight={700}
            animate={{
              fill: centerGlowColor,
              filter: activeZone !== null ? `drop-shadow(0 0 8px ${centerGlowColor}60)` : 'none',
            }}
            transition={{ duration: 0.3 }}
          >
            Цветовая
          </motion.text>
          <motion.text
            x={cx} y={cy + 10}
            textAnchor="middle"
            fontSize={22}
            fontWeight={700}
            animate={{
              fill: centerGlowColor,
              filter: activeZone !== null ? `drop-shadow(0 0 8px ${centerGlowColor}60)` : 'none',
            }}
            transition={{ duration: 0.3 }}
          >
            температура
          </motion.text>
          <text x={cx} y={cy + 35} textAnchor="middle" className="fill-gray-400" fontSize={14}>
            Кельвин (К)
          </text>

          {/* Temperature labels around the outside */}
          {zones.map((zone, i) => {
            const { start, end } = segmentAngles[i]
            const midAngle = (start + end) / 2
            const pos = polarToCartesian(midAngle, outerR + 22)
            return (
              <text
                key={i}
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-gray-500"
                fontSize={10}
                fontWeight={400}
                style={{ pointerEvents: 'none' }}
              >
                {zone.minK >= 10000 ? `${zone.minK / 1000}K` : `${zone.minK}K`}
              </text>
            )
          })}
        </motion.svg>

        {/* Tooltip popup */}
        <AnimatePresence>
          {activeZone !== null && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 sm:bottom-auto sm:top-full sm:mt-3 pointer-events-none z-20"
            >
              <div className="px-4 py-3 rounded-xl bg-[#1e1e32] border border-gray-700/50 shadow-xl text-center min-w-[180px]">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: zones[activeZone].color,
                      boxShadow: `0 0 8px ${zones[activeZone].color}60`,
                    }}
                  />
                  <span className="text-white font-semibold text-sm">{zones[activeZone].label}</span>
                </div>
                <p className="text-gray-400 text-xs">{zones[activeZone].description}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active zone description (fallback for mobile where tooltip may overlap) */}
      <div
        className="text-center transition-all duration-300 min-h-[60px] sm:hidden"
        style={{
          opacity: activeZone !== null ? 1 : 0.6,
        }}
      >
        {activeZone !== null ? (
          <>
            <div
              className="inline-block w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: zones[activeZone].color }}
            />
            <span className="text-white font-semibold">{zones[activeZone].label}</span>
            <p className="text-gray-400 text-sm mt-1">{zones[activeZone].description}</p>
          </>
        ) : (
          <p className="text-gray-400 text-sm">Нажмите на сегмент для подробностей</p>
        )}
      </div>
    </div>
  )
}
