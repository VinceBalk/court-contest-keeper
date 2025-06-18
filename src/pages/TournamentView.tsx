import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Users, Trophy, Target, Star } from "lucide-react";
import { useT } from "@/contexts/TranslationContext";
import { Tournament, Player, Match } from "@/pages/Index";
import { SpecialType } from "@/components/SpecialManagement";
import PlayerManagement from "@/components/PlayerManagement";
import TournamentSchedule from "@/components/TournamentSchedule";
import Rankings from "@/components/Rankings";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const TournamentView = () => {
  const { t } = useT();
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  
  // In a real app, you'd get this data from a context or state management solution
  const [tournament, setTournament] = useState<(Tournament & { isActive?: boolean; completed?: boolean; }) | null>(() => {
    const saved = localStorage.getItem('tournaments');
    if (saved) {
      const tournaments: (Tournament & { isActive?: boolean; completed?: boolean; })[] = JSON.parse(saved);
      return tournaments.find(t => t.id === tournamentId) || null;
    }
    return null;
  });

  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem('tournament-players');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem('tournament-matches');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentRound, setCurrentRound] = useState(1);
  
  const [specialTypes] = useState<SpecialType[]>(() => {
    const saved = localStorage.getItem('special-types');
    return saved ? JSON.parse(saved) : [
      { id: 'ace', name: 'Ace', description: 'Unreturnable serve', isActive: true },
      { id: 'winner', name: 'Winner', description: 'Shot that wins the point', isActive: true },
      { id: 'smash', name: 'Smash', description: 'Overhead winning shot', isActive: true },
      { id: 'via-glass', name: 'Via Glass', description: 'Shot off the glass walls', isActive: true },
      { id: 'out-of-cage', name: 'Out of Cage', description: 'Shot that goes out of bounds', isActive: true },
    ];
  });

  const handleSetPlayers = (newPlayers: Player[]) => {
    setPlayers(newPlayers);
    localStorage.setItem('tournament-players', JSON.stringify(newPlayers));
  };

  const handleSetMatches = (newMatches: Match[]) => {
    setMatches(newMatches);
    localStorage.setItem('tournament-matches', JSON.stringify(newMatches));
  };

  useEffect(() => {
    if (!tournament) {
      navigate('/');
    }
  }, [tournament, navigate]);

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 flex items-center justify-center">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Tournament Not Found</h2>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tournaments
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tournamentMatches = matches.filter(m => m.tournamentId === tournament.id);
  const activePlayers = players.filter(p => p.isActive);
  const topGroupPlayers = activePlayers.filter(p => p.group === 'top');
  const bottomGroupPlayers = activePlayers.filter(p => p.group === 'bottom');

  const isToday = (dateString: string) => {
    const today = new Date();
    const tournamentDate = new Date(dateString);
    return today.toDateString() === tournamentDate.toDateString();
  };

  const getStatusBadge = () => {
    if (tournament.completed) return <Badge className="bg-green-100 text-green-700">{t('tournament.completed.badge')}</Badge>;
    if (tournament.isActive && isToday(tournament.start_date || '')) return <Badge className="bg-red-100 text-red-700">Now Playing</Badge>;
    if (tournament.isActive) return <Badge className="bg-blue-100 text-blue-700">{t('tournament.active')}</Badge>;
    return <Badge className="bg-yellow-100 text-yellow-700">Upcoming Tournament</Badge>;
  };

  const getDateDisplay = () => {
    if (tournament.start_date === tournament.end_date) {
      return tournament.start_date;
    }
    return `${tournament.start_date} - ${tournament.end_date}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tournaments
            </Button>
            <LanguageSwitcher />
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <h1 className="text-3xl font-bold text-gray-800">{tournament.name}</h1>
              {getStatusBadge()}
            </div>
            <p className="text-gray-600 flex items-center justify-center gap-2">
              <Calendar className="h-4 w-4" />
              {getDateDisplay()}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('general.activePlayers')}</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{activePlayers.length}/{tournament.max_players}</div>
              <p className="text-xs text-gray-600">
                {t('player.linkerRijtje')}: {topGroupPlayers.length}/{tournament.max_players/2}, {t('player.rechterRijtje')}: {bottomGroupPlayers.length}/{tournament.max_players/2}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Matches</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {tournamentMatches.filter(m => m.completed).length}/{tournamentMatches.length}
              </div>
              <p className="text-xs text-gray-600">Completed matches</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('general.currentRound')}</CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{currentRound}/3</div>
              <p className="text-xs text-gray-600">{t('general.tournamentProgress')}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
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

        <Tabs defaultValue="players" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="players" className="data-[state=active]:bg-blue-100">
              {t('nav.players')}
            </TabsTrigger>
            <TabsTrigger value="matches" className="data-[state=active]:bg-green-100">
              {t('nav.matches')}
            </TabsTrigger>
            <TabsTrigger value="rankings" className="data-[state=active]:bg-yellow-100">
              {t('nav.rankings')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="players">
            <PlayerManagement 
              players={players} 
              setPlayers={handleSetPlayers}
              matches={tournamentMatches}
            />
          </TabsContent>

          <TabsContent value="matches">
            <TournamentSchedule 
              players={players}
              matches={tournamentMatches}
              setMatches={handleSetMatches}
              currentRound={currentRound}
              setCurrentRound={setCurrentRound}
              setPlayers={handleSetPlayers}
              activeTournament={tournament}
              specialTypes={specialTypes}
            />
          </TabsContent>

          <TabsContent value="rankings">
            <Rankings 
              players={players}
              matches={tournamentMatches}
              currentRound={currentRound}
              activeTournament={tournament}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TournamentView;
