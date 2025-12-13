import { loginUser } from '@/api/auth';
import AppButton from '@/components/AppButton';
import AppInput from '@/components/AppInput';
import AppText from '@/components/AppText';
import { AuthContext } from '@/context/AuthContext';
import { colors, spacing, typography } from '@/theme';
import { ScreenNavigationProp } from '@/types/navigation';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  const navigation = useNavigation<ScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState<boolean>(true);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const data = await loginUser(email, password, navigation);
      await login(data.access_token);
      navigation.navigate('Tabs');
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
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
