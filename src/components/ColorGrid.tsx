'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'

const sampleColors = [
  { name: 'Красный', hex: '#e53e3e' },
  { name: 'Оранжевый', hex: '#ed8936' },
  { name: 'Жёлтый', hex: '#ecc94b' },
  { name: 'Зелёный', hex: '#38a169' },
  { name: 'Голубой', hex: '#3182ce' },
  { name: 'Фиолетовый', hex: '#805ad5' },
  { name: 'Розовый', hex: '#d53f8c' },
  { name: 'Коричневый', hex: '#8b5e3c' },
]

const lightTemperatures = [
  { label: '2700K', temp: 2700, tint: 'rgba(255,180,107,0.35)', name: 'Тёплый' },
  { label: '4000K', temp: 4000, tint: 'rgba(255,244,224,0.25)', name: 'Нейтральный' },
  { label: '6500K', temp: 6500, tint: 'rgba(201,232,255,0.30)', name: 'Холодный' },
]

// Smooth color shift based on temperature (interpolated, not discrete steps)
const getShiftedColor = (hex: string, temp: number): string => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  // Interpolate temperature effect smoothly
  // Reference point: 4000K is "neutral" with no shift
  const neutralTemp = 4000
  const tempDiff = (temp - neutralTemp) / neutralTemp // -0.325 to +0.625

  // Warm shift: +R, -B; Cool shift: -R, +B
  const shiftR = Math.round(-tempDiff * 40)  // warm = positive (more red), cool = negative
  const shiftG = Math.round(-tempDiff * 8)
  const shiftB = Math.round(tempDiff * 50)    // warm = negative (less blue), cool = positive

  const nr = Math.max(0, Math.min(255, r + shiftR))
  const ng = Math.max(0, Math.min(255, g + shiftG))
  const nb = Math.max(0, Math.min(255, b + shiftB))

  return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`
}

// Calculate actual color deviation (Euclidean distance in RGB space)
// Different base colors are affected differently by temperature shifts:
// Colors that depend heavily on one channel are more distorted when that channel is shifted
const getColorDeviation = (hex: string, temp: number): number => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  const neutralTemp = 4000
  const tempDiff = (temp - neutralTemp) / neutralTemp

  // Per-channel base shifts from temperature
  const baseShiftR = -tempDiff * 40
  const baseShiftG = -tempDiff * 8
  const baseShiftB = tempDiff * 50

  // Sensitivity: how much a color is affected depends on its channel dominance
  const maxC = Math.max(r, g, b)
  const minC = Math.min(r, g, b)
  const saturation = maxC > 0 ? (maxC - minC) / maxC : 0

  // Channel dominance weights
  const total = r + g + b || 1
  const rWeight = (r / total) * (1 + saturation * 0.8)
  const gWeight = (g / total) * (1 + saturation * 0.3)
  const bWeight = (b / total) * (1 + saturation * 0.8)

  const shiftR = baseShiftR * rWeight * 1.8
  const shiftG = baseShiftG * gWeight * 1.2
  const shiftB = baseShiftB * bWeight * 1.8

  return Math.round(Math.sqrt(shiftR * shiftR + shiftG * shiftG + shiftB * shiftB))
}

// Prepare chart data with smooth interpolation
const chartTemperatures = [2700, 3000, 3200, 3500, 4000, 4500, 5000, 5500, 6000, 6500]

const lineChartData = chartTemperatures.map((temp) => {
  const entry: Record<string, number | string> = { temperature: `${temp}K` }
  sampleColors.slice(0, 5).forEach((color) => {
    entry[color.name] = getColorDeviation(color.hex, temp)
  })
  return entry
})

// Area chart data - spectrum distribution
const spectrumData = [
  { wavelength: '380', warm: 10, neutral: 30, cool: 80 },
  { wavelength: '420', warm: 15, neutral: 40, cool: 85 },
  { wavelength: '460', warm: 20, neutral: 50, cool: 90 },
  { wavelength: '500', warm: 40, neutral: 60, cool: 70 },
  { wavelength: '540', warm: 60, neutral: 70, cool: 50 },
  { wavelength: '580', warm: 90, neutral: 65, cool: 40 },
  { wavelength: '620', warm: 95, neutral: 55, cool: 30 },
  { wavelength: '660', warm: 85, neutral: 45, cool: 20 },
  { wavelength: '700', warm: 70, neutral: 35, cool: 15 },
  { wavelength: '740', warm: 50, neutral: 25, cool: 10 },
]

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (!active || !payload) return null
  return (
    <div className="bg-[#1e1e32] border border-gray-700/50 rounded-lg p-3 shadow-xl">
      <p className="text-white text-xs font-medium mb-2">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-400">{entry.name}:</span>
          <span className="text-white font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function ColorGrid() {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null)

  return (
    <div className="w-full space-y-6">
      {/* Color comparison grid */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="min-w-[480px]">
          {/* Header row */}
          <div className="grid grid-cols-[100px_repeat(3,1fr)] gap-2 mb-2">
            <div className="text-gray-500 text-xs font-medium px-2 py-1">Цвет / Источник</div>
            {lightTemperatures.map((lt) => (
              <div key={lt.label} className="text-center">
                <div className="text-white font-semibold text-sm">{lt.label}</div>
                <div className="text-gray-400 text-xs">{lt.name}</div>
              </div>
            ))}
          </div>

          {/* Color rows */}
          {sampleColors.map((color, ci) => (
            <motion.div
              key={color.name}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: ci * 0.05 }}
              className="grid grid-cols-[100px_repeat(3,1fr)] gap-2 mb-2"
            >
              <div className="flex items-center gap-2 px-2 py-1">
                <div
                  className="w-5 h-5 rounded-full flex-shrink-0 border border-gray-600"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-gray-300 text-xs">{color.name}</span>
              </div>
              {lightTemperatures.map((lt) => {
                const shifted = getShiftedColor(color.hex, lt.temp)
                const cellKey = `${ci}-${lt.label}`
                const isHovered = hoveredCell === cellKey
                return (
                  <div
                    key={lt.label}
                    className="relative rounded-lg overflow-hidden cursor-pointer"
                    onMouseEnter={() => setHoveredCell(cellKey)}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    <motion.div
                      className="h-12 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: shifted,
                        boxShadow: isHovered ? `0 0 16px ${shifted}80` : 'none',
                      }}
                      animate={{
                        scale: isHovered ? 1.05 : 1,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-[10px] font-mono text-gray-800/60 mix-blend-multiply">
                        {shifted}
                      </span>
                    </motion.div>
                  </div>
                )
              })}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Color shift line chart (recharts) */}
      <div className="rounded-xl border border-gray-700/50 bg-[#1e1e32] p-4 sm:p-5">
        <h4 className="text-white font-semibold text-sm mb-1">Сдвиг цветовых оттенков при разной температуре</h4>
        <p className="text-gray-500 text-xs mb-4">Отклонение цвета от эталонного значения (4000K)</p>
        <div className="h-56 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineChartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
              <XAxis
                dataKey="temperature"
                tick={{ fill: '#8b8ba0', fontSize: 10 }}
                axisLine={{ stroke: '#3a3a4e' }}
              />
              <YAxis
                tick={{ fill: '#8b8ba0', fontSize: 10 }}
                axisLine={{ stroke: '#3a3a4e' }}
                label={{ value: 'Отклонение', angle: -90, position: 'insideLeft', style: { fill: '#8b8ba0', fontSize: 10 } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 10 }}
                formatter={(value: string) => <span style={{ color: '#9ca3af' }}>{value}</span>}
              />
              {sampleColors.slice(0, 5).map((color) => (
                <Line
                  key={color.name}
                  type="monotone"
                  dataKey={color.name}
                  stroke={color.hex}
                  strokeWidth={2}
                  dot={{ r: 3, fill: color.hex }}
                  activeDot={{ r: 5, fill: color.hex, stroke: '#fff', strokeWidth: 2 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Spectrum distribution area chart */}
      <div className="rounded-xl border border-gray-700/50 bg-[#1e1e32] p-4 sm:p-5">
        <h4 className="text-white font-semibold text-sm mb-1">Спектральное распределение при разных температурах</h4>
        <p className="text-gray-500 text-xs mb-4">Интенсивность излучения по длине волны (нм)</p>
        <div className="h-56 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={spectrumData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="warmGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffb46b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ffb46b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="neutralGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fff4e0" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#fff4e0" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="coolGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c9e8ff" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#c9e8ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
              <XAxis
                dataKey="wavelength"
                tick={{ fill: '#8b8ba0', fontSize: 10 }}
                axisLine={{ stroke: '#3a3a4e' }}
                label={{ value: 'Длина волны (нм)', position: 'insideBottom', offset: -2, style: { fill: '#8b8ba0', fontSize: 10 } }}
              />
              <YAxis
                tick={{ fill: '#8b8ba0', fontSize: 10 }}
                axisLine={{ stroke: '#3a3a4e' }}
                label={{ value: 'Интенсивность', angle: -90, position: 'insideLeft', style: { fill: '#8b8ba0', fontSize: 10 } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 10 }}
                formatter={(value: string) => <span style={{ color: '#9ca3af' }}>{value}</span>}
              />
              <Area type="monotone" dataKey="warm" name="2700K Тёплый" stroke="#ffb46b" strokeWidth={2} fill="url(#warmGrad)" />
              <Area type="monotone" dataKey="neutral" name="4000K Нейтральный" stroke="#fff4e0" strokeWidth={2} fill="url(#neutralGrad)" />
              <Area type="monotone" dataKey="cool" name="6500K Холодный" stroke="#c9e8ff" strokeWidth={2} fill="url(#coolGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
