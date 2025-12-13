import LoadingView from '@/components/LoadingView';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useEffect, useState } from 'react';

interface AuthContextType {
  token: string | null;
  loading: boolean;
  login: (newToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('token');
        setToken(storedToken);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    loadToken();
  }, []);

  const login = async (newToken: string) => {
    try {
      await SecureStore.setItemAsync('token', newToken);
      setToken(newToken);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      setToken(null);
      console.log('Токен удален');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, loading, login, logout }}>
      {loading ? <LoadingView /> : children}
    </AuthContext.Provider>
  );
};
