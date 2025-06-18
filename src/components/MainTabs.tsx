
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useT } from "@/contexts/TranslationContext";
import { Player, Tournament, Match } from "@/pages/Index";
import { SpecialType } from "@/components/SpecialManagement";
import PlayerManagement from "./PlayerManagement";
import TournamentSchedule from "./TournamentSchedule";
import Rankings from "./Rankings";
import TournamentManagement from "./TournamentManagement";
import SpecialManagement from "./SpecialManagement";
import TranslationManagement from "./TranslationManagement";
import SettingsManagement from "./SettingsManagement";

interface MainTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tournaments: Tournament[];
  setTournaments: (tournaments: Tournament[]) => void;
  activeTournament: Tournament | null;
  setActiveTournament: (tournament: Tournament | null) => void;
  setCurrentRound: (round: number) => void;
  players: Player[];
  setPlayers: (players: Player[]) => void;
  matches: Match[];
  setMatches: (matches: Match[]) => void;
  currentRound: number;
  specialTypes: SpecialType[];
  setSpecialTypes: (specialTypes: SpecialType[]) => void;
}

const MainTabs = ({
  activeTab,
  setActiveTab,
  tournaments,
  setTournaments,
  activeTournament,
  setActiveTournament,
  setCurrentRound,
  players,
  setPlayers,
  matches,
  setMatches,
  currentRound,
  specialTypes,
  setSpecialTypes
}: MainTabsProps) => {
  const { t } = useT();

  const activeTournamentMatches = matches.filter(m => m.tournamentId === activeTournament?.id);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 bg-white/80 backdrop-blur-sm gap-1 h-auto p-1">
        <TabsTrigger value="tournaments" className="data-[state=active]:bg-orange-100 text-xs sm:text-sm px-2 py-2">
          <span className="hidden sm:inline">{t('nav.tournaments')}</span>
          <span className="sm:hidden">Tours</span>
        </TabsTrigger>
        <TabsTrigger value="players" className="data-[state=active]:bg-blue-100 text-xs sm:text-sm px-2 py-2">
          <span className="hidden sm:inline">{t('nav.players')}</span>
          <span className="sm:hidden">Players</span>
        </TabsTrigger>
        <TabsTrigger value="specials" className="data-[state=active]:bg-purple-100 text-xs sm:text-sm px-2 py-2">
          <span className="hidden sm:inline">{t('nav.specials')}</span>
          <span className="sm:hidden">Special</span>
        </TabsTrigger>
        <TabsTrigger value="matches" className="data-[state=active]:bg-green-100 text-xs sm:text-sm px-2 py-2">
          <span className="hidden sm:inline">{t('nav.matches')}</span>
          <span className="sm:hidden">Match</span>
        </TabsTrigger>
        <TabsTrigger value="rankings" className="data-[state=active]:bg-yellow-100 text-xs sm:text-sm px-2 py-2 col-span-2 sm:col-span-1">
          <span className="hidden sm:inline">{t('nav.rankings')}</span>
          <span className="sm:hidden">Rank</span>
        </TabsTrigger>
        <TabsTrigger value="translations" className="data-[state=active]:bg-pink-100 text-xs sm:text-sm px-2 py-2 col-span-2 sm:col-span-1 lg:col-span-1">
          <span className="hidden lg:inline">{t('nav.translations')}</span>
          <span className="lg:hidden">Lang</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="data-[state=active]:bg-gray-100 text-xs sm:text-sm px-2 py-2 col-span-2 sm:col-span-2 lg:col-span-1">
          <span className="hidden sm:inline">{t('nav.settings')}</span>
          <span className="sm:hidden">Set</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="tournaments">
        <TournamentManagement 
          tournaments={tournaments}
          setTournaments={setTournaments}
          activeTournament={activeTournament}
          setActiveTournament={setActiveTournament}
          setCurrentRound={setCurrentRound}
          players={players}
          setPlayers={setPlayers}
        />
      </TabsContent>

      <TabsContent value="players">
        <PlayerManagement 
          players={players} 
          setPlayers={setPlayers}
          matches={activeTournamentMatches}
        />
      </TabsContent>

      <TabsContent value="specials">
        <SpecialManagement 
          specialTypes={specialTypes}
          setSpecialTypes={setSpecialTypes}
        />
      </TabsContent>

      <TabsContent value="matches">
        <TournamentSchedule 
          players={players}
          matches={activeTournamentMatches}
          setMatches={setMatches}
          currentRound={currentRound}
          setCurrentRound={setCurrentRound}
          setPlayers={setPlayers}
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

      <TabsContent value="settings">
        <SettingsManagement />
      </TabsContent>
    </Tabs>
  );
};

export default MainTabs;
