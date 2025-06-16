import type React from "react"
import { cn } from "@/lib/utils"

interface ComicFrameProps {
  children: React.ReactNode
  className?: string
  variant?: "character" | "comic"
}

export function ComicFrame({ children, className, variant = "character" }: ComicFrameProps) {
  return (
    <div
      className={cn(
        "relative",
        variant === "character" &&
          "before:absolute before:inset-0 before:bg-gradient-to-br before:from-yellow-400 before:via-red-500 before:to-purple-600 before:p-1 before:rounded-xl before:content-[''] after:absolute after:inset-1 after:bg-slate-800 after:rounded-lg after:content-['']",
        variant === "comic" &&
          "before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-400 before:via-purple-500 before:to-pink-600 before:p-0.5 before:rounded-lg before:content-[''] after:absolute after:inset-0.5 after:bg-slate-900 after:rounded-md after:content-['']",
        className,
      )}
    >
      <div className="relative z-10">{children}</div>
    </div>
  )
}
