
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@/types/role';
import { useAuth } from './AuthContext';

interface RoleContextType {
  userProfile: UserProfile | null;
  userRoles: string[];
  loading: boolean;
  updateUserRoles: (userId: string, roles: string[]) => Promise<void>;
  getCurrentUserRoles: () => string[];
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Test data for role management
const testUserProfiles: UserProfile[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@test.com',
    firstName: 'Admin',
    lastName: 'User',
    isActive: true,
    createdAt: '2024-01-01',
    roles: [
      {
        id: '1',
        userId: '1',
        role: 'admin',
        assignedAt: '2024-01-01',
        assignedBy: 'system'
      }
    ]
  },
  {
    id: '2',
    username: 'moderator',
    email: 'mod@test.com',
    firstName: 'Moderator',
    lastName: 'User',
    isActive: true,
    createdAt: '2024-01-01',
    roles: [
      {
        id: '2',
        userId: '2',
        role: 'moderator',
        assignedAt: '2024-01-01',
        assignedBy: '1'
      }
    ]
  },
  {
    id: '3',
    username: 'player1',
    email: 'player@test.com',
    firstName: 'Player',
    lastName: 'One',
    isActive: true,
    createdAt: '2024-01-01',
    roles: [
      {
        id: '3',
        userId: '3',
        role: 'player',
        assignedAt: '2024-01-01',
        assignedBy: '1'
      }
    ]
  }
];

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user profile and roles
    const loadUserProfile = () => {
      if (user?.email) {
        // Find user profile by email in test data
        const profile = testUserProfiles.find(p => p.email === user.email);
        if (profile) {
          setUserProfile(profile);
          setUserRoles(profile.roles.map(r => r.role));
        } else {
          // Default to player role for new users
          const defaultProfile: UserProfile = {
            id: Date.now().toString(),
            username: user.email.split('@')[0],
            email: user.email,
            isActive: true,
            createdAt: new Date().toISOString(),
            roles: [{
              id: Date.now().toString(),
              userId: Date.now().toString(),
              role: 'player',
              assignedAt: new Date().toISOString(),
              assignedBy: 'system'
            }]
          };
          setUserProfile(defaultProfile);
          setUserRoles(['player']);
        }
      } else {
        setUserProfile(null);
        setUserRoles([]);
      }
      setLoading(false);
    };

    loadUserProfile();
  }, [user]);

  const updateUserRoles = async (userId: string, roles: string[]) => {
    // In test mode, just update local state
    console.log(`Updating roles for user ${userId}:`, roles);
    // This would normally make an API call to update roles in the database
  };

  const getCurrentUserRoles = () => {
    return userRoles;
  };

  return (
    <RoleContext.Provider value={{
      userProfile,
      userRoles,
      loading,
      updateUserRoles,
      getCurrentUserRoles
    }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
