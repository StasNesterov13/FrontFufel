import { getProfile } from '@/api/profiles';
import AppButton from '@/components/AppButton';
import AppRow from '@/components/AppRow';
import AppText from '@/components/AppText';
import { AuthContext } from '@/context/AuthContext';
import { colors, spacing, typography } from '@/theme';
import { ScreenNavigationProp } from '@/types/navigation';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

const ProfileScreen = () => {
  const { token, logout } = useContext(AuthContext);
  const navigation = useNavigation<ScreenNavigationProp>();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile(token!, navigation);
        setProfile(data);
      } catch (error: any) {
        if (error.cause?.status === 400) {
          navigation.navigate('CreateProfile');
          return;
        }
        console.log(error?.status ?? error);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <View style={styles.loader}>
        <AppButton title='Создать профиль' onPress={() => navigation.navigate('CreateProfile')} />
        <AppText
          style={styles.logout}
          onPress={() => {
            logout();
            navigation.navigate('Login');
          }}
        >
          Выйти
        </AppText>
      </View>
    );
  }

  const profileRows = [
    { label: 'Имя', value: profile.first_name },
    { label: 'Фамилия', value: profile.last_name },
    { label: 'Пол', value: profile.gender === 'male' ? 'Мужской' : 'Женский' },
    { label: 'Дата рождения', value: new Date(profile.birth_date).toLocaleDateString('ru-RU') },
    { label: 'Рост', value: `${profile.height} см` },
    { label: 'Уровень активности', value: translateActivity(profile.activity_level) },
    { label: 'Тип диеты', value: translateDiet(profile.diet_type) },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppText style={styles.title}>Мой профиль</AppText>
      <View style={styles.card}>
        {profileRows.map(({ label, value }) => (
          <AppRow key={label} label={label} value={value} />
        ))}
      </View>

      <AppText
        style={styles.logout}
        onPress={() => {
          logout();
          navigation.navigate('Login');
        }}
      >
        Выйти
      </AppText>
    </ScrollView>
  );
};

const translateActivity = (level: string) => {
  const map: Record<string, string> = {
    minimal: 'Минимальный',
    light: 'Легкий',
    moderate: 'Средний',
    high: 'Высокий',
    very_high: 'Очень высокий',
  };
  return map[level];
};

const translateDiet = (diet: string) => {
  const map: Record<string, string> = {
    vegan: 'Веганская',
    vegetarian: 'Вегетарианская',
    pescatarian: 'Пескетарианство',
    halal: 'Халяль',
    kosher: 'Кошер',
    default: 'Обычная',
  };
  return map[diet];
};

export default ProfileScreen;

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.title,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: spacing.xl,
  },
  logout: {
    textAlign: 'center',
    color: colors.error,
    fontWeight: '700',
    fontSize: 16,
    marginTop: spacing.lg,
  },
});
