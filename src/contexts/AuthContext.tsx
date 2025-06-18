import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock authentication - always logged in as admin
    const mockUser = {
      id: 'mock-user-id',
      email: 'admin@test.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      email_confirmed_at: new Date().toISOString(),
    } as User;

    const mockSession = {
      access_token: 'mock-token',
      refresh_token: 'mock-refresh-token',
      expires_in: 3600,
      expires_at: Date.now() + 3600000,
      token_type: 'bearer',
      user: mockUser,
    } as Session;

    setUser(mockUser);
    setSession(mockSession);
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Mock successful login
    return { error: null };
  };

  const signUp = async (email: string, password: string) => {
    // Mock successful signup
    return { error: null };
  };

  const signOut = async () => {
    // Mock signout - but keep user logged in for demo
    console.log('Sign out called (mock)');
  };

  const resetPassword = async (email: string) => {
    // Mock password reset
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
