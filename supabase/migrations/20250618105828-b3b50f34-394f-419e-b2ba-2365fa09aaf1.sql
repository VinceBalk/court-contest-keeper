
-- Create enum types for better data integrity
CREATE TYPE tournament_status AS ENUM ('draft', 'active', 'completed', 'cancelled');
CREATE TYPE match_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
CREATE TYPE player_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE special_type AS ENUM ('golden_point', 'super_tie_break', 'no_advantage', 'short_sets');

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'moderator', 'player', 'viewer')),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assigned_by UUID REFERENCES public.profiles(id),
  UNIQUE(user_id, role)
);

-- Create tournaments table
CREATE TABLE public.tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status tournament_status DEFAULT 'draft',
  start_date DATE,
  end_date DATE,
  max_players INTEGER DEFAULT 16,
  current_round INTEGER DEFAULT 1,
  total_rounds INTEGER,
  scoring_system JSONB DEFAULT '{"sets_to_win": 2, "games_to_win": 6, "tie_break_at": 6}',
  special_rules JSONB DEFAULT '[]',
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create players table
CREATE TABLE public.players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  skill_level INTEGER CHECK (skill_level BETWEEN 1 AND 10),
  status player_status DEFAULT 'active',
  total_matches_played INTEGER DEFAULT 0,
  total_matches_won INTEGER DEFAULT 0,
  total_sets_won INTEGER DEFAULT 0,
  total_sets_lost INTEGER DEFAULT 0,
  total_games_won INTEGER DEFAULT 0,
  total_games_lost INTEGER DEFAULT 0,
  ranking_points DECIMAL(10,2) DEFAULT 0,
  profile_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tournament_players junction table
CREATE TABLE public.tournament_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
  seed INTEGER,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tournament_id, player_id)
);

-- Create matches table
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  round INTEGER NOT NULL,
  match_number INTEGER NOT NULL,
  player1_id UUID REFERENCES public.players(id),
  player2_id UUID REFERENCES public.players(id),
  player1_partner_id UUID REFERENCES public.players(id),
  player2_partner_id UUID REFERENCES public.players(id),
  status match_status DEFAULT 'pending',
  scheduled_time TIMESTAMP WITH TIME ZONE,
  actual_start_time TIMESTAMP WITH TIME ZONE,
  actual_end_time TIMESTAMP WITH TIME ZONE,
  court_number INTEGER,
  winner_team INTEGER CHECK (winner_team IN (1, 2)),
  score JSONB DEFAULT '{"sets": [], "current_set": {"team1_games": 0, "team2_games": 0}}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tournament_id, round, match_number)
);

-- Create sets table for detailed score tracking
CREATE TABLE public.sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  team1_games INTEGER DEFAULT 0,
  team2_games INTEGER DEFAULT 0,
  team1_tie_break_points INTEGER DEFAULT 0,
  team2_tie_break_points INTEGER DEFAULT 0,
  is_tie_break BOOLEAN DEFAULT false,
  is_completed BOOLEAN DEFAULT false,
  winner_team INTEGER CHECK (winner_team IN (1, 2)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(match_id, set_number)
);

-- Create specials table for special tournament rules
CREATE TABLE public.specials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type special_type NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  configuration JSONB DEFAULT '{}',
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tournament_specials junction table
CREATE TABLE public.tournament_specials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  special_id UUID REFERENCES public.specials(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  applied_from_round INTEGER DEFAULT 1,
  UNIQUE(tournament_id, special_id)
);

-- Create rankings table for tournament standings
CREATE TABLE public.rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
  position INTEGER,
  points DECIMAL(10,2) DEFAULT 0,
  matches_played INTEGER DEFAULT 0,
  matches_won INTEGER DEFAULT 0,
  sets_won INTEGER DEFAULT 0,
  sets_lost INTEGER DEFAULT 0,
  games_won INTEGER DEFAULT 0,
  games_lost INTEGER DEFAULT 0,
  games_difference INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tournament_id, player_id)
);

-- Create match_statistics table for detailed match stats
CREATE TABLE public.match_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
  aces INTEGER DEFAULT 0,
  double_faults INTEGER DEFAULT 0,
  winners INTEGER DEFAULT 0,
  unforced_errors INTEGER DEFAULT 0,
  net_points_won INTEGER DEFAULT 0,
  net_points_total INTEGER DEFAULT 0,
  break_points_won INTEGER DEFAULT 0,
  break_points_total INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(match_id, player_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_specials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_statistics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Create RLS policies for user_roles (admins can manage all roles)
CREATE POLICY "Everyone can view user roles" ON public.user_roles FOR SELECT TO authenticated USING (true);

-- Create RLS policies for tournaments (public read, authenticated write)
CREATE POLICY "Everyone can view tournaments" ON public.tournaments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create tournaments" ON public.tournaments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Tournament creators can update their tournaments" ON public.tournaments FOR UPDATE TO authenticated USING (created_by = auth.uid());

-- Create RLS policies for players (public read, authenticated write)
CREATE POLICY "Everyone can view players" ON public.players FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create players" ON public.players FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update players" ON public.players FOR UPDATE TO authenticated USING (true);

-- Create RLS policies for tournament_players
CREATE POLICY "Everyone can view tournament players" ON public.tournament_players FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage tournament players" ON public.tournament_players FOR ALL TO authenticated USING (true);

-- Create RLS policies for matches
CREATE POLICY "Everyone can view matches" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage matches" ON public.matches FOR ALL TO authenticated USING (true);

-- Create RLS policies for sets
CREATE POLICY "Everyone can view sets" ON public.sets FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage sets" ON public.sets FOR ALL TO authenticated USING (true);

-- Create RLS policies for specials
CREATE POLICY "Everyone can view specials" ON public.specials FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create specials" ON public.specials FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Special creators can update their specials" ON public.specials FOR UPDATE TO authenticated USING (created_by = auth.uid());

-- Create RLS policies for tournament_specials
CREATE POLICY "Everyone can view tournament specials" ON public.tournament_specials FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage tournament specials" ON public.tournament_specials FOR ALL TO authenticated USING (true);

-- Create RLS policies for rankings
CREATE POLICY "Everyone can view rankings" ON public.rankings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage rankings" ON public.rankings FOR ALL TO authenticated USING (true);

-- Create RLS policies for match_statistics
CREATE POLICY "Everyone can view match statistics" ON public.match_statistics FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage match statistics" ON public.match_statistics FOR ALL TO authenticated USING (true);

-- Create function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, first_name, last_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.email
  );
  
  -- Assign default 'player' role to new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'player');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON public.tournaments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON public.players FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON public.matches FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_specials_updated_at BEFORE UPDATE ON public.specials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_rankings_updated_at BEFORE UPDATE ON public.rankings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default special rules
INSERT INTO public.specials (name, type, description, configuration) VALUES
('Golden Point', 'golden_point', 'When the score reaches deuce, the next point wins the game', '{"applies_at": "deuce"}'),
('Super Tie Break', 'super_tie_break', 'First to 10 points wins the set (must win by 2)', '{"points_to_win": 10, "win_by": 2}'),
('No Advantage', 'no_advantage', 'No advantage scoring - deuce point wins the game', '{"no_deuce": true}'),
('Short Sets', 'short_sets', 'First to 4 games wins the set', '{"games_to_win": 4}');
