import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string | null
          display_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
          total_games_played: number
          total_wins: number
          best_score: number | null
          current_streak: number
          longest_streak: number
          last_played_date: string | null
        }
        Insert: {
          id?: string
          email: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          total_games_played?: number
          total_wins?: number
          best_score?: number | null
          current_streak?: number
          longest_streak?: number
          last_played_date?: string | null
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          total_games_played?: number
          total_wins?: number
          best_score?: number | null
          current_streak?: number
          longest_streak?: number
          last_played_date?: string | null
        }
      }
      game_sessions: {
        Row: {
          id: string
          user_id: string
          challenge_day: number
          start_character: string
          end_character: string
          difficulty: string
          completed: boolean
          steps_taken: number | null
          time_taken_seconds: number | null
          connection_path: any | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          challenge_day: number
          start_character: string
          end_character: string
          difficulty: string
          completed?: boolean
          steps_taken?: number | null
          time_taken_seconds?: number | null
          connection_path?: any | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          challenge_day?: number
          start_character?: string
          end_character?: string
          difficulty?: string
          completed?: boolean
          steps_taken?: number | null
          time_taken_seconds?: number | null
          connection_path?: any | null
          created_at?: string
          completed_at?: string | null
        }
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          achievement_type: string
          unlocked_at: string
          challenge_day: number | null
        }
        Insert: {
          id?: string
          user_id: string
          achievement_type: string
          unlocked_at?: string
          challenge_day?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          achievement_type?: string
          unlocked_at?: string
          challenge_day?: number | null
        }
      }
      leaderboards: {
        Row: {
          id: string
          user_id: string
          challenge_day: number
          difficulty: string
          steps_taken: number
          time_taken_seconds: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          challenge_day: number
          difficulty: string
          steps_taken: number
          time_taken_seconds: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          challenge_day?: number
          difficulty?: string
          steps_taken?: number
          time_taken_seconds?: number
          created_at?: string
        }
      }
      daily_challenges: {
        Row: {
          id: string
          day_number: number
          start_character: string
          end_character: string
          description: string
          difficulty: string
          is_initial_week: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          day_number: number
          start_character: string
          end_character: string
          description: string
          difficulty: string
          is_initial_week?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          day_number?: number
          start_character?: string
          end_character?: string
          description?: string
          difficulty?: string
          is_initial_week?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
