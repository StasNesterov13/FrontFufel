import { createMenuPlan, deleteMenuPlan, getMenuPlan, replaceRecipe } from '@/api/menu_plans';
import AppButton from '@/components/AppButton';
import AppRow from '@/components/AppRow';
import AppText from '@/components/AppText';
import { AuthContext } from '@/context/AuthContext';
import { colors, spacing, typography } from '@/theme';
import { ScreenNavigationProp } from '@/types/navigation';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
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
  const { token } = useContext(AuthContext);
  const navigation = useNavigation<ScreenNavigationProp>();
  const [menuPlan, setMenuPlan] = useState<any>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMenuPlan = async () => {
      try {
        setLoading(true);
        const data = await getMenuPlan(token!, navigation);
        setMenuPlan(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuPlan();
  }, []);

  const handleCreatePlan = async () => {
    try {
      setCreating(true);
      await createMenuPlan(
        token!,
        {
          start_date: '2025-11-06',
          end_date: '2025-11-13',
        },
        navigation
      );
      const data = await getMenuPlan(token!, navigation);
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
      await deleteMenuPlan(token!, navigation);
      setMenuPlan(null);
    } catch (error) {
      console.log(error);
    } finally {
      setDeleting(false);
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

  const grouped: Record<string, any[]> = {};
  menuPlan?.menu_recipes?.forEach((item: any) => {
    const day = item.day_of_week;
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(item);
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
        const recipes = grouped[dayKey];

        return (
          <View style={styles.card} key={dayKey}>
            <AppText style={styles.subtitle}>{daysOfWeek[dayIndex]}</AppText>

            {recipes.map((r: any) => (
              <View key={r.recipe.id} style={styles.recipeBlock}>
                <AppText style={styles.recipeName}>{r.recipe.name}</AppText>
                <AppText style={styles.mealType}>Приём пищи: {r.meal_type}</AppText>

                <View style={styles.ingredientsBlock}>
                  <AppText style={styles.ingredientsTitle}>Ингредиенты:</AppText>
                  {r.recipe.ingredients?.map((ing: any) => (
                    <AppText key={ing.id} style={styles.ingredientItem}>
                      {ing.name} — {ing.quantity} {ing.unit}
                    </AppText>
                  ))}
                </View>

                <AppButton
                  title='Заменить рецепт'
                  onPress={async () => {
                    try {
                      const newRecipe = await replaceRecipe(token!, r.recipe.id, navigation);
                      setMenuPlan((prev: any) => {
                        const updated = { ...prev };
                        updated.menu_recipes = updated.menu_recipes.map((item: any) =>
                          item.recipe.id === r.recipe.id ? { ...item, recipe: newRecipe } : item
                        );
                        return updated;
                      });
                    } catch (error) {
                      console.log(error);
                    }
                  }}
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
  row: {
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: colors.text,
  },
  recipeBlock: {
    marginBottom: spacing.md,
  },
  recipeImage: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    marginBottom: spacing.sm,
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
