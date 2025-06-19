
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, CheckCircle, Trash2 } from "lucide-react";
import { Player } from "@/pages/Index";

interface TournamentScheduleHeaderProps {
  currentRound: number;
  activePlayers: Player[];
  topGroupPlayers: Player[];
  bottomGroupPlayers: Player[];
  currentRoundMatches: any[];
  hasCurrentRoundMatches: boolean;
  canGenerateMatches: boolean;
  isRoundCompleted: boolean;
  onCompleteRound: () => void;
  onDeleteRoundMatches: () => void;
  deleteRoundMatches: { isPending: boolean };
}

const TournamentScheduleHeader = ({
  currentRound,
  activePlayers,
  topGroupPlayers,
  bottomGroupPlayers,
  currentRoundMatches,
  hasCurrentRoundMatches,
  canGenerateMatches,
  isRoundCompleted,
  onCompleteRound,
  onDeleteRoundMatches,
  deleteRoundMatches
}: TournamentScheduleHeaderProps) => {
  return (
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
                onClick={onCompleteRound}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Round
              </Button>
            )}
            {hasCurrentRoundMatches && (
              <Button
                onClick={onDeleteRoundMatches}
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
      </CardContent>
    </Card>
  );
};

export default TournamentScheduleHeader;
