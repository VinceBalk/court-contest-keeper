
-- Add group column to players table to store player group assignment
ALTER TABLE public.players 
ADD COLUMN player_group TEXT CHECK (player_group IN ('top', 'bottom')) DEFAULT 'top';

-- Update the column to be NOT NULL after setting default
ALTER TABLE public.players 
ALTER COLUMN player_group SET NOT NULL;
