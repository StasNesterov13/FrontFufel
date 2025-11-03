import { loginUser } from "@/api/users";
import { AuthContext } from "@/context/AuthContext";
import { ScreenNavigationProp } from "@/types/navigation";
import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";

const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  const navigation = useNavigation<ScreenNavigationProp>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) return;
    try {
      const data = await loginUser(email, password);
      await login(data.access_token);
      navigation.navigate("Profile");
    } catch (err: any) {
      console.log(err.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Вход</Text>

        <FormInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
        <FormInput placeholder="Пароль" value={password} onChangeText={setPassword} secureTextEntry />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Войти</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>Зарегистрироваться</Text>
        </TouchableOpacity>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

// Универсальный TextInput компонент
const FormInput = ({ placeholder, value, onChangeText, secureTextEntry = false, autoCapitalize = "sentences" }: any) => (
  <TextInput
    placeholder={placeholder}
    value={value}
    onChangeText={onChangeText}
    style={styles.input}
    secureTextEntry={secureTextEntry}
    autoCapitalize={autoCapitalize}
  />
);

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", padding: 20, backgroundColor: "#f4f6fb" },
  title: { fontSize: 24, fontWeight: "600", marginBottom: 20, textAlign: "center" },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: { width: "100%", backgroundColor: "#4a6cf7", padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 10 },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  link: { textAlign: "center", color: "#4a6cf7", fontWeight: "600", marginTop: 10 },
});
