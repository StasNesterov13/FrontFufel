import { createFoodIntake } from '@/api/food_intake';
import { calculateRecipeNutrition } from '@/api/recipes';
import { colors, spacing } from '@/theme';
import React, { useEffect, useRef, useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import AppButton from './AppButton';
import AppInput from './AppInput';
import AppText from './AppText';
import NumericInput from './NumericInput';

interface Props {
  token: string | null;
  visible: boolean;
  foodIntakeId: number | null;
  foodIntakeName: string;
  onClose: () => void;
}

interface NutritionData {
  name: string;
  grams: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

const CreateFoodIntake = ({ token, visible, foodIntakeId, foodIntakeName, onClose }: Props) => {
  const [nutrition, setNutrition] = useState<NutritionData>({
    name: foodIntakeName,
    grams: 0,
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  });

  const firstRender = useRef(true);

  // Автоматический пересчёт БЖУ при изменении грамм
  useEffect(() => {
    if (!foodIntakeId || !token) return;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const handler = setTimeout(async () => {
      try {
        const data = await calculateRecipeNutrition(token, foodIntakeId, {
          grams: nutrition.grams,
        });
        setNutrition((prev) => ({
          ...prev,
          calories: data.calories,
          protein: data.protein,
          fat: data.fat,
          carbs: data.carbs,
        }));
      } catch (error) {
        console.log(error);
      }
    }, 600);

    return () => clearTimeout(handler);
  }, [nutrition.grams, foodIntakeId, token]);

  const handleNumberChange = (field: keyof NutritionData, value: number) => {
    setNutrition((prev) => ({ ...prev, [field]: value }));
  };

  const handleNameChange = (text: string) => {
    setNutrition((prev) => ({ ...prev, name: text }));
  };

  const handleAdd = async () => {
    try {
      await createFoodIntake(token, {
        intake_time: new Date().toISOString(),
        ...nutrition,
      });
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal visible={visible} transparent animationType='slide'>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Название */}
          <AppText style={styles.label}>Название</AppText>
          <AppInput
            style={styles.input}
            value={nutrition.name}
            onChangeText={handleNameChange}
            placeholder='Введите название'
          />

          {/* Граммы и Калории */}
          <View style={styles.row}>
            <View style={styles.field}>
              <AppText style={styles.label}>Граммы</AppText>
              <NumericInput
                style={styles.input}
                value={Math.round(nutrition.grams)}
                onChange={(val) => handleNumberChange('grams', val)}
                placeholder='0'
              />
            </View>
            <View style={styles.field}>
              <AppText style={styles.label}>Калории</AppText>
              <NumericInput
                style={styles.input}
                value={Math.round(nutrition.calories)}
                onChange={(val) => handleNumberChange('calories', val)}
                placeholder='0'
              />
            </View>
          </View>

          {/* Белки, Жиры, Углеводы */}
          <View style={styles.row}>
            <View style={styles.field}>
              <AppText style={styles.label}>Белки</AppText>
              <NumericInput
                style={styles.input}
                value={Math.round(nutrition.protein)}
                onChange={(val) => handleNumberChange('protein', val)}
                placeholder='0'
              />
            </View>
            <View style={styles.field}>
              <AppText style={styles.label}>Жиры</AppText>
              <NumericInput
                style={styles.input}
                value={Math.round(nutrition.fat)}
                onChange={(val) => handleNumberChange('fat', val)}
                placeholder='0'
              />
            </View>
            <View style={styles.field}>
              <AppText style={styles.label}>Углеводы</AppText>
              <NumericInput
                style={styles.input}
                value={Math.round(nutrition.carbs)}
                onChange={(val) => handleNumberChange('carbs', val)}
                placeholder='0'
              />
            </View>
          </View>

          {/* Кнопки */}
          <AppButton title='Добавить' onPress={handleAdd} />
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
    width: '90%',
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  field: {
    flex: 1,
    marginRight: 8,
  },
});
