
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Trash2, Crown, Target } from "lucide-react";
import { Player } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

interface PlayerManagementProps {
  players: Player[];
  setPlayers: (players: Player[]) => void;
}

const PlayerManagement = ({ players, setPlayers }: PlayerManagementProps) => {
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerGroup, setNewPlayerGroup] = useState<'top' | 'bottom'>('top');
  const { toast } = useToast();

  const addPlayer = () => {
    if (!newPlayerName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a player name",
        variant: "destructive"
      });
      return;
    }

    const groupPlayers = players.filter(p => p.group === newPlayerGroup);
    if (groupPlayers.length >= 8) {
      toast({
        title: "Group Full",
        description: `The ${newPlayerGroup} group already has 8 players`,
        variant: "destructive"
      });
      return;
    }

    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      name: newPlayerName.trim(),
      group: newPlayerGroup,
      totalGames: 0,
      totalSpecials: 0,
      totalPoints: 0,
      matchesPlayed: 0
    };

    setPlayers([...players, newPlayer]);
    setNewPlayerName("");
    
    toast({
      title: "Player Added",
      description: `${newPlayer.name} has been added to the ${newPlayerGroup} group`,
    });
  };

  const removePlayer = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    setPlayers(players.filter(p => p.id !== playerId));
    
    toast({
      title: "Player Removed",
      description: `${player?.name} has been removed from the tournament`,
    });
  };

  const topGroupPlayers = players.filter(p => p.group === 'top');
  const bottomGroupPlayers = players.filter(p => p.group === 'bottom');

  return (
    <div className="space-y-6">
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-600" />
            Add New Player
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Player name"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
              className="flex-1"
            />
            <Select value={newPlayerGroup} onValueChange={(value: 'top' | 'bottom') => setNewPlayerGroup(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">Top Group</SelectItem>
                <SelectItem value="bottom">Bottom Group</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addPlayer} className="bg-blue-600 hover:bg-blue-700">
              Add Player
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <Crown className="h-5 w-5" />
              Top Group ({topGroupPlayers.length}/8)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topGroupPlayers.map((player) => (
                <div key={player.id} className="flex items-center justify-between p-3 bg-white/70 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Crown className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{player.name}</p>
                      <p className="text-sm text-gray-600">
                        {player.totalPoints} pts | {player.matchesPlayed} matches
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">
                      Top
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removePlayer(player.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {topGroupPlayers.length === 0 && (
                <p className="text-center text-gray-500 py-8">No players in top group yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Target className="h-5 w-5" />
              Bottom Group ({bottomGroupPlayers.length}/8)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bottomGroupPlayers.map((player) => (
                <div key={player.id} className="flex items-center justify-between p-3 bg-white/70 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Target className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{player.name}</p>
                      <p className="text-sm text-gray-600">
                        {player.totalPoints} pts | {player.matchesPlayed} matches
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                      Bottom
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removePlayer(player.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {bottomGroupPlayers.length === 0 && (
                <p className="text-center text-gray-500 py-8">No players in bottom group yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlayerManagement;
