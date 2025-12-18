import { registerUser } from '@/api/users';
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

const RegisterScreen = () => {
  const { loginToken } = useAuth();
  const navigation = useAppNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    try {
      const data = await registerUser({ email: email, password: password });
      await loginToken(data.access_token);
      navigation.navigate('CreateProfile');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps='handled'>
        <AppText style={styles.title}>Регистрация</AppText>

        <AppInput
          placeholder='Email'
          value={email}
          onChangeText={setEmail}
          autoCapitalize='none'
          keyboardType='email-address'
        />

        <AppInput
          placeholder='Пароль'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <AppInput
          placeholder='Повторите пароль'
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <AppButton title='Зарегистрироваться' onPress={handleRegister} />

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
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
