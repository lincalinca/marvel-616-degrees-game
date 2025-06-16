-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Users can view their own game sessions" ON game_sessions;
DROP POLICY IF EXISTS "Users can insert their own game sessions" ON game_sessions;
DROP POLICY IF EXISTS "Users can update their own game sessions" ON game_sessions;
DROP POLICY IF EXISTS "Users can view their own achievements" ON achievements;
DROP POLICY IF EXISTS "Users can insert their own achievements" ON achievements;
DROP POLICY IF EXISTS "Everyone can view leaderboards" ON leaderboards;
DROP POLICY IF EXISTS "Users can insert their own leaderboard entries" ON leaderboards;

-- Create tables only if they don't exist
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_games_played INTEGER DEFAULT 0,
  total_wins INTEGER DEFAULT 0,
  best_score INTEGER,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_played_date DATE
);

CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  challenge_day INTEGER NOT NULL,
  start_character TEXT NOT NULL,
  end_character TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  steps_taken INTEGER,
  time_taken_seconds INTEGER,
  connection_path JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  challenge_day INTEGER,
  UNIQUE(user_id, achievement_type)
);

CREATE TABLE IF NOT EXISTS leaderboards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  challenge_day INTEGER NOT NULL,
  difficulty TEXT NOT NULL,
  steps_taken INTEGER NOT NULL,
  time_taken_seconds INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, challenge_day)
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_challenge_day ON game_sessions(challenge_day);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboards_challenge_day ON leaderboards(challenge_day);
CREATE INDEX IF NOT EXISTS idx_leaderboards_difficulty ON leaderboards(difficulty);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboards ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own game sessions" ON game_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own game sessions" ON game_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own game sessions" ON game_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own achievements" ON achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" ON achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Everyone can view leaderboards" ON leaderboards
  FOR SELECT TO authenticated;

CREATE POLICY "Users can insert their own leaderboard entries" ON leaderboards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
