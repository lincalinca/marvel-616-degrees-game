"use client"

import { useState, useEffect } from "react"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastProps {
  message: string
  isVisible: boolean
  onClose: () => void
  type?: "success" | "error" | "info"
  duration?: number
}

export function Toast({ message, isVisible, onClose, type = "success", duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-md border",
          type === "success" && "bg-green-900/90 border-green-500/50 text-green-100",
          type === "error" && "bg-red-900/90 border-red-500/50 text-red-100",
          type === "info" && "bg-blue-900/90 border-blue-500/50 text-blue-100",
        )}
      >
        {type === "success" && <Check className="h-4 w-4 text-green-400" />}
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 text-white/60 hover:text-white transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// Hook for managing toast state
export function useToast() {
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error" | "info"
    isVisible: boolean
  }>({
    message: "",
    type: "success",
    isVisible: false,
  })

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type, isVisible: true })
  }

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }))
  }

  return {
    toast,
    showToast,
    hideToast,
  }
}
