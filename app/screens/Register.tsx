import { registerUser } from "@/api/users";
import AppButton from "@/components/AppButton";
import AppInput from "@/components/AppInput";
import AppText from "@/components/AppText";
import { AuthContext } from "@/context/AuthContext";
import { colors, spacing, typography } from "@/theme";
import { ScreenNavigationProp } from "@/types/navigation";
import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback
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
        <AppText style={styles.title}>Регистрация</AppText>

        <AppInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <AppInput
          placeholder="Пароль"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <AppInput
          placeholder="Повторите пароль"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <AppButton title="Зарегистрироваться" onPress={handleRegister} />

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <AppText style={styles.link}>Уже есть аккаунт? Войти</AppText>
        </TouchableOpacity>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.title,
    marginBottom: spacing.lg,
  },
  link: {
    textAlign: "center",
    color: colors.primary,
    fontWeight: 600,
    marginTop: spacing.md,
  },
});
