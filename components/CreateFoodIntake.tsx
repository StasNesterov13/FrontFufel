import { createFoodIntake } from '@/api/food_intake';
import { calculateRecipeNutrition } from '@/api/recipes';
import { colors, spacing } from '@/theme';
import React, { useEffect, useRef, useState } from 'react';
import { Modal, StyleSheet, TextInput, View } from 'react-native';
import AppButton from './AppButton';
import AppText from './AppText';

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

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const fetchData = async () => {
      if (!foodIntakeId) return;

      try {
        const data = await calculateRecipeNutrition(token, foodIntakeId, {
          grams: nutrition.grams,
        });
        setNutrition(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [token, foodIntakeId]);

  const handleAdd = async () => {
    try {
      await createFoodIntake(token, {
        intake_time: new Date().toISOString(),
        name: nutrition.name,
        grams: nutrition.grams,
        calories: nutrition.calories,
        protein: nutrition.protein,
        fat: nutrition.fat,
        carbs: nutrition.carbs,
      });
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (field: keyof NutritionData, text: string) => {
    if (field === 'name') {
      setNutrition((prev) => ({ ...prev, name: text }));
    } else {
      const value = Number(text);
      setNutrition((prev) => ({ ...prev, [field]: value }));
    }
  };

  return (
    <Modal visible={visible} transparent animationType='slide'>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <AppText style={styles.label}>Название</AppText>
          <TextInput
            style={styles.input}
            value={nutrition.name}
            onChangeText={(text) => handleChange('name', text)}
          />

          <AppText style={styles.label}>Граммы</AppText>
          <TextInput
            style={styles.input}
            keyboardType='numeric'
            value={nutrition.grams.toString()}
            onChangeText={(text) => handleChange('grams', text)}
          />

          <AppText style={styles.label}>Калории</AppText>
          <TextInput
            style={styles.input}
            keyboardType='numeric'
            value={nutrition.calories.toString()}
            onChangeText={(text) => handleChange('calories', text)}
          />

          <AppText style={styles.label}>Белки</AppText>
          <TextInput
            style={styles.input}
            keyboardType='numeric'
            value={nutrition.protein.toString()}
            onChangeText={(text) => handleChange('protein', text)}
          />

          <AppText style={styles.label}>Жиры</AppText>
          <TextInput
            style={styles.input}
            keyboardType='numeric'
            value={nutrition.fat.toString()}
            onChangeText={(text) => handleChange('fat', text)}
          />

          <AppText style={styles.label}>Углеводы</AppText>
          <TextInput
            style={styles.input}
            keyboardType='numeric'
            value={nutrition.carbs.toString()}
            onChangeText={(text) => handleChange('carbs', text)}
          />

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
    width: '85%',
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    gap: spacing.md,
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
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
});
