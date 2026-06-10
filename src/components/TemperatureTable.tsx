'use client'

import { motion } from 'framer-motion'

const temperatureData = [
  {
    range: '2700–3200K',
    label: 'Тёплый белый свет',
    color: '#ffb46b',
    description: 'Уютная атмосфера, подходит для спальни, гостиной, ресторанов',
    gradient: 'from-[#ff9329] to-[#ffb46b]',
    minK: 2700,
    maxK: 3200,
  },
  {
    range: '4000–5000K',
    label: 'Нейтральный белый свет',
    color: '#fff4e0',
    description: 'Естественный свет для офисов, учебных помещений, магазинов',
    gradient: 'from-[#ffe8b8] to-[#fff4e0]',
    minK: 4000,
    maxK: 5000,
  },
  {
    range: '5600–6500K',
    label: 'Холодный белый свет',
    color: '#c9e8ff',
    description: 'Высокая концентрация, для больниц, лабораторий, ювелирных магазинов',
    gradient: 'from-[#e0f0ff] to-[#c9e8ff]',
    minK: 5600,
    maxK: 6500,
  },
]

// Map a temperature to a position on the 2700K-6500K spectrum (0-100%)
const getSpectrumPosition = (k: number) => {
  const min = 2700
  const max = 6500
  return ((k - min) / (max - min)) * 100
}

// Get a gradient color for a given temperature position
const getSpectrumColor = (pos: number) => {
  if (pos < 30) return '#ffb46b'
  if (pos < 60) return '#fff4e0'
  return '#c9e8ff'
}

export default function TemperatureTable() {
  return (
    <div className="w-full space-y-4">
      {/* Desktop table */}
      <div className="hidden sm:block overflow-hidden rounded-xl border border-gray-700/50">
        <table className="w-full">
          <thead>
            <tr className="bg-[#1e1e32]">
              <th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">Образец</th>
              <th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">Диапазон</th>
              <th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">Тип света</th>
              <th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">Применение</th>
              <th className="text-left py-3 px-4 text-gray-400 text-sm font-medium min-w-[140px]">Спектр</th>
            </tr>
          </thead>
          <tbody>
            {temperatureData.map((row, i) => {
              const startPos = getSpectrumPosition(row.minK)
              const endPos = getSpectrumPosition(row.maxK)
              const barWidth = endPos - startPos
              return (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="border-t border-gray-700/30 hover:bg-[#1e1e32]/50 transition-colors group"
                >
                  <td className="py-3 px-4">
                    <div
                      className="w-10 h-10 rounded-lg shadow-inner transition-transform group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${row.color}, ${row.color}dd)`,
                        boxShadow: `0 0 12px ${row.color}40`,
                      }}
                    />
                  </td>
                  <td className="py-3 px-4 text-white font-mono font-semibold text-sm">{row.range}</td>
                  <td className="py-3 px-4">
                    <span className="text-white font-medium text-sm">{row.label}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-sm">{row.description}</td>
                  <td className="py-3 px-4">
                    {/* Temperature spectrum bar */}
                    <div className="relative h-3 rounded-full bg-[#2a2a3e] overflow-hidden">
                      {/* Full spectrum background gradient */}
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          background: 'linear-gradient(to right, #ffb46b, #fff4e0, #c9e8ff)',
                        }}
                      />
                      {/* Active range indicator */}
                      <motion.div
                        initial={{ width: 0, x: 0 }}
                        whileInView={{ width: `${barWidth}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 + i * 0.15, ease: 'easeOut' }}
                        className="absolute top-0 h-full rounded-full"
                        style={{
                          left: `${startPos}%`,
                          backgroundColor: row.color,
                          boxShadow: `0 0 8px ${row.color}60`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-gray-600 text-[9px] mt-0.5">
                      <span>2700K</span>
                      <span>6500K</span>
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {temperatureData.map((row, i) => {
          const startPos = getSpectrumPosition(row.minK)
          const endPos = getSpectrumPosition(row.maxK)
          const barWidth = endPos - startPos
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-xl border border-gray-700/50 bg-[#1e1e32] p-4 hover:border-gray-600/50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-lg flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${row.color}, ${row.color}dd)`,
                    boxShadow: `0 0 12px ${row.color}40`,
                  }}
                />
                <div>
                  <div className="text-white font-mono font-semibold text-sm">{row.range}</div>
                  <div className="text-white font-medium text-sm">{row.label}</div>
                </div>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">{row.description}</p>
              {/* Temperature spectrum bar - full width on mobile */}
              <div className="relative h-2.5 rounded-full bg-[#2a2a3e] overflow-hidden">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: 'linear-gradient(to right, #ffb46b, #fff4e0, #c9e8ff)',
                  }}
                />
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${barWidth}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.15, ease: 'easeOut' }}
                  className="absolute top-0 h-full rounded-full"
                  style={{
                    left: `${startPos}%`,
                    backgroundColor: row.color,
                    boxShadow: `0 0 6px ${row.color}60`,
                  }}
                />
              </div>
              <div className="flex justify-between text-gray-600 text-[9px] mt-0.5">
                <span>2700K</span>
                <span>6500K</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
