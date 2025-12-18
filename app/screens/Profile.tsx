import { getProfile } from '@/api/profiles';
import AppButton from '@/components/AppButton';
import AppRow from '@/components/AppRow';
import AppText from '@/components/AppText';
import { useAuth } from '@/hooks/useAuth';
import { useAppNavigation } from '@/hooks/useNavigation';
import { colors, spacing, typography } from '@/theme';
import { ProfileData } from '@/types/data';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

const ProfileScreen = () => {
  const { token, logoutToken } = useAuth();
  const navigation = useAppNavigation();
  const [profile, setProfile] = useState<ProfileData>();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile(token);
        setProfile(data);
      } catch (error: any) {
        if (error.cause.status === 400) {
          navigation.navigate('CreateProfile');
          return;
        } else if (error.cause.status === 401) {
          navigation.navigate('Login');
          return;
        }
        console.log(error);
      }
    };
    fetchProfile();
  }, []);

  const translateLevelActivity = (levelActivity: string) => {
    const map: Record<string, string> = {
      minimal: 'Минимальный',
      light: 'Легкий',
      moderate: 'Средний',
      high: 'Высокий',
      very_high: 'Очень высокий',
    };
    return map[levelActivity];
  };

  const translateDietType = (dietType: string) => {
    const map: Record<string, string> = {
      vegan: 'Веганская',
      vegetarian: 'Вегетарианская',
      pescatarian: 'Пескетарианство',
      halal: 'Халяль',
      kosher: 'Кошер',
      default: 'Обычная',
    };
    return map[dietType];
  };

  const translateGender = (gender: string) => {
    const map: Record<string, string> = {
      male: 'Мужской',
      female: 'Женский',
    };
    return map[gender];
  };

  if (!profile) {
    return (
      <View style={styles.loader}>
        <AppButton title='Создать профиль' onPress={() => navigation.navigate('CreateProfile')} />
        <AppText
          style={styles.logout}
          onPress={() => {
            logoutToken();
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
    { label: 'Пол', value: translateGender(profile.gender) },
    { label: 'Дата рождения', value: new Date(profile.birth_date).toLocaleDateString('ru-RU') },
    { label: 'Рост', value: `${profile.height} см` },
    { label: 'Уровень активности', value: translateLevelActivity(profile.activity_level) },
    { label: 'Тип диеты', value: translateDietType(profile.diet_type) },
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
          logoutToken();
          navigation.navigate('Login');
        }}
      >
        Выйти
      </AppText>
    </ScrollView>
  );
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
