
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Star } from "lucide-react";
import { Player, Tournament } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

interface RankingScoringProps {
  players: Player[];
  setPlayers: (players: Player[]) => void;
  activeTournament: Tournament | null;
  currentRound: number;
}

const RankingScoring = ({ players, setPlayers, activeTournament, currentRound }: RankingScoringProps) => {
  const { toast } = useToast();

  const calculateRankingPoints = (rank: number): number => {
    const pointsMap: { [key: number]: number } = {
      1: 10, // Winner
      2: 7,  // Second
      3: 6,  // Third
      4: 5,  // Fourth
      5: 4,  // Fifth
      6: 3,  // Sixth
      7: 2,  // Seventh
      8: 1   // Eighth
    };
    return pointsMap[rank] || 0;
  };

  const applyRankingScoring = () => {
    if (!activeTournament || currentRound < 3) {
      toast({
        title: "Cannot Apply Ranking",
        description: "Tournament must be completed (3 rounds) to apply ranking scores",
        variant: "destructive"
      });
      return;
    }

    const activePlayers = players.filter(p => p.isActive);
    const topGroupPlayers = activePlayers.filter(p => p.group === 'top');
    const bottomGroupPlayers = activePlayers.filter(p => p.group === 'bottom');

    // Sort players by total points (descending)
    const rankedTopPlayers = topGroupPlayers.sort((a, b) => b.totalPoints - a.totalPoints);
    const rankedBottomPlayers = bottomGroupPlayers.sort((a, b) => b.totalPoints - a.totalPoints);

    const updatedPlayers = players.map(player => {
      if (!player.isActive) return player;

      let rankingPoints = 0;
      let newGroup = player.group;

      if (player.group === 'top') {
        const rank = rankedTopPlayers.findIndex(p => p.id === player.id) + 1;
        rankingPoints = calculateRankingPoints(rank);
        
        // Relegation: last place in top group goes to bottom
        if (rank === rankedTopPlayers.length && rankedTopPlayers.length > 0) {
          newGroup = 'bottom';
        }
      } else {
        const rank = rankedBottomPlayers.findIndex(p => p.id === player.id) + 1;
        rankingPoints = calculateRankingPoints(rank);
        
        // Promotion: first place in bottom group goes to top
        if (rank === 1 && rankedBottomPlayers.length > 0) {
          newGroup = 'top';
        }
      }

      return {
        ...player,
        group: newGroup,
        overallStats: {
          ...player.overallStats,
          totalPoints: player.overallStats.totalPoints + rankingPoints,
          totalGames: player.overallStats.totalGames + player.totalGames,
          totalSpecials: player.overallStats.totalSpecials + player.totalSpecials,
          matchesPlayed: player.overallStats.matchesPlayed + player.matchesPlayed,
          tournamentsPlayed: player.overallStats.tournamentsPlayed + 1
        },
        // Reset tournament stats for next tournament
        totalGames: 0,
        totalSpecials: 0,
        totalPoints: 0,
        matchesPlayed: 0,
        isActive: false
      };
    });

    setPlayers(updatedPlayers);

    toast({
      title: "Ranking Applied",
      description: "Tournament ranking points have been awarded and promotion/relegation applied",
    });
  };

  const previewRanking = () => {
    const activePlayers = players.filter(p => p.isActive);
    const topGroupPlayers = activePlayers.filter(p => p.group === 'top').sort((a, b) => b.totalPoints - a.totalPoints);
    const bottomGroupPlayers = activePlayers.filter(p => p.group === 'bottom').sort((a, b) => b.totalPoints - a.totalPoints);

    return { topGroupPlayers, bottomGroupPlayers };
  };

  const { topGroupPlayers, bottomGroupPlayers } = previewRanking();

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-4 w-4 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-4 w-4 text-gray-400" />;
    if (rank === 3) return <Award className="h-4 w-4 text-amber-600" />;
    return <Star className="h-4 w-4 text-blue-500" />;
  };

  const renderRankingPreview = (groupPlayers: Player[], groupName: string, groupColor: string) => (
    <div className="space-y-3">
      <h3 className={`font-semibold ${groupColor}`}>{groupName}</h3>
      {groupPlayers.map((player, index) => {
        const rank = index + 1;
        const points = calculateRankingPoints(rank);
        
        return (
          <div key={player.id} className="flex items-center justify-between p-3 bg-white/70 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 w-8">
                <span className="font-bold">{rank}</span>
                {getRankIcon(rank)}
              </div>
              <div>
                <p className="font-medium">{player.name}</p>
                <p className="text-sm text-gray-600">Current: {player.totalPoints} pts</p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-green-600">+{points} pts</div>
              <div className="text-xs text-gray-500">Ranking bonus</div>
            </div>
          </div>
        );
      })}
    </div>
  );

  if (!activeTournament) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardContent className="text-center py-12">
          <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No active tournament to score</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <Trophy className="h-5 w-5" />
          Tournament Ranking & Scoring
        </CardTitle>
        <div className="text-sm text-green-600">
          <p>Scoring System: 1st: 10pts, 2nd: 7pts, 3rd: 6pts, 4th: 5pts, 5th: 4pts, 6th: 3pts, 7th: 2pts, 8th: 1pt</p>
          <p>Winner of Rechter Rijtje promotes to Linker Rijtje. Last in Linker Rijtje relegates to Rechter Rijtje.</p>
        </div>
      </CardHeader>
      <CardContent>
        {currentRound >= 3 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {renderRankingPreview(topGroupPlayers, "Linker Rijtje Final Ranking", "text-yellow-700")}
              {renderRankingPreview(bottomGroupPlayers, "Rechter Rijtje Final Ranking", "text-blue-700")}
            </div>
            
            <div className="flex justify-center">
              <Button onClick={applyRankingScoring} className="bg-green-600 hover:bg-green-700">
                <Trophy className="h-4 w-4 mr-2" />
                Apply Final Ranking & Close Tournament
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Badge variant="outline" className="mb-4">Round {currentRound}/3</Badge>
            <p className="text-gray-600">Complete all 3 rounds to apply final ranking and scoring</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RankingScoring;
