import { createProfile } from '@/api/profiles';
import AppButton from '@/components/AppButton';
import AppInput from '@/components/AppInput';
import AppText from '@/components/AppText';
import ChoiceButton from '@/components/ChoiceButton';
import { useAuth } from '@/hooks/useAuth';
import { toISODate } from '@/hooks/useDate';
import { useAppNavigation } from '@/hooks/useNavigation';
import { colors, spacing, typography } from '@/theme';
import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const CreateProfileScreen = () => {
  const { token, logoutToken } = useAuth();
  const navigation = useAppNavigation();
  const activityLevels = [
    { label: 'Минимальный', value: 'minimal' },
    { label: 'Лёгкий', value: 'light' },
    { label: 'Средний', value: 'moderate' },
    { label: 'Высокий', value: 'high' },
    { label: 'Очень высокий', value: 'very_high' },
  ];
  const dietTypes = [
    { label: 'Веганская', value: 'vegan' },
    { label: 'Вегетарианская', value: 'vegetarian' },
    { label: 'Пескетарианство', value: 'pescatarian' },
    { label: 'Халяль', value: 'halal' },
    { label: 'Кошер', value: 'kosher' },
    { label: 'Обычная', value: 'default' },
  ];
  const genders = [
    { label: 'Мужской', value: 'male' },
    { label: 'Женский', value: 'female' },
  ];
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  //const [activityLevels, setActivityLevels] = useState<{ label: string; value: string }[]>([]);
  //const [dietTypes, setDietTypes] = useState<{ label: string; value: string }[]>([]);
  const [activityLevel, setActivityLevel] = useState<string>('');
  const [dietType, setDietType] = useState<string>('');
  const [height, setHeight] = useState('170');
  const [birthDate, setBirthDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // твой API запрос
        // по умолчанию первый
      } catch (err) {
        console.log(err);
      }
      try {
        // твой API запрос
        // по умолчанию первый
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);
  const handleSubmit = async () => {
    try {
      await createProfile(token, {
        first_name: firstName,
        last_name: lastName,
        gender: gender,
        birth_date: toISODate(birthDate),
        height: Number(height),
        activity_level: activityLevel,
        diet_type: dietType,
      });
      navigation.navigate('CreateMeasurements');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps='handled'>
        <AppText style={styles.title}>Создание профиля</AppText>

        <AppInput placeholder='Имя' value={firstName} onChangeText={setFirstName} />
        <AppInput placeholder='Фамилия' value={lastName} onChangeText={setLastName} />

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
          onPress={() => setDatePickerVisibility(true)}
          style={[styles.input, { justifyContent: 'center' }]}
        >
          <AppText>{birthDate.toLocaleDateString('ru-RU')}</AppText>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode='date'
          date={birthDate}
          maximumDate={new Date()}
          locale='ru_RU'
          onConfirm={(d) => {
            setBirthDate(d);
            setDatePickerVisibility(false);
          }}
          onCancel={() => setDatePickerVisibility(false)}
        />

        <AppText style={styles.label}>Рост (см)</AppText>
        <AppInput
          placeholder='Рост'
          value={height}
          onChangeText={setHeight}
          keyboardType='numeric'
        />

        <AppText style={styles.label}>Уровень активности</AppText>
        <View style={styles.row}>
          {activityLevels.map((level) => (
            <ChoiceButton
              key={level.value}
              label={level.label}
              selected={activityLevel === level.value}
              onPress={() => setActivityLevel(level.value)}
            />
          ))}
        </View>

        <AppText style={styles.label}>Тип диеты</AppText>
        <View style={styles.rowWrap}>
          {dietTypes.map((diet) => (
            <ChoiceButton
              key={diet.value}
              label={diet.label}
              selected={dietType === diet.value}
              onPress={() => setDietType(diet.value)}
            />
          ))}
        </View>

        <AppButton title='Создать профиль' onPress={handleSubmit} />
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
    </TouchableWithoutFeedback>
  );
};

export default CreateProfileScreen;

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
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: spacing.md,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: spacing.lg,
  },
  choice: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    minWidth: 100,
  },
  choiceSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  choiceText: {
    color: colors.textPrimary,
    fontWeight: 500,
  },
  choiceTextSelected: {
    color: '#fff',
  },
  logout: {
    textAlign: 'center',
    color: colors.error,
    fontWeight: 700,
    fontSize: 16,
  },
});
