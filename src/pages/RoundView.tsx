
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { Player, Match, Tournament } from "@/pages/Index";
import ScoreEntry from "@/components/ScoreEntry";

interface RoundViewProps {
  matches: Match[];
  players: Player[];
  tournaments: Tournament[];
  setMatches: (matches: Match[]) => void;
  currentRound: number;
  activeTournament: Tournament | null;
}

const RoundView = ({ 
  matches, 
  players, 
  tournaments, 
  setMatches, 
  currentRound,
  activeTournament 
}: RoundViewProps) => {
  const { round } = useParams();
  const navigate = useNavigate();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  
  const roundNumber = round ? parseInt(round) : currentRound;
  const roundMatches = matches.filter(match => 
    match.round === roundNumber && 
    (!activeTournament || match.tournamentId === activeTournament.id)
  );

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

  const handleScoreUpdate = (updatedMatch: Match) => {
    const updatedMatches = matches.map(match => 
      match.id === updatedMatch.id ? updatedMatch : match
    );
    setMatches(updatedMatches);
    setSelectedMatch(null);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Round {roundNumber}</h1>
        {activeTournament && (
          <Badge variant="outline">{activeTournament.name}</Badge>
        )}
      </div>

      {roundMatches.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground text-center">
              No matches scheduled for this round
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roundMatches.map((match) => (
            <Card 
              key={match.id} 
              className="cursor-pointer hover:bg-muted/50" 
              onClick={() => setSelectedMatch(match)}
            >
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedMatch && (
        <ScoreEntry
          match={selectedMatch}
          players={players}
          onClose={() => setSelectedMatch(null)}
          onSave={handleScoreUpdate}
        />
      )}
    </div>
  );
};

export default RoundView;
