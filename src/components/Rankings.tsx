
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, TrendingUp, TrendingDown } from "lucide-react";
import { Player, Match } from "@/pages/Index";

interface RankingsProps {
  players: Player[];
  matches: Match[];
  currentRound: number;
}

const Rankings = ({ players, matches, currentRound }: RankingsProps) => {
  const topGroupPlayers = players
    .filter(p => p.group === 'top')
    .sort((a, b) => b.totalPoints - a.totalPoints);
  
  const bottomGroupPlayers = players
    .filter(p => p.group === 'bottom')
    .sort((a, b) => b.totalPoints - a.totalPoints);

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

  const renderPlayerRow = (player: Player, position: number, group: 'top' | 'bottom') => {
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
            <div className="text-xs text-gray-500">Total Points</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Tournament Rankings</h2>
        <p className="text-gray-600">Round {currentRound} - Current Standings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <Trophy className="h-6 w-6" />
              Top Group Rankings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topGroupPlayers.map((player, index) => 
                renderPlayerRow(player, index + 1, 'top')
              )}
              {topGroupPlayers.length === 0 && (
                <p className="text-center text-gray-500 py-8">No players in top group yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Award className="h-6 w-6" />
              Bottom Group Rankings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bottomGroupPlayers.map((player, index) => 
                renderPlayerRow(player, index + 1, 'bottom')
              )}
              {bottomGroupPlayers.length === 0 && (
                <p className="text-center text-gray-500 py-8">No players in bottom group yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {currentRound >= 3 && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-center text-purple-700">Final Tournament Results</CardTitle>
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
                      {bottomGroupPlayers[0]?.name} promotes to top group
                    </p>
                  </div>
                )}
                
                {topGroupPlayers.length > 0 && (
                  <div className="p-4 bg-red-100 rounded-lg">
                    <h4 className="font-bold text-red-700 mb-2">⬇️ Relegation</h4>
                    <p className="text-red-800">
                      {topGroupPlayers[topGroupPlayers.length - 1]?.name} relegates to bottom group
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Rankings;
