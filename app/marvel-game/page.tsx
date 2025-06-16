"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FloatingParticles } from "@/components/ui/floating-particles"
import { GlassCard } from "@/components/ui/glass-card"
import { Confetti } from "@/components/ui/confetti"
import { DifficultyBadge } from "@/components/ui/difficulty-badge"
import { ConnectionPath } from "@/components/ui/connection-path"
import { Toast, useToast } from "@/components/ui/toast"
import { InstallPrompt } from "@/components/pwa/InstallPrompt"
import { RefreshCw, Menu, WifiOff, Info, RotateCcw } from "lucide-react"

// Hooks
import { useGameState } from "@/hooks/useGameState"
import { useAuth } from "@/hooks/useAuth"
import { usePWA } from "@/hooks/usePWA"
import { usePullToRefresh } from "@/hooks/usePullToRefresh"

// Components
import { PullToRefreshIndicator } from "@/components/game/PullToRefreshIndicator"
import { GameStats } from "@/components/game/GameStats"
import { VictorySection } from "@/components/game/VictorySection"
import { LoadingScreen } from "@/components/game/LoadingScreen"
import { SearchingConnectionsLoader } from "@/components/game/SearchingConnectionsLoader"
import { InlineSearch } from "@/components/game/InlineSearch"
import { InlineComicSelection } from "@/components/game/InlineComicSelection"
import { TodaysQuest } from "@/components/game/TodaysQuest"
import { BottomSheet } from "@/components/ui/bottom-sheet"

// Game logic
import { useGameLogic } from "@/hooks/useGameLogic"

// Utils
import { generateJourneyText, copyToClipboard } from "@/utils/shareUtils"
import { getDifficultyDescription } from "@/utils/difficultyUtils"

import type { DailyChallenge } from "@/types/marvel-types"
import { getTodaysChallenge } from "@/lib/daily-challenges"

const MAX_STEPS = 6

export default function MarvelSixDegreesPage() {
  const [todaysChallenge, setTodaysChallenge] = useState<DailyChallenge | null>(null)
  const [showComicSelection, setShowComicSelection] = useState(false)
  const [pendingComics, setPendingComics] = useState<any[]>([])
  const [difficultyInfoOpen, setDifficultyInfoOpen] = useState(false)
  const [achievementsSheetOpen, setAchievementsSheetOpen] = useState(false)

  // Custom hooks
  const gameState = useGameState()
  const { user, signInWithGoogle, signOut } = useAuth()
  const { isOnline, updateAvailable, updateApp, trackGameCompletion } = usePWA()
  const pullToRefresh = usePullToRefresh(() => gameState.initializeGame(todaysChallenge, user))
  const gameLogic = useGameLogic(gameState, todaysChallenge, user)
  const { toast, showToast, hideToast } = useToast()

  // Load today's challenge
  useEffect(() => {
    const loadTodaysChallenge = async () => {
      try {
        const challenge = await getTodaysChallenge()
        setTodaysChallenge(challenge)
      } catch (error) {
        console.error("Error loading today's challenge:", error)
        setTodaysChallenge({
          day: 1,
          startCharacter: "Venom",
          endCharacter: "Deadpool",
          description: "Connect the symbiote anti-hero to the merc with a mouth",
          difficulty: "Easy",
        })
      }
    }
    loadTodaysChallenge()
  }, [])

  // Initialize game when challenge loads
  useEffect(() => {
    if (todaysChallenge) {
      gameState.initializeGame(todaysChallenge, user)
    }
  }, [todaysChallenge, gameState.initializeGame, user])

  // Track game completion for PWA install prompt
  useEffect(() => {
    if (gameState.gameWon) {
      trackGameCompletion()
    }
  }, [gameState.gameWon, trackGameCompletion])

  const currentCharacterForTurn = gameState.currentPath[gameState.currentPath.length - 1]?.character

  const handleSelectCharacter = async (character: any) => {
    const result = await gameLogic.handleSelectCharacterForConnection(character)

    if (result?.shouldOpenComicsSheet && result?.comics?.length > 0) {
      setPendingComics(result.comics)
      setShowComicSelection(true)
    }
  }

  const handleSelectComic = (comic: any) => {
    gameLogic.handleSelectComic(comic)
    setShowComicSelection(false)
    setPendingComics([])
  }

  const handleShareJourney = () => {
    // Scroll to bottom of page
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    })
  }

  const handleCopyJourney = async () => {
    const journeyText = generateJourneyText(gameState.currentPath)
    const success = await copyToClipboard(journeyText)

    if (success) {
      showToast("Your Journey Has Been Copied", "success")
    } else {
      showToast("Failed to copy journey", "error")
    }
  }

  if (!gameState.startCharacter || !gameState.endCharacter || !todaysChallenge) {
    return <LoadingScreen todaysChallenge={todaysChallenge} />
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden"
      onTouchStart={pullToRefresh.handleTouchStart}
      onTouchMove={pullToRefresh.handleTouchMove}
      onTouchEnd={pullToRefresh.handleTouchEnd}
    >
      <FloatingParticles />

      <PullToRefreshIndicator
        isPulling={pullToRefresh.isPulling}
        pullDistance={pullToRefresh.pullDistance}
        isMobile={pullToRefresh.isMobile}
      />

      {/* Toast Notification */}
      <Toast message={toast.message} isVisible={toast.isVisible} onClose={hideToast} type={toast.type} />

      {/* PWA Install Prompt */}
      <InstallPrompt />

      {/* Update Available Notification */}
      {updateAvailable && (
        <GlassCard className="fixed top-4 left-4 right-4 z-50 p-4 border-blue-500/50 bg-blue-900/90">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RotateCcw className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-white font-medium">Update Available</p>
                <p className="text-white/60 text-sm">Restart to get the latest features</p>
              </div>
            </div>
            <Button onClick={updateApp} size="sm" className="bg-blue-600 hover:bg-blue-700">
              Update
            </Button>
          </div>
        </GlassCard>
      )}

      {/* Comic book dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle, #8b5cf6 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Header */}
      <div className="relative z-10 p-4 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {!isOnline && <WifiOff className="h-5 w-5 text-red-400" />}
            <Badge variant="outline" className="border-purple-500 text-purple-300">
              Day {todaysChallenge.day}
            </Badge>
            <DifficultyBadge difficulty={todaysChallenge.difficulty} />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDifficultyInfoOpen(true)}
              className="text-white hover:bg-white/10"
            >
              <Info className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAchievementsSheetOpen(true)}
              className="text-white hover:bg-white/10"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Logo Header */}
        <div className="text-center mb-6">
          <Image
            src="/images/616degrees-logo.png"
            alt="616 Degrees of Separation"
            width={300}
            height={90}
            className="max-w-full h-auto mx-auto"
            priority
          />
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-blue-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* 1. Comic Connection Journey */}
        {gameState.currentPath.length > 1 && (
          <ConnectionPath
            currentPath={gameState.currentPath}
            onShare={handleShareJourney}
            onCopyToClipboard={handleCopyJourney}
          />
        )}

        {/* 2. Find the next hero... or villain (Search) */}
        {!gameState.isGameOver && !gameLogic.isSearchingConnections && !showComicSelection && (
          <InlineSearch
            searchQuery={gameLogic.searchQuery}
            setSearchQuery={gameLogic.setSearchQuery}
            searchResults={gameLogic.searchResults}
            isSearching={gameLogic.isSearching}
            onSearch={gameLogic.handleSearch}
            onSelectCharacter={handleSelectCharacter}
          />
        )}

        {/* Comic Selection (when needed) */}
        {showComicSelection && (
          <InlineComicSelection
            comics={pendingComics}
            onSelectComic={handleSelectComic}
            selectedCharacterName={gameState.selectedNextChar?.name}
          />
        )}

        {/* Searching Connections Loader */}
        {gameLogic.isSearchingConnections && <SearchingConnectionsLoader />}

        {/* 3. Today's Quest (Character Cards) */}
        <TodaysQuest
          startCharacter={gameState.startCharacter}
          currentCharacter={currentCharacterForTurn}
          endCharacter={gameState.endCharacter}
        />

        {/* 4. Stats */}
        <GameStats
          currentConnections={gameState.currentPath.length - 1}
          maxSteps={MAX_STEPS}
          gameStartTime={gameState.gameStartTime}
        />

        {/* Game Messages */}
        {gameState.gameMessage && (
          <GlassCard className="p-4 mb-6">
            <p className="text-white text-center">{gameState.gameMessage}</p>
          </GlassCard>
        )}

        {/* Victory Section */}
        {gameState.gameWon && (
          <VictorySection
            startCharacter={gameState.startCharacter}
            endCharacter={gameState.endCharacter}
            currentPath={gameState.currentPath}
            todaysChallenge={todaysChallenge}
            onPlayAgain={() => gameState.initializeGame(todaysChallenge, user)}
          />
        )}

        {/* Refresh Button (Desktop) */}
        {!pullToRefresh.isMobile && (
          <div className="fixed bottom-6 right-6">
            <Button
              onClick={() => gameState.initializeGame(todaysChallenge, user)}
              size="lg"
              className="h-14 w-14 rounded-full bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 shadow-lg"
              disabled={gameState.isLoading}
            >
              <RefreshCw className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Sheets (for menu/info only) */}
      {difficultyInfoOpen && (
        <BottomSheet isOpen={difficultyInfoOpen} onClose={() => setDifficultyInfoOpen(false)} title="Difficulty Guide">
          <div className="space-y-4">
            {todaysChallenge && (
              <div className="text-center">
                <DifficultyBadge difficulty={todaysChallenge.difficulty} className="mb-2" />
                <p className="text-white/80 text-sm">{getDifficultyDescription(todaysChallenge.difficulty)}</p>
              </div>
            )}
          </div>
        </BottomSheet>
      )}

      {achievementsSheetOpen && (
        <BottomSheet isOpen={achievementsSheetOpen} onClose={() => setAchievementsSheetOpen(false)} title="Menu">
          <div className="space-y-4">
            {!user ? (
              <GlassCard className="p-4">
                <div className="text-center">
                  <p className="text-white mb-3">Sign in to save your progress!</p>
                  <Button onClick={signInWithGoogle} className="bg-blue-600 hover:bg-blue-700 w-full">
                    Sign in with Google
                  </Button>
                </div>
              </GlassCard>
            ) : (
              <div className="text-center mb-4">
                <p className="text-white font-semibold">Welcome!</p>
                <Button onClick={signOut} variant="outline" size="sm" className="mt-2">
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </BottomSheet>
      )}

      <Confetti active={gameState.showConfetti} onComplete={() => gameState.setShowConfetti(false)} />
    </div>
  )
}
