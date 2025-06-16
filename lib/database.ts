import { supabase } from "./supabase"
import type { Database } from "./supabase"
import type { DailyChallenge } from "@/types/marvel-types"

type User = Database["public"]["Tables"]["users"]["Row"]
type GameSession = Database["public"]["Tables"]["game_sessions"]["Row"]
type Achievement = Database["public"]["Tables"]["achievements"]["Row"]
type LeaderboardEntry = Database["public"]["Tables"]["leaderboards"]["Row"]

export async function createOrUpdateUser(userData: {
  id: string
  email: string
  username?: string
  display_name?: string
  avatar_url?: string
}) {
  const { data, error } = await supabase
    .from("users")
    .upsert({
      ...userData,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

  if (error && error.code !== "PGRST116") throw error
  return data
}

export async function createGameSession(sessionData: {
  user_id: string
  challenge_day: number
  start_character: string
  end_character: string
  difficulty: string
}) {
  const { data, error } = await supabase.from("game_sessions").insert(sessionData).select().single()

  if (error) throw error
  return data
}

export async function completeGameSession(
  sessionId: string,
  completionData: {
    completed: boolean
    steps_taken: number
    time_taken_seconds: number
    connection_path: any[]
  },
) {
  const { data, error } = await supabase
    .from("game_sessions")
    .update({
      ...completionData,
      completed_at: new Date().toISOString(),
    })
    .eq("id", sessionId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateUserStats(
  userId: string,
  stats: {
    total_games_played?: number
    total_wins?: number
    best_score?: number
    current_streak?: number
    longest_streak?: number
    last_played_date?: string
  },
) {
  const { data, error } = await supabase
    .from("users")
    .update({
      ...stats,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function unlockAchievement(userId: string, achievementType: string, challengeDay?: number) {
  const { data, error } = await supabase
    .from("achievements")
    .upsert({
      user_id: userId,
      achievement_type: achievementType,
      challenge_day: challengeDay,
    })
    .select()
    .single()

  if (error && error.code !== "23505") throw error // Ignore duplicate key errors
  return data
}

export async function getUserAchievements(userId: string): Promise<Achievement[]> {
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .eq("user_id", userId)
    .order("unlocked_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function addToLeaderboard(entryData: {
  user_id: string
  challenge_day: number
  difficulty: string
  steps_taken: number
  time_taken_seconds: number
}) {
  const { data, error } = await supabase.from("leaderboards").upsert(entryData).select().single()

  if (error) throw error
  return data
}

export async function getLeaderboard(
  challengeDay: number,
  difficulty?: string,
  limit = 10,
): Promise<(LeaderboardEntry & { users: Pick<User, "display_name" | "username"> })[]> {
  let query = supabase
    .from("leaderboards")
    .select(`
      *,
      users!inner(display_name, username)
    `)
    .eq("challenge_day", challengeDay)
    .order("steps_taken", { ascending: true })
    .order("time_taken_seconds", { ascending: true })
    .limit(limit)

  if (difficulty) {
    query = query.eq("difficulty", difficulty)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export async function getUserGameHistory(userId: string, limit = 20): Promise<GameSession[]> {
  const { data, error } = await supabase
    .from("game_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

// Daily Challenges Database Functions
export async function getTodaysChallengeFromDB(): Promise<DailyChallenge | null> {
  // Calculate days since reset (starting from today as day 1)
  const resetDate = new Date("2025-01-15") // Updated to current date
  const resetEpoch = Math.floor(resetDate.getTime() / (1000 * 60 * 60 * 24))
  const currentEpoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24))
  const daysSinceReset = currentEpoch - resetEpoch

  console.log("Reset date:", resetDate.toISOString())
  console.log("Days since reset:", daysSinceReset)
  console.log("Current epoch:", currentEpoch, "Reset epoch:", resetEpoch)

  let challenge = null

  // For the first 7 days, get initial week challenges
  if (daysSinceReset >= 0 && daysSinceReset < 7) {
    const dayNumber = daysSinceReset + 1
    console.log("Fetching initial challenge for day:", dayNumber)

    const { data, error } = await supabase
      .from("daily_challenges")
      .select("*")
      .eq("day_number", dayNumber)
      .eq("is_initial_week", true)
      .single()

    if (error) {
      console.error("Error fetching initial challenge:", error)
      // Force return Day 1 challenge if we can't find it in DB
      console.log("Forcing Day 1 challenge: Venom -> Deadpool")
      return {
        day: 1,
        startCharacter: "Venom",
        endCharacter: "Deadpool",
        description: "Connect the symbiote anti-hero to the merc with a mouth",
        difficulty: "Easy",
      }
    }
    challenge = data
    console.log("Found initial challenge:", challenge)
  } else if (daysSinceReset >= 7) {
    // After day 7, get a random challenge from the pool using seeded random
    const { data: allChallenges, error } = await supabase
      .from("daily_challenges")
      .select("*")
      .eq("is_initial_week", false)

    if (error) {
      console.error("Error fetching challenges:", error)
      return null
    }

    if (allChallenges && allChallenges.length > 0) {
      // Use seeded random for consistent daily selection
      const seed = daysSinceReset
      const randomIndex = seededRandom(seed) % allChallenges.length
      challenge = allChallenges[randomIndex]
      console.log("Found random challenge:", challenge)
    }
  } else {
    // If daysSinceReset is negative (before reset date), force Day 1
    console.log("Before reset date, forcing Day 1 challenge")
    return {
      day: 1,
      startCharacter: "Venom",
      endCharacter: "Deadpool",
      description: "Connect the symbiote anti-hero to the merc with a mouth",
      difficulty: "Easy",
    }
  }

  if (!challenge) {
    console.log("No challenge found, returning Day 1 fallback")
    return {
      day: 1,
      startCharacter: "Venom",
      endCharacter: "Deadpool",
      description: "Connect the symbiote anti-hero to the merc with a mouth",
      difficulty: "Easy",
    }
  }

  // Convert database format to DailyChallenge type
  const result = {
    day: Math.max(1, (daysSinceReset % 7) + 1), // Keep day 1-7 cycle for UI display, ensure minimum 1
    startCharacter: challenge.start_character,
    endCharacter: challenge.end_character,
    description: challenge.description,
    difficulty: challenge.difficulty as DailyChallenge["difficulty"],
  }

  console.log("Returning challenge:", result)
  return result
}

export async function getAllChallengesFromDB(): Promise<DailyChallenge[]> {
  const { data, error } = await supabase.from("daily_challenges").select("*").order("day_number", { ascending: true })

  if (error) {
    console.error("Error fetching all challenges:", error)
    return []
  }

  return (
    data?.map((challenge) => ({
      day: challenge.day_number,
      startCharacter: challenge.start_character,
      endCharacter: challenge.end_character,
      description: challenge.description,
      difficulty: challenge.difficulty as DailyChallenge["difficulty"],
    })) || []
  )
}

export async function getChallengesByDifficultyFromDB(difficulty: string): Promise<DailyChallenge[]> {
  const { data, error } = await supabase
    .from("daily_challenges")
    .select("*")
    .eq("difficulty", difficulty)
    .order("day_number", { ascending: true })

  if (error) {
    console.error("Error fetching challenges by difficulty:", error)
    return []
  }

  return (
    data?.map((challenge) => ({
      day: challenge.day_number,
      startCharacter: challenge.start_character,
      endCharacter: challenge.end_character,
      description: challenge.description,
      difficulty: challenge.difficulty as DailyChallenge["difficulty"],
    })) || []
  )
}

export async function addNewChallenge(challengeData: {
  day_number: number
  start_character: string
  end_character: string
  description: string
  difficulty: string
  is_initial_week?: boolean
}) {
  const { data, error } = await supabase.from("daily_challenges").insert(challengeData).select().single()

  if (error) throw error
  return data
}

// Simple seeded random function for consistent daily selection
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return Math.floor((x - Math.floor(x)) * 1000000)
}
