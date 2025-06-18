
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UserPlus, Trash2, Crown, Target, Edit2, Check, X, Plus, Minus, ArrowUp, ArrowDown, Eye } from "lucide-react";
import { Player, Match } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";
import PlayerDetailView from "./PlayerDetailView";

interface PlayerManagementProps {
  players: Player[];
  setPlayers: (players: Player[]) => void;
  matches?: Match[];
}

const PlayerManagement = ({ players, setPlayers, matches = [] }: PlayerManagementProps) => {
  const [newPlayer, setNewPlayer] = useState({
    firstName: "",
    middleName: "",
    surname: "",
    group: 'top' as 'top' | 'bottom'
  });
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);
  const [editingData, setEditingData] = useState({
    firstName: "",
    middleName: "",
    surname: ""
  });
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const { toast } = useToast();

  const addPlayer = () => {
    if (!newPlayer.firstName.trim()) {
      toast({
        title: "Error",
        description: "First name is required",
        variant: "destructive"
      });
      return;
    }

    const fullName = [
      newPlayer.firstName.trim(),
      newPlayer.middleName.trim(),
      newPlayer.surname.trim()
    ].filter(Boolean).join(' ');

    const newPlayerData: Player = {
      id: `player-${Date.now()}`,
      name: fullName,
      group: newPlayer.group,
      totalGames: 0,
      totalSpecials: 0,
      totalPoints: 0,
      matchesPlayed: 0,
      isActive: false,
      overallStats: {
        totalGames: 0,
        totalSpecials: 0,
        totalPoints: 0,
        matchesPlayed: 0,
        tournamentsPlayed: 0
      }
    };

    setPlayers([...players, newPlayerData]);
    setNewPlayer({ firstName: "", middleName: "", surname: "", group: 'top' });
    
    toast({
      title: "Player Added",
      description: `${fullName} has been added to the ${newPlayer.group === 'top' ? 'Linker Rijtje' : 'Rechter Rijtje'} group`,
    });
  };

  const togglePlayerActive = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    const activePlayers = players.filter(p => p.isActive);
    const activeInGroup = activePlayers.filter(p => p.group === player.group);

    if (!player.isActive && activeInGroup.length >= 8) {
      toast({
        title: "Group Full",
        description: `${player.group === 'top' ? 'Linker Rijtje' : 'Rechter Rijtje'} already has 8 active players`,
        variant: "destructive"
      });
      return;
    }

    const updatedPlayers = players.map(p =>
      p.id === playerId ? { ...p, isActive: !p.isActive } : p
    ).sort((a, b) => a.name.localeCompare(b.name));

    setPlayers(updatedPlayers);
    
    toast({
      title: player.isActive ? "Player Deactivated" : "Player Activated",
      description: `${player.name} has been ${player.isActive ? 'removed from' : 'added to'} the tournament`,
    });
  };

  const promotePlayer = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player || player.group === 'top') return;

    const activeTopPlayers = players.filter(p => p.isActive && p.group === 'top');
    if (player.isActive && activeTopPlayers.length >= 8) {
      toast({
        title: "Group Full",
        description: "Linker Rijtje already has 8 active players",
        variant: "destructive"
      });
      return;
    }

    const updatedPlayers = players.map(p =>
      p.id === playerId ? { ...p, group: 'top' as const } : p
    ).sort((a, b) => a.name.localeCompare(b.name));

    setPlayers(updatedPlayers);
    
    toast({
      title: "Player Promoted",
      description: `${player.name} has been promoted to Linker Rijtje`,
    });
  };

  const relegatePlayer = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player || player.group === 'bottom') return;

    const activeBottomPlayers = players.filter(p => p.isActive && p.group === 'bottom');
    if (player.isActive && activeBottomPlayers.length >= 8) {
      toast({
        title: "Group Full",
        description: "Rechter Rijtje already has 8 active players",
        variant: "destructive"
      });
      return;
    }

    const updatedPlayers = players.map(p =>
      p.id === playerId ? { ...p, group: 'bottom' as const } : p
    ).sort((a, b) => a.name.localeCompare(b.name));

    setPlayers(updatedPlayers);
    
    toast({
      title: "Player Relegated",
      description: `${player.name} has been relegated to Rechter Rijtje`,
    });
  };

  const startEditing = (playerId: string, currentName: string) => {
    const nameParts = currentName.split(' ');
    setEditingPlayer(playerId);
    setEditingData({
      firstName: nameParts[0] || '',
      middleName: nameParts.slice(1, -1).join(' ') || '',
      surname: nameParts.slice(-1)[0] || ''
    });
  };

  const saveEdit = () => {
    if (!editingData.firstName.trim()) {
      toast({
        title: "Error",
        description: "First name is required",
        variant: "destructive"
      });
      return;
    }

    const fullName = [
      editingData.firstName.trim(),
      editingData.middleName.trim(),
      editingData.surname.trim()
    ].filter(Boolean).join(' ');

    const updatedPlayers = players.map(player =>
      player.id === editingPlayer
        ? { ...player, name: fullName }
        : player
    ).sort((a, b) => a.name.localeCompare(b.name));

    setPlayers(updatedPlayers);
    setEditingPlayer(null);
    setEditingData({ firstName: "", middleName: "", surname: "" });
    
    toast({
      title: "Name Updated",
      description: "Player name has been updated successfully",
    });
  };

  const cancelEdit = () => {
    setEditingPlayer(null);
    setEditingData({ firstName: "", middleName: "", surname: "" });
  };

  const handlePlayerUpdate = (updatedPlayer: Player) => {
    const updatedPlayers = players.map(p => 
      p.id === updatedPlayer.id ? updatedPlayer : p
    ).sort((a, b) => a.name.localeCompare(b.name));
    
    setPlayers(updatedPlayers);
    setSelectedPlayer(null);
  };

  const removePlayer = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    setPlayers(players.filter(p => p.id !== playerId));
    
    toast({
      title: "Player Removed",
      description: `${player?.name} has been removed from the tournament`,
    });
  };

  const allPlayers = [...players].sort((a, b) => a.name.localeCompare(b.name));
  const topGroupPlayers = allPlayers.filter(p => p.group === 'top');
  const bottomGroupPlayers = allPlayers.filter(p => p.group === 'bottom');

  const renderPlayerCard = (player: Player, groupType: 'top' | 'bottom') => {
    const activeInGroup = players.filter(p => p.isActive && p.group === groupType).length;
    
    return (
      <div key={player.id} className={`flex items-center justify-between p-3 rounded-lg border ${
        player.isActive 
          ? 'bg-white border-green-300 shadow-sm' 
          : 'bg-gray-50 border-gray-200'
      }`}>
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
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    value={editingData.firstName}
                    onChange={(e) => setEditingData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="First name"
                    className="h-8 text-xs"
                  />
                  <Input
                    value={editingData.middleName}
                    onChange={(e) => setEditingData(prev => ({ ...prev, middleName: e.target.value }))}
                    placeholder="Middle (optional)"
                    className="h-8 text-xs"
                  />
                  <Input
                    value={editingData.surname}
                    onChange={(e) => setEditingData(prev => ({ ...prev, surname: e.target.value }))}
                    placeholder="Surname"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveEdit} className="h-8 px-2 text-xs">
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={cancelEdit} className="h-8 px-2 text-xs">
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2">
                  <p className={`font-medium ${player.isActive ? 'text-gray-800' : 'text-gray-500'}`}>
                    {player.name}
                  </p>
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedPlayer(player)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 p-0"
            title="View player details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <div className="flex flex-col gap-1">
            {groupType === 'bottom' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => promotePlayer(player.id)}
                className="text-green-600 hover:text-green-700 hover:bg-green-50 h-8 w-8 p-0"
                title="Promote to Linker Rijtje"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            )}
            {groupType === 'top' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => relegatePlayer(player.id)}
                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 h-8 w-8 p-0"
                title="Relegate to Rechter Rijtje"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => togglePlayerActive(player.id)}
              className={`h-8 w-8 p-0 ${
                player.isActive 
                  ? 'text-red-600 hover:text-red-700 hover:bg-red-50' 
                  : 'text-green-600 hover:text-green-700 hover:bg-green-50'
              }`}
              disabled={!player.isActive && activeInGroup >= 8}
              title={player.isActive ? 'Remove from tournament' : 'Add to tournament'}
            >
              {player.isActive ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>
          </div>
          <Badge variant="outline" className={`${
            groupType === 'top' 
              ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
              : 'bg-blue-100 text-blue-700 border-blue-300'
          }`}>
            {groupType === 'top' ? 'Linker' : 'Rechter'}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => removePlayer(player.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

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
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="First name"
                  value={newPlayer.firstName}
                  onChange={(e) => setNewPlayer(prev => ({ ...prev, firstName: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                />
              </div>
              <div>
                <Label htmlFor="middleName">Middle Name</Label>
                <Input
                  id="middleName"
                  placeholder="Middle name (optional)"
                  value={newPlayer.middleName}
                  onChange={(e) => setNewPlayer(prev => ({ ...prev, middleName: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                />
              </div>
              <div>
                <Label htmlFor="surname">Surname</Label>
                <Input
                  id="surname"
                  placeholder="Surname (optional)"
                  value={newPlayer.surname}
                  onChange={(e) => setNewPlayer(prev => ({ ...prev, surname: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                />
              </div>
              <div>
                <Label htmlFor="group">Group</Label>
                <Select value={newPlayer.group} onValueChange={(value: 'top' | 'bottom') => setNewPlayer(prev => ({ ...prev, group: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Linker Rijtje</SelectItem>
                    <SelectItem value="bottom">Rechter Rijtje</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
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
              Linker Rijtje ({topGroupPlayers.filter(p => p.isActive).length}/8 active, {topGroupPlayers.length} total)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topGroupPlayers.map((player) => renderPlayerCard(player, 'top'))}
              {topGroupPlayers.length === 0 && (
                <p className="text-center text-gray-500 py-8">No players in Linker Rijtje yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Target className="h-5 w-5" />
              Rechter Rijtje ({bottomGroupPlayers.filter(p => p.isActive).length}/8 active, {bottomGroupPlayers.length} total)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bottomGroupPlayers.map((player) => renderPlayerCard(player, 'bottom'))}
              {bottomGroupPlayers.length === 0 && (
                <p className="text-center text-gray-500 py-8">No players in Rechter Rijtje yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedPlayer && (
        <PlayerDetailView
          player={selectedPlayer}
          matches={matches}
          players={players}
          onUpdatePlayer={handlePlayerUpdate}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
};

export default PlayerManagement;
