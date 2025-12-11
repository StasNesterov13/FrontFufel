import { getDailyNorms, getDailyProgress } from "@/api/daily_norms"
import { createFoodIntake, getFoodIntakes } from "@/api/food_intake"
import { getGoals } from "@/api/goals"
import { getLastMeasurements } from "@/api/measurements"
import { getMenuPlan } from "@/api/menu_plans"
import AppButton from "@/components/AppButton"
import AppInput from "@/components/AppInput"
import AppRow from "@/components/AppRow"
import AppText from "@/components/AppText"
import LoadingView from "@/components/LoadingView"
import UpdateGoals from "@/components/UpdateGoals"
import UpdateMeasurements from "@/components/UpdateMeasurements"
import { AuthContext } from "@/context/AuthContext"
import { colors, spacing } from "@/theme"
import { ScreenNavigationProp } from "@/types/navigation"
import { Picker } from "@react-native-picker/picker"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import React, { useContext, useState } from "react"
import { LogBox, ScrollView, StyleSheet, View } from "react-native"
import CircularProgress from "react-native-circular-progress-indicator"

LogBox.ignoreLogs([
  'createAnimatedPropAdapter', // точное ключевое слово
])

const HomeScreen = () => {
  const { token } = useContext(AuthContext)
  const navigation = useNavigation<ScreenNavigationProp>()

  const [measurement, setMeasurement] = useState<any>(null)
  const [goal, setGoal] = useState<any>(null)
  const [dailyProgress, setDailyProgress] = useState<any>(null)
  const [dailyNorms, setDailyNorms] = useState<any>(null)
  const [menuPlan, setMenuPlan] = useState<any>(null)
  const [foodIntake, setFoodIntake] = useState<any>(null)
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null)
  const [updateMeasurment, setUpdateMeasurment] = useState(false)
  const [updateGoal, setUpdateGoal] = useState(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [grams, setGrams] = useState<string>("150")

  useFocusEffect(
    React.useCallback(() => {const fetchData = async () => {
      try {
        const measurements = await getLastMeasurements(token!, navigation)
        setMeasurement(measurements)
      } catch (error: any) {
        if (error.cause.status === 400) {
          navigation.navigate("CreateMeasurements")
          return
        }
        console.log(error)
      }

      try {
        const goals = await getGoals(token!, navigation)
        setGoal(goals)
      } catch (error: any) {
        if (error.cause.status === 400) {
          navigation.navigate("CreateGoals")
          return
        }
        console.log(error)
      }

      try {
        const progress = await getDailyProgress(
          token!,
          new Date().toISOString().split("T")[0],
          navigation
        )
        setDailyProgress(progress)
      } catch (error) {
        console.log(error)
      }

      try {
        const norms = await getDailyNorms(token!, navigation)
        setDailyNorms(norms)
      } catch (error) {
        console.log(error)
      }
      try {
        const menu = await getMenuPlan(token!, navigation)
        setMenuPlan(menu)
      } catch (error) {
        console.log(error)
      }
      try {
        const food = await getFoodIntakes(token!, new Date().toISOString().split("T")[0], navigation)
        setFoodIntake(food)
      } catch (error) {
        console.log(error)
      }
      setLoading(false)
    }

    fetchData()
  }, []))

  if (loading) return <LoadingView/>

  const handleAddFood = async () => {
    if (!selectedRecipeId) {
      return
    }
    try {
      console.log(selectedRecipeId)
      await createFoodIntake(token!, { intake_time: new Date().toISOString(), recipe_id: selectedRecipeId, grams: Number(grams) }, navigation)
      const progress = await getDailyProgress(
        token!,
        new Date().toISOString().split("T")[0],
        navigation
      )
      setDailyProgress(progress)
    } catch (error) {
      console.log(error)
    }
  }

  const recipeOptions = menuPlan?.menu_recipes ?? []

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {dailyProgress && dailyNorms ? (
        <View style={styles.card}>
          <AppText style={styles.sectionTitle}>Питание за сегодня</AppText>

          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <CircularProgress
              value={Math.min(dailyProgress.calories_progress)}
              radius={80}
              duration={900}
              progressValueColor={colors.text}
              activeStrokeWidth={14}
              inActiveStrokeWidth={14}
              activeStrokeColor={colors.primary}
              inActiveStrokeColor="#E5E5E5"
              title={"%"}
              titleColor={colors.text}
              titleStyle={{ fontSize: 16, fontWeight: "600" }}
            />
            <AppText style={{ fontSize: 20, fontWeight: "700", color: colors.text }}>
              {dailyProgress.consumed_calories} / {dailyNorms.daily_calories}
            </AppText>
            <AppText style={{ marginTop: 10, fontSize: 15, color: colors.textSecondary }}>
              Калории
            </AppText>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 10 }}>
            <View style={{ alignItems: "center" }}>
              <CircularProgress
                value={dailyProgress.protein_progress}
                radius={45}
                duration={900}
                progressValueColor={colors.text}
                activeStrokeWidth={10}
                inActiveStrokeWidth={10}
                activeStrokeColor={colors.primary}
                inActiveStrokeColor="#E5E5E5"
                title={"%"}
                titleColor={colors.text}
                titleStyle={{ fontSize: 12 }}
              />
              <AppText style={{ fontSize: 20, fontWeight: "700", color: colors.text }}>
                {dailyProgress.consumed_protein}/{dailyNorms.daily_protein}
              </AppText>
              <AppText style={{ marginTop: 6, fontSize: 13 }}>Белки</AppText>
            </View>

            <View style={{ alignItems: "center" }}>
              <CircularProgress
                value={dailyProgress.fat_progress}
                radius={45}
                duration={900}
                progressValueColor={colors.text}
                activeStrokeWidth={10}
                inActiveStrokeWidth={10}
                activeStrokeColor={colors.primary}
                inActiveStrokeColor="#E5E5E5"
                title={"%"}
                titleColor={colors.text}
                titleStyle={{ fontSize: 12 }}
              />
              <AppText style={{ fontSize: 20, fontWeight: "700", color: colors.text }}>
                {dailyProgress.consumed_fat}/{dailyNorms.daily_fat}
              </AppText>
              <AppText style={{ marginTop: 6, fontSize: 13 }}>Жиры</AppText>
            </View>

            <View style={{ alignItems: "center" }}>
              <CircularProgress
                value={dailyProgress.carbs_progress}
                radius={45}
                duration={900}
                progressValueColor={colors.text}
                activeStrokeWidth={10}
                inActiveStrokeWidth={10}
                activeStrokeColor={colors.primary}
                inActiveStrokeColor="#E5E5E5"
                title={"%"}
                titleColor={colors.text}
                titleStyle={{ fontSize: 12 }}
              />
              <AppText style={{ fontSize: 20, fontWeight: "700", color: colors.text }}>
                {dailyProgress.consumed_carbs}/{dailyNorms.daily_carbs}
              </AppText>
              <AppText style={{ marginTop: 6, fontSize: 13 }}>Углеводы</AppText>
            </View>
          </View>

          {recipeOptions.length > 0 && (
            <View style={{ marginTop: 20 }}>
              <AppText style={{ fontWeight: "600", marginBottom: 8 }}>Добавить блюдо</AppText>
              <View style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, overflow: "hidden", marginBottom: 10 }}>
                <Picker
                  selectedValue={selectedRecipeId}
                  onValueChange={(itemValue) => setSelectedRecipeId(itemValue)}
                >
                  <Picker.Item label="Выберите рецепт" value={null} />
                  {recipeOptions.map((item: any) => (
                    <Picker.Item key={item.recipe.id} label={item.recipe.name} value={item.recipe.id} />
                  ))}
                </Picker>
              </View>
              <AppInput
                value={grams}
                onChangeText={setGrams}
                placeholder="Граммы"
                keyboardType="numeric"
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  marginBottom: 10,
                }}
              />
              <AppButton title="Добавить" onPress={handleAddFood} />
            </View>
          )}
        </View>
      ) : null}

      {measurement && (
        <View style={styles.card}>
          <AppText style={styles.sectionTitle}>Измерения</AppText>
          <AppRow label="Дата" value={new Date(measurement.measured_at).toLocaleDateString("ru-RU")} />
          <AppRow label="Вес" value={`${measurement.weight} кг`} />
          <AppRow label="Жир" value={`${measurement.bodyfat}%`} />
          {measurement.notes && <AppRow label="Заметки" value={measurement.notes} />}
          <AppButton title="Изменить" onPress={() => setUpdateMeasurment(true)} />
        </View>
      )}

      {goal && (
        <View style={styles.card}>
          <AppText style={styles.sectionTitle}>Цели</AppText>
          <AppRow label="Тип цели" value={translateGoal(goal.type)} />
          <AppRow label="Целевой вес" value={`${goal.target_weight} кг`} />
          <AppRow label="Начало" value={new Date(goal.start_at).toLocaleDateString("ru-RU")} />
          <AppRow label="Конец" value={new Date(goal.end_at).toLocaleDateString("ru-RU")} />
          <AppButton title="Изменить" onPress={() => setUpdateGoal(true)} />
        </View>
      )}

      {measurement && <UpdateMeasurements visible={updateMeasurment} onClose={() => setUpdateMeasurment(false)} measurement={measurement} token={token!} onUpdated={(updated) => setMeasurement(updated)} />}
      {goal && <UpdateGoals visible={updateGoal} onClose={() => setUpdateGoal(false)} goal={goal} token={token!} onUpdated={(updated) => setGoal(updated)} />}
    </ScrollView>
  )
}

export default HomeScreen

const translateGoal = (type: string) => {
  const map: Record<string, string> = {
    cut: "Снижение веса",
    bulk: "Набор веса",
    maintain: "Поддержание веса",
  }
  return map[type]
}

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
    gap: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    elevation: 3,
    gap: spacing.md,
  },
})
