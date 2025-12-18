import { login } from '@/api/auth';
import AppButton from '@/components/AppButton';
import AppInput from '@/components/AppInput';
import AppText from '@/components/AppText';
import { useAuth } from '@/hooks/useAuth';
import { useAppNavigation } from '@/hooks/useNavigation';
import { colors, spacing, typography } from '@/theme';
import React, { useState } from 'react';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

const LoginScreen = () => {
  const { loginToken } = useAuth();
  const navigation = useAppNavigation();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    try {
      const data = await login(email, password);
      await loginToken(data.access_token);
      navigation.navigate('Tabs');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container}>
        <AppText style={styles.title}>Вход</AppText>

        <AppInput placeholder='Email' value={email} onChangeText={setEmail} autoCapitalize='none' />
        <AppInput
          placeholder='Пароль'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <AppButton title='Войти' onPress={handleLogin} />

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <AppText style={styles.link}>Зарегистрироваться</AppText>
        </TouchableOpacity>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.title,
    marginBottom: spacing.lg,
  },
  link: {
    textAlign: 'center',
    color: colors.primary,
    fontWeight: 600,
    marginTop: spacing.md,
  },
});

export default LoginScreen;
