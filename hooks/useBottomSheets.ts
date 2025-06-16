"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BottomSheet } from "@/components/ui/bottom-sheet"
import { GlassCard } from "@/components/ui/glass-card"
import { ComicFrame } from "@/components/ui/comic-frame"
import { DifficultyBadge } from "@/components/ui/difficulty-badge"
import { AchievementBadge } from "@/components/ui/achievement-badge"
import { Search } from "lucide-react"
import { getDifficultyDescription } from "@/lib/daily-challenges"
import type { DailyChallenge } from "@/types/marvel-types"
import { debug } from "@/lib/debug"
import type React from "react"

export function useBottomSheets() {
  const [searchSheetOpen, setSearchSheetOpen] = useState(false)
  const [comicsSheetOpen, setComicsSheetOpen] = useState(false)
  const [achievementsSheetOpen, setAchievementsSheetOpen] = useState(false)
  const [difficultyInfoOpen, setDifficultyInfoOpen] = useState(false)
  const [pendingComics, setPendingComics] = useState<any[]>([]) // Store comics for the sheet

  const renderSearchSheet = (gameLogic: any): React.ReactElement => (
    <BottomSheet
      isOpen={searchSheetOpen}
      onClose={() => {
        debug.log("🚪", "Search sheet closing")
        setSearchSheetOpen(false)
      }}
      title="Find Character"
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search Marvel characters... (min 3 chars)"
            value={gameLogic.searchQuery}
            onChange={(e) => {
              debug.log("📝", "Search query changed to:", e.target.value)
              gameLogic.setSearchQuery(e.target.value)
              // Don't auto-search, wait for user action
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                debug.log("⏎", "Enter pressed, triggering search")
                gameLogic.handleSearch()
              }
            }}
            className="bg-slate-800 border-slate-600 text-white"
          />
          <Button
            onClick={() => {
              debug.log("🔍", "Search button clicked")
              gameLogic.handleSearch()
            }}
            disabled={gameLogic.isSearching || gameLogic.searchQuery.length < 3}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {gameLogic.searchQuery.length > 0 && gameLogic.searchQuery.length < 3 && (
          <p className="text-white/60 text-sm">Type at least 3 characters to search</p>
        )}

        {gameLogic.searchResults.length > 0 && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {gameLogic.searchResults.map((char: any) => (
              <GlassCard
                key={char.id}
                onClick={async () => {
                  debug.group(`Character Click: ${char.name}`)
                  debug.log("👆", "Character clicked:", char.name, "(ID:", char.id, ")")

                  // Close search sheet immediately
                  debug.log("🚪", "Closing search sheet")
                  setSearchSheetOpen(false)

                  // Handle character selection and find connections
                  debug.log("🎯", "Calling handleSelectCharacterForConnection")
                  const result = await gameLogic.handleSelectCharacterForConnection(char)

                  // Check if we should open comics sheet based on the actual result
                  debug.log("📚", "Connection result:", result)
                  debug.log("📚", "Should open comics sheet:", result?.shouldOpenComicsSheet)
                  debug.log("📚", "Comics in result:", result?.comics?.length || 0)

                  if (result?.shouldOpenComicsSheet && result?.comics?.length > 0) {
                    debug.log("📖", "Opening comics sheet for multiple comics")
                    // Store the comics directly from the result
                    setPendingComics(result.comics)
                    setComicsSheetOpen(true)
                  } else {
                    debug.log("📖", "Not opening comics sheet - single/no comics or auto-selected")
                  }
                  debug.groupEnd()
                }}
                className="p-4"
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
    </BottomSheet>
  )

  const renderComicsSheet = (gameLogic: any): React.ReactElement => {
    // Use pendingComics if available, otherwise fall back to gameLogic.connectingComics
    const comicsToShow = pendingComics.length > 0 ? pendingComics : gameLogic.connectingComics || []

    debug.log("📖", "renderComicsSheet called")
    debug.log("📖", "pendingComics length:", pendingComics.length)
    debug.log("📖", "gameLogic.connectingComics length:", gameLogic.connectingComics?.length || 0)
    debug.log("📖", "comicsToShow length:", comicsToShow.length)
    debug.log("📖", "Comics sheet open:", comicsSheetOpen)

    if (comicsToShow.length > 0) {
      debug.log(
        "📋",
        "Comics to render:",
        comicsToShow.map((c: any) => c.title),
      )
    }

    return (
      <BottomSheet
        isOpen={comicsSheetOpen}
        onClose={() => {
          debug.log("🚪", "Comics sheet closing")
          setComicsSheetOpen(false)
          setPendingComics([]) // Clear pending comics when closing
        }}
        title="Select Comic"
      >
        <div className="space-y-4">
          <p className="text-white/80 text-sm">Found {comicsToShow.length} comics connecting these characters:</p>

          {comicsToShow.length === 0 && (
            <div className="text-center py-8">
              <p className="text-white/60">No comics available to display</p>
              <p className="text-white/40 text-sm mt-2">This might be a timing issue - try again</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {comicsToShow.map((comic: any) => (
              <GlassCard
                key={comic.id}
                onClick={() => {
                  debug.log("📖", "Comic clicked:", comic.title, "(ID:", comic.id, ")")
                  gameLogic.handleSelectComic(comic)
                  debug.log("🚪", "Closing comics sheet")
                  setComicsSheetOpen(false)
                  setPendingComics([]) // Clear pending comics after selection
                }}
                className="p-3"
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
        </div>
      </BottomSheet>
    )
  }

  const renderDifficultySheet = (todaysChallenge: DailyChallenge | null): React.ReactElement => (
    <BottomSheet isOpen={difficultyInfoOpen} onClose={() => setDifficultyInfoOpen(false)} title="Difficulty Guide">
      <div className="space-y-4">
        {todaysChallenge && (
          <div className="text-center">
            <DifficultyBadge difficulty={todaysChallenge.difficulty} className="mb-2" />
            <p className="text-white/80 text-sm">{getDifficultyDescription(todaysChallenge.difficulty)}</p>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="text-white font-semibold">All Difficulty Levels:</h4>
          {["Easy", "Medium", "Medium-Hard", "Hard", "Very Hard", "Ultra Hard"].map((diff) => (
            <div key={diff} className="flex items-center justify-between">
              <DifficultyBadge difficulty={diff} />
              <p className="text-white/60 text-sm flex-1 ml-3">{getDifficultyDescription(diff)}</p>
            </div>
          ))}
        </div>
      </div>
    </BottomSheet>
  )

  const renderAchievementsSheet = (
    user: any,
    signInWithGoogle: () => void,
    signOut: () => void,
  ): React.ReactElement => (
    <BottomSheet isOpen={achievementsSheetOpen} onClose={() => setAchievementsSheetOpen(false)} title="Menu">
      <div className="space-y-4">
        {!user ? (
          <GlassCard className="p-4">
            <div className="text-center">
              <p className="text-white mb-3">Sign in to save your progress and compete on leaderboards!</p>
              <Button onClick={signInWithGoogle} className="bg-blue-600 hover:bg-blue-700 w-full">
                Sign in with Google
              </Button>
            </div>
          </GlassCard>
        ) : (
          <div className="text-center mb-4">
            <p className="text-white font-semibold">Welcome, {user.user_metadata?.full_name || user.email}!</p>
            <Button onClick={signOut} variant="outline" size="sm" className="mt-2">
              Sign Out
            </Button>
          </div>
        )}

        <div className="border-t border-slate-600 pt-4">
          <h3 className="text-white font-semibold mb-3">Achievements</h3>
          <AchievementBadge type="first-win" unlocked={false} />
          <AchievementBadge type="speed-runner" unlocked={false} />
          <AchievementBadge type="perfect-score" unlocked={false} />
          <AchievementBadge type="daily-streak" unlocked={false} />
        </div>
      </div>
    </BottomSheet>
  )

  return {
    searchSheetOpen,
    setSearchSheetOpen,
    comicsSheetOpen,
    setComicsSheetOpen,
    achievementsSheetOpen,
    setAchievementsSheetOpen,
    difficultyInfoOpen,
    setDifficultyInfoOpen,
    renderSearchSheet,
    renderComicsSheet,
    renderDifficultySheet,
    renderAchievementsSheet,
  }
}
