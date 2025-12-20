import { recalculateDailyNorms } from '@/api/daily_norms';
import { createGoals } from '@/api/goals';
import { getGoalTypes } from '@/api/meta';
import AppButton from '@/components/AppButton';
import AppInput from '@/components/AppInput';
import AppText from '@/components/AppText';
import ChoiceButton from '@/components/ChoiceButton';
import { useAuth } from '@/hooks/useAuth';
import { toISODate } from '@/hooks/useDate';
import { colors, spacing, typography } from '@/theme';
import { useAppNavigation } from '@/types/navigation';
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

const CreateGoalsScreen = () => {
  const { token, logoutToken } = useAuth();
  const navigation = useAppNavigation();
  const [type, setType] = useState<string>('');
  const [goalTypes, setGoalTypes] = useState<{ code: string; name: string }[]>([]);
  const [targetWeight, setTargetWeight] = useState<string>('75');
  const [startAt, setStartAt] = useState<Date>(new Date());
  const [endAt, setEndAt] = useState<Date>(new Date());

  const [isStartPickerVisible, setStartPickerVisibility] = useState(false);
  const [isEndPickerVisible, setEndPickerVisibility] = useState(false);
  useEffect(() => {
    const fetchGoalTypes = async () => {
      try {
        const data = await getGoalTypes(token);
        setGoalTypes(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchGoalTypes();
  }, []);
  const handleSubmit = async () => {
    try {
      await createGoals(token, {
        type,
        target_weight: Number(targetWeight),
        start_at: toISODate(startAt),
        end_at: toISODate(endAt),
      });
      await recalculateDailyNorms(token);
      navigation.navigate('Tabs');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container}>
        <AppText style={styles.title}>Новая цель</AppText>

        <AppText style={styles.label}>Тип цели</AppText>
        <View style={styles.row}>
          {goalTypes.map((g) => (
            <ChoiceButton
              key={g.code}
              label={g.name}
              selected={type === g.code}
              onPress={() => setType(g.code)}
            />
          ))}
        </View>

        <AppText style={styles.label}>Целевой вес (кг)</AppText>
        <AppInput
          placeholder='Целевой вес'
          value={targetWeight}
          onChangeText={setTargetWeight}
          keyboardType='numeric'
        />

        <AppText style={styles.label}>Дата начала</AppText>
        <TouchableOpacity
          onPress={() => setStartPickerVisibility(true)}
          style={[styles.input, { justifyContent: 'center' }]}
        >
          <AppText>{startAt.toLocaleDateString('ru-RU')}</AppText>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isStartPickerVisible}
          mode='date'
          date={startAt}
          onConfirm={(d) => {
            setStartAt(d);
            setStartPickerVisibility(false);
          }}
          onCancel={() => setStartPickerVisibility(false)}
        />

        <AppText style={styles.label}>Дата окончания</AppText>
        <TouchableOpacity
          onPress={() => setEndPickerVisibility(true)}
          style={[styles.input, { justifyContent: 'center' }]}
        >
          <AppText>{endAt.toLocaleDateString('ru-RU')}</AppText>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isEndPickerVisible}
          mode='date'
          date={endAt}
          onConfirm={(d) => {
            setEndAt(d);
            setEndPickerVisibility(false);
          }}
          onCancel={() => setEndPickerVisibility(false)}
        />

        <AppButton title='Создать цель' onPress={handleSubmit} />
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

export default CreateGoalsScreen;

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
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: spacing.md,
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
