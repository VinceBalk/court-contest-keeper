
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { Player } from "@/pages/Index";
import ManualPairingSetup from "./ManualPairingSetup";

interface ManualMatchSetupProps {
  isManualMode: boolean;
  canGenerateMatches: boolean;
  currentRound: number;
  manualPairings: {
    top: { team1: [string, string], team2: [string, string] }[];
    bottom: { team1: [string, string], team2: [string, string] }[];
  };
  players: Player[];
  tournamentId: string;
  onUpdatePairing: (
    group: 'top' | 'bottom', 
    matchIndex: number, 
    team: 'team1' | 'team2', 
    playerIndex: 0 | 1, 
    playerId: string
  ) => void;
  onSaveManualMatches: () => void;
  createMultipleMatches: { isPending: boolean };
}

const ManualMatchSetup = ({
  isManualMode,
  canGenerateMatches,
  currentRound,
  manualPairings,
  players,
  tournamentId,
  onUpdatePairing,
  onSaveManualMatches,
  createMultipleMatches
}: ManualMatchSetupProps) => {
  if (!isManualMode || !canGenerateMatches || currentRound !== 1) {
    return null;
  }

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-blue-700">Manual Match Setup - Round 1</CardTitle>
          <Button 
            onClick={onSaveManualMatches}
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
          tournamentId={tournamentId}
          onUpdatePairing={onUpdatePairing}
        />
      </CardContent>
    </Card>
  );
};

export default ManualMatchSetup;
