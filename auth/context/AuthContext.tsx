// auth/AuthContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useState } from "react";

interface AuthContextType {
  token: string | null; // токен, если пользователь вошёл
  login: (newToken: string) => Promise<void>; // функция входа
  logout: () => Promise<void>; // функция выхода
  loading: boolean; // флаг загрузки при проверке токена
}

// создаём контекст с начальными пустыми значениями
export const AuthContext = createContext<AuthContextType>({
  token: null,
  login: async () => {},
  logout: async () => {},
  loading: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // чтобы знать, идёт ли проверка токена

  const login = async (newToken: string) => {
    setToken(newToken);
    await AsyncStorage.setItem("token", newToken); // сохраняем токен
  };

  const logout = async () => {
    setToken(null);
    await AsyncStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
