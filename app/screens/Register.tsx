import { registerUser } from "@/api/users";
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
  TouchableWithoutFeedback,
} from "react-native";

const RegisterScreen = () => {
  const { login } = useContext(AuthContext);
  const navigation = useNavigation<ScreenNavigationProp>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) return;

    if (password !== confirmPassword) {
      console.log("Пароли не совпадают");
      return;
    }

    try {
      const data = await registerUser(email, password);
      await login(data.access_token);
      navigation.navigate("CreateProfile");
    } catch (err: any) {
      console.log(err.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Регистрация</Text>

        <FormInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
        <FormInput placeholder="Пароль" value={password} onChangeText={setPassword} secureTextEntry />
        <FormInput placeholder="Повторите пароль" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Зарегистрироваться</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Уже есть аккаунт? Войти</Text>
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

export default RegisterScreen;

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", padding: 20, backgroundColor: "#f4f6fb" },
  title: { fontSize: 24, fontWeight: "600", marginBottom: 20, textAlign: "center" },
  input: { width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 15, backgroundColor: "#fff" },
  button: { width: "100%", backgroundColor: "#4a6cf7", padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 10 },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  link: { textAlign: "center", color: "#4a6cf7", fontWeight: "600", marginTop: 10 },
});
