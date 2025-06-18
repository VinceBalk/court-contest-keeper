import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlayerManagement from "@/components/PlayerManagement";
import TournamentSchedule from "@/components/TournamentSchedule";
import Rankings from "@/components/Rankings";
import TournamentManagement from "@/components/TournamentManagement";
import SpecialManagement, { SpecialType } from "@/components/SpecialManagement";
import TranslationManagement from "@/components/TranslationManagement";
import RoundNavigation from "@/components/RoundNavigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Trophy, Users, Calendar, Target, Star } from "lucide-react";
import { useT } from "@/contexts/TranslationContext";

export interface Player {
  id: string;
  name: string;
  group: 'top' | 'bottom';
  totalGames: number;
  totalSpecials: number;
  totalPoints: number;
  matchesPlayed: number;
  isActive: boolean; // Whether player is participating in current tournament
  overallStats: {
    totalGames: number;
    totalSpecials: number;
    totalPoints: number;
    matchesPlayed: number;
    tournamentsPlayed: number;
  };
}

export interface Tournament {
  id: string;
  name: string;
  date: string;
  isActive: boolean;
  completed: boolean;
  maxPlayers: number; // Maximum number of players allowed (default 16)
}

export interface Match {
  id: string;
  tournamentId: string;
  round: number;
  group: 'top' | 'bottom';
  court: number;
  team1: [string, string]; // player IDs
  team2: [string, string]; // player IDs
  team1Score: number;
  team2Score: number;
  specialPoints: { [playerId: string]: number };
  completed: boolean;
}

const Index = () => {
  const { t } = useT();
  const [players, setPlayers] = useState<Player[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [activeTournament, setActiveTournament] = useState<Tournament | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [activeTab, setActiveTab] = useState("tournaments");
  const [specialTypes, setSpecialTypes] = useState<SpecialType[]>([
    { id: 'ace', name: 'Ace', description: 'Unreturnable serve', isActive: true },
    { id: 'winner', name: 'Winner', description: 'Shot that wins the point', isActive: true },
    { id: 'smash', name: 'Smash', description: 'Overhead winning shot', isActive: true },
    { id: 'via-glass', name: 'Via Glass', description: 'Shot off the glass walls', isActive: true },
    { id: 'out-of-cage', name: 'Out of Cage', description: 'Shot that goes out of bounds', isActive: true },
  ]);

  const activeTournamentMatches = matches.filter(m => m.tournamentId === activeTournament?.id);
  const activePlayers = players.filter(p => p.isActive);
  const topGroupPlayers = activePlayers.filter(p => p.group === 'top').sort((a, b) => a.name.localeCompare(b.name));
  const bottomGroupPlayers = activePlayers.filter(p => p.group === 'bottom').sort((a, b) => a.name.localeCompare(b.name));

  // Save tournaments to localStorage whenever they change
  const handleSetTournaments = (newTournaments: Tournament[]) => {
    setTournaments(newTournaments);
    localStorage.setItem('tournaments', JSON.stringify(newTournaments));
  };

  // Save matches to localStorage whenever they change
  const handleSetMatches = (newMatches: Match[]) => {
    setMatches(newMatches);
    localStorage.setItem('tournament-matches', JSON.stringify(newMatches));
  };

  // Save players to localStorage whenever they change
  const handleSetPlayers = (newPlayers: Player[]) => {
    setPlayers(newPlayers);
    localStorage.setItem('tournament-players', JSON.stringify(newPlayers));
  };

  // Save special types to localStorage whenever they change
  const handleSetSpecialTypes = (newSpecialTypes: SpecialType[]) => {
    setSpecialTypes(newSpecialTypes);
    localStorage.setItem('special-types', JSON.stringify(newSpecialTypes));
  };

  // Save active tournament to localStorage whenever it changes
  const handleSetActiveTournament = (tournament: Tournament | null) => {
    setActiveTournament(tournament);
    localStorage.setItem('active-tournament', JSON.stringify(tournament));
  };

  const handleStatsCardClick = (cardType: string) => {
    switch(cardType) {
      case 'totalPlayers':
        setActiveTab('players');
        break;
      case 'specials':
        setActiveTab('specials');
        break;
      case 'activePlayers':
        setActiveTab('players');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1" />
            <div className="flex items-center gap-3">
              <Trophy className="h-10 w-10 text-yellow-500" />
              <h1 className="text-4xl font-bold text-gray-800">{t('header.title')}</h1>
            </div>
            <div className="flex-1 flex justify-end">
              <LanguageSwitcher />
            </div>
          </div>
          <p className="text-lg text-gray-600">{t('header.subtitle')}</p>
          {activeTournament && (
            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
              <p className="text-blue-800 font-medium">{t('tournament.activeDescription')} {activeTournament.name}</p>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card 
            className="bg-white/80 backdrop-blur-sm border-blue-200 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleStatsCardClick('activePlayers')}
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
            onClick={() => handleStatsCardClick('totalPlayers')}
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
            onClick={() => handleStatsCardClick('specials')}
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

        {activeTournament && (
          <div className="mb-8">
            <RoundNavigation 
              matches={activeTournamentMatches}
              activeTournament={activeTournament}
              currentRound={currentRound}
            />
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="tournaments" className="data-[state=active]:bg-orange-100">
              {t('nav.tournaments')}
            </TabsTrigger>
            <TabsTrigger value="players" className="data-[state=active]:bg-blue-100">
              {t('nav.players')}
            </TabsTrigger>
            <TabsTrigger value="specials" className="data-[state=active]:bg-purple-100">
              {t('nav.specials')}
            </TabsTrigger>
            <TabsTrigger value="matches" className="data-[state=active]:bg-green-100">
              {t('nav.matches')}
            </TabsTrigger>
            <TabsTrigger value="rankings" className="data-[state=active]:bg-yellow-100">
              {t('nav.rankings')}
            </TabsTrigger>
            <TabsTrigger value="translations" className="data-[state=active]:bg-pink-100">
              {t('nav.translations')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tournaments">
            <TournamentManagement 
              tournaments={tournaments}
              setTournaments={handleSetTournaments}
              activeTournament={activeTournament}
              setActiveTournament={handleSetActiveTournament}
              setCurrentRound={setCurrentRound}
              players={players}
              setPlayers={handleSetPlayers}
            />
          </TabsContent>

          <TabsContent value="players">
            <PlayerManagement 
              players={players} 
              setPlayers={handleSetPlayers}
              matches={activeTournamentMatches}
            />
          </TabsContent>

          <TabsContent value="specials">
            <SpecialManagement 
              specialTypes={specialTypes}
              setSpecialTypes={handleSetSpecialTypes}
            />
          </TabsContent>

          <TabsContent value="matches">
            <TournamentSchedule 
              players={players}
              matches={activeTournamentMatches}
              setMatches={handleSetMatches}
              currentRound={currentRound}
              setCurrentRound={setCurrentRound}
              setPlayers={handleSetPlayers}
              activeTournament={activeTournament}
              specialTypes={specialTypes}
            />
          </TabsContent>

          <TabsContent value="rankings">
            <Rankings 
              players={players}
              matches={activeTournamentMatches}
              currentRound={currentRound}
              activeTournament={activeTournament}
            />
          </TabsContent>

          <TabsContent value="translations">
            <TranslationManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
