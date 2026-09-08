import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '../types/user';
import {
  subscribeToAuthChanges,
  loginWithEmail,
  registerWithEmail,
  logoutUser,
  getCurrentLocalUser,
} from '../services/authService';

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<UserProfile>;
  register: (name: string, email: string, pass: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(getCurrentLocalUser());
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    const u = await loginWithEmail(email, pass);
    setUser(u);
    return u;
  };

  const register = async (name: string, email: string, pass: string) => {
    const u = await registerWithEmail(name, email, pass);
    setUser(u);
    return u;
  };

  const logout = async () => {
    const guest = await logoutUser();
    setUser(guest);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
