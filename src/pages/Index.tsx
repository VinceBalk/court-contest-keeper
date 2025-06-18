
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import MainHeader from "@/components/MainHeader";
import MainTabs from "@/components/MainTabs";
import { usePlayers } from "@/hooks/usePlayers";
import { useTournaments } from "@/hooks/useTournaments";
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
  group?: 'top' | 'bottom';
  tournamentId?: string;
  specialPoints?: { [playerId: string]: number | { [specialType: string]: number } };
  winnerId?: string;
}

export interface SpecialType {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

const Index = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState("tournaments");
  const [currentRound, setCurrentRound] = useState(1);

  // Use Supabase hooks for data fetching
  const { data: tournaments = [] } = useTournaments();
  const { data: players = [] } = usePlayers();
  const { data: matches = [] } = useMatches();
  const { data: specialTypesData = [] } = useSpecials();

  // Transform special types to match the expected interface
  const specialTypes: SpecialType[] = specialTypesData.map(special => ({
    id: special.id,
    name: special.name,
    description: special.description || '',
    isActive: special.isActive,
  }));

  // Get active tournament
  const activeTournament = tournaments.find(t => t.status === 'active') || null;

  // Mock setters for props compatibility (data updates happen through mutations)
  const setTournaments = () => {
    console.log('Tournament updates are handled through Supabase mutations');
  };
  
  const setPlayers = () => {
    console.log('Player updates are handled through Supabase mutations');
  };
  
  const setMatches = () => {
    console.log('Match updates are handled through Supabase mutations');
  };
  
  const setSpecialTypes = () => {
    console.log('Special type updates are handled through Supabase mutations');
  };

  const setActiveTournament = (tournament: Tournament | null) => {
    console.log('Active tournament setting will be handled through tournament mutations');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        <MainHeader activeTournament={activeTournament} />
        
        <MainTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          players={players}
          setPlayers={setPlayers}
          tournaments={tournaments}
          setTournaments={setTournaments}
          matches={matches}
          setMatches={setMatches}
          activeTournament={activeTournament}
          setActiveTournament={setActiveTournament}
          setCurrentRound={setCurrentRound}
          currentRound={currentRound}
          specialTypes={specialTypes}
          setSpecialTypes={setSpecialTypes}
        />
      </div>
      <Toaster />
    </div>
  );
};

export default Index;
