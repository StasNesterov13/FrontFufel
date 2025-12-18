import { getDailyNorms, getDayProgress } from '@/api/daily_norms';
import { createFoodIntake, deleteFoodIntake, getFoodIntakes } from '@/api/food_intake';
import { getGoals } from '@/api/goals';
import { getLastMeasurement } from '@/api/measurements';
import { getMenuPlan } from '@/api/menu_plans';
import AppButton from '@/components/AppButton';
import AppInput from '@/components/AppInput';
import AppRow from '@/components/AppRow';
import AppText from '@/components/AppText';
import WeekPicker from '@/components/AppWeekPicker';
import LoadingView from '@/components/LoadingView';
import UpdateGoals from '@/components/UpdateGoals';
import UpdateMeasurements from '@/components/UpdateMeasurements';
import { useAuth } from '@/hooks/useAuth';
import { toISODate } from '@/hooks/useDate';
import { useAppNavigation } from '@/hooks/useNavigation';
import { colors, spacing } from '@/theme';
import {
  DailyNormsData,
  DayProgressData,
  FoodIntakeData,
  GoalData,
  MeasurementData,
  MenuPlanData,
} from '@/types/data';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
const HomeScreen = () => {
  const { token } = useAuth();
  const navigation = useAppNavigation();
  const goalTypes = [
    { label: 'Снижение веса', value: 'cut' },
    { label: 'Набор веса', value: 'bulk' },
    { label: 'Поддержание веса', value: 'maintain' },
  ];
  //const [goalTypes, setGoalTypes] = useState<{ label: string; value: string }[]>([]);
  const [measurement, setMeasurement] = useState<MeasurementData>();
  const [goal, setGoal] = useState<GoalData>();
  const [dayProgress, setDayProgress] = useState<DayProgressData>();
  const [dailyNorms, setDailyNorms] = useState<DailyNormsData>();
  const [menuPlan, setMenuPlan] = useState<MenuPlanData>();
  const [foodIntake, setFoodIntake] = useState<FoodIntakeData[]>([]);
  const [recipeId, setRecipeId] = useState<number | null>(null);
  const [updateMeasurment, setUpdateMeasurment] = useState(false);
  const [updateGoal, setUpdateGoal] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [grams, setGrams] = useState<string>('150');
  const [date, setDate] = useState<Date>(new Date());

  useFocusEffect(
    React.useCallback(() => {
      const fetchPlan = async () => {
        try {
          const data = await getMenuPlan(token);
          setMenuPlan(data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchPlan();
    }, [])
  );

  const fetchData = async () => {
    try {
      const data = await getLastMeasurement(token);
      setMeasurement(data);
    } catch (error: any) {
      if (error.cause.status === 400) {
        navigation.navigate('CreateMeasurements');
        return;
      }
      console.log(error);
    }
    try {
      const data = await getGoals(token);
      setGoal(data);
    } catch (error: any) {
      if (error.cause.status === 400) {
        navigation.navigate('CreateGoals');
        return;
      }
      console.log(error);
    }
    try {
      const data = await getDailyNorms(token);
      setDailyNorms(data);
    } catch (error) {
      console.log(error);
    }
    try {
      // твой API запрос
      // по умолчанию первый
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const fetchDaily = async (date: Date) => {
    const today = toISODate(date);
    try {
      const data = await getDayProgress(token, today);
      setDayProgress(data);
    } catch (error) {
      console.log(error);
    }

    try {
      const data = await getFoodIntakes(token, today);
      setFoodIntake(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDaily(date);
    fetchData();
  }, []);

  if (loading) return <LoadingView />;

  const handleAddFood = async () => {
    if (!recipeId) return;

    try {
      await createFoodIntake(token, {
        intake_time: date.toISOString(),
        recipe_id: recipeId,
        grams: Number(grams),
      });
    } catch (error) {
      console.log(error);
    }
    fetchDaily(date);
  };

  const handleDeleteFood = async (id: string) => {
    try {
      await deleteFoodIntake(token, id);
      setFoodIntake((prev) => prev.filter((item: FoodIntakeData) => item.id !== id));
      const data = await getDayProgress(token, toISODate(date));
      setDayProgress(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getGoalTypeLabel = (value: string) => goalTypes.find((g) => g.value === value)?.label ?? '';
  const menuRecipes = menuPlan?.menu_recipes;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <WeekPicker
          onDayChange={(date) => {
            setDate(date);
            fetchDaily(date);
          }}
        />
      </View>
      {dayProgress && dailyNorms && (
        <View style={styles.card}>
          <AppText style={styles.sectionTitle}>Питание за сегодня</AppText>

          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <CircularProgress
              value={Math.min(dayProgress.calories_progress, 100)}
              radius={80}
              duration={900}
              progressValueColor={colors.text}
              activeStrokeWidth={14}
              inActiveStrokeWidth={14}
              activeStrokeColor='#FF6B6B'
              inActiveStrokeColor='#E5E5E5'
              title='%'
              titleColor={colors.text}
              titleStyle={{ fontSize: 16, fontWeight: '600' }}
            />
            <AppText style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>
              {Math.round(dayProgress.consumed_calories)} / {dailyNorms.daily_calories}
            </AppText>
            <AppText style={{ marginTop: 10, fontSize: 15, color: colors.textSecondary }}>
              🔥 Калории
            </AppText>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
            {[
              {
                key: 'protein',
                label: '🥩 Белки',
                value: dayProgress.consumed_protein,
                norm: dailyNorms.daily_protein,
                color: '#4D96FF',
              },
              {
                key: 'fat',
                label: '🧈 Жиры',
                value: dayProgress.consumed_fat,
                norm: dailyNorms.daily_fat,
                color: '#FFD93D',
              },
              {
                key: 'carbs',
                label: '🍞 Углеводы',
                value: dayProgress.consumed_carbs,
                norm: dailyNorms.daily_carbs,
                color: '#6BCF63',
              },
            ].map((item) => (
              <View key={item.key} style={{ alignItems: 'center' }}>
                <CircularProgress
                  value={Math.min((item.value / item.norm) * 100, 100)}
                  radius={45}
                  duration={900}
                  progressValueColor={colors.text}
                  activeStrokeWidth={10}
                  inActiveStrokeWidth={10}
                  activeStrokeColor={item.color}
                  inActiveStrokeColor='#E5E5E5'
                  title='%'
                  titleColor={colors.text}
                  titleStyle={{ fontSize: 12 }}
                />
                <AppText style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>
                  {Math.round(item.value)}/{item.norm}
                </AppText>
                <AppText style={{ marginTop: 6, fontSize: 13 }}>{item.label}</AppText>
              </View>
            ))}
          </View>

          {menuRecipes && (
            <View style={{ marginTop: 20 }}>
              <AppText style={{ fontWeight: '600', marginBottom: 8 }}>Добавить блюдо</AppText>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 8,
                  overflow: 'hidden',
                  marginBottom: 10,
                }}
              >
                <Picker selectedValue={recipeId} onValueChange={setRecipeId}>
                  <Picker.Item label='Выберите рецепт' value={null} />
                  {menuRecipes.map((item: any) => (
                    <Picker.Item
                      key={item.recipe.id}
                      label={item.recipe.name}
                      value={item.recipe.id}
                    />
                  ))}
                </Picker>
              </View>
              <AppInput
                value={grams}
                onChangeText={setGrams}
                placeholder='Граммы'
                keyboardType='numeric'
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  marginBottom: 10,
                }}
              />
              <AppButton title='Добавить' onPress={handleAddFood} />
            </View>
          )}
        </View>
      )}

      {foodIntake && (
        <View style={{ marginTop: 20 }}>
          <AppText style={{ fontWeight: '600', marginBottom: 10 }}>Принято сегодня</AppText>
          {foodIntake.map((item: FoodIntakeData) => (
            <View
              key={item.id}
              style={{
                borderWidth: 1,
                borderColor: '#E5E5E5',
                borderRadius: 10,
                padding: 12,
                marginBottom: 10,
                backgroundColor: colors.white,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <AppText style={{ fontWeight: '600', fontSize: 15 }}>{item.name}</AppText>
                <TouchableOpacity onPress={() => handleDeleteFood(item.id)}>
                  <AppText style={{ fontSize: 16 }}>🗑️</AppText>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 4,
                }}
              >
                <AppText style={{ fontSize: 13, color: colors.textSecondary }}>
                  ⚖️ {item.grams} г ⏰{' '}
                  {new Date(item.intake_time).toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </AppText>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                <AppText style={{ fontSize: 13, color: colors.textPrimary }}>
                  🥩 {item.protein} г
                </AppText>
                <AppText style={{ fontSize: 13, color: colors.textPrimary }}>
                  🧈 {item.fat} г
                </AppText>
                <AppText style={{ fontSize: 13, color: colors.textPrimary }}>
                  🍞 {item.carbs} г
                </AppText>
                <AppText style={{ fontSize: 13, fontWeight: '600', color: colors.textPrimary }}>
                  🔥 {item.calories} ккал
                </AppText>
              </View>
            </View>
          ))}
        </View>
      )}

      {measurement && (
        <View style={styles.card}>
          <AppText style={styles.sectionTitle}>Измерения</AppText>
          <AppRow
            label='Дата'
            value={new Date(measurement.measured_at).toLocaleDateString('ru-RU')}
          />
          <AppRow label='Вес' value={`${measurement.weight} кг`} />
          <AppRow label='Жир' value={`${measurement.bodyfat}%`} />
          {measurement.notes && <AppRow label='Заметки' value={measurement.notes} />}
          <AppButton title='Изменить' onPress={() => setUpdateMeasurment(true)} />
        </View>
      )}

      {goal && (
        <View style={styles.card}>
          <AppText style={styles.sectionTitle}>Цели</AppText>
          <AppRow label='Тип цели' value={getGoalTypeLabel(goal.type)} />
          <AppRow label='Целевой вес' value={`${goal.target_weight} кг`} />
          <AppRow label='Начало' value={new Date(goal.start_at).toLocaleDateString('ru-RU')} />
          <AppRow label='Конец' value={new Date(goal.end_at).toLocaleDateString('ru-RU')} />
          <AppButton title='Изменить' onPress={() => setUpdateGoal(true)} />
        </View>
      )}

      {measurement && (
        <UpdateMeasurements
          visible={updateMeasurment}
          onClose={() => setUpdateMeasurment(false)}
          measurement={measurement}
          token={token}
          onUpdated={setMeasurement}
        />
      )}

      {goal && (
        <UpdateGoals
          visible={updateGoal}
          onClose={() => setUpdateGoal(false)}
          goal={goal}
          token={token}
          onUpdated={setGoal}
        />
      )}
    </ScrollView>
  );
};

export default HomeScreen;

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
    gap: spacing.lg,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: spacing.md },
  card: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    elevation: 3,
    gap: spacing.md,
  },
});
