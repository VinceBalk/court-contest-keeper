
import { Player, Match, Tournament } from "@/pages/Index";
import { SpecialType } from "./SpecialManagement";
import MatchDisplay from "./MatchDisplay";
import MatchPreview from "./MatchPreview";
import ScoreEntry from "./ScoreEntry";
import MatchGenerationControls from "./MatchGenerationControls";
import TournamentScheduleHeader from "./TournamentScheduleHeader";
import ManualMatchSetup from "./ManualMatchSetup";
import CourtSettings from "./CourtSettings";
import { useTournamentSchedule } from "@/hooks/useTournamentSchedule";
import { useGameBasedScoring } from "@/hooks/useGameBasedScoring";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface TournamentScheduleProps {
  players: Player[];
  matches: Match[];
  setMatches: (matches: Match[]) => void;
  currentRound: number;
  setCurrentRound: (round: number) => void;
  setPlayers: (players: Player[]) => void;
  activeTournament: Tournament;
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
  const { toast } = useToast();
  const [showSettings, setShowSettings] = useState(false);
  
  const {
    previewMatches,
    selectedMatch,
    setSelectedMatch,
    isManualMode,
    setIsManualMode,
    manualPairings,
    updateManualPairings,
    activePlayers,
    topGroupPlayers,
    bottomGroupPlayers,
    currentRoundMatches,
    hasCurrentRoundMatches,
    hasPreviewMatches,
    canGenerateMatches,
    isRoundCompleted,
    generatePreview,
    confirmMatches,
    saveManualMatches,
    cancelPreview,
    handleDeleteRoundMatches,
    deleteRoundMatches
  } = useTournamentSchedule({
    players,
    matches,
    setMatches,
    currentRound,
    activeTournament
  });

  const { updateStatsToDatabase } = useGameBasedScoring(players, matches, activeTournament, currentRound);

  const handleEditMatch = (match: Match) => {
    setSelectedMatch(match);
  };

  const handleSaveScore = async (updatedMatch: Match) => {
    const updatedMatches = matches.map(m => m.id === updatedMatch.id ? updatedMatch : m);
    setMatches(updatedMatches);
    localStorage.setItem('tournament-matches', JSON.stringify(updatedMatches));
    setSelectedMatch(null);
    
    // Update round statistics after score change
    try {
      await updateStatsToDatabase();
    } catch (error) {
      console.error('Failed to update round statistics:', error);
    }
  };

  const handleCompleteRound = async () => {
    // Update statistics before completing round
    try {
      await updateStatsToDatabase();
      
      if (currentRound < 3) {
        setCurrentRound(currentRound + 1);
        toast({
          title: "Round Completed",
          description: `Round ${currentRound} completed. Statistics updated. Now on Round ${currentRound + 1}.`,
        });
      } else {
        toast({
          title: "Tournament Complete",
          description: "All rounds completed! Statistics have been updated.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update statistics when completing round.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <TournamentScheduleHeader
            currentRound={currentRound}
            activePlayers={activePlayers}
            topGroupPlayers={topGroupPlayers}
            bottomGroupPlayers={bottomGroupPlayers}
            currentRoundMatches={currentRoundMatches}
            hasCurrentRoundMatches={hasCurrentRoundMatches}
            canGenerateMatches={canGenerateMatches}
            isRoundCompleted={isRoundCompleted}
            onCompleteRound={handleCompleteRound}
            onDeleteRoundMatches={handleDeleteRoundMatches}
            deleteRoundMatches={deleteRoundMatches}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Court Settings
        </Button>
      </div>

      {showSettings && (
        <CourtSettings tournamentId={activeTournament.id} />
      )}

      <MatchGenerationControls
        currentRound={currentRound}
        canGenerateMatches={canGenerateMatches}
        hasCurrentRoundMatches={hasCurrentRoundMatches}
        hasPreviewMatches={hasPreviewMatches}
        isManualMode={isManualMode}
        onGeneratePreview={generatePreview}
        onToggleManualMode={() => setIsManualMode(!isManualMode)}
      />

      <ManualMatchSetup
        isManualMode={isManualMode}
        canGenerateMatches={canGenerateMatches}
        currentRound={currentRound}
        manualPairings={manualPairings}
        players={players}
        tournamentId={activeTournament.id}
        onUpdatePairing={updateManualPairings}
        onSaveManualMatches={saveManualMatches}
        createMultipleMatches={{ isPending: false }}
      />

      {hasPreviewMatches && (
        <MatchPreview
          previewMatches={previewMatches}
          players={players}
          onConfirm={confirmMatches}
          onRegenerate={generatePreview}
          onCancel={cancelPreview}
          currentRound={currentRound}
        />
      )}

      {selectedMatch && (
        <ScoreEntry
          match={selectedMatch}
          players={players}
          specialTypes={specialTypes}
          onSave={handleSaveScore}
          onClose={() => setSelectedMatch(null)}
        />
      )}

      {!hasPreviewMatches && !selectedMatch && (
        <>
          <h2 className="text-xl font-semibold mb-4">Round {currentRound} Matches</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MatchDisplay
              group="top"
              matches={currentRoundMatches}
              players={players}
              tournamentId={activeTournament.id}
              onEditMatch={handleEditMatch}
            />
            <MatchDisplay
              group="bottom"
              matches={currentRoundMatches}
              players={players}
              tournamentId={activeTournament.id}
              onEditMatch={handleEditMatch}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TournamentSchedule;
