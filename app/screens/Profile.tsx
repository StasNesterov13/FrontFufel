import { getActivityLevels, getDietTypes, getGenders } from '@/api/meta';
import { getProfile } from '@/api/profiles';
import AppButton from '@/components/AppButton';
import AppRow from '@/components/AppRow';
import AppText from '@/components/AppText';
import UpdateProfile from '@/components/UpdateProfile';
import { useAuth } from '@/hooks/useAuth';
import { colors, spacing, typography } from '@/theme';
import { ProfileData } from '@/types/data';
import { useAppNavigation } from '@/types/navigation';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

const ProfileScreen = () => {
  const { token, logoutToken } = useAuth();
  const navigation = useAppNavigation();
  const [profile, setProfile] = useState<ProfileData>();
  const [activityLevels, setActivityLevels] = useState<{ code: string; name: string }[]>([]);
  const [dietTypes, setDietTypes] = useState<{ code: string; name: string }[]>([]);
  const [genders, setGenders] = useState<{ value: string; label: string }[]>([]);
  const [updateProfile, setUpdateProfile] = useState(false);

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
      try {
        const data = await getActivityLevels(token);
        setActivityLevels(data);
      } catch (err) {
        console.log(err);
      }
      try {
        const data = await getDietTypes(token);
        setDietTypes(data);
      } catch (err) {
        console.log(err);
      }
      try {
        const data = await getGenders(token);
        setGenders(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProfile();
  }, []);

  const getActivityLevelLabel = (value: string) =>
    activityLevels.find((a) => a.code === value)?.name;
  const getDietTypeLabel = (value: string) => dietTypes.find((d) => d.code === value)?.name;
  const getGenderLabel = (value: string) => genders.find((g) => g.value === value)?.label;

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
    { label: 'Пол', value: getGenderLabel(profile.gender) },
    { label: 'Дата рождения', value: new Date(profile.birth_date).toLocaleDateString('ru-RU') },
    { label: 'Рост', value: `${profile.height} см` },
    { label: 'Уровень активности', value: getActivityLevelLabel(profile.activity_level) },
    { label: 'Тип диеты', value: getDietTypeLabel(profile.diet_type) },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppText style={styles.title}>Мой профиль</AppText>
      <View style={styles.card}>
        {profileRows.map(({ label, value }) => (
          <AppRow key={label} label={label} value={value!} />
        ))}
      </View>
      <UpdateProfile
        visible={updateProfile}
        profile={profile}
        token={token}
        genders={genders}
        activityLevels={activityLevels}
        dietTypes={dietTypes}
        onClose={() => setUpdateProfile(false)}
        onUpdated={(updatedProfile) => setProfile(updatedProfile)}
      />
      <AppButton title='Редактировать профиль' onPress={() => setUpdateProfile(true)} />
      <AppButton
        title='Выйти'
        onPress={() => {
          logoutToken();
          navigation.navigate('Login');
        }}
      />
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
  },
  logout: {
    textAlign: 'center',
    color: colors.error,
    fontWeight: '700',
    fontSize: 16,
    marginTop: spacing.lg,
  },
});
