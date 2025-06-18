
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { Player } from "@/pages/Index";
import { useT } from "@/contexts/TranslationContext";

interface PlayerItemProps {
  player: Player;
  onEdit: (player: Player) => void;
  onDelete: (playerId: string) => void;
  isDeleting: boolean;
}

const PlayerItem = ({ player, onEdit, onDelete, isDeleting }: PlayerItemProps) => {
  const { t } = useT();

  return (
    <div className="flex items-center justify-between p-3 bg-white/80 rounded-lg">
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
          onClick={() => onEdit(player)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(player.id)}
          className="text-red-600 hover:text-red-700"
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PlayerItem;
