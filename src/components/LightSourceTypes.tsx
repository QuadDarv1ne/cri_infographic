'use client'

import { motion } from 'framer-motion'
import { Lightbulb, Zap, Battery, Cpu, Sun } from 'lucide-react'

interface LightSource {
  name: string
  cri: string
  criValue: number
  temperature: string
  tempColor: string
  icon: React.ElementType
  description: string
  pros: string[]
  cons: string[]
}

const lightSources: LightSource[] = [
  {
    name: 'Лампа накаливания',
    cri: '~100',
    criValue: 100,
    temperature: '2700K',
    tempColor: '#ffb46b',
    icon: Lightbulb,
    description: 'Классическая лампа с нитью накаливания, обеспечивает идеальную цветопередачу, но низкую энергоэффективность.',
    pros: ['CRI 100', 'Тёплый свет'],
    cons: ['Низкий КПД', 'Короткий срок'],
  },
  {
    name: 'Галогенная лампа',
    cri: '~95',
    criValue: 95,
    temperature: '3000K',
    tempColor: '#ffc078',
    icon: Zap,
    description: 'Улучшенная версия лампы накаливания с галогенным циклом. Яркий свет с отличной цветопередачей.',
    pros: ['Высокий CRI', 'Яркий свет'],
    cons: ['Нагревается', 'Высокое потребление'],
  },
  {
    name: 'Люминесцентная лампа',
    cri: '~70',
    criValue: 70,
    temperature: '4000K',
    tempColor: '#fff4e0',
    icon: Battery,
    description: 'Энергоэффективная лампа, но с заметным искажением цветов. Подходит для технических помещений.',
    pros: ['Экономичная', 'Долгий срок'],
    cons: ['Низкий CRI', 'Мерцание'],
  },
  {
    name: 'LED (светодиодная)',
    cri: '~80–95',
    criValue: 88,
    temperature: '2700–6500K',
    tempColor: '#ffe8b8',
    icon: Cpu,
    description: 'Самый универсальный и энергоэффективный источник. CRI зависит от качества — от бюджетного до премиума.',
    pros: ['Экономичная', 'Универсальная'],
    cons: ['Качество зависит от производителя', 'Мерцание у дешёвых'],
  },
  {
    name: 'Металлогалогенная',
    cri: '~85',
    criValue: 85,
    temperature: '4200K',
    tempColor: '#fff0d0',
    icon: Sun,
    description: 'Мощный источник света для больших пространств. Хорошая цветопередача при высокой яркости.',
    pros: ['Мощный свет', 'Хороший CRI'],
    cons: ['Дорого', 'Время разогрева'],
  },
]

function getTempColor(temp: string): string {
  if (temp.includes('2700')) return '#ffb46b'
  if (temp.includes('3000')) return '#ffc078'
  if (temp.includes('4200')) return '#fff0d0'
  if (temp.includes('4000')) return '#fff4e0'
  if (temp.includes('6500')) return '#c9e8ff'
  return '#ffe8b8'
}

export default function LightSourceTypes() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {lightSources.map((source, i) => {
        const Icon = source.icon
        return (
          <motion.div
            key={source.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group rounded-xl border border-gray-700/50 bg-[#1e1e32]/80 p-5 transition-shadow hover:shadow-lg hover:shadow-[#e8751a]/5"
          >
            {/* Icon + Name */}
            <div className="flex items-start gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-[#e8751a]/15 flex items-center justify-center flex-shrink-0 group-hover:bg-[#e8751a]/25 transition-colors">
                <Icon className="h-5 w-5 text-[#e8751a]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-white font-semibold text-sm leading-tight">{source.name}</h4>
              </div>
            </div>

            {/* CRI bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-400 text-xs">CRI</span>
                <span className="text-[#e8751a] font-bold text-sm">{source.cri}</span>
              </div>
              <div className="h-2 rounded-full bg-[#2a2a3e] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${source.criValue}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                  className="h-full rounded-full"
                  style={{
                    background: source.criValue >= 90
                      ? '#e8751a'
                      : source.criValue >= 80
                        ? '#f59e0b'
                        : '#eab308',
                  }}
                />
              </div>
            </div>

            {/* Temperature */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: getTempColor(source.temperature),
                  boxShadow: `0 0 6px ${getTempColor(source.temperature)}60`,
                }}
              />
              <span className="text-gray-300 text-xs font-medium">{source.temperature}</span>
            </div>

            {/* Description */}
            <p className="text-gray-400 text-xs leading-relaxed mb-3">{source.description}</p>

            {/* Pros / Cons */}
            <div className="flex flex-wrap gap-1.5">
              {source.pros.map((pro) => (
                <span
                  key={pro}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-900/30 text-emerald-400 border border-emerald-800/30"
                >
                  {pro}
                </span>
              ))}
              {source.cons.map((con) => (
                <span
                  key={con}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-900/20 text-red-400/80 border border-red-800/20"
                >
                  {con}
                </span>
              ))}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
