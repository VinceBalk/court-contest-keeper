
-- Enable RLS on players table if not already enabled
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read players
CREATE POLICY "Anyone can view players" 
  ON public.players 
  FOR SELECT 
  USING (true);

-- Create policy to allow anyone to insert players
CREATE POLICY "Anyone can create players" 
  ON public.players 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow anyone to update players
CREATE POLICY "Anyone can update players" 
  ON public.players 
  FOR UPDATE 
  USING (true);

-- Create policy to allow anyone to delete players
CREATE POLICY "Anyone can delete players" 
  ON public.players 
  FOR DELETE 
  USING (true);
