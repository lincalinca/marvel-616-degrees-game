import { Timer } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"

interface GameStatsProps {
  currentConnections: number
  maxSteps: number
  gameStartTime: number
}

export function GameStats({ currentConnections, maxSteps, gameStartTime }: GameStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <GlassCard className="p-4">
        <div className="text-center">
          <p className="text-white/60 text-sm">Connections</p>
          <p className="text-2xl font-bold text-yellow-400">
            {currentConnections} / {maxSteps}
          </p>
        </div>
      </GlassCard>
      <GlassCard className="p-4">
        <div className="text-center">
          <p className="text-white/60 text-sm">Time</p>
          <div className="flex items-center justify-center gap-1">
            <Timer className="h-4 w-4 text-blue-400" />
            <p className="text-2xl font-bold text-blue-400">{Math.floor((Date.now() - gameStartTime) / 1000)}s</p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
