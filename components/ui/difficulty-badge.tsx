import { Badge } from "@/components/ui/badge"
import { getDifficultyColor } from "@/lib/daily-challenges"
import { cn } from "@/lib/utils"

interface DifficultyBadgeProps {
  difficulty: string
  className?: string
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const colorClass = getDifficultyColor(difficulty)

  return (
    <Badge className={cn(`bg-gradient-to-r ${colorClass} text-white border-0 font-semibold shadow-lg`, className)}>
      {difficulty}
    </Badge>
  )
}
