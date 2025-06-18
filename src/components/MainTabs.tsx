
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
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
import UserManagement from "./UserManagement";

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

  const tabs = [
    { value: "tournaments", label: t('nav.tournaments'), shortLabel: "Tours", color: "orange" },
    { value: "players", label: t('nav.players'), shortLabel: "Players", color: "blue" },
    { value: "users", label: "User", shortLabel: "User", color: "cyan" },
    { value: "specials", label: t('nav.specials'), shortLabel: "Special", color: "purple" },
    { value: "matches", label: t('nav.matches'), shortLabel: "Match", color: "green" },
    { value: "rankings", label: t('nav.rankings'), shortLabel: "Rank", color: "yellow" },
    { value: "translations", label: t('nav.translations'), shortLabel: "Lang", color: "pink" },
    { value: "settings", label: t('nav.settings'), shortLabel: "Set", color: "gray" }
  ];

  const getActiveColor = (color: string) => {
    return `data-[state=active]:bg-${color}-100`;
  };

  const TabButton = ({ tab }: { tab: typeof tabs[0] }) => (
    <TabsTrigger 
      value={tab.value} 
      className={`${getActiveColor(tab.color)} text-xs sm:text-sm px-2 py-2`}
    >
      <span className="hidden sm:inline">{tab.label}</span>
      <span className="sm:hidden">{tab.shortLabel}</span>
    </TabsTrigger>
  );

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
      {/* Desktop Navigation */}
      <div className="hidden sm:block">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-white/80 backdrop-blur-sm gap-1 h-auto p-1">
          {tabs.map((tab) => (
            <TabButton key={tab.value} tab={tab} />
          ))}
        </TabsList>
      </div>

      {/* Mobile Navigation with Hamburger Menu */}
      <div className="sm:hidden">
        <div className="flex items-center gap-2 mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm">
                <Menu className="h-4 w-4" />
                <span className="ml-2">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-white">
              <div className="flex flex-col space-y-2 mt-6">
                {tabs.map((tab) => (
                  <Button
                    key={tab.value}
                    variant={activeTab === tab.value ? "default" : "ghost"}
                    className={`justify-start ${activeTab === tab.value ? `bg-${tab.color}-100 text-${tab.color}-700` : ''}`}
                    onClick={() => setActiveTab(tab.value)}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Current tab indicator */}
          <div className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-md text-sm font-medium">
            {tabs.find(tab => tab.value === activeTab)?.label}
          </div>
        </div>
      </div>

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

      <TabsContent value="users">
        <UserManagement />
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
