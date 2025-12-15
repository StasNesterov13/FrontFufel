export interface FoodIntakeDataAPI {
  intake_time: string;
  grams: number;
  recipe_id?: number;
  name?: string;
  calories?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
}

export interface MenuPlanDataAPI {
  start_date: string;
  end_date: string;
}
