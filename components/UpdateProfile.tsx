import { updateProfile } from '@/api/profiles';
import { toISODate } from '@/hooks/useDate';
import { colors, spacing } from '@/theme';
import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AppButton from './AppButton';
import AppInput from './AppInput';
import AppText from './AppText';
import ChoiceButton from './ChoiceButton';

interface Props {
  visible: boolean;
  profile: any; // ProfileData
  token: string | null;
  genders: { value: string; label: string }[];
  activityLevels: { code: string; name: string }[];
  dietTypes: { code: string; name: string }[];
  onClose: () => void;
  onUpdated: (data: any) => void;
}

const UpdateProfile = ({
  visible,
  profile,
  token,
  genders,
  activityLevels,
  dietTypes,
  onClose,
  onUpdated,
}: Props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [dietType, setDietType] = useState('');
  const [isBirthPickerVisible, setBirthPickerVisible] = useState(false);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name);
      setLastName(profile.last_name);
      setGender(profile.gender);
      setBirthDate(new Date(profile.birth_date));
      setHeight(String(profile.height));
      setActivityLevel(profile.activity_level);
      setDietType(profile.diet_type);
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      const updated = await updateProfile(token, {
        first_name: firstName,
        last_name: lastName,
        gender,
        birth_date: toISODate(birthDate),
        height: Number(height),
        activity_level: activityLevel,
        diet_type: dietType,
      });
      onUpdated(updated);
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal visible={visible} transparent animationType='slide'>
      <ScrollView contentContainerStyle={styles.container}>
        <AppText style={styles.title}>Изменить профиль</AppText>

        <AppText style={styles.label}>Имя</AppText>
        <AppInput value={firstName} onChangeText={setFirstName} />

        <AppText style={styles.label}>Фамилия</AppText>
        <AppInput value={lastName} onChangeText={setLastName} />

        <AppText style={styles.label}>Пол</AppText>
        <View style={styles.row}>
          {genders.map((g) => (
            <ChoiceButton
              key={g.value}
              label={g.label}
              selected={gender === g.value}
              onPress={() => setGender(g.value)}
            />
          ))}
        </View>

        <AppText style={styles.label}>Дата рождения</AppText>
        <TouchableOpacity
          style={[styles.input, { justifyContent: 'center' }]}
          onPress={() => setBirthPickerVisible(true)}
        >
          <AppText>{birthDate.toLocaleDateString('ru-RU')}</AppText>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isBirthPickerVisible}
          mode='date'
          date={birthDate}
          maximumDate={new Date()}
          locale='ru_RU'
          onConfirm={(d) => {
            setBirthDate(d);
            setBirthPickerVisible(false);
          }}
          onCancel={() => setBirthPickerVisible(false)}
        />

        <AppText style={styles.label}>Рост (см)</AppText>
        <AppInput value={height} onChangeText={setHeight} keyboardType='numeric' />

        <AppText style={styles.label}>Уровень активности</AppText>
        <View style={styles.row}>
          {activityLevels.map((a) => (
            <ChoiceButton
              key={a.code}
              label={a.name}
              selected={activityLevel === a.code}
              onPress={() => setActivityLevel(a.code)}
            />
          ))}
        </View>

        <AppText style={styles.label}>Тип диеты</AppText>
        <View style={styles.row}>
          {dietTypes.map((d) => (
            <ChoiceButton
              key={d.code}
              label={d.name}
              selected={dietType === d.code}
              onPress={() => setDietType(d.code)}
            />
          ))}
        </View>

        <AppButton title='Сохранить' onPress={handleSave} />
        <AppButton title='Отмена' onPress={onClose} />
      </ScrollView>
    </Modal>
  );
};

export default UpdateProfile;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
});
