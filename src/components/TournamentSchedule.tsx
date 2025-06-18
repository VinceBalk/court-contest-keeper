
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Shuffle, Trophy, Target, Trash2, Save, CheckCircle } from "lucide-react";
import { Player, Match, Tournament } from "@/pages/Index";
import { SpecialType } from "./SpecialManagement";
import MatchDisplay from "./MatchDisplay";
import MatchPreview from "./MatchPreview";
import ScoreEntry from "./ScoreEntry";
import ManualPairingSetup from "./ManualPairingSetup";
import MatchGenerationControls from "./MatchGenerationControls";
import { useDeleteRoundMatches, useCreateMultipleMatches } from "@/hooks/useMatches";
import { useToast } from "@/hooks/use-toast";
import { 
  generateFinalRoundMatches, 
  generateRandomMatches, 
  generateManualMatches 
} from "@/utils/matchGeneration";

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
  const [previewMatches, setPreviewMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualPairings, setManualPairings] = useState<{
    top: { team1: [string, string], team2: [string, string] }[];
    bottom: { team1: [string, string], team2: [string, string] }[];
  }>({
    top: Array(6).fill(null).map(() => ({ team1: ['', ''], team2: ['', ''] })),
    bottom: Array(6).fill(null).map(() => ({ team1: ['', ''], team2: ['', ''] }))
  });

  const deleteRoundMatches = useDeleteRoundMatches();
  const createMultipleMatches = useCreateMultipleMatches();
  const { toast } = useToast();

  const activePlayers = players.filter(p => p.isActive);
  const topGroupPlayers = activePlayers.filter(p => p.group === 'top');
  const bottomGroupPlayers = activePlayers.filter(p => p.group === 'bottom');

  const currentRoundMatches = matches.filter(m => m.round === currentRound);
  const hasCurrentRoundMatches = currentRoundMatches.length > 0;
  const hasPreviewMatches = previewMatches.length > 0;

  const canGenerateMatches = topGroupPlayers.length === 8 && bottomGroupPlayers.length === 8;

  // Check if current round is completed (all matches finished)
  const isRoundCompleted = hasCurrentRoundMatches && currentRoundMatches.every(m => m.completed);

  useEffect(() => {
    // Initialize manual pairings from local storage if available
    const savedPairings = localStorage.getItem('manual-pairings');
    if (savedPairings) {
      setManualPairings(JSON.parse(savedPairings));
    }
  }, []);

  useEffect(() => {
    // Save manual pairings to local storage whenever they change
    localStorage.setItem('manual-pairings', JSON.stringify(manualPairings));
  }, [manualPairings]);

  const updateManualPairings = (
    group: 'top' | 'bottom', 
    matchIndex: number, 
    team: 'team1' | 'team2', 
    playerIndex: 0 | 1, 
    playerId: string
  ) => {
    setManualPairings(prev => {
      const updatedPairings = { ...prev };
      const newTeam = [...(updatedPairings[group][matchIndex][team])];
      newTeam[playerIndex] = playerId;
      updatedPairings[group][matchIndex] = {
        ...updatedPairings[group][matchIndex],
        [team]: newTeam as [string, string]
      };
      return updatedPairings;
    });
  };

  const generatePreview = () => {
    if (!canGenerateMatches) return;

    let newMatches: Match[] = [];

    if (currentRound === 2 || currentRound === 3) {
      // For rounds 2 and 3: generate matches based on rankings from previous rounds
      const previousMatches = matches.filter(m => m.round < currentRound);
      newMatches = [
        ...generateFinalRoundMatches('top', currentRound, players, activeTournament, previousMatches),
        ...generateFinalRoundMatches('bottom', currentRound, players, activeTournament, previousMatches)
      ];
    } else {
      // Round 1: generate random or manual matches
      if (isManualMode) {
        // Generate matches based on manual pairings
        newMatches = [
          ...generateManualMatches('top', currentRound, manualPairings.top, activeTournament),
          ...generateManualMatches('bottom', currentRound, manualPairings.bottom, activeTournament)
        ];
      } else {
        // Generate random matches
        newMatches = [
          ...generateRandomMatches('top', currentRound, players, activeTournament),
          ...generateRandomMatches('bottom', currentRound, players, activeTournament)
        ];
      }
    }

    setPreviewMatches(newMatches);
  };

  const confirmMatches = async () => {
    if (previewMatches.length === 0) return;

    try {
      // Save matches to database
      await createMultipleMatches.mutateAsync(previewMatches);

      // Add the new matches to the existing matches
      const updatedMatches = [...matches, ...previewMatches];
      setMatches(updatedMatches);
      localStorage.setItem('tournament-matches', JSON.stringify(updatedMatches));

      // Clear the preview matches
      setPreviewMatches([]);

      toast({
        title: "Success",
        description: `Round ${currentRound} matches have been saved successfully.`,
      });
    } catch (error) {
      console.error('Error saving matches:', error);
      toast({
        title: "Error",
        description: "Failed to save matches. Please try again.",
        variant: "destructive",
      });
    }
  };

  const saveManualMatches = async () => {
    try {
      // Generate matches from manual pairings
      const newMatches = [
        ...generateManualMatches('top', currentRound, manualPairings.top, activeTournament),
        ...generateManualMatches('bottom', currentRound, manualPairings.bottom, activeTournament)
      ];

      // Save matches to database
      await createMultipleMatches.mutateAsync(newMatches);

      // Add the new matches to the existing matches
      const updatedMatches = [...matches, ...newMatches];
      setMatches(updatedMatches);
      localStorage.setItem('tournament-matches', JSON.stringify(updatedMatches));

      toast({
        title: "Success",
        description: "Manual matches have been saved successfully.",
      });
    } catch (error: any) {
      console.error('Error saving manual matches:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save manual matches. Please try again.",
        variant: "destructive",
      });
    }
  };

  const cancelPreview = () => {
    setPreviewMatches([]);
  };

  const handleEditMatch = (match: Match) => {
    setSelectedMatch(match);
  };

  const handleSaveScore = (updatedMatch: Match) => {
    // Update the match in the matches array
    const updatedMatches = matches.map(m => m.id === updatedMatch.id ? updatedMatch : m);
    setMatches(updatedMatches);
    localStorage.setItem('tournament-matches', JSON.stringify(updatedMatches));
    setSelectedMatch(null); // Close the score entry form
  };

  const handleDeleteRoundMatches = async () => {
    if (!hasCurrentRoundMatches) return;
    
    try {
      await deleteRoundMatches.mutateAsync({ 
        round: currentRound, 
        tournamentId: activeTournament.id 
      });
      
      // Update local state
      const updatedMatches = matches.filter(m => m.round !== currentRound);
      setMatches(updatedMatches);
      
      toast({
        title: "Success",
        description: `All matches for round ${currentRound} have been deleted.`,
      });
    } catch (error) {
      console.error('Error deleting round matches:', error);
      toast({
        title: "Error",
        description: "Failed to delete round matches. Please try again.",
        variant: "destructive",
      });
    }
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
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Calendar className="h-5 w-5" />
              Tournament Schedule - Round {currentRound}
              {currentRound === 2 && <Badge className="ml-2 bg-orange-500">Score-Based</Badge>}
              {currentRound === 3 && <Badge className="ml-2 bg-purple-500">Final Round</Badge>}
            </CardTitle>
            <div className="flex items-center gap-2">
              {isRoundCompleted && (
                <Button
                  onClick={handleCompleteRound}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Round
                </Button>
              )}
              {hasCurrentRoundMatches && (
                <Button
                  onClick={handleDeleteRoundMatches}
                  variant="destructive"
                  size="sm"
                  disabled={deleteRoundMatches.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {deleteRoundMatches.isPending ? 'Deleting...' : 'Delete Round'}
                </Button>
              )}
              <Badge variant="outline">
                {hasCurrentRoundMatches ? 'Matches Generated' : 'No Matches'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{activePlayers.length}</div>
              <div className="text-sm text-gray-600">Active Players</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{currentRoundMatches.length}</div>
              <div className="text-sm text-gray-600">Current Round Matches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {currentRoundMatches.filter(m => m.completed).length}
              </div>
              <div className="text-sm text-gray-600">Completed Matches</div>
            </div>
          </div>

          {!canGenerateMatches && (
            <Alert className="mb-4">
              <AlertDescription>
                Each group needs exactly 8 active players to generate matches. 
                Currently: Linker Rijtje has {topGroupPlayers.length}/8, Rechter Rijtje has {bottomGroupPlayers.length}/8 players.
              </AlertDescription>
            </Alert>
          )}

          {currentRound === 2 && (
            <Alert className="mb-4 border-orange-200 bg-orange-50">
              <AlertDescription className="text-orange-800">
                Round 2 matches are generated based on Round 1 scores. Players are ranked by their total points and paired strategically.
              </AlertDescription>
            </Alert>
          )}

          {currentRound === 3 && (
            <Alert className="mb-4 border-purple-200 bg-purple-50">
              <AlertDescription className="text-purple-800">
                Round 3 (Final): Top 4 players compete randomly among themselves, bottom 4 players compete randomly among themselves. Groups never mix.
              </AlertDescription>
            </Alert>
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
        </CardContent>
      </Card>

      {isManualMode && canGenerateMatches && currentRound === 1 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-blue-700">Manual Match Setup - Round 1</CardTitle>
              <Button 
                onClick={saveManualMatches}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={createMultipleMatches.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {createMultipleMatches.isPending ? 'Saving...' : 'Save Manual Matches'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ManualPairingSetup 
              manualPairings={manualPairings}
              players={players}
              onUpdatePairing={updateManualPairings}
            />
          </CardContent>
        </Card>
      )}

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
              onEditMatch={handleEditMatch}
            />
            <MatchDisplay
              group="bottom"
              matches={currentRoundMatches}
              players={players}
              onEditMatch={handleEditMatch}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TournamentSchedule;
