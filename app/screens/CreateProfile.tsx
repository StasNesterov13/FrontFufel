import { createProfile } from '@/api/profiles';
import AppButton from '@/components/AppButton';
import AppInput from '@/components/AppInput';
import AppText from '@/components/AppText';
import ChoiceButton from '@/components/ChoiceButton';
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
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const CreateProfileScreen = () => {
  const { token, logout } = useContext(AuthContext);
  const navigation = useNavigation<ScreenNavigationProp>();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dietType, setDietType] = useState<
    'vegan' | 'vegetarian' | 'pescatarian' | 'halal' | 'kosher' | 'default'
  >('default');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activityLevel, setActivityLevel] = useState<
    'minimal' | 'light' | 'moderate' | 'high' | 'very_high'
  >('moderate');
  const [height, setHeight] = useState('170');
  const [birthDate, setBirthDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleSubmit = async () => {
    try {
      await createProfile(
        token!,
        {
          first_name: firstName,
          last_name: lastName,
          gender: gender!,
          birth_date: birthDate.toISOString().split('T')[0],
          height: Number(height),
          activity_level: activityLevel!,
          diet_type: dietType!,
        },
        navigation
      );
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
          <ChoiceButton
            label='Мужской'
            selected={gender === 'male'}
            onPress={() => setGender('male')}
          />
          <ChoiceButton
            label='Женский'
            selected={gender === 'female'}
            onPress={() => setGender('female')}
          />
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
          <ChoiceButton
            label='Минимальный'
            selected={activityLevel === 'minimal'}
            onPress={() => setActivityLevel('minimal')}
          />
          <ChoiceButton
            label='Лёгкий'
            selected={activityLevel === 'light'}
            onPress={() => setActivityLevel('light')}
          />
          <ChoiceButton
            label='Средний'
            selected={activityLevel === 'moderate'}
            onPress={() => setActivityLevel('moderate')}
          />
          <ChoiceButton
            label='Высокий'
            selected={activityLevel === 'high'}
            onPress={() => setActivityLevel('high')}
          />
          <ChoiceButton
            label='Очень высокий'
            selected={activityLevel === 'very_high'}
            onPress={() => setActivityLevel('very_high')}
          />
        </View>

        <AppText style={styles.label}>Тип диеты</AppText>
        <View style={styles.rowWrap}>
          <ChoiceButton
            label='Веганская'
            selected={dietType === 'vegan'}
            onPress={() => setDietType('vegan')}
          />
          <ChoiceButton
            label='Вегетарианская'
            selected={dietType === 'vegetarian'}
            onPress={() => setDietType('vegetarian')}
          />
          <ChoiceButton
            label='Пескетарианство'
            selected={dietType === 'pescatarian'}
            onPress={() => setDietType('pescatarian')}
          />
          <ChoiceButton
            label='Халяль'
            selected={dietType === 'halal'}
            onPress={() => setDietType('halal')}
          />
          <ChoiceButton
            label='Кошер'
            selected={dietType === 'kosher'}
            onPress={() => setDietType('kosher')}
          />
          <ChoiceButton
            label='Обычная'
            selected={dietType === 'default'}
            onPress={() => setDietType('default')}
          />
        </View>

        <AppButton title='Создать профиль' onPress={handleSubmit} />
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
