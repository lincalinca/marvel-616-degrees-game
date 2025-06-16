-- First, let's check what's currently in the database
SELECT * FROM daily_challenges WHERE is_initial_week = true ORDER BY day_number;

-- Delete any incorrect initial week challenges
DELETE FROM daily_challenges WHERE is_initial_week = true;

-- Insert the correct initial 7-day challenges
INSERT INTO daily_challenges (day_number, start_character, end_character, description, difficulty, is_initial_week) VALUES
(1, 'Venom', 'Deadpool', 'Connect the symbiote anti-hero to the merc with a mouth', 'Easy', true),
(2, 'Gwen Stacy', 'Polaris', 'Link Spider-Gwen to the magnetic mutant', 'Easy', true),
(3, 'Havok', 'Groot', 'Bridge the plasma-powered mutant to the Guardian of the Galaxy', 'Easy', true),
(4, 'Adam Warlock', 'Pyro', 'Connect the cosmic being to the fire-wielding mutant', 'Easy', true),
(5, 'Kang', 'Kingpin', 'Link the time-traveling conqueror to the crime lord', 'Easy', true),
(6, 'Legion', 'Doctor Octopus', 'Connect the multiple personality mutant to the eight-armed villain', 'Easy', true),
(7, 'Miles Morales', 'Drax', 'Bridge the Ultimate Spider-Man to the Destroyer', 'Easy', true)
ON CONFLICT (day_number, is_initial_week) DO UPDATE SET
  start_character = EXCLUDED.start_character,
  end_character = EXCLUDED.end_character,
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty,
  updated_at = NOW();
