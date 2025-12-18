import { createMenuPlan, deleteMenuPlan, getMenuPlan, updateMenuPlan } from '@/api/menu_plans';
import AppButton from '@/components/AppButton';
import AppRow from '@/components/AppRow';
import AppText from '@/components/AppText';
import { useAuth } from '@/hooks/useAuth';
import { useAppNavigation } from '@/hooks/useNavigation';
import { colors, spacing, typography } from '@/theme';
import { Ingredient, MenuItem, MenuPlanData } from '@/types/data';
import { ScreenNavigationProp } from '@/types/navigation';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

const daysOfWeek = [
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
  'Воскресенье',
];

const MenuScreen = () => {
  const { token } = useAuth();
  const navigation = useAppNavigation();
  const [menuPlan, setMenuPlan] = useState<MenuPlanData>();
  const [creating, setCreating] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    const fetchMenuPlan = async () => {
      try {
        const data = await getMenuPlan(token);
        setMenuPlan(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMenuPlan();
  }, []);

  const handleCreatePlan = async () => {
    try {
      setCreating(true);
      await createMenuPlan(token!, {
        start_date: '2025-11-06',
        end_date: '2025-11-13',
      });
      const data = await getMenuPlan(token);
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
      await deleteMenuPlan(token);
    } catch (error) {
      console.log(error);
    } finally {
      setDeleting(false);
    }
  };

  const handleReplaceRecipe = async (
    item: MenuItem,
    token: string,
    navigation: ScreenNavigationProp
  ) => {
    try {
      const newRecipe = await updateMenuPlan(token, item.recipe.id);
      setMenuPlan((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          menu_recipes: prev.menu_recipes.map((mi) =>
            mi.recipe.id === item.recipe.id ? { ...mi, recipe: newRecipe } : mi
          ),
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (!menuPlan) {
    return (
      <View style={styles.loader}>
        <AppButton
          title={creating ? 'Создание...' : 'Создать меню-план'}
          onPress={handleCreatePlan}
        />
      </View>
    );
  }

  const grouped: Record<number, MenuItem[]> = {};
  menuPlan.menu_recipes.forEach((item) => {
    if (!grouped[item.day_of_week]) grouped[item.day_of_week] = [];
    grouped[item.day_of_week].push(item);
  });

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

      {Object.keys(grouped).map((dayKey) => {
        const dayIndex = Number(dayKey) - 1;
        const recipes = grouped[Number(dayKey)];

        return (
          <View style={styles.card} key={dayKey}>
            <AppText style={styles.subtitle}>{daysOfWeek[dayIndex]}</AppText>

            {recipes.map((item: MenuItem) => (
              <View key={item.recipe.id} style={styles.recipeBlock}>
                <AppText style={styles.recipeName}>{item.recipe.name}</AppText>
                <AppText style={styles.mealType}>Приём пищи: {item.meal_type}</AppText>

                <View style={styles.ingredientsBlock}>
                  <AppText style={styles.ingredientsTitle}>Ингредиенты:</AppText>
                  {item.recipe.ingredients.map((ing: Ingredient) => (
                    <AppText key={ing.id} style={styles.ingredientItem}>
                      {ing.name} - {ing.quantity > 0 ? `${ing.quantity} ${ing.unit}` : 'по вкусу'}
                    </AppText>
                  ))}
                </View>

                <AppButton
                  title='Заменить рецепт'
                  onPress={() => handleReplaceRecipe(item, token!, navigation)}
                />
              </View>
            ))}
          </View>
        );
      })}

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
  recipeName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  mealType: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  ingredientsBlock: {
    marginTop: 4,
    marginLeft: spacing.md,
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
});
