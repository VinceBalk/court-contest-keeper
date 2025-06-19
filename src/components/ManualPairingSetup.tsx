
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Player } from "@/pages/Index";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ManualPairingSetupProps {
  manualPairings: {
    top: { team1: [string, string], team2: [string, string] }[];
    bottom: { team1: [string, string], team2: [string, string] }[];
  };
  players: Player[];
  onUpdatePairing: (
    group: 'top' | 'bottom', 
    matchIndex: number, 
    team: 'team1' | 'team2', 
    playerIndex: 0 | 1, 
    playerId: string
  ) => void;
}

const ManualPairingSetup = ({ manualPairings, players, onUpdatePairing }: ManualPairingSetupProps) => {
  const getMatchInfo = (group: 'top' | 'bottom', matchIndex: number, currentRound: number = 1) => {
    // First 3 matches on court 1, next 3 on court 2
    const baseCourt = Math.floor(matchIndex / 3) + 1; // 1 or 2
    // For top group: courts 1-2, for bottom group: courts 3-4
    const court = group === 'top' ? baseCourt : baseCourt + 2;
    const matchNumber = (matchIndex % 3) + 1 + ((currentRound - 1) * 3);
    
    return {
      court: court,
      matchNumber: matchNumber
    };
  };

  const validatePairings = () => {
    const errors: string[] = [];
    
    ['top', 'bottom'].forEach(group => {
      const groupKey = group as 'top' | 'bottom';
      const groupPairings = manualPairings[groupKey];
      
      groupPairings.forEach((pairing, index) => {
        if (!pairing.team1[0] || !pairing.team1[1] || !pairing.team2[0] || !pairing.team2[1]) {
          errors.push(`${group === 'top' ? 'Linker' : 'Rechter'} Rijtje - Match ${index + 1}: Missing players`);
        }
      });
    });
    
    return errors;
  };

  const validationErrors = validatePairings();

  return (
    <div className="space-y-4">
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              {validationErrors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-700">Manual Match Setup - Round 1</CardTitle>
          <p className="text-sm text-blue-600">
            Linker Rijtje uses courts 1-2, Rechter Rijtje uses courts 3-4. Each court will have 3 matches.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(['top', 'bottom'] as const).map(group => (
              <div key={group}>
                <h3 className="font-semibold mb-4 text-lg">
                  {group === 'top' ? 'Linker Rijtje (Courts 1-2)' : 'Rechter Rijtje (Courts 3-4)'}
                </h3>
                <div className="space-y-4">
                  {manualPairings[group].map((pairing, matchIndex) => {
                    const matchInfo = getMatchInfo(group, matchIndex, 1);
                    const availablePlayers = players.filter(p => p.group === group && p.isActive);
                    
                    return (
                      <div key={matchIndex} className="p-4 bg-white rounded-lg border shadow-sm">
                        <h4 className="font-medium mb-3 text-center bg-gray-100 p-2 rounded">
                          Court {matchInfo.court} - Match {matchIndex + 1}
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <label className="text-sm font-medium text-blue-700">Team 1</label>
                            <div className="space-y-2">
                              <select
                                value={pairing.team1[0]}
                                onChange={(e) => onUpdatePairing(group, matchIndex, 'team1', 0, e.target.value)}
                                className="w-full p-2 border rounde text-sm focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Player 1</option>
                                {availablePlayers.map(player => (
                                  <option key={player.id} value={player.id}>{player.name}</option>
                                ))}
                              </select>
                              <select
                                value={pairing.team1[1]}
                                onChange={(e) => onUpdatePairing(group, matchIndex, 'team1', 1, e.target.value)}
                                className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Player 2</option>
                                {availablePlayers.map(player => (
                                  <option key={player.id} value={player.id}>{player.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <label className="text-sm font-medium text-green-700">Team 2</label>
                            <div className="space-y-2">
                              <select
                                value={pairing.team2[0]}
                                onChange={(e) => onUpdatePairing(group, matchIndex, 'team2', 0, e.target.value)}
                                className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-green-500"
                              >
                                <option value="">Select Player 1</option>
                                {availablePlayers.map(player => (
                                  <option key={player.id} value={player.id}>{player.name}</option>
                                ))}
                              </select>
                              <select
                                value={pairing.team2[1]}
                                onChange={(e) => onUpdatePairing(group, matchIndex, 'team2', 1, e.target.value)}
                                className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-green-500"
                              >
                                <option value="">Select Player 2</option>
                                {availablePlayers.map(player => (
                                  <option key={player.id} value={player.id}>{player.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManualPairingSetup;
