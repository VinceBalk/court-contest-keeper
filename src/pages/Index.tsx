
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import MainHeader from "@/components/MainHeader";
import MainTabs from "@/components/MainTabs";
import { useTournaments } from "@/hooks/useTournaments";
import { usePlayers } from "@/hooks/usePlayers";
import { useMatches } from "@/hooks/useMatches";
import { useSpecials } from "@/hooks/useSpecials";

export interface Player {
  id: string;
  name: string;
  email: string;
  phone: string;
  skillLevel: number;
  isActive: boolean;
  group: 'top' | 'bottom';
  totalGames: number;
  totalSpecials: number;
  totalPoints: number;
  matchesPlayed: number;
  overallStats: {
    totalPoints: number;
    totalGames: number;
    totalSpecials: number;
    matchesPlayed: number;
    tournamentsPlayed: number;
  };
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  startDate?: string;
  endDate?: string;
  maxPlayers: number;
  currentRound: number;
  totalRounds: number;
}

export interface Match {
  id: string;
  court: number;
  team1: string[];
  team2: string[];
  team1Score: number;
  team2Score: number;
  completed: boolean;
  round: number;
  specialPoints?: { [playerId: string]: number | { [specialType: string]: number } };
  winnerId?: string;
}

const Index = () => {
  // Use React Query hooks to fetch data from Supabase
  const { data: tournaments = [], isLoading: tournamentsLoading } = useTournaments();
  const { data: players = [], isLoading: playersLoading } = usePlayers();
  const { data: specials = [], isLoading: specialsLoading } = useSpecials();
  
  // Get active tournament
  const activeTournament = tournaments.find(t => t.status === 'active') || null;
  const { data: matches = [] } = useMatches(activeTournament?.id);

  // Local state for temporary tournament data (will be persisted via mutations)
  const [localPlayers, setLocalPlayers] = useState<Player[]>([]);
  const [localMatches, setLocalMatches] = useState<Match[]>([]);

  // Merge database players with local tournament-specific data
  const mergedPlayers = players.map(dbPlayer => {
    const localPlayer = localPlayers.find(p => p.id === dbPlayer.id);
    return localPlayer || dbPlayer;
  });

  // Merge database matches with local tournament-specific data
  const mergedMatches = matches.length > 0 ? matches : localMatches;

  if (tournamentsLoading || playersLoading || specialsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tournament data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        <MainHeader activeTournament={activeTournament} />
        
        <MainTabs 
          players={mergedPlayers}
          setPlayers={setLocalPlayers}
          tournaments={tournaments}
          matches={mergedMatches}
          setMatches={setLocalMatches}
          activeTournament={activeTournament}
          specialTypes={specials}
        />
      </div>
      <Toaster />
    </div>
  );
};

export default Index;
