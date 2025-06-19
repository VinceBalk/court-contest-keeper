
-- First, drop all existing policies to start fresh
DROP POLICY IF EXISTS "Tournament creators can update their tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Tournament creators can delete their tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Tournament creators can manage matches" ON public.matches;
DROP POLICY IF EXISTS "Tournament creators can manage tournament players" ON public.tournament_players;
DROP POLICY IF EXISTS "Tournament creators can manage tournament specials" ON public.tournament_specials;
DROP POLICY IF EXISTS "Tournament creators can manage rankings" ON public.rankings;
DROP POLICY IF EXISTS "Tournament creators can manage sets" ON public.sets;
DROP POLICY IF EXISTS "Tournament creators can manage match statistics" ON public.match_statistics;
DROP POLICY IF EXISTS "Tournament creators can manage court settings" ON public.tournament_court_settings;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Authenticated users can view tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Authenticated users can create tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Authenticated users can view matches" ON public.matches;
DROP POLICY IF EXISTS "Authenticated users can view players" ON public.players;
DROP POLICY IF EXISTS "Authenticated users can create players" ON public.players;
DROP POLICY IF EXISTS "Authenticated users can update players" ON public.players;
DROP POLICY IF EXISTS "Authenticated users can view specials" ON public.specials;
DROP POLICY IF EXISTS "Authenticated users can create specials" ON public.specials;
DROP POLICY IF EXISTS "Special creators can update their specials" ON public.specials;

-- Drop dev policies that might exist (except audit_log which doesn't exist yet)
DROP POLICY IF EXISTS "Dev access tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Dev access matches" ON public.matches;
DROP POLICY IF EXISTS "Dev access players" ON public.players;
DROP POLICY IF EXISTS "Dev access specials" ON public.specials;
DROP POLICY IF EXISTS "Dev access tournament_players" ON public.tournament_players;
DROP POLICY IF EXISTS "Dev access tournament_specials" ON public.tournament_specials;
DROP POLICY IF EXISTS "Dev access rankings" ON public.rankings;
DROP POLICY IF EXISTS "Dev access sets" ON public.sets;
DROP POLICY IF EXISTS "Dev access match_statistics" ON public.match_statistics;
DROP POLICY IF EXISTS "Dev access court_settings" ON public.tournament_court_settings;
DROP POLICY IF EXISTS "Dev access user_roles" ON public.user_roles;

-- Enable RLS on all tables that don't have it yet
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_specials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_court_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Since auth is disabled, create temporary permissive policies for development
-- These should be replaced with proper auth-based policies when auth is enabled
CREATE POLICY "Dev access tournaments" ON public.tournaments FOR ALL USING (true);
CREATE POLICY "Dev access matches" ON public.matches FOR ALL USING (true);
CREATE POLICY "Dev access players" ON public.players FOR ALL USING (true); 
CREATE POLICY "Dev access specials" ON public.specials FOR ALL USING (true);
CREATE POLICY "Dev access tournament_players" ON public.tournament_players FOR ALL USING (true);
CREATE POLICY "Dev access tournament_specials" ON public.tournament_specials FOR ALL USING (true);
CREATE POLICY "Dev access rankings" ON public.rankings FOR ALL USING (true);
CREATE POLICY "Dev access sets" ON public.sets FOR ALL USING (true);
CREATE POLICY "Dev access match_statistics" ON public.match_statistics FOR ALL USING (true);
CREATE POLICY "Dev access court_settings" ON public.tournament_court_settings FOR ALL USING (true);
CREATE POLICY "Dev access user_roles" ON public.user_roles FOR ALL USING (true);

-- Add basic validation constraints (using proper syntax)
DO $$ 
BEGIN
    -- Add constraints only if they don't already exist
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_max_players') THEN
        ALTER TABLE public.tournaments ADD CONSTRAINT valid_max_players CHECK (max_players > 0 AND max_players <= 64);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_current_round') THEN
        ALTER TABLE public.tournaments ADD CONSTRAINT valid_current_round CHECK (current_round > 0);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_total_rounds') THEN
        ALTER TABLE public.tournaments ADD CONSTRAINT valid_total_rounds CHECK (total_rounds > 0);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_skill_level') THEN
        ALTER TABLE public.players ADD CONSTRAINT valid_skill_level CHECK (skill_level >= 1 AND skill_level <= 10);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_name_length') THEN
        ALTER TABLE public.players ADD CONSTRAINT valid_name_length CHECK (char_length(name) >= 2);
    END IF;
END $$;

-- Add audit trail table for tracking important changes
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_values JSONB,
  new_values JSONB,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit log after creating it
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Dev access audit_log" ON public.audit_log FOR ALL USING (true);
