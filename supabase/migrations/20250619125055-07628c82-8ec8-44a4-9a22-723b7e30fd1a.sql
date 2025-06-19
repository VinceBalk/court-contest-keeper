
-- First, let's clean up any potential duplicate data and fix the constraint issue
DELETE FROM public.matches WHERE id IN (
    SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (
            PARTITION BY tournament_id, round, match_number 
            ORDER BY created_at
        ) as rn
        FROM public.matches
    ) t WHERE t.rn > 1
);

-- Add color customization to court settings
ALTER TABLE public.tournament_court_settings 
ADD COLUMN IF NOT EXISTS court_color TEXT DEFAULT '#3B82F6';

-- Create an index to prevent future duplicates more efficiently
CREATE UNIQUE INDEX IF NOT EXISTS idx_matches_unique_tournament_round_match 
ON public.matches(tournament_id, round, match_number) 
WHERE tournament_id IS NOT NULL;

-- Update existing court settings with default colors
UPDATE public.tournament_court_settings 
SET court_color = CASE 
    WHEN court_number = 1 THEN '#3B82F6'  -- Blue
    WHEN court_number = 2 THEN '#10B981'  -- Green  
    WHEN court_number = 3 THEN '#F59E0B'  -- Orange
    WHEN court_number = 4 THEN '#EF4444'  -- Red
    ELSE '#6B7280'  -- Gray for any additional courts
END
WHERE court_color IS NULL OR court_color = '#3B82F6';
