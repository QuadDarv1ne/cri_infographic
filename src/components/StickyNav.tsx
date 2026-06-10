'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Thermometer, Lightbulb, Sun, BookOpen, Eye, GitCompare, HelpCircle, Cpu } from 'lucide-react'

const sections = [
  { id: 'cri', label: 'CRI', icon: Thermometer },
  { id: 'application', label: 'Применение', icon: Lightbulb },
  { id: 'sources', label: 'Источники', icon: Cpu },
  { id: 'temperature', label: 'Температура', icon: Sun },
  { id: 'ranges', label: 'Диапазоны', icon: BookOpen },
  { id: 'colors', label: 'Цвета', icon: Eye },
  { id: 'comparison', label: 'Сравнение', icon: GitCompare },
  { id: 'quiz', label: 'Квиз', icon: HelpCircle },
]

export default function StickyNav() {
  const [activeSection, setActiveSection] = useState('cri')
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollYRef = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Show/hide based on scroll direction
      if (currentScrollY < 100) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollYRef.current + 5) {
        setIsVisible(false)
      } else if (currentScrollY < lastScrollYRef.current - 5) {
        setIsVisible(true)
      }
      lastScrollYRef.current = currentScrollY

      // Determine active section
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 150) {
            setActiveSection(sections[i].id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a2e]/80 backdrop-blur-xl border-b border-gray-700/30"
          aria-label="Навигация по разделам"
        >
          <div className="max-w-5xl mx-auto px-4 py-2">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide" role="tablist">
              {sections.map((section) => {
                const Icon = section.icon
                const isActive = activeSection === section.id
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollTo(section.id)}
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Перейти к разделу: ${section.label}`}
                    className={`
                      relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                      whitespace-nowrap transition-colors duration-200 flex-shrink-0
                      ${isActive
                        ? 'text-white'
                        : 'text-gray-400 hover:text-gray-200'
                      }
                    `}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeSection"
                        className="absolute inset-0 bg-[#e8751a]/20 border border-[#e8751a]/40 rounded-full"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <Icon className="h-3.5 w-3.5 relative z-10" />
                    <span className="relative z-10">{section.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
