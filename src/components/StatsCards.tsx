
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Target, Star, Settings } from "lucide-react";
import { useT } from "@/contexts/TranslationContext";
import { Player, Tournament } from "@/pages/Index";
import { SpecialType } from "@/components/SpecialManagement";

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

  const activePlayers = players?.filter(p => p.isActive) || [];
  const topGroupPlayers = activePlayers.filter(p => p.group === 'top').sort((a, b) => a.name.localeCompare(b.name));
  const bottomGroupPlayers = activePlayers.filter(p => p.group === 'bottom').sort((a, b) => a.name.localeCompare(b.name));

  // Get upcoming tournament (future tournament, not active)
  const today = new Date();
  const upcomingTournament = tournaments
    ?.filter(t => !t.isActive && !t.completed && new Date(t.startDate) > today)
    ?.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];

  const getCurrentRoundCardContent = () => {
    if (activeTournament) {
      return {
        title: activeTournament.name,
        value: `${currentRound}/3`,
        subtitle: t('general.tournamentProgress'),
        className: "border-purple-200",
        iconColor: "text-purple-600",
        valueColor: "text-purple-600"
      };
    }

    if (upcomingTournament) {
      const availableSpots = upcomingTournament.maxPlayers - activePlayers.length;
      return {
        title: t('tournament.upcoming'),
        value: upcomingTournament.name,
        subtitle: `${upcomingTournament.startDate} • ${availableSpots} ${t('tournament.spots')} ${t('tournament.available')}`,
        className: "border-yellow-200",
        iconColor: "text-yellow-600",
        valueColor: "text-yellow-600"
      };
    }

    return {
      title: t('general.currentRound'),
      value: t('tournament.noTournament'),
      subtitle: t('tournament.getStarted'),
      className: "border-gray-200",
      iconColor: "text-gray-600",
      valueColor: "text-gray-600"
    };
  };

  const currentRoundContent = getCurrentRoundCardContent();

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
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
          <div className="text-2xl font-bold text-green-600">{players?.length || 0}</div>
          <p className="text-xs text-gray-600">
            {t('player.availablePool')}
          </p>
        </CardContent>
      </Card>

      <Card className={`bg-white/80 backdrop-blur-sm ${currentRoundContent.className}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{currentRoundContent.title}</CardTitle>
          <Target className={`h-4 w-4 ${currentRoundContent.iconColor}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${currentRoundContent.valueColor}`}>
            {currentRoundContent.value}
          </div>
          <p className="text-xs text-gray-600">{currentRoundContent.subtitle}</p>
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
            {specialTypes?.filter(s => s.isActive).length || 0}
          </div>
          <p className="text-xs text-gray-600">{t('general.activeSpecials')}</p>
        </CardContent>
      </Card>

      <Card 
        className="bg-white/80 backdrop-blur-sm border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => onStatsCardClick('settings')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('nav.settings')}</CardTitle>
          <Settings className="h-4 w-4 text-gray-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-600">
            ⚙️
          </div>
          <p className="text-xs text-gray-600">Configuration</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
