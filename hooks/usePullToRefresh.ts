"use client"

import type React from "react"

import { useState, useEffect } from "react"

export function usePullToRefresh(onRefresh: () => void) {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [startY, setStartY] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile || window.scrollY > 0) return
    setStartY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || window.scrollY > 0 || !startY) return

    const currentY = e.touches[0].clientY
    const distance = currentY - startY

    if (distance > 0 && distance < 150) {
      setPullDistance(distance)
      setIsPulling(true)
      e.preventDefault()
    }
  }

  const handleTouchEnd = () => {
    if (!isMobile || !isPulling) return

    if (pullDistance > 80) {
      onRefresh()
    }

    setIsPulling(false)
    setPullDistance(0)
    setStartY(0)
  }

  return {
    isMobile,
    isPulling,
    pullDistance,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  }
}
