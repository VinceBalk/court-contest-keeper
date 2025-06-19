
import { useState, useEffect } from "react";
import { Player, Match, Tournament } from "@/pages/Index";
import { useDeleteRoundMatches, useCreateMultipleMatches } from "@/hooks/useMatches";
import { useToast } from "@/hooks/use-toast";
import { 
  generateFinalRoundMatches, 
  generateRandomMatches, 
  generateManualMatches 
} from "@/utils/matchGeneration";

interface UseTournamentScheduleProps {
  players: Player[];
  matches: Match[];
  setMatches: (matches: Match[]) => void;
  currentRound: number;
  activeTournament: Tournament;
}

export const useTournamentSchedule = ({
  players,
  matches,
  setMatches,
  currentRound,
  activeTournament
}: UseTournamentScheduleProps) => {
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
  const isRoundCompleted = hasCurrentRoundMatches && currentRoundMatches.every(m => m.completed);

  useEffect(() => {
    const savedPairings = localStorage.getItem('manual-pairings');
    if (savedPairings) {
      setManualPairings(JSON.parse(savedPairings));
    }
  }, []);

  useEffect(() => {
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
      const previousMatches = matches.filter(m => m.round < currentRound);
      newMatches = [
        ...generateFinalRoundMatches('top', currentRound, players, activeTournament, previousMatches),
        ...generateFinalRoundMatches('bottom', currentRound, players, activeTournament, previousMatches)
      ];
    } else {
      if (isManualMode) {
        try {
          newMatches = [
            ...generateManualMatches('top', currentRound, manualPairings.top, activeTournament),
            ...generateManualMatches('bottom', currentRound, manualPairings.bottom, activeTournament)
          ];
        } catch (error: any) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
      } else {
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
      const matchesWithTournamentId = previewMatches.map(match => ({
        ...match,
        tournamentId: activeTournament.id
      }));

      await createMultipleMatches.mutateAsync(matchesWithTournamentId);

      const updatedMatches = [...matches, ...previewMatches];
      setMatches(updatedMatches);
      localStorage.setItem('tournament-matches', JSON.stringify(updatedMatches));
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
      const newMatches = [
        ...generateManualMatches('top', currentRound, manualPairings.top, activeTournament),
        ...generateManualMatches('bottom', currentRound, manualPairings.bottom, activeTournament)
      ];

      console.log('Generated manual matches:', newMatches);

      const matchesWithTournamentId = newMatches.map(match => ({
        ...match,
        tournamentId: activeTournament.id
      }));

      await createMultipleMatches.mutateAsync(matchesWithTournamentId);

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

  const handleDeleteRoundMatches = async () => {
    if (!hasCurrentRoundMatches) return;
    
    try {
      await deleteRoundMatches.mutateAsync({ 
        round: currentRound, 
        tournamentId: activeTournament.id 
      });
      
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

  return {
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
    cancelPreview: () => setPreviewMatches([]),
    handleDeleteRoundMatches,
    deleteRoundMatches
  };
};
