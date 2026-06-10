'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, RotateCcw, Trophy, Zap } from 'lucide-react'

interface Question {
  question: string
  options: string[]
  correct: number
}

const questions: Question[] = [
  {
    question: 'Что означает CRI?',
    options: ['Яркость света', 'Индекс цветопередачи', 'Цветовая температура', 'Энергопотребление'],
    correct: 1,
  },
  {
    question: 'Какой CRI считается отличным?',
    options: ['40–60', '60–80', '80–100', '20–40'],
    correct: 2,
  },
  {
    question: 'В каких единицах измеряется цветовая температура?',
    options: ['Люмены', 'Ватты', 'Кельвины', 'Люксы'],
    correct: 2,
  },
  {
    question: 'Какая цветовая температура подходит для спальни?',
    options: ['5600–6500K', '2700–3200K', '4000–5000K', '10000K'],
    correct: 1,
  },
  {
    question: 'Низкий CRI может вызывать:',
    options: ['Улучшение зрения', 'Нарушения сна и усталость', 'Повышение концентрации', 'Рост энергии'],
    correct: 1,
  },
]

export default function CRIQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)

  const handleAnswer = useCallback((index: number) => {
    if (isAnswered) return
    setSelectedAnswer(index)
    setIsAnswered(true)

    if (index === questions[currentQuestion].correct) {
      setScore((s) => s + 1)
    }
  }, [currentQuestion, isAnswered])

  const handleNext = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((q) => q + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else {
      setIsFinished(true)
    }
  }, [currentQuestion])

  const handleRestart = useCallback(() => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setIsFinished(false)
    setIsAnswered(false)
  }, [])

  const getScoreMessage = () => {
    const pct = score / questions.length
    if (pct === 1) return { text: 'Великолепно! Вы настоящий эксперт по освещению!', icon: Trophy, color: '#e8751a' }
    if (pct >= 0.8) return { text: 'Отлично! Вы хорошо разбираетесь в CRI и цветовой температуре!', icon: Zap, color: '#f59e0b' }
    if (pct >= 0.6) return { text: 'Неплохо! Есть куда расти, но базовые знания у вас есть.', icon: Zap, color: '#eab308' }
    if (pct >= 0.4) return { text: 'Можно лучше! Изучите разделы выше, чтобы узнать больше о CRI.', icon: Zap, color: '#f59e0b' }
    return { text: 'Стоит подтянуть знания! Перечитайте инфографику выше — там много полезного.', icon: Zap, color: '#ef4444' }
  }

  if (isFinished) {
    const msg = getScoreMessage()
    const MsgIcon = msg.icon
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 p-6 rounded-xl bg-[#1e1e32]/80 border border-gray-700/30"
      >
        <div className="h-16 w-16 rounded-full flex items-center justify-center" style={{ backgroundColor: `${msg.color}20` }}>
          <MsgIcon className="h-8 w-8" style={{ color: msg.color }} />
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-white mb-2">
            {score} / {questions.length}
          </div>
          <p className="text-gray-300 text-sm">{msg.text}</p>
        </div>
        {/* Score bar */}
        <div className="w-full max-w-xs">
          <div className="h-3 rounded-full bg-[#2a2a3e] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(score / questions.length) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ backgroundColor: msg.color }}
            />
          </div>
          <div className="flex justify-between text-gray-500 text-xs mt-1">
            <span>0</span>
            <span>{questions.length}</span>
          </div>
        </div>
        <button
          onClick={handleRestart}
          className="flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-full bg-[#e8751a] hover:bg-[#d06a15] text-white font-medium text-sm transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Пройти ещё раз
        </button>
      </motion.div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1">
          <div className="h-1.5 rounded-full bg-[#2a2a3e] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-[#e8751a]"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + (isAnswered ? 1 : 0)) / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
        <span className="text-gray-400 text-xs font-medium flex-shrink-0">
          {currentQuestion + 1} / {questions.length}
        </span>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-white font-semibold text-lg mb-5">{question.question}</h3>

          <div className="space-y-2.5">
            {question.options.map((option, index) => {
              const isCorrect = index === question.correct
              const isSelected = index === selectedAnswer
              let bgClass = 'bg-[#252540] border-gray-700/50 hover:border-gray-600'
              let textClass = 'text-gray-300'

              if (isAnswered) {
                if (isCorrect) {
                  bgClass = 'bg-emerald-900/30 border-emerald-500/50'
                  textClass = 'text-emerald-300'
                } else if (isSelected && !isCorrect) {
                  bgClass = 'bg-red-900/30 border-red-500/50'
                  textClass = 'text-red-300'
                } else {
                  bgClass = 'bg-[#252540]/50 border-gray-700/30'
                  textClass = 'text-gray-500'
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={isAnswered}
                  className={`
                    w-full flex items-center gap-3 p-3.5 min-h-[44px] rounded-xl border text-left transition-all duration-200
                    ${bgClass} ${!isAnswered ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default'}
                  `}
                >
                  <span className={`h-8 w-8 min-w-[32px] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    isAnswered && isCorrect ? 'bg-emerald-500/30 text-emerald-300' :
                    isAnswered && isSelected && !isCorrect ? 'bg-red-500/30 text-red-300' :
                    'bg-[#1a1a2e] text-gray-400'
                  }`}>
                    {isAnswered && isCorrect ? <CheckCircle className="h-4 w-4" /> :
                     isAnswered && isSelected && !isCorrect ? <XCircle className="h-4 w-4" /> :
                     String.fromCharCode(97 + index)}
                  </span>
                  <span className={`text-sm ${textClass}`}>{option}</span>
                </button>
              )
            })}
          </div>

          {/* Next button */}
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 flex justify-end"
            >
              <button
                onClick={handleNext}
                className="px-5 py-3 min-h-[44px] rounded-full bg-[#e8751a] hover:bg-[#d06a15] text-white font-medium text-sm transition-colors"
              >
                {currentQuestion < questions.length - 1 ? 'Следующий вопрос' : 'Показать результат'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
