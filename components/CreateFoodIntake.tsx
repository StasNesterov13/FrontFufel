import { colors, spacing } from '@/theme';
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, TextInput, View } from 'react-native';
import AppButton from './AppButton';
import AppText from './AppText';

interface Props {
  token: string | null;
  visible: boolean;
  foodIntakeId: string | null;
  onClose: () => void;
}
interface FoodIntakeData {
  intake_time: string;
  grams: number;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

const CreateFoodIntake = ({ token, visible, foodIntakeId, onClose }: Props) => {
  const [grams, setGrams] = useState('100');
  const [foodData, setFoodData] = useState<FoodIntakeData>();

  useEffect(() => {
    setFoodData({
      intake_time: new Date().toISOString(),
      grams: 100,
      name: `Рецепт ${foodIntakeId}`,
      calories: 200,
      protein: 10,
      fat: 5,
      carbs: 30,
    });

    setGrams('100');
  }, []);

  if (!foodData) return null;

  const factor = Number(grams) / foodData.grams;

  const handleSave = () => {
    const gramsNumber = Number(grams);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType='slide'>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <AppText style={styles.title}>{foodData.name}</AppText>

          <AppText style={styles.label}>Граммы</AppText>
          <TextInput
            style={styles.input}
            keyboardType='numeric'
            value={grams}
            onChangeText={setGrams}
          />

          <AppText>Калории: {Math.round(foodData.calories * factor)}</AppText>
          <AppText>Белки: {Math.round(foodData.protein * factor)} г</AppText>
          <AppText>Жиры: {Math.round(foodData.fat * factor)} г</AppText>
          <AppText>Углеводы: {Math.round(foodData.carbs * factor)} г</AppText>

          <AppButton title='Добавить' onPress={handleSave} />
          <View style={{ marginTop: 8 }}>
            <AppButton title='Отмена' onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CreateFoodIntake;

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
