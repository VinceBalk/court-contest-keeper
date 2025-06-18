import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, Shuffle, Edit } from "lucide-react";
import { Player, Match, Tournament } from "@/pages/Index";
import { SpecialType } from "./SpecialManagement";
import { useToast } from "@/hooks/use-toast";
import { generateFinalRoundMatches, generateRandomMatches, generateManualMatches } from "@/utils/matchGeneration";
import ScoreEntry from "./ScoreEntry";
import MatchDisplay from "./MatchDisplay";
import ManualPairingSetup from "./ManualPairingSetup";

interface TournamentScheduleProps {
  players: Player[];
  matches: Match[];
  setMatches: (matches: Match[]) => void;
  currentRound: number;
  setCurrentRound: (round: number) => void;
  setPlayers: (players: Player[]) => void;
  activeTournament: Tournament | null;
  specialTypes: SpecialType[];
}

const TournamentSchedule = ({ 
  players, 
  matches, 
  setMatches, 
  currentRound, 
  setCurrentRound,
  setPlayers,
  activeTournament,
  specialTypes
}: TournamentScheduleProps) => {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualPairings, setManualPairings] = useState<{
    top: { team1: [string, string], team2: [string, string] }[];
    bottom: { team1: [string, string], team2: [string, string] }[];
  }>({ top: [], bottom: [] });
  const { toast } = useToast();

  const generateRoundMatches = () => {
    if (!activeTournament) {
      toast({
        title: "Error",
        description: "No active tournament selected",
        variant: "destructive"
      });
      return;
    }

    try {
      let topMatches: Match[] = [];
      let bottomMatches: Match[] = [];

      // Check if this is the final round (round 3) and use score-based generation
      if (currentRound === 3) {
        topMatches = generateFinalRoundMatches('top', currentRound, activePlayers, activeTournament);
        bottomMatches = generateFinalRoundMatches('bottom', currentRound, activePlayers, activeTournament);
        
        toast({
          title: "Final Round Generated",
          description: "Round 3 matches created based on previous round scores",
        });
      } else if (isManualMode) {
        topMatches = generateManualMatches('top', currentRound, manualPairings.top, activeTournament);
        bottomMatches = generateManualMatches('bottom', currentRound, manualPairings.bottom, activeTournament);
        
        toast({
          title: "Manual Matches Generated",
          description: `Round ${currentRound} matches have been created with your pairings`,
        });
      } else {
        topMatches = generateRandomMatches('top', currentRound, activePlayers, activeTournament);
        bottomMatches = generateRandomMatches('bottom', currentRound, activePlayers, activeTournament);
        
        toast({
          title: "Random Matches Generated",
          description: `Round ${currentRound} matches have been randomly created`,
        });
      }
      
      const allNewMatches = [...topMatches, ...bottomMatches];
      const existingMatches = matches.filter(m => m.round !== currentRound);
      
      setMatches([...existingMatches, ...allNewMatches]);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate matches",
        variant: "destructive"
      });
    }
  };

  const initializeManualPairings = () => {
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
        const oldPlayerSpecials = typeof oldSpecialPoints[player.id] === 'number' ? oldSpecialPoints[player.id] : 0;
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
        const oldPlayerSpecials = typeof oldSpecialPoints[player.id] === 'number' ? oldSpecialPoints[player.id] : 0;
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
  const activePlayers = players.filter(p => p.isActive);
  const topGroupPlayers = activePlayers.filter(p => p.group === 'top').sort((a, b) => a.name.localeCompare(b.name));
  const bottomGroupPlayers = activePlayers.filter(p => p.group === 'bottom').sort((a, b) => a.name.localeCompare(b.name));
  
  // Check if both groups have even numbers of players (minimum 4 each for doubles)
  const canGenerateMatches = topGroupPlayers.length >= 4 && topGroupPlayers.length % 2 === 0 && 
                            bottomGroupPlayers.length >= 4 && bottomGroupPlayers.length % 2 === 0;

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
              Both groups need at least 4 active players each with even numbers to generate matches.
              <br />
              Current Active: Linker Rijtje ({topGroupPlayers.length}), Rechter Rijtje ({bottomGroupPlayers.length})
              <br />
              <span className="text-sm">Use the Players & Groups tab to activate players for the tournament (max 8 per group)</span>
            </p>
          </CardContent>
        </Card>
      )}

      {isManualMode && currentRound !== 3 && currentRoundMatches.length === 0 && (
        <ManualPairingSetup 
          manualPairings={manualPairings}
          players={players}
          onUpdatePairing={updateManualPairing}
        />
      )}

      {currentRoundMatches.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MatchDisplay 
            group="top"
            matches={currentRoundMatches}
            players={players}
            onSelectMatch={setSelectedMatch}
          />
          <MatchDisplay 
            group="bottom"
            matches={currentRoundMatches}
            players={players}
            onSelectMatch={setSelectedMatch}
          />
        </div>
      )}

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
  );
};

export default TournamentSchedule;
