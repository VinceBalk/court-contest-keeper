
import { useState } from "react";
import { Player, Match, Tournament } from "@/pages/Index";
import { SpecialType } from "./SpecialManagement";
import { useToast } from "@/hooks/use-toast";
import { generateFinalRoundMatches, generateRandomMatches, generateManualMatches } from "@/utils/matchGeneration";
import ScoreEntry from "./ScoreEntry";
import MatchDisplay from "./MatchDisplay";
import ManualPairingSetup from "./ManualPairingSetup";
import MatchPreview from "./MatchPreview";
import RankingScoring from "./RankingScoring";
import RoundHeader from "./RoundHeader";
import MatchGenerationControls from "./MatchGenerationControls";
import MatchGenerationStatus from "./MatchGenerationStatus";

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
  const [previewMatches, setPreviewMatches] = useState<Match[] | null>(null);
  const [manualPairings, setManualPairings] = useState<{
    top: { team1: [string, string], team2: [string, string] }[];
    bottom: { team1: [string, string], team2: [string, string] }[];
  }>({ top: [], bottom: [] });
  const { toast } = useToast();

  const generateMatchPreview = () => {
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

      if (currentRound === 3) {
        topMatches = generateFinalRoundMatches('top', currentRound, activePlayers, activeTournament);
        bottomMatches = generateFinalRoundMatches('bottom', currentRound, activePlayers, activeTournament);
      } else if (isManualMode) {
        topMatches = generateManualMatches('top', currentRound, manualPairings.top, activeTournament);
        bottomMatches = generateManualMatches('bottom', currentRound, manualPairings.bottom, activeTournament);
      } else {
        topMatches = generateRandomMatches('top', currentRound, activePlayers, activeTournament);
        bottomMatches = generateRandomMatches('bottom', currentRound, activePlayers, activeTournament);
      }
      
      const allNewMatches = [...topMatches, ...bottomMatches];
      setPreviewMatches(allNewMatches);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate match preview",
        variant: "destructive"
      });
    }
  };

  const confirmMatches = () => {
    if (!previewMatches) return;
    
    const existingMatches = matches.filter(m => m.round !== currentRound);
    setMatches([...existingMatches, ...previewMatches]);
    setPreviewMatches(null);
    
    const matchType = currentRound === 3 ? 'Final Round' : (isManualMode ? 'Manual' : 'Random');
    toast({
      title: `${matchType} Matches Confirmed`,
      description: `Round ${currentRound} matches have been created`,
    });
  };

  const regenerateMatches = () => {
    generateMatchPreview();
  };

  const cancelPreview = () => {
    setPreviewMatches(null);
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

  const handleToggleManualMode = () => {
    if (isManualMode) {
      setIsManualMode(false);
    } else {
      initializeManualPairings();
    }
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
        <RoundHeader
          currentRound={currentRound}
          canGenerateMatches={canGenerateMatches}
          hasCurrentRoundMatches={currentRoundMatches.length > 0}
          hasPreviewMatches={!!previewMatches}
          onNextRound={() => setCurrentRound(currentRound + 1)}
        />
        <MatchGenerationControls
          currentRound={currentRound}
          canGenerateMatches={canGenerateMatches}
          hasCurrentRoundMatches={currentRoundMatches.length > 0}
          hasPreviewMatches={!!previewMatches}
          isManualMode={isManualMode}
          onGeneratePreview={generateMatchPreview}
          onToggleManualMode={handleToggleManualMode}
        />
      </div>

      <MatchGenerationStatus
        currentRound={currentRound}
        canGenerateMatches={canGenerateMatches}
        hasCurrentRoundMatches={currentRoundMatches.length > 0}
        hasPreviewMatches={!!previewMatches}
        topGroupCount={topGroupPlayers.length}
        bottomGroupCount={bottomGroupPlayers.length}
      />

      {isManualMode && currentRound !== 3 && currentRoundMatches.length === 0 && !previewMatches && (
        <ManualPairingSetup 
          manualPairings={manualPairings}
          players={players}
          onUpdatePairing={updateManualPairing}
        />
      )}

      {previewMatches && (
        <MatchPreview
          previewMatches={previewMatches}
          players={players}
          onConfirm={confirmMatches}
          onRegenerate={regenerateMatches}
          onCancel={cancelPreview}
          currentRound={currentRound}
        />
      )}

      {currentRoundMatches.length > 0 && !previewMatches && (
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

      {currentRound >= 3 && currentRoundMatches.length > 0 && (
        <RankingScoring
          players={players}
          setPlayers={setPlayers}
          activeTournament={activeTournament}
          currentRound={currentRound}
        />
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
