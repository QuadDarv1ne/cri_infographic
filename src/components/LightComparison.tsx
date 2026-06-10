'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lightbulb } from 'lucide-react'
import { adjustColor, getTempLabel, getTempColor } from '@/lib/color-utils'

interface LightSource {
  cri: number
  temperature: number
}

const sampleColors = [
  { name: 'Красный', hex: '#e53e3e' },
  { name: 'Зелёный', hex: '#38a169' },
  { name: 'Тон кожи', hex: '#e8b89d' },
  { name: 'Синий', hex: '#3182ce' },
]

function LightSourcePanel({
  source,
  index,
  onChange,
}: {
  source: LightSource
  index: number
  onChange: (field: keyof LightSource, value: number) => void
}) {
  const label = index === 0 ? 'Источник А' : 'Источник Б'

  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl bg-[#1e1e32]/80 border border-gray-700/30">
      {/* Lamp icon + label */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-[#e8751a]/15 flex items-center justify-center">
          <Lightbulb className="h-4 w-4 text-[#e8751a]" />
        </div>
        <span className="text-white font-semibold text-sm">{label}</span>
      </div>

      {/* CRI control */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-gray-400 text-xs">CRI</label>
          <span className="text-[#e8751a] font-bold text-sm">{source.cri}</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={source.cri}
          onChange={(e) => onChange('cri', Number(e.target.value))}
          className="cri-slider w-full h-1.5 rounded-full appearance-none cursor-pointer"
          suppressHydrationWarning
          style={{
            background: `linear-gradient(to right, #ef4444 0%, #eab308 40%, #f59e0b 60%, #e8751a 80%, #e8751a 100%)`,
          }}
        />
      </div>

      {/* Temperature control */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-gray-400 text-xs">Температура</label>
          <span className="font-bold text-xs" style={{ color: getTempColor(source.temperature) }}>
            {source.temperature}K · {getTempLabel(source.temperature)}
          </span>
        </div>
        <input
          type="range"
          min={2700}
          max={6500}
          step={100}
          value={source.temperature}
          onChange={(e) => onChange('temperature', Number(e.target.value))}
          className="cri-slider w-full h-1.5 rounded-full appearance-none cursor-pointer"
          suppressHydrationWarning
          style={{
            background: `linear-gradient(to right, #ffb46b 0%, #ffe8b8 40%, #fff4e0 60%, #c9e8ff 100%)`,
          }}
        />
      </div>

      {/* Color samples */}
      <div className="grid grid-cols-2 gap-2 mt-1">
        {sampleColors.map((color) => {
          const shifted = adjustColor(color.hex, source.cri, source.temperature)
          return (
            <div
              key={color.name}
              className="rounded-lg p-2 flex flex-col items-center gap-1 border border-gray-700/30"
              style={{ backgroundColor: '#252540' }}
            >
              <div
                className="w-10 h-10 rounded-lg transition-colors duration-300"
                style={{ backgroundColor: shifted, boxShadow: `0 0 8px ${shifted}40` }}
              />
              <span className="text-gray-400 text-[10px]">{color.name}</span>
              <span className="text-gray-500 text-[9px] font-mono">{shifted}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function LightComparison() {
  const [sourceA, setSourceA] = useState<LightSource>({ cri: 90, temperature: 4000 })
  const [sourceB, setSourceB] = useState<LightSource>({ cri: 50, temperature: 6500 })
  const [dividerPos, setDividerPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  // Use window-level events for drag so we don't lose it when mouse moves fast
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const pct = Math.max(20, Math.min(80, (x / rect.width) * 100))
      setDividerPos(pct)
    }

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = e.touches[0].clientX - rect.left
      const pct = Math.max(20, Math.min(80, (x / rect.width) * 100))
      setDividerPos(pct)
    }

    const handleGlobalEnd = () => {
      isDragging.current = false
    }

    window.addEventListener('mousemove', handleGlobalMouseMove)
    window.addEventListener('mouseup', handleGlobalEnd)
    window.addEventListener('touchmove', handleGlobalTouchMove)
    window.addEventListener('touchend', handleGlobalEnd)

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove)
      window.removeEventListener('mouseup', handleGlobalEnd)
      window.removeEventListener('touchmove', handleGlobalTouchMove)
      window.removeEventListener('touchend', handleGlobalEnd)
    }
  }, [])

  const handleDividerDown = useCallback(() => {
    isDragging.current = true
  }, [])

  const handleChangeA = useCallback((field: keyof LightSource, value: number) => {
    setSourceA((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleChangeB = useCallback((field: keyof LightSource, value: number) => {
    setSourceB((prev) => ({ ...prev, [field]: value }))
  }, [])

  const comparisonBgColor = '#1e1e32'

  return (
    <div className="w-full space-y-6">
      {/* Controls - stack vertically on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <LightSourcePanel source={sourceA} index={0} onChange={handleChangeA} />
        <LightSourcePanel source={sourceB} index={1} onChange={handleChangeB} />
      </div>

      {/* Visual comparison - split screen (hidden on very small screens, shown from sm) */}
      <div className="rounded-xl border border-gray-700/50 overflow-hidden hidden sm:block">
        <div
          ref={containerRef}
          className="relative flex h-40 sm:h-48 select-none"
        >
          {/* Left side - Source A */}
          <div
            className="relative flex items-center justify-center gap-4 overflow-hidden transition-[width] duration-75"
            style={{
              width: `${dividerPos}%`,
              backgroundColor: comparisonBgColor,
            }}
          >
            {/* Ambient glow */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at 50% 30%, ${sourceA.temperature <= 3200 ? 'rgba(255,180,107,0.15)' : sourceA.temperature <= 5000 ? 'rgba(255,244,224,0.1)' : 'rgba(201,232,255,0.12)'}, transparent 70%)`,
              }}
            />
            <div className="flex gap-3 relative z-10">
              {sampleColors.map((color) => (
                <div
                  key={color.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg transition-colors duration-300"
                  style={{
                    backgroundColor: adjustColor(color.hex, sourceA.cri, sourceA.temperature),
                    boxShadow: `0 0 10px ${adjustColor(color.hex, sourceA.cri, sourceA.temperature)}30`,
                  }}
                />
              ))}
            </div>
            <div className="absolute bottom-2 left-3 text-xs text-gray-400">
              А · CRI {sourceA.cri} · {sourceA.temperature}K
            </div>
          </div>

          {/* Divider */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-[#e8751a] cursor-col-resize z-10 flex items-center justify-center"
            style={{ left: `${dividerPos}%`, transform: 'translateX(-50%)' }}
            onMouseDown={handleDividerDown}
            onTouchStart={handleDividerDown}
          >
            <div className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#e8751a] border-2 border-white flex items-center justify-center shadow-lg">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4 2L2 6L4 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 2L10 6L8 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Right side - Source B */}
          <div
            className="relative flex items-center justify-center gap-4 overflow-hidden transition-[width] duration-75"
            style={{
              width: `${100 - dividerPos}%`,
              backgroundColor: comparisonBgColor,
            }}
          >
            {/* Ambient glow */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at 50% 30%, ${sourceB.temperature <= 3200 ? 'rgba(255,180,107,0.15)' : sourceB.temperature <= 5000 ? 'rgba(255,244,224,0.1)' : 'rgba(201,232,255,0.12)'}, transparent 70%)`,
              }}
            />
            <div className="flex gap-3 relative z-10">
              {sampleColors.map((color) => (
                <div
                  key={color.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg transition-colors duration-300"
                  style={{
                    backgroundColor: adjustColor(color.hex, sourceB.cri, sourceB.temperature),
                    boxShadow: `0 0 10px ${adjustColor(color.hex, sourceB.cri, sourceB.temperature)}30`,
                  }}
                />
              ))}
            </div>
            <div className="absolute bottom-2 right-3 text-xs text-gray-400">
              Б · CRI {sourceB.cri} · {sourceB.temperature}K
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: stacked comparison view */}
      <div className="sm:hidden space-y-3">
        {[
          { source: sourceA, label: 'А', labelFull: 'Источник А' },
          { source: sourceB, label: 'Б', labelFull: 'Источник Б' },
        ].map(({ source, label, labelFull }) => (
          <div
            key={label}
            className="rounded-xl border border-gray-700/50 overflow-hidden p-4"
            style={{ backgroundColor: comparisonBgColor }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="h-6 w-6 rounded bg-[#e8751a]/15 flex items-center justify-center">
                <span className="text-[#e8751a] text-xs font-bold">{label}</span>
              </div>
              <span className="text-white text-xs font-medium">{labelFull} · CRI {source.cri} · {source.temperature}K</span>
            </div>
            <div className="flex gap-3 justify-center">
              {sampleColors.map((color) => {
                const shifted = adjustColor(color.hex, source.cri, source.temperature)
                return (
                  <div key={color.name} className="flex flex-col items-center gap-1">
                    <div
                      className="w-10 h-10 rounded-lg transition-colors duration-300"
                      style={{
                        backgroundColor: shifted,
                        boxShadow: `0 0 8px ${shifted}40`,
                      }}
                    />
                    <span className="text-gray-500 text-[9px]">{color.name}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Difference summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-4 rounded-xl bg-[#1e1e32]/60 border border-gray-700/30"
      >
        <h4 className="text-white font-semibold text-sm mb-2">Разница в цветопередаче</h4>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-gray-400">Разница CRI: </span>
            <span className="text-white font-bold">{Math.abs(sourceA.cri - sourceB.cri)} пунктов</span>
          </div>
          <div>
            <span className="text-gray-400">Разница температуры: </span>
            <span className="text-white font-bold">{Math.abs(sourceA.temperature - sourceB.temperature)}K</span>
          </div>
        </div>
        {Math.abs(sourceA.cri - sourceB.cri) >= 30 && (
          <p className="text-[#e8751a] text-xs mt-2">
            Значительная разница в CRI! Цвета под источником с низким CRI будут выглядеть тусклыми и искажёнными.
          </p>
        )}
      </motion.div>
    </div>
  )
}
