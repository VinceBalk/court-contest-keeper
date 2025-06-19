
-- Create a table for tracking player statistics by round and tournament
CREATE TABLE IF NOT EXISTS public.player_round_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL,
  tournament_id UUID NOT NULL,
  round INTEGER NOT NULL,
  games_won INTEGER NOT NULL DEFAULT 0,
  specials_earned INTEGER NOT NULL DEFAULT 0,
  matches_played INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique combination of player, tournament, and round
  UNIQUE(player_id, tournament_id, round)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_player_round_stats_player_tournament 
ON public.player_round_stats(player_id, tournament_id);

CREATE INDEX IF NOT EXISTS idx_player_round_stats_tournament_round 
ON public.player_round_stats(tournament_id, round);

-- Add columns to players table to track career statistics
ALTER TABLE public.players 
ADD COLUMN IF NOT EXISTS career_promotions INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS career_relegations INTEGER DEFAULT 0;

-- Enable RLS on the new table
ALTER TABLE public.player_round_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the player_round_stats table
CREATE POLICY "Dev access player_round_stats" ON public.player_round_stats FOR ALL USING (true);

-- Add trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_player_round_stats_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_player_round_stats_updated_at
    BEFORE UPDATE ON public.player_round_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_player_round_stats_updated_at();
