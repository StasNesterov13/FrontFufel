import { createMenuPlan, deleteMenuPlan, getMenuPlan, updateMenuPlan } from '@/api/menu_plans';
import { getMealTypes } from '@/api/meta';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import WeekPicker from '@/components/AppWeekPicker';
import { useAuth } from '@/hooks/useAuth';
import { toISODate } from '@/hooks/useDate';
import { colors, spacing, typography } from '@/theme';
import { MenuPlanData, MenuRecipe } from '@/types/data';
import { endOfWeek, startOfWeek } from 'date-fns';
import { RotateCw } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const MenuScreen = () => {
  const { token } = useAuth();
  const [menuPlan, setMenuPlan] = useState<MenuPlanData | null>(null);
  const [creating, setCreating] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [mealTypes, setMealTypes] = useState<{ value: string; label: string }[]>([]);
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchData = async () => {
      const isOutOfRange =
        !menuPlan || toISODate(date) < menuPlan.start_date || toISODate(date) > menuPlan.end_date;

      if (isOutOfRange) {
        try {
          setMenuPlan(null);
          const data = await getMenuPlan(token, toISODate(date));
          setMenuPlan(data);
        } catch (error) {
          console.log(error);
        }
      }

      if (mealTypes.length === 0) {
        try {
          const data = await getMealTypes(token);
          setMealTypes(data);
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchData();
  }, [date]);

  const handleCreatePlan = async () => {
    try {
      setCreating(true);
      await createMenuPlan(token, {
        start_date: toISODate(startOfWeek(date, { weekStartsOn: 1 })),
        end_date: toISODate(endOfWeek(date, { weekStartsOn: 1 })),
      });
      const data = await getMenuPlan(token, toISODate(date));
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

  const handleReplaceRecipe = async (meal: MenuRecipe) => {
    try {
      if (!token) return;

      const updatedRecipe = await updateMenuPlan(token, meal.id);
      setMenuPlan((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          menu_recipes: prev.menu_recipes.map((m) =>
            m.id === meal.id ? { ...m, recipe: updatedRecipe } : m,
          ),
        };
      });
    } catch (err) {
      console.error(err);
    }
  };

  const getMealTypeLabel = (value: string) => mealTypes.find((m) => m.value === value)?.label;
  const mealOrder = { breakfast: 1, lunch: 2, dinner: 3 };

  const mealsForSelectedDate = (menuPlan?.menu_recipes ?? []).filter(
    (meal) => meal.date === toISODate(date),
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <WeekPicker
          onDayChange={(date) => {
            setDate(date);
          }}
        />
      </View>

      {!menuPlan ? (
        <>
          <AppButton
            title={creating ? 'Создание...' : 'Создать меню-план'}
            onPress={handleCreatePlan}
          />
        </>
      ) : (
        <>
          <View style={{ marginBottom: spacing.lg }}>
            {mealsForSelectedDate
              .sort(
                (a, b) =>
                  mealOrder[a.meal_type as keyof typeof mealOrder] -
                  mealOrder[b.meal_type as keyof typeof mealOrder],
              )
              .map((meal) => (
                <View key={meal.id} style={styles.recipeCard}>
                  <View style={styles.recipeHeader}>
                    <View style={{ flex: 1 }}>
                      <AppText style={styles.mealType}>{getMealTypeLabel(meal.meal_type)}</AppText>
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
                        • {ingredient.name} —{' '}
                        {+ingredient.quantity === 0
                          ? 'по вкусу'
                          : `${Math.round(+ingredient.quantity)} ${ingredient.unit}`}
                      </AppText>
                    ))}
                  </View>
                </View>
              ))}
          </View>
          <AppButton
            title={deleting ? 'Удаление...' : 'Удалить меню-план'}
            onPress={handleDeletePlan}
          />
        </>
      )}
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
