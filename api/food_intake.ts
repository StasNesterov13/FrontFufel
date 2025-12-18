import { API_BASE_URL } from '@/constants/config';
export interface FoodIntakeData {
  intake_time: string;
  grams: number;
  recipe_id?: number;
  name?: string;
  calories?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
}
export const getFoodIntakes = async (token: string | null, target_date: string) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const response = await fetch(
    `${API_BASE_URL}/api/v1/food-intakes/?target_date=${target_date}&timezone=${timezone}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error, { cause: { status: response.status } });
  }

  return await response.json();
};

export const createFoodIntake = async (token: string | null, foodIntakeData: FoodIntakeData) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/food-intakes/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(foodIntakeData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error, { cause: { status: response.status } });
  }

  return await response.json();
};

export const updateFoodIntake = async (
  token: string | null,
  foodIntakeId: number,
  foodIntakeData: FoodIntakeData
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/food-intakes/?food_intake_id=${foodIntakeId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(foodIntakeData),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error, { cause: { status: response.status } });
  }

  return await response.json();
};

export const deleteFoodIntake = async (token: string | null, foodIntakeId: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/food-intakes/?food_intake_id=${foodIntakeId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error, { cause: { status: response.status } });
  }

  return true;
};
