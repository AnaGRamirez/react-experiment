import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import { getCurrentUser, setCurrentUser as saveCurrentUser } from '../services/storage';

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(getCurrentUser());

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    saveCurrentUser(newUser);
  };

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUserState(currentUser);
  }, []);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

