import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, ArrowLeft, Calendar, Edit } from "lucide-react";
import { Player, Match, Tournament } from "@/pages/Index";
import ScoreEntry from "@/components/ScoreEntry";
import { SpecialType } from "@/components/SpecialManagement";
import { useToast } from "@/hooks/use-toast";

interface RoundViewProps {
  players: Player[];
  matches: Match[];
  setMatches: (matches: Match[]) => void;
  setPlayers: (players: Player[]) => void;
  activeTournament: Tournament | null;
  specialTypes: SpecialType[];
}

const RoundView = ({ 
  players, 
  matches, 
  setMatches, 
  setPlayers, 
  activeTournament, 
  specialTypes 
}: RoundViewProps) => {
  const { round } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  
  const roundNumber = parseInt(round || "1");
  const roundMatches = matches.filter(m => m.round === roundNumber);
  const topGroupMatches = roundMatches.filter(m => m.group === 'top');
  const bottomGroupMatches = roundMatches.filter(m => m.group === 'bottom');

  const handleSubmitScore = (
    match: Match, 
    team1Score: number, 
    team2Score: number, 
    specialPoints: { [playerId: string]: { [specialType: string]: number } }
  ) => {
    // Convert new special points structure to number for storage (sum all types)
    const convertedSpecialPoints: { [playerId: string]: number } = {};
    Object.entries(specialPoints).forEach(([playerId, specials]) => {
      convertedSpecialPoints[playerId] = Object.values(specials).reduce((sum, count) => sum + count, 0);
    });

    // Calculate the difference in scores for player stats update
    const oldTeam1Score = match.team1Score || 0;
    const oldTeam2Score = match.team2Score || 0;
    const oldSpecialPoints = match.specialPoints || {};

    // Update match
    const updatedMatch = {
      ...match,
      team1Score,
      team2Score,
      specialPoints: convertedSpecialPoints,
      completed: true
    };

    const updatedMatches = matches.map(m => m.id === match.id ? updatedMatch : m);
    setMatches(updatedMatches);

    // Update player stats (handle both new entries and edits)
    const updatedPlayers = players.map(player => {
      const team1Players = match.team1;
      const team2Players = match.team2;
      
      if (team1Players.includes(player.id)) {
        const scoreDiff = team1Score - oldTeam1Score;
        const oldPlayerSpecials = (typeof oldSpecialPoints[player.id] === 'number') ? oldSpecialPoints[player.id] as number : 0;
        const newPlayerSpecials = convertedSpecialPoints[player.id] || 0;
        const specialsDiff = newPlayerSpecials - oldPlayerSpecials;
        
        return {
          ...player,
          totalGames: player.totalGames + scoreDiff,
          totalSpecials: player.totalSpecials + specialsDiff,
          totalPoints: player.totalPoints + scoreDiff + specialsDiff,
          matchesPlayed: match.completed ? player.matchesPlayed : player.matchesPlayed + 1
        };
      } else if (team2Players.includes(player.id)) {
        const scoreDiff = team2Score - oldTeam2Score;
        const oldPlayerSpecials = (typeof oldSpecialPoints[player.id] === 'number') ? oldSpecialPoints[player.id] as number : 0;
        const newPlayerSpecials = convertedSpecialPoints[player.id] || 0;
        const specialsDiff = newPlayerSpecials - oldPlayerSpecials;
        
        return {
          ...player,
          totalGames: player.totalGames + scoreDiff,
          totalSpecials: player.totalSpecials + specialsDiff,
          totalPoints: player.totalPoints + scoreDiff + specialsDiff,
          matchesPlayed: match.completed ? player.matchesPlayed : player.matchesPlayed + 1
        };
      }
      return player;
    });

    setPlayers(updatedPlayers);
    setSelectedMatch(null);

    toast({
      title: match.completed ? "Score Updated" : "Score Submitted",
      description: match.completed ? "Match result has been updated" : "Match result has been recorded",
    });
  };

  const renderMatchCard = (match: Match, group: 'top' | 'bottom') => {
    const team1Players = match.team1.map(id => players.find(p => p.id === id)?.name).join(" & ");
    const team2Players = match.team2.map(id => players.find(p => p.id === id)?.name).join(" & ");
    
    // Calculate total special points for display
    const getSpecialCount = (specialPoints: { [playerId: string]: number | { [specialType: string]: number } } | undefined): number => {
      if (!specialPoints || typeof specialPoints !== 'object') return 0;
      return Object.values(specialPoints).reduce((total, playerSpecials) => {
        if (typeof playerSpecials === 'number') {
          return total + playerSpecials;
        } else if (typeof playerSpecials === 'object' && playerSpecials) {
          return total + Object.values(playerSpecials).reduce((sum, count) => {
            return sum + (typeof count === 'number' ? count : 0);
          }, 0);
        }
        return total;
      }, 0);
    };
    
    const specialCount = getSpecialCount(match.specialPoints);
    
    return (
      <div key={match.id} className="p-4 bg-white/80 rounded-lg border shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">Court {match.court}</span>
          <Badge variant={match.completed ? "default" : "outline"}>
            {match.completed ? "Completed" : "Pending"}
          </Badge>
        </div>
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span>{team1Players}</span>
            <span className="font-bold">{match.team1Score}</span>
          </div>
          <div className="flex justify-between">
            <span>{team2Players}</span>
            <span className="font-bold">{match.team2Score}</span>
          </div>
          {match.completed && specialCount > 0 && (
            <div className="text-xs text-gray-600 mt-1">
              Special points: {specialCount}
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-2">
          {!match.completed && (
            <Button
              onClick={() => setSelectedMatch(match)}
              className="flex-1"
              size="sm"
            >
              Enter Score
            </Button>
          )}
          {match.completed && (
            <Button
              onClick={() => setSelectedMatch(match)}
              variant="outline"
              className="flex-1"
              size="sm"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit Score
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderGroupMatches = (groupMatches: Match[], groupName: string, groupColor: string, icon: React.ReactNode) => (
    <Card className={`${groupColor}`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${
          groupName === 'Linker Rijtje' ? 'text-orange-700' : 'text-blue-700'
        }`}>
          {icon}
          {groupName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {groupMatches.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No matches scheduled for this round</p>
          ) : (
            groupMatches.map((match) => renderMatchCard(match, match.group))
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (!activeTournament) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button onClick={() => navigate("/")} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tournament
            </Button>
          </div>
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No active tournament selected</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate("/")} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tournament
            </Button>
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Round {roundNumber} Matches</h1>
                <p className="text-gray-600">{activeTournament.name}</p>
              </div>
            </div>
          </div>
          {roundNumber === 3 && (
            <Badge className="bg-yellow-500 text-yellow-900">Final Round</Badge>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderGroupMatches(
            topGroupMatches, 
            "Linker Rijtje", 
            "bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-300",
            <Trophy className="h-5 w-5" />
          )}
          {renderGroupMatches(
            bottomGroupMatches, 
            "Rechter Rijtje", 
            "bg-gradient-to-br from-blue-100 to-green-100 border-blue-300",
            <Target className="h-5 w-5" />
          )}
        </div>

        {selectedMatch && (
          <ScoreEntry 
            match={selectedMatch}
            players={players}
            specialTypes={specialTypes}
            onSubmitScore={handleSubmitScore}
            onCancel={() => setSelectedMatch(null)}
          />
        )}
      </div>
    </div>
  );
};

export default RoundView;
