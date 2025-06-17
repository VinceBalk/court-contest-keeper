import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Play, Trophy, Users, Target, Shuffle, Edit } from "lucide-react";
import { Player, Match, Tournament } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

interface TournamentScheduleProps {
  players: Player[];
  matches: Match[];
  setMatches: (matches: Match[]) => void;
  currentRound: number;
  setCurrentRound: (round: number) => void;
  setPlayers: (players: Player[]) => void;
  activeTournament: Tournament | null;
}

const TournamentSchedule = ({ 
  players, 
  matches, 
  setMatches, 
  currentRound, 
  setCurrentRound,
  setPlayers,
  activeTournament
}: TournamentScheduleProps) => {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [specialPoints, setSpecialPoints] = useState<{ [playerId: string]: number }>({});
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualPairings, setManualPairings] = useState<{
    top: { team1: [string, string], team2: [string, string] }[];
    bottom: { team1: [string, string], team2: [string, string] }[];
  }>({ top: [], bottom: [] });
  const { toast } = useToast();

  const generateFinalRoundMatches = (group: 'top' | 'bottom', round: number) => {
    const groupPlayers = players.filter(p => p.group === group);
    if (groupPlayers.length !== 8) {
      toast({
        title: "Error",
        description: `${group === 'top' ? 'Linker Rijtje' : 'Rechter Rijtje'} needs exactly 8 players to generate matches`,
        variant: "destructive"
      });
      return [];
    }

    if (!activeTournament) {
      toast({
        title: "Error",
        description: "No active tournament selected",
        variant: "destructive"
      });
      return [];
    }

    // Sort players by total points (descending) to rank them
    const rankedPlayers = [...groupPlayers].sort((a, b) => b.totalPoints - a.totalPoints);
    
    const newMatches: Match[] = [];

    // Create balanced pairings based on rankings
    // Pair 1st & 8th vs 4th & 5th, 2nd & 7th vs 3rd & 6th for each court
    const pairings = [
      // Court 1 matches
      {
        team1: [rankedPlayers[0], rankedPlayers[7]], // 1st & 8th
        team2: [rankedPlayers[3], rankedPlayers[4]]  // 4th & 5th
      },
      {
        team1: [rankedPlayers[1], rankedPlayers[6]], // 2nd & 7th
        team2: [rankedPlayers[2], rankedPlayers[5]]  // 3rd & 6th
      },
      // Court 2 matches - create different combinations for variety
      {
        team1: [rankedPlayers[0], rankedPlayers[6]], // 1st & 7th
        team2: [rankedPlayers[2], rankedPlayers[4]]  // 3rd & 5th
      },
      {
        team1: [rankedPlayers[1], rankedPlayers[7]], // 2nd & 8th
        team2: [rankedPlayers[3], rankedPlayers[5]]  // 4th & 6th
      },
      // Additional matches to ensure all combinations
      {
        team1: [rankedPlayers[0], rankedPlayers[5]], // 1st & 6th
        team2: [rankedPlayers[1], rankedPlayers[4]]  // 2nd & 5th
      },
      {
        team1: [rankedPlayers[2], rankedPlayers[7]], // 3rd & 8th
        team2: [rankedPlayers[3], rankedPlayers[6]]  // 4th & 7th
      }
    ];

    pairings.forEach((pairing, matchIndex) => {
      const court = Math.floor(matchIndex / 3) + 1;
      newMatches.push({
        id: `match-${group}-${round}-${matchIndex}`,
        tournamentId: activeTournament.id,
        round,
        group,
        court: group === 'top' ? court : court + 2,
        team1: [pairing.team1[0].id, pairing.team1[1].id],
        team2: [pairing.team2[0].id, pairing.team2[1].id],
        team1Score: 0,
        team2Score: 0,
        specialPoints: {},
        completed: false
      });
    });

    return newMatches;
  };

  const generateRandomMatches = (group: 'top' | 'bottom', round: number) => {
    const groupPlayers = players.filter(p => p.group === group);
    if (groupPlayers.length !== 8) {
      toast({
        title: "Error",
        description: `${group === 'top' ? 'Linker Rijtje' : 'Rechter Rijtje'} needs exactly 8 players to generate matches`,
        variant: "destructive"
      });
      return [];
    }

    if (!activeTournament) {
      toast({
        title: "Error",
        description: "No active tournament selected",
        variant: "destructive"
      });
      return [];
    }

    // Shuffle players for random pairings
    const shuffled = [...groupPlayers].sort(() => Math.random() - 0.5);
    const newMatches: Match[] = [];

    // Generate 6 matches per group (3 courts x 2 matches per court)
    for (let matchIndex = 0; matchIndex < 6; matchIndex++) {
      const court = Math.floor(matchIndex / 3) + 1; // Court 1 or 2 for each group
      const playersForMatch = shuffled.slice((matchIndex % 3) * 2 + (Math.floor(matchIndex / 3) * 6), (matchIndex % 3) * 2 + 4 + (Math.floor(matchIndex / 3) * 6));
      
      if (playersForMatch.length === 4) {
        newMatches.push({
          id: `match-${group}-${round}-${matchIndex}`,
          tournamentId: activeTournament.id,
          round,
          group,
          court: group === 'top' ? court : court + 2, // Bottom group uses courts 3-4
          team1: [playersForMatch[0].id, playersForMatch[1].id],
          team2: [playersForMatch[2].id, playersForMatch[3].id],
          team1Score: 0,
          team2Score: 0,
          specialPoints: {},
          completed: false
        });
      }
    }

    return newMatches;
  };

  const generateManualMatches = (group: 'top' | 'bottom', round: number) => {
    if (!activeTournament) {
      toast({
        title: "Error",
        description: "No active tournament selected",
        variant: "destructive"
      });
      return [];
    }

    const groupPairings = manualPairings[group];
    if (groupPairings.length !== 6) {
      toast({
        title: "Error",
        description: `Please set up all 6 matches for ${group === 'top' ? 'Linker Rijtje' : 'Rechter Rijtje'}`,
        variant: "destructive"
      });
      return [];
    }

    const newMatches: Match[] = [];

    groupPairings.forEach((pairing, matchIndex) => {
      const court = Math.floor(matchIndex / 3) + 1;
      newMatches.push({
        id: `match-${group}-${round}-${matchIndex}`,
        tournamentId: activeTournament.id,
        round,
        group,
        court: group === 'top' ? court : court + 2,
        team1: pairing.team1,
        team2: pairing.team2,
        team1Score: 0,
        team2Score: 0,
        specialPoints: {},
        completed: false
      });
    });

    return newMatches;
  };

  const generateRoundMatches = () => {
    // Check if this is the final round (round 3) and use score-based generation
    if (currentRound === 3) {
      const topMatches = generateFinalRoundMatches('top', currentRound);
      const bottomMatches = generateFinalRoundMatches('bottom', currentRound);
      
      if (topMatches.length === 0 || bottomMatches.length === 0) {
        return;
      }
      
      const allNewMatches = [...topMatches, ...bottomMatches];
      const existingMatches = matches.filter(m => m.round !== currentRound);
      
      setMatches([...existingMatches, ...allNewMatches]);
      
      toast({
        title: "Final Round Generated",
        description: "Round 3 matches created based on previous round scores",
      });
      return;
    }

    // For rounds 1 and 2, use existing logic
    if (isManualMode) {
      const topMatches = generateManualMatches('top', currentRound);
      const bottomMatches = generateManualMatches('bottom', currentRound);
      
      if (topMatches.length === 0 || bottomMatches.length === 0) {
        return;
      }
      
      const allNewMatches = [...topMatches, ...bottomMatches];
      const existingMatches = matches.filter(m => m.round !== currentRound);
      
      setMatches([...existingMatches, ...allNewMatches]);
      
      toast({
        title: "Manual Matches Generated",
        description: `Round ${currentRound} matches have been created with your pairings`,
      });
    } else {
      const topMatches = generateRandomMatches('top', currentRound);
      const bottomMatches = generateRandomMatches('bottom', currentRound);
      
      const allNewMatches = [...topMatches, ...bottomMatches];
      const existingMatches = matches.filter(m => m.round !== currentRound);
      
      setMatches([...existingMatches, ...allNewMatches]);
      
      toast({
        title: "Random Matches Generated",
        description: `Round ${currentRound} matches have been randomly created`,
      });
    }
  };

  const initializeManualPairings = () => {
    const topPlayers = players.filter(p => p.group === 'top');
    const bottomPlayers = players.filter(p => p.group === 'bottom');
    
    const createEmptyPairings = () => Array(6).fill(null).map(() => ({ 
      team1: ['', ''] as [string, string], 
      team2: ['', ''] as [string, string] 
    }));

    setManualPairings({
      top: createEmptyPairings(),
      bottom: createEmptyPairings()
    });
    setIsManualMode(true);
  };

  const submitScore = () => {
    if (!selectedMatch) return;

    const totalGames = team1Score + team2Score;
    if (totalGames !== 8) {
      toast({
        title: "Invalid Score",
        description: "Total games must equal 8",
        variant: "destructive"
      });
      return;
    }

    // Update match
    const updatedMatch = {
      ...selectedMatch,
      team1Score,
      team2Score,
      specialPoints,
      completed: true
    };

    const updatedMatches = matches.map(m => m.id === selectedMatch.id ? updatedMatch : m);
    setMatches(updatedMatches);

    // Update player stats
    const updatedPlayers = players.map(player => {
      const team1Players = selectedMatch.team1;
      const team2Players = selectedMatch.team2;
      
      if (team1Players.includes(player.id)) {
        return {
          ...player,
          totalGames: player.totalGames + team1Score,
          totalSpecials: player.totalSpecials + (specialPoints[player.id] || 0),
          totalPoints: player.totalPoints + team1Score + (specialPoints[player.id] || 0),
          matchesPlayed: player.matchesPlayed + 1
        };
      } else if (team2Players.includes(player.id)) {
        return {
          ...player,
          totalGames: player.totalGames + team2Score,
          totalSpecials: player.totalSpecials + (specialPoints[player.id] || 0),
          totalPoints: player.totalPoints + team2Score + (specialPoints[player.id] || 0),
          matchesPlayed: player.matchesPlayed + 1
        };
      }
      return player;
    });

    setPlayers(updatedPlayers);
    setSelectedMatch(null);
    setTeam1Score(0);
    setTeam2Score(0);
    setSpecialPoints({});

    toast({
      title: "Score Submitted",
      description: "Match result has been recorded",
    });
  };

  const updateManualPairing = (group: 'top' | 'bottom', matchIndex: number, team: 'team1' | 'team2', playerIndex: 0 | 1, playerId: string) => {
    setManualPairings(prev => ({
      ...prev,
      [group]: prev[group].map((pairing, index) => 
        index === matchIndex 
          ? {
              ...pairing,
              [team]: playerIndex === 0 
                ? [playerId, pairing[team][1]] as [string, string]
                : [pairing[team][0], playerId] as [string, string]
            }
          : pairing
      )
    }));
  };

  const currentRoundMatches = matches.filter(m => m.round === currentRound);
  const canGenerateMatches = players.filter(p => p.group === 'top').length === 8 && 
                            players.filter(p => p.group === 'bottom').length === 8;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="h-6 w-6 text-blue-600" />
          Round {currentRound} Matches
          {currentRound === 3 && (
            <Badge className="bg-yellow-500 text-yellow-900 ml-2">Final Round</Badge>
          )}
        </h2>
        <div className="flex gap-2">
          {canGenerateMatches && currentRoundMatches.length === 0 && (
            <>
              <Button onClick={generateRoundMatches} className="bg-green-600 hover:bg-green-700">
                <Shuffle className="h-4 w-4 mr-2" />
                {currentRound === 3 ? 'Generate Final Round' : (isManualMode ? 'Generate Manual' : 'Generate Random')}
              </Button>
              {currentRound !== 3 && (
                <Button 
                  onClick={() => isManualMode ? setIsManualMode(false) : initializeManualPairings()}
                  variant="outline"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isManualMode ? 'Switch to Random' : 'Manual Setup'}
                </Button>
              )}
            </>
          )}
          {currentRound < 3 && (
            <Button 
              onClick={() => setCurrentRound(currentRound + 1)}
              variant="outline"
            >
              Next Round
            </Button>
          )}
        </div>
      </div>

      {currentRound === 3 && currentRoundMatches.length === 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <p className="text-yellow-800 text-center">
              <Trophy className="h-5 w-5 inline mr-2" />
              Final round matches will be generated based on scores from rounds 1 and 2.
              Players will be ranked by total points within each group.
            </p>
          </CardContent>
        </Card>
      )}

      {!canGenerateMatches && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <p className="text-yellow-800 text-center">
              Both groups need exactly 8 players each to generate matches
            </p>
          </CardContent>
        </Card>
      )}

      {isManualMode && currentRound !== 3 && currentRoundMatches.length === 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700">Manual Match Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {(['top', 'bottom'] as const).map(group => (
                <div key={group}>
                  <h3 className="font-semibold mb-4">{group === 'top' ? 'Linker Rijtje' : 'Rechter Rijtje'}</h3>
                  <div className="space-y-4">
                    {manualPairings[group].map((pairing, matchIndex) => (
                      <div key={matchIndex} className="p-4 bg-white rounded border">
                        <h4 className="font-medium mb-2">Match {matchIndex + 1} - Court {group === 'top' ? Math.floor(matchIndex / 3) + 1 : Math.floor(matchIndex / 3) + 3}</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Team 1</label>
                            <div className="space-y-2">
                              <select
                                value={pairing.team1[0]}
                                onChange={(e) => updateManualPairing(group, matchIndex, 'team1', 0, e.target.value)}
                                className="w-full p-2 border rounded"
                              >
                                <option value="">Select Player 1</option>
                                {players.filter(p => p.group === group).map(player => (
                                  <option key={player.id} value={player.id}>{player.name}</option>
                                ))}
                              </select>
                              <select
                                value={pairing.team1[1]}
                                onChange={(e) => updateManualPairing(group, matchIndex, 'team1', 1, e.target.value)}
                                className="w-full p-2 border rounded"
                              >
                                <option value="">Select Player 2</option>
                                {players.filter(p => p.group === group).map(player => (
                                  <option key={player.id} value={player.id}>{player.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Team 2</label>
                            <div className="space-y-2">
                              <select
                                value={pairing.team2[0]}
                                onChange={(e) => updateManualPairing(group, matchIndex, 'team2', 0, e.target.value)}
                                className="w-full p-2 border rounded"
                              >
                                <option value="">Select Player 1</option>
                                {players.filter(p => p.group === group).map(player => (
                                  <option key={player.id} value={player.id}>{player.name}</option>
                                ))}
                              </select>
                              <select
                                value={pairing.team2[1]}
                                onChange={(e) => updateManualPairing(group, matchIndex, 'team2', 1, e.target.value)}
                                className="w-full p-2 border rounded"
                              >
                                <option value="">Select Player 2</option>
                                {players.filter(p => p.group === group).map(player => (
                                  <option key={player.id} value={player.id}>{player.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {currentRoundMatches.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {['top', 'bottom'].map(group => (
            <Card key={group} className={`${group === 'top' ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' : 'bg-gradient-to-br from-blue-50 to-green-50 border-blue-200'}`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${group === 'top' ? 'text-yellow-700' : 'text-blue-700'}`}>
                  {group === 'top' ? <Trophy className="h-5 w-5" /> : <Target className="h-5 w-5" />}
                  {group === 'top' ? 'Linker Rijtje' : 'Rechter Rijtje'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentRoundMatches
                    .filter(m => m.group === group)
                    .map((match) => {
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
                              onClick={() => {
                                setSelectedMatch(match);
                                setTeam1Score(0);
                                setTeam2Score(0);
                                setSpecialPoints({});
                              }}
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
          ))}
        </div>
      )}

      {selectedMatch && (
        <Card className="bg-white/95 backdrop-blur-sm border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Users className="h-5 w-5" />
              Enter Score - Court {selectedMatch.court}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {selectedMatch.team1.map(id => players.find(p => p.id === id)?.name).join(" & ")}
                </label>
                <Input
                  type="number"
                  min="0"
                  max="8"
                  value={team1Score}
                  onChange={(e) => setTeam1Score(parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {selectedMatch.team2.map(id => players.find(p => p.id === id)?.name).join(" & ")}
                </label>
                <Input
                  type="number"
                  min="0"
                  max="8"
                  value={team2Score}
                  onChange={(e) => setTeam2Score(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Special Points (Aces, Via Glass, Out of Cage)</h4>
              <div className="grid grid-cols-2 gap-2">
                {[...selectedMatch.team1, ...selectedMatch.team2].map(playerId => {
                  const player = players.find(p => p.id === playerId);
                  return (
                    <div key={playerId} className="flex items-center gap-2">
                      <label className="text-sm flex-1">{player?.name}</label>
                      <Input
                        type="number"
                        min="0"
                        value={specialPoints[playerId] || 0}
                        onChange={(e) => setSpecialPoints({
                          ...specialPoints,
                          [playerId]: parseInt(e.target.value) || 0
                        })}
                        className="w-20"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={submitScore} className="bg-green-600 hover:bg-green-700">
                Submit Score
              </Button>
              <Button variant="outline" onClick={() => setSelectedMatch(null)}>
                Cancel
              </Button>
            </div>

            <p className="text-sm text-gray-600">
              Total games: {team1Score + team2Score}/8
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TournamentSchedule;
