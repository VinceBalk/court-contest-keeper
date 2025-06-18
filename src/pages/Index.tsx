
import { useState } from "react";
import RoundNavigation from "@/components/RoundNavigation";
import { SpecialType } from "@/components/SpecialManagement";
import StatsCards from "@/components/StatsCards";
import MainHeader from "@/components/MainHeader";
import MainTabs from "@/components/MainTabs";

export interface Player {
  id: string;
  name: string;
  group: 'top' | 'bottom';
  totalGames: number;
  totalSpecials: number;
  totalPoints: number;
  matchesPlayed: number;
  isActive: boolean; // Whether player is participating in current tournament
  overallStats: {
    totalGames: number;
    totalSpecials: number;
    totalPoints: number;
    matchesPlayed: number;
    tournamentsPlayed: number;
  };
}

export interface Tournament {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  completed: boolean;
  maxPlayers: number; // Maximum number of players allowed (default 16)
}

export interface Match {
  id: string;
  tournamentId: string;
  round: number;
  group: 'top' | 'bottom';
  court: number;
  team1: [string, string]; // player IDs
  team2: [string, string]; // player IDs
  team1Score: number;
  team2Score: number;
  specialPoints: { [playerId: string]: number };
  completed: boolean;
}

const Index = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [activeTournament, setActiveTournament] = useState<Tournament | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [activeTab, setActiveTab] = useState("tournaments");
  const [specialTypes, setSpecialTypes] = useState<SpecialType[]>([
    { id: 'ace', name: 'Ace', description: 'Unreturnable serve', isActive: true },
    { id: 'winner', name: 'Winner', description: 'Shot that wins the point', isActive: true },
    { id: 'smash', name: 'Smash', description: 'Overhead winning shot', isActive: true },
    { id: 'via-glass', name: 'Via Glass', description: 'Shot off the glass walls', isActive: true },
    { id: 'out-of-cage', name: 'Out of Cage', description: 'Shot that goes out of bounds', isActive: true },
  ]);

  const activeTournamentMatches = matches.filter(m => m.tournamentId === activeTournament?.id);

  // Save tournaments to localStorage whenever they change
  const handleSetTournaments = (newTournaments: Tournament[]) => {
    setTournaments(newTournaments);
    localStorage.setItem('tournaments', JSON.stringify(newTournaments));
  };

  // Save matches to localStorage whenever they change
  const handleSetMatches = (newMatches: Match[]) => {
    setMatches(newMatches);
    localStorage.setItem('tournament-matches', JSON.stringify(newMatches));
  };

  // Save players to localStorage whenever they change
  const handleSetPlayers = (newPlayers: Player[]) => {
    setPlayers(newPlayers);
    localStorage.setItem('tournament-players', JSON.stringify(newPlayers));
  };

  // Save special types to localStorage whenever they change
  const handleSetSpecialTypes = (newSpecialTypes: SpecialType[]) => {
    setSpecialTypes(newSpecialTypes);
    localStorage.setItem('special-types', JSON.stringify(newSpecialTypes));
  };

  // Save active tournament to localStorage whenever it changes
  const handleSetActiveTournament = (tournament: Tournament | null) => {
    setActiveTournament(tournament);
    localStorage.setItem('active-tournament', JSON.stringify(tournament));
  };

  const handleStatsCardClick = (cardType: string) => {
    switch(cardType) {
      case 'totalPlayers':
        setActiveTab('players');
        break;
      case 'specials':
        setActiveTab('specials');
        break;
      case 'activePlayers':
        setActiveTab('players');
        break;
      case 'settings':
        setActiveTab('settings');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        <MainHeader activeTournament={activeTournament} />

        <StatsCards 
          players={players}
          activeTournament={activeTournament}
          currentRound={currentRound}
          specialTypes={specialTypes}
          tournaments={tournaments}
          onStatsCardClick={handleStatsCardClick}
        />

        {activeTournament && (
          <div className="mb-8">
            <RoundNavigation 
              matches={activeTournamentMatches}
              activeTournament={activeTournament}
              currentRound={currentRound}
            />
          </div>
        )}

        <MainTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tournaments={tournaments}
          setTournaments={handleSetTournaments}
          activeTournament={activeTournament}
          setActiveTournament={handleSetActiveTournament}
          setCurrentRound={setCurrentRound}
          players={players}
          setPlayers={handleSetPlayers}
          matches={matches}
          setMatches={handleSetMatches}
          currentRound={currentRound}
          specialTypes={specialTypes}
          setSpecialTypes={handleSetSpecialTypes}
        />
      </div>
    </div>
  );
};

export default Index;
