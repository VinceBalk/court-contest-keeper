
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useT } from "@/contexts/TranslationContext";
import { useRole } from "@/contexts/RoleContext";
import { useRolePermissions } from "@/hooks/useRolePermissions";
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
  const { userRoles } = useRole();
  const permissions = useRolePermissions(userRoles);

  const activeTournamentMatches = matches.filter(m => m.tournamentId === activeTournament?.id);

  // Define all possible tabs with their permission requirements
  const allTabs = [
    { 
      value: "tournaments", 
      label: t('nav.tournaments'), 
      shortLabel: "Tours", 
      color: "orange",
      show: permissions.canManageTournaments
    },
    { 
      value: "players", 
      label: t('nav.players'), 
      shortLabel: "Players", 
      color: "blue",
      show: permissions.canManagePlayers
    },
    { 
      value: "users", 
      label: "User", 
      shortLabel: "User", 
      color: "cyan",
      show: permissions.canManageUsers
    },
    { 
      value: "specials", 
      label: t('nav.specials'), 
      shortLabel: "Special", 
      color: "purple",
      show: permissions.canManageSpecials
    },
    { 
      value: "matches", 
      label: t('nav.matches'), 
      shortLabel: "Match", 
      color: "green",
      show: permissions.canViewMatches
    },
    { 
      value: "rankings", 
      label: t('nav.rankings'), 
      shortLabel: "Rank", 
      color: "yellow",
      show: permissions.canViewRankings
    },
    { 
      value: "translations", 
      label: t('nav.translations'), 
      shortLabel: "Lang", 
      color: "pink",
      show: permissions.canManageTranslations
    },
    { 
      value: "settings", 
      label: t('nav.settings'), 
      shortLabel: "Set", 
      color: "gray",
      show: permissions.canManageSettings
    }
  ];

  // Filter tabs based on user permissions
  const visibleTabs = allTabs.filter(tab => tab.show);

  // If current active tab is not visible, switch to first visible tab
  React.useEffect(() => {
    if (!visibleTabs.find(tab => tab.value === activeTab) && visibleTabs.length > 0) {
      setActiveTab(visibleTabs[0].value);
    }
  }, [activeTab, visibleTabs, setActiveTab]);

  const getActiveColor = (color: string) => {
    return `data-[state=active]:bg-${color}-100`;
  };

  const TabButton = ({ tab }: { tab: typeof visibleTabs[0] }) => (
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
        <TabsList className={`grid w-full bg-white/80 backdrop-blur-sm gap-1 h-auto p-1`} style={{gridTemplateColumns: `repeat(${visibleTabs.length}, minmax(0, 1fr))`}}>
          {visibleTabs.map((tab) => (
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
                {visibleTabs.map((tab) => (
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
            {visibleTabs.find(tab => tab.value === activeTab)?.label}
          </div>
        </div>
      </div>

      {/* Tab Contents - only render if user has permission */}
      {permissions.canManageTournaments && (
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
      )}

      {permissions.canManagePlayers && (
        <TabsContent value="players">
          <PlayerManagement 
            players={players} 
            setPlayers={setPlayers}
            matches={activeTournamentMatches}
          />
        </TabsContent>
      )}

      {permissions.canManageUsers && (
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
      )}

      {permissions.canManageSpecials && (
        <TabsContent value="specials">
          <SpecialManagement 
            specialTypes={specialTypes}
            setSpecialTypes={setSpecialTypes}
          />
        </TabsContent>
      )}

      {permissions.canViewMatches && (
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
      )}

      {permissions.canViewRankings && (
        <TabsContent value="rankings">
          <Rankings 
            players={players}
            matches={activeTournamentMatches}
            currentRound={currentRound}
            activeTournament={activeTournament}
          />
        </TabsContent>
      )}

      {permissions.canManageTranslations && (
        <TabsContent value="translations">
          <TranslationManagement />
        </TabsContent>
      )}

      {permissions.canManageSettings && (
        <TabsContent value="settings">
          <SettingsManagement />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default MainTabs;
