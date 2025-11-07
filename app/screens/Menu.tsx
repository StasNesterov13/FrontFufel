import { createMenuPlan, deleteMenuPlan, getMenuPlan } from "@/api/menu_plans";
import AppButton from "@/components/AppButton";
import AppText from "@/components/AppText";
import { AuthContext } from "@/context/AuthContext";
import { colors, spacing, typography } from "@/theme";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const daysOfWeek = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
];

// 🔹 форматирование даты в дд.мм.гггг
const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const MenuScreen = () => {
  const { token } = useContext(AuthContext);
  const [menuPlan, setMenuPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 🔹 Получаем меню при загрузке
  useEffect(() => {
    if (!token) return;
    const fetchMenuPlan = async () => {
      try {
        setLoading(true);
        const data = await getMenuPlan(token);
        setMenuPlan(data);
      } catch (err) {
        console.log("Ошибка загрузки меню:", err);
        setMenuPlan(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuPlan();
  }, [token]);

  // 🔹 Создание нового плана
  const handleCreatePlan = async () => {
    try {
      setCreating(true);
      const newPlan = await createMenuPlan(token!, {
        start_date: "2025-11-06",
        end_date: "2025-11-13",
      });
      setMenuPlan(newPlan);
    } catch (err: any) {
      console.log("Ошибка при создании меню:", err);
    } finally {
      setCreating(false);
    }
  };

  // 🔹 Удаление плана
  const handleDeletePlan = async () => {
    if (!token) return;
    try {
      setDeleting(true);
      await deleteMenuPlan(token);
      setMenuPlan(null);
    } catch (err) {
      console.log("Ошибка при удалении меню:", err);
    } finally {
      setDeleting(false);
    }
  };

  // 🔹 Состояние загрузки
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // 🔹 Если плана нет
  if (!menuPlan) {
    return (
      <View style={styles.loader}>
        <AppButton
          title={creating ? "Создание..." : "Создать меню-план"}
          onPress={handleCreatePlan}
        />
      </View>
    );
  }

  // 🔹 Безопасное группирование рецептов по дням недели
  const grouped =
    Array.isArray(menuPlan?.menu_recipes) && menuPlan.menu_recipes.length > 0
      ? menuPlan.menu_recipes.reduce((acc: any, item: any) => {
          const day = item.day_of_week;
          if (!acc[day]) acc[day] = [];
          acc[day].push(item);
          return acc;
        }, {})
      : {};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppText style={styles.title}>Мой меню-план</AppText>

      <View style={styles.card}>
        <MenuRow label="Дата начала" value={formatDate(menuPlan.start_date)} />
        <MenuRow label="Дата окончания" value={formatDate(menuPlan.end_date)} />
      </View>

      {/* 🔹 Карточки по дням недели */}
      {Object.keys(grouped).length > 0 ? (
        Object.keys(grouped).map((dayKey) => {
          const dayIndex = parseInt(dayKey) - 1;
          const recipes = grouped[dayKey];
          return (
            <View style={styles.card} key={dayKey}>
              <AppText style={styles.subtitle}>
                {daysOfWeek[dayIndex] || `День ${dayKey}`}
              </AppText>

              {recipes.map((r: any) => (
                <View key={r.recipe.id} style={styles.recipeBlock}>
                  {/* 🔹 Фото блюда, если есть */}
                  {r.recipe.images_path ? (
                    <Image
                      source={{ uri: r.recipe.images_path }}
                      style={styles.recipeImage}
                      resizeMode="cover"
                    />
                  ) : null}

                  <AppText style={styles.recipeName}>{r.recipe.name}</AppText>
                  <AppText style={styles.mealType}>
                    Приём пищи: {r.meal_type}
                  </AppText>

                  {r.recipe.ingredients?.length > 0 && (
                    <View style={styles.ingredientsBlock}>
                      <AppText style={styles.ingredientsTitle}>
                        Ингредиенты:
                      </AppText>
                      {r.recipe.ingredients.map((ing: any) => (
                        <AppText key={ing.id} style={styles.ingredientItem}>
                          • {ing.name} — {ing.quantity} {ing.unit}
                        </AppText>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          );
        })
      ) : (
        <View style={styles.card}>
          <AppText>Рецепты не найдены</AppText>
        </View>
      )}

      <AppButton
        title={deleting ? "Удаление..." : "Удалить меню-план"}
        onPress={handleDeletePlan}
      />
    </ScrollView>
  );
};

// 🔹 Компонент строки (дата начала / окончания)
const MenuRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <AppText style={styles.label}>{label}</AppText>
    <AppText style={styles.value}>{value}</AppText>
  </View>
);

export default MenuScreen;

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    shadowColor: "#000",
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
    fontWeight: "600",
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
    width: "100%",
    height: 160,
    borderRadius: 10,
    marginBottom: spacing.sm,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: "600",
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
    fontWeight: "600",
    marginBottom: 4,
  },
  ingredientItem: {
    fontSize: 14,
    color: colors.text,
  },
});
