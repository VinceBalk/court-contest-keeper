
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Trophy, Zap, Settings, Target, Clock } from "lucide-react";
import { useT } from "@/contexts/TranslationContext";
import { Player, Tournament } from "@/pages/Index";
import { SpecialType } from "./SpecialManagement";
import { useRole } from "@/contexts/RoleContext";
import { useRolePermissions } from "@/hooks/useRolePermissions";

interface StatsCardsProps {
  players: Player[];
  activeTournament: Tournament | null;
  currentRound: number;
  specialTypes: SpecialType[];
  tournaments: Tournament[];
  onStatsCardClick: (cardType: string) => void;
}

const StatsCards = ({ 
  players, 
  activeTournament, 
  currentRound, 
  specialTypes, 
  tournaments, 
  onStatsCardClick 
}: StatsCardsProps) => {
  const { t } = useT();
  const { userRoles } = useRole();
  const permissions = useRolePermissions(userRoles);

  const activePlayers = players.filter(p => p.isActive);
  const totalSpecials = specialTypes.filter(s => s.isActive).length;

  const statsCards = [
    {
      title: t('stats.totalPlayers'),
      value: players.length,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      clickType: "totalPlayers",
      show: permissions.canManagePlayers
    },
    {
      title: t('stats.activePlayers'),
      value: activePlayers.length,
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50",
      clickType: "activePlayers",
      show: permissions.canManagePlayers
    },
    {
      title: t('stats.tournaments'),
      value: tournaments.length,
      icon: Trophy,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      clickType: "tournaments",
      show: permissions.canManageTournaments
    },
    {
      title: t('stats.currentRound'),
      value: activeTournament ? currentRound : 0,
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      clickType: "matches",
      show: permissions.canViewMatches
    },
    {
      title: t('stats.specialTypes'),
      value: totalSpecials,
      icon: Zap,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      clickType: "specials",
      show: permissions.canManageSpecials
    },
    {
      title: t('stats.settings'),
      value: "Config",
      icon: Settings,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      clickType: "settings",
      show: permissions.canManageSettings,
      isConfig: true
    }
  ];

  const visibleCards = statsCards.filter(card => card.show);

  if (visibleCards.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
      {visibleCards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <Card 
            key={index} 
            className={`${card.bgColor} border-0 cursor-pointer hover:shadow-md transition-shadow bg-white/90 backdrop-blur-sm min-h-[80px] sm:min-h-[100px]`}
            onClick={() => onStatsCardClick(card.clickType)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 p-3 sm:p-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-700 leading-tight">
                {card.title}
              </CardTitle>
              <IconComponent className={`h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 ${card.color} flex-shrink-0`} />
            </CardHeader>
            <CardContent className="pt-0 p-3 sm:p-4">
              <div className="flex items-center justify-between">
                {card.isConfig ? (
                  <Badge variant="secondary" className="text-xs">
                    {card.value}
                  </Badge>
                ) : (
                  <div className={`text-lg sm:text-xl lg:text-2xl font-bold ${card.color}`}>
                    {card.value}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;
