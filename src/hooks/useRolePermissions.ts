
import { RolePermissions } from '@/types/role';

export const useRolePermissions = (userRoles: string[]): RolePermissions => {
  // Since auth is removed, return full permissions for all users
  return {
    canManageTournaments: true,
    canManagePlayers: true,
    canManageUsers: true,
    canManageSpecials: true,
    canViewMatches: true,
    canEditMatches: true,
    canViewRankings: true,
    canManageTranslations: true,
    canManageSettings: true,
  };
};
