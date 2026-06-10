'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Thermometer, Lightbulb, Sun, BookOpen, Eye, GitCompare, HelpCircle, Cpu } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'

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

const NAV_HEIGHT = 44

export default function StickyNav() {
  const [activeSection, setActiveSection] = useState('cri')
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollYRef = useRef(0)
  const isMobile = useIsMobile()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      {
        rootMargin: `-${NAV_HEIGHT + 8}px 0px -70% 0px`,
        threshold: 0,
      }
    )

    const elements = sections.map((s) => document.getElementById(s.id)).filter(Boolean)
    elements.forEach((el) => observer.observe(el!))

    return () => {
      elements.forEach((el) => observer.unobserve(el!))
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < 100) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollYRef.current + 10) {
        setIsVisible(false)
      } else if (currentScrollY < lastScrollYRef.current - 8) {
        setIsVisible(true)
      }
      lastScrollYRef.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT - 12
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
          className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a2e]/85 backdrop-blur-xl border-b border-gray-700/30"
          style={{ paddingTop: 'max(env(safe-area-inset-top), 0px)' }}
          aria-label="Навигация по разделам"
        >
          <div className="max-w-5xl mx-auto px-2 sm:px-4 py-1.5">
            <div className="flex items-center justify-center gap-0.5 sm:gap-1 overflow-x-auto scrollbar-hide" role="tablist">
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
                      relative flex items-center gap-1.5 rounded-full text-xs font-medium
                      whitespace-nowrap transition-colors duration-200 flex-shrink-0
                      ${isMobile ? 'px-2 py-1.5' : 'px-3 py-1.5'}
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
                    <Icon className={`${isMobile ? 'h-4 w-4' : 'h-3.5 w-3.5'} relative z-10 flex-shrink-0`} />
                    {!isMobile && <span className="relative z-10">{section.label}</span>}
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
