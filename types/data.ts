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
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: number;
  name: string;
  ingredients: Ingredient[];
}

export interface MenuItem {
  id: string;
  day_of_week: number;
  meal_type: string;
  recipe: Recipe;
}

export interface MenuPlanData {
  start_date: string;
  end_date: string;
  menu_recipes: MenuItem[];
}
