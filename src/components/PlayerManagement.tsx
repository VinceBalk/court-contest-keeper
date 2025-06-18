
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Users, Edit, Trash2, Trophy } from "lucide-react";
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
  const [newPlayerGroup, setNewPlayerGroup] = useState<'top' | 'bottom'>('top');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const { toast } = useToast();

  const createPlayerMutation = useCreatePlayer();
  const deletePlayerMutation = useDeletePlayer();

  const handleAddPlayer = async () => {
    if (!newPlayerName.trim()) {
      toast({
        title: t('general.error'),
        description: t('player.enterName'),
        variant: "destructive"
      });
      return;
    }

    const newPlayerData = {
      name: newPlayerName.trim(),
      email: '',
      phone: '',
      skillLevel: 5, // Default value for database
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
        setNewPlayerGroup('top');
        
        toast({
          title: t('player.added'),
          description: `${newPlayerData.name} ${t('player.addedToGroup')} ${newPlayerData.group === 'top' ? t('player.topGroup') : t('player.bottomGroup')} ${t('player.group.label')}`,
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
            description: `${playerToDelete.name} ${t('player.removed')}`,
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <Input
                placeholder={t('player.name.placeholder')}
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <Select value={newPlayerGroup} onValueChange={(value: 'top' | 'bottom') => setNewPlayerGroup(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">{t('player.topGroup')}</SelectItem>
                  <SelectItem value="bottom">{t('player.bottomGroup')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Button 
                onClick={handleAddPlayer} 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={createPlayerMutation.isPending}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {createPlayerMutation.isPending ? 'Adding...' : t('general.add')}
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
              {t('player.topGroup')} ({topGroupPlayers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topGroupPlayers.map((player) => (
                <div key={player.id} className="flex items-center justify-between p-3 bg-white/80 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium">{player.name}</div>
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
                      disabled={deletePlayerMutation.isPending}
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
              {t('player.bottomGroup')} ({bottomGroupPlayers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bottomGroupPlayers.map((player) => (
                <div key={player.id} className="flex items-center justify-between p-3 bg-white/80 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium">{player.name}</div>
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
                      disabled={deletePlayerMutation.isPending}
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
            console.log('Player updated:', updatedPlayer);
          }}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
};

export default PlayerManagement;
