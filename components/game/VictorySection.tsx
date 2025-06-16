"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { Share2, Check, RefreshCw, Copy } from "lucide-react"
import type { MarvelCharacter, PathSegment, DailyChallenge } from "@/types/marvel-types"
import { generateShareText, handleShare } from "@/utils/shareUtils"

interface VictorySectionProps {
  startCharacter: MarvelCharacter
  endCharacter: MarvelCharacter
  currentPath: PathSegment[]
  todaysChallenge: DailyChallenge
  onPlayAgain: () => void
}

export function VictorySection({
  startCharacter,
  endCharacter,
  currentPath,
  todaysChallenge,
  onPlayAgain,
}: VictorySectionProps) {
  const [shareText, setShareText] = useState("")
  const [showShareSuccess, setShowShareSuccess] = useState(false)

  const handleShareClick = async () => {
    const steps = currentPath.length - 1
    const text = generateShareText(
      startCharacter,
      endCharacter,
      currentPath,
      steps,
      todaysChallenge.difficulty,
      todaysChallenge.day,
    )

    setShareText(text)
    const success = await handleShare(text)

    if (success) {
      setShowShareSuccess(true)
      setTimeout(() => setShowShareSuccess(false), 2000)
    }
  }

  return (
    <GlassCard className="p-6 mb-6 bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-400/30">
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold text-green-400 mb-4">🎉 Victory! 🎉</h3>
        <p className="text-white/80 mb-4">
          You connected {startCharacter.name} to {endCharacter.name} in {currentPath.length - 1} steps!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleShareClick}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl"
          >
            {showShareSuccess ? (
              <>
                <Check className="mr-2 h-5 w-5" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <Share2 className="mr-2 h-5 w-5" />
                Share Your Victory
              </>
            )}
          </Button>

          <Button
            onClick={onPlayAgain}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-xl"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Play Again
          </Button>
        </div>

        {shareText && (
          <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-600">
            <p className="text-white/60 text-sm mb-2">Share text:</p>
            <pre className="text-white text-sm whitespace-pre-wrap font-mono text-left overflow-x-auto">
              {shareText}
            </pre>
            <Button
              onClick={() => navigator.clipboard.writeText(shareText)}
              size="sm"
              variant="ghost"
              className="mt-2 text-blue-400 hover:text-blue-300"
            >
              <Copy className="mr-1 h-3 w-3" />
              Copy
            </Button>
          </div>
        )}
      </div>
    </GlassCard>
  )
}
