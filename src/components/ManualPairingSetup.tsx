
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Player } from "@/pages/Index";

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
    const court = Math.floor(matchIndex / 3) + 1;
    // Fixed: Top group uses courts 1-2, bottom group uses courts 3-4
    const courtAdjusted = group === 'top' ? court : court + 2;
    const matchNumber = (matchIndex % 3) + 1 + ((currentRound - 1) * 3);
    
    return {
      court: courtAdjusted,
      matchNumber: matchNumber
    };
  };

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-700">Manual Match Setup - Round 1</CardTitle>
        <p className="text-sm text-blue-600">
          Linker Rijtje uses courts 1-2, Rechter Rijtje uses courts 3-4. Round 1 uses matches 1-3 per court, Round 2 will use matches 4-6
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(['top', 'bottom'] as const).map(group => (
            <div key={group}>
              <h3 className="font-semibold mb-4">
                {group === 'top' ? 'Linker Rijtje (Courts 1-2)' : 'Rechter Rijtje (Courts 3-4)'}
              </h3>
              <div className="space-y-4">
                {manualPairings[group].map((pairing, matchIndex) => {
                  const matchInfo = getMatchInfo(group, matchIndex, 1);
                  return (
                    <div key={matchIndex} className="p-4 bg-white rounded border">
                      <h4 className="font-medium mb-2">
                        Court {matchInfo.court} - Match {matchInfo.matchNumber}
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Team 1</label>
                          <div className="space-y-2">
                            <select
                              value={pairing.team1[0]}
                              onChange={(e) => onUpdatePairing(group, matchIndex, 'team1', 0, e.target.value)}
                              className="w-full p-2 border rounded"
                            >
                              <option value="">Select Player 1</option>
                              {players.filter(p => p.group === group).map(player => (
                                <option key={player.id} value={player.id}>{player.name}</option>
                              ))}
                            </select>
                            <select
                              value={pairing.team1[1]}
                              onChange={(e) => onUpdatePairing(group, matchIndex, 'team1', 1, e.target.value)}
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
                              onChange={(e) => onUpdatePairing(group, matchIndex, 'team2', 0, e.target.value)}
                              className="w-full p-2 border rounded"
                            >
                              <option value="">Select Player 1</option>
                              {players.filter(p => p.group === group).map(player => (
                                <option key={player.id} value={player.id}>{player.name}</option>
                              ))}
                            </select>
                            <select
                              value={pairing.team2[1]}
                              onChange={(e) => onUpdatePairing(group, matchIndex, 'team2', 1, e.target.value)}
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
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ManualPairingSetup;
