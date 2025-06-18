
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Users, Edit, Trash2, Mail, Phone, Trophy } from "lucide-react";
import { Player, Match } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";
import { useT } from "@/contexts/TranslationContext";
import PlayerDetailView from "./PlayerDetailView";
import { useCreatePlayer, useDeletePlayer } from "@/hooks/usePlayers";

interface PlayerManagementProps {
  players: Player[];
  setPlayers: (players: Player[]) => void;
  matches?: Match[];
}

const PlayerManagement = ({ players, setPlayers, matches = [] }: PlayerManagementProps) => {
  const { t } = useT();
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerEmail, setNewPlayerEmail] = useState("");
  const [newPlayerPhone, setNewPlayerPhone] = useState("");
  const [newPlayerSkillLevel, setNewPlayerSkillLevel] = useState(5);
  const [newPlayerGroup, setNewPlayerGroup] = useState<'top' | 'bottom'>('top');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const { toast } = useToast();

  const createPlayerMutation = useCreatePlayer();
  const deletePlayerMutation = useDeletePlayer();

  const handleAddPlayer = async () => {
    if (!newPlayerName.trim()) {
      toast({
        title: t('general.error'),
        description: "Please enter a player name",
        variant: "destructive"
      });
      return;
    }

    const newPlayerData = {
      name: newPlayerName.trim(),
      email: newPlayerEmail.trim(),
      phone: newPlayerPhone.trim(),
      skillLevel: newPlayerSkillLevel,
      group: newPlayerGroup,
      totalGames: 0,
      totalSpecials: 0,
      totalPoints: 0,
      matchesPlayed: 0,
      isActive: true,
    };

    createPlayerMutation.mutate(newPlayerData, {
      onSuccess: () => {
        setNewPlayerName("");
        setNewPlayerEmail("");
        setNewPlayerPhone("");
        setNewPlayerSkillLevel(5);
        setNewPlayerGroup('top');
        
        toast({
          title: t('player.added'),
          description: `${newPlayerData.name} has been added to the ${newPlayerData.group} group`,
        });
      },
      onError: (error) => {
        toast({
          title: t('general.error'),
          description: "Failed to add player",
          variant: "destructive"
        });
        console.error('Error adding player:', error);
      }
    });
  };

  const handleDeletePlayer = async (playerId: string) => {
    const playerToDelete = players.find(p => p.id === playerId);
    if (playerToDelete) {
      deletePlayerMutation.mutate(playerId, {
        onSuccess: () => {
          toast({
            title: t('player.deleted'),
            description: `${playerToDelete.name} has been removed`,
          });
        },
        onError: (error) => {
          toast({
            title: t('general.error'),
            description: "Failed to delete player",
            variant: "destructive"
          });
          console.error('Error deleting player:', error);
        }
      });
    }
  };

  const handleToggleActive = (playerId: string) => {
    // This will be handled by player update mutation in PlayerDetailView
    const player = players.find(p => p.id === playerId);
    if (player) {
      setSelectedPlayer(player);
    }
  };

  const activePlayers = players.filter(p => p.isActive);
  const topGroupPlayers = activePlayers.filter(p => p.group === 'top');
  const bottomGroupPlayers = activePlayers.filter(p => p.group === 'bottom');

  return (
    <div className="space-y-6">
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-600" />
            {t('player.add.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <Input
                placeholder={t('player.name.placeholder')}
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="sm:col-span-2 lg:col-span-1">
              <Input
                placeholder="Email (optional)"
                type="email"
                value={newPlayerEmail}
                onChange={(e) => setNewPlayerEmail(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="sm:col-span-2 lg:col-span-1">
              <Input
                placeholder="Phone (optional)"
                value={newPlayerPhone}
                onChange={(e) => setNewPlayerPhone(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <Select value={newPlayerSkillLevel.toString()} onValueChange={(value) => setNewPlayerSkillLevel(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Skill" />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6,7,8,9,10].map(level => (
                    <SelectItem key={level} value={level.toString()}>
                      Level {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={newPlayerGroup} onValueChange={(value: 'top' | 'bottom') => setNewPlayerGroup(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Top Group</SelectItem>
                  <SelectItem value="bottom">Bottom Group</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <Button 
                onClick={handleAddPlayer} 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={createPlayerMutation.isLoading}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                <span className="sm:hidden">Add</span>
                <span className="hidden sm:inline">
                  {createPlayerMutation.isLoading ? 'Adding...' : t('general.add')}
                </span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Trophy className="h-5 w-5" />
              Linker Rijtje ({topGroupPlayers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topGroupPlayers.map((player) => (
                <div key={player.id} className="flex items-center justify-between p-3 bg-white/80 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium">{player.name}</div>
                      <div className="text-sm text-gray-600 flex items-center gap-3">
                        <span>Level {player.skillLevel}</span>
                        {player.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {player.email}
                          </span>
                        )}
                        {player.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {player.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={player.isActive ? "default" : "secondary"}>
                      {player.isActive ? t('general.active') : t('general.inactive')}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPlayer(player)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePlayer(player.id)}
                      className="text-red-600 hover:text-red-700"
                      disabled={deletePlayerMutation.isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-100 to-green-100 border-blue-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Users className="h-5 w-5" />
              Rechter Rijtje ({bottomGroupPlayers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bottomGroupPlayers.map((player) => (
                <div key={player.id} className="flex items-center justify-between p-3 bg-white/80 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium">{player.name}</div>
                      <div className="text-sm text-gray-600 flex items-center gap-3">
                        <span>Level {player.skillLevel}</span>
                        {player.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {player.email}
                          </span>
                        )}
                        {player.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {player.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={player.isActive ? "default" : "secondary"}>
                      {player.isActive ? t('general.active') : t('general.inactive')}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPlayer(player)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePlayer(player.id)}
                      className="text-red-600 hover:text-red-700"
                      disabled={deletePlayerMutation.isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedPlayer && (
        <PlayerDetailView
          player={selectedPlayer}
          players={players}
          matches={matches}
          onUpdatePlayer={(updatedPlayer) => {
            // Player updates are handled through Supabase mutations in PlayerDetailView
            console.log('Player updated:', updatedPlayer);
          }}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
};

export default PlayerManagement;
