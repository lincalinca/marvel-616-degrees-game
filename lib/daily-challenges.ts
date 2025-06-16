import type { DailyChallenge } from "@/types/marvel-types"
import { getTodaysChallengeFromDB, getAllChallengesFromDB, getChallengesByDifficultyFromDB } from "./database"

// Hardcoded fallback challenges to ensure we always have something
const HARDCODED_CHALLENGES: DailyChallenge[] = [
  {
    day: 1,
    startCharacter: "Venom",
    endCharacter: "Deadpool",
    description: "Connect the symbiote anti-hero to the merc with a mouth",
    difficulty: "Easy",
  },
  {
    day: 2,
    startCharacter: "Spider-Gwen",
    endCharacter: "Polaris",
    description: "Link Spider-Gwen to the magnetic mutant",
    difficulty: "Easy",
  },
  {
    day: 3,
    startCharacter: "Havok",
    endCharacter: "Groot",
    description: "Bridge the plasma-powered mutant to the Guardian of the Galaxy",
    difficulty: "Easy",
  },
]

export async function getTodaysChallenge(): Promise<DailyChallenge> {
  try {
    console.log("Attempting to get today's challenge from database...")
    const challenge = await getTodaysChallengeFromDB()

    if (challenge) {
      console.log("Successfully got challenge from database:", challenge)
      return challenge
    }

    console.log("No challenge from database, using hardcoded fallback")
    return HARDCODED_CHALLENGES[0] // Always return Venom -> Deadpool as fallback
  } catch (error) {
    console.error("Error fetching today's challenge:", error)
    console.log("Using hardcoded fallback due to error")
    return HARDCODED_CHALLENGES[0]
  }
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case "Easy":
      return "from-green-400 to-emerald-500"
    case "Medium":
      return "from-yellow-400 to-orange-500"
    case "Medium-Hard":
      return "from-orange-400 to-red-500"
    case "Hard":
      return "from-red-400 to-pink-500"
    case "Very Hard":
      return "from-pink-400 to-purple-500"
    case "Ultra Hard":
      return "from-purple-400 to-indigo-500"
    default:
      return "from-gray-400 to-gray-500"
  }
}

export function getDifficultyDescription(difficulty: string): string {
  switch (difficulty) {
    case "Easy":
      return "Perfect for beginners - these characters have clear connections"
    case "Medium":
      return "A moderate challenge - requires some Marvel knowledge"
    case "Medium-Hard":
      return "Getting tricky - deeper comic connections needed"
    case "Hard":
      return "Challenging - obscure connections may be required"
    case "Very Hard":
      return "Expert level - extensive Marvel knowledge needed"
    case "Ultra Hard":
      return "Master level - only the most dedicated fans will succeed"
    default:
      return "Test your Marvel knowledge"
  }
}

// Get all challenges for preview/admin purposes
export async function getAllChallenges(): Promise<DailyChallenge[]> {
  try {
    const challenges = await getAllChallengesFromDB()
    return challenges.length > 0 ? challenges : HARDCODED_CHALLENGES
  } catch (error) {
    console.error("Error fetching all challenges:", error)
    return HARDCODED_CHALLENGES
  }
}

// Get challenges by difficulty
export async function getChallengesByDifficulty(difficulty: string): Promise<DailyChallenge[]> {
  try {
    return await getChallengesByDifficultyFromDB(difficulty)
  } catch (error) {
    console.error("Error fetching challenges by difficulty:", error)
    return []
  }
}
