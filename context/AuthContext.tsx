import * as SecureStore from 'expo-secure-store';
import React, { createContext, useEffect, useState } from 'react';

// Интерфейс контекста
interface AuthContextType {
  token: string | null;
  login: (newToken: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

// Создание контекста с заглушками
export const AuthContext = createContext<AuthContextType>({
  token: null,
  login: async () => {},
  logout: async () => {},
  isLoading: true,
});

// Провайдер контекста
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Загрузка токена при старте
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('token');
        if (storedToken) setToken(storedToken);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false); // загрузка завершена
      }
    };
    loadToken();
  }, []);

  // Вход: сохранение токена
  const login = async (newToken: string) => {
    try {
      setToken(newToken);
      await SecureStore.setItemAsync('token', newToken);
    } catch (error) {
      console.error(error);
    }
  };

  // Выход: удаление токена
  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      setToken(null);
      console.log('Токен удалён');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
