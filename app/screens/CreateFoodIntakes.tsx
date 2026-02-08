import AppText from '@/components/AppText';
import CreateFoodIntake from '@/components/CreateFoodIntake';
import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/theme';
import { MenuItem, MenuPlanData } from '@/types/data';
import { useAppNavigation, useAppRoute } from '@/types/navigation';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
const CreateFoodIntakesScreen = () => {
  const { token } = useAuth();
  const navigation = useAppNavigation();
  const route = useAppRoute();
  const [createFoodIntake, setCreateFoodIntake] = useState(false);
  const [foodIntakeId, setFoodIntakeId] = useState<number | null>();
  const [foodIntakeName, setFoodIntakeName] = useState<string>();
  const menuPlan: MenuPlanData = route.params!.data;

  const menuRecipes = menuPlan?.menu_recipes;

  const handleSelectFoodIntake = (foodIntakeId: number | null, foodIntakeName: string) => {
    setFoodIntakeId(foodIntakeId);
    setFoodIntakeName(foodIntakeName);
    setCreateFoodIntake(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AppText style={styles.backButtonText}>← Назад</AppText>
        </TouchableOpacity>
        <AppText style={styles.title}>Выберите рецепт</AppText>
      </View>

      {menuRecipes?.map((item: MenuItem, index) => (
        <View key={index}>
          <TouchableOpacity
            style={styles.recipeCard}
            activeOpacity={0.8}
            onPress={() => handleSelectFoodIntake(item.recipe.id, item.recipe.name)}
          >
            <AppText style={styles.recipeName}>{item.recipe.name}</AppText>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity
        style={[styles.recipeCard, { backgroundColor: '#f0f0f0' }]}
        activeOpacity={0.8}
        onPress={() => handleSelectFoodIntake(null, '')}
      >
        <AppText style={{ fontSize: 18, fontWeight: '600', color: colors.primary }}>
          + Добавить вручную
        </AppText>
      </TouchableOpacity>
      {createFoodIntake && (
        <CreateFoodIntake
          visible={createFoodIntake}
          foodIntakeId={foodIntakeId!}
          foodIntakeName={foodIntakeName!}
          onClose={() => setCreateFoodIntake(false)}
          token={token}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 48,
    gap: 12,
  },
  container: {
    paddingHorizontal: 32,
    paddingTop: 24,
    paddingBottom: 40,
    backgroundColor: colors.background,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    color: '#1a1a1a',
  },
  backButton: {
    marginBottom: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  recipeCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  recipeMacros: {
    fontSize: 14,
    color: '#777',
  },
});

export default CreateFoodIntakesScreen;
