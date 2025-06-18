
export interface UserRole {
  id: string;
  userId: string;
  role: 'admin' | 'moderator' | 'player' | 'viewer';
  assignedAt: string;
  assignedBy: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  createdAt: string;
  roles: UserRole[];
}

export interface RolePermissions {
  canManageTournaments: boolean;
  canManagePlayers: boolean;
  canManageUsers: boolean;
  canManageSpecials: boolean;
  canViewMatches: boolean;
  canEditMatches: boolean;
  canViewRankings: boolean;
  canManageTranslations: boolean;
  canManageSettings: boolean;
}
