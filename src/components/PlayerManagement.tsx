
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Trash2, Crown, Target, Edit2, Check, X } from "lucide-react";
import { Player } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

interface PlayerManagementProps {
  players: Player[];
  setPlayers: (players: Player[]) => void;
}

const PlayerManagement = ({ players, setPlayers }: PlayerManagementProps) => {
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerGroup, setNewPlayerGroup] = useState<'top' | 'bottom'>('top');
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
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
      matchesPlayed: 0,
      overallStats: {
        totalGames: 0,
        totalSpecials: 0,
        totalPoints: 0,
        matchesPlayed: 0,
        tournamentsPlayed: 0
      }
    };

    setPlayers([...players, newPlayer]);
    setNewPlayerName("");
    
    toast({
      title: "Player Added",
      description: `${newPlayer.name} has been added to the ${newPlayerGroup} group`,
    });
  };

  const startEditing = (playerId: string, currentName: string) => {
    setEditingPlayer(playerId);
    setEditingName(currentName);
  };

  const saveEdit = () => {
    if (!editingName.trim()) {
      toast({
        title: "Error",
        description: "Player name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    const updatedPlayers = players.map(player =>
      player.id === editingPlayer
        ? { ...player, name: editingName.trim() }
        : player
    );

    setPlayers(updatedPlayers);
    setEditingPlayer(null);
    setEditingName("");
    
    toast({
      title: "Name Updated",
      description: "Player name has been updated successfully",
    });
  };

  const cancelEdit = () => {
    setEditingPlayer(null);
    setEditingName("");
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

  const renderPlayerCard = (player: Player, groupType: 'top' | 'bottom') => (
    <div key={player.id} className="flex items-center justify-between p-3 bg-white/70 rounded-lg border border-gray-200">
      <div className="flex items-center gap-3 flex-1">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          groupType === 'top' ? 'bg-yellow-100' : 'bg-blue-100'
        }`}>
          {groupType === 'top' ? (
            <Crown className="h-4 w-4 text-yellow-600" />
          ) : (
            <Target className="h-4 w-4 text-blue-600" />
          )}
        </div>
        <div className="flex-1">
          {editingPlayer === player.id ? (
            <div className="flex items-center gap-2">
              <Input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="h-8"
                onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                autoFocus
              />
              <Button size="sm" onClick={saveEdit} className="h-8 w-8 p-0">
                <Check className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={cancelEdit} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-800">{player.name}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => startEditing(player.id, player.name)}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Current: {player.totalPoints} pts | {player.matchesPlayed} matches
              </p>
              <p className="text-xs text-gray-500">
                Overall: {player.overallStats.totalPoints} pts | {player.overallStats.tournamentsPlayed} tournaments
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={`${
          groupType === 'top' 
            ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
            : 'bg-blue-100 text-blue-700 border-blue-300'
        }`}>
          {groupType === 'top' ? 'Top' : 'Bottom'}
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
  );

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
              {topGroupPlayers.map((player) => renderPlayerCard(player, 'top'))}
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
              {bottomGroupPlayers.map((player) => renderPlayerCard(player, 'bottom'))}
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
