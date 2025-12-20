import { updateGoals } from '@/api/goals';
import { toISODate } from '@/hooks/useDate';
import { colors, spacing } from '@/theme';
import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AppButton from './AppButton';
import AppInput from './AppInput';
import AppText from './AppText';
import ChoiceButton from './ChoiceButton';

interface Props {
  visible: boolean;
  goal: any;
  token: string | null;
  goalTypes: { code: string; name: string }[];
  onClose: () => void;
  onUpdated: (data: any) => void;
}

const UpdateGoals = ({ visible, goal, token, goalTypes, onClose, onUpdated }: Props) => {
  const [type, setType] = useState<string>('');
  const [targetWeight, setTargetWeight] = useState<string>(String(goal.target_weight));
  const [startAt, setStartAt] = useState<Date>(new Date(goal.start_at));
  const [endAt, setEndAt] = useState<Date>(new Date(goal.end_at));
  const [isStartPickerVisible, setStartPickerVisibility] = useState(false);
  const [isEndPickerVisible, setEndPickerVisibility] = useState(false);
  const handleSave = async () => {
    try {
      const result = await updateGoals(token, {
        type,
        target_weight: Number(targetWeight),
        start_at: toISODate(startAt),
        end_at: toISODate(endAt),
      });
      onUpdated(result);
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal visible={visible} transparent animationType='slide'>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <AppText style={styles.title}>Изменить цель</AppText>

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
            style={styles.input}
            placeholder='Целевой вес'
            keyboardType='numeric'
            value={targetWeight}
            onChangeText={setTargetWeight}
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

          <AppButton title='Сохранить' onPress={handleSave} />
          <View style={{ marginTop: 8 }}>
            <AppButton title='Отмена' onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UpdateGoals;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '85%',
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    gap: spacing.md,
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
