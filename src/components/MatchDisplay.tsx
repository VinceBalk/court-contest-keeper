
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Player, Match } from "@/pages/Index";
import { Edit } from "lucide-react";
import { useCourtSettings, CourtSetting } from "@/hooks/useCourtSettings";

interface MatchDisplayProps {
  group: "top" | "bottom";
  matches: Match[];
  players: Player[];
  tournamentId: string;
  onEditMatch?: (match: Match) => void;
}

const MatchDisplay = ({ group, matches, players, tournamentId, onEditMatch }: MatchDisplayProps) => {
  // Filter matches by group
  const groupMatches = matches.filter(match => match.group === group);
  
  const { data: courtSettings = [] } = useCourtSettings(tournamentId);

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

  const getCourtSetting = (courtNumber: number) => {
    return courtSettings.find(cs => cs.court_number === courtNumber);
  };

  const getCourtName = (courtNumber: number) => {
    const courtSetting = getCourtSetting(courtNumber);
    return courtSetting ? courtSetting.court_name : `Court ${courtNumber}`;
  };

  const getCourtColor = (courtNumber: number) => {
    const courtSetting = getCourtSetting(courtNumber);
    return courtSetting ? courtSetting.court_color : '#3B82F6';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold capitalize">
        {group === 'top' ? 'Linker Rijtje (Courts 1-2)' : 'Rechter Rijtje (Courts 3-4)'}
      </h3>
      {groupMatches.length === 0 ? (
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground">No matches for this group</p>
          </CardContent>
        </Card>
      ) : (
        groupMatches.map((match) => (
          <Card 
            key={match.id} 
            className="cursor-pointer hover:bg-muted/50 transition-colors hover:shadow-md border-l-4" 
            style={{ borderLeftColor: getCourtColor(match.court) }}
            onClick={() => onEditMatch?.(match)}
          >
            <CardHeader className="pb-2" style={{ backgroundColor: `${getCourtColor(match.court)}15` }}>
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: getCourtColor(match.court) }}
                  />
                  {getCourtName(match.court)} - {group === 'top' ? 'Linker' : 'Rechter'} Rijtje
                </CardTitle>
                <div className="flex items-center gap-2">
                  {match.completed ? (
                    <Badge variant="secondary">Completed</Badge>
                  ) : (
                    <Badge variant="outline">Pending</Badge>
                  )}
                  <Edit className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <div className="flex flex-col">
                    <span className="font-medium text-blue-800">
                      {match.team1.map(id => getPlayerName(id)).join(" & ")}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-blue-800">
                    {getTotalScore(match, 1)}
                  </span>
                </div>
                <div className="text-center text-sm text-muted-foreground font-medium">
                  VS
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <div className="flex flex-col">
                    <span className="font-medium text-green-800">
                      {match.team2.map(id => getPlayerName(id)).join(" & ")}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-green-800">
                    {getTotalScore(match, 2)}
                  </span>
                </div>
              </div>
              {!match.completed && (
                <div className="mt-3 text-center">
                  <Badge variant="outline" className="text-xs">
                    Click to enter score
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default MatchDisplay;
