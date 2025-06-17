import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Award, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { Player, Match, Tournament } from "@/pages/Index";

interface RankingsProps {
  players: Player[];
  matches: Match[];
  currentRound: number;
  activeTournament: Tournament | null;
}

const Rankings = ({ players, matches, currentRound, activeTournament }: RankingsProps) => {
  const topGroupPlayers = players
    .filter(p => p.group === 'top')
    .sort((a, b) => b.totalPoints - a.totalPoints);
  
  const bottomGroupPlayers = players
    .filter(p => p.group === 'bottom')
    .sort((a, b) => b.totalPoints - a.totalPoints);

  const overallRankings = players
    .sort((a, b) => b.overallStats.totalPoints - a.overallStats.totalPoints);

  const getRankIcon = (position: number, group: 'top' | 'bottom') => {
    if (group === 'top') {
      if (position === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
      if (position === 2) return <Medal className="h-5 w-5 text-gray-400" />;
      if (position === 3) return <Award className="h-5 w-5 text-amber-600" />;
    }
    return null;
  };

  const getPromotionStatus = (position: number, group: 'top' | 'bottom') => {
    if (group === 'bottom' && position === 1 && currentRound >= 3) {
      return { status: 'promote', icon: <TrendingUp className="h-4 w-4 text-green-600" />, text: 'Promotes' };
    }
    if (group === 'top' && position === topGroupPlayers.length && currentRound >= 3) {
      return { status: 'relegate', icon: <TrendingDown className="h-4 w-4 text-red-600" />, text: 'Relegates' };
    }
    return null;
  };

  const renderTournamentPlayerRow = (player: Player, position: number, group: 'top' | 'bottom') => {
    const promotion = getPromotionStatus(position, group);
    
    return (
      <div key={player.id} className="flex items-center justify-between p-4 bg-white/70 rounded-lg border">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 w-12">
            <span className="font-bold text-lg">{position}</span>
            {getRankIcon(position, group)}
          </div>
          <div>
            <p className="font-medium text-gray-800">{player.name}</p>
            <p className="text-sm text-gray-600">
              Games: {player.totalGames} | Specials: {player.totalSpecials} | Matches: {player.matchesPlayed}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {promotion && (
            <Badge 
              variant="outline" 
              className={`${promotion.status === 'promote' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'}`}
            >
              {promotion.icon}
              {promotion.text}
            </Badge>
          )}
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{player.totalPoints}</div>
            <div className="text-xs text-gray-500">Tournament Points</div>
          </div>
        </div>
      </div>
    );
  };

  const renderOverallPlayerRow = (player: Player, position: number) => {
    return (
      <div key={player.id} className="flex items-center justify-between p-4 bg-white/70 rounded-lg border">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 w-12">
            <span className="font-bold text-lg">{position}</span>
            {position === 1 && <Trophy className="h-5 w-5 text-yellow-500" />}
            {position === 2 && <Medal className="h-5 w-5 text-gray-400" />}
            {position === 3 && <Award className="h-5 w-5 text-amber-600" />}
          </div>
          <div>
            <p className="font-medium text-gray-800">{player.name}</p>
            <p className="text-sm text-gray-600">
              Tournaments: {player.overallStats.tournamentsPlayed} | 
              Games: {player.overallStats.totalGames} | 
              Matches: {player.overallStats.matchesPlayed}
            </p>
            <Badge variant="outline" className={`text-xs ${
              player.group === 'top' 
                ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                : 'bg-blue-100 text-blue-700 border-blue-300'
            }`}>
              Current: {player.group === 'top' ? 'Linker Rijtje' : 'Rechter Rijtje'}
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-600">{player.overallStats.totalPoints}</div>
          <div className="text-xs text-gray-500">Overall Points</div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Rankings & Statistics</h2>
        {activeTournament ? (
          <p className="text-gray-600">{activeTournament.name} - Round {currentRound}</p>
        ) : (
          <p className="text-gray-600">No active tournament</p>
        )}
      </div>

      <Tabs defaultValue="tournament" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm">
          <TabsTrigger value="tournament" className="data-[state=active]:bg-blue-100">
            Current Tournament
          </TabsTrigger>
          <TabsTrigger value="overall" className="data-[state=active]:bg-purple-100">
            Overall Rankings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tournament">
          {activeTournament ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-700">
                      <Trophy className="h-6 w-6" />
                      Linker Rijtje Rankings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {topGroupPlayers.map((player, index) => 
                        renderTournamentPlayerRow(player, index + 1, 'top')
                      )}
                      {topGroupPlayers.length === 0 && (
                        <p className="text-center text-gray-500 py-8">No players in Linker Rijtje yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                      <Award className="h-6 w-6" />
                      Rechter Rijtje Rankings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {bottomGroupPlayers.map((player, index) => 
                        renderTournamentPlayerRow(player, index + 1, 'bottom')
                      )}
                      {bottomGroupPlayers.length === 0 && (
                        <p className="text-center text-gray-500 py-8">No players in Rechter Rijtje yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {currentRound >= 3 && (
                <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-center text-purple-700">Tournament Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      {topGroupPlayers.length > 0 && (
                        <div>
                          <h3 className="text-xl font-bold text-purple-700 mb-2">🏆 Tournament Champion</h3>
                          <div className="text-2xl font-bold text-purple-800">
                            {topGroupPlayers[0]?.name} - {topGroupPlayers[0]?.totalPoints} points
                          </div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {bottomGroupPlayers.length > 0 && (
                          <div className="p-4 bg-green-100 rounded-lg">
                            <h4 className="font-bold text-green-700 mb-2">🔥 Promotion Winner</h4>
                            <p className="text-green-800">
                              {bottomGroupPlayers[0]?.name} promotes to Linker Rijtje
                            </p>
                          </div>
                        )}
                        
                        {topGroupPlayers.length > 0 && (
                          <div className="p-4 bg-red-100 rounded-lg">
                            <h4 className="font-bold text-red-700 mb-2">⬇️ Relegation</h4>
                            <p className="text-red-800">
                              {topGroupPlayers[topGroupPlayers.length - 1]?.name} relegates to Rechter Rijtje
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="text-center py-12">
                <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No active tournament</p>
                <p className="text-gray-400 text-sm">Activate a tournament to see current rankings</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="overall">
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <BarChart3 className="h-6 w-6" />
                Overall Career Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {overallRankings.map((player, index) => 
                  renderOverallPlayerRow(player, index + 1)
                )}
                {overallRankings.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No players registered yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Rankings;
