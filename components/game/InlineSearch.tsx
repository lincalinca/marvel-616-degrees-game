"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GlassCard } from "@/components/ui/glass-card"
import { Search, Loader2 } from "lucide-react"
import type { MarvelCharacter } from "@/types/marvel-types"

interface InlineSearchProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchResults: MarvelCharacter[]
  isSearching: boolean
  onSearch: () => void
  onSelectCharacter: (character: MarvelCharacter) => void
}

export function InlineSearch({
  searchQuery,
  setSearchQuery,
  searchResults,
  isSearching,
  onSearch,
  onSelectCharacter,
}: InlineSearchProps) {
  return (
    <GlassCard className="p-4 mb-6">
      <h3 className="text-white font-semibold mb-4">Find the next hero... or villain</h3>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search Marvel characters... (min 3 chars)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                onSearch()
              }
            }}
            className="bg-slate-800 border-slate-600 text-white"
          />
          <Button
            onClick={onSearch}
            disabled={isSearching || searchQuery.length < 3}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>

        {searchQuery.length > 0 && searchQuery.length < 3 && (
          <p className="text-white/60 text-sm">Type at least 3 characters to search</p>
        )}

        {searchResults.length > 0 && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            <p className="text-white/80 text-sm mb-2">Found {searchResults.length} characters:</p>
            {searchResults.map((char) => (
              <GlassCard
                key={char.id}
                onClick={() => onSelectCharacter(char)}
                className="p-4 cursor-pointer hover:bg-white/20"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={char.imageUrl || "/placeholder.svg"}
                    alt={char.name}
                    width={50}
                    height={50}
                    className="rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-white font-semibold">{char.name}</p>
                    {char.description && <p className="text-white/60 text-sm line-clamp-2">{char.description}</p>}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  )
}
