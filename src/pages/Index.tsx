import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlayerManagement from "@/components/PlayerManagement";
import TournamentSchedule from "@/components/TournamentSchedule";
import Rankings from "@/components/Rankings";
import TournamentManagement from "@/components/TournamentManagement";
import SpecialManagement, { SpecialType } from "@/components/SpecialManagement";
import RoundNavigation from "@/components/RoundNavigation";
import { Trophy, Users, Calendar, Target, Star } from "lucide-react";

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
  date: string;
  isActive: boolean;
  completed: boolean;
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
  const activePlayers = players.filter(p => p.isActive);
  const topGroupPlayers = activePlayers.filter(p => p.group === 'top').sort((a, b) => a.name.localeCompare(b.name));
  const bottomGroupPlayers = activePlayers.filter(p => p.group === 'bottom').sort((a, b) => a.name.localeCompare(b.name));

  const handleStatsCardClick = (cardType: string) => {
    switch(cardType) {
      case 'totalPlayers':
        setActiveTab('players');
        break;
      case 'specialTypes':
        setActiveTab('specials');
        break;
      case 'activePlayers':
        setActiveTab('players');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-10 w-10 text-yellow-500" />
            <h1 className="text-4xl font-bold text-gray-800">Padel Tournament Manager</h1>
          </div>
          <p className="text-lg text-gray-600">Track your tournaments, matches, and player rankings</p>
          {activeTournament && (
            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
              <p className="text-blue-800 font-medium">Active Tournament: {activeTournament.name}</p>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card 
            className="bg-white/80 backdrop-blur-sm border-blue-200 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleStatsCardClick('activePlayers')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Players</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{activePlayers.length}</div>
              <p className="text-xs text-gray-600">
                Linker: {topGroupPlayers.length}/8, Rechter: {bottomGroupPlayers.length}/8
              </p>
            </CardContent>
          </Card>

          <Card 
            className="bg-white/80 backdrop-blur-sm border-green-200 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleStatsCardClick('totalPlayers')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Players</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{players.length}</div>
              <p className="text-xs text-gray-600">
                Available player pool
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Round</CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {activeTournament ? `${currentRound}/3` : '-'}
              </div>
              <p className="text-xs text-gray-600">Tournament Progress</p>
            </CardContent>
          </Card>

          <Card 
            className="bg-white/80 backdrop-blur-sm border-orange-200 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleStatsCardClick('specialTypes')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Special Types</CardTitle>
              <Star className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {specialTypes.filter(s => s.isActive).length}
              </div>
              <p className="text-xs text-gray-600">Active Special Types</p>
            </CardContent>
          </Card>
        </div>

        {activeTournament && (
          <div className="mb-8">
            <RoundNavigation 
              matches={activeTournamentMatches}
              activeTournament={activeTournament}
              currentRound={currentRound}
            />
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="tournaments" className="data-[state=active]:bg-orange-100">
              Tournaments
            </TabsTrigger>
            <TabsTrigger value="players" className="data-[state=active]:bg-blue-100">
              Players & Groups
            </TabsTrigger>
            <TabsTrigger value="specials" className="data-[state=active]:bg-purple-100">
              Special Types
            </TabsTrigger>
            <TabsTrigger value="matches" className="data-[state=active]:bg-green-100">
              Matches & Schedule
            </TabsTrigger>
            <TabsTrigger value="rankings" className="data-[state=active]:bg-yellow-100">
              Rankings & Stats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tournaments">
            <TournamentManagement 
              tournaments={tournaments}
              setTournaments={setTournaments}
              activeTournament={activeTournament}
              setActiveTournament={setActiveTournament}
              setCurrentRound={setCurrentRound}
              players={players}
              setPlayers={setPlayers}
            />
          </TabsContent>

          <TabsContent value="players">
            <PlayerManagement 
              players={players} 
              setPlayers={setPlayers}
              matches={activeTournamentMatches}
            />
          </TabsContent>

          <TabsContent value="specials">
            <SpecialManagement 
              specialTypes={specialTypes}
              setSpecialTypes={setSpecialTypes}
            />
          </TabsContent>

          <TabsContent value="matches">
            <TournamentSchedule 
              players={players}
              matches={activeTournamentMatches}
              setMatches={setMatches}
              currentRound={currentRound}
              setCurrentRound={setCurrentRound}
              setPlayers={setPlayers}
              activeTournament={activeTournament}
              specialTypes={specialTypes}
            />
          </TabsContent>

          <TabsContent value="rankings">
            <Rankings 
              players={players}
              matches={activeTournamentMatches}
              currentRound={currentRound}
              activeTournament={activeTournament}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
