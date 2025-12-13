import { API_BASE_URL } from '@/constants/config';
import { ScreenNavigationProp } from '@/types/navigation';

interface FoodIntakeData {
  intake_time: string;
  grams: number;
  recipe_id?: number;
  name?: string;
  calories?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
}

export const getFoodIntakes = async (
  token: string,
  target_date: string,
  navigation: ScreenNavigationProp
) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const formData = new URLSearchParams();
  formData.append('target_date', target_date);
  formData.append('timezone', timezone);
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
    if (response.status === 401) {
      navigation.navigate('Login');
      return;
    }
    const error = await response.text();
    throw new Error(error, { cause: { status: response.status } });
  }

  return await response.json();
};

export const createFoodIntake = async (
  token: string,
  foodIntakeData: FoodIntakeData,
  navigation: ScreenNavigationProp
) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/food-intakes/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(foodIntakeData),
  });

  if (!response.ok) {
    if (response.status === 401) {
      navigation.navigate('Login');
      return;
    }
    const error = await response.text();
    throw new Error(error, { cause: { status: response.status } });
  }

  return await response.json();
};

export const updateFoodIntake = async (
  token: string,
  foodIntakeId: number,
  foodIntakeData: FoodIntakeData,
  navigation: ScreenNavigationProp
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
    if (response.status === 401) {
      navigation.navigate('Login');
      return;
    }
    const error = await response.text();
    throw new Error(error, { cause: { status: response.status } });
  }

  return await response.json();
};

export const deleteFoodIntake = async (
  token: string,
  foodIntakeId: number,
  navigation: ScreenNavigationProp
) => {
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
    if (response.status === 401) {
      navigation.navigate('Login');
      return;
    }
    const error = await response.text();
    throw new Error(error, { cause: { status: response.status } });
  }

  return true;
};
