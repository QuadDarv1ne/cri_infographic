'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Link, Check } from 'lucide-react'

interface SectionHeadingProps {
  id: string
  icon: React.ElementType
  title: string
  description: string
}

export default function SectionHeading({ id, icon: Icon, title, description }: SectionHeadingProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const url = `${window.location.origin}${window.location.pathname}#${id}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.history.replaceState(null, '', `#${id}`)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.hash = id
    }
  }, [id])

  return (
    <>
      <div className="flex items-center gap-3 mb-2 group/heading">
        <div className="h-8 w-8 rounded-lg bg-[#e8751a]/15 flex items-center justify-center">
          <Icon className="h-4 w-4 text-[#e8751a]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
        <button
          onClick={handleCopyLink}
          className="opacity-0 group-hover/heading:opacity-100 transition-opacity ml-1 p-1 rounded-md hover:bg-[#e8751a]/10"
          aria-label={`Скопировать ссылку на раздел «${title}»`}
          title="Скопировать ссылку"
        >
          {copied ? (
            <motion.span
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 text-emerald-400 text-xs"
            >
              <Check className="h-3.5 w-3.5" />
            </motion.span>
          ) : (
            <Link className="h-4 w-4 text-gray-500 hover:text-[#e8751a] transition-colors" />
          )}
        </button>
      </div>
      <p className="text-gray-400 text-sm mb-8 ml-11">
        {description}
      </p>
    </>
  )
}
