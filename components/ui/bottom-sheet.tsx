"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export function BottomSheet({ isOpen, onClose, children, title }: BottomSheetProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50">
      <div
        className={cn(
          "absolute inset-0 bg-black/50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-slate-900 rounded-t-3xl transition-transform duration-300 ease-out",
          "max-h-[80vh] overflow-hidden",
          isOpen ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors">
            <X className="h-5 w-5 text-white" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">{children}</div>
      </div>
    </div>
  )
}
