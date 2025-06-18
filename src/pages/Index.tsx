
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import MainHeader from "@/components/MainHeader";
import MainTabs from "@/components/MainTabs";
import { useLocalStorage } from "@/hooks/useLocalStorage";

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

  // Use local storage for persistence
  const [tournaments, setTournaments] = useLocalStorage<Tournament[]>('tournaments', []);
  const [players, setPlayers] = useLocalStorage<Player[]>('players', []);
  const [matches, setMatches] = useLocalStorage<Match[]>('matches', []);
  const [specialTypes, setSpecialTypes] = useLocalStorage<SpecialType[]>('specialTypes', [
    {
      id: '1',
      name: 'Golden Point',
      description: 'Extra point for special shots',
      isActive: true
    },
    {
      id: '2',
      name: 'Ace',
      description: 'Point for aces',
      isActive: true
    }
  ]);

  // Get active tournament
  const activeTournament = tournaments.find(t => t.status === 'active') || null;

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
          setActiveTournament={(tournament) => {
            const updatedTournaments = tournaments.map(t => ({
              ...t,
              status: t.id === tournament?.id ? 'active' as const : 
                     t.status === 'active' ? 'draft' as const : t.status
            }));
            setTournaments(updatedTournaments);
          }}
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
