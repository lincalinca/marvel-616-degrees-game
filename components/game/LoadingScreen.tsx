import { FloatingParticles } from "@/components/ui/floating-particles"
import type { DailyChallenge } from "@/types/marvel-types"

interface LoadingScreenProps {
  todaysChallenge?: DailyChallenge | null
}

export function LoadingScreen({ todaysChallenge }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <FloatingParticles />
      <div className="text-center z-10">
        <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-white text-lg">Loading Marvel Universe...</p>
        {todaysChallenge && (
          <p className="text-white/60 text-sm mt-2">
            Challenge: {todaysChallenge.startCharacter} → {todaysChallenge.endCharacter}
          </p>
        )}
      </div>
    </div>
  )
}
