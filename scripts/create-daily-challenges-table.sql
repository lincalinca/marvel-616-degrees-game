-- Create daily_challenges table
CREATE TABLE IF NOT EXISTS daily_challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day_number INTEGER NOT NULL,
  start_character TEXT NOT NULL,
  end_character TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Medium-Hard', 'Hard', 'Very Hard', 'Ultra Hard')),
  is_initial_week BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(day_number, is_initial_week)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_daily_challenges_day_initial ON daily_challenges(day_number, is_initial_week);
CREATE INDEX IF NOT EXISTS idx_daily_challenges_difficulty ON daily_challenges(difficulty);

-- Insert initial 7-day challenges
INSERT INTO daily_challenges (day_number, start_character, end_character, description, difficulty, is_initial_week) VALUES
(1, 'Venom', 'Deadpool', 'Connect the symbiote anti-hero to the merc with a mouth', 'Easy', true),
(2, 'Gwen Stacy', 'Polaris', 'Link Spider-Gwen to the magnetic mutant', 'Easy', true),
(3, 'Havok', 'Groot', 'Bridge the plasma-powered mutant to the Guardian of the Galaxy', 'Easy', true),
(4, 'Adam Warlock', 'Pyro', 'Connect the cosmic being to the fire-wielding mutant', 'Easy', true),
(5, 'Kang', 'Kingpin', 'Link the time-traveling conqueror to the crime lord', 'Easy', true),
(6, 'Legion', 'Doctor Octopus', 'Connect the multiple personality mutant to the eight-armed villain', 'Easy', true),
(7, 'Miles Morales', 'Drax', 'Bridge the Ultimate Spider-Man to the Destroyer', 'Easy', true);

-- Insert Medium Difficulty Challenges
INSERT INTO daily_challenges (day_number, start_character, end_character, description, difficulty, is_initial_week) VALUES
(8, 'Moon Knight', 'Silver Surfer', 'Connect the lunar vigilante to the cosmic herald', 'Medium', false),
(9, 'Jessica Jones', 'Beta Ray Bill', 'Link the private investigator to the worthy Korbinite', 'Medium', false),
(10, 'Blade', 'Kitty Pryde', 'Bridge the vampire hunter to the phasing mutant', 'Medium', false),
(11, 'Ghost Rider', 'Storm', 'Connect the spirit of vengeance to the weather goddess', 'Medium', false),
(12, 'Punisher', 'Wasp', 'Link the vigilante to the size-changing Avenger', 'Medium', false),
(13, 'Shang-Chi', 'Thing', 'Bridge the master of kung fu to the rocky Fantastic Four member', 'Medium', false),
(14, 'Black Cat', 'War Machine', 'Connect the cat burglar to the armored Avenger', 'Medium', false),
(15, 'Luke Cage', 'Namor', 'Link the power man to the Sub-Mariner', 'Medium', false),
(16, 'Elektra', 'Vision', 'Bridge the assassin to the synthetic Avenger', 'Medium', false),
(17, 'Daredevil', 'Black Bolt', 'Connect the man without fear to the silent king', 'Medium', false),
(18, 'Iron Fist', 'Scarlet Witch', 'Link the immortal weapon to the reality-warping mutant', 'Medium', false),
(19, 'Mockingbird', 'Colossus', 'Bridge the S.H.I.E.L.D. agent to the steel-skinned X-Man', 'Medium', false),
(20, 'Falcon', 'Emma Frost', 'Connect the winged Avenger to the White Queen', 'Medium', false),
(21, 'Winter Soldier', 'Rogue', 'Link the former assassin to the power-absorbing mutant', 'Medium', false),
(22, 'She-Hulk', 'Cyclops', 'Bridge the jade giantess to the X-Men leader', 'Medium', false);

-- Insert Medium-Hard Difficulty Challenges
INSERT INTO daily_challenges (day_number, start_character, end_character, description, difficulty, is_initial_week) VALUES
(23, 'Mysterio', 'Iceman', 'Connect the master of illusions to the frozen X-Man', 'Medium-Hard', false),
(24, 'Sandman', 'Jubilee', 'Link the granular villain to the fireworks mutant', 'Medium-Hard', false),
(25, 'Bullseye', 'Quicksilver', 'Bridge the perfect marksman to the speedster', 'Medium-Hard', false),
(26, 'Taskmaster', 'Nightcrawler', 'Connect the photographic reflexes villain to the teleporting mutant', 'Medium-Hard', false),
(27, 'Baron Zemo', 'Human Torch', 'Link the masked mastermind to the flaming Fantastic Four member', 'Medium-Hard', false),
(28, 'Vulture', 'Psylocke', 'Bridge the winged villain to the psychic ninja', 'Medium-Hard', false),
(29, 'Lizard', 'Cable', 'Connect the reptilian villain to the time-traveling soldier', 'Medium-Hard', false),
(30, 'Rhino', 'Bishop', 'Link the charging villain to the energy-absorbing mutant', 'Medium-Hard', false),
(31, 'Scorpion', 'Forge', 'Bridge the arachnid villain to the mutant inventor', 'Medium-Hard', false),
(32, 'Shocker', 'Havok', 'Connect the vibro-shock villain to the plasma-powered mutant', 'Medium-Hard', false);

-- Insert Hard Difficulty Challenges
INSERT INTO daily_challenges (day_number, start_character, end_character, description, difficulty, is_initial_week) VALUES
(33, 'Howard the Duck', 'Apocalypse', 'Connect the anthropomorphic duck to the first mutant', 'Hard', false),
(34, 'Squirrel Girl', 'Galactus', 'Link the unbeatable hero to the world devourer', 'Hard', false),
(35, 'Man-Thing', 'Mr. Sinister', 'Bridge the swamp monster to the genetic manipulator', 'Hard', false),
(36, 'Tigra', 'Dormammu', 'Connect the were-woman to the dark dimension ruler', 'Hard', false),
(37, 'Wonder Man', 'Mephisto', 'Link the ionic Avenger to the demon lord', 'Hard', false),
(38, 'Hercules', 'Sabretooth', 'Bridge the Olympian god to the feral mutant', 'Hard', false),
(39, 'Nova', 'Kingpin', 'Connect the human rocket to the crime lord', 'Hard', false),
(40, 'Quasar', 'Mystique', 'Link the quantum-powered hero to the shape-shifting mutant', 'Hard', false),
(41, 'Sentry', 'Toad', 'Bridge the golden guardian to the amphibious mutant', 'Hard', false),
(42, 'Blue Marvel', 'Pyro', 'Connect the antimatter hero to the flame-controlling mutant', 'Hard', false);

-- Insert Very Hard Difficulty Challenges
INSERT INTO daily_challenges (day_number, start_character, end_character, description, difficulty, is_initial_week) VALUES
(43, 'Amadeus Cho', 'Red Skull', 'Connect the genius teenager to the Nazi mastermind', 'Very Hard', false),
(44, 'Silk', 'Ego the Living Planet', 'Link the spider-powered hero to the sentient world', 'Very Hard', false),
(45, 'Miles Morales', 'Fin Fang Foom', 'Bridge the Ultimate Spider-Man to the ancient dragon', 'Very Hard', false),
(46, 'Spider-Woman', 'Kang', 'Connect the arachnid hero to the time conqueror', 'Very Hard', false),
(47, 'Ms. Marvel', 'Annihilus', 'Link the polymorphic hero to the Negative Zone ruler', 'Very Hard', false),
(48, 'America Chavez', 'M.O.D.O.K.', 'Bridge the dimension-hopping hero to the mental organism', 'Very Hard', false),
(49, 'Kate Bishop', 'The Collector', 'Connect the young Hawkeye to the cosmic collector', 'Very Hard', false),
(50, 'Nico Minoru', 'Ronan the Accuser', 'Link the magical Runaway to the Kree supreme accuser', 'Very Hard', false),
(51, 'Cloak', 'Ultron', 'Bridge the darkness-wielding hero to the AI villain', 'Very Hard', false),
(52, 'Dagger', 'Thanos', 'Connect the light-wielding hero to the mad titan', 'Very Hard', false);

-- Insert Ultra Hard Difficulty Challenges
INSERT INTO daily_challenges (day_number, start_character, end_character, description, difficulty, is_initial_week) VALUES
(53, 'Darkhawk', 'Mole Man', 'Connect the armored hero to the subterranean ruler', 'Ultra Hard', false),
(54, 'Firestar', 'The Beyonder', 'Link the microwave-powered mutant to the omnipotent being', 'Ultra Hard', false),
(55, 'Speedball', 'Living Tribunal', 'Bridge the kinetic hero to the cosmic judge', 'Ultra Hard', false),
(56, 'Night Thrasher', 'Eternity', 'Connect the tech-savvy vigilante to the cosmic entity', 'Ultra Hard', false),
(57, 'Sleepwalker', 'Molecule Man', 'Link the dream dimension guardian to the reality manipulator', 'Ultra Hard', false);

-- Enable Row Level Security
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;

-- Create RLS policy - everyone can read challenges
CREATE POLICY "Everyone can view daily challenges" ON daily_challenges
  FOR SELECT TO authenticated, anon;

-- Only authenticated users with admin role can modify (for future admin features)
CREATE POLICY "Only admins can modify challenges" ON daily_challenges
  FOR ALL USING (false); -- Disable for now, can be updated later for admin users
