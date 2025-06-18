
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Player, Match } from "@/pages/Index";

interface MatchDisplayProps {
  group: "top" | "bottom";
  matches: Match[];
  players: Player[];
  onEditMatch?: (match: Match) => void;
}

const MatchDisplay = ({ group, matches, players, onEditMatch }: MatchDisplayProps) => {
  // Fixed: Properly filter matches by group
  const groupMatches = matches.filter(match => match.group === group);

  const getPlayerName = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    return player ? player.name : "Unknown Player";
  };

  const getTotalScore = (match: Match, team: 1 | 2) => {
    const baseScore = team === 1 ? match.team1Score : match.team2Score;
    const specialPoints = match.specialPoints || {};
    
    // Calculate total special points for the team
    const teamPlayers = team === 1 ? match.team1 : match.team2;
    const teamSpecialPoints = teamPlayers.reduce((total, playerId) => {
      const playerSpecialPoints = specialPoints[playerId];
      return total + (typeof playerSpecialPoints === 'number' ? playerSpecialPoints : 0);
    }, 0);
    
    return (typeof baseScore === 'number' ? baseScore : 0) + teamSpecialPoints;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold capitalize">
        {group === 'top' ? 'Linker Rijtje' : 'Rechter Rijtje'}
      </h3>
      {groupMatches.length === 0 ? (
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground">No matches for this group</p>
          </CardContent>
        </Card>
      ) : (
        groupMatches.map((match) => (
          <Card key={match.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onEditMatch?.(match)}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm">Court {match.court}</CardTitle>
                {match.completed && (
                  <Badge variant="secondary">Completed</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {match.team1.map(id => getPlayerName(id)).join(" & ")}
                    </span>
                  </div>
                  <span className="text-lg font-bold">
                    {getTotalScore(match, 1)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {match.team2.map(id => getPlayerName(id)).join(" & ")}
                    </span>
                  </div>
                  <span className="text-lg font-bold">
                    {getTotalScore(match, 2)}
                  </span>
                </div>
              </div>
              {onEditMatch && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditMatch(match);
                  }}
                >
                  Edit Match
                </Button>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default MatchDisplay;
