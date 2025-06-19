
-- First, let's add proper foreign key constraints to ensure cascading deletes
-- This will ensure when matches are deleted, dependent data is also cleaned up

-- Add foreign key constraints for match_statistics
ALTER TABLE match_statistics 
ADD CONSTRAINT fk_match_statistics_match 
FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE;

ALTER TABLE match_statistics 
ADD CONSTRAINT fk_match_statistics_player 
FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE;

-- Add foreign key constraints for sets
ALTER TABLE sets 
ADD CONSTRAINT fk_sets_match 
FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE;

-- Add foreign key constraints for matches
ALTER TABLE matches 
ADD CONSTRAINT fk_matches_tournament 
FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE;

ALTER TABLE matches 
ADD CONSTRAINT fk_matches_player1 
FOREIGN KEY (player1_id) REFERENCES players(id) ON DELETE SET NULL;

ALTER TABLE matches 
ADD CONSTRAINT fk_matches_player1_partner 
FOREIGN KEY (player1_partner_id) REFERENCES players(id) ON DELETE SET NULL;

ALTER TABLE matches 
ADD CONSTRAINT fk_matches_player2 
FOREIGN KEY (player2_id) REFERENCES players(id) ON DELETE SET NULL;

ALTER TABLE matches 
ADD CONSTRAINT fk_matches_player2_partner 
FOREIGN KEY (player2_partner_id) REFERENCES players(id) ON DELETE SET NULL;

-- Add foreign key constraints for tournament_players
ALTER TABLE tournament_players 
ADD CONSTRAINT fk_tournament_players_tournament 
FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE;

ALTER TABLE tournament_players 
ADD CONSTRAINT fk_tournament_players_player 
FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE;

-- Add foreign key constraints for tournament_specials
ALTER TABLE tournament_specials 
ADD CONSTRAINT fk_tournament_specials_tournament 
FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE;

ALTER TABLE tournament_specials 
ADD CONSTRAINT fk_tournament_specials_special 
FOREIGN KEY (special_id) REFERENCES specials(id) ON DELETE CASCADE;

-- Add foreign key constraints for rankings
ALTER TABLE rankings 
ADD CONSTRAINT fk_rankings_tournament 
FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE;

ALTER TABLE rankings 
ADD CONSTRAINT fk_rankings_player 
FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE;

-- Add a column to matches table to store the group (linker/rechter rijtje)
ALTER TABLE matches ADD COLUMN IF NOT EXISTS match_group TEXT DEFAULT 'top';

-- Create a table for court settings per tournament
CREATE TABLE IF NOT EXISTS tournament_court_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  court_number INTEGER NOT NULL,
  court_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tournament_id, court_number)
);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE TRIGGER update_tournament_court_settings_updated_at
  BEFORE UPDATE ON tournament_court_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default court names for existing tournaments
INSERT INTO tournament_court_settings (tournament_id, court_number, court_name)
SELECT 
  t.id,
  generate_series(1, 4) as court_number,
  'Court ' || generate_series(1, 4) as court_name
FROM tournaments t
ON CONFLICT (tournament_id, court_number) DO NOTHING;
