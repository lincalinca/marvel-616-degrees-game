"use client"

import { useState, useCallback } from "react"
import type { MarvelCharacter, MarvelComic, PathSegment, DailyChallenge } from "@/types/marvel-types"
import { getInitialCharacters } from "@/lib/marvel-api"
import { createGameSession } from "@/lib/database"

export function useGameState() {
  const [startCharacter, setStartCharacter] = useState<MarvelCharacter | null>(null)
  const [endCharacter, setEndCharacter] = useState<MarvelCharacter | null>(null)
  const [currentPath, setCurrentPath] = useState<PathSegment[]>([])
  const [selectedNextChar, setSelectedNextChar] = useState<MarvelCharacter | null>(null)
  const [connectingComics, setConnectingComics] = useState<MarvelComic[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [gameMessage, setGameMessage] = useState<string | null>(null)
  const [isGameOver, setIsGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [gameStartTime, setGameStartTime] = useState<number>(0)

  const initializeGame = useCallback(async (todaysChallenge: DailyChallenge | null, user: any) => {
    if (!todaysChallenge) return

    setIsLoading(true)
    setGameMessage(null)
    setIsGameOver(false)
    setGameWon(false)
    setShowConfetti(false)
    setGameStartTime(Date.now())

    try {
      const { startChar, endChar } = await getInitialCharacters(
        todaysChallenge.startCharacter,
        todaysChallenge.endCharacter,
      )

      setStartCharacter(startChar)
      setEndCharacter(endChar)
      setCurrentPath([{ character: startChar }])
      setSelectedNextChar(null)
      setConnectingComics([])
      setGameMessage(`Today's ${todaysChallenge.difficulty} challenge: Connect ${startChar.name} to ${endChar.name}!`)

      if (user) {
        const session = await createGameSession({
          user_id: user.id,
          challenge_day: todaysChallenge.day,
          start_character: startChar.name,
          end_character: endChar.name,
          difficulty: todaysChallenge.difficulty,
        })
        setCurrentSessionId(session.id)
      }
    } catch (error) {
      setGameMessage("Error loading game. Please try again.")
      console.error("Game initialization error:", error)
    }
    setIsLoading(false)
  }, [])

  return {
    // State
    startCharacter,
    endCharacter,
    currentPath,
    selectedNextChar,
    connectingComics,
    isLoading,
    gameMessage,
    isGameOver,
    gameWon,
    showConfetti,
    currentSessionId,
    gameStartTime,
    // Setters
    setCurrentPath,
    setSelectedNextChar,
    setConnectingComics,
    setIsLoading,
    setGameMessage,
    setIsGameOver,
    setGameWon,
    setShowConfetti,
    // Actions
    initializeGame,
  }
}
