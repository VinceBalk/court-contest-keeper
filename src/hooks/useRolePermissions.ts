
import { useMemo } from 'react';
import { RolePermissions } from '@/types/role';

export const useRolePermissions = (userRoles: string[] = []): RolePermissions => {
  return useMemo(() => {
    const hasRole = (role: string) => userRoles.includes(role);
    const isAdmin = hasRole('admin');
    const isModerator = hasRole('moderator');
    const isPlayer = hasRole('player');

    return {
      canManageTournaments: isAdmin || isModerator,
      canManagePlayers: isAdmin || isModerator,
      canManageUsers: isAdmin,
      canManageSpecials: isAdmin || isModerator,
      canViewMatches: true, // Everyone can view matches
      canEditMatches: isAdmin || isModerator,
      canViewRankings: true, // Everyone can view rankings
      canManageTranslations: isAdmin,
      canManageSettings: isAdmin,
    };
  }, [userRoles]);
};
