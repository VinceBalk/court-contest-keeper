
import { useMemo } from "react";
import { useT } from "@/contexts/TranslationContext";
import { RolePermissions } from "@/types/role";
import { TabDefinition } from "./TabDefinition";

export const useTabConfiguration = (permissions: RolePermissions) => {
  const { t } = useT();

  return useMemo(() => {
    const allTabs: TabDefinition[] = [
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

    return allTabs.filter(tab => tab.show);
  }, [permissions, t]);
};
