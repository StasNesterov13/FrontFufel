import { API_BASE_URL } from '@/constants/config';
import { FoodIntakeDataAPI } from '@/types/dataAPI';
import { ScreenNavigationProp } from '@/types/navigation';

export const getFoodIntakes = async (
  token: string,
  navigation: ScreenNavigationProp,
  target_date: string
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
  navigation: ScreenNavigationProp,
  foodIntakeData: FoodIntakeDataAPI
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
  navigation: ScreenNavigationProp,
  foodIntakeId: number,
  foodIntakeData: FoodIntakeDataAPI
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
  navigation: ScreenNavigationProp,
  foodIntakeId: string
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
