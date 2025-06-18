
import React, { createContext, useContext } from 'react';

interface AuthContextType {
  user: { email: string } | null;
}

const AuthContext = createContext<AuthContextType>({
  user: { email: 'admin@test.com' } // Default user since auth is removed
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContext.Provider value={{ user: { email: 'admin@test.com' } }}>
      {children}
    </AuthContext.Provider>
  );
};
