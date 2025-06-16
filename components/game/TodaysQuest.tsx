"use client"

import { useState } from "react"
import { CharacterCard } from "@/components/ui/character-card"
import { GlassCard } from "@/components/ui/glass-card"
import type { MarvelCharacter } from "@/types/marvel-types"

interface TodaysQuestProps {
  startCharacter: MarvelCharacter
  currentCharacter: MarvelCharacter
  endCharacter: MarvelCharacter
}

export function TodaysQuest({ startCharacter, currentCharacter, endCharacter }: TodaysQuestProps) {
  const [flippedCards, setFlippedCards] = useState({ start: false, current: false, target: false })

  return (
    <GlassCard className="p-4 mb-6">
      <h3 className="text-white font-semibold mb-4">Today's Quest</h3>

      <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
        <CharacterCard
          character={startCharacter}
          label="Start"
          labelColor="text-purple-400"
          isFlipped={flippedCards.start}
          onFlip={() => setFlippedCards((prev) => ({ ...prev, start: !prev.start }))}
        />
        <CharacterCard
          character={currentCharacter}
          label="Current"
          labelColor="text-green-400"
          isFlipped={flippedCards.current}
          onFlip={() => setFlippedCards((prev) => ({ ...prev, current: !prev.current }))}
          isActive={true}
        />
        <CharacterCard
          character={endCharacter}
          label="Target"
          labelColor="text-pink-400"
          isFlipped={flippedCards.target}
          onFlip={() => setFlippedCards((prev) => ({ ...prev, target: !prev.target }))}
        />
      </div>
    </GlassCard>
  )
}
