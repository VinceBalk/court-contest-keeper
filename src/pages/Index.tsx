
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlayerManagement from "@/components/PlayerManagement";
import TournamentSchedule from "@/components/TournamentSchedule";
import Rankings from "@/components/Rankings";
import { Trophy, Users, Calendar, Target } from "lucide-react";

export interface Player {
  id: string;
  name: string;
  group: 'top' | 'bottom';
  totalGames: number;
  totalSpecials: number;
  totalPoints: number;
  matchesPlayed: number;
}

export interface Match {
  id: string;
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
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentRound, setCurrentRound] = useState(1);

  const topGroupPlayers = players.filter(p => p.group === 'top');
  const bottomGroupPlayers = players.filter(p => p.group === 'bottom');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-10 w-10 text-yellow-500" />
            <h1 className="text-4xl font-bold text-gray-800">Padel Tournament Manager</h1>
          </div>
          <p className="text-lg text-gray-600">Track your tournaments, matches, and player rankings</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Players</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{players.length}/16</div>
              <p className="text-xs text-gray-600">
                Top: {topGroupPlayers.length}/8, Bottom: {bottomGroupPlayers.length}/8
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Round</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{currentRound}/3</div>
              <p className="text-xs text-gray-600">Tournament Progress</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Matches Completed</CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {matches.filter(m => m.completed).length}/{matches.length}
              </div>
              <p className="text-xs text-gray-600">This Round</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courts Active</CardTitle>
              <Trophy className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">4</div>
              <p className="text-xs text-gray-600">2 per group</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="players" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="players" className="data-[state=active]:bg-blue-100">
              Players & Groups
            </TabsTrigger>
            <TabsTrigger value="matches" className="data-[state=active]:bg-green-100">
              Matches & Schedule
            </TabsTrigger>
            <TabsTrigger value="rankings" className="data-[state=active]:bg-purple-100">
              Rankings & Stats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="players">
            <PlayerManagement 
              players={players} 
              setPlayers={setPlayers}
            />
          </TabsContent>

          <TabsContent value="matches">
            <TournamentSchedule 
              players={players}
              matches={matches}
              setMatches={setMatches}
              currentRound={currentRound}
              setCurrentRound={setCurrentRound}
              setPlayers={setPlayers}
            />
          </TabsContent>

          <TabsContent value="rankings">
            <Rankings 
              players={players}
              matches={matches}
              currentRound={currentRound}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
