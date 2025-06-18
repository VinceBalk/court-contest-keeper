
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Edit } from "lucide-react";
import { Player, Match } from "@/pages/Index";

interface MatchDisplayProps {
  matches: Match[];
  players: Player[];
  group: 'top' | 'bottom';
  onEditMatch?: (match: Match) => void;
}

const MatchDisplay = ({ matches, players, group, onEditMatch }: MatchDisplayProps) => {
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

  const groupMatches = matches.filter(m => m.group === group);
  const title = group === 'top' ? 'Linker Rijtje' : 'Rechter Rijtje';
  const icon = group === 'top' ? Trophy : Target;
  const IconComponent = icon;
  const cardClass = group === 'top' 
    ? "bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-300"
    : "bg-gradient-to-br from-blue-100 to-green-100 border-blue-300";
  const titleClass = group === 'top' ? "text-orange-700" : "text-blue-700";

  return (
    <Card className={cardClass}>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <IconComponent className={`h-5 w-5 ${titleClass}`} />
          <h3 className={`text-lg font-semibold ${titleClass}`}>{title}</h3>
        </div>
        
        <div className="space-y-4">
          {groupMatches.map((match) => {
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
                {onEditMatch && (
                  <div className="flex gap-2 mt-2">
                    <Button
                      onClick={() => onEditMatch(match)}
                      variant={match.completed ? "outline" : "default"}
                      className="flex-1"
                      size="sm"
                    >
                      {match.completed ? (
                        <>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit Score
                        </>
                      ) : (
                        "Enter Score"
                      )}
                    </Button>
                  </div>
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
