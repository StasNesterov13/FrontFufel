// screens/LoginScreen.tsx
import { useNavigation } from "@react-navigation/native"; // хук для переходов между экранами
import React, { useContext, useState } from "react"; // React, хуки состояния и контекста
import { Button, StyleSheet, Text, TextInput, View } from "react-native"; // базовые компоненты RN
import { loginUser } from "../api/auth"; // функция для логина через API
import { AuthContext } from "../auth/context/AuthContext"; // контекст аутентификации

const LoginScreen = () => {
  const [username, setUsername] = useState<string | null>(null); // состояние для username
  const [password, setPassword] = useState<string | null>(null); // состояние для password
  const [error, setError] = useState<string | null>(null); // состояние для ошибки
  const { login } = useContext(AuthContext); // получаем функцию login из контекста
  const navigation = useNavigation(); // объект для навигации между экранами

  // обработка изменения username
  const handleUsernameChange = (text: string) => {
    setUsername(text);
    setError(null); // очищаем ошибку при вводе
  };

  // обработка изменения password
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setError(null); // очищаем ошибку при вводе
  };

  // функция для обработки логина
  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const data = await loginUser(username, password); // вызываем API для логина
      await login(data.access_token); // сохраняем токен в контексте
      setError(null); 
      console.log("Logged in token:", data.access_token);
    } catch (err: any) {
      setError(err?.message || "Something went wrong"); // безопасное получение сообщения ошибки
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Username"
        value={username ?? ""}
        onChangeText={handleUsernameChange}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password ?? ""}
        onChangeText={handlePasswordChange}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} />
      {error &&<Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
});

export default LoginScreen;
