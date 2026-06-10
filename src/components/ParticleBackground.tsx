'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  hue: number
  hueSpeed: number
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>(0)
  const dimensionsRef = useRef({ width: 0, height: 0 })
  const isVisibleRef = useRef(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      canvas.style.display = 'none'
      return
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = window.innerWidth
      const height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.scale(dpr, dpr)
      dimensionsRef.current = { width, height }
    }
    resize()
    window.addEventListener('resize', resize)

    const handleVisibility = () => {
      isVisibleRef.current = document.visibilityState === 'visible'
      if (isVisibleRef.current && !animationRef.current) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    const count = Math.min(25, Math.floor(window.innerWidth / 60))
    const { width, height } = dimensionsRef.current
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1.5,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.25 + 0.08,
      hue: Math.random() * 40 + 20,
      hueSpeed: (Math.random() - 0.5) * 0.15,
    }))

    const animate = () => {
      if (!isVisibleRef.current) {
        animationRef.current = 0
        return
      }

      const { width: w, height: h } = dimensionsRef.current
      ctx.clearRect(0, 0, w, h)

      particlesRef.current.forEach((p) => {
        p.x += p.speedX
        p.y += p.speedY
        p.hue += p.hueSpeed

        if (p.x < -20) p.x = w + 20
        if (p.x > w + 20) p.x = -20
        if (p.y < -20) p.y = h + 20
        if (p.y > h + 20) p.y = -20

        if (p.hue > 55) p.hueSpeed = -Math.abs(p.hueSpeed)
        if (p.hue < 18) p.hueSpeed = Math.abs(p.hueSpeed)

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6)
        gradient.addColorStop(0, `hsla(${p.hue}, 75%, 65%, ${p.opacity})`)
        gradient.addColorStop(0.5, `hsla(${p.hue}, 55%, 50%, ${p.opacity * 0.3})`)
        gradient.addColorStop(1, `hsla(${p.hue}, 35%, 40%, 0)`)

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', handleVisibility)
      cancelAnimationFrame(animationRef.current)
      animationRef.current = 0
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.5 }}
      aria-hidden="true"
    />
  )
}
