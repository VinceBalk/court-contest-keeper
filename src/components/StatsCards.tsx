
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Target, Star } from "lucide-react";
import { useT } from "@/contexts/TranslationContext";
import { Player, Tournament } from "@/pages/Index";
import { SpecialType } from "@/components/SpecialManagement";

interface StatsCardsProps {
  players: Player[];
  activeTournament: Tournament | null;
  currentRound: number;
  specialTypes: SpecialType[];
  onStatsCardClick: (cardType: string) => void;
}

const StatsCards = ({ 
  players, 
  activeTournament, 
  currentRound, 
  specialTypes, 
  onStatsCardClick 
}: StatsCardsProps) => {
  const { t } = useT();

  const activePlayers = players.filter(p => p.isActive);
  const topGroupPlayers = activePlayers.filter(p => p.group === 'top').sort((a, b) => a.name.localeCompare(b.name));
  const bottomGroupPlayers = activePlayers.filter(p => p.group === 'bottom').sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card 
        className="bg-white/80 backdrop-blur-sm border-blue-200 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => onStatsCardClick('activePlayers')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('general.activePlayers')}</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{activePlayers.length}</div>
          <p className="text-xs text-gray-600">
            {t('player.linkerRijtje')}: {topGroupPlayers.length}/8, {t('player.rechterRijtje')}: {bottomGroupPlayers.length}/8
          </p>
        </CardContent>
      </Card>

      <Card 
        className="bg-white/80 backdrop-blur-sm border-green-200 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => onStatsCardClick('totalPlayers')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('general.totalPlayers')}</CardTitle>
          <Calendar className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{players.length}</div>
          <p className="text-xs text-gray-600">
            {t('player.availablePool')}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('general.currentRound')}</CardTitle>
          <Target className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {activeTournament ? `${currentRound}/3` : '-'}
          </div>
          <p className="text-xs text-gray-600">{t('general.tournamentProgress')}</p>
        </CardContent>
      </Card>

      <Card 
        className="bg-white/80 backdrop-blur-sm border-orange-200 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => onStatsCardClick('specials')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('general.specials')}</CardTitle>
          <Star className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {specialTypes.filter(s => s.isActive).length}
          </div>
          <p className="text-xs text-gray-600">{t('general.activeSpecials')}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
