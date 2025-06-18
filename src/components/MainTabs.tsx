
import React from "react";
import { Tabs } from "@/components/ui/tabs";
import { useRole } from "@/contexts/RoleContext";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import { Player, Tournament, Match } from "@/pages/Index";
import { SpecialType } from "@/components/SpecialManagement";
import { useTabConfiguration } from "./tabs/useTabConfiguration";
import DesktopNavigation from "./tabs/DesktopNavigation";
import MobileNavigation from "./tabs/MobileNavigation";
import TabContent from "./tabs/TabContent";

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
  const { userRoles } = useRole();
  const permissions = useRolePermissions(userRoles);
  const visibleTabs = useTabConfiguration(permissions);

  const activeTournamentMatches = matches.filter(m => m.tournamentId === activeTournament?.id);

  // If current active tab is not visible, switch to first visible tab
  React.useEffect(() => {
    if (!visibleTabs.find(tab => tab.value === activeTab) && visibleTabs.length > 0) {
      setActiveTab(visibleTabs[0].value);
    }
  }, [activeTab, visibleTabs, setActiveTab]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
      <DesktopNavigation visibleTabs={visibleTabs} />
      <MobileNavigation 
        visibleTabs={visibleTabs} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      <TabContent
        permissions={permissions}
        tournaments={tournaments}
        setTournaments={setTournaments}
        activeTournament={activeTournament}
        setActiveTournament={setActiveTournament}
        setCurrentRound={setCurrentRound}
        players={players}
        setPlayers={setPlayers}
        matches={matches}
        setMatches={setMatches}
        currentRound={currentRound}
        specialTypes={specialTypes}
        setSpecialTypes={setSpecialTypes}
        activeTournamentMatches={activeTournamentMatches}
      />
    </Tabs>
  );
};

export default MainTabs;
