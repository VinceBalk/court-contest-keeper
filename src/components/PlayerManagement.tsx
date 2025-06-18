
import { useState } from "react";
import { Player, Match } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";
import { useT } from "@/contexts/TranslationContext";
import { useDeletePlayer } from "@/hooks/usePlayers";
import PlayerDetailView from "./PlayerDetailView";
import PlayerForm from "./PlayerForm";
import PlayerGroupCard from "./PlayerGroupCard";

interface PlayerManagementProps {
  players: Player[];
  setPlayers: (players: Player[]) => void;
  matches?: Match[];
}

const PlayerManagement = ({ players, setPlayers, matches = [] }: PlayerManagementProps) => {
  const { t } = useT();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const { toast } = useToast();
  const deletePlayerMutation = useDeletePlayer();

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
      <PlayerForm />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlayerGroupCard
          players={topGroupPlayers}
          groupType="top"
          onEditPlayer={setSelectedPlayer}
          onDeletePlayer={handleDeletePlayer}
          isDeleting={deletePlayerMutation.isPending}
        />

        <PlayerGroupCard
          players={bottomGroupPlayers}
          groupType="bottom"
          onEditPlayer={setSelectedPlayer}
          onDeletePlayer={handleDeletePlayer}
          isDeleting={deletePlayerMutation.isPending}
        />
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
