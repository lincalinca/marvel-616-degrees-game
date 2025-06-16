"use client"

import Image from "next/image"
import { GlassCard } from "@/components/ui/glass-card"
import { ComicFrame } from "@/components/ui/comic-frame"
import type { MarvelComic } from "@/types/marvel-types"

interface InlineComicSelectionProps {
  comics: MarvelComic[]
  onSelectComic: (comic: MarvelComic) => void
  selectedCharacterName?: string
}

export function InlineComicSelection({ comics, onSelectComic, selectedCharacterName }: InlineComicSelectionProps) {
  if (comics.length === 0) return null

  return (
    <GlassCard className="p-4 mb-6">
      <h3 className="text-white font-semibold mb-4">
        Choose the comic connection{selectedCharacterName ? ` to ${selectedCharacterName}` : ""}
      </h3>

      <p className="text-white/80 text-sm mb-4">Found {comics.length} comics connecting these characters:</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {comics.map((comic) => (
          <GlassCard
            key={comic.id}
            onClick={() => onSelectComic(comic)}
            className="p-3 cursor-pointer hover:bg-white/20"
          >
            <ComicFrame variant="comic">
              <Image
                src={comic.coverImageUrl || "/placeholder.svg"}
                alt={comic.title}
                width={120}
                height={180}
                className="rounded object-cover w-full"
              />
            </ComicFrame>
            <p className="text-white text-sm font-medium mt-2 line-clamp-2">{comic.title}</p>
            {comic.issueNumber && <p className="text-white/60 text-xs">#{comic.issueNumber}</p>}
          </GlassCard>
        ))}
      </div>
    </GlassCard>
  )
}
