import { updateMeasurements } from '@/api/measurements';
import { toISODate } from '@/hooks/useDate';
import { colors, spacing } from '@/theme';
import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AppButton from './AppButton';
import AppInput from './AppInput';
import AppText from './AppText';

interface Props {
  visible: boolean;
  measurement: any;
  token: string | null;
  onClose: () => void;
  onUpdated: (data: any) => void;
}

const UpdateMeasurements = ({ visible, measurement, token, onClose, onUpdated }: Props) => {
  const [weight, setWeight] = useState<string>(String(measurement.weight));
  const [bodyfat, setBodyfat] = useState<string>(String(measurement.bodyfat));
  const [notes, setNotes] = useState<string>(measurement.notes);
  const [measuredAt, setMeasuredAt] = useState<Date>(new Date(measurement.measured_at));
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleSave = async () => {
    try {
      const result = await updateMeasurements(token, {
        measured_at: toISODate(measuredAt),
        weight: Number(weight),
        bodyfat: Number(bodyfat),
        notes,
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
          <AppText style={styles.title}>Изменить измерение</AppText>

          <AppText style={styles.label}>Дата</AppText>
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
            style={styles.input}
            placeholder='Вес'
            keyboardType='numeric'
            value={weight}
            onChangeText={setWeight}
          />

          <AppText style={styles.label}>Жир (%)</AppText>
          <AppInput
            style={styles.input}
            placeholder='Процент жира'
            keyboardType='numeric'
            value={bodyfat}
            onChangeText={setBodyfat}
          />

          <AppText style={styles.label}>Заметки</AppText>
          <AppInput
            style={[styles.input]}
            placeholder='Заметки'
            multiline
            value={notes}
            onChangeText={setNotes}
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

export default UpdateMeasurements;

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
  input: {
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
});
