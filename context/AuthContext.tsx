import { getUser } from '@/api/users';
import LoadingView from '@/components/LoadingView';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useEffect, useState } from 'react';

interface AuthContextType {
  token: string | null;
  loading: boolean;
  loginToken: (newToken: string) => Promise<void>;
  logoutToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  loading: true,
  loginToken: async () => {},
  logoutToken: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('token');

        try {
          await getUser(storedToken);
          setToken(storedToken);
        } catch (error: any) {
          if (error.cause.status === 401) {
            await SecureStore.deleteItemAsync('token');
            setToken(null);
          }
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadToken();
  }, []);

  const loginToken = async (newToken: string) => {
    try {
      await SecureStore.setItemAsync('token', newToken);
      setToken(newToken);
    } catch (error) {
      console.log(error);
    }
  };

  const logoutToken = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      setToken(null);
      console.log('Токен удален');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, loading, loginToken, logoutToken }}>
      {loading ? <LoadingView /> : children}
    </AuthContext.Provider>
  );
};
