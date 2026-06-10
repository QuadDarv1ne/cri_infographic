'use client'

import { motion } from 'framer-motion'
import { Palette, Building2, Home, Heart, Baby } from 'lucide-react'

const cards = [
  {
    icon: Palette,
    title: 'Искусство и культура',
    description: 'Художественные галереи, студии, частные коллекции, музеи',
    emoji: '🎨',
  },
  {
    icon: Building2,
    title: 'Офисы',
    description: 'Офисы и административные помещения (при длительном рабочем дне)',
    emoji: '🏢',
  },
  {
    icon: Home,
    title: 'Шоурумы',
    description: 'Шоурумы отделочных и интерьерных материалов',
    emoji: '🏠',
  },
  {
    icon: Heart,
    title: 'Медицина',
    description: 'Родильные палаты',
    emoji: '🏥',
  },
  {
    icon: Baby,
    title: 'Детские комнаты',
    description: 'Детские комнаты и игровые зоны',
    emoji: '🧒',
  },
]

export default function CRICards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.03, y: -4 }}
            className="relative group rounded-xl border border-gray-700/50 bg-[#1e1e32] p-5 cursor-pointer overflow-hidden"
          >
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#e8751a]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{card.emoji}</span>
                <div className="h-9 w-9 rounded-lg bg-[#e8751a]/15 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-[#e8751a]" />
                </div>
              </div>
              <h3 className="text-white font-semibold text-base mb-1.5">{card.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{card.description}</p>
            </div>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#e8751a]/0 to-transparent group-hover:via-[#e8751a]/60 transition-all duration-300" />
          </motion.div>
        )
      })}
    </div>
  )
}
