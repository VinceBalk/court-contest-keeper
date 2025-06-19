
import { Player, Match, Tournament } from "@/pages/Index";
import { SpecialType } from "./SpecialManagement";
import MatchDisplay from "./MatchDisplay";
import MatchPreview from "./MatchPreview";
import ScoreEntry from "./ScoreEntry";
import MatchGenerationControls from "./MatchGenerationControls";
import TournamentScheduleHeader from "./TournamentScheduleHeader";
import ManualMatchSetup from "./ManualMatchSetup";
import { useTournamentSchedule } from "@/hooks/useTournamentSchedule";
import { useToast } from "@/hooks/use-toast";

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

  const handleEditMatch = (match: Match) => {
    setSelectedMatch(match);
  };

  const handleSaveScore = (updatedMatch: Match) => {
    const updatedMatches = matches.map(m => m.id === updatedMatch.id ? updatedMatch : m);
    setMatches(updatedMatches);
    localStorage.setItem('tournament-matches', JSON.stringify(updatedMatches));
    setSelectedMatch(null);
  };

  const handleCompleteRound = () => {
    if (currentRound < 3) {
      setCurrentRound(currentRound + 1);
      toast({
        title: "Round Completed",
        description: `Round ${currentRound} completed. Now on Round ${currentRound + 1}.`,
      });
    } else {
      toast({
        title: "Tournament Complete",
        description: "All rounds have been completed!",
      });
    }
  };

  return (
    <div className="space-y-6">
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
