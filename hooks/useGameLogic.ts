"use client"

import { useState } from "react"
import type { MarvelCharacter, MarvelComic, DailyChallenge } from "@/types/marvel-types"
import { searchCharactersByName, findComicsConnectingCharacters } from "@/lib/marvel-api"
import {
  completeGameSession,
  updateUserStats,
  unlockAchievement,
  addToLeaderboard,
  getUserProfile,
} from "@/lib/database"
import { debug } from "@/lib/debug"

export function useGameLogic(gameState: any, todaysChallenge: DailyChallenge | null, user: any) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<MarvelCharacter[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchingConnections, setIsSearchingConnections] = useState(false)
  const [achievements, setAchievements] = useState({
    firstWin: false,
    speedRunner: false,
    perfectScore: false,
    dailyStreak: false,
  })

  const handleSearch = async () => {
    debug.log("🔍", "handleSearch called with query:", searchQuery)

    if (!searchQuery.trim() || searchQuery.trim().length < 3) {
      debug.log("❌", "Query too short (< 3 chars) or empty, clearing results")
      setSearchResults([])
      return
    }

    setIsSearching(true)
    debug.log("🔄", "Starting search for:", searchQuery)

    try {
      const results = await searchCharactersByName(searchQuery)
      debug.log("✅", "Search results received:", results.length, "characters")
      debug.log(
        "📋",
        "Search results:",
        results.map((r) => `${r.name} (ID: ${r.id})`),
      )

      const currentCharacterIds = gameState.currentPath.map((p: any) => p.character.id)
      debug.log("🚫", "Current path character IDs to filter out:", currentCharacterIds)

      const filteredResults = results.filter(
        (r) => !currentCharacterIds.includes(r.id) || r.id === gameState.endCharacter?.id,
      )
      debug.log("✅", "Filtered results:", filteredResults.length, "characters")
      debug.log(
        "📋",
        "Filtered results:",
        filteredResults.map((r) => `${r.name} (ID: ${r.id})`),
      )

      setSearchResults(filteredResults)
    } catch (error) {
      debug.error("Search error:", error)
      gameState.setGameMessage("Error searching characters. Please try again.")
    }
    setIsSearching(false)
    debug.log("🔄", "Search completed")
  }

  const handleSelectCharacterForConnection = async (char: MarvelCharacter) => {
    debug.group(`Character Selection: ${char.name}`)
    debug.log("🎯", "handleSelectCharacterForConnection called with:", char.name, "(ID:", char.id, ")")

    gameState.setSelectedNextChar(char)
    debug.log("✅", "Selected character set in game state")

    setSearchResults([])
    setSearchQuery("")
    debug.log("🧹", "Cleared search results and query")

    // Find connections immediately
    debug.log("🔗", "Starting connection search...")
    const result = await findConnections(char)
    debug.log("🔗", "Connection search completed, returning result:", result)
    debug.groupEnd()
    return result
  }

  const findConnections = async (nextChar: MarvelCharacter | null) => {
    debug.log("🔗", "findConnections called with:", nextChar?.name, "(ID:", nextChar?.id, ")")

    if (!nextChar || gameState.currentPath.length === 0) {
      debug.log("❌", "No character or empty path, aborting connection search")
      return { shouldOpenComicsSheet: false, comics: [] }
    }

    const lastCharInPath = gameState.currentPath[gameState.currentPath.length - 1].character
    debug.log("👤", "Last character in path:", lastCharInPath.name, "(ID:", lastCharInPath.id, ")")
    debug.log("🔗", "Searching for comics connecting:", lastCharInPath.name, "->", nextChar.name)

    gameState.setIsLoading(true)
    setIsSearchingConnections(true)
    debug.log("🔄", "Set loading states to true")

    try {
      const comics = await findComicsConnectingCharacters(lastCharInPath.id, nextChar.id)
      debug.log("📚", "Comics found:", comics.length)
      debug.log(
        "📋",
        "Comic details:",
        comics.map((c) => `${c.title} ${c.issueNumber ? "#" + c.issueNumber : ""} (ID: ${c.id})`),
      )

      // CRITICAL: Set comics in state BEFORE making decisions
      debug.log("🔄", "Setting comics in game state...")
      gameState.setConnectingComics(comics)
      debug.log("✅", "Comics set in game state")

      if (comics.length === 0) {
        debug.log("❌", "No comics found - showing error message")
        gameState.setGameMessage(`Sorry, ${nextChar.name} doesn't seem to share a cover with ${lastCharInPath.name}.`)
        gameState.setSelectedNextChar(null)
        return { shouldOpenComicsSheet: false, comics: [] }
      } else if (comics.length === 1) {
        debug.log("📖", "Single comic found - auto-selecting:", comics[0].title)
        // Auto-select the single comic
        await handleSelectComic(comics[0])
        return { shouldOpenComicsSheet: false, comics: comics }
      } else {
        debug.log("📚", "Multiple comics found - should open comics sheet")
        debug.log(
          "📚",
          "Comics to be shown in sheet:",
          comics.map((c) => c.title),
        )
        // Multiple comics found - need to show selection
        // Return the comics directly so the sheet can use them
        return { shouldOpenComicsSheet: true, comics: comics }
      }
    } catch (error) {
      debug.error("Connection search error:", error)
      gameState.setGameMessage("Error finding connections. Please try again.")
      return { shouldOpenComicsSheet: false, comics: [] }
    } finally {
      gameState.setIsLoading(false)
      setIsSearchingConnections(false)
      debug.log("🔄", "Set loading states to false")
    }
  }

  const handleSelectComic = async (comic: MarvelComic) => {
    debug.log("📖", "handleSelectComic called with:", comic.title, "(ID:", comic.id, ")")

    if (!gameState.selectedNextChar || !todaysChallenge) {
      debug.log("❌", "No selected character or challenge, aborting comic selection")
      return
    }

    debug.log("🔗", "Creating new path segment with character:", gameState.selectedNextChar.name)
    const newPathSegment = {
      character: gameState.selectedNextChar,
      comicConnectingToPrevious: comic,
    }
    const updatedPath = [...gameState.currentPath, newPathSegment]
    debug.log("📍", "Updated path length:", updatedPath.length)
    debug.log(
      "📋",
      "Updated path:",
      updatedPath.map(
        (p, i) =>
          `${i}: ${p.character.name}${p.comicConnectingToPrevious ? ` via ${p.comicConnectingToPrevious.title}` : ""}`,
      ),
    )

    gameState.setCurrentPath(updatedPath)
    debug.log("✅", "Path updated in game state")

    // Check for win condition
    if (gameState.selectedNextChar.id === gameState.endCharacter?.id) {
      const steps = updatedPath.length - 1
      const timeTaken = Math.floor((Date.now() - gameState.gameStartTime) / 1000)
      debug.log("🎉", "WIN CONDITION MET! Steps:", steps, "Time:", timeTaken, "seconds")

      gameState.setGameMessage(`🎉 Victory! Connected in ${steps} step${steps !== 1 ? "s" : ""}!`)
      gameState.setIsGameOver(true)
      gameState.setGameWon(true)
      gameState.setShowConfetti(true)

      // Save game completion
      if (user && gameState.currentSessionId) {
        debug.log("💾", "Saving game completion to database...")
        try {
          await completeGameSession(gameState.currentSessionId, {
            completed: true,
            steps_taken: steps,
            time_taken_seconds: timeTaken,
            connection_path: updatedPath,
          })

          const userProfile = await getUserProfile(user.id)
          if (userProfile) {
            const newStats = {
              total_games_played: userProfile.total_games_played + 1,
              total_wins: userProfile.total_wins + 1,
              best_score: userProfile.best_score ? Math.min(userProfile.best_score, steps) : steps,
              last_played_date: new Date().toISOString().split("T")[0],
            }
            await updateUserStats(user.id, newStats)
          }

          await addToLeaderboard({
            user_id: user.id,
            challenge_day: todaysChallenge.day,
            difficulty: todaysChallenge.difficulty,
            steps_taken: steps,
            time_taken_seconds: timeTaken,
          })

          // Unlock achievements
          if (!achievements.firstWin) {
            await unlockAchievement(user.id, "first-win", todaysChallenge.day)
            setAchievements((prev) => ({ ...prev, firstWin: true }))
          }
          if (steps <= 3 && !achievements.speedRunner) {
            await unlockAchievement(user.id, "speed-runner", todaysChallenge.day)
            setAchievements((prev) => ({ ...prev, speedRunner: true }))
          }
          if (steps === 2 && !achievements.perfectScore) {
            await unlockAchievement(user.id, "perfect-score", todaysChallenge.day)
            setAchievements((prev) => ({ ...prev, perfectScore: true }))
          }
          debug.log("✅", "Game data saved successfully")
        } catch (error) {
          debug.error("Error saving game data:", error)
        }
      }

      if ("vibrate" in navigator) {
        navigator.vibrate([100, 50, 100, 50, 200])
      }
    } else if (updatedPath.length - 1 >= 6) {
      debug.log("💀", "GAME OVER - Maximum steps reached")
      gameState.setGameMessage("Game Over! Maximum steps reached.")
      gameState.setIsGameOver(true)

      if (user && gameState.currentSessionId) {
        const timeTaken = Math.floor((Date.now() - gameState.gameStartTime) / 1000)
        await completeGameSession(gameState.currentSessionId, {
          completed: false,
          steps_taken: updatedPath.length - 1,
          time_taken_seconds: timeTaken,
          connection_path: updatedPath,
        })
      }
    } else {
      debug.log("➡️", "Character added to path, continuing game")
      gameState.setGameMessage(`${gameState.selectedNextChar.name} added to path!`)
    }

    gameState.setSelectedNextChar(null)
    gameState.setConnectingComics([])
    debug.log("🧹", "Cleared selected character and connecting comics")
  }

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    isSearchingConnections,
    achievements,
    // Pass through the actual comics from gameState
    connectingComics: gameState.connectingComics,
    handleSearch,
    handleSelectCharacterForConnection,
    handleSelectComic,
    findConnections,
  }
}
