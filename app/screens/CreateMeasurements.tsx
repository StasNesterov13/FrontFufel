import { createMeasurements } from '@/api/measurements';
import AppButton from '@/components/AppButton';
import AppInput from '@/components/AppInput';
import AppText from '@/components/AppText';
import { useAuth } from '@/hooks/useAuth';
import { toISODate } from '@/hooks/useDate';
import { colors, spacing, typography } from '@/theme';
import { useAppNavigation } from '@/types/navigation';
import React, { useState } from 'react';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const CreateMeasurementsScreen = () => {
  const { token } = useAuth();
  const navigation = useAppNavigation();

  const [weight, setWeight] = useState<string>('70');
  const [bodyfat, setBodyfat] = useState<string>('15');
  const [notes, setNotes] = useState<string>('');
  const [measuredAt, setMeasuredAt] = useState<Date>(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);

  const handleSubmit = async () => {
    try {
      await createMeasurements(token, {
        measured_at: toISODate(measuredAt),
        weight: Number(weight),
        bodyfat: Number(bodyfat),
        notes,
      });
      navigation.navigate('CreateGoals');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container}>
        <AppText style={styles.title}>Новое измерение</AppText>

        <AppText style={styles.label}>Дата измерения</AppText>
        <TouchableOpacity
          onPress={() => setDatePickerVisibility(true)}
          style={[styles.input, { justifyContent: 'center' }]}
        >
          <AppText>{measuredAt.toLocaleDateString('ru-RU')}</AppText>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode='date'
          date={measuredAt}
          maximumDate={new Date()}
          locale='ru_RU'
          onConfirm={(d) => {
            setMeasuredAt(d);
            setDatePickerVisibility(false);
          }}
          onCancel={() => setDatePickerVisibility(false)}
        />

        <AppText style={styles.label}>Вес (кг)</AppText>
        <AppInput
          placeholder='Вес'
          value={weight}
          onChangeText={setWeight}
          keyboardType='numeric'
        />

        <AppText style={styles.label}>Процент жира (%)</AppText>
        <AppInput
          placeholder='Процент жира'
          value={bodyfat}
          onChangeText={setBodyfat}
          keyboardType='numeric'
        />

        <AppText style={styles.label}>Заметки</AppText>
        <AppInput
          placeholder='Например: взвешивание утром'
          value={notes}
          onChangeText={setNotes}
          multiline
          style={{ minHeight: 80 }}
        />

        <AppButton title='Сохранить' onPress={handleSubmit} />
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default CreateMeasurementsScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  logout: {
    textAlign: 'center',
    color: colors.error,
    fontWeight: 700,
    fontSize: 16,
  },
});
