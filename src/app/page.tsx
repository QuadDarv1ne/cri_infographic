'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Eye, Moon, Sun, Lightbulb, Thermometer, BookOpen, GitCompare, HelpCircle, ChevronDown, Cpu } from 'lucide-react'
import CRIGauge from '@/components/CRIGauge'
import CRICards from '@/components/CRICards'
import ColorTemperatureDial from '@/components/ColorTemperatureDial'
import TemperatureTable from '@/components/TemperatureTable'
import ColorGrid from '@/components/ColorGrid'
import RoomPreview from '@/components/RoomPreview'
import LightComparison from '@/components/LightComparison'
import CRIQuiz from '@/components/CRIQuiz'
import StickyNav from '@/components/StickyNav'
import ParticleBackground from '@/components/ParticleBackground'
import ScrollToTop from '@/components/ScrollToTop'
import LightSourceTypes from '@/components/LightSourceTypes'
import SectionHeading from '@/components/SectionHeading'

const keyPoints = [
  {
    icon: Eye,
    text: 'Высокий CRI позволяет различать множество оттенков цветов',
  },
  {
    icon: Moon,
    text: 'Низкий CRI света может вызывать нарушения сна и усталость',
  },
  {
    icon: Sun,
    text: 'Чем выше CRI, тем более комфортное и качественное освещение',
  },
]

// Scroll Progress Bar component
function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
    setProgress(scrollPercent)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-transparent">
      <motion.div
        className="h-full bg-[#e8751a]"
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.1, ease: 'linear' }}
      />
    </div>
  )
}

// Section Divider with gradient dots
function SectionDivider() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2">
      <div className="flex items-center justify-center gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            className="w-1 h-1 rounded-full bg-[#e8751a]"
            style={{ opacity: 0.2 + i * 0.15 }}
          />
        ))}
        <div className="mx-2 h-px flex-1 max-w-[120px] bg-gradient-to-r from-[#e8751a]/30 to-transparent" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#e8751a]/40" />
        <div className="mx-2 h-px flex-1 max-w-[120px] bg-gradient-to-l from-[#e8751a]/30 to-transparent" />
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={`r-${i}`}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: (4 - i) * 0.1, duration: 0.3 }}
            className="w-1 h-1 rounded-full bg-[#e8751a]"
            style={{ opacity: 0.2 + (4 - i) * 0.15 }}
          />
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const [criValue, setCriValue] = useState(85)
  const [temperatureValue, setTemperatureValue] = useState(4000)

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white">
      {/* Fixed elements */}
      <ScrollProgress />
      <StickyNav />
      <ParticleBackground />
      <ScrollToTop />

      {/* Hero / Header Section */}
      <header id="hero" className="relative overflow-hidden pt-14">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#e8751a]/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#e8751a]/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            {/* CRI Badge with animated gradient border */}
            <div className="relative inline-flex mb-6">
              {/* Animated gradient border glow */}
              <motion.div
                className="absolute -inset-1 rounded-full"
                animate={{
                  background: [
                    'linear-gradient(0deg, #e8751a, #ffb46b, #e8751a)',
                    'linear-gradient(90deg, #e8751a, #ffb46b, #e8751a)',
                    'linear-gradient(180deg, #e8751a, #ffb46b, #e8751a)',
                    'linear-gradient(270deg, #e8751a, #ffb46b, #e8751a)',
                    'linear-gradient(360deg, #e8751a, #ffb46b, #e8751a)',
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                style={{ filter: 'blur(4px)', opacity: 0.6 }}
              />
              {/* Pulsing glow behind badge */}
              <motion.div
                className="absolute -inset-4 rounded-full bg-[#e8751a]/20"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1a1a2e] border border-[#e8751a]/30">
                <Lightbulb className="h-4 w-4 text-[#e8751a]" />
                <span className="text-[#e8751a] text-sm font-medium">Индекс цветопередачи</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              <span className="text-white">CRI</span>
              <span className="text-[#e8751a]"> — </span>
              <span className="bg-gradient-to-r from-[#ffb46b] to-[#e8751a] bg-clip-text text-transparent">
                Индекс цветопередачи
              </span>
            </h1>

            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
              CRI – относительный параметр, показывающий, насколько натурально выглядят окружающие нас цвета
              в свете искусственного источника.
            </p>

            {/* Key Points with floating animation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {keyPoints.map((point, i) => {
                const Icon = point.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
                    className="flex flex-col items-center gap-3 p-4 rounded-xl bg-[#1e1e32]/60 border border-gray-700/30"
                  >
                    {/* Floating animation */}
                    <motion.div
                      animate={{
                        y: [0, -4, 0],
                      }}
                      transition={{
                        duration: 3 + i * 0.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.3,
                      }}
                      className="flex flex-col items-center gap-3"
                    >
                      <div className="h-10 w-10 rounded-lg bg-[#e8751a]/15 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-[#e8751a]" />
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{point.text}</p>
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Scroll down indicator */}
          <motion.div
            className="flex justify-center mt-10"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-gray-500 text-xs">Подробнее</span>
              <ChevronDown className="h-5 w-5 text-[#e8751a]/60" />
            </div>
          </motion.div>
        </div>

        {/* Section divider */}
        <SectionDivider />
      </header>

      {/* Section 2: CRI Gauge + Slider + Room Preview */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            id="cri"
            icon={Thermometer}
            title="Шкала CRI"
            description="Используйте ползунки, чтобы увидеть, как CRI и цветовая температура влияют на восприятие"
          />
          <CRIGauge
            value={criValue}
            onValueChange={setCriValue}
            temperature={temperatureValue}
            onTemperatureChange={setTemperatureValue}
          />

          {/* Room Preview */}
          <div className="mt-10">
            <RoomPreview cri={criValue} temperature={temperatureValue} />
          </div>
        </motion.div>
      </section>

      <SectionDivider />

      {/* Section 3: Where High CRI Matters */}
      <section id="application" className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            id="application"
            icon={Lightbulb}
            title="Где важен высокий CRI"
            description="Помещения и ситуации, где качество цветопередачи имеет критическое значение"
          />
          <CRICards />
        </motion.div>
      </section>

      <SectionDivider />

      {/* Section: Light Source Types */}
      <section id="sources" className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            id="sources"
            icon={Cpu}
            title="Типы источников света"
            description="Сравнение основных типов ламп по CRI и цветовой температуре"
          />
          <LightSourceTypes />
        </motion.div>
      </section>

      <SectionDivider />

      {/* Section 4: Color Temperature */}
      <section id="temperature" className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            id="temperature"
            icon={Sun}
            title="Цветовая температура"
            description="Цветовая температура измеряется в кельвинах (К) — показатель цветового тона белого света"
          />

          <ColorTemperatureDial />

          {/* Note */}
          <div className="mt-8 p-4 rounded-xl bg-[#1e1e32]/60 border border-gray-700/30">
            <p className="text-gray-400 text-sm leading-relaxed">
              <span className="text-[#e8751a] font-medium">Примечание:</span>{' '}
              Изменения цветовой температуры — результат изменения количества красного в сине-оранжевом спектре
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Справочно: ГОСТ 54350-2015
            </p>
          </div>
        </motion.div>
      </section>

      <SectionDivider />

      {/* Section 5: Temperature Table */}
      <section id="ranges" className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            id="ranges"
            icon={BookOpen}
            title="Диапазоны цветовой температуры"
            description="Основные диапазоны и их применение"
          />
          <TemperatureTable />
        </motion.div>
      </section>

      <SectionDivider />

      {/* Section 6: Color Grid (enhanced) */}
      <section id="colors" className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            id="colors"
            icon={Eye}
            title="Восприятие цветов при разном освещении"
            description="Как цветовая температура источника света влияет на восприятие цветовых оттенков"
          />
          <ColorGrid />
        </motion.div>
      </section>

      <SectionDivider />

      {/* Section 7: Light Comparison */}
      <section id="comparison" className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            id="comparison"
            icon={GitCompare}
            title="Сравнение источников света"
            description="Настройте параметры двух источников и сравните цветопередачу"
          />
          <LightComparison />
        </motion.div>
      </section>

      <SectionDivider />

      {/* Section 8: Quiz */}
      <section id="quiz" className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            id="quiz"
            icon={HelpCircle}
            title="Проверьте свои знания"
            description="Ответьте на 5 вопросов о CRI и цветовой температуре"
          />
          <CRIQuiz />
        </motion.div>
      </section>

      {/* Footer with fade-in */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mt-auto border-t border-gray-700/30 bg-[#141425]"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center">
          <p className="text-gray-600 text-xs">
            CRI и Цветовая температура — Информационная инфографика &nbsp;&nbsp;&nbsp; © Дуплей Максим Игоревич, 2026 &nbsp;&nbsp;&nbsp; Источник: ГОСТ 54350-2015
          </p>
        </div>
      </motion.footer>
    </div>
  )
}
