
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, Target, Edit } from "lucide-react";
import { Player, Match, Tournament } from "./Index";
import { useToast } from "@/hooks/use-toast";
import ScoreEntry from "@/components/ScoreEntry";
import { SpecialType } from "@/components/SpecialManagement";

interface RoundViewProps {
  players?: Player[];
  matches?: Match[];
  setMatches?: (matches: Match[]) => void;
  setPlayers?: (players: Player[]) => void;
  activeTournament?: Tournament | null;
  specialTypes?: SpecialType[];
}

const RoundView = ({ 
  players: propPlayers, 
  matches: propMatches, 
  setMatches: propSetMatches, 
  setPlayers: propSetPlayers,
  activeTournament: propActiveTournament,
  specialTypes: propSpecialTypes 
}: RoundViewProps = {}) => {
  const { round } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  // Mock data - in a real app, this would come from your state management
  const [players] = useState<Player[]>(propPlayers || [
    {
      id: "p1",
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      skillLevel: 7,
      group: "top",
      totalGames: 15,
      totalSpecials: 3,
      totalPoints: 18,
      matchesPlayed: 5,
      isActive: true,
      overallStats: {
        totalGames: 45,
        totalSpecials: 8,
        totalPoints: 53,
        matchesPlayed: 15,
        tournamentsPlayed: 3,
      }
    },
    // Add more mock players as needed
  ]);

  const [matches, setMatches] = useState<Match[]>(propMatches || [
    {
      id: "m1",
      court: 1,
      team1: ["p1"],
      team2: ["p2"],
      team1Score: 6,
      team2Score: 2,
      completed: true,
      round: parseInt(round || "1"),
      group: "top",
      specialPoints: { "p1": 2, "p2": 1 },
    },
    // Add more mock matches as needed
  ]);

  const [specialTypes] = useState<SpecialType[]>(propSpecialTypes || [
    { id: "1", name: "Ace", isActive: true, description: "Service ace" },
    { id: "2", name: "Winner", isActive: true, description: "Winning shot" },
  ]);

  const currentRound = parseInt(round || "1");
  const currentRoundMatches = matches.filter(m => m.round === currentRound);

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

    const updatedMatch = {
      ...match,
      team1Score,
      team2Score,
      specialPoints: convertedSpecialPoints,
      completed: true
    };

    const newMatches = matches.map(m => m.id === match.id ? updatedMatch : m);
    setMatches(newMatches);
    if (propSetMatches) propSetMatches(newMatches);
    setSelectedMatch(null);

    toast({
      title: match.completed ? "Score Updated" : "Score Submitted",
      description: match.completed ? "Match result has been updated" : "Match result has been recorded",
    });
  };

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

  const topGroupMatches = currentRoundMatches.filter(m => m.group === 'top');
  const bottomGroupMatches = currentRoundMatches.filter(m => m.group === 'bottom');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tournament
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">
              Round {currentRound}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Group */}
          <Card className="bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <Trophy className="h-5 w-5" />
                Linker Rijtje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topGroupMatches.map((match) => {
                  const team1Players = match.team1.map(id => players.find(p => p.id === id)?.name || 'Unknown').join(" & ");
                  const team2Players = match.team2.map(id => players.find(p => p.id === id)?.name || 'Unknown').join(" & ");
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
                })}
              </div>
            </CardContent>
          </Card>

          {/* Bottom Group */}
          <Card className="bg-gradient-to-br from-blue-100 to-green-100 border-blue-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Target className="h-5 w-5" />
                Rechter Rijtje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bottomGroupMatches.map((match) => {
                  const team1Players = match.team1.map(id => players.find(p => p.id === id)?.name || 'Unknown').join(" & ");
                  const team2Players = match.team2.map(id => players.find(p => p.id === id)?.name || 'Unknown').join(" & ");
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
                })}
              </div>
            </CardContent>
          </Card>
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
