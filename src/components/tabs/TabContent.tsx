
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Player, Tournament, Match } from "@/pages/Index";
import { SpecialType } from "@/components/SpecialManagement";
import { RolePermissions } from "@/types/role";
import PlayerManagement from "../PlayerManagement";
import TournamentSchedule from "../TournamentSchedule";
import Rankings from "../Rankings";
import TournamentManagement from "../TournamentManagement";
import SpecialManagement from "../SpecialManagement";
import TranslationManagement from "../TranslationManagement";
import SettingsManagement from "../SettingsManagement";
import UserManagement from "../UserManagement";

interface TabContentProps {
  permissions: RolePermissions;
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
  activeTournamentMatches: Match[];
}

const TabContent = ({
  permissions,
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
  setSpecialTypes,
  activeTournamentMatches
}: TabContentProps) => {
  return (
    <>
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
    </>
  );
};

export default TabContent;
