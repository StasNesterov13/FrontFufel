export interface FoodIntakeData {
  id: string;
  name: string;
  grams: number;
  intake_time: string;
  protein: number;
  fat: number;
  carbs: number;
  calories: number;
}

export interface GoalData {
  type: string;
  target_weight: number;
  start_at: string;
  end_at: string;
}

export interface MeasurementData {
  measured_at: string;
  weight: number;
  bodyfat: number;
  notes: string;
}

export interface Ingredient {
  id: number;
  name: string;
  calories: string;
  protein: string;
  fat: string;
  carbs: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: number;
  name: string;
  instruction: string;
  servings: number;
  calories: string;
  protein: string;
  fat: string;
  carbs: string;
  images_path: string;
  ingredients: Ingredient[];
  cooking_time: string;
}

export interface MenuRecipe {
  id: number;
  date: string;
  meal_type: string;
  recipe: Recipe;
}

export interface MenuPlanData {
  id: number;
  start_date: string;
  end_date: string;
  menu_recipes: MenuRecipe[];
}

export interface ProfileData {
  first_name: string;
  last_name: string;
  gender: string;
  birth_date: string;
  height: number;
  activity_level: string;
  diet_type: string;
}

export interface UserData {
  email: string;
  password: string;
}

export interface DayProgressData {
  date: string;
  calories_progress: number;
  consumed_calories: number;

  consumed_protein: number;
  consumed_fat: number;
  consumed_carbs: number;
}

export interface DailyNormsData {
  daily_calories: number;

  daily_protein: number;
  daily_fat: number;
  daily_carbs: number;
}
