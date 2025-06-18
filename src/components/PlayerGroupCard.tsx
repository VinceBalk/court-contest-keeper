
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users } from "lucide-react";
import { Player } from "@/pages/Index";
import { useT } from "@/contexts/TranslationContext";
import PlayerItem from "./PlayerItem";

interface PlayerGroupCardProps {
  players: Player[];
  groupType: 'top' | 'bottom';
  onEditPlayer: (player: Player) => void;
  onDeletePlayer: (playerId: string) => void;
  isDeleting: boolean;
}

const PlayerGroupCard = ({ 
  players, 
  groupType, 
  onEditPlayer, 
  onDeletePlayer, 
  isDeleting 
}: PlayerGroupCardProps) => {
  const { t } = useT();
  
  const isTopGroup = groupType === 'top';
  const icon = isTopGroup ? Trophy : Users;
  const title = isTopGroup ? t('player.topGroup') : t('player.bottomGroup');
  const cardClasses = isTopGroup 
    ? "bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-300"
    : "bg-gradient-to-br from-blue-100 to-green-100 border-blue-300";
  const titleClasses = isTopGroup ? "text-orange-700" : "text-blue-700";

  const Icon = icon;

  return (
    <Card className={cardClasses}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${titleClasses}`}>
          <Icon className="h-5 w-5" />
          {title} ({players.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {players.map((player) => (
            <PlayerItem
              key={player.id}
              player={player}
              onEdit={onEditPlayer}
              onDelete={onDeletePlayer}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerGroupCard;
