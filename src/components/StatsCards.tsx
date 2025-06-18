
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Trophy, Target, Calendar, Settings } from "lucide-react";
import { useT } from "@/contexts/TranslationContext";
import { Player, Tournament } from "@/pages/Index";
import { SpecialType } from "./SpecialManagement";

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

  const activePlayers = players.filter(p => p.isActive).length;
  const activeSpecials = specialTypes.filter(s => s.isActive).length;
  const upcomingTournament = tournaments.find(t => !t.isActive && !t.completed);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <Card className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onStatsCardClick('totalPlayers')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-custom-lg font-medium">{t('general.totalPlayers')}</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{players.length}</div>
          <p className="text-custom-sm text-gray-600 mt-1">
            {activePlayers} {t('player.active')} • {players.length - activePlayers} {t('player.total')}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onStatsCardClick('specials')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-custom-lg font-medium">{t('general.specials')}</CardTitle>
          <Target className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{activeSpecials}</div>
          <p className="text-custom-sm text-gray-600 mt-1">
            {t('general.activeSpecials')}
          </p>
        </CardContent>
      </Card>

      {activeTournament ? (
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-custom-lg font-medium">{t('general.currentRound')}</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{currentRound}</div>
            <p className="text-custom-sm text-gray-600 mt-1">
              {activeTournament.name}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-custom-lg font-medium">{upcomingTournament ? t('tournament.upcoming') : t('tournament.noTournament')}</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            {upcomingTournament ? (
              <div>
                <div className="text-custom-lg font-bold text-purple-600">{upcomingTournament.name}</div>
                <p className="text-custom-sm text-gray-600 mt-1">
                  {upcomingTournament.maxPlayers - activePlayers} {t('tournament.spots')} {t('tournament.available')}
                </p>
              </div>
            ) : (
              <div className="text-custom-lg font-bold text-gray-400">-</div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onStatsCardClick('settings')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-custom-lg font-medium">Settings</CardTitle>
          <Settings className="h-4 w-4 text-gray-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-600">{tournaments.length}</div>
          <p className="text-custom-sm text-gray-600 mt-1">
            Tournaments created
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
