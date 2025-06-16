"use client"

import { useEffect, useRef } from "react"

interface ConfettiProps {
  active: boolean
  onComplete?: () => void
}

export function Confetti({ active, onComplete }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!active) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const confetti: Array<{
      x: number
      y: number
      vx: number
      vy: number
      color: string
      size: number
      rotation: number
      rotationSpeed: number
    }> = []

    const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#f9ca24", "#f0932b", "#eb4d4b", "#6c5ce7"]

    for (let i = 0; i < 100; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 10,
        vy: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      })
    }

    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      confetti.forEach((piece, index) => {
        piece.x += piece.vx
        piece.y += piece.vy
        piece.vy += 0.1 // gravity
        piece.rotation += piece.rotationSpeed

        ctx.save()
        ctx.translate(piece.x, piece.y)
        ctx.rotate((piece.rotation * Math.PI) / 180)
        ctx.fillStyle = piece.color
        ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size)
        ctx.restore()

        if (piece.y > canvas.height + 10) {
          confetti.splice(index, 1)
        }
      })

      if (confetti.length > 0) {
        animationId = requestAnimationFrame(animate)
      } else {
        onComplete?.()
      }
    }

    animate()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [active, onComplete])

  if (!active) return null

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />
}
