import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { storage } from '../services/storage';
import { User } from '../types';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const parseError = (error: any) =>
  error?.response?.data?.message || error?.message || 'Something went wrong';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const restoreAuth = async () => {
    try {
      const storedUser = await storage.getUser();
      const token = await storage.getToken();

      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log('restoreAuth error', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    restoreAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    await storage.setAuth(response.data.token, JSON.stringify(response.data.user));
    setUser(response.data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    await storage.setAuth(response.data.token, JSON.stringify(response.data.user));
    setUser(response.data.user);
  };

  const logout = async () => {
    await storage.clearAuth();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login: async (email: string, password: string) => {
        try {
          await login(email, password);
        } catch (error) {
          throw new Error(parseError(error));
        }
      },
      register: async (name: string, email: string, password: string) => {
        try {
          await register(name, email, password);
        } catch (error) {
          throw new Error(parseError(error));
        }
      },
      logout
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
