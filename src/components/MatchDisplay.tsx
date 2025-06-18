
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target } from "lucide-react";
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
    <Card className={`${group === 'top' ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' : 'bg-gradient-to-br from-blue-50 to-green-50 border-blue-200'}`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${group === 'top' ? 'text-yellow-700' : 'text-blue-700'}`}>
          {group === 'top' ? <Trophy className="h-5 w-5" /> : <Target className="h-5 w-5" />}
          {group === 'top' ? 'Linker Rijtje' : 'Rechter Rijtje'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {groupMatches.map((match) => {
            const team1Players = match.team1.map(id => players.find(p => p.id === id)?.name).join(" & ");
            const team2Players = match.team2.map(id => players.find(p => p.id === id)?.name).join(" & ");
            
            return (
              <div key={match.id} className="p-4 bg-white/70 rounded-lg border">
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
                </div>
                {!match.completed && (
                  <Button
                    onClick={() => onSelectMatch(match)}
                    className="w-full mt-2"
                    size="sm"
                  >
                    Enter Score
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchDisplay;
