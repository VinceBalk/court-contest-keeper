
import React, { createContext, useContext } from 'react';

interface RoleContextType {
  userRoles: string[];
}

const RoleContext = createContext<RoleContextType>({
  userRoles: ['admin'] // Default to admin role since auth is removed
});

export const useRole = () => useContext(RoleContext);

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <RoleContext.Provider value={{ userRoles: ['admin'] }}>
      {children}
    </RoleContext.Provider>
  );
};
