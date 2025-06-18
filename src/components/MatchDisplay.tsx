
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Edit } from "lucide-react";
import { Player, Match } from "@/pages/Index";

interface MatchDisplayProps {
  group: 'top' | 'bottom';
  matches: Match[];
  players: Player[];
  onSelectMatch: (match: Match) => void;
}

const MatchDisplay = ({ group, matches, players, onSelectMatch }: MatchDisplayProps) => {
  const groupMatches = matches.filter(m => m.group === group);

  return (
    <Card className={`${
      group === 'top' 
        ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-300' 
        : 'bg-gradient-to-br from-blue-100 to-green-100 border-blue-300'
    }`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${
          group === 'top' ? 'text-orange-700' : 'text-blue-700'
        }`}>
          {group === 'top' ? <Trophy className="h-5 w-5" /> : <Target className="h-5 w-5" />}
          {group === 'top' ? 'Linker Rijtje' : 'Rechter Rijtje'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {groupMatches.map((match) => {
            const team1Players = match.team1.map(id => players.find(p => p.id === id)?.name).join(" & ");
            const team2Players = match.team2.map(id => players.find(p => p.id === id)?.name).join(" & ");
            
            // Calculate total special points for display
            const getSpecialCount = (specialPoints: any) => {
              if (!specialPoints || typeof specialPoints !== 'object') return 0;
              return Object.values(specialPoints).reduce((total: number, playerSpecials: any) => {
                if (typeof playerSpecials === 'number') {
                  return total + playerSpecials;
                }
                return total;
              }, 0);
            };
            
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
                  {match.completed && getSpecialCount(match.specialPoints) > 0 && (
                    <div className="text-xs text-gray-600 mt-1">
                      Special points: {getSpecialCount(match.specialPoints)}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-2">
                  {!match.completed && (
                    <Button
                      onClick={() => onSelectMatch(match)}
                      className="flex-1"
                      size="sm"
                    >
                      Enter Score
                    </Button>
                  )}
                  {match.completed && (
                    <Button
                      onClick={() => onSelectMatch(match)}
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
  );
};

export default MatchDisplay;
