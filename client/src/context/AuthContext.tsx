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
  openAuthModal: (onSuccess?: () => void) => void;
  closeAuthModal: () => void;
  authSuccessCallback?: (() => void) | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(getCurrentLocalUser());
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authSuccessCallback, setAuthSuccessCallback] = useState<(() => void) | null>(null);

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

  const openAuthModal = (onSuccess?: () => void) => {
    if (onSuccess) {
      setAuthSuccessCallback(() => onSuccess);
    } else {
      setAuthSuccessCallback(null);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthSuccessCallback(null);
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
        openAuthModal,
        closeAuthModal,
        authSuccessCallback,
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
