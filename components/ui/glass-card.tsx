"use client"

import type React from "react"

import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
}

export function GlassCard({ children, className, onClick, disabled }: GlassCardProps) {
  return (
    <div
      className={cn(
        "backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl",
        "transition-all duration-300 ease-out",
        !disabled && onClick && "cursor-pointer hover:bg-white/20 hover:scale-105 active:scale-95",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      onClick={!disabled ? onClick : undefined}
    >
      {children}
    </div>
  )
}
