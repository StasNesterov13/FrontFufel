import { loginUser } from "@/api/users";
import AppButton from "@/components/AppButton";
import FormInput from "@/components/AppInput";
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

const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  const navigation = useNavigation<ScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      console.log("Email")
      return;
    }

    try {
      setLoading(true);
      const data = await loginUser(email, password);
      await login(data.access_token);
      navigation.navigate("MainTabs");
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container}>
        <AppText style={styles.title}>Вход</AppText>

        <FormInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <FormInput
          placeholder="Пароль"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <AppButton title="Войти" onPress={handleLogin} loading={loading} />

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <AppText style={styles.link}>Зарегистрироваться</AppText>
        </TouchableOpacity>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

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

export default LoginScreen;
