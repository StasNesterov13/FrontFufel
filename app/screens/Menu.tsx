import { createMenuPlan, deleteMenuPlan, getMenuPlan } from '@/api/menu_plans';
import { getMealTypes } from '@/api/meta';
import AppButton from '@/components/AppButton';
import AppRow from '@/components/AppRow';
import AppText from '@/components/AppText';
import { useAuth } from '@/hooks/useAuth';
import { toISODate } from '@/hooks/useDate';
import { colors, spacing, typography } from '@/theme';
import { MenuPlanData, MenuRecipes } from '@/types/data';
import { RotateCw } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const MenuScreen = () => {
  const { token } = useAuth();
  const [menuPlan, setMenuPlan] = useState<MenuPlanData | null>(null);
  const [creating, setCreating] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [mealTypes, setMealTypes] = useState<{ value: string; label: string }[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isDatePickerStart, setDatePickerStart] = useState<boolean>(false);
  const [isDatePickerEnd, setDatePickerEnd] = useState<boolean>(false);

  useEffect(() => {
    const today = toISODate(new Date());
    const fetchData = async () => {
      try {
        const data = await getMenuPlan(token, today);
        setMenuPlan(data);
      } catch (error) {
        setMenuPlan(null);
        console.log(error);
      }
      try {
        const data = await getMealTypes(token);
        setMealTypes(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleCreatePlan = async () => {
    try {
      setCreating(true);
      await createMenuPlan(token, {
        start_date: toISODate(startDate),
        end_date: toISODate(endDate),
      });
      const data = await getMenuPlan(token, toISODate(new Date()));
      setMenuPlan(data);
    } catch (error) {
      console.log(error);
    } finally {
      setCreating(false);
    }
  };

  const handleDeletePlan = async () => {
    try {
      setDeleting(true);
      await deleteMenuPlan(token, menuPlan!.id);
      setMenuPlan(null);
    } catch (error) {
      console.log(error);
    } finally {
      setDeleting(false);
    }
  };

  const handleReplaceRecipe = async (meal: MenuRecipes) => {
    // Здесь можно открыть модальное окно выбора нового рецепта
    console.log('Заменить рецепт для', meal.id);
  };

  const getMealTypeLabel = (value: string) => mealTypes.find((m) => m.value === value)?.label;

  if (!menuPlan) {
    return (
      <View style={styles.loader}>
        <AppText style={styles.label}>Дата начала</AppText>
        <TouchableOpacity
          onPress={() => setDatePickerStart(true)}
          style={[styles.input, { justifyContent: 'center' }]}
        >
          <AppText>{startDate.toLocaleDateString('ru-RU')}</AppText>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerStart}
          mode='date'
          date={startDate}
          locale='ru_RU'
          onConfirm={(d) => {
            setStartDate(d);
            setDatePickerStart(false);
          }}
          onCancel={() => setDatePickerStart(false)}
        />
        <AppText style={styles.label}>Дата окончания</AppText>
        <TouchableOpacity
          onPress={() => setDatePickerEnd(true)}
          style={[styles.input, { justifyContent: 'center' }]}
        >
          <AppText>{endDate.toLocaleDateString('ru-RU')}</AppText>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerEnd}
          mode='date'
          date={endDate}
          locale='ru_RU'
          onConfirm={(d) => {
            setEndDate(d);
            setDatePickerEnd(false);
          }}
          onCancel={() => setDatePickerEnd(false)}
        />
        <AppButton
          title={creating ? 'Создание...' : 'Создать меню-план'}
          onPress={handleCreatePlan}
        />
      </View>
    );
  }

  // Группировка рецептов по дате
  const groupedByDate = menuPlan.menu_recipes.reduce((acc: any, meal: any) => {
    if (!acc[meal.date]) acc[meal.date] = [];
    acc[meal.date].push(meal);
    return acc;
  }, {});

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppText style={styles.title}>Мой меню-план</AppText>

      <View style={styles.card}>
        <AppRow
          label='Дата начала'
          value={new Date(menuPlan.start_date).toLocaleDateString('ru-RU')}
        />
        <AppRow
          label='Дата окончания'
          value={new Date(menuPlan.end_date).toLocaleDateString('ru-RU')}
        />
      </View>

      <View style={styles.card}>
        <AppText style={styles.subtitle}>Приемы пищи</AppText>

        {Object.entries(groupedByDate as Record<string, MenuRecipes[]>).map(([date, meals]) => (
          <View key={date} style={{ marginBottom: spacing.lg }}>
            <AppText style={styles.date}>{new Date(date).toLocaleDateString('ru-RU')}</AppText>

            {meals.map((meal) => (
              <View key={meal.id} style={styles.recipeCard}>
                <View style={styles.recipeHeader}>
                  <View style={{ flex: 1 }}>
                    <AppText style={styles.mealType}>
                      {getMealTypeLabel(meal.meal_type) ?? meal.meal_type}
                    </AppText>
                    <AppText style={styles.recipeName}>{meal.recipe.name}</AppText>
                  </View>
                  <TouchableOpacity
                    style={styles.replaceCircle}
                    onPress={() => handleReplaceRecipe(meal)}
                  >
                    <RotateCw color='#fff' size={18} />
                  </TouchableOpacity>
                </View>

                <View style={styles.ingredientsBlock}>
                  <AppText style={styles.ingredientsTitle}>Ингредиенты:</AppText>
                  {meal.recipe.ingredients.map((ingredient) => (
                    <AppText key={ingredient.id} style={styles.ingredientItem}>
                      • {ingredient.name} — {ingredient.quantity} {ingredient.unit}
                    </AppText>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>

      <AppButton
        title={deleting ? 'Удаление...' : 'Удалить меню-план'}
        onPress={handleDeletePlan}
      />
    </ScrollView>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  recipeCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  recipeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },

  replaceCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  mealType: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  recipeName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },

  ingredientsBlock: {
    marginTop: 4,
  },

  ingredientsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },

  ingredientItem: {
    fontSize: 14,
    color: colors.text,
  },
  mealRow: {
    flexDirection: 'row', // текст и кнопка в одной строке
    alignItems: 'center', // вертикальное выравнивание
    justifyContent: 'space-between', // текст слева, кнопка справа
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },

  mealInfo: {
    flex: 1, // текст занимает оставшееся место
    marginRight: 8, // отступ от кнопки
  },
  container: {
    flexGrow: 1,
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.title,
    marginBottom: spacing.lg,
  },
  subtitle: {
    ...typography.subtitle,
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
    width: '100%',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: spacing.xl,
  },
  recipeBlock: {
    marginBottom: spacing.md,
  },
  date: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  replaceButton: {
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
});
